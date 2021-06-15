import mmInspectionPathApi from '@/api/mm/mmInspectionPath'
import mmPathRelationPepelineApi from '@/api/mm/mmPathRelationPepeline'
import permission from '@/directive/permission/index.js'
import pipelineInfo from '@/views/mm/mmInspectionPath/pipelineInfo/pipelineInfo.vue'
import againInfo from '@/views/mm/mmInspectionPath/againInfo/pipelineInfo.vue'

export default {
  directives: { permission },
  components:{
    pipelineInfo,
    againInfo,
  },
  data() {
    return {
      formVisible: false,
      pipelineVisible:false,
      againVisible:false,
      formTitle: '添加巡检巡查_线路管理',
      isAdd: true,
      isAddLine:true,
      form: {
        pathName:'',
        pathStatus:'',
        notes:'',
        isDel:'',
        id: '',
        auditUser:'',
        detail:'',
      },
      listQuery: {
        page: 1,
        limit: 20,
        id: undefined,
        pathName:undefined,
        createTime:undefined,
        startTime:undefined,
        endTime:undefined,
      },
      total: 0,
      list: [],
      listLoading: true,
      selRow: {},
      selection:[],
      lineMessage:'',
      pipeline:'',
      selectedList:[],
      receiveData:'',
      people_list:[],
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
      console.log(this.listQuery.createTime);
      if(this.listQuery.createTime){
        this.listQuery.startTime=this.listQuery.createTime[0];
        this.listQuery.endTime=this.listQuery.createTime[1];
      }
        mmInspectionPathApi.getList(this.listQuery).then(response => {
        this.list = response.data.records
        this.listLoading = false
        this.total = response.data.total
      })
    },
    search() {
      this.fetchData()
    },
    reset() {
      this.listQuery.pathStatus =undefined ;
      this.listQuery.pathName=undefined;
      this.listQuery.createTime='';
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
    handleSelectionChange(selection) {
      this.selection = selection
    },
    resetForm() {
      this.form = {
        pathName:'',
        pathStatus:'',
        notes:'',
        isDel:'',
        id: '',
        detail: '',
      };
      this.lineMessage='';
    },
    add() {
      this.resetForm();
      this.formTitle = '添加路线',
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
                pathName:this.form.pathName,
                pathStatus:this.form.pathStatus,
                notes:this.form.notes,
                isDel:this.form.isDel,
            }
            if(formData.id){
                mmInspectionPathApi.update(formData).then(response => {
                    this.$message({
                        message: this.$t('common.optionSuccess'),
                        type: 'success'
                    });
                  this.selection=[];
                  this.$refs.lineTable.clearSelection();
                    this.fetchData()
                    this.formVisible = false
                })
            }else{
              console.log(this.selectedList);
                mmInspectionPathApi.add(formData).then(response => {
                  let pathId=response.data.id;
                  this.selectedList.map(item=>{
                    const  formData1={
                      pathId:pathId,
                      pipelineId:item.id,
                    }
                    mmPathRelationPepelineApi.add(formData1);
                  });
                  this.selectedList=[];
                  this.form.detail='';
                    this.$message({
                        message: this.$t('common.optionSuccess'),
                        type: 'success'
                    });
                  this.selection=[];
                  this.$refs.lineTable.clearSelection();
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
        this.form = JSON.parse(JSON.stringify(this.selRow));
        this.formTitle = '编辑巡检巡查_线路管理'
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
            mmInspectionPathApi.remove(id).then(response => {
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
    addLine(){
      if(this.form.detail){
        this.pipeline=this.receiveData;
        this.receiveData='';
        this.againVisible=true;
      }else{
        this.pipelineVisible=true;
      }
    },
    toggleSelection(row) {
      this.$refs.lineTable.toggleRowSelection(row)
    },
    openLine(){
      console.log(this.selection)
      if (this.selection.length === 0) {
        this.$message({
          message: this.$t('common.mustSelectOne'),
          type: 'warning'
        })
        return false
      }
     /* let flag=true;
      this.selection.map(item=>{
        if(item.pathStatus==17){
          flag=false;
        }
      });
      if(!flag){
        this.$message({
          message: this.$t('不允许重复启用'),
          type: 'warning'
        })
        this.selection=[];
        this.$refs.lineTable.clearSelection();
        return false
      }*/

      this.selection.map((item,index)=>{
        item.pathStatus=17;
        const formData={
          id:item.id,
          pathName:item.pathName,
          pathStatus:item.pathStatus,
        };
        mmInspectionPathApi.update(formData).then(()=>{
          if(index==this.selection.length-1){
            this.$message({
              message: this.$t('common.optionSuccess'),
              type: 'success'
            })
            this.selection=[];
            this.$refs.lineTable.clearSelection();
            this.fetchData()
          }
        });
      });
    },
    closeLine(){
      if (this.selection.length === 0) {
        this.$message({
          message: this.$t('common.mustSelectOne'),
          type: 'warning'
        })
        return false
      }
     /* let flag=true;
      this.selection.map(item=>{
        if(item.pathStatus==18){
          flag=false;
        }
      });
      if(!flag){
        this.$message({
          message: this.$t('不允许重复禁用'),
          type: 'warning'
        })
        this.selection=[];
        this.$refs.lineTable.clearSelection();
        return false
      }*/

      this.selection.map((item,index)=>{
        item.pathStatus=18;
        const formData={
          id:item.id,
          pathName:item.pathName,
          pathStatus:item.pathStatus,
        };
        mmInspectionPathApi.update(formData).then(()=>{
          if(index==this.selection.length-1){
            this.$message({
              message: this.$t('common.optionSuccess'),
              type: 'success'
            })
            this.selection=[];
            this.$refs.lineTable.clearSelection();
            this.fetchData()
            this.fetchData()
          }
        });
      });
    },
    closePipeline(){
      this.pipelineVisible=false;
    },
    closeAgain(){
      this.againVisible=false;
    },
    setLineMessage(data){
      data.map((item,index)=>{
        console.log(index);
        console.log(data.length-1)
        console.log(data)
        if(index==data.length-1){
          this.receiveData=item;
          this.selectedList.push(item);
          if(this.form.detail==''){
            this.form.detail+=item.pipelineCode;
          }else {
            this.form.detail=this.form.detail+'→'+item.pipelineCode;
          }
        }
      })
    },
    closeDialog(){
      this.formVisible=false;
      this.selectedList=[];
    }
  }
}
