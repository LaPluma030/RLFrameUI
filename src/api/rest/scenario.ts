import service from "./axios"

interface Scenario {
  id: number;
  name: string;
  scenarioDescription: string;
  createTime: string;
  updateTime: string;
}

// 获取想定列表
interface GetScenarioListResponse {
  msg: string;
  data: {
    count: number;
    list: Scenario[];
  };
}
export async function getScenarioList(addr: string) {
  const response = await service({
    method: "POST",
    url: `${addr}/api/scenario/search`,
    data: {
      types: [0],
      pageNum: 0,
      pageSize: 0,
    },
  });
  return response.data as GetScenarioListResponse;
}

// 获取单个想定
interface GetScenarioResponse {
  msg: string;
  data: {
    scenarioFile: string;
  };
}

export async function getScenarioFile(addr: string, id: number) {
  const response = await service({
    method: "POST",
    url: `${addr}/api/scenario/unpack`,
    data: {
      id,
      types: [1],
    },
  });
  return response.data as GetScenarioResponse;
}
