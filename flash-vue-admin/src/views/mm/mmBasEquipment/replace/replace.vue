<template>
  <div>
    <!--原设备信息展示-->
    <div >
      <div>
        <h3 class="form-title">原设备信息</h3>
      </div>
      <div >
        <el-tabs v-model="activeName">
          <el-tab-pane label="设备基本信息" name="first" id="first" style="height:500px;overflow-y:auto;overflow-x:hidden;">
            <bas-equip :baseInfo="oldInfo" :disableFlag="false"></bas-equip>

            <!--<equipment-info :baseInfo="oldInfo" :disableFlag="false"></equipment-info>-->
          </el-tab-pane>

          <el-tab-pane label="设备安装信息" name="second" id="second" style="height:30%;overflow-y:auto;overflow-x:hidden;"></el-tab-pane>
        </el-tabs>

      </div>

    </div>
    <div align="center">

      <el-button type="success"  class="set-common-btn blue-button" @click="chooseEquip" >选择新设备</el-button>
    </div>

    <!--新设备信息-->
    <div v-if="newInfo">
      <div>
        <h3 class="form-title">新设备信息</h3>
      </div>
      新设备信息
    </div>

    <!--获取可以作为替换的新设备列表弹框-->
    <div>
     <el-dialog
      :title="title"
      :visible="visiable"
      :append-to-body="true"
      @close="visiable = false"
      class="el-dialog-style common-dialog-style"
     >

     </el-dialog>

    </div>

  </div>
</template>

<script>
  import BasEquip from "../equipmentInfo/equipmentInfo";
    export default {
        name: "replace",
      components: {BasEquip},
        props:{
          //原设备信息
          oldInfo:{
            type:Object,
            default: null
          },
        },
      data() {
        return {
          //新设备信息
          newInfo:null,
          title:'',
          visiable:false,
          activeName:'first',
        }
      },
      created() {

      },
      methods:{
        chooseEquip() {
          this.visiable = true;
          this.title = '设备选择';
        }

      }

    }
</script>

<style lang="scss" scoped>
  .form-title{
    color: #1a90ff;
    margin-bottom: 15px;
    padding-left: 8px;
  }




</style>
