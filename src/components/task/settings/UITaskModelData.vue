<script setup lang="ts">
// 数据转换页面
import { computed, onMounted, ref, watch, onBeforeUnmount, inject, ComputedRef } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useQuasar } from "quasar";
import { deepCopy } from "utils";
import { useStorage, Scenario, Design, Entity, ModelTemplate, SmartModel, Parameter } from "~/storage";
// import { setDataProcess } from "api";
const router = useRouter();
const $q = useQuasar();
const storage = useStorage();
// 如果没有任务打开就回退到启动页
if (!storage.isTaskOpen) {
  router.push("/welcome");
}
const route = useRoute();
// 确保storage.currentTask在打开此页面后不会被替换，因此可以直接引用
const cT = storage.currentTask;
// 想定列表
const scenarioList = computed(() => storage.scenarios);
// 试验设计列表
const designList = computed(() => (cT.scenario ? cT.scenario.designs : ([] as Design[])));
// 实体列表
const entityList = computed(() => (cT.scenario ? cT.scenario.entities : ([] as Entity[])));
console.log(entityList, "实体列表");

// 当前选中的想定
const currentScenario = ref(cT.scenario as unknown as null);
watch(currentScenario, async (val) => {
  if (val) {
    cT.scenario = val;
  }
  cT.model = [];
  cT.design = null as unknown as Design;
  cT.smartModel = null as unknown as SmartModel[];
  currentDesign.value = null;
  currentEntitys.value = [];
  selectCompEntitys.value = [];
  disableEntityModeIds.value = [];
  entityComCard.value = false;
  compoName.value = "";
  await getIntelligentEntityList(cT.scenario);
  getSimModelParams();
});
// 当前选中的试验设计
const currentDesign = ref(cT.design as unknown as null);
watch(currentDesign, (val) => {
  if (val) {
    cT.design = val;
    cT.expDesignId = cT.design.id;
  }
});

