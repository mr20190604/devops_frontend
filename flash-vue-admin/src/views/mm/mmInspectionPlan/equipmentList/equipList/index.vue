<template>
  <div class="app-container">

    <!--查询条件-->
    <div class="block">
      <el-form label-width="76px" :inline="true">
        <el-row>
          <el-col :span="8">
            <el-form-item label="设备类型:">
              <dict-select v-model="listQuery.equipType" dict-name="设备类型"  placeholder="请选择"></dict-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备名称:">
              <el-input v-model="listQuery.equipName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item>
              <el-button
                type="primary"
                class="set-common-btn blue-button"
                @click.native="search"
              >{{ $t('button.search') }}
              </el-button>
              <el-button
                class="set-common-btn blank-blue-button"
                @click.native="reset"
              >{{ $t('button.reset') }}
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <!--列表-->
    <div class="table-list">
      <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row
                @current-change="handleCurrentChange" @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55"
          :reserve-selection="true"
        />
        <el-table-column
          type="index"
          width="55"
          label="序号"
        />
        <el-table-column label="设施设备名称">
          <template slot-scope="scope">
            {{scope.row.pipeline.pipelineCode}}
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

    <el-button type="primary" @click="submitEquip">{{ $t('button.submit') }}</el-button>

  </div>
</template>

<script src="./equipList.js"></script>


<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/common.scss";
</style>

