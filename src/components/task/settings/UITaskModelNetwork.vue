<script setup lang="ts">
// 神经网络配置页面
import { nextTick, onMounted, watch, inject, computed, ComputedRef } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useQuasar } from "quasar";
import { EditorState, EditorView, basicSetup } from "@codemirror/basic-setup";
import { StreamLanguage } from "@codemirror/stream-parser";
// import { python } from "@codemirror/legacy-modes/mode/python";
import { keymap } from "@codemirror/view";
import { indentWithTab } from "@codemirror/commands";
import { tags, HighlightStyle } from "@codemirror/highlight";
import { useStorage, Network, Layer, ModelTemplate } from "~/storage";
import { deepCopy } from "utils";
import useCodeMirror from "~/utils/useCodemirror";
const router = useRouter();
const storage = useStorage();
const $q = useQuasar();
// 如果没有任务打开就回退到启动页
if (!storage.isTaskOpen) {
  router.push("/welcome");
}
const route = useRoute();
const cT = storage.currentTask;
function getSmartModelName(modelId: string) {
  let obj = cT.smartModel.find((item) => item.id == modelId);
  if (obj) return obj.displayName;
  else return "";
}
function getSimModelName(id: string) {
  let obj = cT.scenario.entities.find((item) => item.id == id);
  if (obj) return obj.displayName;
  else return "";
}
// 确保storage.model及其下的d在打开此页面后不会被替换，因此可以直接引用
// const m = computed(() => {
//   let find = storage.currentTask.model.find((item) => {
//     return item.modelID == storage.currentTask.smartModel[modelIndex].id;
//   });
//   return find;
// }) as ComputedRef<typeof storage.currentTask.model[number]>;
// console.log(m.value, "mddddd");

// const d = m.value.metadata;
const algorithModelList = ["DQN", "DoubleDQN", "DDPG", "mDDPG", "A3C", "PPO"]; //强化学习算法模型
const initializationList = [
  "heUniform",
  "heNormal",
  "glorotNormal",
  "GlorotUniform",
  "constant",
  "ones",
  "orthogonal",
  "randomUniform",
  "truncateNormal",
  "zeros",
]; //权重初始化方法
const lossList = [
  " MeanAbsoluteError",
  "MeanAbsolutePercentageError",
  "MeanSquaredError",
  "MeanSquaredLogarithmicError",
  "CategoricalCrossentropy",
  "SparseCategoricalCrossentropy",
  "BinaryCrossentropy",
  "Hinge",
  "CategoricalHinge",
  "Poisson",
  "SquaredHinge",
  "LogCosh",
  "KLDivergence",
  "Hube",
]; //loss函数
const earlyStopList = ["baseOnLoss", "baseOnProgress", "baseOnError", "none"]; //早停条件
const optimizerList = ["RMSprop", "Nadam", "SGD", "Ftrl", "Adam", "Adamax", "Adagrad", "Adadelta"]; //优化器
const layerTypeList = ["input", "affine", "output"]; //层类型
const layerActivationList = [
  "elu",
  "exponential",
  "gelu",
  "get",
  "hard_sigmoid",
  "linear",
  "relu",
  "selu",
  "serialize",
  "sigmoid",
  "softmax",
  "softplus",
  "softsign",
  "swish",
  "tanh",
]; //激活函数
const layerAppendixTypeList = ["dropout", "normalbatch", "ic", "none"];
const learningRateEditorList = [] as EditorView[];
const earlyStopEditorList = [] as EditorView[];
const rewardEditorList = [] as EditorView[];

