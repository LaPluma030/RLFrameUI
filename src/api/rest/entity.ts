import service from "./axios"

// 获取仿真实体的详细信息
interface GetEntitiesResponse {
  msg: string;
  data: {
    id: string;
    configFile: string;
  }[];
}

export async function getEntities(addr: string, ids: string[]) {
  const response = await service({
    method: "POST",
    url: `${addr}/api/model/unpack`,
    data: {
      ids,
      types: [1],
    },
  });
  return response.data as GetEntitiesResponse;
}
