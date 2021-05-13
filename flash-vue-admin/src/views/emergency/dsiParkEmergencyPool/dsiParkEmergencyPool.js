import dsiParkEmergencyPoolApi from '@/api/emergency/dsiParkEmergencyPool'
import permission from '@/directive/permission/index.js'
import dsiParkEmergency from '@/api/emergency/dsiParkEmergencyMaterial.js'
import dsiEnterprise from '@/api/dsi/dsiEnterpriseBaseinfo.js'
import { remove, getList, save, update, getDicts } from '@/api/system/dict'
import district from '@/components/District/index'

export default {
  directives: { permission },
  constant:[dsiParkEmergency,dsiEnterprise,district],
  data() {
    return {
      formVisible: false,
      formTitle: '添加数据资源一体化子系统-园区应急资源库-应急资源信息',
      isAdd: true,
      form: {
        code:'',
        repositoriesName:'',
        personName:'',
        personTel:'',
        enterpriseId:'',
        enterpriseName:'',
        address:'',
        longitude:'',
        latitude:'',
        isDel:'',
        id: ''
      },
      materialVisible: false,
      materialTitle: '添加数据资源一体化子系统-园区应急资源库-应急资源信息',
      materialForm:{
        code:'',
        materialName:'',
        materialType:'',
        materialTypeName:'',
        materialNum:'',
        chUnitId:'',
        chUnitIdName:'',
        validityTerm:'',
        poolId:'',
        isDel:'',
        id:''
      },
      materialList:null,
      //用于保存应急物资临时数据，最后统一提交
      material_list:[],
      materialLoading:true,
      //所属企业下拉
      enterprise_list:[],
      //应急物资下拉类型数据
      material_type:[],
      //应急物资数量单位下拉类型
      material_num_unit:[],
      //应急资源新增、修改判定字段
      materialAdd:true,
      listQuery: {
        page: 1,
        limit: 20,
        districtCode: undefined,
        id: undefined
      },
      total: 0,
      list: null,
      listLoading: true,
      selRow: {},
      materialRow:{},
      selectMonth:null
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
        dsiParkEmergencyPoolApi.getList(this.listQuery).then(response => {
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
      })



      getDicts('应急物资类型').then(response =>{
        this.material_type = response.data
      })
      getDicts('应急物资数量单位').then(response =>{
        this.material_num_unit = response.data
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
        code:'',
        repositoriesName:'',
        personName:'',
        personTel:'',
        enterpriseId:'',
        address:'',
        longitude:'',
        latitude:'',
        isDel:'',
        id: ''
      }
    },
    add() {
      this.resetForm()
      this.materialList = null
      this.formTitle = '添加数据资源一体化子系统-园区应急资源库-应急资源信息',
      this.formVisible = true
      this.isAdd = true
      this.materialAdd = true

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
                repositoriesName:this.form.repositoriesName,
                personName:this.form.personName,
                personTel:this.form.personTel,
                enterpriseId:this.form.enterpriseId,
                address:this.form.address,
                longitude:this.form.longitude,
                latitude:this.form.latitude,
                isDel:this.form.isDel,
            }
            if(formData.id){
                dsiParkEmergencyPoolApi.update(formData).then(response => {
                    this.$message({
                        message: this.$t('common.optionSuccess'),
                        type: 'success'
                    })
                    this.fetchData()
                    this.formVisible = false
                })
            }else{
                dsiParkEmergencyPoolApi.add(formData).then(response => {
                    this.$message({
                        message: this.$t('common.optionSuccess'),
                        type: 'success'
                    })
                  var poolId = response.data.id
                  this.material_list.forEach(item =>{
                    item.poolId = poolId
                    dsiParkEmergency.add(item).then()
                  })
                  this.material_list = [];
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
      this.materialAdd = false
      this.edit()
      this.initMaterialList(this.selRow.id)
    },
    edit() {
      if (this.checkSel()) {
        this.isAdd = false
        this.form = this.selRow
        this.formTitle = '编辑数据资源一体化子系统-园区应急资源库-应急资源信息'
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
            dsiParkEmergencyPoolApi.remove(id).then(response => {
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
    },initMaterialList(id){
      this.materialLoading = true
      if (id) {
        dsiParkEmergency.listForPoolId(id).then(response =>{
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

    },resetMaterialForm(){
      this.materialForm = {
        code:'',
        materialName:'',
        materialType:'',
        materialNum:'',
        chUnitId:'',
        validityTerm:'',
        poolId:'',
        isDel:'',
        id:''
      }
    }, addMaterial() {
      this.resetMaterialForm()
      this.materialVisible = true
      this.materialTitle = '添加应急物资信息'

    },editMaterialItem(record) {
      this.resetMaterialForm()
      this.materialVisible = true
      this.materialTitle = '编辑应急物资信息'
      this.materialForm = record

    },saveMaterial(){
      this.$refs['materialForm'].validate((valid) => {
        if (valid) {
         var a =  this.materialForm.validityTerm
          if (a) {
            a = a +" 00:00:00";
          } else {
            a = ""
          }

          const formData = {
            id: this.materialForm.id,
            materialName: this.materialForm.materialName,
            materialType: this.materialForm.materialType,
            chUnitId: this.materialForm.chUnitId,
            materialNum: this.materialForm.materialNum,
            validityTermStr: a,
            poolId: this.form.id,
            materialTypeName: null,
            chUnitIdName:null
          }
          if (this.materialAdd) {
            var arr = [];
            this.material_list.forEach(item =>{
              if(item.materialName != formData.materialName) {
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
              dsiParkEmergency.update(formData).then(response =>{
                this.$message({
                  message: this.$t('common.optionSuccess'),
                  type: 'success'
                })

              })
            } else {
              dsiParkEmergency.add(formData).then(response =>{
                this.$message({
                  message: this.$t('common.optionSuccess'),
                  type: 'success'
                })

              })

            }
          }
        }
        else {
          return false
        }
        this.initMaterialList(this.form.id)
        this.materialVisible = false

      })

    },removeMaterial(record){
      if (!record.id) {
        var arr = [];
        var index = this.material_list.indexOf(record)
        for(var i = 0;i < this.material_list.length;i++) {
          if (index != i) {
            arr.push(this.material_list[i])
          }
        }
      this.material_list = arr;
        this.initMaterialList(this.form.id)

      } else {
        if (this.checkSel()) {
          var id = record.id
          this.$confirm(this.$t('common.deleteConfirm'), this.$t('common.tooltip'), {
            confirmButtonText: this.$t('button.submit'),
            cancelButtonText: this.$t('button.cancel'),
            type: 'warning'
          }).then(() => {
            dsiParkEmergency.remove(id).then(response => {
              this.$message({
                message: this.$t('common.optionSuccess'),
                type: 'success'
              })
              this.initMaterialList(this.form.id)
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


    }, initData(data) {
      //获取当前时间
      var now   = new Date();
      var monthn = now.getMonth()+1;
      var yearn  = now.getFullYear();
      this.selectMonth = yearn+"-"+monthn
    }

  }
}