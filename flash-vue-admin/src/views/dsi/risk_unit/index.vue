<template>
    <div class="app-container">
        <div class="block">
          <el-form label-width="120px" :inline="true" size="mini">
                <el-form-item label="风险名称">
                    <el-input v-model="listQuery.riskName" size="mini" placeholder="请输风险名称"></el-input>
                </el-form-item>

            <el-form-item label="风险类型">
                <el-select v-model="listQuery.riskType" size="mini" placeholder="请选择风险类型">
                  <el-option
                    v-for="item in risk_type"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
            </el-form-item>

            </el-form>
          <el-row :gutter="24">
            <el-col :span="6">
              <el-button type="success" size="mini" icon="el-icon-search" @click.native="search">{{ $t('button.search') }}</el-button>
              <el-button type="primary" size="mini" icon="el-icon-refresh" @click.native="reset">{{ $t('button.reset') }}</el-button>
            </el-col>
          </el-row>
            <br>
            <el-row>
                <el-col :span="24">
                    <el-button type="success" size="mini"  icon="el-icon-plus" @click.native="add" v-permission="['/risk_unit/add']">{{ $t('button.add') }}</el-button>
                    <el-button type="primary" size="mini"  icon="el-icon-edit" @click.native="edit" v-permission="['/risk_unit/edit']">{{ $t('button.edit') }}</el-button>
                    <el-button type="danger" size="mini"  icon="el-icon-delete" @click.native="remove" v-permission="['/risk_unit/delete']">{{ $t('button.delete') }}</el-button>
                </el-col>
            </el-row>
        </div>


        <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row
                  @current-change="handleCurrentChange">
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
                    <el-button type="text" size="mini" icon="el-icon-edit" @click.native="editItem(scope.row)" v-permission="['/risk_unit/edit']">{{ $t('button.edit') }}</el-button>
                    <el-button type="text" size="mini" icon="el-icon-delete" @click.native="removeItem(scope.row)" v-permission="['/risk_unit/delete']">{{ $t('button.delete') }}</el-button>
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
                width="70%">
            <el-form ref="form" :model="form" :rules="rules" label-width="120px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="风险单元名称"  >
                            <el-input v-model="form.riskName" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="是否重大危险源"  >
                            <el-radio-group v-model="form.isDangerSource" minlength=1>
                              <el-radio :label="1">是</el-radio>
                              <el-radio :label="0">否</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="风险类型"  >
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
                        <el-form-item label="负责人"  >
                            <el-input v-model="form.headPerson" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="联系电话"  >
                            <el-input v-model="form.personTel" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
              <el-form-item
                v-for="(rec, index) in form.details"
                :label="'风险物质' + (index+1)"
                :key="rec.materialId"
                :prop="'details.' + index + '.value'"
                :rules="{
                required: true, message: '不能为空', trigger: 'blur'
                }"
              >
                <el-col :span="5">
                  <el-form-item label="风险物质"  >
                    <el-input v-model="rec.materialId" ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item label="现存量"  >
                    <el-input v-model="rec.currentStock" ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item label="临界量"  >
                    <el-input v-model="rec.criticalQuantity" ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="4">&nbsp;
                  <el-button @click.prevent="removeDetail(rec)" type="danger" icon="el-icon-delete" >{{ $t('button.delete')
                    }}</el-button>
                </el-col>

              </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="save">{{ $t('button.submit') }}</el-button>
                  <el-button @click="addDetail">新增</el-button>
                    <el-button @click.native="formVisible = false">{{ $t('button.cancel') }}</el-button>
                </el-form-item>

            </el-form>
        </el-dialog>



      <el-dialog
        :title="formTitle"
        :visible.sync="formVisible"
        width="70%">
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="风险单元名称"  >
                <el-input v-model="form.riskName" minlength=1></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否重大危险源"  >
                <el-radio-group v-model="form.isDangerSource" minlength=1>
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="风险类型"  >
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
              <el-form-item label="负责人"  >
                <el-input v-model="form.headPerson" minlength=1></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系电话"  >
                <el-input v-model="form.personTel" minlength=1></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item
            v-for="(rec, index) in form.details"
            :label="'风险物质' + (index+1)"
            :key="rec.headPerson"
            :prop="'details.' + index + '.value'"
            :rules="{
                required: true, message: '不能为空', trigger: 'blur'
                }"
          >
            <el-col :span="5">
              <el-form-item label="风险物质"  >
                <el-input v-model="form.headPerson" minlength=1></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="现存量"  >
                <el-input v-model="form.headPerson" minlength=1></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="临界量"  >
                <el-input v-model="form.headPerson" minlength=1></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">&nbsp;
              <el-button @click.prevent="removeDetail(rec)" type="danger" icon="el-icon-delete" >{{ $t('button.delete')
                }}</el-button>
            </el-col>

          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="save">{{ $t('button.submit') }}</el-button>
            <el-button @click="addDetail">新增风险物质</el-button>
            <el-button @click.native="formVisible = false">{{ $t('button.cancel') }}</el-button>
          </el-form-item>

        </el-form>
      </el-dialog>


    </div>
</template>

<script src="./dsiEnterpriseRiskUnit.js"></script>


<style rel="stylesheet/scss" lang="scss" scoped>
    @import "src/styles/common.scss";
</style>

