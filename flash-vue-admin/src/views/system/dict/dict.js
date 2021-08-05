import { listTreeDict, listParentTreeSelect, addDict, editDict, deleteDict } from '@/api/system/dict'
import permission from '@/directive/permission/index.js'

export default {
  directives: { permission },
  data() {
    return {
      readonly:false,
      btnShow:true,
      idShow:false,
      listLoading: true,
      formTitle: '',
      formVisible: false,
      isAdd: false,
      form: {
        name: '',
        id: '',
        num: '',
        tips: '',
        pid: null
      },
      rules: {
        name: [
          { required: true, message: '请输入字典名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        num: [
          { required: true, message: '请输入字典编码', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ]
      },
      data: [],
      treeData: [],
      selRow: {}
    }
  },
  created() {
    this.init()
  },
  methods: {
    add() {
      this.resetForm()
      this.formTitle = '添加字典'
      this.formVisible = true
      this.isAdd = true
      this.idShow = false
      this.btnShow = true
      this.readonly = false
    },
    save() {
      let self = this
      this.$refs['form'].validate((valid) => {
        if (valid) {
          const formData = {
            name: self.form.name,
            num: self.form.num,
            tips: self.form.tips,
            pid: self.form.pid,
            id: self.form.id
          }
          if (formData.id) {
            editDict(formData).then(response => {
              this.$message({
                message: '提交成功',
                type: 'success'
              })
              self.fetchData()
              self.formVisible = false
            })
          } else {
            addDict(formData).then(response => {
              this.$message({
                message: '提交成功',
                type: 'success'
              })
              self.fetchData()
              self.formVisible = false
            })
          }
        } else {
          return false
        }
      })
    },
    editItem(row) {
      this.idShow = false
      this.btnShow = true
      this.readonly = false
      this.form = Object.assign({}, row)
      if (this.form.pid === 0) {
        this.form.pid = null
      }
      this.formTitle = '编辑字典'
      this.formVisible = true
      this.isAdd = false
    },
    checkDict(row){
      this.idShow = true
      this.btnShow = false
      this.readonly = true
      this.form = Object.assign({}, row)
      if (this.form.pid === 0) {
        this.form.pid = null
      }
      this.formTitle = '查看字典'
      this.formVisible = true
      this.isAdd = false
    },
    removeItem(id){
      this.$confirm('确定删除该记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteDict({'id':id}).then(response => {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.fetchData()
        })
      }).catch(() => {
      })
    },
    resetForm() {
      this.form = {
        name: '',
        id: '',
        num: '',
        tips: '',
        pid: null
      }
    },
    init() {
      this.fetchData()
    },
    fetchData() {
      this.listLoading = true
      listParentTreeSelect().then(response => {
        this.treeData = response.data
      })
      listTreeDict().then(response => {
        this.data = response.data
        this.listLoading = false
      })
    }
  }
}
