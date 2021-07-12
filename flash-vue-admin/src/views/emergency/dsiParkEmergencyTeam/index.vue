<template>
  <div class="app-container">
    <div class="block">
      <el-form label-width="76px" class="align-right has-Label-Width">
        <el-row class="hasmarginBottom">
          <el-col :span="5">
            <el-form-item label="队伍名称：">
              <el-input v-model="listQuery.name" placeholder="请输入队伍名称" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="所在地区：">
              <district v-model="listQuery.districtCode" placeholder="请选择所在地区" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="负责人：">
              <el-input v-model="listQuery.personContact" placeholder="请输入负责人" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="所属企业：">
              <el-select v-model="listQuery.belongingUnit" placeholder="请选择所属企业">
                <el-option
                  v-for="item in enterprise_list"
                  :key="item.id"
                  :label="item.enterpriseName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5">
            <el-form-item label="地址：">
              <el-input v-model="listQuery.address" placeholder="请输入地址" />
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
        <el-button v-permission="['/park/emergency/team/add']" type="success" size="mini" class="set-common-btn blue-button" @click.native="add">{{ $t('button.add') }}</el-button>
        <el-button v-permission="['/park/emergency/team/delete']" type="danger" size="mini" class="set-common-btn blank-blue-button" @click.native="batchDelete">批量删除</el-button>
      </div>
      <el-table
        ref="teamTable"
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        border
        :row-key="row=>row.id"
        @current-change="handleCurrentChange"
        @selection-change="handleSelectionChange"
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
        <el-table-column label="队伍名称" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="updateText" @click="viewInfo(scope.row)">{{ scope.row.name }}</span>

          </template>
        </el-table-column>
        <el-table-column label="所属企业" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.dsiEnterpriseBaseinfo ? scope.row.dsiEnterpriseBaseinfo.enterpriseName : "" }}
          </template>
        </el-table-column>
        <el-table-column label="行政区划" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.dsiEnterpriseBaseinfo ? scope.row.dsiEnterpriseBaseinfo.districtName : "" }}
          </template>
        </el-table-column>
        <el-table-column label="队伍性质" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.teamNature }}
          </template>
        </el-table-column>

        <el-table-column label="负责人" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.personContact }}
          </template>
        </el-table-column>
        <el-table-column label="联系电话" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.personTel }}
          </template>
        </el-table-column>
        <el-table-column label="队伍人数" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.personNumber }}
          </template>
        </el-table-column>
        <el-table-column label="地址" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.address }}
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button v-permission="['/park/emergency/team/update']" type="text" size="mini" icon="el-icon-edit" @click.native="editItem(scope.row)">{{ $t('button.edit') }}</el-button>
            <el-button v-permission="['/park/emergency/team/delete']" type="text" size="mini" icon="el-icon-delete" @click.native="removeItem(scope.row)">{{ $t('button.delete') }}</el-button>
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
    <!-- 添加应急队伍弹框 -->
    <el-dialog
      class="el-dialog-style common-dialog-style"
      :title="formTitle"
      :visible.sync="formVisible"
      width="960px"
    >
      <div class="block">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px" class="align-right has-Label-Width">
          <el-row>
            <!-- <el-col :span="12">
                        <el-form-item label="编码"  >
                            <el-input v-model="form.code" minlength=1></el-input>
                        </el-form-item>
                    </el-col>-->
            <el-col :span="12">
              <el-form-item label="队伍名称：">
                <el-input v-model="form.name" :disabled="editFlag" minlength="1" placeholder="请输入队伍名称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="所属企业：">
                <el-select v-model="form.belongingUnit" :disabled="editFlag" minlength="1">
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
                <el-input v-model="form.personContact" :disabled="editFlag" placeholder="请输入负责人" minlength="1" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系电话：">
                <el-input v-model="form.personTel" :disabled="editFlag" placeholder="请输入联系电话" oninput="value=value.replace(/[^0-9.]/g,'')" minlength="1" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="队伍性质：">
                <el-input v-model="form.teamNature" :disabled="editFlag" placeholder="请输入队伍性质" minlength="1" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="队伍人数：">
                <el-input v-model="form.personNumber" :disabled="editFlag" placeholder="请输入人数" oninput="value=value.replace(/[^0-9.]/g,'')" minlength="1" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="地址：">
                <el-input v-model="form.address" :disabled="editFlag" placeholder="请输入地址" minlength="1" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="抢险设备：">
                <el-input v-model="form.teamEquipment"  :disabled="editFlag" placeholder="请输入抢险设备" minlength="1" />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="经度：">
                <el-input v-model="form.longitude" :disabled="editFlag" oninput="value=value.replace(/[^0-9.]/g,'')" minlength="1" placeholder="请输入经度" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="纬度：">
                <el-input v-model="form.latitude" :disabled="editFlag" placeholder="请输入维度" oninput="value=value.replace(/[^0-9.]/g,'')" minlength="1" />
              </el-form-item>
            </el-col>

          </el-row>

          <el-form-item align="right" class="marginTop10">
            <el-button type="primary" class="set-common-btn blank-blue-button width92" v-if="editFlag == false" @click.native="choosePerson">选择应急人员</el-button>
          </el-form-item>
           <div class="table-list" style="padding:0">
            <el-table
              v-loading="personLoading"
              :data="personList"
              element-loading-text="Loading"
              border
              fit
              highlight-current-row
              style="width:100%"
              max-height="300px"
              @current-change="handleCurrentChange"
            >

              <el-table-column label="名称" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ scope.row.name }}
                </template>
              </el-table-column>
              <el-table-column label="性别" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ scope.row.genderName }}
                </template>
              </el-table-column>
              <el-table-column label="学历" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ scope.row.educationName }}
                </template>
              </el-table-column>
              <el-table-column label="职称" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ scope.row.professionalName }}
                </template>
              </el-table-column>
              <el-table-column label="专业特长" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ scope.row.majorSpecialty }}
                </template>
              </el-table-column>
              <el-table-column label="是否专家" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ scope.row.isExpertName }}
                </template>
              </el-table-column>

              <el-table-column label="联系方式" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ scope.row.tel }}
                </template>
              </el-table-column>

              <el-table-column label="操作" align="center" width="170">
                <template slot-scope="scope">
                  <el-button type="text" size="mini" icon="el-icon-edit" @click.native="viewPerson(scope.row)">查看</el-button>
                  <el-button type="text" size="mini" icon="el-icon-delete" v-if="editFlag == false" @click.native="removePersonItem(scope.row)">{{ $t('button.delete') }}</el-button>
                </template>
              </el-table-column>
            </el-table>

        </div>

          <el-form-item class="marginT10 dialog-button-list" v-if="editFlag == false">
            <el-button type="primary" class="set-common-btn blue-button" @click="save">{{ $t('button.submit') }}</el-button>
            <el-button class="set-common-btn blank-blue-button" @click.native="cancle">{{ $t('button.cancel') }}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <!-- 选择应急人员弹框 -->
    <el-dialog
      class="el-dialog-style common-dialog-style"
      :title="personTitle"
      :visible.sync="personVisible"
      width="960px"
      onclose="cancle"
      style="overflow-y: hidden;height: auto"
    >
      <div class="block">
        <el-form>
          <div class="table-list">
            <el-table
              ref="emergencyPersonTable"
              v-loading="personLoading"
              :data="person_data"
              element-loading-text="Loading"
              border
              fit
              max-height="500px"
              @selection-change="handleSelectionChange"
              @row-click="personToggleSelection"
            >
              <el-table-column
                width="50px"
                type="selection"
              />
              <el-table-column label="名称" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ scope.row.name }}
                </template>
              </el-table-column>
              <el-table-column label="性别" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ scope.row.genderName }}
                </template>
              </el-table-column>
              <el-table-column label="学历" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ scope.row.educationName }}
                </template>
              </el-table-column>
              <el-table-column label="职称" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ scope.row.professionalName }}
                </template>
              </el-table-column>
              <el-table-column label="专业特长" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ scope.row.majorSpecialty }}
                </template>
              </el-table-column>
              <el-table-column label="是否专家" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ scope.row.isExpertName }}
                </template>
              </el-table-column>

              <el-table-column label="联系方式" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ scope.row.tel }}
                </template>
              </el-table-column>
            </el-table>
          </div>
          <el-pagination
            background
            class="position-pagination"
            layout="total, sizes, prev, pager, next, jumper"
            :page-sizes="[10, 20, 50, 100,500]"
            :page-size="personQuery.limit"
            :total="personTotal"
          @size-change="personChangeSize"
          @current-change="personFetchPage"
          @prev-click="personFetchPrev"
          @next-click="personFetchNext"
          />


          <el-form-item align="center" class="marginT10">
            <el-button type="primary" class="set-common-btn blue-button" @click="addPerson">{{ $t('button.submit') }}</el-button>
            <el-button class="set-common-btn blank-blue-button" @click.native="personVisible = false">{{ $t('button.cancel') }}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <!-- 应急人员信息查看弹框 -->
    <el-dialog
      :title="personTitle"
      class="el-dialog-style common-dialog-style"
      :visible.sync="viewVisible"
      width="960px"
    >
      <div class="block">
        <el-form ref="personForm" :model="personForm" :rules="rules" label-width="120px" class="align-right has-Label-Width">

          <el-row>
            <el-col :span="12">
              <el-form-item label="人员名称：">
                <el-input v-model="personForm.name" disabled="disabled" minlength="1" />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="现工作单位：">
                <el-input v-model="personForm.workPlace" disabled="disabled" minlength="1" />
              </el-form-item>
            </el-col>

          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="性别：">
                <el-select v-model="personForm.gender" disabled="disabled" minlength="1">
                  <el-option
                    v-for="item in sex"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="行政区划：">
                <district v-model="personForm.districtCode" :disabled="true" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="联系电话：">
                <el-input v-model="personForm.tel" minlength="1" disabled="disabled" />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="地址：">
                <el-input v-model="personForm.address" disabled="disabled" minlength="1" />
              </el-form-item>
            </el-col>

          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="职称：">
                <el-input v-model="personForm.professionalName" disabled="disabled" minlength="1" />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="学历：">
                <el-input v-model="personForm.educationName" disabled="disabled" minlength="1" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="紧急联系人：">
                <el-input v-model="personForm.emergencyContact" disabled="disabled" minlength="1" />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="紧急联系方式：">
                <el-input v-model="personForm.emergencyTel" disabled="disabled" minlength="1" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="职务：">
                <el-input v-model="personForm.postName" disabled="disabled" minlength="1" />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="专业特长：">
                <el-input v-model="personForm.majorSpecialty" disabled="disabled" minlength="1" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="是否专家：">
                <el-select v-model="personForm.isExpert" disabled="disabled" minlength="1">
                  <el-option
                    v-for="item in isExpert"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>

          </el-row>

        </el-form>
      </div>
    </el-dialog>

  </div>
</template>

<script src="./dsiParkEmergencyTeam.js"></script>

