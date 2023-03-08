import { createStorage, useStorage as baseUseStorage } from "./vue-storage";
import {
  createTask,
  updateTask,
  createModel,
  updateModel,
  getTaskList,
  getModelList,
  getScenarioList,
  getDesignList,
  getScenarioFile,
  getEntities,
} from "api";
import { deepCopy, getCreateUpdateTimeString, getTimeString, scenarioFile2Obj, modelConfigFile2Obj } from "utils";
const scenarioTemplate = {
  id: -1,
  name: "想定示例",
  description: "",
  createTime: getTimeString(),
  updateTime: getTimeString(),
  // 想定中涉及的实体列表，初始时可不解析，用户选中此想定时才解析想定文件，并将实体列表缓存到此处
  entities: [
    {
      id: "",
      modelID: "",
      name: "测试实体1",
      displayName: "测试实体",
      parameters: [
        {
          name: "",
          displayName: "",
          type: "",
          usage: "",
          value: "",
        },
      ],
    },
  ],
  // 从属于此想定的试验设计方案列表
  designs: [
    {
      id: -1,
      scenarioId: -1,
      name: "试验设计方案示例",
      method: "",
      factors: "",
      sampleSize: 0,
      description: "",
      createTime: getTimeString(),
      updateTime: getTimeString(),
    },
  ],
};
// 强化学习算法模型
const modelTemplate = {
  id: -1, //算法模型的id
  taskId: -1, //任务id
  name: "DQN示例模型",
  version: "v0",
  description: "本模型用于示例...",
  createTime: getTimeString(),
  updateTime: getTimeString(),
  modelID: "", //智能模型的id
  simModel: [] as {
    id: string; //仿真模型的id
    status: string[]; //仿真模型的状态数据
    action: {
      name: string;
      bound: number;
      shift: number;
    }[]; //仿真模型的动作数据
  }[],
  statusDimension: 0, // 状态维度
  actionDimension: 0, // 动作维度
  inferenceDimension: 0, // 推理维度
  inferenceArch: "", // 推理网络结构
  inferenceVar: "", // 推理网络参数
  fullContent: "", // 整体网络结构与参数
  // 模型元数据
  metadata: {
    NNtype: "DQN", // "DQN" | "DoubleDQN" | "DDPG" | "mDDPG" | "A3C" | "PPO"
    // 奖励函数定义
    reward: `import numpy as np

def reward_func(s: np.ndarray, a: np.ndarray, s_: np.ndarray) -> float:
    '''编写奖励函数.

    Args:
        s: 上一状态向量.
        s: 动作向量.
        s_: 当前状态向量.

    Returns:
        奖励值.
    '''
    return 1.0`,
    // 模型结构--神经网络配置中的网络超参数
    structure: [
      {
        forinference: true,
        initialization: "heNormal", // "heUniform"|"heNormal"|"glorotNormal"|"GlorotUniform"|"constant"|"ones"|"orthogonal"|"randomUniform"|"truncateNormal"|"zeros"
        optimizer: "Adam", // "RMSprop", "Nadam", "SGD", "Ftrl", "Adam", "Adamax", "Adagrad", "Adadelta"
        learningRate: 0.001,
        learningRateDecay: "",
        loss: "MeanSquaredLogarithmicError", // "MeanAbsoluteError"|"MeanAbsolutePercentageError"|"MeanSquaredError"|"MeanSquaredLogarithmicError"|"CategoricalCrossentropy"|"SparseCategoricalCrossentropy"|"BinaryCrossentropy"|"Hinge"|"CategoricalHinge|Poisson|SquaredHinge|LogCosh|KLDivergence|Hube"
        lossFunction: "",
        earlyStop: "none", // "baseOnLoss"|"baseOnProgress"|"baseOnError"|"none"
        earlyStopFunction: "",
        // 网络层级定义
        layers: [
          {
            layerType: "input", // "input"|"affine"|"output" // 层类型
            neutralAmount: 1, // 神经元数目
            activator: "none", // "elu"|"exponential"|"gelu"|"get"|"hard_sigmoid"|"linear"|"relu"|"selu"|"serialize"|"sigmoid"|"softmax"|"softplus"|"softsign"|"swish"|"tanh" // 激活函数
            appendixType: "none", // "dropout"|"normalbatch"|"ic"|"none" // 附加层类型
            appendixParam: 0, // 附加层参数：丢弃概率
          },
          {
            layerType: "affine", // "input"|"affine"|"output" // 层类型
            neutralAmount: 1, // 神经元数目
            activator: "none", // "elu"|"exponential"|"gelu"|"get"|"hard_sigmoid"|"linear"|"relu"|"selu"|"serialize"|"sigmoid"|"softmax"|"softplus"|"softsign"|"swish"|"tanh" // 激活函数
            appendixType: "none", // "dropout"|"normalbatch"|"ic"|"none" // 附加层类型
            appendixParam: 0, // 附加层参数：丢弃概率
          },
          {
            layerType: "output",
            neutralAmount: 1,
            activator: "relue",
            appendixType: "none",
            appendixParam: 0,
          },
        ],
      },
    ],
  },
};
interface smartModel {
  id: string;
  name: string;
  displayName: string;
  optServAddr: string;
  simModelIds: string[];
}
const taskTemplate = {
  id: -1,
  expDesignId: -1,
  name: "任务示例",
  description: "本任务仅用作示例...",
  createTime: getTimeString(),
  updateTime: getTimeString(),
  batchSize: 64, // 训练批尺寸
  memorySize: 10000, // 存储服务容量
  replaceFrequency: 100, // 网络参数替换周期
  model: null as unknown as typeof modelTemplate[], //强化学习算法模型
  // 以下三个属性均为对象的索引，便于前端处理业务逻辑时的索引操作
  scenario: null as unknown as Scenario, // 想定的引用，在initTasks时绑定，在打开TaskInfo组件时随之修改
  design: null as unknown as Design, // 试验设计的引用，在initTasks时绑定，在打开TaskInfo组件时随之修改
  smartModel: null as unknown as smartModel[], //当前任务的智能模型
};

