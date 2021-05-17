import request from '@/utils/request'
export default {
    getList:function(params) {
        return request({
            url: '/emergency/plan/list',
            method: 'get',
            params
        })
    },
    add:function(params) {
        return request({
            url: '/emergency/plan',
            method: 'post',
            params
        })
    },
    update:function(params) {
        return request({
            url: '/emergency/plan',
            method: 'PUT',
            params
        })
    },
    remove:function(id) {
        return request({
            url: '/emergency/plan',
            method: 'delete',
            params: {
                id: id
            }
        })
    }
}