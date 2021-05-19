<template>
  <el-row>
    <el-col :span="8">
      <div class="left">
        <el-progress
          type="dashboard"
          :percentage="percentage"
          :color="colors"
          :stroke-width="24"
          :show-text="false"
          :width="150"
          stroke-linecap="square"
          style="margin-left: 20px;margin-top: 50px"
        />
        <p>故障设备数</p>
        <p style="margin-top: 10px">{{ equipmentCount }}</p>
      </div>
    </el-col>
    <el-col :span="16">
      <table border="0" cellspacing="0" cellpadding="0">
        <thead>
          <tr style="text-align: center;">
            <td>设备</td>
            <td>状况</td>
            <td>报警</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item,index) in data" :key="index">
            <td style="width: 50%;">{{ item.name }}</td>
            <td style="width: 20%;text-align: center;">{{ item.condition }}</td>
            <td style="width: 30%;">{{ item.date }}</td>
          </tr>
        </tbody>
      </table>

    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'Equipment',
  data() {
    return {
      equipmentCount: 23,
      colors: [
        { color: '#f56c6c', percentage: 20 },
        { color: '#e6a23c', percentage: 40 },
        { color: '#5cb87a', percentage: 60 },
        { color: '#1989fa', percentage: 80 },
        { color: '#6f7ad3', percentage: 100 }
      ],
      data: [
        {
          name: 'GT-JHTG10004.7-20',
          condition: '正常',
          date: ''
        },
        {
          name: 'GT-JHTG10004.7-20',
          condition: '正常',
          date: ''
        },
        {
          name: 'GT-JHTG10004.7-20',
          condition: '正常',
          date: '2021-03-26'
        },
        {
          name: 'GT-JHTG10004.7-20',
          condition: '正常',
          date: ''
        },
        {
          name: 'GT-JHTG10004.7-20',
          condition: '正常',
          date: ''
        },
        {
          name: 'GT-JHTG10004.7-20',
          condition: '正常',
          date: ''
        }
      ]
    }
  },
  computed: {
    percentage() {
      return this.equipmentCount / 100 * 100
    }
  }
}
</script>

<style scoped lang="scss">

  $tableBorderColor: #9fe4e5;

  table {
    width: 90%;
    color: #9fe4e5;
    border-right: 1px solid $tableBorderColor;
    border-bottom: 1px solid $tableBorderColor;
    margin: 30px 10px 0 10px;
  }

  td {
    padding: 5px;
    border-left: 1px solid $tableBorderColor;
    border-top: 1px solid $tableBorderColor;
  }

  .left {
    color: #34fff8;
    overflow: hidden;
    height: 200px;
  }

  .left > p {
    margin: -95px 0 0 0;
    padding: 0;
    text-align: center;
  }
</style>
