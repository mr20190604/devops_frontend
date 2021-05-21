<template>
  <el-row>
    <el-col v-for="item in [29,30,31,32]" :key="item" :span="12">
      <div class="border">
        <el-image
          :src="require('../../../assets/img/图层'+item+'.png')"
          fit="contain"
        />
        <p>A区域1号检查口</p>
      </div>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'Monitoring'
}
</script>

<style scoped lang="scss">

  .el-col{
    padding: 5px 10px 0 10px;
  }

  .border{
    border: 1px solid #34fff8;
    width: 100%;
  }

  .el-image {
    padding: 8px 8px 0 8px;
    width: 100%;
  }

  p {
    margin: 0;
    padding: 0;
    text-align: center;
    color: white;
    font-size: 14px;
  }

</style>
