<template>
  <div class="app-container">

    <div class="table-list">

    <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row
              :row-key="row=>row.id"
              @selection-change="handleSelectionChange"
              @current-change="handleCurrentChange"
              ref="unitTable" @row-click="toggleSelection">

      <el-table-column
        type="index"
        width="50"
        label="序号"
      >
      </el-table-column>
      <el-table-column label="风险单元名称">
        <template slot-scope="scope">
          {{scope.row.riskName}}
        </template>
      </el-table-column>
      <el-table-column label="风险类型">
        <template slot-scope="scope">
          {{scope.row.riskTypeName}}
        </template>
      </el-table-column>
      <el-table-column label="负责人">
        <template slot-scope="scope">
          {{scope.row.headPerson}}
        </template>
      </el-table-column>

      <el-table-column label="风险物质" width="500px">
        <template slot-scope="scope">
          {{scope.row.detail}}
        </template>
      </el-table-column>

    </el-table>
    </div>
    <div style="position:absolute;bottom: 30px;width: 100%">
    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="[5,10, 20, 50, 100,500]"
      :page-size="listQuery.limit"
      :total="total"
      @size-change="changeSize"
      @current-change="fetchPage"
      @prev-click="fetchPrev"
      @next-click="fetchNext">
    </el-pagination>

</div>
    <el-dialog
      :title="formTitle"
      :visible.sync="formVisible"
      :modal="false"
      width="75%">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px" style="height: 600px">
        <el-row style="margin-left: 200px;margin-top: 50px">

          <el-col :span="12">
            <el-form-item label="风险单元名称：">
              <el-input v-model="form.riskName" minlength=1></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="重大危险源：">
              <el-select v-model="form.isDangerSource" minlength=1 placeholder="请选择是否">
                <el-option
                  v-for="item in isDangerSource"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="风险类型：">
              <el-select v-model="form.riskType" minlength=1>
                <el-option
                  v-for="item in risk_type"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="负责人：">
              <el-input v-model="form.headPerson" minlength=1></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话：">
              <el-input v-model="form.personTel" minlength=1 oninput="value=value.replace(/[^0-9.]/g,'')"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin-left: 200px">
        <el-form-item

          v-for="(rec, index) in form.details"
          :label="'风险物质' + (index+1)"
          :key="index"
          :prop="'details.' + index + '.criticalQuantity'"
          :rules="{                required: false, message: '不能为空', trigger: 'blur'                }"
        >
          <el-col :span="5">
            <el-form-item label="风险物质">
              <el-input class="el-input-style" v-model="rec.materialId"  minlength=1 @input="onInput()" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="现存量" >
              <el-input class="el-input-style" v-model="rec.currentStock"  @input="onInput()" minlength=1 oninput="value=value.replace(/[^0-9.]/g,'')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="临界量" >
              <el-input class="el-input-style" v-model="rec.criticalQuantity "  @input="onInput()" oninput="value=value.replace(/[^0-9.]/g,'')" minlength=1  ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4" style="margin-left: 100px">&nbsp;
            <el-button @click.prevent="removeDetail(rec)" type="danger" icon="el-icon-delete"  >{{ $t('button.delete') }}
            </el-button>
          </el-col>

        </el-form-item>
        </el-row>
        <el-form-item id="myself">
          <el-button type="primary" @click="save">{{ $t('button.submit') }}</el-button>
          <el-button @click="addDetail">新增风险物质</el-button>
          <el-button @click.native="formVisible = false">{{ $t('button.cancel') }}</el-button>
        </el-form-item>

      </el-form>
    </el-dialog>


  </div>
</template>

<script  src="./unitInfo.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/commonmyself.scss";
</style>
