<template>
  <div class="layerBox glass" ref="layerBox">
    <div class="title">节点设计</div>
    <!-- :title="title" -->
    <div class="transfer">
      <div class="left">
        <div class="title1">实体列表</div>
        <div class="nodeTree">
          <q-tree
            class="col-12 col-sm-6"
            :nodes="leftNodeList"
            control-color="blue"
            color="blue"
            ref="leftTree"
            v-model:ticked="tickedLeft"
            tick-strategy="leaf"
            node-key="id"
            label-key="label"
            default-expand-all
          />
        </div>
      </div>
      <div class="center">
        <div class="toRight" @click="toRight">→</div>
        <div class="toLeft" @click="toLeft">←</div>
      </div>
      <div class="right">
        <div class="title1">节点列表</div>
        <div class="nodeTree">
          <q-tree
            class="col-12 col-sm-6"
            ref="rightTree"
            :nodes="nodeTreeAry"
            control-color="blue"
            color="blue"
            tick-strategy="strict"
            node-key="label"
            v-model:ticked="tickedRight"
            @update:ticked="handleNodeClickRight"
            label-key="label"
            default-expand-all
          />
        </div>
      </div>
    </div>
    <div class="close">
      <el-button @click="close">关闭</el-button>
    </div>
    <div class="save">
      <el-button @click="save">保存</el-button>
    </div>
    <!-- 消息提示 -->
    <q-dialog v-model="alert">
      <q-card>
        <q-card-section>
          <div class="text-h6">警告</div>
        </q-card-section>
        <q-card-section class="q-pt-none"> {{ message }} </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="OK" color="white" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<script setup lang="ts">
import { deepCopy } from "utils";
import { ref, nextTick, Ref } from "vue";
import { aryToTree } from "../../../utils/scenario-parser";
const emits = defineEmits(["close"]);
const alert = ref(false);
const message = ref("");
interface leftNode {
  id: number;
  label: string;
  modelName: string;
  model_id: string;
  pid: number;
  camp_name: string;
  uid: string;
  npid?: number;
}
interface nodeTree {
  id: number;
  label: string;
  pid: number;
  camp_name?: string;
  modelName?: string;
  model_id?: string;
  uid?: string;
  npid?: number;
  children?: Array<leftNode>;
}
interface entityTree {
  id: number;
  label: string;
  pid: number;
  children?: {
    id: number;
    label: string;
    pid: number;
    children?: Array<leftNode>;
  }[];
}
const { entityAry, nodeTreeAry } = defineProps({
  entityAry: {
    type: Array,
    required: true,
  },
  nodeTreeAry: {
    type: Array as () => Array<nodeTree>,
    required: true,
  },
});
console.log(entityAry, "entityAry");

const leftNodeList: Ref<entityTree[]> = ref([]);
leftNodeList.value = aryToTree(entityAry);
console.log(leftNodeList.value, "leftNodeList");

