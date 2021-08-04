<template>
  <div class="app-container">
    <div class="block">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px" class="align-right has-Label-Width">
      <el-row>
        <el-col :span="12">
          <el-form-item label="施工单位：">
            <el-input v-model="form.constructionEnterprise" minlength=1></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="安装方式：">
            <el-input v-model="form.installMode" minlength=1></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="安装部位：">
            <el-input v-model="form.installLocation" minlength=1></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="安装日期：">
            <el-date-picker v-model="form.installDate" type="date" value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="经度：">
            <el-input v-model="form.longitude"  oninput="value=value.replace(/[^0-9.]/g,'')"
                      minlength=1 maxlength=10 ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="纬度：">
            <el-input v-model="form.latitude"  oninput="value=value.replace(/[^0-9.]/g,'')"
                      minlength=1 maxlength=10 ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="安装描述信息：">
            <el-input v-model="form.installDescribe" minlength=1></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="设备数据单位：">
            <el-input v-model="form.equipmentUnit" minlength=1></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="上传频率：">
            <el-input v-model="form.upFrequency" minlength=1 oninput="value=value.replace(/[^0-9.]/g,'')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="上传频率类型：">
            <template>
              <el-select v-model="form.upFrequencyType" placeholder="请选择">
                <el-option
                  v-for="item in upFrequencyTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </template>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="设施类型：">
            <template>
              <el-select v-model="form.facilitiesType" placeholder="请选择" @change="changeFacilitiesType(form.facilitiesType)">
                <el-option
                  v-for="item in facilitiesTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </template>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属设施：">
            <template>
              <el-select v-model="form.facilitiesId" placeholder="请选择">
                <el-option
                  v-for="item in facilitiesList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </template>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="设备模式：">
            <template>
              <el-select v-model="form.euipmentMode" placeholder="请选择">
                <el-option
                  v-for="item in euipmentModeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </template>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item id="myself" class="dialog-button-list">
        <el-button type="primary" @click="save" class="set-common-btn blue-button">{{ $t('button.submit') }}</el-button>
      </el-form-item>
    </el-form>
  </div>
  </div>
</template>

<script src="./installInfo.js"></script>




