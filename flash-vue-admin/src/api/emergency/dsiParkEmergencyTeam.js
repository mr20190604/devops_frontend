import request from '@/utils/request'
export default {
    getList:function(params) {
        return request({
            url: '/park/emergency/team/list',
            method: 'get',
            params
        })
    },
    add:function(params) {
        return request({
            url: '/park/emergency/team',
            method: 'post',
            params
        })
    },
    update:function(params) {
        return request({
            url: '/park/emergency/team',
            method: 'PUT',
            params
        })
    },
    remove:function(id) {
        return request({
            url: '/park/emergency/team',
            method: 'delete',
            params: {
                id: id
            }
        })
    },
  removeBatch:function(param) {
    return request({
      url: '/park/emergency/team/removeBatch',
      method: 'delete',
      data:param
    })
  }
}
