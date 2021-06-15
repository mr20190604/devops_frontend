import mmBasPipelineApi from '@/api/mm/mmBasPipeline'
import permission from '@/directive/permission/index.js'

export default {
  directives: { permission },
  props:['pipeline','selectedList'],
  data() {
    return {
      formVisible: false,
      formTitle: '添加管线信息表',
      isAdd: true,
      form: {
        pipelineCode:'',
        pipelineType:'',
        startPoint:'',
        endPoint:'',
        startHeight:'',
        endHeight:'',
        startDeep:'',
        endDeep:'',
        materialType:'',
        pipeDiameter:'',
        pipeLength:'',
        districtCode:'',
        roadId:'',
        address:'',
        longitude:'',
        latitude:'',
        systemFlag:'',
        notes:'',
        id: ''
      },
      listQuery: {
        page: 1,
        limit: 20,
        pipelineCode: undefined,
        startPoint:undefined,
        endPoint:undefined,
      },
      total: 0,
      list: [],
      listLoading: true,
      selRow: {},
      selection:[],
      selectLine:[],
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
  watch:{
    'pipeline':function () {
      this.fetchData();
    }
  },
  methods: {
    init() {
      this.fetchData()
    },
    fetchData() {
      this.listLoading = true;
      console.log(this.pipeline);
      this.listQuery.endPoint=this.pipeline.endPoint;
      this.listQuery.startPoint=this.pipeline.startPoint;
      mmBasPipelineApi.selectList(this.listQuery).then(response => {
        response.data.map((item,index)=>{
          this.selectedList.map(item1=>{
            if(item.pipelineCode==item1.pipelineCode){
              response.data.splice(index,1)
            }
          })
        });
        this.list = response.data;
        this.$refs.pipelineTable.clearSelection();
        this.listLoading = false
        this.total = response.data.total
      })
    },
    search() {
      this.fetchData()
    },
    reset() {
      this.listQuery.pipelineCode = ''
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
        pipelineCode:'',
        pipelineType:'',
        startPoint:'',
        endPoint:'',
        startHeight:'',
        endHeight:'',
        startDeep:'',
        endDeep:'',
        materialType:'',
        pipeDiameter:'',
        pipeLength:'',
        districtCode:'',
        roadId:'',
        address:'',
        longitude:'',
        latitude:'',
        systemFlag:'',
        notes:'',
        id: ''
      }
    },
    add() {
      this.formTitle = '添加管线信息表',
        this.formVisible = true
      this.isAdd = true

      if(this.$refs['form'] !== undefined) {
        this.$refs['form'].resetFields()
      }
      //如果表单初始化有特殊处理需求,可以在resetForm中处理
    },
    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          const formData = {
            id:this.form.id,
            pipelineCode:this.form.pipelineCode,
            pipelineType:this.form.pipelineType,
            startPoint:this.form.startPoint,
            endPoint:this.form.endPoint,
            startHeight:this.form.startHeight,
            endHeight:this.form.endHeight,
            startDeep:this.form.startDeep,
            endDeep:this.form.endDeep,
            materialType:this.form.materialType,
            pipeDiameter:this.form.pipeDiameter,
            pipeLength:this.form.pipeLength,
            districtCode:this.form.districtCode,
            roadId:this.form.roadId,
            address:this.form.address,
            longitude:this.form.longitude,
            latitude:this.form.latitude,
            systemFlag:this.form.systemFlag,
            notes:this.form.notes,
          }
          if(formData.id){
            mmBasPipelineApi.update(formData).then(response => {
              this.$message({
                message: this.$t('common.optionSuccess'),
                type: 'success'
              })
              this.fetchData()
              this.formVisible = false
            })
          }else{
            mmBasPipelineApi.add(formData).then(response => {
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
    editItem(record){
      this.selRow = record
      this.edit()
    },
    edit() {
      if (this.checkSel()) {
        this.isAdd = false
        this.form = this.selRow
        this.formTitle = '编辑管线信息表'
        this.formVisible = true

        if(this.$refs['form'] !== undefined) {
          this.$refs['form'].resetFields()
        }
        //如果表单初始化有特殊处理需求,可以在resetForm中处理
      }
    },
    removeItem(record){
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
          mmBasPipelineApi.remove(id).then(response => {
            this.$message({
              message: this.$t('common.optionSuccess'),
              type: 'success'
            })
            this.fetchData()
          }).catch( err=> {
            this.$notify.error({
              title: '错误',
              message: err
            })
          })
        }).catch(() => {
        })
      }
    },
    toggleSelection(row) {
      this.$refs.pipelineTable.clearSelection();
      this.$refs.pipelineTable.toggleRowSelection(row)
    },
    handleSelectionChange(selection) {
      this.selection = selection
    },
    saveLine(){
        this.selection.map(item=>{
          this.selectLine.push(item);
        });
      this.$emit('setLineMessage',this.selectLine);
        this.selection=[];
        this.closePipeline();
    },
    closePipeline(){
      this.$emit('closePipeline');
    }
  }
}
