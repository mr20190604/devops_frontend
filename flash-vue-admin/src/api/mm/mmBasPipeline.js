import request from '@/utils/request'
export default {
    getList:function(params) {
        return request({
            url: '/bas/pipeline/list',
            method: 'get',
            params
        })
    },
    add:function(params) {
        return request({
            url: '/bas/pipeline',
            method: 'post',
            params
        })
    },
    update:function(params) {
        return request({
            url: '/bas/pipeline',
            method: 'PUT',
            params
        })
    },
    remove:function(id) {
        return request({
            url: '/bas/pipeline',
            method: 'delete',
            params: {
                id: id
            }
        })
    }
}
