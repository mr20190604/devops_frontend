<template>
  <div class="app-container">
    <div class="block">
      <el-row>
        <el-col :span="24">
          <el-form label-width="120px" :inline="true">
            <el-form-item label="关键字">
              <el-input v-model="listQuery.key" placeholder="编号、名称、地点、描述" />
            </el-form-item>
            <el-form-item label="事件类型">
              <dict-select dict-name="事件类型" />
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="24">
          <el-button type="success" size="mini" icon="el-icon-search" @click.native="search">{{ $t('button.search') }}</el-button>
          <el-button type="primary" size="mini" icon="el-icon-refresh" @click.native="reset">{{ $t('button.reset') }}</el-button>
        </el-col>
      </el-row>
      <br>
      <el-row>
        <el-col :span="24">
          <el-button v-permission="['/manager/event/add']" type="success" size="mini" icon="el-icon-plus" @click.native="add">{{ $t('button.add') }}</el-button>
         <!-- <el-button v-permission="['/manager/event/update']" type="primary" size="mini" icon="el-icon-edit" @click.native="edit">{{ $t('button.edit') }}</el-button>-->
          <el-button v-permission="['/manager/event/delete']" type="danger" size="mini" icon="el-icon-delete" @click.native="remove">批量删除</el-button>
        </el-col>
      </el-row>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      @current-change="handleCurrentChange"
    >
      <el-table-column
        type="selection"
        width="55"
        :reserve-selection="true"
      >
      </el-table-column>
      <el-table-column
        type="index"
        width="50"
        label="序号"
      >
      </el-table-column>
      <el-table-column label="事件编码">
        <template slot-scope="scope">
          {{ scope.row.eventCode }}
        </template>
      </el-table-column>
      <el-table-column label="事件名称">
        <template slot-scope="scope">
          {{ scope.row.eventName }}
        </template>
      </el-table-column>
      <el-table-column label="事件类型">
        <template slot-scope="scope">
          {{ scope.row.eventTypeName }}
        </template>
      </el-table-column>
      <el-table-column label="事件地点">
        <template slot-scope="scope">
          {{ scope.row.eventAddress }}
        </template>
      </el-table-column>
      <el-table-column label="事件描述">
        <template slot-scope="scope">
          {{ scope.row.eventDesc }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button v-permission="['/manager/event/update']" type="text" size="mini" icon="el-icon-edit" @click.native="editItem(scope.row)">{{ $t('button.edit') }}</el-button>
          <el-button v-permission="['/manager/event/delete']" type="text" size="mini" icon="el-icon-delete" @click.native="removeItem(scope.row)">{{ $t('button.delete') }}</el-button>
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
      @next-click="fetchNext"
    />

    <el-dialog
      :title="formTitle"
      :visible.sync="formVisible"
      width="70%"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="事件编码">
              <el-input v-model="form.eventCode" minlength="1" placeholder="请输入事件编码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="事件类型">
              <dict-select dict-name="事件类型" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="事件名称">
              <el-input v-model="form.eventName" minlength="1" placeholder="请输入事件名称" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="事件地点">
              <el-input v-model="form.eventAddress" minlength="1" placeholder="请输入事件地点" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="事件描述">
              <el-input v-model="form.eventDesc" minlength="1" placeholder="请输入事件描述" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button type="primary" @click="save">{{ $t('button.submit') }}</el-button>
          <el-button @click.native="formVisible = false">{{ $t('button.cancel') }}</el-button>
        </el-form-item>

      </el-form>
    </el-dialog>
  </div>
</template>

<script src="./mmManagerEvent.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
    @import "src/styles/common.scss";
</style>

