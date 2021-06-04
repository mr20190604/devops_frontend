<template>
  <div class="app-container">
    <div class="block">
      <el-form label-width="76px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="关键字：">
              <el-input v-model="listQuery.key" placeholder="编号、名称、地点、描述" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="事件类型：">
              <dict-select v-model="listQuery.eventType" dict-name="事件类型" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item>
              <el-button type="primary" class="set-common-btn blue-button" @click.native="search">{{ $t('button.search') }}</el-button>
              <el-button class="set-common-btn blank-blue-button" @click.native="reset">{{ $t('button.reset') }}</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

    </div>
    <div class="table-list">
      <div class="btnLists">
        <el-button
          v-permission="['/manager/event/delete']"
          class="set-common-btn blank-blue-button"
          type="danger"
          size="mini"
          @click.native="removeBatch"
        >批量删除</el-button>
      </div>
      <el-table
        ref="eventTable"
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        border
        :row-key="row=>row.id"
        @current-change="handleCurrentChange"
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
          width="55"
          label="序号"
        />
        <!--<el-table-column label="事件编码">
        <template slot-scope="scope">
          {{ scope.row.eventCode }}
        </template>
      </el-table-column>-->
        <el-table-column label="事件名称" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.eventName }}
          </template>
        </el-table-column>
        <el-table-column label="事件类型" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.eventTypeName }}
          </template>
        </el-table-column>
        <el-table-column label="事件地点" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.eventAddress }}
          </template>
        </el-table-column>
        <el-table-column label="事件描述" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.eventDesc }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button v-permission="['/manager/event/update']" type="text" size="mini" icon="el-icon-edit" @click.native="editItem(scope.row)">{{ $t('button.edit') }}</el-button>
            <el-button v-permission="['/manager/event/delete']" type="text" size="mini" icon="el-icon-delete" @click.native="removeItem(scope.row)">{{ $t('button.delete') }}</el-button>
            <!--            <el-button icon="el-icon-view" size="mini" type="text" @click.native="handlePreview(scope.row)">预览</el-button>-->
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
    <el-dialog
      :title="formTitle"
      :visible.sync="formVisible"
      :close="clearForm"
      width="60%"
    >
      <el-form ref="form" :model="mmManagerEvent" :rules="rules" label-width="120px">
        <el-row>
          <el-col :offset="3" :span="10">
            <el-form-item label="事件类型：" class="formLable">
              <dict-select v-model="mmManagerEvent.eventType" dict-name="事件类型" />
            </el-form-item>
          </el-col>
          <el-col :pull="2" :span="10">
            <el-form-item label="事件名称：" class="formLable">
              <el-input v-model="mmManagerEvent.eventName" minlength="1" placeholder="请输入事件名称" />
            </el-form-item>
          </el-col>
          <el-col :offset="3" :span="10">
            <el-form-item label="事件地点：" class="formLable">
              <el-input v-model="mmManagerEvent.eventAddress" minlength="1" placeholder="请输入事件地点" />
            </el-form-item>
          </el-col>
          <el-col :offset="3" :span="16">
            <el-form-item label="事件描述：" class="formLable">
              <el-input v-model="mmManagerEvent.eventDesc" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" minlength="1" placeholder="请输入事件描述" />
            </el-form-item>
          </el-col>
          <el-col :offset="4" :span="16">
            <el-upload
              :action="uploadUrl"
              :headers="uploadHeaders"
              :on-change="handleChangeUpload"
              :on-success="uploadSuccess"
              :on-remove="removeFile"
              :file-list="fileList"
              :multiple="multiple"
              :limit="fileLimit"
              accept=".doc,.docx,.pdf,.zip,.rar"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip">最多上传个数{{ fileLimit }};单个文件上限10MB;</div>
            </el-upload>
          </el-col>
          <el-col :span="24" style="text-align: center;">
            <el-button type="primary" @click="save">{{ $t('button.submit') }}</el-button>
            <el-button @click.native="closeDialog">{{ $t('button.cancel') }}</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
    <el-dialog
      title="预览附件"
      :visible.sync="previewVisible"
      width="60%"
      style="margin-top: 0px;"
    >
      <file-preview :files="files" :download-file-url="downloadUrl" />
    </el-dialog>
  </div>
</template>

<script src="./mmManagerEvent.js"></script>

<style rel="stylesheet/scss" lang="scss" >
    @import "src/styles/commonmyself.scss";
</style>

