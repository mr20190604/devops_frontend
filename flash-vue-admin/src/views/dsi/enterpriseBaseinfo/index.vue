<template>
    <div class="app-container">
        <div class="block">
          <el-form  label-width="120px" :inline="true" >
              <el-form-item  label="企业名称">
                <el-input v-model="listQuery.enterpriseName"  placeholder="请输入企业名称"></el-input>
              </el-form-item>

              <el-form-item  label="所在地区">
                <district v-model="listQuery.districtCode"  placeholder="请选择所在地区"/>
              </el-form-item>

              <el-form-item  label="经营状态">
                <el-select   v-model="listQuery.managementSituation" placeholder="请选择经营状态">
                  <el-option
                    v-for="item in management_status"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item  label="地址">
                <el-input v-model="listQuery.enterpriseAddress"  placeholder="请输入所在地址"></el-input>
              </el-form-item>

          <br>
              <el-form-item  label="法人">
                <el-input v-model="listQuery.legalPerson"  placeholder="请输入法人名称"></el-input>
              </el-form-item>

              <el-form-item  label="风险等级">
                <el-select v-model="listQuery.riskLevel"  placeholder="请选择风险等级">
                  <el-option
                    v-for="item in risk_level"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            <el-form-item style="float: right;margin-right: 100px">
              <el-button type="primary" icon="el-icon-search" @click.native="search">{{ $t('button.search') }}</el-button>
              <el-button  si icon="el-icon-refresh" @click.native="reset">{{ $t('button.reset') }}</el-button>
            </el-form-item>

          </el-form>



            <br>
            <el-row>
                <el-col :span="24">
                    <el-button type="success" size="mini"  icon="el-icon-plus" @click.native="add" v-permission="['/enterpriseBaseinfo/add']">{{ $t('button.add') }}</el-button>
                    <el-button type="danger" size="mini"  icon="el-icon-delete" @click.native="removeBatch" v-permission="['/enterpriseBaseinfo/delete']">批量删除</el-button>
                </el-col>
            </el-row>
        </div>


        <el-table  :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row
                  :row-key="row=>row.id"
                  @selection-change="handleSelectionChange"
                  @current-change="handleCurrentChange" >


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
            <el-table-column label="企业名称">
                <template slot-scope="scope" >
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
                    {{scope.row.riskLevelName}}
                </template>
            </el-table-column>
          <el-table-column label="行政区划">
            <template slot-scope="scope">
              {{scope.row.districtName}}
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

          <el-table-column label="经营状态">
            <template slot-scope="scope">
              {{scope.row.managementSituationName}}
            </template>
          </el-table-column>

            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="mini" icon="el-icon-edit" @click.native="editItem(scope.row)" v-permission="['/enterpriseBaseinfo/update']">{{ $t('button.edit') }}</el-button>
                    <el-button type="text" size="mini" icon="el-icon-delete" @click.native="removeItem(scope.row)" v-permission="['/enterpriseBaseinfo/delete']">{{ $t('button.delete') }}</el-button>
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

        <el-dialog class="el-dialog-style"
                :title="formTitle"
                :visible.sync="formVisible"
                width="70%">
          <template>
            <el-tabs  v-model="activeName" type="card" >
              <el-tab-pane label="添加企业信息" name="first" style="visibility: visible">

                <el-form ref="form" :model="form" :rules="rules" label-width="120px">
                  <el-row>

                    <el-col :span="12">
                      <el-form-item label="企业名称"  >
                        <el-input v-model="form.enterpriseName" minlength=1></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="所属行业"  >
                        <el-select v-model="form.industryId" minlength=1>
                          <el-option
                            v-for="item in industry_list"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="行政区划"  >
                        <district v-model="form.districtCode"  placeholder="请选择所在地区"/>
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
                      <el-form-item label="经营状态"  >
                        <el-select v-model="form.managementSituation" minlength=1>
                          <el-option
                            v-for="item in management_status"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>

                    <el-col :span="12">
                      <el-form-item label="从业人数"  >
                        <el-input v-model="form.employmentNo" minlength=1></el-input>
                      </el-form-item>
                    </el-col>

                    <el-col :span="12">
                      <el-form-item label="风险等级"  >
                        <el-select v-model="form.riskLevel" minlength=1>
                          <el-option
                            v-for="item in risk_level"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                          </el-option>
                        </el-select>
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
                      <el-form-item label="应急队伍"  >
                        <el-input v-model="form.emergencyTeam" minlength=1></el-input>
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
                  <el-form-item id="myself">
                    <el-button type="primary" @click="kjManager">{{ $t('button.submit') }}</el-button>
                    <el-button @click.native="formVisible = false">{{ $t('button.cancel') }}</el-button>
                  </el-form-item>

                </el-form>
              </el-tab-pane>
              <el-tab-pane label="产品信息" name="second" id="second" ref="zbsq" >
                <materialInfo></materialInfo>
              </el-tab-pane>
              <el-tab-pane label="风险单元" name="third">
                <unitInfo></unitInfo>
              </el-tab-pane>
            </el-tabs>
          </template>

        </el-dialog>
    </div>
</template>

<script src="./dsiEnterpriseBaseinfo.js"></script>


<style rel="stylesheet/scss" lang="scss" >
    @import "src/styles/commonmyself.scss";
</style>

