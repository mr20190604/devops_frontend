import request from '@/utils/request'
export default {
    getList:function(params) {
        return request({
            url: '/alarm/info/list',
            method: 'get',
            params
        })
    },
  queryById:function(id) {
    return request({
      url: '/alarm/info/queryById',
      method: 'get',
      params:{
        id:id
      }
    })
  },
    add:function(params) {
        return request({
            url: '/alarm/info',
            method: 'post',
            params
        })
    },
    update:function(params) {
        return request({
            url: '/alarm/info',
            method: 'PUT',
            params
        })
    },
  updateHandleById:function(params) {
    return request({
      url: '/alarm/info/updateHandleById',
      method: 'PUT',
      params
    })
  },
    remove:function(id) {
        return request({
            url: '/alarm/info',
            method: 'delete',
            params: {
                id: id
            }
        })
    },queryDisposeByAlarm(alarmId) {
      return request({
        url:'/alarm/handle/info/queryDisposeByAlarm',
        method:'get',
        params:{
          alarmId:alarmId
        }
      })

  }, addDispose:function(params) {
    return request({
      url: '/alarm/handle/info/addDispose',
      method: 'post',
      params
    })
  },addRelation:function(params) {
      return request({
        url:'/alarm/handle/file/add',
        method:'POST',
        params
      })

  },queryDataByHandleId:function (handleId) {
      return request({
        url:'/alarm/handle/file/queryDataByHandleId',
        method:'GET',
        params:{
          handleId:handleId
        }
      })
  },getAcceptPerson:function () {
    return request({
      url:'/alarm/info/getAcceptPerson',
      method:'GET'
    })
  },msgSend:function(alarmId,noticeContent,users) {
      return request({
        url:'/alarm/info/saveNotice',
        method:'POST',
        params:{
          alarmId:alarmId,
          noticeContent:noticeContent,
          users:users
        }
      })
  },queryNoticeByAlarmId(alarmId) {
    return request({
      url:'/alarm/info/queryNoticeByAlarmId',
      method:'get',
      params:{
        alarmId:alarmId
      }
    })

  }

}
