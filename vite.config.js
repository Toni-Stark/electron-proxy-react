import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import electron from 'vite-plugin-electron'
import path from 'path'
import glob from 'glob'
import commonjs from '@rollup/plugin-commonjs'

const projectRoot = __dirname

const mainFiles = glob.sync('src/main/**/**/*.js', { cwd: projectRoot})

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    // 模拟 Node.js 的 global 变量
    'global': 'window',
  },
  plugins: [
    react(),
    electron({
      // 使用绝对路径确保正确定位主进程文件
      entry: path.resolve(projectRoot, 'src/main/main.js'),
      // 配置Electron打包选项
      vite: {
        build: {
          outDir: path.resolve(projectRoot, 'dist/main'),
          rollupOptions: {
            input: {
              main: path.resolve (projectRoot, 'src/main/main.js'),
              ...mainFiles.reduce((obj, file) => {
                // 为每个文件生成唯一键（如 "proxy"、"proxyRules"）
                const name = file.replace('src/main/', '').replace('.js', '')
                obj[name] = path.resolve(projectRoot, file)
                return obj
              }, {})
            },
            output: {
              entryFileNames: '[name].js',
              chunkFileNames: '[name].js'
            }
          },
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
    }),
    {
      ...commonjs({
        include: [
          /rc-menu/,
          /rc-select/,
        ],
        // 处理混合模块
        transformMixedEsModules: true
      }),
      // 在Vite的预构建阶段应用此插件
      enforce: 'pre'
    }
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
      '@': path.resolve(projectRoot, 'src/renderer'),
    }
  },
  optimizeDeps: {
    include: ['rc-menu', 'rc-select'],
    // 告诉Vite这些模块是CommonJS格式
    commonjsOptions: {
      include: [/rc-menu/, /rc-select/]
    }
  },
  build: {
    outDir: path.resolve(projectRoot, 'dist/renderer'),
    emptyOutDir: true,
    assetsDir: 'assets', // 静态资源（CSS、JS、图片）输出子目录
    base: './', // 确保打包后资源路径为相对路径（关键）
    commonjsOptions: {
      transformMixedEsModules: true
    },
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
