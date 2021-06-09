import mmAlarmInfoApi from '@/api/mm/mmAlarmInfo'
import permission from '@/directive/permission/index.js'
import {getDicts} from "@/api/system/dict";
import { getApiUrl,getPreviewUrl } from '@/utils/utils'
import { getToken } from '@/utils/auth'
import {isCanPreview} from '@/utils/preview.js'
import genEvent from '@/views/mm/mmAlarmInfo/genEvent/genEvent.vue'
import process from '@/components/Process/process.vue'
import fileDelete from '@/api/mm/genEvent/genEvent'


import charts from  '@/utils/localEcharts'

export default {
  name:'fileDelete',
  directives: { permission },
  components:{
    genEvent,
    chart: charts,
    process
  },
  data() {

    return {
      genEventTitle:'生成事件',
      genEventVisible:false,
      formVisible: false,
      formTitle: '添加报警基本信息',
      isAdd: true,
      form: {
        alarmCode:'',
        districtCode:'',
        equipmentId:'',
        monitorType:'',
        alarmTime:'',
        alarmValue:'',
        alarmLevel:'',
        alarmFirstValue:'',
        alarmFirstTime:'',
        alarmMaxValue:'',
        alarmMaxTime:'',
        alarmMaxLevel:'',
        alarmRelieveTime:'',
        isAudit:'',
        auditOpinion:'',
        auditPerson:'',
        isFeedback:'',
        isRelieve:'',
        prejudgment:'',
        isGenEvent:'',
        auditTime:'',
        isDel:'',
        id: '',
        auditStatus:'',
        monitorTypeName:'',
        auditUser:'',
        relieveStatus:'',
        screenStatus:'',
        relieveTime:''
      },
      disposeForm:{
        alarmId:'',
        handleConent:'',
        handleStatus:'',
        fileId:''
      },
      check_list:
        [
          {
          value:0,
          label:'未审核'
          },
          {
           value:1,
           label:'已审核'
          }
        ],
      audit_list:[
        {
          value:0,
          label:'误报'
        },{
          value:1,
          label:'确认报警'
        }
      ],
      feedback_list:
        [
          {
            value:0,
            label:'未处置'
          },
          {
            value:1,
            label:'处置中'
          },
          {
            value:2,
            label:'已处置'
          }
        ],
      relieve_list:[
        {
        value:0,
          label:'未解除'
        },{
          value:1,
          label:'已解除'
        }
      ],
      //报警类型
      alarm_type:[],
      //报警级别
      alarm_level:[],
      listQuery: {
        page: 1,
        limit: 20,
        id: undefined,
        equipCode:undefined,
        alarmLevel:undefined,
        searchTime:undefined,
        startTime:undefined,
        endTime:undefined,
        monitorType:undefined,
        isAudit:undefined,
        isFeedBack:undefined,
        auditStatus:undefined,
        isRelieve:undefined
      },
      total: 0,
      list: null,
      listLoading: true,
      selRow: {},
      checkList:null,
      //报警处置模块
      disposeVisible:false,
      disposeTitle:'报警处置',
      disposeList:null,
      disposeLoading:true,
      //附件上传、预览模块
      previewFileUrl:'',
      fileType: 1,
      //上传路径
      uploadUrl:'',
      //下载路径
      downloadUrl:'',
      //后台token
      uploadHeaders: {
        'Authorization': ''
      },
      multiple:true,
      files:null,
      fileLoading:true,
      //附件集合
      fileList:[],
      previewTitle: '预览',
      previewVisible: false,
      previewStyle:{
        height:'600px',
        width: '100%'
      },
      //信息发送模块
      vShow:true,
      acceptTitle:'信息发送',
      acceptVisible:false,
      acceptPerson:[],
      acceptList:null,
      value:[],
      acceptForm:{
        id:'',
        noticeContent:'',
        noticeStatus:'',
        recipient:'',
        alarmId:''
      },
      //监测曲线模块
      echartVisiable:false,
      yData:[],
      xData:[],
      lineData:{
        // title: {
        //   // text: '设备监测曲线',
        //   left: '1%'
        // },
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '5%',
          right: '15%',
          bottom: '10%'
        },
        xAxis: {
          type: 'category',
          data:[].map(function (str) {
            return str.replace(' ','\n')
          }),

        },
        yAxis: {
          type: 'value',
          min:1,
          max:10
        },axisLabel: {
          interval: 0,
          formatter: function (value) {
            let ret = '';
            let maxLength = 10;
            let rowNum = Math.ceil(value.length / maxLength);
            if (rowNum > 1) {
              for (let i = 0; i < rowNum; i++) {
                let temp = "";
                let start = i * maxLength;
                let end = start + maxLength;
                temp = value.substring(start, end) + "\n";
                ret += temp;
              }
              return ret;
            } else {
              return value;
            }
          }

        },
        visualMap: {
          // top: 100,
          // right:1,
          x:'center',
          y:'top',
          orient:"horizontal",
          pieces: [{
            label:'正常',
            gt: 0,
            lte: 8,
            color: '#1939ce'
          }, {
            label:'三级报警',
            gt: 8,
            lte: 9,
            color: '#FBDB0F'
          }, {
            label:'二级报警',
            gt: 9,
            lte: 10,
            color: '#FC7D02'
          },{
            label:'一级报警',
            gt: 10,
            color: '#fc1f0d'
          }],
          outOfRange: {
            color: '#999'
          }
        },
        toolbox: {
          right: 10,
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            restore: {},
            saveAsImage: {}
          }
        },
        series: [{
          // data: [150, 230, 224, 218, 135, 147, 260],
          data:[],
          type: 'line',
          markLine: {
            silent: true,
            lineStyle: {
              color: '#333'
            },
            data: [{
              yAxis: 8
            }, {
              yAxis: 9
            }, {
              yAxis: 10
            }]
          }

        }]
      },
      selection:[],
      //流程
      processVisiable:false,
      //报警排查集合
      screenList:null,
      fileAccept:'.doc,.docx,.pdf,.zip,.rar',
      fileShow:true,
      alarmList:[],
      modelTime:[],
      pickerOptions:{
        disabledDate (time) {
          return time.getTime() > Date.now()//选当前时间之前的时间
        }
      },

    };


  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  computed: {

    //表单验证
    rules() {
      return {
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.fetchData()
      this.downloadUrl = getApiUrl() + '/file/download?idFile='
      this.uploadUrl = getApiUrl() + '/file'
      this.uploadHeaders['Authorization'] = getToken()
    },
    getRowKey(row) {
      return row.id;
    },
    fetchData() {

      this.listLoading = true
        mmAlarmInfoApi.getList(this.listQuery).then(response => {
        this.list = response.data.records
        this.listLoading = false
        this.total = response.data.total
      });
      getDicts("报警类型").then(response=>{
        this.alarm_type=response.data;
      });
      getDicts("报警等级").then(response=>{
        this.alarm_level=response.data;
      });
    },
    search() {
      console.log()
      if (this.listQuery.searchTime) {
        this.listQuery.startTime = this.listQuery.searchTime[0]
        this.listQuery.endTime = this.listQuery.searchTime[1]

      }
      this.fetchData()
    },
    reset() {
      for(let key in this.listQuery) {
        if (key != 'limit' && key != 'page') {
          this.listQuery[key] = ''
        }
      }
      this.fetchData()
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleClose() {

    },
    fetchNext() {
      this.listQuery.page = this.listQuery.page + 1
      this.fetchData()
    },
    fetchPrev() {
      this.listQuery.page = this.listQuery.page - 1
      this.fetchData()
    },
    fetchPage(page) {
      this.listQuery.page = page
      this.fetchData()
    },
    changeSize(limit) {
      this.listQuery.limit = limit
      this.fetchData()
    },
    handleCurrentChange(currentRow) {
      this.selRow = currentRow
    },
    resetForm() {
      this.form = {
        alarmCode:'',
        districtCode:'',
        equipmentId:'',
        monitorType:'',
        alarmTime:'',
        alarmValue:'',
        alarmLevel:'',
        alarmFirstValue:'',
        alarmFirstTime:'',
        alarmMaxValue:'',
        alarmMaxTime:'',
        alarmMaxLevel:'',
        alarmRelieveTime:'',
        isAudit:'',
        auditOpinion:'',
        auditPerson:'',
        isFeedback:'',
        isRelieve:'',
        prejudgment:'',
        isGenEvent:'',
        auditTime:'',
        isDel:'',
        id: ''
      }
    },
    add() {

      if (this.checkSel()) {
        if(this.selRow.isAudit == 1) {
          this.$message({
            message: this.$t('不允许重复审核'),
            type: 'warning'
          })

        } else {
          this.formTitle = '报警审核'
          this.formVisible = true
          this.isAdd = true
          this.form = this.selRow

          if(this.$refs['form'] !== undefined) {
            this.$refs['form'].resetFields()
          }
          //如果表单初始化有特殊处理需求,可以在resetForm中处理
        }
      }

          },
    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
            const formData = {
                id:this.form.id,
                alarmCode:this.form.alarmCode,
                districtCode:this.form.districtCode,
                equipmentId:this.form.equipmentId,
                monitorType:this.form.monitorType,
                alarmValue:this.form.alarmValue,
                alarmLevel:this.form.alarmLevel,
                alarmFirstValue:this.form.alarmFirstValue,
                alarmMaxValue:this.form.alarmMaxValue,
                alarmMaxLevel:this.form.alarmMaxLevel,
                auditStatus:this.form.auditStatus,
                isAudit:1,
                auditOpinion:this.form.auditOpinion,
                auditPerson:this.form.auditPerson,
                isFeedback:this.form.isFeedback,
                isRelieve:this.form.isRelieve,
                prejudgment:this.form.prejudgment,
                isGenEvent:this.form.isGenEvent,
                isDel:this.form.isDel,
                auditValue:this.form.alarmValue
            }
            if(formData.id){
                mmAlarmInfoApi.update(formData).then(response => {
                    this.$message({
                        message: this.$t('common.optionSuccess'),
                        type: 'success'
                    })
                    this.fetchData()
                    this.formVisible = false
                })
            }else{
                mmAlarmInfoApi.add(formData).then(response => {
                    this.$message({
                        message: this.$t('common.optionSuccess'),
                        type: 'success'
                    })
                    this.fetchData()
                    this.formVisible = false
                })
            }
        } else {
          return false
        }
      })
    },cancle() {
      this.reset()
      this.fetchData()
      this.formVisible = false
    },
    checkSel() {
      if (this.selRow && this.selRow.id) {
        return true
      }
      this.$message({
        message: this.$t('common.mustSelectOne'),
        type: 'warning'
      })
      return false
    },
    editItem(record){
      this.selRow = record
      this.edit()
    },
    edit() {
      if (this.checkSel()) {
        this.isAdd = false
        this.form = this.selRow
        this.formTitle = '编辑报警基本信息'
        this.formVisible = true

        if(this.$refs['form'] !== undefined) {
          this.$refs['form'].resetFields()
        }
        //如果表单初始化有特殊处理需求,可以在resetForm中处理
              }
    },
    removeItem(record){
      this.selRow = record
      this.remove()
    },
    remove() {
      if (this.checkSel()) {
        var id = this.selRow.id
        this.$confirm(this.$t('common.deleteConfirm'), this.$t('common.tooltip'), {
          confirmButtonText: this.$t('button.submit'),
          cancelButtonText: this.$t('button.cancel'),
          type: 'warning'
        }).then(() => {
            mmAlarmInfoApi.remove(id).then(response => {
            this.$message({
              message: this.$t('common.optionSuccess'),
              type: 'success'
            })
            this.fetchData()
          }).catch( err=> {
            this.$notify.error({
              title: '错误',
              message: err
            })
          })
        }).catch(() => {
        })
      }
    },resetDisposeForm(){
      this.disposeForm.alarmId = ''
      this.disposeForm.handleConent = ''
      this.disposeForm.handleStatus = ''
      this.disposeForm.fileId = ''
    }, dispose() {
      if (this.checkSel()) {
          if(this.selRow.isFeedback == 2) {
            this.vShow = false
          } else {
            this.vShow = true
          }
        this.fileList = []
        this.resetDisposeForm()
        this.disposeTitle = '报警处置'
        this.disposeVisible = true
        this.initDisposeList(this.selRow.id)
        }

    },addDispose() {
      this.$refs['disposeForm'].validate((valid) => {
        if (valid) {
          const alarmData = {
            id:this.selRow.id,
            isFeedback:this.disposeForm.handleStatus
          }

          mmAlarmInfoApi.updateHandleById(alarmData).then(response=>{
            const formData = {
              alarmId:this.selRow.id,
              handleConent:this.disposeForm.handleConent,
              handleStatus:this.disposeForm.handleStatus
            }
            mmAlarmInfoApi.addDispose(formData).then(response => {
              this.$message({
                message: this.$t('common.optionSuccess'),
                type: 'success'
              })

              this.fileList.forEach(item=>{
                const fileData = {
                  handleId:response.data.id,
                  fileId:item.response.data.id
                }
                mmAlarmInfoApi.addRelation(fileData).then()
              })

            })
            this.$refs.alarmTable.clearSelection();
            this.fetchData()
          })
        } else {
          return false
        }

        this.disposeVisible = false
      })
    },initDisposeList(alamId) {
      mmAlarmInfoApi.queryDisposeByAlarm(alamId).then(response=>{
        this.disposeList = response.data
      })

      this.disposeLoading = false
    },handleChangeUpload(file,fileList){
      this.fileList = fileList.slice(-10)
    },removeFile(file){
      var arr = []
      const param = {
        idFile:null
      }
      if (file.response) {
        param.idFile = file.response.data.id
      } else {
        param.idFile = file.id
      }
      this.fileList.forEach(item =>{
        if(item.response && file.response) {
          if(item.response.data.id != file.response.data.id) {
            arr.push((item))
          }
        } else if(item.id != file.id) {
          arr.push(item)
        }
      })
      this.fileList = arr
      this.removeFileItem(param)

    },
    previewFile(record){
      this.previewVisible = true;
      mmAlarmInfoApi.queryDataByHandleId(record.id).then(response =>{
        this.files = response.data
      })
    },viewFile(record) {
      if(!record.fileInfo) {
        this.$message({
          message: this.$t('不存在预览文件'),
          type: 'success'
        })
        this.fileShow = false
      }
      if(!isCanPreview(record.fileInfo.originalFileName)) {
        this.$message({
          message: this.$t('该文件类型不支持预览'),
          type: 'success'
        })
        this.fileShow = false
      } else {
        this.fileShow = true
        let originUrl = this.downloadUrl + record.fileInfo.id + '&fileName=' + record.fileInfo.originalFileName;
        let preview = getPreviewUrl(1, originUrl, [record.fileInfo.originalFileName]);
        this.previewTitle = record.lawName;
        this.previewFileUrl = preview;
      }

    },
    closeGenEvent() {
      this.search();
      this.genEventVisible = false;
    },
    openGenEvent(){
      if(this.checkSel()) {
        this.genEventVisible = true;
      }
    },openAccept() {
      if(this.checkSel()) {
        if (this.selRow.isAudit < 1) {
          this.$message({
            message: '请先进行审核',
            type: 'warning'
          });
        } else {
          this.acceptTitle = '信息通知'
          this.acceptVisible = true
          this.value = []
          this.acceptForm.noticeContent = ''
          this.initAcceptPerson()
        }
      }
    },msgSend() {
      this.$refs['acceptForm'].validate((valid) => {
        if (valid) {
          const formData = {
            alarmId:this.selRow.id,
            content:this.acceptForm.noticeContent,
            receives:this.value
          }
          mmAlarmInfoApi.msgSend(formData).then(response =>{
            this.$message({
              message: this.$t('发送成功'),
              type: 'success'
            })
          })
        } else {
          return false
        }

        this.acceptVisible = false
      })


    },
    //初始化发送人列表信息
    initAcceptPerson() {
      const data = []
      mmAlarmInfoApi.getAcceptPerson().then(response =>{
        if (response.data) {
          response.data.forEach(item=>{
            data.push({
              key: item.id,
              label: item.name,
            })
          })
        }
      })
      this.acceptPerson = data

    },
    //监测曲线
    openCurve(record) {
      this.formTitle = '监测曲线'
      this.echartVisiable = true
      this.modelTime = ''
      this.initModelData(record)

    }
    ,clearEchart() {
      this.lineData.xAxis.data=[]
      this.lineData.series[0].data = []
    },
    //流程
    openProcess(record) {
      this.formTitle = '流程查看'
      this.processVisiable = true
      mmAlarmInfoApi.queryDisposeByAlarm(record.id).then(response=>{
        this.disposeList = response.data
      })

      mmAlarmInfoApi.queryById(record.id).then(response=>{
        this.checkList = response.data
      })

      mmAlarmInfoApi.queryScreenByAlarmId(record.id).then(response =>{
        this.screenList = response.data
      })

    },downloads(record) {
    const param = {
      idFile:record.fileInfo.id,
      fileName:record.fileInfo.originalFileName
    }
    downloadFile('/file/download',param,record.fileInfo.originalFileName)
    },
    removeFileItem(param) {
      fileDelete.deleteFile(param).then()
    },clearData() {
      this.lineData.xAxis.data = []
      this.lineData.series[0].data = []
    },
    handleSelectionChange(selection) {
      this.selection = selection
    },toggleSelection(row) {
      this.$refs.alarmTable.toggleRowSelection(row)
    },initModelData(record) {
      this.clearEchart()
      let time = new Date(record.alarmTime)

      let year = time.getFullYear()
      let month = time.getMonth()+1
      let day = time.getDate()
      let second = time.getSeconds();


      for (let i = 1; i < 20; i++) {
        let hours = time.getHours()
        let minitu = time.getMinutes()

        let tmp = minitu-(20-i)
        if (tmp < 0){
          hours = hours -1
          tmp = 60+tmp
        }
        let value = Math.random()*4+4
        this.lineData.xAxis.data.push(hours+':'+tmp+':'+second)
        this.lineData.series[0].data.push(value)
      }
      this.lineData.xAxis.data.push(time.getHours()+':'+time.getMinutes()+':'+second)
      this.lineData.series[0].data.push(record.alarmValue)
      for (let i = 1; i < 20; i++) {
        let hours = time.getHours()
        let minitu = time.getMinutes()
        let tmp = minitu+i
        if (tmp > 60){
          hours = hours +1
          tmp = tmp-60
        }
        let value = Math.random()*4+4
        this.lineData.xAxis.data.push(hours+':'+tmp+':'+second)
        this.lineData.series[0].data.push(value)
      }
    }, day() {
      this.clearEchart()
      let date = new Date();
      let hour = date.getHours();
      let minitus = date.getMinutes()
      let timeHour = 0;
      let timeMinitus = 0;

      for (let i = 0;i < 240;i++) {
        timeMinitus = timeMinitus + 6;
        if (timeMinitus > minitus && timeHour == hour) {
            break
        }
        timeMinitus = timeMinitus + 6;
        if (timeMinitus >= 60) {
          timeHour = timeHour+1
          timeMinitus = timeMinitus - 60
        }
        let value = Math.random()*4+4
        this.lineData.xAxis.data.push(timeHour+':'+timeMinitus)
        this.lineData.series[0].data.push(value)
      }
    },OneWeeks() {
      this.clearEchart()
      let date = new Date();
      //获取上月天数
      let lastMonthDay = new Date(date.getFullYear(),date.getMonth(),0).getDate();
      let year = date.getFullYear();
      let month = date.getMonth()+1;
      let day = date.getDate();
      let weekDay = date.getDay()
      let hour = date.getHours();
      let minitus = date.getMinutes();
      let timeDay = 0;
      let count = day - weekDay+1;
      if (count > 0) {
        timeDay = count;
      } else {
        timeDay = lastMonthDay+count;
      }
      let timeHour = 0;
      let timeMinitus = 0;

      for (let i = 0;i < 240*7;i++) {
        timeMinitus = timeMinitus + 6;
        if (timeMinitus > minitus && timeHour == hour && timeDay == day) {
          break
        }
        timeMinitus = timeMinitus + 6;
        if (timeMinitus >= 60) {
          timeHour = timeHour+1
          timeMinitus = timeMinitus - 60
          if (timeHour >= 24) {
            timeDay = timeDay +1
            timeHour = timeHour - 24
            if (timeDay > lastMonthDay) {
              timeDay = timeDay - lastMonthDay
            }
          }
        }
        let value = Math.random()*4+4
        this.lineData.xAxis.data.push(year+'-'+month+'-'+timeDay+'    '+timeHour+':'+timeMinitus)
        this.lineData.series[0].data.push(value)
      }
    },month() {
      this.clearEchart()
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth()+1;
      let day = date.getDate();
      let hour = date.getHours();
      let minitus = date.getMinutes();
      let timeDay = 1;
      let timeHour = 0;
      let timeMinitus = 0;

      for (let i = 0;i < 30*24*3;i++) {
        timeMinitus = timeMinitus + 20;
        if (timeMinitus > minitus && timeHour == hour && timeDay == day) {
          break
        }
        if (timeMinitus >= 60) {
          timeHour = timeHour+1
          timeMinitus = timeMinitus - 60
          if (timeHour >= 24) {
            timeDay = timeDay +1
            timeHour = timeHour - 24
          }
        }
        let value = Math.random()*4+4
        this.lineData.xAxis.data.push(year+'-'+month+'-'+timeDay+'    '+timeHour+':'+timeMinitus)
        this.lineData.series[0].data.push(value)
      }

    },searchData(){
      if (this.modelTime.length > 0) {
        this.clearEchart()

        let startDate = new Date(this.modelTime[0]);
        let endDate = new Date(this.modelTime[1]);
        let year = startDate.getFullYear();
        let startMonth = startDate.getMonth()+1;
        let startDay = startDate.getDate();
        let startHour = startDate.getHours();
        let startMinitus = startDate.getMinutes();


        let endMonth = endDate.getMonth()+1;
        let endDay = endDate.getDate();
        let endHour = endDate.getHours();
        let endMinitus = endDate.getMinutes();
        while (true) {
          startMinitus = startMinitus + 30;
          if (startDay >= endDay && startHour >= endHour && startMinitus >= endMinitus && startMonth >= endMonth) {
            break;
          }
          if (startMinitus >= 60) {
            startMinitus = startMinitus - 60;
            startHour = startHour + 1;
            if (startHour >= 24) {
              startHour = startHour - 24;
              startDay = startDay + 1;
              if (startMonth < endMonth) {
                let startMonthDate = new Date(year,startMonth,0).getDate();
                if (startDay > startMonthDate) {
                  startMonth = startMonth +1;
                  startDay = startDay - startMonthDate;
                }
              }
            }
          }
          let value = Math.random()*4+4
          this.lineData.xAxis.data.push(year+'-'+startMonth+'-'+startDay+'    '+startHour+':'+startMinitus)
          this.lineData.series[0].data.push(value)

        }
      }

    },resetModel () {
      this.modelTime = [];
      this.initModelData(this.selRow)
    },


  }
}
