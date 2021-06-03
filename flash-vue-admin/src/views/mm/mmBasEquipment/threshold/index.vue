
<!--阈值管理组件-->
<template>
  <el-form v-model="thresholdForm" ref="thresholdForm"   label-width="120px">
    <el-row>
      <el-col :span="12">
        <el-form-item label="设备类型">
          <dict-select dict-name="设备类型" :disabled="editFlag" v-model="thresholdForm.equipmentType"></dict-select>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item label="设备编号">
          <el-input  minlength=1 v-if="editFlag" :disabled="editFlag" v-model="equipmentCode"></el-input>
          <el-input  minlength=1 v-else-if="editFlag == false" v-model="equipCodeList"></el-input>
        </el-form-item>

      </el-col>
    </el-row>

    <el-row>

      <el-col :span="12">
        <el-form-item label="三级阈值上限">
          <el-input  minlength=1 v-model="thresholdForm.thirdUpperLimit" oninput="value=value.replace(/[^0-9.]/g,'')" disabled="editFlag"></el-input>

        </el-form-item>

      </el-col>

      <el-col :span="12">
        <el-form-item label="三级阈值下限">
          <el-input  minlength=1 v-model="thresholdForm.thirdLowerLimit" oninput="value=value.replace(/[^0-9.]/g,'')" disabled="editFlag"></el-input>

        </el-form-item>
      </el-col>
    </el-row>
    <el-row>

      <el-col :span="12">
        <el-form-item label="二级阈值上限">
          <el-input  minlength=1 v-model="thresholdForm.secondUpperLimit" oninput="value=value.replace(/[^0-9.]/g,'')" disabled="editFlag"></el-input>

        </el-form-item>

      </el-col>

      <el-col :span="12">
        <el-form-item label="二级阈值下限">
          <el-input  minlength=1 v-model="thresholdForm.firstLowerLimit" oninput="value=value.replace(/[^0-9.]/g,'')" disabled="editFlag"></el-input>

        </el-form-item>
      </el-col>
    </el-row>

    <el-row>

      <el-col :span="12">
        <el-form-item label="一级阈值上限">
          <el-input  minlength=1 v-model="thresholdForm.firstUpperLimit" oninput="value=value.replace(/[^0-9.]/g,'')" disabled="editFlag"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="一级阈值下限">
          <el-input  minlength=1 v-model="thresholdForm.firstLowerLimit" oninput="value=value.replace(/[^0-9.]/g,'')" disabled="editFlag"></el-input>

        </el-form-item>
      </el-col>
    </el-row>


  </el-form>
    
</template>

<script>
    export default {
        name: "threshold",
        props:['thresholdForm','equipCodeList','equipmentCode','editFlag'],
        data(){
        return {

        }
        },
      computed:{
          create() {

            this.clearForm()
          }
      },
      methods:{
          clearForm() {
            this.$refs['thresholdForm'].resetField()
          },

      }

    }
</script>

<style scoped>

</style>
