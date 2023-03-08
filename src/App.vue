<script setup lang="ts">
import { computed, onBeforeUnmount, ref, provide, nextTick } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { useStorage } from "~/storage";
import UISystemSettings from "#/UISystemSettings.vue";
import Logo from "$/logo.png";
import Brand from "$/brand.png";
const router = useRouter();
const $q = useQuasar();
const storage = useStorage();
const isRouterAlive = ref(true);
// 默认为dark mode
$q.dark.set(true);
// 应用初始化状态
const initStatus = ref("loading");
provide("reload", reload);
function reload() {
  isRouterAlive.value = false;
  nextTick(() => {
    //将isRouterAlive.valueDOM置为false后，页面元素隐藏，即DOM元素进行了更新，在更新后执行回调函数，在将 isRouterAlive.value置为true，页面重新刷新显示
    isRouterAlive.value = true;
  });
}
// 加载页面storage，包括持久化存储信息和刷新前保存的临时数据
function loadStorage() {
  // 持久化存储
  const systemSettingsJson = localStorage.getItem("systemSettings");
  if (systemSettingsJson) {
    storage.systemSettings = JSON.parse(systemSettingsJson) as typeof storage.systemSettings;
    console.log("加载系统设置信息: ", storage.systemSettings);
  } else {
    // 没有存储的系统设置信息，认为是首次使用系统
    initStatus.value = "newbie";
    console.log("没有系统设置信息");
  }
  const recentTasksJson = localStorage.getItem("recentTasks");
  if (recentTasksJson) {
    storage.recentTasks = JSON.parse(recentTasksJson) as typeof storage.recentTasks;
    console.log("加载最近任务信息: ", storage.recentTasks);
  } else {
    storage.recentTasks = [];
    console.log("没有最近任务信息");
  }
  // 刷新页面时的临时存储
  const tmpDataJson = localStorage.getItem("tmpData");
  const tmpDataTimestamp = localStorage.getItem("tmpDataTimestamp");
  if (tmpDataJson && tmpDataTimestamp) {
    const duration = Date.now() - new Date(tmpDataTimestamp).valueOf();
    // 如果之前存储的数据时间戳距此时小于5秒，认为用户是在刷新页面，否则为关闭页面
    if (duration < storage.systemSettings.cacheDateExpire * 1000) {
      const data = JSON.parse(tmpDataJson);
      storage.monitorStatus = data.monitorStatus;
      storage.isTaskOpen = data.isTaskOpen;
      storage.isTaskNew = data.isTaskNew;
      storage.currentTask = data.currentTask; // 对currentTask里scenario、design、entity的引用的修改在初始化想定列表和任务列表后再进行
    } else {
      localStorage.removeItem("tmpData");
      localStorage.removeItem("tmpDataTimestamp");
    }
  }
}
loadStorage();
// 保存页面storage，包括持久化存储信息和刷新前保存的临时数据
function saveStorage() {
  // 持久化存储
  localStorage.setItem("systemSettings", JSON.stringify(storage.systemSettings));
  localStorage.setItem("recentTasks", JSON.stringify(storage.recentTasks));
  // 刷新页面时的临时存储
  const tmpData = {
    monitorStatus: storage.monitorStatus,
    isTaskOpen: storage.isTaskOpen,
    isTaskNew: storage.isTaskNew,
    currentTask: storage.currentTask,
  };
  localStorage.setItem("tmpData", JSON.stringify(tmpData));
  localStorage.setItem("tmpDataTimestamp", new Date().toString());
}
onBeforeUnmount(saveStorage);

// 初始化想定列表、任务列表等数据
async function initialize() {
  initStatus.value = "loading";
  try {
    await storage.initialize(); // 初始化想定列表、任务列表
    const cT = storage.currentTask;
    if (cT.scenario) {
      cT.scenario = storage.scenarios.find((item) => item.id === cT.scenario.id)!;
      await storage.initEntities(cT.scenario);
      if (cT.design) {
        cT.design = cT.scenario.designs.find((item) => item.id === cT.design.id)!;
      }
    }
    initStatus.value = "inited";
    $q.notify({
      type: "info",
      message: "初始数据加载成功",
    });
  } catch (e) {
    // 无法初始化，认为资源服务地址有误
    initStatus.value = "error";
    if (e instanceof Error) {
      $q.notify({
        type: "error",
        message: "仿真资源服务地址有误，请输入正确的地址后点击确定",
        timeout: 5000,
      });
    }
  }
}

