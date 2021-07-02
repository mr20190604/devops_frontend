<template>
  <div style="position: relative;">
    <div id="bdMap">
      <baidu-map
        style="width: 100%;height: 100%;"
        :scroll-wheel-zoom="true"
        :center="center"
        :zoom="18"
        @ready="mapReady"
      >
        <bm-marker
          v-for="marker in alarmList"
          :key="marker.alarmId"
          :position="{lng: marker.lng, lat:marker.lat}"
          :icon="marker.icon"
          style="cursor: pointer;"
          @click="handleMarkerClick(marker)"
        />

        <bm-info-window
          :position="infoWindow"
          :show="infoWindowShow"
          :offset="{height:40,width:120}"
          animation="BMAP_ANIMATION_BOUNCE"
          @close="infoWindowClose"
          @open="infoWindowOpen"
        >
          <div class="infoBox">
            <img src="../../../assets/img/close.png" class="close" alt="" @click="infoWindowClose">
            <div class="title">
              <p>
                <i class="el-icon-map-location" />
                <span> {{ infoWindow.title }}</span>
              </p>
            </div>
            <p>设备名称:<span>{{ infoWindow.name }}</span></p>
            <p>设备编号:<span>{{ infoWindow.number }}</span></p>
            <p>报警时间:<span>{{ infoWindow.alarmTime }}</span></p>
            <p>历史报警:<span>{{ infoWindow.alarmHistoryCount }}</span></p>
            <p>报警等级:<span
              :style="{color:infoWindow.level===1?'#f70c27':infoWindow.level===2?'#FBB500':'#5B8AD8'}"
            >
              {{ infoWindow.level===1?"一":infoWindow.level===2?"二":"三" }}级
            </span></p>
            <p style="margin-top: 20px;">实时图景：</p>
            <el-row>
              <el-col v-for="(item,index) in infoWindow.images" :key="index" :span="8">
                <el-image :src="item" />
              </el-col>
            </el-row>
          </div>
        </bm-info-window>
      </baidu-map>
      <div class="online">
        <p>当前设备在线率</p>
        <p>96<span>%</span></p>
      </div>
      <div class="alarm">
        <el-row>
          <template v-for="(item,index) in alarm">
            <el-col :key="index+'col1'" :span="11" :style="{color:item.color}">
              {{ item.name }}
            </el-col>
            <el-col :key="index+'col2'" :span="12" style="text-align: center;">
              <span
                v-for="subIndex of maxLength"
                :key="subIndex"
                :style="{'background':item.color}"
                class="item"
                v-text="String(item.count).length + subIndex <= maxLength ? '0' : String(item.count)[subIndex-maxLength+String(item.count).length-1]"
              />
            </el-col>
          </template>
        </el-row>
      </div>
    </div>
    <div class="box" />
  </div>
</template>

<script>
import { getAlarmLevelCount } from '../../../api/screen/gasScreen'

export default {
  name: 'ScreenMap',
  props: {
    alarmId: {
      type: Number,
      default: undefined
    },
    list: {
      type: Array
    }
  },
  data() {
    return {
      BMap: undefined,
      map: undefined,
      alarm: [
        {
          name: '一级预警',
          color: '#f70c27',
          count: 3
        },
        {
          name: '二级预警',
          color: '#FBB500',
          count: 12
        },
        {
          name: '三级预警',
          color: '#5B8AD8',
          count: 152
        }],
      center: {
        lng: 117.566797,
        lat: 32.993585
      },
      infoWindowShow: false,
      infoWindow: {
        title: undefined,
        name: undefined,
        number: undefined,
        alarmTime: undefined,
        alarmHistoryCount: undefined,
        level: undefined,
        images: []
      },
      alarmList: []
    }
  },
  computed: {
    maxLength: function() {
      const copy = JSON.parse(JSON.stringify(this.alarm))
      return String(copy.sort((a, b) => String(b.count).length - String(a.count).length)[0].count).length
    }
  },
  watch: {
    alarmId: function(value) {
      if (value) {
        const marker = this.alarmList.find(item => item.alarmId === value)
        marker && this.handleMarkerClick(marker)
      }
    },
    list(list) {
      this.alarmList = list
      if (list && list.length > 0) {
        this.center.lng = list[0].lng
        this.center.lat = list[0].lat
      }
      this.alarmList && this.resetMarkers()
    }
  },
  created() {
    getAlarmLevelCount().then(res => {
      this.alarm[0].count = res.data.one
      this.alarm[1].count = res.data.two
      this.alarm[2].count = res.data.three
    })
    this.alarmList = this.list
    if (this.list && this.list.length > 0) {
      this.center.lng = this.list[0].lng
      this.center.lat = this.list[0].lat
    }
    this.alarmList && this.resetMarkers()
  },
  methods: {
    mapReady({ BMap, map }) {
      this.map = map
      this.BMap = BMap
      map.setMapStyleV2({
        styleId: 'fe3bc41ca0e11f7dfa8986537af0dca7'
      })
      this.map.addEventListener('zoomend', function(e) {
        // const zoom = map.getZoom()
        // const size = zoom * 10
        // // 计算图标大小
        // this.data.forEach(marker => {
        //   marker.icon.opts.imageSize.height = size
        //   marker.icon.opts.imageSize.width = size
        // })
      })
    },
    handleMarkerClick(marker) {
      const point = new this.BMap.Point(marker.lng, marker.lat)
      this.map.panTo(point)
      this.resetMarkers()
      marker.selected = true
      marker.icon = {
        url: marker.level === 1 ? '/img/gas/large_red.png' : marker.level === 2 ? '/img/gas/large_orange.png' : '/img/gas/large_blue.png',
        size: {
          width: 20,
          height: 20
        },
        opts: {
          imageSize: {
            width: 20,
            height: 20
          }
        }
      }
      this.infoWindow = marker
      this.infoWindowShow = true
    },
    infoWindowClose() {
      this.infoWindowShow = false
      this.resetMarkers()
    },
    infoWindowOpen() {
      this.infoWindowShow = true
    },
    resetMarkers() {
      this.alarmList.forEach(marker => {
        marker.icon = {
          url: marker.level === 1 ? '/img/gas/normal_red.png' : marker.level === 2 ? '/img/gas/normal_orange.png' : '/img/gas/normal_blue.png',
          size: {
            width: 14,
            height: 14
          },
          opts: {
            imageSize: {
              width: 14,
              height: 14
            }
          }
        }
        marker.selected = false
      })
    }
  }
}
</script>

