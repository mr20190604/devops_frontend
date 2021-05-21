<template>
  <el-row>
    <el-col :span="8">
      <p class="iconTitle coveredArea">建造面积</p>
      <p class="info">
        <span class="quantity">2,818.45</span>
        <span class="unit">m<sup>2</sup></span>
      </p>
    </el-col>
    <el-col :span="8">
      <p class="iconTitle enterpriseNum">企业数量</p>
      <p class="info">
        <span class="quantity">382</span>
        <span class="unit">家</span>
      </p>
    </el-col>
    <el-col :span="8">
      <p class="iconTitle personNum">园区人口</p>
      <p class="info">
        <span class="quantity">3,029</span>
        <span class="unit">人</span>
      </p>
    </el-col>
    <el-col :span="8">
      <p class="iconTitle realtimeArea">监测范围</p>
      <p class="info">
        <span class="quantity">3,516.95</span>
        <span class="unit">m<sup>2</sup></span>
      </p>
    </el-col>
    <el-col :span="8">
      <p class="iconTitle equipmentNum">监测设备</p>
      <p class="info">
        <span class="quantity warningText">382</span>
        <span class="unit">台</span>
      </p>
    </el-col>
    <el-col :span="8">
      <p class="iconTitle equipmentWear">设备损耗</p>
      <p class="info">
        <span class="quantity dangerText">35</span>
        <span class="unit">台</span>
      </p>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'Situation'
}
</script>

<style scoped lang="scss">

  $info: #34fff8;
  $warning: #f19c4b;
  $danger: #b22d36;

  .iconTitle {
    color: rgb(243, 255, 255, 0.8);
    font-size: 16px;
    padding: 10px 0 10px 55px;
    margin: 0;

    &:before {
      content: ' ';
      display: block;
      width: 20px;
      height: 20px;
      background-size: contain;
      position: relative;
      left: -25px;
      top: 18px;
      background-repeat: no-repeat;
    }
  }

  .coveredArea:before {
    background-image: url('../../../assets/img/建造面积.png');
  }

  .enterpriseNum:before {
    background-image: url('../../../assets/img/企业数量.png');
  }

  .personNum:before {
    background-image: url('../../../assets/img/园区人口.png');
  }

  .realtimeArea:before {
    background-image: url('../../../assets/img/实时监测范围.png');
  }

  .equipmentNum:before {
    background-image: url('../../../assets/img/监测设备.png');
  }

  .equipmentWear:before {
    background-image: url('../../../assets/img/设备损耗.png');
  }

  .situation .info {
    text-align: center;
    margin-top: 20px;
  }

  .quantity {
    font-size: 24px;
    color: $info;
    font-family: "DINAIternate-Bold", serif;
    font-style: italic;
    font-weight: bold;
  }

  .unit {
    color: #fff;
    font-size: 14px;
    margin-left: 10px;
  }

  .warningText {
    color: $warning;
  }

  .dangerText {
    color: $danger;
  }

</style>
