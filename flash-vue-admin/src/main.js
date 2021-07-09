import Vue from 'vue'
import settings from './settings'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import ECharts from 'vue-echarts/components/ECharts.vue'
import '@/styles/index.scss' // global css
import BaiduMap from './lib/vue-baidu-map/components/index'
Vue.use(BaiduMap, { ak: 'zNbp0kmxc8CmeWwkzHjA3boFq9nUVgIg' })
import App from './App'
import store from './store'
import router from './router'
import i18n from './lang' // Internationalization
import '@/icons' // icon
import '@/permission' // permission control
// 全局引用公共样式
import '@/styles/commonStyle.scss'
/**
 * 全局引用自定义公共组件
 */
import DictSelect from './components/DictSelect'
Vue.component('dict-select', DictSelect)
import District from './components/District'
Vue.component('district', District)
import Enterprise from './components/Enterprise'
Vue.component('enterprise', Enterprise)
import Preview from './components/Preview/preview.vue'
Vue.component('preview', Preview)
import FilePreview from './components/FilePreview/FilePreview.vue'
Vue.component('file-preview', FilePreview)

/**
 * 全局引用第三方组件
 */
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
Vue.component('treeselect', Treeselect)

import VueParticles from 'vue-particles'
Vue.use(VueParticles)
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */
// 设置时间格式化方法
import dateFormatter from './utils/dateFormat'
Vue.prototype.dateFormatter = dateFormatter

import VueCesium from './lib/vue-cesium/src/index'
Vue.use(VueCesium, {
  cesiumPath: settings.cesuimServer + '/Cesium/Cesium.js',
  accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0NGM2YmU1Mi1mYzdmLTRkMzEtOGVlZi1jZjllNDA3MzRhNTYiLCJpZCI6NDUyMzksImlhdCI6MTYxNDg0NTMyM30.O7rZhPAtjVnto7BeVXbaQ4qbm5wAHMMpWaDp7-5DH1s'
})

// set ElementUI lang to EN
Vue.use(ElementUI, { i18n: (key, value) => i18n.t(key, value) })
Vue.component('v-chart', ECharts)
Vue.prototype.$echarts = ECharts
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
