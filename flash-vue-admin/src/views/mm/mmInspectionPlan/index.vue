<template>
  <div class="app-container">
    <!--查询条件-->
    <div class="block">
      <el-form label-width="76px" :inline="true">
        <el-row class="hasmarginBottom">
          <el-col :span="6">
            <el-form-item label="路线名称:">
              <el-select v-model="listQuery.path" clearable placeholder="请选择">
                <el-option
                  v-for="item in pathList"
                  :key="item.id"
                  :label="item.pathName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="审核状态:">
              <el-select v-model="listQuery.auditStatus" clearable  placeholder="请选择">
                <el-option
                  v-for="item in auditStatusList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="巡检类型:">
              <dict-select v-model="listQuery.inspectType" dict-name="巡检类型" placeholder="请选择巡检类型"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="巡检形式:">
              <dict-select v-model="listQuery.inspectForm" dict-name="巡检形式" placeholder="请选择巡检形式"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="逾期状态:">
              <el-select v-model="listQuery.isOverdue" clearable  placeholder="请选择">
                <el-option
                  v-for="item in overdueList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="巡检状态:">
              <el-select v-model="listQuery.handleStatus" clearable  placeholder="请选择">
                <el-option
                  v-for="item in handleStatusList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="周期:">
              <el-date-picker
                v-model="listQuery.searchTime"
                size="mini"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item>
              <el-button
                type="primary"
                class="set-common-btn blue-button"
                @click.native="search"
              >{{ $t('button.search') }}
              </el-button>
              <el-button
                class="set-common-btn blank-blue-button"
                @click.native="reset"
              >{{ $t('button.reset') }}
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!--列表-->
    <div class="table-list">
      <div class="btnLists">
        <el-button
          v-permission="['/bas/build/add']"
          class="set-common-btn blue-button"
          type="success"
          size="mini"
          @click.native="add"
        >{{ $t('button.add') }}
        </el-button>
      </div>
      <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row
                @current-change="handleCurrentChange">
        <el-table-column label="巡检负责人">
          <template slot-scope="scope">
            {{scope.row.personNames}}
          </template>
        </el-table-column>
        <el-table-column label="路线名称">
          <template slot-scope="scope">
            {{scope.row.path.pathName}}
          </template>
        </el-table-column>
        <el-table-column label="计划开始日期">
          <template slot-scope="scope">
            {{scope.row.startTime}}
          </template>
        </el-table-column>
        <el-table-column label="计划完成日期">
          <template slot-scope="scope">
            {{scope.row.endTime}}
          </template>
        </el-table-column>
        <el-table-column label="审核状态">
          <template slot-scope="scope">
            <span v-if="scope.row.auditStatus === 1">待审核</span>
            <span v-if="scope.row.auditStatus === 2">未通过</span>
            <span v-if="scope.row.auditStatus === 3">已通过</span>
          </template>
        </el-table-column>
        <el-table-column label="巡检类型">
          <template slot-scope="scope">
            {{scope.row.inspectTypeName}}
          </template>
        </el-table-column>
        <el-table-column label="巡查形式">
          <template slot-scope="scope">
            {{scope.row.inspectFormName}}
          </template>
        </el-table-column>
        <el-table-column label="逾期状态">
          <template slot-scope="scope">
            {{scope.row.isOverdue === 1 ? '正常' : '逾期'}}
          </template>
        </el-table-column>
        <el-table-column label="巡查状态">
          <template slot-scope="scope">
            <span v-if="scope.row.handleStatus === 1">未执行</span>
            <span v-if="scope.row.handleStatus === 2">执行中</span>
            <span v-if="scope.row.handleStatus === 3">已完成</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              v-permission="['/bas/build/update']"
              type="text"
              size="mini"
              icon="el-icon-edit"
              v-if="scope.row.auditStatus !== 3"
              @click.native="editItem(scope.row)"
            >{{ $t('button.edit') }}
            </el-button>
            <el-button
              v-permission="['/bas/build/delete']"
              type="text"
              size="mini"
              icon="el-icon-delete"
              v-if="scope.row.auditStatus !== 3"
              @click.native="removeItem(scope.row)"
            >{{ $t('button.delete') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="[10, 20, 50, 100,500]"
        :page-size="listQuery.limit"
        :total="total"
        @size-change="changeSize"
        @current-change="fetchPage"
        @prev-click="fetchPrev"
        @next-click="fetchNext">
      </el-pagination>
    </div>
    <!--弹出框-->
    <el-dialog
      :title="formTitle"
      :visible.sync="formVisible" :modal-append-to-body="false"
      width="70%">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="线路">
              <el-select v-model="form.pathId" placeholder="请选择" @change="changePath(form.pathId)">
                <el-option
                  v-for="item in pathList"
                  :key="item.id"
                  :label="item.pathName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="巡查负责人">
              <el-select v-model="form.personIdList" multiple  placeholder="请选择">
                <el-option
                  v-for="item in inspectionPersonList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="巡检形式">
              <dict-select v-model="form.inspectForm" dict-name="巡检形式"></dict-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计划开始日期">
              <el-date-picker
                v-model="searchTime"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="巡检类型">
              <dict-select v-model="form.inspectType" dict-name="巡检类型" ></dict-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row >
          <el-col>
            <lineList v-if="tableDisplay === 1" :pathId="pathId"></lineList>
          </el-col>
          <el-col>
            <equipmentList v-if="tableDisplay === 2" :pathId="pathId"></equipmentList>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="备注">
              <el-input v-model="form.notes" minlength=1></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item id="myself">
          <el-button type="primary" @click="save">{{ $t('button.submit') }}</el-button>
          <el-button @click.native="formVisible = false">{{ $t('button.cancel') }}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script src="./mmInspectionPlan.js"></script>


<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/common.scss";
</style>

