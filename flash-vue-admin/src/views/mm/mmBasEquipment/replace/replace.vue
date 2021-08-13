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
                  <bas-equip :baseInfo="oldInfo" :span-value="10" :parent="oldParent" :disableFlag="true"></bas-equip>
                <!--<equipment-info :baseInfo="oldInfo" :disableFlag="false"></equipment-info>-->
              </el-tab-pane>

              <el-tab-pane label="设备安装信息" name="second"
                           style="height:500px;overflow-y:auto;overflow-x:hidden;visibility: visible">
                <install :equipmentId="oldInfo.id" :isReadonly="true" :spanValue="10.5"  :btnShow="false"></install>
              </el-tab-pane>

              <el-tab-pane label="监测因子信息" name="third" style="height:500px;overflow-y:auto;overflow-x:hidden;visibility: visible">
                <monitoring :equipmentId="oldInfo.id" :isAdd="isAdd"></monitoring>
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
              <bas-equip :baseInfo="newInfo" :span-value="10" :parent="newParent" :disableFlag="true"></bas-equip>
            </el-tab-pane>

            <el-tab-pane label="设备安装信息" name="second" style="height:500px;overflow-y:auto;overflow-x:hidden;">
              <install :equipmentId="newInfo.id" ref="ptClick" :isReadonly="false" :spanValue="10.5" :btnShow="false" ></install>
            </el-tab-pane>

            <el-tab-pane label="监测因子信息" name="third" style="height:500px;overflow-y:auto;overflow-x:hidden;visibility: visible">
              <monitoring :equipmentId="newInfo.id"></monitoring>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-col>
      <el-col :span="12" v-if="!newInfo">
        <equip-list :hidden-list="hiddenTable" :equipment-id="oldInfo.id ? oldInfo.id:null"></equip-list>
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
  import monitoring from '@/views/mm/mmBasEquipment/mmEquipmentMonitors/index.vue'
  export default {
    name: "replace",
    components: {monitoring, EquipList, install, BasEquip},
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
        isAdd:false,
        oldParent:{
          id:null,
          name:null
        },
        newParent:{
          id:null,
          name:null
        }
      }
    },
    created() {

    },
    mounted() {
      this.getParent(this.oldInfo,1)
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
        this.getParent(this.newInfo,2)

      },
      //replace组件调用子组件对安装信息进行保存
      replaceInfo() {
        this.$confirm('是否确认更换?', '提示', {
          confirmButtonText: '更换',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log('111111111111111');
          this.saveEquipBaseInfoHistory();
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
      },
      //父页面调用，清空表单数据
      clearInfo(data) {
       this.newInfo = null;
       this.activeName = 'first';
      },
      saveEquipBaseInfoHistory() {
        console.log('222222222222');
        const formData = {
          id:this.oldInfo.id,
          equipmentStatus:this.oldInfo.equipmentStatus
        }
        mmBasEquipmentApi.updateEquipmentStatus(formData).then(response =>{
          console.log('response',response.success)
        })
      },
      //获取设备父类设备
      getParent(record,type) {
        if (record && record.parentId) {
          mmBasEquipmentApi.getParent(record.parentId).then(response=>{
            if (response.success) {
              if (response.data) {
                var data = response.data;
                if (type == 1) {
                  this.oldParent.id =data.id;
                  this.oldParent.name = data.equipmentName;
                } else {
                  this.newParent.id =data.id;
                  this.newParent.name = data.equipmentName;
                }
              }
            }
          })
        }
        console.log("无父级设备:",type)
      }
    },


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
