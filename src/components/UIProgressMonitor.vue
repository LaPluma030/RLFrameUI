<script setup lang="ts">
import { computed, ref, Ref } from "vue";
import { useRouter } from "vue-router";
import { useStorage } from "~/storage";
import { useQuasar } from "quasar";
import UINodeDesignVue from "./task/settings/UINodeDesign.vue";
import { deepCopy } from "utils";
import {
  initEngine,
  controlEngine,
  configEngine,
  getEngineInfo,
  getEngineError,
  initMemory,
  initOptimizer,
  controlOptimizer,
  resetMemory,
  saveModelParameters,
  configState,
  getAllNodes,
  getEntityList,
} from "api";
import { getTimeString, getDurationString } from "utils";
const storage = useStorage();
const router = useRouter();
/*----------------------------------------------------------*/
const $q = useQuasar();
const visible = ref("单节点"); //定义是单节点还是多节点
const isDistribute = ref(false); //多节点分发弹窗
const cT = storage.currentTask; //当前任务
const entityAry = ref([]); //获取的实体列表
const nodeTreeAry: Ref<{ pid: -1; label: string; id: number; children: Array<any> }[]> = ref([]); //获取的节点列表
interface entityNode {
  id: number;
  label: string;
  modelName: string;
  model_id: string;
  pid: number;
  camp_name: string;
  uid: string;
  npid: number;
}
interface nodeType {
  id: number;
  label: string;
  pid: number;
  children: Array<entityNode>;
}
const nodeList: Ref<nodeType[]> = ref([]); //最终保存下来的节点结果
// 触发自定义事件接收子组件传递的值
function close(value: boolean, array: nodeType[]) {
  isDistribute.value = false;
  nodeList.value = deepCopy(array);
  console.log(nodeList.value, "接收子组件传递过来的值");
  initCreat();
}
async function getscenarioIdEntityList() {
  try {
    let scenarioId = cT.scenario.id; //当前任务的想定id
    console.log(scenarioId, "想定的信息");
    let res = await getEntityList(sS.ctrlServAddr, scenarioId);
    entityAry.value = JSON.parse(res);
  } catch (error: any) {
    $q.notify({
      type: "positive",
      position: "top",
      color: "red",
      message: "获取想定中的实体列表失败" + error.message,
    });
  }
}
async function getNodeList() {
  let res = await getAllNodes(sS.ctrlServAddr);
  res.forEach((item, index) => {
    nodeTreeAry.value.push({
      id: index,
      pid: -1,
      label: item,
      children: [],
    });
  });
}
function switchNode(value: string) {
  if (value == "多节点") {
    if (entityAry.value.length == 0) {
      getscenarioIdEntityList();
    }
    if (nodeTreeAry.value.length == 0) {
      getNodeList();
    }
  }
}
/*---------------------------------------------------------------*/
// 如果没有任务打开就回退到启动页
if (!storage.isTaskOpen) {
  router.push("/welcome");
}
// 确保storage.monitorStatus不会被替换，所以可以直接引用，而不需要使用computed.value的形式
const mS = storage.monitorStatus;
// 确保storage.systemSettings只在App.vue加载时被替换，此后可以直接引用
const sS = storage.systemSettings;
//进度条
const progress = computed(() => mS.simCurEpisodes / (mS.simTotalEpisodes + 0.01));

// 与引擎的信息流
let engineInfoStream: PromiseReturnType<typeof getEngineInfo> | null = null;

let engineErrorStream: PromiseReturnType<typeof getEngineError> | null = null;

const m = cT.model; //当前任务的模型

