import * as jspb from "google-protobuf";

export class Model extends jspb.Message {
  getInputdimension(): number;
  setInputdimension(value: number): Model;

  getOutputdimension(): number;
  setOutputdimension(value: number): Model;

  getInferencedimension(): number;
  setInferencedimension(value: number): Model;

  getModelparams(): NNModel | undefined;
  setModelparams(value?: NNModel): Model;
  hasModelparams(): boolean;
  clearModelparams(): Model;

  getPushfrequency(): number;
  setPushfrequency(value: number): Model;

  getInferenceurl(): string;
  setInferenceurl(value: string): Model;

  getMemoryurl(): string;
  setMemoryurl(value: string): Model;

  getModelid(): string;
  setModelid(value: string): Model;

  getSimmodelList(): Array<SimModel>;
  setSimmodelList(value: Array<SimModel>): Model;
  clearSimmodelList(): Model;
  addSimmodel(value?: SimModel, index?: number): SimModel;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Model.AsObject;
  static toObject(includeInstance: boolean, msg: Model): Model.AsObject;
  static serializeBinaryToWriter(message: Model, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Model;
  static deserializeBinaryFromReader(message: Model, reader: jspb.BinaryReader): Model;
}

export namespace Model {
  export type AsObject = {
    inputdimension: number;
    outputdimension: number;
    inferencedimension: number;
    modelparams?: NNModel.AsObject;
    pushfrequency: number;
    inferenceurl: string;
    memoryurl: string;
    modelid: string;
    simmodelList: Array<SimModel.AsObject>;
  };
}

export class SimModel extends jspb.Message {
  getId(): string;
  setId(value: string): SimModel;

  getStatusList(): Array<string>;
  setStatusList(value: Array<string>): SimModel;
  clearStatusList(): SimModel;
  addStatus(value: string, index?: number): SimModel;

  getActionList(): Array<SimAction>;
  setActionList(value: Array<SimAction>): SimModel;
  clearActionList(): SimModel;
  addAction(value?: SimAction, index?: number): SimAction;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SimModel.AsObject;
  static toObject(includeInstance: boolean, msg: SimModel): SimModel.AsObject;
  static serializeBinaryToWriter(message: SimModel, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SimModel;
  static deserializeBinaryFromReader(message: SimModel, reader: jspb.BinaryReader): SimModel;
}

export namespace SimModel {
  export type AsObject = {
    id: string;
    statusList: Array<string>;
    actionList: Array<SimAction.AsObject>;
  };
}

export class SimAction extends jspb.Message {
  getName(): string;
  setName(value: string): SimAction;

  getBound(): number;
  setBound(value: number): SimAction;

  getShift(): number;
  setShift(value: number): SimAction;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SimAction.AsObject;
  static toObject(includeInstance: boolean, msg: SimAction): SimAction.AsObject;
  static serializeBinaryToWriter(message: SimAction, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SimAction;
  static deserializeBinaryFromReader(message: SimAction, reader: jspb.BinaryReader): SimAction;
}

export namespace SimAction {
  export type AsObject = {
    name: string;
    bound: number;
    shift: number;
  };
}

export class InitRequest extends jspb.Message {
  getModelsList(): Array<Model>;
  setModelsList(value: Array<Model>): InitRequest;
  clearModelsList(): InitRequest;
  addModels(value?: Model, index?: number): Model;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): InitRequest.AsObject;
  static toObject(includeInstance: boolean, msg: InitRequest): InitRequest.AsObject;
  static serializeBinaryToWriter(message: InitRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): InitRequest;
  static deserializeBinaryFromReader(message: InitRequest, reader: jspb.BinaryReader): InitRequest;
}

export namespace InitRequest {
  export type AsObject = {
    modelsList: Array<Model.AsObject>;
  };
}

export class NNModel extends jspb.Message {
  getNetworkList(): Array<Network>;
  setNetworkList(value: Array<Network>): NNModel;
  clearNetworkList(): NNModel;
  addNetwork(value?: Network, index?: number): Network;

  getType(): NNModel.ModelType;
  setType(value: NNModel.ModelType): NNModel;

  getBatchsize(): number;
  setBatchsize(value: number): NNModel;

