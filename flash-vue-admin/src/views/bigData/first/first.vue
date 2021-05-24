<template>
    <div>
      <div style="display: inline-block">
        <el-tag effect="plain" style="height: 42px;padding-top: 4px;">时间：</el-tag>
        <el-radio-group v-model="tabPosition" @change="handleClick">
          <el-radio-button label="currentToday">今日</el-radio-button>
          <el-radio-button label="currentWeek">本周</el-radio-button>
          <el-radio-button label="currentMonth">本月</el-radio-button>
        </el-radio-group>
          <span class="demonstration">指定时间：</span>
          <el-date-picker
            v-model="value1"
            type="datetimerange"
            range-separator="至"
            start-placeholder="选择开始日期"
            end-placeholder="选自结束日期">
          </el-date-picker>
          <el-button type="primary" size="mini" icon="el-icon-search" @click.native="search">查询</el-button>
          <el-button  size="mini" icon="el-icon-refresh" @click.native="reset">重置</el-button>
        <br>
        设备类型：
        <el-select v-model="value" placeholder="请选择" @change="selectEquipment">
          <el-option
            v-for="item in deviceTypes"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        </div>
      <el-card >
        <v-chart style="width: 100%;" :options="pieData" ref="lineChart"/>
      </el-card>
    </div>
</template>

<script src="./first.js"></script>

<style scoped>

</style>
