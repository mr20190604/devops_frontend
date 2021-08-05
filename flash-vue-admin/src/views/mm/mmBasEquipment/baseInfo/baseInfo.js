import mmBasEquipmentApi from '@/api/mm/mmBasEquipment'
import permission from '@/directive/permission/index.js'
import install from '@/views/mm/mmBasEquipment/installInfo/index.vue'
import monitoring from '@/views/mm/mmBasEquipment/mmEquipmentMonitors/index.vue'
import replace from '@/views/mm/mmBasEquipment/replace/replace.vue'

export default {
  directives: { permission },
  components: {
    install,
    monitoring,
    replace
  },
  data() {
    return {
      equipmentId: '',
      equipmentType: '',
      formVisible: false,
      formTitle: '添加设备信息',
      isAdd: true,
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
      selRow: {},
      selection: [],
      //更换流程参数属性
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
      this.isAdd = true
      this.form.isLeaf = 0
      this.activeName = 'first'

      if (this.$refs['form'] !== undefined) {
        this.$refs['form'].resetFields()
      }
    },
    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          const formData = {
            id: this.form.id,
            equipmentName: this.form.equipmentName,
            equipmentCode: this.form.equipmentCode,
            pointLocation: this.form.pointLocation,
            parentId: this.form.parentId,
            equipmentType: this.form.equipmentType,
            districtCode: this.form.districtCode,
            equipmentStatus: this.form.equipmentStatus,
            equipmentRunStatus: this.form.equipmentRunStatus,
            dataStatus: this.form.dataStatus,
            manageEnterprise: this.form.manageEnterprise,
            baseinfo: this.form.baseinfo,
            specifications: this.form.specifications,
            accessDevice: this.form.accessDevice,
            channel: this.form.channel,
            manufacturer: this.form.manufacturer,
            modelNumber: this.form.modelNumber,
            accuracy: this.form.accuracy,
            sensitivity: this.form.sensitivity,
            powerModel: this.form.powerModel,
            supplyVoltage: this.form.supplyVoltage,
            transmissionType: this.form.transmissionType,
            transmissionTransmission: this.form.transmissionTransmission,
            transmissionFrequency: this.form.transmissionFrequency,
            underVoltageProtect: this.form.underVoltageProtect,
            overhaulStrategy: this.form.overhaulStrategy,
            overhaulCycle: this.form.overhaulCycle,
            isLeaf: this.form.isLeaf,
            sysFlag: this.form.sysFlag,
            notes: this.form.notes,
            examinePerson: this.form.examinePerson,
            examineOpinion: this.form.examineOpinion,
            examineDate: this.form.examineDate,
            registDate: this.form.registDate,
            isEncrypt: this.form.isEncrypt,
            productDate: this.form.productDate,
            isDel: this.form.isDel,
            monitorStation: this.form.monitorStation,
            isDisplay: this.form.isDisplay,
            rfid: this.form.rfid,
            qrCode: this.form.qrCode,
            terminalId: this.form.terminalId,
            extenParam: this.form.extenParam,
            commands: this.form.commands,
            installBatch: this.form.installBatch
          }
          if (formData.id) {
            mmBasEquipmentApi.update(formData).then(response => {
              this.$message({
                message: this.$t('common.optionSuccess'),
                type: 'success'
              })
              this.activeName = 'second'
            })
          } else {
            mmBasEquipmentApi.add(formData).then(response => {
              this.equipmentId = response.data.id
              this.equipmentType = response.data.equipmentType
              if (this.equipmentId) {
                this.activeName = 'second'
              } else {
                this.activeName = 'first'
              }
              this.$message({
                message: this.$t('common.optionSuccess'),
                type: 'success'
              })
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
      this.selRow = record
      this.activeName = 'first'
      this.edit()
    },
    edit() {
      if (this.checkSel()) {
        this.isAdd = false
        this.form = this.selRow
        this.equipmentId = this.form.id
        this.equipmentType = this.form.equipmentType
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
        let id = this.selRow.id
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
    handleClick(activeName, oldActiveName) {
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
    //开启设备更替弹框页面
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
    }

  }
}
