<template>
  <div class="app-container">
    <div class="block">
      <el-row>
        <el-col :span="24">
          <el-button  size="mini" @click.native="back" class="set-common-btn blue-button back-icon">{{ $t('button.back') }}</el-button>
        </el-col>
      </el-row>
    </div>
   <div class="table-list">
    <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row>

      <el-table-column label="任务名" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.name}}
        </template>
      </el-table-column>
      <el-table-column label="执行时间" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.execAt}}
        </template>
      </el-table-column>
      <el-table-column label="执行结果" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.execSuccess === 1 ? '成功' : '失败'}}
        </template>
      </el-table-column>
      <el-table-column label="异常信息" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.jobException}}
        </template>
      </el-table-column>

    </el-table>

    <el-pagination
      background
      class="position-pagination"
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="[10, 20, 50, 100,500]"
      :page-size="listQuery.limit"
      :total="total"
      :current-page.sync="listQuery.page"
      @size-change="changeSize"
      @current-change="fetchPage"
      @prev-click="fetchPrev"
      @next-click="fetchNext">
    </el-pagination>
  </div>
  </div>
</template>

<script src="./log.js"></script>


<style lang="scss" scoped>
.main-container {
  .table-list{
    height: calc(100% - 53px)
  }
  .back-icon{
    margin: 15px 0 10px 12px;
  }
}

</style>

