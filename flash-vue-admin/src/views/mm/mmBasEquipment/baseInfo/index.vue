<template>
  <div class="app-container">
    <!--查询条件-->
    <div class="block">
      <el-form label-width="76px" class="align-right has-Label-Width">
        <el-row class="hasmarginBottom">
          <el-col :span="5">
            <el-form-item label="设备类型：">
              <dict-select v-model="listQuery.equipmentType" dict-name="设备类型" placeholder="请选择" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="设备编号：">
              <el-input v-model="listQuery.equipmentCode" placeholder="请输入设备编号" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="设备状态：" placeholder="请选择设备状态">
              <dict-select
                v-model="listQuery.equipmentStatus1"
                dict-name="设备状态"
              />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="审核状态：" placeholder="请选择审核状态">
              <dict-select
                v-model="listQuery.examineStatus"
                dict-name="审核状态"
              />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="注册状态：">
              <dict-select
                v-model="listQuery.registStatus"
                dict-name="注册状态"
              />
            </el-form-item>
          </el-col>
          <el-col :span="18" style="text-align: right">
            <el-form-item>
              <el-button type="primary" class="set-common-btn blue-button" @click.native="search">{{ $t('button.search')
              }}
              </el-button>
              <el-button class="set-common-btn blank-blue-button" @click.native="reset">{{ $t('button.reset') }}
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row />
      </el-form>

    </div>
    <!--列表-->
    <div class="table-list outer-table-list">
      <div class="btnLists">
        <el-button
          v-permission="['/bas/equipment/add']"
          type="success"
          class="set-common-btn blue-button"
          @click.native="add"
        > 设备入库
        </el-button>
        <el-button
          v-permission="['/bas/equipment/add']"
          type="success"
          class="set-common-btn blue-button"
          @click="equipmentSubmit()"
        > 设备提交
        </el-button>
        <el-button
          v-permission="['/bas/equipment/add']"
          type="success"
          class="set-common-btn blue-button"
          @click="equipmentExamine()"
        > 设备审核
        </el-button>
        <el-button
          v-permission="['/bas/equipment/add']"
          type="success"
          class="set-common-btn blue-button"
          @click="equipmentRegister()"
        > 设备注册
        </el-button>
        <el-button
          v-if="false"
          v-permission="['/bas/equipment/delete']"
          type="danger"
          class="set-common-btn blank-blue-button"
          @click.native="removeBatch"
        > 批量删除
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
        :row-key="(row) => row.id"
        :default-expand-all="false"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
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
            <template v-if="scope.row.equipmentType==367">气相色谱质谱联用仪</template>
            <template v-if="scope.row.equipmentType==368">有机硫监测仪</template>
            <template v-if="scope.row.equipmentType==369">甲烷非甲烷总烃</template>
            <template v-if="scope.row.equipmentType==370">气象五参数</template>
            <template v-if="scope.row.equipmentType==371">常规六参数</template>
          </template>
        </el-table-column>
        <!-- <el-table-column label="管理单位" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.manageEnterprise }}
          </template>
        </el-table-column>-->
        <el-table-column label="设备状态" show-overflow-tooltip width="150px">
          <template slot-scope="scope">
            <template v-if="scope.row.equipmentStatus==321">入库</template>
            <template v-if="scope.row.equipmentStatus==322">离线</template>
            <template v-if="scope.row.equipmentStatus==323">上线</template>
            <template v-if="scope.row.equipmentStatus==324">报废</template>
          </template>
        </el-table-column>
        <el-table-column label="审核状态" show-overflow-tooltip width="150px">
          <template slot-scope="scope">
            <template v-if="scope.row.examineStatus==252">待审核</template>
            <template v-if="scope.row.examineStatus==253">审核通过</template>
            <template v-if="scope.row.examineStatus==254">审核未通过</template>
          </template>
        </el-table-column>
        <el-table-column label="注册状态" show-overflow-tooltip width="150px">
          <template slot-scope="scope">
            <template v-if="scope.row.registStatus==574">未注册</template>
            <template v-if="scope.row.registStatus==575">提交</template>
            <template v-if="scope.row.registStatus==576">已注册</template>
            <template v-if="scope.row.registStatus==577">关闭</template>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.maintenanceStatus == 580"
              v-permission="['/bas/equipment/update']"
              type="text"
              size="mini"
              icon="el-icon-edit"
              @click.native="registerEquipment(scope.row)"
            >设备上线
            </el-button>
            <el-button
              v-if="scope.row.equipmentStatusName!='报废'?true:false"
              v-permission="['/bas/equipment/update']"
              type="text"
              size="mini"
              icon="el-icon-edit"
              @click.native="equipmentMaintenance(scope.row)"
            >维修
            </el-button>
            <el-button
              v-if="scope.row.equipmentStatus != 321 && scope.row.equipmentStatus != 323 && scope.row.pointLocation"
              v-permission="['/bas/equipment/update']"
              type="text"
              size="mini"
              icon="el-icon-edit"
              @click.native="openReplace(scope.row)"
            >更换
            </el-button>
            <el-button
              v-if="scope.row.equipmentStatus==321 &&scope.row.examineStatus==null?true:false"
              v-permission="['/bas/equipment/update']"
              type="text"
              size="mini"
              icon="el-icon-edit"
              @click.native="editItem(scope.row)"
            >{{ $t('button.edit') }}
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
      :visible.sync="formVisible"
      width="960px"
      @close="closeDialog"
    >

      <template v-if="formVisible">
        <el-tabs v-model="activeName" type="card" :before-leave="handleClick" style="height:600px">
          <el-tab-pane
            id="first"
            label="设备基本信息"
            name="first"
            style="height:550px;overflow-y:auto;overflow-x:hidden;visibility: visible"
          >
            <equipmentInfo :disable-flag="isAdd" :base-info="selRow" @getValue="getValue" />
          </el-tab-pane>
          <el-tab-pane id="second" label="设备安装信息" name="second" style="height: 550px">
            <install :equipment-id="equipmentId" :btn-show="isAdd" :is-readonly="isAdd" @closeDialog="closeDialog" />
          </el-tab-pane>
          <el-tab-pane id="third" label="设备监测类型" name="third" style="height: 550px">
            <monitoring :equipment-id="equipmentId" :is-add="isAdd" @closeDialog="closeDialog" />
          </el-tab-pane>
        </el-tabs>
      </template>
    </el-dialog>
    <el-dialog
      :title="replaceTitle"
      :visible="replaceVisiable"
      width="75%"
      class="el-dialog-style common-dialog-style"
      @close="closeReplace()"
    >
      <replace ref="cdRc" :old-info="form" @close-dialog="closeReplaceAndRefresh" />
    </el-dialog>
    <el-dialog
      :title="examineTitle"
      :visible="examineVisible"
      width="55%"
      class="el-dialog-style common-dialog-style"
      @close="closeExamine"
    >
      <examine :equipment-ids="equipmentIds" @closeExamine="closeExamine" />

    </el-dialog>
    <el-dialog
      :title="maintenanceTitle"
      :visible="maintenanceVisible"
      width="55%"
      class="el-dialog-style common-dialog-style"
      @close="closeMaintenance"
    >
      <maintenance v-if="maintenanceVisible" :equipment-id="equipmentId" :maintenance-status="maintenanceStatus" @closeMaintenance="closeMaintenance" />

    </el-dialog>
  </div>
</template>

<script src="./baseInfo.js"></script>
