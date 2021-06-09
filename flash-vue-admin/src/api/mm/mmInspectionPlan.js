import request from '@/utils/request'
export default {
    getList:function(params) {
        return request({
            url: '/inspection/plan/list',
            method: 'get',
            params
        })
    },
    add:function(params) {
        return request({
            url: '/inspection/plan',
            method: 'post',
            params
        })
    },
    update:function(params) {
        return request({
            url: '/inspection/plan',
            method: 'PUT',
            params
        })
    },
    remove:function(id) {
        return request({
            url: '/inspection/plan',
            method: 'delete',
            params: {
                id: id
            }
        })
    }
}
