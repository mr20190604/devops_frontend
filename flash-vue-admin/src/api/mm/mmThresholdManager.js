import request from '@/utils/request'
export default {
    getList:function(params) {
        return request({
            url: '/threshold/manager/list',
            method: 'get',
            params
        })
    },
    add:function(params) {
        return request({
            url: '/threshold/manager',
            method: 'post',
            params
        })
    },
    update:function(params) {
        return request({
            url: '/threshold/manager',
            method: 'PUT',
            params
        })
    },
    remove:function(id) {
        return request({
            url: '/threshold/manager',
            method: 'delete',
            params: {
                id: id
            }
        })
    }
}
