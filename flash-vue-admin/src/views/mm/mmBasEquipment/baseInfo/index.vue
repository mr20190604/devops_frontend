<template>
  <div class="app-container">
    <!--查询条件-->
    <div class="block">
      <el-form>
        <el-row>
          <el-col :span="6">
            <el-form-item label="设备类型：">
              <dict-select v-model="listQuery.equipmentType" dict-name="设备类型" placeholder="请选择"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="设备编号：">
              <el-input v-model="listQuery.equipmentCode" placeholder="请输入设备编号"/>
            </el-form-item>
          </el-col>
          <el-col :span="11" style="text-align: right">
            <el-form-item>
              <el-button type="primary" class="set-common-btn blue-button" @click.native="search">{{ $t('button.search')
                }}
              </el-button>
              <el-button class="set-common-btn blank-blue-button" @click.native="reset">{{ $t('button.reset') }}
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row/>
      </el-form>

    </div>
    <!--列表-->
    <div class="table-list outer-table-list">
      <div class="btnLists">
        <el-button v-permission="['/bas/equipment/add']" type="success" class="set-common-btn blue-button"
                   @click="resetForm()" @click.native="add"> 设备入库
        </el-button>
        <el-button v-permission="['/bas/equipment/add']" type="success" class="set-common-btn blue-button"
                   @click="equipmentExamine()"> 设备审核
        </el-button>
        <el-button v-permission="['/bas/equipment/add']" type="success" class="set-common-btn blue-button"
                   @click="equipmentSubmit()"> 设备提交
        </el-button>
        <el-button v-permission="['/bas/equipment/add']" type="success" class="set-common-btn blue-button"
                   @click="equipmentRegister()"> 设备注册
        </el-button>
        <el-button v-if="false" v-permission="['/bas/equipment/delete']" type="danger"
                   class="set-common-btn blank-blue-button" @click.native="removeBatch"> 批量删除
        </el-button>
      </div>
      <el-table
        ref="equipTable"
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
        @current-change="handleCurrentChange"
        @selection-change="handleSelectionChange"
        :row-key="(row) => row.id"
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
        <el-table-column label="设备名称" show-overflow-tooltip width="250px">
          <template slot-scope="scope">
            <span class="updateText" @click="viewEquipemnt(scope.row)">{{ scope.row.equipmentName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="设备编码" show-overflow-tooltip width="200px">
          <template slot-scope="scope">
            {{ scope.row.equipmentCode }}
          </template>
        </el-table-column>
        <el-table-column label="设备类型" show-overflow-tooltip width="200px">
          <template slot-scope="scope">
            {{ scope.row.equipmentTypeName }}
          </template>
        </el-table-column>
        <!-- <el-table-column label="管理单位" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.manageEnterprise }}
          </template>
        </el-table-column>-->
        <el-table-column label="设备状态" show-overflow-tooltip width="150px">
          <template slot-scope="scope">
            {{ scope.row.equipmentStatusName }}
          </template>
        </el-table-column>
        <el-table-column
          label="审核状态"
          prop="tag"
          show-overflow-tooltip
          width="150px"
          :filters="[{ text: '待审核', value: '待审核' }, { text: '审核通过', value: '审核通过' },{ text: '审核未通过', value: '审核未通过' }]"
          :filter-method="filterTag"
        >
          <template slot-scope="scope">
            {{ scope.row.examineStatusName }}
          </template>
        </el-table-column>
        <el-table-column
          label="注册状态"
          show-overflow-tooltip
          width="150px"
          :filters="[{ text: '未注册', value: '未注册' }, { text: '提交', value: '提交' },{ text: '已注册', value: '已注册' },{ text: '关闭', value: '关闭' }]"
          :filter-method="filterRegistStatus"
        >
          <template slot-scope="scope">
            {{ scope.row.registStatusName }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              v-permission="['/bas/equipment/update']"
              type="text"
              size="mini"
              icon="el-icon-edit"
              @click.native="equipmentMaintenance(scope.row.id)"
            >维修
            </el-button>
            <el-button
              v-if="scope.row.equipmentStatus != 321 && scope.row.equipmentStatus != 324 && scope.row.pointLocation"
              v-permission="['/bas/equipment/update']"
              type="text"
              size="mini"
              icon="el-icon-edit"
              @click.native="openReplace(scope.row)"
            >更换
            </el-button>
            <el-button
              v-permission="['/bas/equipment/update']"
              v-if="scope.row.equipmentStatusName=='入库'&&scope.row.examineStatusName==''?true:false"
              type="text"
              size="mini"
              icon="el-icon-edit"
              @click.native="editItem(scope.row)"
            >{{$t('button.edit')}}
            </el-button>
            <el-button
              v-permission="['/bas/equipment/delete']"
              type="text"
              size="mini"
              icon="el-icon-delete"
              @click.native="removeItem(scope.row)"
            >{{ $t('button.delete') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
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
    <!--弹框页面,包括添加和修改页面-->
    <el-dialog
      class="el-dialog-style common-dialog-style"
      :title="formTitle"
      @close="closeDialog"
      :visible.sync="formVisible"
      width="960px">

      <template v-if="formVisible">
        <el-tabs v-model="activeName" type="card" :before-leave="handleClick" style="height:600px">
          <el-tab-pane id="first" label="设备基本信息" name="first"
                       style="height:550px;overflow-y:auto;overflow-x:hidden;visibility: visible">
            <equipmentInfo :disable-flag="isAdd" :base-info="selRow" @getValue="getValue"/>
          </el-tab-pane>
          <el-tab-pane id="second" label="设备安装信息" name="second" style="height: 550px">
            <install :equipment-id="equipmentId" :btnShow="isAdd" @closeDialog="closeDialog" />
          </el-tab-pane>
          <el-tab-pane id="third" label="设备监测类型" name="third" style="height: 550px">
            <monitoring :equipment-id="equipmentId" :is-add="isAdd" @closeDialog="closeDialog"/>
          </el-tab-pane>
        </el-tabs>
      </template>
    </el-dialog>
    <el-dialog :title="replaceTitle" :visible="replaceVisiable" width="75%" class="el-dialog-style common-dialog-style"
               @close="closeReplace()">
      <replace ref="cdRc" :old-info="form" @close-dialog="closeReplaceAndRefresh"/>
    </el-dialog>
    <el-dialog :title="examineTitle" :visible="examineVisible" @close="closeExamine"
               width="55%" class="el-dialog-style common-dialog-style">
      <examine :equipmentIds="equipmentIds" @closeExamine="closeExamine"></examine>

    </el-dialog>
    <el-dialog :title="maintenanceTitle" :visible="maintenanceVisible" @close="closeMaintenance"
               width="55%" class="el-dialog-style common-dialog-style">
      <maintenance :equipmentId="equipmentId" @closeMaintenance="closeMaintenance"></maintenance>

    </el-dialog>
  </div>
</template>

<script src="./baseInfo.js"></script>
