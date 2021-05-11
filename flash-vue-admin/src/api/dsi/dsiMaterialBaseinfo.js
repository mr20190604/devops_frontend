import request from '@/utils/request'
export default {
  getList: function(params) {
    return request({
      url: '/material/baseinfo/list',
      method: 'get',
      params
    })
  },
  add: function(params) {
    return request({
      url: '/material/baseinfo',
      method: 'post',
      params
    })
  },
  update: function(params) {
    return request({
      url: '/material/baseinfo',
      method: 'PUT',
      params
    })
  },
  remove: function(id) {
    return request({
      url: '/material/baseinfo',
      method: 'delete',
      params: {
        id: id
      }
    })
  }
}