// watch(
//   // 监听d.structure是因为选择了已有模型的话，会触发
//   () => [d.structure, d.structure.length],
//   ([newArray], [newLength]) => {
//     if (newArray || newLength > 0) {
//       learningRateEditorList.forEach((editorItem) => {
//         editorItem.destroy();
//       });
//       earlyStopEditorList.forEach((editorItem) => {
//         editorItem.destroy();
//       });
//       nextTick(() => {
//         d.structure.forEach((val, idx) => {
//           initEditors(val, idx);
//         });
//       });
//     }
//   }
// );
//切换模型函数
function changeNNtype(model: ModelTemplate) {
  let d = model.metadata;
  model.name = `${d.NNtype}示例模型`;
  d.structure = []; //每次切换模型，先将structure清空，然后根据选择的模型，添加对应的数量的网络
  const structureObj = storage.modelTemplate.metadata.structure[0];
  if (d.NNtype == "DDPG") {
    //DDPG默认两个网络
    const s1 = deepCopy(structureObj);
    const s2 = deepCopy(s1);
    d.structure.push(s1, s2);
  } else if (d.NNtype == "DQN") {
    const s1 = deepCopy(structureObj);
    d.structure.push(s1);
  }
  setConstraints(model); //设置约束
}
// 设置约束函数
function setConstraints(model: ModelTemplate) {
  let d = model.metadata;
  let NNtype = d.NNtype;
  if (NNtype == "DDPG") {
    //给DDPG设置网络超参数的约束
    // 给网络做约束
    d.structure.forEach((structureItem, index) => {
      console.log(index);
      if (index == 0) {
        structureItem.layers.forEach((item) => {
          if (item.layerType === "input") {
            //  表示输入层
            item.neutralAmount = model.statusDimension; //第一个网络层级结构的Input层的神经元数目等于输入维度
          }
          if (item.layerType === "output") {
            item.neutralAmount = model.actionDimension; //第一个网络层级结构的output层的神经元数目等于输出维度
            item.activator = "tanh"; //第一个网络层级结构的output层的激活函数是tanh
          }
        });
      } else if (index == 1) {
        structureItem.layers.forEach((item) => {
          if (item.layerType === "input") {
            //  表示输入层
            item.neutralAmount = model.statusDimension + model.actionDimension; //第二个网络层级结构的Input层的神经元数目等于输入维度+输出维度
          }
          if (item.layerType === "output") {
            item.neutralAmount = 1; //第二个网络层级结构的output层的神经元数目等于1
          }
        });
      }
      console.log(structureItem);
    });
  } else if (NNtype == "DQN") {
    d.structure[0].layers.forEach((item) => {
      if (item.layerType == "input") {
        item.neutralAmount = model.statusDimension;
      }
      if (item.layerType == "output") {
        item.neutralAmount = model.actionDimension;
      }
    });
  }
}
//设置激活函数的禁用条件
function getActivatorDisable(NNtype: string, item: Layer, structureIndex: number) {
  if (NNtype == "DDPG" && structureIndex == 0 && item.layerType == "output") {
    //如果是DDPG模型的第一个网络的output层，其激活函数固定为tanh
    return true;
  } else {
    return false;
  }
}
//设置神经元数目的禁用条件
function getneutralAmountDisable(d: ModelTemplate["metadata"], item: Layer, structureIndex: number) {
  if (
    (d.NNtype == "DDPG" || d.NNtype == "DQN") &&
    (structureIndex == 0 || structureIndex == d.structure.length - 1) &&
    (item.layerType == "input" || item.layerType == "output")
  ) {
    return true;
  } else {
    false;
  }
}

const { creatCodeMirror } = useCodeMirror();
// 初始化编辑器
function initEditors() {
  // 先初始化奖励函数
  cT.model.forEach((item) => {
    let editor = creatCodeMirror(`reward_${item.modelID}`, item.metadata.reward, (content: string) => {
      item.metadata.reward = content;
    });
    rewardEditorList.push(editor);
    item.metadata.structure.forEach((structure, structureIndex) => {
      // 初始化自定义学习率代码
      let editor1 = creatCodeMirror(
        `learn_${item.modelID}_${structureIndex}`,
        structure.learningRateDecay,
        (content: string) => {
          structure.learningRateDecay = content;
        }
      );
      learningRateEditorList.push(editor1);
      // 自定义早停条件代码
      let editor2 = creatCodeMirror(
        `stop_${item.modelID}_${structureIndex}`,
        structure.earlyStopFunction,
        (content: string) => {
          structure.earlyStopFunction = content;
        }
      );
      earlyStopEditorList.push(editor2);
    });
  });
}