// 多个仿真模型合成模块
const currentEntitys = ref([] as Entity[]); // 当前选中的实体
const selectCompEntitys = ref([] as Entity[]); //选中要添加为智能模型的实体
// 监听选中的实体
watch(
  currentEntitys,
  (oldval, newval) => {
    selectCompEntitys.value.forEach((item, index) => {
      let findIndex = currentEntitys.value.findIndex((ele) => {
        return ele.modelID == item.modelID;
      });
      if (findIndex == -1) selectCompEntitys.value.splice(index, 1);
    });
  },
  {
    deep: true,
  }
);
// 监听智能模型的改变
watch(
  () => cT.smartModel,
  (val) => {
    if (val) {
      // TODO:多模型
      let tempModelList = deepCopy(cT.model);
      console.log(tempModelList, "tempModelListtempModelListaaa");

      cT.model = [];
      cT.smartModel.forEach((entityItem) => {
        let findIndex = tempModelList.findIndex((item) => {
          return item.modelID == entityItem.id;
        });
        //处理ct.model
        if (findIndex == -1) {
          let temoObj = deepCopy(storage.modelTemplate) as ModelTemplate;
          temoObj.modelID = entityItem.id;
          if (!storage.isTaskNew) temoObj.taskId = cT.id; //如果是在已经
          entityItem.simModelIds.forEach((simId) => {
            temoObj.simModel.push({
              id: simId,
              status: [],
              action: [],
            });
          });

          temoObj.statusDimension = 0;
          temoObj.actionDimension = 0;
          temoObj.inferenceDimension = 0;
          cT.model.push(temoObj);
        } else {
          cT.model.push(tempModelList[findIndex]);
        }
      });
    }
  },
  {
    deep: true,
  }
);
const entityComCard = ref(false); //是否显示添加模型的页面
const compoName = ref(""); //智能模型的名称
function uuid() {
  let s = [];
  let hexDigits = "0123456789abcdef";
  for (let i = 0; i < 32; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] as any & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23];
  let uuid = s.join("");
  return uuid;
}
const disableEntityModeIds = ref([] as string[]); //已经被使用过的实体modelId
// 确定合成
function confirmCompModel() {
  let tempModelids = [] as string[];
  selectCompEntitys.value.forEach((item) => {
    let index = disableEntityModeIds.value.findIndex((modelId) => {
      return item.modelID == modelId;
    });
    // 这一步是将当前选中的实体的modelId提取出来，之后后台需要传递实体id，直接取这个数组里面的即可
    if (index == -1) tempModelids.push(item.id);
  });
  entityComCard.value = false;
  // TODO:调接口，生成新的仿真模型value
  let id = uuid(); //智能模型的id需要前端自己生成
  console.log(id, "ididid");
  let tempObj: SmartModel = {
    id: id,
    displayName: compoName.value,
    name: "testModel",
    optServAddr: "",
    simModelIds: tempModelids,
  };
  if (cT.smartModel) cT.smartModel.push(tempObj);
  else cT.smartModel = [tempObj];
  // 先清空，在赋值
  disableEntityModeIds.value = [];
  selectCompEntitys.value.forEach((item) => {
    disableEntityModeIds.value.push(item.modelID);
  });
  compoName.value = "";
  entityComCard.value = false;
}
function disableMultOption(modelID: string) {
  let index = disableEntityModeIds.value.findIndex((item) => {
    return item == modelID;
  });
  if (index == -1) return false;
  else return true;
}
// 删除智能模型
function deleteSmartModel(ids: string[], index: number) {
  cT.smartModel.splice(index, 1);
  ids.forEach((id: string) => {
    let findIndex1 = selectCompEntitys.value.findIndex((item) => {
      return item.id == id;
    });
    console.log(findIndex1, "findIndex1");

    if (findIndex1 > -1) selectCompEntitys.value.splice(findIndex1, 1);
    let findIndex2 = currentEntitys.value.findIndex((item) => {
      return item.id == id;
    });
    console.log(findIndex2, "findIndex2");
    if (findIndex2 > -1) currentEntitys.value.splice(findIndex2, 1);
    let findIndex3 = disableEntityModeIds.value.findIndex((item) => {
      return item == id;
    });
    console.log(findIndex3, "findIndex3");
    if (findIndex3 > -1) disableEntityModeIds.value.splice(findIndex3, 1);
  });
}
// 初始化想定的实体列表
async function getIntelligentEntityList(scenario: Scenario) {
  if (!scenario.entities || scenario.entities.length === 0) {
    try {
      await storage.initEntities(scenario);
    } catch (e) {
      if (e instanceof Error) {
        $q.notify({
          type: "error",
          message: "读取想定的实体列表时出错：" + e.message,
        });
      }
    }
  }
}
// 状态数据和动作数据的处理
const statusList = ref([] as Parameter[][]);
const actionList = ref([] as Parameter[][]);
const simModelList = ref([] as Entity[]); //仿真模型列表
function getSimModelParams() {
  simModelList.value = [];
  statusList.value = [];
  actionList.value = [];
  cT.scenario.entities.forEach((item) => {
    simModelList.value.push(deepCopy(item));
    statusList.value.push([]);
    actionList.value.push([]);
  });
}
(async () => {
  getSimModelParams();
  if (cT.smartModel && cT.smartModel.length > 0) {
    cT.model.forEach((item, index) => {
      let findIndex = cT.smartModel.findIndex((model) => {
        return model.id == item.modelID;
      });
      if (findIndex == -1) cT.model.splice(index, 1);
    });
    console.log(cT.model, "UPDATE");

    cT.smartModel.forEach((item) => {
      item.simModelIds.forEach((id) => {
        let findObj = entityList.value.find((entity) => {
          return entity.id == id;
        });
        if (findObj) {
          currentEntitys.value.push(findObj);
          selectCompEntitys.value.push(findObj);
          disableEntityModeIds.value.push(findObj.modelID);
        }
      });
    });
    // await setDataProcess(storage.systemSettings.dataServAddr, cT.config);TODO:
  }
  // if (cT.scenario) {
  //   try {
  //     await getIntelligentEntityList(cT.scenario); //如果当前想定实体列表为空或者不存在，就获取当前的实体列表
  //     console.log(cT.smartModel, "cT.smartModelcT.smartModel");
  //     if (cT.smartModel && cT.smartModel.length > 0) {
  //       cT.model.forEach((item, index) => {
  //         let findIndex = cT.smartModel.findIndex((model) => {
  //           return model.id == item.modelID;
  //         });
  //         if (findIndex == -1) cT.model.splice(index, 1);
  //       });
  //       console.log(cT.model, "UPDATE");

  //       cT.smartModel.forEach((item) => {
  //         item.simModelIds.forEach((id) => {
  //           let findObj = entityList.value.find((entity) => {
  //             return entity.id == id;
  //           });
  //           if (findObj) {
  //             currentEntitys.value.push(findObj);
  //             selectCompEntitys.value.push(findObj);
  //             disableEntityModeIds.value.push(findObj.modelID);
  //           }
  //         });
  //       });
  //       // await setDataProcess(storage.systemSettings.dataServAddr, cT.config);TODO:
  //     }
  //   } catch (err) {
  //     if (err instanceof Error) {
  //       $q.notify({
  //         type: "error",
  //         message: err.message,
  //       });
  //     }
  //   }
  // }
})();
//#region 
// 获取当前模型绑定的实体信息
// const modelIndex = parseInt(route.params.index as string);
// const currentSmartModel = computed(() => cT.smartModel[modelIndex]); //当前的智能模型

