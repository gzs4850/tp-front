import { request } from '../utils/request'

export const requestInterface = params => {
  return request('/api/interfacesbysearch', params, { 'method': 'get' })
}

// export const requestSystem = (id, params) => {
//   return request('/api/systems/' + id, params, { 'method': 'get' })
// }

// export const requestSystemBySearch = (params) => {
//   return request('/api/systemsbysearch', params, { 'method': 'get' })
// }

export const addInterface = params => {
  return request('/api/interfaces', params, { 'method': 'post' })
}

export const updateInterface = (id, params) => {
  return request('/api/interfaces/' + id, params, { 'method': 'put' })
}

export const delInterface = (id, params) => {
  return request('/api/interfaces/' + id, params, { 'method': 'delete' })
}
