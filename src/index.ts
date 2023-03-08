import { createApp } from "vue";
import App from "./App.vue";
import { Quasar, quasarConfig } from "./quasar";
import router from "./router";
import storage from "./storage";

const app = createApp(App).use(Quasar, quasarConfig).use(router).use(storage);

// 挂载app
app.mount("#app");
// 当关闭页面时先卸载app
window.addEventListener("beforeunload", () => {
  app.unmount();
});
