import charts from  '@/views/bigData/bigDataEcharts'
import data from '@/views/bigData/second/second.json'

export default {
  name:'second',
  components:{
    chart: charts.ECharts
  },
  data(){
    return {
      currentData:[],
      date:'',
      value:'',
      tabPosition:'currentToday',
      deviceTypes:[
        {value: "jw", label:'甲烷探测仪'},
        {value: "gl", label:'开放光路分析仪'},
        {value: "yc", label:'傅里叶红外遥测仪'},
      ],
      barData: {
        title: {
          text: '监测点数据趋势图',
          // subtext: '纯属虚构',
          x: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          right: 10,
          top: 20,
          bottom: 20,
          data: ['甲烷探测仪', '开放光路分析仪','傅里叶红外遥测仪']
        },
        toolbox:{
          right:700,
          show: true,
          feature: {
            saveAsImage :{ show: true}
          }
        },
        xAxis: {
          type: 'category',
          data: ['00:00','01:00','02:00','03:00','04:00','05:00','06:00']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name:'甲烷探测仪',
            data: [120, 200, 150, 80, 70, 110, 130],
            type: 'bar',
            emphasis: {
              focus: 'series'
            }
          },
          {
            name:'开放光路分析仪',
            data: [2, 3, 56, 23, 70, 43, 22],
            type: 'bar',
            emphasis: {
              focus: 'series'
            }
          },
          {
            name:'傅里叶红外遥测仪',
            data: [2, 3, 56, 23, 70, 43, 22],
            type: 'bar',
            emphasis: {
              focus: 'series'
            }
          }
        ]
      },
    }
  },
  created(){

  },
  mounted(){
    this.handleClick("currentToday");
  },
  methods:{
    handleClick(tab) {
      let json = data;
      this.currentData = json[tab];
      this.value= "";
      this.selectEquipment("all");
    },
    selectEquipment(value) {
      this.getAllByParam(value);
    },
    getAllByParam(value) {
      let self = this;
      self.barData.legend.data = self.currentData.title[value];
      let tmp = self.currentData.val[value];
      self.barData.xAxis.data = tmp.xdata;
      self.barData.series = [];
      for(let i = 0; i < self.barData.legend.data.length; i++) {
        self.barData.series.push(
          {
            name: self.barData.legend.data[i],
            data: this.currentData.val[value].seriesData[i],
            type: 'bar',
            emphasis: {
              focus: 'series'
            }
          }
        );
      }
    }
  }
}
