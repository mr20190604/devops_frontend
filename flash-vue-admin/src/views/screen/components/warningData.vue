<template>
  <v-chart :options="options" style="width: 100%;height: 250px;" />
</template>

<script>
import 'echarts/lib/chart/line'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/tooltip'

export default {
  name: 'WarningData',
  data() {
    return {
      options: undefined
    }
  },
  created() {
    this.options = {
      tooltip: {
        trigger: 'axis'
      },
      color: ['#e04e52', '#f19c4d', '#52bbfa'],
      legend: {
        data: ['一级预警', '二级预警', '三级预警'],
        top: 20,
        textStyle: {
          color: '#fff'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月'],
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
        }
      },
      yAxis: {
        name: '单位(条)',
        type: 'value',
        nameTextStyle: {
          color: '#fff'
        },
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
        }
      },
      series: [
        {
          name: '一级预警',
          type: 'line',
          smooth: true,
          data: [18, 17, 11, 32, 25, 32, 10]
        },
        {
          name: '二级预警',
          type: 'line',
          smooth: true,
          data: [30, 10, 20, 16, 40, 22, 35]
        },
        {
          name: '三级预警',
          type: 'line',
          smooth: true,
          data: [16, 20, 15, 30, 20, 30, 7]
        }
      ]
    }
  }
}
</script>

<style scoped lang="scss">

</style>
