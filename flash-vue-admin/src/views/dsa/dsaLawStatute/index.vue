<template>
    <div class="app-container">
        <div class="block">
          <el-form label-width="120px" :inline="true" >
            <el-form-item label="文件标题：">
              <el-input v-model="listQuery.lawName"  placeholder="请输文件标题"></el-input>
            </el-form-item>
            <el-form-item label="制定机关：">
              <el-select v-model="listQuery.formulateOffice"  placeholder="请选择制定机关">
                <el-option
                  v-for="item in formulateOffice_list"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="法律性质：">
              <el-select v-model="listQuery.lawNature"  placeholder="请选择法律性质">
                <el-option
                  v-for="item in lawNature_list"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="时效性：">
              <el-select v-model="listQuery.isValid"  placeholder="请选择时效性">
                <el-option
                  v-for="item in timeliness"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>

          <br>
            <el-form-item label="公布日期：">
              <el-date-picker type="date" v-model="listQuery.publicationDate" format="yyyy-MM-dd" value-format="yyyy-MM-dd HH:mm:ss"  placeholder="请选择日期"></el-date-picker>
            </el-form-item>
            <el-form-item style="float: right;margin-right: 100px">
              <el-button type="primary"   icon="el-icon-search" @click.native="search">{{ $t('button.search') }}
              </el-button>
              <el-button   icon="el-icon-refresh" @click.native="reset">{{ $t('button.reset') }}
              </el-button>
            </el-form-item>


          </el-form>
            <br>
            <el-row>
                <el-col :span="24">
                    <el-button type="success" size="mini"  icon="el-icon-plus" @click.native="add" v-permission="['/law/statute/add']">{{ $t('button.add') }}</el-button>
                    <el-button type="danger" size="mini"  icon="el-icon-delete" @click.native="removeBatch" v-permission="['/law/statute/delete']">批量删除</el-button>
                </el-col>
            </el-row>
        </div>


        <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" border
                  @selection-change="handleSelectionChange"
                  :row-key="row=>row.id"
                  @current-change="handleCurrentChange"
                  @row-click="toggleSelection"
                  ref="statuteTable"
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
            <el-table-column label="文件标题">
                <template slot-scope="scope">
                    {{scope.row.lawName}}
                </template>
            </el-table-column>
            <el-table-column label="制定机关">
                <template slot-scope="scope">
                    {{scope.row.formulateOfficeName}}
                </template>
            </el-table-column>
            <el-table-column label="法律性质" width="80px" align="center">
                <template slot-scope="scope">
                    {{scope.row.lawNatureName}}
                </template>
            </el-table-column>
            <el-table-column label="时效性" align="center" width="80px">
                <template slot-scope="scope">
                    {{scope.row.timeName}}
                </template>
            </el-table-column>
            <el-table-column label="公布日期" width="120px" align="center">
                <template slot-scope="scope">
                    {{scope.row.publicationDate}}
                </template>
            </el-table-column>

            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button type="text" size="mini" icon="el-icon-edit" @click.native="editItem(scope.row)" v-permission="['/law/statute/update']">{{ $t('button.edit') }}</el-button>
                    <el-button type="text" size="mini" icon="el-icon-delete" @click.native="removeItem(scope.row)" v-permission="['/law/statute/delete']">{{ $t('button.delete') }}</el-button>
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
                onclose="cancleDelete"
                width="60%">
            <el-form ref="form" :model="form" :rules="rules" label-width="120px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="法律法规名称："  >
                            <el-input v-model="form.lawName" minlength=1 placeholder="请输入法律法规名称"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="制定机关："  >
                            <el-select v-model="form.formulateOffice" minlength=1>
                              <el-option
                                v-for="item in formulateOffice_list"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                              </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="法律性质："  >
                            <el-select v-model="form.lawNature" minlength=1 >

                              <el-option
                                v-for="item in lawNature_list"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                              </el-option>

                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="时效性："  >
                            <el-select v-model="form.isValid" minlength=1>
                              <el-option
                                v-for="item in timeliness"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                              </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="公布日期："  >
                            <el-date-picker type="date" v-model="form.publicationDate" minlength=1
                            format="yyyy-MM-dd" value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择公布日期"
                            ></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
              <el-row>
                <el-col :span="16">
                  <el-form-item label="选择文件：">
                    <el-upload
                      :action="uploadUrl"
                      :headers="uploadHeaders"
                      :on-change="handleChangeUpload"
                      :on-success="uploadSuccess"
                      :on-remove="removeFile"
                      :file-list="fileList"
                      :multiple="multiple"
                      :accept="fileAccept"
                    >
                      <!--accept=".doc,.docx,.pdf,.zip,.rar"-->
                      <el-button size="small" type="primary">点击上传</el-button>
                      <div slot="tip" >总上传大小50M，单个文件最大10M,<template>允许的文件类型为</template><span style="color: red">{{fileAccept}}</span></div>
                    </el-upload>
                  </el-form-item>
                </el-col>

              </el-row>

                <el-form-item id="myself">
                    <el-button  type="primary" @click="save">{{ $t('button.submit') }}</el-button>
                    <el-button  @click.native="cancleDelete">{{ $t('button.cancel') }}</el-button>
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
            <el-col style="width: 75%;height: 600px;padding-top: 20px">
              <div class="grid-content bg-purple" >
                <template v-if="fileShow == true"><preview :previewStyle="previewStyle" :previewFileUrl="previewFileUrl"></preview></template>


              </div>

            </el-col>
          </el-row>
        </el-dialog>
    </div>
</template>

<script src="./dsaLawStatute.js"></script>


<style rel="stylesheet/scss" lang="scss"  >
    @import "src/styles/commonmyself.scss";
</style>