// const currentModel = computed(() => {
//   let find = cT.model.find((item) => {
//     return item.modelID == currentSmartModel.value.id;
//   });
//   return find;
// }) as ComputedRef<typeof cT.model[number]>;

// console.log(currentModel.value, "currentModel");
// console.log(cT.model, "cT.model");
// console.log(currentSmartModel.value, "currentSmartModel");

// const statusList = ref([] as Parameter[][]);
// const actionList = ref([] as Parameter[][]);
// const simModelList = ref([] as Entity[]); //仿真模型列表
// (() => {
//   currentSmartModel.value.simModelIds.forEach((id: string) => {
//     let entityObj = cT.scenario.entities.find((item) => {
//       return item.id == id;
//     });
//     if (entityObj) {
//       let tempsList = [] as Parameter[];
//       let tempaList = [] as Parameter[];
//       simModelList.value.push(entityObj); //先将当前想定里的仿真实体加入到列表里
//       console.log(currentModel.value, "currentModelcurrentModel");

//       let simObj = currentModel.value.simModel.find((item) => {
//         return item.id == id;
//       });
//       if (simObj) {
//         simObj.status.forEach((item) => {
//           let findObj = entityObj?.parameters.find((param) => {
//             return item == param.name;
//           });
//           if (findObj) tempsList.push(findObj);
//         });
//         statusList.value.push(tempsList);
//         simObj.action.forEach((item) => {
//           let findObj = entityObj?.parameters.find((param) => {
//             return item.name == param.name;
//           });
//           if (findObj) tempaList.push(findObj);
//         });
//         actionList.value.push(tempaList);
//       }
//     }
//   });
// })();
// // 当仿真模型的状态数据发生改变时
// function updateStatusList(val: number) {
//   currentModel.value.simModel[val].status = [];
//   statusList.value[val].forEach((item) => {
//     currentModel.value.simModel[val].status.push(item.name);
//   });
//   // 重新统计状态维度和动作维度
//   let lengthNum = 0;
//   statusList.value.forEach((item) => {
//     lengthNum += item.length;
//   });
//   currentModel.value.statusDimension = lengthNum;
//   currentModel.value.inferenceDimension=lengthNum;
//   console.log(lengthNum,"lengthNum");