// 添加网络
function addNetwork(d: ModelTemplate["metadata"]) {
  if (d.NNtype == "DDPG") {
    //如果是DDPG的话，已经默认约束两个网络，不能再增加网络了，提示用户，并直接返回，不往下执行
    $q.notify({
      type: "warn",
      message: "DDPG模型只有两个网络",
      timeout: 2000,
    });
    return;
  } else if (d.NNtype == "DQN") {
    $q.notify({
      type: "warn",
      message: "DQN模型只有一个网络",
      timeout: 2000,
    });
    return;
  }
  const tempNetworkObj = {} as Network;
  tempNetworkObj.layers = [
    {
      layerType: "input",
      neutralAmount: 1,
      activator: "none",
      appendixType: "none",
      appendixParam: 0,
    },
    {
      layerType: "output",
      neutralAmount: 1,
      activator: "relue",
      appendixType: "none",
      appendixParam: 0,
    },
  ];
  d.structure.push(tempNetworkObj);
}
// 删除网络
function delNetwork(index: number) {
  if (d.NNtype == "DDPG") {
    $q.notify({
      type: "warn",
      message: "DDPG模型必须要有两个网络",
      timeout: 2000,
    });
    return;
  } else if (d.NNtype == "DQN") {
    $q.notify({
      type: "warn",
      message: "DQN模型必须要有一个网络",
      timeout: 2000,
    });
    return;
  }
  d.structure.splice(index, 1);
}
// 添加层级
function addLayer(d:ModelTemplate["metadata"],structureIndex: number) {
  console.log(d.structure);
  let tempLayerObj = {} as Layer;
  let index = d.structure[structureIndex].layers.length - 1;
  console.log(index);
  if (index == -1) {
    d.structure[structureIndex].layers.push(tempLayerObj);
  } else {
    d.structure[structureIndex].layers.splice(index, 0, tempLayerObj);
  }
}
// 删除某一层级
function delLayer(d:ModelTemplate["metadata"],structureIndex: number, index: number) {
  if (index == 0 || index == d.structure[structureIndex].layers.length - 1) {
    return;
  }
  if (d.structure[structureIndex].layers.length == 3) {
    $q.notify({
      type: "warn",
      message: "至少要有3层层级结构",
      timeout: 2000,
    });
    return;
  }
  d.structure[structureIndex].layers.splice(index, 1);
}

