import mmEquipmentInstallInfoApi from '@/api/mm/mmEquipmentInstallInfo'
import permission from '@/directive/permission/index.js'

export default {
  directives: {permission},
  props:['equipmentId','isAdd'],
  data() {
    return {
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
    //是编辑操作时给当前表单赋值
    if(!this.isAdd){
      mmEquipmentInstallInfoApi.getEquipInstall({'equipmentId':this.equipmentId}).then(response =>{
        console.log(response);
        if(response.data != null){
          this.form = response.data;
        }

      });
    }

  },
  methods: {
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

            })
          } else {
            mmEquipmentInstallInfoApi.add(formData).then(response => {
              this.$message({
                message: this.$t('common.optionSuccess'),
                type: 'success'
              });
            })
          }
        } else {
          return false
        }
      });
      this.closeFatherDialog();
    },
    closeFatherDialog(){
      this.$emit("closeDialog");
    }


  }
}
