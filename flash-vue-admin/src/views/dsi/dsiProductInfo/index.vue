<template>
  <div class="app-container">
    <div class="block">
          <!--<el-form label-width="120px" :inline="true">-->
            <!--<el-form-item label="产品名称">
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
       <!-- <el-form-item style="float: right;margin-right: 100px">
          <el-button type="primary" icon="el-icon-search" @click.native="search">{{ $t('button.search') }}
          </el-button>
          <el-button icon="el-icon-refresh" @click.native="reset">{{ $t('button.reset') }}
          </el-button>
        </el-form-item>
      </el-form>-->

      <br>
      <el-row>
        <el-col :span="24">
          <el-button
            v-permission="['/product/info/add']"
            type="primary"
            size="mini"
            icon="el-icon-plus"
            @click.native="add"
          >添加产品
          </el-button>
          <el-button
            v-permission="['/product/info/add']"
            type="primary"
            size="mini"
            icon="el-icon-plus"
            @click="selectMaterial"
          >选择原料
          </el-button>
          <el-button
            v-permission="['/product/info/add']"
            type="success"
            size="mini"
            icon="el-icon-view"
            @click="viewProduct"
          >查看已选原料
          </el-button>
          <!--<el-button
            v-permission="['/product/info/delete']"
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click.native="removeBatch"
          >批量删除
          </el-button>-->
        </el-col>
      </el-row>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
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
    <div style="text-align: center">
      <el-button type="primary" @click="saveProduct">保存</el-button>
      <el-button @click.native="formVisible = false">{{ $t('button.cancel') }}</el-button>
    </div>
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
   <!-- <el-dialog
      :title="formTitle"
      :visible.sync="materialVisible"
      :modal="false"
      width="70%"
    >
      &lt;!&ndash;<materialInfo></materialInfo>&ndash;&gt;

    </el-dialog>-->
    <el-dialog
      :title="'选择原料'"
      :visible.sync="materialVisible"
      :modal="false"
      width="70%"
    >

      <el-form label-width="120px" :inline="true">
        <el-form-item label="关键字:">
          <el-input v-model="listQuery.key" placeholder="请输入关键字(编码、名称)" />
        </el-form-item>
        <el-form-item label="原料类别:">
          <dict-select v-model="listQuery.materialType" dict-name="原料类别" />
        </el-form-item>
        <el-form-item label="是否中间产品:">
          <dict-select v-model="listQuery.isDanger" dict-name="是否" placeholder="是否中间产品" />
        </el-form-item>
        <el-form-item style="float: right;margin-right: 100px">
          <el-button type="primary"  icon="el-icon-search" @click.native="search">{{ $t('button.search') }}
          </el-button>
          <el-button  icon="el-icon-refresh" @click.native="reset">{{ $t('button.reset') }}
          </el-button>
        </el-form-item>

      <el-row style="margin-left: 30px">
        <el-col :span="24">
          <el-button
            v-permission="['/material/baseinfo/add']"
            type="success"
            size="mini"
            icon="el-icon-plus"
            @click.native="addMaterial"
          >{{ $t('button.add') }}
          </el-button>
        </el-col>
      </el-row>
      </el-form>
    <el-table
      v-loading="listLoading"
      :data="materialList"
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
     <!-- <el-table-column
        type="index"
        width="50"
        label="序号"
      />-->
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
      <div style="text-align: center">
        <el-button type="primary" @click="saveProduct">{{ $t('button.submit') }}</el-button>
        <el-button @click.native="materialVisible = false">{{ $t('button.cancel') }}</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :title="'添加原料'"
      :visible.sync="addVisible"
      :modal="false"
      width="70%"
    >
      <el-form ref="form1" :model="form" :rules="rules" label-width="120px">
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
        <div style="text-align: center" >
          <el-button type="primary" @click="saveMaterial">{{ $t('button.submit') }}</el-button>
          <el-button @click.native="addVisible = false">{{ $t('button.cancel') }}</el-button>
        </div>

      </el-form>
    </el-dialog>
    <el-dialog
      :title="'查看产品原料'"
      :visible.sync="productVisible"
      :modal="false"
      width="70%"
    >
      <!--<el-form label-width="120px" :inline="true">
        <el-row>
          <el-col :span="8">
            <el-form-item label="企业名称">
              <el-input v-model="this.enterpriseName"  />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="产品名称">
              <el-input v-model="listQuery.productName"  />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="产品编码">
              <el-input v-model="listQuery.productName"  />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>-->
      <el-table
        v-loading="listLoading"
        :data="selectedList"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
        @current-change="handleCurrentChange"
      >

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

      </el-table>
      <div style="text-align: center" >
        <el-button type="danger" @click.native="productVisible = false">返回</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script src="./dsiProductInfo.js"></script>

<style rel="stylesheet/scss" lang="scss" >
  @import "src/styles/commonmyself.scss";
</style>

