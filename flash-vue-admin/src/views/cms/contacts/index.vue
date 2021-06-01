<template>
  <div class="app-container">
    <div class="block">
      <el-form>
        <el-row>
          <el-col :span="6">
            <el-form-item label="姓名：">
                  <el-input v-model="listQuery.userName" size="mini" placeholder="请输入姓名"></el-input>
              </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="手机号：">
                  <el-input v-model="listQuery.mobile" size="mini" placeholder="请输入手机号"></el-input>
              </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="邀约日期：">
                 <el-date-picker
                  v-model="rangeDate"
                  size="mini"
                  type="datetimerange"
                  :picker-options="pickerOptions"
                  range-separator="至"
                  start-placeholder="邀约开始日期"
                  end-placeholder="邀约截至日期"
                  value-format="yyyyMMddHHmmss"
                  align="right">
                </el-date-picker>
              </el-form-item>
          </el-col>
            <el-col :span="4">
            <el-button type="success" class="set-common-btn blue-button" @click.native="search">{{ $t('button.search') }}</el-button>
            <el-button  class="set-common-btn blank-blue-button" @click.native="reset">{{ $t('button.reset') }}</el-button>
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
      <el-table-column label="联系人" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.userName}}
        </template>
      </el-table-column>
      <el-table-column label="联系手机" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.mobile}}
        </template>
      </el-table-column>
      <el-table-column label="email" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.email}}
        </template>
      </el-table-column>
      <el-table-column label="邀约时间" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.createTime}}
        </template>
      </el-table-column>
      <el-table-column label="备注" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.remark}}
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

<script src="./contacts.js"></script>



