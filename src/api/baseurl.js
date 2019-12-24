import { request } from '../utils/request'

export const getBaseurl = params => {
  return request('/api/baseurls', params, { 'method': 'get' })
}

export const addBaseurl = params => {
  return request('/api/baseurls', params, { 'method': 'post' })
}

export const updateBaseurl = (id, params) => {
  return request('/api/baseurls/' + id, params, { 'method': 'put' })
}

export const delBaseurl = (id, params) => {
  return request('/api/baseurls/' + id, params, { 'method': 'delete' })
}