const optServAddrList: string[] = [];
cT.smartModel.forEach((item: { optServAddr: string }) => {
  let findIndex = optServAddrList.findIndex((addr) => {
    return addr == item.optServAddr;
  });
  if (findIndex == -1) optServAddrList.push(item.optServAddr);
});
// 初始化引擎服务
async function initCreat() {
  try {
    let realList = nodeList.value.filter((item) => {
      return item.children.length > 0;
    });
    if (realList.length > 0) {
      await initEngine(sS.ctrlServAddr, cT.design.id, realList);
    } else {
      $q.notify({
        type: "positive",
        position: "top",
        color: "green",
        message: "请先进行分布式设计",
      });
    }
  } catch (e) {
    if (e instanceof Error) {
      const msg = "分发节点时出错" + e.message;
      storage.addSimMsg(msg, "error");
    }
  }
}
async function smartSimulation() {
  try {
    if (visible.value == "单节点") {
      // 初始化运控服务
      await initEngine(sS.ctrlServAddr, cT.design.id, null);
    }
    let initModel: {
      statusDimension: number;
      actionDimension: number;
      memoryCapacity: number;
      rewardFunction: string;
      modelId: string;
    }[] = [];
    let modelList: any = [];
    m.forEach((item) => {
      // 存储服务
      let memObj = {
        statusDimension: item.statusDimension,
        actionDimension: item.actionDimension,
        memoryCapacity: cT.memorySize,
        rewardFunction: item.metadata.reward,
        modelId: item.modelID,
      };
      initModel.push(memObj);
      // 优化服务
      const d = item.metadata;
      let optObj = {
        inputDimension: item.statusDimension,
        outputDimension: item.actionDimension,
        inferenceDimension: item.inferenceDimension,
        pushFrequency: cT.replaceFrequency,
        inferenceUrl: sS.infServRawAddr,
        memoryUrl: sS.memServRawAddr,
        batchSize: cT.batchSize,
        modelId: item.modelID,
        modelParams: {
          type: d.NNtype,
          network: d.structure.map((n) => ({
            subNetName: "",
            initialization: n.initialization,
            optimizer: n.optimizer,
            learningRate: n.learningRate,
            learningRateDecay: n.learningRateDecay,
            loss: n.loss,
            lossFunction: n.lossFunction,
            earlyStop: n.earlyStop,
            earlyStopFunction: n.earlyStopFunction,
            layers: n.layers.map((l) => ({
              type: l.layerType,
              neutralAmount: l.neutralAmount,
              activator: l.activator,
              appendix: {
                appendixType: l.appendixType,
                param: l.appendixParam,
              },
            })),
          })),
        },
        simModel: item.simModel,
      };
      modelList.push(optObj);
    });
    // 初始化存储服务
    await initMemory(sS.memServAddr, initModel);
    // 初始化优化服务
    // 根据优化服务提供的地址进行循环的初始化
    optServAddrList.forEach(async (item) => {
      console.log(item, "地址列表");

      await initOptimizer(item, modelList);
    });

    // 设置引擎参数
    await configEngine(sS.ctrlServAddr, {
      simStartTime: new Date(mS.simStartTime),
      simDuration: mS.simEpisodeDuration,
      timeStep: mS.simTimeStep,
      speedRatio: mS.simSpeedRatio,
    });
    //设置推送态势数据的状态
    await configState(sS.ctrlServAddr, "CONVERSE");
    // 开始仿真
    await controlEngine(sS.ctrlServAddr, "START");
    optServAddrList.forEach(async (item) => {
      await controlOptimizer(item, "START");
    });

    const engineStreams = await Promise.all([
      getEngineInfo(`http://${sS.ctrlServAddr}`),
      getEngineError(`http://${sS.ctrlServAddr}`),
    ]);
    engineInfoStream = engineStreams[0];
    engineErrorStream = engineStreams[1];
    engineStreams[0].on("status", async (statusRes) => {
      // console.log(statusRes);
      if (statusRes.code == 2) {
        //地址不对
        (engineInfoStream as { cancel: any })?.cancel();
        let tempEngineInfoStream = await getEngineInfo(`https://${sS.ctrlServAddr}`);
        engineInfoStream = tempEngineInfoStream;
        engineInfoStream.on("data", (dataRes1) => {
          // console.log("修改信息后的" + dataRes1);
          const simCurrentTime = dataRes1.getSimCurrentTime();
          const simDuration = dataRes1.getSimDuration();
          const realDuration = dataRes1.getRealDuration();
          const curSampleId = dataRes1.getCurrentSampleId();
          if (simCurrentTime) {
            mS.simCurrentTime = getTimeString(simCurrentTime.toDate().valueOf());
          }
          if (simDuration) {
            mS.simDuration = getDurationString(simDuration.getSeconds());
          }
          if (realDuration) {
            mS.realDuration = getDurationString(realDuration.getSeconds());
          }
          mS.simCurEpisodes = curSampleId + 1;
        });
        tempEngineInfoStream.on("status", (statusRes1) => {
          engineInfoStream?.cancel();
          storage.addSimMsg(`注册获取系统信息的回调失败-${statusRes1.details}`, "error");
        });
      } else {
        //除了地址错误之外的其他报错，直接在控制台输出，try和catch不能捕获这个异步错误，所以在这里直接打印
        storage.addSimMsg(`注册获取系统信息的回调失败-${statusRes.details}`, "error");
      }
    });

    engineInfoStream.on("data", (dataRes) => {
      // console.log(dataRes, engineInfoStream, "节点信息");
      const simCurrentTime = dataRes.getSimCurrentTime();
      const simDuration = dataRes.getSimDuration();
      const realDuration = dataRes.getRealDuration();
      const curSampleId = dataRes.getCurrentSampleId();
      if (simCurrentTime) {
        mS.simCurrentTime = getTimeString(simCurrentTime.toDate().valueOf());
      }
      if (simDuration) {
        mS.simDuration = getDurationString(simDuration.getSeconds());
      }
      if (realDuration) {
        mS.realDuration = getDurationString(realDuration.getSeconds());
      }
      mS.simCurEpisodes = curSampleId + 1;
    });
    // 注册获取错误的回调
    engineStreams[1].on("status", async (statusRes) => {
      if (statusRes.code == 2) {
        engineErrorStream?.cancel();
        let tempEngineErrorStream = await getEngineError(`https://${sS.ctrlServAddr}`);
        engineErrorStream = tempEngineErrorStream;
        engineErrorStream.on("data", (dataRes1) => {
          storage.addSimMsg(dataRes1.getMsg(), "error");
        });
        tempEngineErrorStream.on("status", (statusRes1) => {
          engineErrorStream?.cancel();
          storage.addSimMsg(`注册获取错误信息的回调失败-${statusRes1.details}`, "error");
        });
      } else {
        storage.addSimMsg(`注册获取错误信息的回调失败-${statusRes.details}`, "error");
      }
    });
    engineErrorStream.on("data", (dataRes) => {
      storage.addSimMsg(dataRes.getMsg(), "error");
    });
    mS.simState = "Running";
    mS.simCurrentTime = getTimeString();
    mS.simDuration = getDurationString(0);
    mS.realDuration = getDurationString(0);
    mS.simTotalEpisodes = cT.design.sampleSize;
    mS.simCurEpisodes = 1;
    storage.addSimMsg("开始训练成功！", "info");
  } catch (e) {
    console.log(e);
    if (e instanceof Error) {
      const msg = "开始训练时出错：" + e.message;
      storage.addSimMsg(msg, "error");
    }
  }
}
// 开始训练
async function startTraining() {
  if (mS.simState !== "Stopped") {
    return;
  }
  // 由于这些数据可能会被替换，因此只能在函数调用时动态的使用简写来引用
  smartSimulation();
}
// 暂停训练
async function suspendTraining() {
  if (mS.simState !== "Running") {
    return;
  }
  try {
    await controlEngine(sS.ctrlServAddr, "SUSPEND");
    // TODO: 需要优化服务有暂停训练过程的接口
    optServAddrList.forEach(async (item) => {
      await controlOptimizer(item, "SUSPEND");
    });

    mS.simState = "Suspend";
    storage.addSimMsg("暂停训练成功！", "info");
  } catch (e) {
    if (e instanceof Error) {
      const msg = "暂停训练时出错：" + e.message;
      storage.addSimMsg(msg, "error");
    }
  }
}
// 继续训练
async function continueTraining() {
  if (mS.simState !== "Suspend") {
    return;
  }
  if (visible.value == "单节点") {
    try {
      await controlEngine(sS.ctrlServAddr, "CONTINUE");
      // TODO: 需要优化服务有继续训练过程的接口
      optServAddrList.forEach(async (item) => {
        await controlOptimizer(item, "CONTINUE");
      });
      mS.simState = "Running";
      storage.addSimMsg("继续训练成功！", "info");
    } catch (e) {
      if (e instanceof Error) {
        const msg = "继续训练时出错：" + e.message;
        storage.addSimMsg(msg, "error");
        console.log(msg);
      }
    }
  }
}
// 停止训练
async function stopTraining() {
  if (mS.simState === "Stopped") {
    return;
  }

  try {
    await controlEngine(sS.ctrlServAddr, "STOP");
    // // TODO: 需要优化服务有停止训练过程的接口
    optServAddrList.forEach(async (item) => {
      await controlOptimizer(item, "STOP");
    });
    // TODO: 需要存储服务有清除存储数据的接口
    await resetMemory(sS.memServAddr);
    engineInfoStream?.cancel();
    engineInfoStream = null;
    engineErrorStream?.cancel();
    engineErrorStream = null;
    mS.simState = "Stopped";
    mS.simTotalEpisodes = 0;
    mS.simCurEpisodes = 0;
    storage.addSimMsg("停止训练成功！", "info");
  } catch (e) {
    if (e instanceof Error) {
      const msg = "停止训练时出错：" + e.message;
      storage.addSimMsg(msg, "error");
      console.log(msg);
    }
  }
}