const tickedLeft = ref([]);
const tickedRight = ref([]);
const leftTree = ref(null as unknown as Ref);
const rightTree = ref(null as unknown as Ref);
// 选中节点的方法
function handleNodeClickRight(node: any) {
  // 控制单选
  console.log(node);
  // if (node.length > 1) node.spicle(0, 1);
  nextTick(() => {
    let rightNodes = rightTree.value.getTickedNodes();
    console.log(rightNodes, "rightNodes");
    if (rightNodes.length > 1) {
      if (rightNodes[rightNodes.length - 1].pid == -1) {
        let hideList = node.slice(0, rightNodes.length - 1);
        rightTree.value.setTicked(hideList, false); //将选中的节点取消,否则会影响下一次操作
      } else {
        if (rightNodes[0].pid == -1) {
          let hideList = node.slice(0, 1);
          rightTree.value.setTicked(hideList, false); //将选中的节点取消,否则会影响下一次操
        }
      }
    }
  });
}
// 实体->节点
function toRight() {
  console.log(leftNodeList, "leftNodeList");
  let leftNodes: leftNode[] = leftTree.value.getTickedNodes();
  let rightNodes: nodeTree[] = rightTree.value.getTickedNodes();
  console.log(leftNodes, rightNodes, "nodeTreeAry");
  if (leftNodes.length > 0) {
    if (rightNodes.length == 0) {
      message.value = "请选择要分发的节点";
      return (alert.value = true);
    } else if (rightNodes[0].pid !== -1) {
      message.value = "请选择正确的节点";
      return (alert.value = true);
    } else {
      leftNodes.forEach((item) => {
        if (item.pid == 0) {
          message.value = "请选择正确的实体";
          return (alert.value = true);
        }
        let n = deepCopy(item);
        n.npid = rightNodes[0].id;
        rightNodes[0].children?.push(n);
      });
      // 删除已经被分配节点的实体
      deleteDisEntity(leftNodes);
    }
  } else {
    message.value = "请选择实体";
    return (alert.value = true);
  }
}
// 删除已经被分配节点的实体
function deleteDisEntity(nodes: leftNode[]) {
  leftTree.value.setTicked(tickedLeft.value, false); //将选中的节点取消,否则会影响下一次操作
  nodes.forEach((ele) => {
    let firstObj = leftNodeList.value.find((item) => {
      return item.label == ele.camp_name;
    });
    if (firstObj) {
      let sceondObj = firstObj.children?.find((citem) => {
        return citem.id == ele.pid;
      });
      console.log(sceondObj);
      if (sceondObj) {
        let index = sceondObj.children?.findIndex((nitem) => {
          return nitem.id == ele.id;
        }) as number;
        if (index > -1) sceondObj.children?.splice(index, 1);
        if (sceondObj.children?.length == 0) {
          let sindex = firstObj.children?.findIndex((sitem) => sitem.id == sceondObj?.id) as number;
          if (sindex > -1) firstObj.children?.splice(sindex, 1);
        }
      }
    }
  });
}
//节点->实体
function toLeft() {
  let rightNodes: nodeTree[] = rightTree.value.getTickedNodes();
  console.log(rightNodes, "rightNodes");
  if (rightNodes.length > 0) {
    rightNodes.forEach((node) => {
      if (node.pid == -1) {
        message.value = "请选择正确的节点";
        return (alert.value = true);
      }
      // 选阵营
      let campObj = leftNodeList.value.find((camp) => {
        return camp.label == node.camp_name;
      });
      // 选模型类型
      let modelObj = campObj?.children?.find((model) => {
        return model.id == node.pid;
      });
      if (modelObj) {
        //已经有了
        modelObj.children?.push(node as leftNode);
      } else {
        // 加入到左边
        let modelType = {
          id: 0,
          label: "",
          pid: 0,
          children: [] as leftNode[],
        };
        let n = deepCopy(node) as leftNode;
        delete n.npid;
        modelType.id = n.pid;
        modelType.label = n.modelName;
        modelType.pid = campObj?.id as number;
        modelType.children.push(n);
        campObj?.children?.push(modelType);
      }
      // 删除右边
      // 找到右边的ip节点
      let nodeObj = nodeTreeAry.find((item) => {
        return item.id == node.npid;
      });
      if (nodeObj) {
        // 删除节点下边分配的实体
        let index = nodeObj.children?.findIndex((ele) => {
          return ele.uid == node.uid;
        }) as number;
        if (index > -1) nodeObj.children?.splice(index, 1);
      }
    });
  } else {
    message.value = "请选择节点";
    return (alert.value = true);
  }
  console.log("删除");
  rightTree.value.setTicked(tickedRight.value, false); //将选中的节点取消,否则会影响下一次操作
}
// 关闭弹窗
function close(event: Event) {
  event.preventDefault();
  event.stopPropagation();
  emits("close", false);
}
// 保存数据并关闭弹窗
function save(event: Event) {
  event.preventDefault();
  event.stopPropagation();
  console.log(nodeTreeAry, "nodeTreeAry");

  emits("close", false, nodeTreeAry);
}
</script>
<style scoped>
.layerBox {
  /* position: absolute; */
  /* top: 50%; */
  /* left: 50%; */
  /* transform: translate(-50%, -50%); */
  width: 35.0938vw;
  height: 57.1296vh;
  background: rgba(16, 37, 63, 0.55);
  border-radius: 10px;
  /* border-top: 8px solid #0fbbd5; */
  /* z-index: 99999; */
}

