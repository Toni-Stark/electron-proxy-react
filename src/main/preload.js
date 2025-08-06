const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('drugApi', {
  start: () => ipcRenderer.invoke('proxy:start'),
  stop: () => ipcRenderer.invoke('proxy:stop'),
  getStatus: () => ipcRenderer.invoke('proxy:status'),
  storeList: () => ipcRenderer.invoke('store:list'),
  storeInfo: () => ipcRenderer.invoke('store:info'),
})