// 设置仿真参数
async function setSimConfigs(flag: string) {
  console.log("改变的是", flag);
  //这里加了一个flag标志，，每次只更改特定的值
  let data = {} as {
    simStartTime: Date;
    simDuration: number;
    timeStep: number;
    speedRatio: number;
  };
  if (flag == "startTime") {
    data.simStartTime = new Date(mS.simStartTime);
  } else if (flag == "simTimeLength") {
    data.simDuration = mS.simEpisodeDuration;
  } else if (flag == "simStepLength") {
    data.timeStep = mS.simTimeStep;
  } else if (flag == "simSpeed") {
    data.speedRatio = mS.simSpeedRatio;
  }
  try {
    await configEngine(sS.ctrlServAddr, data);
    storage.addSimMsg("设置仿真参数成功！", "info");
  } catch (e) {
    if (e instanceof Error) {
      const msg = "设置仿真参数时出错：" + e.message;
      storage.addSimMsg(msg, "error");
      console.log(msg);
    }
  }
}

// TODO: 保存权重参数
async function saveWeights() {
  const t = storage.currentTask;
  const m = t.model;
  try {
    let modelList: any = [];
    m.forEach((item) => {
      const d = item.metadata;
      let temObj = {
        type: d.NNtype,
        batchSize: cT.batchSize,
        modelId: item.modelID,
        network: d.structure.map((n) => ({
          subNetName: "",
          initialization: n.initialization,
          optimizer: n.optimizer,
          learningRate: n.learningRate,
          learningRateDecay: n.learningRateDecay,
          loss: n.loss,
          lossFunction: n.lossFunction,
          earlyStop: n.earlyStop,
          earlyStopFunction: n.earlyStopFunction,
          layers: n.layers.map((l) => ({
            type: l.layerType,
            neutralAmount: l.neutralAmount,
            activator: l.activator,
            appendix: {
              appendixType: l.appendixType,
              param: l.appendixParam,
            },
          })),
        })),
      };
      modelList.push(temObj);
    });
    // TODO: 需要优化服务有随时保存权重参数的接口
    optServAddrList.forEach(async (item) => {
      await saveModelParameters(item, modelList);
    });

    storage.addSimMsg("保存权重参数成功！", "info");
  } catch (error) {
    if (error instanceof Error) {
      const msg = "保存权重参数时出错：" + error.message;
      storage.addSimMsg(msg, "error");
      console.log(msg);
    }
  }
}
// 打开Tensorboard面板
function openTensorboard() {
  window.open(sS.tbServAddr, "_black");
  console.log("打开Tensorboard面板成功！");
}
</script>
<template>
  <div class="column justify-between">
    <!-- 操作台 -->
    <div class="q-mx-auto ui-monitor-control">
      <div style="margin-bottom: 20px">操作控制</div>
      <!-- 顶部控制区域 -->
      <div class="row items-center justify-between bg-secondary shadow-2 q-mx-auto ui-monitor-bar">
        <div>
          <q-icon
            name="replay"
            size="sm"
            class="cursor-pointer material-icons-outlined text-accent ui-monitor-icon-ctrl"
            :class="{ 'ui-monitor-icon-disabled': mS.simState !== 'Stopped' }"
          >
            <q-tooltip anchor="top right" self="center left">初始化</q-tooltip>
          </q-icon>
          <q-icon
            name="play_circle"
            size="sm"
            class="cursor-pointer material-icons-outlined text-accent ui-monitor-icon-ctrl"
            :class="{ 'ui-monitor-icon-disabled': mS.simState !== 'Stopped' }"
            @click="startTraining"
          >
            <q-tooltip anchor="top right" self="center left">开始</q-tooltip>
          </q-icon>
          <q-icon
            name="pause_circle"
            size="sm"
            class="cursor-pointer material-icons-outlined text-accent ui-monitor-icon-ctrl"
            :class="{ 'ui-monitor-icon-disabled': mS.simState !== 'Running' }"
            @click="suspendTraining"
          >
            <q-tooltip anchor="top right" self="center left">暂停</q-tooltip>
          </q-icon>
          <q-icon
            name="fast_forward"
            size="sm"
            class="cursor-pointer material-icons-outlined text-accent ui-monitor-icon-ctrl"
            :class="{ 'ui-monitor-icon-disabled': mS.simState !== 'Suspend' }"
            @click="continueTraining"
          >
            <q-tooltip anchor="top right" self="center left">步进</q-tooltip>
          </q-icon>
         
          <q-icon
            name="not_started"
            size="sm"
            class="cursor-pointer material-icons-outlined text-accent ui-monitor-icon-ctrl"
            :class="{ 'ui-monitor-icon-disabled': mS.simState !== 'Suspend' }"
            @click="continueTraining"
          >
            <q-tooltip anchor="top right" self="center left">继续</q-tooltip>
          </q-icon>
          <q-icon
            name="stop_circle"
            size="sm"
            class="cursor-pointer material-icons-outlined text-accent ui-monitor-icon-ctrl"
            :class="{ 'ui-monitor-icon-disabled': mS.simState === 'Stopped' }"
            @click="stopTraining"
          >
            <q-tooltip anchor="top right" self="center left">停止</q-tooltip>
          </q-icon>
          <q-icon
            name="stop_circle"
            size="sm"
            class="cursor-pointer material-icons-outlined text-accent ui-monitor-icon-ctrl"
            :class="{ 'ui-monitor-icon-disabled': mS.simState === 'Stopped' }"
            @click="stopTraining"
          >
            <q-tooltip anchor="top right" self="center left">单局结束</q-tooltip>
          </q-icon>
          <q-icon
            name="settings_applications"
            size="sm"
            class="cursor-pointer material-icons-outlined text-accent ui-monitor-icon-ctrl"
            :class="{ 'ui-monitor-icon-disabled': mS.simState !== 'Stopped' }"
            @click="stopTraining"
          >
            <q-tooltip anchor="top right" self="center left">设置参数</q-tooltip>
          </q-icon>

          
          <q-toggle
            :label="visible"
            color="green"
            false-value="单节点"
            true-value="多节点"
            v-model="visible"
            @update:model-value="switchNode"
          />
          <q-btn
            color="primary"
            v-show="visible == '多节点'"
            label="分布式设计"
            @click="
              {
                isDistribute = true;
              }
            "
          />
        </div>
      </div>
      <div class="row items-center justify-between bg-secondary shadow-2 q-mx-auto ui-monitor-bar">
        <div @click="saveWeights">
          <q-icon name="save" size="sm" class="cursor-pointer material-icons-outlined text-accent" >
          </q-icon>
          <span style="margin-left:10px;">保存权重参数</span>
        </div>
        <div @click="openTensorboard">
          <q-icon name="title" size="sm" class="cursor-pointer material-icons-outlined text-accent" >
          </q-icon>
          <span  style="margin-left:10px;">查看Tensorboard</span>
        </div>
      </div>
      <!-- 训练局数进度 -->
      <div class="ui-monitor-train">
        <div class="flex items-center justify-between">
          <span>训练局数</span>
          <span>
            <span class="text-accent ui-monitor-train-number">{{ mS.simCurEpisodes }}/</span>
            <span>{{ mS.simTotalEpisodes }}</span>
          </span>
        </div>
        <q-linear-progress
          :value="progress"
          rounded
          size="10px"
          track-color="secondary"
          class="full-width ui-monitor-train-progress"
        />
      </div>
      <!-- 配置参数模块 -->
      <div class="flex justify-between ui-monitor-configs">
        <div class="ui-monitor-config">
          <div class="flex items-center justify-between ui-monitor-config-data">
            <div>
              仿真开始时间
              <q-tooltip anchor="top right" self="center left">仿真的基准时间，格式为 YYYY/MM/DD HH:mm:ss</q-tooltip>
            </div>
            <q-input
              v-model="mS.simStartTime"
              standout
              input-class="text-center"
              class="ui-monitor-config-input"
              @change="setSimConfigs('startTime')"
            >
              <template #prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="mS.simStartTime" mask="YYYY/MM/DD HH:mm:ss" />
                  </q-popup-proxy>
                </q-icon>
              </template>
              <template #append>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-time v-model="mS.simStartTime" mask="YYYY/MM/DD HH:mm:ss" format24h with-seconds />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div class="flex items-center justify-between ui-monitor-config-data">
            <div>
              单局仿真时长（秒）<q-tooltip anchor="top right" self="center left">单局最大仿真时长，单位为秒（s）</q-tooltip>
            </div>
            <q-input
              v-model.number="mS.simEpisodeDuration"
              type="number"
              standout
              class="ui-monitor-config-input"
              @change="setSimConfigs('simTimeLength')"
            />
          </div>
          <div class="flex items-center justify-between ui-monitor-config-data">
            <div>
              仿真步长（毫秒）
              <q-tooltip anchor="top right" self="center left">单位为毫秒（ms）</q-tooltip>
            </div>
            <q-input
              v-model.number="mS.simTimeStep"
              type="number"
              standout
              class="ui-monitor-config-input"
              @change="setSimConfigs('simStepLength')"
            />
          </div>
          <div class="flex items-center justify-between ui-monitor-config-data">
            <div>
              仿真倍速
              <q-tooltip anchor="top right" self="center left">小于0则为尽速模式</q-tooltip>
            </div>
            <q-input
              v-model.number="mS.simSpeedRatio"
              type="number"
              standout
              class="ui-monitor-config-input"
              @change="setSimConfigs('simSpeed')"
            />
          </div>
        </div>
        <div class="ui-monitor-config">
          <div class="flex items-center justify-between ui-monitor-config-data">
            <div>当前仿真时间</div>
            <q-input v-model="mS.simCurrentTime" standout disable class="ui-monitor-config-input" />
          </div>
          <div class="flex items-center justify-between ui-monitor-config-data">
            <div>仿真时钟运行时长</div>
            <q-input v-model="mS.simDuration" standout disable class="ui-monitor-config-input" />
          </div>
          <div class="flex items-center justify-between ui-monitor-config-data">
            <div>墙上时钟运行时长</div>
            <q-input v-model="mS.realDuration" standout disable class="ui-monitor-config-input" />
          </div>
        </div>
      </div>
    </div>
    <!-- 控制台 -->
    <div class="ui-monitor-terminal">
      <div v-for="msg in mS.simMessages" :key="msg.time" class="row q-mb-sm">
        <span class="q-mr-sm">【 {{ msg.time }} 】</span>
        <span :class="`text-${msg.type}`">{{ msg.msg }}</span>
      </div>
    </div>
    <!-- 多节点分发控制弹窗 -->
    <q-dialog v-model="isDistribute">
      <q-card style="width: 700px; max-width: 80vw">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">节点设计</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <UINodeDesignVue :entityAry="entityAry" :nodeTreeAry="nodeTreeAry" @close="close"> </UINodeDesignVue
        ></q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>
