import request from '@/utils/request'
export default {
    getList:function(params) {
        return request({
            url: '/path/relation/pepeline/list',
            method: 'get',
            params
        })
    },
    add:function(params) {
        return request({
            url: '/path/relation/pepeline',
            method: 'post',
            params
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
