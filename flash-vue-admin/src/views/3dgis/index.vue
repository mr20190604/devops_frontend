<template>
  <div
    class="viewer"
  >
    <vc-viewer
      ref="vcViewer"
      :info-box="true"
      style="overflow: hidden; position: absolute"
      @ready="ready"
      @LEFT_DOWN="mouseDown"
      @LEFT_UP="mouseUp"
    >
      <vc-navigation :options="compassOptions" />
      <vc-layer-imagery>
        <vc-provider-imagery-tianditu
          map-style="img_c"
          :token="token"
          :maximum-level="15"
        />
      </vc-layer-imagery>
      <vc-layer-imagery ref="layerText">
        <vc-provider-imagery-tianditu
          map-style="cia_c"
          :token="token"
          :maximum-level="15"
        />
      </vc-layer-imagery>
      <vc-primitive-tileset
        url="./models/buildings/tileset.json"
        @readyPromise="buildingsReadyPromise"
      />
      <vc-collection-primitive-billboard
        :debug-show-bounding-volume="true"
        :billboards="billboards"
      />
    </vc-viewer>
    <div class="cover">
      <el-input
        v-model="search"
        class="search"
        prefix-icon="el-icon-search"
        placeholder="模糊搜索 地点防护目标"
      />
      <el-button type="primary" class="resource" @click="handleResourceClick">应急资源</el-button>
      <el-button type="primary" class="diffusion">预测扩散模型</el-button>
      <div class="toolbar">
        <div class="zoomIn" @click="handleZoomInClick" />
        <div class="zoomOut" @click="handleZoomOutClick" />
        <div class="clean" @click="handleCleanClick" />
        <div class="coverage" @click="toggleVisibleCoverage" />
      </div>
      <div class="legend">
        <p class="title">图例</p>
        <p>设备状态</p>
        <p class="status">
          <span>正常</span>
          <span>一级</span>
          <span>二级</span>
          <span>三级</span>
        </p>
        <p>设备类型</p>
        <div class="equipment">
          <p>傅立叶</p>
          <div class="icon icon11" />
          <div class="icon icon12" />
          <div class="icon icon13" />
          <div class="icon icon14" />
        </div>
        <div class="equipment">
          <p>质谱仪</p>
          <div class="icon icon21" />
          <div class="icon icon22" />
          <div class="icon icon23" />
          <div class="icon icon24" />
        </div>
        <div class="equipment">
          <p>激光雷达</p>
          <div class="icon icon31" />
          <div class="icon icon32" />
          <div class="icon icon33" />
          <div class="icon icon34" />
        </div>
      </div>
      <div class="bigToolbar">
        <div @click="handleAlarmClick">
          <el-image :src="require('../../assets/img/gis/设备类_监控点报警.png')" />
          <p>监测报警</p>
        </div>
        <div>
          <el-image :src="require('../../assets/img/gis/风险评估.png')" />
          <p>风险评估</p>
        </div>
        <div>
          <el-image :src="require('../../assets/img/gis/地图.png')" />
          <p>地图工具</p>
        </div>
      </div>
      <el-dialog
        :visible.sync="visible"
        style="pointer-events: auto;background: transparent;"
        title="选择图层"
        width="20%"
        top="35vh"
        @close="handleCloseDialog"
      >
        <el-checkbox
          v-model="selectAll"
          :indeterminate="isIndeterminate"
          @change="handleCheckAllChange"
        >全选
        </el-checkbox>
        <el-checkbox-group v-model="selectedCoverages" @change="handleCheckedCoveragesChange">
          <el-checkbox
            v-for="coverage in coverages"
            :key="coverage"
            :label="coverage"
          >{{ coverage }}
          </el-checkbox>
        </el-checkbox-group>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import 'vue-cesium/lib/vc-navigation.css'

