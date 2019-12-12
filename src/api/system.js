import { request } from '../utils/request'

export const requestAllSystem = params => {
  return request('/api/systems', params, { 'method': 'get' })
}

export const requestSystem = (id, params) => {
  return request('/api/systems/' + id, params, { 'method': 'get' })
}

export const requestSystemByName = (name, params) => {
  return request('/api/systemsbyname/' + name, params, { 'method': 'get' })
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
