import { ClientReadableStream } from "grpc-web";
import { SimControllerClient } from "./engine-controller/EngineServiceClientPb";
import Engine from "./engine-controller/engine_pb";

import timestamp_pb from "./engine-controller/timestamp_pb";
import duration_pb from "./engine-controller/duration_pb";

const Timestamp = timestamp_pb.Timestamp;
const Duration = duration_pb.Duration;
console.log(Engine, "Engine");
// 获取所有引擎下面的节点
export async function getAllNodes(addr: string) {
  addr = `https://${addr}`;
  const client = new SimControllerClient(addr);
  const request = new Engine.CommonRequest();
  try {
    let nodesList = (await client.getAllNode(request, {})).getNodesList();
    return nodesList;
  } catch (error: any) {
    console.log(error.code);
    console.log(error.message);
    if (error.code == 2) {
      // 说明是路径错误,更换地址
      addr = addr.replace(/https/, "http");
      const client = new SimControllerClient(addr);
      let nodesList = (await client.getAllNode(request, {})).getNodesList();
      return nodesList;
    } else throw new Error(error.message);
  }
}
//  获取模型实体列表
export async function getEntityList(addr: string, taskId: number) {
  addr = `https://${addr}`;
  const client = new SimControllerClient(addr);
  const request = new Engine.EntityListRequest();
  request.setTaskId(taskId);
  try {
    let getEntityListList = (await client.getEntityList(request, {})).getEntityListJson();
    return getEntityListList;
  } catch (error: any) {
    console.log(error.code);
    console.log(error.message);
    if (error.code == 2) {
      // 说明是路径错误,更换地址
      addr = addr.replace(/https/, "http");
      const client = new SimControllerClient(addr);
      let getEntityListList = (await client.getEntityList(request, {})).getEntityListJson();
      return getEntityListList;
    } else throw new Error(error.message);
  }
}
// 初始化引擎
export async function initEngine(addr: string, expDesignId: number, nodeDesignAry: any) {
  addr = `https://${addr}`;
  const client = new SimControllerClient(addr);
  const request = new Engine.InitInfo();
  const multiSample = new Engine.InitInfo.MultiSample();
  multiSample.setExpDesignId(expDesignId);
  console.log(addr, "初始化引擎", expDesignId, request);
  if (nodeDesignAry && nodeDesignAry.length > 0) {
    let designResult = singleSample(nodeDesignAry);
    multiSample.setNodesList(designResult);
  }
  request.setMultiSampleConfig(multiSample);
  try {
    return await client.init(request, {});
  } catch (error: any) {
    console.log(error.code);
    console.log(error.message);
    if (error.code == 2) {
      // 说明是路径错误,更换地址
      addr = addr.replace(/https/, "http");
      const client = new SimControllerClient(addr);
      return await client.init(request, {});
    } else throw new Error(error.message);
  }
}
// 单样本 多节点 初始化参数处理函数
const singleSample = (ary: any[]) => {
  console.log("entityAry", ary);
  let result: Engine.NodeDesign[] = [];
  ary.forEach((item) => {
    console.log(item, "sim_controller.js");

    const nodeDesign = new Engine.NodeDesign();
    let entityAry: Engine.Entity[] = [];
    item.children.forEach((ele: { uid: string; model_id: string }) => {
      const entityValue = new Engine.Entity(); //entity对象
      entityValue.setId(ele.uid); // id
      entityValue.setModelId(ele.model_id); // 模型类型id
      entityAry.push(entityValue);
    });
    nodeDesign.setAddress(item.label); // 设置address
    nodeDesign.setEntitiesList(entityAry);
    result.push(nodeDesign);
  });
  return result;
};
// 控制引擎
export async function controlEngine(addr: string, cmd: "START" | "SUSPEND" | "CONTINUE" | "STOP") {
  addr = `https://${addr}`;
  const client = new SimControllerClient(addr);
  const request = new Engine.ControlCmd();
  request.setRunCmd(Engine.ControlCmd.RunCmdType[cmd]);
  try {
    return await client.control(request, {});
  } catch (error: any) {
    if (error.code == 2) {
      // 说明是路径错误,更换地址
      addr = addr.replace(/https/, "http");
      const client = new SimControllerClient(addr);
      return await client.control(request, {});
    } else throw new Error(error.message);
  }
}

// 配置引擎参数
export async function configEngine(
  addr: string,
  configs: {
    simStartTime?: Date;
    simDuration?: number;
    timeStep?: number;
    speedRatio?: number;
  }
) {
  addr = `https://${addr}`;
  const client = new SimControllerClient(addr);
  const request = new Engine.ControlCmd();
  const responses: Promise<Engine.CommonResponse>[] = [];
  if (configs.simStartTime !== undefined) {
    request.setSimStartTime(Timestamp.fromDate(configs.simStartTime));
    responses.push(client.control(request, {}));
  }
  if (configs.simDuration !== undefined) {
    const duration = new Duration();
    duration.setSeconds(configs.simDuration);
    request.setSimDuration(duration);
    responses.push(client.control(request, {}));
  }
  if (configs.timeStep !== undefined) {
    request.setTimeStep(configs.timeStep);
    responses.push(client.control(request, {}));
  }
  if (configs.speedRatio !== undefined) {
    request.setSpeedRatio(configs.speedRatio);
    responses.push(client.control(request, {}));
  }
  try {
    await Promise.all(responses);
  } catch (error: any) {
    console.log(error.code, error.message);
    if (error.code == 2) {
      // 说明是路径错误,更换地址
      addr = addr.replace(/https/, "http");
      const client = new SimControllerClient(addr);
      const request = new Engine.ControlCmd();
      const responses: Promise<Engine.CommonResponse>[] = [];
      if (configs.simStartTime !== undefined) {
        request.setSimStartTime(Timestamp.fromDate(configs.simStartTime));
        responses.push(client.control(request, {}));
      }
      if (configs.simDuration !== undefined) {
        const duration = new Duration();
        duration.setSeconds(configs.simDuration);
        request.setSimDuration(duration);
        responses.push(client.control(request, {}));
      }
      if (configs.timeStep !== undefined) {
        request.setTimeStep(configs.timeStep);
        responses.push(client.control(request, {}));
      }
      if (configs.speedRatio !== undefined) {
        request.setSpeedRatio(configs.speedRatio);
        responses.push(client.control(request, {}));
      }
      return await Promise.all(responses);
    } else throw new Error(error.message);
  }
}

//设置推送态势数据
export async function configState(addr: string, cmd: "RECORD" | "REPLAY" | "CONVERSE") {
  addr = `https://${addr}`;
  const request = new Engine.ControlCmd();
  const client = new SimControllerClient(addr);
  request.setMode(Engine.ControlCmd.Mode[cmd]);
  try {
    return await client.control(request, {});
  } catch (error: any) {
    if (error.code == 2) {
      // 说明是路径错误,更换地址
      addr = addr.replace(/https/, "http");
      const client = new SimControllerClient(addr);
      return await client.control(request, {});
    } else throw new Error(error.message);
  }
}
// 持续获取引擎信息（返回流）
export async function getEngineInfo(addr: string) {
  const client = new SimControllerClient(addr);
  const request = new Engine.CommonRequest();
  return client.getSysInfo(request, {}) as ClientReadableStream<Engine.SysInfoResponse>;
}
// 持续获取引擎错误（返回流）
export async function getEngineError(addr: string) {
  const client = new SimControllerClient(addr);
  const request = new Engine.CommonRequest();
  return client.getErrorMsg(request, {}) as ClientReadableStream<Engine.CommonResponse>;
}