import a11 from '../../assets/img/gis/傅立叶仪绿.png'
import a12 from '../../assets/img/gis/傅立叶仪红.png'
import a13 from '../../assets/img/gis/傅立叶仪橙.png'
import a14 from '../../assets/img/gis/傅立叶仪蓝.png'
import a21 from '../../assets/img/gis/质谱仪绿.png'
import a22 from '../../assets/img/gis/质谱仪红.png'
import a23 from '../../assets/img/gis/质谱仪橙.png'
import a24 from '../../assets/img/gis/质谱仪蓝.png'
import a31 from '../../assets/img/gis/激光雷达绿.png'
import a32 from '../../assets/img/gis/激光雷达红.png'
import a33 from '../../assets/img/gis/激光雷达橙.png'
import a34 from '../../assets/img/gis/激光雷达蓝.png'

import b1 from '../../assets/img/gis/企业.png'
import b2 from '../../assets/img/gis/人员.png'
import b3 from '../../assets/img/gis/危险源.png'
import b4 from '../../assets/img/gis/应急车辆.png'
import b5 from '../../assets/img/gis/应急人员.png'
import b6 from '../../assets/img/gis/应急物资库.png'

export default {
  name: 'Index',
  data: function() {
    return {
      Cesium: undefined,
      viewer: undefined,
      search: undefined,
      compassOptions: undefined,
      coverages: ['激光雷达', '傅立叶仪', '质谱仪', '企业', '人员', '危险源', '应急车辆', '应急人员', '应急物资库'],
      selectedCoverages: ['激光雷达', '傅立叶仪', '质谱仪'],
      selectAll: true,
      isIndeterminate: false,
      visible: false,
      billboards: [],
      isOnlyShowAlarm: true,
      token: '9732120f82392988567929c7c9ff034d'
    }
  },
  created() {
    this.compassOptions = {
      enableCompass: true,
      enableZoomControl: false,
      enableDistanceLegend: true,
      enableLocationBar: true,
      enableCompassOuterRing: true,
      enablePrintView: false,
      enableMyLocation: false
    }
  },
  mounted() {
    // 设置报警图标闪烁
    const that = this
    let isShowAlarm = true
    setInterval(function() {
      that.billboards.filter(item => {
        return item.level === 1 && that.selectedCoverages.indexOf(item.typeName) > -1
      }).forEach(item => {
        item.show = !isShowAlarm
      })
      isShowAlarm = !isShowAlarm
    }, 500)
  },
  methods: {
    ready({ Cesium, viewer }) {
      this.Cesium = Cesium
      this.viewer = viewer

      // 修改鼠标样式
      viewer._container.style.cursor = 'grab'

      // 开启调试深度
      // viewer.scene.globe.depthTestAgainstTerrain = true
    },
    buildingsReadyPromise(buildings) {
      const cartographic = this.Cesium.Cartographic.fromCartesian(buildings.boundingSphere.center)
      const surface = this.Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic.height)
      const offset = this.Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0)
      const translation = this.Cesium.Cartesian3.subtract(offset, surface, new this.Cesium.Cartesian3())
      buildings.modelMatrix = this.Cesium.Matrix4.fromTranslation(translation)
      this.initTestData(offset)
      this.viewer.flyTo(buildings)
    },
    initTestData(offset) {
      const images = [[], [], []]
      images[0].push(a11)
      images[0].push(a12)
      images[0].push(a13)
      images[0].push(a14)

      images[1].push(a21)
      images[1].push(a22)
      images[1].push(a23)
      images[1].push(a24)

      images[2].push(a31)
      images[2].push(a32)
      images[2].push(a33)
      images[2].push(a34)

      const images1 = []
      images1.push(b1)
      images1.push(b2)
      images1.push(b3)
      images1.push(b4)
      images1.push(b5)
      images1.push(b6)

      // 构造监测预警测试数据
      for (let i = 0; i < 200; i++) {
        const billboard = {}
        billboard.position = [offset.x + Math.random() * 100, offset.y + Math.random() * 100, offset.z + Math.random() * 10]
        const type = Math.floor(Math.random() * 3)
        billboard.type = type
        billboard.typeName = this.coverages[type]
        const level = Math.floor(Math.random() * 4)
        billboard.level = level
        for (let j = 0; j < 3; j++) {
          for (let k = 0; k < 4; k++) {
            if (type === j && level === k) {
              billboard.image = images[j][k]
            }
          }
        }
        billboard.scale = 0.5
        billboard.id = i
        if (this.isOnlyShowAlarm) {
          billboard.show = level === 1
        } else {
          billboard.show = true
        }
        billboard.click = function() {
          console.log(billboard)
        }
        this.billboards.push(billboard)
      }
      // 构造监测预警测试数据
      for (let i = 0; i < 100; i++) {
        const billboard = {}
        billboard.position = [offset.x + Math.random() * 100, offset.y + Math.random() * 100, offset.z + Math.random() * 10]
        const type = Math.floor(Math.random() * 6)
        billboard.type = type
        billboard.typeName = this.coverages[type + 3]
        for (let k = 0; k < 6; k++) {
          if (type === k) {
            billboard.image = images1[k]
          }
        }
        billboard.scale = 1
        billboard.id = i + 200
        billboard.show = false
        billboard.click = function() {
          console.log(billboard)
        }
        this.billboards.push(billboard)
      }
    },
    mouseDown() {
      this.viewer._container.style.cursor = 'grabbing'
    },
    mouseUp() {
      this.viewer._container.style.cursor = 'grab'
    },
    handleResourceClick() {
      const infos = this.coverages.filter((item, index) => index > 2)
      this.selectedCoverages = infos
      this.handleCheckedCoveragesChange(infos)
      this.showBillboards()
    },
    handleZoomInClick() {
      this.viewer.camera.zoomIn(50)
    },
    handleZoomOutClick() {
      this.viewer.camera.zoomOut(50)
    },
    handleCleanClick() {

    },
    handleCheckAllChange(val) {
      this.selectedCoverages = val ? this.coverages : []
      this.isIndeterminate = false
    },
    handleCheckedCoveragesChange(value) {
      const checkedCount = value.length
      this.selectAll = checkedCount === this.coverages.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.coverages.length
    },
    toggleVisibleCoverage() {
      this.visible = !this.visible
    },
    handleCloseDialog() {
      this.showBillboards()
    },
    handleAlarmClick() {
      const infos = this.coverages.filter((item, index) => index < 3)
      this.selectedCoverages = infos
      this.handleCheckedCoveragesChange(infos)
      this.isOnlyShowAlarm = !this.isOnlyShowAlarm
      this.showBillboards()
    },
    showBillboards() {
      this.billboards.forEach(item => {
        item.show = this.selectedCoverages.indexOf(item.typeName) > -1
        if (this.isOnlyShowAlarm && item.level !== undefined) {
          item.show = item.show && item.level === 1
        }
      })
    }
  }
}
</script>

