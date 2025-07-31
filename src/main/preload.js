const { contextBridge, ipcRenderer } = require('electron')
const { app } = require('electron').remote ? require('electron').remote : require('electron')

// 向渲染进程暴露API
contextBridge.exposeInMainWorld('electronAPI', {
  getAppVersion: () => app.getVersion()
})
