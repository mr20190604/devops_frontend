const apiUrl = process.env.VUE_APP_BASE_API
const previewUrl_1 = process.env.VUE_APP_BASE_PREVIEW_1
const previewUrl_2 = process.env.VUE_APP_BASE_PREVIEW_2


export function getApiUrl() {
  return apiUrl
}
export function getPort() {
  return window.location.port;
}

export function getAccessAddress() {
  /*// 获取当前页面地址，如http://localhost:8080/admin/index
  let wPath = window.document.location.href;
  // 获取当前页面主机地址之后的目录，如：/admin/index
  let pathName =  this.$route.path;
  let pos = wPath.indexOf(pathName);
  // 获取主机地址，如：http://localhost:8080
  let localhostPath = wPath.substring(0, pos);*/
  return window.location.origin;
}

const Base64 = require('js-base64').Base64
/**
 * @param ct  标识符：1标识文件流；2标识图片流（可以是多图片，url需要使用|拼接多个url）
 * @param previewUrl
 * @param names
 * */
export function getPreviewUrl(ct, previewUrl, names) {
  if(!previewUrl) {
    console.error("预览地址为空！");
    return;
  }
  let previewPath;
  let files;
  /**多文件处理*/
  files = previewUrl.split("|");
  if(!names || names.length !== files.length) {
    console.error("没有传入文件名数组");
    return;
  }
  if(files) {
    for(let i = 0; i < files.length; i++) {
      let file = files[i];
      let tmpPath;
      if(file.indexOf(getApiUrl()) > -1) {
        tmpPath = getAccessAddress() + file + '&fullfilename='+names[i];
      } else {
        tmpPath = getAccessAddress() + getApiUrl() + file +  '&fullfilename='+names[i];
      }
      if(previewPath) {
        previewPath = previewPath + "|" + tmpPath;
      } else {
        previewPath = tmpPath;
      }
    }
  }
  switch (ct) {
    case 2:
      return previewUrl_2 + encodeURIComponent(Base64.encode(previewPath)) ;
    default:
      return previewUrl_1 + encodeURIComponent(Base64.encode(previewPath));
  }
}
