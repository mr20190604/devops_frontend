import dsiParkEmergencyTeamApi from '@/api/emergency/dsiParkEmergencyTeam'
import permission from '@/directive/permission/index.js'
import person from '@/api/emergency/dsiParkEmergencyPerson.js'
import enterprise from '@/api/dsi/dsiEnterpriseBaseinfo.js'


export default {
  directives: { permission,enterprise },
  constant:[person],
  data() {
    return {
      formVisible: false,
      formTitle: '添加数据资源一体化子系统-园区应急资源库-应急队伍信息',
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
      },

      personList:null,
      person_list:[],
      //获取应急人员下拉信息
      person_data:[],
      personLoading:true,
      enterprise_list:[],
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
        dsiParkEmergencyTeamApi.getList(this.listQuery).then(response => {
        this.list = response.data.records
        this.listLoading = false
        this.total = response.data.total
      })
      enterprise.queryAll().then(response =>{
        this.enterprise_list = response.data
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
      this.formTitle = '添加数据资源一体化子系统-园区应急资源库-应急队伍信息',
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
                isDel:this.form.isDel,
            }
            if(formData.id){
                dsiParkEmergencyTeamApi.update(formData).then(response => {
                    this.$message({
                        message: this.$t('common.optionSuccess'),
                        type: 'success'
                    })
                    this.fetchData()
                    this.formVisible = false
                })
            }else{
                dsiParkEmergencyTeamApi.add(formData).then(response => {
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
      this.personAdd = false
      this.edit()
      this.initPersonList(record.id)
    },
    edit() {
      if (this.checkSel()) {
        this.isAdd = false
        this.form = this.selRow
        this.formTitle = '编辑数据资源一体化子系统-园区应急资源库-应急队伍信息'
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
      if(teamId) {
        person.listForTeamId(teamId).then(response => {
          this.personList = response.data
        })
      } else {

      }
      this.personLoading = false
    },removePersonItem(record) {
      this.selRow = record

      if(this.personAdd) {

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
      person.queryListData(teamId).then(response =>{
        this.person_data = response.data
      })
      this.personForm.ids = []
    },addPerson(){
      var teamId = this.form.id
      if (teamId) {
        this.personForm.ids.forEach(item =>{
          const relaData = {
            teamId:teamId,
            personId:item
          }
          person.addRelation(relaData).then()
          this.personVisible = false
          this.initPersonList(teamId)

        })
      }



    }


  }
}
