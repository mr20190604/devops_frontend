<template>
  <div class="app-container">
    <div class="block">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-input v-model="listQuery.id" size="mini" placeholder="请输入id" />
        </el-col>
        <el-col :span="6">
          <el-button type="success" size="mini" icon="el-icon-search" @click.native="search">{{ $t('button.search') }}</el-button>
          <el-button type="primary" size="mini" icon="el-icon-refresh" @click.native="reset">{{ $t('button.reset') }}</el-button>
        </el-col>
      </el-row>
      <br>
      <el-row>
        <el-col :span="24">
          <el-button v-permission="['/bas/build/add']" type="success" size="mini" icon="el-icon-plus" @click.native="add">{{ $t('button.add') }}</el-button>
          <el-button v-permission="['/bas/build/update']" type="primary" size="mini" icon="el-icon-edit" @click.native="edit">{{ $t('button.edit') }}</el-button>
          <el-button v-permission="['/bas/build/delete']" type="danger" size="mini" icon="el-icon-delete" @click.native="remove">{{ $t('button.delete') }}</el-button>
        </el-col>
      </el-row>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      @current-change="handleCurrentChange"
    >
      <el-table-column label="统一标识码">
        <template slot-scope="scope">
          {{ scope.row.code }}
        </template>
      </el-table-column>
      <el-table-column label="建筑物名称">
        <template slot-scope="scope">
          {{ scope.row.buildName }}
        </template>
      </el-table-column>
      <el-table-column label="危险源或防护目标(1：危险源，2：防护目标)">
        <template slot-scope="scope">
          {{ scope.row.targetType }}
        </template>
      </el-table-column>
      <el-table-column label="建筑物类型">
        <template slot-scope="scope">
          {{ scope.row.dictBuildId }}
        </template>
      </el-table-column>
      <el-table-column label="级别代码">
        <template slot-scope="scope">
          {{ scope.row.levelCode }}
        </template>
      </el-table-column>
      <el-table-column label="密级代码">
        <template slot-scope="scope">
          {{ scope.row.classCode }}
        </template>
      </el-table-column>
      <el-table-column label="行政区划代码">
        <template slot-scope="scope">
          {{ scope.row.districtCode }}
        </template>
      </el-table-column>
      <el-table-column label="所在道路">
        <template slot-scope="scope">
          {{ scope.row.roadName }}
        </template>
      </el-table-column>
      <el-table-column label="地址">
        <template slot-scope="scope">
          {{ scope.row.address }}
        </template>
      </el-table-column>
      <el-table-column label="值班电话">
        <template slot-scope="scope">
          {{ scope.row.dutyTel }}
        </template>
      </el-table-column>
      <el-table-column label="传真">
        <template slot-scope="scope">
          {{ scope.row.fax }}
        </template>
      </el-table-column>
      <el-table-column label="负责人">
        <template slot-scope="scope">
          {{ scope.row.personName }}
        </template>
      </el-table-column>
      <el-table-column label="负责人办公电话">
        <template slot-scope="scope">
          {{ scope.row.personOtel }}
        </template>
      </el-table-column>
      <el-table-column label="负责人移动电话">
        <template slot-scope="scope">
          {{ scope.row.personMtel }}
        </template>
      </el-table-column>
      <el-table-column label="负责人住宅电话">
        <template slot-scope="scope">
          {{ scope.row.personHtel }}
        </template>
      </el-table-column>
      <el-table-column label="联系人">
        <template slot-scope="scope">
          {{ scope.row.contactper }}
        </template>
      </el-table-column>
      <el-table-column label="联系人办公电话">
        <template slot-scope="scope">
          {{ scope.row.contactperOtel }}
        </template>
      </el-table-column>
      <el-table-column label="联系人移动电话">
        <template slot-scope="scope">
          {{ scope.row.contactperMtel }}
        </template>
      </el-table-column>
      <el-table-column label="联系人住宅电话">
        <template slot-scope="scope">
          {{ scope.row.contactperHtel }}
        </template>
      </el-table-column>
      <el-table-column label="联系人电子邮箱">
        <template slot-scope="scope">
          {{ scope.row.contactperEmail }}
        </template>
      </el-table-column>
      <el-table-column label="主管单位">
        <template slot-scope="scope">
          {{ scope.row.governingEnterprise }}
        </template>
      </el-table-column>
      <el-table-column label="主管单位地址">
        <template slot-scope="scope">
          {{ scope.row.governingEnterpriseAddr }}
        </template>
      </el-table-column>
      <el-table-column label="坐标系统代码">
        <template slot-scope="scope">
          {{ scope.row.coordsyscode }}
        </template>
      </el-table-column>
      <el-table-column label="高程基准代码">
        <template slot-scope="scope">
          {{ scope.row.elevationCode }}
        </template>
      </el-table-column>
      <el-table-column label="人数">
        <template slot-scope="scope">
          {{ scope.row.personNum }}
        </template>
      </el-table-column>
      <el-table-column label="基本情况">
        <template slot-scope="scope">
          {{ scope.row.description }}
        </template>
      </el-table-column>
      <el-table-column label="周边交通状况">
        <template slot-scope="scope">
          {{ scope.row.traffic }}
        </template>
      </el-table-column>
      <el-table-column label="投入使用时间">
        <template slot-scope="scope">
          {{ scope.row.inuseDate }}
        </template>
      </el-table-column>
      <el-table-column label="设计使用年限">
        <template slot-scope="scope">
          {{ scope.row.useYearNum }}
        </template>
      </el-table-column>
      <el-table-column label="应急通信方式">
        <template slot-scope="scope">
          {{ scope.row.emergencyCommunicaMode }}
        </template>
      </el-table-column>
      <el-table-column label="可能受灾形式">
        <template slot-scope="scope">
          {{ scope.row.disasterForm }}
        </template>
      </el-table-column>
      <el-table-column label="防护等级代码">
        <template slot-scope="scope">
          {{ scope.row.defLevelCode }}
        </template>
      </el-table-column>
      <el-table-column label="防护区域">
        <template slot-scope="scope">
          {{ scope.row.defenceArea }}
        </template>
      </el-table-column>
      <el-table-column label="可容纳人数">
        <template slot-scope="scope">
          {{ scope.row.maxPersonNum }}
        </template>
      </el-table-column>
      <el-table-column label="监测方式">
        <template slot-scope="scope">
          {{ scope.row.monitorMode }}
        </template>
      </el-table-column>
      <el-table-column label="防护措施">
        <template slot-scope="scope">
          {{ scope.row.defenceStep }}
        </template>
      </el-table-column>
      <el-table-column label="数据来源单位">
        <template slot-scope="scope">
          {{ scope.row.datasourceUnit }}
        </template>
      </el-table-column>
      <el-table-column label="备注">
        <template slot-scope="scope">
          {{ scope.row.notes }}
        </template>
      </el-table-column>
      <el-table-column label="系统标识符">
        <template slot-scope="scope">
          {{ scope.row.sysFlag }}
        </template>
      </el-table-column>
      <el-table-column label="逻辑删除">
        <template slot-scope="scope">
          {{ scope.row.isDel }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button v-permission="['/bas/build/update']" type="text" size="mini" icon="el-icon-edit" @click.native="editItem(scope.row)">{{ $t('button.edit') }}</el-button>
          <el-button v-permission="['/bas/build/delete']" type="text" size="mini" icon="el-icon-delete" @click.native="removeItem(scope.row)">{{ $t('button.delete') }}</el-button>
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
      @next-click="fetchNext"
    />

    <el-dialog
      :title="formTitle"
      :visible.sync="formVisible"
      width="70%"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="统一标识码">
              <el-input v-model="form.code" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="建筑物名称">
              <el-input v-model="form.buildName" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="危险源或防护目标(1：危险源，2：防护目标)">
              <el-input v-model="form.targetType" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="建筑物类型">
              <el-input v-model="form.dictBuildId" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="级别代码">
              <el-input v-model="form.levelCode" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="密级代码">
              <el-input v-model="form.classCode" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="行政区划代码">
              <el-input v-model="form.districtCode" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所在道路">
              <el-input v-model="form.roadName" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="地址">
              <el-input v-model="form.address" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="值班电话">
              <el-input v-model="form.dutyTel" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="传真">
              <el-input v-model="form.fax" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="负责人">
              <el-input v-model="form.personName" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="负责人办公电话">
              <el-input v-model="form.personOtel" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="负责人移动电话">
              <el-input v-model="form.personMtel" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="负责人住宅电话">
              <el-input v-model="form.personHtel" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人">
              <el-input v-model="form.contactper" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人办公电话">
              <el-input v-model="form.contactperOtel" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人移动电话">
              <el-input v-model="form.contactperMtel" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人住宅电话">
              <el-input v-model="form.contactperHtel" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人电子邮箱">
              <el-input v-model="form.contactperEmail" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="主管单位">
              <el-input v-model="form.governingEnterprise" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="主管单位地址">
              <el-input v-model="form.governingEnterpriseAddr" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="坐标系统代码">
              <el-input v-model="form.coordsyscode" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="高程基准代码">
              <el-input v-model="form.elevationCode" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="人数">
              <el-input v-model="form.personNum" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="基本情况">
              <el-input v-model="form.description" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="周边交通状况">
              <el-input v-model="form.traffic" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="投入使用时间">
              <el-input v-model="form.inuseDate" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设计使用年限">
              <el-input v-model="form.useYearNum" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="应急通信方式">
              <el-input v-model="form.emergencyCommunicaMode" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="可能受灾形式">
              <el-input v-model="form.disasterForm" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="防护等级代码">
              <el-input v-model="form.defLevelCode" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="防护区域">
              <el-input v-model="form.defenceArea" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="可容纳人数">
              <el-input v-model="form.maxPersonNum" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="监测方式">
              <el-input v-model="form.monitorMode" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="防护措施">
              <el-input v-model="form.defenceStep" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="数据来源单位">
              <el-input v-model="form.datasourceUnit" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注">
              <el-input v-model="form.notes" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="系统标识符">
              <el-input v-model="form.sysFlag" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="逻辑删除">
              <el-input v-model="form.isDel" minlength="1" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button type="primary" @click="save">{{ $t('button.submit') }}</el-button>
          <el-button @click.native="formVisible = false">{{ $t('button.cancel') }}</el-button>
        </el-form-item>

      </el-form>
    </el-dialog>
  </div>
</template>

<script src="./mmBasBuild.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
    @import "src/styles/common.scss";
</style>

