<template>
  <div class="app-container">
    <div class="table-list marginT15">
    <el-table :data="list" max-height="331px" v-loading="listLoading" element-loading-text="Loading" border
              :row-key="(row) => row.id"
              @selection-change="handleSelectionChange"
              @row-click="toggleSelection"
              @current-change="handleCurrentChange"
              ax-height="331px"
              style="height:auto"
              ref="pipelineTable">
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
      <el-table-column label="管线编号" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.pipelineCode}}
        </template>
      </el-table-column>
      <el-table-column label="管径" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.pipeDiameter}}
        </template>
      </el-table-column>
      <el-table-column label="管长" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.pipeLength}}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="mini" icon="el-icon-edit" v-permission="['/bas/pipeline/update']">定位</el-button>
        </template>
      </el-table-column>
    </el-table>
    </div>
    <div class="dialog-button-list align-center marginT10">
      <el-button v-if="list.length>0" type="primary" class="set-common-btn blue-button" @click="saveLine" style="width: 100px">添加管线</el-button>
      <el-button v-if="list.length==0" type="primary" class="set-common-btn blue-button" @click="closePipeline">返回</el-button>
    </div>
  </div>
</template>

<script src="./pipelineInfo.js">

</script>

<style scoped>

</style>
