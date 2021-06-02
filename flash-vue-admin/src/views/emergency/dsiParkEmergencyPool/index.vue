<template>
    <div class="app-container">
        <div class="block">
          <el-form label-width="76px" class="align-right has-Label-Width">
            <el-row class="hasmarginBottom">
              <el-col :span="6">
                <el-form-item label="名称：">
                  <el-input v-model="listQuery.repositoriesName" placeholder="请输入资源库名称"></el-input>
                </el-form-item>
             </el-col>
             <el-col :span="6">
                <el-form-item label="所在地区：">
                  <district v-model="listQuery.districtCode" placeholder="请选择所在地区"></district>
                </el-form-item>
             </el-col>
             <el-col :span="6">
                <el-form-item label="负责人：">
                  <el-input v-model="listQuery.personName"  placeholder="请输入负责人名称"></el-input>
                </el-form-item>
             </el-col>
             <el-col :span="6">
                <el-form-item label="地址：">
                  <el-input v-model="listQuery.address"  placeholder="请输入地址"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="所属企业：">
                  <el-select v-model="listQuery.enterpriseId"  placeholder="请选择所属企业">
                    <el-option
                      v-for="item in enterprise_list"
                      :key="item.id"
                      :label="item.enterpriseName"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="18">
                <el-form-item>
                    <el-button type="primary" class="set-common-btn blue-button" @click.native="search">{{ $t('button.search') }}</el-button>
                    <el-button class="set-common-btn blank-blue-button" @click.native="reset">{{ $t('button.reset') }}</el-button>
                  </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>

