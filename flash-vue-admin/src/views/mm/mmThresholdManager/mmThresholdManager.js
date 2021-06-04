import mmThresholdManagerApi from '@/api/mm/mmThresholdManager'
import permission from '@/directive/permission/index.js'
import mmBasEquipment from '@/api/mm/mmBasEquipment'
import {getDicts} from "../../../api/system/dict";


export default {
  directives: {permission},
  data() {
    return {
      formVisible: false,
      formTitle: '添加',
      isAdd: true,
      form: {
        equipmentId: '',
        firstUpperLimit: '',
        firstLowerLimit: '',
        secondUpperLimit: '',
        secondLowerLimit: '',
        thirdUpperLimit: '',
        thirdLowerLimit: '',
        equipmentType: '',
        dictId: '',
        auditOpinion: '',
        auditPerson: '',
        isDel: '',
        id: '',
        mmBasEquipment: '',
        equipmentTypeName: '',
        dictIdName: '',
        auditTime: '',
        auditUser: ''
      },
      listQuery: {
        page: 1,
        limit: 20,
        id: undefined,
        dictId: '',
        equipmentType: '',
        equipmentName: '',
        equipmentCode: ''

      },
      equipment_type: [],
      equipment_code: [],
      total: 0,
      list: [],
      listLoading: true,
      selRow: {},
      equipmentCodeList: [],
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

      this.listLoading = true
      mmThresholdManagerApi.getList(this.listQuery).then(response => {
        console.log(response.data.records)
        this.list = response.data.records
        this.listLoading = false
        this.total = response.data.total
      });
      getDicts("设备类型").then(response => {
        this.equipment_type = response.data
      })
    },
    search() {
      this.fetchData()
    },
    reset() {
      // this.listQuery.id = ''

      for (let key in this.listQuery) {
        if (key != 'limit' && key != 'page') {
          this.listQuery[key] = ''

        }
      }
      console.log(this.listQuery)
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
    handleCurrentChange(currentRow, oldCurrentRow) {
      this.selRow = currentRow
    },
    resetForm() {
      this.form = {
        equipmentId: '',
        firstUpperLimit: '',
        firstLowerLimit: '',
        secondUpperLimit: '',
        secondLowerLimit: '',
        thirdUpperLimit: '',
        thirdLowerLimit: '',
        equipmentType: '',
        dictId: '',
        auditOpinion: '',
        auditPerson: '',
        isDel: '',
        id: ''
      }
    },
    add() {
      this.formTitle = '添加',
        this.formVisible = true
      this.resetForm();
      this.isAdd = true

      if (this.$refs['form'] !== undefined) {
        this.$refs['form'].resetFields()
      }
      //如果表单初始化有特殊处理需求,可以在resetForm中处理
    },
    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          console.log(this.form.equipmentId)
          const formData = {
            id: this.form.id,
            equipmentId: this.form.equipmentId,
            firstUpperLimit: this.form.firstUpperLimit,
            firstLowerLimit: this.form.firstLowerLimit,
            secondUpperLimit: this.form.secondUpperLimit,
            secondLowerLimit: this.form.secondLowerLimit,
            thirdUpperLimit: this.form.thirdUpperLimit,
            thirdLowerLimit: this.form.thirdLowerLimit,
            equipmentType: this.form.equipmentType,
            dictId: this.form.dictId,
            auditOpinion: this.form.auditOpinion,
            auditPerson: this.form.auditPerson,
            isDel: this.form.isDel,
          }
          if (formData.id) {
            mmThresholdManagerApi.update(formData).then(response => {
              this.$message({
                message: this.$t('common.optionSuccess'),
                type: 'success'
              })
              this.fetchData()
              this.formVisible = false
            })
          } else {
            console.log(this.form.equipmentId)
           mmThresholdManagerApi.getByEquipmentId(this.form.equipmentId).then(response=>{
             console.log(response.data.length)
             if(response.data.length>0){
               this.$alert('不能为一个设备重复添加阈值', '提示', {
                 confirmButtonText: '确定',
               });
               return false
             }else {
               mmThresholdManagerApi.add(formData).then(response => {
                 this.$message({
                   message: this.$t('common.optionSuccess'),
                   type: 'success'
                 })
                 this.fetchData()
                 this.formVisible = false
               })
             }
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
        this.formTitle = '编辑'
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
          mmThresholdManagerApi.remove(id).then(response => {
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
    selectEquipment(val) {
      this.form.equipmentId = '';
      this.equipment_code = [];
      mmBasEquipment.queryAll(val).then(response => {
        console.log(response)
        this.equipment_code = response.data

      })
    }

  }
}