if (initStatus.value === "newbie") {
  // 如果在此浏览器上第一次访问
  $q.notify({
    type: "info",
    message: "首次使用系统，请设置正确的仿真资源服务地址后点击确定",
    timeout: 5000,
  });
} else {
//  initialize();
}

// 当前任务状态
const isTaskOpen = computed(() => storage.isTaskOpen);
const task = computed(() => storage.currentTask);
console.log(task, "获取到的任务");

// 侧边导航栏状态
const leftDrawerOpen = ref(false);
function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

// 保存任务
async function saveTask() {
  try {
    await storage.saveTask();
    $q.notify({
      type: "info",
      message: "保存任务成功",
    });
  } catch (e) {
    if (e instanceof Error) {
      $q.notify({
        type: "error",
        message: "保存任务时出错：" + e.message,
      });
    }
  }
}

// 绑定快捷键，vue的keyup事件绑定不知为何失效，因此手动实现
let keyTimestamp = 0; // 防抖
window.addEventListener("keyup", (e) => {
  const timestamp = Date.now();
  if (timestamp - keyTimestamp > 500) {
    keyTimestamp = timestamp;
    if (e.altKey) {
      const key = e.key.toLowerCase();
      if (storage.isTaskOpen) {
        switch (key) {
          case "c":
            router.push("/task-close");
            break;
          case "s":
            if (e.shiftKey) {
              router.push("/task-save-as");
            } else {
              saveTask();
            }
            break;
          default:
        }
      } else {
        switch (key) {
          case "n":
            router.push("/task-add");
            break;
          case "o":
            router.push("/task-open");
            break;
          case "m":
            router.push("/task-manage");
            break;
          default:
        }
      }
    }
  }
});
function gotoClosePage() {
  storage.isTaskFlag = "close";
  router.push("/task-close");
}

initStatus.value="inited";
</script>

