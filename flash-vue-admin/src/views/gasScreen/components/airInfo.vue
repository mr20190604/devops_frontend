<template>
  <el-row class="box">
    <el-col :span="12">
      <el-row>
        <el-col :span="4" class="image air" />
        <el-col :span="16">
          <p class="title">空气优良天数比例</p>
          <p class="quantity">79.3%</p>
        </el-col>
      </el-row>
    </el-col>
    <el-col :span="12">
      <el-row>
        <el-col :span="4" class="image pm" />
        <el-col :span="16">
          <p class="title">PM2.5浓度</p>
          <p class="quantity">39<span>微克/立方米</span></p>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'AirInfo'
}
</script>

<style scoped>

  .box {
    background: url("../../../assets/img/gas/1.png") no-repeat;
    width: 100%;
    height: 140px;
  }

  .el-col {
    margin-top: 25px;
  }

  .image {
    height: 45px;
    width: 45px;
    margin-left: 18px;
  }

  .air {
    background: url("../../../assets/img/gas/空气质量.png") no-repeat;
  }

  .pm {
    background: url("../../../assets/img/gas/形状 4.png") no-repeat;
  }

  .title {
    font-size: 14px;
    font-family: SourceHanSansCN;
    font-weight: 400;
    color: #FFFFFF;
    opacity: 0.85;
    margin-left: 10px;
  }

  .quantity {
    font-size: 26px;
    font-family: Adobe Heiti Std;
    font-weight: 400;
    color: #48FFEE;
    background: linear-gradient(180deg, #FFFFFF 0%, #06B7FC 0%, #45F5E6 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-left: 10px;
  }

  .quantity span {
    font-size: 16px;
  }

</style>
