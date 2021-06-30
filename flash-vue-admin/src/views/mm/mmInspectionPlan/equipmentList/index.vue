<template>
  <div class="app-container" style="width:100%">

    <!--列表-->
    <div class="table-list paddingRightZero">
      <div v-if="equipBtnDisplay" class="btnLists">
        <el-button
          class="set-common-btn blue-button"
          type="success"
          size="mini"
          @click="selectEquip"
        >选择设备</el-button>
      </div>
      <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row max-height="331px">
        <el-table-column label="设施设备名称" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.equipment.equipmentName }}
          </template>
        </el-table-column>
        <el-table-column label="位置" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.installLocation }}
          </template>
        </el-table-column>
        <el-table-column label="所属管线" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.pipeline.pipelineCode }}
          </template>
        </el-table-column>
        <el-table-column label="设备类型" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.equipment.equipmentTypeName }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button icon="el-icon-location" type="text" size="mini">定位</el-button>
            <el-button v-if="equipBtnDisplay" type="text" size="mini" @click="removeEquip(scope.row)">删除</el-button>
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
        @current-change="fetchPage"
      />
    </div>
   <!-- 选择设备弹框 -->
    <el-dialog :visible.sync="dialogDisplay" :append-to-body="true" class="el-dialog-style common-dialog-style equip-dialog-style" width="960px">
      <equipList v-if="dialogDisplay" :route-id="pathId" @getEquipList="getEquipList" />
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

