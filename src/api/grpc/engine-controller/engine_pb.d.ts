import * as jspb from "google-protobuf";

import * as google_protobuf_timestamp_pb from "google-protobuf/google/protobuf/timestamp_pb";
import * as google_protobuf_duration_pb from "google-protobuf/google/protobuf/duration_pb";

export class CommonResponse extends jspb.Message {
  getMsg(): string;
  setMsg(value: string): CommonResponse;

  getCode(): number;
  setCode(value: number): CommonResponse;

  getErrorLocation(): number;
  setErrorLocation(value: number): CommonResponse;

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
    code: number;
    errorLocation: number;
  };
}

export class LogLevelRequest extends jspb.Message {
  getLevelsList(): Array<LogLevel>;
  setLevelsList(value: Array<LogLevel>): LogLevelRequest;
  clearLevelsList(): LogLevelRequest;
  addLevels(value: LogLevel, index?: number): LogLevelRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LogLevelRequest.AsObject;
  static toObject(includeInstance: boolean, msg: LogLevelRequest): LogLevelRequest.AsObject;
  static serializeBinaryToWriter(message: LogLevelRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LogLevelRequest;
  static deserializeBinaryFromReader(message: LogLevelRequest, reader: jspb.BinaryReader): LogLevelRequest;
}

export namespace LogLevelRequest {
  export type AsObject = {
    levelsList: Array<LogLevel>;
  };
}

export class ErrMsgResponse extends jspb.Message {
  getMsg(): string;
  setMsg(value: string): ErrMsgResponse;

  getLevel(): LogLevel;
  setLevel(value: LogLevel): ErrMsgResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ErrMsgResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ErrMsgResponse): ErrMsgResponse.AsObject;
  static serializeBinaryToWriter(message: ErrMsgResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ErrMsgResponse;
  static deserializeBinaryFromReader(message: ErrMsgResponse, reader: jspb.BinaryReader): ErrMsgResponse;
}

export namespace ErrMsgResponse {
  export type AsObject = {
    msg: string;
    level: LogLevel;
  };
}

export class CommonRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CommonRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CommonRequest): CommonRequest.AsObject;
  static serializeBinaryToWriter(message: CommonRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CommonRequest;
  static deserializeBinaryFromReader(message: CommonRequest, reader: jspb.BinaryReader): CommonRequest;
}

export namespace CommonRequest {
  export type AsObject = {};
}

export class NodeJoinExitResponse extends jspb.Message {
  getAddress(): string;
  setAddress(value: string): NodeJoinExitResponse;

  getIsMasterNode(): boolean;
  setIsMasterNode(value: boolean): NodeJoinExitResponse;

  getIsJoin(): boolean;
  setIsJoin(value: boolean): NodeJoinExitResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): NodeJoinExitResponse.AsObject;
  static toObject(includeInstance: boolean, msg: NodeJoinExitResponse): NodeJoinExitResponse.AsObject;
  static serializeBinaryToWriter(message: NodeJoinExitResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): NodeJoinExitResponse;
  static deserializeBinaryFromReader(message: NodeJoinExitResponse, reader: jspb.BinaryReader): NodeJoinExitResponse;
}

export namespace NodeJoinExitResponse {
  export type AsObject = {
    address: string;
    isMasterNode: boolean;
    isJoin: boolean;
  };
}

export class EntityListRequest extends jspb.Message {
  getTaskId(): number;
  setTaskId(value: number): EntityListRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EntityListRequest.AsObject;
  static toObject(includeInstance: boolean, msg: EntityListRequest): EntityListRequest.AsObject;
  static serializeBinaryToWriter(message: EntityListRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EntityListRequest;
  static deserializeBinaryFromReader(message: EntityListRequest, reader: jspb.BinaryReader): EntityListRequest;
}

export namespace EntityListRequest {
  export type AsObject = {
    taskId: number;
  };
}

export class Entity extends jspb.Message {
  getId(): string;
  setId(value: string): Entity;

