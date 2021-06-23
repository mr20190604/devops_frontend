import request from '@/utils/request'
export default {
    getList:function(params) {
        return request({
            url: '/enterprise/risk/material/list',
            method: 'get',
            params
        })
    },
    add:function(params) {
        return request({
            url: '/enterprise/risk/material',
            method: 'post',
            params
        })
    },
    addAll:function(params){
      return request({
        url:'/enterprise/risk/material/addAll',
        method:'post',
        data:params
      })
    },
    update:function(params) {
        return request({
            url: '/enterprise/risk/material',
            method: 'PUT',
            params
        })
    },
    remove:function(id) {
        return request({
            url: '/enterprise/risk/material',
            method: 'delete',
            params: {
                id: id
            }
        })
    },
  listForUnitId:function(id) {
    return request({
      url: '/enterprise/risk/material/listForUnitId',
      method: 'get',
      params: {
        id: id
      }
    })
  },
  removeByUnitId:function(riskUnitId) {
      return request({
        url: '/enterprise/risk/material/removeByUnitId',
        method: 'delete',
        params:{
          riskUnitId:riskUnitId
        }
      })
    },

}
