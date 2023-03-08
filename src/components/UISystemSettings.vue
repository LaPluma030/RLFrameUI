<script setup lang="ts">
import { nextTick, reactive, ref } from "vue";
import { useStorage } from "~/storage";
import useCodemirror from "~/utils/useCodemirror";
const storage = useStorage();

// 确保storage.systemSettings只在App.vue加载时被替换，此后可以直接引用
const sS = storage.systemSettings;

const serviceName = {
  ctrlServAddr: "仿真运控服务地址",
  resServAddr: "仿真资源服务地址",
  dataServAddr: "仿真数据服务地址",
  infServAddr: "推理服务地址",
  infServRawAddr: "推理服务原始地址",
  memServAddr: "存储服务地址",
  memServRawAddr: "存储服务原始地址",
  tbServAddr: "Tensorboard地址",
};
const serviceFormData = reactive({
  serviceName: "",
  serviceType: "",
  subServiceType: "",
  serviceIP: "",
  servicePort: "",
  serviceDescription: "",
  serviceParams: "",
});
const serviceTypeList = ref([
  {
    name: "仿真服务",
    value: "sim",
  },
  {
    name: "智能服务",
    value: "smart",
  },
]);
const servicePlatform = ref("");
const simPlatformList = ref(["CQSim"]);
const subServiceTypeList = ref(["CQSim"]);
const showDialog = ref(false);
const isDisable = ref(false);
function registerService() {
  isDisable.value = true;
}
const { creatCodeMirror } = useCodemirror();
function addService() {
  showDialog.value = true;
  nextTick(() => {
    creatCodeMirror(
      "serviceEditor",
      serviceFormData.serviceParams,
      (content: string) => {
        serviceFormData.serviceParams = content;
      },
      "json"
    );
  });
}
</script>
<template>
  <q-card class="q-mx-auto transparent shadow-0 ui-sys-card">
    <q-card-section class="text-center ui-sys-title">系统设置</q-card-section>

    <p class="q-pl-sm">服务管理</p>
    <div class="q-mx-auto ui-info-container">
      <div class="ui-info-section">
        <div class="row items-center justify-center ui-info-section-item">
          <div class="col-6"><q-btn class="q-mx-auto ui-btn-register" @click="addService">添加服务</q-btn></div>
        </div>
      </div>
    </div>
    <q-card-section>
      <p class="q-pl-sm">服务地址</p>
      <q-markup-table separator="horizontal" class="q-pa-none">
        <tbody>
          <tr v-for="key in Object.keys(serviceName)" :key="key">
            <td>{{ serviceName[key as keyof typeof serviceName] }}</td>
            <td>
              <q-input v-model="sS[key as keyof typeof sS]" standout class="float-right ui-sys-input" />
            </td>
          </tr>
        </tbody>
      </q-markup-table>
    </q-card-section>
    <q-card-section>
      <p class="q-pl-sm">其他设置</p>
      <q-markup-table separator="horizontal" class="q-pa-none">
        <tbody>
          <tr>
            <td>仿真平台</td>
            <td>
              <q-select
                v-model="servicePlatform"
                standout
                :options="simPlatformList"
                color="white"
                options-dense
                popup-content-class="ui-select-popup"
                class="float-right ui-sys-input ui-select"
              />
            </td>
          </tr>
          <tr>
            <td>
              控制台消息数目最大值
              <q-tooltip anchor="top right" self="top middle">过程监控面板中控制台显示的消息数目的最大值</q-tooltip>
            </td>
            <td>
              <q-input v-model.number="sS.maxTerminalMsgs" type="number" standout class="float-right ui-sys-input" />
            </td>
          </tr>
          <tr>
            <td>
              缓存数据有效期限（秒）
              <q-tooltip anchor="top right" self="top middle">关闭页面时，前端缓存数据的有效期限，单位为秒</q-tooltip>
            </td>
            <td>
              <q-input v-model.number="sS.cacheDateExpire" type="number" standout class="float-right ui-sys-input" />
            </td>
          </tr>
        </tbody>
      </q-markup-table>
    </q-card-section>
  </q-card>
  <q-dialog v-model="showDialog" class="ui-setting-dialog">
    <q-card>
      <q-card-section>
        <div class="text-h6"></div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <div class="q-mx-auto ui-info-container">
          <div class="ui-info-section">
            <div class="row items-center justify-between ui-info-section-item">
              <div class="col-2">服务名称</div>
              <div class="col-3">
                <q-input v-model="serviceFormData.serviceName" standout class="ui-sys-input ui-info-width" />
              </div>
            </div>
            <div class="row items-center justify-between ui-info-section-item">
              <div class="col-2">服务类型</div>
              <div class="col-3">
                <q-select
                  v-model="serviceFormData.serviceType"
                  standout
                  :options="serviceTypeList"
                  color="white"
                  options-dense
                  popup-content-class="ui-select-popup"
                  option-value="value"
                  option-label="name"
                  class="ui-select"
                />
              </div>
              <div class="col-2">服务子类型</div>
              <div class="col-3">
                <q-select
                  v-model="serviceFormData.subServiceType"
                  standout
                  :options="subServiceTypeList"
                  color="white"
                  options-dense
                  popup-content-class="ui-select-popup"
                  class="ui-select"
                />
              </div>
            </div>
            <div class="row items-center justify-between ui-info-section-item">
              <div class="col-2">服务IP</div>
              <div class="col-3">
                <q-input v-model="serviceFormData.serviceIP" standout class="ui-sys-input ui-info-width" />
              </div>
              <div class="col-2">服务端口</div>
              <div class="col-3">
                <q-input v-model="serviceFormData.servicePort" standout class="ui-sys-input ui-info-width" />
              </div>
            </div>
            <div class="row items-center justify-between ui-info-section-item">
              <div class="col-2">服务描述</div>
              <div class="col-10">
                <q-input v-model="serviceFormData.serviceDescription" standout class="ui-sys-input ui-info-width" />
              </div>
            </div>
            <div class="row items-center justify-between ui-info-section-item height-auto">
              <div class="col-12">
                <q-expansion-item label="服务参数">
                  <div class="row ui-noborderbottom" style="margin-top: 4px">
                    <div class="col" style="height: auto !important; min-height: 50px" id="serviceEditor"></div>
                  </div>
                </q-expansion-item>
              </div>
            </div>
            <div class="row items-center justify-between ui-info-section-item">
              <div class="col-6">
                <q-btn class="q-mx-auto ui-btn-register" :disable="isDisable" @click="registerService">注册</q-btn>
              </div>
              <div class="col-6">
                <q-btn class="q-mx-auto ui-btn-register">注销</q-btn>
              </div>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<style lang="less">
