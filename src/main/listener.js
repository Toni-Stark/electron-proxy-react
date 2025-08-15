const { ipcMain } = require('electron')
const { startProxy, stopProxy, isProxyRunning, getPort, isAdmin } = require('./component/proxy/anyproxy')
const { getStoreInfo, getStoreList, delStore } = require('./services/store')
const { getSpuList, getSkuList } = require('./services/product')
const { login } = require('./services/user')

export default function() {
  // 代理控制 IPC 通信
  ipcMain.handle('proxy:start', async () => {
    return await startProxy()
  })

  ipcMain.handle('proxy:stop', async () => {
    return await stopProxy()
  })

  ipcMain.handle('proxy:isAdmin', async () => {
    return await isAdmin()
  })

  ipcMain.handle('proxy:status', () => {
    return {
      running: isProxyRunning(),
      port: getPort()
    }
  })

  ipcMain.handle('store:list', async (e, kw = '', platform = '', page = 1) => {
    return await getStoreList(kw, platform, page)
  })

  ipcMain.handle('store:info', async (e, id) => {
    return await getStoreInfo(id)
  })

  ipcMain.handle('store:del', async(e, id) => {
    return await delStore(id)
  })

  ipcMain.handle('product:getSpuList', async(e, shop_id, kw = '', page = 1) => {
    return await getSpuList(shop_id, kw, page)
  })

  ipcMain.handle('product:getSkuList', async(e, shop_id, spu_id = '', kw = '', page = 1, is_export = 0) => {
    return await getSkuList(shop_id, spu_id, kw, page, is_export)
  })

  ipcMain.handle('user:login', async(e, token) => {
    return await login(token)
  })

  ipcMain.handle('getVersion', async() => {
    return '1.0.0'
  })
}



