import request from '@/utils/request'

export default {
  getList: function (params) {
    return request({
      url: '/inspection/plan/list',
      method: 'get',
      params
    })
  },
  add: function (params) {
    return request({
      url: '/inspection/plan',
      method: 'post',
      data: params
    })
  },
  update: function (params) {
    return request({
      url: '/inspection/plan',
      method: 'PUT',
      data: params
    })
  },
  remove: function (id) {
    return request({
      url: '/inspection/plan',
      method: 'delete',
      params: {
        id: id
      }
    })
  },
  listInspectionPerson: function () {
    return request({
      url: '/inspection/plan/listInspectionPerson',
      method: 'get'
    })
  },
  listEquipByPath: function (params) {
    return request({
      url: '/inspection/plan/listEquipByPath',
      method: 'get',
      params
    })
  },
  listInspectionEquip: function (params) {
    return request({
      url: '/inspection/plan/listInspectionEquip',
      method: 'get',
      params
    })
  },

}
