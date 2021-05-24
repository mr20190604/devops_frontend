import request from '@/utils/request'

/**
 * 配置相关可以预览的文件后后缀
 * */
const previewSuffixs = ['pdf','doc','docx','xlsx','xls','csv','bmp','jpg','jpeg','png','gif'];
/**
 * 用来判断是否可以预览的方法
 * 当该文件后缀匹配上返回true
 * */
export function isCanPreview(fileName) {
  if(fileName && fileName.lastIndexOf(".") > -1) {
    let suffix = fileName.substring(fileName.lastIndexOf(".")+1, fileName.length);
    let value = previewSuffixs.find(value=> value === suffix);
    if(value) {
      return true;
    }
    return false;
  }
}

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

