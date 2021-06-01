<template>
    <div class="app-container">
        <div class="block">
          <el-form label-width="76px">
            <el-row>
              <el-col :span="6">
                <el-form-item  label="企业名称：">
                  <el-input v-model="listQuery.enterpriseName"  placeholder="请输入企业名称"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item  label="所在地区：">
                  <district v-model="listQuery.districtCode"  placeholder="请选择所在地区"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                 <el-form-item  label="经营状态：">
                  <el-select   v-model="listQuery.managementSituation" placeholder="请选择经营状态">
                    <el-option
                      v-for="item in management_status"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                 <el-form-item  label="地址：">
                  <el-input v-model="listQuery.enterpriseAddress"  placeholder="请输入所在地址"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="marginZero">
              <el-col :span="6">
                <el-form-item  label="风险等级：">
                  <el-select v-model="listQuery.riskLevel"  placeholder="请选择风险等级">
                    <el-option
                      v-for="item in risk_level"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item  label="法人：">
                  <el-input v-model="listQuery.legalPerson"  placeholder="请输入法人名称"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12" class="textAlignRight">
                <el-form-item>
                  <el-button type="primary" class="set-common-btn blue-button" @click.native="search">{{ $t('button.search') }}</el-button>
                  <el-button  @click.native="reset" class="set-common-btn blank-blue-button">{{ $t('button.reset') }}</el-button>
                </el-form-item>
              </el-col>
            </el-row>
            <!-- <el-row class="marginZero textAlignRight">
               <el-col>
                <el-form-item>
                  <el-button type="primary" class="set-common-btn blue-button" @click.native="search">{{ $t('button.search') }}</el-button>
                  <el-button  @click.native="reset" class="set-common-btn blank-blue-button">{{ $t('button.reset') }}</el-button>
                </el-form-item>
              </el-col>
            </el-row> -->
          </el-form>
       </div>
    <div class="table-list">
      <div class="btnLists">
          <el-button
            type="primary"   
            class="set-common-btn blue-button"
            @click.native="add"
            v-permission="['/enterpriseBaseinfo/add']"
            >{{ $t("button.add") }}</el-button
          >
          <!-- <el-button
            type="primary"
            class="set-common-btn blank-blue-button"
            size="mini"
            @click="viewMaterial"
            >查看企业信息</el-button
          > -->
          <el-button
            size="mini"
            class="set-common-btn blank-blue-button"
            @click.native="removeBatch"
            v-permission="['/enterpriseBaseinfo/delete']"
            >批量删除</el-button>
      </div>
      <el-table
        ref="enterpriseTable"
        :data="list"
        v-loading="listLoading"
        element-loading-text="Loading"
        border
        :row-key="(row) => row.id"
        @row-click="toggleSelection"
        @selection-change="handleSelectionChange"
        @current-change="handleCurrentChange"
      >
        <el-table-column type="selection" width="55" :reserve-selection="true">
        </el-table-column>
        <el-table-column type="index" width="55" label="序号" align="center">
        </el-table-column>
        <el-table-column label="企业名称" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="updateText" @click="viewMaterial(scope.row)">{{ scope.row.enterpriseName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="注册登记号" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.registerCode }}
          </template>
        </el-table-column>

        <el-table-column label="单位性质" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.enterpriseNature }}
          </template>
        </el-table-column>
        <el-table-column label="地址" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.enterpriseAddress }}
          </template>
        </el-table-column>
        <el-table-column label="风险等级" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.riskLevelName }}
          </template>
        </el-table-column>
        <el-table-column label="行政区划" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.districtName }}
          </template>
        </el-table-column>
        <el-table-column label="法人" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.legalPerson }}
          </template>
        </el-table-column>

        <el-table-column label="环保安全负责人" show-overflow-tooltip width="140">
          <template slot-scope="scope">
            {{ scope.row.envSafeLeader }}
          </template>
        </el-table-column>

        <el-table-column label="负责人联系方式" show-overflow-tooltip width="140">
          <template slot-scope="scope">
            {{ scope.row.envSafeLeader }}
          </template>
        </el-table-column>

        <el-table-column label="经营状态" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.managementSituationName }}
          </template>
        </el-table-column>

            <el-table-column label="操作" align="center" width="170">
                <template slot-scope="scope">
                    <el-button type="text" size="mini" icon="el-icon-edit" @click.native="editItem(scope.row)" v-permission="['/enterpriseBaseinfo/update']">{{ $t('button.edit') }}</el-button>
                    <el-button type="text" size="mini" icon="el-icon-delete" @click.native="removeItem(scope.row)" v-permission="['/enterpriseBaseinfo/delete']">{{ $t('button.delete') }}</el-button>
                </template>
            </el-table-column>
      </el-table>
   
        <el-pagination
            background
            class="position-pagination"
            layout="total, sizes, prev, pager, next, jumper"
            :page-sizes="[10, 20, 50, 100,500]"
            :page-size="listQuery.limit"
            :total="total"
            @size-change="changeSize"
            @current-change="fetchPage"
            @prev-click="fetchPrev"
            @next-click="fetchNext">
        </el-pagination>
     </div>
    <!-- 添加 -->
      <el-dialog class="el-dialog-style"
                :title="formTitle"
                :visible.sync="formVisible"
                width="75%"
                 @close="closeDialog">
          <template v-if="formVisible">
            <el-tabs  v-model="activeName" type="card" :before-leave="handleClick"  style="height: 600px">
              <el-tab-pane label="添加企业信息" name="first" style="visibility: visible">
                <el-form ref="form" :model="form" :rules="rules" label-width="120px" >
                  <el-row style="margin-left: 200px">

                    <el-col :span="12">
                      <el-form-item label="企业名称："  >
                        <el-input v-model="form.enterpriseName" minlength=1></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="所属行业："  >
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
                      <el-form-item label="行政区划："  >
                        <district v-model="form.districtCode"  placeholder="请选择所在地区"/>
                      </el-form-item>
                    </el-col>

                    <el-col :span="12">
                      <el-form-item label="单位性质："  >
                        <el-input v-model="form.enterpriseNature" minlength=1></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="企业地址："  >
                        <el-input v-model="form.enterpriseAddress" minlength=1></el-input>
                      </el-form-item>
                    </el-col>

                    <el-col :span="12">
                      <el-form-item label="经营状态："  >
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
                      <el-form-item label="从业人数："  >
                        <el-input v-model="form.employmentNo" minlength=1></el-input>
                      </el-form-item>
                    </el-col>

                    <el-col :span="12">
                      <el-form-item label="风险等级："  >
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
                      <el-form-item label="法人："  >
                        <el-input v-model="form.legalPerson" minlength=1></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="注册登记号："  >
                        <el-input v-model="form.registerCode" minlength=1></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="安全负责人："  >
                        <el-input v-model="form.envSafeLeader" minlength=1></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="应急队伍："  >
                        <el-input v-model="form.emergencyTeam" minlength=1></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="企业电话："  >
                        <el-input v-model="form.enterpriseOtel" minlength=1></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="企业传真："  >
                        <el-input v-model="form.enterpriseFax" minlength=1></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="企业应急电话："  >
                        <el-input v-model="form.enterpriseEmergencyTel" minlength=1></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="企业邮箱："  >
                        <el-input v-model="form.enterpriseEmail" minlength=1></el-input>
                      </el-form-item>
                    </el-col>

                  </el-row>
                  <el-form-item id="myself">
                    <el-button type="primary" @click="save">{{ $t('button.submit') }}</el-button>
                    <el-button @click="closeDialog">{{ $t('button.cancel') }}</el-button>
                  </el-form-item>

                </el-form>
              </el-tab-pane>
              <el-tab-pane label="添加产品信息" name="second" id="second"  style="height: 550px">
                <productInfo :enterpriseId="enterpriseId" @closeDialog="closeDialog"></productInfo>
              </el-tab-pane>
              <el-tab-pane  label="添加风险单元" name="third"  style="height: 550px">
                <unitInfo :enterpriseId="enterpriseId" @closeDialog="closeDialog"></unitInfo>
              </el-tab-pane>
            </el-tabs>
          </template>

        </el-dialog>
        <!-- 详情 -->
      <el-dialog class="el-dialog-style"
                 :title="formTitle"
                 :visible.sync="enterpriseVisible"
                 width="70%">
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
              <el-form-item label="安全负责人"  >
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
          <div style="text-align: center">
            <el-button type="primary" @click="save">{{ $t('button.submit') }}</el-button>
            <el-button @click="closeDialog">关闭</el-button>
          </div>

        </el-form>
      </el-dialog>
    </div>
</template>

<script src="./dsiEnterpriseBaseinfo.js"></script>


<style rel="stylesheet/scss" lang="scss" >
    @import "src/styles/commonmyself.scss";
</style>

