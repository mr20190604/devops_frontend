import mmInspectionPlanApi from '@/api/mm/mmInspectionPlan'
import mmInspectionPathApi from '@/api/mm/mmInspectionPath'
import mmInspectionPlanFileApi from '@/api/mm/mmInspectionPlanFile'
import permission from '@/directive/permission/index.js'
import lineList from '@/views/mm/mmInspectionPlan/lineList/index.vue'
import equipmentList from '@/views/mm/mmInspectionPlan/equipmentList/index.vue'
import handleRecord from '@/views/mm/mmInspectionPlan/handleRecord/index.vue'
import fileDelete from '@/api/mm/genEvent/genEvent'
import { getApiUrl, getPreviewUrl} from '@/utils/utils'
import { getToken } from '@/utils/auth'

export default {
  directives: {permission},
  components: {
    lineList,
    equipmentList,
    handleRecord,
  },

  data() {
    return {
      equipBtnDisplay:true,
      fileBtnDisplay:true,
      uploadUrl:'',
      uploadHeaders: {
        'Authorization': ''
      },
      multiple:true,
      fileAccept:'.jpg,.png,.jpeg,.gif,.bmp,.doc,.docx,.pdf',
      inspectionType:'',
      handleDisplay:false,
      btnDisplay:true,
      planId:'',
      readonly:false,
      auditResultDisplay:false,
      pathId:'',
      tableDisplay: 0,
      searchTime: [],
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
      auditResultList: [{
        value: 3,
        label: '通过'
      }, {
        value: 2,
        label: '不通过'
      }],
      pathList: [],
      fileList:[],
      form: {
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
        handleStatus:1,
        isOverdue:1,
        personIdList:[],
        equipIdList:[],
        auditResult:'',
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
    this.uploadUrl = getApiUrl() + '/file';
    this.uploadHeaders['Authorization'] = getToken();
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
              name += ',' + personList[j].user.name;
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
        personIdList:[],
        equipIdList:[],
        auditResult:'',
      };
      this.searchTime = [];
      this.auditResultDisplay = false;
      this.readonly = false;
      this.fetchData();
    },
    add() {
      //保存按钮显示
      this.btnDisplay = true;
      //附件上传按钮显示
      this.fileBtnDisplay = true;
      //设备列表相关按钮显示
      this.equipBtnDisplay = true;
      this.formTitle = '添加巡检计划';
      this.formVisible = true;
      this.isAdd = true;
      this.fileList = [];

      if (this.$refs['form'] !== undefined) {
        this.$refs['form'].resetFields()
      }
    },
    save() {
      if(this.searchTime.length === 0){
        this.$message({
          message: '请选择计划周期',
          type: 'success'
        });
        return;
      }
      this.form.startTime = this.searchTime[0];
      this.form.endTime = this.searchTime[1];
      this.form.isOverdue = 1;

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
            personIdList:this.form.personIdList,
            equipIdList:this.form.equipIdList,
            auditResult:this.form.auditResult,
          };
          if (formData.id) {
            mmInspectionPlanApi.update(formData).then(response => {
              this.$message({
                message: this.$t('common.optionSuccess'),
                type: 'success'
              });
              for (let i = 0; i < this.fileList.length ; i++) {
                if(this.fileList[i].response) {
                  let fileId = this.fileList[i].response.data.id;
                  const tempData = {
                    planId:formData.id,
                    fileId:fileId,
                  };
                  mmInspectionPlanFileApi.add(tempData).then()
                }
              }
              this.fetchData();
              this.formVisible = false
            })
          } else {
            mmInspectionPlanApi.add(formData).then(response => {
              this.$message({
                message: this.$t('common.optionSuccess'),
                type: 'success'
              });
              for (let i = 0; i < this.fileList.length ; i++) {
                const tempData = {
                  planId:response.data.id,
                  fileId:this.fileList[i].response.data.id,
                  orderNum:i+1
                };
                mmInspectionPlanFileApi.add(tempData).then()
              }
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
      //保存按钮显示
      this.btnDisplay = true;
      //附件上传按钮显示
      this.fileBtnDisplay = true;
      //设备列表相关按钮显示
      this.equipBtnDisplay = true;
      this.selRow = record;
      this.planId = record.id;
      this.pathId = record.pathId;
      this.edit()
    },
    edit() {
      if (this.checkSel()) {
       this.fillFormData('编辑巡检计划')
      }
    },
    fillFormData(formTitle,flag){
      this.isAdd = false;
      this.form = this.selRow;

      let temp = null;
      this.fileList = [];

      mmInspectionPlanFileApi.listPlanFile(this.form.id).then(response=>{
        temp = response.data;
        if(temp) {
          temp.forEach(item =>{
            if(item.fileInfo) {
              this.fileList.push({
                "url":"",
                "name":item.fileInfo.originalFileName,
                "id":item.fileId,
                "status":"success",
              })
            }
          })
        }
      });

      this.searchTime.push(this.selRow.startTime);
      this.searchTime.push(this.selRow.endTime);
      let ids = [];
      let list = this.selRow.personList;
      list.forEach(item =>{
        ids.push(item.personId);
      });
      this.form.personIdList = ids;
      this.formTitle = formTitle;
      this.formVisible = true;
      if('审核' === flag){
        this.form.auditStatus = '';
      }

      if (this.$refs['form'] !== undefined) {
        this.$refs['form'].resetFields()
      }
    },
    audit(record){
      this.btnDisplay = true;
      this.fileBtnDisplay = false;
      this.readonly = true;
      this.auditResultDisplay = true;
      //设备列表相关按钮不显示
      this.equipBtnDisplay = false;
      this.selRow = record;
      if (this.checkSel()) {
        this.fillFormData('审核巡检计划','审核');
      }
    },
    showPlan(record){
      this.readonly = true;
      this.auditResultDisplay = false;
      this.btnDisplay = false;
      this.fileBtnDisplay = false;
      //设备列表相关按钮不显示
      this.equipBtnDisplay = false;
      this.selRow = record;
      this.planId = record.id;
      this.fillFormData('查看巡检计划');
    },
    showHandle(record){
      this.handleDisplay = true;
      this.planId = record.id;
      this.inspectionType = record.inspectType;
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
    },
    getEquipList(data){
      let list = [];
      data.forEach(item =>{
        list.push(item.equipmentId);
      });
      this.form.equipIdList = list;
    },
    handleChangeUpload(file,fileList){
      this.fileList = fileList.slice(-10)
    },
    uploadSuccess(response) {

    },
    removeFile(file){
      let arr = [];
      const param = {
        idFile:null
      };
      if (file.response) {
        param.idFile = file.response.data.id
      } else {
        param.idFile = file.id
      }
      this.fileList.forEach(item =>{
        if(item.response && file.response) {
          if(item.response.data.id != file.response.data.id) {
            arr.push((item))
          }
        } else if(item.id != file.id) {
          arr.push(item)
        }
      });
      this.fileList = arr;
      this.removeFileItem(param)
    },
    removeFileItem(param) {
      fileDelete.deleteFile(param).then()
    },
    cancel(){
      this.resetForm();
      this.btnDisplay = true;
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
