<script setup lang="ts">
// 新建任务页面
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";

import { useStorage } from "~/storage";

import { deepCopy, getTimeString } from "utils";

const router = useRouter();
const $q = useQuasar();
const storage = useStorage();

// 如果没有任务打开就回退到启动页
if (!storage.isTaskOpen) {
  router.push("/welcome");
}

// 取消另存任务
function cancel() {
  router.back();
}
// 确认另存任务
const taskName = ref(storage.currentTask.name + "-副本");
async function saveTaskAs() {
  try {
    const cT = storage.currentTask;
    // 保存当前任务
    await storage.saveTask();
    // 将当前任务复制一份
    const prevTask = deepCopy(storage.currentTask);
    // 修改当前任务的引用关系
    prevTask.scenario = cT.scenario;
    prevTask.design = cT.design;
    prevTask.smartModel = cT.smartModel;
    // 将当前任务加入任务列表
    storage.tasks.push(prevTask);

    // 将currentTask当作另存的任务
    cT.name = taskName.value;
    cT.createTime = getTimeString();
    cT.updateTime = getTimeString();
    // 保存另存的任务
    storage.isTaskOpen = true;
    storage.isTaskNew = true;
    await storage.saveTask();

    router.back();
    $q.notify({
      type: "info",
      message: "另存任务成功",
    });
  } catch (e) {
    if (e instanceof Error) {
      $q.notify({
        type: "error",
        message: "另存任务时出错：" + e.message,
      });
    }
  }
}
</script>
<template>
  <q-dialog model-value @hide="cancel">
    <q-card flat class="bg-secondary ui-saveas-card">
      <q-card-section class="flex items-center justify-between bg-positive ui-saveas-caption">
        <span>任务另存为...</span>
        <q-icon name="clear" size="xs" class="text-darken cursor-pointer" @click="cancel" />
      </q-card-section>
      <q-card-section class="flex items-center justify-center ui-saveas-name">
        <span>任务名称:</span>
        <q-input v-model="taskName" borderless dense placeholder="请输入任务名称" class="ui-saveas-input"> </q-input>
      </q-card-section>
      <q-card-actions class="ui-saveas-btn-list">
        <q-btn class="ui-saveas-btn bg-info" @click="saveTaskAs">确定</q-btn>
        <q-btn class="ui-saveas-btn ui-saveas-btn-no" @click="cancel">取消</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<style scoped>
.ui-saveas-card {
  width: 484px;
  height: 350px;
  border: 1px solid var(--ui-disabled);
  border-radius: 0;
}
.ui-saveas-caption {
  height: 40px;
  padding: 0 19px 0 22px;
}
.ui-saveas-name {
  margin-top: 48px;
  font-size: 16px;
}
.ui-saveas-input {
  width: 297px;
  height: 36px;
  margin-left: 16px;
  padding: 0 15px;
  border: 1px solid var(--q-positive);
  border-radius: 5px;
  font-size: 16px;
}
:deep(.q-field__control) {
  height: 34px !important;
}
.ui-saveas-btn-list {
  position: absolute;
  right: 0;
  bottom: 0;
  margin-right: 30px;
  margin-bottom: 13px;
}
.ui-saveas-btn {
  width: 70px;
  height: 30px;
  border-radius: 4px;
  font-size: 12px;
}
.ui-saveas-btn-no {
  margin-left: 35px !important;
  border: 1px solid var(--q-info);
  background-color: transparent;
  color: var(--q-accent);
}
</style>
