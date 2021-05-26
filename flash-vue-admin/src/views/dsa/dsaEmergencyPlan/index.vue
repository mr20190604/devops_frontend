<template>
    <div class="app-container">
        <div class="block">
          <el-form label-width="120px" :inline="true">
            <el-row>
              <el-form-item label="预案名称">
                <el-input v-model="listQuery.planName" placeholder="请输预案名称"></el-input>
              </el-form-item>
              <el-form-item label="所属行业">
                <el-select v-model="listQuery.industryId" placeholder="请选择所属行业">
                  <el-option
                    v-for="item in industry_type"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="来源单位">
                <el-input v-model="listQuery.planUnit" placeholder="请输来源单位"></el-input>
              </el-form-item>
            </el-row>

            <el-row>
              <el-form-item label="预案类型">
                <el-select v-model="listQuery.planTypeId" placeholder="请选择预案类型">
                  <el-option
                    v-for="item in plan_type"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item style="float: right;margin-right: 100px">
                <el-button type="primary"   icon="el-icon-search" @click.native="search">{{ $t('button.search') }}
                </el-button>
                <el-button    icon="el-icon-refresh" @click.native="reset">{{ $t('button.reset') }}
                </el-button>
              </el-form-item>
            </el-row>



          </el-form>

            <br>
            <el-row>
                <el-col :span="24">
                    <el-button type="success" size="mini"  icon="el-icon-plus" @click.native="add" v-permission="['/emergency/plan/add']">{{ $t('button.add') }}</el-button>
                    <!--<el-button type="primary" size="mini"  icon="el-icon-edit" @click.native="edit" v-permission="['/emergency/plan/update']">{{ $t('button.edit') }}</el-button>-->
                    <el-button type="danger" size="mini"  icon="el-icon-delete" @click.native="removeBatch" v-permission="['/emergency/plan/delete']">批量删除</el-button>
                </el-col>
            </el-row>
        </div>


        <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row
                  @current-change="handleCurrentChange"
                  :row-key="row=>row.id"
                  @selection-change="handleSelectionChange">
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
          <el-table-column label="预案名称">
                <template slot-scope="scope">
                    {{scope.row.planName}}
                </template>
            </el-table-column>
            <el-table-column label="预案类型">
                <template slot-scope="scope">
                    {{scope.row.planTypeName}}
                </template>
            </el-table-column>
            <el-table-column label="所属行业">
                <template slot-scope="scope">
                    {{scope.row.industryName}}
                </template>
            </el-table-column>
            <el-table-column label="来源单位">
                <template slot-scope="scope">
                    {{scope.row.planUnit}}
                </template>
            </el-table-column>
            <el-table-column label="预案版本">
                <template slot-scope="scope">
                    {{scope.row.planVersion}}
                </template>
            </el-table-column>
            <el-table-column label="编制时间">
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
            <el-table-column label="登记人" width="100">
                <template slot-scope="scope">
                    {{scope.row.register}}
                </template>
            </el-table-column>

            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="mini" icon="el-icon-edit" @click.native="editItem(scope.row)" v-permission="['/emergency/plan/update']">{{ $t('button.edit') }}</el-button>
                    <el-button type="text" size="mini" icon="el-icon-delete" @click.native="removeItem(scope.row)" v-permission="['/emergency/plan/delete']">{{ $t('button.delete') }}</el-button>
                  <el-button type="text" size="mini" icon="el-icon-view"  @click.native="previewFile(scope.row)" v-permission="['/law/statute/view']">预览</el-button>
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

        <el-dialog
                :title="formTitle"
                :visible.sync="formVisible"
                width="60%">
            <el-form ref="form" :model="form" :rules="rules" label-width="120px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="预案名称"  >
                            <el-input v-model="form.planName" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="预案类型"  >
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
                        <el-form-item label="所属行业"  >
                            <el-select v-model="form.industryId" minlength=1>
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
                        <el-form-item label="来源单位"  >
                            <el-input v-model="form.planUnit" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="预案版本"  >
                            <el-input v-model="form.planVersion" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="编制时间"  >
                            <el-date-picker v-model="form.editorDate"  class="date_picker"
                                            value-format="yyyy-MM-dd"  minlength=1></el-date-picker>
                        </el-form-item>
                    </el-col>

                  <el-col :span="12">
                    <el-form-item label="登记人"  >
                      <el-input v-model="form.register" minlength=1></el-input>
                    </el-form-item>
                  </el-col>


                </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="选择文件"  >
                    <el-upload
                      :action="uploadUrl"
                      :headers="uploadHeaders"
                      :on-change="handleChangeUpload"
                      :on-success="uploadSuccess"
                      accept=".doc,.docx,.pdf,.zip,.rar"
                      :on-remove="removeFile"
                      :file-list="fileList"
                      :multiple="multiple"
                    >
                      <el-button size="small" type="primary">点击上传</el-button>
                      <div slot="tip" >最大上传大小10Mb</div>
                    </el-upload>
                  </el-form-item>
                </el-col>
              </el-row>
                <el-form-item id="myself">
                    <el-button type="primary" @click="save">{{ $t('button.submit') }}</el-button>
                    <el-button @click.native="formVisible = false">{{ $t('button.cancel') }}</el-button>
                </el-form-item>

            </el-form>
        </el-dialog>
      <el-dialog
        :title="previewTitle"
        :visible.sync="previewVisible"
        width="60%"style="margin-top: 0px;">

        <el-row style="width: 100%;height: 600px">
          <el-col style="width: 25%;height: 620px">
            <div class="grid-content bg-purple" >
              <el-table :data="files" v-loading="fileLoading" element-loading-text="Loading">
                <el-table-column label="附件名称">
                  <template slot-scope="scope">
                    <div @click="viewFile(scope.row)">
                      {{scope.row.fileInfo.originalFileName}}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button type="text" size="mini" icon="el-icon-download"  @click.native="downloads(scope.row)" >下载</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-col>
          <el-col style="width: 75%;height: 620px">
            <div class="grid-content bg-purple" style="padding-top: 20px">
              <preview :previewStyle="previewStyle" :previewFileUrl="previewFileUrl"></preview>
            </div>

          </el-col>
        </el-row>


      </el-dialog>
    </div>
</template>

<script src="./dsaEmergencyPlan.js"></script>


<style rel="stylesheet/scss" lang="scss"  >
    @import "src/styles/commonmyself.scss";
</style>

