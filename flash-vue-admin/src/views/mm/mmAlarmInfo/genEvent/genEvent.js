import { getApiUrl, getPreviewUrl } from '@/utils/utils'
import { getToken } from '@/utils/auth'
import genEvent from '@/api/mm/genEvent/genEvent'
import permission from '@/directive/permission/index.js'


export default {
  name: "genEvent",
  directives:{permission},
  props:{
    alarmRow:Object
  },
  data() {
    return {
      uploadUrl:'',
      uploadHeaders: {
        'Authorization': ''
      },
      fileList:'',
      multiple:true,
      fileLimit:10,
      mmManagerEvent: {
        eventCode: '',
        eventName: '',
        eventType: '',
        eventAddress: '',
        eventDesc: '',
        id: ''
      },
      mmManagerEventFiles:[]
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
  methods:{
    init() {
      let self = this;
      self.uploadUrl = getApiUrl() + '/file';
      this.uploadHeaders['Authorization'] = getToken();
      self.mmManagerEvent.eventName = self.alarmRow.monitorTypeName +'_'+ self.alarmRow.equipment.equipmentName+'_' + self.alarmRow.alarmLevelName;
      self.mmManagerEvent.eventAddress = self.alarmRow.equipment.equipmentInstallInfo.installLocation;
      self.mmManagerEvent.eventModel = self.alarmRow.id;
    },
    save() {
      let params = {
        mmManagerEvent:this.mmManagerEvent,
        mmManagerEventFiles:this.mmManagerEventFiles
      };
      genEvent.saveEventAndFiles(params).then(response=>{
        console.log(response)
      });
    },
    getRowKey(row) {
      return row.id;
    },
    closeGenEvent() {
      this.$emit('closeGenEvent');
    },
    handleChangeUpload(file, fileList) {
      // this.fileList = fileList;
      // this.fileList.splice(this.fileList.findIndex(item=> item.id === file.id), 1)
      //fileList.filter
    },
    uploadSuccess(response, file, fileList) {
      this.fileList = fileList;
      this.mmManagerEventFiles.push(
        {eventId:-1,fileId:response.data.id}
      );
      /*if (response.code === 20000) {
        this.form.fileId = response.data.id
      } else {
        this.$message({
          message: this.$t('common.uploadError'),
          type: 'error'
        })
      }*/
    },
    removeFile(file,fileList) {
      let self = this;
      let params = {idFile: file.response.data.id};
      /**这里需要先调用删除后台文件及数据库中的文件数据，成功后页面上的数据变更*/
      genEvent.deleteFile(params).then(response=>{
        if(response.success) {
          self.fileList = fileList;
          this.mmManagerEventFiles.splice(this.mmManagerEventFiles.findIndex(item => item.fileId === file.response.data.id), 1);
        }
      });
    }
  }
}
