<template>
  <div class="app-container">

    <!--列表-->
    <div class="table-list">
      <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row>
        <el-table-column label="管线编号">
          <template slot-scope="scope">
            {{scope.row.pipeline.pipelineCode}}
          </template>
        </el-table-column>
        <el-table-column label="管径">
          <template slot-scope="scope">
            {{scope.row.pipeline.pipeDiameter}}
          </template>
        </el-table-column>
        <el-table-column label="管长">
          <template slot-scope="scope">
            {{scope.row.pipeline.pipeLength}}
          </template>
        </el-table-column>
        <el-table-column label="管线类型">
          <template slot-scope="scope">
            <!--{{scope.row.pipeline.pipelineType}}-->
            {{ '燃气' }}
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

<script src="./lineList.js"></script>


<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/common.scss";
</style>

