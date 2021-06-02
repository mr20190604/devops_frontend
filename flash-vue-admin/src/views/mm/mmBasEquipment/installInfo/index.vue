<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="施工单位">
            <el-input v-model="form.constructionEnterprise" minlength=1></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="安装方式">
            <el-input v-model="form.installMode" minlength=1></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="安装部位">
            <el-input v-model="form.installLocation" minlength=1></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="安装日期">
            <el-date-picker v-model="form.installDate"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="经度">
            <el-input v-model="form.longitude"  oninput="value=value.replace(/[^0-9.]/g,'')"
                      minlength=1 maxlength=10 ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="纬度">
            <el-input v-model="form.latitude"  oninput="value=value.replace(/[^0-9.]/g,'')"
                      minlength=1 maxlength=10 ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="安装描述信息">
            <el-input v-model="form.installDescribe" minlength=1></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="设备模式">
            <el-input v-model="form.euipmentMode" minlength=1></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属设施">
            <el-input v-model="form.facilitiesId" minlength=1></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="设备数据单位">
            <el-input v-model="form.equipmentUnit" minlength=1></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="上传频率">
            <el-input v-model="form.upFrequency"  oninput="value=value.replace(/[^0-9]/g,'')"
                      minlength=1 maxlength=5 ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="上传频率类型">
            <template>
              <el-select v-model="form.upFrequencyType" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </template>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item id="myself">
        <el-button type="primary" @click="save">{{ $t('button.submit') }}</el-button>
        <el-button @click="closeFatherDialog()">{{ $t('button.cancel') }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script src="./installInfo.js"></script>


<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/common.scss";
</style>

