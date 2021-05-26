<template>
  <div class="container">
    <div class="header">
      <p class="title">苍穹智能环境监测系统</p>
      <p class="toolbar">
        <img src="../../assets/img/时间.png" alt="time">
        <span class="time">{{ now }}</span>
        <img src="../../assets/img/太阳.png" alt="太阳">
        <span class="weather">{{ weather }}</span>
        <span class="temperature">{{ temperature }}℃</span>
        <el-link href="/#/platform" type="primary" style="float: right;margin-right: 50px;">进入系统</el-link>
      </p>
    </div>
    <div class="content">
      <div class="left">
        <div class="situation">
          <div class="subTitle">
            <p>园区概况</p>
          </div>
          <situation />
        </div>
        <div class="airQuality">
          <div class="subTitle">
            <p>园区空气质量</p>
          </div>
          <air-quality />
        </div>
        <div class="warningData">
          <div class="subTitle">
            <p>预警统计</p>
          </div>
          <warning-data />
        </div>
      </div>
      <div class="center">
        <div class="map">
          <screenMap />
        </div>
        <div>
          <div class="warning">
            <div class="subTitle">
              <p>实时预警数据</p>
            </div>
            <warning />
          </div>
          <div class="monitoring">
            <div class="subTitle">
              <p>实时监控数据</p>
            </div>
            <monitoring />
          </div>
        </div>
      </div>
      <div class="right">
        <div class="discharge">
          <div class="subTitle">
            <p>废气排放数据</p>
          </div>
          <discharge />
        </div>
        <div class="realtime ">
          <div class="subTitle">
            <p>实时数据</p>
          </div>
          <realtime />
        </div>
        <div class="equipment">
          <div class="subTitle">
            <p>监测设备数据</p>
          </div>
          <equipment />
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import situation from './components/situation'
import airQuality from './components/airQuality'
import warningData from './components/warningData'
import discharge from './components/discharge'
import realtime from './components/realtime'
import equipment from './components/equipment'
import warning from './components/warning'
import monitoring from './components/monitoring'
import screenMap from './components/screenMap'

export default {
  name: 'ScreenMonitors',
  components: {
    situation,
    airQuality,
    warningData,
    discharge,
    realtime,
    equipment,
    warning,
    monitoring,
    screenMap
  },
  data() {
    return {
      now: undefined,
      weather: '晴',
      temperature: '6-12'
    }
  },
  created() {
    this.now = this.dateFormat('YYYY-mm-dd HH:MM:SS', new Date())
    const that = this
    setInterval(function() {
      that.now = that.dateFormat('YYYY-mm-dd HH:MM:SS', new Date())
    }, 1000)
  },
  methods: {
    dateFormat: function(fmt, date) {
      let ret
      const opt = {
        'Y+': date.getFullYear().toString(), // 年
        'm+': (date.getMonth() + 1).toString(), // 月
        'd+': date.getDate().toString(), // 日
        'H+': date.getHours().toString(), // 时
        'M+': date.getMinutes().toString(), // 分
        'S+': date.getSeconds().toString() // 秒
      }
      for (const k in opt) {
        ret = new RegExp('(' + k + ')').exec(fmt)
        if (ret) {
          fmt = fmt.replace(ret[1], (ret[1].length === 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, '0')))
        }
      }
      return fmt
    }
  }
}
</script>

<style scoped lang="scss">
  $info: #34fff8;
  $warning: #f19c4b;
  $danger: #b22d36;

  p {
    margin: 0;
    padding: 0;
  }

  .container {
    width: 100%;
    background: url('../../assets/img/大背景.png') repeat-y;
    position: absolute;
  }

  .header {
    width: 100%;
    height: 80px;
    background: url('../../assets/img/头部.png') no-repeat ;
    background-size: 1920px 80px;
  }

  .title {
    font-size: 34px;
    width: 100%;
    line-height: 80px;
    margin: 0;
    padding: 0;
    text-align: center;
    color: $info;
  }

  .toolbar {
    color:white;
    vertical-align: top;
    overflow: hidden;
    height: 36px;
    padding-left: 30px;
    margin-top: -20px;
  }

  .time,.weather,.temperature{
    margin: 0 10px;
    height: 36px;
    line-height: 36px;
  }

  .content {
    margin: 10px 8px;
  }

  .left, .right {
    width: 25%;
    margin: 5px;
    float: left;
  }

  .center {
    width: calc(50% - 30px);
    margin: 5px;
    float: left;
  }

  .situation, .airQuality, .warningData,
  .discharge, .realtime, .equipment {
    height: 306px;
    background-image: url("../../assets/img/底框.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    margin: 15px 0;
    overflow: hidden;
  }

  .map {
    height: 626px;
    background-image: url("../../assets/img/mapBox.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    margin: 15px 0;
    padding: 3px;
  }

  .warning, .monitoring {
    width: calc(50% - 8px);
    float: left;
    height: 306px;
    background-image: url("../../assets/img/小底框.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }

  .warning {
    margin-right: 16px;
  }

  .subTitle{
    width: 100%;
    height: 35px;
    background-size: 100% 35px;
    color: $info;
    text-align: center;
    line-height: 55px;
    margin-top: 10px;
    font-size: 24px;
    vertical-align: top;
    overflow: hidden;
    padding-left: 8px;
  }

  .left .subTitle, .right .subTitle {
    background: url('../../assets/img/标题装饰1.png') no-repeat bottom;
    background-size: 100% 35px;
  }

  .warning .subTitle,.monitoring .subTitle{
    background: url('../../assets/img/标题装饰2.png') no-repeat bottom;
  }

  .subTitle > p {
    font-size: 24px;
    margin: -14px 0 0 0;
    padding: 0;
  }

  .warningText {
    color: $warning;
  }

  .dangerText {
    color: $danger;
  }

</style>
