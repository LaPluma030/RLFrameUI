<script setup lang="ts">
import { inject, watch } from "vue";
import { useStorage } from "~/storage";
import { useRoute } from "vue-router";
const storage = useStorage();
const route = useRoute();
type reloadType = () => void;
let reload: reloadType | undefined = inject("reload"); //注入reload方法
watch(
  () => route.params.index,
  (val) => {
    if (val) {
      reload != undefined ? reload() : "";
    }
  }
);
const modelIndex = parseInt(route.params.index as string);
const cM = storage.currentTask.smartModel[modelIndex];
</script>
<template>
  <q-list class="q-mx-auto ui-extra-list-box">
    <q-item class="ui-extra-list-item">
      <q-item-section>
        <q-item-label>优化服务地址</q-item-label>
      </q-item-section>
      <q-item-section side>
        <q-input v-model="cM.optServAddr" standout class="ui-extra-input" />
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
