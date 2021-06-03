import dsaLawStatuteApi from '@/api/dsa/dsaLawStatute'
import permission from '@/directive/permission/index.js'
import {getDicts} from "../../../api/system/dict";
import { getApiUrl, getPreviewUrl} from '@/utils/utils'
import { getToken } from '@/utils/auth'
import {isCanPreview,downloadFile} from '@/utils/preview.js'
import fileDelete from '@/api/mm/genEvent/genEvent'



const Base64 = require('js-base64').Base64

export default {
  name:'fileDelete',
  directives: { permission},
  // components:{
  //   preview
  // },
  data() {
    return {
      fileType: 1,
      previewStyle:{
        height:'600px',
        width: '100%'
      },
      previewFileUrl:'',
      previewVisible: false,
      previewTitle: '预览',
      formVisible: false,
      formTitle: '添加法律法规库',
      isAdd: true,
      uploadUrl:'',
      uploadHeaders: {
        'Authorization': ''
      },
      form: {
        lawName:'',
        lawCategory:'',
        adaptType:'',
        formulateOffice:'',
        lawNature:'',
        isValid:'',
        publicationDate:'',
        remark:'',
        isDel:'',
        id: '',
        timeliness:'',
        timeName:'',
        formulateOfficeName:'',
        lawNatureName:'',
        fileInfo:'',
        dsaStatuteFiles:''
      },
      //附件集合
      fileList:[],
      //判断法律是否有时效
      timeliness:[],
      //法律性质下拉数据
      lawNature_list:[],
      //制定机关下拉数据
      formulateOffice_list:[],
      listQuery: {
        page: 1,
        limit: 10,
        id: undefined,
        lawName:undefined,
        formulateOffice:undefined,
        lawNature:undefined,
        isValid:undefined,
        publicationDate:undefined
      },
      total: 0,
      list: null,
      listLoading: true,
      selRow: {},
      selection:[],
      multiple:true,
      fileLoading:true,
      files:null,
      fileAccept:'.doc,.docx,.pdf,.zip,.rar',
      fileShow:true
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
      this.fetchData();
      this.downloadUrl = getApiUrl() + '/file/download?idFile='
      this.uploadUrl = getApiUrl() + '/file'
      this.uploadHeaders['Authorization'] = getToken()
    },
    fetchData() {
      this.listLoading = true
        dsaLawStatuteApi.getList(this.listQuery).then(response => {
        this.list = response.data.records
        this.listLoading = false
        this.total = response.data.total
      });
      getDicts("时效性").then(response=>{
        this.timeliness=response.data
      });
      getDicts("法律性质").then(response=>{
        this.lawNature_list=response.data
      });
      getDicts("制定机关").then(response=>{
        this.formulateOffice_list=response.data
      });
    },
    search() {
      this.fetchData()
    },
    reset() {
      this.listQuery.id = ''
      this.listQuery.timeName=''
      this.listQuery.formulateOffice = ''
      this.listQuery.lawName = ''
      this.listQuery.lawNature = ''
      this.listQuery.isValid = ''
      this.listQuery.publicationDate = ''
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
    handleSelectionChange(selection) {
      this.selection = selection
    },
    resetForm() {
      this.form = {
        lawName:'',
        lawCategory:'',
        adaptType:'',
        formulateOffice:'',
        lawNature:'',
        isValid:'',
        publicationDate:'',
        remark:'',
        isDel:'',
        id: '',
        fileInfo:'',
        fileList:[],
      }
    },
    add() {
      this.resetForm()
      this.fileList = []
      this.formTitle = '添加法律法规库',
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
                lawName:this.form.lawName,
                lawCategory:this.form.lawCategory,
                adaptType:this.form.adaptType,
                formulateOffice:this.form.formulateOffice,
                lawNature:this.form.lawNature,
                isValid:this.form.isValid,
                publicationDate:this.form.publicationDate,
                remark:this.form.remark,
                isDel:this.form.isDel,
            }
            if(formData.id){
                dsaLawStatuteApi.update(formData).then(response => {
                    this.$message({
                        message: this.$t('common.optionSuccess'),
                        type: 'success'
                    })
                  // dsaLawStatuteApi.removeByStatuteId(formData.id).then(response =>{
                  // })
                  for (let i = 0; i < this.fileList.length ; i++) {
                    if(this.fileList[i].response) {
                      let fileId = this.fileList[i].response.data.id
                      const tempData = {
                        statuteId:formData.id,
                        fileId:fileId,
                      }
                      dsaLawStatuteApi.addRelation(tempData).then()
                    }
                  }
                    this.fetchData()
                    this.formVisible = false
                })
            }else{
                dsaLawStatuteApi.add(formData).then(response => {
                    this.$message({
                        message: this.$t('common.optionSuccess'),
                        type: 'success'
                    })
                  for (let i = 0; i < this.fileList.length ; i++) {
                    const tempData = {
                      statuteId:response.data.id,
                      fileId:this.fileList[i].response.data.id,
                    }
                    dsaLawStatuteApi.addRelation(tempData).then()
                  }
                    this.fetchData()
                    this.formVisible = false
                })
            }
        } else {
          return false
        }
      })
    },cancle() {
      this.$refs.statuteTable.clearSelection();
      this.reset()
      this.fetchData()
      this.formVisible = false
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
        this.resetForm()
        this.fileList = []
        this.isAdd = false
        this.form = this.selRow
        let temp = null;
        dsaLawStatuteApi.queryDataByStatuteId(this.form.id).then(response=>{
          temp = response.data
          if(temp) {
            temp.forEach(item =>{
              if (item.fileInfo) {
                this.fileList.push({
                  "url":"",
                  "name":item.fileInfo.originalFileName,
                  "id":item.fileId,
                  "status":"success",
                })
              }
            })
          }
        })


        this.formTitle = '编辑法律法规库'
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
            dsaLawStatuteApi.remove(id).then(response => {
              this.removeRow(this.selRow)
              this.$message({
                message: this.$t('common.optionSuccess'),
                type: 'success'
              })
              this.$refs.statuteTable.clearSelection();
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
      const param = {
        idFile:null
      }
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
      })
      this.removeFileItem(param)
      this.fileList = arr
    },
    previewFile(record){
      this.previewVisible = true;
      dsaLawStatuteApi.queryDataByStatuteId(record.id).then(response =>{
        this.files = response.data
      })
    },viewFile(record) {
      if(!record.fileInfo) {
        this.$message({
          message: this.$t('不存在预览文件'),
          type: 'success'
        })
        this.fileShow = false
      }
      if(!isCanPreview(record.fileInfo.originalFileName)) {
        this.$message({
          message: this.$t('该文件类型不支持预览'),
          type: 'success'
        })
        this.fileShow = false
      } else {
        this.fileShow = true
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
        dsaLawStatuteApi.removeBatch1(ids).then(() => {
          this.selection.forEach(item =>{
            this.removeRow(item)
          })
          this.$message({
            message: this.$t('common.optionSuccess'),
            type: 'success'
          })
          this.$refs.statuteTable.clearSelection();
          this.fetchData()
        }).catch(err => {
          this.$notify.error({
            title: '错误',
            message: err
          })
        })
      }).catch(() => {
      })
    },downloads(record) {
      const param = {
        idFile:record.fileInfo.id,
        fileName:record.fileInfo.originalFileName
      }
      downloadFile('/file/download',param,record.fileInfo.originalFileName)
    },toggleSelection(row) {
      this.$refs.statuteTable.toggleRowSelection(row)
    },removeRow(row) {
      if(row.dsaStatuteFiles) {
        row.dsaStatuteFiles.forEach(item =>{
          this.removeDataFile(item)
        })
      }
    }
    ,removeDataFile(record) {
      if (record.fileInfo) {
        const param = {
          idFile:record.fileInfo.id
        }
        this.removeFileItem(param)
      }
    },cancleDelete() {
      this.fileList.forEach(item =>{
        if (item.response) {
          const param = {
            idFile:item.response.data.id
          }
          this.removeFileItem(param)
        }
      })
      this.cancle()
    }
    ,removeFileItem(param) {
      fileDelete.deleteFile(param).then()
    }

  },
}
