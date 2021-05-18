import request from '@/utils/request'
export default {
    getList:function(params) {
        return request({
            url: '/park/emergency/person/list',
            method: 'get',
            params
        })
    },
    add:function(params) {
        return request({
            url: '/park/emergency/person',
            method: 'post',
            params
        })
    },
    update:function(params) {
        return request({
            url: '/park/emergency/person',
            method: 'PUT',
            params
        })
    },
    remove:function(id) {
        return request({
            url: '/park/emergency/person',
            method: 'delete',
            params: {
                id: id
            }
        })
    },
  listForTeamId:function(id){
      return request({
        url:'/park/emergency/person/listForTeamId',
        method:'get',
        params:{
          teamId:id
        }
      })
  },
  queryListData:function(id){
  return request({
    url:'/park/emergency/person/queryListData',
    method:'get',
    params:{
      teamId:id
    }
  })
},removeRelation:function(id) {
    return request({
      url: '/park/emergency/team/perosn/removeRelation',
      method: 'delete',
      params: {
        id: id
      }
    })
  },addRelation:function(params) {
    return request({
      url: '/park/emergency/team/perosn/add',
      method: 'post',
      params
    })
  },queryNotInIds:function(arr){
    return request({
      url:'/park/emergency/person/queryNotInIds',
      method:'get',
      params:{
        personIds:arr
      }
    })
  },queryListByIds:function(arr){
    return request({
      url:'/park/emergency/person/queryListByIds',
      method:'get',
      params:{
        personIds:arr
      }
    })
  }
}
