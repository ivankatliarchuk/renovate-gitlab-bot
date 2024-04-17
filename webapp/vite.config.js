import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  base: "./",
  plugins: [
    vue({
      template: {
        compilerOptions: {
          compatConfig: {
            MODE: 2,
          },
        },
      },
    }),
  ],
  resolve: {
    mainFields: ["source", "module", "main"],
    alias: [
      { find: /^lodash$/, replacement: "lodash-es/lodash" },
      { find: /^lodash\/(.*)$/, replacement: "lodash-es/$1" },
      { find: "vue", replacement: "@vue/compat" },
    ],
  },
});
