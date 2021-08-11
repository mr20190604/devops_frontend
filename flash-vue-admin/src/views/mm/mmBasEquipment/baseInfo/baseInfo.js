import mmBasEquipmentApi from '@/api/mm/mmBasEquipment'
import permission from '@/directive/permission/index.js'
import install from '@/views/mm/mmBasEquipment/installInfo/index.vue'
import monitoring from '@/views/mm/mmBasEquipment/mmEquipmentMonitors/index.vue'
import replace from '@/views/mm/mmBasEquipment/replace/replace.vue'
import equipmentInfo from '@/views/mm/mmBasEquipment/equipmentInfo/equipmentInfo.vue'

export default {
  directives: { permission },
  components: {
    install,
    monitoring,
    replace,
    equipmentInfo
  },
  data() {
    return {
      equipmentId: '',
      equipmentType: '',
      formVisible: false,
      formTitle: '添加设备信息',
      isAdd: false,
      activeName: 'first',
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
      replaceTitle: ''
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
        this.list = response.data.records
        this.listLoading = false
        this.total = response.data.total
      })
    },
    search() {
      this.fetchData()
    },
    reset() {
      this.listQuery.equipmentType = ''
      this.listQuery.equipmentCode = ''
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
        id: ''
      }
    },
    add() {
      this.formTitle = '添加设备信息'
      this.formVisible = true
      this.isAdd = false
      this.form.isLeaf = 0
      this.activeName = 'first'
      this.selRow = {}

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
    editItem(record) {
      this.selRow = record
      this.activeName = 'second'
      this.edit()
    },
    edit() {
      if (this.checkSel()) {
        this.isAdd = true
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
      this.reset()
      this.fetchData()
      this.equipmentId = ''
      this.equipmentType = ''
    },
    closeReplace() {
      this.replaceVisiable = false
      // 调用子组件方法清空表单信息
      this.$refs.cdRc.clearInfo('closeReplace')
    }

  }
}
