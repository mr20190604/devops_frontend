<template>
  <div class="app-container">

    <div class="block">
      <el-form ref="form" style="width:900px" :model="form" :rules="rules" label-width="120px"
               class="align-right has-Label-Width">
        <el-row>
          <el-col :span="12">
            <el-form-item label="设备状态：">
              <el-select
                v-model="form.equipmentStatus"
                placeholder="请选择">
                <el-option
                  v-for="item in equipmentStatusList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"/>
              </el-select>
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
