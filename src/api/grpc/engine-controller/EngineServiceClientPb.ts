/**
 * @fileoverview gRPC-Web generated client stub for cqsim.control
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!

/* eslint-disable */
// @ts-nocheck

import * as grpcWeb from "grpc-web";

import engine_pb from "./engine_pb";

export class SimControllerClient {
  client_: grpcWeb.AbstractClientBase;
  hostname_: string;
  credentials_: null | { [index: string]: string };
  options_: null | { [index: string]: any };

  constructor(hostname: string, credentials?: null | { [index: string]: string }, options?: null | { [index: string]: any }) {
    if (!options) options = {};
    if (!credentials) credentials = {};
    options["format"] = "text";

    this.client_ = new grpcWeb.GrpcWebClientBase(options);
    this.hostname_ = hostname;
    this.credentials_ = credentials;
    this.options_ = options;
  }

  methodInfoGetEntityList = new grpcWeb.MethodDescriptor(
    "/cqsim.control.SimController/GetEntityList",
    grpcWeb.MethodType.UNARY,
    engine_pb.EntityListRequest,
    engine_pb.EntityListResponse,
    (request: engine_pb.EntityListRequest) => {
      return request.serializeBinary();
    },
    engine_pb.EntityListResponse.deserializeBinary
  );

  getEntityList(request: engine_pb.EntityListRequest, metadata: grpcWeb.Metadata | null): Promise<engine_pb.EntityListResponse>;

