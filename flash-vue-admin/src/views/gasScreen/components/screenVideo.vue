<template>
  <div class="box">
    <div class="titleBox">
      <p class="circle" />
      <p class="title">视频监控</p>
      <p class="subTitle">VIDEO</p>
    </div>
    <el-row>
      <el-col :span="8">
        <el-image :src="require('../../../assets/img/gas/tu1.png')"/>
      </el-col>
      <el-col :span="8">
        <el-image :src="require('../../../assets/img/gas/tu2.png')"/>
      </el-col>
      <el-col :span="8">
        <el-image :src="require('../../../assets/img/gas/tu3.png')"/>
      </el-col>
      <el-col :span="8">
        <el-image :src="require('../../../assets/img/gas/tu4.png')"/>
      </el-col>
      <el-col :span="8">
        <el-image :src="require('../../../assets/img/gas/tu5.png')"/>
      </el-col>
      <el-col :span="8">
        <el-image :src="require('../../../assets/img/gas/tu6.png')"/>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: 'ScreenVideo'
}
</script>

<style scoped>
  .box {
    height: 284px;
    width: 100%;
    margin-top: 20px;
    background: url("../../../assets/img/gas/8.png") no-repeat;
    overflow: hidden;
    position: relative;
  }

  .titleBox {
    margin: 15px 0 0 0;
    padding: 0;
    overflow: hidden;
    position: relative;
    height: 25px;
  }

  .circle {
    width: 22px;
    height: 22px;
    display: inline-block;
    border: 3px solid #09F5D1;
    border-radius: 11px;
    left: 16px;
    line-height: 29px;
    position: absolute;
  }

  .title {
    font-size: 18px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #F7F7FC;
    left: 45px;
    top: 3px;
    display: inline-block;
    position: absolute;
  }

  .subTitle {
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    display: inline-block;
    color: #00F9BB;
    left: 128px;
    top: 8px;
    position: absolute;
  }

  .el-row{
    margin-left: 20px;
    margin-top: 10px;
  }

  .el-col{
    margin-top: 20px;
  }


</style>
