const { renderSuc, renderFail } = require('../component/web/response')
function getNextDayTime() {
  // 获取当前时间
  const now = new Date();
  
  // 计算明天的时间（当前时间的毫秒数 + 一天的毫秒数）
  const nextDay = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  
  // 提取年、月、日、时、分、秒
  const year = nextDay.getFullYear();
  const month = String(nextDay.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需要加1
  const day = String(nextDay.getDate()).padStart(2, '0');
  const hours = String(nextDay.getHours()).padStart(2, '0');
  const minutes = String(nextDay.getMinutes()).padStart(2, '0');
  const seconds = String(nextDay.getSeconds()).padStart(2, '0');
  
  // 拼接成标准格式
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export function login(token) {
  if(token != '123456') {
    return renderFail('密钥信息不对')
  }

  return renderSuc({
    'epxired_time': getNextDayTime(),
    'status': 1
  })  
}