import request from '@/utils/request'
export default {
    getList:function(params) {
        return request({
            url: '/risk_unit/list',
            method: 'get',
            params
        })
    },
    add:function(params) {
        return request({
            url: '/risk_unit',
            method: 'post',
            params
        })
    },
    update:function(params) {
        return request({
            url: '/risk_unit',
            method: 'PUT',
            params
        })
    },
    remove:function(id) {
        return request({
            url: '/risk_unit',
            method: 'delete',
            params: {
                id: id
            }
        })
    }
}
