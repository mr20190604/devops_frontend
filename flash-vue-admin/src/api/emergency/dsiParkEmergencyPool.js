import request from '@/utils/request'
export default {
    getList:function(params) {
        return request({
            url: '/park/emergency/pool/list',
            method: 'get',
            params
        })
    },
    add:function(params) {
        return request({
            url: '/park/emergency/pool',
            method: 'post',
            params
        })
    },
    update:function(params) {
        return request({
            url: '/park/emergency/pool',
            method: 'PUT',
            params
        })
    },
    remove:function(id) {
        return request({
            url: '/park/emergency/pool',
            method: 'delete',
            params: {
                id: id
            }
        })
    },
  removeBatch:function(param) {
    return request({
      url: '/park/emergency/pool/removeBatch',
      method: 'delete',
      data:param
    })
  }
}