<style scoped lang="less">
.ui-monitor-control {
  width: 900px;
  padding-top: 66px;
}
.ui-monitor-bar {
  width: 100%;
  height: 35px;
  border-radius: 17.5px;
  margin-bottom: 20px;

  > div {
    cursor: pointer;
    flex: 1;
    line-height: 35px;
    text-align: center;
  }
}
.ui-monitor-icon-ctrl {
  margin-left: 44px;
}
.ui-monitor-icon-ctrl.ui-monitor-icon-disabled {
  cursor: not-allowed !important;
  opacity: 0.5;
}
.ui-monitor-icon-extra {
  margin-right: 75px;
}
.ui-monitor-train {
  width: 100%;
  padding-top: 40px;
}
.ui-monitor-train-number {
  font-size: 28px;
}
.ui-monitor-train-progress {
  color: #3ecc87;
  margin-top: 10px;
}

.ui-monitor-configs {
  padding-top: 50px;
}
.ui-monitor-config {
  width: 400px;
}
.ui-monitor-config-data {
  padding: 12px 0;
}
.ui-monitor-config-input {
  width: 263px;
  height: 36px;
  border-radius: 4px;
}
:deep(.ui-monitor-config-input input) {
  color: white !important;
}
:deep(.ui-monitor-config-input .q-field__control) {
  height: 36px;
  background-color: var(--q-negative) !important;
}
:deep(.ui-monitor-config-input .q-field__prepend),
:deep(.ui-monitor-config-input .q-field__append) {
  height: 36px;
}
.ui-monitor-terminal {
  width: 920px;
  height: 360px;
  overflow-y: scroll;
  border-top: 1px solid var(--q-negative);
  padding: 20px 0px 100px;
  font-size: 16px;
  margin: 0 auto;
  margin-bottom: 30px;
}
.ui-monitor-terminal::-webkit-scrollbar {
  background-color: transparent;
}
.ui-monitor-terminal::-webkit-scrollbar-track {
  margin: 0;
  background-color: transparent;
}
.ui-monitor-terminal::-webkit-scrollbar-thumb {
  border-radius: 0;
}
:deep(.q-toggle__inner) {
  margin-left: 0.8em;
}
</style>
