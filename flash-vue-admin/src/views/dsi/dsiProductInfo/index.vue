<template>
  <div class="app-container">
    <div class="block">
          <el-form label-width="120px" :inline="true">
            <el-form-item label="关键字">
              <el-input v-model="listQuery.key" placeholder="编码、名称" />
            </el-form-item>
            <el-form-item label="是否有毒">
              <dict-select v-model="listQuery.isPoisonHarm" dict-name="是否" />
            </el-form-item>
            <el-form-item label="是否易燃易爆">
              <dict-select v-model="listQuery.isInflammableExplosive" dict-name="是否" />
            </el-form-item>
            <el-form-item label="形状类型">
              <dict-select v-model="listQuery.formId" dict-name="形状类型" />
            </el-form-item>
            <el-form-item style="float: right;margin-right: 100px">
              <el-button type="success" size="mini" icon="el-icon-search" @click.native="search">{{ $t('button.search') }}
              </el-button>
              <el-button type="primary" size="mini" icon="el-icon-refresh" @click.native="reset">{{ $t('button.reset') }}
              </el-button>
            </el-form-item>
            <br>
            <el-form-item label="生产企业">
              <enterprise v-model="listQuery.enterpriseId" />
            </el-form-item>

        </el-form>

      <br>
      <el-row>
        <el-col :span="24">
          <el-button
            v-permission="['/product/info/add']"
            type="success"
            size="mini"
            icon="el-icon-plus"
            @click.native="add"
          >{{ $t('button.add') }}
          </el-button>
         <!-- <el-button
            v-permission="['/product/info/update']"
            type="primary"
            size="mini"
            icon="el-icon-edit"
            @click.native="edit"
          >{{ $t('button.edit') }}
          </el-button>-->
          <el-button
            v-permission="['/product/info/delete']"
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click.native="remove"
          >批量删除
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
      <el-table-column label="产品编码">
        <template slot-scope="scope">
          {{ scope.row.productCode }}
        </template>
      </el-table-column>
      <el-table-column label="产品名称">
        <template slot-scope="scope">
          {{ scope.row.productName }}
        </template>
      </el-table-column>
      <el-table-column label="是否有毒">
        <template slot-scope="scope">
          {{ scope.row.isPoisonHarmName }}
        </template>
      </el-table-column>
      <el-table-column label="是否易燃易爆">
        <template slot-scope="scope">
          {{ scope.row.isInflammableExplosiveName }}
        </template>
      </el-table-column>
      <el-table-column label="形状类型">
        <template slot-scope="scope">
          {{ scope.row.formName }}
        </template>
      </el-table-column>
      <el-table-column label="生产企业">
        <template slot-scope="scope">
          {{ scope.row.enterpriseName }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            v-permission="['/product/info/update']"
            type="text"
            size="mini"
            icon="el-icon-edit"
            @click.native="editItem(scope.row)"
          >{{ $t('button.edit') }}
          </el-button>
          <el-button
            v-permission="['/product/info/delete']"
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
      width="60%"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="产品编码">
              <el-input v-model="form.productCode" minlength="1" placeholder="请输入产品编码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品名称">
              <el-input v-model="form.productName" minlength="1" placeholder="请输入产品名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否有毒">
              <dict-select v-model="form.isPoisonHarm" dict-name="是否" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否易燃易爆">
              <dict-select v-model="form.isInflammableExplosive" dict-name="是否" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="形状类型">
              <dict-select v-model="form.formId" dict-name="形状类型" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="生产企业">
              <enterprise v-model="form.enterpriseId" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item id="myself">
          <el-button type="primary" @click="save">{{ $t('button.submit') }}</el-button>
          <el-button @click.native="formVisible = false">{{ $t('button.cancel') }}</el-button>
        </el-form-item>

      </el-form>
    </el-dialog>
  </div>
</template>

<script src="./dsiProductInfo.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/commonmyself.scss";
</style>

