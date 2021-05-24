<template>
  <el-tabs v-model="activeName" @tab-click="handleClick" style="padding:5px 0 0 5px;">
    <el-tab-pane label="监测点污染因子比例分析" name="first">
      <first></first>
    </el-tab-pane>
    <el-tab-pane label="监测点数据趋势" name="second">

    </el-tab-pane>
    <el-tab-pane label="环境大数据分析" name="third">

    </el-tab-pane>
  </el-tabs>
</template>


<script src="./bigDataAnalysis.js"></script>
<style scoped>

</style>
