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
        <tr
          v-for="(item,index) in alarmList"
          :key="index"
          style="cursor: pointer"
          @mouseover="handleMouseOver"
          @mouseout="handleMouseOut"
          @click="handleEventClick(item.alarmId)"
        >
          <td
            class="event"
            :title="item.event"
          >
            {{ item.event.length>12?item.event.substring(0,9)+'...':item.event }}
          </td>
          <td
            class="time"
            :title="item.time"
          >
            {{ item.time.split(' ')[1] }}
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
  props: {
    list: {
      type: Array
    }
  },
  data: function() {
    return {
      alarmList: [],
      marginTop: 0,
      interval: undefined
    }
  },
  watch: {
    list(list) {
      this.alarmList = list
    }
  },
  created() {
    this.alarmList = this.list
    this.handleMouseOut()
  },
  methods: {
    showWarningData() {
      this.marginTop -= 1
      if (this.marginTop < -18) {
        this.alarmList.push(this.alarmList[0])
        this.alarmList.shift()
        this.marginTop = 0
      }
    },
    handleMouseOver() {
      clearInterval(this.interval)
    },
    handleMouseOut() {
      this.interval = setInterval(this.showWarningData, 100)
    },
    handleEventClick(alarmId) {
      this.$emit('showWindowInfo', alarmId)
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

  tbody tr {
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

