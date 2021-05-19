import dsaLawStatuteApi from '@/api/dsa/dsaLawStatute'
import permission from '@/directive/permission/index.js'
import {getDicts} from "../../../api/system/dict";
import { getApiUrl } from '@/utils/utils'
import { getToken } from '@/utils/auth'

export default {
  directives: { permission },
  data() {
    return {
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

        fileId:'',
        fileInfo:''
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
      selRow: {}
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
      this.uploadUrl = getApiUrl() + '/file'
      this.uploadHeaders['Authorization'] = getToken()
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
        fileId:''
      }
    },
    add() {
      this.resetForm()
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
                fileId:this.form.fileId
            }
            if(formData.id){
                dsaLawStatuteApi.update(formData).then(response => {
                    this.$message({
                        message: this.$t('common.optionSuccess'),
                        type: 'success'
                    })
                    this.fetchData()
                    this.formVisible = false
                })
            }else{
                dsaLawStatuteApi.add(formData).then(response => {
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
        // this.form.fileList = this.form.fileInfo
        this.resetForm()
        var arr = [];
        if (this.selRow.fileInfo)  {
          arr.push({
            "url":"",
            "name":this.selRow.fileInfo.originalFileName,
            "id":this.selRow.fileId,
            "status":"success",
          })
        }

        this.fileList = arr

        this.isAdd = false
        this.form = this.selRow
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
      this.fileList = fileList.slice(-1)
    },
    uploadSuccess(response) {
      if (response.code === 20000) {
        this.form.fileId = response.data.id
      } else {
        this.$message({
          message: this.$t('common.uploadError'),
          type: 'error'
        })
      }

    },removeFile(file){
      this.form.fileId = ''
    }

  }
}
