<template>
  <div style="width: 100%;height: 100%;">
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
        :icon="marker.icon||defaultIcon"
        @click="handleMarkerClick(marker)"
      />
    </baidu-map>
    <div v-show="infoWindow.show" class="infoBox">
      <img src="../../../assets/img/close.png" class="close" alt="" @click="infoWindowClose">
      <div class="title">
        <p>
          <i class="el-icon-map-location" />
          <span> {{ infoWindow.address }}</span>
        </p>
      </div>
      <div id="top">
        <el-progress type="dashboard" :percentage="infoWindow.riskCount" :width="70" :stroke-width="4" color="#34fff8" />
        <div id="circle1" class="circle">
          <p class="quantity" style="color: #34fff8">{{ infoWindow.riskCount }}</p>
          <p class="title">风险源</p>
        </div>
        <el-progress type="dashboard" :percentage="infoWindow.todayAlarmCount" :width="70" :stroke-width="4" color="#b22d36" />
        <div id="circle2" class="circle">
          <p class="quantity" style="color: #b22d36">{{ infoWindow.riskCount }}</p>
          <p class="title">今日报警</p>
        </div>
        <el-progress type="dashboard" :percentage="infoWindow.historyAlarmCount" :width="70" :stroke-width="4" color="#f19c4b" />
        <div id="circle3" class="circle">
          <p class="quantity" style="color: #f19c4b">{{ infoWindow.riskCount }}</p>
          <p class="title">历史报警</p>
        </div>
      </div>
      <div style="margin-top: 5px;">
        <img src="../../../assets/img/水滴.png" alt="" style="float: left;margin-left: 10px;">
        <div style="float: left;width: 100px;font-size: 12px">
          <p style="color: #34fff8;padding-left: 8px;">水流量</p>
          <p style="color: white;padding-left: 8px;margin-top: 5px;font-size: 14px;">{{ infoWindow.waterSpeed }}升/秒</p>
        </div>
        <div style="clear: both;" />
        <el-row style="font-size: 10px;color: white;margin-top: 15px">
          <el-col v-for="item in infoWindow.statistics" :key="item.matter" :span="8">
            <p class="type" v-html="item.matter" />
            <el-progress :percentage="50" :stroke-width="4" :show-text="false" color="#5fced2" />
            <p class="percentage">{{ item.concentration }} ug/m<sup>3</sup></p>
          </el-col>
        </el-row>
      </div>
    </div>
    <div style="position: relative;height: 170px;top:-170px;overflow: hidden;cursor: pointer;pointer-events: none;">
      <div class="subTitle">
        <p>实时预警列表</p>
      </div>
      <table border="0" cellspacing="0" cellpadding="0" style="pointer-events: auto;">
        <thead>
          <tr style="text-align: center;background: #333333;">
            <td>设备</td>
            <td>时间</td>
            <td>状况</td>
            <td>等级</td>
            <td>事件描述</td>
            <td>处理进度</td>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item,index) in data"
            :key="index"
            style="text-align: center;"
            :style="{'marginTop':marginTop+'px'}"
            @click="handleRowClick(item)"
          >
            <td>{{ item.equipment }}</td>
            <td>{{ item.time }}</td>
            <td>{{ item.condition===1?'正常':'异常' }}</td>
            <td :style="{color:(item.level===1?'#b22d36':item.level===2?' #f19c4b':' #34fff8')}">
              {{ item.level===1?'一级':item.level===2?'二级':'三级' }}
            </td>
            <td>{{ item.description }}</td>
            <td>{{ item.rate===1?'待分配':item.rate===2?'待处理':item.rate===3?'待审核':'已结案' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import 'echarts/lib/chart/gauge'

export default {
  name: 'ScreenMap',
  data() {
    return {
      marginTop: 0,
      BMap: undefined,
      map: undefined,
      center: {
        lng: 117.566797,
        lat: 32.993585
      },
      defaultIcon: {
        url: '/head.png',
        size: {
          width: 40, height: 40
        }
      },
      infoWindow: {
        show: false,
        address: undefined,
        riskCount: undefined,
        todayAlarmCount: undefined,
        historyAlarmCount: undefined,
        waterSpeed: undefined,
        statistics: [
          {
            matter: undefined,
            concentration: undefined
          }
        ]
      },
      data: [
        {
          equipment: 'DQ8274-032',
          time: '12:32:15',
          condition: 0,
          level: 1,
          description: '经监测C区域氨气浓度超标',
          rate: 1,
          lng: 117.566797,
          lat: 32.993585,
          address: 'C区域',
          riskCount: 25,
          todayAlarmCount: 56,
          historyAlarmCount: 65,
          waterSpeed: 12,
          statistics: [
            {
              matter: 'PM2.5',
              concentration: 26
            },
            {
              matter: 'PM10',
              concentration: 26
            },
            {
              matter: 'SO<sub>2</sub>',
              concentration: 15
            },
            {
              matter: 'CH<sub>4</sub>',
              concentration: 25
            },
            {
              matter: 'O<sub>2</sub>',
              concentration: 55
            },
            {
              matter: 'CO',
              concentration: 66
            }
          ]
        }, {
          equipment: 'DQ8274-025',
          time: '12:32:47',
          condition: 0,
          level: 2,
          description: '经监测,A区域二氧化硫浓度超标',
          rate: 1,
          lng: 117.565333,
          lat: 32.993426,
          address: 'C区域',
          riskCount: 25,
          todayAlarmCount: 56,
          historyAlarmCount: 65,
          waterSpeed: 12,
          statistics: [
            {
              matter: 'PM2.5',
              concentration: 26
            },
            {
              matter: 'PM10',
              concentration: 26
            },
            {
              matter: 'SO<sub>2</sub>',
              concentration: 15
            },
            {
              matter: 'CH<sub>4</sub>',
              concentration: 25
            },
            {
              matter: 'O<sub>2</sub>',
              concentration: 112
            },
            {
              matter: 'CO',
              concentration: 125
            }
          ]
        },
        {
          equipment: 'DQ8274-027',
          time: '12:20:16',
          condition: 0,
          level: 2,
          description: '经监测, D区域二氧化氮浓度超标',
          rate: 2,
          lng: 117.566915,
          lat: 32.991689,
          address: 'C区域',
          riskCount: 25,
          todayAlarmCount: 56,
          historyAlarmCount: 65,
          waterSpeed: 12,
          statistics: [
            {
              matter: 'PM2.5',
              concentration: 26
            },
            {
              matter: 'PM10',
              concentration: 26
            },
            {
              matter: 'SO<sub>2</sub>',
              concentration: 15
            },
            {
              matter: 'CH<sub>4</sub>',
              concentration: 25
            },
            {
              matter: 'O<sub>2</sub>',
              concentration: 85
            },
            {
              matter: 'CO',
              concentration: 46
            }
          ]
        },
        {
          equipment: 'DQ8274-045',
          time: '11:32:46',
          condition: 0,
          level: 3,
          description: '经监测,F区域一氧化碳浓度超标',
          rate: 2,
          lng: 117.565262,
          lat: 32.989751,
          address: 'C区域',
          riskCount: 25,
          todayAlarmCount: 56,
          historyAlarmCount: 65,
          waterSpeed: 12,
          statistics: [
            {
              matter: 'PM2.5',
              concentration: 26
            },
            {
              matter: 'PM10',
              concentration: 26
            },
            {
              matter: 'SO<sub>2</sub>',
              concentration: 15
            },
            {
              matter: 'CH<sub>4</sub>',
              concentration: 25
            },
            {
              matter: 'O<sub>2</sub>',
              concentration: 12
            },
            {
              matter: 'CO',
              concentration: 151
            }
          ]
        }, {
          equipment: 'DQ8274-056',
          time: '11:12:37',
          condition: 0,
          level: 2,
          description: '经监测,E区域甲烷浓度超标',
          rate: 4,
          lng: 117.568065,
          lat: 32.996352,
          address: 'C区域',
          riskCount: 25,
          todayAlarmCount: 56,
          historyAlarmCount: 65,
          waterSpeed: 12,
          statistics: [
            {
              matter: 'PM2.5',
              concentration: 26
            },
            {
              matter: 'PM10',
              concentration: 26
            },
            {
              matter: 'SO<sub>2</sub>',
              concentration: 15
            },
            {
              matter: 'CH<sub>4</sub>',
              concentration: 25
            },
            {
              matter: 'O<sub>2</sub>',
              concentration: 65
            },
            {
              matter: 'CO',
              concentration: 121
            }
          ]
        }, {
          equipment: 'DQ8274-045',
          time: '11:20:25',
          condition: 0,
          level: 3,
          description: '经监测,B区域乙烯浓度超标',
          rate: 3,
          lng: 117.562459,
          lat: 32.991265,
          address: 'C区域',
          riskCount: 25,
          todayAlarmCount: 56,
          historyAlarmCount: 65,
          waterSpeed: 12,
          statistics: [
            {
              matter: 'PM2.5',
              concentration: 26
            },
            {
              matter: 'PM10',
              concentration: 26
            },
            {
              matter: 'SO<sub>2</sub>',
              concentration: 15
            },
            {
              matter: 'CH<sub>4</sub>',
              concentration: 25
            },
            {
              matter: 'O<sub>2</sub>',
              concentration: 45
            },
            {
              matter: 'CO',
              concentration: 142
            }
          ]
        }, {
          equipment: 'DQ8274-030',
          time: '11:08:11',
          condition: 0,
          level: 2,
          description: '经监测,A区域二氧化硫浓度超标',
          rate: 4,
          lng: 117.564459,
          lat: 32.992365,
          address: 'C区域',
          riskCount: 25,
          todayAlarmCount: 56,
          historyAlarmCount: 65,
          waterSpeed: 12,
          statistics: [
            {
              matter: 'PM2.5',
              concentration: 26
            },
            {
              matter: 'PM10',
              concentration: 26
            },
            {
              matter: 'SO<sub>2</sub>',
              concentration: 15
            },
            {
              matter: 'CH<sub>4</sub>',
              concentration: 25
            },
            {
              matter: 'O<sub>2</sub>',
              concentration: 56
            },
            {
              matter: 'CO',
              concentration: 12
            }
          ]
        }, {
          equipment: 'DQ8274-085',
          time: '10:45:04',
          condition: 0,
          level: 3,
          description: '经监测,A区域二氧化硫浓度超标',
          rate: 3,
          lng: 117.565659,
          lat: 32.994565,
          address: 'C区域',
          riskCount: 25,
          todayAlarmCount: 56,
          historyAlarmCount: 65,
          waterSpeed: 12,
          statistics: [
            {
              matter: 'PM2.5',
              concentration: 26
            },
            {
              matter: 'PM10',
              concentration: 26
            },
            {
              matter: 'SO<sub>2</sub>',
              concentration: 15
            },
            {
              matter: 'CH<sub>4</sub>',
              concentration: 25
            },
            {
              matter: 'O<sub>2</sub>',
              concentration: 25
            },
            {
              matter: 'CO',
              concentration: 44
            }
          ]
        }]
    }
  },
  created() {
    setInterval(this.showWarningData, 100)
  },
  methods: {
    mapReady({ BMap, map }) {
      this.map = map
      this.BMap = BMap
      // 在node_modules里面的vue-baidu-map/components/map/Map.vue 修改api版本2.0为3.0
      map.setMapStyleV2({
        styleId: 'fe3bc41ca0e11f7dfa8986537af0dca7'
      })
    },
    showWarningData() {
      this.marginTop -= 1
      if (this.marginTop < -18) {
        this.data.push(this.data[0])
        this.data.shift()
        this.marginTop = 0
      }
    },
    handleRowClick(row) {
      this.handleMarkerClick(row)
    },
    handleMarkerClick(marker) {
      const point = new this.BMap.Point(marker.lng, marker.lat)
      this.map.panTo(point)
      this.resetMarker()
      marker.icon = { url: 'http://developer.baidu.com/map/jsdemo/img/fox.gif', size: { width: 300, height: 157 }}
      this.infoWindow = marker
      this.infoWindow.show = true

      this.data.forEach(item => {
        console.log(item.icon)
      })
    },
    infoWindowClose() {
      this.infoWindow.show = false
    },
    resetMarker() {
      this.data.forEach(item => {
        item.icon = null
      })
    }
  }
}
</script>

<style scoped lang="scss">
  $info: #34fff8;
  $tableBorderColor: #9fe4e5;

  p {
    margin: 0;
    padding: 0;
  }

  .subTitle {
    width: 100%;
    height: 40px;
    background-size: 100% 35px;
    color: $info;
    text-align: center;
    line-height: 55px;
    margin-top: 10px;
    font-size: 24px;
    vertical-align: top;
    overflow: hidden;
    padding-left: 8px;
    background: url('../../../assets/img/标题装饰3.png') no-repeat bottom;
  }

  table {
    width: 100%;
    color: white;
    margin-top: 5px;
    background: rgba(0, 0, 0, 0.4);
  }

  td {
    padding: 5px;
    font-size: 12px;
  }

  .infoBox {
    position: absolute;
    right: 530px;
    top: 130px;
    height: 300px;
    width: 250px;
    background-image: url('../../../assets/img/小底框.png');
    background-size: 100% 100%;
    overflow: hidden;
  }

  .close {
    float: right;
    margin-right: 8px;
    margin-top: 8px;
    cursor: pointer;
  }

  .title {
    height: 25px;
    vertical-align: middle;
    background-image: linear-gradient(to right, rgba(52, 255, 248, 0.2), rgba(255, 255, 255, 0));
    margin-left: 20px;
    margin-right: 20px;
    margin-top: 20px;
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

  #top > .el-progress {
    margin: 10px 5px;
    transform: rotate(180deg);
    color: transparent !important;
  }

  .circle {
    height: 54px;
    width: 54px;
    position: absolute;
    border-radius: 27px;
    margin-top: -72px;
    background: black;
    font-size: 5px;
    color: white;
  }

  .circle > p {
    margin: 0;
    padding: 0;
    width: 100%;
    text-align: center;
  }

  .circle > .quantity {
    margin-top: 7px;
  }

  .circle > .title {
    margin-top: 7px;
  }

  #circle1 {
    border: 2px dotted #34fff8;
    margin-left: 13px;
  }

  #circle2 {
    border: 2px dotted #b22d36;
    margin-left: 97px;
  }

  #circle3 {
    border: 2px dotted #f19c4b;
    margin-left: 182px;
  }

  .el-row p{
    margin: 5px 0 5px 10px;
  }

  .el-row .el-progress{
    padding: 0 10px;
  }

</style>
