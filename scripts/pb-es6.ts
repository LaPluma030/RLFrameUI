/*
  在运行本脚本前请确保：
  1. protoc 可执行文件和 protoc-gen-grpc-web 可执行文件位于同一目录下，且该目录已加入系统 PATH ；
  2. protos 数组所描述的 proto 文件确实已经存在。
*/

import { execSync } from "child_process";
import fs from "fs";
import { resolve } from "path";

// 工作目录
const cwd = resolve(process.cwd(), "src/api/grpc");
// proto文件相关信息
const protos = [
  {
    dir: "engine-controller",
    file: "engine",
    package: "cqsim.control",
  },
  // {
  //   dir: "memory-service",
  //   file: "memory",
  //   package: "rl_memory",
  // },
  // {
  //   dir: "network-optimizer",
  //   file: "optimizer",
  //   package: "rl_optimize",
  // },
];

for (const proto of protos) {
  // 生成相关文件
  // execSync(
  //   `cd ${cwd} && protoc -I ./${proto.dir} ./${proto.dir}/${proto.file}.proto --js_out=import_style=commonjs_strict:./${proto.dir} --grpc-web_out=import_style=typescript,mode=grpcwebtext:./${proto.dir}`
  // );
  // 对 *_pb.js 文件做替换
  const pbJs = resolve(cwd, `${proto.dir}/${proto.file}_pb.js`);
  let pbJsStr = fs.readFileSync(pbJs).toString();
  pbJsStr = pbJsStr.replace(`var jspb = require('google-protobuf')`, `import * as jspb from "google-protobuf"`);
  if (proto.file === "engine") {
    pbJsStr = pbJsStr.replace(
      `var google_protobuf_timestamp_pb = require('google-protobuf/google/protobuf/timestamp_pb.js')`,
      `import google_protobuf_timestamp_pb from "./timestamp_pb"`
    );
    pbJsStr = pbJsStr.replace(
      `var google_protobuf_duration_pb = require('google-protobuf/google/protobuf/duration_pb.js')`,
      `import google_protobuf_duration_pb from "./duration_pb"`
    );
  }
  pbJsStr = pbJsStr.replace(`goog.object.extend(exports, proto)`, `export default proto.${proto.package}`);
  fs.writeFileSync(pbJs, pbJsStr);
  // 对 *ServiceClientPb.ts 文件做替换
  const scTs = resolve(cwd, `${proto.dir}/${proto.file.charAt(0).toUpperCase() + proto.file.substring(1)}ServiceClientPb.ts`);
  let scTsStr = fs.readFileSync(scTs).toString();
  scTsStr = scTsStr.replace(`import * as ${proto.file}_pb`, `import ${proto.file}_pb`);
  fs.writeFileSync(scTs, scTsStr);
}
// 重新格式化代码
execSync("npx prettier --write src/api/grpc/**/*.js src/api/grpc/**/*.ts");
