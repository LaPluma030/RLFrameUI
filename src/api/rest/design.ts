import service from "./axios"
interface Design {
  id: number;
  scenarioId: number;
  name: string;
  description: string;
  method: string;
  factors: string;
  sampleSize: number;
  createTime: string;
  updateTime: string;
}

// 获取试验设计列表
interface GetDesignListResponse {
  msg: string;
  data: {
    count: number;
    list: Design[];
  };
}

export async function getDesignList(addr: string, scenarioId: number) {
  const response = await service({
    method: "POST",
    url: `${addr}/api/design/search`,
    data: {
      scenarioId,
      pageNum: 0,
      pageSize: 0,
    },
  });
  return response.data as GetDesignListResponse;
}

// 获取单个试验设计
interface GetDesignResponse {
  msg: string;
  data: Design;
}

export async function getDesign(addr: string, id: number) {
  const response = await service({
    method: "GET",
    url: `${addr}/api/design/${id}`,
  });
  return response.data as GetDesignResponse;
}
