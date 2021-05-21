import request from '@/utils/request'
export default {
  getList: function(params) {
    return request({
      url: '/bas/build/list',
      method: 'get',
      params
    })
  },
  add: function(params) {
    return request({
      url: '/bas/build',
      method: 'post',
      params
    })
  },
  update: function(params) {
    return request({
      url: '/bas/build',
      method: 'PUT',
      params
    })
  },
  remove: function(id) {
    return request({
      url: '/bas/build',
      method: 'delete',
      params: {
        id: id
      }
    })
  },
  removeBatch: function(ids) {
    return request({
      url: '/bas/build/removeBatch',
      method: 'delete',
      params: {
        ids: ids
      }
    })
  }
}
