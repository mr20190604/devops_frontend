import dsiParkEmergencyPersonApi from '@/api/emergency/dsiParkEmergencyPerson'
import permission from '@/directive/permission/index.js'
import {getDicts} from "../../../api/system/dict";

export default {
  directives: { permission },
  data() {
    return {
      formVisible: false,
      formTitle: '添加数据资源一体化子系统-园区应急资源库-应急人员信息',
      isAdd: true,
      form: {
        code:'',
        name:'',
        gender:'',
        educationName:'',
        professionalName:'',
        postName:'',
        majorSpecialty:'',
        districtCode:'',
        isExpert:'',
        tel:'',
        address:'',
        remark:'',
        isDel:'',
        id: ''
      },
      //是否专家
      isExpert:[],
      //性别
      sex:[],
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
        dsiParkEmergencyPersonApi.getList(this.listQuery).then(response => {
        this.list = response.data.records
        this.listLoading = false
        this.total = response.data.total
      });
      getDicts("是否").then(response=>{
        this.isExpert=response.data
      });
      getDicts("性别").then(response=>{
        this.sex=response.data
      });
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
        code:'',
        name:'',
        gender:'',
        educationName:'',
        professionalName:'',
        postName:'',
        majorSpecialty:'',
        districtCode:'',
        isExpert:'',
        tel:'',
        address:'',
        remark:'',
        isDel:'',
        id: ''
      }
    },
    add() {
      this.formTitle = '添加数据资源一体化子系统-园区应急资源库-应急人员信息',
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
                code:this.form.code,
                name:this.form.name,
                gender:this.form.gender,
                educationName:this.form.educationName,
                professionalName:this.form.professionalName,
                postName:this.form.postName,
                majorSpecialty:this.form.majorSpecialty,
                districtCode:this.form.districtCode,
                isExpert:this.form.isExpert,
                tel:this.form.tel,
                address:this.form.address,
                remark:this.form.remark,
                isDel:this.form.isDel,
            }
            if(formData.id){
                dsiParkEmergencyPersonApi.update(formData).then(response => {
                    this.$message({
                        message: this.$t('common.optionSuccess'),
                        type: 'success'
                    })
                    this.fetchData()
                    this.formVisible = false
                })
            }else{
                dsiParkEmergencyPersonApi.add(formData).then(response => {
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
        this.formTitle = '编辑数据资源一体化子系统-园区应急资源库-应急人员信息'
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
            dsiParkEmergencyPersonApi.remove(id).then(response => {
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
    }

  }
}
