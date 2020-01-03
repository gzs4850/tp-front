import { request } from '../utils/request'

export const jobPause = params => {
  return request('/api/pausejob', params, { 'method': 'post' })
}

export const jobResume = params => {
  return request('/api/resumejob', params, { 'method': 'post' })
}

export const jobRemove = params => {
  return request('/api/removejob', params, { 'method': 'delete' })
}

export const jobEdit = params => {
  return request('/api/editjob', params, { 'method': 'put' })
}

export const jobAdd = params => {
  return request('/api/addjob', params, { 'method': 'post' })
}

export const jobGet = params => {
  return request('/api/getjobs', params, { 'method': 'get' })
}
