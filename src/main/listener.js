const { ipcMain } = require('electron')
const { startProxy, stopProxy, isProxyRunning, getPort } = require('./component/proxy/anyproxy')
const { getStoreInfo, getStoreList } = require('./services/store')

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

  ipcMain.handle('store:list', async (kw = '', platform = '', page = 1) => {
    return await getStoreList(kw, platform, page)
  })

  ipcMain.handle('store:info', async (id) => {
    return await getStoreInfo(id)
  })
}



