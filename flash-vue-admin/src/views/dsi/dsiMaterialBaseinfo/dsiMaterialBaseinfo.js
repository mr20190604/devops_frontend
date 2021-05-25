import dsiMaterialBaseinfoApi from '@/api/dsi/dsiMaterialBaseinfo'
import permission from '@/directive/permission/index.js'

export default {
  directives: { permission },
  data() {
    return {
      formVisible: false,
      formTitle: '添加化工原料信息',
      isAdd: true,
      form: {
        materialCode: '',
        chemistryName: '',
        englishName: '',
        shortName: '',
        materialType: '',
        physicochemicalProperties: '',
        healthHazards: '',
        dangerousCharacteristic: '',
        casCode: '',
        isDanger: '',
        isDangerName:'',
        id: ''
      },
      listQuery: {
        page: 1,
        limit: 10,
        key: undefined,
        materialType: undefined,
        isDanger: undefined
      },
      total: 0,
      list: [],
      listLoading: true,
      selRow: {},
      selection: []
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
    formVisible(newValue) {
      if (!newValue) {
        this.resetForm()
      }
    }
  },
  methods: {
    init() {
      this.fetchData()
    },
    fetchData() {
      this.listLoading = true
      dsiMaterialBaseinfoApi.getList(this.listQuery).then(response => {
        this.list = response.data.records
        this.listLoading = false
        this.total = response.data.total
      })
    },
    search() {
      this.fetchData()
    },
    reset() {
      this.listQuery.key = undefined
      this.listQuery.materialType = undefined
      this.listQuery.isDanger = undefined
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
        materialCode: '',
        chemistryName: '',
        englishName: '',
        shortName: '',
        materialType: '',
        physicochemicalProperties: '',
        healthHazards: '',
        dangerousCharacteristic: '',
        casCode: '',
        isDanger: '',
        id: ''
      }
    },
    add() {
      this.formTitle = '添加化工原料信息'
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
          console.log(this.form.id);
          const formData = {
            id: this.form.id,
            materialCode: this.form.materialCode,
            chemistryName: this.form.chemistryName,
            englishName: this.form.englishName,
            shortName: this.form.shortName,
            materialType: this.form.materialType,
            physicochemicalProperties: this.form.physicochemicalProperties,
            healthHazards: this.form.healthHazards,
            dangerousCharacteristic: this.form.dangerousCharacteristic,
            casCode: this.form.casCode,
            isDanger: this.form.isDanger
          }
          if (formData.id) {
            dsiMaterialBaseinfoApi.update(formData).then(response => {
              this.$message({
                message: this.$t('common.optionSuccess'),
                type: 'success'
              })
              this.fetchData()
              this.formVisible = false
            })
          } else {
            dsiMaterialBaseinfoApi.add(formData).then(response => {
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
        this.formTitle = '编辑化工原料信息'
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
          dsiMaterialBaseinfoApi.remove(id).then(response => {
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
        dsiMaterialBaseinfoApi.removeBatch(ids).then(() => {
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

  }
}
