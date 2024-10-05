import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: "es", // 打包后文件目录
    minify: false, // 压缩
    rollupOptions: {
      external: ["vue"], // 忽略打包vue文件
      //input: ["index.ts"],
      output: {
        globals: {
          vue: "Vue",
        },
        dir: "dist",
      },
    },
    lib: {
      entry: resolve(__dirname, "./src/map/index.js"),
      name: "main",
      fileName: "main",
      // formats: ['es', 'umd', 'cjs']
    },
  },
  server: {
    host: "0.0.0.0",
    proxy: {
      "/geoserver": {
        target: "http://192.168.3.61" + ":5182",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/geoserver/, "/geoserver"),
      },
      // "/tdt": {
      //   target: "http://localhost:81",
      //   changeOrigin: true,
      // },
    },
  },
});
