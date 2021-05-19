import mmAlarmInfoApi from '@/api/mm/mmAlarmInfo'
import permission from '@/directive/permission/index.js'

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
        id: ''
      },
      listQuery: {
        page: 1,
        limit: 20,
        id: undefined
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
        mmAlarmInfoApi.getList(this.listQuery).then(response => {
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
                alarmTime:this.form.alarmTime,
                alarmValue:this.form.alarmValue,
                alarmLevel:this.form.alarmLevel,
                alarmFirstValue:this.form.alarmFirstValue,
                alarmFirstTime:this.form.alarmFirstTime,
                alarmMaxValue:this.form.alarmMaxValue,
                alarmMaxTime:this.form.alarmMaxTime,
                alarmMaxLevel:this.form.alarmMaxLevel,
                alarmRelieveTime:this.form.alarmRelieveTime,
                isAudit:this.form.isAudit,
                auditOpinion:this.form.auditOpinion,
                auditPerson:this.form.auditPerson,
                isFeedback:this.form.isFeedback,
                isRelieve:this.form.isRelieve,
                prejudgment:this.form.prejudgment,
                isGenEvent:this.form.isGenEvent,
                auditTime:this.form.auditTime,
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
