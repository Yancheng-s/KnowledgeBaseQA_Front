import request from '@/utils/request'
import { data } from 'autoprefixer'

export const addKBS = (data) => {
    return request.post('/addKBS', data)
}

export const selectAllKBS = () => {
    return request.get('/selectAllKBS')
}

export const searchKBSByName = (keyword) => {
    return request.get('/searchKBSByName', {
        params: { keyword }
    })
}