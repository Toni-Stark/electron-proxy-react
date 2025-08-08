const AnyProxy = require('anyproxy')
const path = require('path')
const fs = require('fs')
const rule = require('./rule')
const os = require('os')
const { exec, execSync } = require('child_process')

// 代理配置
// 这里的rule文件. 最好能直接加载进来. 
const proxyConfig = {
  port: 16888, // 代理端口
  enableHttps: true, // 启用 HTTPS 拦截
  forceProxyHttps: false, // 这里走默认的false. 只拦截该拦截的就行了  之前的方式有问题. 会拦截所有的.
  rule: rule, // 代理规则文件路径
  dbPath: path.join(__dirname, '../proxyDB'), // 缓存路径
  webInterface: {
    enable: false, // 启用 Web 控制台
  },
  wsIntercept: false,
}

// 确保证书目录存在
function ensureCertDir() {
  const certDir = path.join(os.homedir(), '.anyproxy/certificates')
  if (!fs.existsSync(certDir)) {
    fs.mkdirSync(certDir, { recursive: true })
  }
}

function isAdmin() {
  try {
    if (os.platform() === 'win32') {
      // Windows 系统：通过 net session 命令检查（管理员可执行，普通用户会报错）
      execSync('net session', { stdio: 'ignore' });
      return true;
    } else {
      // Unix-like 系统（Linux/macOS）：root 用户 UID 为 0
      return process.getuid() === 0;
    }
  } catch (err) {
    return false;
  }
}

function findCertStoreByName(cert_name) {
  // 仅支持 Windows 系统
  if (os.platform() !== 'win32') {
    console.error('错误：仅支持 Windows 系统');
    return false;
  }

  // 证书存储区（Windows 存储区名称通常首字母大写）
  const stores = ['Root', 'CA', 'My']; 
  const issuerEscaped = cert_name.replace(/"/g, '\\"'); // 转义双引号，避免命令错误

  try {
    for (const store of stores) {
      try {
        // 执行 certutil 命令，精确匹配颁发者
        // 命令说明：
        // - certutil -store 存储区：列出该存储区所有证书
        // - findstr /i /c:"Issuer: CN=xxx"：精确搜索包含指定颁发者的行
        const command = `certutil -store "${store}" | findstr /i /c:"O=${issuerEscaped}"`;
        
        // 执行命令（忽略输出内容，仅判断是否有匹配）
        execSync(command, { stdio: 'ignore' });
        return store; // 找到匹配证书，立即返回
      } catch (storeErr) {
        // 单个存储区无匹配或错误，继续检查下一个
        continue;
      }
    }

    // 所有存储区均无匹配
    return false;
  } catch (err) {
    console.error('检测证书失败：', err.message);
    return false;
  }
}


// 生成默认证书（首次运行需要）
async function generateDefaultCert() {
  try {
    if(AnyProxy.utils.certMgr.ifRootCAFileExists()) {
      return true
    }

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
    console.log('AnyProxy root cert succssed')

    return false
  } catch (e) {
    console.error('证书生成失败:', e)

    return false
  }
}

// 代理实例
let proxyServer = null

// 启动代理
async function startProxy() {
  if (proxyServer) {
    console.log('AnyProxy is running')
    return true
  }

  try {
    if(!isAdmin()) {
      console.log('current user is not admin')
      return false
    }
    // 判断证书是否安装. 如果没有安装. 则启动对应的这个数据.
    ensureCertDir()

    
    // 检测证书是否安装到root了.
    let store = findCertStoreByName('AnyProxy')

    if(!store || store.toLowerCase() != 'root') {
      await generateDefaultCert()
      return false;
    }

    proxyServer = new AnyProxy.ProxyServer(proxyConfig)
    
    proxyServer.on('ready', async () => {
      console.log(`AnyProxy start success, port: ${proxyConfig.port}`)
      AnyProxy.utils.systemProxyMgr.enableGlobalProxy('127.0.0.1', proxyConfig.port)
    })
    
    proxyServer.on('error', (e) => {
      console.error('代理错误:', e)
      proxyServer = null
    })
    
    proxyServer.start()
    return true
  } catch (e) {
    console.error('start proxy fail:', e)
    return false
  }
}

// 停止代理
async function stopProxy() {
  // 强制关闭的时候 也走代理一下 去清理一下服务
  try{
    // 这里调用会出现vbscript异常问题
    AnyProxy.utils.systemProxyMgr.disableGlobalProxy()
  }catch(e) {
    console.log(e)
  }
  
  if (proxyServer) {
    proxyServer.close()
    proxyServer = null
    console.log('AnyProxy stopped')
    return true
  }

  console.log('AnyProxy is not running')
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
