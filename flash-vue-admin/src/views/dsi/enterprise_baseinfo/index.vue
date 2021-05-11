<template>
    <div class="app-container">
        <div class="block">
            <el-row  :gutter="20">
                <el-col :span="4">
                    <el-input v-model="listQuery.id" size="mini" placeholder="请输入id"></el-input>
                </el-col>
                <el-col :span="6">
                    <el-button type="success" size="mini" icon="el-icon-search" @click.native="search">{{ $t('button.search') }}</el-button>
                    <el-button type="primary" size="mini" icon="el-icon-refresh" @click.native="reset">{{ $t('button.reset') }}</el-button>
                </el-col>
            </el-row>
            <br>
            <el-row>
                <el-col :span="24">
                    <el-button type="success" size="mini"  icon="el-icon-plus" @click.native="add" v-permission="['/enterprise_baseinfo/add']">{{ $t('button.add') }}</el-button>
                    <el-button type="primary" size="mini"  icon="el-icon-edit" @click.native="edit" v-permission="['/enterprise_baseinfo/update']">{{ $t('button.edit') }}</el-button>
                    <el-button type="danger" size="mini"  icon="el-icon-delete" @click.native="remove" v-permission="['/enterprise_baseinfo/delete']">{{ $t('button.delete') }}</el-button>
                </el-col>
            </el-row>
        </div>


        <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row
                  @current-change="handleCurrentChange">

            <el-table-column label="企业名称">
                <template slot-scope="scope">
                    {{scope.row.enterpriseName}}
                </template>
            </el-table-column>
          <el-table-column label="注册登记号">
            <template slot-scope="scope">
              {{scope.row.registerCode}}
            </template>
          </el-table-column>

          <el-table-column label="单位性质">
            <template slot-scope="scope">
              {{scope.row.enterpriseNature}}
            </template>
          </el-table-column>
            <el-table-column label="地址">
                <template slot-scope="scope">
                    {{scope.row.enterpriseAddress}}
                </template>
            </el-table-column>
            <el-table-column label="风险等级">
                <template slot-scope="scope">
                    {{scope.row.riskLevel}}
                </template>
            </el-table-column>
          <el-table-column label="行政区划">
            <template slot-scope="scope">
              {{scope.row.districtCode}}
            </template>
          </el-table-column>
            <el-table-column label="法人">
                <template slot-scope="scope">
                    {{scope.row.legalPerson}}
                </template>
            </el-table-column>

            <el-table-column label="环保安全负责人">
                <template slot-scope="scope">
                    {{scope.row.envSafeLeader}}
                </template>
            </el-table-column>

          <el-table-column label="负责人联系方式">
          <template slot-scope="scope">
            {{scope.row.envSafeLeader}}
          </template>
          </el-table-column>

          <el-table-column label="经营情况">
            <template slot-scope="scope">
              {{scope.row.managementSituation}}
            </template>
          </el-table-column>

            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="mini" icon="el-icon-edit" @click.native="editItem(scope.row)" v-permission="['/enterprise_baseinfo/update']">{{ $t('button.edit') }}</el-button>
                    <el-button type="text" size="mini" icon="el-icon-delete" @click.native="removeItem(scope.row)" v-permission="['/enterprise_baseinfo/delete']">{{ $t('button.delete') }}</el-button>
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
                        <el-form-item label="企业名称"  >
                            <el-input v-model="form.enterpriseName" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                  <el-col :span="12">
                    <el-form-item label="所属行业（参见字典）"  >
                      <el-input v-model="form.industryId" minlength=1></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="行政区划"  >
                      <el-input v-model="form.districtCode" minlength=1></el-input>
                    </el-form-item>
                  </el-col>

                  <el-col :span="12">
                    <el-form-item label="单位性质"  >
                      <el-input v-model="form.enterpriseNature" minlength=1></el-input>
                    </el-form-item>
                  </el-col>
                    <el-col :span="12">
                        <el-form-item label="企业地址"  >
                            <el-input v-model="form.enterpriseAddress" minlength=1></el-input>
                        </el-form-item>
                    </el-col>

                  <el-col :span="12">
                    <el-form-item label="经营情况"  >
                      <el-input v-model="form.managementSituation" minlength=1></el-input>
                    </el-form-item>
                  </el-col>

                  <el-col :span="12">
                    <el-form-item label="从业人数"  >
                      <el-input v-model="form.employmentNo" minlength=1></el-input>
                    </el-form-item>
                  </el-col>

                    <el-col :span="12">
                        <el-form-item label="风险等级"  >
                            <el-input v-model="form.riskLevel" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="法人"  >
                            <el-input v-model="form.legalPerson" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="注册登记号"  >
                            <el-input v-model="form.registerCode" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="环保安全负责人"  >
                            <el-input v-model="form.envSafeLeader" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="应急人员"  >
                            <el-input v-model="form.emergencyWorker" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="应急队伍"  >
                            <el-input v-model="form.emergencyTeam" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="是否有重大危险源"  >
                            <el-input v-model="form.isDangerSource" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="外援单位"  >
                            <el-input v-model="form.foreignUnit" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="企业电话"  >
                            <el-input v-model="form.enterpriseOtel" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="企业传真"  >
                            <el-input v-model="form.enterpriseFax" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="企业应急电话"  >
                            <el-input v-model="form.enterpriseEmergencyTel" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="企业邮箱"  >
                            <el-input v-model="form.enterpriseEmail" minlength=1></el-input>
                        </el-form-item>
                    </el-col>

                </el-row>
                <el-form-item>
                    <el-button type="primary" @click="save">{{ $t('button.submit') }}</el-button>
                    <el-button @click.native="formVisible = false">{{ $t('button.cancel') }}</el-button>
                </el-form-item>

            </el-form>
        </el-dialog>
    </div>
</template>

<script src="./dsiEnterpriseBaseinfo.js"></script>


<style rel="stylesheet/scss" lang="scss" scoped>
    @import "src/styles/common.scss";
</style>

