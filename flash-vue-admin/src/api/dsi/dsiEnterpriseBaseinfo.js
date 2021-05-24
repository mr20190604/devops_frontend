import request from '@/utils/request'
export default {
  getList: function(params) {
    return request({
      url: '/dsi/enterprise/info/list',
      method: 'get',
      params
    })
  },
  add: function(params) {
    return request({
      url: '/dsi/enterprise/info',
      method: 'post',
      params
    })
  },
  update: function(params) {
    return request({
      url: '/dsi/enterprise/info',
      method: 'PUT',
      params
    })
  },
  remove: function(id) {
    return request({
      url: '/dsi/enterprise/info',
      method: 'delete',
      params: {
        id: id
      }
    })
  },
  queryAll: function() {
    return request({
      url: '/dsi/enterprise/info/queryAll',
      method: 'get'
    })
  },
  removeBatch1: function(ids) {
    return request({
      url: '/dsi/enterprise/info/removeBatch',
      method: 'delete',
      params: {
        ids: ids
      }
    })
  }
}
