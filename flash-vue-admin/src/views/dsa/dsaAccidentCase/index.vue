<template>
    <div class="app-container">
        <div class="block">
          <el-form>
            <el-row class="hasmarginBottom">
              <el-col :span="5">
                <el-form-item label="事故名称：">
                  <el-input v-model="listQuery.accidentName"  placeholder="请输事故名称"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="事故地点：">
                  <el-input v-model="listQuery.accidentAddress"  placeholder="请输事故地点"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="事件类型：">
                  <el-select v-model="listQuery.accidentType"  placeholder="请选择事件类型">
                    <el-option
                      v-for="item in accident_type"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="所属行业：">
                  <el-select v-model="listQuery.industryId"  placeholder="请选择所属行业">
                    <el-option
                      v-for="item in industry_type"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                  <el-form-item label="事故时间：">
                    <el-date-picker 
                        v-model="listQuery.accidentTime"
                        size="mini"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd"
                       >
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="15">
                    <el-form-item>
                        <el-button type="primary" class="set-common-btn blue-button" @click.native="search">{{ $t('button.search') }}
                        </el-button>
                        <el-button class="set-common-btn blank-blue-button" @click.native="reset">{{ $t('button.reset') }}
                        </el-button>
                      </el-form-item>
                </el-col>
            </el-row>
            <!--<el-form-item label="死亡人数">
              <el-select v-model="listQuery.isValid"  placeholder="请输入死亡人数">
                <el-option
                  v-for="item in timeliness"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>-->

          </el-form>
        </div>

 <div class="table-list">
      <div class="btnLists">
          <el-button type="primary" class="set-common-btn blue-button" @click.native="add" v-permission="['/accident/case/add']">{{ $t("button.add") }}</el-button >
          <el-button size="mini" class="set-common-btn blank-blue-button" @click.native="removeBatch1" v-permission="['/accident/case/delete']">批量删除</el-button>
      </div>
        <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" border
                  :row-key="row=>row.id"
                  @current-change="handleCurrentChange"
                  @selection-change="handleSelectionChange"
                  @row-click="toggleSelection"
                  ref="accidentTable"
        >
          <el-table-column
            type="selection"
            width="55"
            :reserve-selection="true"
          />
          <el-table-column
            type="index"
            width="55"
            label="序号"
          />
          <el-table-column label="事故名称" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span class="updateText" @click="viewAccident(scope.row)">{{ scope.row.accidentName }}</span>
                </template>
            </el-table-column>
            <el-table-column label="事故时间" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{scope.row.accidentTime}}
                </template>
            </el-table-column>
            <el-table-column label="事故地点" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{scope.row.accidentAddress}}
                </template>
            </el-table-column>
            <el-table-column label="死亡人数" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{scope.row.deathToll}}
                </template>
            </el-table-column>
            <el-table-column label="事件类型" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{scope.row.accidentTypeName}}
                </template>
            </el-table-column>
            <!--<el-table-column label="事故描述">-->
                <!--<template slot-scope="scope">-->
                    <!--{{scope.row.accidentDesc}}-->
                <!--</template>-->
            <!--</el-table-column>-->
            <el-table-column label="所属行业" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{scope.row.industryTypeName}}
                </template>
            </el-table-column>
           <!-- <el-table-column label="逻辑删除">
                <template slot-scope="scope">
                    {{scope.row.isDel}}
                </template>
            </el-table-column>-->
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button type="text" size="mini" icon="el-icon-edit" @click.native="editItem(scope.row)" v-permission="['/accident/case/update']">{{ $t('button.edit') }}</el-button>
                    <el-button type="text" size="mini" icon="el-icon-delete" @click.native="removeItem(scope.row)" v-permission="['/accident/case/delete']">{{ $t('button.delete') }}</el-button>
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
 <!-- 添加事故案例库弹框 -->
        <el-dialog
        class="el-dialog-style common-dialog-style"
                :title="formTitle"
                :visible.sync="formVisible"
                width="960px"
                @close="closeDialog">
                <div class="block">
            <el-form ref="form" :model="form" :rules="rules" label-width="80px" class="align-right has-Label-Width">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="事故名称："  >
                            <el-input v-model="form.accidentName" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="事故时间："  >
                            <el-date-picker v-model="form.accidentTime" class="date_picker"
                                            value-format="yyyy-MM-dd" minlength=1></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="事故地点："  >
                            <el-input v-model="form.accidentAddress" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="死亡人数："  >
                            <el-input v-model="form.deathToll" minlength=1 oninput="value=value.replace(/[^0-9.]/g,'')"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="事件类型："  >
                            <el-select v-model="form.accidentType" minlength=1>
                              <el-option
                                v-for="item in accident_type"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                              </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                  <el-col :span="12">
                    <el-form-item label="所属行业："  >
                      <el-select v-model="form.industryId" minlength=1>
                        <el-option
                          v-for="item in industry_type"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  </el-row>
                  <el-row>
                    <el-col>
                        <el-form-item label="事故描述："  >
                            <el-input type="textarea" v-model="form.accidentDesc" minlength=1></el-input>
                        </el-form-item>
                    </el-col>

                   <!-- <el-col :span="12">
                        <el-form-item label="逻辑删除"  >
                            <el-input v-model="form.isDel" minlength=1></el-input>
                        </el-form-item>
                    </el-col>-->
                </el-row>
                <el-form-item id="myself" class="dialog-button-list">
                    <el-button type="primary" class="set-common-btn blue-button"  @click="save">{{ $t('button.submit') }}</el-button>
                    <el-button @click.native="formVisible=false" class="set-common-btn blank-blue-button">{{ $t('button.cancel') }}</el-button>
                </el-form-item>

            </el-form>
                </div>
        </el-dialog>
      <!--详情-->
      <el-dialog
      class="el-dialog-style common-dialog-style"
        :title="formTitle"
        :visible.sync="accidentVisible"
        width="960px"
        @close="closeDialog">
<div class="block">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px" class="align-right has-Label-Width">
          <el-row>
            <el-col :span="12">
              <el-form-item label="事故名称："  >
                <el-input v-model="form.accidentName" minlength=1 readonly="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="事故时间："  >
                <el-date-picker v-model="form.accidentTime" class="date_picker"
                                value-format="yyyy-MM-dd" minlength=1 readonly="true"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="事故地点："  >
                <el-input v-model="form.accidentAddress" minlength=1 readonly="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="死亡人数："  >
                <el-input v-model="form.deathToll" minlength=1 readonly="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="事件类型："  >
                <el-select v-model="form.accidentType" minlength=1 disabled="true">
                  <el-option
                    v-for="item in accident_type"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="所属行业："  >
                <el-select v-model="form.industryId" minlength=1 disabled="true">
                  <el-option
                    v-for="item in industry_type"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
             </el-row>
             <el-row>
            <el-col>
              <el-form-item label="事故描述："  >
                <el-input type="textarea" v-model="form.accidentDesc" minlength=1 readonly="true"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
</div>
      </el-dialog>
    </div>
</template>

<script src="./dsaAccidentCase.js"></script>


<style rel="stylesheet/scss" lang="scss"  scoped>
    @import "src/styles/commonmyself.scss";
</style>

