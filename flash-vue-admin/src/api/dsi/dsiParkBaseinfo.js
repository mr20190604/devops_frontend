import request from '@/utils/request'
export default {
    getList:function(params) {
        return request({
            url: '/park/baseinfo/list',
            method: 'get',
            params
        })
    },
    add:function(params) {
        return request({
            url: '/park/baseinfo',
            method: 'post',
            params
        })
    },
    update:function(params) {
        return request({
            url: '/park/baseinfo',
            method: 'PUT',
            params
        })
    },
    remove:function(id) {
        return request({
            url: '/park/baseinfo',
            method: 'delete',
            params: {
                id: id
            }
        })
    }
}
