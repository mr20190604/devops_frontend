import mmInspectionPlanApi from '@/api/mm/mmInspectionPlan'
import permission from '@/directive/permission/index.js'

export default {
  directives: {permission},
  props:['routeId'],
  data() {
    return {
      selection:[],
      listQuery: {
        page: 1,
        limit: 20,
        id: undefined,
      },
      total: 0,
      list: null,
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      };
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
    this.listQuery.id = this.routeId;
    this.init()
  },
  methods: {
    init() {
      this.fetchData()
    },
    fetchData() {
      this.listLoading = true;
      mmInspectionPlanApi.listEquipByPath(this.listQuery).then(response => {
        this.list = response.data.records;
        this.listLoading = false;
        this.total = response.data.total
      });
    },

    handleFilter() {
      this.listQuery.page = 1;
      this.getList()
    },
    handleClose() {

    },
    fetchNext() {
      this.listQuery.page = this.listQuery.page + 1;
      this.fetchData()
    },
    fetchPrev() {
      this.listQuery.page = this.listQuery.page - 1;
      this.fetchData()
    },
    fetchPage(page) {
      this.listQuery.page = page;
      this.fetchData()
    },
    changeSize(limit) {
      this.listQuery.limit = limit;
      this.fetchData()
    },
    handleCurrentChange(currentRow, oldCurrentRow) {
      this.selRow = currentRow
    },
    handleSelectionChange(selection) {
      this.selection = selection
    },
    submitEquip(){
      this.$emit('getEquipList',this.selection);

    }
  }
}
