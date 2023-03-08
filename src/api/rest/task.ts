import service from "./axios";

interface Task extends CreateTaskRequest {
  id: number;
  createTime: string;
  updateTime: string;
}

// 通用返回类型
interface TaskCommonResponse {
  msg: string;
  data: null;
}

// 新建任务
interface CreateTaskRequest {
  expDesignId: number;
  name: string;
  description: string;
  batchSize: number;
  memorySize: number;
  replaceFrequency: number;
  smartModel: {
    id: string;
    name: string;
    displayName: string;
    optServAddr: string;
    simModelIds: string[];
  }[];
}
interface CreateTaskResponse {
  msg: string;
  data: number; // 新建的id
}

export async function createTask(addr: string, data: CreateTaskRequest) {
  const response = await service({
    method: "POST",
    url: `${addr}/api/intelligentTask`,
    data,
  });
  return response.data as CreateTaskResponse;
}

// 获取任务列表
interface GetTaskListResponse {
  msg: string;
  data: {
    count: number;
    list: Task[];
  };
}

export async function getTaskList(addr: string) {
  const response = await service({
    method: "POST",
    url: `${addr}/api/intelligentTask/search`,
    data: {},
  });
  console.log(response);
  return response.data as GetTaskListResponse;
}

// 获取单个任务
interface GetTaskResponse {
  msg: string;
  data: Task;
}

export async function getTask(addr: string, id: number) {
  const response = await service({
    method: "GET",
    url: `${addr}/api/intelligentTask/${id}`,
  });
  return response.data as GetTaskResponse;
}

// 修改单个任务
interface UpdateTaskRequest extends Partial<CreateTaskRequest> {}

export async function updateTask(addr: string, id: number, data: UpdateTaskRequest) {
  const response = await service({
    method: "PUT",
    url: `${addr}/api/intelligentTask/${id}`,
    data,
  });
  return response.data as TaskCommonResponse;
}

// 删除单个任务
export async function deleteTask(addr: string, id: number) {
  const response = await service({
    method: "DELETE",
    url: `${addr}/api/intelligentTask/${id}`,
  });
  return response.data as TaskCommonResponse;
}
