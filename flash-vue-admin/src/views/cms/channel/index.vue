<template>
  <div class="app-container">
   
    <div class="table-list">
      <div class="btnLists">
         <el-button type="success" class="set-common-btn blue-button" size="mini"  @click.native="add" v-permission="['/channel/edit']">{{ $t('button.add') }}</el-button>
          <el-button type="primary" class="set-common-btn blank-blue-button" size="mini" @click.native="edit" v-permission="['/channel/edit']">{{ $t('button.edit') }}</el-button>
          <el-button type="danger"  class="set-common-btn blue-button" size="mini" @click.native="remove" v-permission="['/channel/remove']">{{ $t('button.delete') }}</el-button>
      </div>
    <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row
              @current-change="handleCurrentChange">

      <el-table-column label="ID" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.id}}
        </template>
      </el-table-column>
      <el-table-column label="名称" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.name}}
        </template>
      </el-table-column>
      <el-table-column label="编码" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.code}}
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="mini" icon="el-icon-edit" @click.native="editItem(scope.row)" v-permission="['/channel/edit']">{{ $t('button.edit') }}</el-button>
          <el-button type="text" size="mini" icon="el-icon-delete" @click.native="removeItem(scope.row)" v-permission="['/channel/remove']">{{ $t('button.delete') }}</el-button>
        </template>
      </el-table-column>


    </el-table>
  </div>
  <!-- 添加栏目弹框 -->
    <el-dialog
       class="common-dialog-style"
      :title="formTitle"
      :visible.sync="formVisible"
      width="960px">
      <div class="block">
        <el-form ref="form" :model="form" :rules="rules">
          <el-row>
            <el-col :span="12">
              <el-form-item label="名称：" prop="name">
                <el-input v-model="form.name" minlength=1></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="编码：" prop="code">
                <el-input v-model="form.code"  minlength=1></el-input>
              </el-form-item>
            </el-col>
            
          </el-row>
          <el-row>
            <el-col>
              <el-form-item class="dialog-button-list">
                <el-button type="primary" @click="save" class="set-common-btn blue-button">{{ $t('button.submit') }}</el-button>
                <el-button @click.native="formVisible = false" class="set-common-btn blank-blue-button">{{ $t('button.cancel') }}</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        </div>
    </el-dialog>

  </div>

</template>

<script src="./channel.js"></script>


