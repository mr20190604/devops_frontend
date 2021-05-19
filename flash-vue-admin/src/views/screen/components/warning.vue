<template>
  <v-chart :options="options" style="width: 100%;height: 250px;" />
</template>

<script>
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'

export default {
  name: 'Warning',
  data() {
    return {
      options: undefined
    }
  },
  created() {
    this.options = {
      tooltip: {
        trigger: 'item',
        formatter: '{b}<br/>{c} ({d}%)'
      },
      toolbox: {
        show: true,
        feature: {
          mark: { show: true },
          dataView: { show: true, readOnly: false },
          restore: { show: true },
          saveAsImage: { show: true }
        }
      },
      series: [
        {
          name: '面积模式',
          type: 'pie',
          radius: [50, 80],
          center: ['50%', '50%'],
          roseType: 'area',
          itemStyle: {
            borderRadius: 8
          },
          data: [
            { value: 40, name: '一氧化碳' },
            { value: 38, name: '二氧化硫' },
            { value: 32, name: '一氧化氮' },
            { value: 30, name: '二氧化氮' },
            { value: 28, name: '一氧化二氮' },
            { value: 26, name: '氨气' },
            { value: 22, name: '二氧化碳' },
            { value: 18, name: '其他' }
          ]
        }
      ]
    }
  }
}
</script>

<style scoped>

</style>
