<template>
    <div class="app-container">
        <div class="block">
          <el-form>
            <el-row>
              <el-col :span="5">
                <el-form-item label="预案名称：">
                  <el-input v-model="listQuery.planName" placeholder="请输预案名称"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="所属行业：">
                  <el-select v-model="listQuery.industryId" placeholder="请选择所属行业">
                    <el-option
                      v-for="item in industry_type"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="来源单位：">
                  <el-input v-model="listQuery.planUnit" placeholder="请输来源单位"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="预案类型：">
                  <el-select v-model="listQuery.planTypeId" placeholder="请选择预案类型">
                    <el-option
                      v-for="item in plan_type"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item>
                  <el-button type="primary" class="set-common-btn blue-button" @click.native="search">{{ $t('button.search') }}
                  </el-button>
                  <el-button class="set-common-btn blank-blue-button" @click.native="reset">{{ $t('button.reset') }}
                  </el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
<div class="table-list outer-table-list">
      <div class="btnLists">
          <el-button type="primary" class="set-common-btn blue-button" @click.native="add" v-permission="['/emergency/plan/add']">{{ $t("button.add") }}</el-button >
          <!--<el-button type="primary" size="mini"   class="set-common-btn blank-blue-button" @click.native="edit" v-permission="['/emergency/plan/update']">{{ $t('button.edit') }}</el-button>-->
          <el-button size="mini" class="set-common-btn blank-blue-button" @click.native="removeBatch" v-permission="['/emergency/plan/delete']">批量删除</el-button>
      </div>
        <el-table ref="planTable" :data="list" v-loading="listLoading" element-loading-text="Loading" border
                  @current-change="handleCurrentChange"
                  :row-key="row=>row.id"
                  @selection-change="handleSelectionChange"
                  @row-click="toggleSelection"
        >
          <el-table-column
            type="selection"
            width="55"
            :reserve-selection="true"
          />
          <el-table-column
            type="index"
            width="50"
            label="序号"
          />
          <el-table-column label="预案名称" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{scope.row.planName}}
                </template>
            </el-table-column>
            <el-table-column label="预案类型" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{scope.row.planTypeName}}
                </template>
            </el-table-column>
            <el-table-column label="所属行业" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{scope.row.industryName}}
                </template>
            </el-table-column>
            <el-table-column label="来源单位" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{scope.row.planUnit}}
                </template>
            </el-table-column>
            <el-table-column label="预案版本" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{scope.row.planVersion}}
                </template>
            </el-table-column>
            <el-table-column label="编制时间" sortable show-overflow-tooltip>
                <template slot-scope="scope">
                    {{scope.row.editorDate}}
                </template>
            </el-table-column>
            <!--<el-table-column label="附件">-->
                <!--<template slot-scope="scope">-->
                  <!--<div style="color: #409EFF" v-if="scope.row.fileInfo != null " @click="downloadFileINfo(scope.row.fileInfo)" id="file1">{{scope.row.fileInfo.originalFileName}}</div>-->
                  <!--<div style="color: #409EFF" v-else="scope.row.fileInfo != null " @click="downloadFileINfo(scope.row.fileInfo)" id="file2"></div>-->

                <!--</template>-->
            <!--</el-table-column>-->
            <el-table-column label="登记人" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{scope.row.register}}
                </template>
            </el-table-column>

            <el-table-column label="操作" align="center" width="228px">
                <template slot-scope="scope">
                    <el-button type="text" size="mini" icon="el-icon-edit" @click.native="editItem(scope.row)" v-permission="['/emergency/plan/update']">{{ $t('button.edit') }}</el-button>
                    <el-button type="text" size="mini" icon="el-icon-delete" @click.native="removeItem(scope.row)" v-permission="['/emergency/plan/delete']">{{ $t('button.delete') }}</el-button>
                  <el-button type="text" size="mini" icon="el-icon-view"  @click.native="previewFile(scope.row)" v-permission="['/law/statute/view']">预览</el-button>
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
                @size-change="changeSize"
                @current-change="fetchPage"
                @prev-click="fetchPrev"
                @next-click="fetchNext">
        </el-pagination>
</div>
<!-- 应急预案新增弹框 -->
        <el-dialog
            class="el-dialog-style common-dialog-style"
                :title="formTitle"
                :visible.sync="formVisible"
                onclose="cancleDelete"
                width="960px">
                 <div class="block">
            <el-form ref="form" :model="form" :rules="rules" label-width="120px" class="align-right has-Label-Width">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="预案名称："  >
                            <el-input v-model="form.planName" minlength=1 placeholder="请输入预案名称"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="预案类型："  >
                            <el-select v-model="form.planTypeId" minlength=1>
                              <el-option
                                v-for="item in plan_type"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                              </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="所属行业："  >
                            <el-select v-model="form.industryId" minlength=1 >
                              <el-option
                                v-for="item in industry_type"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                              </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="来源单位："  >
                            <el-input v-model="form.planUnit" minlength=1  placeholder="请输入来源单位"></el-input >
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="预案版本："  >
                            <el-input v-model="form.planVersion" minlength=1 placeholder="请输入预案版本"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="编制时间："  >
                            <el-date-picker v-model="form.editorDate"  class="date_picker"
                                            value-format="yyyy-MM-dd"  minlength=1 placeholder="请选择编制时间"></el-date-picker>
                        </el-form-item>
                    </el-col>

                  <el-col :span="12">
                    <el-form-item label="登记人："  >
                      <el-input v-model="form.register" minlength=1 placeholder="请输入登记人"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              <el-row>
                <el-col>
                  <el-form-item label="选择文件："  >
                    <el-upload
                      :action="uploadUrl"
                      :headers="uploadHeaders"
                      :on-change="handleChangeUpload"
                      :on-success="uploadSuccess"
                      :accept="fileAccept"
                      :on-remove="removeFile"
                      :file-list="fileList"
                      :multiple="multiple"
                    >
                      <el-button size="small" type="primary"  class="set-common-btn blue-button">点击上传</el-button>
                      <div slot="tip" >总上传大小50M，单个文件最大10M,<template>允许的文件类型为</template><span style="color: red">{{fileAccept}}</span></div>
                    </el-upload>
                  </el-form-item>
                </el-col>
              </el-row>
                <el-form-item id="myself" class="dialog-button-list">
                    <el-button type="primary" @click="save" class="set-common-btn blue-button">{{ $t('button.submit') }}</el-button>
                    <el-button @click.native="cancleDelete" class="set-common-btn blank-blue-button">{{ $t('button.cancel') }}</el-button>
                </el-form-item>

            </el-form>
                 </div>
        </el-dialog>
      <el-dialog
      
  class="el-dialog-style common-dialog-style"
        :title="previewTitle"
        :visible.sync="previewVisible"
        width="60%" style="margin-top: 0px;" >
        <file-preview :files="files" :download-file-url="downloadUrl"></file-preview>
      </el-dialog>
    </div>
</template>

<script src="./dsaEmergencyPlan.js"></script>


