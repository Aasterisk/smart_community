import axios from 'axios'
// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API,
  timeout: 30000 // 请求超时时间
});
axios.defaults.withCredentials=true;
// request拦截器
service.interceptors.request.use(config => {
  config.headers['gaeaToken'] = sessionStorage.getItem('gaeaToken')
  return config
}, error => {
  console.log(error) // for debug
  Promise.reject(error)
});

// respone拦截器
service.interceptors.response.use(
  response => {
    const resultData = response.data;
    return resultData;
  },
  err => {
    console.log('err' + err);// for debug
    if (err && err.response) {
      switch (err.response.status) {
        case 400:
          err.message = '错误请求'
          break;
        case 401:

          break;
        case 403:
          err.message = '拒绝访问' // 跳回登录
          break;
        case 404:
          err.message = '请求错误,未找到该资源'
          break;
        case 405:
          err.message = '请求方法未允许'
          break;
        case 408:
          err.message = '请求超时'
          break;
        case 500:
          err.message = err.response.data.message
          break;
        case 501:
          err.message = '网络未实现'
          break;
        case 502:
          err.message = '网络错误'
          break;
        case 503:
          err.message = '服务不可用'
          break;
        case 504:
          err.message = '网络超时'
          break;
        case 505:
          err.message = 'http版本不支持该请求'
          break;
        default:
          err.message = `连接错误${err.response.status}`
      }
    } else {
      err.message = '连接到服务器失败,请稍后再试'
    }
    console.log(err.message)
    return Promise.reject(err)
  });
export default service;
