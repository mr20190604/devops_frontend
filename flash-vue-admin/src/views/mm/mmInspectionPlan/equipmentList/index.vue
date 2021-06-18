<template>
  <div class="app-container">

    <!--列表-->
    <div class="table-list">
      <div class="btnLists" v-if="isAdd">
        <el-button
          class="set-common-btn blue-button"
          type="success"
          size="mini"
          @click = "selectEquip">选择设备</el-button>
      </div>
      <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row>
        <el-table-column label="设施设备名称">
          <template slot-scope="scope">
            {{scope.row.equipment.equipmentName}}
          </template>
        </el-table-column>
        <el-table-column label="位置">
          <template slot-scope="scope">
            {{scope.row.installLocation}}
          </template>
        </el-table-column>
        <el-table-column label="所属管线">
          <template slot-scope="scope">
            {{scope.row.pipeline.pipelineCode}}
          </template>
        </el-table-column>
        <el-table-column label="设备类型">
          <template slot-scope="scope">
            {{scope.row.equipment.equipmentTypeName}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="mini" >定位</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :current-page="currentPage"
        :page-size="pageSize"
        :page-sizes="[2,5]"
        :total="total"
        @size-change="changeSize"
        @current-change="fetchPage">
      </el-pagination>
    </div>

    <el-dialog :visible.sync="dialogDisplay" :modal-append-to-body="false">
      <equipList v-if="dialogDisplay" :routeId="routeId" @getEquipList="getEquipList"></equipList>
    </el-dialog>
  </div>
</template>

<script src="./equipmentList.js"></script>


<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/common.scss";
</style>

