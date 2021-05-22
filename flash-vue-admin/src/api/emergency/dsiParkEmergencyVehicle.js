import request from '@/utils/request'
export default {
    getList:function(params) {
        return request({
            url: '/park/emergency/vehicle/list',
            method: 'get',
            params
        })
    },
    add:function(params) {
        return request({
            url: '/park/emergency/vehicle',
            method: 'post',
            params
        })
    },
    update:function(params) {
        return request({
            url: '/park/emergency/vehicle',
            method: 'PUT',
            params
        })
    },
    remove:function(id) {
        return request({
            url: '/park/emergency/vehicle',
            method: 'delete',
            params: {
                id: id
            }
        })
    },
  addRelation:function(params) {
    return request({
      url: '/vehicle/file',
      method: 'post',
      params
    })
  },
   queryDataByVehicleId:function(vehicleId) {
    return request({
      url: '/vehicle/file/queryDataByVehicleId',
      method: 'get',
      params:{
        vehicleId:vehicleId
      }
    })
  },removeByVehicleId:function(vehicleId) {
    return request({
      url: '/vehicle/file/removeByVehicleId',
      method: 'delete',
      params:{
        vehicleId:vehicleId
      }
    })
  },

}
