<template>
  <el-row>
    <el-col v-for="(item,index) in info" :key="index" :span="6">
      <div class="count" :style="{'color':item.color}">
        <ICountUp :end-val="item.value" />
      </div>
      <p class="name">{{ item.name }}</p>
    </el-col>
  </el-row>
</template>

<script>
import ICountUp from 'vue-countup-v2'

export default {
  name: 'CountInfo',
  components: {
    ICountUp
  },
  data: function() {
    return {
      info: [{
        name: '今日报警数',
        value: 4,
        color: '#DE1F35'
      },
      {
        name: '今日处理数',
        value: 3,
        color: '#F9BC31'
      }, {
        name: '累积报警数',
        value: 33,
        color: '#1FC1DE'
      },
      {
        name: '累积处理数',
        value: 200,
        color: '#1FC1DE'
      }]
    }
  }
}
</script>

<style scoped>
  .el-row {
    text-align: justify;
  }

  .el-col {
    height: 161px;
    margin-top: 21px;
    width: 236px;
    margin-left: 25px;
    background: url("../../../assets/img/gas/5.png") no-repeat;
  }

  .el-col:first-child {
    margin-left: 0;
  }

  .count{
    height: 80px;
    width: 85px;
    line-height: 80px;
    font-size: 48px;
    text-align: center;
    background: url("../../../assets/img/gas/charBox.png");
    font-family: Swiss721BT;
    font-weight: bold;
    margin: 20px auto;
  }

  .name{
    text-align: center;
    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #F7F7FC;
  }

</style>