// }
// // 当仿真模型的动作数据发生改变时
// function updateActionList(val: number) {
//   let tempConfig = deepCopy(currentModel.value.simModel[val].action);
//   currentModel.value.simModel[val].action = [];
//   actionList.value[val].forEach((action) => {
//     let tempObj = tempConfig.find((item) => {
//       return item.name == action.name;
//     });
//     if (tempObj) currentModel.value.simModel[val].action.push(tempObj);
//     else currentModel.value.simModel[val].action.push({ name: action.name, bound: 0, shift: 0 });
//   });
//     // 重新统计状态维度和动作维度
//   let lengthNum = 0;
//   actionList.value.forEach((item) => {
//     lengthNum += item.length;
//   });
//   currentModel.value.actionDimension = lengthNum;
//   console.log(lengthNum,"lengthNum");
// }
// function getValue(data: string, simIndex: number, index: number, flag: string) {
//   console.log(data);
//   let param = 0;
//   if (/^\d+(\.\d+)?$/.test(data)) {
//     console.log("匹配成功");
//     param = parseFloat(data);
//     if (flag == "bound") {
//       currentModel.value.simModel[simIndex].action[index].bound = param;
//     } else {
//       currentModel.value.simModel[simIndex].action[index].shift = param;
//     }
//   } else {
//     $q.notify({
//       type: "error",
//       message: "请输入正确数值类型",
//     });
//   }
// }
//#endregion
let editor: EditorView | null = null;
//当页面渲染好后，添加codemirror的python编辑器
onMounted(() => {
  // editor = new EditorView({
  //   state: EditorState.create({
  //     extensions: [
  //       basicSetup,
  //       keymap.of([indentWithTab]),
  //       HighlightStyle.define([
  //         { tag: tags.keyword, color: "#fc6" },
  //         {
  //           tag: tags.comment,
  //           color: "green",
  //         },
  //         {
  //           tag: tags.name,
  //           color: "white",
  //         },
  //       ]),
  //       EditorView.theme(
  //         {
  //           "&.cm-focused .cm-cursor": {
  //             //光标颜色
  //             borderLeftColor: "#00e0ffff",
  //           },
  //           ".cm-gutters": {
  //             backgroundColor: "#045", //行号的背景色
  //             color: "#ddd", //行号的颜色
  //             border: "none",
  //           },
  //         },
  //         { dark: true }
  //       ),
  //       StreamLanguage.define(python),
  //       EditorView.updateListener.of((v) => {
  //         if (v.docChanged) {
  //           cT.model[modelIndex].metadata.reward = v.state.doc.toString(); // 将奖励函数同步到全局状态
  //         }
  //       }),
  //     ], //扩展
  //     doc: cT.model[modelIndex].metadata.reward ?? "", //初始值
  //   }),
  //   parent: document.getElementById("rewardEditor")!, //编辑器的容器
  // });
});
onBeforeUnmount(() => {
  // if (editor) {
  //   editor.destroy();
  // }
});
</script>
<template>
  <div class="q-mx-auto ui-data-container">
    <div class="ui-info-section">
      <div class="row items-center justify-between ui-info-section-item">
        <div class="col-4">想定文件</div>
        <div class="col-8">
          <q-select
            v-model="currentScenario"
            standout
            :options="scenarioList"
            color="white"
            options-dense
            popup-content-class="ui-select-popup "
            class="float-right ui-info-input"
            option-value="name"
            option-label="name"
          />
        </div>
      </div>
      <div class="row items-center justify-between ui-info-section-item">
        <div class="col-4">试验设计方案</div>
        <div class="col-8">
          <q-select
            v-model="currentDesign"
            standout
            :options="designList"
            color="white"
            options-dense
            popup-content-class="ui-select-popup"
            class="float-right ui-info-input"
            option-value="name"
            option-label="name"
            :disable="!currentScenario"
          />
        </div>
      </div>
      <q-expansion-item label="仿真模型" header-class=" ui-info-expansion" :disable="!currentScenario">
        <q-list separator class="ui-info-list">
          <q-item v-for="entity in entityList" :key="entity.id" v-ripple tag="label" class="ui-info-list-item">
            <q-item-section>
              <q-item-label>{{ entity.displayName }}</q-item-label>
            </q-item-section>
            <q-item-section avatar>
              <q-checkbox v-model="currentEntitys" :val="entity" color="cyan" :disable="disableMultOption(entity.modelID)" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-expansion-item>
    </div>
    <div class="ui-info-section ui-smartmodel-config">
      <p>智能模型配置</p>
      <div class="q-pa-md">
        <div class="q-gutter-xs">
          <q-chip
            v-for="(item, index) in cT.smartModel"
            :key="item.id"
            removable
            text-color="white"
            @remove="deleteSmartModel(item.simModelIds, index)"
            >{{ item.displayName }}
          </q-chip>
        </div>
      </div>
      仿真模型:
      <q-checkbox
        v-for="item in currentEntitys"
        :key="item.modelID"
        v-model="selectCompEntitys"
        :val="item"
        :label="item.displayName"
        color="cyan"
        :disable="disableMultOption(item.modelID)"
      />
      <q-btn v-if="selectCompEntitys.length - disableEntityModeIds.length > 0" class="ui-comp-btn" @click="entityComCard = true"
        >添加</q-btn
      >
      <div>
        <q-card
          v-if="entityComCard && selectCompEntitys.length - disableEntityModeIds.length > 0"
          flat
          bordered
          class="q-mt-md"
        >
          <q-card-section class="ui-smartmodel-name">
            <span>智能模型的名称: </span><q-input v-model="compoName" standout class="ui-info-input" />
            <q-btn class="ui-comp-btn" dark-percentageisable="compoName == '' ? true : false" @click="confirmCompModel"
              >确定</q-btn
            >
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div class="q-mx-auto text-center ui-data-head">状态数据</div>
    <q-expansion-item
      v-for="(simModel, simIndex) in simModelList"
      :key="simModel.id"
      :label="simModel.displayName"
      class="bg-primary ui-data-expansion"
      heade-class="ui-data-expansion-header"
    >
      <q-list separator class="ui-data-list">
        <!--模型实例动态生成 -->
        <template v-for="item in simModel.parameters" :key="item.name">
          <q-item
            v-if="
              item.usage.includes(`output`) && !item.type.includes(`uint`) && item.type != 'string' && !item.type.includes(`[]`)
            "
            v-ripple
            tag="label"
            class="ui-data-item"
          >
            <q-item-section>
              <q-item-label>{{ item.displayName }}</q-item-label>
            </q-item-section>
            <q-item-section avatar>
              <q-checkbox v-model="statusList[simIndex]" :val="item" color="cyan" />
            </q-item-section>
          </q-item>
        </template>
      </q-list>
    </q-expansion-item>
    <div class="q-mx-auto text-center ui-data-head">动作数据</div>
    <q-expansion-item
      v-for="(simModel, simIndex) in simModelList"
      :key="simModel.id"
      :label="simModel.displayName"
      class="bg-primary ui-data-expansion"
      header-class="  ui-data-expansion-header"
    >
      <q-list separator class="ui-data-list">
        <!--模型参数动态生成 -->
        <template v-for="item in simModel.parameters" :key="item">
          <q-item
            v-if="
              item.usage.includes(`input`) && !item.type.includes(`uint`) && item.type != 'string' && !item.type.includes(`[]`)
            "
            v-ripple
            tag="label"
            class="ui-data-item"
          >
            <q-item-section>
              <q-item-label>{{ item.displayName }}</q-item-label>
            </q-item-section>
            <q-item-section avatar>
              <q-checkbox
                v-model="actionList[simIndex]"
                :val="item"
                color="cyan"
                @update:model-value="updateActionList(simIndex)"
              />
            </q-item-section>
          </q-item>
        </template>
      </q-list>
    </q-expansion-item>
  </div>
