import { request } from '../utils/request'

export const requestIfcaselist = params => {
  return request('/api/testcaselist', params, { 'method': 'get' })
}

export const getIfcase = (id, params) => {
  return request('/api/testcases/' + id, params, { 'method': 'get' })
}

export const addIfcase = params => {
  return request('/api/testcases', params, { 'method': 'post' })
}

export const updateIfcase = (id, params) => {
  return request('/api/testcases/' + id, params, { 'method': 'put' })
}

export const delIfcase = (id, params) => {
  return request('/api/testcases/' + id, params, { 'method': 'delete' })
}

export const getRefercase = (id, params) => {
  return request('/api/testcases/refercase/' + id, params, { 'method': 'get' })
}

export const addRefercase = (id, params) => {
  return request('/api/testcases/refercase/' + id, params, { 'method': 'put' })
}

export const updateRefercase = (id, params) => {
  return request('/api/testcases/refercase/' + id, params, { 'method': 'put' })
}

export const delRefercase = (id, params) => {
  return request('/api/testcases/refercase/' + id, params, { 'method': 'delete' })
}
