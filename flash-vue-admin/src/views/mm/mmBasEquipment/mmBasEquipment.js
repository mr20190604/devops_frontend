import mmBasEquipmentApi from '@/api/mm/mmBasEquipment'
import permission from '@/directive/permission/index.js'
import ECharts from 'vue-echarts/components/ECharts'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/pie'
import 'echarts/lib/chart/map'
import 'echarts/lib/chart/radar'
import 'echarts/lib/chart/scatter'
import 'echarts/lib/chart/effectScatter'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/polar'
import 'echarts/lib/component/geo'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/title'
import 'echarts/lib/component/visualMap'
import 'echarts/lib/component/dataset'
import 'echarts/map/js/world'

export default {
  directives: { permission },
  components: {
    chart: ECharts
  },
  data() {
    return {
      formVisible: false,
      formTitle: '添加设备基本信息',
      isAdd: true,
      form: {
        equipmentName:'',
        equipmentCode:'',
        pointLocation:'',
        parentId:'',
        equipmentType:'',
        districtCode:'',
        equipmentStatus1:'',
        equipmentRunStatus:'',
        manageEnterprise:'',
        baseinfo:'',
        specifications:'',
        accessDevice:'',
        channel:'',
        manufacturer:'',
        modelNumber:'',
        accuracy:'',
        sensitivity:'',
        powerModel:'',
        supplyVoltage:'',
        transmissionType:'',
        transmissionTransmission:'',
        transmissionFrequency:'',
        underVoltageProtect:'',
        overhaulStrategy:'',
        overhaulCycle:'',
        isLeaf:'',
        sysFlag:'',
        notes:'',
        examinePerson:'',
        examineOpinion:'',
        examineDate:'',
        registDate:'',
        isEncrypt:'',
        productDate:'',
        isDel:'',
        monitorStation:'',
        isDisplay:'',
        rfid:'',
        qrCode:'',
        terminalId:'',
        extenParam:'',
        commands:'',
        installBatch:'',
        id: '',
        equipmentTypeName:'',
        equipmentStatus1Name:'',
        realValue:'',
        reportTime:''
      },
      listQuery: {
        page: 1,
        limit: 20,
        id: undefined,
        equipmentCode:'',
        equipmentType:'',
        equipmentStatus1:'',
        startTime:'',
        endTime:''
      },
      total: 0,
      list: null,
      listLoading: true,
      selRow: {},
      yData:[1,3,5,3,6,8,7,6,9,5,7,9,8,7,5,4,6,9],
      lineData:{
        title: {
          text: '设备监测曲线',
          left: '1%'
        },
        xAxis: {
          type: 'category',
          // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          data:[]
        },
        yAxis: {
          type: 'value',
          min:1,
          max:10
        },
        series: [{
          // data: [150, 230, 224, 218, 135, 147, 260],
          data:[],
          type: 'line',

        }]
      },
      timer:null
    }
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
        // cfgName: [
        //   { required: true, message: this.$t('config.name') + this.$t('common.isRequired'), trigger: 'blur' },
        //   { min: 3, max: 2000, message: this.$t('config.name') + this.$t('config.lengthValidation'), trigger: 'blur' }
        // ]
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.fetchData()
    },
    fetchData() {
      this.listLoading = true
        mmBasEquipmentApi.getList(this.listQuery).then(response => {
        this.list = response.data.records
        this.listLoading = false
        this.total = response.data.total
      })
    },
    search() {
      this.fetchData()
    },
    reset() {
      this.listQuery.id = ''
      this.listQuery.equipmentCode = ''
      this.listQuery.equipmentType = ''
      this.equipmentRunStatus = ''
      this.listQuery.startTime = ''
      this.listQuery.endTime = ''
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
    handleCurrentChange(currentRow, oldCurrentRow) {
      this.selRow = currentRow
    },
    resetForm() {
      this.form = {
        equipmentName:'',
        equipmentCode:'',
        pointLocation:'',
        parentId:'',
        equipmentType:'',
        districtCode:'',
        equipmentStatus1:'',
        equipmentRunStatus:'',
        manageEnterprise:'',
        baseinfo:'',
        specifications:'',
        accessDevice:'',
        channel:'',
        manufacturer:'',
        modelNumber:'',
        accuracy:'',
        sensitivity:'',
        powerModel:'',
        supplyVoltage:'',
        transmissionType:'',
        transmissionTransmission:'',
        transmissionFrequency:'',
        underVoltageProtect:'',
        overhaulStrategy:'',
        overhaulCycle:'',
        isLeaf:'',
        sysFlag:'',
        notes:'',
        examinePerson:'',
        examineOpinion:'',
        examineDate:'',
        registDate:'',
        isEncrypt:'',
        productDate:'',
        isDel:'',
        monitorStation:'',
        isDisplay:'',
        rfid:'',
        qrCode:'',
        terminalId:'',
        extenParam:'',
        commands:'',
        installBatch:'',
        id: ''
      }
    },
    add() {
      this.formTitle = '添加设备基本信息',
      this.formVisible = true
      this.isAdd = true

      if(this.$refs['form'] !== undefined) {
        this.$refs['form'].resetFields()
      }
      //如果表单初始化有特殊处理需求,可以在resetForm中处理
          },
    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
            const formData = {
                id:this.form.id,
                equipmentName:this.form.equipmentName,
                equipmentCode:this.form.equipmentCode,
                pointLocation:this.form.pointLocation,
                parentId:this.form.parentId,
                equipmentType:this.form.equipmentType,
                districtCode:this.form.districtCode,
                equipmentStatus1:this.form.equipmentStatus1,
                equipmentRunStatus:this.form.equipmentRunStatus,
                manageEnterprise:this.form.manageEnterprise,
                baseinfo:this.form.baseinfo,
                specifications:this.form.specifications,
                accessDevice:this.form.accessDevice,
                channel:this.form.channel,
                manufacturer:this.form.manufacturer,
                modelNumber:this.form.modelNumber,
                accuracy:this.form.accuracy,
                sensitivity:this.form.sensitivity,
                powerModel:this.form.powerModel,
                supplyVoltage:this.form.supplyVoltage,
                transmissionType:this.form.transmissionType,
                transmissionTransmission:this.form.transmissionTransmission,
                transmissionFrequency:this.form.transmissionFrequency,
                underVoltageProtect:this.form.underVoltageProtect,
                overhaulStrategy:this.form.overhaulStrategy,
                overhaulCycle:this.form.overhaulCycle,
                isLeaf:this.form.isLeaf,
                sysFlag:this.form.sysFlag,
                notes:this.form.notes,
                examinePerson:this.form.examinePerson,
                examineOpinion:this.form.examineOpinion,
                examineDate:this.form.examineDate,
                registDate:this.form.registDate,
                isEncrypt:this.form.isEncrypt,
                productDate:this.form.productDate,
                isDel:this.form.isDel,
                monitorStation:this.form.monitorStation,
                isDisplay:this.form.isDisplay,
                rfid:this.form.rfid,
                qrCode:this.form.qrCode,
                terminalId:this.form.terminalId,
                extenParam:this.form.extenParam,
                commands:this.form.commands,
                installBatch:this.form.installBatch,
            }
            if(formData.id){
                mmBasEquipmentApi.update(formData).then(response => {
                    this.$message({
                        message: this.$t('common.optionSuccess'),
                        type: 'success'
                    })
                    this.fetchData()
                    this.formVisible = false
                })
            }else{
                mmBasEquipmentApi.add(formData).then(response => {
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
        this.formTitle = '编辑设备基本信息'
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
            mmBasEquipmentApi.remove(id).then(response => {
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
    },viewCurve(row) {
      this.formTitle = '监测曲线'
      this.formVisible = true
      this.lineData.series[0].data = this.yData
      let a = this.getHour()+':'+this.getMinitu()
      let second = this.getSecond()

      for (let i = 0; i < this.lineData.series[0].data.length; i++) {
        let temp = second-(this.lineData.series[0].data.length -i);
        this.lineData.xAxis.data.push(a+':'+temp)
      }
      this.timer = setInterval(this.pushData,1000*3)

    },getHour(){
      let time = new Date()
      return time.getHours()
    },
    getMinitu(){
      let time = new Date()
      return time.getMinutes()
      },
    getSecond(){
      let time = new Date()
      return time.getSeconds()
      }, getDateTime() {
      let time = new Date()
      let hours = time.getHours()
      let minutes = time.getMinutes()
      let second = time.getSeconds()
      return hours+':'+minutes+':'+second
    },pushData() {
      let timeStr = this.getDateTime()
      let value = Math.floor(Math.random()*10)+1
      this.lineData.xAxis.data.push(timeStr)
      this.lineData.series[0].data.push(value)
      this.$refs.myEchart.resize()
    },closeTimer() {
      this.timer = null
      let arr = []
      for (let i = 0; i < this.yData.length ; i++) {
        if (i <= 17) {
          arr.push(this.yData[i])
        }
      }
      this.yData = arr
      this.lineData.xAxis.data = []
      this.lineData.series[0].data = []
    }

  }
}
