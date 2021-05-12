import request from '@/utils/request'
export default {
    getList:function(params) {
        return request({
            url: '/park/emergency/expets/list',
            method: 'get',
            params
        })
    },
    add:function(params) {
        return request({
            url: '/park/emergency/expets',
            method: 'post',
            params
        })
    },
    update:function(params) {
        return request({
            url: '/park/emergency/expets',
            method: 'PUT',
            params
        })
    },
    remove:function(id) {
        return request({
            url: '/park/emergency/expets',
            method: 'delete',
            params: {
                id: id
            }
        })
    }
}
