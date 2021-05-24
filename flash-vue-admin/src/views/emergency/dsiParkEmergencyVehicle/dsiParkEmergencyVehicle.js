import dsiParkEmergencyVehicleApi from '@/api/emergency/dsiParkEmergencyVehicle'
import dsiEnterprise from '@/api/dsi/dsiEnterpriseBaseinfo.js'
import permission from '@/directive/permission/index.js'
import {getDicts} from "../../../api/system/dict";
import { getApiUrl, getPreviewUrl} from '@/utils/utils'
import { getToken } from '@/utils/auth'
import preview from '@/preview/preview.vue'
import {downloadFile} from  '@/preview/preview.js'

const Base64 = require('js-base64').Base64

export default {
  directives: { permission },
  constant:[dsiEnterprise],
  components:{preview},
  data() {
    return {
      formVisible: false,
      formTitle: '添加园区应急车辆',
      isAdd: true,
      form: {
        vehicleName:'',
        enterpriseId:'',
        enterpriseName:'',
        vehicleLicense:'',
        vehicleCode:'',
        vehicleType:'',
        //vehicleTypeName:'',
        vehicleModel:'',
        districtCode:'',
        vehicleResponsible:'',
        personTel:'',
        manufacturer:'',
        longitude:'',
        latitude:'',
        isDel:'',
        id: ''
      },
      //车辆类别
      vehicleType_list:[],
      //所属企业下拉
      enterprise_list:[],
      listQuery: {
        page: 1,
        limit: 10,
        id: undefined,
        vehicleModel:'',
        vehicleLicense:'',
        vehicleType:'',
        vehicleResponsible:'',
        enterpriseId:'',

      },
      total: 0,
      list: null,
      listLoading: true,
      selRow: {},
      uploadUrl:'',
      uploadHeaders: {
        'Authorization': ''
      },
      fileList:[],
      multiple:true,
      fileType: 1,
      previewStyle:{
        height:'600px',
        width: '100%'
      },
      previewFileUrl:'',
      previewVisible: false,
      previewTitle: '预览',
      viewTitle:'附件预览',
      viewVisible:false,
      fileLoading:true,
      files:null

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
      this.uploadUrl = getApiUrl() + '/file'
      this.uploadHeaders['Authorization'] = getToken()
      // this.downloadUrl = getApiUrl() + '/file/download?idFile='
      this.downloadUrl = getApiUrl() + '/file/getImgStream?idFile='

    },
    fetchData() {
      dsiEnterprise.queryAll().then(response =>{
        this.enterprise_list = response.data
      })
      this.listLoading = true
        dsiParkEmergencyVehicleApi.getList(this.listQuery).then(response => {
        this.list = response.data.records
          this.enterprise_list.forEach(item =>{
            this.list.forEach(index =>{
              if (item.id == index.enterpriseId) {
                index.enterpriseName = item.enterpriseName
              }
            })
          })
        this.listLoading = false
        this.total = response.data.total
      });
      getDicts("车辆类别").then(response=>{
        this.vehicleType_list=response.data
      })
    },
    search() {
      this.fetchData()
    },
    reset() {
      this.listQuery.id = ''
      this.listQuery.enterpriseId = ''
      this.listQuery.vehicleModel = ''
      this.listQuery.vehicleResponsible = ''
      this.listQuery.vehicleType = ''
      this.listQuery.vehicleLicense = ''
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
        vehicleName:'',
        enterpriseId:'',
        vehicleLicense:'',
        vehicleCode:'',
        vehicleType:'',
        vehicleModel:'',
        districtCode:'',
        vehicleResponsible:'',
        personTel:'',
        manufacturer:'',
        longitude:'',
        latitude:'',
        isDel:'',
        id: ''
      }
    },
    add() {
      this.resetForm()
      this.formTitle = '添加应急车辆',
      this.formVisible = true
      this.isAdd = true
      this.fileList = []

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
                vehicleName:this.form.vehicleName,
                enterpriseId:this.form.enterpriseId,
                vehicleLicense:this.form.vehicleLicense,
                vehicleCode:this.form.vehicleCode,
                vehicleType:this.form.vehicleType,
                vehicleModel:this.form.vehicleModel,
                districtCode:this.form.districtCode,
                vehicleResponsible:this.form.vehicleResponsible,
                personTel:this.form.personTel,
                manufacturer:this.form.manufacturer,
                longitude:this.form.longitude,
                latitude:this.form.latitude,
                isDel:this.form.isDel,
            }
            if(formData.id){
                dsiParkEmergencyVehicleApi.update(formData).then(response => {
                    this.$message({
                        message: this.$t('common.optionSuccess'),
                        type: 'success'
                    })
                  dsiParkEmergencyVehicleApi.removeByVehicleId(formData.id).then(response =>{
                  })
                  for (let i = 0; i < this.fileList.length ; i++) {
                    let fileId = '';
                    if (this.fileList[i].id) {
                      fileId = this.fileList[i].id
                    }  else {
                      fileId = this.fileList[i].response.data.id
                    }
                    const tempData = {
                      vehicleId:formData.id,
                      fileId:fileId,
                      orderNum:i+1
                    }
                    dsiParkEmergencyVehicleApi.addRelation(tempData).then()
                  }

                    this.fetchData()
                    this.formVisible = false
                })
            }else{
                dsiParkEmergencyVehicleApi.add(formData).then(response => {
                    this.$message({
                        message: this.$t('common.optionSuccess'),
                        type: 'success'
                    })
                  for (let i = 0; i < this.fileList.length ; i++) {
                    const tempData = {
                      vehicleId:response.data.id,
                      fileId:this.fileList[i].response.data.id,
                      orderNum:i+1
                    }
                    dsiParkEmergencyVehicleApi.addRelation(tempData).then()
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

        var temp = null
        this.fileList = []


        dsiParkEmergencyVehicleApi.queryDataByVehicleId(this.form.id).then(response=>{
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
        this.formTitle = '编辑应急车辆'
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
            dsiParkEmergencyVehicleApi.remove(id).then(response => {
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
    },handleChangeUpload(file,fileList){
      this.fileList = fileList.slice(-10)
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
    },previewFile(record){
      this.previewVisible = true;
      let originUrl = this.downloadUrl + record.fileInfo.id + '&fileName=' + record.fileInfo.realFileName;
      let previewUrl = originUrl + '&fullfilename=' + record.fileInfo.realFileName;
      let preview = getPreviewUrl(2)+encodeURIComponent(Base64.encode(previewUrl));
      this.fileType = 2;
      this.previewTitle = record.fileInfo.originalFileName;
      this.previewFileUrl = preview;
    },openFileView(record) {
      this.viewVisible = true
      dsiParkEmergencyVehicleApi.queryDataByVehicleId(record.id).then(response=>{
        this.files = response.data
        if (this.files) {
          this.previewFile(this.files[0])
        }
      })
      this.fileLoading = false

    }

  }
}
