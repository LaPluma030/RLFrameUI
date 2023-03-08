<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useStorage } from "~/storage";
import useCodemirror from "~/utils/useCodemirror";
const router = useRouter();
const storage = useStorage();
const cT = storage.currentTask;
const smartModelList = cT.smartModel;
// 如果没有任务打开就回退到启动页
if (!storage.isTaskOpen) {
  router.push("/welcome");
}
const simEnviros = ref(["仿真环境1", "仿真服务2"]);
function getSimModelName(id: string) {
  let obj = cT.scenario.entities.find((item) => item.id == id);
  if (obj) return obj.displayName;
  else return "";
}
const { creatCodeMirror } = useCodemirror();
function initEditor() {
  creatCodeMirror("matchEndEditor", "", (content: string) => {});
}
onMounted(() => {
  initEditor();
});
</script>
<template>
  <div class="q-mx-auto ui-route-container">
    <div v-for="item in simEnviros" :key="item">
      <p class="q-mx-auto text-center ui-header">{{ item }}</p>
      <q-expansion-item
        v-for="simModel in smartModelList"
        :key="simModel.id"
        :label="simModel.displayName"
        class="bg-primary ui-data-expansion"
        heade-class="ui-data-expansion-header"
      >
        <q-list separator class="ui-info-list">
          <q-item v-for="id in simModel.simModelIds" :key="id" v-ripple tag="label" class="ui-data-item">
            <q-item-section>
              <q-item-label>{{ getSimModelName(id) }}</q-item-label>
            </q-item-section>
            <!-- <q-item-section avatar>
              <q-checkbox v-model="currentEntitys" :val="entity" color="cyan" :disable="disableMultOption(entity.modelID)" />
            </q-item-section> -->
          </q-item>
        </q-list>
      </q-expansion-item>
    </div>
    <q-expansion-item label="对局结束判断函数" class="bg-primary ui-data-expansion">
      <div class="row ui-noborderbottom" style="margin-top: 4px">
        <div class="col" style="height: auto !important; min-height: 50px" id="matchEndEditor"></div>
      </div>
    </q-expansion-item>
  </div>
</template>
<style scoped lang="less">
.ui-route-container {
  max-width: 835px;
  margin-top: 40px;
  margin-bottom: 107px;
  > div:last-child {
    margin-top: 30px;
  }
}

.ui-header {
  font-size: 18px;
  margin-top: 18px;
  margin-bottom: 18px;
}
.ui-info-list {
  padding-left: 30px;
  padding-right: 30px;
  border-top: 1px solid var(--q-negative);
}
.ui-data-item {
  height: 50px;
}
:deep(.ui-data-item:not(:first-child)) {
  border-top-color: var(--q-negative) !important;
}
.ui-data-expansion {
  margin-bottom: 8px;
  border-radius: 4px;
}
</style>
