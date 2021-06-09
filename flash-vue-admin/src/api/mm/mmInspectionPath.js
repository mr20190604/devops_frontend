import request from '@/utils/request'
export default {
    getList:function(params) {
        return request({
            url: '/inspection/path/list',
            method: 'get',
            params
        })
    },
    add:function(params) {
        return request({
            url: '/inspection/path',
            method: 'post',
            params
        })
    },
    update:function(params) {
        return request({
            url: '/inspection/path',
            method: 'PUT',
            params
        })
    },
    remove:function(id) {
        return request({
            url: '/inspection/path',
            method: 'delete',
            params: {
                id: id
            }
        })
    }
}