// 导出常用的类型
export type Scenario = typeof scenarioTemplate;
export type Design = Scenario["designs"][number];
export type Entity = Scenario["entities"][number];
export type Parameter = Entity["parameters"][number];
export type ModelTemplate = typeof modelTemplate;
export type Task = typeof taskTemplate;
export type Model = Task["model"];
export type Network = Model[number]["metadata"]["structure"][number];
export type Layer = Network["layers"][number];
export type SmartModel = smartModel;
const storage = createStorage({
  data: {
    /* 数据 */
    // 系统设置
    systemSettings: {
      ctrlServAddr: "127.0.0.1:8080", // 仿真运控服务地址
      dataServAddr: "127.0.0.1:8002", // 仿真数据服务地址
      resServAddr: "127.0.0.1:8001", // 仿真资源服务地址
      infServAddr: "127.0.0.1:50052", // 推理服务地址
      infServRawAddr: "127.0.0.1:50052", // 推理服务未经envoy代理的原始地址
      memServAddr: "127.0.0.1:8081", // 存储服务地址
      memServRawAddr: "127.0.0.1:50053", // 存储服务未经envoy代理的原始地址
      tbServAddr: "127.0.0.1:6006", // Tensorboard 地址
      // servCheckPeriod: 60, // 服务状态检查周期，单位：秒
      maxTerminalMsgs: 200, // 控制台消息数目最大值
      cacheDateExpire: 5, // 关闭页面时缓存数据有效期限，单位：秒
    },
    // 过程监控
    monitorStatus: {
      // 只读
      simState: "Stopped", // 仿真状态："Stopped" | "Running" | "Suspend"
      simCurrentTime: "", // 当前仿真时间：年/月/日 时:分:秒
      simDuration: "", // 仿真时钟运行时长：时:分:秒
      realDuration: "", // 墙上时钟运行时长：时:分:秒
      simTotalEpisodes: 0, // 总局数：design.sampleSize
      simCurEpisodes: 0, // 当前局数：sysinfo.current_sample_id
      simMessages: [{ time: getTimeString(), type: "info", msg: "UI 加载成功" }], // 控制台消息列表
      // 可输入
      simStartTime: getTimeString(), // 仿真开始时间：年/月/日 时:分:秒
      simEpisodeDuration: 60, // 单局运行最大时长，单位为秒
      simTimeStep: 10, // 仿真步长，单位 ms
      simSpeedRatio: 1.0, // 仿真倍速，小于0为尽速模式（能跑多快跑多快）
    },
    // 最近任务列表（存储在本地）
    recentTasks: [
      {
        id: -1,
        name: "任务示例任务示例任务示例任务示例任务示例任务示例",
        createTime: getTimeString(),
        updateTime: getTimeString(),
        description: "本任务仅用作示例...",
      },
    ],
    // 所有任务列表
    isTasksInited: false, // 任务列表是否已经初始化
    tasks: [deepCopy(taskTemplate)],
    // 所有想定列表
    isScenariosInited: false, // 想定列表是否已经初始化
    scenarios: [deepCopy(scenarioTemplate)],
    // 任务模板，包含默认配置
    taskTemplate,
    // 想定模板，包含默认配置
    scenarioTemplate,
    // 智能模型模板
    modelTemplate,
    // 当前任务操作flag:add-新建任务;open-打开任务;close-关闭任务;save-保存任务
    isTaskFlag: "",
    // 当前是否打开任务
    isTaskOpen: false,
    // 当前任务是否为新建任务
    isTaskNew: true,
    // 当前打开任务，没有打开时包含一些占位属性避免 ts 报错
    currentTask: deepCopy(taskTemplate),
  },
  methods: {
    /* 方法 */
    // 增加一条控制台消息，上限可设置
    addSimMsg(msg: string, type: "info" | "warning" | "error" = "info") {
      const messages = this.monitorStatus.simMessages;
      messages.push({
        time: getTimeString(),
        type,
        msg,
      });
      if (messages.length > this.systemSettings.maxTerminalMsgs) {
        messages.shift();
      }
    },
    // 将新建的或打开的任务加入到最近任务列表，上限为12个（便于显示）
    setTaskIntoRecent(id: number) {
      const idx = this.recentTasks.findIndex((e) => e.id === id);
      if (idx >= 0) {
        //打开已有任务
        this.recentTasks.splice(idx, 1); //先把当前任务从之前的位置删掉
      }
      const task = this.tasks.find((e) => e.id === id);
      if (task) {
        let tempRecentTask = {
          id: task.id,
          name: task.name,
          createTime: task.createTime,
          updateTime: task.updateTime,
          description: task.description,
        };
        this.recentTasks.unshift(tempRecentTask);
      }
      if (this.recentTasks.length > 12) {
        //如果大于12个，就把最后一个去掉
        this.recentTasks.pop();
      }
    },
    // 打开任务的处理逻辑
    async openTask(id: number) {
      const task = this.tasks.find((e) => e.id === id);
      console.log(this.tasks, "this.tasksthis.tasksthis.tasks");
      if (task) {
        task.model = [];
        // 获取该任务的模型列表
        const models = (await getModelList(this.systemSettings.resServAddr, { taskId: id })).data.list;
        if (models.length > 0) {
          console.log(models, "modelsmodels");
          models.forEach((model) => {
            // 时间数据转换
            const [createTime, updateTime] = getCreateUpdateTimeString(model.createTime, model.updateTime);
            // 模型赋值
            let tempObj = {
              id: model.id,
              taskId: model.taskId,
              name: model.name,
              version: model.version,
              description: model.description,
              createTime: createTime,
              updateTime: updateTime,
              modelID: model.modelID,
              simModel: model.simModel,
              statusDimension: model.statusDimension,
              actionDimension: model.actionDimension,
              inferenceDimension: model.inferenceDimension,
              inferenceArch: model.inferenceArch,
              inferenceVar: model.inferenceVar,
              fullContent: model.fullContent,
              metadata: model.metadata,
            };
            console.log(task.model, "task.modeltask.modeltask.model");
            if (task.model) {
              task.model.push(tempObj);
            } else {
              task.model = [tempObj];
            }
          });
        } else {
          throw new Error(`此任务没有模型`);
        }
        // 其他设置
        this.currentTask = deepCopy(task);
        this.currentTask.scenario = task.scenario;
        this.currentTask.design = task.design;
        this.currentTask.smartModel = task.smartModel;
        console.log(this.currentTask, "currentTaskcurrentTaskcurrentTaskcurrentTask");

        this.setTaskIntoRecent(id);
        this.isTaskOpen = true;
        this.isTaskNew = false;
        console.log("Task opened!");
      } else {
        throw new Error(`不存在id为 ${id} 的任务`);
      }
    },
    // 保存任务的处理逻辑
    async saveTask() {
      // 简写
      const addr = this.systemSettings.resServAddr;
      const t = this.currentTask;
      const m = t.model;
      // 区分任务是否为新建
      if (this.isTaskNew) {
        // 设置新建任务的id
        t.id = (
          await createTask(addr, {
            expDesignId: t.design.id,
            name: t.name,
            description: t.description,
            batchSize: t.batchSize,
            memorySize: t.memorySize,
            replaceFrequency: t.replaceFrequency,
            smartModel: t.smartModel,
          })
        ).data;
        // 设置新建模型的id ，m是多个模型，那么返回id应该是一个数组，和modelID进行对应 ，TODO:多模型
        let tempList: any = [];
        m.forEach((item) => {
          let temoObj = {
            name: item.name,
            version: item.version,
            description: item.description,
            modelID: item.modelID,
            simModel: item.simModel,
            statusDimension: item.statusDimension,
            actionDimension: item.actionDimension,
            inferenceDimension: item.inferenceDimension,
            inferenceArch: item.inferenceArch,
            inferenceVar: item.inferenceVar,
            fullContent: item.fullContent,
            metadata: item.metadata,
          };
          tempList.push(temoObj);
        });
        let data = (await createModel(addr, tempList, t.id)).data;
        m.forEach((item, index) => {
          item.id = data[index];
        });
        // 将新建的任务加入任务列表和最近任务
        if (this.tasks.findIndex((item) => item.id === this.currentTask.id) < 0) {
          this.tasks.push(this.currentTask);
          this.setTaskIntoRecent(t.id);
        } else {
          throw new Error("新建任务的Id和已有任务id相同");
        }
      } else {
        // 更新任务
        await updateTask(addr, t.id, {
          expDesignId: t.design.id,
          name: t.name,
          description: t.description,
          batchSize: t.batchSize,
          memorySize: t.memorySize,
          replaceFrequency: t.replaceFrequency,
          smartModel: t.smartModel,
        });
        // 更新模型
        let tempNewList: any = []; //需要新增的模型列表
        let newList: Model = [];
        let tempUpdateList: any = []; //需要修改的模型列表
        m.forEach((item) => {
          let temoObj: any = {
            name: item.name,
            version: item.version,
            description: item.description,
            modelID: item.modelID,
            simModel: item.simModel,
            statusDimension: item.statusDimension,
            actionDimension: item.actionDimension,
            inferenceDimension: item.inferenceDimension,
            inferenceArch: item.inferenceArch,
            inferenceVar: item.inferenceVar,
            fullContent: item.fullContent,
            metadata: item.metadata,
          };
          if (item.id == -1) {
            tempNewList.push(temoObj);
            newList.push(item);
          } else {
            temoObj.id = item.id;
            tempUpdateList.push(temoObj);
          }
        });
        console.log(tempUpdateList, "tempUpdateListtempUpdateList");

        if (tempUpdateList.length > 0) await updateModel(addr, t.id, tempUpdateList);
        if (tempNewList.length > 0) {
          let data = (await createModel(addr, tempNewList, t.id)).data;
          newList.forEach((item, index) => {
            item.id = data[index];
          });
        }
        let findIndex = this.tasks.findIndex((e) => {
          return e.id == t.id;
        });
        if (findIndex > -1) {
          this.tasks[findIndex] = deepCopy(this.currentTask);
          const t = this.tasks[findIndex];
          t.scenario = this.currentTask.scenario;
          t.design = this.currentTask.design;
          t.smartModel = this.currentTask.smartModel;
        }
        let recentIndex = this.recentTasks.findIndex((e) => {
          return e.id == t.id;
        });
        if (recentIndex > -1) {
          const r = this.recentTasks[recentIndex];
          r.name = this.currentTask.name;
          r.description = this.currentTask.description;
          r.updateTime = this.currentTask.updateTime;
          t.createTime = this.currentTask.createTime;
        }
      }
      // 其他设置
      t.updateTime = getTimeString();
      this.isTaskOpen = true;
      this.isTaskNew = false;
      console.log("Task saved!");
    },
    // 初始化数据
    async initialize() {
      if (!this.isScenariosInited) {
        await this.initScenarios();
        this.isScenariosInited = true;
      }
      if (!this.isTasksInited) {
        await this.initTasks();
        this.isTasksInited = true;
      }
    },
    // 初始化任务数据
    async initTasks() {
      const addr = this.systemSettings.resServAddr;
      const tempTasks = (await getTaskList(addr)).data.list; // 获取原始任务列表

      this.tasks.splice(0); // 清除任务列表中的占位值
      // 处理原始任务数据
      tempTasks.forEach((taskItem) => {
        const tempTaskObj = {} as Task;
        tempTaskObj.id = taskItem.id;
        tempTaskObj.expDesignId = taskItem.expDesignId;
        tempTaskObj.name = taskItem.name;
        tempTaskObj.description = taskItem.description;
        const [taskCreateTime, taskUpdateTime] = getCreateUpdateTimeString(taskItem.createTime, taskItem.updateTime);
        tempTaskObj.createTime = taskCreateTime;
        tempTaskObj.updateTime = taskUpdateTime;
        tempTaskObj.batchSize = taskItem.batchSize;
        tempTaskObj.memorySize = taskItem.memorySize;
        tempTaskObj.replaceFrequency = taskItem.replaceFrequency;
        tempTaskObj.smartModel = taskItem.smartModel;
        // 初始化scenario的引用
        const tempScenario = this.scenarios.find((scenarioItem) =>
          scenarioItem.designs.find((designItem) => designItem.id === taskItem.expDesignId)
        );
        if (tempScenario) {
          tempTaskObj.scenario = tempScenario;
          // 初始化design的引用
          const tempDesign = tempScenario.designs.find((designItem) => designItem.id === taskItem.expDesignId);
          if (tempDesign) {
            tempTaskObj.design = tempDesign;
          }
          // 暂不初始化entity的引用，延迟到打开TaskInfo等组件时
        } else {
          console.log(`找不到id为 ${taskItem.expDesignId} 的试验设计方案`);
        }
        tempTaskObj.model = [] as ModelTemplate[]; // 暂不初始化模型，延迟到打开某个任务时
        this.tasks.push(tempTaskObj);
      });
    },
    // 初始化想定数据
    async initScenarios() {
      const addr = this.systemSettings.resServAddr;
      const tempScenarios = (await getScenarioList(addr)).data.list; // 获取原始想定列表
      const tempPromiseArray = [] as ReturnType<typeof getDesignList>[]; // 定义一个promise数组，获取原始试验设计信息
      tempScenarios.forEach((item) => {
        tempPromiseArray.push(getDesignList(addr, item.id));
      });
      const tempDesigns = await Promise.all(tempPromiseArray); // 等所有请求都完成，获得一个GetDesignListResponse的列表，顺序与请求时一致

      this.scenarios.splice(0); // 清除想定列表中的占位值
      // 处理原始想定数据
      tempScenarios.forEach((scenarItem, index) => {
        const tempScenarioObj = {} as Scenario;
        tempScenarioObj.id = scenarItem.id;
        tempScenarioObj.name = scenarItem.name;
        tempScenarioObj.description = scenarItem.scenarioDescription;
        // 转换时间字符串
        const [scenarioCreateTime, scenarioUpdateTime] = getCreateUpdateTimeString(
          scenarItem.createTime,
          scenarItem.updateTime
        );
        tempScenarioObj.createTime = scenarioCreateTime;
        tempScenarioObj.updateTime = scenarioUpdateTime;
        tempScenarioObj.entities = []; // 先不解析想定，对实体列表的获取延迟到打开TaskInfo等组件时
        // 处理原始试验设计数据
        tempScenarioObj.designs = [];
        tempDesigns[index].data.list.forEach((designItem) => {
          const tempDesignObj = {} as Design;
          tempDesignObj.id = designItem.id;
          tempDesignObj.scenarioId = designItem.scenarioId;
          tempDesignObj.name = designItem.name;
          tempDesignObj.method = designItem.method;
          tempDesignObj.factors = designItem.factors;
          tempDesignObj.sampleSize = designItem.sampleSize;
          tempDesignObj.description = designItem.description;
          const [designCreateTime, designUpdateTime] = getCreateUpdateTimeString(designItem.createTime, designItem.updateTime);
          tempDesignObj.createTime = designCreateTime;
          tempDesignObj.updateTime = designUpdateTime;
          tempScenarioObj.designs.push(tempDesignObj);
        });
        this.scenarios.push(tempScenarioObj);
      });
    },
    // 初始化某个想定的实体列表
    async initEntities(scenario: Scenario) {
      const addr = this.systemSettings.resServAddr;
      // 获取并解析想定文件
      const scenarioFile = (await getScenarioFile(addr, scenario.id)).data.scenarioFile;
      const scenarioDetail = scenarioFile2Obj(scenarioFile);
      console.log(scenarioDetail, "得到想定文件");
      // 获取所有modelID
      const modelIDList = [] as string[];
      if (scenarioDetail) {
        scenarioDetail.entities.forEach((entity) => {
          // modelID可能在实体的属性里
          if (entity.modelID) {
            modelIDList.push(entity.modelID);
          }
          // modelID可能在参数列表里
          entity.parameters.forEach((param) => {
            if (param.type == "ModelID") {
              if (param.value) {
                modelIDList.push(param.value);
              }
            }
          });
        });
      }
      // 数组去重
      const uniqueModelIDList = [] as string[];
      for (let i = 0; i < modelIDList.length; i++) {
        if (uniqueModelIDList.indexOf(modelIDList[i]) === -1) {
          uniqueModelIDList.push(modelIDList[i]);
        }
      }
      // 获取原始实体列表
      const rawEntities = (await getEntities(addr, uniqueModelIDList)).data;
      // 赋值
      scenario.entities = rawEntities.map((item) => {
        const entity = modelConfigFile2Obj(item.configFile)!;
        entity.modelID = item.id; // 解析出来的实体modelID可能为空，此处显式赋值
        return entity;
      });
    },
  },
});

export function useStorage() {
  return baseUseStorage(storage.$injectKey);
}

export default storage;
