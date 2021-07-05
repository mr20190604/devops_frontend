<template>
  <div class="app-container">
    <div class="block">
      <el-form>
        <el-row class="hasmarginBottom">
          <el-col :span="5">
            <el-form-item label="文件标题：">
              <el-input v-model="listQuery.lawName" placeholder="请输文件标题" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="制定机关：">
              <el-select v-model="listQuery.formulateOffice" placeholder="请选择制定机关">
                <el-option
                  v-for="item in formulateOffice_list"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="法律性质：">
              <el-select v-model="listQuery.lawNature" placeholder="请选择法律性质">
                <el-option
                  v-for="item in lawNature_list"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="时效性：">
              <el-select v-model="listQuery.isValid" placeholder="请选择时效性">
                <el-option
                  v-for="item in timeliness"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="公布日期：">
              <el-date-picker v-model="listQuery.publicationDate" type="daterange" size="mini" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择日期" />
            </el-form-item>
          </el-col>
          <el-col :span="15">
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

    <div class="table-list">
      <div class="btnLists">
        <el-button v-permission="['/law/statute/add']" type="primary" class="set-common-btn blue-button" @click.native="add">{{ $t("button.add") }}</el-button>
        <el-button v-permission="['/law/statute/delete']" size="mini" class="set-common-btn blank-blue-button" @click.native="removeBatch">批量删除</el-button>
      </div>
      <el-table
        ref="statuteTable"
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        border
        :row-key="row=>row.id"
        @selection-change="handleSelectionChange"
        @current-change="handleCurrentChange"
        @row-click="toggleSelection"
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
        <el-table-column label="文件标题" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.lawName }}
          </template>
        </el-table-column>
        <el-table-column label="制定机关" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.formulateOfficeName }}
          </template>
        </el-table-column>
        <el-table-column label="法律性质" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.lawNatureName }}
          </template>
        </el-table-column>
        <el-table-column label="时效性" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.timeName }}
          </template>
        </el-table-column>
        <el-table-column label="公布日期" sortable show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.publicationDate }}
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button v-permission="['/law/statute/update']" type="text" size="mini" icon="el-icon-edit" @click.native="editItem(scope.row)">{{ $t('button.edit') }}</el-button>
            <el-button v-permission="['/law/statute/delete']" type="text" size="mini" icon="el-icon-delete" @click.native="removeItem(scope.row)">{{ $t('button.delete') }}</el-button>
            <el-button v-permission="['/law/statute/view']" type="text" size="mini" icon="el-icon-view" @click.native="previewFile(scope.row)">预览</el-button>
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
        @next-click="fetchNext"
      />
    </div>
    <!-- 添加法律法规库弹框 -->
    <el-dialog
      class="el-dialog-style common-dialog-style"
      :title="formTitle"
      :visible.sync="formVisible"
      onclose="cancleDelete"
      width="960px"
    >
      <div class="block">
        <el-form
          ref="form"
          :model="form"
          :rules="rules"
          label-width="120px"
          class="align-right has-Label-Width"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item label="法律法规名称：">
                <el-input v-model="form.lawName" minlength="1" placeholder="请输入法律法规名称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="制定机关：">
                <el-select v-model="form.formulateOffice" minlength="1">
                  <el-option
                    v-for="item in formulateOffice_list"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="法律性质：">
                <el-select v-model="form.lawNature" minlength="1">

                  <el-option
                    v-for="item in lawNature_list"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />

                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="时效性：">
                <el-select v-model="form.isValid" minlength="1">
                  <el-option
                    v-for="item in timeliness"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="公布日期：">
                <el-date-picker
                  v-model="form.publicationDate"
                  type="date"
                  minlength="1"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="请选择公布日期"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
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
                  <el-button size="small" type="primary" class="set-common-btn blue-button">点击上传</el-button>
                  <div slot="tip">总上传大小50M，单个文件最大10M,<template>允许的文件类型为</template><span style="color: red">{{ fileAccept }}</span></div>
                </el-upload>
              </el-form-item>
            </el-col>

          </el-row>

          <el-form-item id="myself" class="dialog-button-list">
            <el-button type="primary" class="set-common-btn blue-button" @click="save">{{ $t('button.submit') }}</el-button>
            <el-button class="set-common-btn blank-blue-button" @click.native="cancleDelete">{{ $t('button.cancel') }}</el-button>
          </el-form-item>

        </el-form>
      </div>
    </el-dialog>
    <!-- 预览弹框 -->
    <el-dialog
      :title="previewTitle"
      class="el-dialog-style common-dialog-style"
      :visible.sync="previewVisible"
      width="60%"
    >
      <file-preview :files="files" :download-file-url="downloadUrl" />
      <!--<el-row style="width: 100%;height: 600px;margin-top: 10px;">-->
      <!--<el-col style="width: 25%;height: 620px">-->
      <!--<div class="grid-content bg-purple" >-->
      <!--<el-table :data="files" v-loading="fileLoading" element-loading-text="Loading">-->
      <!--<el-table-column label="附件名称">-->
      <!--<template slot-scope="scope">-->
      <!--<div @click="viewFile(scope.row)">-->
      <!--{{scope.row.fileInfo.originalFileName}}-->
      <!--</div>-->
      <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column label="操作">-->
      <!--<template slot-scope="scope">-->
      <!--<el-button type="text" size="mini" icon="el-icon-download"  @click.native="downloads(scope.row)" >下载</el-button>-->
      <!--</template>-->
      <!--</el-table-column>-->
      <!--</el-table>-->
      <!--</div>-->
      <!--</el-col>-->
      <!--<el-col style="width: 75%;height: 600px;">-->
      <!--<div class="grid-content bg-purple" >-->
      <!--<template ><preview v-if="fileShow" :previewStyle="previewStyle" :previewFileUrl="previewFileUrl"></preview></template>-->
      <!--</div>-->

      <!--</el-col>-->
      <!--</el-row>-->
    </el-dialog>
  </div>
</template>

<script src="./dsaLawStatute.js"></script>