<style scoped>
  .viewer {
    width: 100%;
    height: 100%;
  }

  /* 去除logo */
  >>> .cesium-widget-credits {
    display: none !important;
  }

  .cover {
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
  }

  .search {
    position: absolute;
    pointer-events: auto;
    top: 20px;
    left: 10px;
    width: 300px;
  }

  .resource {
    position: absolute;
    top: 20px;
    right: 400px;
    pointer-events: auto;
  }

  .diffusion {
    position: absolute;
    top: 20px;
    right: 260px;
    pointer-events: auto;
  }

  .compass {
    height: 60px;
    width: 60px;
    pointer-events: auto;
    position: absolute;
    right: 100px;
    top: 200px;
    border-radius: 30px;
    font-size: 8px;
    line-height: 60px;
    text-align: center;
    cursor: pointer;
    background: rgba(0, 0, 0, 0.5) url("../../assets/img/gis/指南针.png") no-repeat 50% 50%;
  }

  .toolbar {
    width: 40px;
    position: absolute;
    right: 100px;
    top: 300px;
    pointer-events: auto;
  }

  .toolbar > div {
    height: 40px;
    margin-bottom: 10px;
    cursor: pointer;
    font-size: 8px;
    text-align: center;
    line-height: 40px;
  }

  .zoomIn {
    cursor: zoom-in !important;
    background: url("../../assets/img/gis/放大.png");
  }

  .zoomOut {
    cursor: zoom-out !important;
    background: url("../../assets/img/gis/缩小.png");
  }

  .clean {
    background: url("../../assets/img/gis/清理.png");
  }

  .coverage {
    background: url("../../assets/img/gis/图层.png");
  }

  .legend {
    width: 200px;
    position: absolute;
    bottom: 20px;
    left: 20px;
    color: white;
    font-size: 8px;
  }

  .legend .title {
    text-align: center;
    font-size: 12px;
    margin-bottom: 10px;
  }

  .legend .status {
    margin-top: 10px;
    margin-bottom: 20px;
    margin-left: 5px;
  }

  .legend span {
    width: 50px;
    padding-left: 10px;
    padding-right: 10px;
    box-sizing: content-box;
    text-align: center;
    border-radius: 3px;
  }

  .legend span:first-child {
    background: green;
  }

  .legend span:nth-child(2) {
    background: red;
  }

  .legend span:nth-child(3) {
    background: yellow;
  }

  .legend span:last-child {
    background: blue;
  }

  .equipment {
    margin-top: 5px;
    height: 50px;
  }

  .equipment > p {
    height: 50px;
    line-height: 50px;
    width: 50px;
    float: left;
  }

  .legend .icon {
    height: 50px;
    width: 30px;
    float: left;
    background-size: contain !important;
    background-repeat: no-repeat !important;
    margin-right: 5px;
  }

  .legend .icon11 {
    background: url("../../assets/img/gis/傅立叶仪绿.png");
  }

  .legend .icon12 {
    background: url("../../assets/img/gis/傅立叶仪红.png");
  }

  .legend .icon13 {
    background: url("../../assets/img/gis/傅立叶仪橙.png");
  }

  .legend .icon14 {
    background: url("../../assets/img/gis/傅立叶仪蓝.png");
  }

  .legend .icon21 {
    background: url("../../assets/img/gis/质谱仪绿.png");
  }

  .legend .icon22 {
    background: url("../../assets/img/gis/质谱仪红.png");
  }

  .legend .icon23 {
    background: url("../../assets/img/gis/质谱仪橙.png");
  }

  .legend .icon24 {
    background: url("../../assets/img/gis/质谱仪蓝.png");
  }

  .legend .icon31 {
    background: url("../../assets/img/gis/激光雷达绿.png");
  }

  .legend .icon32 {
    background: url("../../assets/img/gis/激光雷达红.png");
  }

  .legend .icon33 {
    background: url("../../assets/img/gis/激光雷达橙.png");
  }

  .legend .icon34 {
    background: url("../../assets/img/gis/激光雷达蓝.png");
  }

  .bigToolbar {
    width: 500px;
    position: absolute;
    bottom: 0;
    left: calc(50% - 250px);
    text-align: center;
    color: white;
    font-weight: bold;
    font-size: 12px;
    pointer-events: auto;
    background: rgba(0, 0, 0, 0.3);
  }

  .bigToolbar .el-image {
    height: 40px;
    width: 40px;
    margin-top: 10px;
  }

  .bigToolbar > div {
    display: inline-block;
    width: 80px;
    height: 80px;
    margin: 10px;
    border-radius: 5px;
    cursor: pointer;
  }

  .bigToolbar > div:first-child {
    background: linear-gradient(to top, #37622e, #7eb88b);
  }

  .bigToolbar > div:nth-child(2) {
    background: linear-gradient(to top, #1d407a, #4a9ccd);
  }

  .bigToolbar > div:last-child {
    background: linear-gradient(to top, #663e26, #959765);
  }

  .bigToolbar p {
    margin: 5px;
  }

  .el-checkbox {
    display: block;
    margin-bottom: 10px;
  }

  >>> .vc-navigation{
    top: 200px;
    right: 95px;
  }
</style>
