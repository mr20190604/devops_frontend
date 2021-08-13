import mmEquipmentInstallInfoApi from '@/api/mm/mmEquipmentInstallInfo'
import permission from '@/directive/permission/index.js'

export default {
  directives: { permission },
  props: {
    'equipmentId': {
      type: Number,
      default: 0
    },
    'isReadonly': {
      type: Boolean,
      default: false
    },
    'btnShow': {
      type: Boolean,
      default: true
    },
    'spanValue': {
      type: Number,
      default: 12
    }
  },
  data() {
    return {
      form: {
        equipmentId: '',
        constructionEnterprise: '',
        installMode: '',
        installLocation: '',
        installDate: '',
        installDescribe: '',
        longitude: '',
        latitude: '',
        euipmentMode: '',
        facilitiesId: '',
        facilitiesType: '',
        equipmentUnit: '',
        upFrequency: '',
        upFrequencyType: '',
        id: ''
      },
      facilitiesList: [],
      upFrequencyTypeList: [{
        value: 1,
        label: '秒'
      }, {
        value: 2,
        label: '分钟'
      }, {
        value: 3,
        label: '小时'
      }, {
        value: 4,
        label: '天'
      }],
      euipmentModeList: [{
        value: 1,
        label: '固定'
      }, {
        value: 2,
        label: '移动'
      }],
      facilitiesTypeList: []
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
    mmEquipmentInstallInfoApi.getEquipInstall({ 'equipmentId': this.equipmentId }).then(response => {
      if (response.data != null) {
        this.form = response.data
        this.listFacilitiesId(this.form.facilitiesType)
      }
    })
    mmEquipmentInstallInfoApi.listFacilitiesType().then(response => {
      this.facilitiesTypeList = response.data
    })
  },
  methods: {
    changeFacilitiesType(event) {
      this.form.facilitiesId = ''
      this.facilitiesList = []
      this.listFacilitiesId(event)
    },
    listFacilitiesId(facilitiesType) {
      mmEquipmentInstallInfoApi.listFacilities({ 'facilitiesType': facilitiesType }).then(response => {
        this.facilitiesList = response.data
      })
    },
    resetForm() {
      this.form = {
        equipmentId: '',
        constructionEnterprise: '',
        installMode: '',
        installLocation: '',
        installDate: '',
        installDescribe: '',
        longitude: '',
        latitude: '',
        euipmentMode: '',
        facilitiesId: '',
        facilitiesType: '',
        equipmentUnit: '',
        upFrequency: '',
        upFrequencyType: '',
        id: ''
      }
    },
    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          const formData = {
            id: this.form.id,
            equipmentId: this.equipmentId,
            constructionEnterprise: this.form.constructionEnterprise,
            installMode: this.form.installMode,
            installLocation: this.form.installLocation,
            installDate: this.form.installDate,
            installDescribe: this.form.installDescribe,
            longitude: this.form.longitude,
            latitude: this.form.latitude,
            euipmentMode: this.form.euipmentMode,
            isDel: this.form.isDel,
            facilitiesId: this.form.facilitiesId,
            facilitiesType: this.form.facilitiesType,
            equipmentUnit: this.form.equipmentUnit,
            upFrequency: this.form.upFrequency,
            upFrequencyType: this.form.upFrequencyType
          }
          if (formData.id) {
            mmEquipmentInstallInfoApi.update(formData).then(response => {
              this.$message({
                message: this.$t('common.optionSuccess'),
                type: 'success'
              })

            })
          } else {
            mmEquipmentInstallInfoApi.add(formData).then(response => {
              this.$message({
                message: this.$t('common.optionSuccess'),
                type: 'success'
              })
            })
          }
        } else {
          return false
        }
      })
    },
    //父组件调用，保存设备安装信息
    installReplaceSave() {
      if (!this.form) {
        this.$message({
          message: '安装信息不能为空！',
          type: 'warning'
        })
        return
      } else {
        this.save()
        // this.$emit('change-event','关闭弹框');
      }
    }

  }
}
