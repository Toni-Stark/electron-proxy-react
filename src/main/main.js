const { app, BrowserWindow, ipcMain, Menu } = require('electron')
const path = require('path')
const url = require('url')
const jobs = require('./jobs')
const listener = require('./listener')
const { stopProxy } = require('./component/proxy/anyproxy')

// 保持对窗口对象的全局引用，如果不这样做，当JavaScript对象被垃圾回收时，窗口将自动关闭
let mainWindow

function createWindow() {
  // 创建浏览器窗口
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 700,
    resizable: false,      // 禁止调整大小
    maximizable: false,    // 禁用最大化
    fullscreenable: false, // 禁用全屏
    icon: path.join(__dirname, '../renderer/logo_256.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js') // 预加载脚本路径
    }
  })
  Menu.setApplicationMenu(null)
  // 加载应用
  // 在开发环境下加载 Vite 开发服务器
  // 在生产环境下加载打包后的 index.html
  const isDev = process.env.NODE_ENV === 'development'

  if (isDev) {
    mainWindow.loadURL('http://127.0.0.1:3000')
    // 打开开发者工具
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadURL(url.format({
      pathname: path.join(__dirname, '../renderer/index.html'),
      protocol: 'file:',
      slashes: true
    }))
  }

  // 当窗口关闭时触发
  mainWindow.on('closed', async() => {
    // 取消引用窗口对象，如果你的应用支持多窗口，通常会把多个窗口存储在一个数组里
    // 与此同时，你应该删除相应的元素
    mainWindow = null
    await stopProxy()
  })

  jobs()

  listener()
}

// Electron 会在初始化后并准备好创建浏览器窗口时调用这个函数
// 部分 API 在 ready 事件触发后才能使用。
app.on('ready', createWindow)

// 当所有窗口都关闭时退出
app.on('window-all-closed', function () {
  // 在 macOS 上，除非用户用 Cmd + Q 确定退出，否则绝大部分应用及其菜单栏会保持激活
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // 在 macOS 上，当点击 dock 图标并且没有其他窗口打开时，通常会重新创建一个窗口
  if (mainWindow === null) createWindow()
})

