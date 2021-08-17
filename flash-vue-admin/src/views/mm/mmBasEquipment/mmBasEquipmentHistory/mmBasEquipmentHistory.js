import mmBasEquipmentHistoryApi from '@/api/mm/mmBasEquipmentHistory'
import permission from '@/directive/permission/index.js'
export default {
  directives: { permission },
  props: [
    'location'
  ],
  data() {
    return {
      formVisible: false,
      formTitle: '添加设备基本信息',
      isAdd: true,
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
        examineStatus: '',
        registStatus: '',
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
        pointLocation: undefined
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
  watch: {
    'location': function() {
      this.fetchData()
    }
  },
  methods: {
    init() {
      this.fetchData()
    },
    fetchData() {
      console.log(this.location)
      this.listQuery.pointLocation = this.location
      this.listLoading = true
      mmBasEquipmentHistoryApi.getList(this.listQuery).then(response => {
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
        examineStatus: '',
        registStatus: '',
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
      this.formTitle = '添加设备基本信息'
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
            examineStatus: this.form.examineStatus,
            registStatus: this.form.registStatus,
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
            mmBasEquipmentHistoryApi.update(formData).then(response => {
              this.$message({
                message: this.$t('common.optionSuccess'),
                type: 'success'
              })
              this.fetchData()
              this.formVisible = false
            })
          } else {
            mmBasEquipmentHistoryApi.add(formData).then(response => {
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
      this.selRow = record
      this.edit()
    },
    edit() {
      if (this.checkSel()) {
        this.isAdd = false
        this.form = this.selRow
        this.formTitle = '编辑设备基本信息'
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
          mmBasEquipmentHistoryApi.remove(id).then(response => {
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
    viewEquipemnt(record) {
      this.$emit('viewEquipemnt', record)
    },
    closeHistory() {
      this.$emit('closeHistory')
    }
  }
}
