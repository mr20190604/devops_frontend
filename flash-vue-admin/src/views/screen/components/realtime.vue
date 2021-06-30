<template>
  <div>
    <v-chart :options="options" style="width: 100%;height: 330px;margin-top: -50px" />
  </div>
</template>
<script>
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'

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
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        axisLine: {
          lineStyle: {
            color: '#244f5f'
          }
        },
        axisLabel: {
          textStyle: {
            color: function() {
              return '#fff'
            }
          },
          formatter: function(value) {
            return value.split(' ')[1]
          }
        }
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, '30%'],
        axisLine: {
          lineStyle: {
            color: '#244f5f'
          }
        },
        axisLabel: {
          textStyle: {
            color: function() {
              return '#fff'
            }
          }
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: ['#244f5f'],
            width: 1,
            type: 'solid'
          }
        },
        max: 100
      },
      series: [
        {
          type: 'line',
          smooth: 0.6,
          symbol: 'none',
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: 'rgba(95,206,210,0.4)'
              }, {
                offset: 1, color: 'rgba(95,206,210,0)'
              }]
            }
          },
          lineStyle: {
            color: 'rgba(95,206,210,1)',
            width: 2
          },
          data: this.data
        }
      ]
    }

    // 一小时之前的数据
    let date = new Date((new Date()).getTime() - 1000 * 60 * 60)
    for (let i = 0; i < 60; i++) {
      this.data.push([this.dateFormatter('YYYY-mm-dd HH:MM:SS', date), Math.floor(Math.random() * 100)])
      date = new Date(date.getTime() + 1000 * 60)
    }

    // 模拟产生数据
    const that = this
    setInterval(function() {
      const num = Math.floor(Math.random() * 100)
      that.data.shift()
      that.data.push([that.dateFormatter('YYYY-mm-dd HH:MM:SS', new Date()), num])
    }, 1000 * 3)
  },
  methods: {

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
