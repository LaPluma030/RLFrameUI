import { Quasar, Notify, LocalStorage } from "quasar";
import "quasar/dist/quasar.prod.css";
import iconSet from "quasar/icon-set/material-icons";
import "@quasar/extras/material-icons/material-icons.css";
import "@quasar/extras/material-icons-outlined/material-icons-outlined.css";
import langCn from "quasar/lang/zh-CN";

Notify.setDefaults({
  type: "info",
  timeout: 1000,
});
Notify.setDefaults({
  type: "warning",
  timeout: 1500,
});
Notify.registerType("error", {
  color: "error",
  timeout: 2000,
  icon: "warning",
});
Notify.registerType("ask", {
  color: "info",
  timeout: 0,
  icon: "help",
  position: "center",
});

const quasarConfig = {
  config: {},
  iconSet: iconSet,
  lang: langCn,
  plugins: {
    Notify,
    LocalStorage,
  },
};

export { Quasar, quasarConfig };