<style scoped>
  #bdMap {
    height: 688px;
    width: 100%;
    padding: 1px;
    margin-top: 21px;
  }

  .box {
    pointer-events: none;
    height: 688px;
    width: 100%;
    border: 1px solid #09F5D1;
    position: absolute;
    top: 0;
    left: 0;
  }

  .online {
    height: 81px;
    width: 152px;
    position: absolute;
    right: 16px;
    top: 14px;
    background: url("../../../assets/img/gas/d1.png");
    color: #48FFEE;
    overflow: hidden;
  }

  .online > p {
    text-align: center;
    font-family: 'Adobe Heiti Std R';
  }

  .online > p:first-child {
    font-size: 14px;
    margin-top: 15px;
  }

  .online > p:last-child {
    font-size: 36px;
    margin-top: 3px;
  }

  .online > p:last-child > span {
    font-size: 22px;
  }

  .alarm {
    height: 132px;
    width: 152px;
    position: absolute;
    right: 16px;
    top: 116px;
    background: url("../../../assets/img/gas/d2.png");
    overflow: hidden;
  }

  .alarm .el-row {
    margin-top: 20px;
    margin-left: 10px;
  }

  .alarm .el-col {
    margin-top: 10px;
  }

  .item {
    margin-left: 3px;
    width: 11px;
    height: 20px;
    color: white;
    display: inline;
    border-radius: 3px;
    font-size: 8px;
    padding: 3px 2px;
  }

  .infoBox {
    background-image: url('../../../assets/img/gas/dj.png');
    background-size: 100% 100%;
    overflow: hidden;
    pointer-events: none;
    display: inline-block !important;
    height: 300px;
    width: 250px;
  }

  .infoBox > p {
    font-size: 10px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #FCFDFD;
    margin: 12px 0 10px 25px;
  }

  .infoBox > p > span {
    color: #56C8D1;
    margin-left: 8px;
  }

  .infoBox .el-row {
    margin-left: 15px;
    margin-right: 5px;
    margin-top: -30px;
  }

  .infoBox .el-col {
    padding-left: 5px;
    padding-right: 5px;
  }

  .close {
    float: right;
    margin-right: 8px;
    margin-top: 18px;
    cursor: pointer;
    pointer-events: auto;
    display: inline-block !important;
  }

  .title {
    height: 25px;
    vertical-align: middle;
    background-image: linear-gradient(to right, rgba(52, 255, 248, 0.2), rgba(255, 255, 255, 0));
    margin: 20px;
  }

  .title > p {
    font-size: 12px;
    padding: 0;
    margin: 0 0 0 8px;
    color: white;
    height: 25px;
    line-height: 25px;
  }

  .title > i {
    margin-right: 8px;
  }

  >>> .el-image img {
    display: block !important;
  }

  /*!*地图标题*!*/
  >>> .BMap_bubble_title {
    display: none;
  }

  /*!* 消息内容 *!*/
  >>> .BMap_bubble_content {
    background-color: transparent;
    padding-left: 5px;
    padding-top: 5px;
    padding-bottom: 10px;
  }

  /* 内容 */
  >>> .BMap_pop div:nth-child(9) {
    top: 35px !important;
  }

  /*左上角删除按键*/
  >>> .BMap_pop img {
    display: none;
  }

  >>> .BMap_top {
    display: none;
  }

  >>> .BMap_bottom {
    display: none;
  }

  >>> .BMap_center {
    display: none;
  }

  /*隐藏边角*/
  >>> .BMap_pop > div:nth-child(1) {
    display: none;
  }

  >>> .BMap_pop > div:nth-child(3) {
    display: none;
  }

  >>> .BMap_pop > div:nth-child(5) {
    display: none;
  }

  >>> .BMap_pop > div:nth-child(7) {
    display: none;
  }

</style>
