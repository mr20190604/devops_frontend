import mmBasEquipmentApi from '@/api/mm/mmBasEquipment'
import permission from '@/directive/permission/index.js'
import install from '@/views/mm/mmBasEquipment/installInfo/index.vue'
import monitoring from '@/views/mm/mmBasEquipment/mmEquipmentMonitors/index.vue'
import replace from '@/views/mm/mmBasEquipment/replace/replace.vue'
import equipmentInfo from '@/views/mm/mmBasEquipment/equipmentInfo/equipmentInfo.vue'
import examine from '@/views/mm/mmBasEquipment/examine/index.vue'
import maintenance from '@/views/mm/mmEquipmentMaintenance/index.vue'

export default {
  directives: { permission },
  components: {
    install,
    monitoring,
    replace,
    examine,
    maintenance,
    equipmentInfo
  },
  data() {
    return {
      examineTitle: '设备审核',
      examineVisible: false,
      equipmentIds: [],
      maintenanceTitle: '设备维修',
      maintenanceVisible: false,
      equipmentId: 0,
      equipmentType: '',
      formVisible: false,
      formTitle: '添加设备信息',
      isAdd: false,
      activeName: 'first',
      maintenanceStatus:0,
      options: [{
        value: 1,
        label: '是'
      }, {
        value: 0,
        label: '否'
      }],
      form: {
        equipmentName: '',
        equipmentCode: '',
        pointLocation: '',
        parentId: '',
        equipmentType: '',
        districtCode: '',
        equipmentStatus: '',
        equipmentRunStatus: '',
        dataStatus: '',
        manageEnterprise: '',
        baseinfo: '',
        specifications: '',
        accessDevice: '',
        channel: '',
        manufacturer: '',
        modelNumber: '',
        accuracy: '',
        sensitivity: '',
        powerModel: '',
        supplyVoltage: '',
        transmissionType: '',
        transmissionTransmission: '',
        transmissionFrequency: '',
        underVoltageProtect: '',
        overhaulStrategy: '',
        overhaulCycle: '',
        isLeaf: '',
        sysFlag: '',
        notes: '',
        examinePerson: '',
        examineOpinion: '',
        examineDate: '',
        registDate: '',
        isEncrypt: '',
        productDate: '',
        isDel: '',
        monitorStation: '',
        isDisplay: '',
        rfid: '',
        qrCode: '',
        terminalId: '',
        extenParam: '',
        commands: '',
        installBatch: '',
        id: '',
        examineStatusName: '',
        examineStatus: '',
        registStatusName: '',
        registStatus: ''
      },
      listQuery: {
        page: 1,
        limit: 20,
        id: undefined
      },
      total: 0,
      list: [],
      listLoading: true,
      selRow: {},
      selection: [],
      // 更换流程参数属性
      replaceVisiable: false,
      replaceTitle: '',
      parent: {
        id: null,
        name: null
      }
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
    init() {
      this.fetchData()
    },
    fetchData() {
      this.listLoading = true
      mmBasEquipmentApi.getList(this.listQuery).then(response => {
        this.list = response.data
        console.log(this.list)
        this.listLoading = false
        // this.total = response.data.total
      })
    },
    search() {
      this.fetchData()
    },
    reset() {
      this.listQuery.equipmentType = ''
      this.listQuery.equipmentCode = ''
      this.listQuery.examineStatus = ''
      this.listQuery.registStatus = ''
      this.listQuery.equipmentStatus1 = ''
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
      this.selection = selection
    },
    toggleSelection(row) {
      this.$refs.equipTable.toggleRowSelection(row)
    },
    resetForm() {
      this.form = {
        equipmentName: '',
        equipmentCode: '',
        pointLocation: '',
        parentId: '',
        equipmentType: '',
        districtCode: '',
        equipmentStatus: '',
        equipmentRunStatus: '',
        dataStatus: '',
        manageEnterprise: '',
        baseinfo: '',
        specifications: '',
        accessDevice: '',
        channel: '',
        manufacturer: '',
        modelNumber: '',
        accuracy: '',
        sensitivity: '',
        powerModel: '',
        supplyVoltage: '',
        transmissionType: '',
        transmissionTransmission: '',
        transmissionFrequency: '',
        underVoltageProtect: '',
        overhaulStrategy: '',
        overhaulCycle: '',
        isLeaf: '',
        sysFlag: '',
        notes: '',
        examinePerson: '',
        examineOpinion: '',
        examineDate: '',
        registDate: '',
        isEncrypt: '',
        productDate: '',
        isDel: '',
        monitorStation: '',
        isDisplay: '',
        rfid: '',
        qrCode: '',
        terminalId: '',
        extenParam: '',
        commands: '',
        installBatch: '',
        id: '',
        parentName: ''
      }
    },
    add() {
      this.resetForm()
      console.log(this.selection)
      if (this.selection.length > 1) {
        this.$message({
          message: this.$t('不允许对多个设备添加子设备'),
          type: 'warning'
        })
        return false
      }
      if (this.selection.length === 1) {
        if (this.selection[0].isLeaf === 1) {
          this.$message({
            message: this.$t('不允许对叶子节点添加子设备'),
            type: 'warning'
          })
          return false
        }
        this.form.parentId = this.selection[0].id
        this.form.parentName = this.selection[0].equipmentName
      }
      this.formTitle = '添加设备信息'
      this.formVisible = true
      this.isAdd = false
      this.form.isLeaf = 0
      this.activeName = 'first'
      this.selRow = this.form

      if (this.$refs['form'] !== undefined) {
        this.$refs['form'].resetFields()
      }
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
    viewEquipemnt(record) {
      this.selRow = record
      if (record.parentId) {
        mmBasEquipmentApi.getParent(record.parentId).then(response => {
          this.selRow.parentName = response.data.equipmentName
        })
      }
      this.activeName = 'first'
      if (this.checkSel()) {
        this.isAdd = true
        this.equipmentId = this.selRow.id
        this.equipmentType = this.selRow.equipmentType
        this.formTitle = '查看设备信息'
        this.formVisible = true
        if (this.$refs['form'] !== undefined) {
          this.$refs['form'].resetFields()
        }
      }
    },
    editItem(record) {
      this.selRow = record
      this.activeName = 'first'
      this.edit()
    },
    edit() {
      if (this.checkSel()) {
        this.isAdd = false
        this.equipmentId = this.selRow.id
        this.equipmentType = this.selRow.equipmentType
        this.formTitle = '编辑设备信息'
        this.formVisible = true
        if (this.$refs['form'] !== undefined) {
          this.$refs['form'].resetFields()
        }
      }
    },
    removeItem(record) {
      this.selRow = record
      this.remove()
    },
    remove() {
      if (this.checkSel()) {
        const id = this.selRow.id
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
            this.selection = []
            this.$refs.equipTable.clearSelection()
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
    removeBatch() {
      let ids = this.selection.map(item => {
        return item.id
      })

      ids = ids.join(',')

      if (ids === null || ids.length === 0) {
        this.$message({
          message: this.$t('common.mustSelectOne'),
          type: 'warning'
        })
        return false
      }
      this.$confirm(this.$t('common.deleteConfirm'), this.$t('common.tooltip'), {
        confirmButtonText: this.$t('button.submit'),
        cancelButtonText: this.$t('button.cancel'),
        type: 'warning'
      }).then(() => {
        mmBasEquipmentApi.removeBatch(ids).then(() => {
          this.$message({
            message: this.$t('common.optionSuccess'),
            type: 'success'
          })
          this.reset()
        }).catch(err => {
          this.$notify.error({
            title: '错误',
            message: err
          })
        })
      }).catch(() => {
      })
    },
    getValue(equipmentId, equipmentType, activeName) {
      this.equipmentId = equipmentId
      this.equipmentType = equipmentType
      this.activeName = activeName
      // this.handleClick(this.activeName, 'first')
    },
    handleClick(activeName, oldActiveName) {
      console.log(this.equipmentId)
      if (activeName === 'second') {
        if (!this.equipmentId) {
          this.$alert('请先提交设备基础信息', '提示', {
            confirmButtonText: '确定'
          })
          return false
        }
      }
      if (activeName === 'third') {
        if (!(this.equipmentId && this.equipmentType)) {
          this.$alert('请选择设备类型并提交设备基础信息', '提示', {
            confirmButtonText: '确定'
          })
          return false
        }
      }
      return true
    },
    // 开启设备更替弹框页面
    openReplace(record) {
      this.replaceTitle = '设备更换'
      this.replaceVisiable = true
      this.form = JSON.parse(JSON.stringify(record))
    },
    closeDialog() {
      this.formVisible = false
      this.selection = []
      this.$refs.equipTable.clearSelection()
      this.reset()
      this.fetchData()
      this.equipmentId = ''
      this.equipmentType = ''
    },
    closeReplace() {
      this.replaceVisiable = false
      // 调用子组件方法清空表单信息
      this.$refs.cdRc.clearInfo('closeReplace')
    },
    equipmentExamine() {
      const ids = this.selection.map(item => {
        return item.id
      })

      if (ids === null || ids.length === 0) {
        this.$message({
          message: this.$t('common.mustSelectOne'),
          type: 'warning'
        })
        return false
      }
      this.examineVisible = true
      this.equipmentIds = ids
    },
    closeExamine() {
      this.examineVisible = false
      this.equipmentIds = []
      this.fetchData()
    },
    equipmentMaintenance(rows) {
      this.maintenanceVisible = true
      this.equipmentId = rows.id
      this.maintenanceStatus = rows.maintenanceStatus
    },
    closeMaintenance() {
      this.maintenanceVisible = false
      this.equipmentId = ''
      this.fetchData();
    },
    equipmentSubmit() {
      const ids = this.selection.map(item => {
        return item.id
      })

      if (ids === null || ids.length === 0) {
        this.$message({
          message: this.$t('common.mustSelectOne'),
          type: 'warning'
        })
        return false
      }

      mmBasEquipmentApi.updateStatusSubmit(ids).then(response => {
        this.$message({
          message: this.$t('common.optionSuccess'),
          type: 'success'
        })
        this.fetchData()
      })
    },
    registerEquipment(rows){
      let ids = []
      ids.push(rows.id);
      mmBasEquipmentApi.registerEquipment(ids).then(response => {
        this.$message({
          message: this.$t('common.optionSuccess'),
          type: 'success'
        })
        this.fetchData()
      })
    },
    equipmentRegister() {
      const ids = this.selection.map(item => {
        return item.id
      })

      if (ids === null || ids.length === 0) {
        this.$message({
          message: this.$t('common.mustSelectOne'),
          type: 'warning'
        })
        return false
      }

      mmBasEquipmentApi.registerEquipment(ids).then(response => {
        this.$message({
          message: this.$t('common.optionSuccess'),
          type: 'success'
        })
        this.fetchData()
      })
    }, closeReplaceAndRefresh() {
      this.replaceVisiable = false
      // 调用子组件方法清空表单信息
      this.$refs.cdRc.clearInfo('closeReplace')
      // 刷新页面
      this.fetchData()
    }
  }
}
