<template>
  <div class="app-container">
    <div class="block">

      <el-form label-width="76px" :inline="true">
        <el-row class="hasmarginBottom">
          <el-col :span="5">
            <el-form-item label="隐患类型：">
              <dict-select v-model="listQuery.troubleType" dict-name="隐患类型" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="隐患来源：">
              <dict-select v-model="listQuery.troubleSource" dict-name="隐患来源" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="上报人：">
              <el-input v-model="listQuery.reportName" placeholder="请输入上报人姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="隐患等级：">
              <dict-select v-model="listQuery.troubleLevel" dict-name="隐患等级" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="hasmarginBottom">
          <el-col :span="5">
            <el-form-item label="审核状态：">
              <el-select v-model="listQuery.auditStatus">
                <el-option
                  v-for="item in check_list"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="18">
            <el-form-item>
              <el-button class="set-common-btn blue-button" type="primary" @click.native="search">{{ $t('button.search') }}</el-button>
              <el-button class="set-common-btn blank-blue-button" @click.native="reset">{{ $t('button.reset') }}</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

    </div>

    <!--列表-->
    <div class="table-list">

      <div class="btnLists">
        <el-button v-permission="['/inspection/trouble/add']" type="success" size="mini" class="set-common-btn blue-button" @click.native="add">{{ $t('button.add') }}</el-button>
        <el-button v-permission="['/inspection/trouble/update']" type="primary" size="mini" class="set-common-btn blank-blue-button" @click.native="edit">{{ $t('button.edit') }}</el-button>
        <el-button v-permission="['/inspection/trouble/delete']" type="danger" size="mini" class="set-common-btn blue-button" @click.native="remove">{{ $t('button.delete') }}</el-button>
      </div>

      <el-table
        ref="troubleTable"
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        border
        :row-key="getRowKey"
        @selection-change="handleSelectionChange"
        @row-click="toggleSelection"
        @current-change="handleCurrentChange"
      >
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
        <el-table-column label="隐患描述" style="width: 200px;" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            {{ scope.row.troubleInfo }}
          </template>
        </el-table-column>

        <el-table-column label="隐患地址" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            {{ scope.row.address }}
          </template>
        </el-table-column>
        <el-table-column label="隐患类型" width="80px" align="center">
          <template slot-scope="scope">
            {{ scope.row.troubleTypeName }}
          </template>
        </el-table-column>
        <el-table-column label="隐患来源" width="80px" align="center">
          <template slot-scope="scope">
            {{ scope.row.troubleSourceName }}
          </template>
        </el-table-column>
        <el-table-column label="上报人" width="80px" align="center">
          <template slot-scope="scope">
            <template v-if="scope.row.reportUser != null">{{ scope.row.reportUser.name }}</template>
          </template>
        </el-table-column>
        <el-table-column label="联系电话" width="120px" align="center">
          <template slot-scope="scope">
            <template v-if="scope.row.reportUser != null">{{ scope.row.reportUser.phone }}</template>
          </template>
        </el-table-column>
        <el-table-column label="隐患等级" width="80px" align="center">
          <template slot-scope="scope">
            {{ scope.row.troubleLevelName }}
          </template>
        </el-table-column>
        <el-table-column label="审核状态" width="80px" align="center">
          <template slot-scope="scope">
            <template v-if="scope.row.auditStatus == 0">待审核</template>
            <template v-else-if="scope.row.auditStatus == 1">已审核</template>
          </template>
        </el-table-column>
        <el-table-column label="审核结果" width="80px" align="center">
          <template slot-scope="scope">
            <template v-if="scope.row.auditResult == 0">不通过</template>
            <template v-else-if="scope.row.auditResult == 1">通过</template>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <!--<el-button v-permission="['/mmInspectionTrouble/process']" type="text" size="mini" icon="el-icon-paperclip" @click.native="openProcess(scope.row)">流程跟踪</el-button>-->
            <el-button v-permission="['/mmInspectionTrouble/audit']" type="text" icon="el-icon-s-check" size="mini" @click.native="editItem(scope.row)">审核</el-button>
            <el-button v-permission="['/mmInspectionTrouble/location']" type="text" icon="el-icon-location-outline" size="mini">定位</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        class="position-pagination"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="[10, 20, 50, 100,500]"
        :page-size="listQuery.limit"
        :total="total"
        @size-change="changeSize"
        @current-change="fetchPage"
        @prev-click="fetchPrev"
        @next-click="fetchNext"
      />
    </div>
    <!--隐患上报审核弹窗-->
    <el-dialog
      class="el-dialog-style common-dialog-style"
      :title="formTitle"
      :visible.sync="formVisible"
      width="960px"
    >
      <div class="block">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px" class="align-right has-Label-Width">
          <el-row>
            <el-col :span="12">
              <el-form-item label="隐患类型：">
                <dict-select v-model="form.troubleType" dict-name="隐患类型" disabled="false" minlength="1" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="上报人：">
                <el-input v-model="form.reportUser.name" disabled="false" minlength="1" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="隐患地点：">
                <el-input v-model="form.address" disabled="false" minlength="1" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系方式：">
                <el-input v-model="form.reportUser.phone" disabled="false" minlength="1" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="隐患描述：">
                <el-input v-model="form.troubleInfo" type="textarea" disabled="false" minlength="1" />
              </el-form-item>
            </el-col>
          </el-row>

          <h3 class="form-title">审核</h3>
          <el-row>
            <el-col :span="12">
              <el-form-item label="审核结果：">
                <el-select v-model="form.auditResult">
                  <el-option
                    v-for="item in check_result_list"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="隐患等级：">
                <dict-select v-model="form.troubleLevel" dict-name="隐患等级" minlength="1" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="备注：">
                <el-input v-model="form.notes" type="textarea" minlength="1" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item class="dialog-button-list">
            <el-button type="primary" class="set-common-btn blue-button" @click="save">{{ $t('button.submit') }}</el-button>
            <el-button class="set-common-btn blank-blue-button" @click.native="formVisible = false">{{ $t('button.cancel') }}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>

    <!--隐患上报流程弹窗-->
    <el-dialog
      :title="processTitle"
      class="el-dialog-style common-dialog-style"
      :visible.sync="processVisiable"
      width="960px"
    >
      <div class="marginT26">
        <troubleProcess :trouble_list="trouble_list" :trouble_handle_list="trouble_handle_list" />
      </div>
    </el-dialog>

  </div>
</template>

<script src="./mmInspectionTrouble.js"></script>
<style lang="scss" scoped>
.form-title{
  color: #1a90ff;
  margin-bottom: 15px;
  padding-left: 8px;
}
</style>
<!--<script>-->
  <!--import TroubleProcess from "./troubleProcess/troubleProcess";-->
  <!--export default {-->
    <!--components: {TroubleProcess}-->
  <!--}-->
<!--</script>-->

