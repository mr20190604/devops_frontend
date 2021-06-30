import permission from '@/directive/permission/index.js'
import handleRecordApi from '@/api/mm/mmInspectionHandleRecord'
import { getApiUrl } from '@/utils/utils'

export default {
  directives: { permission },
  props: ['planId', 'inspectionType'],
  data() {
    return {
      downloadUrl: '',
      files: null,
      previewTitle: '预览',
      previewVisible: false,
      equipDisplay: false,
      lineDisplay: false,
      list: null,
      listQuery: {
        page: 1,
        limit: 20,
        planId: undefined
      },
      total: 0
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
    this.downloadUrl = getApiUrl() + '/file/download?idFile='
    if (this.inspectionType === 260) {
      this.lineDisplay = true
    } else {
      this.equipDisplay = true
    }
    this.listQuery.planId = this.planId
    this.init()
  },
  methods: {
    init() {
      this.fetchData()
    },
    fetchData() {
      this.listLoading = true
      handleRecordApi.getList(this.listQuery).then(response => {
        this.list = response.data.records
        this.listLoading = false
        this.total = response.data.total
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
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
    previewFile(record) {
      this.previewVisible = true
      this.files = record.recordFileList
    }
  }
}
