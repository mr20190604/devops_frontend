import dsiProductInfoApi from '@/api/dsi/dsiProductInfo'
import permission from '@/directive/permission/index.js'

export default {
  directives: { permission },
  data() {
    return {
      formVisible: false,
      formTitle: '添加产品信息',
      isAdd: true,
      form: {
        productCode: '',
        productName: '',
        isPoisonHarm: '',
        isInflammableExplosive: '',
        formId: '',
        enterpriseId: '',
        id: ''
      },
      materialVisible: false,
      listQuery: {
        page: 1,
        limit: 10,
        key: undefined,
        isPoisonHarm: undefined,
        isInflammableExplosive: undefined,
        formId: undefined,
        enterpriseId: undefined
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
      dsiProductInfoApi.getList(this.listQuery).then(response => {
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
      this.listQuery.isPoisonHarm = undefined
      this.listQuery.isInflammableExplosive = undefined
      this.listQuery.formId = undefined
      this.listQuery.enterpriseId = undefined
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
        productCode: undefined,
        productName: undefined,
        isPoisonHarm: undefined,
        isInflammableExplosive: undefined,
        formId: undefined,
        enterpriseId: undefined,
        id: undefined
      }
    },
    add() {
      this.formTitle = '添加产品信息'
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
            productCode: this.form.productCode,
            productName: this.form.productName,
            isPoisonHarm: this.form.isPoisonHarm,
            isInflammableExplosive: this.form.isInflammableExplosive,
            formId: this.form.formId,
            enterpriseId: this.form.enterpriseId
          }
          if (formData.id) {
            dsiProductInfoApi.update(formData).then(response => {
              this.$message({
                message: this.$t('common.optionSuccess'),
                type: 'success'
              })
              this.fetchData()
              this.formVisible = false
            })
          } else {
            dsiProductInfoApi.add(formData).then(response => {
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
        this.formTitle = '编辑产品信息'
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
          dsiProductInfoApi.remove(id).then(response => {
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
    }, removeBatch() {
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
        dsiProductInfoApi.removeBatch(ids).then(() => {
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
    },
    resetMaterialForm() {
      this.materialForm = {
        code: '',
        materialName: '',
        materialType: '',
        materialNum: '',
        chUnitId: '',
        validityTerm: '',
        poolId: '',
        isDel: '',
        id: ''
      }
    },
    addMaterial() {
      this.resetMaterialForm()
      this.materialVisible = true
      this.materialTitle = '添加应急物资信息'
    }, editMaterialItem(record) {
      this.resetMaterialForm()
      this.materialVisible = true
      this.materialTitle = '编辑应急物资信息'
      this.materialForm = record
    },
    saveProductMaterial() {
      this.$refs['materialForm'].validate((valid) => {
        if (valid) {
          const formData = {
            materialCode: this.materialForm.materialCode,
            chemistryName: this.materialForm.chemistryName,
            englishName: this.materialForm.englishName,
            shortName: this.materialForm.shortName,
            materialType: this.materialForm.materialType,
            physicochemicalProperties: this.materialForm.physicochemicalProperties,
            poolId: this.form.id,
            materialTypeName: null,
            chUnitIdName: null
          }
          if (this.materialAdd) {
            var arr = []
            this.material_list.forEach(item => {
              if (item.materialName != formData.materialName) {
                arr.push(item)
              }
            })
            // var index = this.material_list.indexOf(formData)
            // for(var i = 0;i < this.material_list.length;i++) {
            //   if (index != i) {
            //     arr.push(this.material_list[i])
            //   }
            // }
            this.material_list = arr
            this.material_list.push(formData)
            this.material_list.remove
            this.materialList = this.material_list
          } else {
            if (formData.id) {
              dsiParkEmergency.update(formData).then(response => {
                this.$message({
                  message: this.$t('common.optionSuccess'),
                  type: 'success'
                })
              })
            } else {
              dsiParkEmergency.add(formData).then(response => {
                this.$message({
                  message: this.$t('common.optionSuccess'),
                  type: 'success'
                })
              })
            }
          }
        } else {
          return false
        }
        this.initMaterialList(this.form.id)
        this.materialVisible = false
      })
    }
  }
}
