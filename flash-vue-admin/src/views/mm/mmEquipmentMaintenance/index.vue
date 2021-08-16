<template>
  <div class="app-container">

    <div class="block">
      <el-form ref="form" style="width:900px" :model="form" :rules="rules" label-width="120px"
               class="align-right has-Label-Width">
        <el-row>
          <el-col :span="12">
            <el-form-item label="维修状态：" >
              <el-checkbox v-model="checked" v-show="!repairStatusShow">报废</el-checkbox>
              <el-radio v-model="repairStatus" label=580 v-show="repairStatusShow">已修复</el-radio>
              <el-radio v-model="repairStatus" label=581 v-show="repairStatusShow">报废</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="维修说明：">
              <el-input v-model="form.notes" minlength="1" type="textarea"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item class="dialog-button-list">
          <el-button type="primary" class="set-common-btn blue-button" @click="save">
            {{$t('button.submit') }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script src="./equipmentMaintenance.js"></script>
