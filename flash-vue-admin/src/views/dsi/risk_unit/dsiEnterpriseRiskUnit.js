import dsiEnterpriseRiskUnitApi from '@/api/dsi/dsiEnterpriseRiskUnit'
import permission from '@/directive/permission/index.js'
import { remove, getList, save, update, getDicts } from '@/api/system/dict'

export default {
  directives: { permission },
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
      risk_type:[],
      listQuery: {
        page: 1,
        limit: 20,
        id: undefined
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
        this.listLoading = false
        this.total = response.data.total
      })
      getDicts('风险类型').then(response =>{
        this.risk_type = response.data
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
    resetForm() {
      this.form = {
        riskName:'',
        enterpriseId:'',
        isDangerSource:'',
        riskType:'',
        headPerson:'',
        personTel:'',
        isDel:'',
        id: ''
      }
    },
    add() {
      this.resetForm;
      this.formTitle = '添加风险单元',
      this.formVisible = true
      this.isAdd = true

      if(this.$refs['form'] !== undefined) {
        this.$refs['form'].resetFields()
      }
      //如果表单初始化有特殊处理需求,可以在resetForm中处理
          },
    save() {
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
      this.edit()
    },
    edit() {
      if (this.checkSel()) {
        this.isAdd = false
        this.form = this.selRow
        this.formTitle = '编辑风险单元'
        this.formVisible = true

        if(this.$refs['form'] !== undefined) {
          this.$refs['form'].resetFields()
        }
        //如果表单初始化有特殊处理需求,可以在resetForm中处理
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
    }, addDetail() {
      var details = this.form.details

      details.push({
        materialId: '',
        currentStock: '',
        criticalQuantity:''
      })
      this.form.details = details
    }, removeDetail(detail) {
      var details = []
      this.form.details.forEach(function(val, index) {
        if (detail.materialId !== val.materialId) {
          details.push(val)
        }
      })
      this.form.details = details
    }

  }
}
