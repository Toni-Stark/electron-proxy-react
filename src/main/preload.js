const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('drugApi', {
  start: () => ipcRenderer.invoke('proxy:start'),
  stop: () => ipcRenderer.invoke('proxy:stop'),
  getStatus: () => ipcRenderer.invoke('proxy:status'),
  isAdmin: () => ipcRenderer.invoke('proxy:isAdmin'),
  userLogin: (token) => ipcRenderer.invoke('user:login', token),
  storeList: (kw = '', platform = '', page = 1) => ipcRenderer.invoke('store:list', kw, platform, page),
  storeInfo: (id) => ipcRenderer.invoke('store:info', id),
  storeDel: (id) => ipcRenderer.invoke('store:del', id),
  // 获取spu信息
  getSpuList: (shop_id, kw = '', page = 1) => ipcRenderer.invoke('product:getSpuList', shop_id, kw, page),
  // 获取sku信息
  getSkuList: (shop_id, spu_id = '', kw = '', page = 1, is_export = 0) => ipcRenderer.invoke('product:getSkuList', shop_id, spu_id, kw, page, is_export),
})
