<template>
  <div class="box alarm">
    <div class="titleBox">
      <p class="circle" />
      <p class="title">监测报警</p>
      <p class="subTitle">MONITOR ALARM</p>
    </div>
    <table
      border="0"
      cellpadding="0"
      cellspacing="0"
      style="cursor: default"
    >
      <thead>
        <tr>
          <th style="width: 180px;">事件</th>
          <th style="width: 100px">时间</th>
          <th style="width: 50px">等级</th>
          <th style="width: 50px">状态</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item,index) in alarmList" :key="index">
          <td
            class="event"
            :title="item.event"
            style="cursor: pointer"
            @click="handleEventClick(index+1)"
          >
            {{ item.event.length>12?item.event.substring(0,9)+'...':item.event }}
          </td>
          <td class="time">
            {{ item.time }}
          </td>
          <td class="level">
            <span
              style="border-radius: 4px;padding: 2px 5px;"
              :style="{'color':item.level===1?'#F70C27':item.level===2?'#FBB500':'#5B8AD8',
                       'background':item.level===1?'rgba(247,12,39,0.2)':item.level===2?'rgba(251,181,0,0.2)':'rgba(91,138,216,0.2)'}"
            >
              {{ item.level===1?'一':item.level===2?'二':'三' }}级
            </span>
          </td>
          <td class="status">
            {{ item.status===1?'待处置':item.status===2?'处置中':'已处置' }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'AlarmInfo',
  data: function() {
    return {
      alarmList: [{
        event: '高新区望江西路报警,甲烷浓度过高',
        time: '2021-05-21',
        level: 1,
        status: 1
      },
      {
        event: '高新区望江西路报警,甲烷浓度过高',
        time: '2021-05-21',
        level: 1,
        status: 2
      },
      {
        event: '高新区望江西路报警,甲烷浓度过高',
        time: '2021-03-18',
        level: 2,
        status: 2
      },
      {
        event: '高新区望江西路报警,甲烷浓度过高',
        time: '2021-03-12',
        level: 2,
        status: 2
      },
      {
        event: '高新区望江西路报警,甲烷浓度过高',
        time: '2021-03-08',
        level: 2,
        status: 3
      }, {
        event: '高新区望江西路报警,甲烷浓度过高',
        time: '2021-05-21',
        level: 3,
        status: 3
      },
      {
        event: '高新区望江西路报警,甲烷浓度过高',
        time: '2021-05-21',
        level: 3,
        status: 3
      },
      {
        event: '高新区望江西路报警,甲烷浓度过高',
        time: '2021-05-21',
        level: 3,
        status: 3
      }]
    }
  },
  methods: {
    handleEventClick(id) {
      this.$emit('showWindowInfo', id)
    }
  }
}
</script>

<style scoped>
  .box {
    height: 430px;
    width: 100%;
    background: url("../../../assets/img/gas/6.png") no-repeat;
    overflow: hidden;
    position: relative;
  }

  .titleBox {
    margin: 20px 0 0 0;
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

  table {
    margin-top: 25px;
    margin-left: 12px;
  }

  thead {
    height: 36px;
    background: #34658E;
  }

  tbody > tr {
    height: 38px;
  }

  tbody td {
    border-top: 1px solid #41A1EB;
  }

  th, td {
    text-align: center;
    font-size: 14px;
    color: white;
  }

  .event {
    color: #FFF000;
  }

  .time {
    color: #00DAFF
  }

  .status {
    color: #00DAFF
  }

</style>

