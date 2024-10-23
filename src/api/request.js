/*
 * @Date: 2024-10-22 19:49:33
 * @LastEditors: ReBeX  cswwwx@gmail.com
 * @LastEditTime: 2024-10-22 19:50:50
 * @FilePath: \vite-csw\src\api\request.js
 * @Description: 网络请求 - axios封装
 */

import axios from 'axios'

// 创建一个新的请求实例instance,instance.的用法和axios.的用法一致，可以使用instance({})、instance.get（）、instance.post()
const instace = axios.create({
  baseURL: '', // 默认配置(这里不要用process.env,属性名必须以VITE_API_开头,否则 import.meta.env检测不到)
  timeout: 50000, // 超时时间
})

// 配置请求拦截器,在请求之前的数据处理,比如在请求头添加token,所有的请求都会经过拦截器
instace.interceptors.request.use(
  // config:该参数表示当前请求的配置对象
  (config) => {
    // 设置请求头Token
    // config.headers['bht-token'] = window.Token || config.token

    if (!config.url) {
      console.error('请求地址为空')
      return Promise.reject(new Error('没有访问权限，请联系管理员'))
    }

    return config
  },
  (err) => {
    return Promise.reject(err) // 将错误消息挂到promise的失败函数上
  },
)

// 配置响应拦截器
// 响应拦截器:在请求响应之后对数据处理，比如:登录失败、请求数据失败的处理
// instance.interceptors.response.use(response=>{l}, err=>{});
// 响应成功:执行回调函数1;响应失败，执行回调函数2
instace.interceptors.response.use(
  (response) => {
    if (response && response.data.code && response.data.code !== 200) {
      // 请求成功后的报错拦截
      console.error(response.data.message)
      return
    }
    return response.data // 这里的response就是请求成功后的res , response.data即是请求成功后回调函数内的参数res.data
  },
  (err) => {
    console.log('err: ', err)
    return Promise.reject(err) // 将错误消息挂到promise的失败函数上
  },
)

// 封装请求的api
function callapi(method = 'GET', url, data = {}, config) {
  return instace({
    method,
    url,
    params: method === 'GET' ? data : {},
    data: method === 'POST' ? data : {},
    ...config,
  })
}

// 封装请求函数，用例请全局搜索getapi或postapi
export const getapi = (url, data, config) => callapi('GET', url, data, config)
export const postapi = (url, data, config) => callapi('POST', url, data, config)
