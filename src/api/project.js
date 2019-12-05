import { request } from '../utils/request'

export const requestProject = params => {
  return request('http://127.0.0.1:5000/api/projects', params)
}
