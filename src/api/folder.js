// 编写测试接口
import request from '@/utils/request'
import { data } from 'autoprefixer'

export const addNewFolderServer = (data) => {
  return request.post('/addfolder', data)
}

export const selectAllFolderServer = () => {
  return request.get('/selectallfolder')
}

export const updateFolderNameServer = (data) => {
    return request.post('/updatefolder', data)
}

export const delateFolderServer = (data) => {
    return request.post('/delatefolder', data)
}

export const uploadFileServer = (data) => {
  return request.post('/fileupload', data)
}

export const selectAllFileServer = (data) => {
  return request.post('/selectfilelist', data)
}

export const selectFilesByNameServer = (data) => {
  return request.post('/selectfilebyname', data)
}