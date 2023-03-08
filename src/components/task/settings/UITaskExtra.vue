<script setup lang="ts">
import { useRouter } from "vue-router";

import { useStorage } from "~/storage";

const router = useRouter();
const storage = useStorage();

// 如果没有任务打开就回退到启动页
if (!storage.isTaskOpen) {
  router.push("/welcome");
}
</script>
<template>
  <q-list class="q-mx-auto ui-extra-list-box">
    <q-item class="ui-extra-list-item">
      <q-item-section>
        <q-item-label>存储服务容量</q-item-label>
      </q-item-section>
      <q-item-section side>
        <q-input v-model.number="storage.currentTask.memorySize" type="number" standout class="ui-extra-input" />
      </q-item-section>
    </q-item>
    <q-item class="ui-extra-list-item">
      <q-item-section>
        <q-item-label>训练批尺寸</q-item-label>
      </q-item-section>
      <q-item-section side>
        <q-input v-model.number="storage.currentTask.batchSize" type="number" standout class="ui-extra-input" />
      </q-item-section>
    </q-item>
    <q-item class="ui-extra-list-item">
      <q-item-section>
        <q-item-label>网络参数替换周期</q-item-label>
      </q-item-section>
      <q-item-section side>
        <q-input v-model.number="storage.currentTask.replaceFrequency" type="number" standout class="ui-extra-input" />
      </q-item-section>
    </q-item>
  </q-list>
</template>
<style scoped lang="less">
.ui-extra-list-box {
  max-width: 835px;
  margin-top: 107px;
  margin-bottom: 107px;
  border-radius: 4px;
  background-color: var(--q-primary);
}
.ui-extra-list-item {
  height: 50px;
  padding: 7px 30px;
}
.ui-extra-list-item:not(:last-child) {
  border-bottom: 1px solid var(--q-negative);
}
.ui-extra-input {
  width: 263px;
  height: 36px;
  border-radius: 4px;
}
:deep(.ui-extra-input .q-field__native) {
  color: white !important;
}
:deep(.ui-extra-input .q-field__control) {
  background-color: var(--q-negative) !important;
}
:deep(.ui-extra-input) {
  .q-field__control,
  .q-field__native,
  .q-field__marginal {
    min-height: 0px;
    height: 36px;
  }
}
</style>
