import request from '@/utils/request'

export default {
  getList: function (params) {
    return request({
      url: '/bas/equipment/list',
      method: 'get',
      params
    })
  },
  add: function (params) {
    return request({
      url: '/bas/equipment',
      method: 'post',
      params
    })
  },
  update: function (params) {
    return request({
      url: '/bas/equipment',
      method: 'PUT',
      params
    })
  },
  remove: function (id) {
    return request({
      url: '/bas/equipment',
      method: 'delete',
      params: {
        id: id
      }
    })
  },
  queryAll: function (equipmentType) {
    return request({
      url: '/bas/equipment/queryAll',
      method: 'get',
      params: {
        equipmentType: equipmentType,
      }
    })
  },
  removeBatch: function (ids) {
    return request({
      url: '/bas/equipment/removeBatch',
      method: 'delete',
      params: {
        ids: ids
      }
    })
  },
  getSysList:function () {
    return request({
      url:'/child/sys/model/getSysList',
      method:'get',
      params:{}
    })
  },
  updataPoingLocation:function (param) {
    return request({
      url:'/bas/equipment/updataPoingLocation',
      method:'post',
      params:param
    })
  }
}
