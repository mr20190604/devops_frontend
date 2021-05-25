import mmAlarmInfoApi from '@/api/mm/mmAlarmInfo'
import permission from '@/directive/permission/index.js'
import {getDicts} from "../../../api/system/dict";
import { getApiUrl,getPreviewUrl } from '@/utils/utils'
import { getToken } from '@/utils/auth'
// import preview from '@/preview/preview.vue'
import {isCanPreview} from '@/utils/preview.js'


export default {
  directives: { permission },
  components:{
    // preview
  },
  data() {
    return {
      formVisible: false,
      formTitle: '添加报警基本信息',
      isAdd: true,
      form: {
        alarmCode:'',
        districtCode:'',
        equipmentId:'',
        monitorType:'',
        alarmTime:'',
        alarmValue:'',
        alarmLevel:'',
        alarmFirstValue:'',
        alarmFirstTime:'',
        alarmMaxValue:'',
        alarmMaxTime:'',
        alarmMaxLevel:'',
        alarmRelieveTime:'',
        isAudit:'',
        auditOpinion:'',
        auditPerson:'',
        isFeedback:'',
        isRelieve:'',
        prejudgment:'',
        isGenEvent:'',
        auditTime:'',
        isDel:'',
        id: '',
        auditStatus:''
      },
      disposeForm:{
        alarmId:'',
        handleConent:'',
        handleStatus:'',
        fileId:''
      },
      check_list:
        [
          {
          value:0,
          label:'未审核'
          },
          {
           value:1,
           label:'已审核'
          }
        ],
      feedback_list:
        [
          {
            value:0,
            label:'未处置'
          },
          {
            value:1,
            label:'处置中'
          },
          {
            value:2,
            label:'已处置'
          }
        ],
      //报警类型
      alarm_type:[],
      //报警级别
      alarm_level:[],
      listQuery: {
        page: 1,
        limit: 20,
        id: undefined,
        equipCode:undefined,
        alarmLevel:undefined,
        startTime:undefined,
        endTime:undefined,
        monitorType:undefined,
        isAudit:undefined,
        isFeedBack:undefined
      },
      total: 0,
      list: null,
      listLoading: true,
      selRow: {},
      disposeVisible:false,
      disposeTitle:'报警处置',
      disposeList:null,
      disposeLoading:true,
      previewFileUrl:'',
      fileType: 1,
      //上传路径
      uploadUrl:'',
      //下载路径
      downloadUrl:'',
      //后台token
      uploadHeaders: {
        'Authorization': ''
      },
      multiple:true,
      files:null,
      fileLoading:true,
      //附件集合
      fileList:[],
      previewTitle: '预览',
      previewVisible: false,
      previewStyle:{
        height:'600px',
        width: '100%'
      },
      vShow:true

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
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.fetchData()
      this.downloadUrl = getApiUrl() + '/file/download?idFile='
      this.uploadUrl = getApiUrl() + '/file'
      this.uploadHeaders['Authorization'] = getToken()
    },
    fetchData() {

      this.listLoading = true
        mmAlarmInfoApi.getList(this.listQuery).then(response => {
        this.list = response.data.records
        this.listLoading = false
        this.total = response.data.total
      });
      getDicts("报警类型").then(response=>{
        this.alarm_type=response.data;
      });
      getDicts("报警等级").then(response=>{
        this.alarm_level=response.data;
      });
    },
    search() {
      this.fetchData()
    },
    reset() {
      this.listQuery.id = ''
      this.listQuery.equipCode=''
      this.listQuery.alarmLevel=''
      this.listQuery.startTime=''
      this.listQuery.endTime=''
      this.listQuery.monitorType=''
      this.listQuery.isAudit=''
      this.listQuery.isFeedBack=''
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
        alarmCode:'',
        districtCode:'',
        equipmentId:'',
        monitorType:'',
        alarmTime:'',
        alarmValue:'',
        alarmLevel:'',
        alarmFirstValue:'',
        alarmFirstTime:'',
        alarmMaxValue:'',
        alarmMaxTime:'',
        alarmMaxLevel:'',
        alarmRelieveTime:'',
        isAudit:'',
        auditOpinion:'',
        auditPerson:'',
        isFeedback:'',
        isRelieve:'',
        prejudgment:'',
        isGenEvent:'',
        auditTime:'',
        isDel:'',
        id: ''
      }
    },
    add() {

      if (this.checkSel()) {
        if(this.selRow.isAudit == 1) {
          this.$message({
            message: this.$t('不允许重复审核'),
            type: 'warning'
          })

        } else {
          this.formTitle = '报警审核'
          this.formVisible = true
          this.isAdd = true
          this.form = this.selRow
          this.form.isAudit=1

          if(this.$refs['form'] !== undefined) {
            this.$refs['form'].resetFields()
          }
          //如果表单初始化有特殊处理需求,可以在resetForm中处理
        }
      }

          },
    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
            const formData = {
                id:this.form.id,
                alarmCode:this.form.alarmCode,
                districtCode:this.form.districtCode,
                equipmentId:this.form.equipmentId,
                monitorType:this.form.monitorType,
                alarmValue:this.form.alarmValue,
                alarmLevel:this.form.alarmLevel,
                alarmFirstValue:this.form.alarmFirstValue,
                alarmMaxValue:this.form.alarmMaxValue,
                alarmMaxLevel:this.form.alarmMaxLevel,
                isAudit:this.form.isAudit,
                auditOpinion:this.form.auditOpinion,
                auditPerson:this.form.auditPerson,
                isFeedback:this.form.isFeedback,
                isRelieve:this.form.isRelieve,
                prejudgment:this.form.prejudgment,
                isGenEvent:this.form.isGenEvent,
                isDel:this.form.isDel,
            }
            if(formData.id){
                mmAlarmInfoApi.update(formData).then(response => {
                    this.$message({
                        message: this.$t('common.optionSuccess'),
                        type: 'success'
                    })
                    this.fetchData()
                    this.formVisible = false
                })
            }else{
                mmAlarmInfoApi.add(formData).then(response => {
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
        this.formTitle = '编辑报警基本信息'
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
            mmAlarmInfoApi.remove(id).then(response => {
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
    },resetDisposeForm(){
      this.disposeForm.alarmId = ''
      this.disposeForm.handleConent = ''
      this.disposeForm.handleStatus = ''
      this.disposeForm.fileId = ''
    }, dispose() {
      if (this.checkSel()) {
          if(this.selRow.isFeedback == 2) {
            this.vShow = false
          } else {
            this.vShow = true
          }
        this.fileList = []
        this.resetDisposeForm()
        this.disposeTitle = '报警处置'
        this.disposeVisible = true
        this.initDisposeList(this.selRow.id)
        }

    },addDispose() {
      this.$refs['disposeForm'].validate((valid) => {
        if (valid) {
          const alarmData = {
            id:this.selRow.id,
            isFeedback:this.disposeForm.handleStatus
          }

          mmAlarmInfoApi.updateHandleById(alarmData).then(response=>{

          })
          const formData = {
            alarmId:this.selRow.id,
            handleConent:this.disposeForm.handleConent,
            handleStatus:this.disposeForm.handleStatus
          }
          mmAlarmInfoApi.addDispose(formData).then(response => {
            this.$message({
              message: this.$t('common.optionSuccess'),
              type: 'success'
            })

            this.fileList.forEach(item=>{
              const fileData = {
                handleId:response.data.id,
                fileId:item.response.data.id
              }
              mmAlarmInfoApi.addRelation(fileData).then()
            })
            this.fetchData()
          })
        } else {
          return false
        }

        this.disposeVisible = false
      })
    },initDisposeList(alamId) {
      mmAlarmInfoApi.queryDisposeByAlarm(alamId).then(response=>{
        this.disposeList = response.data
      })

      this.disposeLoading = false
    },handleChangeUpload(file,fileList){
      this.fileList = fileList.slice(-10)
    },removeFile(file){
      var arr = []
      this.fileList.forEach(item =>{
        if(item.response && file.response) {
          if(item.response.data.id != file.response.data.id) {
            arr.push((item))
          }
        } else if(item.id != file.id) {
          arr.push(item)
        }
      })
      this.fileList = arr
    },
    previewFile(record){
      this.previewVisible = true;
      mmAlarmInfoApi.queryDataByHandleId(record.id).then(response =>{
        this.files = response.data
        if (this.files) {
          this.viewFile(this.files[0])
        }
      })
      this.fileLoading = false
    },viewFile(record) {
      if(!record.fileInfo) {
        this.$message({
          message: this.$t('不存在预览文件'),
          type: 'success'
        })
      }
      if(!isCanPreview(record.fileInfo.originalFileName)) {
        this.$message({
          message: this.$t('该文件类型不支持预览'),
          type: 'success'
        })
      } else {
        let originUrl = this.downloadUrl + record.fileInfo.id + '&fileName=' + record.fileInfo.originalFileName;
        let preview = getPreviewUrl(1, originUrl, [record.fileInfo.originalFileName]);
        this.previewTitle = record.lawName;
        this.previewFileUrl = preview;
      }

    }

  }
}
