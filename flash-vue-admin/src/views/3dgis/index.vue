<template>
  <div
    class="viewer"
  >
    <vc-viewer
      :info-box="false"
      :selection-indicator="false"
      :should-animate="true"
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
        :billboards="billboards.filter(item=>!item.level||item.level!==1)"
        @mouseover="billboardMouseover"
        @mousemove="billboardMousemove"
        @mouseout="billboardMouseout"
        @click="billboardCollectionClick"
      />
      <vc-entity
        v-for="item in billboards.filter(item=>item.level&&item.level===1)"
        :id="String(item.id)"
        :key="item.id"
        :position="item.position"
        :billboard="item"
        @mouseover="billboardMouseover"
        @mousemove="billboardMousemove"
        @mouseout="billboardMouseout"
        @click="billboardClick"
      >
        <vc-graphics-billboard
          :image="item.image"
          :scale="item.scale"
          :show="item.show"
          :color="item.color"
          :distance-display-condition="item.distanceDisplayCondition"
        />
      </vc-entity>
      <vc-heatmap
        :show="heatmapInfo.show"
        :bounds="heatmapInfo.bounds"
        :options="heatmapInfo.options"
        :min="heatmapInfo.min"
        :max="heatmapInfo.max"
        :data="heatmapInfoData"
      />
      <vc-heatmap
        :show="heatmapInfo1.show"
        :bounds="heatmapInfo1.bounds"
        :options="heatmapInfo1.options"
        :min="heatmapInfo1.min"
        :max="heatmapInfo1.max"
        :data="heatmapInfoData1"
        :type="1"
      />
      <vc-handler-draw-point
        ref="handlerPoint"
        point-color="red"
      />
      <vc-handler-draw-polyline
        ref="handlerLine"
        point-color="red"
      />
      <vc-handler-draw-polygon
        ref="handlerPolygon"
        point-color="red"
      />
      <vc-measure-distance
        ref="measureDistance"
        :remove-last-position="false"
      />
      <vc-measure-area
        ref="measureArea"
        :remove-last-position="false"
      />
      <vc-measure-height
        ref="measureHeight"
      />
      <vc-overlay-html v-if="windowInfo.show" :position="windowInfo.position" :pixel-offset="{ x: -380, y: -380 }">
        <div class="windowInfo">
          <p class="title">{{ windowInfo.title }}
            <span class="close" title="关闭" @click="handleWindowInfoClose" />
          </p>
          <div v-show="windowInfo.title==='设备信息'">
            <ul>
              <li :class="{selected:windowInfo.tabName==='基本信息'}" @click="handleTabNameChange('基本信息')">基本信息</li>
              <li :class="{selected:windowInfo.tabName==='报警记录'}" @click="handleTabNameChange('报警记录')">报警记录</li>
              <li :class="{selected:windowInfo.tabName==='溯源分析'}" @click="handleTabNameChange('溯源分析')">溯源分析</li>
              <li :class="{selected:windowInfo.tabName==='扩散分析'}" @click="handleTabNameChange('扩散分析')">扩散分析</li>
            </ul>
            <div class="tab-container">
              <div v-if="windowInfo.tabName==='基本信息'" class="basicInfo">
                <p class="equipmentType">{{ windowInfo.equipmentType }}</p>
                <p>设备编号:<span>FFSS2344</span></p>
                <p>设备状态:<span>正常</span></p>
                <p>报警地点:<span>11号楼109房间报警</span></p>
                <p>历史报警:<span>3</span></p>
              </div>
              <div v-if="windowInfo.tabName==='报警记录'" class="alarmInfo">
                <p>报警时间:<span>2021-03-27 11:36:00</span></p>
                <p>报警等级:<span>一级</span></p>
                <p>处置状态:<span>已处置</span></p>
                <p>处置人:<span>高益</span></p>
                <p>审核状态:<span>已审核</span></p>
                <p>审核人:<span>高益</span></p>
                <hr>
                <p>报警时间:<span>2021-03-27 11:36:00</span></p>
                <p>报警等级:<span>一级</span></p>
                <p>处置状态:<span>已处置</span></p>
                <p>处置人:<span>高益</span></p>
                <p>审核状态:<span>已审核</span></p>
                <p>审核人:<span>高益</span></p>
                <hr>
                <p>报警时间:<span>2021-03-27 11:36:00</span></p>
                <p>报警等级:<span>一级</span></p>
                <p>处置状态:<span>已处置</span></p>
                <p>处置人:<span>高益</span></p>
                <p>审核状态:<span>已审核</span></p>
                <p>审核人:<span>高益</span></p>
                <div class="page">
                  <div class="first" title="上一页" />
                  <div class="next" title="下一页" />
                </div>
              </div>
              <div v-if="windowInfo.tabName==='溯源分析'" class="backAnalysis">
                <p>报警时间:<span>2021-03-27 11:36:00</span></p>
                <p>报警等级:<span>一级</span></p>
                <p>可能泄露的企业:<span> xxx公司-「某某雾化溶剂」，xxx公司[蚁力神一号]</span></p>
                <hr>
                <p>报警时间:<span>2021-03-27 11:36:00</span></p>
                <p>报警等级:<span>一级</span></p>
                <p>可能泄露的企业:<span>xxx公司-「某某雾化溶剂」，xxx公司[蚁力神一号]</span></p>
                <hr>
                <p>报警时间:<span>2021-03-27 11:36:00</span></p>
                <p>报警等级:<span>一级</span></p>
                <p>可能泄露的企业:<span>xxx公司-「某某雾化溶剂」，xxx公司[蚁力神一号]</span></p>
                <div class="page">
                  <div class="first" title="上一页" />
                  <div class="next" title="下一页" />
                </div>
              </div>
              <div v-if="windowInfo.tabName==='扩散分析'" class="diffusionAnalysis">
                <p>报警时间:<span>2021-03-27 11:36:00</span></p>
                <p>报警等级:<span>一级</span></p>
                <p>6小时影响范围:<span>已消散，无影响</span></p>
                <p>24小时影响范围:<span>无影响</span></p>
                <hr>
                <p>报警时间:<span>2021-03-27 11:36:00</span></p>
                <p>报警等级:<span>一级</span></p>
                <p>6小时影响范围:<span>已消散，无影响</span></p>
                <p>24小时影响范围:<span>无影响</span></p>
                <hr>
                <p>报警时间:<span>2021-03-27 11:36:00</span></p>
                <p>报警等级:<span>一级</span></p>
                <p>6小时影响范围:<span>已消散，无影响</span></p>
                <p>24小时影响范围:<span>无影响</span></p>
                <div class="page">
                  <div class="first" title="上一页" />
                  <div class="next" title="下一页" />
                </div>
              </div>
            </div>
          </div>
          <div v-show="windowInfo.title==='企业信息'" class="enterpriseInfo">
            <p>企业名称:<span>xxx科技有限公司</span></p>
            <p>员工人数:<span>558</span></p>
            <p>风险等级:<span>三级</span></p>
            <p>法人:<span>张三</span></p>
            <p>联系方式:<span>400-265-45168</span></p>
            <p>单位性质:<span>私企</span></p>
            <p>应急人员:<span>张三、李四、王五</span></p>
            <p>是否有重大危险源:<span>否</span></p>
            <p>所属行业:<span>纺织</span></p>
          </div>
          <div v-show="windowInfo.title==='人员信息'" class="">
            <p>所属企业:<span>xxx科技有限公司</span></p>
            <p>姓名:<span>张三</span></p>
            <p>性别:<span>男</span></p>
            <p>职务:<span>技术部主管</span></p>
            <p>联系电话:<span>13888888888</span></p>
          </div>
          <div v-show="windowInfo.title==='危险源信息'">
            <p>危险源名称:<span>氢氧化钠</span></p>
            <p>数量:<span>25吨</span></p>
            <p>防护措施:<span>工作人员应作好防护，若不慎触及皮肤和眼睛，应立即用大量水冲洗干净。工作环境应具有良好的通风条件。氢氧化钠水溶液有滑腻感，溶于水时产生很高的热量，操作时要带防护目镜及橡胶手套，注意不要溅到皮肤上或眼睛里。</span></p>
          </div>
          <div v-show="windowInfo.title==='应急车辆信息'">
            <p>车牌号:<span>皖A·123JS</span></p>
            <p>驾驶员:<span>赵六</span></p>
            <p>联系电话:<span>13777777777</span></p>
            <p>车辆型号:<span>中型车</span></p>
            <p>配套设备:<span>氯气检测仪</span></p>
          </div>
          <div v-show="windowInfo.title==='应急人员信息'">
            <p>姓名:<span>李军</span></p>
            <p>性别:<span>男</span></p>
            <p>联系电话:<span>13888888888</span></p>
            <p>特殊技能:<span>电工</span></p>
          </div>
          <div v-show="windowInfo.title==='应急物资库信息'">
            <p>物资名称:<span>双氧水</span></p>
            <p>数量:<span>20吨</span></p>
            <p>功效:<span>双氧水又名过氧化氢，分子式是H2O2。即，一个过氧化氢分子含有两个氧原子。虽然双氧水能够分解成水(H2O)和氧气(O2)，但并不是双氧水中“含有高浓度氧气”。双氧水是公认的低毒物质，广泛应用于工业漂白、外科消毒等领域，但若使用不当，仍有可能造成危害。</span></p>
          </div>
        </div>
      </vc-overlay-html>
    </vc-viewer>
    <div class="cover">
      <el-input
        v-model="search"
        class="search"
        prefix-icon="el-icon-search"
        placeholder="模糊搜索 地点防护目标"
      />
      <el-button type="primary" class="resource" @click="handleResourceClick">应急资源</el-button>
      <el-button type="primary" class="diffusion" @click="handleDiffusionClick">预测扩散模型</el-button>
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
        </div>
        <div class="equipment">
          <p>质谱仪</p>
          <div class="icon icon21" />
        </div>
        <div class="equipment">
          <p>激光雷达</p>
          <div class="icon icon31" />
        </div>
      </div>
      <div class="bigToolbar">
        <div @click="handleAlarmClick">
          <el-image :src="require('../../assets/img/gis/设备类_监控点报警.png')" />
          <p>监测报警</p>
        </div>
        <div @click="handleRiskClick">
          <el-image :src="require('../../assets/img/gis/风险评估.png')" />
          <p>风险评估</p>
        </div>
        <div @mouseover="mapToolsDisplay='block'" @mouseout="mapToolsDisplay='none'">
          <el-image :src="require('../../assets/img/gis/地图.png')" />
          <p>地图工具</p>
          <div class="mapTools" :style="{display:mapToolsDisplay}">
            <ul>
              <li @click="handleDrawPoint">绘制点</li>
              <li @click="handleDrawLine">绘制线</li>
              <li @click="handleDrawSurface">绘制面</li>
              <li @click="handleMeasuringDistance">测量距离</li>
              <li @click="handleMeasuringArea">测量面积</li>
              <li @click="handleMeasuringHeight">测量高度</li>
            </ul>
          </div>
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
import 'vue-cesium/lib/style.css'

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
      search: undefined,
      compassOptions: {
        enableCompass: true,
        enableZoomControl: false,
        enableDistanceLegend: true,
        enableLocationBar: true,
        enableCompassOuterRing: true,
        enablePrintView: false,
        enableMyLocation: false
      },
      coverages: ['激光雷达', '傅立叶仪', '质谱仪', '企业', '人员', '危险源', '应急车辆', '应急人员', '应急物资库'],
      selectedCoverages: ['激光雷达', '傅立叶仪', '质谱仪'],
      selectAll: false,
      isIndeterminate: false,
      visible: false,
      billboards: [],
      isForecast: false,
      heatmapInfo: {
        bounds: { west: 120.74386, south: 30.77158, east: 120.74758, north: 30.77673 },
        options: {
          backgroundColor: 'rgba(0,0,0,0)',
          gradient: {
            '0.9': 'red',
            '0.8': 'orange',
            '0.7': 'yellow',
            '0.6': 'blue',
            '0.5': 'green'
          },
          radius: 40,
          maxOpacity: 0.5,
          minOpacity: 0,
          blur: 0.75
        },
        min: 0,
        max: 100,
        data: [],
        show: false
      },
      heatmapInfoData: [],
      heatmapInfo1: {
        bounds: { west: 120.74386, south: 30.77158, east: 120.74758, north: 30.77673 },
        options: {
          backgroundColor: 'rgba(0,0,0,0)',
          gradient: {
            '0.9': 'red',
            '0.8': 'orange',
            '0.7': 'yellow',
            '0.6': 'blue',
            '0.5': 'green'
          },
          radius: 10,
          maxOpacity: 0.5,
          minOpacity: 0,
          blur: 0.75
        },
        min: 0,
        max: 100,
        data: [],
        show: false
      },
      heatmapInfoData1: [],
      windowInfo: {
        show: false,
        equipmentType: undefined,
        position: undefined,
        title: undefined,
        tabName: '基本信息'
      },
      mapToolsDisplay: 'none',
      token: '9732120f82392988567929c7c9ff034d',
      riskInterval: undefined
    }
  },
  beforeDestroy() {
    delete window.Cesium
    delete window.viewer
  },
  methods: {
    ready({ Cesium, viewer }) {
      window.Cesium = Cesium
      window.viewer = viewer
      // 修改鼠标样式
      window.viewer._container.style.cursor = 'grab'
      // 开启调试深度
      // window.viewer.scene.globe.depthTestAgainstTerrain = true

      let start = Date.now()
      const duration = 3000

      function rotate() {
        const a = 2 * Math.PI
        const now = Date.now()
        const n = (now - start) / duration
        start = now
        viewer.scene.camera.rotate(Cesium.Cartesian3.UNIT_Z, -a * n)
      }
      viewer.clock.onTick.addEventListener(rotate)
      setTimeout(function() {
        viewer.clock.onTick.removeEventListener(rotate)
        window.viewer.flyTo(window.buildings)
      }, duration)
    },
    buildingsReadyPromise(buildings) {
      // 贴地
      const cartographic = window.Cesium.Cartographic.fromCartesian(buildings.boundingSphere.center)
      const surface = window.Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic.height)
      const offset = window.Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0)
      const translation = window.Cesium.Cartesian3.subtract(offset, surface, new window.Cesium.Cartesian3())
      buildings.modelMatrix = window.Cesium.Matrix4.fromTranslation(translation)
      window.buildings = buildings
      // 初始化测试数据
      this.initTestData()
    },
    initTestData() {
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
        billboard.position = {
          lng: this.heatmapInfo.bounds.west + Math.random() * (this.heatmapInfo.bounds.east - this.heatmapInfo.bounds.west),
          lat: this.heatmapInfo.bounds.south + Math.random() * (this.heatmapInfo.bounds.north - this.heatmapInfo.bounds.south),
          height: 20
        }
        const type = Math.floor(Math.random() * 3)
        billboard.type = type
        billboard.typeName = this.coverages[type]
        const level = Math.floor(Math.random() * 4)
        billboard.level = level
        for (let j = 0; j < 3; j++) {
          for (let k = 0; k < 4; k++) {
            if (type === j && level === k) {
              billboard.image = images[j][k]
              if (level === 1) {
                billboard.color = function() {
                  const seconds = new Date().getSeconds()
                  const alpha = seconds % 2 === 1 ? 1 : 0.1
                  return window.Cesium.Color.WHITE.withAlpha(alpha)
                }
              }
            }
          }
        }
        billboard.scale = 0.5
        billboard.id = i
        billboard.verticalOrigin = window.Cesium.VerticalOrigin.BOTTOM
        billboard.show = level === 1
        billboard.distanceDisplayCondition = {
          far: 2000
        }
        this.billboards.push(billboard)
      }

      // 构造应急资源测试数据
      for (let i = 0; i < 100; i++) {
        const billboard = {}
        billboard.position = {
          lng: this.heatmapInfo.bounds.west + Math.random() * (this.heatmapInfo.bounds.east - this.heatmapInfo.bounds.west),
          lat: this.heatmapInfo.bounds.south + Math.random() * (this.heatmapInfo.bounds.north - this.heatmapInfo.bounds.south),
          height: 20
        }
        const type = Math.floor(Math.random() * 6) + 3
        billboard.type = type
        billboard.typeName = this.coverages[type]
        for (let k = 0; k < 6; k++) {
          if (type === k + 3) {
            billboard.image = images1[k]
          }
        }
        billboard.scale = 0.5
        billboard.id = i + 200
        billboard.verticalOrigin = window.Cesium.VerticalOrigin.BOTTOM
        billboard.show = false
        billboard.distanceDisplayCondition = {
          far: 2000
        }
        this.billboards.push(billboard)
      }
    },
    billboardMouseover() {
      window.viewer._container.style.cursor = 'pointer'
    },
    billboardMousemove() {
      window.viewer._container.style.cursor = 'pointer'
    },
    billboardMouseout() {
      window.viewer._container.style.cursor = 'grab'
    },
    billboardClick(e) {
      if (this.isForecast) {
        window.viewer.zoomTo(e.cesiumObject).then(() => {
          const position = e.surfacePosition
          const cartographic = window.Cesium.Cartographic.fromCartesian(position)
          const minNum = -0.0001
          const maxNum = 0.0001
          this.heatmapInfo1.data = []
          // 构造热力图的数据
          for (let i = 0; i < 20; i++) {
            const val = Math.floor(Math.random() * 100)
            this.heatmapInfo1.data.push({
              x: window.Cesium.Math.toDegrees(cartographic.longitude) + Math.random() * (maxNum - minNum) + minNum,
              y: window.Cesium.Math.toDegrees(cartographic.latitude) + Math.random() * (maxNum - minNum) + minNum,
              value: val
            })
          }
          this.heatmapInfoData1 = this.heatmapInfo1.data
          this.heatmapInfo1.show = true
        })
      } else {
        this.handleBillboardDetail(e.cesiumObject)
      }
    },
    billboardCollectionClick(e) {
      if (e.cesiumObject instanceof window.Cesium.Billboard) {
        this.handleBillboardDetail(e.cesiumObject)
      } else if (e.cesiumObject instanceof window.Cesium.BillboardCollection) {
        this.handleBillboardDetail(e.pickedFeature.primitive)
      }
    },
    handleBillboardDetail(cesiumObject) {
      this.windowInfo.show = false
      const id = Number(cesiumObject.id)
      const current = this.billboards.find(item => item.id === id)
      if (current.type < 3) {
        this.windowInfo.title = '设备信息'
        this.windowInfo.equipmentType = current.typeName
      } else {
        this.windowInfo.title = current.typeName + '信息'
      }
      this.windowInfo.position = current.position
      if (cesiumObject instanceof window.Cesium.Entity) {
        window.viewer.zoomTo(cesiumObject).then(() => {
          this.windowInfo.show = true
        })
      } else if (cesiumObject instanceof window.Cesium.Billboard) {
        this.windowInfo.show = true
        const target = window.Cesium.Cartesian3.fromDegrees(current.position.lng, current.position.lat, current.position.height)
        window.viewer.camera.lookAt(target, new window.Cesium.HeadingPitchRange(window.viewer.camera.heading, window.viewer.camera.pitch, 200))
        window.viewer.camera.lookAtTransform(window.Cesium.Matrix4.IDENTITY)
      }
    },
    mouseDown() {
      window.viewer._container.style.cursor = 'grabbing'
    },
    mouseUp() {
      window.viewer._container.style.cursor = 'grab'
    },
    handleResourceClick() {
      this.setDefault()
      const infos = this.coverages.filter((item, index) => index > 2)
      this.selectedCoverages = infos
      this.handleCheckedCoveragesChange(infos)
      this.billboards.forEach(item => {
        item.show = infos.indexOf(item.typeName) > -1
      })
    },
    handleDiffusionClick() {
      this.setDefault()
      this.isForecast = true
      const infos = this.coverages.filter((item, index) => index < 3)
      this.selectedCoverages = infos
      this.handleCheckedCoveragesChange(infos)
      this.billboards.forEach(item => {
        item.show = item.level === 1 && infos.indexOf(item.typeName) > -1
      })
    },
    handleZoomInClick() {
      window.viewer.camera.zoomIn(50)
    },
    handleZoomOutClick() {
      window.viewer.camera.zoomOut(50)
    },
    handleCleanClick() {
      this.$refs.handlerPoint.clear()
      this.$refs.handlerLine.clear()
      this.$refs.handlerPolygon.clear()
      this.$refs.measureDistance.clear()
      this.$refs.measureArea.clear()
      this.$refs.measureHeight.clear()
      this.setMapToolsDefault()
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
      console.log(this.selectedCoverages)
      this.billboards.forEach(item => {
        item.show = this.selectedCoverages.indexOf(item.typeName) > -1
      })
    },
    handleAlarmClick() {
      const infos = this.coverages.filter((item, index) => index < 3)
      const showCount = this.billboards.filter(item => item.show && infos.indexOf(item.typeName) > -1).length
      this.setDefault()
      this.selectedCoverages = infos
      this.handleCheckedCoveragesChange(infos)
      const alarmCount = this.billboards.filter(item => this.selectedCoverages.indexOf(item.typeName) > -1).length
      if (showCount === alarmCount || showCount === 0) {
        this.billboards.forEach(item => {
          item.show = item.level === 1 && infos.indexOf(item.typeName) > -1
        })
      } else {
        this.billboards.forEach(item => {
          item.show = infos.indexOf(item.typeName) > -1
        })
      }
    },
    handleRiskClick() {
      this.setDefault()
      // 构造热力图的数据
      this.heatmapInfo.data = []
      for (let i = 0; i < 100; i++) {
        const val = Math.floor(Math.random() * 100)
        this.heatmapInfo.data.push({
          x: this.heatmapInfo.bounds.west + Math.random() * (this.heatmapInfo.bounds.east - this.heatmapInfo.bounds.west),
          y: this.heatmapInfo.bounds.south + Math.random() * (this.heatmapInfo.bounds.north - this.heatmapInfo.bounds.south),
          value: val
        })
      }
      this.heatmapInfoData = this.heatmapInfo.data
      this.heatmapInfo.show = true
      const that = this
      this.riskInterval = setInterval(function() {
        that.handleRiskClick()
      }, 2500)
    },
    setDefault() {
      this.billboards.forEach(item => {
        item.show = false
      })
      this.heatmapInfo.show = false
      this.heatmapInfo1.show = false
      this.windowInfo.show = false
      this.isForecast = false
      this.riskInterval && clearInterval(this.riskInterval)
      this.riskInterval = undefined
    },
    handleTabNameChange(tabName) {
      this.windowInfo.tabName = tabName
    },
    handleWindowInfoClose() {
      this.windowInfo.show = false
      this.windowInfo.tabName = '基本信息'
    },
    handleDrawPoint() {
      this.handleCleanClick()
      this.$refs.handlerPoint.drawing = true
    },
    handleDrawLine() {
      this.handleCleanClick()
      this.$refs.handlerLine.drawing = true
    },
    handleDrawSurface() {
      this.handleCleanClick()
      this.$refs.handlerPolygon.drawing = true
    },
    handleMeasuringDistance() {
      this.handleCleanClick()
      this.$refs.measureDistance.measuring = true
    },
    handleMeasuringArea() {
      this.handleCleanClick()
      this.$refs.measureArea.measuring = true
    },
    handleMeasuringHeight() {
      this.handleCleanClick()
      this.$refs.measureHeight.measuring = true
    },
    setMapToolsDefault() {
      this.mapToolsDisplay = 'none'
      this.$refs.handlerPoint.clear()
      this.$refs.handlerLine.clear()
      this.$refs.handlerPolygon.clear()
      this.$refs.measureDistance.clear()
      this.$refs.measureArea.clear()
      this.$refs.measureHeight.clear()
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
    padding: 3px 10px;
    box-sizing: content-box;
    text-align: center;
    border-radius: 3px;
  }

  .legend span:first-child {
    background: #00CEB5;
  }

  .legend span:nth-child(2) {
    background: #CD4D54;
  }

  .legend span:nth-child(3) {
    background: #EC9C29;
  }

  .legend span:last-child {
    background: #2E8CEE;
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
    margin-left: 50px;
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
    background: rgba(30, 48, 73, 0.8);
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
    margin: 10px 30px;
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

  .mapTools{
    position: absolute;
    bottom: 90px;
    color:#eeeeee;
    background: rgba(30, 48, 73, 0.8);
    border-radius: 3px;
  }

  .mapTools ul{
    list-style: none;
  }

  .mapTools li{
    margin: 0 16px;
    padding: 3px 0;
    line-height: 1.5em;
  }

  .el-checkbox {
    display: block;
    margin-bottom: 10px;
  }

  >>> .vc-navigation {
    top: 200px;
    right: 95px;
  }

  .windowInfo {
    position: absolute;
    top: 0;
    left: 400px;
    width: 360px;
    height: 380px;
    background: #101933;
    opacity: 0.88;
    color: white;
    font-size: 12px;
    cursor: default;
  }

  .windowInfo p {
    color: #909ABB;
    line-height: 24px;
  }

  .windowInfo p > span {
    color: white;
    padding-left: 8px;
  }

  .windowInfo .title {
    padding-left: 15px;
    height: 30px;
    line-height: 30px;
    background: url("../../assets/img/gis/title-background.png") no-repeat;
    background-size: cover;
    margin-top: -2px;
  }

  .windowInfo .title span {
    height: 12px;
    width: 12px;
    float: right;
    margin-top: 10px;
    margin-right: 10px;
    cursor: pointer;
    background: url("../../assets/img/gis/close.png") no-repeat;
    background-size: contain !important;
  }

  .windowInfo ul {
    margin-left: 25px;
  }

  .windowInfo ul li {
    height: 35px;
    width: 100px;
    list-style-type: none;
    background-size: 100% 100% !important;
    display: inline-block;
    line-height: 35px;
    margin-left: -20px;
    background-repeat: no-repeat !important;
    text-align: center;
    margin-top: 10px;
    cursor: pointer;
  }

  .windowInfo ul li:first-child {
    background: url("../../assets/img/gis/tab-left.png");
  }

  .windowInfo ul li.selected:first-child {
    background: url("../../assets/img/gis/tab-left-select.png");
  }

  .windowInfo ul li:nth-child(2), .windowInfo ul li:nth-child(3) {
    background: url("../../assets/img/gis/tab-middle.png");
  }

  .windowInfo ul li.selected:nth-child(2), .windowInfo ul li.selected:nth-child(3) {
    background: url("../../assets/img/gis/tab-middle-select.png");
  }

  .windowInfo ul li:last-child {
    background: url("../../assets/img/gis/tab-right.png");
  }

  .windowInfo ul li.selected:last-child {
    background: url("../../assets/img/gis/tab-right-select.png");
  }

  .tab-container {
    padding: 0 10px;
  }

  .tab-container hr {
    height: 1px;
    background-color: #4B5A8A;
    border: none;
    margin: 5px 0;
  }

  .basicInfo {
    margin-top: 8px;
  }

  .basicInfo p {
    line-height: 28px;
    display: block;
  }

  .basicInfo .equipmentType {
    height: 20px;
    line-height: 20px;
    color: #48D2FA;
    padding-left: 10px;
    width: 50%;
    background: linear-gradient(to right, rgba(83, 104, 171, 0.8), rgba(83, 104, 171, 0));
    margin-bottom: 8px;
  }

  .alarmInfo >p{
    display: inline-block;
  }

  .alarmInfo > p:nth-of-type(2n+1) {
    width: 60%;
  }

  .alarmInfo > p:nth-of-type(2n) {
    width: calc(40% - 20px);
  }

  .backAnalysis >p{
    display: inline-block;
  }

  .backAnalysis > p:nth-of-type(3n+1) {
    width: 60%;
  }

  .backAnalysis > p:nth-of-type(3n+2) {
    width: calc(40% - 20px);
  }

  .backAnalysis > p:nth-of-type(3n) {
    width: 100%;
  }

  .diffusionAnalysis > p:nth-of-type(4n+1) {
    width: 60%;
  }

  .diffusionAnalysis >p{
    display: inline-block;
  }

  .diffusionAnalysis > p:nth-of-type(4n+2) {
    width: calc(40% - 20px);
  }

  .diffusionAnalysis > p:nth-of-type(4n), .diffusionAnalysis > p:nth-of-type(4n+3) {
    width: 100%;
  }

  .page {
    position: absolute;
    right: 20px;
    bottom: 10px;
  }

  .page > div {
    display: inline-block;
    height: 16px;
    width: 8px;
    cursor: pointer;
    background-size: contain !important;
    padding: 0 8px;
    background-repeat: no-repeat !important;
  }

  .page .prev {
    background: url("../../assets/img/gis/arrows.png");
  }

  .page .next {
    background: url("../../assets/img/gis/arrows.png");
    transform: rotateY(180deg);
  }

  .page .first {
    background: url("../../assets/img/gis/arrows-hide.png");
    transform: rotateY(180deg);
  }

  .page .last {
    background: url("../../assets/img/gis/arrows-hide.png");
  }

  .windowInfo div:not(:nth-of-type(1)){
    padding: 10px;
  }
</style>