</template>
<style scoped lang="less">
.ui-data-container {
  max-width: 835px;
  padding-bottom: 40px;
  margin-top: 40px;
}
.ui-info-section {
  border-radius: 4px;
  margin-bottom: 8px;
  background-color: var(--q-primary);
}
.ui-info-section-item {
  height: 50px;
  padding: 7px 30px;
}
.ui-smartmodel-config {
  padding: 10px 30px;
  .q-pa-md {
    padding: 0px;
  }
}
.ui-smartmodel-name {
  display: flex;
  align-items: center;
  span {
    margin-right: 10px;
  }
}
.ui-info-section-item:not(:last-child) {
  border-bottom: 1px solid var(--q-negative);
}
:deep(.ui-info-input .q-field__native) {
  color: white !important;
}
:deep(.ui-info-input .q-field__control) {
  background-color: var(--q-negative) !important;
}
:deep(.ui-info-input) {
  .q-field__control,
  .q-field__native,
  .q-field__marginal {
    min-height: 0px;
    height: 36px;
  }
}
.ui-info-input {
  width: 263px;
  height: 36px;
  border-radius: 4px;
}
.ui-info-list {
  padding-left: 30px;
  padding-right: 30px;
  border-top: 1px solid var(--q-negative);
}
.ui-info-list-item {
  height: 50px;
  padding-left: 30px;
  padding-right: 30px;
}
:deep(.ui-info-list-item:not(:first-child)) {
  border-top-color: var(--q-negative) !important;
}
.ui-comp-btn {
  background-color: var(--q-accent);
  color: var(--ui-disabled);
  margin-left: 20px;
}
.ui-data-head {
  font-size: 18px;
  margin-top: 40px;
  margin-bottom: 18px;
}
.ui-data-expansion {
  margin-bottom: 8px;
  border-radius: 4px;
}
:deep(.ui-data-expansion-header) {
  height: 50px;
  padding-left: 30px;
  padding-right: 30px;
}
.ui-data-list {
  padding-left: 30px;
  padding-right: 30px;
  border-top: 1px solid var(--q-negative);
}
.ui-data-item {
  height: 50px;
}
:deep(.ui-data-item:not(:first-child)) {
  border-top-color: var(--q-negative) !important;
}
.ui-detail-title {
  padding: 0 35px;
  margin-bottom: 10px;
}
.ui-detail-line {
  width: 1px;
  height: 20px;
  margin-right: 15px;
  background-color: #f4f4f473;
  display: inline-block;
}
.ui-detail-table {
  max-height: 400px;
  padding: 0px 35px;
  padding-bottom: 10px;
  thead > tr > th {
    position: sticky;
    z-index: 1;
    top: 0;
    background-color: var(--q-secondary);
  }
}
.ui-detail-sep {
  margin-bottom: 15px;
}

.ui-input {
  width: 45px;
  height: 36px;
  border-radius: 4px;
  border: 0px;
  text-align: center;
  background-color: var(--q-primary);
  color: white;
}
.ui-input:focus {
  border: 0px;
}
</style>
