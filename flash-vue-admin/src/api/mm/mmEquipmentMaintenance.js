import request from '@/utils/request'
export default {
    add:function(params) {
        return request({
            url: '/equipment/maintenance',
            method: 'post',
            params
        })
    },
}
