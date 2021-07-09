import charts from  '@/utils/localEcharts'
import data from '@/views/bigData/second/second.json'
import request from '@/utils/request'
export default {
  name:'second',
  components:{
    chart: charts
  },
  data(){
    return {
      currentData:[],
      date:'',
      value:'',
      tabPosition:'currentToday',
      deviceTypes:[
        {value: 1, label: '甲烷探测仪'},
        {value: 2, label: '在线气相色谱质谱联用仪'},
        {value: 3, label: '开放光路多组分气体分析仪'},
      ],
      deviceMonitorTypes:{
        jw:[
          {value:1, label:'甲烷浓度（CH4）',unit:'VOL%'}/*,
          {value:2, label:'空气温度',unit:'℃'},
          {value:3, label:'空气湿度',unit:'%'}*/
        ],
        gl:[
          {value:1,label:'甲醇（CH3OH）',unit:'ug/m³'},
          {value:2,label:'甲醛（HCHO）',unit:'ug/m³'},
          {value:3,label:'苯（C6H6）',unit:'ug/m³'},
          {value:4,label:'丙烯（C3H6）',unit:'ug/m³'},
          {value:5,label:'甲腈（HCN）',unit:'ug/m³'},
          {value:6,label:'二甲苯（C8H10）',unit:'ug/m³'},
          {value:7,label:'苯乙烯（C8H8）',unit:'ug/m³'}
        ],
        fly:[
          {value:1, label:'一氧化碳（CO）',unit:'ug/m³'},
          {value:2, label:'氨气（NH3）',unit:'ug/m³'},
          {value:3, label:'丙烯（C3H6）',unit:'ug/m³'},
          {value:4, label:'丙烷（C3H8）',unit:'ug/m³'},
          {value:5, label:'氯甲烷（CH3Cl）',unit:'ug/m³'}
        ]
      },
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
          data: [/*'甲烷探测仪', '开放光路分析仪','傅里叶红外遥测仪'*/]
        },
        toolbox:{
          right:500,
          show: true,
          feature: {
            saveAsImage :{ show: true}
          }
        },
        xAxis: {
          type: 'category',
          data: [/*'00:00','01:00','02:00','03:00','04:00','05:00','06:00'*/]
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name:'甲烷探测仪',
            data: [/*120, 200, 150, 80, 70, 110, 130*/],
            type: 'bar',
            emphasis: {
              focus: 'series'
            }
          },
          {
            name:'开放光路分析仪',
            data: [/*2, 3, 56, 23, 70, 43, 22*/],
            type: 'bar',
            emphasis: {
              focus: 'series'
            }
          },
          {
            name:'傅里叶红外遥测仪',
            data: [/*2, 3, 56, 23, 70, 43, 22*/],
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
    this.handleClick();
  },
  methods:{
    handleClick() {
      this.selectEquipment();
    },
    selectEquipment() {
      this.getAllByParam();
    },
    getAllByParam() {
      let self = this;
      /*self.barData.legend.data = self.currentData.title[value];
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
      self.$refs.secondChart.clear();
      self.$refs.secondChart.mergeOptions(self.barData) ;*/
      self.search();
    },
    search() {
      let params;
      params = {
        tab:this.tabPosition,
        startDate:this.date ? this.date[0] : '',
        endDate:this.date ? this.date[1]:'',
        deviceType:this.value,
        monitorType:'',
        chartType:'bar'
      };
      request({
        url: '/device/data/tmp/getCharts',
        method: 'get',
        params
      }).then(response=>{
        let self = this;
        /**设置title*/
        self.barData.legend.data = [];
        /*switch (self.value) {
          case 1:
            self.deviceMonitorTypes.jw.forEach(item=>{
              self.barData.legend.data.push(item.label)
            });
            break;
          case 2:
            self.deviceMonitorTypes.gl.forEach(item =>{
              self.barData.legend.data.push(item.label);
            });
            break;
          case 3:
            self.deviceMonitorTypes.fly.forEach(item=>{
              self.barData.legend.data.push(item.label);
            });
            break;
          default:
            self.deviceMonitorTypes.jw.forEach(item=>{
              self.barData.legend.data.push(item.label)
            });
            self.deviceMonitorTypes.gl.forEach(item =>{
              self.barData.legend.data.push(item.label);
            });
            self.deviceMonitorTypes.fly.forEach(item=>{
              self.barData.legend.data.push(item.label);
            });
        }*/
        if(response.success) {
          response.data.seriesData.splice(response.data.titles.findIndex(item => item ==='空气温度' || item ==='空气湿度'),1);
          response.data.titles.splice(response.data.titles.findIndex(item => item ==='空气温度' || item ==='空气湿度'),1);
          if(response.data.titles) {
            response.data.titles.forEach(item=>{
              self.barData.legend.data.push(item);
            });
          }
          self.barData.xAxis.data = response.data.xdata;

          self.barData.series = [];
          for(let i = 0; i < self.barData.legend.data.length; i++) {
            self.barData.series.push(
              {
                name: self.barData.legend.data[i],
                data: response.data.seriesData[i],
                type: 'bar',
                emphasis: {
                  focus: 'series'
                }
              }
            );
          }
          self.$refs.secondChart.clear();
          self.$refs.secondChart.mergeOptions(self.barData) ;
        }
      }).catch(error=>{
        console.log(error);
      });

    },
    reset() {
      var self = this;
      self.date = '';
      self.value = '';
      self.tabPosition = 'currentToday';
      self.search();
    }
  }
}
