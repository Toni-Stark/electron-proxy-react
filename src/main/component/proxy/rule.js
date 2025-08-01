// anyproxy的规则文件.
module.exports = {
  // 拦截请求
  beforeSendRequest(requestDetail) {
    console.log(requestDetail.url)
    // 示例：修改所有百度请求的 User-Agent
    if (requestDetail.url.includes('baidu.com')) {
      const newRequestOptions = requestDetail.requestOptions
      newRequestOptions.headers['User-Agent'] = 'Electron-AnyProxy-Client'
      return {
        requestOptions: newRequestOptions
      }
    }
    return null
  },

  // 拦截响应
  beforeSendResponse(requestDetail, responseDetail) {
    // 示例：修改 JSON 响应
    console.lof(responseDetail)
    if (requestDetail.url.includes('api.example.com')) {
      const newResponse = responseDetail.response
      try {
        const body = JSON.parse(newResponse.body.toString())
        // 在响应中添加自定义字段
        body.proxyBy = 'Electron-AnyProxy'
        newResponse.body = Buffer.from(JSON.stringify(body))
        return {
          response: newResponse
        }
      } catch (e) {
        // 非 JSON 响应不处理
      }
    }
    return null
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