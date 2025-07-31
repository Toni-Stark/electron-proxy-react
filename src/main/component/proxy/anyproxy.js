const AnyProxy = require('anyproxy')
const path = require('path')
const fs = require('fs')
const rule = require('./rule')

// 代理配置
// 这里的rule文件. 最好能直接加载进来. 
const proxyConfig = {
  port: 8889, // 代理端口
  enableHttps: true, // 启用 HTTPS 拦截
  rule: rule, // 代理规则文件路径
  dbPath: path.join(__dirname, '../proxyDB'), // 缓存路径
  webInterface: {
    enable: false, // 启用 Web 控制台
  }
}

// 确保证书目录存在
function ensureCertDir() {
  // console.log(AnyProxy.utils)
  // const certDir = path.join(AnyProxy.utils.getUserHome(), '.anyproxy/certificates')
  // if (!fs.existsSync(certDir)) {
  //   fs.mkdirSync(certDir, { recursive: true })
  // }
}

// 生成默认证书（首次运行需要）
async function generateDefaultCert() {
  try {
    await AnyProxy.utils.certMgr.generateRootCA((error, keyPath) => {
      // let users to trust this CA before using proxy
      if (!error) {
        const certDir = require('path').dirname(keyPath);
        console.log('The cert is generated at', certDir);
        const isWin = /^win/.test(process.platform);
        if (isWin) {
          exec('start .', { cwd: certDir });
        } else {
          exec('open .', { cwd: certDir });
        }
      } else {
        console.error('error when generating rootCA', error);
      }
    })
    console.log('AnyProxy 根证书生成成功，请信任该证书以支持 HTTPS 拦截')
  } catch (e) {
    console.error('证书生成失败:', e)
  }
}

// 代理实例
let proxyServer = null

// 启动代理
async function startProxy() {
  if (proxyServer) {
    console.log('代理已在运行')
    return true
  }

  try {
    ensureCertDir()
    await generateDefaultCert()
    
    proxyServer = new AnyProxy.ProxyServer(proxyConfig)
    
    proxyServer.on('ready', () => {
      console.log(`AnyProxy 启动成功，端口: ${proxyConfig.port}`)
    })
    
    proxyServer.on('error', (e) => {
      console.error('代理错误:', e)
      proxyServer = null
    })
    
    proxyServer.start()
    return true
  } catch (e) {
    console.error('启动代理失败:', e)
    return false
  }
}

// 停止代理
function stopProxy() {
  if (proxyServer) {
    proxyServer.close()
    proxyServer = null
    console.log('AnyProxy 已停止')
    return true
  }
  console.log('代理未在运行')
  return false
}

// 检查代理状态
function isProxyRunning() {
  return !!proxyServer
}

module.exports = {
  startProxy,
  stopProxy,
  isProxyRunning,
  getPort: () => proxyConfig.port
}
