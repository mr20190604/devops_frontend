import dsiParkEmergencyTeamApi from '@/api/emergency/dsiParkEmergencyTeam'
import permission from '@/directive/permission/index.js'
import person from '@/api/emergency/dsiParkEmergencyPerson.js'
import enterprise from '@/api/dsi/dsiEnterpriseBaseinfo.js'
import district from '@/components/District/index'
import {remove, getList, save, update, getDicts} from '@/api/system/dict'




export default {
  directives: { permission,enterprise },
  constant:[person],
  component:{district},
  data() {
    return {
      formVisible: false,
      formTitle: '添加数据资源 ',
      isAdd: true,
      form: {
        code:'',
        name:'',
        address:'',
        longitude:'',
        latitude:'',
        teamNature:'',
        belongingUnit:'',
        teamProperties:'',
        personNumber:'',
        teamEquipment:'',
        personContact:'',
        personTel:'',
        remark:'',
        isDel:'',
        id: ''
      },
      //应急人员查看dialog展示标识
      viewVisible:false,
      personVisible: false,
      personTitle: '添加应急人员信息',
      personAdd: true,
      personForm: {
        code:'',
        name:'',
        gender:'',
        genderName:'',
        educationName:'',
        professionalName:'',
        postName:'',
        majorSpecialty:'',
        districtCode:'',
        isExpert:'',
        isExpertName:'',
        tel:'',
        address:'',
        personTel:'',
        remark:'',
        isDel:'',
        id: '',
        relationId:'',
        ids:[],
        workPlace:'',
        districtName:'',
        emergencyContact:'',
        emergencyTel:''
      },

      personList:null,
      person_id_list:[],
      //获取应急人员下拉信息
      person_data:null,
      personLoading:true,
      enterprise_list:[],
      //专家下拉数据
      isExpert:[],
      //性别
      sex:[],
      listQuery: {
        page: 1,
        limit: 10,
        id: undefined,
        name:undefined,
        districtCode:undefined,
        personContact:undefined,

      },
      total: 0,
      list: null,
      listLoading: true,
      selRow: {},
      personSelRow:{},
      multipleSelection: []
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
        dsiParkEmergencyTeamApi.getList(this.listQuery).then(response => {
        this.list = response.data.records
        this.listLoading = false
        this.total = response.data.total
      })
      enterprise.queryAll().then(response =>{
        this.enterprise_list = response.data
      })

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
      this.listQuery.name = ''
      this.listQuery.districtCode = ''
      this.listQuery.personContact = ''
      this.listQuery.belongingUnit = ''
      this.listQuery.address = ''
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
        address:'',
        longitude:'',
        latitude:'',
        teamNature:'',
        belongingUnit:'',
        teamProperties:'',
        personNumber:'',
        teamEquipment:'',
        personContact:'',
        personTel:'',
        remark:'',
        isDel:'',
        id: ''
      }
    },
    add() {
      this.resetForm()
      this.personList = null
      this.person_id_list = []
      this.personAdd = true
      this.formTitle = '添加应急队伍',
      this.formVisible = true
      this.isAdd = true
      this.personLoading = false
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
                address:this.form.address,
                longitude:this.form.longitude,
                latitude:this.form.latitude,
                teamNature:this.form.teamNature,
                belongingUnit:this.form.belongingUnit,
                teamProperties:this.form.teamProperties,
                personNumber:this.form.personNumber,
                teamEquipment:this.form.teamEquipment,
                personContact:this.form.personContact,
                personTel:this.form.personTel,
                remark:this.form.remark,
            }
            if(formData.id){
                dsiParkEmergencyTeamApi.update(formData).then(response => {
                    this.$message({
                        message: this.$t('common.optionSuccess'),
                        type: 'success'
                    })
                    this.$refs.teamTable.clearSelection();
                    this.reset()
                    this.fetchData()
                    this.formVisible = false
                })
            }else{
              //区分应急队伍是新建还是修改，如果是新建，则应急人员id从定义的数组中获取
                dsiParkEmergencyTeamApi.add(formData).then(response => {
                    this.$message({
                        message: this.$t('common.optionSuccess'),
                        type: 'success'
                    })
                  var teamId = response.data.id
                  this.person_id_list.forEach(item =>{
                    const formData = {
                      teamId:teamId,
                      personId:item
                    }
                    person.addRelation(formData).then()
                  })
                    this.$refs.teamTable.clearSelection();
                    this.reset()
                    this.fetchData()
                    this.formVisible = false
                })
            }
        } else {
          return false
        }
      })
    },cancle() {
      if (this.personVisible) {
        this.personVisible = false
        this.initPersonList(this.form.id)
      } else {
        this.$refs.teamTable.clearSelection();
        this.reset()
        this.fetchData()
        this.formVisible = false
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
    editItem(record){
      this.selRow = record
      this.edit()
      this.initPersonList(record.id)
    },
    edit() {
      this.personAdd = false
      if (this.checkSel()) {
        this.isAdd = false
        this.form = this.selRow
        this.formTitle = '编辑应急队伍'
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
            dsiParkEmergencyTeamApi.remove(id).then(response => {
            this.$message({
              message: this.$t('common.optionSuccess'),
              type: 'success'
            })
              this.$refs.teamTable.clearSelection()
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
    },initPersonList(teamId) {
      //初始化应急人员信息列表
      if(this.personAdd) {
        let permission = this.person_id_list.join(",")
        person.queryListByIds(permission).then(response =>{
          this.personList = response.data
        })
      } else {
        person.listForTeamId(teamId).then(response => {
          this.personList = response.data
        })
      }
      this.personLoading = false
    },removePersonItem(record) {
      this.selRow = record

      if(this.personAdd) {
        var arr = [];
        this.person_id_list.forEach(item =>{
          if (item != record.id) {
            arr.push(item)
          }
        })
        this.person_id_list = arr;
        this.initPersonList(null)
      } else {
        if (this.checkSel()) {
          var id = this.selRow.relationId
          this.$confirm(this.$t('common.deleteConfirm'), this.$t('common.tooltip'), {
            confirmButtonText: this.$t('button.submit'),
            cancelButtonText: this.$t('button.cancel'),
            type: 'warning'
          }).then(() => {
            person.removeRelation(id).then(response => {
              this.$message({
                message: this.$t('common.optionSuccess'),
                type: 'success'
              })
              this.initPersonList(this.form.id)
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

    },choosePerson(){
      this.personVisible = true
      this.personTitle = '选择应急人员'
      var teamId = this.form.id
      if (this.personAdd) {
        let permission = this.person_id_list.join(",")
        person.queryNotInIds(permission).then(response =>{
          this.person_data = response.data
        })
      } else {
        person.queryListData(teamId).then(response =>{
          this.person_data = response.data
        })
      }

      this.personForm.ids = []
    },addPerson(){
      var teamId = this.form.id
      if (teamId) {
        //如果存在teamid则为修改，此时提交直接保存数据到后台数据库，不进行临时保存
        //如果选中框为空，则直接关闭页面
       if(this.multipleSelection) {
         this.multipleSelection.forEach(item=>{
           const relaData = {
             teamId:teamId,
             personId:item.id
           }
           // this.person_id_list.push(item.id)
           person.addRelation(relaData).then(item=>{
               this.initPersonList(teamId)
           })
         })
       }
        this.personVisible = false

      } else {
        if(this.multipleSelection) {
          this.multipleSelection.forEach(item =>{
            this.person_id_list.push(item.id)
          })
        }
        this.initPersonList(null)
        this.personVisible = false

      }
    },viewPerson(record) {
        this.personSelRow = record
        this.personForm = this.personSelRow
        this.personTitle = '应急人员信息查看'
        this.viewVisible = true

        if(this.$refs['personForm'] !== undefined) {
          this.$refs['personForm'].resetFields()
        }
        //如果表单初始化有特殊处理需求,可以在resetForm中处理
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },toggleSelection(row) {
      this.$refs.teamTable.toggleRowSelection(row)
    },personToggleSelection(row) {
      this.$refs.emergencyPersonTable.toggleRowSelection(row)
    },batchDelete() {
      if (this.multipleSelection.length > 0) {
        this.$confirm(this.$t('common.deleteConfirm'), this.$t('common.tooltip'), {
          confirmButtonText: this.$t('button.submit'),
          cancelButtonText: this.$t('button.cancel'),
          type: 'warning'
        }).then(() => {
          let arr = [];
          this.multipleSelection.forEach(item =>{
            arr.push(item.id)
          })

          const format = {
            ids:arr
          }
          dsiParkEmergencyTeamApi.removeBatch(format).then(response =>{
            this.$message({
              message: this.$t('common.optionSuccess'),
              type: 'success'
            })
            this.$refs.teamTable.clearSelection();
            this.fetchData();
          }).catch(err =>{
            this.$notify.error({
              title: '错误',
              message: err
            })
          })
        }).catch(() => {
        })

      } else {
        this.$message({
          message: this.$t('请选择要删除的行'),
          type: 'warning'
        })
      }
    }


  }
}
