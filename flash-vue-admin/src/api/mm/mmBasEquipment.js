import request from '@/utils/request'

export default {
  getList: function(params) {
    return request({
      url: '/bas/equipment/list',
      method: 'get',
      params
    })
  },
  add: function(params) {
    return request({
      url: '/bas/equipment',
      method: 'post',
      params
    })
  },
  update: function(params) {
    return request({
      url: '/bas/equipment',
      method: 'PUT',
      params
    })
  },
  remove: function(id) {
    return request({
      url: '/bas/equipment',
      method: 'delete',
      params: {
        id: id
      }
    })
  },
  queryAll: function(equipmentType) {
    return request({
      url: '/bas/equipment/queryAll',
      method: 'get',
      params: {
        equipmentType: equipmentType
      }
    })
  },
  removeBatch: function(ids) {
    return request({
      url: '/bas/equipment/removeBatch',
      method: 'delete',
      params: {
        ids: ids
      }
    })
  },
  getSysList: function() {
    return request({
      url: '/child/sys/model/getSysList',
      method: 'get',
      params: {}
    })
  },
  updataPoingLocation: function(param) {
    return request({
      url: '/bas/equipment/updataPoingLocation',
      method: 'post',
      params: param
    })
  },
  updateStatusSubmit: function(params) {
    return request({
      url: '/bas/equipment/updateStatusSubmit',
      method: 'post',
      data: params
    })
  },
  registerEquipment: function(params) {
    return request({
      url: '/equipment/register/registerEquipment',
      method: 'post',
      data: params
    })
  },
  cancelRegister: function(params) {
    return request({
      url: '/equipment/register/cancelRegister',
      method: 'get',
      params
    })
  },
  validExamine: function(params) {
    return request({
      url: '/equipment/examine/validExamine',
      method: 'post',
      data:params
    })
  },
  updateEquipmentStatus: function(param) {
    return request({
      url: '/bas/equipment/updateEquipmentStatus',
      method: 'post',
      params: param
    })
  },
  getParent: function(pid) {
    return request({
      url: '/bas/equipment/getParent',
      method: 'get',
      params: {
        pid: pid
      }
    })

  },
  replaceList: function(params) {
    return request({
      url: '/bas/equipment/replaceList',
      method: 'get',
      params
    })
  },
}
