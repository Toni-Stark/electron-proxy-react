// anyproxy的规则文件.
function isCrawlHost(host) {
  const domains = {
    'meituan': [
      'meituan.com',
      'meituan.net',  
    ],
    'eleme': [
      'ele.me',
      'mmstat.com'
    ],
  }

  for(let platform in domains) {
    for(let idx in domains[platform]) {
      if(host.indexOf(domains[platform][idx]) > -1) {
        return platform
      }
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
    // console.log(requestDetail.requestData.toString())
    // 这里可以增加一些其他的东西过来. 例如使用的哪个代理撒的. 先不管吧. 我们只是拦截其他的网络请求而已.
    return {
      requestOptions: requestDetail.requestOptions
    }
  },

  // 拦截响应. 仅仅只抓取固定的域名信息.
  beforeSendResponse(requestDetail, responseDetail) {
    // 这里可以只获取指定的json地址就可以了.
    const link_info = new URL(requestDetail.url)
    const platform = isCrawlHost(link_info.host)
    if(!platform) {
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

    // cors策略屏蔽.
    if(requestDetail.requestOptions.method.toLowerCase() == 'options') {
      return {
        response: responseDetail.response
      }
    }

    // 这里开始保存. 可以放到另外一个地方了. 后面来看. 
    const QueueList = require('../../models/queue_list')

    // 某些固定的url 需要获取request里面的请求数据. 由于某些不是标准的. 所以我们这里先抓取指定的连接用来做对应的数据信息.
    // 这里要注意以下. 如果某些可以转成字符串的. 就可以先行转换以下. 必须要拿到请求的参数. 用来判断是哪一个店.
    QueueList.create({
      platform: platform,
      queue_name: 'crawl_data',
      // 保存所有的data数据. 后面看逻辑怎么操作了.
      data: JSON.stringify({
        'url': requestDetail.url,
        'body': responseDetail.response.body.toString(),
        'resp_headers': headers,
        'req_headers': requestDetail.requestOptions.headers,
        'req_params': requestDetail.requestData.toJSON()
      }),
      status: -2
    }).then(() => {
      console.log('数据保存成功')
    })
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