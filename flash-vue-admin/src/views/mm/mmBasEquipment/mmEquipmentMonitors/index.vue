<template>
  <!-- <div app-container>
     <div class="block">
       <el-form label-width="84px" class="align-right has-Label-Width" style="width:100%">
         <el-row>
           <el-col :span="8">
             <el-form-item label="编号：">
               <el-input v-model="listQuery.num" size="mini" placeholder="请输编号"></el-input>
             </el-form-item>
           </el-col>
           <el-col :span="8">
             <el-form-item label="中文名：">
               <el-input v-model="listQuery.name" size="mini" placeholder="请输中文名"></el-input>
             </el-form-item>
           </el-col>
           <el-col :span="8" style="text-align: right">
             <el-button class="set-common-btn blue-button" @click.native="search">{{ $t('button.search') }}
             </el-button>
             <el-button class="set-common-btn blank-blue-button" @click.native="reset">{{ $t('button.reset') }}
             </el-button>
           </el-col>
         </el-row>
       </el-form>
       &lt;!&ndash;<el-row>
         <el-col :span="24">
           <el-button type="success" size="mini" icon="el-icon-plus" @click.native="add"
                      v-permission="['/equipment/monitors/add']">{{ $t('button.add') }}
           </el-button>
           <el-button type="primary" size="mini" icon="el-icon-edit" @click.native="edit"
                      v-permission="['/equipment/monitors/update']">{{ $t('button.edit') }}
           </el-button>
           <el-button type="danger" size="mini" icon="el-icon-delete" @click.native="remove"
                      v-permission="['/equipment/monitors/delete']">{{ $t('button.delete') }}
           </el-button>
         </el-col>
       </el-row>&ndash;&gt;

       <el-row>
         <el-col :span="9">
           <div class="table-list" style="height: 450px;width: 100%;padding: 0px">
             <el-table :data="list"
                       v-loading="listLoading"
                       element-loading-text="Loading"
                       border
                       :row-key="row=>row.id"
                       @current-change="handleCurrentChange"
                       @selection-change="handleSelectionChange"
                       ref="allMonitorMaterial">
               <el-table-column type="selection" width="55" :reserve-selection="true"/>
               <el-table-column label="化学式" width="100">
                 <template slot-scope="scope">
                   {{scope.row.num}}
                 </template>
               </el-table-column>
               <el-table-column label="中文名">
                 <template slot-scope="scope">
                   {{scope.row.name}}
                 </template>
               </el-table-column>
             </el-table>
             &lt;!&ndash; <el-pagination
                background
                layout="total, sizes, prev, pager, next, jumper"
                :page-sizes="[10, 20, 50, 100,500]"
                :page-size="listQuery.limit"
                :total="total"
                @size-change="changeSize"
                @current-change="fetchPage"
                @prev-click="fetchPrev"
                @next-click="fetchNext">
              </el-pagination>&ndash;&gt;
           </div>
         </el-col>
         <el-col :span="6" style="text-align: center">
           <button onclick="addMonitor">===></button>
           <button><===</button>
         </el-col>
         <el-col :span="9">
           <div class="table-list" style="height: 450px;width: 100%;padding: 0px">
             <el-table :data="selectedList"
                       v-loading="listLoading"
                       element-loading-text="Loading"
                       border
                       :row-key="row=>row.id"
                       @current-change="handleCurrentChange"
                       @selection-change="handleSelectionChange"
                       ref="selectedMonitorMaterial">
               <el-table-column type="selection" width="55" :reserve-selection="true"/>
               <el-table-column label="化学式" width="100">
                 <template slot-scope="scope">
                   {{scope.row.num}}
                 </template>
               </el-table-column>
               <el-table-column label="中文名">
                 <template slot-scope="scope">
                   {{scope.row.name}}
                 </template>
               </el-table-column>
             </el-table>
             &lt;!&ndash; <el-pagination
                background
                layout="total, sizes, prev, pager, next, jumper"
                :page-sizes="[10, 20, 50, 100,500]"
                :page-size="listQuery.limit"
                :total="total"
                @size-change="changeSize"
                @current-change="fetchPage"
                @prev-click="fetchPrev"
                @next-click="fetchNext">
              </el-pagination>&ndash;&gt;
           </div>
         </el-col>
       </el-row>
     </div>
   </div>-->
  <div>
    <el-transfer
      filterable
      :filter-method="filterMethod"
      v-model="value"
      target-order="push"
      filter-placeholder="请输入物质名称"
      :data="fetchList">
      <el-button class="transfer-footer" slot="right-footer" size="small" @click="saveMonitors()">确定</el-button>
    </el-transfer>
    <el-pagination
      style="position: relative"
      background
      class="position-pagination"
      layout="total, sizes, prev, pager, next, jumper"
      :current-page="currentPage"
      :page-size="pageSize"
      :page-sizes="[10,20,50,100]"
      :total="total"
      @size-change="changeSize"
      @current-change="fetchPage">
    </el-pagination>
  </div>
</template>

<script src="./mmEquipmentMonitors.js"></script>
<style rel="stylesheet/scss" lang="scss" scoped>
</style>

