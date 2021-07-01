<template>
  <div class="box">
    <div class="titleBox">
      <p class="circle" />
      <p class="title">巡检巡查</p>
      <p class="subTitle">INSPECTION</p>
      <p class="selector" :class="{'selected':selected==='year'}" @click="changeTime('year')">年</p>
      <p class="selector" :class="{'selected':selected==='month'}" @click="changeTime('month')">月</p>
      <p class="selector" :class="{'selected':selected==='day'}" @click="changeTime('day')">日</p>
    </div>

    <v-chart :options="options" style="width: 100%;height: 260px;" />

  </div>
</template>

<script>
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/graphic'

export default {
  name: 'Inspection',
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
    // 构造随机数据
    // 天数据
    const now = new Date()
    for (let i = 6; i < 23; i++) {
      this.dayInfo.xData.push(this.dateFormatter('YYYY-mm-dd', now) + ' ' + i + ':00')
      // 随机1到11次
      this.dayInfo.seriesData.push(Math.floor((Math.random() * 10) + 1))
    }

    for (let i = 0; i < (new Date()).getDate(); i++) {
      this.monthInfo.xData.push(this.dateFormatter('YYYY-mm-dd', new Date(now.getFullYear(), now.getMonth(), i + 1)))
      // 随机10到110次
      this.monthInfo.seriesData.push(Math.floor((Math.random() * 100) + 10))
    }

    for (let i = 0; i < (new Date()).getMonth() + 1; i++) {
      this.yearInfo.xData.push(this.dateFormatter('YYYY-mm', new Date(now.getFullYear(), i)))
      // 随机100到1100次
      this.yearInfo.seriesData.push(Math.floor((Math.random() * 1000) + 100))
    }

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
              return value.split(' ')[1]
            } else if (that.selected === 'month') {
              return Number(value.split('-')[2])
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
        type: 'bar',
        name: '巡检次数',
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
      if (type === 'day') {
        this.options.xAxis.data = this.dayInfo.xData
        this.options.series[0].data = this.dayInfo.seriesData
      } else if (type === 'month') {
        this.options.xAxis.data = this.monthInfo.xData
        this.options.series[0].data = this.monthInfo.seriesData
      } else if (type === 'year') {
        this.options.xAxis.data = this.yearInfo.xData
        this.options.series[0].data = this.yearInfo.seriesData
      }
    }
  }
}
</script>

<style scoped>
  .box {
    height: 284px;
    width: 100%;
    margin-top: 20px;
    background: url("../../../assets/img/gas/3.png");
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
