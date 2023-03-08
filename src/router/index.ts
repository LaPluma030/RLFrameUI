import { createRouter, createWebHashHistory } from "vue-router";

import UI from "#/all";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      components: { default: UI.UIWelcome },
    },
    {
      path: "/welcome",
      components: { default: UI.UIWelcome },
    },
    {
      path: "/settings",
      components: { default: UI.UISystemSettings },
    },
    {
      path: "/monitor",
      components: { default: UI.UIProgressMonitor },
    },
    {
      path: "/task-info",
      components: { default: UI.UITaskInfo },
    },
    {
      path: "/task-model-data",
      components: { default: UI.UITaskModelData },
    },
    {
      path: "/task-model-network",
      components: { default: UI.UITaskModelNetwork },
    },
    {
      path: "/task-model-serve/:index",
      components: { default: UI.UITaskModelServe },
    },
    {
      path: "/task-extra",
      components: { default: UI.UITaskExtra },
    },
    {
      path: "/task-route",
      components: { default: UI.UITaskRoute },
    },
    {
      path: "/task-add",
      components: { dialog: UI.UITaskAdd },
      meta: { keepPrev: true },
    },
    {
      path: "/task-open",
      components: { dialog: UI.UITaskOpen },
      meta: { keepPrev: true },
    },
    {
      path: "/task-save-as",
      components: { dialog: UI.UITaskSaveAs },
      meta: { keepPrev: true },
    },
    {
      path: "/task-close",
      components: { dialog: UI.UITaskClose },
      meta: { keepPrev: true },
    },
    {
      path: "/task-manage",
      components: { default: UI.UITaskManage },
    },
    {
      path: "/task-model-manage",
      components: { dialog: UI.UITaskModelManage },
      meta: { keepPrev: true },
    },
    {
      path: "/task-model-select",
      name: "model-select",
      components: { dialog: UI.UISelectModel },
      meta: { keepPrev: true },
    },
    {
      path: "/:match(.*)*",
      components: { default: UI.UINotFound },
    },
  ],
});

router.beforeEach((to, from) => {
  if (to.meta.keepPrev) {
    if (from.matched.length > 0 && "default" in from.matched[0].components) {
      to.matched[0].components.default = from.matched[0].components.default;
    }
  }
  return true;
});

export default router;
