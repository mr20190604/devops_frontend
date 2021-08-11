<template>
  <div class="app-container">

    <div class="block">
      <el-form ref="form" style="width:900px" :model="form" :rules="rules" label-width="120px"
               class="align-right has-Label-Width">
        <el-row>
          <el-col :span="12">
            <el-form-item label="审核结果：">
              <el-radio v-model="form.examinStatus" label="253">通过</el-radio>
              <el-radio v-model="form.examinStatus" label="254">不通过</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="审核意见：">
              <el-input v-model="form.examineOpinion" minlength="1" type="textarea"/>
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

<script src="./examine.js"></script>
