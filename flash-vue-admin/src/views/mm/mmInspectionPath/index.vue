<template>
    <div class="app-container">
        <div class="block">
          <el-form label-width="76px" class="align-right has-Label-Width">
            <el-row>
              <el-col :span="5">
                <el-form-item label="路线名称：">
                  <el-input v-model="listQuery.pathName"  placeholder="请输入路线名称"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="路线状态：">
                  <dict-select   v-model="listQuery.pathStatus" dict-name="状态" placeholder="请选择路线状态"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="创建时间：">
                  <el-date-picker
                    v-model="listQuery.createTime"
                    size="mini"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <!--<el-col :span="12">
                <el-form-item label="创建人：">
                  <el-select v-model="listQuery.createBy"  placeholder="请选择创建人">
                    <el-option
                      v-for="item in people_list"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>-->
              <el-col :span="6">
                <el-form-item>
                  <el-button type="primary" class="set-common-btn blue-button" @click.native="search">{{ $t('button.search') }}</el-button>
                  <el-button  @click.native="reset" class="set-common-btn blank-blue-button">{{ $t('button.reset') }}</el-button>
                </el-form-item>
              </el-col>
            </el-row>

          </el-form>
        </div>
      <div class="table-list">
        <div class="btnLists">
              <el-button type="primary" size="mini"  class="set-common-btn blue-button" @click.native="add" v-permission="['/inspection/path/add']">{{ $t('button.add') }}</el-button>
              <el-button  size="mini" class="set-common-btn blank-blue-button" @click.native="openLine" >启用</el-button>
              <el-button size="mini"  class="set-common-btn blank-blue-button"  @click.native="closeLine">禁用</el-button>
        </div>



        <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row
                  :row-key="(row) => row.id"
                  @current-change="handleCurrentChange"
                  @selection-change="handleSelectionChange"
                  @row-click="toggleSelection"
                  ref="lineTable">
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
            <el-table-column label="路线名称" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{scope.row.pathName}}
                </template>
            </el-table-column>
            <el-table-column label="路线状态" show-overflow-tooltip>
                <template slot-scope="scope">
                  <template v-if="scope.row.pathStatus==17">启用</template>
                  <template v-if="scope.row.pathStatus==18">禁用</template>
                </template>
            </el-table-column>
            <el-table-column label="创建人" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{scope.row.auditUser.name}}
                </template>
            </el-table-column>
            <el-table-column label="创建时间" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{scope.row.createTime}}
                </template>
            </el-table-column>
          <el-table-column label="路线信息" width="500px" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.detail}}
            </template>
          </el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button type="text" size="mini" icon="el-icon-edit" @click.native="editItem(scope.row)" v-permission="['/inspection/path/update']">{{ $t('button.edit') }}</el-button>
                    <el-button type="text" size="mini" icon="el-icon-delete" @click.native="removeItem(scope.row)" v-permission="['/inspection/path/delete']">{{ $t('button.delete') }}</el-button>
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
                @next-click="fetchNext">
        </el-pagination>
      </div>
      <!-- 添加路线弹框 -->
        <el-dialog class="el-dialog-style common-dialog-style"
                :title="formTitle"
                :visible.sync="formVisible"
                   width="960px">
                   <div class="block">
            <el-form ref="form" :model="form" :rules="rules" label-width="80px" class="align-right has-Label-Width">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="线路名称："  >
                            <el-input v-model="form.pathName" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="线路状态： "  >
                            <dict-select v-model="form.pathStatus" dict-name="状态"/>
                        </el-form-item>
                    </el-col>
                    </el-row>
                <el-row>
                  <el-col>
                    <el-form-item label="管线信息："  >
                      <!--<el-input type="textarea" v-model="form.detail" minlength=1 :readonly="true"></el-input>-->
                      <el-tabs  type="card" closable @tab-remove="removeTab">
                        <el-tab-pane
                          v-for="(item, index) in selectedList"
                          :key="index"
                          :label="item.pipelineCode"
                          :name="index.toString()"
                        >
                        </el-tab-pane>
                      </el-tabs>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item >
                      <el-button v-if="isAdd" @click="addLine" class="set-common-btn blank-blue-button width92">添加管线</el-button>
                      <el-button v-if="!isAdd" @click="addLine" class="set-common-btn blank-blue-button width92">修改管线</el-button>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-form-item id="myself" class="dialog-button-list">
                    <el-button type="primary" @click="save" class="set-common-btn blue-button">{{ $t('button.submit') }}</el-button>
                    <el-button @click="closeDialog()" class="set-common-btn blank-blue-button">{{ $t('button.cancel') }}</el-button>
                </el-form-item>

            </el-form>
                   </div>
        </el-dialog>
        <!-- 添加路线弹框 -->
      <el-dialog
        :title="formTitle"
        class="el-dialog-style common-dialog-style"
        :visible.sync="pipelineVisible"
        width="960px">

      <pipelineInfo ref="pipeline" @closePipeline="closePipeline" @setLineMessage="setLineMessage"></pipelineInfo>

      </el-dialog>
      <!-- 添加管线弹框 -->
      <el-dialog
        :title="formTitle"
        class="el-dialog-style common-dialog-style line-dialog-style"
        :visible.sync="againVisible"
        width="960px">

        <againInfo ref="pipeline" @closePipeline="closeAgain" @setLineMessage="setLineMessage" :pipeline="pipeline" :selectedList="selectedList"></againInfo>

      </el-dialog>
    </div>
</template>

<script src="./mmInspectionPath.js"></script>

<style scoped lang="scss">
>>> .line-dialog-style {
  .el-dialog__body{
    padding-top: 20px;
   }
}

</style>
