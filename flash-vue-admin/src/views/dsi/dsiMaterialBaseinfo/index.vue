<template>
  <div class="app-container">
    <div class="block">
          <el-form label-width="120px" :inline="true">
            <el-form-item label="关键字">
              <el-input v-model="listQuery.key" placeholder="请输入关键字(编码、名称)" />
            </el-form-item>
            <el-form-item label="原料类别">
              <dict-select v-model="listQuery.materialType" dict-name="原料类别" />
            </el-form-item>
            <el-form-item label="是否中间产品">
              <dict-select v-model="listQuery.isOriginal" dict-name="是否" placeholder="是否中间产品" />
            </el-form-item>

          <el-form-item style="float: right;margin-right: 100px">
          <el-button type="success" size="mini" icon="el-icon-search" @click.native="search">{{ $t('button.search') }}
          </el-button>
          <el-button type="primary" size="mini" icon="el-icon-refresh" @click.native="reset">{{ $t('button.reset') }}
          </el-button>
          </el-form-item>
        </el-form>
      <br>
      <el-row>
        <el-col :span="24">
          <el-button
            v-permission="['/material/baseinfo/add']"
            type="success"
            size="mini"
            icon="el-icon-plus"
            @click.native="add"
          >{{ $t('button.add') }}
          </el-button>
          <!--<el-button
            v-permission="['/material/baseinfo/update']"
            type="primary"
            size="mini"
            icon="el-icon-edit"
            @click.native="edit"
          >{{ $t('button.edit') }}
          </el-button>-->
          <el-button
            v-permission="['/material/baseinfo/delete']"
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click.native="remove"
          >批量删除</el-button>
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
      <el-table-column label="原料编码">
        <template slot-scope="scope">
          {{ scope.row.materialCode }}
        </template>
      </el-table-column>
      <el-table-column label="化学名称">
        <template slot-scope="scope">
          {{ scope.row.chemistryName }}
        </template>
      </el-table-column>
      <el-table-column label="英文名称">
        <template slot-scope="scope">
          {{ scope.row.englishName }}
        </template>
      </el-table-column>
      <el-table-column label="中文别名">
        <template slot-scope="scope">
          {{ scope.row.shortName }}
        </template>
      </el-table-column>
      <el-table-column label="原料类别">
        <template slot-scope="scope">
          {{ scope.row.materialTypeName }}
        </template>
      </el-table-column>
      <el-table-column label="理化性质">
        <template slot-scope="scope">
          {{ scope.row.physicochemicalProperties }}
        </template>
      </el-table-column>
      <el-table-column label="健康危害">
        <template slot-scope="scope">
          {{ scope.row.healthHazards }}
        </template>
      </el-table-column>
      <el-table-column label="危险特性">
        <template slot-scope="scope">
          {{ scope.row.dangerousCharacteristic }}
        </template>
      </el-table-column>
      <el-table-column label="CAS编号">
        <template slot-scope="scope">
          {{ scope.row.casCode }}
        </template>
      </el-table-column>
      <el-table-column label="是否危化品">
        <template slot-scope="scope">
          {{ scope.row.isDangerName }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            v-permission="['/material/baseinfo/update']"
            type="text"
            size="mini"
            icon="el-icon-edit"
            @click.native="editItem(scope.row)"
          >{{ $t('button.edit') }}
          </el-button>
          <el-button
            v-permission="['/material/baseinfo/delete']"
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
          <el-col :span="12">
            <el-form-item label="原料编码">
              <el-input v-model="form.materialCode" minlength="1" placeholder="请输入原料编码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="化学名称">
              <el-input v-model="form.chemistryName" minlength="1" placeholder="请输入化学名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="英文名称">
              <el-input v-model="form.englishName" minlength="1" placeholder="请输入英文名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="中文别名">
              <el-input v-model="form.shortName" minlength="1" placeholder="请输入中文别名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="原料类别">
              <dict-select v-model="form.materialType" dict-name="原料类别" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="理化性质">
              <el-input v-model="form.physicochemicalProperties" minlength="1" placeholder="请输入理化性质" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="健康危害">
              <el-input v-model="form.healthHazards" minlength="1" placeholder="请输入健康危害" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="危险特性">
              <el-input v-model="form.dangerousCharacteristic" minlength="1" placeholder="请输入危险特性" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="CAS编号">
              <el-input v-model="form.casCode" minlength="1" placeholder="请输入CAS编号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否中间产品">
              <dict-select v-model="form.isOriginal" dict-name="是否" placeholder="请选择是否中间产品" />
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

<script src="./dsiMaterialBaseinfo.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/commonmyself.scss";
</style>

