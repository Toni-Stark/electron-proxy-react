const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('drugApi', {
  start: () => ipcRenderer.invoke('proxy:start'),
  stop: () => ipcRenderer.invoke('proxy:stop'),
  getStatus: () => ipcRenderer.invoke('proxy:status'),
  storeList: (kw = '', platform = '', page = 1) => ipcRenderer.invoke('store:list', kw, platform, page),
  storeInfo: (id) => ipcRenderer.invoke('store:info', id),
})
