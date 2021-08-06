<template>
  <div style="padding-top: 10px">
    <el-row :gutter="20" style="height: 80%">

      <el-col :span="12">
        <div>
          <div>
            <h3 class="form-title">原设备信息</h3>
          </div>
          <div >
            <el-tabs v-model="activeName">
              <el-tab-pane label="设备基本信息" name="first"
                           style="height:500px;overflow-y:auto;overflow-x:hidden;visibility: visible">
                  <bas-equip :baseInfo="oldInfo" :span-value="10" :disableFlag="true"></bas-equip>
                <!--<equipment-info :baseInfo="oldInfo" :disableFlag="false"></equipment-info>-->
              </el-tab-pane>

              <el-tab-pane label="设备安装信息" name="second"
                           style="height:500px;overflow-y:auto;overflow-x:hidden;visibility: visible">
                <install :equipmentId="oldInfo.id" :isReadonly="true" :spanValue="10.5"  :btnShow="false"></install>
              </el-tab-pane>

              <el-tab-pane label="监测因子信息" name="third" style="height:500px;overflow-y:auto;overflow-x:hidden;visibility: visible">

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
              <bas-equip :baseInfo="newInfo" :span-value="10" :disableFlag="true"></bas-equip>
            </el-tab-pane>

            <el-tab-pane label="设备安装信息" name="second" style="height:500px;overflow-y:auto;overflow-x:hidden;">
              <install :equipmentId="newInfo.id" ref="ptClick" :isReadonly="false" :spanValue="10.5" :btnShow="false" ></install>
            </el-tab-pane>

            <el-tab-pane label="监测因子信息" name="third" style="height:500px;overflow-y:auto;overflow-x:hidden;visibility: visible">

            </el-tab-pane>
          </el-tabs>
        </div>
      </el-col>
      <el-col :span="12" v-if="!newInfo">
        <equip-list :hidden-list="hiddenTable"></equip-list>
      </el-col>
    </el-row>
    <div align="center" v-if="newInfo">
      <el-button type="success" class="set-common-btn blue-button" @click="chooseEquip">选择新设备</el-button>
      <el-button type="success" class="set-common-btn blue-button" @click="replaceInfo">更换</el-button>
    </div>


  </div>
</template>

<script>
  import mmBasEquipmentApi from '@/api/mm/mmBasEquipment'
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
      //显示table列表
      chooseEquip() {
       this.newInfo = null;
      },
      //被install子组件调用的方法，用于隐藏table列表
      hiddenTable:function (record) {
        console.log('hiddenTable');
        this.newInfo = record;
      },
      //replace组件调用子组件对安装信息进行保存
      replaceInfo() {
        this.$confirm('是否确认更换?', '提示', {
          confirmButtonText: '更换',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.saveEquipPoint()
        }).catch(() => {

        });
      },
      // //子组件通过@事件方式调用的方法，用于安装信息保存成功后关闭弹框
      // changeEvent(data) {
      //   console.log(data);
      //   this.$emit('close-dialog')
      // }
      //根据设备id对设备点位号进行更换
      saveEquipPoint() {
        const formData = {
          id:this.newInfo.id,
          pointLocation:this.oldInfo.pointLocation
        }
        mmBasEquipmentApi.updataPoingLocation(formData).then(response =>{
          if (response.success) {
            this.$refs.ptClick.installReplaceSave();
            this.$emit('close-dialog')
          }
        })
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
