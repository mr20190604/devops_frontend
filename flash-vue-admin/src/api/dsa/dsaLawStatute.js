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
    }
}
