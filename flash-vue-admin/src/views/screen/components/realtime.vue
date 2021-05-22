<template>
  <div>
    <v-chart :options="options" style="width: 100%;height: 330px;margin-top: -50px" />
  </div>
</template>
<script>
import 'echarts/lib/chart/line'

export default {
  name: 'RealTime',
  data() {
    return {
      options: undefined,
      data: []
    }
  },
  created() {
    this.options = {
      xAxis: {
        type: 'category',
        boundaryGap: false,
        axisLine: {
          lineStyle: {
            color: '#fff'
          }
        }
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, '30%'],
        axisLine: {
          lineStyle: {
            color: '#fff'
          }
        },
        max: 100
      },
      visualMap: {
        type: 'piecewise',
        show: false,
        dimension: 0,
        seriesIndex: 0,
        pieces: [{
          gt: 1,
          lt: 3,
          color: 'rgba(0, 0, 180, 0.4)'
        }, {
          gt: 5,
          lt: 7,
          color: 'rgba(0, 0, 180, 0.4)'
        }]
      },
      series: [
        {
          type: 'line',
          smooth: 0.6,
          symbol: 'none',
          lineStyle: {
            color: '#34fff8',
            width: 3
          },
          data: this.data
        }
      ]
    }

    // 一小时之前的时间
    let date = new Date((new Date()).getTime() - 1000 * 60 * 60)

    for (let i = 0; i < 60; i++) {
      this.data.push([this.dateFormat('HH:MM:SS', date), Math.floor(Math.random() * 100)])
      date = new Date(date.getTime() + 1000 * 60)
    }

    // 模拟产生数据
    const that = this
    setInterval(function() {
      const last = that.data[that.data.length - 1][0]
      const array = last.split(':')
      let date = new Date(2021, 1, 1, array[0], array[1], array[2])
      date = new Date(date.getTime() + 1000 * 3)
      const num = Math.floor(Math.random() * 100)
      that.data.push([that.dateFormat('HH:MM:SS', date), num])
    }, 1000 * 3)
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
  .selector {
    position: absolute;
    right: 50px;
    height: 30px;
    border-radius: 15px;
    color: white;
    border: 1px solid white;
    width: 91px;
    margin-top: 12px;
    background-color: rgba(52, 255, 248, 0.2);
    z-index: 3000;
  }

  .selector > div {
    line-height: 30px;
    height: 30px;
    display: inline;
    padding: 5px;
    width: 32px;
    cursor: pointer;
  }

  .selected {
    background-color: rgba(52, 255, 248, 0.7);
    border-radius: 15px;
    border: 1px solid white;
    width: 30px;
  }

</style>
