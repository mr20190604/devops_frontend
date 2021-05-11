import mmBasBuildApi from '@/api/mm/mmBasBuild'
import permission from '@/directive/permission/index.js'

export default {
  directives: { permission },
  data() {
    return {
      formVisible: false,
      formTitle: '添加地上建筑物（包含危险源和防护目标）',
      isAdd: true,
      form: {
        code:'',
        buildName:'',
        targetType:'',
        dictBuildId:'',
        levelCode:'',
        classCode:'',
        districtCode:'',
        roadName:'',
        address:'',
        dutyTel:'',
        fax:'',
        personName:'',
        personOtel:'',
        personMtel:'',
        personHtel:'',
        contactper:'',
        contactperOtel:'',
        contactperMtel:'',
        contactperHtel:'',
        contactperEmail:'',
        governingEnterprise:'',
        governingEnterpriseAddr:'',
        coordsyscode:'',
        elevationCode:'',
        personNum:'',
        description:'',
        traffic:'',
        inuseDate:'',
        useYearNum:'',
        emergencyCommunicaMode:'',
        disasterForm:'',
        defLevelCode:'',
        defenceArea:'',
        maxPersonNum:'',
        monitorMode:'',
        defenceStep:'',
        datasourceUnit:'',
        notes:'',
        sysFlag:'',
        isDel:'',
        id: ''
      },
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
        mmBasBuildApi.getList(this.listQuery).then(response => {
        this.list = response.data.records
        this.listLoading = false
        this.total = response.data.total
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
        buildName:'',
        targetType:'',
        dictBuildId:'',
        levelCode:'',
        classCode:'',
        districtCode:'',
        roadName:'',
        address:'',
        dutyTel:'',
        fax:'',
        personName:'',
        personOtel:'',
        personMtel:'',
        personHtel:'',
        contactper:'',
        contactperOtel:'',
        contactperMtel:'',
        contactperHtel:'',
        contactperEmail:'',
        governingEnterprise:'',
        governingEnterpriseAddr:'',
        coordsyscode:'',
        elevationCode:'',
        personNum:'',
        description:'',
        traffic:'',
        inuseDate:'',
        useYearNum:'',
        emergencyCommunicaMode:'',
        disasterForm:'',
        defLevelCode:'',
        defenceArea:'',
        maxPersonNum:'',
        monitorMode:'',
        defenceStep:'',
        datasourceUnit:'',
        notes:'',
        sysFlag:'',
        isDel:'',
        id: ''
      }
    },
    add() {
      this.formTitle = '添加地上建筑物（包含危险源和防护目标）',
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
                buildName:this.form.buildName,
                targetType:this.form.targetType,
                dictBuildId:this.form.dictBuildId,
                levelCode:this.form.levelCode,
                classCode:this.form.classCode,
                districtCode:this.form.districtCode,
                roadName:this.form.roadName,
                address:this.form.address,
                dutyTel:this.form.dutyTel,
                fax:this.form.fax,
                personName:this.form.personName,
                personOtel:this.form.personOtel,
                personMtel:this.form.personMtel,
                personHtel:this.form.personHtel,
                contactper:this.form.contactper,
                contactperOtel:this.form.contactperOtel,
                contactperMtel:this.form.contactperMtel,
                contactperHtel:this.form.contactperHtel,
                contactperEmail:this.form.contactperEmail,
                governingEnterprise:this.form.governingEnterprise,
                governingEnterpriseAddr:this.form.governingEnterpriseAddr,
                coordsyscode:this.form.coordsyscode,
                elevationCode:this.form.elevationCode,
                personNum:this.form.personNum,
                description:this.form.description,
                traffic:this.form.traffic,
                inuseDate:this.form.inuseDate,
                useYearNum:this.form.useYearNum,
                emergencyCommunicaMode:this.form.emergencyCommunicaMode,
                disasterForm:this.form.disasterForm,
                defLevelCode:this.form.defLevelCode,
                defenceArea:this.form.defenceArea,
                maxPersonNum:this.form.maxPersonNum,
                monitorMode:this.form.monitorMode,
                defenceStep:this.form.defenceStep,
                datasourceUnit:this.form.datasourceUnit,
                notes:this.form.notes,
                sysFlag:this.form.sysFlag,
                isDel:this.form.isDel,
            }
            if(formData.id){
                mmBasBuildApi.update(formData).then(response => {
                    this.$message({
                        message: this.$t('common.optionSuccess'),
                        type: 'success'
                    })
                    this.fetchData()
                    this.formVisible = false
                })
            }else{
                mmBasBuildApi.add(formData).then(response => {
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
        this.formTitle = '编辑地上建筑物（包含危险源和防护目标）'
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
            mmBasBuildApi.remove(id).then(response => {
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