  getModelId(): string;
  setModelId(value: string): Entity;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Entity.AsObject;
  static toObject(includeInstance: boolean, msg: Entity): Entity.AsObject;
  static serializeBinaryToWriter(message: Entity, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Entity;
  static deserializeBinaryFromReader(message: Entity, reader: jspb.BinaryReader): Entity;
}

export namespace Entity {
  export type AsObject = {
    id: string;
    modelId: string;
  };
}

export class EntityListResponse extends jspb.Message {
  getEntityListList(): Array<EntityListResponse.EntityInfo>;
  setEntityListList(value: Array<EntityListResponse.EntityInfo>): EntityListResponse;
  clearEntityListList(): EntityListResponse;
  addEntityList(value?: EntityListResponse.EntityInfo, index?: number): EntityListResponse.EntityInfo;

  getEntityListJson(): string;
  setEntityListJson(value: string): EntityListResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EntityListResponse.AsObject;
  static toObject(includeInstance: boolean, msg: EntityListResponse): EntityListResponse.AsObject;
  static serializeBinaryToWriter(message: EntityListResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EntityListResponse;
  static deserializeBinaryFromReader(message: EntityListResponse, reader: jspb.BinaryReader): EntityListResponse;
}

export namespace EntityListResponse {
  export type AsObject = {
    entityListList: Array<EntityListResponse.EntityInfo.AsObject>;
    entityListJson: string;
  };

  export class EntityInfo extends jspb.Message {
    getId(): string;
    setId(value: string): EntityInfo;

    getName(): string;
    setName(value: string): EntityInfo;

    getModelName(): string;
    setModelName(value: string): EntityInfo;

    getModelId(): string;
    setModelId(value: string): EntityInfo;

    getCampName(): string;
    setCampName(value: string): EntityInfo;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): EntityInfo.AsObject;
    static toObject(includeInstance: boolean, msg: EntityInfo): EntityInfo.AsObject;
    static serializeBinaryToWriter(message: EntityInfo, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): EntityInfo;
    static deserializeBinaryFromReader(message: EntityInfo, reader: jspb.BinaryReader): EntityInfo;
  }

  export namespace EntityInfo {
    export type AsObject = {
      id: string;
      name: string;
      modelName: string;
      modelId: string;
      campName: string;
    };
  }
}

export class NodeDesign extends jspb.Message {
  getAddress(): string;
  setAddress(value: string): NodeDesign;

  getEntitiesList(): Array<Entity>;
  setEntitiesList(value: Array<Entity>): NodeDesign;
  clearEntitiesList(): NodeDesign;
  addEntities(value?: Entity, index?: number): Entity;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): NodeDesign.AsObject;
  static toObject(includeInstance: boolean, msg: NodeDesign): NodeDesign.AsObject;
  static serializeBinaryToWriter(message: NodeDesign, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): NodeDesign;
  static deserializeBinaryFromReader(message: NodeDesign, reader: jspb.BinaryReader): NodeDesign;
}

export namespace NodeDesign {
  export type AsObject = {
    address: string;
    entitiesList: Array<Entity.AsObject>;
  };
}

export class InitInfo extends jspb.Message {
  getOneSampleConfig(): InitInfo.OneSample | undefined;
  setOneSampleConfig(value?: InitInfo.OneSample): InitInfo;
  hasOneSampleConfig(): boolean;
  clearOneSampleConfig(): InitInfo;

  getMultiSampleConfig(): InitInfo.MultiSample | undefined;
  setMultiSampleConfig(value?: InitInfo.MultiSample): InitInfo;
  hasMultiSampleConfig(): boolean;
  clearMultiSampleConfig(): InitInfo;

  getDataId(): number;
  setDataId(value: number): InitInfo;

