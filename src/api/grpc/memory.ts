import { MemoryServiceClient } from "./memory-service/MemoryServiceClientPb";
import Memory from "./memory-service/memory_pb";

// 初始化存储服务
export async function initMemory(
  addr: string,
  data: {
    statusDimension: number;
    actionDimension: number;
    memoryCapacity: number;
    rewardFunction: string;
    modelId: string;
  }[]
) {
  addr = `https://${addr}`;
  const client = new MemoryServiceClient(addr); //建立了一个服务端
  const request = new Memory.InitRequest(); //请求参数
  const InitModelList = [] as Memory.InitModel[];
  data.forEach((item) => {
    const im = new Memory.InitModel();
    im.setStatusdimension(item.statusDimension);
    im.setActiondimension(item.actionDimension);
    im.setRewardfunction(item.rewardFunction);
    im.setMemorycapacity(item.memoryCapacity);
    im.setModelid(item.modelId);
    InitModelList.push(im);
  });
  request.setInitmodelsList(InitModelList);
  try {
    return await client.initMemory(request, {});
  } catch (error: any) {
    console.log(error.code);
    if (error.code == 2) {
      // 说明是路径错误,更换地址
      addr = addr.replace(/https/, "http");
      const client = new MemoryServiceClient(addr);
      return await client.initMemory(request, {});
    } else throw new Error(error.message);
  }
}
//清除存储的数据
export async function resetMemory(addr: string) {
  addr = `https://${addr}`;
  const client = new MemoryServiceClient(addr);
  const request = new Memory.ResetRequest();
  try {
    return await client.resetMemory(request, {});
  } catch (error: any) {
    console.log(error.code, error.message);
    if (error.code == 2) {
      // 说明是路径错误,更换地址
      addr = addr.replace(/https/, "http");
      const client = new MemoryServiceClient(addr);
      return await client.resetMemory(request, {});
    } else throw new Error(error.message);
  }
}
