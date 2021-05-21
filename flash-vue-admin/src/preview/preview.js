import request from '@/utils/request'
import { getApiUrl } from '@/utils/utils'

const Base64 = require('js-base64').Base64



/**
 *  url 不带参数url
 *  param   {id:12,name:13}
 *  let params = {idFile:id, fileName:fileName};
 downloadFile('/file/download', params, fileName);
 * */
export function downloadFile(url, param, fileName) {
  getFileStream(url, param).then(response=>{
    let blob = new Blob([response]);
    let downloadElement = document.createElement("a");
    let href = window.URL.createObjectURL(blob);//创建下载的链接
    downloadElement.href = href;
    downloadElement.download = fileName;//下载后文件名
    document.body.appendChild(downloadElement);
    downloadElement.click();//点击下载
    document.body.removeChild(downloadElement); //下载完成移除元素
    window.URL.revokeObjectURL(href); //释放掉blob对象
    this.$message.success(`操作成功`);
  });
}

export function getFileStream(url, params) {
  return request({
    url: url,
    method: 'get',
    params
  })
}

