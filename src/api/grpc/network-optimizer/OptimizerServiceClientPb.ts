/**
 * @fileoverview gRPC-Web generated client stub for rl_optimize
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!

/* eslint-disable */
// @ts-nocheck

import * as grpcWeb from "grpc-web";

import optimizer_pb from "./optimizer_pb";

export class OptimizerServiceClient {
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

  methodInfoInitOptimizer = new grpcWeb.MethodDescriptor(
    "/rl_optimize.OptimizerService/InitOptimizer",
    grpcWeb.MethodType.UNARY,
    optimizer_pb.InitRequest,
    optimizer_pb.InitResponse,
    (request: optimizer_pb.InitRequest) => {
      return request.serializeBinary();
    },
    optimizer_pb.InitResponse.deserializeBinary
  );

  initOptimizer(request: optimizer_pb.InitRequest, metadata: grpcWeb.Metadata | null): Promise<optimizer_pb.InitResponse>;

  initOptimizer(
    request: optimizer_pb.InitRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError, response: optimizer_pb.InitResponse) => void
  ): grpcWeb.ClientReadableStream<optimizer_pb.InitResponse>;

  initOptimizer(
    request: optimizer_pb.InitRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError, response: optimizer_pb.InitResponse) => void
  ) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ + "/rl_optimize.OptimizerService/InitOptimizer",
        request,
        metadata || {},
        this.methodInfoInitOptimizer,
        callback
      );
    }
    return this.client_.unaryCall(
      this.hostname_ + "/rl_optimize.OptimizerService/InitOptimizer",
      request,
      metadata || {},
      this.methodInfoInitOptimizer
    );
  }

  methodInfoControl = new grpcWeb.MethodDescriptor(
    "/rl_optimize.OptimizerService/Control",
    grpcWeb.MethodType.UNARY,
    optimizer_pb.ControlRequest,
    optimizer_pb.ControlResponse,
    (request: optimizer_pb.ControlRequest) => {
      return request.serializeBinary();
    },
    optimizer_pb.ControlResponse.deserializeBinary
  );

  control(request: optimizer_pb.ControlRequest, metadata: grpcWeb.Metadata | null): Promise<optimizer_pb.ControlResponse>;

  control(
    request: optimizer_pb.ControlRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError, response: optimizer_pb.ControlResponse) => void
  ): grpcWeb.ClientReadableStream<optimizer_pb.ControlResponse>;

  control(
    request: optimizer_pb.ControlRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError, response: optimizer_pb.ControlResponse) => void
  ) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ + "/rl_optimize.OptimizerService/Control",
        request,
        metadata || {},
        this.methodInfoControl,
        callback
      );
    }
    return this.client_.unaryCall(
      this.hostname_ + "/rl_optimize.OptimizerService/Control",
      request,
      metadata || {},
      this.methodInfoControl
    );
  }

  methodInfoSaveModel = new grpcWeb.MethodDescriptor(
    "/rl_optimize.OptimizerService/SaveModel",
    grpcWeb.MethodType.UNARY,
    optimizer_pb.SaveRequest,
    optimizer_pb.SaveResponse,
    (request: optimizer_pb.SaveRequest) => {
      return request.serializeBinary();
    },
    optimizer_pb.SaveResponse.deserializeBinary
  );

  saveModel(request: optimizer_pb.SaveRequest, metadata: grpcWeb.Metadata | null): Promise<optimizer_pb.SaveResponse>;

  saveModel(
    request: optimizer_pb.SaveRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError, response: optimizer_pb.SaveResponse) => void
  ): grpcWeb.ClientReadableStream<optimizer_pb.SaveResponse>;

  saveModel(
    request: optimizer_pb.SaveRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError, response: optimizer_pb.SaveResponse) => void
  ) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ + "/rl_optimize.OptimizerService/SaveModel",
        request,
        metadata || {},
        this.methodInfoSaveModel,
        callback
      );
    }
    return this.client_.unaryCall(
      this.hostname_ + "/rl_optimize.OptimizerService/SaveModel",
      request,
      metadata || {},
      this.methodInfoSaveModel
    );
  }
}
