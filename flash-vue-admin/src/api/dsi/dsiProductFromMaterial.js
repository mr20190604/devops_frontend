import request from '@/utils/request'

export default {
  getList: function(productId) {
    return request({
      url: '/product/from/material/list',
      method: 'get',
      params: {
        productId: productId
      }
    })
  },
  add: function(params) {
    return request({
      url: '/product/from/material',
      method: 'post',
      params
    })
  },
  update: function(params) {
    return request({
      url: '/product/from/material',
      method: 'PUT',
      params
    })
  },
  remove: function(id) {
    return request({
      url: '/product/from/material',
      method: 'delete',
      params: {
        id: id
      }
    })
  },
  addList: function(list) {
    return request({
      url: '/product/from/material/addList',
      method: 'post',
      data: list
    })
  },
  deleteList: function(productId) {
    return request({
      url: '/product/from/material/deleteList',
      method: 'delete',
      params: {
        productId: productId
      }
    })
  }
}
