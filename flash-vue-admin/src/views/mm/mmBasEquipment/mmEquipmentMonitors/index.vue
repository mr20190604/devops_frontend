<template>
  <div app-container>
    <div class="block">
      <!-- <el-form label-width="84px" class="align-right has-Label-Width" style="width:100%">
        <el-row>
          <el-col :span="8">
            <el-form-item label="编号：">
              <el-input v-model="listQuery.num" size="mini" placeholder="请输编号" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="中文名：">
              <el-input v-model="listQuery.name" size="mini" placeholder="请输中文名" />
            </el-form-item>
          </el-col>
          <el-col :span="8" style="text-align: right">
            <el-button class="set-common-btn blue-button" @click.native="search">{{ $t('button.search') }}
            </el-button>
            <el-button class="set-common-btn blank-blue-button" @click.native="reset">{{ $t('button.reset') }}
            </el-button>
          </el-col>
        </el-row>
      </el-form>-->
      <!--<el-row>
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
      </el-row>-->

      <el-row>
        <el-col :span="9">
          <div class="table-list" style="width: 100%;padding: 0px">
            <el-table
              ref="allMonitorMaterial"
              v-loading="listLoading"
              :data="list"
              element-loading-text="Loading"
              border
              :row-key="row=>row.id"
              height="520"
              @current-change="handleCurrentChange"
              @selection-change="handleSelectionChange"
            >
              <el-table-column label="选择监测物质">
                <el-table-column>
                  <template slot="header" slot-scope="scope">
                    <el-input @input="fetchData" v-model="listQuery.key" placeholder="输入编号/名称搜索"/>
                  </template>
                  <el-table-column type="selection" width="55" :reserve-selection="true" />
                  <el-table-column label="编号" width="100">
                    <template slot-scope="scope">
                      {{ scope.row.num }}
                    </template>
                  </el-table-column>
                  <el-table-column label="名称">
                    <template slot-scope="scope">
                      {{ scope.row.name }}
                    </template>
                  </el-table-column>
                </el-table-column>
              </el-table-column>
            </el-table>
            <el-pagination
              background
              layout="total,jumper"
              :page-sizes="[10, 20, 50, 100,500]"
              :page-size="listQuery.limit"
              :total="total"
              @size-change="changeSize"
              @current-change="fetchPage"
              @prev-click="fetchPrev"
              @next-click="fetchNext"
            />
          </div>
        </el-col>
        <el-col :span="6" style="height: 520px">
          <div style="text-align: center;margin-top: 230px"  v-if="!isAdd">
            <button @click="addMonitor">添加监测物质=></button>
            <br><br><br>
            <button @click="removeMonitor"><=移除监测物质</button>
          </div>
        </el-col>
        <el-col :span="9">
          <div class="table-list" style="width:100%;padding: 0px">
            <el-table
              ref="selectedMonitorMaterial"
              v-loading="listLoading1"
              :data="selectedList"
              element-loading-text="Loading"
              border
              :row-key="row=>row.id"
              height="520"
              @current-change="handleCurrentChange1"
              @selection-change="handleSelectionChange1"
            >
              <el-table-column label="已添加监测物质">
                <el-table-column>
                  <template slot="header" slot-scope="scope">
                    <el-input @input="fetchSelectedData" v-model="listQuery1.key" placeholder="输入编号/名称搜索"/>
                  </template>
                  <el-table-column type="selection" width="55" :reserve-selection="true" />
                  <el-table-column label="编号" width="100">
                    <template slot-scope="scope">
                      {{ scope.row.num }}
                    </template>
                  </el-table-column>
                  <el-table-column label="名称">
                    <template slot-scope="scope">
                      {{ scope.row.name }}
                    </template>
                  </el-table-column>
                </el-table-column>
              </el-table-column>
              <!-- <el-table-column
                align="right">
                <template slot="header" slot-scope="scope">
                  <el-input

                    size="mini"
                    placeholder="输入关键字搜索"/>
                </template>
              </el-table-column>-->
            </el-table>
            <el-pagination
              background
              layout="total, jumper"
              :page-sizes="[10, 20, 50, 100,500]"
              :page-size="listQuery1.limit"
              :total="total1"
              @size-change="changeSize1"
              @current-change="fetchPage1"
              @prev-click="fetchPrev1"
              @next-click="fetchNext1"
            />
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
  <!--<div>
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
  </div>-->
</template>

<script src="./mmEquipmentMonitors.js"></script>
<style rel="stylesheet/scss" lang="scss" scoped>
</style>

