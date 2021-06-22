<template>
  <div class="app-container" style="width:100%">

    <!--列表-->
    <div class="table-list">
      <div class="btnLists" v-if="equipBtnDisplay">
        <el-button
          class="set-common-btn blue-button"
          type="success"
          size="mini"
          @click = "selectEquip">选择设备</el-button>
      </div>
      <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row>
        <el-table-column label="设施设备名称" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.equipment.equipmentName}}
          </template>
        </el-table-column>
        <el-table-column label="位置" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.installLocation}}
          </template>
        </el-table-column>
        <el-table-column label="所属管线" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.pipeline.pipelineCode}}
          </template>
        </el-table-column>
        <el-table-column label="设备类型" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.equipment.equipmentTypeName}}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="mini" >定位</el-button>
            <el-button type="text" size="mini" @click="removeEquip(scope.row)" v-if="equipBtnDisplay">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        class="outer-pagenation"
        layout="total, sizes, prev, pager, next, jumper"
        :current-page="currentPage"
        :page-size="pageSize"
        :page-sizes="[2,5]"
        :total="total"
        @size-change="changeSize"
        @current-change="fetchPage">
      </el-pagination>
    </div>

    <el-dialog :visible.sync="dialogDisplay" :append-to-body="true" class="el-dialog-style common-dialog-style equip-dialog-style" width="960px">
      <equipList v-if="dialogDisplay" :routeId="pathId" @getEquipList="getEquipList"></equipList>
    </el-dialog>
  </div>
</template>

<script src="./equipmentList.js"></script>
<style lang="scss" scoped>
>>> .equip-dialog-style{
  .block .el-form .el-row .el-col:nth-of-type(even){
    display: initial;
  }
}
</style>


