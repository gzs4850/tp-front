import { request } from '../utils/request'

export const getResultlist = params => {
  return request('/api/testresults', params, { 'method': 'get' })
}

export const getResult = (id, params) => {
  return request('/api/testresults/' + id, params, { 'method': 'get' })
}

export const getResultStatistic = params => {
  return request('/api/resultstatistic', params, { 'method': 'get' })
}

export const getBatchNumber = params => {
  return request('/api/bacthnumber', params, { 'method': 'get' })
}
