import { request } from '../utils/request'

export const requestIfcaselist = params => {
  return request('/api/testcaselist', params, { 'method': 'get' })
}

// export const requestSystem = (id, params) => {
//   return request('/api/systems/' + id, params, { 'method': 'get' })
// }

// export const requestSystemBySearch = (params) => {
//   return request('/api/systemsbysearch', params, { 'method': 'get' })
// }

export const addIfcase = params => {
  return request('/api/testcases', params, { 'method': 'post' })
}

export const updateIfcase = (id, params) => {
  return request('/api/testcases/' + id, params, { 'method': 'put' })
}

export const delIfcase = (id, params) => {
  return request('/api/testcases/' + id, params, { 'method': 'delete' })
}
