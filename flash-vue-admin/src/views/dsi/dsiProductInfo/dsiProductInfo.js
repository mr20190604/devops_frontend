import dsiProductInfoApi from '@/api/dsi/dsiProductInfo'
import permission from '@/directive/permission/index.js'
import { getDicts } from '../../../api/system/dict'
import materialInfo from '@/views/dsi/dsiMaterialBaseinfo/index.vue'
import dsiMaterialBaseinfoApi from '@/api/dsi/dsiMaterialBaseinfo'
import dsiProductFromMaterialApi from '@/api/dsi/dsiProductFromMaterial'

export default {
  directives: { permission },
  props: ['enterpriseId'],
  component: {
    materialInfo
  },
  data() {
    return {
      formVisible: false,
      productDetailVisible: false,
      formTitle: '添加产品信息',
      isAdd: true,
      isEdit: true,
      form: {
        productCode: '',
        productName: '',
        isPoisonHarm: '',
        isInflammableExplosive: '',
        formId: '',
        enterpriseId: this.enterpriseId,
        isCorrosive: '',
        isRadioactivity: '',
        storageStandards: '',
        productDesc: '',
        productModel: '',
        isPoisonHarmName: '',
        isInflammableExplosiveName: '',
        isCorrosiveName: '',
        isRadioactivityName: '',
        id: ''
      },
      form1: {
        id: '',
        materialCode: '',
        chemistryName: '',
        englishName: '',
        shortName: '',
        materialType: '',
        physicochemicalProperties: '',
        healthHazards: '',
        dangerousCharacteristic: '',
        casCode: '',
        isDanger: ''
      },
      productAdd: true,
      judge_list: [],
      productList: null,
      // 用于保存产品临时数据，最后统一提交
      product_list: [],
      materialVisible: false,
      productVisible: false,
      listQuery: {
        page: 1,
        limit: 10,
        key: '',
        isPoisonHarm: '',
        isInflammableExplosive: '',
        formId: '',
        enterpriseId: this.enterpriseId,
        materialType: '',
        isDanger: ''
      },
      currentPage: 1, // 当前页数
      pageSize: 5,
      total: 0,
      totalNum: 0,
      totalNum1: 0,
      listQuery1: {
        page: 1,
        limit: 10,
        key: '',
        materialType: '',
        isDanger: '',
        ids: ''
      },
      listQuery2: {
        page: 1,
        limit: 10,
        key: '',
        materialType: '',
        isDanger: '',
        ids: ''
      },
      materialList: [],
      selectedList: [],
      materList: [],
      terminalList: [],
      list: [],
      listLoading: true,
      selRow: {},
      selection: [],
      materialSelection: [],
      addVisible: false
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

        // ]
      }
    }
  },
  created() {
    this.listQuery.enterpriseId = this.enterpriseId
    this.init()
  },
  watch: {
    formVisible(newValue) {
      if (!newValue) {
        this.resetForm()
      }
    },
    'enterpriseId': function() {
      this.listQuery.enterpriseId = this.enterpriseId
      this.fetchData()
    }
  },
  methods: {
    init() {
      this.listQuery.enterpriseId = this.enterpriseId
      this.fetchData()
    },
    fetchData() {
      this.list = []
      dsiProductInfoApi.getList(this.listQuery).then(response => {
        this.list = response.data.records
        this.selection = []
        this.$refs.productTable.clearSelection()
        this.total = response.data.total
        this.listLoading = false
      })
      getDicts('是否').then(response => {
        this.judge_list = response.data
      })
    },
    search() {
      this.fetchData1()
    },
    reset() {
      this.listQuery.key = ''
      this.listQuery.materialType = ''
      this.listQuery.isDanger = ''
      this.fetchData1()
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
    fetchPage1(page) {
      this.terminalList = this.selectedList.slice((page - 1) * this.pageSize, page * this.pageSize)
    },
    changeSize1(limit) {
      this.pageSize = limit
      this.fetchPage1(1)
    },
    fetchPage(page) {
      this.listQuery.page = page
      this.fetchData()
    },
    changeSize(limit) {
      this.listQuery.limit = limit
      this.fetchData()
    },
    fetchPage2(page) {
      this.listQuery2.page = page
      this.fetchData1()
    },
    changeSize2(limit) {
      this.listQuery2.limit = limit
      this.fetchData1()
    },
    fetchNext2() {
      this.listQuery2.page = this.listQuery2.page + 1
      this.fetchData1()
    },
    fetchPrev2() {
      this.listQuery2.page = this.listQuery2.page - 1
      this.fetchData1()
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
      this.selectedList = []
      this.terminalList = []
    },
    resetForm1() {
      this.form1 = {
        id: undefined,
        materialCode: undefined,
        chemistryName: undefined,
        englishName: undefined,
        shortName: undefined,
        materialType: undefined,
        physicochemicalProperties: undefined,
        healthHazards: undefined,
        dangerousCharacteristic: undefined,
        casCode: undefined,
        isDanger: undefined
      }
    },
    add() {
      this.resetForm()
      this.formTitle = '添加产品信息'
      this.isEdit = true
      this.productDetailVisible = true
      this.selection = []
      this.isAdd = true
      if (this.$refs['form']) {
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
            isRadioactivity: this.form.isRadioactivity,
            isCorrosive: this.form.isCorrosive,
            formId: this.form.formId,
            productModel: this.form.productModel,
            storageStandards: this.form.storageStandards,
            productDesc: this.form.productDesc,
            enterpriseId: this.enterpriseId
          }
          if (this.productAdd) {
            if (formData.id) {
              let productMaterialList = []
              dsiProductInfoApi.update(formData).then(() => {
                this.selectedList.forEach(item => {
                  const product = {
                    productId: formData.id,
                    materialId: item.id
                  }
                  productMaterialList.push(product)
                })
                dsiProductFromMaterialApi.deleteList(formData.id).then(() => {
                  if (productMaterialList.length > 0) {
                    dsiProductFromMaterialApi.addList(productMaterialList).then(() => {
                      this.$message({
                        message: this.$t('common.optionSuccess'),
                        type: 'success'
                      })
                      this.fetchData()
                      this.productDetailVisible = false
                    })
                  } else {
                    this.$message({
                      message: this.$t('common.optionSuccess'),
                      type: 'success'
                    })
                    this.fetchData()
                    this.productDetailVisible = false
                  }
                })
              })
            } else {
              let productMaterialList = []
              dsiProductInfoApi.add(formData).then(response => {
                this.selectedList.forEach(item => {
                  const product = {
                    productId: response.data.id,
                    materialId: item.id
                  }
                  productMaterialList.push(product)
                })
                if (productMaterialList.length > 0) {
                  dsiProductFromMaterialApi.addList(productMaterialList).then(() => {
                    this.$message({
                      message: this.$t('common.optionSuccess'),
                      type: 'success'
                    })
                    this.fetchData()
                    this.productDetailVisible = false
                  })
                } else {
                  this.$message({
                    message: this.$t('common.optionSuccess'),
                    type: 'success'
                  })
                  this.fetchData()
                  this.productDetailVisible = false
                }
              })
            }
          } else {
            return false
          }
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
    viewProductDetail(record) {
      this.selRow = record
      this.isEdit = false
      this.form = this.selRow
      this.formTitle = '查看产品信息'
      this.productDetail()
    },
    editProductDetail(record) {
      this.selRow = record
      this.isEdit = true
      this.form = this.selRow
      this.formTitle = '编辑产品信息'
      this.productDetail()
    },
    productDetail() {
      dsiProductFromMaterialApi.getList(this.selRow.id).then(response => {
        if (response.data.length) {
          let ids = ''
          for (let i = 0; i < response.data.length; i++) {
            if (i === 0) {
              ids = ids + response.data[i].materialId
            } else {
              ids = ids + ',' + response.data[i].materialId
            }
          }
          this.listQuery1.ids = ids
          dsiMaterialBaseinfoApi.getList(this.listQuery1).then(response => {
            this.selectedList = response.data.records
            this.listLoading = false
            this.totalNum = response.data.total
            this.productDetailVisible = true
            this.fetchPage1(1)
          })
        } else {
          this.selectedList = []
          this.total = 0
          this.productDetailVisible = true
          this.fetchPage1(1)
        }
      })
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
    selectMaterial() {
      this.isAdd = false
      this.formTitle = '选择原料'
      this.materialVisible = true
      this.reset()
      this.selection = []
      this.listQuery2.page = 1
      this.fetchData1()
      // dsiMaterialBaseinfoApi.getList(this.listQuery).then(response => {
      //   this.materialList = response.data.records
      //   this.listLoading = false
      //   this.total = response.data.total
      // })
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
            this.$refs.productTable.clearSelection()
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
        dsiProductInfoApi.removeBatch1(ids).then(() => {
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
    addMaterial() {
      this.formTitle = '添加原料'
      this.resetForm1()
      this.addVisible = true
      this.isAdd = true
    },
    saveMaterial() {
      this.$refs['form1'].validate((valid) => {
        if (valid) {
          const formData = {
            id: this.form1.id,
            materialCode: this.form1.materialCode,
            chemistryName: this.form1.chemistryName,
            englishName: this.form1.englishName,
            shortName: this.form1.shortName,
            materialType: this.form1.materialType,
            physicochemicalProperties: this.form1.physicochemicalProperties,
            healthHazards: this.form1.healthHazards,
            dangerousCharacteristic: this.form1.dangerousCharacteristic,
            casCode: this.form1.casCode,
            isDanger: this.form1.isDanger
          }
          if (formData.id) {
            dsiMaterialBaseinfoApi.update(formData).then(response => {
              this.$message({
                message: this.$t('common.optionSuccess'),
                type: 'success'
              })
              this.fetchData1()
              this.addVisible = false
            })
          } else {
            dsiMaterialBaseinfoApi.add(formData).then(response => {
              this.$message({
                message: this.$t('common.optionSuccess'),
                type: 'success'
              })
              this.fetchData1()
              this.addVisible = false
            })
          }
        } else {
          return false
        }
      })
    },
    fetchData1() {
      this.listLoading = true
      dsiMaterialBaseinfoApi.getList(this.listQuery2).then(response => {
        this.materialList = response.data.records
        this.selection = []
        this.$refs.materialTable.clearSelection()
        this.listLoading = false
        this.totalNum1 = response.data.total
      })
    },
    saveProduct() {
      let ids = this.selection.map(item => {
        return item.id
      })
      if (ids === null || ids.length === 0) {
        this.$alert('请先勾选产品信息！', '提示', {
          confirmButtonText: '确定'
        })
        return false
      }
      this.$message({
        message: this.$t('common.optionSuccess'),
        type: 'success'
      })
      this.selectedList.map(item => {
        this.selection.map((se, index) => {
          if (item.id === se.id) {
            this.selection.splice(index, 1)
          }
        })
      })
      this.selectedList = this.selectedList.concat(this.selection)
      this.totalNum = this.selectedList.length
      this.fetchPage1(1)
      this.materialVisible = false
      this.fetchData()
    },
    deleteMaterial() {
      this.$confirm(this.$t('common.deleteConfirm'), this.$t('common.tooltip'), {
        confirmButtonText: this.$t('button.submit'),
        cancelButtonText: this.$t('button.cancel'),
        type: 'warning'
      }).then(() => {
        this.selection.forEach(item => {
          this.selectedList.forEach((se, index) => {
            if (item.id === se.id) {
              this.selectedList.splice(index, 1)
            }
          })
        })
        this.totalNum = this.selectedList.length
        this.fetchPage1(1)
      })
    },
    toggleSelection(row) {
      this.$refs.productTable.toggleRowSelection(row)
    },
    closeDialog() {
      this.formVisible = false
      this.selection = []
      this.fetchData()
      this.$refs.productTable.clearSelection()
    },
    closeFatherDialog() {
      this.$emit('closeDialog')
    },
    toggleSelection1(row) {
      this.$refs.materialTable.toggleRowSelection(row)
    },
    toggleSelection2(row) {
      this.$refs.selectedMaterialTable.toggleRowSelection(row)
    }
    // handleSelectionChange(selection) {
    //   this.materialSelection = selection
    // }
  }
}
