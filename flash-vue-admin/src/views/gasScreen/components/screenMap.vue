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
          v-for="marker in data"
          :key="marker.lng"
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
              :style="{&quot;color&quot;:infoWindow.level===1?&quot;#f70c27&quot;:infoWindow.level===2?&quot;#FBB500&quot;:&quot;#5B8AD8&quot;}"
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
import tu1 from '../../../assets/img/gas/tu1.png'
import tu2 from '../../../assets/img/gas/tu2.png'
import tu3 from '../../../assets/img/gas/tu3.png'
import tu4 from '../../../assets/img/gas/tu4.png'
import tu5 from '../../../assets/img/gas/tu5.png'
import tu6 from '../../../assets/img/gas/tu6.png'

export default {
  name: 'ScreenMap',
  props: {
    id: {
      type: Number,
      default: undefined
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
      data: [
        {
          lng: 117.566797,
          lat: 32.993585,
          title: '长江西路1号管道设备',
          name: '1号甲烷探测器',
          number: 'HGA738',
          alarmTime: '2021-05-21 9:23:48',
          alarmHistoryCount: 3,
          level: 1,
          images: [tu1, tu3, tu5]
        },
        {
          lng: 117.565333,
          lat: 32.993426,
          title: '长江西路1号管道设备',
          name: '2号甲烷探测器',
          number: 'HGA737',
          alarmTime: '2021-05-21 11:41:07',
          alarmHistoryCount: 5,
          level: 1,
          images: [tu2, tu4, tu6]
        },
        {

          lng: 117.566915,
          lat: 32.991689,
          title: '长江西路1号管道设备',
          name: '5号甲烷探测器',
          number: 'HGA745',
          alarmTime: '2021-03-18 13:45:21',
          alarmHistoryCount: 2,
          level: 2,
          images: [tu1, tu4, tu5]
        },
        {
          lng: 117.565262,
          lat: 32.989751,
          title: '长江西路1号管道设备',
          name: '1号甲烷探测器',
          number: 'HGA738',
          alarmTime: '2021-03-12 7:42:56',
          alarmHistoryCount: 3,
          level: 2,
          images: [tu1, tu3, tu6]
        },
        {
          lng: 117.568065,
          lat: 32.996352,
          title: '长江西路1号管道设备',
          name: '1号甲烷探测器',
          number: 'HGA738',
          alarmTime: '2021-03-08 4:05:14',
          alarmHistoryCount: 3,
          level: 2,
          images: [tu2, tu3, tu5]
        },
        {
          lng: 117.562459,
          lat: 32.991265,
          title: '长江西路1号管道设备',
          name: '1号甲烷探测器',
          number: 'HGA738',
          alarmTime: '2021-05-21 8:52:21',
          alarmHistoryCount: 3,
          level: 3,
          images: [tu2, tu4, tu5]
        },
        {
          lng: 117.564459,
          lat: 32.992365,
          title: '长江西路1号管道设备',
          name: '1号甲烷探测器',
          number: 'HGA738',
          alarmTime: '2021-05-21 23:45:15',
          alarmHistoryCount: 3,
          level: 3,
          images: [tu1, tu2, tu5]
        },
        {
          lng: 117.565659,
          lat: 32.994565,
          title: '长江西路1号管道设备',
          name: '1号甲烷探测器',
          number: 'HGA738',
          alarmTime: '2021-05-21 20:18:17',
          alarmHistoryCount: 3,
          level: 3,
          images: [tu2, tu3, tu6]
        }]
    }
  },
  computed: {
    maxLength: function() {
      const copy = JSON.parse(JSON.stringify(this.alarm))
      return String(copy.sort((a, b) => String(b.count).length - String(a.count).length)[0].count).length
    }
  },
  watch: {
    id: function(value) {
      if (value) {
        this.handleMarkerClick(this.data[value - 1])
      }
    }
  },
  created() {
    this.resetMarkers()
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
      this.data.forEach(marker => {
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