// 向下移动层级
function downMoveLayer(d:ModelTemplate["metadata"],structureIndex: number, index: number) {
  console.log(index);
  if (index == 0) {
    return;
  }
  if (index < d.structure[structureIndex].layers.length - 2) {
    const tempObj = d.structure[structureIndex].layers[index];
    d.structure[structureIndex].layers[index] = d.structure[structureIndex].layers[index + 1];
    d.structure[structureIndex].layers[index + 1] = tempObj;
  }
}
// 向上移动层级
function upMoveLayer(d:ModelTemplate["metadata"],structureIndex: number, index: number) {
  console.log(index);
  if (index == d.structure[structureIndex].layers.length - 1) {
    return;
  }
  if (index > 1) {
    const tempObj = d.structure[structureIndex].layers[index];
    d.structure[structureIndex].layers[index] = d.structure[structureIndex].layers[index - 1];
    d.structure[structureIndex].layers[index - 1] = tempObj;
  }
}
function selectModel() {
  router.push({
    name: "model-select",
    params: {
      modelIndex: modelIndex,
    },
  });
}
//(d.NNtype); //一进先要调用一下这个函数，防止用户在任务基本信息页面或者是数据转换页面改变了输入维度和输出维度，那么与输入/出维度相关的神经元数目也要改变
//当页面渲染好后，添加codemirror的python编辑器
onMounted(() => {
  initEditors();
});
</script>
<template>
  <div class="q-pa-md">
    <!-- <q-btn class="q-mx-auto ui-wel-btn-add" @click="selectModel">选择已有模型</q-btn> -->
    <div v-for="(m, index) in cT.model" :key="index" class="ui-model-border">
      <p>{{ getSmartModelName(m.modelID) }}</p>
      <!-- <div class="ui-sub-header">模型类型</div> -->
      <q-expansion-item label="模型类型" class="bg-primary ui-data-expansion" heade-class="ui-data-expansion-header">
        <q-list separator class="ui-info-list">
          <q-item v-for="item in m.simModel" :key="item.id" v-ripple tag="label" class="ui-data-item">
            <q-item-section>
              <q-item-label>{{ getSimModelName(item.id) }}</q-item-label>
            </q-item-section>
            <!-- <q-item-section avatar>
              <q-checkbox v-model="currentEntitys" :val="entity" color="cyan" :disable="disableMultOption(entity.modelID)" />
            </q-item-section> -->
          </q-item>
        </q-list>
      </q-expansion-item>
      <div class="ui-data-expansion">
        <div class="row">
          <div class="col-7">强化学习算法模型</div>
          <div class="col-5">
            <q-select
              v-model="m.metadata.NNtype"
              :options="algorithModelList"
              standout
              color="white"
              options-dense
              popup-content-class="ui-select-popup"
              class="ui-model-input"
              @update:model-value="changeNNtype(m)"
            />
          </div>
        </div>
        <div class="row">
          <div class="col-7">模型名称</div>
          <div class="col-5">
            <q-input v-model="m.name" bg-color="#2D2A2A" standout class="ui-model-input"> </q-input>
          </div>
        </div>
        <div class="row ui-noborderbottom">
          <div class="col-7">模型版本</div>
          <div class="col-5">
            <q-input v-model="m.version" bg-color="#2D2A2A" standout class="ui-model-input"> </q-input>
          </div>
        </div>
      </div>
      <q-expansion-item label="奖励函数" header-style="backgroundColor:var(--q-primary)">
        <div class="row ui-noborderbottom" style="margin-top: 4px">
          <div :id="`reward_${m.modelID}`" class="col" style="height: auto !important; min-height: 50px"></div>
        </div>
      </q-expansion-item>
      <div class="ui-sub-header">网络超参数</div>
      <q-expansion-item
        label="网络层级"
        header-style="background-color: var(--q-primary);margin-bottom:4px;height:50px"
        class="ui-data-expansion"
      >
        <q-expansion-item
          v-for="(structureItem, structureIndex) in m.metadata.structure"
          :key="structureIndex"
          class="ui-item-header"
          header-style="background-color: var(--q-primary);padding-left:15px;padding-right:40px;margin-bottom:4px"
          style="margin-bottom: 8px"
        >
          <template #header>
            <q-item-section class="expansion-header"> 第{{ structureIndex + 1 }}个网络 </q-item-section>
            <q-item-section class="expansion-header" side @click="delNetwork(structureIndex)">
              <q-icon name="delete" size="xs" class="material-icons-outlined cursor-pointer" />
            </q-item-section>
          </template>
          <div class="row">
            <div class="col-7">权重初始化方法</div>
            <div class="col-5">
              <q-select
                v-model="structureItem.initialization"
                standout
                :options="initializationList"
                color="white"
                options-dense
                popup-content-class="ui-select-popup"
                class="ui-model-input"
              />
            </div>
          </div>
          <div class="row ui-noborderbottom" style="margin-bottom: 8px">
            <div class="col-7">Loss 函数</div>
            <div class="col-5">
              <q-select
                v-model="structureItem.loss"
                standout
                :options="lossList"
                color="white"
                options-dense
                popup-content-class="ui-select-popup"
                class="ui-model-input"
              />
            </div>
          </div>
          <div class="row">
            <div class="col-7">优化器</div>
            <div class="col-5">
              <q-select
                v-model="structureItem.optimizer"
                standout
                :options="optimizerList"
                color="white"
                options-dense
                popup-content-class="ui-select-popup"
                class="ui-model-input"
              />
            </div>
          </div>
          <div class="row">
            <div class="col-7">学习率</div>
            <div class="col-5">
              <q-input
                v-model.number="structureItem.learningRate"
                type="number"
                color="white"
                standout
                class="ui-model-input"
                max="1"
                min="0"
                step="0.1"
              />
            </div>
          </div>
          <q-expansion-item
            label="自定义学习率代码"
            header-style="backgroundColor:var(--q-primary);padding-left:30px;padding-right:40px;"
          >
            <div class="row ui-noborderbottom" style="margin-top: 4px">
              <div
                :id="`learn_${m.modelID}_${structureIndex}`"
                style="height: auto !important; min-height: 50px"
                class="col"
              ></div>
            </div>
          </q-expansion-item>
          <div class="row" style="margin-top: 8px">
            <div class="col-7">早停条件</div>
            <div class="col-5">
              <q-select
                v-model="structureItem.earlyStop"
                standout
                :options="earlyStopList"
                color="white"
                options-dense
                popup-content-class="ui-select-popup"
                class="ui-model-input"
              />
            </div>
          </div>
          <q-expansion-item
            label="自定义早停条件代码"
            header-style="backgroundColor:var(--q-primary);padding-left:30px;padding-right:40px;"
          >
            <div class="row ui-noborderbottom" style="margin-top: 4px">
              <div
                :id="`stop_${m.modelID}_${structureIndex}`"
                class="col"
                style="height: auto !important; min-height: 50px"
              ></div>
            </div>
          </q-expansion-item>
          <q-list>
            <q-expansion-item
              label="层级结构"
              header-style="backgroundColor:var(--q-primary);padding-left:30px;padding-right:40px;margin-top:8px ;margin-bottom:4px"
            >
              <!-- for循环渲染层级结构 -->
              <div v-for="(item, index) in structureItem.layers" :key="index" class="layers-item">
                <div class="row">
                  <div class="col-7">第{{ index + 1 }}层</div>
                  <div class="col-5">
                    <q-icon
                      name="arrow_upward"
                      size="xs"
                      class="material-icons-outlined cursor-pointer ui-layer-icon"
                      :class="index == 0 || index == structureItem.layers.length - 1 ? '' : 'ui-select-icon'"
                      @click="upMoveLayer(m.metadata,structureIndex, index)"
                    >
                      <q-tooltip anchor="top right" self="top left">上移</q-tooltip>
                    </q-icon>
                    <q-icon
                      name="arrow_downward"
                      size="xs"
                      class="material-icons-outlined cursor-pointer ui-layer-icon"
                      :class="index == 0 || index == structureItem.layers.length - 1 ? '' : 'ui-select-icon'"
                      @click="downMoveLayer(m.metadata,structureIndex, index)"
                    >
                      <q-tooltip anchor="top right" self="top left">下移</q-tooltip>
                    </q-icon>
                    <q-icon
                      name="delete"
                      size="xs"
                      class="material-icons-outlined cursor-pointer ui-layer-icon"
                      :class="index == 0 || index == structureItem.layers.length - 1 ? '' : 'ui-select-icon'"
                      @click="delLayer(m.metadata,structureIndex, index)"
                    >
                      <q-tooltip anchor="top right" self="top left">删除</q-tooltip>
                    </q-icon>
                  </div>
                </div>
                <div class="row">
                  <div class="col-7">层类型</div>
                  <div class="col-5">
                    <q-select
                      v-model="item.layerType"
                      standout
                      :options="layerTypeList"
                      color="white"
                      options-dense
                      popup-content-class="ui-select-popup"
                      :disable="index == 0 || index == structureItem.layers.length - 1"
                      :option-disable="(item) => (item === 'input' || item === 'output' ? true : false)"
                      class="ui-model-input"
                    />
                  </div>
                </div>
                <div class="row">
                  <div class="col-7">激活函数</div>
                  <div class="col-5">
                    <q-select
                      v-model="item.activator"
                      standout
                      :options="layerActivationList"
                      color="white"
                      options-dense
                      popup-content-class="ui-select-popup"
                      class="ui-model-input"
                      :disable="getActivatorDisable(m.metadata.NNtype, item, structureIndex)"
                    />
                  </div>
                </div>
                <div class="row">
                  <div class="col-7">神经元数目</div>
                  <div class="col-5">
                    <q-input
                      v-model.number="item.neutralAmount"
                      type="number"
                      bg-color="#2D2A2A"
                      standout
                      class="ui-model-input"
                      max="300"
                      min="0"
                      :disable="getneutralAmountDisable(m.metadata, item, structureIndex)"
                    >
                    </q-input>
                  </div>
                </div>
                <div class="row">
                  <div class="col-7">附加层</div>
                  <div class="col-5">
                    <q-select
                      v-model="item.appendixType"
                      standout
                      :options="layerAppendixTypeList"
                      color="white"
                      options-dense
                      popup-content-class="ui-select-popup"
                      class="ui-model-input"
                      @update:model-value="
                        (value) => {
                          item.appendixParam = 0;
                        }
                      "
                    />
                  </div>
                </div>
                <div class="row ui-noborderbottom">
                  <div class="col-7" style="padding-left: 51px">丢弃概率</div>
                  <div class="col-5">
                    <q-input
                      v-model.number="item.appendixParam"
                      type="number"
                      bg-color="#2D2A2A"
                      standout
                      class="ui-model-input"
                      max="1"
                      min="0"
                      step="0.1"
                    >
                    </q-input>
                  </div>
                </div>
              </div>
              <div class="row ui-noborderbottom" style="max-width: 777px; margin: 0 auto">
                <div class="col" style="text-align: center">
                  <q-icon
                    name="add"
                    size="18px"
                    style="color: var(--q-accent)"
                    class="material-icons-outlined cursor-pointer"
                  />
                  <span style="font-size: 14px; color: var(--q-accent); cursor: pointer" @click="addLayer(m.metadata,structureIndex)"
                    >添加层</span
                  >
                </div>
              </div>
            </q-expansion-item>
          </q-list>
        </q-expansion-item>
        <div style="text-align: center; margin-top: 12px">
          <q-btn class="q-mx-auto ui-wel-btn-add" @click="addNetwork(m.metadata)">添加网络</q-btn>
        </div>
      </q-expansion-item>
    </div>
  </div>
