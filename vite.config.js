import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import electron from 'vite-plugin-electron'
import path from 'path'

const projectRoot = __dirname

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    electron({
      // 使用绝对路径确保正确定位主进程文件
      entry: path.resolve(projectRoot, 'src/main/main.js'),
      // 配置Electron打包选项
      vite: {
        build: {
          outDir: path.resolve(projectRoot, 'dist/main')
        }
      }
    }),
    // preload脚本单独配置
    electron({
      entry: path.resolve(projectRoot, 'src/main/preload.js'),
      onstart(options) {
        // 开发时自动重启Electron
        options.startup()
      },
      vite: {
        build: {
          // 输出到与主进程相同的目录
          outDir: path.resolve(projectRoot, 'dist/main'),
          // 确保preload打包为cjs格式
          lib: {
            entry: path.resolve(projectRoot, 'src/main/preload.js'),
            formats: ['cjs'],
            fileName: () => 'preload.js'
          }
        }
      }
    })
  ],
  server: {
    port: 3000,
    strictPort: true,
    // 允许从 Electron 访问开发服务器
    cors: true
  },
  resolve: {
    alias: {
      '@': path.resolve(projectRoot, 'src/renderer')  // 修正别名路径
    }
  },
  build: {
    outDir: path.resolve(projectRoot, 'dist/renderer'),
    emptyOutDir: true,
  }
})
