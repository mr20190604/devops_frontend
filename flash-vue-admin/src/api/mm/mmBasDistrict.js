import request from '@/utils/request'
export default {
  getList: function(params) {
    return request({
      url: '/bas/district/list',
      method: 'get',
      params
    })
  },
  add: function(params) {
    return request({
      url: '/bas/district',
      method: 'post',
      params
    })
  },
  update: function(params) {
    return request({
      url: '/bas/district',
      method: 'PUT',
      params
    })
  },
  remove: function(id) {
    return request({
      url: '/bas/district',
      method: 'delete',
      params: {
        id: id
      }
    })
  },
  getChildren: function(parentCode) {
    return request({
      url: '/bas/district/getChildren',
      method: 'get',
      params: {
        parentCode
      }
    })
  }

}