  getInitInfoCase(): InitInfo.InitInfoCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): InitInfo.AsObject;
  static toObject(includeInstance: boolean, msg: InitInfo): InitInfo.AsObject;
  static serializeBinaryToWriter(message: InitInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): InitInfo;
  static deserializeBinaryFromReader(message: InitInfo, reader: jspb.BinaryReader): InitInfo;
}

export namespace InitInfo {
  export type AsObject = {
    oneSampleConfig?: InitInfo.OneSample.AsObject;
    multiSampleConfig?: InitInfo.MultiSample.AsObject;
    dataId: number;
  };

  export class OneSample extends jspb.Message {
    getTaskId(): number;
    setTaskId(value: number): OneSample;

    getNodesList(): Array<NodeDesign>;
    setNodesList(value: Array<NodeDesign>): OneSample;
    clearNodesList(): OneSample;
    addNodes(value?: NodeDesign, index?: number): NodeDesign;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): OneSample.AsObject;
    static toObject(includeInstance: boolean, msg: OneSample): OneSample.AsObject;
    static serializeBinaryToWriter(message: OneSample, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): OneSample;
    static deserializeBinaryFromReader(message: OneSample, reader: jspb.BinaryReader): OneSample;
  }

  export namespace OneSample {
    export type AsObject = {
      taskId: number;
      nodesList: Array<NodeDesign.AsObject>;
    };
  }

  export class MultiSample extends jspb.Message {
    getExpDesignId(): number;
    setExpDesignId(value: number): MultiSample;

    getNodesList(): Array<NodeDesign>;
    setNodesList(value: Array<NodeDesign>): MultiSample;
    clearNodesList(): MultiSample;
    addNodes(value?: NodeDesign, index?: number): NodeDesign;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): MultiSample.AsObject;
    static toObject(includeInstance: boolean, msg: MultiSample): MultiSample.AsObject;
    static serializeBinaryToWriter(message: MultiSample, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): MultiSample;
    static deserializeBinaryFromReader(message: MultiSample, reader: jspb.BinaryReader): MultiSample;
  }

  export namespace MultiSample {
    export type AsObject = {
      expDesignId: number;
      nodesList: Array<NodeDesign.AsObject>;
    };
  }

  export enum InitInfoCase {
    INIT_INFO_NOT_SET = 0,
    ONE_SAMPLE_CONFIG = 1,
    MULTI_SAMPLE_CONFIG = 2,
    DATA_ID = 3,
  }
}

export class HttpInfo extends jspb.Message {
  getToken(): string;
  setToken(value: string): HttpInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): HttpInfo.AsObject;
  static toObject(includeInstance: boolean, msg: HttpInfo): HttpInfo.AsObject;
  static serializeBinaryToWriter(message: HttpInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): HttpInfo;
  static deserializeBinaryFromReader(message: HttpInfo, reader: jspb.BinaryReader): HttpInfo;
}

export namespace HttpInfo {
  export type AsObject = {
    token: string;
  };
}

