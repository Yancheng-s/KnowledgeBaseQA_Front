// 编写测试接口
import request from '@/utils/request'

// 测试接口
export const testService = () => {
  return request.get('/hello')
}