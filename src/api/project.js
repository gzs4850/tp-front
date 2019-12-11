import { request } from '../utils/request'

export const requestAllProject = params => {
  return request('/api/projects', params, { 'method': 'get' })
}

export const requestProject = (id, params) => {
  return request('/api/projects/' + id, params, { 'method': 'get' })
}

export const requestProjectByName = (name, params) => {
  return request('/api/projectsbyname/' + name, params, { 'method': 'get' })
}

export const addProject = params => {
  return request('/api/projects', params, { 'method': 'post' })
}

export const updateProject = (id, params) => {
  return request('/api/projects/' + id, params, { 'method': 'put' })
}

export const delProject = (id, params) => {
  return request('/api/projects/' + id, params, { 'method': 'delete' })
}
