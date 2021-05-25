import dsiProductInfoApi from '@/api/dsi/dsiProductInfo'
import permission from '@/directive/permission/index.js'
import {getDicts} from "../../../api/system/dict";
import materialInfo from '@/views/dsi/dsiMaterialBaseinfo/index.vue';
import dsiMaterialBaseinfoApi from '@/api/dsi/dsiMaterialBaseinfo';
import dsiProductFromMaterialApi from '@/api/dsi/dsiProductFromMaterial';
export default {
  directives: { permission },
  props:['enterpriseId'],
  component:{
    materialInfo
  },
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
        enterpriseId: this.enterpriseId,
        isCorrosive:'',
        isRadioactivity:'',
        storageStandards:'',
        productDesc:'',
        productModel:'',
        isPoisonHarmName:'',
        isInflammableExplosiveName:'',
        isCorrosiveName:'',
        isRadioactivityName:'',
        id: ''
      },
      productAdd:true,
      judge_list:[],
      productList:null,
      //用于保存产品临时数据，最后统一提交
      product_list:[],
      materialVisible: false,
      listQuery: {
        page: 1,
        limit: 10,
        key: undefined,
        isPoisonHarm: undefined,
        isInflammableExplosive: undefined,
        formId: undefined,
        enterpriseId: this.enterpriseId
      },
      materialList:[],
      total: 0,
      list: [],
      listLoading: true,
      selRow: {},
      selection: [],
      addVisible:false
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
    console.log(this.enterpriseId);
    this.listQuery.enterpriseId=this.enterpriseId;
    this.init()
  },
  watch: {
    formVisible(newValue) {
      if (!newValue) {
        this.resetForm()
      }
    },
    'enterpriseId':function () {
      this.listQuery.enterpriseId=this.enterpriseId;
      this.fetchData();
    }
  },
  methods: {
    init() {
      this.listQuery.enterpriseId=this.enterpriseId;
      this.fetchData()

    },
    fetchData() {
      // this.listLoading = true
      this.listQuery.enterpriseId=this.enterpriseId;
      dsiProductInfoApi.getList(this.listQuery).then(response => {
        this.list = response.data.records
        console.log(this.list);
        this.total = response.data.total
        this.listLoading = false
      });
      getDicts('是否').then(response => {
        this.judge_list = response.data
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
            enterpriseId: this.enterpriseId,
          }
          if (this.productAdd) {
            if (formData.id) {
              dsiProductInfoApi.update(formData).then(response => {
                this.$message({
                  message: this.$t('common.optionSuccess'),
                  type: 'success'
                })

                this.formVisible = false;
                this.fetchData();
              })
            } else {
              dsiProductInfoApi.add(formData).then(response => {
                this.fetchData()
                this.formVisible = false
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
    selectMaterial(){
      if (this.checkSel()) {
        this.isAdd = false
        this.form = this.selRow
        console.log(this.form.id);
        this.formTitle = '选择原料'
        this.materialVisible = true
        dsiMaterialBaseinfoApi.getList(this.listQuery).then(response => {
          this.materialList = response.data.records
          this.listLoading = false
          this.total = response.data.total
        })
      }
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
    addMaterial(){
      this.formTitle = '添加原料'
      this.addVisible = true
      this.isAdd = true

     /* if (this.$refs['form'] !== undefined) {
        this.$refs['form'].resetFields()
      }*/
    },
    saveMaterial(){

        this.$refs['form1'].validate((valid) => {
          if (valid) {
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
      dsiMaterialBaseinfoApi.getList(this.listQuery).then(response => {
        this.materialList = response.data.records
        this.listLoading = false
        this.total = response.data.total
      })
    },
    saveProduct(){
      let ids = this.selection.map(item => {
        return item.id
      })


      if (ids === null || ids.length === 0) {
        this.$message({
          message: this.$t('common.mustSelectOne'),
          type: 'warning'
        })
        return false
      }
      for(let i=0;i<ids.length;i++) {
        const formMaterial = {
          id: '',
          productId: this.form.id,
          materialId: ids[i]
        }
        dsiProductFromMaterialApi.add(formMaterial);
      }
          this.$message({
            message: this.$t('common.optionSuccess'),
            type: 'success'
          })
          this.fetchData();
          this.materialVisible=false;

      },

    viewProduct(){
      if (this.checkSel()) {
        this.isAdd = false
        this.form = this.selRow
        console.log(this.form.id);
        this.formTitle = '查看产品信息'
        this.productVisible = true
        dsiProductFromMaterialApi.getList(this.listQuery).then(response => {
          this.materialList = response.data.records
          this.listLoading = false
          this.total = response.data.total
        })
      }
    }

  }
}
