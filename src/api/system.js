import { request } from '../utils/request'

export const requestSystems = params => {
  return request('/api/systems', params, { 'method': 'get' })
}

export const requestSystem = (id, params) => {
  return request('/api/systems/' + id, params, { 'method': 'get' })
}

export const requestSystemBySearch = (params) => {
  return request('/api/systemsbysearch', params, { 'method': 'get' })
}

export const addSystem = params => {
  return request('/api/systems', params, { 'method': 'post' })
}

export const updateSystem = (id, params) => {
  return request('/api/systems/' + id, params, { 'method': 'put' })
}

export const delSystem = (id, params) => {
  return request('/api/systems/' + id, params, { 'method': 'delete' })
}
