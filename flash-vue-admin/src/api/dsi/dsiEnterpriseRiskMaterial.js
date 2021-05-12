import request from '@/utils/request'
export default {
    getList:function(params) {
        return request({
            url: '/enterprise/risk/material/list',
            method: 'get',
            params
        })
    },
    add:function(params) {
        return request({
            url: '/enterprise/risk/material',
            method: 'post',
            params
        })
    },
    update:function(params) {
        return request({
            url: '/enterprise/risk/material',
            method: 'PUT',
            params
        })
    },
    remove:function(id) {
        return request({
            url: '/enterprise/risk/material',
            method: 'delete',
            params: {
                id: id
            }
        })
    }
}
