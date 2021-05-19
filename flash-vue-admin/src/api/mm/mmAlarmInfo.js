import request from '@/utils/request'
export default {
    getList:function(params) {
        return request({
            url: '/alarm/info/list',
            method: 'get',
            params
        })
    },
    add:function(params) {
        return request({
            url: '/alarm/info',
            method: 'post',
            params
        })
    },
    update:function(params) {
        return request({
            url: '/alarm/info',
            method: 'PUT',
            params
        })
    },
    remove:function(id) {
        return request({
            url: '/alarm/info',
            method: 'delete',
            params: {
                id: id
            }
        })
    }
}
