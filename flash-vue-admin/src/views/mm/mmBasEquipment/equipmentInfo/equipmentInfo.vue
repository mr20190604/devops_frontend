<template>
  <div class="app-container">
    <div class="block">
      <el-form
        ref="form"
        :model="baseInfo"
        label-width="120px"
        class="align-right has-Label-Width"
        :rules="equipmentRules"
      >
        <el-row>
          <el-col :span="spanValue">
            <el-form-item label="设备名称：" prop="equipmentName">
              <el-input v-model="baseInfo.equipmentName" :disabled="disableFlag" minlength="1" placeholder="请输入设备名称" />
            </el-form-item>
          </el-col>
          <el-col :span="spanValue">
            <el-form-item label="设备编码：" prop="equipmentCode">
              <el-input v-model="baseInfo.equipmentCode" :disabled="disableFlag" minlength="1" placeholder="请输入设备编码" />
            </el-form-item>
          </el-col>
          <el-col :span="spanValue">
            <el-form-item label="设备类型：" prop="equipmentType" placeholder="请输入设备类型">
              <dict-select
                v-model="baseInfo.equipmentType"
                :disabled="disableFlag"
                minlength="1"
                dict-name="设备类型"
              />
            </el-form-item>
          </el-col>
          <el-col :span="spanValue">
            <el-form-item label="行政区划：" prop="districtCode">
              <district v-model="baseInfo.districtCode" :disabled="disableFlag" minlength="1" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="spanValue">
            <el-form-item label="管理单位：">
              <el-input v-model="baseInfo.manageEnterprise" :disabled="disableFlag" minlength="1" placeholder="请输入管理单位" />
            </el-form-item>
          </el-col>
          <el-col :span="spanValue">
            <el-form-item label="基本信息：">
              <el-input v-model="baseInfo.baseinfo" :disabled="disableFlag" minlength="1" placeholder="请输入基本信息" />
            </el-form-item>
          </el-col>
          <el-col :span="spanValue">
            <el-form-item label="技术指标：">
              <el-input v-model="baseInfo.specifications" :disabled="disableFlag" minlength="1" placeholder="请输入技术指标" />
            </el-form-item>
          </el-col>
          <el-col :span="spanValue">
            <el-form-item label="接入设备：">
              <el-input v-model="baseInfo.accessDevice" :disabled="disableFlag" minlength="1" placeholder="请输入接入设备" />
            </el-form-item>
          </el-col>
          <el-col :span="spanValue">
            <el-form-item label="传输通道：">
              <el-input v-model="baseInfo.channel" :disabled="disableFlag" minlength="1" placeholder="请输入传输通道" />
            </el-form-item>
          </el-col>
          <el-col :span="spanValue">
            <el-form-item label="厂商：">
              <el-input v-model="baseInfo.manufacturer" :disabled="disableFlag" minlength="1" placeholder="请输入厂商" />
            </el-form-item>
          </el-col>

          <el-col :span="spanValue">
            <el-form-item label="是否叶子节点：" prop="isLeaf">
              <template>
                <el-select v-model="baseInfo.isLeaf" :disabled="disableFlag" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </template>
            </el-form-item>
          </el-col>
          <el-col :span="spanValue">
            <el-form-item label="传输频率：">
              <el-input
                v-model="baseInfo.transmissionFrequency"
                :disabled="disableFlag"
                oninput="value=value.replace(/[^0-9]/g,'')"
                minlength="1"
                maxlength="5"
                placeholder="请输入传输频率"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="spanValue">
            <el-form-item label="父设备：">
              <el-input
                v-model="parent.name"
                minlength="1"
                disabled

              />
            </el-form-item>
          </el-col>

          <el-col :span="spanValue">
            <el-form-item label="精度：">
              <el-input v-model="baseInfo.accuracy" :disabled="disableFlag" minlength="1" placeholder="请输入精度" />
            </el-form-item>
          </el-col>
          <el-col :span="spanValue">
            <el-form-item label="灵敏度：">
              <el-input v-model="baseInfo.sensitivity" :disabled="disableFlag" minlength="1" placeholder="请输入灵敏度" />
            </el-form-item>
          </el-col>

          <el-col :span="spanValue">
            <el-form-item label="供电方式：">
              <!--<el-input v-model="baseInfo.powerModel" :disabled="disableFlag" minlength=1  ></el-input>-->
              <dict-select
                v-model="baseInfo.powerModel"
                dict-name="供电方式"
                :disabled="disableFlag"
                :value="baseInfo.powerModel"
                placeholder="请选择供电方式"
              />
            </el-form-item>
          </el-col>

        </el-row>

        <el-row>
          <el-col :span="spanValue">
            <el-form-item label="供电电压：">
              <el-input
                v-model="baseInfo.supply_voltage"
                :disabled="disableFlag"
                minlength="1"
                oninput="value=value.replace(/[^0-9]/g,'')"
                placeholder="请输入供电电压"
              />
            </el-form-item>
          </el-col>
          <el-col :span="spanValue">
            <el-form-item label="传输方式：">
              <!--<el-input v-model="baseInfo.transmissionType" :disabled="disableFlag" minlength=1   ></el-input>-->
              <dict-select
                v-model="baseInfo.transmissionType"
                dict-name="传输方式"
                :disabled="disableFlag"
                :value="baseInfo.transmissionType"
                placeholder="请选择传输方式"
              />
            </el-form-item>
          </el-col>
          <el-col :span="spanValue">
            <el-form-item label="传输信号强度：">
              <el-input v-model="baseInfo.transmissionTransmission" :disabled="disableFlag" minlength="1" placeholder="请输入传输信号强度" />
            </el-form-item>
          </el-col>
          <el-col :span="spanValue">
            <el-form-item label="传输频率：">
              <el-input
                v-model="baseInfo.transmissionFrequency"
                :disabled="disableFlag"
                minlength="1"
                oninput="value=value.replace(/[^0-9]/g,'')"
                placeholder="请输入传输频率"
              />
            </el-form-item>
          </el-col>

        </el-row>

        <el-row>
          <el-col :span="spanValue">
            <el-form-item label="欠压保护比：">
              <el-input v-model="baseInfo.underVoltageProtec" :disabled="disableFlag" minlength="1" placeholder="请输入欠压保护比" />
            </el-form-item>
          </el-col>

          <el-col :span="spanValue">
            <el-form-item label="检修策略：">
              <el-input v-model="baseInfo.overhaulStrategy" :disabled="disableFlag" minlength="1" placeholder="请输入检修策略" />
            </el-form-item>
          </el-col>

          <el-col :span="spanValue">
            <el-form-item label="平均检修周期：">
              <el-input v-model="baseInfo.overhaulCycle" :disabled="disableFlag" minlength="1" placeholder="请输入平均检修周期" />
            </el-form-item>
          </el-col>

        </el-row>
        <el-row>
          <el-col :span="2*spanValue">
            <el-form-item label="子系统划分：">
              <el-select v-model="sysValue" multiple :disabled="disableFlag" placeholder="请选择所属系统(多选)" class="input_test">
                <el-option
                  v-for="item in sysFlagList"
                  :key="item.id"
                  :label="item.sysName"
                  :value="item.id"
                  style="width: 100%"
                />
              </el-select>

            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="2*spanValue+2">
            <el-form-item label="备注：">
              <el-input v-model="baseInfo.notes" :disabled="disableFlag" minlength="1" type="textarea" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item v-if="!disableFlag" id="myself" class="dialog-button-list">
          <el-button type="primary" class="set-common-btn blue-button" @click="save">{{ $t('button.submit') }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>

  </div>

</template>
<script>
import mmBasEquipmentApi from '@/api/mm/mmBasEquipment'

export default {
  name: 'BasEquip',
  props: {
    baseInfo: {
      type: Object,
      default: () => ({})
    },
    disableFlag: {
      type: Boolean,
      default: false
    },
    parent: {
      type: Object,
      default: () => ({})
    },
    spanValue: {
      type: Number,
      default: 10
    }
  },
  data() {
    return {
      options: [{
        value: 1,
        label: '是'
      }, {
        value: 0,
        label: '否'
      }],
      sysFlagList: [],
      activeName: '',
      sysValue: [],
      equipmentRules: {
        equipmentName: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
        equipmentCode: [{ required: true, message: '请输入设备编号', trigger: 'blur' }],
        equipmentType: [{ required: true, message: '请选择设备类型', trigger: 'blur' }],
        districtCode: [{ required: true, message: '请选择行政区划', trigger: 'blur' }],
        isLeaf: [{ required: true, message: '请选择是否叶子节点', trigger: 'blur' }]
      }
    }
  },
  // beforeCreate() {
  //   mmBasEquipmentApi.getSysList().then(response=>{
  //     if (response.code == 20000 && response.data) {
  //       response.data = this.sysFlagList;
  //     } else {
  //       response.data = []
  //     }
  //   })
  // },
  mounted: function() {
    this.getSysFlagList()
  },
  methods: {
    // 获取系统内所有的pc子系统列表
    getSysFlagList: function() {
      mmBasEquipmentApi.getSysList().then(response => {
        if (response.code == 20000 && response.data) {
          this.sysFlagList = response.data
          this.splitSys()
        } else {
          response.data = []
        }
      })
    },
    // 拆分当前记录所具有的pc子系统权限
    splitSys: function() {
      if (this.baseInfo.sysFlag) {
        var sysStr = this.baseInfo.sysFlag
        console.log('sysFlag', sysStr)
        this.sysFlagList.forEach(item => {
          if (sysStr) {
            if (sysStr.indexOf(item.sysLayout) != -1) {
              this.sysValue.push(item.id)
              console.log('sysValue', this.sysValue)
            }
          }
        })
      }
    },
    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          const formData = {
            id: this.baseInfo.id,
            equipmentName: this.baseInfo.equipmentName,
            equipmentCode: this.baseInfo.equipmentCode,
            pointLocation: this.baseInfo.pointLocation,
            parentId: this.baseInfo.parentId,
            equipmentType: this.baseInfo.equipmentType,
            districtCode: this.baseInfo.districtCode,
            equipmentStatus: 321,
            equipmentRunStatus: this.baseInfo.equipmentRunStatus,
            dataStatus: this.baseInfo.dataStatus,
            manageEnterprise: this.baseInfo.manageEnterprise,
            baseinfo: this.baseInfo.baseinfo,
            specifications: this.baseInfo.specifications,
            accessDevice: this.baseInfo.accessDevice,
            channel: this.baseInfo.channel,
            manufacturer: this.baseInfo.manufacturer,
            modelNumber: this.baseInfo.modelNumber,
            accuracy: this.baseInfo.accuracy,
            sensitivity: this.baseInfo.sensitivity,
            powerModel: this.baseInfo.powerModel,
            supplyVoltage: this.baseInfo.supplyVoltage,
            transmissionType: this.baseInfo.transmissionType,
            transmissionTransmission: this.baseInfo.transmissionTransmission,
            transmissionFrequency: this.baseInfo.transmissionFrequency,
            underVoltageProtect: this.baseInfo.underVoltageProtect,
            overhaulStrategy: this.baseInfo.overhaulStrategy,
            overhaulCycle: this.baseInfo.overhaulCycle,
            isLeaf: this.baseInfo.isLeaf,
            sysFlag: this.baseInfo.sysFlag,
            notes: this.baseInfo.notes,
            examinePerson: this.baseInfo.examinePerson,
            examineOpinion: this.baseInfo.examineOpinion,
            examineDate: this.baseInfo.examineDate,
            registDate: this.baseInfo.registDate,
            isEncrypt: this.baseInfo.isEncrypt,
            productDate: this.baseInfo.productDate,
            isDel: this.baseInfo.isDel,
            monitorStation: this.baseInfo.monitorStation,
            isDisplay: this.baseInfo.isDisplay,
            rfid: this.baseInfo.rfid,
            qrCode: this.baseInfo.qrCode,
            terminalId: this.baseInfo.terminalId,
            extenParam: this.baseInfo.extenParam,
            commands: this.baseInfo.commands,
            installBatch: this.baseInfo.installBatch,
            examineStatus: this.baseInfo.examineStatus,
            registStatus: 574
          }
          if (formData.id) {
            mmBasEquipmentApi.update(formData).then(response => {
              this.$message({
                message: this.$t('common.optionSuccess'),
                type: 'success'
              })
              this.activeName = 'second'
            })
          } else {
            mmBasEquipmentApi.add(formData).then(response => {
              const equipmentId = response.data.id
              const equipmentType = response.data.equipmentType
              if (equipmentId) {
                this.activeName = 'second'
              } else {
                this.activeName = 'first'
              }
              this.$emit('getValue', equipmentId, equipmentType, this.activeName)
              this.$message({
                message: this.$t('common.optionSuccess'),
                type: 'success'
              })
            })
          }
        } else {
          return false
        }
      })
    }
    // sysChange:function () {
    //   console.log(this.sysValue)
    // }

  }
}
</script>

<style lang="scss" scoped>

  $width: 498px;

  > > > .input_test {
    width: $width !important;
  }

  > > > .input_test .el-input {
    width: $width !important;
  }

  > > > .input_test .el-input input {
    width: $width !important;
  }

</style>
