import request from '@/utils/request'
export default {
    getList:function(params) {
        return request({
            url: '/park/emergency/material/list',
            method: 'get',
            params
        })
    },
    add:function(params) {
        return request({
            url: '/park/emergency/material',
            method: 'post',
            params
        })
    },
    update:function(params) {
        return request({
            url: '/park/emergency/material',
            method: 'PUT',
            params
        })
    },
    remove:function(id) {
        return request({
            url: '/park/emergency/material',
            method: 'delete',
            params: {
                id: id
            }
        })
    },
   listForPoolId:function(id) {
      return request({
        url:'/park/emergency/material/listForPoolId',
        method:'get',
        params:{
          id:id
        }
      })

   }
}
