<script setup lang="ts">
import { watch, inject } from "vue";
import { useRouter } from "vue-router";
import { useStorage } from "~/storage";
// import { setDataProcess } from "api";
const router = useRouter();
const storage = useStorage();

// 如果没有任务打开就回退到启动页
if (!storage.isTaskOpen) {
  router.push("/welcome");
}
type reloadType = () => void;
let reload: reloadType | undefined = inject("reload"); //注入reload方法
watch(
  () => storage.currentTask,
  () => {
    if (reload != undefined) {
      reload();
    }
  }
);
// 确保storage.currentTask在打开此页面后不会被替换，因此可以直接引用
const cT = storage.currentTask;
</script>
<template>
  <div class="q-mx-auto ui-info-container">
    <div class="ui-info-section">
      <div class="row items-center justify-between ui-info-section-item">
        <div class="col-4">任务名称</div>
        <div class="col-8">
          <q-input v-model="cT.name" standout class="float-right ui-info-input" />
        </div>
      </div>
      <div class="row items-center justify-between ui-info-section-item">
        <div class="col-4">任务描述</div>
        <div class="col-8">
          <q-input v-model="cT.description" standout class="float-right ui-info-input" />
        </div>
      </div>
      <div class="row items-center justify-between ui-info-section-item">
        <div class="col-4">创建时间</div>
        <div class="col-8">
          <q-input v-model="cT.createTime" standout class="float-right ui-info-input" disable />
        </div>
      </div>
      <div class="row items-center justify-between ui-info-section-item">
        <div class="col-4">修改时间</div>
        <div class="col-8">
          <q-input v-model="cT.updateTime" standout class="float-right ui-info-input" disable />
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="less">
.ui-info-container {
  max-width: 835px;
  margin-top: 107px;
  margin-bottom: 107px;
}
.ui-info-section {
  border-radius: 4px;
  margin-bottom: 8px;
  background-color: var(--q-primary);
}
.ui-info-section-item {
  height: 50px;
  padding: 7px 30px;
}
.ui-smartmodel-config {
  padding: 10px 30px;
  .q-pa-md {
    padding: 0px;
  }
}
.ui-smartmodel-name {
  display: flex;
  align-items: center;
  span {
    margin-right: 10px;
  }
}
.ui-info-section-item:not(:last-child) {
  border-bottom: 1px solid var(--q-negative);
}
.ui-info-input {
  width: 263px;
  height: 36px;
  border-radius: 4px;
}
:deep(.ui-info-input .q-field__native) {
  color: white !important;
}
:deep(.ui-info-input .q-field__control) {
  background-color: var(--q-negative) !important;
}
:deep(.ui-info-input) {
  .q-field__control,
  .q-field__native,
  .q-field__marginal {
    min-height: 0px;
    height: 36px;
  }
}
:deep(.ui-info-expansion) {
  padding-left: 30px;
  padding-right: 30px;
}
.ui-info-list {
  padding-left: 30px;
  padding-right: 30px;
  border-top: 1px solid var(--q-negative);
}
.ui-info-list-item {
  height: 50px;
  padding-left: 30px;
  padding-right: 30px;
}
:deep(.ui-info-list-item:not(:first-child)) {
  border-top-color: var(--q-negative) !important;
}
.ui-comp-btn {
  background-color: var(--q-accent);
  color: var(--ui-disabled);
  margin-left: 20px;
}
</style>
