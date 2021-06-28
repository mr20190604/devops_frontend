<template>
  <div class="app-container">

    <!--查询条件-->
    <div class="block">
      <el-form label-width="90px" :inline="true" class="align-right has-Label-Width" style="width:900px">
        <el-row>
          <el-col :span="9">
            <el-form-item label="设备类型：">
              <dict-select v-model="listQuery.equipType" dict-name="设备类型" placeholder="请选择" />
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label="设备名称：">
              <el-input v-model="listQuery.equipName" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item align="right">
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
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
        :row-key="getRowKey"
        @current-change="handleCurrentChange"
        @selection-change="handleSelectionChange"
      >
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
          <template>
            <el-button type="text" size="mini">定位</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        class="outer-pagenation"
        layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="[2,5]"
        :page-size="listQuery.limit"
        :total="total"
        @size-change="changeSize"
        @current-change="fetchPage"
        @prev-click="fetchPrev"
        @next-click="fetchNext"
      />
    </div>
    <div style="text-align:center">
      <el-button type="primary" class="set-common-btn blue-button" @click="submitEquip">{{ $t('button.submit') }}</el-button>
    </div>
  </div>
</template>

<script src="./equipList.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/common.scss";
</style>