<div class="table-list">
      <div class="btnLists">
          <el-button type="success" size="mini" class="set-common-btn blue-button" @click.native="add" v-permission="['/park/emergency/pool/add']">{{ $t('button.add') }}</el-button>
          <el-button type="danger" size="mini"  class="set-common-btn blank-blue-button" @click.native="batchDelete" v-permission="['/park/emergency/pool/delete']">批量删除</el-button>
      </div>
        <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" border
                  @selection-change="handleSelectionChange"
                  :row-key="row=>row.id"
                  @current-change="handleCurrentChange"
                  @row-click="toggleSelection"
                  ref="poolTable"

        >
          <el-table-column
            type="selection"
            width="55"
            :reserve-selection="true"
          >
          </el-table-column>
          <el-table-column
            type="index"
            width="55"
            label="序号"
          >
          </el-table-column>
            <el-table-column label="资源库名称" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{scope.row.repositoriesName}}
                </template>
            </el-table-column>
          <el-table-column label="所属企业" show-overflow-tooltip>
            <template slot-scope="scope">
                <template v-if="scope.row.dsiEnterpriseBaseinfo !== null" id="enterprise1">{{scope.row.dsiEnterpriseBaseinfo.enterpriseName}}</template>
                <template v-else="scope.row.enterpriseId == null" id="enterprise2"></template>
            </template>
          </el-table-column>
          <el-table-column label="行政区划" show-overflow-tooltip>
            <template slot-scope="scope">
              <template v-if="scope.row.dsiEnterpriseBaseinfo != null" id="district1">{{scope.row.dsiEnterpriseBaseinfo.districtName}}</template>
              <template v-else="scope.row.dsiEnterpriseBaseinfo == null" id="district2"></template>

              <!--{{scope.row.dsiEnterpriseBaseinfo.districtName}}-->
            </template>
          </el-table-column>
          <el-table-column label="负责人" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.personName}}
            </template>
          </el-table-column>
          <el-table-column label="联系电话" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.personTel}}
            </template>
          </el-table-column>
          <el-table-column label="地址" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.address}}
            </template>
          </el-table-column>

            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button type="text" size="mini" icon="el-icon-edit" @click.native="editItem(scope.row)" v-permission="['/park/emergency/pool/update']">{{ $t('button.edit') }}</el-button>
                    <el-button type="text" size="mini" icon="el-icon-delete" @click.native="removeItem(scope.row)" v-permission="['/park/emergency/pool/delete']">{{ $t('button.delete') }}</el-button>
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
        <el-dialog
                :title="formTitle"
                :visible.sync="formVisible"
                width="60%"
                @close="cancle"
        >
            <el-form ref="form" :model="form" :rules="rules" label-width="120px">
                <el-row>
                   <!-- <el-col :span="12">
                        <el-form-item label="序号"  >
                            <el-input v-model="form.code" minlength=1></el-input>
                        </el-form-item>
                    </el-col>-->
                    <el-col :span="12">
                        <el-form-item label="资源库名称："  >
                            <el-input v-model="form.repositoriesName" placeholder="请输入资源库名称" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                  <el-col :span="12">
                    <el-form-item label="所属企业："  >
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
                        <el-form-item label="负责人："  >
                            <el-input v-model="form.personName" placeholder="请输入负责人姓名" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="联系电话："  >
                            <el-input v-model="form.personTel" placeholder="请输入联系电话" oninput="value=value.replace(/[^0-9.]/g,'')" minlength=1></el-input>
                        </el-form-item>
                    </el-col>


                    <el-col :span="12">
                        <el-form-item label="经度："  >
                            <el-input v-model="form.longitude" placeholder="请输入经度" oninput="value=value.replace(/[^0-9.]/g,'')" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="纬度："  >
                            <el-input v-model="form.latitude" placeholder="请输入纬度" oninput="value=value.replace(/[^0-9.]/g,'')" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                  <el-col :span="12">
                    <el-form-item label="地址："  >
                      <el-input v-model="form.address" placeholder="请输入地址" minlength=1></el-input>
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
                <el-table-column label="类型" align="center">
                  <template slot-scope="scope">
                    {{scope.row.materialTypeName}}
                  </template>
                </el-table-column>
                <el-table-column label="单位" align="center">
                  <template slot-scope="scope">
                    {{scope.row.chUnitIdName}}
                  </template>
                </el-table-column>
                <el-table-column label="数量" align="center">
                  <template slot-scope="scope">
                    {{scope.row.materialNum}}
                  </template>
                </el-table-column>
                  <el-table-column label="有效期">
                    <template slot-scope="scope">
                      {{scope.row.validityTerm}}
                    </template>
                  </el-table-column>
                <!--<template v-else>-->
                  <!--<el-table-column label="有效期">-->
                    <!--<template slot-scope="scope">-->
                      <!--{{scope.row.validityTermStr}}-->
                    <!--</template>-->
                  <!--</el-table-column>-->
                <!--</template>-->

                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button type="text"  icon="el-icon-edit" @click.native="editMaterialItem(scope.row)" >{{ $t('button.edit') }}</el-button>
                    <el-button type="text"  icon="el-icon-delete" @click.native="removeMaterial(scope.row)" >{{ $t('button.delete') }}</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-form-item id="myself">
                <el-button type="primary" @click="save">{{ $t('button.submit') }}</el-button>
                <el-button  @click.native="cancle">{{ $t('button.cancel') }}</el-button>
              </el-form-item>
            </el-form>


        </el-dialog>


      <el-dialog
        :title="materialTitle"
        :visible.sync="materialVisible"
        onclose="cancle"
        width="60%">
        <el-form ref="materialForm" :model="materialForm" :rules="rules" label-width="120px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="物资名称："  >
                <el-input v-model="materialForm.materialName" placeholder="请输入物资名称" minlength=1></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="类型："  >
                <el-select v-model="materialForm.materialType"  minlength=1>
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
              <el-form-item label="单位："  >
                <el-select v-model="materialForm.chUnitId"  id="chUnitId" minlength=1>
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
              <el-form-item label="数量："  >
                <el-input oninput="value=value.replace(/[^0-9.]/g,'')" placeholder="请输入物资数量" v-model="materialForm.materialNum"></el-input>
              </el-form-item>
            </el-col>


            <el-col :span="12">
              <el-form-item label="有效期："  >
                <el-date-picker v-model="materialForm.validityTerm" type="date" placeholder="请选择"   value-format="yyyy-MM-dd"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item align="center">
            <el-button type="primary" @click.native="saveMaterial()">{{ $t('button.submit') }}</el-button>
            <el-button @click.native="cancle">{{ $t('button.cancel') }}</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>



    </div>
</template>


<script src="./dsiParkEmergencyPool.js"></script>


