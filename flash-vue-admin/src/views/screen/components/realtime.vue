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
      data: [
        ['00:08:00', 18],
        ['00:08:01', 47],
        ['00:08:02', 74],
        ['00:08:03', 87],
        ['00:08:04', 76],
        ['00:08:05', 27],
        ['00:08:06', 60],
        ['00:08:07', 66],
        ['00:08:08', 26],
        ['00:08:09', 82],
        ['00:08:10', 17],
        ['00:08:11', 8],
        ['00:08:12', 87],
        ['00:08:13', 11],
        ['00:08:14', 80],
        ['00:08:15', 35],
        ['00:08:16', 34],
        ['00:08:17', 26],
        ['00:08:18', 4],
        ['00:08:19', 51],
        ['00:08:20', 11],
        ['00:08:21', 19],
        ['00:08:22', 1],
        ['00:08:23', 78],
        ['00:08:24', 36],
        ['00:08:25', 21],
        ['00:08:26', 76],
        ['00:08:27', 27],
        ['00:08:28', 39],
        ['00:08:29', 37],
        ['00:08:30', 30],
        ['00:08:31', 76],
        ['00:08:32', 90],
        ['00:08:33', 90],
        ['00:08:34', 59],
        ['00:08:35', 18],
        ['00:08:36', 63],
        ['00:08:37', 80],
        ['00:08:38', 14],
        ['00:08:39', 18],
        ['00:08:40', 26],
        ['00:08:41', 64],
        ['00:08:42', 94],
        ['00:08:43', 25],
        ['00:08:44', 56],
        ['00:08:45', 77],
        ['00:08:46', 8],
        ['00:08:47', 36],
        ['00:08:48', 63],
        ['00:08:49', 21],
        ['00:08:50', 100],
        ['00:08:51', 9],
        ['00:08:52', 42],
        ['00:08:53', 56],
        ['00:08:54', 71],
        ['00:08:55', 13],
        ['00:08:56', 40],
        ['00:08:57', 60],
        ['00:08:58', 97],
        ['00:08:59', 17],
        ['00:09:00', 41],
        ['00:09:01', 29],
        ['00:09:02', 45],
        ['00:09:03', 52],
        ['00:09:04', 2],
        ['00:09:05', 54],
        ['00:09:06', 94],
        ['00:09:07', 36],
        ['00:09:08', 91],
        ['00:09:09', 12],
        ['00:09:10', 69],
        ['00:09:11', 80],
        ['00:09:12', 14],
        ['00:09:13', 16],
        ['00:09:14', 69],
        ['00:09:15', 48],
        ['00:09:16', 83],
        ['00:09:17', 47],
        ['00:09:18', 5],
        ['00:09:19', 1],
        ['00:09:20', 94],
        ['00:09:21', 75],
        ['00:09:22', 8],
        ['00:09:23', 24],
        ['00:09:24', 69],
        ['00:09:25', 100],
        ['00:09:26', 37],
        ['00:09:27', 35],
        ['00:09:28', 2],
        ['00:09:29', 92],
        ['00:09:30', 63],
        ['00:09:31', 32],
        ['00:09:32', 94],
        ['00:09:33', 44],
        ['00:09:34', 49],
        ['00:09:35', 16],
        ['00:09:36', 13],
        ['00:09:37', 50],
        ['00:09:38', 52],
        ['00:09:39', 57],
        ['00:09:40', 90],
        ['00:09:41', 34],
        ['00:09:42', 26],
        ['00:09:43', 11],
        ['00:09:44', 49],
        ['00:09:45', 85],
        ['00:09:46', 38],
        ['00:09:47', 66],
        ['00:09:48', 80],
        ['00:09:49', 37],
        ['00:09:50', 8],
        ['00:09:51', 53],
        ['00:09:52', 36],
        ['00:09:53', 13],
        ['00:09:54', 56],
        ['00:09:55', 23],
        ['00:09:56', 41],
        ['00:09:57', 90],
        ['00:09:58', 95],
        ['00:09:59', 69]
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

    // 模拟产生数据
    const that = this
    setInterval(function() {
      const last = that.data[that.data.length - 1][0]
      const array = last.split(':')
      let date = new Date(2021, 1, 1, array[0], array[1], array[2])
      date = new Date(date.getTime() + 1000)
      const num = Math.floor(Math.random() * 100)
      that.data.push([that.dateFormat('HH:MM:SS', date), num])
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
