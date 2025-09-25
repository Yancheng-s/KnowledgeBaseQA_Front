import request from '@/utils/request'
import { data } from 'autoprefixer'

export const selectAllAgents = () => {
    return request.get('/selectAllAgents')
}

export const optimizePromptWordsService = (data) => {
    return request.post('/optimizePromptWords', data)
}

export const addAgent = (data) => {
  return request({
    url: '/addAgent',
    method: 'post',
    data
  });
};

export const uploadImage = (data) => {
  return request({
    url: '/imageupload',
    method: 'post',
    data
  });
};

export const uploadFile = (data) => {
  return request({
    url: '/fileupload',
    method: 'post',
    data
  });
};