import request from '@/utils/request'
export default {
    getList:function(params) {
        return request({
            url: '/law/statute/list',
            method: 'get',
            params
        })
    },
    add:function(params) {
        return request({
            url: '/law/statute',
            method: 'post',
            params
        })
    },
    update:function(params) {
        return request({
            url: '/law/statute',
            method: 'PUT',
            params
        })
    },
    remove:function(id) {
        return request({
            url: '/law/statute',
            method: 'delete',
            params: {
                id: id
            }
        })
    },queryDataByStatuteId:function(statuteId) {
    return request({
      url: '/statute/file/queryDataByStatuteId',
      method: 'get',
      params:{
        statuteId:statuteId
      }
    })
  },removeByStatuteId:function(statuteId) {
    return request({
      url: '/statute/file/removeByStatuteId',
      method: 'delete',
      params:{
        statuteId:statuteId
      }
    })
  },addRelation:function(params) {
    return request({
      url: '/statute/file',
      method: 'post',
      params
    })
  },
}
