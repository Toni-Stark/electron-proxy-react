// 获取token
export const getToken = () => localStorage.getItem('token');

// 设置token
export const setToken = (token) => localStorage.setItem('token', token);

// 清除token
export const removeToken = () => localStorage.removeItem('token');

export const setStorage = (key, value) => localStorage.setItem(key, value);

export const removeStorage = (key) => localStorage.removeItem(key);

export const getStorage = (key) => localStorage.getItem(key);
