<template>
  <div class="app-container">
    <div class="block">
      <el-form>
            <el-row>
              <el-col :span="6">
                <el-form-item label="角色名称：">
                  <el-input v-model="listQuery.name" size="mini" placeholder="请输入角色名称"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="角色编号：">
                   <el-input v-model="listQuery.tips" size="mini" placeholder="请输入角色编号"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-button type="success" class="set-common-btn blue-button" @click.native="search">{{ $t('button.search') }}</el-button>
                <el-button type="primary" class="set-common-btn blank-blue-button" @click.native="reset">{{ $t('button.reset') }}</el-button>
              </el-col>
            </el-row>
      </el-form>
    </div>

<div class="table-list">
      <div class="btnLists">
          <el-button type="success" class="set-common-btn blue-button" @click.native="add" v-permission="['/role/add']">{{ $t('button.add') }}</el-button>
          <el-button type="primary" class="set-common-btn blank-blue-button" @click.native="edit" v-permission="['/role/edit']">{{ $t('button.edit') }}</el-button>
          <el-button type="danger" class="set-common-btn blue-button" @click.native="remove" v-permission="['/role/remove']">{{ $t('button.delete') }}</el-button>
          <el-button type="primary" class="set-common-btn blank-blue-button" @click.native="openPermissions" v-permission="['/role/setAuthority']">权限配置</el-button>
      </div>
    <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row
              @current-change="handleCurrentChange">

      <el-table-column label="名称" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.name}}
        </template>
      </el-table-column>
      <el-table-column label="编码" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.tips}}
        </template>
      </el-table-column>
      <el-table-column label="所在部门" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.deptName}}
        </template>
      </el-table-column>
      <el-table-column label="上级角色" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.pName}}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="248">
        <template slot-scope="scope">
          <el-button type="text" size="mini" icon="el-icon-edit" @click.native="editItem(scope.row)" v-permission="['/role/edit']">{{ $t('button.edit') }}</el-button>
          <el-button type="text" size="mini" icon="el-icon-delete" @click.native="removeItem(scope.row)" v-permission="['/role/remove']">{{ $t('button.delete') }}</el-button>
          <el-button type="text" size="mini" icon="el-icon-setting" @click.native="openPermissionsItem(scope.row)" v-permission="['/role/setAuthority']">权限配置</el-button>
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
      :current-page.sync="listQuery.page"
      @size-change="changeSize"
      @current-change="fetchPage"
      @prev-click="fetchPrev"
      @next-click="fetchNext">
    </el-pagination>
</div>
<!-- 添加角色弹框 -->
    <el-dialog
      :title="formTitle"
      class="el-dialog-style common-dialog-style"
      :visible.sync="formVisible"
      width="960px">
      <div class="block">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" class="align-right has-Label-Width">
        <el-row>
          <el-col :span="12">
            <el-form-item label="编码：" prop="tips">
              <el-input v-model="form.tips" minlength=1></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="名称：" prop="name">
              <el-input v-model="form.name" minlength=1></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="上级角色：">
              <treeselect v-model="form.pid"  :options="roleTree.data"  placeholder="请选择上级角色"/>

            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序：">
              <el-input v-model="form.num" type="number"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="所在部门：">
              <treeselect v-model="form.deptid"  :options="deptTree.data"  placeholder="请选择所属部门"/>
            </el-form-item>
          </el-col>


        </el-row>
        <el-form-item class="dialog-button-list">
          <el-button type="primary" @click="save" class="set-common-btn blue-button">{{ $t('button.submit') }}</el-button>
          <el-button @click.native="formVisible = false" class="set-common-btn blank-blue-button">{{ $t('button.cancel') }}</el-button>
        </el-form-item>
      </el-form>
      </div>
    </el-dialog>

<!-- 权限配置弹框 -->
    <el-dialog
    class="el-dialog-style common-dialog-style"
      title="权限配置"
      :visible.sync="permissonVisible"
      width="25%">
      <div class="block">
      <el-form class="width-auto">
        <el-row>
          <el-col :span="12">
            <el-tree
              :data="permissons"
              ref="permissonTree"
              show-checkbox
              node-key="id"
              :default-checked-keys="checkedPermissionKeys"
              :props="defaultProps">
            </el-tree>

          </el-col>
        </el-row>
       <el-form-item class="dialog-button-list marginT10">
          <el-button type="primary" @click="savePermissions" class="set-common-btn blue-button">{{ $t('button.submit') }}</el-button>
        </el-form-item>
      </el-form>
      </div>
    </el-dialog>

  </div>
</template>

<script src="./role.js"></script>

