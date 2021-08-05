<template>
  <div class="app-container">
    <div class="table-list">
      <div class="btnLists">
        <el-button v-permission="['/dict/add']" type="primary" class="set-common-btn blue-button" @click.native="add">
          {{$t('button.add') }}
        </el-button>
      </div>
      <el-table
        :data="data"
        row-key="id"
        border
        :default-expand-all="false"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        :height="442">
        <el-table-column label="名称" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button type="text" @click="checkDict(scope.row)">{{ scope.row.name }}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="编码" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.num }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button v-permission="['/dict/update']" type="text" size="mini" icon="el-icon-edit"
                       @click.native="editItem(scope.row)">{{ $t('button.edit') }}
            </el-button>
            <el-button v-permission="['/dict/delete']" type="text" size="mini" icon="el-icon-delete"
                       @click.native="removeItem(scope.row.id)">{{ $t('button.delete') }}
            </el-button>
          </template>

        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      class="el-dialog-style common-dialog-style"
      :title="formTitle"
      :visible.sync="formVisible"
      width="960px"
    >
      <div class="block">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px" class="align-right has-Label-Width">
          <el-row>
            <el-col :span="12">
              <el-form-item label="名称：" prop="name">
                <el-input v-model="form.name" minlength="1" :disabled="readonly"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="编码：" prop="num">
                <el-input v-model="form.num" minlength="1" :disabled="readonly"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="备注：">
                <el-input v-model="form.tips" :disabled="readonly"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="父菜单：">
                <treeselect v-model="form.pid" :options="treeData" placeholder="请选择父菜单/顶级菜单目录无需选择"
                            :disabled="readonly"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="id：" v-if="idShow">
                <el-input v-model="form.id" :disabled="readonly"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item class="dialog-button-list" v-if="btnShow">
            <el-button type="primary" @click="save" class="set-common-btn blue-button">{{ $t('button.submit') }}</el-button>
            <el-button @click.native="formVisible = false"
                       class="set-common-btn blank-blue-button">{{ $t('button.cancel') }}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script src="./dict.js"></script>
<style scoped>
  .el-radio-group {
    width: 200px;
  }
</style>

