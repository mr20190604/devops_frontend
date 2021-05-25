import charts from  '@/views/bigData/bigDataEcharts'
import data from '@/views/bigData/third/third.json'

export default {
  name:'third',
  components:{
    chart: charts.ECharts
  },
  data(){
    return {
      currentData:[],
      date:'',
      featuresFactorVal:'',
      equipmentTypeVal:'',
      tabPosition:'currentToday',
      destroySelf: true,
      featuresFactor:[
        {value:"ch4", label:"甲烷"},
        {value:"VOCS", label:"VOCS"},
        {value:"C7H8", label:"C7H8c"},
        {value:"CH3OH", label:"CH3OH"}
      ],
      deviceTypes:[
        {value: "jw", label:'甲烷探测仪'},
        {value: "gl", label:'开放光路分析仪'},
        {value: "yc", label:'傅里叶红外遥测仪'},
      ],
      lineData: {
        title: {
          text: ''
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          type: 'scroll',
          data: ['甲烷探测仪', '开放光路分析仪','傅里叶红外遥测仪']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          right:500,
          show: true,
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['00:00','01:00','02:00','03:00','04:00','05:00','06:00']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '甲烷探测仪',
            type: 'line',
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: '开放光路分析仪',
            type: 'line',
            data: [220, 182, 191, 234, 290, 330, 310]
          },
          {
            name: '傅里叶红外遥测仪',
            type: 'line',
            data: [150, 232, 201, 154, 190, 330, 410]
          }

        ]
      },
    }
  },
  created(){},
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
      // let  myChart = charts.ECharts.init(this.$refs.lineData);
      let self = this;
      self.lineData.legend.data = self.currentData.title[value];
      let tmp = self.currentData.val[value];
      self.lineData.xAxis.data = tmp.xdata;
      self.lineData.series = [];
      for(let i = 0; i < self.lineData.legend.data.length; i++) {
        self.lineData.series.push(
          {
            name: self.lineData.legend.data[i],
            data: self.currentData.val[value].seriesData[i],
            type: 'line'
          }
        );
      }

      self.$refs.thirdChart.clear();
      self.$refs.thirdChart.mergeOptions(self.lineData) ;

    }
  }
}
