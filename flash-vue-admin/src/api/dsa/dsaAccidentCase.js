import request from '@/utils/request'
export default {
    getList:function(params) {
        return request({
            url: '/accident/case/list',
            method: 'get',
            params
        })
    },
    add:function(params) {
        return request({
            url: '/accident/case',
            method: 'post',
            params
        })
    },
    update:function(params) {
        return request({
            url: '/accident/case',
            method: 'PUT',
            params
        })
    },
    remove:function(id) {
        return request({
            url: '/accident/case',
            method: 'delete',
            params: {
                id: id
            }
        })
    },
  removeBatch1: function(ids) {
    return request({
      url: '/accident/case/removeBatch1',
      method: 'delete',
      params: {
        ids: ids
      }
    })
  }
}
