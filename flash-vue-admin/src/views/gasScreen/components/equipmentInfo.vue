<template>
  <div class="box">
    <div class="titleBox">
      <p class="circle" />
      <p class="title">设备情况</p>
      <p class="subTitle">EQUIPMENT</p>
    </div>
    <v-chart :options="options" style="width: 100%;height: 220px;margin-left: 32px;" />
    <div class="chartExtension">
      <p>{{ proportion.toFixed(2) }}%</p>
      <p>安装率</p>
    </div>
    <el-row v-for="(item,index) in areaInfo" :key="index">
      <el-col :span="3" :offset="2" class="proportionTitle">{{ item.name }}</el-col>
      <el-col :span="16">
        <el-progress :percentage="item.proportion" :stroke-width="20" :text-inside="true" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/tooltip'

export default {
  name: 'EquipmentInfo',
  data: function() {
    return {
      options: {},
      proportion: 0,
      installInfo: [
        { value: 789, name: '已安装' },
        { value: 389, name: '未安装' },
        { value: 788, name: '已检修' },
        { value: 123, name: '已报修' },
        { value: 234, name: '已调试' }
      ],
      areaInfo: [{
        name: '区域A',
        proportion: 20
      },
      {
        name: '区域B',
        proportion: 45
      },
      {
        name: '区域C',
        proportion: 33
      },
      {
        name: '区域D',
        proportion: 62
      },
      {
        name: '区域E',
        proportion: 75
      },
      {
        name: '区域F',
        proportion: 86
      }]
    }
  },
  created() {
    this.setOptions()
  },
  methods: {
    setOptions: function() {
      const that = this
      const installed = this.installInfo.find(item => item.name === '已安装').value
      const uninstalled = this.installInfo.find(item => item.name === '未安装').value
      this.proportion = installed / (installed + uninstalled) * 100
      this.options = {
        tooltip: {
          trigger: 'item',
          textStyle: {
            fontSize: 12
          }
        },
        legend: {
          top: 'center',
          left: 'left',
          orient: 'vertical',
          textStyle: {
            color: 'white'
          },
          formatter: function(name) {
            const current = that.installInfo.find(item => item.name === name)
            return name + ' ' + current.value + ' 台'
          }
        },
        series: [
          {
            name: '设备分类',
            type: 'pie',
            radius: ['60%', '70%'],
            left: 80,
            avoidLabelOverlap: false,
            color: ['#69C0FE', '#666666', '#3FB6A4', '#F9BC31', '#8560A8'],
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false
            },
            emphasis: {
              label: {
                show: false
              }
            },
            labelLine: {
              show: false
            },
            data: this.installInfo
          }
        ]
      }
    }
  }
}
</script>

<style scoped>
  .box {
    height: 510px;
    width: 100%;
    background: url("../../../assets/img/gas/2.png");
    margin-top: 21px;
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

  .chartExtension{
    overflow: hidden;
    position: absolute;
    top:120px;
    left: 220px;
  }

  .chartExtension>p:first-child{
    font-size: 32px;
    font-family: SourceHanSansCN;
    font-weight: 400;
    color: #36E5FF;
    text-align: center;
  }

  .chartExtension>p:last-child{
    font-size: 18px;
    font-family: SourceHanSansCN;
    font-weight: 400;
    color: #DDDADA;
    text-align: center;
    line-height: 40px;
  }

  .proportionTitle{
    font-size: 14px;
    color: #00DAFF;
  }

  .el-row{
    padding: 8px 0;
  }

</style>
