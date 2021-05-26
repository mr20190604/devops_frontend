import charts from  '@/utils/localEcharts'
import data from '@/views/bigData/first/first.json'
export default {
  name:'first',
  components: {
    chart: charts.ECharts
  },
  data(){
    return{
      currentData:[],
      date:'',
      value:'',
      tabPosition:'currentToday',
      deviceTypes:[
        {value: "jw", label:'甲烷探测仪'},
        {value: "gl", label:'开放光路分析仪'},
        {value: "yc", label:'傅里叶红外遥测仪'},
      ],
      pieData: {
        title: {
          text: '污染因子比例而分析报表',
          // subtext: '纯属虚构',
          x: 'center'
        },
        toolbox:{
          right:500,
          show: true,
          feature: {
            saveAsImage :{ show: true}
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          right: 10,
          top: 20,
          bottom: 20,
          // left: 'right',
          data: ['1', 2, 3, 4, 5]
        },
        series: [
          {
            name: 'from',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [
              { value: 335, name: 1 },
              { value: 310, name: 2 },
              { value: 234, name: 3 },
              { value: 135, name: 4 },
              { value: 1548, name: 5 }
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
    }
  },
  mounted(){
    this.handleClick("currentToday");
  },
  methods: {
    handleClick(tab) {
      let json = data;
      this.currentData = json[tab];
      this.value= "";
      this.selectEquipment("all");
    },
    selectEquipment(value) {
      this.pieData.legend.data = this.currentData.title[value];
      this.pieData.series[0].data = this.currentData.val[value];
      self.$refs.firstChart.clear();
      self.$refs.firstChart.mergeOptions(self.pieData) ;
    }
  }
}
