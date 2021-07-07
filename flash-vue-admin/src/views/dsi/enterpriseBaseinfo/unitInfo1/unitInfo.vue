<template>
  <div class="app-container">

    <div class="table-list">

      <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row
                :row-key="row=>row.id"
                height="331px"
                @selection-change="handleSelectionChange"
                @current-change="handleCurrentChange"
                ref="unitTable" @row-click="toggleSelection">

        <el-table-column
          type="index"
          width="50"
          label="序号"
          align="center"
        >
        </el-table-column>
        <el-table-column label="风险单元名称" show-overflow-tooltip align="center">
          <template slot-scope="scope">
            <span class="updateText" @click="editItem(scope.row)">{{ scope.row.riskName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="风险类型" show-overflow-tooltip align="center">
          <template slot-scope="scope">
            {{scope.row.riskTypeName}}
          </template>
        </el-table-column>
        <el-table-column label="负责人" show-overflow-tooltip align="center">
          <template slot-scope="scope">
            {{scope.row.headPerson}}
          </template>
        </el-table-column>

        <el-table-column label="风险物质" width="500px" show-overflow-tooltip align="center">
          <template slot-scope="scope">
            {{scope.row.detail}}
          </template>
        </el-table-column>

      </el-table>
    </div>
    <el-pagination
      background
      class="outer-pagenation"
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="[5,10, 20, 50, 100,500]"
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
      :modal="false"
      class="common-dialog-style height400"
      width="960px">
      <div class="block">
        <el-form ref="form" :model="form" :rules="rules" label-width="104px" class="align-right has-Label-Width">
          <el-row>

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
          <el-row style="border:1px solid #f3f5fb;padding-top:15px">
            <el-scrollbar>
              <el-form-item
                class="risk-material-item"
                v-for="(rec, index) in form.details"
                :label="'风险物质' + (index+1)+'：'"
                :key="index"
                :prop="'details.' + index + '.criticalQuantity'"
                :rules="{                required: false, message: '不能为空', trigger: 'blur'                }"
              >
                <el-col :span="4">
                  <el-form-item>
                    <el-select class="el-input-style" filterable placeholder="请选择" v-model="rec.materialId" minlength=1
                               @input="onInput()">
                      <el-option
                        v-for="item in materialList"
                        :key="item.id"
                        :label="item.shortName"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="7">
                  <el-form-item label="现存量：" label-width="80px">
                    <el-input class="el-input-style" v-model="rec.currentStock" @input="onInput()" minlength=1
                              oninput="value=value.replace(/[^0-9.]/g,'')"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="临界量：" label-width="80px" style="margin-left: 40px">
                    <el-input class="el-input-style" v-model="rec.criticalQuantity " @input="onInput()"
                              oninput="value=value.replace(/[^0-9.]/g,'')" minlength=1></el-input>
                  </el-form-item>
                </el-col>

              </el-form-item>
            </el-scrollbar>
          </el-row>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script src="./unitInfo.js"></script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .common-dialog-style {
    .operate-icon {
      height: 28px;
      line-height: 28px;
      font-size: 20px;
      color: #1a80ff;
    }

    > > > .el-dialog {
      min-height: 642px;
    }

    .el-form {
      .el-form-item {
        &.risk-material-item {
          margin-bottom: 0;

          > > > .el-form-item__content {
            .el-form-item {

              .el-form-item__label {
                width: 76px !important;
              }

              .el-form-item__content {
                .el-input {
                  width: 82px !important;

                  input {
                    width: 100% !important;
                  }
                }
              }

            }
          }
        }
      }
    }

    > > > .el-scrollbar {
      .el-scrollbar__wrap {
        max-height: 300px; // 最大高度
        overflow-x: hidden;
      }
    }
  }
</style>