  getModelid(): string;
  setModelid(value: string): NNModel;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): NNModel.AsObject;
  static toObject(includeInstance: boolean, msg: NNModel): NNModel.AsObject;
  static serializeBinaryToWriter(message: NNModel, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): NNModel;
  static deserializeBinaryFromReader(message: NNModel, reader: jspb.BinaryReader): NNModel;
}

export namespace NNModel {
  export type AsObject = {
    networkList: Array<Network.AsObject>;
    type: NNModel.ModelType;
    batchsize: number;
    modelid: string;
  };

  export enum ModelType {
    DQN = 0,
    DOUBLEDQN = 1,
    DDPG = 2,
    MDDPG = 3,
    A3C = 4,
    PPO = 5,
  }
}

export class Layer extends jspb.Message {
  getType(): Layer.LayerType;
  setType(value: Layer.LayerType): Layer;

  getActivator(): Layer.Activator;
  setActivator(value: Layer.Activator): Layer;

  getNeutralamount(): number;
  setNeutralamount(value: number): Layer;

  getAppendix(): Layer.Appendix | undefined;
  setAppendix(value?: Layer.Appendix): Layer;
  hasAppendix(): boolean;
  clearAppendix(): Layer;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Layer.AsObject;
  static toObject(includeInstance: boolean, msg: Layer): Layer.AsObject;
  static serializeBinaryToWriter(message: Layer, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Layer;
  static deserializeBinaryFromReader(message: Layer, reader: jspb.BinaryReader): Layer;
}

export namespace Layer {
  export type AsObject = {
    type: Layer.LayerType;
    activator: Layer.Activator;
    neutralamount: number;
    appendix?: Layer.Appendix.AsObject;
  };

  export class Appendix extends jspb.Message {
    getAppendixtype(): Layer.Appendix.AppendixType;
    setAppendixtype(value: Layer.Appendix.AppendixType): Appendix;

    getParam(): number;
    setParam(value: number): Appendix;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Appendix.AsObject;
    static toObject(includeInstance: boolean, msg: Appendix): Appendix.AsObject;
    static serializeBinaryToWriter(message: Appendix, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Appendix;
    static deserializeBinaryFromReader(message: Appendix, reader: jspb.BinaryReader): Appendix;
  }

  export namespace Appendix {
    export type AsObject = {
      appendixtype: Layer.Appendix.AppendixType;
      param: number;
    };

    export enum AppendixType {
      NONE = 0,
      DROPOUT = 1,
      NORMALBATCH = 2,
      IC = 3,
    }
  }

  export enum LayerType {
    AFFINE = 0,
    INPUT = 1,
    OUTPUT = 2,
  }

  export enum Activator {
    ELU = 0,
    EXPONENTIAL = 1,
    GELU = 2,
    GET = 3,
    HARD_SIGMOID = 4,
    LINEAR = 5,
    RELU = 6,
    SELU = 7,
    SERIALIZE = 8,
    SIGMOID = 9,
    SOFTMAX = 10,
    SOFTPLUS = 11,
    SOFTSIGN = 12,
    SWISH = 13,
    TANH = 14,
  }
}

export class Network extends jspb.Message {
  getInitialization(): Network.Initialization;
  setInitialization(value: Network.Initialization): Network;

  getLayersList(): Array<Layer>;
  setLayersList(value: Array<Layer>): Network;
  clearLayersList(): Network;
  addLayers(value?: Layer, index?: number): Layer;

  getSubnetname(): string;
  setSubnetname(value: string): Network;

  getLoss(): Network.Loss;
  setLoss(value: Network.Loss): Network;

  getLossfunction(): string;
  setLossfunction(value: string): Network;

  getOptimizer(): Network.Optimizer;
  setOptimizer(value: Network.Optimizer): Network;

  getLearningrate(): number;
  setLearningrate(value: number): Network;

  getLearningratedecay(): string;
  setLearningratedecay(value: string): Network;

  getEarlystop(): Network.EarlyStop;
  setEarlystop(value: Network.EarlyStop): Network;

  getEarlystopfunction(): string;
  setEarlystopfunction(value: string): Network;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Network.AsObject;
  static toObject(includeInstance: boolean, msg: Network): Network.AsObject;
  static serializeBinaryToWriter(message: Network, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Network;
  static deserializeBinaryFromReader(message: Network, reader: jspb.BinaryReader): Network;
}

export namespace Network {
  export type AsObject = {
    initialization: Network.Initialization;
    layersList: Array<Layer.AsObject>;
    subnetname: string;
    loss: Network.Loss;
    lossfunction: string;
    optimizer: Network.Optimizer;
    learningrate: number;
    learningratedecay: string;
    earlystop: Network.EarlyStop;
    earlystopfunction: string;
  };

