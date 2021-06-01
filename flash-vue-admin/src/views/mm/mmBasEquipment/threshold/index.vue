
<!--阈值管理组件-->
<template>
  <el-form v-model="thresholdForm" label-width="120px">
    <el-row>
      <el-col :span="12">
        <el-form-item label="设备类别">

          <dict-select dict-name="设备类型"></dict-select>

        </el-form-item>

      </el-col>

      <el-col :span="12">
        <el-form-item label="设备编号">
          <el-input  minlength=1></el-input>

        </el-form-item>

      </el-col>
    </el-row>

    <el-row>

      <el-col :span="12">
        <el-form-item label="三级阈值上限">
          <el-input  minlength=1></el-input>

        </el-form-item>

      </el-col>

      <el-col :span="12">
        <el-form-item label="三级阈值下限">
          <el-input  minlength=1></el-input>

        </el-form-item>
      </el-col>
    </el-row>
    <el-row>

      <el-col :span="12">
        <el-form-item label="二级阈值上限">
          <el-input  minlength=1></el-input>

        </el-form-item>

      </el-col>

      <el-col :span="12">
        <el-form-item label="二级阈值下限">
          <el-input  minlength=1></el-input>

        </el-form-item>
      </el-col>
    </el-row>

    <el-row>

      <el-col :span="12">
        <el-form-item label="一级阈值上限">
          <el-input  minlength=1></el-input>

        </el-form-item>

      </el-col>

      <el-col :span="12">
        <el-form-item label="一级阈值下限">
          <el-input  minlength=1></el-input>

        </el-form-item>
      </el-col>
    </el-row>


  </el-form>
    
</template>

<script>
    export default {
        name: "threshold",
        props:['thresholdForm','equipCodeList'],
        data(){
        return {

        }
        }
    }
</script>

<style scoped>

</style>
