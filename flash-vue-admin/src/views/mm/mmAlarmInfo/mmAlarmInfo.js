import mmAlarmInfoApi from '@/api/mm/mmAlarmInfo'
import permission from '@/directive/permission/index.js'
import {getDicts} from "../../../api/system/dict";

export default {
  directives: { permission },
  data() {
    return {
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
        auditStatus:''
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
      feedback_list:
        [
          {
            value:0,
            label:'未处置'
          },
          {
            value:1,
            label:'已处置'
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
        startTime:undefined,
        endTime:undefined,
        monitorType:undefined,
        isAudit:undefined,
        isFeedBack:undefined
      },
      total: 0,
      list: null,
      listLoading: true,
      selRow: {}
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
      this.fetchData()
    },
    reset() {
      this.listQuery.id = ''
      this.listQuery.equipCode=''
      this.listQuery.alarmLevel=''
      this.listQuery.startTime=''
      this.listQuery.endTime=''
      this.listQuery.monitorType=''
      this.listQuery.isAudit=''
      this.listQuery.isFeedBack=''
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
      this.formTitle = '添加报警基本信息',
      this.formVisible = true
      this.isAdd = true
      this.form = this.selRow
      this.form.isAudit=1

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
                alarmCode:this.form.alarmCode,
                districtCode:this.form.districtCode,
                equipmentId:this.form.equipmentId,
                monitorType:this.form.monitorType,
                alarmValue:this.form.alarmValue,
                alarmLevel:this.form.alarmLevel,
                alarmFirstValue:this.form.alarmFirstValue,
                alarmMaxValue:this.form.alarmMaxValue,
                alarmMaxLevel:this.form.alarmMaxLevel,
                isAudit:this.form.isAudit,
                auditOpinion:this.form.auditOpinion,
                auditPerson:this.form.auditPerson,
                isFeedback:this.form.isFeedback,
                isRelieve:this.form.isRelieve,
                prejudgment:this.form.prejudgment,
                isGenEvent:this.form.isGenEvent,
                isDel:this.form.isDel,
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
    }

  }
}
