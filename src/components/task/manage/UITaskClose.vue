<script setup lang="ts">
// 新建任务页面
import { useRouter, useRoute } from "vue-router";
import { useQuasar } from "quasar";
import { useStorage } from "~/storage";
import { deepCopy, getTimeString } from "utils";
const route = useRoute();
const router = useRouter();
const $q = useQuasar();
const storage = useStorage();

// 如果没有任务打开就回退到启动页
if (!storage.isTaskOpen) {
  router.push("/welcome");
}

// 取消关闭任务
function cancel() {
  router.back();
}
// 不保存任务
async function close() {
  // 若训练仍在进行，则需要手动停止
  if (storage.monitorStatus.simState !== "Stopped") {
    router.push("/monitor");
    $q.notify({
      type: "warning",
      message: "训练仍在进行，请停止训练后再关闭任务",
    });
  } else {
    if (storage.isTaskFlag == "add") {
      storage.currentTask = deepCopy(storage.taskTemplate);
      //新建任务，进入taskInfo页面
      const cT = storage.currentTask;
      if (route.query.taskName) {
        cT.name = route.query.taskName as string;
      }
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
    if (storage.isTaskFlag == "close") {
      storage.currentTask = deepCopy(storage.taskTemplate);
      storage.isTaskOpen = false;
      storage.isTaskNew = false;
      router.push("/welcome");
      $q.notify({
        type: "info",
        message: "已关闭任务",
      });
    }
    if (storage.isTaskFlag == "open") {
      if (route.query.taskId) {
        try {
          await storage.openTask(parseInt(route.query.taskId as string));
          router.push("/task-info");
        } catch (err) {
          if (err instanceof Error) {
            $q.notify({
              type: "error",
              message: err.message,
            });
          }
          router.back();
        }
      }
    }
  }
}
// 保存任务
async function save() {
  try {
    await storage.saveTask();
    $q.notify({
      type: "info",
      message: "保存任务成功",
    });
    close();
  } catch (e) {
    if (e instanceof Error) {
      router.back();
      $q.notify({
        type: "error",
        message: "保存任务时出错：" + e.message,
      });
    }
  }
}
</script>
<template>
  <q-dialog model-value @hide="cancel">
    <q-card flat class="bg-secondary ui-close-card">
      <q-card-section class="flex items-center justify-between bg-positive ui-close-caption">
        <span>关闭当前任务</span>
        <q-icon name="clear" size="xs" class="text-darken cursor-pointer" @click="cancel" />
      </q-card-section>
      <q-card-section class="flex items-center justify-center ui-close-info"> 是否保存当前任务设置？ </q-card-section>
      <q-card-actions class="ui-close-btn-list">
        <q-btn class="ui-close-btn bg-info" @click="save">保存</q-btn>
        <q-btn class="ui-close-btn ui-close-btn-no" @click="close">不保存</q-btn>
        <q-btn class="ui-close-btn ui-close-btn-no" @click="cancel">取消</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<style scoped>
.ui-close-card {
  width: 484px;
  height: 350px;
  border: 1px solid var(--ui-disabled);
  border-radius: 0;
}
.ui-close-caption {
  height: 40px;
  padding: 0 19px 0 22px;
}
.ui-close-info {
  margin-top: 70px;
  font-size: 16px;
}
.ui-close-btn-list {
  position: absolute;
  right: 0;
  bottom: 0;
  margin-right: 30px;
  margin-bottom: 13px;
}
.ui-close-btn {
  width: 70px;
  height: 30px;
  border-radius: 4px;
  font-size: 12px;
}
.ui-close-btn-no {
  margin-left: 35px !important;
  border: 1px solid var(--q-info);
  background-color: transparent;
  color: var(--q-accent);
}
</style>
