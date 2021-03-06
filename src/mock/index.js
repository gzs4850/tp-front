import Mock from 'mockjs'

export default {
  mockData () {
    const BASE_PATH = process.env.BASE_URL.endsWith('/')
      ? process.env.BASE_URL.substr(0, process.env.BASE_URL.length - 1)
      : process.env.BASE_URL
    Mock.mock(BASE_PATH + '/api/user/login', {
      'code': 1,
      'token': 'fdsjfhjkdshfkldsajfjasdfbjsdkfhsdajfj',
      'result': {
        'id': '100001',
        'name': '林锦泽',
        'roles': ['admin']
      }
    })
    Mock.mock(BASE_PATH + '/api/user/register', {
      'code': 1
    })
    Mock.mock(BASE_PATH + '/api/user/info', {
      'code': 1,
      'id': '100001',
      'name': '林锦泽',
      'roles': ['admin'],
      'permissions': [
        {
          // 一个页面一个对象，以name确定（对应静态路由表里面的name）
          name: 'index'
        }, {
          name: 'table'
        }, {
          name: 'project'
        }, {
          name: 'userPassword'
        }, {
          name: 'level4'
        }, {
          name: 'level4Detail',
          // permission存储数据级权限控制
          permission: ['modify', 'delete']
        }
      ]
    })
  }
}
