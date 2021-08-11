import request from '@/utils/request'

export default {
  equipmentExamine: function(params) {
    return request({
      url: '/equipment/examine/equipmentExamine',
      method: 'post',
      params
    })
  }
}
