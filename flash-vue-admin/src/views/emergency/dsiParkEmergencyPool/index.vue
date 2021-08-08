<template>
  <div class="app-container two-line-form-container">
    <div class="block">
      <el-form label-width="76px" class="align-right has-Label-Width">
        <el-row class="hasmarginBottom">
          <el-col :span="5">
            <el-form-item label="名称：">
              <el-input v-model="listQuery.repositoriesName" placeholder="请输入资源库名称" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="所在地区：">
              <district v-model="listQuery.districtCode" placeholder="请选择所在地区" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="负责人：">
              <el-input v-model="listQuery.personName" placeholder="请输入负责人名称" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="地址：">
              <el-input v-model="listQuery.address" placeholder="请输入地址" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5">
            <el-form-item label="所属企业：">
              <el-select v-model="listQuery.enterpriseId" placeholder="请选择所属企业">
                <el-option
                  v-for="item in enterprise_list"
                  :key="item.id"
                  :label="item.enterpriseName"
                  :value="item.id"
                />
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

    <div class="table-list outer-table-list">
      <div class="btnLists">
        <el-button v-permission="['/park/emergency/pool/add']" type="success" size="mini" class="set-common-btn blue-button" @click.native="add">{{ $t('button.add') }}</el-button>
        <el-button v-permission="['/park/emergency/pool/delete']" type="danger" size="mini" class="set-common-btn blank-blue-button" @click.native="batchDelete">批量删除</el-button>
      </div>
      <el-table
        ref="poolTable"
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        border
        :row-key="row=>row.id"
        @selection-change="handleSelectionChange"
        @current-change="handleCurrentChange"
        @row-click="toggleSelection"
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
        <el-table-column label="资源库名称" show-overflow-tooltip>
          <template slot-scope="scope" >
            <span class="updateText" @click="viewInfo(scope.row)" >
              {{ scope.row.repositoriesName }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="所属企业" show-overflow-tooltip>
          <template slot-scope="scope">
            <template v-if="scope.row.dsiEnterpriseBaseinfo !== null" id="enterprise1">{{ scope.row.dsiEnterpriseBaseinfo.enterpriseName }}</template>
            <template v-else="scope.row.enterpriseId == null" id="enterprise2" />
          </template>
        </el-table-column>
        <el-table-column label="行政区划" show-overflow-tooltip>
          <template slot-scope="scope">
            <template v-if="scope.row.dsiEnterpriseBaseinfo != null" id="district1">{{ scope.row.dsiEnterpriseBaseinfo.districtName }}</template>
            <template v-else="scope.row.dsiEnterpriseBaseinfo == null" id="district2" />

            <!--{{scope.row.dsiEnterpriseBaseinfo.districtName}}-->
          </template>
        </el-table-column>
        <el-table-column label="负责人" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.personName }}
          </template>
        </el-table-column>
        <el-table-column label="联系电话" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.personTel }}
          </template>
        </el-table-column>
        <el-table-column label="地址" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.address }}
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button v-permission="['/park/emergency/pool/update']" type="text" size="mini" icon="el-icon-edit" @click.native="editItem(scope.row)">{{ $t('button.edit') }}</el-button>
            <el-button v-permission="['/park/emergency/pool/delete']" type="text" size="mini" icon="el-icon-delete" @click.native="removeItem(scope.row)">{{ $t('button.delete') }}</el-button>
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
        @next-click="fetchNext"
      />
    </div>
    <!-- 添加应急资源库弹框 -->
    <el-dialog
      class="el-dialog-style common-dialog-style height700"
      :title="formTitle"
      :visible.sync="formVisible"
      width="960px"
      @close="cancle"
    >
      <div class="block">
        <el-form ref="form" :model="form" :rules="rules" label-width="98px" class="align-right has-Label-Width">
          <el-row>
            <!-- <el-col :span="12">
                        <el-form-item label="序号"  >
                            <el-input v-model="form.code" minlength=1></el-input>
                        </el-form-item>
                    </el-col>-->
            <el-col :span="12">
              <el-form-item label="资源库名称：">
                <el-input v-model="form.repositoriesName"  :disabled="editFlag" placeholder="请输入资源库名称" minlength="1" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="所属企业：">
                <el-select v-model="form.enterpriseId" minlength="1" :disabled="editFlag">
                  <el-option
                    v-for="item in enterprise_list"
                    :key="item.id"
                    :label="item.enterpriseName"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="负责人：">
                <el-input v-model="form.personName" :disabled="editFlag" placeholder="请输入负责人姓名" minlength="1" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系电话：">
                <el-input v-model="form.personTel" :disabled="editFlag" placeholder="请输入联系电话" oninput="value=value.replace(/[^0-9.]/g,'')" minlength="1" />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="经度：">
                <el-input v-model="form.longitude" :disabled="editFlag" placeholder="请输入经度" oninput="value=value.replace(/[^0-9.]/g,'')" minlength="1" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="纬度：">
                <el-input v-model="form.latitude" :disabled="editFlag" placeholder="请输入纬度" oninput="value=value.replace(/[^0-9.]/g,'')" minlength="1" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="地址：">
                <el-input v-model="form.address" :disabled="editFlag" placeholder="请输入地址" minlength="1" />
              </el-form-item>
            </el-col>

          </el-row>

          <el-form-item align="right">
            <el-button type="primary" align="center" class="set-common-btn blank-blue-button" v-if="editFlag == false" @click="addMaterial">添加新物资</el-button>
          </el-form-item>
          <div class="table-list">
            <el-table
              v-loading="listLoading"
              :data="materialList"
              max-height="331px"
              element-loading-text="Loading"
              border
              fit
              highlight-current-row
              @current-change="handleCurrentChange"
            >
              <el-table-column label="物资名称" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ scope.row.materialName }}
                </template>
              </el-table-column>
              <el-table-column label="类型" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ scope.row.materialTypeName }}
                </template>
              </el-table-column>
              <el-table-column label="单位" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ scope.row.chUnitIdName }}
                </template>
              </el-table-column>
              <el-table-column label="数量" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ scope.row.materialNum }}
                </template>
              </el-table-column>
              <el-table-column label="有效期" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ scope.row.validityTerm }}
                </template>
              </el-table-column>
              <!--<template v-else>-->
              <!--<el-table-column label="有效期">-->
              <!--<template slot-scope="scope">-->
              <!--{{scope.row.validityTermStr}}-->
              <!--</template>-->
              <!--</el-table-column>-->
              <!--</template>-->

              <el-table-column label="操作" align="center" v-if="editFlag == false" width="170">
                <template slot-scope="scope">
                  <el-button type="text" icon="el-icon-edit"  @click.native="editMaterialItem(scope.row)">{{ $t('button.edit') }}</el-button>
                  <el-button type="text" icon="el-icon-delete"  @click.native="removeMaterial(scope.row)">{{ $t('button.delete') }}</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <el-form-item class="marginT10 align-center">
            <el-button type="primary" class="set-common-btn blue-button" v-if="editFlag == false" @click="save">{{ $t('button.submit') }}</el-button>
            <el-button class="set-common-btn blank-blue-button" v-if="editFlag == false" @click.native="cancle">{{ $t('button.cancel') }}</el-button>
          </el-form-item>
        </el-form>
      </div>

    </el-dialog>

    <!-- 添加应急物资信息弹框 -->
    <el-dialog
      class="el-dialog-style common-dialog-style "
      :title="materialTitle"
      :visible.sync="materialVisible"
      onclose="cancle"
      width="960px"
    >
      <div class="block">
        <el-form ref="materialForm" :model="materialForm" :rules="rules" label-width="80px" class="align-right has-Label-Width">
          <el-row>
            <el-col :span="12">
              <el-form-item label="物资名称：">
                <el-input v-model="materialForm.materialName" placeholder="请输入物资名称" minlength="1" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="类型：">
                <el-select v-model="materialForm.materialType" minlength="1">
                  <el-option
                    v-for="item in material_type"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="单位：">
                <el-select id="chUnitId" v-model="materialForm.chUnitId" minlength="1">
                  <el-option
                    v-for="item in material_num_unit"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="数量：">
                <el-input v-model="materialForm.materialNum" oninput="value=value.replace(/[^0-9.]/g,'')" placeholder="请输入物资数量" />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="有效期：">
                <el-date-picker v-model="materialForm.validityTerm" type="date" placeholder="请选择" value-format="yyyy-MM-dd" />
              </el-form-item>
            </el-col>
          </el-row>
          <row>
            <el-form-item align="center" class="marginTop10">
              <el-button type="primary" class="set-common-btn blue-button" @click.native="saveMaterial()">{{ $t('button.submit') }}</el-button>
              <el-button class="set-common-btn blank-blue-button" @click.native="cancle">{{ $t('button.cancel') }}</el-button>
            </el-form-item>
          </row>
        </el-form>
      </div>
    </el-dialog>

  </div>
</template>

<script src="./dsiParkEmergencyPool.js"></script>