.ui-setting-dialog {
  .q-dialog__inner > div {
    width: 50%;
    height: 60%;
    max-width: 100% !important;
    background-color: #0c1d36;
  }
}
</style>
<style scoped lang="less">
.ui-sys-card {
  max-width: 867px;
  margin-top: 64px;
}
.ui-sys-title {
  font-size: 18px;
}
.ui-sys-table {
  padding: 0 28px;
}
:deep(.q-table tbody td) {
  height: 50px;
  padding: 0 28px;
  font-size: 14px;
  border-color: var(--q-negative);
}
.ui-sys-input {
  width: 263px;
  height: 36px;
  border-radius: 4px;
}
:deep(.ui-sys-input input) {
  color: white !important;
}
:deep(.ui-sys-input .q-field__control) {
  height: 36px;
  background-color: var(--q-negative) !important;
}
.ui-info-container {
  max-width: 835px;
}
.ui-info-section {
  border-radius: 4px;
  background-color: var(--q-primary);
}
.ui-info-section-item {
  height: 50px;
  padding: 7px 30px;
}
.height-auto {
  height: auto !important;
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
.ui-info-width {
  width: 100% !important;
}
.ui-info-section-item:not(:last-child) {
  border-bottom: 1px solid var(--q-negative);
}
:deep(.ui-select .q-field__native) {
  color: white !important;
}
:deep(.ui-select .q-field__control) {
  background-color: var(--q-negative) !important;
}
:deep(.ui-select) {
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
:deep(.q-expansion-item__container .q-item) {
  padding: 0px;
}
.ui-select {
  height: 36px;
  border-radius: 4px;
}
.ui-btn-register {
  width: 90% !important;
  background-color: var(--q-accent);
  color: var(--ui-disabled);
  border: 1px solid var(--q-accent);
  border-radius: 17px;
}
</style>
