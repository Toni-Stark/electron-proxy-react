const { ipcMain } = require('electron')
const { startProxy, stopProxy, isProxyRunning, getPort } = require('./component/proxy/anyproxy')
const { getStoreInfo, getStoreList } = require('./services/store')
const { getSpuList, getSkuList } = require('./services/product')

export default function() {
  // 代理控制 IPC 通信
  ipcMain.handle('proxy:start', async () => {
    return await startProxy()
  })

  ipcMain.handle('proxy:stop', async () => {
    return await stopProxy()
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

  ipcMain.handle('product:getSpuList', async(e, shop_id, kw = '', page = 1) => {
    return await getSpuList(shop_id, kw, page)
  })

  ipcMain.handle('product:getSkuList', async(e, shop_id, spu_id = '', kw = '', page = 1, is_export = 0) => {
    return await getSkuList(shop_id, spu_id = '', kw = '', page = 1, is_export = 0)
  })
}



