import request from '@/utils/request'

export const selectAllModelServer = () => {
  return request.get('/listModels')
}