import request from '@/utils/request'
export default {
  getList: function(params) {
    return request({
      url: '/enterprise_info/list',
      method: 'get',
      params
    })
  },
  add: function(params) {
    return request({
      url: '/enterprise_info',
      method: 'post',
      params
    })
  },
  update: function(params) {
    return request({
      url: '/enterprise_info',
      method: 'PUT',
      params
    })
  },
  remove: function(id) {
    return request({
      url: '/enterprise_info',
      method: 'delete',
      params: {
        id: id
      }
    })
  },
  queryAll: function() {
    return request({
      url: '/enterprise_info/queryAll',
      method: 'get'
    })
  }
}
