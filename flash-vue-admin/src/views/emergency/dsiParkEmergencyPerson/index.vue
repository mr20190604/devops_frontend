<template>
    <div class="app-container">
        <div class="block">
          <el-form label-width="120px" :inline="true">
            <el-form-item label="人员名称">
              <el-input v-model="listQuery.name" size="mini" placeholder="请输入人员名称"></el-input>
            </el-form-item>
            <el-form-item label="所在行政区">
              <el-input v-model="listQuery.districtCode" size="mini" placeholder="请选择所在行政区"></el-input>
            </el-form-item>
            <el-form-item label="所属企业">
              <el-input v-model="listQuery.enterpriseId" size="mini" placeholder="请输入所属企业"></el-input>
            </el-form-item>
            <el-form-item label="是否专家">
              <el-select v-model="listQuery.isExpert" size="mini" placeholder="是否专家">
                <el-option
                  v-for="item in isExpert"
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
                    <el-button type="success" size="mini"  icon="el-icon-plus" @click.native="add" v-permission="['/park/emergency/person/add']">{{ $t('button.add') }}</el-button>
                    <el-button type="primary" size="mini"  icon="el-icon-edit" @click.native="edit" v-permission="['/park/emergency/person/update']">{{ $t('button.edit') }}</el-button>
                    <el-button type="danger" size="mini"  icon="el-icon-delete" @click.native="remove" v-permission="['/park/emergency/person/delete']">{{ $t('button.delete') }}</el-button>
                </el-col>
            </el-row>
        </div>


        <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row
                  @current-change="handleCurrentChange">
            <!--<el-table-column label="编码">
                <template slot-scope="scope">
                    {{scope.row.code}}
                </template>
            </el-table-column>-->
            <el-table-column label="姓名">
                <template slot-scope="scope">
                    {{scope.row.name}}
                </template>
            </el-table-column>
            <el-table-column label="性别">
                <template slot-scope="scope">
                    {{scope.row.gender}}
                </template>
            </el-table-column>
            <el-table-column label="学历">
                <template slot-scope="scope">
                    {{scope.row.educationName}}
                </template>
            </el-table-column>
            <el-table-column label="职称">
                <template slot-scope="scope">
                    {{scope.row.professionalName}}
                </template>
            </el-table-column>
            <el-table-column label="职务">
                <template slot-scope="scope">
                    {{scope.row.postName}}
                </template>
            </el-table-column>
            <el-table-column label="专业特长">
                <template slot-scope="scope">
                    {{scope.row.majorSpecialty}}
                </template>
            </el-table-column>
            <el-table-column label="行政区划">
                <template slot-scope="scope">
                    {{scope.row.districtCode}}
                </template>
            </el-table-column>
            <el-table-column label="是否专家">
                <template slot-scope="scope">
                    {{scope.row.isExpert}}
                </template>
            </el-table-column>
            <el-table-column label="联系电话">
                <template slot-scope="scope">
                    {{scope.row.tel}}
                </template>
            </el-table-column>
            <el-table-column label="地址">
                <template slot-scope="scope">
                    {{scope.row.address}}
                </template>
            </el-table-column>
          <!--<el-table-column label="备注">
              <template slot-scope="scope">
                  {{scope.row.remark}}
              </template>
          </el-table-column>
          <el-table-column label="逻辑删除">
              <template slot-scope="scope">
                  {{scope.row.isDel}}
              </template>
          </el-table-column>-->
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="mini" icon="el-icon-edit" @click.native="editItem(scope.row)" v-permission="['/park/emergency/person/update']">{{ $t('button.edit') }}</el-button>
                    <el-button type="text" size="mini" icon="el-icon-delete" @click.native="removeItem(scope.row)" v-permission="['/park/emergency/person/delete']">{{ $t('button.delete') }}</el-button>
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
                   <!-- <el-col :span="12">
                        <el-form-item label="编码"  >
                            <el-input v-model="form.code" minlength=1></el-input>
                        </el-form-item>
                    </el-col>-->
                    <el-col :span="12">
                        <el-form-item label="姓名"  >
                            <el-input v-model="form.name" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="性别"  >
                            <el-select v-model="form.gender" minlength=1>
                              <el-option
                                v-for="item in sex"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                              </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                  <el-col :span="12">
                    <el-form-item label="是否专家"  >
                      <el-select v-model="form.isExpert" minlength=1>
                        <el-option
                        v-for="item in isExpert"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  <el-col :span="12">
                    <el-form-item label="行政区划"  >
                      <el-input v-model="form.districtCode" minlength=1></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="联系电话"  >
                      <el-input v-model="form.tel" minlength=1></el-input>
                    </el-form-item>
                  </el-col>
                    <el-col :span="12">
                        <el-form-item label="学历"  >
                            <el-input v-model="form.educationName" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="职称"  >
                            <el-input v-model="form.professionalName" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="职务"  >
                            <el-input v-model="form.postName" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="专业特长"  >
                            <el-input v-model="form.majorSpecialty" minlength=1></el-input>
                        </el-form-item>
                    </el-col>


                    </el-col>

                    <el-col :span="12">
                        <el-form-item label="地址"  >
                            <el-input v-model="form.address" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                   <!-- <el-col :span="12">
                        <el-form-item label="备注"  >
                            <el-input v-model="form.remark" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="逻辑删除"  >
                            <el-input v-model="form.isDel" minlength=1></el-input>
                        </el-form-item>
                    </el-col>-->
                </el-row>
                <el-form-item>
                    <el-button type="primary" @click="save">{{ $t('button.submit') }}</el-button>
                    <el-button @click.native="formVisible = false">{{ $t('button.cancel') }}</el-button>
                </el-form-item>

            </el-form>
        </el-dialog>
    </div>
</template>

<script src="./dsiParkEmergencyPerson.js"></script>


<style rel="stylesheet/scss" lang="scss" scoped>
    @import "src/styles/common.scss";
</style>

