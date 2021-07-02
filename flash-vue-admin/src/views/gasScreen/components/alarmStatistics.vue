<template>
  <div class="box">
    <div class="titleBox">
      <p class="circle" />
      <p class="title">报警统计</p>
      <p class="subTitle">STATISTICS</p>
      <p class="selector" :class="{'selected':selected==='year'}" @click="changeTime('year')">年</p>
      <p class="selector" :class="{'selected':selected==='month'}" @click="changeTime('month')">月</p>
      <p class="selector" :class="{'selected':selected==='day'}" @click="changeTime('day')">日</p>
    </div>
    <v-chart :options="options" style="width: 100%;height: 200px;" />
  </div>
</template>

<script>
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/graphic'
import { queryAlarmStatistical } from '../../../api/screen/gasScreen'

export default {
  name: 'AlarmStatistics',
  data: function() {
    return {
      selected: 'day',
      options: undefined,
      dayInfo: {
        xData: [],
        seriesData: []
      },
      monthInfo: {
        xData: [],
        seriesData: []
      },
      yearInfo: {
        xData: [],
        seriesData: []
      }
    }
  },
  created() {
    queryAlarmStatistical('day').then(res => {
      res.data.forEach(item => {
        this.dayInfo.xData.push(item.time)
        this.dayInfo.seriesData.push(item.total)
      })
    })

    const that = this
    this.options = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'line'
        }
      },
      xAxis: {
        type: 'category',
        data: this.dayInfo.xData,
        axisLine: {
          lineStyle: {
            color: '#0DFDF6',
            width: 2
          }
        },
        axisLabel: {
          color: 'white',
          formatter: function(value) {
            if (that.selected === 'day') {
              return value.split(' ')[1].split(':')[0]
            } else if (that.selected === 'month') {
              return Number(value.split(' ')[0].split('-')[2])
            } else if (that.selected === 'year') {
              return Number(value.split('-')[1])
            }
          }
        }
      },
      yAxis: {
        name: '单位/次',
        type: 'value',
        axisLine: {
          lineStyle: {
            color: '#0DFDF6',
            width: 2
          }
        },
        axisLabel: {
          color: 'white'
        }
      },
      series: [{
        data: this.dayInfo.seriesData,
        type: 'line',
        name: '报警',
        itemStyle: {
          color: new this.$echarts.graphic.LinearGradient(0, 1, 0, 0,
            [
              { offset: 0, color: '#0DFDF6' },
              { offset: 1, color: '#9EFDBB' }
            ]
          )
        }
      }]
    }
  },
  methods: {
    changeTime: function(type) {
      this.selected = type
      const that = this
      if (type === 'day') {
        queryAlarmStatistical('day').then(res => {
          that.dayInfo.xData = []
          that.dayInfo.seriesData = []
          res.data.forEach(item => {
            that.dayInfo.xData.push(item.time)
            that.dayInfo.seriesData.push(item.total)
          })
          that.options.xAxis.data = this.dayInfo.xData
          that.options.series[0].data = this.dayInfo.seriesData
        })
      } else if (type === 'month') {
        queryAlarmStatistical('month').then(res => {
          that.monthInfo.xData = []
          that.monthInfo.seriesData = []
          res.data.forEach(item => {
            that.monthInfo.xData.push(this.dateFormatter('Y-m-d', new Date(item.time)))
            that.monthInfo.seriesData.push(item.total)
          })
          that.options.xAxis.data = this.monthInfo.xData
          that.options.series[0].data = this.monthInfo.seriesData
        })
      } else if (type === 'year') {
        queryAlarmStatistical('year').then(res => {
          that.yearInfo.xData = []
          that.yearInfo.seriesData = []
          res.data.forEach(item => {
            const spliter = item.time.split(' ')[0].split('-')
            spliter.pop()
            that.yearInfo.xData.push(spliter.join('-'))
            that.yearInfo.seriesData.push(item.total)
          })
          this.options.xAxis.data = this.yearInfo.xData
          this.options.series[0].data = this.yearInfo.seriesData
        })
      }
    }
  }
}
</script>

<style scoped>
  .box {
    height: 220px;
    width: 100%;
    margin-top: 20px;
    background: url("../../../assets/img/gas/7.png");
    overflow: hidden;
    position: relative;
  }

  .titleBox {
    margin: 15px 0 0 0;
    padding: 0;
    overflow: hidden;
    position: relative;
    height: 25px;
  }

  .circle {
    width: 22px;
    height: 22px;
    display: inline-block;
    border: 3px solid #09F5D1;
    border-radius: 11px;
    left: 16px;
    line-height: 29px;
    position: absolute;
  }

  .title {
    font-size: 18px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #F7F7FC;
    left: 45px;
    top: 3px;
    display: inline-block;
    position: absolute;
  }

  .subTitle {
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    display: inline-block;
    color: #00F9BB;
    left: 128px;
    top: 8px;
    position: absolute;
  }

  .selector {
    width: 54px;
    height: 24px;
    background: #122E4E;
    border: 1px solid #E9F0F6;
    opacity: 0.82;
    border-radius: 12px;
    float: right;
    color: #F7F7FC;
    text-align: center;
    line-height: 24px;
    margin-right: 8px;
    cursor: pointer;
  }

  .selected {
    background: #1591A1;
  }

</style>
