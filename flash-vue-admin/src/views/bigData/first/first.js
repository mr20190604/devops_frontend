import charts from  '@/utils/localEcharts'
import data from '@/views/bigData/first/first.json'
import request from '@/utils/request'
export default {
  name:'first',
  components: {
    chart: charts
  },
  data(){
    return{
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
          {value:1, label:'甲烷浓度（CH4）',unit:'VOL%'}
          // {value:2, label:'空气温度',unit:'℃'},
          // {value:3, label:'空气湿度',unit:'%'}
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
          // formatter: '{a} <br/>{b} : {c} ({d}%)'
          formatter: '{b} : {c} ({d}%)'
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          right: 10,
          top: 20,
          bottom: 20,
          // left: 'right',
          data: [1, 2, 3, 4, 5]
        },
        series: [
          {
            /*name: 'from',*/
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [
              /*{ value: 335, name: 1 },
              { value: 310, name: 2 },
              { value: 1548, name: 5 },
              { value: 234, name: 3 },
              { value: 135, name: 4 },*/
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
    this.pieData.legend.data = [];
    this.pieData.series[0].data = [];
    this.handleClick();
  },
  methods: {
    handleClick() {
      this.date = '';
      this.selectEquipment();
    },
    selectEquipment() {
      let self = this;
      /*self.pieData.legend.data = self.currentData.title[value];
      self.pieData.series[0].data = self.currentData.val[value];
      self.$refs.firstChart.clear();
      self.$refs.firstChart.mergeOptions(self.pieData) ;*/
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
        chartType:'pie'
      };
      request({
        url: '/device/data/tmp/getCharts',
        method: 'get',
        params
      }).then(response=>{
        let self = this;
        /**设置title*/
        self.pieData.legend.data = [];
        switch (self.value) {
          case 1:
            self.deviceMonitorTypes.jw.forEach(item=>{
              self.pieData.legend.data.push(item.label)
            });
            break;
          case 2:
            self.deviceMonitorTypes.gl.forEach(item =>{
              self.pieData.legend.data.push(item.label);
            });
            break;
          case 3:
            self.deviceMonitorTypes.fly.forEach(item=>{
              self.pieData.legend.data.push(item.label);
            });
            break;
          default:
            self.deviceMonitorTypes.jw.forEach(item=>{
              self.pieData.legend.data.push(item.label)
            });
            self.deviceMonitorTypes.gl.forEach(item =>{
              self.pieData.legend.data.push(item.label);
            });
            self.deviceMonitorTypes.fly.forEach(item=>{
              self.pieData.legend.data.push(item.label);
            });
        }
        if(response.success) {
          response.data.splice(response.data.findIndex(item => item.name === '空气温度' || item.name === '空气湿度'), 1);
          self.pieData.series[0].data = response.data;
          self.$refs.firstChart.clear();
          self.$refs.firstChart.mergeOptions(self.pieData) ;
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
  },
  watch:{
    date:{
      handler(newVal, oldVal){
        if(newVal) {
          this.tabPosition = '';
        } else {
          this.tabPosition = 'currentToday';
        }
      },
      immediate: true  /**这里是让第一次绑定也可以监听*/
      /*,
      deep: true*/ /**深度监听，true表示对象内部的对象发生改变也会执行函数*/
    }
  }
}
