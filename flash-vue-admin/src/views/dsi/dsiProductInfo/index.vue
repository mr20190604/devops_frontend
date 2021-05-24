<template>
  <div class="app-container">
    <div class="block">
         <!-- <el-form label-width="120px" :inline="true">
            <el-form-item label="产品名称">
              <el-input v-model="listQuery.productName" placeholder="输入产品名称" />
            </el-form-item>
            <el-form-item label="产品型号">
              <el-input v-model="listQuery.productModel" placeholder="输入产品型号" />
            </el-form-item>
           &lt;!&ndash; <el-form-item label="是否有毒">
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
          <el-button type="primary" icon="el-icon-search" @click.native="search">{{ $t('button.search') }}
          </el-button>
          <el-button icon="el-icon-refresh" @click.native="reset">{{ $t('button.reset') }}
          </el-button>
        </el-form-item>
      <!--</el-form>-->

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
            @click.native="removeBatch"
          >批量删除
          </el-button>
        </el-col>
      </el-row>
    </div>

    <el-table
      v-loading="listLoading"
      :data="productList"
      element-loading-text="Loading"
      border
      fit
      :row-key="row=>row.id"
      highlight-current-row
      @current-change="handleCurrentChange"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
        :reserve-selection="true"
      />
      <el-table-column
        type="index"
        width="50"
        label="序号"
      />
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
          {{ scope.row.isCorrosiveName }}
        </template>
      </el-table-column>
      <el-table-column label="毒性">
        <template slot-scope="scope">
          {{ scope.row.isPoisonHarmName }}
        </template>
      </el-table-column>
      <el-table-column label="放射性">
        <template slot-scope="scope">
          {{ scope.row.isRadioactivityName }}
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
      :modal="false"
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
              <el-select v-model="form.isInflammableExplosive">
                <el-option
                  v-for="item in judge_list"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="腐蚀性">
              <el-select v-model="form.isCorrosive" >
                <el-option
                  v-for="item in judge_list"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="毒性">
              <el-select v-model="form.isPoisonHarm" >
                <el-option
                  v-for="item in judge_list"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="放射性">
              <el-select v-model="form.isRadioactivity"  >
                <el-option
                  v-for="item in judge_list"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="存储标准">
              <el-input v-model="form.storageStandards" style="width: 71%" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="产品说明">
              <el-input v-model="form.productDesc" type="textarea" style="width: 71%" />
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

<style rel="stylesheet/scss" lang="scss" >
  @import "src/styles/commonmyself.scss";
</style>

