<template>
  <div>
    <v-chart :options="options" style="height: 130px;width: 100%;" />
    <el-row>
      <el-col :span="8">
        <p class="type">PM2.5</p>
        <el-progress :percentage="50" :stroke-width="12" :show-text="false" color="#5fced2" />
        <p class="percentage">26 ug/m<sup>3</sup></p>
      </el-col>
      <el-col :span="8">
        <p class="type">PM10</p>
        <el-progress :percentage="60" :stroke-width="12" :show-text="false" color="#5fced2" />
        <p class="percentage">30 ug/m<sup>3</sup></p>
      </el-col>
      <el-col :span="8">
        <p class="type">SO<sub>2</sub></p>
        <el-progress :percentage="80" :stroke-width="12" :show-text="false" color="#5fced2" />
        <p class="percentage">12 ug/m<sup>3</sup></p>
      </el-col>
      <el-col :span="8">
        <p class="type">CH<sub>4</sub></p>
        <el-progress :percentage="50" :stroke-width="12" :show-text="false" color="#5fced2" />
        <p class="percentage">26 ug/m<sup>3</sup></p>
      </el-col>
      <el-col :span="8">
        <p class="type">O<sub>2</sub></p>
        <el-progress :percentage="50" :stroke-width="12" :show-text="false" color="#5fced2" />
        <p class="percentage">26 ug/m<sup>3</sup></p>
      </el-col>
      <el-col :span="8">
        <p class="type">CO</p>
        <el-progress :percentage="50" :stroke-width="12" :show-text="false" color="#5fced2" />
        <p class="percentage">26 ug/m<sup>3</sup></p>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/pictorialBar'
export default {
  name: 'AirQuality',
  data() {
    return {
      options: undefined,
      line: [41, 35, 100]
    }
  },
  created() {
    this.options = {
      xAxis: [{
        data: ['PM2.5', 'PM10', '其他'],
        axisLabel: {
          show: true,
          textStyle: {
            color: '#f19c4b',
            fontSize: 16
          },
          margin: 20
        },
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        }
      }],
      yAxis: [{
        show: false
      }],
      series: [
        {
          name: '底部',
          type: 'pictorialBar',
          symbolSize: [80, 22],
          symbolOffset: [0, 11],
          animation: false,
          itemStyle: {
            normal: {
              color: '#34fff8'
            }
          },
          data: this.line,
          label: {
            show: true,
            position: 'top',
            fontSize: 24,
            color: '#f1fefe',
            fontStyle: 'italic'
          }
        },
        {
          name: '柱体',
          type: 'bar',
          barWidth: 80,
          animation: false,
          itemStyle: {
            normal: {
              color: '#34fff8',
              opacity: 0.5
            }
          },
          data: this.line
        },
        {
          name: '顶部',
          type: 'pictorialBar',
          symbolSize: [80, 22],
          symbolOffset: [0, -11],
          animation: false,
          symbolPosition: 'end',
          itemStyle: {
            normal: {
              color: '#34fff8',
              opacity: 0.5
            }
          },
          data: this.line
        }
      ]
    }
  }
}
</script>

<style scoped lang="scss">

  p{
    margin: 0;
    padding: 0;
  }

  .el-col{
    padding: 0 20px;
  }

  .type {
    font-family: 'PingFangSC-Regular', serif;
    font-size: 14px;
    color: #fbf9f8;
    text-align: left;
    margin-bottom: 6px;
    font-weight: bold;
  }

  .percentage{
    font-family: 'PingFangSC-Regular', serif;
    font-size: 14px;
    color: #5fced2;
    margin-top: 6px;
  }
</style>
