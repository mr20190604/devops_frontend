import request from '@/utils/request'
export default {
    getList:function(pathId) {
        return request({
            url: '/path/relation/pepeline/list',
            method: 'get',
            params:{
              pathId:pathId
            }
        })
    },
    add:function(params) {
        return request({
            url: '/path/relation/pepeline',
            method: 'post',
            params
        })
    },
  addAll:function(params) {
    return request({
      url: '/path/relation/pepeline/addAll',
      method: 'post',
      data:params
    })
  },
    update:function(params) {
        return request({
            url: '/path/relation/pepeline',
            method: 'PUT',
            params
        })
    },
    remove:function(id) {
        return request({
            url: '/path/relation/pepeline',
            method: 'delete',
            params: {
                id: id
            }
        })
    }
}
