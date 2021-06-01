<template>
  <div class="app-container">
    <div class="block">
      <el-form :inline="true">
        <el-row>
          <el-col :span="6">
             <el-form-item label="起始日期：">
               <el-date-picker type="date" size="mini" placeholder="起始日期" v-model="listQuery.beginTime" value-format="yyyy-MM-dd"
                          style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
             <el-form-item label="结束日期：">
               <el-date-picker type="date" size="mini" placeholder="结束日期" v-model="listQuery.endTime"  value-format="yyyy-MM-dd"
                          style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item>
              <el-button type="primary" class="set-common-btn blue-button"  @click.native="search">{{ $t('button.search') }}</el-button>
             <el-button type="primary" class="set-common-btn blank-blue-button" @click.native="reset">{{ $t('button.reset') }}</el-button>
             <el-button type="danger" class="set-common-btn blank-blue-button" @click.native="clear" v-permission="['/loginLog/delLoginLog']">{{ $t('button.clear') }}</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!-- <el-row  :gutter="24">
        <el-col :span="4">
          <el-date-picker type="date" size="mini" placeholder="起始日期" v-model="listQuery.beginTime" value-format="yyyy-MM-dd"
                          style="width: 100%;"></el-date-picker>
        </el-col>
        <el-col :span="4">
          <el-date-picker type="date" size="mini" placeholder="结束日期" v-model="listQuery.endTime"  value-format="yyyy-MM-dd"
                          style="width: 100%;"></el-date-picker>
        </el-col>

        <el-col :span="8">
          <el-button type="success" size="mini" icon="el-icon-search" @click.native="search">{{ $t('button.search') }}</el-button>
          <el-button type="primary" size="mini" icon="el-icon-refresh" @click.native="reset">{{ $t('button.reset') }}</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click.native="clear" v-permission="['/loginLog/delLoginLog']">{{ $t('button.clear') }}</el-button>
        </el-col>
      </el-row> -->

    </div>
<div class="table-list paddingTop12">
    <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row>
     <el-table-column type="expand">
       <template slot-scope="props">
         <el-form label-position="left" inline class="flash-table-expand">
           <el-form-item label="用户id">
             <span>{{ props.row.userid }}</span>
           </el-form-item>
           <el-form-item label="日志名称">
             <span>{{ props.row.logname }}</span>
           </el-form-item>
           <el-form-item label="用户">
             <span>{{ props.row.userName }}</span>
           </el-form-item>
           <el-form-item label="IP">
             <span>{{ props.row.ip }}</span>
           </el-form-item>
           <el-form-item label="结果">
             <span>{{ props.row.succeed }}</span>
           </el-form-item>
           <el-form-item label="时间">
             <span>{{ props.row.createtime }}</span>
           </el-form-item>
           <el-form-item label="内容">
             <span>{{ props.row.regularMessage }}</span>
           </el-form-item>
         </el-form>
       </template>
     </el-table-column>

     <el-table-column
       label="用户"
       prop="userName" show-overflow-tooltip>
     </el-table-column>
     <el-table-column
       label="IP"
       prop="ip">
     </el-table-column>
     <el-table-column
       label="日志名称"
       prop="logname" show-overflow-tooltip>
     </el-table-column>
     <el-table-column
       label="时间"
       prop="createtime" show-overflow-tooltip>
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

<script src="./loginLog.js"></script>

