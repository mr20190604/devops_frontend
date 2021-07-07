import request from '@/utils/request'

export default {
  getList: function(params) {
    return request({
      url: '/dsi/enterprise/risk/unit/list',
      method: 'get',
      params
    })
  },
  add: function(params) {
    return request({
      url: '/dsi/enterprise/risk/unit',
      method: 'post',
      params
    })
  },
  update: function(params) {
    return request({
      url: '/dsi/enterprise/risk/unit',
      method: 'PUT',
      params
    })
  },
  remove: function(id) {
    return request({
      url: '/dsi/enterprise/risk/unit',
      method: 'delete',
      params: {
        id: id
      }
    })
  },
  removeBatch1: function(ids) {
    return request({
      url: '/dsi/enterprise/risk/unit/removeBatch',
      method: 'delete',
      params: {
        ids: ids
      }
    })
  },
  addUnit: function(params) {
    return request({
      url: '/dsi/enterprise/risk/unit/addUnit',
      method: 'get',
      params
    })
  }
}
