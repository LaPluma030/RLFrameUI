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
// 取消新建任务
function taskCancel() {
  router.back();
}

// 编辑新建的任务
const taskName = ref("未命名任务");
function editNewTask() {
  storage.isTaskFlag = "add";
  // 先判断是否有任务打开
  if (storage.isTaskOpen) {
    router.push({
      path: "/task-close",
      query: {
        taskName: taskName.value,
      },
    });
  } else {
    storage.currentTask = deepCopy(storage.taskTemplate);
    const cT = storage.currentTask;
    cT.name = taskName.value;
    cT.createTime = getTimeString();
    cT.updateTime = getTimeString();
    storage.isTaskOpen = true;
    storage.isTaskNew = true;
    router.push("/task-info");
    $q.notify({
      type: "info",
      message: "新建任务成功",
    });
  }
}
</script>
<template>
  <q-dialog model-value @hide="taskCancel">
    <q-card flat class="bg-secondary ui-add-card">
      <q-card-section class="flex items-center justify-between bg-positive ui-add-caption">
        <span>新建任务</span>
        <q-icon name="clear" size="xs" class="text-darken cursor-pointer" @click="taskCancel" />
      </q-card-section>
      <q-card-section class="flex items-center justify-center ui-add-name">
        <span>任务名称:</span>
        <q-input v-model="taskName" borderless dense placeholder="请输入任务名称" class="ui-add-input"> </q-input>
      </q-card-section>
      <q-card-actions class="ui-add-btn-list">
        <q-btn class="ui-add-btn bg-info" @click="editNewTask">确定</q-btn>
        <q-btn class="ui-add-btn ui-add-btn-no" @click="taskCancel">取消</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<style scoped>
.ui-add-card {
  width: 484px;
  height: 350px;
  border: 1px solid var(--ui-disabled);
  border-radius: 0;
}
.ui-add-caption {
  height: 40px;
  padding: 0 19px 0 22px;
}
.ui-add-name {
  margin-top: 48px;
  font-size: 16px;
}
.ui-add-input {
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
.ui-add-btn-list {
  position: absolute;
  right: 0;
  bottom: 0;
  margin-right: 30px;
  margin-bottom: 13px;
}
.ui-add-btn {
  width: 70px;
  height: 30px;
  border-radius: 4px;
  font-size: 12px;
}
.ui-add-btn-no {
  margin-left: 35px !important;
  border: 1px solid var(--q-info);
  background-color: transparent;
  color: var(--q-accent);
}
</style>
