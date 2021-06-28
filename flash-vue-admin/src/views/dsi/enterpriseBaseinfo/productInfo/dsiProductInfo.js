import dsiProductInfoApi from '@/api/dsi/dsiProductInfo'
import permission from '@/directive/permission/index.js'
import {getDicts} from "../../../../api/system/dict";
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
      productDetailVisible:false,
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
      productVisible:false,
      listQuery: {
        page: 1,
        limit: 10,
        key: undefined,
        isPoisonHarm: undefined,
        isInflammableExplosive: undefined,
        formId: undefined,
        enterpriseId: this.enterpriseId,
        materialType:undefined,
        isDanger:undefined,
      },
      listQuery1: {
        page: 1,
        limit: 10,
        key: '',
        materialType: '',
        isDanger: '',
        ids: '',
      },
      materialList:[],
      selectedList:[],
      materList:[],
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
      //this.listQuery.enterpriseId=this.enterpriseId;
      dsiProductInfoApi.getList(this.listQuery).then(response => {
        console.log( response.data.records)
        this.list = response.data.records
        console.log(this.list);
        this.total = response.data.total
        this.$refs.productTable.clearSelection();
        this.listLoading = false
      });
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
    selectMaterial(record){
      this.isAdd = false
      this.form = record
      console.log(this.form.id);
      this.formTitle = '选择原料'
      this.materialVisible = true
      this.reset();
      this.fetchData1()
      this.$refs.materialTable.clearSelection();
      console.log(this.listQuery)
      dsiMaterialBaseinfoApi.getList(this.listQuery).then(response => {

        this.materialList = response.data.records

        this.listLoading = false
        this.total = response.data.total
      })
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
            this.$refs.productTable.clearSelection();
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
    addMaterial(){
      this.formTitle = '添加原料'
      this.addVisible = true
      this.isAdd = true
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
        this.$refs.materialTable.clearSelection();
        this.listLoading = false
        this.total = response.data.total
      })
    },
    saveProduct(){
      if(this.list.length>0){
        let ids = this.selection.map(item => {
          return item.id
        })
        if (ids === null || ids.length === 0) {
          this.$alert('请先勾选产品信息！', '提示', {
            confirmButtonText: '确定',
          });
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
        ids=[];
        this.materialVisible=false;
      }else {
        this.closeFatherDialog();
      }
      }
    ,toggleSelection(row) {
      this.$refs.productTable.toggleRowSelection(row)
    },
    closeDialog() {
      this.formVisible = false;
      this.selection = [];
      this.fetchData();
      this.$refs.productTable.clearSelection();
    },
    closeFatherDialog(){
      this.$emit("closeDialog");
    },
    toggleSelection1(row) {
      this.$refs.materialTable.toggleRowSelection(row)
    },
    fetchNext1() {
      this.listQuery1.page = this.listQuery1.page + 1
      this.viewProductDetail(this.selRow)
    },
    fetchPrev1() {
      this.listQuery1.page = this.listQuery1.page - 1
      this.viewProductDetail(this.selRow)
    },
    fetchPage1(page) {
      this.listQuery1.page = page
      this.viewProductDetail(this.selRow)
    },
    changeSize1(limit) {
      this.listQuery1.limit = limit
      this.viewProductDetail(this.selRow)
    },
    viewProductDetail(record){
      this.selRow = record
      this.form = this.selRow

      dsiProductFromMaterialApi.getList(record.id).then(response => {
        if (response.data.length) {
          let ids = '';
          this.formTitle = '查看产品信息';
          for (let i = 0; i < response.data.length; i++) {
            if (i == 0) {
              ids = ids + response.data[i].materialId;
            } else {
              ids = ids + ',' + response.data[i].materialId;
            }
          }
          this.listQuery1.ids=ids;
          dsiMaterialBaseinfoApi.getList(this.listQuery1).then(response => {
            this.selectedList = response.data.records;
            this.listLoading = false
            this.total=response.data.total;
            this.formTitle = '查看产品信息'
            this.productDetailVisible = true
          })
        }
      })
    },
  }
}
