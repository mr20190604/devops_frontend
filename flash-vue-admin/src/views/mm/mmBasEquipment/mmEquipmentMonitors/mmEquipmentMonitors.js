import mmEquipmentMonitorsApi from '@/api/mm/mmEquipmentMonitors'
import permission from '@/directive/permission/index.js'

export default {
  directives: { permission },
  props: [
    'equipmentId',
    'isAdd'
  ],
  data() {
    return {
      formVisible: false,
      formTitle: '添加设备监测类型',
      form: {
        equipmentId: this.equipmentId,
        monitorId: '',
        monitorCode: '',
        id: ''
      },
      listQuery: {
        key: '',
        page: 1,
        limit: 10,
        num: undefined,
        name: undefined,
        equipmentId: undefined
      },
      listQuery1: {
        key: '',
        page: 1,
        limit: 10,
        num: undefined,
        name: undefined,
        equipmentId: undefined
      },
      currentPage: 1, // 当前页数
      currentPage1: 1, // 当前页数
      pageSize: 10,
      pageSize1: 10,
      total: 0,
      total1: 0,
      list: [],
      selectedList: [],
      fetchList: [],
      value: [],
      listLoading: true,
      listLoading1: true,
      selRow: {},
      selRow1: {},
      selection: [],
      selection1: []
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
    this.listQuery.equipmentId = this.equipmentId
    this.init()
  },
  watch: {
    'equipmentId': function() {
      this.listQuery.equipmentId = this.equipmentId
      this.init()
    }
  },
  methods: {
    init() {
      if (this.equipmentId) {
        this.fetchData()
        this.fetchSelectedData()
      }
    },
    fetchSelectedData() {
      this.listLoading1 = true
      this.listQuery1.equipmentId = this.equipmentId
      mmEquipmentMonitorsApi.getSelectedList(this.listQuery1).then(response => {
        this.selectedList = response.records
        this.total1 = response.total
        this.listLoading1 = false
      })
    },
    fetchData() {
      this.listLoading = true
      this.listQuery.equipmentId = this.equipmentId
      mmEquipmentMonitorsApi.getList(this.listQuery).then(response => {
        this.listLoading = false
        this.list = response.records
        this.total = response.total
        /* response.allList.forEach(item => {
          this.list.push({
            label: item.name,
            key: item.id + '-' + item.num
          })
        })
        response.selectedList.forEach(item => {
          this.value.push(
            item.id + '-' + item.num
          )
        })
        console.log(this.value)
        this.total = this.list.length
        this.fetchPage(1)
        this.listLoading = false*/
      })
    },
    search() {
      this.listQuery.page = 1
      this.listQuery1 = this.listQuery
      this.fetchData()
      this.fetchSelectedData()
    },
    reset() {
      this.listQuery.name = ''
      this.listQuery.num = ''
      this.listQuery1.name = ''
      this.listQuery1.num = ''
      this.fetchData()
      this.fetchSelectedData()
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleClose() {

    },
    handleSelectionChange(selection) {
      this.selection = selection
    },
    handleSelectionChange1(selection) {
      this.selection1 = selection
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
    fetchNext1() {
      this.listQuery1.page = this.listQuery1.page + 1
      this.fetchSelectedData()
    },
    fetchPrev1() {
      this.listQuery1.page = this.listQuery1.page - 1
      this.fetchSelectedData()
    },
    fetchPage1(page) {
      this.listQuery1.page = page
      this.fetchSelectedData()
    },
    changeSize1(limit) {
      this.listQuery1.limit = limit
      this.fetchSelectedData()
    },
    handleCurrentChange(currentRow, oldCurrentRow) {
      this.selRow = currentRow
    },
    handleCurrentChange1(currentRow, oldCurrentRow) {
      this.selRow1 = currentRow
    },
    toggleSelection(row) {
      this.$refs.allMonitorMaterial.toggleRowSelection(row)
    },
    toggleSelection1(row) {
      this.$refs.selectedMonitorMaterial.toggleRowSelection(row)
    },
    addMonitor() {
      const allList = []
      if (this.selection.length > 0) {
        this.selection.forEach(item => {
          const formData = {
            equipmentId: this.equipmentId,
            monitorId: item.id,
            monitorCode: item.num
          }
          allList.push(formData)
        })
        mmEquipmentMonitorsApi.add(allList).then(() => {
          this.$refs.allMonitorMaterial.clearSelection()
          this.selection = []
          this.init()
        })
      } else {
        return false
      }
    },
    removeMonitor() {
      if (this.selection1.length > 0) {
        let ids = this.selection1.map(item => {
          return item.id
        })
        ids = ids.join(',')
        ids = ids + ',' + this.equipmentId
        if (ids === null || ids.length === 0) {
          return false
        } else {
          mmEquipmentMonitorsApi.removeBatch(ids).then(() => {
            this.$refs.selectedMonitorMaterial.clearSelection()
            this.selection1 = []
            this.init()
          })
        }
      } else {
        return false
      }
    },
    filterMethod(query, item) {
      return item.label.indexOf(query) > -1
    },
    saveMonitors() {
      const allList = []
      this.value.forEach(item => {
        const temList = item.split('-')
        const formData = {
          equipmentId: this.equipmentId,
          monitorId: temList[0],
          monitorCode: temList[1]
        }
        allList.push(formData)
      })
      if (this.isadd) {
        mmEquipmentMonitorsApi.add(allList).then(() => {
          this.$message({
            message: this.$t('common.optionSuccess'),
            type: 'success'
          })
        })
      } else {
        mmEquipmentMonitorsApi.remove(this.equipmentId).then(() => {
          if (allList.length > 0) {
            mmEquipmentMonitorsApi.add(allList).then(() => {
              this.$message({
                message: this.$t('common.optionSuccess'),
                type: 'success'
              })
            })
          }
        })
      }
    }

  }
}
