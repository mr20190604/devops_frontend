<template>
  <div class="app-container">
    <div class="block">
      <el-form label-width="120px" :inline="true">
        <el-form-item label="场所/设施名称">
          <el-input v-model="listQuery.buildName" placeholder="请输入场所/设施名称" />
        </el-form-item>
        <el-form-item label="所在地区">
          <district v-model="listQuery.districtCode" placeholder="请选择所在地区" />
        </el-form-item>
        <el-form-item label="防护等级">
          <dict-select dict-name="防护等级" />
        </el-form-item>
        <el-form-item label="联系人">
          <el-input v-model="listQuery.contactper" placeholder="请输入联系人(模糊查询)" />
        </el-form-item>
        <el-form-item label="目标类型">
          <dict-select dict-name="防护目标" placeholder="请选择目标类型" />
        </el-form-item>
      </el-form>
      <el-row :gutter="24">
        <el-col :span="6">
          <el-button type="success" size="mini" icon="el-icon-search" @click.native="search">{{ $t('button.search') }}
          </el-button>
          <el-button type="primary" size="mini" icon="el-icon-refresh" @click.native="reset">{{ $t('button.reset') }}
          </el-button>
        </el-col>
      </el-row>
      <br>
      <el-row>
        <el-col :span="24">
          <el-button
            v-permission="['/bas/build/add']"
            type="success"
            size="mini"
            icon="el-icon-plus"
            @click.native="add"
          >{{ $t('button.add') }}
          </el-button>
          <el-button
            v-permission="['/bas/build/update']"
            type="primary"
            size="mini"
            icon="el-icon-edit"
            @click.native="edit"
          >{{ $t('button.edit') }}
          </el-button>
          <el-button
            v-permission="['/bas/build/delete']"
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click.native="remove"
          >{{ $t('button.delete') }}
          </el-button>
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
      <el-table-column label="序号" type="index" width="50" />
      <el-table-column label="场所/设施名称">
        <template slot-scope="scope">
          {{ scope.row.buildName }}
        </template>
      </el-table-column>
      <el-table-column label="防护等级">
        <template slot-scope="scope">
          {{ scope.row.levelName }}
        </template>
      </el-table-column>
      <el-table-column label="人数">
        <template slot-scope="scope">
          {{ scope.row.personNum }}
        </template>
      </el-table-column>
      <el-table-column label="行政区划">
        <template slot-scope="scope">
          {{ scope.row.districtName }}
        </template>
      </el-table-column>
      <el-table-column label="地址">
        <template slot-scope="scope">
          {{ scope.row.address }}
        </template>
      </el-table-column>
      <el-table-column label="面积(万平方米)">
        <template slot-scope="scope">
          {{ scope.row.engrossArea }}
        </template>
      </el-table-column>
      <el-table-column label="负责人">
        <template slot-scope="scope">
          {{ scope.row.personName }}
        </template>
      </el-table-column>
      <el-table-column label="联系方式">
        <template slot-scope="scope">
          {{ scope.row.personOtel }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            v-permission="['/bas/build/update']"
            type="text"
            size="mini"
            icon="el-icon-edit"
            @click.native="editItem(scope.row)"
          >{{ $t('button.edit') }}
          </el-button>
          <el-button
            v-permission="['/bas/build/delete']"
            type="text"
            size="mini"
            icon="el-icon-delete"
            @click.native="removeItem(scope.row)"
          >{{ $t('button.delete') }}
          </el-button>
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
          <el-col :span="24">
            <el-form-item label="场所/设施名称">
              <el-input v-model="form.buildName" minlength="1" placeholder="请输入场所/设施名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="防护等级">
              <dict-select dict-name="防护等级" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="目标类型">
              <dict-select dict-name="防护目标" placeholder="请选择目标类型" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所在地区">
              <district v-model="form.districtCode" placeholder="请选择所在地区" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="地址">
              <el-input v-model="form.address" minlength="1" placeholder="请输入地址" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="负责人">
              <el-input v-model="form.personName" minlength="1" placeholder="请输入负责人" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="负责人办公电话">
              <el-input v-model="form.personOtel" minlength="1" placeholder="请输入负责人办公电话" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="人数">
              <el-input v-model="form.personNum" minlength="1" placeholder="请输入人数" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="面积(万平方米)">
              <el-input v-model="form.engrossArea" minlength="1" placeholder="请输入面积" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="form.notes" minlength="1" placeholder="请输入备注" />
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

<script src="./mmBasBuild.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/common.scss";
</style>

