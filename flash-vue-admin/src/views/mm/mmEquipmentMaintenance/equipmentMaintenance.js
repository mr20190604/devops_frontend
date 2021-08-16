import mmEquipmentMaintenanceApi from '@/api/mm/mmEquipmentMaintenance'
import permission from '@/directive/permission/index.js'

export default {
  directives: { permission },
  props: ['equipmentId','maintenanceStatus'],
  data() {
    return {
      checked: false,
      repairStatus: 0,
      repairStatusShow: false,
      form: {
        equipmentId: '',
        maintenanceStatus: '',
        notes: ''
      }
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
    // 表单验证
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
    if(this.maintenanceStatus === 579){
      this.repairStatusShow = true;
    }

  },
  methods: {
    resetForm() {
      this.form = {
        equipmentId: '',
        notes: '',
        maintenanceStatus: ''
      }
    },
    add() {
      if (this.$refs['form'] !== undefined) {
        this.$refs['form'].resetFields()
      }
    },
    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.checked) {
            this.form.maintenanceStatus = 581
          } else if (!this.repairStatusShow) {
            this.form.maintenanceStatus = 579
          } else {
            this.form.maintenanceStatus = this.repairStatus
          }
          const formData = {
            equipmentId: this.equipmentId,
            maintenanceStatus: this.form.maintenanceStatus,
            notes: this.form.notes
          }
          mmEquipmentMaintenanceApi.add(formData).then(response => {
            this.$message({
              message: this.$t('common.optionSuccess'),
              type: 'success'
            })
          })
          this.resetForm()
        } else {
          return false
        }
        this.closeMaintenance()
      })
    },
    closeMaintenance() {
      this.$emit('closeMaintenance')
    }
  },
  watch:{
    'maintenanceStatus':function(newVal,oldVal) {
      console.log(newVal);
      console.log(oldVal);
    }

  },
}
