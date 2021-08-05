<template>
  <div class="app-container">
    <div class="block" >
      <el-form ref="form" :model="baseInfo" label-width="120px" class="align-right has-Label-Width" size="mini">
        <el-row >
          <el-col :span="spanValue">
            <el-form-item label="设备名称：">
              <el-input v-model="baseInfo.equipmentName" :disabled="disableFlag" minlength=1></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="spanValue">
            <el-form-item label="设备编码：">
              <el-input v-model="baseInfo.equipmentCode" :disabled="disableFlag" minlength=1></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="spanValue">
            <el-form-item label="设备类型：">
              <dict-select v-model="baseInfo.equipmentType" :disabled="disableFlag" minlength=1
                           dict-name="设备类型"></dict-select>
            </el-form-item>
          </el-col>
          <el-col :span="spanValue">
            <el-form-item label="行政区划：">
              <district v-model="baseInfo.districtCode" :disabled="disableFlag" minlength=1></district>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="spanValue">
            <el-form-item label="管理单位：">
              <el-input v-model="baseInfo.manageEnterprise" :disabled="disableFlag" minlength=1></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="spanValue">
            <el-form-item label="基本信息：">
              <el-input v-model="baseInfo.baseinfo" :disabled="disableFlag" minlength=1></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="spanValue">
            <el-form-item label="技术指标：">
              <el-input v-model="baseInfo.specifications" :disabled="disableFlag" minlength=1></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="spanValue">
            <el-form-item label="接入设备：">
              <el-input v-model="baseInfo.accessDevice" :disabled="disableFlag" minlength=1></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="spanValue">
            <el-form-item label="传输通道：">
              <el-input v-model="baseInfo.channel" :disabled="disableFlag" minlength=1></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="spanValue">
            <el-form-item label="厂商：">
              <el-input v-model="baseInfo.manufacturer" :disabled="disableFlag" minlength=1></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="spanValue">
            <el-form-item label="是否叶子节点：">
              <template>
                <el-select v-model="baseInfo.isLeaf" :disabled="disableFlag" placeholder="请选择">
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
          <el-col :span="spanValue">
            <el-form-item label="传输频率：">
              <el-input v-model="baseInfo.transmissionFrequency"
                        :disabled="disableFlag"
                        oninput="value=value.replace(/[^0-9]/g,'')"
                        minlength=1 maxlength=5></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="spanValue">
            <el-form-item label="父设备ID：">
              <el-input v-model="baseInfo.parentId" :disabled="disableFlag" minlength=1
                        oninput="value=value.replace(/[^0-9]/g,'')"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="spanValue">
            <el-form-item label="精度：">
              <el-input v-model="baseInfo.accuracy" :disabled="disableFlag" minlength=1></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="spanValue">
            <el-form-item label="灵敏度：">
              <el-input v-model="baseInfo.sensitivity" :disabled="disableFlag" minlength=1></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="spanValue">
            <el-form-item label="供电方式：">
              <!--<el-input v-model="baseInfo.powerModel" :disabled="disableFlag" minlength=1  ></el-input>-->
              <dict-select dict-name="供电方式" :disabled="disableFlag" :value="baseInfo.powerModel"
                           v-model="baseInfo.powerModel"></dict-select>
            </el-form-item>
          </el-col>


        </el-row>

        <el-row>
          <el-col :span="spanValue">
            <el-form-item label="供电电压：">
              <el-input v-model="baseInfo.supply_voltage" :disabled="disableFlag" minlength=1
                        oninput="value=value.replace(/[^0-9]/g,'')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="spanValue">
            <el-form-item label="传输方式：">
              <!--<el-input v-model="baseInfo.transmissionType" :disabled="disableFlag" minlength=1   ></el-input>-->
              <dict-select dict-name="传输方式" :disabled="disableFlag" :value="baseInfo.transmissionType"
                           v-model="baseInfo.transmissionType"></dict-select>
            </el-form-item>
          </el-col>
          <el-col :span="spanValue">
            <el-form-item label="传输信号强度：">
              <el-input v-model="baseInfo.transmissionTransmission" :disabled="disableFlag" minlength=1></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="spanValue">
            <el-form-item label="传输频率：">
              <el-input v-model="baseInfo.transmissionFrequency" :disabled="disableFlag" minlength=1
                        oninput="value=value.replace(/[^0-9]/g,'')"></el-input>
            </el-form-item>
          </el-col>

        </el-row>

        <el-row>
          <el-col :span="spanValue">
            <el-form-item label="欠压保护比：">
              <el-input v-model="baseInfo.underVoltageProtec" :disabled="disableFlag" minlength=1></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="spanValue">
            <el-form-item label="检修策略：">
              <el-input v-model="baseInfo.overhaulStrategy" :disabled="disableFlag" minlength=1></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="spanValue">
            <el-form-item label="平均检修周期：">
              <el-input v-model="baseInfo.overhaulCycle" :disabled="disableFlag" minlength=1></el-input>
            </el-form-item>
          </el-col>


        </el-row>
        <el-row>
          <el-col :span="2*spanValue">
            <el-form-item label="子系统划分：">
              <el-select v-model="sysValue" multiple :disabled="disableFlag" placeholder="请选择" class="input_test" style="width: calc(100% - 120px)" >
                <el-option
                  v-for="item in sysFlagList"
                  :key="item.id"
                  :label="item.sysName"
                  :value="item.id">
                </el-option>
              </el-select>

            </el-form-item>
          </el-col>
        </el-row>


        <el-row>
          <el-col :span="2*spanValue">
            <el-form-item label="备注：">
              <el-input v-model="baseInfo.notes" :disabled="disableFlag" minlength=1 type="textarea"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>


  </div>


</template>
<script>
  import mmBasEquipmentApi from '@/api/mm/mmBasEquipment';

  export default {
    name: "basEquip",
    props: {
      baseInfo: {
        type: Object,
        default: null
      },
      disableFlag: {
        type: Boolean,
        default: false,
      },
      parentId: {
        type: Number,
        default: null
      },
      spanValue: {
        type:Number,
        default:10,
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
        sysValue: [],
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
    mounted: function () {
      this.getSysFlagList();
    },
    methods: {
      getSysFlagList: function () {
        mmBasEquipmentApi.getSysList().then(response => {
          if (response.code == 20000 && response.data) {
            this.sysFlagList = response.data;
            this.splitSys();
          } else {
            response.data = []
          }
        })

      },
      splitSys: function () {
        var sysStr = this.baseInfo.sysFlag;
        console.log('sysFlag', sysStr);
        this.sysFlagList.forEach(item => {
          if (sysStr.indexOf(item.sysLayout) != -1) {
            this.sysValue.push(item.id);
            console.log('sysValue', this.sysValue);
          }
        })

      },
      // sysChange:function () {
      //   console.log(this.sysValue)
      // }

    }
  }
</script>

<style lang="scss" scoped>

  >>> .input_test  .el-input__inner {
    width: 400px !important;
  }

</style>
