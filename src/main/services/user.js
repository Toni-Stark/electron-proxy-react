const { renderSuc, renderFail } = require('../component/web/response')
const { machineId } = require('node-machine-id')
const fetch  = require('node-fetch')

const url = 'http://192.168.10.63:7777'

export async function login(token) {
  if(!token) {
    return renderFail('请输入密钥信息')
  }

  // 开始获取mechine_code
  const mechine_code = await machineId({ original: true })

  const params = new URLSearchParams();
  params.append('token', token);
  params.append('mechine_code', mechine_code)
  // 请求一下接口地址. 如果地址不对. 则不能使用.
  const resp = await fetch(url, {
    method: 'POST',
    body: params
  })

  if(resp.status != 200) {
    return renderFail('系统错误，请联系管理员')
  }

  const data = await resp.json()

  if(data.code != 0) {
    return renderFail(data.msg)
  }

  return renderSuc({
    'expired_time': data.data.expired_time,
    'status': 1
  })
}