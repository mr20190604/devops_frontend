import request from '@/utils/request'
export default {
    getList:function(params) {
        return request({
            url: '/inspection/trouble/list',
            method: 'get',
            params
        })
    },
    add:function(params) {
        return request({
            url: '/inspection/trouble',
            method: 'post',
            params
        })
    },
    update:function(params) {
        return request({
            url: '/inspection/trouble',
            method: 'PUT',
            params
        })
    },
    remove:function(id) {
        return request({
            url: '/inspection/trouble',
            method: 'delete',
            params: {
                id: id
            }
        })
    },queryById:function (id) {
      return request({
        url:'/inspection/trouble/queryById',
        method:'get',
        params:{
          id:id
        }
      })

  },queryHandleList:function (id) {
    return request({
      url: '/inspection/trouble/queryHandleByTroubleId',
      method: 'get',
      params: {
        troubleId: id
      }
    })
  }
}
