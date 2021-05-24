<template>
    <div class="app-container">
        <div class="block">
          <el-form label-width="120px" :inline="true" >
            <el-form-item label="文件标题">
              <el-input v-model="listQuery.lawName"  placeholder="请输文件标题"></el-input>
            </el-form-item>
            <el-form-item label="制定机关">
              <el-select v-model="listQuery.formulateOffice"  placeholder="请选择制定机关">
                <el-option
                  v-for="item in formulateOffice_list"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="法律性质">
              <el-select v-model="listQuery.lawNature"  placeholder="请选择法律性质">
                <el-option
                  v-for="item in lawNature_list"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="时效性">
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
            <el-form-item label="公布日期">
              <el-date-picker type="date" v-model="listQuery.publicationDate" format="yyyy-MM-dd" value-format="yyyy-MM-dd HH:mm:ss"  placeholder="请选择日期"></el-date-picker>
            </el-form-item>
            <!--<el-form-item label="适用类型">-->
              <!--<el-input v-model="listQuery.adaptType"  placeholder="请选择适用类型"></el-input>-->
            <!--</el-form-item>-->
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


        <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row
                  @selection-change="handleSelectionChange"
                  :row-key="row=>row.id"
                  @current-change="handleCurrentChange">
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
            <el-table-column label="法律性质">
                <template slot-scope="scope">
                    {{scope.row.lawNatureName}}
                </template>
            </el-table-column>
            <el-table-column label="时效性">
                <template slot-scope="scope">
                    {{scope.row.timeName}}
                </template>
            </el-table-column>
            <el-table-column label="公布日期">
                <template slot-scope="scope">
                    {{scope.row.publicationDate}}
                </template>
            </el-table-column>
           <!-- <el-table-column label="备注">
                <template slot-scope="scope">
                    {{scope.row.remark}}
                </template>
            </el-table-column>
            <el-table-column label="逻辑删除">
                <template slot-scope="scope">
                    {{scope.row.isDel}}
                </template>
            </el-table-column>-->
            <el-table-column label="操作">
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
                width="60%">
            <el-form ref="form" :model="form" :rules="rules" label-width="120px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="法律法规名称"  >
                            <el-input v-model="form.lawName" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="制定机关"  >
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
                        <el-form-item label="法律性质"  >
                            <el-select v-model="form.lawNature" minlength=1>

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
                        <el-form-item label="时效性"  >
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
                        <el-form-item label="公布日期"  >
                            <el-date-picker type="date" v-model="form.publicationDate" minlength=1
                            format="yyyy-MM-dd" value-format="yyyy-MM-dd HH:mm:ss"
                            ></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="选择文件">
                    <el-upload
                      :action="uploadUrl"
                      :headers="uploadHeaders"
                      :on-change="handleChangeUpload"
                      :on-success="uploadSuccess"
                      :on-remove="removeFile"
                      :file-list="fileList"
                      :multiple="multiple"
                      accept=".doc,.docx,.pdf,.zip,.rar"
                    >
                      <!--accept=".doc,.docx,.pdf,.zip,.rar"-->
                      <el-button size="small" type="primary">点击上传</el-button>
                      <div slot="tip" >最大上传大小10Mb</div>
                    </el-upload>
                  </el-form-item>
                </el-col>

              </el-row>

                <el-form-item id="myself">
                    <el-button  type="primary" @click="save">{{ $t('button.submit') }}</el-button>
                    <el-button  @click.native="formVisible = false">{{ $t('button.cancel') }}</el-button>
                </el-form-item>

            </el-form>
        </el-dialog>


        <el-dialog
          :title="previewTitle"
          :visible.sync="previewVisible"
          width="50%" style="margin-top: 0px">
          <preview :previewStyle="previewStyle" :previewFileUrl="previewFileUrl" :fileType="fileType"></preview>
        </el-dialog>
    </div>
</template>

<script src="./dsaLawStatute.js"></script>


<style rel="stylesheet/scss" lang="scss"  >
    @import "src/styles/commonmyself.scss";
</style>

