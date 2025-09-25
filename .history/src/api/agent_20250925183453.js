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
    url: '/imageUpload',
    method: 'post',
    data
  });
};

export const uploadFile = (data) => {
  return request({
    url: '/fileUpload',
    method: 'post',
    data
  });
};

export const deleteToolCache = (data) => {
  return request({
    url: '/deleteToolCache',
    method: 'delete',
    data
  });
};

export const processAgent = (agentId, data) => {
  return request.post(`/processAgent/${agentId}`, data)
}