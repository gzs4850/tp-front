import { request } from '../utils/request'

export const getResultlist = params => {
  return request('/api/testresults', params, { 'method': 'get' })
}

export const getResult = (id, params) => {
  return request('/api/testresults/' + id, params, { 'method': 'get' })
}
