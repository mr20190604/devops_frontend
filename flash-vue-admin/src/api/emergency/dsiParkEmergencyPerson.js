import request from '@/utils/request'
export default {
    getList:function(params) {
        return request({
            url: '/park/emergency/person/list',
            method: 'get',
            params
        })
    },
    add:function(params) {
        return request({
            url: '/park/emergency/person',
            method: 'post',
            params
        })
    },
    update:function(params) {
        return request({
            url: '/park/emergency/person',
            method: 'PUT',
            params
        })
    },
    remove:function(id) {
        return request({
            url: '/park/emergency/person',
            method: 'delete',
            params: {
                id: id
            }
        })
    }
}
