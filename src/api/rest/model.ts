import service from "./axios";

interface Model extends CreateModelRequest {
  id: number;
  taskId: number;
  createTime: string;
  updateTime: string;
}

// 通用返回类型
interface ModelCommonResponse {
  msg: string;
  data: null;
}

// 新建模型
interface CreateModelRequest {
  modelID: string;
  name: string;
  version: string;
  description: string;
  simModel: {
    id: string; //仿真模型的id
    status: string[]; //仿真模型的状态数据
    action: {
      name: string;
      bound: number;
      shift: number;
    }[];
  }[];
  statusDimension: number;
  actionDimension: number;
  inferenceDimension: number;

  inferenceArch: string;
  inferenceVar: string;
  fullContent: string;

  metadata: {
    NNtype: string;
    reward: string;
    structure: {
      forinference: boolean;

      initialization: string;

      optimizer: string;
      learningRate: number;
      learningRateDecay: string;

      loss: string;
      lossFunction: string;

      earlyStop: string;
      earlyStopFunction: string;

      layers: {
        layerType: string;
        neutralAmount: number;
        activator: string;
        appendixType: string;
        appendixParam: number;
      }[];
    }[];
  };
}

interface CreateModelResponse {
  msg: string;
  data: number[]; // 新建的id数组
}

export async function createModel(addr: string, data: CreateModelRequest[], taskId: number) {
  const response = await service({
    method: "POST",
    url: `${addr}/api/intelligentModel/add/${taskId}`,
    data,
  });
  return response.data as CreateModelResponse;
}

// 获取模型列表
interface GetModelListRequest {
  taskId?: number;
  statusDimension?: number;
  actionDimension?: number;
}

interface GetModelListResponse {
  msg: string;
  data: {
    count: number;
    list: Model[];
  };
}

export async function getModelList(addr: string, data: GetModelListRequest) {
  const response = await service({
    method: "POST",
    url: `${addr}/api/intelligentModel/search`,
    data,
  });
  return response.data as GetModelListResponse;
}

// 获取单个模型
interface GetModelResponse {
  msg: string;
  data: Model;
}

export async function getModel(addr: string, id: number) {
  const response = await service({
    method: "GET",
    url: `${addr}/api/intelligentModel/${id}`,
  });
  return response.data as GetModelResponse;
}

// 修改单个模型
interface UpdateModelRequest extends Partial<CreateModelRequest> {
  id: string;
}

export async function updateModel(addr: string, taskId: number, data: UpdateModelRequest[]) {
  const response = await service({
    method: "PUT",
    url: `${addr}/api/intelligentModel/${taskId}`,
    data,
  });
  return response.data as ModelCommonResponse;
}

// 删除单个模型
export async function deleteModel(addr: string, id: number) {
  const response = await service({
    method: "DELETE",
    url: `${addr}/api/intelligentModel/${id}`,
  });
  return response.data as ModelCommonResponse;
}
