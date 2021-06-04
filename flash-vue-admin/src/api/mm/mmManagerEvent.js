import request from '@/utils/request'
export default {
  getList: function(params) {
    return request({
      url: '/manager/event/list',
      method: 'get',
      params
    })
  },
  add: function(params) {
    return request({
      url: '/manager/event',
      method: 'post',
      params
    })
  },
  update: function(params) {
    return request({
      url: '/manager/event',
      method: 'PUT',
      data: params
    })
  },
  remove: function(id) {
    return request({
      url: '/manager/event',
      method: 'delete',
      params: {
        id: id
      }
    })
  },
  removeBatch: function(ids) {
    return request({
      url: '/manager/event/removeBatch',
      method: 'delete',
      params: {
        ids: ids
      }
    })
  },
  deleteFile: function(params) {
    return request({
      url: '/file/deleteFile',
      method: 'delete',
      params
    })
  },
  deleteFileMid: function(params) {
    return request({
      url: '/manager/event/deleteFileMid',
      method: 'delete',
      params
    })
  },
  queryFilesByEventId: function(params) {
    return request({
      url: '/manager/event/queryFilesByEventId',
      method: 'get',
      params
    })
  }
}
