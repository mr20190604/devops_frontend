import dsiEnterpriseRiskUnitApi from '@/api/dsi/dsiEnterpriseRiskUnit'
import permission from '@/directive/permission/index.js'
import { remove, getList, save, update, getDicts } from '@/api/system/dict'
import dsiEnterpriseRiskMaterial from "../../../../api/dsi/dsiEnterpriseRiskMaterial";

export default {
  directives: { permission },
  props:['enterpriseId'],
  data() {
    return {
      formVisible: false,
      formTitle: '添加数据资源一体化系统-企业信息-企业风险单元',
      isAdd: true,
      flag:true,
      form: {
        riskName:'',
        enterpriseId:this.enterpriseId,
        isDangerSource:'',
        riskType:[],
        headPerson:'',
        personTel:'',
        isDel:'',
        id: '',
        details:[],
        riskTypeName:'',
        detail:'',
      },
      /* form1:{
         materialId:'',
         riskUnitId:'',
         currentStock:'',
         criticalQuantity:''
       },*/
      isDangerSource:[],
      risk_type:[],
      listQuery: {
        page: 1,
        limit: 10,
        id: undefined,
        enterpriseId:this.enterpriseId,
      },
      total: 0,
      list: [],
      listLoading: true,
      selRow: {},
      selection: [],


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
  // enterpriseRiskUnitTable:null,
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
    this.listQuery.enterpriseId=this.enterpriseId;
    this.init()
  },
  watch:{
    formVisible(newValue) {
      if (!newValue) {
        this.resetForm()
      }
    },
    'enterpriseId':function () {
      this.listQuery.enterpriseId=this.enterpriseId;
      this.fetchData();
    }
  },
  methods: {
    init() {
      this.listQuery.enterpriseId=this.enterpriseId;
      this.fetchData()
    },
    fetchData() {
      this.listLoading = true
      this.listQuery.enterpriseId=this.enterpriseId;
      dsiEnterpriseRiskUnitApi.addUnit(this.listQuery).then(response => {
        this.list = response.data.records;
        this.listLoading = false;
        this.total = response.data.total
      })
      getDicts('风险类型').then(response =>{
        this.risk_type = response.data
      })
      getDicts('是否').then(response =>{
        this.isDangerSource = response.data
      })
    },
    search() {
      this.fetchData()
    },
    reset() {
      this.listQuery.riskName = ''
      this.listQuery.riskType = ''
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
        riskName:'',
        enterpriseId:'',
        isDangerSource:'',
        riskType:'',
        headPerson:'',
        personTel:'',
        isDel:'',
        id: '',
        details: [],
        detail: [],
      }
    },
    add() {
      this.resetForm();
      this.formTitle = '添加风险单元';
        this.formVisible = true;
      this.addDetail();
      this.isAdd = true;
    },
    save() {
      let self=this
      let flag=true;
      this.$refs['form'].validate((valid) => {
        if (valid) {
          const formData = {
            id:this.form.id,
            riskName:this.form.riskName,
            enterpriseId:this.enterpriseId,
            isDangerSource:this.form.isDangerSource,
            riskType:this.form.riskType,
            headPerson:this.form.headPerson,
            personTel:this.form.personTel,
            isDel:this.form.isDel,
          }
          if(this.form.details.length){
            this.form.details.forEach(function (val) {
              if(!val.materialId||!val.currentStock||!val.criticalQuantity){
                flag=false
              }
            });
          }
          if(flag){
            if(formData.id){
              dsiEnterpriseRiskUnitApi.update(formData).then(response => {
                this.$message({
                  message: this.$t('common.optionSuccess'),
                  type: 'success'
                })
                let riskId = formData.id;
                let formList=[];
                dsiEnterpriseRiskMaterial.removeByUnitId(formData.id);
                this.form.details.map(item => {
                  const formData1 = {
                    riskUnitId: riskId,
                    materialId: item.materialId,
                    currentStock: item.currentStock,
                    criticalQuantity: item.criticalQuantity,
                  }
                  formList.push(formData1);
                });
                dsiEnterpriseRiskMaterial.addAll(formList).then(()=>{
                  this.fetchData()
                  this.formVisible = false
                })

              })
            }else {
              dsiEnterpriseRiskUnitApi.add(formData).then(response => {
                this.$message({
                  message: this.$t('common.optionSuccess'),
                  type: 'success'
                })
                let riskId = response.data.id;
                let formList=[];
                this.form.details.map(item => {
                  const formData1 = {
                    riskUnitId: riskId,
                    materialId: item.materialId,
                    currentStock: item.currentStock,
                    criticalQuantity: item.criticalQuantity,
                  }
                  formList.push(formData1);
                });
                dsiEnterpriseRiskMaterial.addAll(formList).then(()=>{
                  this.fetchData()
                  this.formVisible = false
                })
              })
            }
          }else{
            this.$alert('请完善风险物质信息', '提示', {
              confirmButtonText: '确定',
            });
            return false
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
        this.formTitle = '编辑风险单元'
        var detail = this.selRow.detail.split(';')
        var details = []
        if(this.selRow.detail){
          detail.forEach(function (val) {
            let arr = val.split(',')
            details.push({'materialId': arr[0], 'currentStock': arr[1], 'criticalQuantity': arr[2]})
          })
        }
        this.form=JSON.parse(JSON.stringify(this.selRow));
        this.form.details = details;
        this.formVisible = true
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
          dsiEnterpriseRiskUnitApi.remove(id).then(response => {
            this.$message({
              message: this.$t('common.optionSuccess'),
              type: 'success'
            })
            this.$refs.unitTable.clearSelection();
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
    addDetail() {

      let details = this.form.details
      details.push({
        materialId: '',
        currentStock: '',
        criticalQuantity:''
      })
      this.form.details = details
      this.$forceUpdate();
    },
    removeDetail(detail) {
      this.form.details.splice(this.form.details.findIndex(item => item.materialId === detail.materialId), 1);
      console.log(this.form.details);
      //let details = [];
      /*if(this.form.details.length<=1){
        return
      }*/
     /* this.form.details.forEach(function(val, index) {
        if (detail.materialId !== val.materialId) {
          details.push(val)
        }
      })
      this.form.details = details*/
      this.$forceUpdate();
    },
    removeBatch() {
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
        dsiEnterpriseRiskUnitApi.removeBatch1(ids).then(() => {
          this.$message({
            message: this.$t('common.optionSuccess'),
            type: 'success'
          })
          this.$refs.unitTable.clearSelection();
          this.fetchData()
        }).catch(err => {
          this.$notify.error({
            title: '错误',
            message: err
          })
        })
      }).catch(() => {
      })
    },
    onInput(){
      this.$forceUpdate();
    },
    closeFatherDialog(){
      this.$emit("closeDialog");
      //this.$parent.closeDialog();
    },
    toggleSelection(row) {
      this.$refs.unitTable.toggleRowSelection(row)
    },
  }
}
