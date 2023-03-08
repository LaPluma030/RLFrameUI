import { OptimizerServiceClient } from "./network-optimizer/OptimizerServiceClientPb";
import Optimizer from "./network-optimizer/optimizer_pb";

// 初始化优化服务
export async function initOptimizer(
  addr: string,
  data: {
    inputDimension: number;
    outputDimension: number;
    inferenceDimension: number;
    pushFrequency: number;

    memoryUrl: string;
    inferenceUrl: string;
    modelId: string;
    modelParams: {
      type: string; // "DQN" | "DoubleDQN" | "DDPG" | "mDDPG" | "A3C" | "PPO";
      batchSize: number;
      network: {
        subNetName: string;

        initialization: string; // "heUniform" | "heNormal" | "glorotNormal" | "GlorotUniform" | "constant" | "ones" | "orthogonal" | "randomUniform" | "truncateNormal" | "zeros";

        optimizer: string; // "adam" | "bgd" | "sgd" | "mbgd" | "momentum" | "nag" | "adagrad" | "adadelta" | "rmsprop";  拼写有误？
        learningRate: number;
        learningRateDecay: string;

        loss: string; // "zeroOne" | "hinge" | "log" | "exponential" | "perceptron" | "crossentropy" | "abs" | "square" | "mse";
        lossFunction: string;

        earlyStop: string; // "baseOnLoss" | "baseOnProgress" | "baseOnError" | "none";
        earlyStopFunction: string;

        layers: {
          type: string; // "input" | "affine" | "output";
          neutralAmount: number;
          activator: string; // "relue" | "tanh" | "softsign" | "sigmoid" | "none";
          appendix: {
            appendixType: string; // "dropout" | "normalbatch" | "ic" | "none";
            param: number;
          };
        }[];
      }[];
    };
    simModel: {
      id: string; //仿真模型的id
      status: string[]; //仿真模型的状态数据
      action: {
        name: string;
        bound: number;
        shift: number;
      }[]; //仿真模型的动作数据
    }[];
  }[]
) {
  addr = `https://${addr}`;
  const client = new OptimizerServiceClient(addr);
  const request = new Optimizer.InitRequest();
  const modelList = [] as Optimizer.Model[];
  data.forEach((item) => {
    const model = new Optimizer.Model();
    model.setInputdimension(item.inputDimension);
    model.setOutputdimension(item.outputDimension);
    model.setInferencedimension(item.inferenceDimension);
    model.setPushfrequency(item.pushFrequency);
    model.setMemoryurl(item.memoryUrl);
    model.setInferenceurl(item.inferenceUrl);
    model.setModelid(item.modelId);
    const modelParams = new Optimizer.NNModel();
    modelParams.setType(
      Optimizer.NNModel.ModelType[item.modelParams.type.toUpperCase() as keyof typeof Optimizer.NNModel.ModelType]
    );
    modelParams.setBatchsize(item.modelParams.batchSize);
    modelParams.setModelid(item.modelId);
    const networks = item.modelParams.network;
    const nets = [] as Optimizer.Network[];
    for (const net of networks) {
      const n = new Optimizer.Network();
      n.setSubnetname(net.subNetName);
      n.setInitialization(
        Optimizer.Network.Initialization[net.initialization.toUpperCase() as keyof typeof Optimizer.Network.Initialization]
      );
      n.setOptimizer(Optimizer.Network.Optimizer[net.optimizer.toUpperCase() as keyof typeof Optimizer.Network.Optimizer]);
      n.setLearningrate(net.learningRate);
      n.setLearningratedecay(net.learningRateDecay);
      n.setLoss(Optimizer.Network.Loss[net.loss.toUpperCase() as keyof typeof Optimizer.Network.Loss]);
      n.setLossfunction(net.lossFunction);
      n.setEarlystop(Optimizer.Network.EarlyStop[net.earlyStop.toUpperCase() as keyof typeof Optimizer.Network.EarlyStop]);
      n.setEarlystopfunction(net.earlyStopFunction);

      const layers = [] as Optimizer.Layer[];
      for (const layer of net.layers) {
        const l = new Optimizer.Layer();
        l.setType(Optimizer.Layer.LayerType[layer.type.toUpperCase() as keyof typeof Optimizer.Layer.LayerType]);
        l.setNeutralamount(layer.neutralAmount);
        l.setActivator(Optimizer.Layer.Activator[layer.activator.toUpperCase() as keyof typeof Optimizer.Layer.Activator]);

        const ad = new Optimizer.Layer.Appendix();
        ad.setAppendixtype(
          Optimizer.Layer.Appendix.AppendixType[
            layer.appendix.appendixType.toUpperCase() as keyof typeof Optimizer.Layer.Appendix.AppendixType
          ]
        );
        ad.setParam(layer.appendix.param);
        l.setAppendix(ad);
        layers.push(l);
      }
      n.setLayersList(layers);
      nets.push(n);
    }
    modelParams.setNetworkList(nets);
    model.setModelparams(modelParams);
    const simModelList = [] as Optimizer.SimModel[];
    item.simModel.forEach((simiItem) => {
      const sim = new Optimizer.SimModel();
      sim.setId(simiItem.id);
      sim.setStatusList(simiItem.status);
      const actionList = [] as Optimizer.SimAction[];
      simiItem.action.forEach((act) => {
        const action = new Optimizer.SimAction();
        action.setName(act.name);
        action.setBound(act.bound);
        action.setShift(act.shift);
        actionList.push(action);
      });
      sim.setActionList(actionList);
      simModelList.push(sim);
    });
    model.setSimmodelList(simModelList);
    modelList.push(model);
  });
  request.setModelsList(modelList);
  try {
    return await client.initOptimizer(request, {});
  } catch (error: any) {
    console.log(error.code, error.message);
    if (error.code == 2) {
      // 说明是路径错误,更换地址
      addr = addr.replace(/https/, "http");
      const client = new OptimizerServiceClient(addr);
      return await client.initOptimizer(request, {});
    } else throw new Error(error.message);
  }
}
//控制优化服务
export async function controlOptimizer(addr: string, cmd: "START" | "SUSPEND" | "CONTINUE" | "STOP") {
  addr = `https://${addr}`;
  const client = new OptimizerServiceClient(addr);
  const request = new Optimizer.ControlRequest();
  request.setRunCmd(Optimizer.ControlRequest.RunCmdType[cmd]);
  try {
    return await client.control(request, {});
  } catch (error: any) {
    console.log(error.message);
    if (error.code == 2) {
      // 说明是路径错误,更换地址
      addr = addr.replace(/https/, "http");
      const client = new OptimizerServiceClient(addr);
      return await client.control(request, {});
    } else throw new Error(error.message);
  }
}
// //保存权重参数
export async function saveModelParameters(
  addr: string,
  data: {
    type: string; // "DQN" | "DoubleDQN" | "DDPG" | "mDDPG" | "A3C" | "PPO";
    batchSize: number;
    modelId: string;
    network: {
      subNetName: string;

      initialization: string; // "heUniform" | "heNormal" | "glorotNormal" | "GlorotUniform" | "constant" | "ones" | "orthogonal" | "randomUniform" | "truncateNormal" | "zeros";

      optimizer: string; // "adam" | "bgd" | "sgd" | "mbgd" | "momentum" | "nag" | "adagrad" | "adadelta" | "rmsprop";  拼写有误？
      learningRate: number;
      learningRateDecay: string;

      loss: string; // "zeroOne" | "hinge" | "log" | "exponential" | "perceptron" | "crossentropy" | "abs" | "square" | "mse";
      lossFunction: string;

      earlyStop: string; // "baseOnLoss" | "baseOnProgress" | "baseOnError" | "none";
      earlyStopFunction: string;

      layers: {
        type: string; // "input" | "affine" | "output";
        neutralAmount: number;
        activator: string; // "relue" | "tanh" | "softsign" | "sigmoid" | "none";
        appendix: {
          appendixType: string; // "dropout" | "normalbatch" | "ic" | "none";
          param: number;
        };
      }[];
    }[];
  }[]
) {
  addr = `https://${addr}`;
  const client = new OptimizerServiceClient(addr);
  const request = new Optimizer.SaveRequest();
  const modelList = [] as Optimizer.NNModel[];
  data.forEach((item) => {
    const modelParams = new Optimizer.NNModel();
    modelParams.setType(Optimizer.NNModel.ModelType[item.type.toUpperCase() as keyof typeof Optimizer.NNModel.ModelType]);
    modelParams.setBatchsize(item.batchSize);
    modelParams.setModelid(item.modelId);
    for (const net of item.network) {
      const n = new Optimizer.Network();
      n.setSubnetname(net.subNetName);
      n.setInitialization(
        Optimizer.Network.Initialization[net.initialization.toUpperCase() as keyof typeof Optimizer.Network.Initialization]
      );
      n.setLoss(Optimizer.Network.Loss[net.loss.toUpperCase() as keyof typeof Optimizer.Network.Loss]);
      n.setLossfunction(net.lossFunction);
      n.setEarlystop(Optimizer.Network.EarlyStop[net.earlyStop.toUpperCase() as keyof typeof Optimizer.Network.EarlyStop]);
      n.setEarlystopfunction(net.earlyStopFunction);
      n.setLearningrate(net.learningRate);
      n.setLearningratedecay(net.learningRateDecay);
      n.setOptimizer(Optimizer.Network.Optimizer[net.optimizer.toUpperCase() as keyof typeof Optimizer.Network.Optimizer]);
      for (const lay of net.layers) {
        const l = new Optimizer.Layer();
        l.setType(Optimizer.Layer.LayerType[lay.type.toUpperCase() as keyof typeof Optimizer.Layer.LayerType]);
        l.setActivator(Optimizer.Layer.Activator[lay.activator.toUpperCase() as keyof typeof Optimizer.Layer.Activator]);
        l.setNeutralamount(lay.neutralAmount);
        const appendix = new Optimizer.Layer.Appendix();
        appendix.setAppendixtype(
          Optimizer.Layer.Appendix.AppendixType[
            lay.appendix.appendixType.toUpperCase() as keyof typeof Optimizer.Layer.Appendix.AppendixType
          ]
        );
        appendix.setParam(lay.appendix.param);
        n.addLayers(l);
      }
      modelParams.addNetwork(n);
    }
    modelList.push(modelParams);
  });
  request.setModelsList(modelList); //保存数据
  try {
    return await client.saveModel(request, {});
  } catch (error: any) {
    console.log(error.message);
    if (error.code == 2) {
      // 说明是路径错误,更换地址
      addr = addr.replace(/https/, "http");
      const client = new OptimizerServiceClient(addr);
      return await client.saveModel(request, {});
    } else throw new Error(error.message);
  }
}
