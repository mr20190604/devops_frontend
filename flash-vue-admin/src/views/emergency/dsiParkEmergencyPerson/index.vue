<template>
  <div class="app-container">
    <div class="block">
      <el-form label-width="90px" class="has-Label-Width">
        <el-row>
          <el-col :span="5">
            <el-form-item label="人员名称：">
              <el-input v-model="listQuery.name" placeholder="请输入人员名称" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="所在行政区：" class="label-width">
              <district v-model="listQuery.districtCode" placeholder="请选择所在行政区" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="现工作单位：">
              <el-input v-model="listQuery.workPlace" placeholder="请输入工作单位" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="是否专家：">
              <el-select v-model="listQuery.isExpert" placeholder="是否专家">
                <el-option
                  v-for="item in isExpert"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
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
        <el-button v-permission="['/park/emergency/person/add']" type="success" size="mini" class="set-common-btn blue-button" @click.native="add">{{ $t('button.add') }}</el-button>
        <el-button v-permission="['/park/emergency/person/delete']" type="danger" size="mini" class="set-common-btn blank-blue-button" @click.native="batchDelete">批量删除</el-button>
      </div>
      <el-table
        ref="personTable"
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
          width="50"
          label="序号"
        />
        <el-table-column label="姓名" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="updateText" @click="viewInfo(scope.row)">
              {{ scope.row.name }}
            </span>
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
        <el-table-column label="职务" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.postName }}
          </template>
        </el-table-column>
        <el-table-column label="行政区划" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.districtName }}
          </template>
        </el-table-column>
        <el-table-column label="是否专家" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.isExpertName }}
          </template>
        </el-table-column>
        <el-table-column label="专业特长" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.majorSpecialty }}
          </template>
        </el-table-column>

        <el-table-column label="联系电话" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.tel }}
          </template>
        </el-table-column>

        <el-table-column label="工作单位" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.workPlace }}
          </template>
        </el-table-column>
        <el-table-column label="地址" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.address }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="170px">
          <template slot-scope="scope">
            <el-button v-permission="['/park/emergency/person/update']" type="text" size="mini" icon="el-icon-edit" @click.native="editItem(scope.row)">{{ $t('button.edit') }}</el-button>
            <el-button v-permission="['/park/emergency/person/delete']" type="text" size="mini" icon="el-icon-delete" @click.native="removeItem(scope.row)">{{ $t('button.delete') }}</el-button>
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
        onclose="cancle"
        @size-change="changeSize"
        @current-change="fetchPage"
        @prev-click="fetchPrev"
        @next-click="fetchNext"
      />
    </div>
    <!-- 添加应急人员弹框 -->
    <el-dialog
      class="el-dialog-style common-dialog-style"
      :title="formTitle"
      :visible.sync="formVisible"
      width="960px"
    >
      <div class="block">
        <el-form ref="form" :model="form" :rules="rules" label-width="120px" class="align-right has-Label-Width">
          <el-row>
            <el-col :span="12">
              <el-form-item label="人员名称：">
                <el-input v-model="form.name" :disabled="editFlag" minlength="1" />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="现工作单位：">
                <el-input v-model="form.workPlace" :disabled="editFlag" minlength="1" />
              </el-form-item>
            </el-col>

          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="性别：">
                <el-select v-model="form.gender" :disabled="editFlag" minlength="1">
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
                <district :disabled="editFlag" v-model="form.districtCode"  />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="联系电话：">
                <el-input v-model="form.tel" :disabled="editFlag" oninput="value=value.replace(/[^0-9.]/g,'')" minlength="1" />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="地址：">
                <el-input v-model="form.address" :disabled="editFlag" minlength="1" />
              </el-form-item>
            </el-col>

          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="职称：">
                <el-input v-model="form.professionalName" :disabled="editFlag" minlength="1" />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="学历：">
                <el-input v-model="form.educationName" :disabled="editFlag" minlength="1" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="紧急联系人：">
                <el-input v-model="form.emergencyContact" :disabled="editFlag" minlength="1" />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="紧急联系方式：">
                <el-input v-model="form.emergencyTel" :disabled="editFlag" oninput="value=value.replace(/[^0-9.]/g,'')" minlength="1" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="职务：">
                <el-input v-model="form.postName" :disabled="editFlag" minlength="1" />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="专业特长：">
                <el-input v-model="form.majorSpecialty" :disabled="editFlag" minlength="1" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="是否专家：">
                <el-select v-model="form.isExpert" :disabled="editFlag" minlength="1">
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
          <el-form-item id="myself" class="dialog-button-list" v-if="editFlag == false">
            <el-button type="primary" class="set-common-btn blue-button" @click="save">{{ $t('button.submit') }}</el-button>
            <el-button class="set-common-btn blank-blue-button" @click.native="cancle">{{ $t('button.cancel') }}</el-button>
          </el-form-item>

        </el-form>
      </div class="block"></el-dialog></div>
  </el-dialog>
  </div>
</template>

<script src="./dsiParkEmergencyPerson.js"></script>

