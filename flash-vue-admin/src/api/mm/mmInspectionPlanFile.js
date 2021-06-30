import request from '@/utils/request'
export default {
    getList:function(params) {
        return request({
            url: '/inspection/plan/file/list',
            method: 'get',
            params
        })
    },
    add:function(params) {
        return request({
            url: '/inspection/plan/file',
            method: 'post',
            params
        })
    },
    update:function(params) {
        return request({
            url: '/inspection/plan/file',
            method: 'PUT',
            params
        })
    },
    remove:function(id) {
        return request({
            url: '/inspection/plan/file',
            method: 'delete',
            params: {
                id: id
            }
        })
    },
  listPlanFile:function(planId) {
    return request({
      url: '/inspection/plan/file/listPlanFile',
      method: 'get',
      params:{
        planId:planId
      }
    })
  },
}