<template>
  <q-layout v-if="initStatus === 'inited'" view="hHh lpR fFf">
    <q-header elevated>
      <q-toolbar class="ui-header-toolbar">
        <q-btn dense flat round icon="menu" :class="{ 'text-accent': leftDrawerOpen }" @click="toggleLeftDrawer" />
        <q-avatar class="q-ml-md">
          <q-img :src="Logo" width="33px" height="33px" alt="Logo" />
        </q-avatar>
        <q-toolbar-title shrink class="ui-header-title">
          <q-img :src="Brand" width="192px" height="17px" alt="Brand" />
        </q-toolbar-title>
        <div class="row q-ml-xl bg-secondary shadow-2 ui-header-menus">
          <q-btn align="left" flat label="任务" class="ui-menu-header">
            <q-menu fit anchor="bottom middle" self="top middle" class="bg-secondary text-center">
              <q-list dense padding class="ui-menu">
                <q-item v-ripple v-close-popup clickable to="/task-add" active-class="">
                  <q-item-section>新建任务</q-item-section>
                </q-item>
                <q-item v-ripple v-close-popup clickable to="/task-open" active-class="">
                  <q-item-section>打开任务</q-item-section>
                </q-item>
                <q-item
                  v-ripple
                  v-close-popup
                  clickable
                  :disable="!isTaskOpen"
                  :class="{ 'text-disabled': !isTaskOpen }"
                  active-class=""
                  @click="gotoClosePage"
                >
                  <q-item-section>关闭当前任务</q-item-section>
                </q-item>
                <q-item
                  v-ripple
                  v-close-popup
                  clickable
                  :disable="!isTaskOpen"
                  :class="{ 'text-disabled': !isTaskOpen }"
                  active-class=""
                  @click="saveTask"
                >
                  <q-item-section>保存任务</q-item-section>
                </q-item>
                <q-item
                  v-ripple
                  v-close-popup
                  clickable
                  to="/task-save-as"
                  :disable="!isTaskOpen"
                  :class="{ 'text-disabled': !isTaskOpen }"
                  active-class=""
                >
                  <q-item-section>任务另存为...</q-item-section>
                </q-item>
                <q-separator style="margin: 5px 8px" />
                <q-item v-ripple v-close-popup clickable to="/task-manage" active-class="">
                  <q-item-section>任务管理</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
          <q-btn align="left" flat label="设置" class="ui-menu-header" to="/settings"> </q-btn>
          <q-btn align="left" flat label="帮助" class="q-mr-lg ui-menu-header">
            <q-menu fit anchor="bottom middle" self="top middle" class="bg-secondary">
              <q-list dense padding class="ui-menu">
                <q-item v-ripple v-close-popup clickable to="/welcome" active-class="">
                  <q-item-section>启动页</q-item-section>
                </q-item>
                <!-- <q-item v-ripple v-close-popup clickable to="/guide" active-class="">
                  <q-item-section>入门指引</q-item-section>
                </q-item> -->
                <q-item v-ripple v-close-popup clickable tag="a" target="_blank" href="http://www.cqhorizon.com/">
                  <q-item-section>用户文档</q-item-section>
                </q-item>
                <q-separator style="margin: 5px 8px" />
                <q-item v-ripple v-close-popup clickable tag="a" target="_blank" href="http://www.cqhorizon.com/">
                  <q-item-section>关于我们</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
          <span style="line-height: 36px; display: inline-block; margin: 0 auto">{{ isTaskOpen ? task.name : "" }}</span>
        </div>
        <q-space />
        <span style="min-width: 100px; margin-right: 10px"> © 2021 V2.0</span>
      </q-toolbar>
    </q-header>
    <!-- drawer属于布局中的一种，Layout Drawer -->
    <q-drawer v-model="leftDrawerOpen" show-if-above elevated side="left" :width="256">
      <!-- 当里面不加任何东西的话，相当于一个空的弹出层 -->
      <q-list class="full-height column">
        <!-- 任务设置 -->
        <!-- q-expansion-item相当于一个框架，；里面可以放一个下拉菜单 -->
        <q-expansion-item icon="task" label="任务设置" header-class="ui-tab-indent-1" :disable="!isTaskOpen">
          <q-list>
            <q-item
              v-ripple
              clickable
              active-class="ui-tab-active"
              to="/task-info"
              class="ui-tab-indent-2"
              :disable="!isTaskOpen"
            >
              <q-item-section avatar>
                <q-icon name="assignment" />
              </q-item-section>
              <q-item-section>基本信息</q-item-section>
            </q-item>
            <q-item
              v-ripple
              clickable
              active-class="ui-tab-active"
              to="/task-model-data"
              class="ui-tab-indent-2"
              :disable="!isTaskOpen"
            >
              <q-item-section avatar>
                <q-icon name="tune" />
              </q-item-section>
              <q-item-section>数据配置</q-item-section>
            </q-item>
            <q-item
              v-ripple
              clickable
              active-class="ui-tab-active"
              to="/task-route"
              class="ui-tab-indent-2"
              :disable="!isTaskOpen"
            >
              <q-item-section avatar>
                <q-icon name="route" />
              </q-item-section>
              <q-item-section>路由配置</q-item-section>
            </q-item>
            <q-item
              v-ripple
              clickable
              active-class="ui-tab-active"
              :to="`/task-model-network`"
              class="ui-tab-indent-2"
              :disable="!isTaskOpen"
            >
            <q-item-section avatar>
                <q-icon name="model_training" />
              </q-item-section>
              <q-item-section>模型配置</q-item-section>
            </q-item>
          </q-list>
        </q-expansion-item>
        <!-- 过程监控 -->
        <q-item
          v-ripple="isTaskOpen"
          clickable
          active-class="ui-tab-active"
          to="/monitor"
          class="ui-tab-indent-1"
          :disable="!isTaskOpen"
        >
          <q-item-section avatar>
            <q-icon name="monitor" />
          </q-item-section>
          <q-item-section>过程监控</q-item-section>
        </q-item>
        <q-space />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view v-if="isRouterAlive" />
      <router-view name="dialog" />
    </q-page-container>
  </q-layout>
  <div v-else-if="initStatus === 'loading'" class="flex flex-center fullscreen">
    <q-spinner-hourglass color="primary" size="100px" />
  </div>
  <div v-else class="fullscreen">
    <UISystemSettings />
    <div class="flex justify-center">
      <q-btn class="bg-primary ui-btn" @click="initialize">确定</q-btn>
    </div>
  </div>
</template>

<!-- 在定义样式时，尽量使用自定义的类或内联样式覆盖quasar自带的样式，无法满足需求的情况下才考虑重写quasar的样式，并请合理使用:deep() -->
<style>
/* 定义全局样式 */
* {
  padding: 0px;
  margin: 0px;
  box-sizing: border-box;
}
body,
button {
  font-family: "Microsoft YaHei" !important;
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 1px;
}

