import request from '@/utils/request'

export default {
  saveEventAndFiles: function(params) {
    return request({
      url: '/manager/event/saveEventAndFiles',
      method: 'post',
      data:params
    });
  },
  deleteFile: function(params) {
    return request({
      url: '/file/deleteFile',
      method:'delete',
      params
    });
  }

}
