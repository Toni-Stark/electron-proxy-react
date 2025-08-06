// 获取token
export const getToken = () => localStorage.getItem('token');

// 设置token
export const setToken = (token) => localStorage.setItem('token', token);

// 清除token
export const removeToken = () => localStorage.removeItem('token');
