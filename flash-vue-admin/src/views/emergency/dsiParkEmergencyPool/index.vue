<template>
    <div class="app-container">
        <div class="block">
          <el-form  label-width="120px" :inline="true" >
              <el-form-item label="名称">
                <el-input v-model="listQuery.repositoriesName" placeholder="请输入资源库名称"></el-input>
              </el-form-item>

              <el-form-item label="所在地区">
                <district v-model="listQuery.districtCode" placeholder="请选择所在地区"></district>
              </el-form-item>

              <el-form-item label="负责人">
                <el-input v-model="listQuery.personName"  placeholder="请输入负责人名称"></el-input>
              </el-form-item>

              <el-form-item label="地址">
                <el-input v-model="listQuery.address"  placeholder="请输入地址"></el-input>
              </el-form-item>

              <el-form-item label="所属企业">
                <el-select v-model="listQuery.enterpriseId"  placeholder="请选择所属企业">
                  <el-option
                    v-for="item in enterprise_list"
                    :key="item.id"
                    :label="item.enterpriseName"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>

            <el-form-item style="float: right;margin-right: 100px">
              <el-button type="primary"  icon="el-icon-search" @click.native="search">{{ $t('button.search') }}</el-button>
              <el-button  icon="el-icon-refresh" @click.native="reset">{{ $t('button.reset') }}</el-button>
            </el-form-item>
            <br>
          </el-form>

          <br>
            <el-row>
              <el-col :span="24">
                <el-button type="success" size="mini"  icon="el-icon-plus" @click.native="add" v-permission="['/park/emergency/pool/add']">{{ $t('button.add') }}</el-button>
                <el-button type="danger" size="mini"  icon="el-icon-delete" @click.native="remove" v-permission="['/park/emergency/pool/delete']">批量删除</el-button>
              </el-col>
            </el-row>
        </div>


        <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row
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
            <el-table-column label="资源库名称">
                <template slot-scope="scope">
                    {{scope.row.repositoriesName}}
                </template>
            </el-table-column>
          <el-table-column label="所属企业">
            <template slot-scope="scope">
                <template v-if="scope.row.dsiEnterpriseBaseinfo !== null" id="enterprise1">{{scope.row.dsiEnterpriseBaseinfo.enterpriseName}}</template>
                <template v-else="scope.row.enterpriseId == null" id="enterprise2"></template>
            </template>
          </el-table-column>
          <el-table-column label="行政区划">
            <template slot-scope="scope">
              <template v-if="scope.row.dsiEnterpriseBaseinfo != null" id="district1">{{scope.row.dsiEnterpriseBaseinfo.districtName}}</template>
              <template v-else="scope.row.dsiEnterpriseBaseinfo == null" id="district2"></template>

              <!--{{scope.row.dsiEnterpriseBaseinfo.districtName}}-->
            </template>
          </el-table-column>
          <el-table-column label="地址">
            <template slot-scope="scope">
              {{scope.row.address}}
            </template>
          </el-table-column>
            <el-table-column label="负责人">
                <template slot-scope="scope">
                    {{scope.row.personName}}
                </template>
            </el-table-column>
            <el-table-column label="联系电话">
                <template slot-scope="scope">
                    {{scope.row.personTel}}
                </template>
            </el-table-column>


           <!-- <el-table-column label="经度">
                <template slot-scope="scope">
                    {{scope.row.longitude}}
                </template>
            </el-table-column>
            <el-table-column label="纬度">
                <template slot-scope="scope">
                    {{scope.row.latitude}}
                </template>
            </el-table-column>
            <el-table-column label="逻辑删除">
                <template slot-scope="scope">
                    {{scope.row.isDel}}
                </template>
            </el-table-column>-->
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="mini" icon="el-icon-edit" @click.native="editItem(scope.row)" v-permission="['/park/emergency/pool/update']">{{ $t('button.edit') }}</el-button>
                    <el-button type="text" size="mini" icon="el-icon-delete" @click.native="removeItem(scope.row)" v-permission="['/park/emergency/pool/delete']">{{ $t('button.delete') }}</el-button>
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
                   <!-- <el-col :span="12">
                        <el-form-item label="序号"  >
                            <el-input v-model="form.code" minlength=1></el-input>
                        </el-form-item>
                    </el-col>-->
                    <el-col :span="12">
                        <el-form-item label="资源库名称"  >
                            <el-input v-model="form.repositoriesName" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                  <el-col :span="12">
                    <el-form-item label="所属企业"  >
                      <el-select v-model="form.enterpriseId" minlength=1>
                        <el-option
                          v-for="item in enterprise_list"
                          :key="item.id"
                          :label="item.enterpriseName"
                          :value="item.id">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                    <el-col :span="12">
                        <el-form-item label="负责人"  >
                            <el-input v-model="form.personName" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="联系电话"  >
                            <el-input v-model="form.personTel" minlength=1></el-input>
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
                  <el-col :span="12">
                    <el-form-item label="地址"  >
                      <el-input v-model="form.address" minlength=1></el-input>
                    </el-form-item>
                  </el-col>

                </el-row>

              <el-form-item align="right" style="margin-right: 50px">
                <el-button type="primary"  align="center" @click="addMaterial">添加新物资</el-button>
              </el-form-item>
              <el-table :data="materialList" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row
                        @current-change="handleCurrentChange">
                <el-table-column label="物资名称">
                  <template slot-scope="scope">
                    {{scope.row.materialName}}
                  </template>
                </el-table-column>
                <el-table-column label="类型">
                  <template slot-scope="scope">
                    {{scope.row.materialTypeName}}
                  </template>
                </el-table-column>
                <el-table-column label="单位">
                  <template slot-scope="scope">
                    {{scope.row.chUnitIdName}}
                  </template>
                </el-table-column>
                <el-table-column label="数量">
                  <template slot-scope="scope">
                    {{scope.row.materialNum}}
                  </template>
                </el-table-column>
                <template v-if="materialAdd == false">
                  <el-table-column label="有效期">
                    <template slot-scope="scope">
                      {{scope.row.validityTerm}}
                    </template>
                  </el-table-column>
                </template>
                <template v-else>
                  <el-table-column label="有效期">
                    <template slot-scope="scope">
                      {{scope.row.validityTermStr}}
                    </template>
                  </el-table-column>
                </template>

                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button type="text"  icon="el-icon-edit" @click.native="editMaterialItem(scope.row)" >{{ $t('button.edit') }}</el-button>
                    <el-button type="text"  icon="el-icon-delete" @click.native="removeMaterial(scope.row)" >{{ $t('button.delete') }}</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-form-item id="myself">
                <el-button type="primary" @click="save">{{ $t('button.submit') }}</el-button>
                <el-button size="mini" @click.native="formVisible = false">{{ $t('button.cancel') }}</el-button>
              </el-form-item>
            </el-form>


        </el-dialog>


      <el-dialog
        :title="materialTitle"
        :visible.sync="materialVisible"
        width="60%">
        <el-form ref="materialForm" :model="materialForm" :rules="rules" label-width="120px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="物资名称"  >
                <el-input v-model="materialForm.materialName" minlength=1></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="类型"  >
                <el-select v-model="materialForm.materialType" minlength=1>
                  <el-option
                    v-for="item in material_type"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="单位"  >
                <el-select v-model="materialForm.chUnitId" id="chUnitId" minlength=1>
                  <el-option
                    v-for="item in material_num_unit"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="数量"  >
                <el-input v-model="materialForm.materialNum" minlength=1></el-input>
              </el-form-item>
            </el-col>


            <el-col :span="12">
              <el-form-item label="有效期"  >
                <el-date-picker v-model="materialForm.validityTerm" type="date" placeholder="请选择"   value-format="yyyy/MM/dd"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item align="center">
            <el-button type="primary" @click.native="saveMaterial()">{{ $t('button.submit') }}</el-button>
            <el-button @click.native="materialVisible = false">{{ $t('button.cancel') }}</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>



    </div>
</template>


<script src="./dsiParkEmergencyPool.js"></script>


<style rel="stylesheet/scss" lang="scss" >
    @import "src/styles/commonmyself.scss";
</style>

