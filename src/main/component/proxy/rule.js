// anyproxy的规则文件.
function isCrawlHost(host) {
  const domains = ['meituan.com', 'ele.me', 'meituan.net']

  for(let k in domains) {
    if(host.indexOf(domains[k]) > -1) {
      return true
    }
  }

  return false
}

module.exports = {
  // 拦截请求
  beforeSendRequest(requestDetail) {
    const link_info = new URL(requestDetail.url)
    if(!isCrawlHost(link_info.host)) {
      return {
        requestOptions: requestDetail.requestOptions
      }
    }

    // 这里可以增加一些其他的东西过来. 例如使用的哪个代理撒的. 先不管吧. 我们只是拦截其他的网络请求而已.
    return {
      requestOptions: requestDetail.requestOptions
    }
  },

  // 拦截响应. 仅仅只抓取固定的域名信息.
  beforeSendResponse(requestDetail, responseDetail) {
    // 这里可以只获取指定的json地址就可以了.
    const link_info = new URL(requestDetail.url)
    if(!isCrawlHost(link_info.host)) {
      return {
        response: responseDetail.response
      }
    }
    
    // 这里要进行一次记录了. 只是记录就可以了. 记录类型是json的. 先不管图片和数据.
    const headers = responseDetail.response.header

    if(Object.keys(headers).indexOf('Content-Type') == -1) {
      return {
        response: responseDetail.response
      }
    }

    const content_type = headers['Content-Type']
    // 只要json数据. 其他不管了. 后面用来做分析使用的.
    if(content_type.indexOf('application/json') <= -1) {
      return {
        response: responseDetail.response
      }
    }

    // 这里开始保存. 可以放到另外一个地方了. 后面来看. @todo
    console.log('=============================================================')
    console.log(requestDetail.url)
    console.log(responseDetail.response.body.toString())
    return {
      response: responseDetail.response
    }
  },

  // 拦截 WebSocket
  beforeDealWebSocket(requestDetail) {
    console.log('WebSocket 连接:', requestDetail.url)
    return true
  },

  // 错误处理
  onError(requestDetail, error) {
    console.error('代理错误:', error)
  }
}