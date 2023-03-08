/**
 * @fileoverview gRPC-Web generated client stub for rl_memory
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!

/* eslint-disable */
// @ts-nocheck

import * as grpcWeb from "grpc-web";

import memory_pb from "./memory_pb";

export class MemoryServiceClient {
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

  methodInfoSaveMemory = new grpcWeb.MethodDescriptor(
    "/rl_memory.MemoryService/SaveMemory",
    grpcWeb.MethodType.UNARY,
    memory_pb.SaveMemoryRequest,
    memory_pb.CommonResponse,
    (request: memory_pb.SaveMemoryRequest) => {
      return request.serializeBinary();
    },
    memory_pb.CommonResponse.deserializeBinary
  );

  saveMemory(request: memory_pb.SaveMemoryRequest, metadata: grpcWeb.Metadata | null): Promise<memory_pb.CommonResponse>;

  saveMemory(
    request: memory_pb.SaveMemoryRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError, response: memory_pb.CommonResponse) => void
  ): grpcWeb.ClientReadableStream<memory_pb.CommonResponse>;

  saveMemory(
    request: memory_pb.SaveMemoryRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError, response: memory_pb.CommonResponse) => void
  ) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ + "/rl_memory.MemoryService/SaveMemory",
        request,
        metadata || {},
        this.methodInfoSaveMemory,
        callback
      );
    }
    return this.client_.unaryCall(
      this.hostname_ + "/rl_memory.MemoryService/SaveMemory",
      request,
      metadata || {},
      this.methodInfoSaveMemory
    );
  }

  methodInfoGetMemory = new grpcWeb.MethodDescriptor(
    "/rl_memory.MemoryService/GetMemory",
    grpcWeb.MethodType.UNARY,
    memory_pb.GetMemoryRequest,
    memory_pb.GetMemoryResponse,
    (request: memory_pb.GetMemoryRequest) => {
      return request.serializeBinary();
    },
    memory_pb.GetMemoryResponse.deserializeBinary
  );

  getMemory(request: memory_pb.GetMemoryRequest, metadata: grpcWeb.Metadata | null): Promise<memory_pb.GetMemoryResponse>;

  getMemory(
    request: memory_pb.GetMemoryRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError, response: memory_pb.GetMemoryResponse) => void
  ): grpcWeb.ClientReadableStream<memory_pb.GetMemoryResponse>;

  getMemory(
    request: memory_pb.GetMemoryRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError, response: memory_pb.GetMemoryResponse) => void
  ) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ + "/rl_memory.MemoryService/GetMemory",
        request,
        metadata || {},
        this.methodInfoGetMemory,
        callback
      );
    }
    return this.client_.unaryCall(
      this.hostname_ + "/rl_memory.MemoryService/GetMemory",
      request,
      metadata || {},
      this.methodInfoGetMemory
    );
  }

  methodInfoInitMemory = new grpcWeb.MethodDescriptor(
    "/rl_memory.MemoryService/InitMemory",
    grpcWeb.MethodType.UNARY,
    memory_pb.InitRequest,
    memory_pb.CommonResponse,
    (request: memory_pb.InitRequest) => {
      return request.serializeBinary();
    },
    memory_pb.CommonResponse.deserializeBinary
  );

  initMemory(request: memory_pb.InitRequest, metadata: grpcWeb.Metadata | null): Promise<memory_pb.CommonResponse>;

  initMemory(
    request: memory_pb.InitRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError, response: memory_pb.CommonResponse) => void
  ): grpcWeb.ClientReadableStream<memory_pb.CommonResponse>;

  initMemory(
    request: memory_pb.InitRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError, response: memory_pb.CommonResponse) => void
  ) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ + "/rl_memory.MemoryService/InitMemory",
        request,
        metadata || {},
        this.methodInfoInitMemory,
        callback
      );
    }
    return this.client_.unaryCall(
      this.hostname_ + "/rl_memory.MemoryService/InitMemory",
      request,
      metadata || {},
      this.methodInfoInitMemory
    );
  }

  methodInfoResetMemory = new grpcWeb.MethodDescriptor(
    "/rl_memory.MemoryService/ResetMemory",
    grpcWeb.MethodType.UNARY,
    memory_pb.ResetRequest,
    memory_pb.CommonResponse,
    (request: memory_pb.ResetRequest) => {
      return request.serializeBinary();
    },
    memory_pb.CommonResponse.deserializeBinary
  );

  resetMemory(request: memory_pb.ResetRequest, metadata: grpcWeb.Metadata | null): Promise<memory_pb.CommonResponse>;

  resetMemory(
    request: memory_pb.ResetRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError, response: memory_pb.CommonResponse) => void
  ): grpcWeb.ClientReadableStream<memory_pb.CommonResponse>;

  resetMemory(
    request: memory_pb.ResetRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError, response: memory_pb.CommonResponse) => void
  ) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ + "/rl_memory.MemoryService/ResetMemory",
        request,
        metadata || {},
        this.methodInfoResetMemory,
        callback
      );
    }
    return this.client_.unaryCall(
      this.hostname_ + "/rl_memory.MemoryService/ResetMemory",
      request,
      metadata || {},
      this.methodInfoResetMemory
    );
  }
}
