import mmInspectionTroubleHandleApi from '@/api/mm/mmInspectionTroubleHandle'
import permission from '@/directive/permission/index.js'
import mmInspectionTroubleApi from '@/api/mm/mmInspectionTrouble'
import TroubleProcess from '@/views/mm/mmInspectionTrouble/troubleProcess/troubleProcess.vue'

export default {
  directives: { permission },
  components: { TroubleProcess },
  data() {
    return {
      formVisible: false,
      formTitle: '添加巡检巡查_巡检隐患处置表',
      isAdd: true,
      form: {
        troubleId: '',
        distributeStatus: '',
        handleStatus: '',
        handleTime: '',
        repairPersonCellphone: '',
        repairPerson: '',
        repairStatus: '',
        repairTime: '',
        notes: '',
        isDel: '',
        id: '',
        inspectionTrouble: '',
        repairUser: ''
      },
      listQuery: {
        page: 1,
        limit: 20,
        id: undefined,
        troubleType: '',
        troubleSource: '',
        troubleLevel: ''
      },
      total: 0,
      list: [],
      listLoading: true,
      selRow: {},
      selection: [],
      repair_person: [],
      processTitle: '隐患流程跟踪',
      processVisible: false,
      trouble_list: [],
      trouble_handle_list: []
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
      this.initAcceptPerson()
      this.fetchData()
    },
    fetchData() {
      this.listLoading = true
      mmInspectionTroubleHandleApi.getList(this.listQuery).then(response => {
        this.list = response.data.records
        this.listLoading = false
        this.total = response.data.total
      })
    },
    search() {
      this.fetchData()
    },
    reset() {
      this.listQuery.troubleType = ''
      this.listQuery.troubleSource = ''
      this.listQuery.troubleLevel = ''
      this.listQuery.repairPerson = ''
      this.listQuery.distributeStatus = ''
      this.listQuery.handleStatus = ''
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
    handleSelectionChange(selection) {
      /*if (selection.length > 1) {
        this.$refs.handleTable.clearSelection()
        this.$refs.handleTable.toggleRowSelection(selection.pop())
      }
      console.log(this.selection)*/
      console.log(selection)
      this.selection = selection
    },
    toggleSelection(row) {
      this.$refs.handleTable.clearSelection()
      this.$refs.handleTable.toggleRowSelection(row)
    },
    resetForm() {
      this.form = {
        repairPersonCellphone: '',
        repairPerson: ''
      }
    },
    add() {
      this.formTitle = '添加巡检巡查_巡检隐患处置表'
      this.formVisible = true
      this.isAdd = true
      if (this.$refs['form'] !== undefined) {
        this.$refs['form'].resetFields()
      }
    },
    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          const formData = {
            id: this.form.id,
            troubleId: this.form.troubleId,
            distributeStatus: this.form.distributeStatus,
            handleStatus: this.form.handleStatus,
            handleTime: this.form.handleTime,
            repairPersonCellphone: this.form.repairPersonCellphone,
            repairPerson: this.form.repairPerson,
            repairStatus: this.form.repairStatus,
            repairTime: this.form.repairTime,
            notes: this.form.notes,
            isDel: this.form.isDel
          }
          if (formData.id) {
            mmInspectionTroubleHandleApi.update(formData).then(response => {
              this.$message({
                message: this.$t('common.optionSuccess'),
                type: 'success'
              })
              this.fetchData()
              this.formVisible = false
            })
          } else {
            mmInspectionTroubleHandleApi.add(formData).then(response => {
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
      if (this.selection.length > 0) {
        return true
      }
      this.$message({
        message: this.$t('common.mustSelectOne'),
        type: 'warning'
      })
      return false
    },
    editItem(record) {
      this.selRow = record
      this.edit()
    },
    edit() {
      if (this.checkSel()) {
        this.isAdd = false
        this.form = this.selRow
        this.formTitle = '编辑巡检巡查_巡检隐患处置表'
        this.formVisible = true

        if (this.$refs['form'] !== undefined) {
          this.$refs['form'].resetFields()
        }
        //如果表单初始化有特殊处理需求,可以在resetForm中处理
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
          mmInspectionTroubleHandleApi.remove(id).then(response => {
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
    },
    openAccept() {
      this.resetForm()
      console.log(this.selection)
      if (this.checkSel()) {
        this.isAdd = false
        if (this.selection[0].distributeStatus === 291) {
          this.$message({
            message: this.$t('不允许重复分配！'),
            type: 'warning'
          })
          return
        }
        this.form = this.selection[0]
        this.formTitle = '分配人员'
        this.formVisible = true
        this.initAcceptPerson()
      }
    },
    initAcceptPerson() {
      this.repair_person = []
      this.resetForm()
      mmInspectionTroubleHandleApi.getAcceptPerson().then(response => {
        this.repair_person = response.data
      })
    },
    getTelephone(val) {
      this.repair_person.map(item => {
        if (item.id == val) {
          this.form.repairPersonCellphone = item.phone
          return
        }
      })
    },
    saveOption() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.selection.map((item, index) => {
            item.repairPerson = this.form.repairPerson
            item.repairPersonCellphone = this.form.repairPersonCellphone
            const formData = {
              id: item.id,
              troubleId: item.troubleId,
              distributeStatus: 291,
              handleStatus: item.handleStatus,
              handleTime: item.handleTime,
              repairPersonCellphone: item.repairPersonCellphone,
              repairPerson: item.repairPerson,
              repairStatus: item.repairStatus,
              repairTime: item.repairTime,
              notes: item.notes,
              isDel: item.isDel
            }
            mmInspectionTroubleHandleApi.update(formData).then(() => {
              this.$message({
                message: this.$t('common.optionSuccess'),
                type: 'success'
              })
              this.fetchData()
              this.selection = []
              this.$refs.handleTable.clearSelection()
              this.formVisible = false
            })
          })
        }
      })
    },
    openProcess(record) {
      mmInspectionTroubleApi.queryById(record.troubleId).then(response => {
        this.trouble_list = response.data
      })
      mmInspectionTroubleApi.queryHandleList(record.troubleId).then(response => {
        this.trouble_handle_list = response.data
      })
      this.processVisible = true
    }
  }
}
