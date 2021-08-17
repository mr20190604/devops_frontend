import request from '@/utils/request'
export default {
  getList: function(params) {
    return request({
      url: '/bas/equipment/history/list',
      method: 'get',
      params
    })
  }
}
