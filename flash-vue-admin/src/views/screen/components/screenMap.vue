<template>
  <div style="width: 100%;height: 100%;">
    <baidu-map
      style="width: 100%;height: 100%;"
      :scroll-wheel-zoom="true"
      :center="{lng: 117.567112, lat: 32.993366}"
      :zoom="15"
      @ready="mapReady"
    >
      <bm-marker v-for="marker in markers" :key="marker.lng" :position="{lng: marker.lng, lat:marker.lat}" />
    </baidu-map>
    <div style="position: relative;height: 250px;top:-260px;pointer-events:none;">
      <div class="subTitle">
        <p>实时预警列表</p>
      </div>
      <table border="0" cellspacing="0" cellpadding="0">
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
          <tr v-for="(item,index) in data" :key="index" style="text-align: center;">
            <td>{{ item.equipment }}</td>
            <td>{{ item.time }}</td>
            <td>{{ item.condition===1?"正常":"异常" }}</td>
            <td :style="{color:(item.level===1?'#b22d36':item.level===2?' #f19c4b':' #34fff8')}">
              {{ item.level===1?"一级":item.level===2?"二级":"三级" }}</td>
            <td>{{ item.description }}</td>
            <td>{{ item.rate===1?"待分配":item.rate===2?"待处理":item.rate===3?"待审核":"已结案" }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ScreenMap',
  data() {
    return {
      data: [
        {
          equipment: 'DQ8274-032',
          time: '12:32:15',
          condition: 0,
          level: 1,
          description: '经监测,A区域二氧化硫浓度超标',
          rate: 1
        }, {
          equipment: 'DQ8274-032',
          time: '12:32:15',
          condition: 0,
          level: 2,
          description: '经监测,A区域二氧化硫浓度超标',
          rate: 1
        },
        {
          equipment: 'DQ8274-032',
          time: '12:32:15',
          condition: 0,
          level: 2,
          description: '经监测,A区域二氧化硫浓度超标',
          rate: 2
        },
        {
          equipment: 'DQ8274-032',
          time: '12:32:15',
          condition: 0,
          level: 3,
          description: '经监测,A区域二氧化硫浓度超标',
          rate: 2
        }, {
          equipment: 'DQ8274-032',
          time: '12:32:15',
          condition: 0,
          level: 3,
          description: '经监测,A区域二氧化硫浓度超标',
          rate: 4
        }, {
          equipment: 'DQ8274-032',
          time: '12:32:15',
          condition: 0,
          level: 3,
          description: '经监测,A区域二氧化硫浓度超标',
          rate: 3
        }, {
          equipment: 'DQ8274-032',
          time: '12:32:15',
          condition: 0,
          level: 3,
          description: '经监测,A区域二氧化硫浓度超标',
          rate: 4
        }, {
          equipment: 'DQ8274-032',
          time: '12:32:15',
          condition: 0,
          level: 3,
          description: '经监测,A区域二氧化硫浓度超标',
          rate: 3
        }],
      markers: [
        {
          lng: 117.566797,
          lat: 32.993585
        },
        {
          lng: 117.565333,
          lat: 32.993426
        },
        {
          lng: 117.566915,
          lat: 32.991689
        }, {
          lng: 117.565262,
          lat: 32.989751
        },
        {
          lng: 117.568065,
          lat: 32.996352
        }, {
          lng: 117.562459,
          lat: 32.991265
        }
      ]
    }
  },
  methods: {
    mapReady({ BMap, map }) {
      // 在node_modules里面的vue-baidu-map/components/map/Map.vue 修改api版本2.0为3.0
      map.setMapStyleV2({
        styleId: 'fe3bc41ca0e11f7dfa8986537af0dca7'
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
    padding: 0 0 0 25px;
  }
  .subTitle{
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
    margin-top:5px;
    background: rgba(0,0,0,0.4);
  }

  td {
    padding: 5px;
    font-size: 12px;
  }
</style>
