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
  publicDir: path.resolve(projectRoot, 'src/renderer/assets'),
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
    assetsDir: 'assets', // 静态资源（CSS、JS、图片）输出子目录
    base: './', // 确保打包后资源路径为相对路径（关键）
    rollupOptions: {
      output: {
        // 确保 chunk 文件输出到 assets 目录
        assetFileNames: 'assets/[name]-[hash].[ext]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js'
      }
    }
  }
})
