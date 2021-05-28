<template>
    <div class="app-container">
        <div class="block">
          <el-form label-width="120px" :inline="true" >
            <el-form-item label="事故名称">
              <el-input v-model="listQuery.accidentName"  placeholder="请输事故名称"></el-input>
            </el-form-item>

            <el-form-item label="事故地点">
              <el-input v-model="listQuery.accidentAddress"  placeholder="请输事故地点"></el-input>
            </el-form-item>
            <el-form-item label="事件类型">
              <el-select v-model="listQuery.accidentType"  placeholder="请选择事件类型">
                <el-option
                  v-for="item in accident_type"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="所属行业">
              <el-select v-model="listQuery.industryId"  placeholder="请选择所属行业">
                <el-option
                  v-for="item in industry_type"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item style="float: right;margin-right: 100px">
                <el-button type="primary"  icon="el-icon-search" @click.native="search">{{ $t('button.search') }}
                </el-button>
                <el-button   icon="el-icon-refresh" @click.native="reset">{{ $t('button.reset') }}
                </el-button>
              </el-form-item>
            <br>
            <el-form-item label="事故时间">
              <el-date-picker v-model="listQuery.accidentTime"
                              type="datetimerange"
                              range-separator="至"
                              start-placeholder="开始日期"
                              end-placeholder="结束日期"
                              value-format="yyyy-MM-dd HH:mm">
              </el-date-picker>
            </el-form-item>
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

            <br>
            <el-row>
                <el-col :span="24">
                    <el-button type="success" size="mini"  icon="el-icon-plus" @click.native="add" v-permission="['/accident/case/add']">{{ $t('button.add') }}</el-button>
                    <el-button type="danger" size="mini"  icon="el-icon-delete" @click.native="removeBatch1" v-permission="['/accident/case/delete']">批量删除</el-button>
                </el-col>
            </el-row>
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
            width="50"
            label="序号"
          />
          <el-table-column label="事故名称">
                <template slot-scope="scope">
                    {{scope.row.accidentName}}
                </template>
            </el-table-column>
            <el-table-column label="事故时间">
                <template slot-scope="scope">
                    {{scope.row.accidentTime}}
                </template>
            </el-table-column>
            <el-table-column label="事故地点">
                <template slot-scope="scope">
                    {{scope.row.accidentAddress}}
                </template>
            </el-table-column>
            <el-table-column label="死亡人数">
                <template slot-scope="scope">
                    {{scope.row.deathToll}}
                </template>
            </el-table-column>
            <el-table-column label="事件类型">
                <template slot-scope="scope">
                    {{scope.row.accidentTypeName}}
                </template>
            </el-table-column>
            <!--<el-table-column label="事故描述">-->
                <!--<template slot-scope="scope">-->
                    <!--{{scope.row.accidentDesc}}-->
                <!--</template>-->
            <!--</el-table-column>-->
            <el-table-column label="所属行业">
                <template slot-scope="scope">
                    {{scope.row.industryTypeName}}
                </template>
            </el-table-column>
           <!-- <el-table-column label="逻辑删除">
                <template slot-scope="scope">
                    {{scope.row.isDel}}
                </template>
            </el-table-column>-->
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="mini" icon="el-icon-edit" @click.native="editItem(scope.row)" v-permission="['/accident/case/update']">{{ $t('button.edit') }}</el-button>
                    <el-button type="text" size="mini" icon="el-icon-delete" @click.native="removeItem(scope.row)" v-permission="['/accident/case/delete']">{{ $t('button.delete') }}</el-button>
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
                        <el-form-item label="事故名称"  >
                            <el-input v-model="form.accidentName" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="事故时间"  >
                            <el-date-picker v-model="form.accidentTime" class="date_picker"
                                            value-format="yyyy-MM-dd" minlength=1></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="事故地点"  >
                            <el-input v-model="form.accidentAddress" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="死亡人数"  >
                            <el-input v-model="form.deathToll" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="事件类型"  >
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
                    <el-form-item label="所属行业"  >
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
                    <el-col :span="12">
                        <el-form-item label="事故描述"  >
                            <el-input type="textarea" v-model="form.accidentDesc" minlength=1></el-input>
                        </el-form-item>
                    </el-col>

                   <!-- <el-col :span="12">
                        <el-form-item label="逻辑删除"  >
                            <el-input v-model="form.isDel" minlength=1></el-input>
                        </el-form-item>
                    </el-col>-->
                </el-row>
                <el-form-item id="myself">
                    <el-button type="primary" @click="save">{{ $t('button.submit') }}</el-button>
                    <el-button @click.native="formVisible = false">{{ $t('button.cancel') }}</el-button>
                </el-form-item>

            </el-form>
        </el-dialog>
    </div>
</template>

<script src="./dsaAccidentCase.js"></script>


<style rel="stylesheet/scss" lang="scss"  >
    @import "src/styles/commonmyself.scss";
</style>

