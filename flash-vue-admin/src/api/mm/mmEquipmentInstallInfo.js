import request from '@/utils/request'

export default {
  getList: function (params) {
    return request({
      url: '/equipment/install/info/list',
      method: 'get',
      params
    })
  },
  add: function (params) {
    return request({
      url: '/equipment/install/info',
      method: 'post',
      params
    })
  },
  update: function (params) {
    return request({
      url: '/equipment/install/info',
      method: 'PUT',
      params
    })
  },
  remove: function (id) {
    return request({
      url: '/equipment/install/info',
      method: 'delete',
      params: {
        id: id
      }
    })
  },
  getEquipInstall: function (params) {
    return request({
      url: '/equipment/install/info/getEquipInstall',
      method: 'get',
      params
    })
  },
  listFacilities: function (params) {
    return request({
      url: '/equipment/install/info/listFacilities',
      method: 'get',
      params
    })
  },
}
