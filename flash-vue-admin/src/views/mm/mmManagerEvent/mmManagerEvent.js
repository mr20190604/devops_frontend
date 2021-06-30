import mmManagerEventApi from '@/api/mm/mmManagerEvent'
import permission from '@/directive/permission/index'
import { getApiUrl, getPreviewUrl } from '@/utils/utils'
import { getToken } from '@/utils/auth'

export default {
  directives: { permission },
  data() {
    return {
      uploadUrl: '',
      uploadHeaders: {
        'Authorization': ''
      },
      fileList: [],
      multiple: true,
      fileLimit: 10,
      mmManagerEventFiles: [],
      formVisible: false,
      formTitle: '添加应急事件',
      isAdd: true,
      mmManagerEvent: {
        eventCode: '',
        eventName: '',
        eventType: '',
        eventAddress: '',
        eventDesc: '',
        id: ''
      },
      listQuery: {
        page: 1,
        limit: 10,
        key: undefined,
        eventType: undefined
      },
      total: 0,
      list: [],
      listLoading: true,
      selRow: {},
      selection: [],
      previewVisible: false,
      downloadUrl: '',
      files: null,
      fileLoading: true
    }
  },
  watch: {
    formVisible: function(newValue) {
      if (!newValue) {
        this.resetForm()
      }
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
      this.downloadUrl = getApiUrl() + '/file/download?idFile='
      this.uploadUrl = getApiUrl() + '/file'
      this.uploadHeaders['Authorization'] = getToken()
    },
    fetchData() {
      this.listLoading = true
      mmManagerEventApi.getList(this.listQuery).then(response => {
        this.list = response.data.records
        this.listLoading = false
        this.total = response.data.total
      })
    },
    search() {
      this.fetchData()
    },
    reset() {
      this.listQuery.key = undefined
      this.listQuery.eventType = undefined
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
      this.mmManagerEvent = {
        eventCode: '',
        eventName: '',
        eventType: '',
        eventAddress: '',
        eventDesc: '',
        id: ''
      }
    },
    add() {
      this.resetForm()
      this.formTitle = '添加应急事件'
      this.formVisible = true
      this.isAdd = true

      if (this.$refs['form'] !== undefined) {
        this.$refs['form'].resetFields()
      }
    },
    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          const formData = {
            id: this.mmManagerEvent.id,
            eventCode: this.mmManagerEvent.eventCode,
            eventName: this.mmManagerEvent.eventName,
            eventType: this.mmManagerEvent.eventType,
            eventAddress: this.mmManagerEvent.eventAddress,
            eventDesc: this.mmManagerEvent.eventDesc,
            eventModel: this.mmManagerEvent.eventModel,
            mmManagerEventFiles: this.mmManagerEventFiles
          }
          if (formData.id) {
            mmManagerEventApi.update(formData).then(response => {
              this.$message({
                message: this.$t('common.optionSuccess'),
                type: 'success'
              })
              this.fetchData()
              this.formVisible = false
            })
          } else {
            mmManagerEventApi.add(formData).then(() => {
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
      const self = this
      self.fileList = []
      self.selRow = record
      self.mmManagerEventFiles = record.mmManagerEventFiles
      self.mmManagerEventFiles.forEach(item => {
        self.fileList.push({
          name: item.fileInfo.originalFileName,
          status: 'success',
          response: { data: { id: item.fileId }}
        })
      })
      self.edit()
    },
    handlePreview(row) {
      this.previewVisible = true
      mmManagerEventApi.queryFilesByEventId({ eventId: row.id }).then(response => {
        this.files = response.data
      })
      this.fileLoading = false
    },
    closeDialog() {
      this.$refs.form.resetFields()
      this.fileList = []
      this.formVisible = false
    },
    clearForm(done) {
      Object.assign(this.$data, this.$options.data())
    },
    edit() {
      if (this.checkSel()) {
        this.isAdd = false
        this.mmManagerEvent = this.selRow
        this.formTitle = '编辑应急事件'
        this.formVisible = true

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
          mmManagerEventApi.remove(id).then(response => {
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
        mmManagerEventApi.removeBatch(ids).then(() => {
          this.$message({
            message: this.$t('common.optionSuccess'),
            type: 'success'
          })
          this.$refs.eventTable.clearSelection()
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
    handleChangeUpload(file, fileList) {
    },
    uploadSuccess(response, file, fileList) {
      this.fileList = fileList
      this.mmManagerEventFiles.push(
        { eventId: -1, fileId: response.data.id }
      )
      /* if (response.code === 20000) {
        this.form.fileId = response.data.id
      } else {
        this.$message({
          message: this.$t('common.uploadError'),
          type: 'error'
        })
      }*/
    },
    removeFile(file, fileList) {
      const self = this
      const params = { idFile: file.response.data.id }
      /** 这里需要先调用删除后台文件及数据库中的文件数据，成功后页面上的数据变更*/
      mmManagerEventApi.deleteFile(params).then(response => {
        if (response.success) {
          /** 删除中间表*/
          mmManagerEventApi.deleteFileMid({ fileId: file.response.data.id }).then(response => {
            if (response.success) {
              self.fileList = fileList
              this.mmManagerEventFiles.splice(this.mmManagerEventFiles.findIndex(item => item.fileId === file.response.data.id), 1)
            }
          })
        }
      })
    }, toggleSelection(row) {
      this.$refs.eventTable.toggleRowSelection(row)
    }

  }
}