.ui-main-container {
  width: 100%;
  height: calc(100vh - 80px);
}

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
  background-color: var(--q-primary);
}

::-webkit-scrollbar-track {
  margin: 50px 0 30px 0;
  background-color: var(--q-secondary);
}

::-webkit-scrollbar-thumb {
  border-radius: 4px;
  background-color: var(--q-positive);
}

input::placeholder,
textarea::placeholder {
  color: var(--ui-darken) !important;
}

/* 定义颜色变量，优先使用变量中的颜色，变量颜色无法满足的情况下才考虑使用直接的颜色 */
.body--dark {
  --q-primary: #10253fb2; /* 主色调 */
  --q-secondary: #10253fff; /* 次色调 */

  --q-accent: #00e0ffff; /* 强调，用于active状态前景色 */
  --q-positive: #1f334aff; /* 突出，用于active状态背景色 */

  --ui-darken: #ffffff73; /* 输入组件提示文字 */
  --q-negative: #ffffff0d; /* 输入组件背景 */

  --q-info: #068295ff; /* 提示 */
  --q-warning: #f2c037ff; /* 警告 */
  --ui-error: #c10015ff; /* 错误 */
  --ui-disabled: #040b22ff; /* 禁用 */

  /* 仅支持quasar内部使用，代码中不要使用，有其他替代，如primary替代dark，disabled替代dark-page */
  --q-dark: #10253fb2; /* dark mode下其他组件底色 */
  --q-dark-page: #040b22ff; /* dark mode下body底色 */
}
.bg-darken {
  background-color: var(--ui-darken) !important;
}
.text-darken {
  color: var(--ui-darken) !important;
}
.bg-error {
  background-color: var(--ui-error) !important;
}
.text-error {
  color: var(--ui-error) !important;
}
.bg-disabled {
  background-color: var(--ui-disabled) !important;
}
.text-disabled {
  color: var(--ui-disabled) !important;
}
.ui-select-popup {
  background-color: var(--q-secondary) !important;
}
/* .absolute-full,
.fixed-full,
.fullscreen {
  left: 256px !important;
} */
</style>

<style scoped>
/* 定义header样式 */
.ui-header-toolbar {
  min-height: 0;
  height: 50px;
}
.ui-header-title {
  min-width: 240px !important;
  padding-left: 18px;
  line-height: 0;
}
.ui-header-menus {
  min-width: 400px;
  width: 1198px;
  height: 36px;
  margin-left: 20px;
  border-radius: 18px;
  margin-right: 20px;
}
.ui-menu {
  min-width: 125px;
}
.ui-menu-header {
  min-width: 80px;
}
.ui-menu > :deep(.q-item:not(.disabled):hover > .q-focus-helper) {
  background-color: var(--q-positive);
}
.ui-menu > :deep(.q-item:not(.disabled):hover > .q-item__section) {
  color: var(--q-accent);
}
.ui-menu :deep(.justify-center) {
  align-items: flex-start;
}
/* 定义drawer样式 */
:deep(.q-drawer) {
  position: fixed;
  margin: 2px 0;
}
:deep(.q-drawer .q-item__section--avatar) {
  min-width: 28px;
  padding-right: 10px;
}
.ui-tab-active {
  background-color: var(--q-positive);
  color: var(--q-accent);
}
.ui-tab-sys {
  min-height: 0;
  height: 36px;
  width: 133px;
  font-size: 14px !important;
  margin-bottom: 18px;
  padding: 0 16px;
  border-radius: 4px;
  background-color: var(--ui-disabled);
  color: var(--q-accent);
}
:deep(.ui-tab-indent-1) {
  padding-left: 27px;
  font-size: 16px;
}
:deep(.ui-tab-indent-2) {
  padding-left: 38px;
  font-size: 16px;
}
:deep(.ui-tab-indent-3) {
  padding-left: 86px;
  font-size: 14px;
}
:deep(.ui-tab-indent-4) {
  padding-left: 106px;
  font-size: 14px;
}
.ui-model-name {
  max-width: 110px;
}

/* 定义footer样式 */
.ui-footer-toolbar {
  min-height: 0;
  height: 30px;
}
.ui-footer-title {
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 2px;
}

/* 定义其他样式 */
.ui-btn {
  width: 180px;
  height: 36px;
  margin-top: 100px;
  border-radius: 4px;
  letter-spacing: 2px;
}
</style>
