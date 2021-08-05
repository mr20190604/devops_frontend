import mmEquipmentMonitorsApi from '@/api/mm/mmEquipmentMonitors'
import permission from '@/directive/permission/index.js'

export default {
  directives: { permission },
  props: ['equipmentId', 'isAdd'],
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
        page: 1,
        limit: 10,
        num: undefined,
        name: undefined,
        equipmentId: undefined
      },
      currentPage: 1, // 当前页数
      pageSize: 10,
      total: 0,
      list: [],
      selectedList: null,
      fetchList: [],
      value: [],
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
      this.fetchData()
    }
  },
  methods: {
    init() {
      if (this.equipmentId) {
        this.fetchData()
      }
    },
    fetchData() {
      this.listLoading = true
      this.listQuery.equipmentId = this.equipmentId
      mmEquipmentMonitorsApi.getList(this.listQuery).then(response => {
        console.log(response.selectedList)
        response.allList.forEach(item => {
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
        this.listLoading = false
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
      this.fetchList = this.list.slice((page - 1) * this.pageSize, page * this.pageSize)
    },
    changeSize(limit) {
      this.pageSize = limit
      this.fetchPage(1)
    },
    handleCurrentChange(currentRow, oldCurrentRow) {
      this.selRow = currentRow
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
