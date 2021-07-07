import dsiParkEmergencyPersonApi from '@/api/emergency/dsiParkEmergencyPerson'
import permission from '@/directive/permission/index.js'
import district from '@/components/District/index'
import { remove, getList, save, update, getDicts } from '@/api/system/dict'
import dsiEnterprise from '@/api/dsi/dsiEnterpriseBaseinfo.js'

export default {
  directives: { permission },
  constant: [dsiEnterprise],
  component: { district },
  data() {
    return {
      formVisible: false,
      formTitle: '添加数据资源一体化子系统-园区应急资源库-应急人员信息',
      isAdd: true,
      form: {
        code: '',
        name: '',
        gender: '',
        educationName: '',
        professionalName: '',
        postName: '',
        majorSpecialty: '',
        districtCode: '',
        isExpert: '',
        tel: '',
        address: '',
        remark: '',
        isDel: '',
        id: '',
        workPlace: '',
        districtName: '',
        genderName: '',
        isExpertName: '',
        emergencyContact: '',
        emergencyTel: ''
      },
      // 是否专家
      isExpert: [],
      // 性别
      sex: [],
      listQuery: {
        page: 1,
        limit: 10,
        id: undefined,
        name: '',
        districtCode: '',
        workPlace: '',
        isExpert: ''
      },
      total: 0,
      list: [],
      listLoading: true,
      selRow: {},
      selection: [],
      editFlag:false,
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
      })
      getDicts('是否').then(response => {
        this.isExpert = response.data
      })
      getDicts('性别').then(response => {
        this.sex = response.data
      })
    },
    search() {
      this.fetchData()
    },
    reset() {
      this.listQuery.id = ''
      this.listQuery.name = ''
      this.listQuery.workPlace = ''
      this.listQuery.districtCode = ''
      this.listQuery.isExpert = ''
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
        code: '',
        name: '',
        gender: '',
        educationName: '',
        professionalName: '',
        postName: '',
        majorSpecialty: '',
        districtCode: '',
        isExpert: '',
        tel: '',
        address: '',
        remark: '',
        isDel: '',
        id: ''
      }
    },
    add() {
      this.resetForm()
      this.editFlag = false;
      this.formTitle = '新增应急人员',
      this.formVisible = true
      this.isAdd = true

      if (this.$refs['form'] !== undefined) {
        this.$refs['form'].resetFields()
      }
      // 如果表单初始化有特殊处理需求,可以在resetForm中处理
    },
    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          const formData = {
            id: this.form.id,
            code: this.form.code,
            name: this.form.name,
            gender: this.form.gender,
            educationName: this.form.educationName,
            professionalName: this.form.professionalName,
            postName: this.form.postName,
            majorSpecialty: this.form.majorSpecialty,
            districtCode: this.form.districtCode,
            isExpert: this.form.isExpert,
            tel: this.form.tel,
            address: this.form.address,
            remark: this.form.remark,
            isDel: this.form.isDel,
            workPlace: this.form.workPlace,
            emergencyContact: this.form.emergencyContact,
            emergencyTel: this.form.emergencyTel
          }
          if (formData.id) {
            dsiParkEmergencyPersonApi.update(formData).then(response => {
              this.$message({
                message: this.$t('common.optionSuccess'),
                type: 'success'
              })
              this.$refs.personTable.clearSelection()
              this.reset()
              this.fetchData()
              this.formVisible = false
            })
          } else {
            dsiParkEmergencyPersonApi.add(formData).then(response => {
              this.$message({
                message: this.$t('common.optionSuccess'),
                type: 'success'
              })
              this.$refs.personTable.clearSelection()
              this.reset()
              this.fetchData()
              this.formVisible = false
            })
          }
        } else {
          return false
        }
      })
    }, cancle() {
      this.$refs.personTable.clearSelection()
      this.reset()
      this.fetchData()
      this.formVisible = false
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
      this.selRow = JSON.parse(JSON.stringify(record))
      this.edit()
    },
    edit() {
      if (this.checkSel()) {
        this.editFlag = false;

        this.isAdd = false
        this.form = this.selRow
        this.formTitle = '修改人员信息'
        this.formVisible = true

        if (this.$refs['form'] !== undefined) {
          this.$refs['form'].resetFields()
        }
        // 如果表单初始化有特殊处理需求,可以在resetForm中处理
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
          dsiParkEmergencyPersonApi.remove(id).then(response => {
            this.$message({
              message: this.$t('common.optionSuccess'),
              type: 'success'
            })
            this.$refs.personTable.clearSelection()
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
    }, toggleSelection(row) {
      this.$refs.personTable.toggleRowSelection(row)
    }, handleSelectionChange(val) {
      this.selection = val
    }, batchDelete() {
      if (this.selection.length > 0) {
        this.$confirm(this.$t('common.deleteConfirm'), this.$t('common.tooltip'), {
          confirmButtonText: this.$t('button.submit'),
          cancelButtonText: this.$t('button.cancel'),
          type: 'warning'
        }).then(() => {
          const arr = []
          this.selection.forEach(item => {
            arr.push(item.id)
          })

          const format = {
            ids: arr
          }
          dsiParkEmergencyPersonApi.removeBatch(format).then(response => {
            this.$message({
              message: this.$t('common.optionSuccess'),
              type: 'success'
            })
            this.$refs.personTable.clearSelection()
            this.fetchData()
          }).catch(err => {
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
    },
    viewInfo(record) {
      this.form = JSON.parse(JSON.stringify(record));
      this.formTitle = '查看应急人员'
      this.formVisible = true
      this.editFlag = true;
      if (this.$refs['form'] !== undefined) {
        this.$refs['form'].resetFields()
      }

    }

  }
}
