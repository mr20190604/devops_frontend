import dsiEnterpriseBaseinfoApi from '@/api/dsi/dsiEnterpriseBaseinfo'
import permission from '@/directive/permission/index.js'
import {remove, getList, save, update, getDicts} from '@/api/system/dict'
import district from '@/components/District/index'
import productInfo from '@/views/dsi/dsiProductInfo/index.vue'
import unitInfo from '@/views/dsi/enterpriseBaseinfo/unitInfo/unitInfo.vue'

export default {
  directives: {permission},
  components:{
    productInfo,
    district,
    unitInfo
  },
  data() {
    return {
      enterpriseId:'',
      activeName:'first',
      formVisible: false,
      enterpriseVisible:false,
      formTitle: '添加数据资源一体化子系统--企业信息',
      isAdd: true,
      form: {
        code: '',
        enterpriseName: '',
        enterpriseAddress: '',
        riskLevel: '',
        legalPerson: '',
        registerCode: '',
        envSafeLeader: '',
        emergencyWorker: '',
        emergencyTeam: '',
        parkId: '',
        industryId: '',
        districtCode: '',
        managementSituation: [],
        employmentNo: '',
        isDangerSource: '',
        foreignUnit: '',
        enterpriseOtel: '',
        enterpriseFax: '',
        enterpriseEmergencyTel: '',
        enterpriseEmail: '',
        isDel: '',
        id: '',
        managementSituationName: '',
        riskLevelName: '',
        districtName: ''
      },
      listQuery: {
        page: 1,
        limit: 10,
        id: undefined,
        districtCode: undefined,
        enterpriseName: undefined,
        managementSituation: undefined,
        enterpriseAddress: undefined,
        legalPerson: undefined,
        riskLevel: undefined
      },
      //经营状态下拉数据
      management_status: [],
      //风险等级下拉数据
      risk_level: [],
      //行政区划下拉数据
      district: [],
      //所属行业下拉数据
      industry_list:[],
      total: 0,
      list: [],
      listLoading: true,
      selRow: {},
      selection: [],
    }
  },
  enterpriseTable:null,
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
      dsiEnterpriseBaseinfoApi.getList(this.listQuery).then(response => {
        this.list = response.data.records
        this.listLoading = false
        this.total = response.data.total
      });
      getDicts('经营状态').then(response => {
        this.management_status = response.data
      });
      getDicts('风险等级').then(response => {
        this.risk_level = response.data
      })

      getDicts('所属行业').then(response => {
        this.industry_list = response.data
      })

    },
    search() {
      this.fetchData()
    },
    reset() {
      this.listQuery.districtCode = ''
      this.listQuery.enterpriseName = ''
      this.listQuery.managementSituation = ''
      this.listQuery.enterpriseAddress = ''
      this.listQuery.legalPerson = ''
      this.listQuery.riskLevel = ''
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
        code: '',
        enterpriseName: '',
        enterpriseAddress: '',
        riskLevel: '',
        legalPerson: '',
        registerCode: '',
        envSafeLeader: '',
        emergencyWorker: '',
        emergencyTeam: '',
        parkId: '',
        industryId: '',
        districtCode: '',
        employmentNo: '',
        isDangerSource: '',
        foreignUnit: '',
        enterpriseOtel: '',
        enterpriseFax: '',
        enterpriseEmergencyTel: '',
        enterpriseEmail: '',
        isDel: '',
        id: ''
      }
    },
    add() {
      this.resetForm()
      this.formTitle = '添加企业信息',
        this.activeName="first"

        this.formVisible = true
      this.isAdd = true
      if (this.$refs['form'] !== undefined) {
        this.$refs['form'].resetFields()
      }
      //如果表单初始化有特殊处理需求,可以在resetForm中处理
    },
    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          const formData = {
            id: this.form.id,
            code: this.form.code,
            enterpriseName: this.form.enterpriseName,
            enterpriseAddress: this.form.enterpriseAddress,
            riskLevel: this.form.riskLevel,
            legalPerson: this.form.legalPerson,
            registerCode: this.form.registerCode,
            envSafeLeader: this.form.envSafeLeader,
            emergencyWorker: this.form.emergencyWorker,
            emergencyTeam: this.form.emergencyTeam,
            parkId: this.form.parkId,
            industryId: this.form.industryId,
            districtCode: this.form.districtCode,
            employmentNo: this.form.employmentNo,
            isDangerSource: this.form.isDangerSource,
            foreignUnit: this.form.foreignUnit,
            enterpriseOtel: this.form.enterpriseOtel,
            enterpriseFax: this.form.enterpriseFax,
            enterpriseEmergencyTel: this.form.enterpriseEmergencyTel,
            enterpriseEmail: this.form.enterpriseEmail,
            isDel: this.form.isDel,
            managementSituation: this.form.managementSituation,
            enterpriseNature: this.form.enterpriseNature
          }
          if (formData.id) {
            dsiEnterpriseBaseinfoApi.update(formData).then(response => {
              this.$message({
                message: this.$t('common.optionSuccess'),
                type: 'success'
              })
              this.activeName="second";
              /*this.fetchData()
              this. = false*/

            })
          } else {
            dsiEnterpriseBaseinfoApi.add(formData).then(response => {
              this.enterpriseId = response.data.id;
              this.enterpriseName=response.data.enterpriseName;
              if(this.enterpriseId) {
                 this.activeName="second";
              } else {
                this.activeName = 'first';
              }
             /* this.fetchData()
              this.formVisible = false*/
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
    editItem(record) {
      this.selRow = record
      this.edit()
    },
    edit() {
      if (this.checkSel()) {
        this.isAdd = false
        this.form = this.selRow
        this.enterpriseId=this.form.id;
        this.formTitle = '编辑企业信息'
        // this.activeName="first"
        this.formVisible = true

        if (this.$refs['form'] !== undefined) {
          this.$refs['form'].resetFields()
        }
        //如果表单初始化有特殊处理需求,可以在resetForm中处理
      }
    },
    removeItem(record) {
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
          dsiEnterpriseBaseinfoApi.remove(id).then(response => {
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
        dsiEnterpriseBaseinfoApi.removeBatch1(ids).then(() => {
          this.$message({
            message: this.$t('common.optionSuccess'),
            type: 'success'
          })
          this.$refs.enterpriseTable.clearSelection();
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
    viewMaterial(){
      if (this.checkSel()) {
        this.isAdd = false
        this.form = this.selRow
        this.formTitle = '查看企业信息'
        this.enterpriseVisible = true
        if (this.$refs['form'] !== undefined) {
          this.$refs['form'].resetFields()
        }
        //如果表单初始化有特殊处理需求,可以在resetForm中处理
      }
    },
    handleClick(activeName, oldActiveName) {
      let self = this;
      if(!this.enterpriseId){
        alert("请先添加企业信息！");
        return false;
      }
      return true
    },toggleSelection(row) {
      this.$refs.enterpriseTable.toggleRowSelection(row)
    }
    }

  }
