<template>
  <div>
    <el-row :gutter="20" style="height: 80%">

      <el-col :span="12">
        <div>
          <div>
            <h3 class="form-title">原设备信息</h3>
          </div>
          <div>
            <el-tabs v-model="activeName">
              <el-tab-pane label="设备基本信息" name="first"
                           style="height:500px;overflow-y:auto;overflow-x:hidden;visibility: visible">
                <bas-equip :baseInfo="oldInfo" :disableFlag="false"></bas-equip>

                <!--<equipment-info :baseInfo="oldInfo" :disableFlag="false"></equipment-info>-->
              </el-tab-pane>

              <el-tab-pane label="设备安装信息" name="second"
                           style="height:500px;overflow-y:auto;overflow-x:hidden;visibility: visible">
                <install :equipmentId="oldInfo.id" :isReadonly="true" :btnShow="false"></install>
              </el-tab-pane>
            </el-tabs>

          </div>

        </div>
      </el-col>


      <el-col :span="12" v-if="newInfo">
        <div>
          <div>
            <h3 class="form-title">新设备信息</h3>
          </div>
          <el-tabs v-model="activeName">
            <el-tab-pane label="设备基本信息" name="first" style="height:500px;overflow-y:auto;overflow-x:hidden;">
              <bas-equip :baseInfo="newInfo" :disableFlag="false"></bas-equip>

              <!--<equipment-info :baseInfo="oldInfo" :disableFlag="false"></equipment-info>-->
            </el-tab-pane>

            <el-tab-pane label="设备安装信息" name="second" style="height:500px;overflow-y:auto;overflow-x:hidden;">
              <install :equipmentId="newInfo.id" :isReadonly="true" :btnShow="false"></install>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-col>
      <el-col :span="12" v-if="!newInfo">
        <equip-list ></equip-list>
      </el-col>
    </el-row>
    <div align="center">
      <el-button type="success" class="set-common-btn blue-button" @click="chooseEquip">选择新设备</el-button>
    </div>


  </div>
</template>

<script>
  import BasEquip from "../equipmentInfo/equipmentInfo";
  import install from '@/views/mm/mmBasEquipment/installInfo/index.vue'
  import EquipList from "../equipList/equipList";

  export default {
    name: "replace",
    components: {EquipList, install, BasEquip},
    props: {
      //原设备信息
      oldInfo: {
        type: Object,
        default: null
      },
    },
    data() {
      return {
        //新设备信息
        newInfo: null,
        title: '',
        visiable: false,
        activeName: 'first',
      }
    },
    created() {

    },
    methods: {
      chooseEquip() {
        if (this.newInfo) {
          this.newInfo = null;
        } else {
          this.newInfo = JSON.parse(JSON.stringify(this.oldInfo));
        }

      }

    }

  }
</script>

<style lang="scss" scoped>
  .form-title {
    color: #1a90ff;
    margin-bottom: 15px;
    padding-left: 8px;
  }


  .el-row {
    margin-bottom: 20px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .el-col {
    border-radius: 4px;
  }

  .bg-purple-dark {
    background: #99a9bf;
  }

  .bg-purple {
    background: #d3dce6;
  }

  .bg-purple-light {
    background: #e5e9f2;
  }

  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }

  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }


</style>
