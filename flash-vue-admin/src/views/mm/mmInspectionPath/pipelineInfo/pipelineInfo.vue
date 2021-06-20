<template>
  <div class="app-container" style="height: 550px">
    <div class="block">
      <el-form label-width="80px" class="align-right has-Label-Width" style="margin: 0px;padding: 10px">
        <el-row  class="hasmarginBottom" >
          <el-col :span="6">
            <el-form-item label="管线编号：">
              <el-input v-model="listQuery.pipelineCode"  placeholder="请输入管线编号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item>
              <el-button type="primary" class="set-common-btn blue-button" @click.native="search">{{ $t('button.search') }}</el-button>
              <el-button  @click.native="reset" class="set-common-btn blank-blue-button">{{ $t('button.reset') }}</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div class="table-list">
    <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" border
              :row-key="(row) => row.id"
              @selection-change="handleSelectionChange"
              @row-click="toggleSelection"
              @current-change="handleCurrentChange"
              max-height="331px"
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

      <el-table-column label="操作" align="center">>
        <template slot-scope="scope">
          <el-button type="text" size="mini" icon="el-icon-edit" v-permission="['/bas/pipeline/update']">定位</el-button>
        </template>
      </el-table-column>
    </el-table>
    </div>
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
        @next-click="fetchNext">
      </el-pagination>
      <el-button type="primary" class="set-common-btn blue-button width92" @click="saveLine" >选择起点管线</el-button>
  </div>
</template>

<script src="./pipelineInfo.js">

</script>

<style scoped>

</style>
