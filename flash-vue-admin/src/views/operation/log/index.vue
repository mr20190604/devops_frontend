<template>
  <div class="app-container two-line-form-container">
    <div class="block">
      <el-form>
        <el-row class="hasmarginBottom">
          <el-col :span="7">
             <el-form-item label="起始日期：">
                 <el-date-picker type="date" size="mini" placeholder="起始日期" v-model="listQuery.beginTime" value-format="yyyy-MM-dd"
                         ></el-date-picker>
            </el-form-item>
           </el-col>
            <el-col :span="7">
              <el-form-item label="结束日期：">
                  <el-date-picker type="date" size="mini" placeholder="结束日期" v-model="listQuery.endTime"  value-format="yyyy-MM-dd"
                           ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="日志名称：">
                 <el-input v-model="listQuery.logName" size="mini" placeholder="日志名称"></el-input>
              </el-form-item>
            </el-col>
             <el-col :span="5">
              <el-form-item label="日志类型：">
                 <dict-select v-model="listQuery.logType" dict-name="日志类型" placeholder="请选择日志类型" />
              </el-form-item>
            </el-col>
        </el-row>
        <el-row>
           <el-col>
              <el-form-item>
                <el-button type="primary" class="set-common-btn blue-button"  @click.native="search">{{ $t('button.search') }}</el-button>
              <el-button type="primary" class="set-common-btn blank-blue-button" @click.native="reset">{{ $t('button.reset') }}</el-button>
              <el-button type="danger" class="set-common-btn blank-blue-button" @click.native="clear" v-permission="['/log/delLog']">{{ $t('button.clear') }}</el-button>
              </el-form-item>
            </el-col>
        </el-row>
        
      </el-form>
    
    </div>
 <div class="table-list paddingTop12 outer-table-list no-btnlists-table">
    <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row>
     <el-table-column type="expand">
       <template slot-scope="props">
         <el-form  inline label-width="90px" class="flash-table-expand expand-log-form align-right has-Label-Width">
           <el-form-item label="日志类型：">
             <span>{{ props.row.logtype }}</span>
           </el-form-item>
           <el-form-item label="日志名称：">
             <span>{{ props.row.logname }}</span>
           </el-form-item>
           <el-form-item label="用户：">
             <span>{{ props.row.userName }}</span>
           </el-form-item>
           <el-form-item label="类名：">
             <span>{{ props.row.classname }}</span>
           </el-form-item>
           <el-form-item label="方法名：">
             <span>{{ props.row.method }}</span>
           </el-form-item>
           <el-form-item label="时间：">
             <span>{{ props.row.createtime }}</span>
           </el-form-item>
           <el-form-item label="内容：">
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
       label="日志类型"
       prop="logtype" show-overflow-tooltip>
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

<script src="./log.js"></script>


