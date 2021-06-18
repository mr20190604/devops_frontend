import request from '@/utils/request'
export default {
    getList:function(params) {
        return request({
            url: '/inspection/trouble/handle/list',
            method: 'get',
            params
        })
    },
    add:function(params) {
        return request({
            url: '/inspection/trouble/handle',
            method: 'post',
            params
        })
    },
    update:function(params) {
        return request({
            url: '/inspection/trouble/handle',
            method: 'PUT',
            params
        })
    },
    remove:function(id) {
        return request({
            url: '/inspection/trouble/handle',
            method: 'delete',
            params: {
                id: id
            }
        })
    },
  getAcceptPerson:function () {
    return request({
      url:'/inspection/trouble/handle/getAcceptPerson',
      method:'GET'
    })
  },
}
