/*
一次性导入所有组件
*/

import { DefineComponent } from "vue";

type Component = DefineComponent<{}, {}, any>;

const _comps = import.meta.globEager("./**/*.vue");

const UI: { [key: string]: Component } = {};

for (const [key, value] of Object.entries(_comps)) {
  const name = key.match(/[\.\/\w]*\/([\w]*).vue/)![1];
  const comp = value.default;
  UI[name] = comp;
}

export default UI;
