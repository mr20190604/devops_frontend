<template>
    <div class="app-container">
        <div class="block">
          <el-form label-width="120px" :inline="true" size="mini">
            <el-form-item label="队伍名称">
              <el-input v-model="listQuery.name" size="mini" placeholder="请输入队伍名称"></el-input>
            </el-form-item>
              <el-form-item label="所在地区">
              <el-input v-model="listQuery.districtCode" size="mini" placeholder="请选择所在地区"></el-input>
              </el-form-item>
                <el-form-item label="负责人">
              <el-input v-model="listQuery.personContact" size="mini" placeholder="请输入负责人"></el-input>
                </el-form-item>


                  <el-form-item label="所属企业">
              <el-select v-model="listQuery.belongingUnit" size="mini" placeholder="请选择所属企业">
                  <el-option
                    v-for="item in enterprise_list"
                    :key="item.id"
                    :label="item.enterpriseName"
                    :value="item.id">
                  </el-option>
              </el-select>
                  </el-form-item>
                    <el-form-item label="地址">
              <el-input v-model="listQuery.address" size="mini" placeholder="请输入地址"></el-input>
                    </el-form-item>
          </el-form>
            <el-row  :gutter="20">
            <el-col :span="6">
              <el-button type="success" size="mini" icon="el-icon-search" @click.native="search">{{ $t('button.search') }}</el-button>
              <el-button type="primary" size="mini" icon="el-icon-refresh" @click.native="reset">{{ $t('button.reset') }}</el-button>
            </el-col>

          </el-row>
            <br>
            <el-row>
                <el-col :span="24">
                    <el-button type="success" size="mini"  icon="el-icon-plus" @click.native="add" v-permission="['/park/emergency/team/add']">{{ $t('button.add') }}</el-button>
                    <el-button type="danger" size="mini"  icon="el-icon-delete" @click.native="remove" v-permission="['/park/emergency/team/delete']">{{ $t('button.delete') }}</el-button>
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
            <el-table-column label="队伍名称">
                <template slot-scope="scope">
                    {{scope.row.name}}
                </template>
            </el-table-column>
          <el-table-column label="所属企业">
            <template slot-scope="scope">
              {{scope.row.belongingUnit}}
            </template>
          </el-table-column>
          <el-table-column label="行政区划">
            <template slot-scope="scope">
              {{scope.row.districtCode}}
            </template>
          </el-table-column>
          <el-table-column label="队伍性质">
            <template slot-scope="scope">
              {{scope.row.teamNature}}
            </template>
          </el-table-column>
            <el-table-column label="地址">
                <template slot-scope="scope">
                    {{scope.row.address}}
                </template>
            </el-table-column>
          <el-table-column label="负责人">
            <template slot-scope="scope">
              {{scope.row.personContact}}
            </template>
          </el-table-column>
          <el-table-column label="联系电话">
            <template slot-scope="scope">
              {{scope.row.personTel}}
            </template>
          </el-table-column>
            <!--<el-table-column label="经度">
                <template slot-scope="scope">
                    {{scope.row.longitude}}
                </template>
            </el-table-column>
            <el-table-column label="纬度">
                <template slot-scope="scope">
                    {{scope.row.latitude}}
                </template>
            </el-table-column>


            <el-table-column label="队伍属性">
                <template slot-scope="scope">
                    {{scope.row.teamProperties}}
                </template>
            </el-table-column>-->
            <el-table-column label="队伍人数">
                <template slot-scope="scope">
                    {{scope.row.personNumber}}
                </template>
            </el-table-column>
            <!--<el-table-column label="设备">
                <template slot-scope="scope">
                    {{scope.row.teamEquipment}}
                </template>
            </el-table-column>-->


           <!-- <el-table-column label="备注">
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
                    <el-button type="text" size="mini" icon="el-icon-edit" @click.native="editItem(scope.row)" v-permission="['/park/emergency/team/update']">{{ $t('button.edit') }}</el-button>
                    <el-button type="text" size="mini" icon="el-icon-delete" @click.native="removeItem(scope.row)" v-permission="['/park/emergency/team/delete']">{{ $t('button.delete') }}</el-button>
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
                        <el-form-item label="队伍名称"  >
                            <el-input v-model="form.name" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                  <el-col :span="12">
                    <el-form-item label="所属企业"  >
                      <el-input v-model="form.belongingUnit" minlength=1></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="负责人"  >
                      <el-input v-model="form.personContact" minlength=1></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="联系电话"  >
                      <el-input v-model="form.personTel" minlength=1></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="队伍性质"  >
                      <el-input v-model="form.teamNature" minlength=1></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="队伍人数"  >
                      <el-input v-model="form.personNumber" minlength=1></el-input>
                    </el-form-item>
                  </el-col>
                    <el-col :span="12">
                        <el-form-item label="地址"  >
                            <el-input v-model="form.address" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                  <el-col :span="12">
                    <el-form-item label="抢险设备"  >
                      <el-input v-model="form.teamEquipment" minlength=1></el-input>
                    </el-form-item>
                  </el-col>

                    <el-col :span="12">
                        <el-form-item label="经度"  >
                            <el-input v-model="form.longitude" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="纬度"  >
                            <el-input v-model="form.latitude" minlength=1></el-input>
                        </el-form-item>
                    </el-col>

                    <!--<el-col :span="12">
                        <el-form-item label="队伍属性"  >
                            <el-input v-model="form.teamProperties" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                  <el-col :span="12">
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
                  <el-button @click.native="choosePerson">选择应急人员</el-button>
                </el-form-item>
              <el-table :data="personList"
                        v-loading="personLoading"
                        element-loading-text="Loading"
                        border fit highlight-current-row
                        @current-change="handleCurrentChange">

                <el-table-column label="名称">
                  <template slot-scope="scope">
                    {{scope.row.name}}
                  </template>
                </el-table-column>
                <el-table-column label="性别">
                  <template slot-scope="scope">
                    {{scope.row.genderName}}
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
                <el-table-column label="专业特长">
                  <template slot-scope="scope">
                    {{scope.row.majorSpecialty}}
                  </template>
                </el-table-column>
                <el-table-column label="是否专家">
                  <template slot-scope="scope">
                    {{scope.row.isExpertName}}
                  </template>
                </el-table-column>

                <el-table-column label="联系方式">
                  <template slot-scope="scope">
                    {{scope.row.tel}}
                  </template>
                </el-table-column>

                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button type="text" size="mini" icon="el-icon-edit" @click.native="editItem(scope.row)" >查看</el-button>
                    <el-button type="text" size="mini" icon="el-icon-delete" @click.native="removePersonItem(scope.row)" >{{ $t('button.delete') }}</el-button>
                  </template>
                </el-table-column>
              </el-table>

            </el-form>
        </el-dialog>
      <el-dialog
        :title="personTitle"
        :visible.sync="personVisible"
        width="70%"
      >
        <el-form ref="form" :model="personForm" :rules="rules" label-width="120px">
          <el-row>
            <el-col :span="24">
              <el-form-item label="请选择人员"  >
                <el-select v-model="personForm.ids" multiple placeholder="请选择">
                  <el-option
                    v-for="item in person_data"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>

          </el-row>
          <el-row>
            <el-form-item>
              <el-button type="primary" @click="addPerson">{{ $t('button.submit') }}</el-button>
              <el-button @click.native="personVisible = false">{{ $t('button.cancel') }}</el-button>
            </el-form-item>
          </el-row>


        </el-form>
      </el-dialog>
    </div>
</template>

<script src="./dsiParkEmergencyTeam.js"></script>


<style rel="stylesheet/scss" lang="scss" scoped>
    @import "src/styles/common.scss";
</style>

