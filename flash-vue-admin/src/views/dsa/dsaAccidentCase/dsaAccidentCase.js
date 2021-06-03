import dsaAccidentCaseApi from '@/api/dsa/dsaAccidentCase'
import permission from '@/directive/permission/index.js'
import {getDicts} from "../../../api/system/dict";

export default {
  directives: {permission},
  data() {
    return {
      formVisible: false,
      formTitle: '添加事故案例库',
      isAdd: true,
      form: {
        accidentName: '',
        accidentTime: '',
        accidentAddress: '',
        deathToll: '',
        accidentType: '',
        accidentDesc: '',
        industryId: '',
        isDel: '',
        accidentTypeName: '',
        industryTypeName: '',
        id: ''
      },
      //事故类型
      accident_type: [],
      //所属行业
      industry_type: [],
      listQuery: {
        page: 1,
        limit: 10,
        id: undefined,
        accidentName:undefined,
        accidentAddress:undefined,
        accidentType:undefined,
        industryId:undefined,
        accidentTime:undefined,
        startTime:undefined,
        endTime:undefined,
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
      console.log(this.listQuery.accidentTime);
      if(this.listQuery.accidentTime){
        this.listQuery.startTime=this.listQuery.accidentTime[0];
        this.listQuery.endTime=this.listQuery.accidentTime[1];
      }
      dsaAccidentCaseApi.getList(this.listQuery).then(response => {
        this.list = response.data.records
        this.listLoading = false
        this.total = response.data.total
      });
      getDicts("事件类型").then(response => {
        this.accident_type = response.data
      });
      getDicts("所属行业").then(response => {
        this.industry_type = response.data
      });
    },
    search() {
      this.fetchData()
    },
    reset() {
      this.listQuery.accidentName = '';
      this.listQuery.accidentAddress = '';
      this.listQuery.accidentType = '';
      this.listQuery.industryId = '';
      this.listQuery.accidentTime = '';
      this.listQuery.startTime='';
      this.listQuery.endTime='';

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
        accidentName: '',
        accidentTime: '',
        accidentAddress: '',
        deathToll: '',
        accidentType: '',
        accidentDesc: '',
        industryId: '',
        isDel: '',
        id: ''
      }
    },
    add() {
      this.resetForm(),
        this.formTitle = '添加事故案例库',
        this.formVisible = true
      this.isAdd = true

      if (this.$refs['form'] !== undefined) {
        this.$refs['form'].resetFields()
      }
      //如果表单初始化有特殊处理需求,可以在resetForm中处理
    },
    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          const formData = {
            id: this.form.id,
            accidentName: this.form.accidentName,
            accidentTime: this.form.accidentTime,
            accidentAddress: this.form.accidentAddress,
            deathToll: this.form.deathToll,
            accidentType: this.form.accidentType,
            accidentDesc: this.form.accidentDesc,
            industryId: this.form.industryId,
            isDel: this.form.isDel,
          }
          if (formData.id) {
            dsaAccidentCaseApi.update(formData).then(() => {
              this.$message({
                message: this.$t('common.optionSuccess'),
                type: 'success'
              })
              this.fetchData()
              this.reset()
              this.formVisible = false
            })
          } else {
            dsaAccidentCaseApi.add(formData).then(() => {
              this.$message({
                message: this.$t('common.optionSuccess'),
                type: 'success'
              })
              this.fetchData()
              this.reset()
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
        this.form = this.selRow
        this.formTitle = '编辑事故案例库'
        this.formVisible = true

        if (this.$refs['form'] !== undefined) {
          this.$refs['form'].resetFields()
        }
        //如果表单初始化有特殊处理需求,可以在resetForm中处理
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
          dsaAccidentCaseApi.remove(id).then(response => {
            this.$message({
              message: this.$t('common.optionSuccess'),
              type: 'success'
            })
            this.$refs.accidentTable.clearSelection();
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
    removeBatch1() {
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
        console.log(ids);
        dsaAccidentCaseApi.removeBatch1(ids).then(() => {
          this.$message({
            message: this.$t('common.optionSuccess'),
            type: 'success'
          })
          this.$refs.accidentTable.clearSelection();
          this.fetchData()
        }).catch(err => {
          this.$notify.error({
            title: '错误',
            message: err
          })
        })
      }).catch(() => {
      })
    }, toggleSelection(row) {
      this.$refs.accidentTable.toggleRowSelection(row)
    },
    closeDialog() {
      this.formVisible = false;
      this.selection = [];
      this.fetchData();
      this.$refs.accidentTable.clearSelection();
    },

  }
}