export class ControlCmd extends jspb.Message {
  getSimStartTime(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setSimStartTime(value?: google_protobuf_timestamp_pb.Timestamp): ControlCmd;
  hasSimStartTime(): boolean;
  clearSimStartTime(): ControlCmd;

  getSimDuration(): google_protobuf_duration_pb.Duration | undefined;
  setSimDuration(value?: google_protobuf_duration_pb.Duration): ControlCmd;
  hasSimDuration(): boolean;
  clearSimDuration(): ControlCmd;

  getRunCmd(): ControlCmd.RunCmdType;
  setRunCmd(value: ControlCmd.RunCmdType): ControlCmd;

  getTimeStep(): number;
  setTimeStep(value: number): ControlCmd;

  getSpeedRatio(): number;
  setSpeedRatio(value: number): ControlCmd;

  getMode(): ControlCmd.Mode;
  setMode(value: ControlCmd.Mode): ControlCmd;

  getCmdCase(): ControlCmd.CmdCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ControlCmd.AsObject;
  static toObject(includeInstance: boolean, msg: ControlCmd): ControlCmd.AsObject;
  static serializeBinaryToWriter(message: ControlCmd, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ControlCmd;
  static deserializeBinaryFromReader(message: ControlCmd, reader: jspb.BinaryReader): ControlCmd;
}

export namespace ControlCmd {
  export type AsObject = {
    simStartTime?: google_protobuf_timestamp_pb.Timestamp.AsObject;
    simDuration?: google_protobuf_duration_pb.Duration.AsObject;
    runCmd: ControlCmd.RunCmdType;
    timeStep: number;
    speedRatio: number;
    mode: ControlCmd.Mode;
  };

  export enum RunCmdType {
    START = 0,
    SUSPEND = 1,
    CONTINUE = 2,
    STOP = 3,
    STOP_CURRENT_SAMPLE = 4,
  }

  export enum Mode {
    RECORD = 0,
    REPLAY = 1,
    CONVERSE = 2,
  }

  export enum CmdCase {
    CMD_NOT_SET = 0,
    SIM_START_TIME = 1,
    SIM_DURATION = 2,
    RUN_CMD = 3,
    TIME_STEP = 4,
    SPEED_RATIO = 5,
    MODE = 6,
  }
}

export class EngineNodeState extends jspb.Message {
  getAddress(): string;
  setAddress(value: string): EngineNodeState;

  getState(): EngineNodeState.State;
  setState(value: EngineNodeState.State): EngineNodeState;

  getCpuLoad(): number;
  setCpuLoad(value: number): EngineNodeState;

  getMemoryLoad(): number;
  setMemoryLoad(value: number): EngineNodeState;

  getNetworkLoad(): number;
  setNetworkLoad(value: number): EngineNodeState;

  getIsMasterNode(): boolean;
  setIsMasterNode(value: boolean): EngineNodeState;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EngineNodeState.AsObject;
  static toObject(includeInstance: boolean, msg: EngineNodeState): EngineNodeState.AsObject;
  static serializeBinaryToWriter(message: EngineNodeState, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EngineNodeState;
  static deserializeBinaryFromReader(message: EngineNodeState, reader: jspb.BinaryReader): EngineNodeState;
}

export namespace EngineNodeState {
  export type AsObject = {
    address: string;
    state: EngineNodeState.State;
    cpuLoad: number;
    memoryLoad: number;
    networkLoad: number;
    isMasterNode: boolean;
  };

  export enum State {
    UNINITED = 0,
    INITED = 1,
    RUNNING = 2,
    SUSPENDED = 3,
    STOPPED = 4,
    ERROR = 5,
  }
}

export class SysInfoResponse extends jspb.Message {
  getSimCurrentTime(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setSimCurrentTime(value?: google_protobuf_timestamp_pb.Timestamp): SysInfoResponse;
  hasSimCurrentTime(): boolean;
  clearSimCurrentTime(): SysInfoResponse;

  getSimDuration(): google_protobuf_duration_pb.Duration | undefined;
  setSimDuration(value?: google_protobuf_duration_pb.Duration): SysInfoResponse;
  hasSimDuration(): boolean;
  clearSimDuration(): SysInfoResponse;

  getRealDuration(): google_protobuf_duration_pb.Duration | undefined;
  setRealDuration(value?: google_protobuf_duration_pb.Duration): SysInfoResponse;
  hasRealDuration(): boolean;
  clearRealDuration(): SysInfoResponse;

  getSimTimeStep(): number;
  setSimTimeStep(value: number): SysInfoResponse;

  getSpeedRatio(): number;
  setSpeedRatio(value: number): SysInfoResponse;

  getRealSpeedRatio(): number;
  setRealSpeedRatio(value: number): SysInfoResponse;

  getNodeStateList(): Array<EngineNodeState>;
  setNodeStateList(value: Array<EngineNodeState>): SysInfoResponse;
  clearNodeStateList(): SysInfoResponse;
  addNodeState(value?: EngineNodeState, index?: number): EngineNodeState;

  getCurrentSampleId(): number;
  setCurrentSampleId(value: number): SysInfoResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SysInfoResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SysInfoResponse): SysInfoResponse.AsObject;
  static serializeBinaryToWriter(message: SysInfoResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SysInfoResponse;
  static deserializeBinaryFromReader(message: SysInfoResponse, reader: jspb.BinaryReader): SysInfoResponse;
}

export namespace SysInfoResponse {
  export type AsObject = {
    simCurrentTime?: google_protobuf_timestamp_pb.Timestamp.AsObject;
    simDuration?: google_protobuf_duration_pb.Duration.AsObject;
    realDuration?: google_protobuf_duration_pb.Duration.AsObject;
    simTimeStep: number;
    speedRatio: number;
    realSpeedRatio: number;
    nodeStateList: Array<EngineNodeState.AsObject>;
    currentSampleId: number;
  };
}

export class DataSysInfoResponse extends jspb.Message {
  getState(): DataSysInfoResponse.ServiceState;
  setState(value: DataSysInfoResponse.ServiceState): DataSysInfoResponse;

  getCurrentTime(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCurrentTime(value?: google_protobuf_timestamp_pb.Timestamp): DataSysInfoResponse;
  hasCurrentTime(): boolean;
  clearCurrentTime(): DataSysInfoResponse;

  getDuration(): google_protobuf_duration_pb.Duration | undefined;
  setDuration(value?: google_protobuf_duration_pb.Duration): DataSysInfoResponse;
  hasDuration(): boolean;
  clearDuration(): DataSysInfoResponse;

  getScheduleVal(): number;
  setScheduleVal(value: number): DataSysInfoResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DataSysInfoResponse.AsObject;
  static toObject(includeInstance: boolean, msg: DataSysInfoResponse): DataSysInfoResponse.AsObject;
  static serializeBinaryToWriter(message: DataSysInfoResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DataSysInfoResponse;
  static deserializeBinaryFromReader(message: DataSysInfoResponse, reader: jspb.BinaryReader): DataSysInfoResponse;
}

export namespace DataSysInfoResponse {
  export type AsObject = {
    state: DataSysInfoResponse.ServiceState;
    currentTime?: google_protobuf_timestamp_pb.Timestamp.AsObject;
    duration?: google_protobuf_duration_pb.Duration.AsObject;
    scheduleVal: number;
  };

  export enum ServiceState {
    UNINITED = 0,
    INITED = 1,
    RUNNING = 2,
    SUSPENDED = 3,
    STOPPED = 4,
    ERROR = 5,
  }
}

export class NodeResponse extends jspb.Message {
  getNodesList(): Array<string>;
  setNodesList(value: Array<string>): NodeResponse;
  clearNodesList(): NodeResponse;
  addNodes(value: string, index?: number): NodeResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): NodeResponse.AsObject;
  static toObject(includeInstance: boolean, msg: NodeResponse): NodeResponse.AsObject;
  static serializeBinaryToWriter(message: NodeResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): NodeResponse;
  static deserializeBinaryFromReader(message: NodeResponse, reader: jspb.BinaryReader): NodeResponse;
}

export namespace NodeResponse {
  export type AsObject = {
    nodesList: Array<string>;
  };
}

export class InitedResponse extends jspb.Message {
  getInitPercent(): number;
  setInitPercent(value: number): InitedResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): InitedResponse.AsObject;
  static toObject(includeInstance: boolean, msg: InitedResponse): InitedResponse.AsObject;
  static serializeBinaryToWriter(message: InitedResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): InitedResponse;
  static deserializeBinaryFromReader(message: InitedResponse, reader: jspb.BinaryReader): InitedResponse;
}

export namespace InitedResponse {
  export type AsObject = {
    initPercent: number;
  };
}

export enum LogLevel {
  TRACE = 0,
  DEBUG = 1,
  INFO = 2,
  WARN = 3,
  ERROR = 4,
  CRITICAL_ERROR = 5,
}
