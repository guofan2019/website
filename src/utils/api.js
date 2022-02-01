import axios from 'axios'
import router from '../router'
import {Message} from 'element-ui'
// 请求拦截器
axios.interceptors.request.use(config => {
  if (window.sessionStorage.getItem('tokenStr')) {
    config.headers['Authorization'] = window.sessionStorage.getItem('tokenStr')
  }
  return config
}, error => {
  console.log(error)
}
)
// 响应拦截器
axios.interceptors.response.use(success => {
  // 业务逻辑错误
  if (success.status && success.status === 200) {
    if (success.data.code === 500 || success.data.code === 401 || success.data.code === 406) {
      Message.error({message: success.data.message})
      return
    }
    if (success.data.message) {
      Message.success({message: success.data.message})
    }
  }
  return success.data
}, error => {
  if (error.response.code === 504 || error.response.code === 404) {
    Message.error({message: '服务器无响应！'})
  } else if (error.response.code === 403) {
    Message.error({message: '无权限！请联系管理员！'})
  } else if (error.response.code === 401) {
    Message.error({message: '请登录！'})
    router.replace('/')
  } else {
    if (error.response.data.message) {
      Message.error({message: error.response.data.message})
    } else {
      Message.error({message: '未知错误！'})
    }
  }
})
// 封装axios
let base = ''
export const postRequest = (url, params) => {
  return axios({
    method: 'post',
    url: `${base}${url}`,
    data: params
  })
}
export const putRequest = (url, params) => {
  return axios({
    method: 'put',
    url: `${base}${url}`,
    data: params
  })
}
export const getRequest = (url, params) => {
  return axios({
    method: 'get',
    url: `${base}${url}`,
    data: params
  })
}
export const deleteRequest = (url, params) => {
  return axios({
    method: 'delete',
    url: `${base}${url}`,
    data: params
  })
}
