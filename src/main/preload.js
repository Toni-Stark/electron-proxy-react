const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('proxyAPI', {
  start: () => ipcRenderer.invoke('proxy:start'),
  stop: () => ipcRenderer.invoke('proxy:stop'),
  getStatus: () => ipcRenderer.invoke('proxy:status')
})