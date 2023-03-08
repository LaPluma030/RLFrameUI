import * as jspb from "google-protobuf";

export class SaveMemoryRequest extends jspb.Message {
  getInstanceInfosList(): Array<SaveMemoryRequest.instance_info>;
  setInstanceInfosList(value: Array<SaveMemoryRequest.instance_info>): SaveMemoryRequest;
  clearInstanceInfosList(): SaveMemoryRequest;
  addInstanceInfos(value?: SaveMemoryRequest.instance_info, index?: number): SaveMemoryRequest.instance_info;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SaveMemoryRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SaveMemoryRequest): SaveMemoryRequest.AsObject;
  static serializeBinaryToWriter(message: SaveMemoryRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SaveMemoryRequest;
  static deserializeBinaryFromReader(message: SaveMemoryRequest, reader: jspb.BinaryReader): SaveMemoryRequest;
}

export namespace SaveMemoryRequest {
  export type AsObject = {
    instanceInfosList: Array<SaveMemoryRequest.instance_info.AsObject>;
  };

  export class instance_info extends jspb.Message {
    getStatusList(): Array<number>;
    setStatusList(value: Array<number>): instance_info;
    clearStatusList(): instance_info;
    addStatus(value: number, index?: number): instance_info;

    getActionList(): Array<number>;
    setActionList(value: Array<number>): instance_info;
    clearActionList(): instance_info;
    addAction(value: number, index?: number): instance_info;

    getStatusNextList(): Array<number>;
    setStatusNextList(value: Array<number>): instance_info;
    clearStatusNextList(): instance_info;
    addStatusNext(value: number, index?: number): instance_info;

    getInstanceId(): number;
    setInstanceId(value: number): instance_info;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): instance_info.AsObject;
    static toObject(includeInstance: boolean, msg: instance_info): instance_info.AsObject;
    static serializeBinaryToWriter(message: instance_info, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): instance_info;
    static deserializeBinaryFromReader(message: instance_info, reader: jspb.BinaryReader): instance_info;
  }

  export namespace instance_info {
    export type AsObject = {
      statusList: Array<number>;
      actionList: Array<number>;
      statusNextList: Array<number>;
      instanceId: number;
    };
  }
}

export class CommonResponse extends jspb.Message {
  getMsg(): string;
  setMsg(value: string): CommonResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CommonResponse.AsObject;
  static toObject(includeInstance: boolean, msg: CommonResponse): CommonResponse.AsObject;
  static serializeBinaryToWriter(message: CommonResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CommonResponse;
  static deserializeBinaryFromReader(message: CommonResponse, reader: jspb.BinaryReader): CommonResponse;
}

export namespace CommonResponse {
  export type AsObject = {
    msg: string;
  };
}

export class GetMemoryRequest extends jspb.Message {
  getBatchSize(): number;
  setBatchSize(value: number): GetMemoryRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetMemoryRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetMemoryRequest): GetMemoryRequest.AsObject;
  static serializeBinaryToWriter(message: GetMemoryRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetMemoryRequest;
  static deserializeBinaryFromReader(message: GetMemoryRequest, reader: jspb.BinaryReader): GetMemoryRequest;
}

export namespace GetMemoryRequest {
  export type AsObject = {
    batchSize: number;
  };
}

export class GetMemoryResponse extends jspb.Message {
  getMemory(): Uint8Array | string;
  getMemory_asU8(): Uint8Array;
  getMemory_asB64(): string;
  setMemory(value: Uint8Array | string): GetMemoryResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetMemoryResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetMemoryResponse): GetMemoryResponse.AsObject;
  static serializeBinaryToWriter(message: GetMemoryResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetMemoryResponse;
  static deserializeBinaryFromReader(message: GetMemoryResponse, reader: jspb.BinaryReader): GetMemoryResponse;
}

export namespace GetMemoryResponse {
  export type AsObject = {
    memory: Uint8Array | string;
  };
}

export class InitModel extends jspb.Message {
  getStatusdimension(): number;
  setStatusdimension(value: number): InitModel;

  getActiondimension(): number;
  setActiondimension(value: number): InitModel;

  getRewardfunction(): string;
  setRewardfunction(value: string): InitModel;

  getMemorycapacity(): number;
  setMemorycapacity(value: number): InitModel;

  getModelid(): string;
  setModelid(value: string): InitModel;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): InitModel.AsObject;
  static toObject(includeInstance: boolean, msg: InitModel): InitModel.AsObject;
  static serializeBinaryToWriter(message: InitModel, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): InitModel;
  static deserializeBinaryFromReader(message: InitModel, reader: jspb.BinaryReader): InitModel;
}

export namespace InitModel {
  export type AsObject = {
    statusdimension: number;
    actiondimension: number;
    rewardfunction: string;
    memorycapacity: number;
    modelid: string;
  };
}

export class InitRequest extends jspb.Message {
  getInitmodelsList(): Array<InitModel>;
  setInitmodelsList(value: Array<InitModel>): InitRequest;
  clearInitmodelsList(): InitRequest;
  addInitmodels(value?: InitModel, index?: number): InitModel;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): InitRequest.AsObject;
  static toObject(includeInstance: boolean, msg: InitRequest): InitRequest.AsObject;
  static serializeBinaryToWriter(message: InitRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): InitRequest;
  static deserializeBinaryFromReader(message: InitRequest, reader: jspb.BinaryReader): InitRequest;
}

export namespace InitRequest {
  export type AsObject = {
    initmodelsList: Array<InitModel.AsObject>;
  };
}

export class ResetRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ResetRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ResetRequest): ResetRequest.AsObject;
  static serializeBinaryToWriter(message: ResetRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ResetRequest;
  static deserializeBinaryFromReader(message: ResetRequest, reader: jspb.BinaryReader): ResetRequest;
}

export namespace ResetRequest {
  export type AsObject = {};
}
