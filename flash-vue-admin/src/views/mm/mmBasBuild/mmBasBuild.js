import mmBasBuildApi from '@/api/mm/mmBasBuild'
import permission from '@/directive/permission/index'

export default {
  directives: { permission },
  data() {
    return {
      formVisible: false,
      formTitle: '添加地上建筑物',
      isAdd: true,
      form: {
        buildName: '',
        targetType: '',
        dictBuildId: '',
        levelCode: '',
        districtCode: '',
        longitude: '',
        latitude: '',
        address: '',
        personOtel: '',
        personName: '',
        personNum: '',
        notes: '',
        id: '',
        lngAndLat: undefined
      },
      listQuery: {
        page: 1,
        limit: 10,
        buildName: undefined,
        districtCode: undefined,
        levelCode: undefined,
        personName: undefined,
        targetType: undefined
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
  watch: {
    formVisible(newValue) {
      if (!newValue) {
        this.resetForm()
      }
    },
    form(value) {
      this.form.lngAndLat = (value.longitude && value.latitude) ? value.longitude + ',' + value.latitude : ''
    }
  },
  computed: {
    // 表单验证
    rules() {
      return {
        buildName: [
          { required: true, message: '建筑名称' + this.$t('common.isRequired'), trigger: 'blur' }
        ],
        levelCode: [
          { required: true, message: '防护等级' + this.$t('common.isRequired'), trigger: 'blur' }
        ],
        targetType: [
          { required: true, message: '目标类型' + this.$t('common.isRequired'), trigger: 'blur' }
        ],
        dictBuildId: [
          { required: true, message: '建筑用途' + this.$t('common.isRequired'), trigger: 'blur' }
        ],
        districtCode: [
          { required: true, message: '所在地区' + this.$t('common.isRequired'), trigger: 'blur' }
        ],
        address: [
          { required: true, message: '地址' + this.$t('common.isRequired'), trigger: 'blur' }
        ],
        personName: [
          { required: true, message: '负责人' + this.$t('common.isRequired'), trigger: 'blur' }
        ],
        personOtel: [
          { required: true, message: '办公电话' + this.$t('common.isRequired'), trigger: 'blur' },
          { pattern: /^\d{3,4}\-\d{7,8}$/, message: '办公电话格式不合法', trigger: 'blur' }
        ],
        personNum: [
          { required: true, message: '人数' + this.$t('common.isRequired'), trigger: 'blur' }
        ],
        engrossArea: [
          { required: true, message: '面积' + this.$t('common.isRequired'), trigger: 'blur' }
        ],
        lngAndLat: [
          { required: true, message: '经纬度' + this.$t('common.isRequired'), trigger: 'blur' }
        ]
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
      this.listQuery.buildName = undefined
      this.listQuery.districtCode = undefined
      this.listQuery.levelCode = undefined
      this.listQuery.personName = undefined
      this.listQuery.targetType = undefined
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
    handleCurrentChange(currentRow) {
      this.selRow = currentRow
    },
    handleSelectionChange(selection) {
      this.selection = selection
    },
    resetForm() {
      this.form = {
        buildName: '',
        targetType: '',
        dictBuildId: '',
        levelCode: '',
        districtCode: '',
        address: '',
        personOtel: '',
        personName: '',
        personNum: '',
        notes: '',
        id: ''
      }
    },
    add() {
      this.formTitle = '添加地上建筑物'
      this.formVisible = true
      this.isAdd = true
      this.resetForm()
    },
    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          const formData = this.form

          delete formData.createTime
          delete formData.modifyTime

          const array = formData.lngAndLat.split(',')
          if (array.length === 2) {
            formData.longitude = array[0]
            formData.latitude = array[1]
          }

          if (formData.id) {
            mmBasBuildApi.update(formData).then(() => {
              this.$message({
                message: this.$t('common.optionSuccess'),
                type: 'success'
              })
              this.fetchData()
              this.formVisible = false
            })
          } else {
            mmBasBuildApi.add(formData).then(() => {
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
    editItem(record) {
      this.selRow = record
      this.edit()
    },
    edit() {
      if (this.checkSel()) {
        this.isAdd = false
        this.form = JSON.parse(JSON.stringify(this.selRow))
        this.formTitle = '编辑地上建筑物'
        this.formVisible = true
        if (this.$refs['form'] !== undefined) {
          this.$refs['form'].resetFields()
        }
      }
    },
    removeItem(record) {
      this.selRow = record
      this.remove()
    },
    remove() {
      if (this.checkSel()) {
        const id = this.selRow.id
        this.$confirm(this.$t('common.deleteConfirm'), this.$t('common.tooltip'), {
          confirmButtonText: this.$t('button.submit'),
          cancelButtonText: this.$t('button.cancel'),
          type: 'warning'
        }).then(() => {
          mmBasBuildApi.remove(id).then(() => {
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
        mmBasBuildApi.removeBatch(ids).then(() => {
          this.$message({
            message: this.$t('common.optionSuccess'),
            type: 'success'
          })
          this.$refs.buildTable.clearSelection()
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
    toggleSelection(row) {
      this.$refs.buildTable.toggleRowSelection(row)
    }
  }
}
