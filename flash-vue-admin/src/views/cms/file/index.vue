<template>
  <div class="app-container">
    <div class="block">
       <el-form>
        <el-row>
          <el-col :span="6">
            <el-form-item label="文件名：">
              <el-input v-model="listQuery.originalFileName" size="mini" placeholder="文件名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="18">
              <el-button type="success" size="mini" class="set-common-btn blue-button" @click.native="search">{{ $t('button.search') }}</el-button>
              <el-button type="primary" size="mini" class="set-common-btn blank-blue-button" @click.native="reset">{{ $t('button.reset') }}</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div class="table-list paddingTop12">
    <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row
    @current-change="handleCurrentChange">

      <el-table-column label="ID" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.id}}
        </template>
      </el-table-column>
      <el-table-column label="文件名3" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.originalFileName}}
        </template>
      </el-table-column>
      <el-table-column label="缩略图">
        <template slot-scope="scope">
          <img style="width:60px" v-if="chkFileType(scope.row.originalFileName,'.jpg,.png,.gif,.bmp')" :src="imgHost+scope.row.id">

        </template>
      </el-table-column>
      <el-table-column label="上传日期" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.createTime}}
        </template>
      </el-table-column>
      <el-table-column label="下载" align="center">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-download" size="mini" @click.native="download(scope.row.id,scope.row.originalFileName)">下载</el-button>
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

<script src="./file.js"></script>

