<script setup lang="ts">
import { computed } from "vue";
import { useQuasar } from "quasar";

import { useStorage } from "~/storage";
import router from "~/router";
const $q = useQuasar();
const storage = useStorage();

//是否有最近任务
const hasTask = computed(() => storage.recentTasks.length > 0);

// 打开任务
async function openTask(id: number) {
  // 先判断是否有任务打开
  if (storage.isTaskOpen) {
    storage.isTaskFlag = "open";
    router.push({
      path: "/task-close",
      query: {
        taskId: id,
      },
    });
  } else {
    try {
      await storage.openTask(id);
      router.push("/task-info");
    } catch (e) {
      // 打开时发生错误则认为该任务被删除了，从最近任务列表里删去该任务
      const idx = storage.recentTasks.findIndex((item) => item.id === id);
      storage.recentTasks.splice(idx, 1);
      if (e instanceof Error) {
        $q.notify({
          type: "error",
          message: "打开任务时出错：" + e.message,
        });
      }
    }
  }
}
</script>
<template>
  <!-- 分两种情况：1、初始化无任务；2、初始化有任务 -->
  <div class="ui-flex ui-main-container">
    <!-- 有任务 -->
    <template v-if="hasTask">
      <q-list class="ui-wel-btn-list">
        <q-item>
          <q-btn class="ui-wel-btn-add" @click="$router.push('/task-add')">新建任务</q-btn>
        </q-item>
        <q-item>
          <q-btn class="ui-wel-btn-open" @click="$router.push('/task-open')">打开任务</q-btn>
        </q-item>
      </q-list>
      <q-card class="ui-wel-card">
        <q-card-section class="flex items-center q-pa-none ui-wel-card-title">
          <div class="ui-wel-line"></div>
          <span class="text-darken">最近任务</span>
        </q-card-section>
        <q-markup-table separator="none" class="transparent text-center full-width">
          <q-tr class="text-darken ui-wel-thead">
            <q-th>任务名称</q-th>
            <q-th>创建时间</q-th>
            <q-th>修改时间</q-th>
          </q-tr>
          <q-tr
            v-for="task in storage.recentTasks"
            :key="task.id"
            class="cursor-pointer ui-wel-task-row"
            @click="openTask(task.id)"
          >
            <q-td class="text-center ellipsis ui-wel-task-name">
              {{ task.name }}
              <q-tooltip anchor="top right" self="top middle">{{ task.name }}</q-tooltip>
            </q-td>
            <q-td>
              {{ task.createTime }}
            </q-td>
            <q-td>
              {{ task.updateTime }}
            </q-td>
          </q-tr>
        </q-markup-table>
      </q-card>
    </template>
    <!-- 无任务 -->
    <div v-else class="flex flex-center ui-wel-notask">
      <q-btn class="ui-wel-btn-add" @click="$router.push('/task-add')">新建任务</q-btn>
    </div>
  </div>
</template>
<style scoped>
.ui-flex {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding-top: 100px;
}
.ui-wel-btn-list {
  padding-top: 17px;
  margin-right: 42px;
}
.ui-wel-card {
  width: 1111px;
  height: 662px;
  padding: 32px 44px 32px 67px;
  border-radius: 8px;
}
.ui-wel-card-title {
  margin-bottom: 20px;
}
.ui-wel-btn-open {
  width: 142px;
  height: 35px;
  border: 1px solid #f4f4f4ff;
  border-radius: 17px;
  margin-bottom: 38px;
}
.ui-wel-btn-add {
  width: 142px;
  height: 35px;
  border: 1px solid var(--q-accent);
  border-radius: 17px;
  margin-bottom: 38px;
  background-color: var(--q-accent);
  color: var(--ui-disabled);
}
.ui-wel-line {
  width: 2px;
  height: 30px;
  margin-left: 5px;
  margin-right: 29px;
  background-color: #f4f4f473;
  display: inline-block;
}
.ui-wel-thead > th {
  font-size: 18px;
}
.ui-wel-task-row {
  height: 40px;
}
.ui-wel-task-row:hover {
  background-color: var(--q-primary);
}
.ui-wel-task-name {
  max-width: 400px;
  width: 400px;
  padding-left: 35px;
}
.ui-wel-notask {
  width: 922px;
  height: 837px;
  background-image: url($/notask.svg);
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
