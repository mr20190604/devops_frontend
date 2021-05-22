<template>
  <div class="app-container">
    <div class="block">
      <el-form label-width="120px" :inline="true" >
        <el-form-item label="风险名称">
          <el-input v-model="listQuery.riskName"  placeholder="请输风险名称"></el-input>
        </el-form-item>

        <el-form-item label="风险类型">
          <el-select v-model="listQuery.riskType"  placeholder="请选择风险类型">
            <el-option
              v-for="item in risk_type"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>


      <el-form-item   style="float: right;margin-right: 100px">
          <el-button type="primary" icon="el-icon-search" @click.native="search">{{ $t('button.search') }}
          </el-button>
          <el-button  icon="el-icon-refresh" @click.native="reset">{{ $t('button.reset') }}
          </el-button>
      </el-form-item>
      </el-form>
      <br>
      <el-row>
        <el-col :span="24">
          <el-button type="success" size="mini" icon="el-icon-plus" @click.native="add"
                     v-permission="['/riskUnit/add']">{{ $t('button.add') }}
          </el-button>

          <el-button type="danger"  size="mini" icon="el-icon-delete" @click.native="remove"
                     v-permission="['/riskUnit/delete']">批量删除
          </el-button>
        </el-col>
      </el-row>
    </div>


    <el-table :ref="enterpriseRiskUnitTable" :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row
              @current-change="handleCurrentChange">
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

      <el-table-column label="风险物质">
        <template slot-scope="scope">
          {{scope.row.detail}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="mini" icon="el-icon-edit" @click.native="editItem(scope.row)"
                     v-permission="['/riskUnit/edit']">{{ $t('button.edit') }}
          </el-button>
          <el-button type="text"  size="mini" icon="el-icon-delete" @click.native="removeItem(scope.row)"
                     v-permission="['/riskUnit/delete']">{{ $t('button.delete') }}
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
      @next-click="fetchNext">
    </el-pagination>




    <el-dialog
      :title="formTitle"
      :visible.sync="formVisible"
      width="60%">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row>

          <el-col :span="12">
            <el-form-item label="风险单元名称">
              <el-input v-model="form.riskName" minlength=1></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否重大危险源">
              <el-select v-model="form.isDangerSource" minlength=1>
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
            <el-form-item label="风险类型">
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
            <el-form-item label="负责人">
              <el-input v-model="form.headPerson" minlength=1></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话">
              <el-input v-model="form.personTel" minlength=1></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item
          v-for="(rec, index) in form.details"
          :label="'风险物质' + (index+1)"
          :key="rec.headPerson"
          :prop="'details.' + index + '.value'"
          :rules="{                required: false, message: '不能为空', trigger: 'blur'                }"
        >
          <el-col :span="5">
            <el-form-item label="风险物质">
              <el-input class="el-input-style" v-model="rec.materialId" minlength=1></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="现存量">
              <el-input class="el-input-style" v-model="rec.currentStock" minlength=1></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="临界量">
              <el-input class="el-input-style" v-model="rec.criticalQuantity" minlength=1></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4" style="margin-left: 100px">&nbsp;
            <el-button @click.prevent="removeDetail(rec)" type="danger" icon="el-icon-delete"  >{{ $t('button.delete') }}
            </el-button>
          </el-col>

        </el-form-item>

        <el-form-item id="myself">
          <el-button type="primary" @click="save">{{ $t('button.submit') }}</el-button>
          <el-button @click="addDetail">新增风险物质</el-button>
          <el-button @click.native="formVisible = false">{{ $t('button.cancel') }}</el-button>
        </el-form-item>

      </el-form>
    </el-dialog>


  </div>
</template>

<script src="./dsiEnterpriseRiskUnit.js"></script>


<style rel="stylesheet/scss" lang="scss" >
  @import "src/styles/commonmyself.scss";
</style>

