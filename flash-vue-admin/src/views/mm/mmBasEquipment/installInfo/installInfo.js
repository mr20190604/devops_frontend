import mmEquipmentInstallInfoApi from '@/api/mm/mmEquipmentInstallInfo'
import permission from '@/directive/permission/index.js'

export default {
  directives: {permission},
  props:['equipmentId','installInfo'],
  data() {
    return {
      formVisible: false,
      formTitle: '添加设备安装信息',
      isAdd: true,
      listLoading: true,
      form: {
        equipmentId:'',
        constructionEnterprise:'',
        installMode:'',
        installLocation:'',
        installDate:'',
        installDescribe:'',
        longitude:'',
        latitude:'',
        euipmentMode:'',
        isDel:'',
        facilitiesId:'',
        equipmentUnit:'',
        upFrequency:'',
        upFrequencyType:'',
        id: ''
      },
      options: [{
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
        }
      ],
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
    if(null != this.installInfo){
      this.form = this.installInfo;
    }

  },
  methods: {
    handleFilter() {
      this.listQuery.page = 1;
      this.getList()
    },
    handleClose() {

    },

    handleCurrentChange(currentRow, oldCurrentRow) {
      this.selRow = currentRow
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
        isDel: '',
        facilitiesId: '',
        equipmentUnit: '',
        upFrequency: '',
        upFrequencyType: '',
        id: ''
      }
    },
    add() {
      this.formTitle = '添加设备安装信息';
      this.formVisible = true;
      this.isAdd = true;

      if (this.$refs['form'] !== undefined) {
        this.$refs['form'].resetFields()
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
            equipmentUnit: this.form.equipmentUnit,
            upFrequency: this.form.upFrequency,
            upFrequencyType: this.form.upFrequencyType,
          };
          if (formData.id) {
            mmEquipmentInstallInfoApi.update(formData).then(response => {
              this.$message({
                message: this.$t('common.optionSuccess'),
                type: 'success'
              });
              this.formVisible = false
            })
          } else {
            mmEquipmentInstallInfoApi.add(formData).then(response => {
              this.$message({
                message: this.$t('common.optionSuccess'),
                type: 'success'
              });

              this.formVisible = false
            })
          }
        } else {
          return false
        }
      })
    },
    closeFatherDialog(){
      this.$emit("closeDialog");
    }



  }
}
