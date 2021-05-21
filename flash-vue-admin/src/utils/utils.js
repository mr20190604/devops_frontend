const apiUrl = process.env.VUE_APP_BASE_API
const previewUrl_1 = process.env.VUE_APP_BASE_PREVIEW_1
const previewUrl_2 = process.env.VUE_APP_BASE_PREVIEW_2
const previewUrl_3 = process.env.VUE_APP_BASE_PREVIEW_3

export function getApiUrl() {
  return apiUrl
}

export function getPreviewUrl(ct) {
  switch (ct) {
    case 1:
      return previewUrl_1;
    case 2:
      return previewUrl_2;
    case 3:
      return previewUrl_3;
    default:
      return previewUrl_1;
  }
}
