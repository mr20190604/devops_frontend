<template>
  <div class="gasBox">
    <el-row>
      <el-col :span="24">
        <div class="header">
          <p>智慧燃气监测系统</p>
        </div>
        <p class="toolbar">
          <img src="../../assets/img/时间.png" alt="time">
          <span class="time">{{ now }}</span>
          <img class="icon" :src="icon" alt="天气图标">
          <span class="weather">{{ weather }}</span>
          <span class="temperature">{{ temperature }}℃</span>
          <el-link href="/#/mmBasEquipment" type="primary" style="float: right;margin-right: 50px;">进入系统</el-link>
        </p>
      </el-col>
    </el-row>
    <el-row class="container">
      <el-col :span="6">
        <el-row>
          <el-col :span="24">
            <air-info />
          </el-col>
          <el-col :span="24">
            <equipment-info />
          </el-col>
          <el-col :span="24">
            <inspection />
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="12">
        <el-row>
          <el-col :span="24">
            <screenNav />
          </el-col>
          <el-col :span="24">
            <screen-map :alarm-id="alarmId" :list="alarmList" />
          </el-col>
          <el-col :span="24">
            <count-info />
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-row>
          <el-col :span="24">
            <alarm-info :list="alarmList" @showWindowInfo="handleShowWindowInfo" />
          </el-col>
          <el-col :span="24">
            <alarmStatistics />
          </el-col>
          <el-col :span="24">
            <screenVideo />
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import airInfo from './components/airInfo'
import alarmInfo from './components/alarmInfo'
import alarmStatistics from './components/alarmStatistics'
import countInfo from './components/countInfo'
import equipmentInfo from './components/equipmentInfo'
import inspection from './components/inspection'
import screenNav from './components/screenNav'
import screenMap from './components/screenMap'
import screenVideo from './components/screenVideo'
import axios from 'axios'
import fair from '../../assets/img/太阳.png'
import { queryAlarmList } from '../../api/screen/gasScreen'
import tu1 from '../../assets/img/gas/tu1.png'
import tu3 from '../../assets/img/gas/tu3.png'
import tu5 from '../../assets/img/gas/tu5.png'

export default {
  name: 'Index',
  components: {
    airInfo,
    alarmInfo,
    alarmStatistics,
    countInfo,
    equipmentInfo,
    inspection,
    screenNav,
    screenMap,
    screenVideo
  },
  data: function() {
    return {
      now: undefined,
      weather: '晴',
      icon: fair,
      temperature: '12',
      alarmId: undefined,
      alarmList: undefined
    }
  },
  created() {
    queryAlarmList().then(res => {
      console.log(res.data)
      const list = res.data.map(item => {
        return {
          lng: item.longitude,
          lat: item.latitude,
          title: item.alarmLocation,
          name: item.equipment.equipmentName,
          number: item.equipment.equipmentCode,
          alarmTime: item.alarmTime,
          alarmHistoryCount: item.historyCount,
          level: item.auditAlarmLevel - 227,
          images: [tu1, tu3, tu5],
          event: item.monitorTypeName + item.auditAlarmLevelName,
          time: item.alarmTime,
          status: item.isFeedback + 1,
          alarmId: item.id
        }
      })
      this.alarmList = list
    })

    this.now = this.dateFormatter('YYYY-mm-dd HH:MM:SS', new Date())
    const that = this
    setInterval(function() {
      that.now = that.dateFormatter('YYYY-mm-dd HH:MM:SS', new Date())
    }, 1000)

    axios.get('https://restapi.amap.com/v3/weather/weatherInfo?key=e5381a1bb9d2a25deebbf285775fe191&city=340100&extensions=base').then(res => {
      const info = res.data.lives[0]
      this.weather = info.weather
      this.temperature = info.temperature
      this.icon = '/weather/' + info.weather + '.png'
    })
  },
  methods: {
    handleShowWindowInfo(alarmId) {
      this.alarmId = alarmId
    }
  }
}
</script>

<style scoped>
  .gasBox {
    width: 100%;
    height: 1080px;
    background: url("../../assets/img/gas/背景.png");
  }

  .gasBox .header {
    height: 100%;
    background: url("../../assets/img/gas/头部.png") no-repeat center;
    height: 58px;
    margin-top: 5px;
    overflow: hidden;
  }

  .gasBox .header > p {
    font-size: 26px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #EFF0FA;
    text-align: center;
    margin-top: 10px;
  }

  .toolbar {
    color: white;
    vertical-align: top;
    overflow: hidden;
    height: 36px;
    padding-left: 30px;
    margin-top: -20px;
  }

  .icon{
    height: 26px;
    width: 26px;
  }

  .time, .weather, .temperature {
    margin: 0 10px;
    height: 36px;
    line-height: 36px;
  }

  .container {
    margin-top: 8px;
  }

  .container > .el-col:first-child {
    width: 404px;
    margin-left: 22px;
  }

  .container > .el-col:nth-child(2) {
    width: 1024px;
    margin-left: 22px;
  }

  .container > .el-col:last-child {
    width: 404px;
    margin-left: 22px;
  }

</style>
