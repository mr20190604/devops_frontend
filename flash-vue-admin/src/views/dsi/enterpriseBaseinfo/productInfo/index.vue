<template>
  <div class="app-container">
    <div class="table-list">

      <el-table
        ref="productTable"
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        border
        :row-key="row=>row.id"
        height="331px"
        @current-change="handleCurrentChange"
        @selection-change="handleSelectionChange"
        @row-click="toggleSelection"
      >

        <el-table-column
          type="index"
          width="50"
          label="序号"
          align="center"
        />
        <el-table-column label="产品名称" show-overflow-tooltip width="200px" align="center">
          <template slot-scope="scope">
            <span class="updateText" @click="viewProductDetail(scope.row)">{{ scope.row.productName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="产品型号" show-overflow-tooltip width="180px" align="center">
          <template slot-scope="scope">
            {{ scope.row.productModel }}
          </template>
        </el-table-column>
        <el-table-column label="易燃易爆" show-overflow-tooltip align="center">
          <template slot-scope="scope">
            {{ scope.row.isInflammableExplosiveName }}
          </template>
        </el-table-column>
        <el-table-column label="腐蚀性" show-overflow-tooltip align="center">
          <template slot-scope="scope">
            {{ scope.row.isCorrosiveName }}
          </template>
        </el-table-column>
        <el-table-column label="毒性" show-overflow-tooltip align="center">
          <template slot-scope="scope">
            {{ scope.row.isPoisonHarmName }}
          </template>
        </el-table-column>
        <el-table-column label="放射性" show-overflow-tooltip align="center">
          <template slot-scope="scope">
            {{ scope.row.isRadioactivityName }}
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

    </div>
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
                <el-input v-model="form.productName" minlength="1" placeholder="请输入产品名称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="产品型号：">
                <el-input v-model="form.productModel" minlength="1" placeholder="请输入产品型号" />
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
              <el-form-item label="毒性：">
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
              <el-form-item label="放射性：">
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
              <el-form-item label="存储标准：">
                <el-input v-model="form.storageStandards" type="textarea" style="width: 71%" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="产品说明：">
                <el-input v-model="form.productDesc" type="textarea" style="width: 71%"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <div class="table-list" style="height: 300px">
          <el-table
            v-loading="listLoading"
            :data="selectedList"
            height="250px"
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
            <el-table-column label="原料编号" show-overflow-tooltip>
              <template slot-scope="scope">
                {{ scope.row.materialCode }}
              </template>
            </el-table-column>
            <el-table-column label="化学名" show-overflow-tooltip>
              <template slot-scope="scope">
                {{ scope.row.chemistryName }}
              </template>
            </el-table-column>
            <el-table-column label="英文名" show-overflow-tooltip>
              <template slot-scope="scope">
                {{ scope.row.englishName }}
              </template>
            </el-table-column>
            <el-table-column label="中文名" show-overflow-tooltip>
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
            <el-table-column label="是否危化品" show-overflow-tooltip width="100px">
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
      <!--<div class="align-center">
        <el-button type="danger" class="set-common-btn blue-button" @click.native="productDetailVisible = false">返回</el-button>
      </div>-->
    </el-dialog>
  </div>
</template>

<script src="./dsiProductInfo.js"></script>
<style lang="scss" scoped>
  .common-dialog-style.height750 .el-dialog {
    height: 750px;
  }
</style>

