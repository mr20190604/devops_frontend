import mmEquipmentExamineApi from '@/api/mm/mmEquipmentExamine'
import permission from '@/directive/permission/index.js'

export default {
  directives: { permission },
  props: {
    'equipmentIds':{
      type:Array,
      default:[]
    }
  },
  data() {
    return {
      form: {
        examineStatus: '',
        examineOpinion: '',
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

  },
  methods: {
    resetForm() {
      this.form = {
        examinStatus: '',
        examineOpinion: '',
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
          const formData = {
            equipmentIds: this.equipmentIds,
            examinStatus: this.form.examinStatus,
            examineOpinion: this.form.examineOpinion
          }
          mmEquipmentExamineApi.equipmentExamine(formData).then(response => {
            this.$message({
              message: this.$t('common.optionSuccess'),
              type: 'success'
            })
          })
          this.resetForm()
        } else {
          return false
        }
        this.closeExamine();
      })
    },
    closeExamine(){
      this.$emit('closeExamine')
    }
  }
}