.title {
  position: absolute;
  top: 15px;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 30px;
  line-height: 30px;
  border-radius: 12px;
  text-align: center;
  background-color: #02e0ff;
}

.tree,
.mapSource {
  position: absolute;
  top: 7.3148vh;
  left: 50%;
  transform: translateX(-50%);
  width: 32.2396vw;
  height: 32.037vh;
  background-color: rgba(16, 37, 63, 0.5);
  border-radius: 5px;
  border: 1px solid #1c406c;
  opacity: 0.8;
}

.close {
  position: absolute;
  right: 2.1875vw;
  bottom: 3.6111vh;
  cursor: pointer;
}
.save {
  position: absolute;
  right: 5.1875vw;
  bottom: 3.6111vh;
  cursor: pointer;
}

.mapSource .screenage {
  margin: 14px 0 0 20px;
  color: #fff;
  font-size: 12px;
}

.mapSelectBox {
  position: absolute;
  top: 33px;
  left: 14px;
  width: 592px;
  height: 193px;
  border: 1px solid rgba(217, 255, 245, 0.1);
  border-radius: 4px;
}

.childBox {
  float: left;
  position: relative;
  width: 62px;
  height: 62px;
  margin: 10px;
  color: #fff;
  text-align: center;
}

.click {
  border: 1px solid #fff;
  color: #00ecff;
}
.transfer {
  position: absolute;
  left: 10%;
  top: 6.4815vh;
  width: 80%;
  height: 44.7778vh;
  display: flex;
}
.transfer .el-tree {
  background: none;
  color: #ecf5ff;
}
.transfer :deep(.el-tree-node:focus > .el-tree-node__content) {
  background-color: rgba(16, 37, 63, 0.7) !important;
}
/* .el-tree-node:focus {
  background-color: rgba(16, 37, 63, 0.7) !important;
} */
.transfer :deep(.el-tree-node__content:hover, .el-upload-list__item:hover) {
  background-color: rgba(16, 37, 63, 0.7) !important;
}
.transfer .title1 {
  color: #00ecff;
  font-size: 14px;
  text-align: center;
  margin: 0 1.9259vh;
}
.left {
  flex: 2;
  border: 1px solid #3b7994;
}
.nodeTree {
  height: 38.7778vh;
  overflow-y: scroll;
}
.center {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: #00ecff;
}
.center .toLeft {
  width: 30px;
  height: 30px;
  text-align: center;
  border: 1px solid #3b7994;
  cursor: pointer;
}
.center .toRight {
  width: 30px;
  height: 30px;
  text-align: center;
  border: 1px solid #3b7994;
  cursor: pointer;
}
.right {
  flex: 2;
  border: 1px solid #3b7994;
}
.jitter {
  animation: jitter 0.1s 4 linear;
}
.layerBox :deep(.el-button--primary, .el-button--default) {
  background: none;
}
.layerBox :deep(.el-button) {
  padding: 8px 10px;
  border: 1px solid #02e0ff;
  border-radius: 2px;
  color: #00e0ff;
}
::-webkit-scrollbar {
  width: 6px;
  height: 8px;
  /* background-color: #4e6e78; */
  position: absolute;
  right: 0;
  bottom: 0;
  border-radius: 5px;
}

::-webkit-scrollbar-thumb {
  background: #00ecff !important;
  border-radius: 0.625rem;
}

@keyframes jitter {
  0% {
    transform: translate(0px, 0px);
  }
  25% {
    transform: translate(10px, 0px);
  }
  50% {
    transform: translate(10px, 10px);
  }
  75% {
    transform: translate(0px, 10px);
  }
  100% {
    transform: translate(0px, 0px);
  }
}
</style>
