import mmInspectionTroubleApi from '@/api/mm/mmInspectionTrouble'
import permission from '@/directive/permission/index.js'
import TroubleProcess from '@/views/mm/mmInspectionTrouble/troubleProcess/troubleProcess.vue'
import { getInfo } from '@/api/user.js'

export default {
  directives: { permission },
  components: { TroubleProcess },
  data() {
    return {
      formVisible: false,
      formTitle: '添加巡检巡查_隐患管理',
      isAdd: true,
      form: {
        planId: '',
        pipelineId: '',
        equipmentId: '',
        address: '',
        troubleInfo: '',
        troubleType: '',
        troubleSource: '',
        troubleLevel: '',
        reportPerson: '',
        reportTime: '',
        reportPersonCellphone: '',
        auditStatus: '',
        notes: '',
        isDel: '',
        id: '',
        auditResult: '',
        troubleTypeName: '',
        troubleSourceName: '',
        troubleLevelName: '',
        reportUser: '',
        auditTime: '',
        systems:'',
      },
      listQuery: {
        troubleType: undefined,
        troubleSource: undefined,
        reportName: undefined,
        troubleLevel: undefined,
        auditStatus: undefined,
        page: 1,
        limit: 20,
        id: undefined,
        personId: undefined
      },
      check_list: [
        {
          value: 0,
          label: '待审核'

        },
        {
          value: 1,
          label: '已审核'
        }
      ],
      check_result_list: [
        {
          value: 0,
          label: '不通过'

        },
        {
          value: 1,
          label: '通过'
        }
      ],
      total: 0,
      list: [],
      listLoading: true,
      selRow: {},
      trouble_list: [],
      trouble_handle_list: [],
      processTitle: '隐患流程跟踪',
      processVisiable: false
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

    // 表单验证
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
    alarmProcessClose(){
      this.$refs.alarmProcess.isShowMore = false
    },
    init() {
      getInfo().then(response => {
        this.listQuery.personId = response.data.userId
        this.fetchData()
      })
    },
    fetchData() {
      this.listLoading = true
      mmInspectionTroubleApi.getList(this.listQuery).then(response => {
        this.list = response.data.records
        this.listLoading = false
        this.total = response.data.total
        this.clearSelection()
      })
    },
    search() {
      this.fetchData()
    },
    reset() {
      for (const key in this.listQuery) {
        if (key != 'limit' && key != 'page' && key != 'personId') {
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
    handleCurrentChange(currentRow, oldCurrentRow) {
      this.selRow = currentRow
    },
    resetForm() {
      this.form = {
        planId: '',
        pipelineId: '',
        equipmentId: '',
        adress: '',
        troubleInfo: '',
        troubleType: '',
        troubleSource: '',
        troubleLevel: '',
        reportPerson: '',
        reportTime: '',
        reportPersonCellphone: '',
        auditStatus: '',
        notes: '',
        isDel: '',
        id: ''
      }
    },
    add() {
      this.formTitle = '添加巡检巡查_隐患管理',
      this.formVisible = true
      this.isAdd = true

      if (this.$refs['form'] !== undefined) {
        this.$refs['form'].resetFields()
      }
      // 如果表单初始化有特殊处理需求,可以在resetForm中处理
    },
    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          const formData = {
            id: this.form.id,
            planId: this.form.planId,
            pipelineId: this.form.pipelineId,
            equipmentId: this.form.equipmentId,
            address: this.form.address,
            troubleInfo: this.form.troubleInfo,
            troubleType: this.form.troubleType,
            troubleSource: this.form.troubleSource,
            troubleLevel: this.form.troubleLevel,
            reportPerson: this.form.reportPerson,
            reportTime: this.form.reportTime,
            reportPersonCellphone: this.form.reportPersonCellphone,
            auditStatus: 1,
            auditResult: this.form.auditResult,
            notes: this.form.notes,
            isDel: this.form.isDel,
            systems:this.form.systems
          }
          if (formData.id) {
            mmInspectionTroubleApi.update(formData).then(response => {
              this.$message({
                message: this.$t('common.optionSuccess'),
                type: 'success'
              })
              this.fetchData()
              this.formVisible = false
            })
          } else {
            mmInspectionTroubleApi.add(formData).then(response => {
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
    editItem(record) {
      if (record.auditStatus == 1) {
        this.$message({
          message: this.$t('不允许重复审核'),
          type: 'warning'
        })
        return
      }
      this.selRow = record

      this.edit()
    },
    edit() {
      if (this.checkSel()) {
        this.isAdd = false
        this.form = JSON.parse(JSON.stringify(this.selRow))
        this.formTitle = '隐患上报信息'
        this.formVisible = true

        if (this.$refs['form'] !== undefined) {
          this.$refs['form'].resetFields()
        }
        // 如果表单初始化有特殊处理需求,可以在resetForm中处理
      }
    },
    removeItem(record) {
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
          mmInspectionTroubleApi.remove(id).then(response => {
            this.$message({
              message: this.$t('common.optionSuccess'),
              type: 'success'
            })
            this.fetchData()
          }).catch(err => {
            this.$notify.error({
              title: '错误',
              message: err
            })
          })
        }).catch(() => {
        })
      }
    }, handleSelectionChange(selection) {
      this.selection = selection
    }, toggleSelection(row) {
      this.$refs.troubleTable.toggleRowSelection(row)
    }, clearSelection() {
      this.$refs.troubleTable.clearSelection()
    }, getRowKey(row) {
      return row.id
    }, openProcess(record) {
      // mmInspectionTroubleApi.queryById(record.id).then(response => {
      //   this.trouble_list = response.data
      //   mmInspectionTroubleApi.queryHandleList(record.id).then(response => {
      //     this.trouble_handle_list = response.data
      //     this.processVisiable = true
      //   })
      // })

        mmInspectionTroubleApi.queryById(record.id).then(response => {
          this.trouble_list = response.data
        })

        mmInspectionTroubleApi.queryHandleList(record.id).then(response => {
          this.trouble_handle_list = response.data
        })
      this.processVisiable = true

    }

  }
}
