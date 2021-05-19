<template>
  <div>
    <div class="selector">
      <div :class="{'selected':isDay}" @click="handleClick(1)">日</div>
      <div :class="{'selected':isWeek}" @click="handleClick(2)">周</div>
      <div :class=" {'selected':isMonth}" @click="handleClick(3)">月</div>
    </div>
    <v-chart :options="options" style="width: 100%;height: 280px;" />
  </div>
</template>
<script>
import 'echarts/lib/chart/line'

export default {
  name: 'Discharge',
  data() {
    return {
      options: undefined,
      isDay: false,
      isWeek: true,
      isMonth: false,
      monthData: [
        ['2019-10-1', 56],
        ['2019-10-2', 75],
        ['2019-10-3', 58],
        ['2019-10-4', 25],
        ['2019-10-5', 30],
        ['2019-10-6', 45],
        ['2019-10-7', 30],
        ['2019-10-8', 10],
        ['2019-10-9', 30],
        ['2019-10-10', 20],
        ['2019-10-11', 56],
        ['2019-10-12', 75],
        ['2019-10-13', 58],
        ['2019-10-14', 25],
        ['2019-10-15', 30],
        ['2019-10-16', 45],
        ['2019-10-17', 30],
        ['2019-10-18', 10],
        ['2019-10-19', 30],
        ['2019-10-20', 20],
        ['2019-10-21', 56],
        ['2019-10-22', 75],
        ['2019-10-23', 58],
        ['2019-10-24', 25],
        ['2019-10-25', 30],
        ['2019-10-26', 45],
        ['2019-10-27', 30],
        ['2019-10-28', 10],
        ['2019-10-29', 30],
        ['2019-10-30', 40],
        ['2019-10-30', 25]
      ],
      weekData: [
        ['周日', 38],
        ['周一', 30],
        ['周二', 60],
        ['周三', 50],
        ['周四', 38],
        ['周五', 80],
        ['周六', 50]
      ],
      dayData: [
        ['00:00:00', 38],
        ['01:00:00', 30],
        ['02:00:00', 60],
        ['03:00:00', 50],
        ['04:00:00', 38],
        ['05:00:00', 80],
        ['06:00:00', 50],
        ['07:00:00', 38],
        ['08:00:00', 30],
        ['09:00:00', 60],
        ['10:00:00', 50],
        ['11:00:00', 38],
        ['12:00:00', 80],
        ['13:00:00', 50],
        ['14:00:00', 60],
        ['15:00:00', 50],
        ['16:00:00', 38],
        ['17:00:00', 80],
        ['18:00:00', 50],
        ['19:00:00', 38],
        ['20:00:00', 30],
        ['21:00:00', 60],
        ['22:00:00', 50],
        ['23:00:00', 38]
      ]
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
        }
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
          data: this.weekData
        }
      ]
    }
  },
  methods: {
    handleClick: function(id) {
      this.isDay = this.isWeek = this.isMonth = false
      if (id === 1) {
        this.isDay = true
        this.options.series[0].data = this.dayData
      } else if (id === 2) {
        this.isWeek = true
        this.options.series[0].data = this.weekData
      } else if (id === 3) {
        this.isMonth = true
        this.options.series[0].data = this.monthData
      }
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
