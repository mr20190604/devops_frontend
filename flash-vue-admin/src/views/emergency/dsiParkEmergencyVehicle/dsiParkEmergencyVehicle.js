import dsiParkEmergencyVehicleApi from '@/api/emergency/dsiParkEmergencyVehicle'
import dsiEnterprise from '@/api/dsi/dsiEnterpriseBaseinfo.js'
import permission from '@/directive/permission/index.js'
import {getDicts} from "../../../api/system/dict";

export default {
  directives: { permission },
  constant:[dsiEnterprise],
  data() {
    return {
      formVisible: false,
      formTitle: '添加园区应急车辆',
      isAdd: true,
      form: {
        vehicleName:'',
        enterpriseId:'',
        enterpriseName:'',
        vehicleLicense:'',
        vehicleCode:'',
        vehicleType:'',
        //vehicleTypeName:'',
        vehicleModel:'',
        districtCode:'',
        vehicleResponsible:'',
        personTel:'',
        manufacturer:'',
        longitude:'',
        latitude:'',
        isDel:'',
        id: ''
      },
      //车辆类别
      vehicleType:[],
      //所属企业下拉
      enterprise_list:[],
      listQuery: {
        page: 1,
        limit: 10,
        id: undefined,

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
      dsiEnterprise.queryAll().then(response =>{
        this.enterprise_list = response.data
      })
      this.listLoading = true
        dsiParkEmergencyVehicleApi.getList(this.listQuery).then(response => {
        this.list = response.data.records
          this.enterprise_list.forEach(item =>{
            this.list.forEach(index =>{
              if (item.id == index.enterpriseId) {
                index.enterpriseName = item.enterpriseName
              }
            })
          })
        this.listLoading = false
        this.total = response.data.total
      });
      getDicts("车辆类别").then(response=>{
        this.vehicleType=response.data
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
        vehicleName:'',
        enterpriseId:'',
        vehicleLicense:'',
        vehicleCode:'',
        vehicleType:'',
        vehicleModel:'',
        districtCode:'',
        vehicleResponsible:'',
        personTel:'',
        manufacturer:'',
        longitude:'',
        latitude:'',
        isDel:'',
        id: ''
      }
    },
    add() {
      this.formTitle = '添加园区应急车辆',
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
                vehicleName:this.form.vehicleName,
                enterpriseId:this.form.enterpriseId,
                vehicleLicense:this.form.vehicleLicense,
                vehicleCode:this.form.vehicleCode,
                vehicleType:this.form.vehicleType,
                vehicleModel:this.form.vehicleModel,
                districtCode:this.form.districtCode,
                vehicleResponsible:this.form.vehicleResponsible,
                personTel:this.form.personTel,
                manufacturer:this.form.manufacturer,
                longitude:this.form.longitude,
                latitude:this.form.latitude,
                isDel:this.form.isDel,
            }
            if(formData.id){
                dsiParkEmergencyVehicleApi.update(formData).then(response => {
                    this.$message({
                        message: this.$t('common.optionSuccess'),
                        type: 'success'
                    })
                    this.fetchData()
                    this.formVisible = false
                })
            }else{
                dsiParkEmergencyVehicleApi.add(formData).then(response => {
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
        this.formTitle = '编辑园区应急车辆'
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
            dsiParkEmergencyVehicleApi.remove(id).then(response => {
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