</template>
<style scoped lang="less">
// TODO:后期把这些东西放到一个公共样式文件里面，只要涉及到input 和select条目框的都可以用
.q-pa-md {
  max-width: 875px;
  margin: 0 auto;
  margin-top: 40px;
  padding: 0px;
}
.ui-model-border {
  border: 1px dotted #213f6a;
  border-radius: 10px;
  margin-bottom: 10px;
  padding: 10px 20px;
}
p {
  font-size: 18px;
  text-align: center;
  margin-bottom: 18px;
}
.row {
  background: var(--q-primary);
  border-bottom: 1px solid var(--q-negative);
}
.row > div {
  height: 50px;
  line-height: 50px;
  padding: 0 30px;
}
.row .col-5 {
  text-align: right;
  padding-top: 7px;
  .q-icon {
    margin-left: 10px;
  }
}
.ui-sub-header {
  margin: 10px;
  font-size: 16px;
}
.ui-info-list {
  padding-left: 30px;
  padding-right: 30px;
  border-top: 1px solid var(--q-negative);
}
.ui-data-item {
  height: 50px;
  padding: 0px !important;
  background-color: transparent !important;
}
:deep(.ui-data-item:not(:first-child)) {
  border-top-color: var(--q-negative) !important;
}
.ui-data-expansion {
  margin-bottom: 8px;
  border-radius: 4px;
}
.layers-item {
  margin-bottom: 4px;
  .row {
    max-width: 777px;
    margin: 0 auto;
  }
}

:deep(.q-field__control) {
  height: 36px !important;
  border-radius: 8px;
}
:deep(.q-field__native) {
  padding: 0px !important;
}
:deep(.q-field__marginal) {
  height: 100%;
}
:deep(.q-field--auto-height) {
  .q-field__control,
  .q-field__native {
    min-height: 0px !important;
  }
}
.add-network {
  font-size: 14px;
  color: var(--q-accent);
  text-align: center;
}
.ui-select-icon:hover {
  color: white;
}
.ui-layer-icon {
  color: dimgray;
}
.expansion-header {
  padding: 0px !important;
  background-color: transparent !important;
  border-bottom: none !important;
}
.ui-wel-btn-add {
  width: 142px;
  height: 35px;
  border: 1px solid var(--q-accent);
  border-radius: 17px;
  margin-bottom: 38px;
  background-color: var(--q-accent);
  color: var(--ui-disabled);
}
:deep(.ui-model-input .q-field__control) {
  background-color: var(--q-negative) !important;
}
:deep(.ui-model-input .q-field__native) {
  color: white !important;
}
.ui-noborderbottom {
  border-bottom: transparent !important;
}
:deep(.ui-item-header .q-item) {
  padding: 0px;
}
</style>
