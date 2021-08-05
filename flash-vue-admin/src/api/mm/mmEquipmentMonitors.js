import request from '@/utils/request'

export default {
  getList: function(params) {
    return request({
      url: '/equipment/monitors/list',
      method: 'get',
      params
    })
  },
  add: function(list) {
    return request({
      url: '/equipment/monitors',
      method: 'post',
      data: list
    })
  },
  update: function(params) {
    return request({
      url: '/equipment/monitors',
      method: 'PUT',
      params
    })
  },
  remove: function(id) {
    return request({
      url: '/equipment/monitors',
      method: 'delete',
      params: {
        equipmentId: id
      }
    })
  }
}
