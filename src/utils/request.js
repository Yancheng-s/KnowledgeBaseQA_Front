// 定制一个请求实例
import axios from "axios";
const baseURL = '/api';
const instance = axios.create({ baseURL });

// 添加响应拦截器
instance.interceptors.response.use(
    response => {
      // 2xx 范围内的状态码都会触发该函数。
      // 对响应数据做点什么
      return response;
    },
  err => {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    alert(err.message);
    return Promise.reject(err);
  }
)
export default instance;
