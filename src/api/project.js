import { request } from '../utils/request'

export const requestAllProject = params => {
  return request('/api/projects', params, { 'method': 'get' })
}

export const requestProject = params => {
  return request('/api/projects', params, { 'method': 'get' })
}
