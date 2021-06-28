import permission from '@/directive/permission/index.js'
import equipList from '@/views/mm/mmInspectionPlan/equipmentList/equipList/index.vue'
import mmInspectionPlanApi from '@/api/mm/mmInspectionPlan'

export default {
  directives: { permission },
  props: ['pathId', 'equipBtnDisplay', 'planId', 'isAdd'],
  components: {
    equipList
  },
  data() {
    return {
      dialogDisplay: false,
      routeId: '',
      currentPage: 1, // 当前页数
      pageSize: 5, // 每页条数
      total: 0,
      list: [],
      equipList: [],
      inspectionEquipmentList: []
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
    if (!this.isAdd) {
      mmInspectionPlanApi.listInspectionEquip({ 'id': this.planId }).then(response => {
        this.equipList = response.data
        this.total = this.equipList.length
        this.fetchData()
      })
    }
    this.routeId = this.pathId
    this.init()
  },
  methods: {
    init() {
      this.fetchData()
    },
    fetchData() {
      this.listLoading = true
      this.list = this.equipList
      this.listLoading = false
    },
    fetchPage(page) {
      this.list = this.equipList.slice((page - 1) * this.pageSize, page * this.pageSize)
    },
    changeSize(limit) {
      this.pageSize = limit
      this.fetchPage(1)
    },
    selectEquip() {
      if (this.routeId === '') {
        this.$message({
          message: '请先选择路线',
          type: 'success'
        })
        return
      }
      this.dialogDisplay = true
    },
    // 从子组件中获取选中的设备数据
    getEquipList(data) {
      this.dialogDisplay = false
      const list = this.equipList
      const tmpList = list.concat(data)
      this.equipList = this.unique(tmpList)
      this.total = this.equipList.length
      this.fetchPage(1)
      // 将最新的设备数据传送给父组件
      this.$emit('getEquipList', this.equipList)
    },
    // 去重对象数组
    unique(arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.id) && res.set(arr.id, 1))
    },
    removeEquip(record) {
      const id = record.id
      const equipList = this.equipList
      for (let i = 0; i < equipList.length; i++) {
        if (equipList[i].id === id) {
          equipList.splice(i, 1)
        }
      }
      this.equipList = equipList
      this.total = this.equipList.length
      this.fetchData(1)
      // 在页面删除设备时，重新传给父页面新的设备数据
      this.getEquipList(this.equipList)
    }

  },
  watch: {
    pathId: {
      handler(newName, oldName) {
        this.routeId = newName
        this.equipList = []
        this.fetchData(1)
      }
    }
  }

}
