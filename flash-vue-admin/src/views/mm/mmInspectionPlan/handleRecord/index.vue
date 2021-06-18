<template>
  <div class="app-container">

    <!--列表-->
    <div class="table-list">
      <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row>
        <el-table-column label="设备编号" v-if="equipDisplay">
        <template slot-scope="scope">
          {{scope.row.installInfo.equipment.equipmentCode}}
        </template>
      </el-table-column>
        <el-table-column label="设备类型" v-if="equipDisplay">
          <template slot-scope="scope">
            {{scope.row.installInfo.equipment.equipmentTypeName}}
          </template>
        </el-table-column>
        <el-table-column label="管线编号" v-if="lineDisplay">
          <template slot-scope="scope">
            {{scope.row.pipeline.pipelineCode}}
          </template>
        </el-table-column>
        <el-table-column label="管线类型" v-if="lineDisplay">
          <template slot-scope="scope">
            {{scope.row.pipeline.pipelineTypeName}}
          </template>
        </el-table-column>
        <el-table-column label="地址">
          <template slot-scope="scope">
            {{scope.row.address}}
          </template>
        </el-table-column>
        <el-table-column label="问题类型">
          <template slot-scope="scope">
            {{scope.row.problemTypeName}}
          </template>
        </el-table-column>
        <el-table-column label="上报时间">
          <template slot-scope="scope">
            {{scope.row.inspectTime}}
          </template>
        </el-table-column>
        <el-table-column label="巡检结果">
          <template slot-scope="scope">
            <span v-if="scope.row.inspectResult === 1">正常</span>
            <span v-if="scope.row.inspectResult === 2">异常</span>
          </template>
        </el-table-column>
        <el-table-column label="负责人">
          <template slot-scope="scope">
            {{scope.row.user.name}}
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
        :page-sizes="[10, 20, 50, 100,500]"
        :page-size="listQuery.limit"
        :total="total"
        @size-change="changeSize"
        @current-change="fetchPage"
        @prev-click="fetchPrev"
        @next-click="fetchNext">
      </el-pagination>
    </div>

  </div>
</template>

<script src="./recordList.js"></script>


<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/common.scss";
</style>

