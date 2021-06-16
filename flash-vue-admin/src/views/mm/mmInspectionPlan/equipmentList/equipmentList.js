import permission from '@/directive/permission/index.js'
import equipList from '@/views/mm/mmInspectionPlan/equipmentList/equipList/index.vue'

export default {
  directives: {permission},
  props:['pathId'],
  components: {
    equipList
  },
  data() {
    return {
      dialogDisplay:false,
      routeId:'',
      currentPage: 1,// 当前页数
      pageSize:5,// 每页条数
      total: 0,
      list: [],
      equipList:[]
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
    this.routeId = this.pathId;
    this.init()
  },
  methods: {
    init() {
      this.fetchData()
    },
    fetchData() {
      this.listLoading = true;
      this.list = this.equipList;
      this.listLoading = false;
    },
    fetchPage(page) {
      this.list = this.equipList.slice((page-1)*this.pageSize,page*this.pageSize);
    },
    changeSize(limit) {
      this.pageSize = limit;
      this.fetchPage(1);
    },
    selectEquip(){
      this.dialogDisplay = true;
    },
    getEquipList(data){
      this.dialogDisplay = false;
      let list = this.equipList;
      let tmpList = list.concat(data);
      this.equipList = this.unique(tmpList);
      this.total = this.equipList.length;
      this.fetchPage(1);
    },
    //去重对象数组
    unique(arr) {
      const res = new Map();
      return arr.filter((arr) => !res.has(arr.id) && res.set(arr.id, 1));
    },

  }
}
