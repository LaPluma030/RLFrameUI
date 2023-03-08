import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  // plugins: [vue()],
  plugins: [vue()],
  resolve: {
    alias: {
      api: resolve(__dirname, "src/api"),
      utils: resolve(__dirname, "src/utils"),
      "~": resolve(__dirname, "src"),
      $: resolve(__dirname, "src/assets"),
      "#": resolve(__dirname, "src/components"),
    },
  },
  server: {
    open: true,
    fs: {
      strict: true,
    },
  },
  build: {
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
    brotliSize: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("/node_modules/")) {
            const modules = ["vue", "quasar"];
            const chunk = modules.find((module) => id.includes(`/node_modules/${module}`));
            return chunk ? `vendor-${chunk}` : "vendor";
          }
        },
      },
    },
  },
});
