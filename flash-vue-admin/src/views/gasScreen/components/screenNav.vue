<template>
  <div class="box">
    <div class="running">
      <p>系统运行<span>1366</span>天</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ScreenNav'
}
</script>

<style scoped>
  .box {
    width: 100%;
    height: 84px;
    margin-top: 2px;
    background: url("../../../assets/img/gas/4.png");
    overflow: hidden;
  }

  .running {
    height: 65px;
    width: 264px;
    background: url("../../../assets/img/gas/di.png") no-repeat;
    margin: 8px auto;
  }

  .running > p {
    font-size: 18px;
    font-family: Adobe Heiti Std;
    font-weight: normal;
    color: #48FFEE;
    line-height: 88px;
    text-align: center;
  }

  .running > p>span{
    font-size: 48px;
    line-height: 52px;
    margin: 0 8px;
  }

</style>
