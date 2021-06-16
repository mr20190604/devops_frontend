import mmInspectionPlanApi from '@/api/mm/mmInspectionPlan'
import mmInspectionPathApi from '@/api/mm/mmInspectionPath'
import permission from '@/directive/permission/index.js'
import lineList from '@/views/mm/mmInspectionPlan/lineList/index.vue'
import equipmentList from '@/views/mm/mmInspectionPlan/equipmentList/index.vue'

export default {
  directives: {permission},
  components: {
    lineList,
    equipmentList
  },

  data() {
    return {
      pathId:'',
      tableDisplay: 0,
      searchTime: '',
      formVisible: false,
      formTitle: '添加巡检巡查_巡检计划表',
      isAdd: true,
      inspectionPersonList: [],
      auditStatusList: [{
        value: 1,
        label: '待审核'
      }, {
        value: 2,
        label: '未通过'
      }, {
        value: 3,
        label: '已通过'
      }],
      overdueList: [{
        value: 1,
        label: '正常'
      }, {
        value: 2,
        label: '逾期'
      }],
      handleStatusList: [{
        value: 1,
        label: '未执行'
      }, {
        value: 2,
        label: '执行中'
      }, {
        value: 3,
        label: '已完成'
      }],
      pathList: [],
      form: {
        pathId: '',
        inspectType: '',
        inspectForm: '',
        startTime: '',
        endTime: '',
        auditStatus: 1,
        auditPerson: '',
        auditTime: '',
        planPerson: '',
        notes: '',
        isDel: '',
        id: '',
        handleStatus:1,
        isOverdue:1,
        personIdList:''
      },
      listQuery: {
        page: 1,
        limit: 20,
        id: undefined,
        searchTime: undefined,
        startTime: undefined,
        endTime: undefined,
      },
      total: 0,
      list: null,
      selRow: {}
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
    this.init()
  },
  methods: {
    init() {
      this.fetchData()
    },
    fetchData() {
      this.listLoading = true;
      mmInspectionPlanApi.getList(this.listQuery).then(response => {
        this.list = response.data.records;

        //用于拼接巡查人中的姓名
        let selfList = this.list;
        for(let i=0;i<selfList.length;i++){
          let personList = selfList[i].personList;
          let name = '';
          for(let j = 0;j<personList.length;j++){
            if('' === name){
              name = personList[j].user.name;
            }else {
              name += ',' + name;
            }
          }
          selfList[i].personNames = name;
        }

        this.listLoading = false;
        this.total = response.data.total
      });

      mmInspectionPathApi.listPath().then(response => {
        this.pathList = response.data;
      });
      mmInspectionPlanApi.listInspectionPerson().then(response => {
        this.inspectionPersonList = response.data;
      });
    },
    search() {
      if (this.listQuery.searchTime) {
        this.listQuery.startTime = this.listQuery.searchTime[0];
        this.listQuery.endTime = this.listQuery.searchTime[1]
      }

      this.fetchData()
    },
    reset() {
      this.listQuery.path = '';
      this.listQuery.auditStatus = '';
      this.listQuery.inspectType = '';
      this.listQuery.inspectForm = '';
      this.listQuery.searchTime = '';
      this.listQuery.isOverdue = '';
      this.listQuery.handleStatus = '';
      this.fetchData()
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
    resetForm() {
      this.searchTime = '';
      this.form = {
        pathId: '',
        inspectType: '',
        inspectForm: '',
        startTime: '',
        endTime: '',
        auditStatus: '',
        auditPerson: '',
        auditTime: '',
        planPerson: '',
        notes: '',
        isDel: '',
        id: '',
        personIdList:'',
      }
    },
    add() {
      this.formTitle = '添加巡检巡查_巡检计划表';
      this.formVisible = true;
      this.isAdd = true;

      if (this.$refs['form'] !== undefined) {
        this.$refs['form'].resetFields()
      }
      //如果表单初始化有特殊处理需求,可以在resetForm中处理
    },
    save() {
      this.form.startTime = this.searchTime[0];
      this.form.endTime = this.searchTime[1];

      this.$refs['form'].validate((valid) => {
        if (valid) {
          const formData = {
            id: this.form.id,
            pathId: this.form.pathId,
            inspectType: this.form.inspectType,
            inspectForm: this.form.inspectForm,
            startTime: this.form.startTime,
            endTime: this.form.endTime,
            auditStatus: this.form.auditStatus,
            auditPerson: this.form.auditPerson,
            auditTime: this.form.auditTime,
            notes: this.form.notes,
            isDel: this.form.isDel,
            handleStatus:this.form.handleStatus,
            isOverdue:this.form.isOverdue,
            personIdList:this.form.personIdList
          };
          if (formData.id) {
            mmInspectionPlanApi.update(formData).then(response => {
              this.$message({
                message: this.$t('common.optionSuccess'),
                type: 'success'
              });
              this.fetchData();
              this.formVisible = false
            })
          } else {
            mmInspectionPlanApi.add(formData).then(response => {
              this.$message({
                message: this.$t('common.optionSuccess'),
                type: 'success'
              });
              this.fetchData();
              this.formVisible = false
            })
          }
        } else {
          return false
        }
      });

      this.resetForm();

    },
    checkSel() {
      if (this.selRow && this.selRow.id) {
        return true
      }
      this.$message({
        message: this.$t('common.mustSelectOne'),
        type: 'warning'
      });
      return false
    },
    editItem(record) {
      this.selRow = record;
      this.edit()
    },
    edit() {
      if (this.checkSel()) {
        this.isAdd = false;
        this.form = this.selRow;
        this.formTitle = '编辑巡检巡查_巡检计划表';
        this.formVisible = true;

        if (this.$refs['form'] !== undefined) {
          this.$refs['form'].resetFields()
        }
        //如果表单初始化有特殊处理需求,可以在resetForm中处理
      }
    },
    removeItem(record) {
      this.selRow = record;
      this.remove()
    },
    remove() {
      if (this.checkSel()) {
        let id = this.selRow.id;
        this.$confirm(this.$t('common.deleteConfirm'), this.$t('common.tooltip'), {
          confirmButtonText: this.$t('button.submit'),
          cancelButtonText: this.$t('button.cancel'),
          type: 'warning'
        }).then(() => {
          mmInspectionPlanApi.remove(id).then(response => {
            this.$message({
              message: this.$t('common.optionSuccess'),
              type: 'success'
            });
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
    changePath(event, item) {
      this.pathId = event;
    }

  },
  watch: {
    'form.inspectType': {
      handler(newName, oldName) {
        if (newName) {
          if (newName === 260) {
            this.tableDisplay = 1;
          } else {
            this.tableDisplay = 2;
          }
        } else {
          this.tableDisplay = 0
        }

      },
      immediate: true
    }
  }
}
