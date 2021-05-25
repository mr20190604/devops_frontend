import dsaEmergencyPlanApi from '@/api/dsa/dsaEmergencyPlan'
import permission from '@/directive/permission/index.js'
import {getDicts} from "../../../api/system/dict";
import { getApiUrl,getPreviewUrl } from '@/utils/utils'
import { getToken } from '@/utils/auth'
import preview from '@/preview/preview.vue'
import {isCanPreview} from '@/preview/preview.js'


const Base64 = require('js-base64').Base64

export default {
  directives: { permission },
  components:{
    preview
  },
  data() {
    return {
      formVisible: false,
      //预览弹窗
      previewVisible: false,
      formTitle: '添加',
      previewTitle: '预览',
      previewStyle:{
        height:'600px',
        width: '100%'
      },
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
      isAdd: true,
      form: {
        planName:'',
        planTypeId:'',
        industryId:'',
        planUnit:'',
        planVersion:'',
        editorDate:'',
        fileId:'',
        register:'',
        isDel:'',
        industryName:'',
        planTypeName:'',
        id: '',
        fileInfo:''
      },
      //附件集合
      fileList:[],
      //预案类型
      plan_type:[],
      //所属行业
      industry_type:[],
      listQuery: {
        page: 1,
        limit: 10,
        id: undefined
      },
      total: 0,
      list: null,
      listLoading: true,
      selection:[],
      selRow: {},
      multiple:true,
      files:null,
      fileLoading:true
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
      this.downloadUrl = getApiUrl() + '/file/download?idFile='
      this.uploadUrl = getApiUrl() + '/file'
      this.uploadHeaders['Authorization'] = getToken()
    },
    fetchData() {

      this.listLoading = true
        dsaEmergencyPlanApi.getList(this.listQuery).then(response => {
        this.list = response.data.records
        this.listLoading = false
        this.total = response.data.total
      });
      getDicts("预案种类").then(response=>{
        this.plan_type=response.data
      });
      getDicts("所属行业").then(response=>{
        this.industry_type=response.data
      });
    },
    search() {
      this.fetchData()
    },
    reset() {
      this.listQuery.id = ''
      this.listQuery.planName = ''
      this.listQuery.industryId = ''
      this.listQuery.planUnit = ''
      this.listQuery.planTypeId = ''
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
        //附件集合
        fileList:[],
        planName:'',
        planTypeId:'',
        industryId:'',
        planUnit:'',
        planVersion:'',
        editorDate:'',
        register:'',
        isDel:'',
        id: '',
      }
    },
    add() {
      this.resetForm()
      this.fileList = []
      this.formTitle = '添加',
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
                planName:this.form.planName,
                planTypeId:this.form.planTypeId,
                industryId:this.form.industryId,
                planUnit:this.form.planUnit,
                planVersion:this.form.planVersion,
                editorDate:this.form.editorDate,
                register:this.form.register,
                isDel:this.form.isDel,
            }
            if(formData.id){
                dsaEmergencyPlanApi.update(formData).then(response => {
                    this.$message({
                        message: this.$t('common.optionSuccess'),
                        type: 'success'
                    })
                  dsaEmergencyPlanApi.removeByPlanId(formData.id).then(response =>{
                  })
                  for (let i = 0; i < this.fileList.length ; i++) {
                    let fileId = '';
                    if (this.fileList[i].id) {
                      fileId = this.fileList[i].id
                    }  else {
                      fileId = this.fileList[i].response.data.id
                    }
                    const tempData = {
                      planId:formData.id,
                      fileId:fileId,
                    }
                    dsaEmergencyPlanApi.addRelation(tempData).then()
                  }
                    this.fetchData()
                    this.formVisible = false
                })
            }else{
                dsaEmergencyPlanApi.add(formData).then(response => {
                    this.$message({
                        message: this.$t('common.optionSuccess'),
                        type: 'success'
                    })
                  for (let i = 0; i < this.fileList.length ; i++) {
                    const tempData = {
                      planId:response.data.id,
                      fileId:this.fileList[i].response.data.id,
                    }
                    dsaEmergencyPlanApi.addRelation(tempData).then()
                  }
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
        this.fileList = []

        let temp = null;
        dsaEmergencyPlanApi.queryDataByPlanId(this.form.id).then(response=>{
          temp = response.data
          if(temp) {
            temp.forEach(item =>{
              this.fileList.push({
                "url":"",
                "name":item.fileInfo.originalFileName,
                "id":item.fileId,
                "status":"success",
              })
            })
          }
        })
        this.formTitle = '编辑'
        this.formVisible = true

        if (this.$refs['form'] !== undefined) {
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
            dsaEmergencyPlanApi.remove(id).then(response => {
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
    handleChangeUpload(file,fileList){
      this.fileList = fileList.slice(-10)
    },
    uploadSuccess(response) {
      // if (response.code === 20000) {
      //   this.form.fileId = response.data.id
      // } else {
      //   this.$message({
      //     message: this.$t('common.uploadError'),
      //     type: 'error'
      //   })
      // }

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
      dsaEmergencyPlanApi.queryDataByPlanId(record.id).then(response=>{
        this.files = response.data
        if (this.files) {
          this.viewFile(this.files[0])
        }
      })
      this.fileLoading = false
    },downloadFileINfo(record) {

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
    },removeBatch() {
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
        dsaEmergencyPlanApi.removeBatch1(ids).then(() => {
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


  }
}
