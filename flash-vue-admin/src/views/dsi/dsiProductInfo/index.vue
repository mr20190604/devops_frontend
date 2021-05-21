<template>
  <div class="app-container">
    <div class="block">
          <el-form label-width="120px" :inline="true">
            <el-form-item label="产品名称">
              <el-input v-model="listQuery.productName" placeholder="输入产品名称" />
            </el-form-item>
            <el-form-item label="产品型号">
              <el-input v-model="listQuery.productModel" placeholder="输入产品型号" />
            </el-form-item>
           <!-- <el-form-item label="是否有毒">
              <dict-select v-model="listQuery.isPoisonHarm" dict-name="是否" />
            </el-form-item>
            <el-form-item label="是否易燃易爆">
              <dict-select v-model="listQuery.isInflammableExplosive" dict-name="是否" />
            </el-form-item>
            <el-form-item label="形状类型">
              <dict-select v-model="listQuery.formId" dict-name="形状类型" />
            </el-form-item>

            <el-form-item label="生产企业">
              <enterprise v-model="listQuery.enterpriseId" />
            </el-form-item>-->
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
            v-permission="['/product/info/add']"
            type="primary"
            size="mini"
            icon="el-icon-plus"
            @click.native="add"
          >{{ $t('button.add') }}
          </el-button>
          <el-button
            v-permission="['/product/info/add']"
            type="primary"
            size="mini"
            icon="el-icon-plus"
            @click.native="add"
          >选择原料
          </el-button>
          <el-button
            v-permission="['/product/info/add']"
            type="success"
            size="mini"
            icon="el-icon-view"
            @click.native="add"
          >查看
          </el-button>
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
     <!-- <el-table-column label="产品编码">
        <template slot-scope="scope">
          {{ scope.row.productCode }}
        </template>
      </el-table-column>-->
      <el-table-column label="产品名称">
        <template slot-scope="scope">
          {{ scope.row.productName }}
        </template>
      </el-table-column>
      <el-table-column label="产品型号">
        <template slot-scope="scope">
          {{ scope.row.productModel }}
        </template>
      </el-table-column>
      <el-table-column label="易燃易爆">
        <template slot-scope="scope">
          {{ scope.row.isInflammableExplosiveName }}
        </template>
      </el-table-column>
      <el-table-column label="腐蚀性">
        <template slot-scope="scope">
          {{ scope.row.isCorrosive }}
        </template>
      </el-table-column>
      <el-table-column label="毒性">
        <template slot-scope="scope">
          {{ scope.row.isPoisonHarm }}
        </template>
      </el-table-column>

      <!--<el-table-column label="形状类型">
        <template slot-scope="scope">
          {{ scope.row.formName }}
        </template>
      </el-table-column>
      <el-table-column label="生产企业">
        <template slot-scope="scope">
          {{ scope.row.enterpriseName }}
        </template>
      </el-table-column>-->
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
      width="70%"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="产品名称">
              <el-input v-model="form.productName" minlength="1" placeholder="请输入产品名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品型号">
              <el-input v-model="form.productModel" minlength="1" placeholder="请输入产品型号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="易燃易爆">
              <dict-select v-model="form.isInflammableExplosive" dict-name="是否" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="腐蚀性">
              <dict-select v-model="form.isCorrosive" dict-name="是否" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="毒性">
              <dict-select v-model="form.isPoisonHarm" dict-name="是否" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="放射性">
              <dict-select v-model="form.isRadioactivity" dict-name="是否" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="存储标准">
              <el-input v-model="form.storageStandards"  style="width: 71%" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="产品说明">
              <el-input type="textarea" v-model="form.productDesc"  style="width: 71%"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item align="right" style="margin-right: 50px">
          <el-button type="primary"  align="center" @click="addMaterial">添加新物资</el-button>
        </el-form-item>
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

          <el-table-column label="化学名称">
            <template slot-scope="scope">
              {{ scope.row.chemistryName }}
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
        <el-form-item id="myself">
          <el-button type="primary" @click="save">{{ $t('button.submit') }}</el-button>
          <el-button @click.native="formVisible = false">{{ $t('button.cancel') }}</el-button>
        </el-form-item>

      </el-form>
    </el-dialog>
<!--
    <el-dialog
      :title="formTitle"
      :visible.sync="materialVisible"
      width="70%"
    >
      <el-form ref="materialForm" :model="materialForm" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="原料编码">
              <el-input v-model="materialForm.materialCode" minlength="1" placeholder="请输入原料编码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="化学名称">
              <el-input v-model="materialForm.chemistryName" minlength="1" placeholder="请输入化学名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="英文名称">
              <el-input v-model="materialForm.englishName" minlength="1" placeholder="请输入英文名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="中文别名">
              <el-input v-model="materialForm.shortName" minlength="1" placeholder="请输入中文别名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="原料类别">
              <dict-select v-model="materialForm.materialType" dict-name="原料类别" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="理化性质">
              <el-input v-model="materialForm.physicochemicalProperties" minlength="1" placeholder="请输入理化性质" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="健康危害">
              <el-input v-model="materialForm.healthHazards" minlength="1" placeholder="请输入健康危害" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="危险特性">
              <el-input v-model="materialForm.dangerousCharacteristic" minlength="1" placeholder="请输入危险特性" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="CAS编号">
              <el-input v-model="materialForm.casCode" minlength="1" placeholder="请输入CAS编号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否中间产品">
              <dict-select v-model="materialForm.isOriginal" dict-name="是否" placeholder="请选择是否中间产品" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item class="myself">
          <el-button type="primary" @click="saveProductMaterial">{{ $t('button.submit') }}</el-button>
          <el-button @click.native="materialVisible = false">{{ $t('button.cancel') }}</el-button>
        </el-form-item>

      </el-form>
    </el-dialog>-->
  </div>
</template>

<script src="./dsiProductInfo.js"></script>

<style rel="stylesheet/scss" lang="scss" >
  @import "src/styles/commonmyself.scss";
</style>