  export enum Initialization {
    HEUNIFORM = 0,
    HENORMAL = 1,
    GLOROTNORMAL = 2,
    GLOROTUNIFORM = 3,
    CONSTANT = 4,
    ONES = 5,
    ORTHOGONAL = 6,
    RANDOMUNIFORM = 7,
    TRUNCATENORMAL = 8,
    ZEROS = 9,
  }

  export enum Loss {
    MEANABSOLUTEERROR = 0,
    MEANABSOLUTEPERCENTAGEERROR = 1,
    MEANSQUAREDERROR = 2,
    MEANSQUAREDLOGARITHMICERROR = 3,
    CATEGORICALCROSSENTROPY = 4,
    SPARSECATEGORICALCROSSENTROPY = 5,
    BINARYCROSSENTROPY = 6,
    HINGE = 7,
    CATEGORICALHINGE = 8,
    POISSON = 9,
    SQUAREDHINGE = 10,
    LOGCOSH = 11,
    KLDIVERGENCE = 12,
    HUBE = 13,
  }

  export enum Optimizer {
    RMSPROP = 0,
    NADAM = 1,
    SGD = 2,
    FTRL = 3,
    ADAM = 4,
    ADAMAX = 5,
    ADAGRAD = 6,
    ADADELTA = 7,
  }

  export enum EarlyStop {
    NONE = 0,
    BASEONLOSS = 1,
    BASEONPROGRESS = 2,
    BASEONERROR = 3,
  }
}

export class InitResponse extends jspb.Message {
  getMsg(): string;
  setMsg(value: string): InitResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): InitResponse.AsObject;
  static toObject(includeInstance: boolean, msg: InitResponse): InitResponse.AsObject;
  static serializeBinaryToWriter(message: InitResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): InitResponse;
  static deserializeBinaryFromReader(message: InitResponse, reader: jspb.BinaryReader): InitResponse;
}

export namespace InitResponse {
  export type AsObject = {
    msg: string;
  };
}

export class ControlRequest extends jspb.Message {
  getRunCmd(): ControlRequest.RunCmdType;
  setRunCmd(value: ControlRequest.RunCmdType): ControlRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ControlRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ControlRequest): ControlRequest.AsObject;
  static serializeBinaryToWriter(message: ControlRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ControlRequest;
  static deserializeBinaryFromReader(message: ControlRequest, reader: jspb.BinaryReader): ControlRequest;
}

export namespace ControlRequest {
  export type AsObject = {
    runCmd: ControlRequest.RunCmdType;
  };

  export enum RunCmdType {
    START = 0,
    SUSPEND = 1,
    CONTINUE = 2,
    STOP = 3,
  }
}

export class ControlResponse extends jspb.Message {
  getMsg(): string;
  setMsg(value: string): ControlResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ControlResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ControlResponse): ControlResponse.AsObject;
  static serializeBinaryToWriter(message: ControlResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ControlResponse;
  static deserializeBinaryFromReader(message: ControlResponse, reader: jspb.BinaryReader): ControlResponse;
}

export namespace ControlResponse {
  export type AsObject = {
    msg: string;
  };
}

export class SaveRequest extends jspb.Message {
  getModelsList(): Array<NNModel>;
  setModelsList(value: Array<NNModel>): SaveRequest;
  clearModelsList(): SaveRequest;
  addModels(value?: NNModel, index?: number): NNModel;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SaveRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SaveRequest): SaveRequest.AsObject;
  static serializeBinaryToWriter(message: SaveRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SaveRequest;
  static deserializeBinaryFromReader(message: SaveRequest, reader: jspb.BinaryReader): SaveRequest;
}

export namespace SaveRequest {
  export type AsObject = {
    modelsList: Array<NNModel.AsObject>;
  };
}

export class SaveResponse extends jspb.Message {
  getMsg(): string;
  setMsg(value: string): SaveResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SaveResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SaveResponse): SaveResponse.AsObject;
  static serializeBinaryToWriter(message: SaveResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SaveResponse;
  static deserializeBinaryFromReader(message: SaveResponse, reader: jspb.BinaryReader): SaveResponse;
}

export namespace SaveResponse {
  export type AsObject = {
    msg: string;
  };
}