  getEntityList(
    request: engine_pb.EntityListRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError, response: engine_pb.EntityListResponse) => void
  ): grpcWeb.ClientReadableStream<engine_pb.EntityListResponse>;

  getEntityList(
    request: engine_pb.EntityListRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError, response: engine_pb.EntityListResponse) => void
  ) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ + "/cqsim.control.SimController/GetEntityList",
        request,
        metadata || {},
        this.methodInfoGetEntityList,
        callback
      );
    }
    return this.client_.unaryCall(
      this.hostname_ + "/cqsim.control.SimController/GetEntityList",
      request,
      metadata || {},
      this.methodInfoGetEntityList
    );
  }

  methodInfoInit = new grpcWeb.MethodDescriptor(
    "/cqsim.control.SimController/Init",
    grpcWeb.MethodType.UNARY,
    engine_pb.InitInfo,
    engine_pb.CommonResponse,
    (request: engine_pb.InitInfo) => {
      return request.serializeBinary();
    },
    engine_pb.CommonResponse.deserializeBinary
  );

  init(request: engine_pb.InitInfo, metadata: grpcWeb.Metadata | null): Promise<engine_pb.CommonResponse>;

  init(
    request: engine_pb.InitInfo,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError, response: engine_pb.CommonResponse) => void
  ): grpcWeb.ClientReadableStream<engine_pb.CommonResponse>;

  init(
    request: engine_pb.InitInfo,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError, response: engine_pb.CommonResponse) => void
  ) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ + "/cqsim.control.SimController/Init",
        request,
        metadata || {},
        this.methodInfoInit,
        callback
      );
    }
    return this.client_.unaryCall(
      this.hostname_ + "/cqsim.control.SimController/Init",
      request,
      metadata || {},
      this.methodInfoInit
    );
  }

  methodInfoControl = new grpcWeb.MethodDescriptor(
    "/cqsim.control.SimController/Control",
    grpcWeb.MethodType.UNARY,
    engine_pb.ControlCmd,
    engine_pb.CommonResponse,
    (request: engine_pb.ControlCmd) => {
      return request.serializeBinary();
    },
    engine_pb.CommonResponse.deserializeBinary
  );

  control(request: engine_pb.ControlCmd, metadata: grpcWeb.Metadata | null): Promise<engine_pb.CommonResponse>;

  control(
    request: engine_pb.ControlCmd,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError, response: engine_pb.CommonResponse) => void
  ): grpcWeb.ClientReadableStream<engine_pb.CommonResponse>;

  control(
    request: engine_pb.ControlCmd,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError, response: engine_pb.CommonResponse) => void
  ) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ + "/cqsim.control.SimController/Control",
        request,
        metadata || {},
        this.methodInfoControl,
        callback
      );
    }
    return this.client_.unaryCall(
      this.hostname_ + "/cqsim.control.SimController/Control",
      request,
      metadata || {},
      this.methodInfoControl
    );
  }

  methodInfoGetSysInfo = new grpcWeb.MethodDescriptor(
    "/cqsim.control.SimController/GetSysInfo",
    grpcWeb.MethodType.SERVER_STREAMING,
    engine_pb.CommonRequest,
    engine_pb.SysInfoResponse,
    (request: engine_pb.CommonRequest) => {
      return request.serializeBinary();
    },
    engine_pb.SysInfoResponse.deserializeBinary
  );

  getSysInfo(request: engine_pb.CommonRequest, metadata?: grpcWeb.Metadata) {
    return this.client_.serverStreaming(
      this.hostname_ + "/cqsim.control.SimController/GetSysInfo",
      request,
      metadata || {},
      this.methodInfoGetSysInfo
    );
  }

  methodInfoGetDataSysInfo = new grpcWeb.MethodDescriptor(
    "/cqsim.control.SimController/GetDataSysInfo",
    grpcWeb.MethodType.SERVER_STREAMING,
    engine_pb.CommonRequest,
    engine_pb.DataSysInfoResponse,
    (request: engine_pb.CommonRequest) => {
      return request.serializeBinary();
    },
    engine_pb.DataSysInfoResponse.deserializeBinary
  );

  getDataSysInfo(request: engine_pb.CommonRequest, metadata?: grpcWeb.Metadata) {
    return this.client_.serverStreaming(
      this.hostname_ + "/cqsim.control.SimController/GetDataSysInfo",
      request,
      metadata || {},
      this.methodInfoGetDataSysInfo
    );
  }

  methodInfoGetAllNode = new grpcWeb.MethodDescriptor(
    "/cqsim.control.SimController/GetAllNode",
    grpcWeb.MethodType.UNARY,
    engine_pb.CommonRequest,
    engine_pb.NodeResponse,
    (request: engine_pb.CommonRequest) => {
      return request.serializeBinary();
    },
    engine_pb.NodeResponse.deserializeBinary
  );

  getAllNode(request: engine_pb.CommonRequest, metadata: grpcWeb.Metadata | null): Promise<engine_pb.NodeResponse>;

  getAllNode(
    request: engine_pb.CommonRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError, response: engine_pb.NodeResponse) => void
  ): grpcWeb.ClientReadableStream<engine_pb.NodeResponse>;

  getAllNode(
    request: engine_pb.CommonRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError, response: engine_pb.NodeResponse) => void
  ) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ + "/cqsim.control.SimController/GetAllNode",
        request,
        metadata || {},
        this.methodInfoGetAllNode,
        callback
      );
    }
    return this.client_.unaryCall(
      this.hostname_ + "/cqsim.control.SimController/GetAllNode",
      request,
      metadata || {},
      this.methodInfoGetAllNode
    );
  }

  methodInfoGetInitedPercent = new grpcWeb.MethodDescriptor(
    "/cqsim.control.SimController/GetInitedPercent",
    grpcWeb.MethodType.SERVER_STREAMING,
    engine_pb.CommonRequest,
    engine_pb.InitedResponse,
    (request: engine_pb.CommonRequest) => {
      return request.serializeBinary();
    },
    engine_pb.InitedResponse.deserializeBinary
  );

  getInitedPercent(request: engine_pb.CommonRequest, metadata?: grpcWeb.Metadata) {
    return this.client_.serverStreaming(
      this.hostname_ + "/cqsim.control.SimController/GetInitedPercent",
      request,
      metadata || {},
      this.methodInfoGetInitedPercent
    );
  }

  methodInfoGetErrorMsg = new grpcWeb.MethodDescriptor(
    "/cqsim.control.SimController/GetErrorMsg",
    grpcWeb.MethodType.SERVER_STREAMING,
    engine_pb.CommonRequest,
    engine_pb.ErrMsgResponse,
    (request: engine_pb.CommonRequest) => {
      return request.serializeBinary();
    },
    engine_pb.ErrMsgResponse.deserializeBinary
  );

  getErrorMsg(request: engine_pb.CommonRequest, metadata?: grpcWeb.Metadata) {
    return this.client_.serverStreaming(
      this.hostname_ + "/cqsim.control.SimController/GetErrorMsg",
      request,
      metadata || {},
      this.methodInfoGetErrorMsg
    );
  }

  methodInfoGetNodeJoinExit = new grpcWeb.MethodDescriptor(
    "/cqsim.control.SimController/GetNodeJoinExit",
    grpcWeb.MethodType.SERVER_STREAMING,
    engine_pb.CommonRequest,
    engine_pb.NodeJoinExitResponse,
    (request: engine_pb.CommonRequest) => {
      return request.serializeBinary();
    },
    engine_pb.NodeJoinExitResponse.deserializeBinary
  );

  getNodeJoinExit(request: engine_pb.CommonRequest, metadata?: grpcWeb.Metadata) {
    return this.client_.serverStreaming(
      this.hostname_ + "/cqsim.control.SimController/GetNodeJoinExit",
      request,
      metadata || {},
      this.methodInfoGetNodeJoinExit
    );
  }

  methodInfoSetLogLevel = new grpcWeb.MethodDescriptor(
    "/cqsim.control.SimController/SetLogLevel",
    grpcWeb.MethodType.UNARY,
    engine_pb.LogLevelRequest,
    engine_pb.CommonResponse,
    (request: engine_pb.LogLevelRequest) => {
      return request.serializeBinary();
    },
    engine_pb.CommonResponse.deserializeBinary
  );

  setLogLevel(request: engine_pb.LogLevelRequest, metadata: grpcWeb.Metadata | null): Promise<engine_pb.CommonResponse>;

  setLogLevel(
    request: engine_pb.LogLevelRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError, response: engine_pb.CommonResponse) => void
  ): grpcWeb.ClientReadableStream<engine_pb.CommonResponse>;

  setLogLevel(
    request: engine_pb.LogLevelRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError, response: engine_pb.CommonResponse) => void
  ) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ + "/cqsim.control.SimController/SetLogLevel",
        request,
        metadata || {},
        this.methodInfoSetLogLevel,
        callback
      );
    }
    return this.client_.unaryCall(
      this.hostname_ + "/cqsim.control.SimController/SetLogLevel",
      request,
      metadata || {},
      this.methodInfoSetLogLevel
    );
  }

  methodInfoSetHttpInfo = new grpcWeb.MethodDescriptor(
    "/cqsim.control.SimController/SetHttpInfo",
    grpcWeb.MethodType.UNARY,
    engine_pb.HttpInfo,
    engine_pb.CommonResponse,
    (request: engine_pb.HttpInfo) => {
      return request.serializeBinary();
    },
    engine_pb.CommonResponse.deserializeBinary
  );

  setHttpInfo(request: engine_pb.HttpInfo, metadata: grpcWeb.Metadata | null): Promise<engine_pb.CommonResponse>;

  setHttpInfo(
    request: engine_pb.HttpInfo,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError, response: engine_pb.CommonResponse) => void
  ): grpcWeb.ClientReadableStream<engine_pb.CommonResponse>;

  setHttpInfo(
    request: engine_pb.HttpInfo,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError, response: engine_pb.CommonResponse) => void
  ) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ + "/cqsim.control.SimController/SetHttpInfo",
        request,
        metadata || {},
        this.methodInfoSetHttpInfo,
        callback
      );
    }
    return this.client_.unaryCall(
      this.hostname_ + "/cqsim.control.SimController/SetHttpInfo",
      request,
      metadata || {},
      this.methodInfoSetHttpInfo
    );
  }
}
