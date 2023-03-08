import service from "./axios";

// 设置需转换的数据
interface SetDataProcessRequest {
  modelID: string;
  status: string[];
  action: {
    name: string;
    bound: number;
    shift: number;
  }[];
}
interface SetDataProcessResponse {
  code: number;
  data: object;
  msg: string;
}

export async function setDataProcess(addr: string, data: SetDataProcessRequest[]) {
  const response = await service({
    method: "POST",
    url: `${addr}/api/dataProcess`,
    data,
  });
  return response.data as SetDataProcessResponse;
}
