import { resolve } from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'

import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue(), AutoImport({
    // https://github.com/unplugin/unplugin-auto-import
    imports: ['vue', 'vue-router'],
    eslintrc: {
      enabled: true,
    },
  })],
  build: {
    outDir: 'es', // 打包后文件目录
    minify: true, // 压缩
    rollupOptions: {
      external: ['vue'], // 忽略打包vue文件
      // input: ["index.ts"],
      output: {
        globals: {
          vue: 'Vue',
        },
        dir: 'dist',
      },
    },
    lib: {
      entry: resolve(__dirname, './src/map/index.js'),
      name: 'main',
      fileName: 'main',
      formats: ['es'], // 'umd', 'cjs'
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: '0.0.0.0',
    proxy: {
      '/geoserver': {
        target: 'http://192.168.3.61' + ':5182',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/geoserver/, '/geoserver'),
      },
    },
  },
})
