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
      params
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
  }
}
