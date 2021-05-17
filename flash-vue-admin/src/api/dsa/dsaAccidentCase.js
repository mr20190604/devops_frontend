import request from '@/utils/request'
export default {
    getList:function(params) {
        return request({
            url: '/accident/case/list',
            method: 'get',
            params
        })
    },
    add:function(params) {
        return request({
            url: '/accident/case',
            method: 'post',
            params
        })
    },
    update:function(params) {
        return request({
            url: '/accident/case',
            method: 'PUT',
            params
        })
    },
    remove:function(id) {
        return request({
            url: '/accident/case',
            method: 'delete',
            params: {
                id: id
            }
        })
    }
}
