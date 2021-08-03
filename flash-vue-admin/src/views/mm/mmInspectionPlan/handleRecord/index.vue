<template>
  <div class="app-container">

    <!--列表-->
    <div class="table-list marginT15">
      <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row>
        <el-table-column v-if="equipDisplay" label="设备编号" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.installInfo.equipment.equipmentCode }}
          </template>
        </el-table-column>
        <el-table-column v-if="equipDisplay" label="设备类型" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.installInfo.equipment.equipmentTypeName }}
          </template>
        </el-table-column>
        <el-table-column v-if="lineDisplay" label="管线编号" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.pipeline.pipelineCode }}
          </template>
        </el-table-column>
        <el-table-column v-if="lineDisplay" label="管线类型" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.pipeline.pipelineTypeName }}
          </template>
        </el-table-column>
        <el-table-column label="地址" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.address }}
          </template>
        </el-table-column>
        <el-table-column label="问题类型" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.problemTypeName }}
          </template>
        </el-table-column>
        <el-table-column label="上报时间" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.inspectTime }}
          </template>
        </el-table-column>
        <el-table-column label="巡检结果" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.inspectResult === 1">正常</span>
            <span v-if="scope.row.inspectResult === 2">异常</span>
          </template>
        </el-table-column>
        <el-table-column label="负责人" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.user.name }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="150px">
          <template slot-scope="scope">
            <el-button icon="el-icon-location" type="text" size="mini">定位</el-button>
            <el-button v-if="scope.row.recordFileList.length > 0" v-permission="['/law/statute/view']" type="text"
                       size="mini" icon="el-icon-view" @click.native="previewFile(scope.row)">预览</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        class="outer-pagenation"
        layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="[10, 20, 50, 100,500]"
        :page-size="listQuery.limit"
        :total="total"
        @size-change="changeSize"
        @current-change="fetchPage"
        @prev-click="fetchPrev"
        @next-click="fetchNext"
      />
    </div>
    <el-dialog
      :title="previewTitle"
      class="el-dialog-style common-dialog-style"
      :visible.sync="previewVisible"
      width="60%"
      append-to-body="true"
    >
      <file-preview :files="files" :download-file-url="downloadUrl"/>
    </el-dialog>
  </div>
</template>

<script src="./recordList.js"></script>

