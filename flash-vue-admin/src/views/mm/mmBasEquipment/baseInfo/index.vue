<template>
  <div class="app-container">
    <!--查询条件-->
    <div class="block">
      <el-form>
        <el-row>
           <el-col :span="6">
            <el-form-item label="设备类型：">
              <dict-select dict-name="设备类型" v-model="listQuery.equipmentType" placeholder="请选择"/>
            </el-form-item>
            </el-col>
              <el-col :span="6">
                <el-form-item label="设备编号：">
                  <el-input v-model="listQuery.equipmentCode" placeholder="请输入设备编号"></el-input>
                </el-form-item>
                </el-col>
             <el-col :span="12">
                <el-form-item>
                <el-button type="primary" class="set-common-btn blue-button" @click.native="search">{{ $t('button.search') }}</el-button>
                <el-button class="set-common-btn blank-blue-button" @click.native="reset">{{ $t('button.reset') }}</el-button>
              </el-form-item>
           </el-col>
        </el-row>
        <el-row>
        </el-row>
      </el-form>
      <el-row>
        <el-col :span="24">
        </el-col>
      </el-row>
    </div>
    <!--列表-->
    <div class="table-list">
      <div class="btnLists">
          <el-button v-permission="['/bas/equipment/add']" type="success" class="set-common-btn blue-button" @click="resetForm()" @click.native="add"> {{ $t('button.add') }} </el-button>
          <el-button v-permission="['/bas/equipment/delete']" type="danger" class="set-common-btn blank-blue-button" @click.native="removeBatch" v-if="false"> 批量删除 </el-button>
      </div>
    <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row
              @current-change="handleCurrentChange" @selection-change="handleSelectionChange" ref="equipTable">
      <el-table-column v-if="false"
        type="selection"
        width="55"
        :reserve-selection="true"
      />
      <el-table-column
        type="index"
        width="55"
        label="序号"
      />
      <el-table-column label="设备名称" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.equipmentName}}
        </template>
      </el-table-column>
      <el-table-column label="设备编码" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.equipmentCode}}
        </template>
      </el-table-column>
      <el-table-column label="设备类型" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.equipmentTypeName}}
        </template>
      </el-table-column>
      <el-table-column label="管理单位" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.manageEnterprise}}
        </template>
      </el-table-column>
      <el-table-column label="基本信息" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.baseinfo}}
        </template>
      </el-table-column>

      <el-table-column label="传输频率" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.transmissionFrequency}}
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            v-permission="['/bas/equipment/update']"
            type="text"
            size="mini"
            icon="el-icon-edit"
            @click.native="openReplace(scope.row)"
          >更换
          </el-button>
          <el-button
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
      @next-click="fetchNext">
    </el-pagination>
    </div>
    <!--弹框页面,包括添加和修改页面-->
    <el-dialog
      class="el-dialog-style common-dialog-style"
      :title="formTitle"
      @close="closeDialog"
      :visible.sync="formVisible"
      width="960px">

      <template v-if="formVisible">
        <el-tabs  v-model="activeName" type="card" :before-leave="handleClick"  style="height:600px">
          <el-tab-pane label="设备基本信息" name="first" style="visibility: visible">
             <div class="block">
            <el-form ref="form" :model="form" :rules="rules" label-width="120px" class="align-right has-Label-Width">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="设备名称：">
                    <el-input v-model="form.equipmentName" minlength=1></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="设备编码：">
                    <el-input v-model="form.equipmentCode" minlength=1></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="设备类型：">
                    <dict-select v-model="form.equipmentType" minlength=1 dict-name="设备类型"></dict-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="行政区划：">
                    <district v-model="form.districtCode" minlength=1></district>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="管理单位：">
                    <el-input v-model="form.manageEnterprise" minlength=1></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="基本信息：">
                    <el-input v-model="form.baseinfo" minlength=1></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="技术指标：">
                    <el-input v-model="form.specifications" minlength=1></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="接入设备：">
                    <el-input v-model="form.accessDevice" minlength=1></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="传输通道：">
                    <el-input v-model="form.channel" minlength=1></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="厂商：">
                    <el-input v-model="form.manufacturer" minlength=1></el-input>
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="是否叶子节点：">
                    <template>
                      <el-select v-model="form.isLeaf" placeholder="请选择">
                        <el-option
                          v-for="item in options"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </template>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="传输频率：">
                    <el-input v-model="form.transmissionFrequency"
                              oninput="value=value.replace(/[^0-9]/g,'')"
                              minlength=1  maxlength=5></el-input>
                  </el-form-item>
                </el-col>
                </el-row>
                <el-row>
                <el-col>
                  <el-form-item label="备注：">
                    <el-input v-model="form.notes" minlength=1 type="textarea"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item id="myself" class="dialog-button-list">
                <el-button type="primary" @click="save"  class="set-common-btn blue-button">{{ $t('button.submit') }}</el-button>
                <el-button @click.native="formVisible = false"  class="set-common-btn blank-blue-button">{{ $t('button.cancel') }}</el-button>
              </el-form-item>

            </el-form>
            </div>
          </el-tab-pane>
          <el-tab-pane label="设备安装信息" name="second" id="second"  style="height: 550px">
            <install :equipmentId="equipmentId" :isAdd="isAdd" @closeDialog="closeDialog"></install>
          </el-tab-pane>
          <el-tab-pane label="设备监测类型" name="third" id="third"  style="height: 550px">
            <monitoring :equipmentId="equipmentId" :isAdd="isAdd" @closeDialog="closeDialog"></monitoring>
          </el-tab-pane>
        </el-tabs>
      </template>
    </el-dialog>
    <el-dialog :title="replaceTitle" :visible="replaceVisiable" @close="closeReplace()" width="75%"  class="el-dialog-style common-dialog-style" >
    <replace :old-info="form" @close-dialog="replaceVisiable = false" ref="cdRc"></replace>
    </el-dialog>
  </div>
</template>

<script src="./baseInfo.js"></script>
