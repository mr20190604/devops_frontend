<template>
  <div class="app-container">
    <div class="block">
      <el-row>
        <el-col :span="24">
        </el-col>
      </el-row>
    </div>
    <div class="table-list">
      <div class="btnLists">
        <el-button
          class="set-common-btn blue-button"
          v-permission="['/product/info/add']"
          type="primary"
          size="mini"
          @click.native="add"
        >添加产品
        </el-button>
        <el-button
          class="set-common-btn blank-blue-button"
          v-permission="['/product/info/delete']"
          type="danger"
          size="mini"
          @click="removeBatch"
        >批量删除
        </el-button>
      </div>
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        border
        :row-key="row=>row.id"
        @current-change="handleCurrentChange"
        @selection-change="handleSelectionChange"
        ref="productTable"
        height="331px"
      >
        <el-table-column type="index" width="55" label="序号" align="center"/>
        <el-table-column label="产品名称" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="updateText" @click="viewProductDetail(scope.row)">{{ scope.row.productName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="产品型号" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.productModel }}
          </template>
        </el-table-column>
        <el-table-column label="易燃易爆" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.isInflammableExplosiveName }}
          </template>
        </el-table-column>
        <el-table-column label="腐蚀性" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.isCorrosiveName }}
          </template>
        </el-table-column>
        <el-table-column label="毒性" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.isPoisonHarmName }}
          </template>
        </el-table-column>
        <el-table-column label="放射性" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.isRadioactivityName }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="350px">
          <template slot-scope="scope">
            <el-button
              class="font14"
              v-permission="['/product/info/add']"
              type="text"
              size="mini"
              icon="el-icon-plus"
              @click="selectMaterial(scope.row)"
            >添加原料
            </el-button>
            <!-- <el-button
              class="font14"
               v-permission="['/product/info/add']"
               type="text"
               size="mini"
               icon="el-icon-view"
               @click="viewProduct(scope.row)"
             >查看
             </el-button>-->
            <el-button
              class="font14 marginleft23"
              v-permission="['/product/info/update']"
              type="text"
              size="mini"
              icon="el-icon-edit"
              @click.native="editItem(scope.row)"
            >{{ $t('button.edit') }}
            </el-button>
            <el-button
              class="font14 marginleft23"
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
    </div>
    <div>
      <el-pagination
        background
        class="outer-pagenation"
        layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="[10, 20, 50, 100,500]"
        :page-size="listQuery.limit"
        :total="total"
        @size-change="changeSize"
        @current-change="fetchPage"
        @prev-click="fetchPrev"
        @next-click="fetchNext"
      />
     <!-- <div class="align-center">
        <el-button type="primary" class="set-common-btn blue-button" @click="saveProduct">{{ $t('button.submit') }}
        </el-button>
        <el-button class="set-common-btn blank-blue-button" @click="closeFatherDialog">关闭</el-button>
      </div>-->
    </div>
    <!-- 添加产品信息弹框 -->
    <el-dialog
      class="common-dialog-style height700"
      :title="formTitle"
      :visible.sync="formVisible"
      :modal="false"
      width="960px"
      @close="closeDialog"
    >
      <div class="block">
        <el-form ref="form" :model="form" :rules="rules" label-width="76px" class="align-right has-Label-Width">
          <el-row>
            <el-col :span="12">
              <el-form-item label="产品名称：">
                <el-input v-model="form.productName" minlength="1" placeholder="请输入产品名称"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="产品型号：">
                <el-input v-model="form.productModel" minlength="1" placeholder="请输入产品型号"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="易燃易爆：">
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
              <el-form-item label="腐蚀性：">
                <el-select v-model="form.isCorrosive">
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
              <el-form-item label="毒性：">
                <el-select v-model="form.isPoisonHarm">
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
              <el-form-item label="放射性：">
                <el-select v-model="form.isRadioactivity">
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
              <el-form-item label="存储标准：">
                <el-input v-model="form.storageStandards" style="width: 71%"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="产品说明：">
                <el-input v-model="form.productDesc" type="textarea"/>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item class="dialog-button-list">
            <el-button type="primary" @click="save" class="set-common-btn blue-button">{{ $t('button.submit') }}
            </el-button>
            <el-button @click.native="formVisible = false" class="set-common-btn blank-blue-button">{{
              $t('button.cancel') }}
            </el-button>
          </el-form-item>

        </el-form>
      </div>
    </el-dialog>
    <!-- 选择原料弹框 -->
    <el-dialog
      class="common-dialog-style height700"
      :title="'选择原料'"
      :visible.sync="materialVisible"
      :modal="false"
      width="960px"
    >
      <div class="block">
        <el-form label-width="84px" class="align-right has-Label-Width" style="width:100%">
          <el-row>
            <el-col :span="9">
              <el-form-item label="关键字：">
                <el-input v-model="listQuery.key" placeholder="请输入关键字(编码、名称)"/>
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item label="原料类别：">
                <dict-select v-model="listQuery.materialType" dict-name="原料类别"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="hasNoMarginBottom">
            <el-col :span="9">
              <el-form-item label="是否危化品：">
                <dict-select v-model="listQuery.isDanger" dict-name="是否" placeholder="请选择是否"/>
              </el-form-item>
            </el-col>
            <el-col :span="14">
              <el-form-item class="align-right">
                <el-button type="primary" class="set-common-btn blue-button" @click.native="search">{{
                  $t('button.search') }}
                </el-button>
                <el-button class="set-common-btn blank-blue-button" @click.native="reset">{{ $t('button.reset') }}
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="table-list">
        <div class="btnLists">
          <el-button
            class="set-common-btn blue-button"
            v-permission="['/material/baseinfo/add']"
            type="success"
            size="mini"
            @click.native="addMaterial"
          >添加新原料
          </el-button>
        </div>
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
          @row-click="toggleSelection1"
          ref="materialTable"
          max-height="331px"
        >
          <el-table-column
            type="selection"
            width="55"
            :reserve-selection="true"
          />
          <el-table-column label="原料编码" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.materialCode }}
            </template>
          </el-table-column>
          <el-table-column label="化学名称" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.chemistryName }}
            </template>
          </el-table-column>
          <el-table-column label="英文名称" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.englishName }}
            </template>
          </el-table-column>
          <el-table-column label="中文别名" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.shortName }}
            </template>
          </el-table-column>
          <el-table-column label="原料类别" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.materialTypeName }}
            </template>
          </el-table-column>
          <el-table-column label="理化性质" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.physicochemicalProperties }}
            </template>
          </el-table-column>
          <el-table-column label="健康危害" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.healthHazards }}
            </template>
          </el-table-column>
          <el-table-column label="危险特性" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.dangerousCharacteristic }}
            </template>
          </el-table-column>
          <el-table-column label="CAS编号" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.casCode }}
            </template>
          </el-table-column>
          <el-table-column label="是否危化品" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.isDangerName }}
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          background
          class="outer-pagenation"
          layout="total, sizes, prev, pager, next, jumper"
          :page-sizes="[5,10]"
          :page-size="listQuery.limit"
          :total="total"
          @size-change="changeSize"
          @current-change="fetchPage"
          @prev-click="fetchPrev"
          @next-click="fetchNext"
        />
      </div>
      <div class="align-center">
        <el-button type="primary" @click="saveProduct" class="set-common-btn blue-button">{{ $t('button.submit') }}
        </el-button>
        <el-button @click.native="materialVisible = false" class="set-common-btn blank-blue-button">{{
          $t('button.cancel') }}
        </el-button>
      </div>

    </el-dialog>
    <!-- 添加原料弹框 -->
    <el-dialog
      class="common-dialog-style height700"
      :title="'添加原料'"
      :visible.sync="addVisible"
      :modal="false"
      width="960px"
    >
      <div class="block">
        <el-form ref="form1" :model="form" :rules="rules" label-width="84px" class="align-right has-Label-Width">
          <el-row>
            <el-col :span="12">
              <el-form-item label="原料编码：">
                <el-input v-model="form1.materialCode" minlength="1" placeholder="请输入原料编码"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="化学名称：">
                <el-input v-model="form1.chemistryName" minlength="1" placeholder="请输入化学名称"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="英文名称：">
                <el-input v-model="form1.englishName" minlength="1" placeholder="请输入英文名称"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="中文别名：">
                <el-input v-model="form1.shortName" minlength="1" placeholder="请输入中文别名"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="原料类别：">
                <dict-select v-model="form1.materialType" dict-name="原料类别" style="width: 200px"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="理化性质：">
                <el-input v-model="form1.physicochemicalProperties" minlength="1" placeholder="请输入理化性质"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="健康危害：">
                <el-input v-model="form1.healthHazards" minlength="1" placeholder="请输入健康危害"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="危险特性：">
                <el-input v-model="form1.dangerousCharacteristic" minlength="1" placeholder="请输入危险特性"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="CAS编号：">
                <el-input v-model="form1.casCode" minlength="1" placeholder="请输入CAS编号"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否危化品：">
                <dict-select v-model="form1.isDanger" dict-name="是否" placeholder="请选择是否" style="width: 200px"/>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="align-center">
            <el-button type="primary" @click="saveMaterial" class="set-common-btn blue-button">{{ $t('button.submit')
              }}
            </el-button>
            <el-button @click.native="addVisible = false" class="set-common-btn blank-blue-button">{{
              $t('button.cancel') }}
            </el-button>
          </div>

        </el-form>
      </div>
    </el-dialog>
    <el-dialog
      class="common-dialog-style height750"
      :title="formTitle"
      :visible.sync="productDetailVisible"
      :modal="false"
      width="960px"
      @close="closeDialog"
    >
      <div class="block">
        <el-form ref="form" :model="form" :rules="rules" label-width="76px" class="align-right has-Label-Width">
          <el-row>
            <el-col :span="12">
              <el-form-item label="产品名称：">
                <el-input v-model="form.productName" minlength="1" placeholder="请输入产品名称"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="产品型号：">
                <el-input v-model="form.productModel" minlength="1" placeholder="请输入产品型号"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="易燃易爆：">
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
              <el-form-item label="腐蚀性：">
                <el-select v-model="form.isCorrosive">
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
              <el-form-item label="毒性：">
                <el-select v-model="form.isPoisonHarm">
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
              <el-form-item label="放射性：">
                <el-select v-model="form.isRadioactivity">
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
              <el-form-item label="存储标准：">
                <el-input v-model="form.storageStandards" style="width: 71%"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="产品说明：">
                <el-input v-model="form.productDesc" type="textarea"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <div class="table-list" style="margin-bottom: 5px;height: 330px">
          <el-table
            v-loading="listLoading"
            :data="selectedList"
            element-loading-text="Loading"
            border
            fit
            highlight-current-row
            @current-change="handleCurrentChange"
          >
            <el-table-column
              type="index"
              width="50"
              label="序号"
            />
            <el-table-column label="原料编码" show-overflow-tooltip>
              <template slot-scope="scope">
                {{ scope.row.materialCode }}
              </template>
            </el-table-column>
            <el-table-column label="化学名称" show-overflow-tooltip>
              <template slot-scope="scope">
                {{ scope.row.chemistryName }}
              </template>
            </el-table-column>
            <el-table-column label="英文名称" show-overflow-tooltip>
              <template slot-scope="scope">
                {{ scope.row.englishName }}
              </template>
            </el-table-column>
            <el-table-column label="中文别名" show-overflow-tooltip>
              <template slot-scope="scope">
                {{ scope.row.shortName }}
              </template>
            </el-table-column>
            <el-table-column label="原料类别" show-overflow-tooltip>
              <template slot-scope="scope">
                {{ scope.row.materialTypeName }}
              </template>
            </el-table-column>
            <el-table-column label="理化性质" show-overflow-tooltip>
              <template slot-scope="scope">
                {{ scope.row.physicochemicalProperties }}
              </template>
            </el-table-column>
            <el-table-column label="健康危害" show-overflow-tooltip>
              <template slot-scope="scope">
                {{ scope.row.healthHazards }}
              </template>
            </el-table-column>
            <el-table-column label="危险特性" show-overflow-tooltip>
              <template slot-scope="scope">
                {{ scope.row.dangerousCharacteristic }}
              </template>
            </el-table-column>
            <el-table-column label="CAS编号" show-overflow-tooltip>
              <template slot-scope="scope">
                {{ scope.row.casCode }}
              </template>
            </el-table-column>
            <el-table-column label="是否危化品" show-overflow-tooltip>
              <template slot-scope="scope">
                {{ scope.row.isDangerName }}
              </template>
            </el-table-column>

          </el-table>
        </div>
        <el-pagination
          style="position: relative"
          background
          class="position-pagination"
          layout="total, sizes, prev, pager, next, jumper"
          :page-sizes="[5,10]"
          :page-size="listQuery.limit"
          :total="total"
          @size-change="changeSize1"
          @current-change="fetchPage1"
          @prev-click="fetchPrev1"
          @next-click="fetchNext1">
        </el-pagination>
      </div>
     <!-- <div class="align-center">
        <el-button type="danger" class="set-common-btn blue-button" @click.native="productDetailVisible = false">返回
        </el-button>
      </div>-->
    </el-dialog>
  </div>
</template>

<script src="./dsiProductInfo.js"></script>
<style lang="scss" scoped>
  > > > .added-material {
    .el-dialog__body {
      .table-list {
        margin: 20px auto;
      }
    }
  }
</style>


