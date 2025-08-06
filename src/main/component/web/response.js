function renderJSON(code = 200, data = {}, msg = '') {
  return {code, data, msg}
}

export function renderSuc(data = {}, msg = '操作成功') {
  return renderJSON(200, data, msg)
}

export function renderFail(msg = '系统错误', data = {}) {
  return renderJSON(-1, data, msg)
}