<template>
  <div class="app-container">
    <div class="block">
      <el-form>
        <el-row>
          <el-col :span="6">
            <el-form-item label="标题：">
                <el-input v-model="listQuery.title" size="mini" placeholder="标题"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="18">
            <el-form-item>
               <el-button type="primary"  class="set-common-btn blue-button" @click.native="search">{{ $t('button.search') }}</el-button>
               <el-button  class="set-common-btn blank-blue-button" @click.native="reset">{{ $t('button.reset') }}</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      
    </div>

<div class="table-list">
      <div class="btnLists">
        <el-button type="success" size="mini" class="set-common-btn blue-button" @click.native="add" v-permission="['/banner/edit']">{{ $t('button.add') }}</el-button>
          <el-button type="danger" size="mini" class="set-common-btn blank-blue-button" @click.native="remove" v-permission="['/banner/remove']">{{ $t('button.delete') }}</el-button>
      </div>
    <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row
              @current-change="handleCurrentChange">

      <el-table-column label="ID" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.id}}
        </template>
      </el-table-column>
      <el-table-column label="标题" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.title}}
        </template>
      </el-table-column>
      <el-table-column label="类别" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.type}}
        </template>
      </el-table-column>
      <el-table-column label="url" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.url}}
        </template>
      </el-table-column>
      <el-table-column label="图片">
        <template slot-scope="scope">
          <img :src="scope.row.img" style="width:200px;">
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="mini" icon="el-icon-delete" @click.native="removeItem(scope.row)" v-permission="['/banner/remove']">{{ $t('button.delete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
</div>
<!-- 添加banner弹框 -->
    <el-dialog
    class="common-dialog-style"
      :title="formTitle"
      :visible.sync="formVisible"
      width="1100px">
      <div class="block">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="标题：" prop="title">
              <el-input v-model="form.title" minlength=1></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="url：" prop="url">
              <el-input v-model="form.url"  minlength=1></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="类型：">
              <el-select v-model="form.type" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>


          <el-col :span="12">
            <el-form-item label="banner图片：">
              <el-upload
                class="upload-demo"
                drag
                multiple=false
                :action="uploadUrl"
                :headers="uploadHeaders"
                :before-upload="handleBeforeUpload"
                :on-success="handleUploadSuccess"
              >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">上传图片</div>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item class="align-center">
          <el-button type="primary" class="set-common-btn blue-button" @click="save">{{ $t('button.submit') }}</el-button>
          <el-button @click.native="formVisible = false" class="set-common-btn blank-blue-button">{{ $t('button.cancel') }}</el-button>
        </el-form-item>

      </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script src="./banner.js"></script>

