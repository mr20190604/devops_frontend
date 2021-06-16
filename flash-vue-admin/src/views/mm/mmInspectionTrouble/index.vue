<template>
    <div class="app-container">
        <div class="block" >

          <el-form label-width="76px" :inline="true">
            <el-row class="hasmarginBottom">
              <el-col :span="6">
                <el-form-item label="隐患类型：">
                  <dict-select dict-name="隐患类型" v-model="listQuery.troubleType"></dict-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="隐患来源：">
                  <dict-select dict-name="隐患来源"  v-model="listQuery.troubleSource"></dict-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="上报人：">
                 <el-input v-model="listQuery.reportName" placeholder="请输入上报人姓名"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="隐患等级：">
                  <dict-select dict-name="隐患等级"  v-model="listQuery.troubleLevel"></dict-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="hasmarginBottom">
              <el-col :span="6">
                <el-form-item label="审核状态：">
                  <el-select  v-model="listQuery.auditStatus" >
                    <el-option
                      v-for="item in check_list"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="18" align="right">
                <el-button type="primary" icon="el-icon-search" @click.native="search">{{ $t('button.search') }}</el-button>
                <el-button   icon="el-icon-refresh" @click.native="reset">{{ $t('button.reset') }}</el-button>
              </el-col>
            </el-row>
          </el-form>

            <br>
            <el-row>
                <el-col :span="24">
                    <el-button type="success" size="mini"  icon="el-icon-plus" @click.native="add" v-permission="['/inspection/trouble/add']">{{ $t('button.add') }}</el-button>
                    <el-button type="primary" size="mini"  icon="el-icon-edit" @click.native="edit" v-permission="['/inspection/trouble/update']">{{ $t('button.edit') }}</el-button>
                    <el-button type="danger" size="mini"  icon="el-icon-delete" @click.native="remove" v-permission="['/inspection/trouble/delete']">{{ $t('button.delete') }}</el-button>
                </el-col>
            </el-row>
        </div>


        <el-table ref="troubleTable" :data="list" v-loading="listLoading" element-loading-text="Loading" border
                  :row-key="getRowKey"
                  @selection-change="handleSelectionChange"
                  @row-click="toggleSelection"
                  @current-change="handleCurrentChange">
          <el-table-column
            type="selection"
            width="55"
            :reserve-selection="true"
          >
          </el-table-column>
          <el-table-column
            type="index"
            width="55"
            label="序号"
          >
          </el-table-column>
            <el-table-column label="隐患描述">
                <template slot-scope="scope">
                    {{scope.row.troubleInfo}}
                </template>
            </el-table-column>

            <el-table-column label="隐患地址">
                <template slot-scope="scope">
                    {{scope.row.address}}
                </template>
            </el-table-column>
          <el-table-column label="隐患类型"  width="80px" align="center">
            <template slot-scope="scope">
              {{scope.row.troubleTypeName}}
            </template>
          </el-table-column>
            <el-table-column label="隐患来源" width="80px" align="center">
                <template slot-scope="scope">
                    {{scope.row.troubleSourceName}}
                </template>
            </el-table-column>
            <el-table-column label="上报人" width="80px" align="center">
                <template slot-scope="scope">
                  <template v-if="scope.row.reportUser != null">{{scope.row.reportUser.name}}</template>
                </template>
            </el-table-column>
            <el-table-column label="联系电话" width="120px" align="center">
                <template slot-scope="scope">
                  <template v-if="scope.row.reportUser != null">{{scope.row.reportUser.phone}}</template>
                </template>
            </el-table-column>
            <el-table-column label="隐患等级" width="80px" align="center">
                <template slot-scope="scope">
                    {{scope.row.troubleLevelName}}
                </template>
            </el-table-column>
            <el-table-column label="审核状态" width="80px" align="center">
                <template slot-scope="scope">
                  <template v-if="scope.row.auditStatus == 0">待审核</template>
                  <template  v-else-if="scope.row.auditStatus == 1">已审核</template>
                </template>
            </el-table-column>
          <el-table-column label="审核结果" width="80px" align="center">
            <template slot-scope="scope">
              <template v-if="scope.row.auditResult == 0">不通过</template>
              <template  v-else-if="scope.row.auditResult == 1">通过</template>
            </template>
          </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button type="text" size="mini" icon="el-icon-paperclip" @click.native="openProcess(scope.row)"  v-permission="['/mmInspectionTrouble/process']">流程跟踪</el-button>
                  <el-button type="text" icon="el-icon-s-check"  size="mini" @click.native="editItem(scope.row)" v-permission="['/mmInspectionTrouble/audit']">审核</el-button>
                  <el-button type="text" icon="el-icon-location-outline"  size="mini" v-permission="['/mmInspectionTrouble/location']">定位</el-button>
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

      <!--隐患上报审核弹窗-->
        <el-dialog
                :title="formTitle"
                :visible.sync="formVisible"
                width="70%">
            <el-form ref="form" :model="form" :rules="rules" label-width="120px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="隐患类型："  >
                            <dict-select dict-name="隐患类型" v-model="form.troubleType" disabled="false" minlength=1></dict-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="上报人：" >
                            <el-input v-model="form.reportUser.name" disabled="false" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="隐患地点：" >
                            <el-input v-model="form.address" disabled="false" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="联系方式："  >
                            <el-input  v-model="form.reportUser.phone" disabled="false" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="隐患描述："  >
                            <el-input type="textarea" v-model="form.troubleInfo" disabled="false" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
              <div class="el-dialog__header">
                <span class="el-dialog__title">审核</span>
              </div>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="审核结果："  >
                    <el-select  v-model="form.auditResult" >
                      <el-option
                        v-for="item in check_result_list"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="隐患等级："  >
                    <dict-select dict-name="隐患等级" v-model="form.troubleLevel" minlength=1></dict-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="备注："  >
                    <el-input type="textarea" v-model="form.notes" minlength=1></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
                <el-form-item align="center">
                    <el-button type="primary" @click="save">{{ $t('button.submit') }}</el-button>
                    <el-button @click.native="formVisible = false">{{ $t('button.cancel') }}</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

      <!--隐患上报流程弹窗-->
      <el-dialog
        :title="processTitle"
        :visible.sync="processVisiable"
        width="70%"
      >
        <troubleProcess :trouble_list="trouble_list" :trouble_handle_list="trouble_handle_list"></troubleProcess>
      </el-dialog>

    </div>
</template>

<script src="./mmInspectionTrouble.js"></script>
<!--<script>-->
  <!--import TroubleProcess from "./troubleProcess/troubleProcess";-->
  <!--export default {-->
    <!--components: {TroubleProcess}-->
  <!--}-->
<!--</script>-->


<style rel="stylesheet/scss" lang="scss" scoped>
    @import "src/styles/common.scss";
</style>

