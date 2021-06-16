<template>
  <div>
    <div>
      <el-steps active="1" align-center>
        <el-step title="隐患上报" description="隐患上报"></el-step>
        <el-step title="隐患审核" description="隐患审核"></el-step>
        <el-step title="隐患处置" description="隐患处置"></el-step>
      </el-steps>
    </div>
    <div>
      <el-card>
        <div slot="header" class="clearfix">
          <span>隐患上报</span>
        </div>
        <div>
          <el-table :data="trouble_list" v-loading="false" max-height="120px" element-loading-text="Loading" border>
            <el-table-column label="上报人">
              <template slot-scope="scope">
                <template v-if="scope.row.reportUser != null">{{scope.row.reportUser.name}}</template>
              </template>
            </el-table-column>
            <el-table-column label="联系电话">
              <template slot-scope="scope">
                <template v-if="scope.row.reportUser != null">{{scope.row.reportUser.phone}}</template>
              </template>
            </el-table-column>
            <el-table-column label="上报时间">
              <template slot-scope="scope">
                {{scope.row.reportTime}}
              </template>
            </el-table-column>

            <el-table-column label="隐患类型" width="80px" align="center">
              <template slot-scope="scope">
                {{scope.row.troubleTypeName}}
              </template>
            </el-table-column>

            <el-table-column label="隐患位置" width="80px" align="center">
              <template slot-scope="scope">
                {{scope.row.address}}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="220px" align="center">
              <template slot-scope="scope">
                <el-button type="text" icon="el-icon-view"  size="mini">预览</el-button>
                <el-button type="text" icon="el-icon-location-outline"  size="mini" >定位</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
    </div>


  </div>
    
</template>

<script>
    export default {
        name: "troubleProcess",
        props:{
          trouble_list:{
            type:Array,
            default:'',
          },
          trouble_handle_list:{
            type:Array,
            default:'',
          }

        },

    }
</script>

<style scoped>

</style>
