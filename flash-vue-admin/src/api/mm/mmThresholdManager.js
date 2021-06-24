import request from '@/utils/request'
export default {
    getList:function(params) {
        return request({
            url: '/threshold/manager/list',
            method: 'get',
            params
        })
    },
    add:function(params) {
        return request({
            url: '/threshold/manager',
            method: 'post',
            params
        })
    },
  examineThreshold:function(params) {
        return request({
            url: '/threshold/manager/examineThreshold',
            method: 'PUT',
            params
        })
    },
  update:function(params) {
    return request({
      url: '/threshold/manager',
      method: 'PUT',
      params
    })
  },
    remove:function(id) {
        return request({
            url: '/threshold/manager',
            method: 'delete',
            params: {
                id: id
            }
        })
    },
  queryByEquipmentId:function (equipmentId) {
    return request({
      url: '/threshold/manager/queryByEquipmentId',
      method: 'get',
      params: {
        equipmentId: equipmentId
      }
    })
  },
  getByEquipmentCode:function (equipmentId) {
    return request({
      url: '/threshold/manager/getByEquipmentId',
      method: 'get',
      params: {
        equipmentId: equipmentId
      }
    })
  },
  queryExamine:function (ids) {
    return request({
      url: '/dsi/enterprise/info/queryExamine',
      method: 'get',
      params: {
        ids: ids
      }
    })
  },
}
