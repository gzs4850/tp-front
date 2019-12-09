import { request } from '../utils/request'

export const requestProject = params => {
  return request('/api/projects', params)
}
