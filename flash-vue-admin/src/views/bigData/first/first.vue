<template>
  <div>
    <div class="block">
     <el-form >
       <el-row>
         <el-col :span="6">
           <el-form-item label="时间：">
            <el-radio-group v-model="tabPosition" @change="handleClick">
              <el-radio-button label="currentToday">今日</el-radio-button>
              <el-radio-button label="currentWeek">本周</el-radio-button>
              <el-radio-button label="currentMonth">本月</el-radio-button>
            </el-radio-group>
           </el-form-item>
         </el-col>
         <el-col :span="8">
           <el-form-item label="指定时间：">
              <el-date-picker
                size="mini"
                v-model="date"
                type="datetimerange"
                value-format="yyyy-MM-dd HH:mm:ss"
                range-separator="至"
                start-placeholder="选择开始日期"
                end-placeholder="选自结束日期">
              </el-date-picker>
           </el-form-item>
         </el-col>
         <el-col :span="6">
           <el-form-item label="设备类型：">
            <el-select v-model="value" placeholder="请选择" @change="selectEquipment">
              <el-option
                v-for="item in deviceTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
           </el-form-item>
         </el-col>
         <el-col :span="4">
          <el-button type="primary" class="set-common-btn blue-button" @click.native="search">查询</el-button>
          <el-button class="set-common-btn blank-blue-button" @click.native="reset">重置</el-button>
         </el-col>
       </el-row>
     </el-form>
    </div>
      
     <el-card >
        <v-chart ref="firstChart" style="width: 100%;" :options="pieData"/>
      </el-card>
     </div>
</template>

<script src="./first.js"></script>

<style scoped>

</style>
