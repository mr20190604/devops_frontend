<template>
  <div class="app-container">
    <div class="block">
      <el-form label-width="76px" :inline="true">
        <el-row class="hasmarginBottom">
          <el-col :span="5">
            <el-form-item label="建筑名称:">
              <el-input v-model="listQuery.buildName" placeholder="请输入建筑名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="所在地区:">
              <district v-model="listQuery.districtCode" placeholder="请选择所在地区"/>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="防护等级:">
              <dict-select v-model="listQuery.levelCode" dict-name="防护等级"/>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="负责人:">
              <el-input v-model="listQuery.personName" placeholder="请输入负责人"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5">
            <el-form-item label="目标类型:">
              <dict-select v-model="listQuery.targetType" dict-name="防护目标" placeholder="请选择目标类型"/>
            </el-form-item>
          </el-col>
          <el-col :span="18">
            <el-form-item>
              <el-button
                type="primary"
                class="set-common-btn blue-button"
                @click.native="search"
              >{{ $t('button.search') }}
              </el-button>
              <el-button
                class="set-common-btn blank-blue-button"
                @click.native="reset"
              >{{ $t('button.reset') }}
              </el-button>
            </el-form-item>
          </el-col>

        </el-row>
      </el-form>
    </div>
    <div class="table-list">
      <div class="btnLists">
        <el-button
          v-permission="['/bas/build/add']"
          class="set-common-btn blue-button"
          type="success"
          size="mini"
          @click.native="add"
        >{{ $t('button.add') }}
        </el-button>
        <el-button
          v-permission="['/bas/build/delete']"
          class="set-common-btn blank-blue-button"
          type="danger"
          size="mini"
          @click.native="removeBatch"
        >批量删除
        </el-button>
      </div>
      <el-table
        ref="buildTable"
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
        <el-table-column label="建筑名称" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.buildName }}
          </template>
        </el-table-column>
        <el-table-column label="目标类型" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.targetTypeName }}
          </template>
        </el-table-column>
        <el-table-column label="防护等级" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.levelName }}
          </template>
        </el-table-column>
        <el-table-column label="人数" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.personNum }}
          </template>
        </el-table-column>
        <el-table-column label="行政区划" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.districtName }}
          </template>
        </el-table-column>
        <el-table-column label="地址" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.address }}
          </template>
        </el-table-column>
        <el-table-column label="面积(万平方米)" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.engrossArea }}
          </template>
        </el-table-column>
        <el-table-column label="负责人" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.personName }}
          </template>
        </el-table-column>
        <el-table-column label="联系方式" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.personOtel }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              v-permission="['/bas/build/update']"
              type="text"
              size="mini"
              icon="el-icon-edit"
              @click.native="editItem(scope.row)"
            >{{ $t('button.edit') }}
            </el-button>
            <el-button
              v-permission="['/bas/build/delete']"
              type="text"
              size="mini"
              icon="el-icon-delete"
              @click.native="removeItem(scope.row)"
            >{{ $t('button.delete') }}
            </el-button>
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
    <!-- 添加地上建筑物弹框 -->
    <el-dialog
  class="el-dialog-style common-dialog-style"
      :title="formTitle"
      :visible.sync="formVisible"
      width="960px"
    >
    <div class="block">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px" class="align-right has-Label-Width" size="mini">
        <el-row>
          <el-col :span="12">
            <el-form-item label="建筑名称：" prop="buildName">
              <el-input v-model="form.buildName" minlength="1" placeholder="请输入建筑名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="防护等级：" prop="levelCode">
              <dict-select v-model="form.levelCode" dict-name="防护等级"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="目标类型：" prop="targetType">
              <dict-select v-model="form.targetType" dict-name="防护目标" placeholder="请选择目标类型"/>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="height: 53px;">
            <el-form-item label="所在地区：" prop="districtCode">
              <district v-model="form.districtCode" placeholder="请选择所在地区"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="地址：" prop="address">
              <el-input v-model="form.address" minlength="1" placeholder="请输入地址"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="负责人：" prop="personName">
              <el-input v-model="form.personName" minlength="1" placeholder="请输入负责人"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="办公电话：" prop="personOtel">
              <el-input v-model="form.personOtel" minlength="1" placeholder="请输入负责人办公电话"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="人数：" prop="personNum">
              <el-input v-model="form.personNum" minlength="1" placeholder="请输入人数" type="number"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="面积(万平方米)：" prop="engrossArea">
              <el-input v-model="form.engrossArea" minlength="1" placeholder="请输入面积" type="number"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注：">
              <el-input v-model="form.notes" minlength="1" placeholder="请输入备注"/>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item class="dialog-button-list">
            <el-button type="primary" @click="save" class="set-common-btn blue-button">{{ $t('button.submit') }}</el-button>
            <el-button @click.native="formVisible = false" class="set-common-btn blank-blue-button">{{ $t('button.cancel') }}</el-button>
             </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script src="./mmBasBuild.js"></script>

<style rel="stylesheet/scss" lang="scss">
  @import "src/styles/commonmyself.scss";
</style>

