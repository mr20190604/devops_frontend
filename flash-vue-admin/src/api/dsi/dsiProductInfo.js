import request from '@/utils/request'
export default {
  getList: function(params) {
    return request({
      url: '/product/info/list',
      method: 'get',
      params
    })
  },
  add: function(params) {
    return request({
      url: '/product/info',
      method: 'post',
      params
    })
  },
  update: function(params) {
    return request({
      url: '/product/info',
      method: 'PUT',
      params
    })
  },
  remove: function(id) {
    return request({
      url: '/product/info',
      method: 'delete',
      params: {
        id: id
      }
    })
  },
  removeBatch1: function(ids) {
    return request({
      url: '/product/info/removeBatch',
      method: 'delete',
      params: {
        ids: ids
      }
    })
  }
}
