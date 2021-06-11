import charts from  '@/utils/localEcharts'
import data from '@/views/bigData/third/third.json'
import request from '@/utils/request'
export default {
  name:'third',
  components:{
    chart: charts
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
        {value: 1, label: '甲烷探测仪'},
        {value: 2, label: '在线气相色谱质谱联用仪'},
        {value: 3, label: '开放光路多组分气体分析仪'},
      ],
      deviceMonitorTypes:{
        jw:[
          {value:1, label:'甲烷浓度（CH4）',unit:'VOL%'},
          {value:2, label:'空气温度',unit:'℃'},
          {value:3, label:'空气湿度',unit:'%'}
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
      lineData: {
        title: {
          text: '环境大数据分析',
          x: 'center'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          right: 10,
          top: 20,
          bottom: 20,
          data: [/*'甲烷探测仪', '开放光路分析仪','傅里叶红外遥测仪'*/]
        },
        grid: {
          left: '3%',
          right: '10%',
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
          data: [/*'00:00','01:00','02:00','03:00','04:00','05:00','06:00'*/]
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '甲烷探测仪',
            type: 'line',
            data: [/*120, 132, 101, 134, 90, 230, 210*/]
          },
          {
            name: '开放光路分析仪',
            type: 'line',
            data: [/*220, 182, 191, 234, 290, 330, 310*/]
          },
          {
            name: '傅里叶红外遥测仪',
            type: 'line',
            data: [/*150, 232, 201, 154, 190, 330, 410*/]
          }

        ]
      },
    }
  },
  created(){},
  mounted(){
    this.handleClick();
  },
  methods:{
    handleClick() {
      /*let json = data;
      this.currentData = json[tab];
      this.value= "";*/
      this.selectEquipment();
    },
    selectEquipment(value) {
      this.featuresFactorVal = '';
      switch (value) {
        case 1:
          this.featuresFactor = this.deviceMonitorTypes.jw;
          break;
        case 2:
          this.featuresFactor = this.deviceMonitorTypes.gl;
          break;
        case 3:
          this.featuresFactor = this.deviceMonitorTypes.fly;
          break;
        default:
          this.featuresFactor=[];
      }
      this.getAllByParam();
    },
    selectMonitor() {
      this.search();
    },
    getAllByParam() {
      let self = this;
      /*
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
*/
      self.search();
    },
    search() {
      let params;
      params = {
        tab:this.tabPosition,
        startDate:this.date ? this.date[0] : '',
        endDate:this.date ? this.date[1]:'',
        deviceType:this.equipmentTypeVal,
        monitorType:this.featuresFactorVal,
        chartType:'line'
      };
      request({
        url: '/device/data/tmp/getCharts',
        method: 'get',
        params
      }).then(response=>{
        let self = this;
        /**设置title*/
        self.lineData.legend.data = [];
        if(response.success) {
          if(response.data.titles) {
            response.data.titles.forEach(item=>{
              self.lineData.legend.data.push(item);
            });
          }
          self.lineData.xAxis.data = response.data.xdata;

          self.lineData.series = [];
          for(let i = 0; i < self.lineData.legend.data.length; i++) {
            self.lineData.series.push(
              {
                name: self.lineData.legend.data[i],
                data: response.data.seriesData[i],
                type: 'line'
              }
            );
          }
          self.$refs.thirdChart.clear();
          self.$refs.thirdChart.mergeOptions(self.lineData) ;
        }
      }).catch(error=>{
        console.log(error);
      });

    },
    reset() {
      var self = this;
      self.date = '';
      self.equipmentTypeVal = '';
      self.featuresFactorVal = '';
      self.tabPosition = 'currentToday';
      self.search();
    }
  }
}
