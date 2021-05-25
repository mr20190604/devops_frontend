import dsiEnterpriseRiskUnitApi from '@/api/dsi/dsiEnterpriseRiskUnit'
import permission from '@/directive/permission/index.js'
import { remove, getList, save, update, getDicts } from '@/api/system/dict'
import dsiEnterpriseRiskMaterial from "../../../api/dsi/dsiEnterpriseRiskMaterial";

export default {
  directives: { permission },
  props:['enterpriseId'],
  data() {
    return {
      formVisible: false,
      formTitle: '添加数据资源一体化系统-企业信息-企业风险单元',
      isAdd: true,
      form: {
        riskName:'',
        enterpriseId:'',
        isDangerSource:'',
        riskType:[],
        headPerson:'',
        personTel:'',
        isDel:'',
        id: '',
        details:[],
        riskTypeName:'',
        detail:'',
      },
     /* form1:{
        materialId:'',
        riskUnitId:'',
        currentStock:'',
        criticalQuantity:''
      },*/
      isDangerSource:[],
      risk_type:[],
      listQuery: {
        page: 1,
        limit: 10,
        id: undefined
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
 // enterpriseRiskUnitTable:null,
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
        dsiEnterpriseRiskUnitApi.getList(this.listQuery).then(response => {
        this.list = response.data.records
          console.log(response.data.records);
        this.listLoading = false
        this.total = response.data.total
      })
      getDicts('风险类型').then(response =>{
        this.risk_type = response.data
      })
      getDicts('是否').then(response =>{
        this.isDangerSource = response.data
      })
    },
    search() {
      this.fetchData()
    },
    reset() {
      this.listQuery.riskName = ''
      this.listQuery.riskType = ''
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
        riskName:'',
        enterpriseId:'',
        isDangerSource:'',
        riskType:'',
        headPerson:'',
        personTel:'',
        isDel:'',
        id: '',
        details: [],
        detail: [],
      }
    },
    add() {
      this.resetForm();
      this.formTitle = '添加风险单元',
      this.formVisible = true
      //this.form=[];
      this.isAdd = true
      //this.materialAdd = true
     /* if(this.$refs['form'] !== undefined) {
        this.$refs['form'].resetFields()
      }*/
      //如果表单初始化有特殊处理需求,可以在resetForm中处理
          },
    save() {
      var self=this
      this.$refs['form'].validate((valid) => {
        if (valid) {
            const formData = {
                id:this.form.id,
                riskName:this.form.riskName,
                enterpriseId:this.form.enterpriseId,
                isDangerSource:this.form.isDangerSource,
                riskType:this.form.riskType,
                headPerson:this.form.headPerson,
                personTel:this.form.personTel,
                isDel:this.form.isDel,
            }
            if(formData.id){
                dsiEnterpriseRiskUnitApi.update(formData).then(response => {
                    this.$message({
                        message: this.$t('common.optionSuccess'),
                        type: 'success'
                    })
                    this.fetchData()
                    this.formVisible = false
                })
            }else{
                dsiEnterpriseRiskUnitApi.add(formData).then(response => {
                    this.$message({
                        message: this.$t('common.optionSuccess'),
                        type: 'success'
                    })
                  var riskId = response.data.id
                  console.log(self.form.details)
                  for (var item in self.form.details) {
                    const formData1 = {
                      riskUnitId:riskId,
                      materialId:self.form.details[item].materialId,
                      currentStock:self.form.details[item].currentStock,
                      criticalQuantity:self.form.details[item].criticalQuantity,
                    }
                    dsiEnterpriseRiskMaterial.add(formData1).then();
                  }
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
    editItem(record){
      this.selRow = record
      //this.materialAdd = false
      this.edit()
      // this.initEmerMaterialList(this.selRow.id)
    },
    edit() {
      if (this.checkSel()) {
        this.isAdd = false
        this.formTitle = '编辑风险单元'
        var detail = this.selRow.detail.split(';')
        var details = []
        detail.forEach(function (val, index) {
          var arr = val.split(',')
          details.push({'materialId': arr[0], 'currentStock': arr[1], 'criticalQuantity': arr[2]})
        })
        console.log(this.selRow);
        //this.form = { name: this.selRow.name, id: this.selRow.id, details: details, detail: this.selRow.detail }
        this.form.details = details;
        this.formVisible = true

      }
    },
    removeItem(record){
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
            dsiEnterpriseRiskUnitApi.remove(id).then(response => {
            this.$message({
              message: this.$t('common.optionSuccess'),
              type: 'success'
            })
            this.fetchData()
          }).catch( err=> {
            this.$notify.error({
              title: '错误',
              message: err
            })
          })
        }).catch(() => {
        })
      }
    },
    /*initEmerMaterialList(id){
      this.materialLoading = true
      if (id) {
        dsiEnterpriseRiskMaterial.listForUnitId(id).then(response =>{
          this.materialList = response.data
          this.materialList.forEach(item =>{
            this.material_type.forEach(index =>{
              if (item.materialType == index.id) {
                item.materialTypeName = index.name
              }
            })
            this.material_num_unit.forEach(index =>{
              if (item.chUnitId == index.id) {
                item.chUnitIdName = index.name
              }
            })
          })
        })
      } else {
        this.material_list.forEach(item =>{
          this.material_type.forEach(index =>{
            if (item.materialType == index.id) {
              item.materialTypeName = index.name
            }
          })
          this.material_num_unit.forEach(index =>{
            if (item.chUnitId == index.id) {
              item.chUnitIdName = index.name
            }
          })
        })
        this.materialList = this.material_list
      }

    },*/
    addDetail() {
      let details = this.form.details
      details.push({
        materialId: '',
        currentStock: '',
        criticalQuantity:''
      })
      this.form.details = details
    },
    removeDetail(detail) {
      let details = []
      this.form.details.forEach(function(val, index) {
        if (detail.materialId !== val.materialId) {
          details.push(val)
        }
      })
      this.form.details = details
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
        dsiEnterpriseRiskUnitApi.removeBatch1(ids).then(() => {
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
