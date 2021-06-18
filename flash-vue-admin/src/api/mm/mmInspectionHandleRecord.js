import request from '@/utils/request'
export default {
    getList:function(params) {
        return request({
            url: '/inspection/handle/record/list',
            method: 'get',
            params
        })
    },
    add:function(params) {
        return request({
            url: '/inspection/handle/record',
            method: 'post',
            params
        })
    },
    update:function(params) {
        return request({
            url: '/inspection/handle/record',
            method: 'PUT',
            params
        })
    },
    remove:function(id) {
        return request({
            url: '/inspection/handle/record',
            method: 'delete',
            params: {
                id: id
            }
        })
    }
}
