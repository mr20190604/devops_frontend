<template>
    <div class="app-container">
        <div class="block">
          <el-form :model="listQuery" ref="listQuery">
            <el-row class="hasmarginBottom">
                <el-col :span="5">
                    <el-form-item label="设备名称：">
                    <el-input v-model="listQuery.equipmentName"  placeholder="请输入设备名称"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item label="设备编号：">
                    <el-input v-model="listQuery.equipmentCode"  placeholder="请输入设备编号"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item label="审核状态：">
                    <dict-select v-model="listQuery.dictId" dict-name="阈值审核状态"  placeholder="请输入备名称"/>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item label="设备类别：">
                    <dict-select dict-name="设备类型" v-model="listQuery.equipmentType"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
              <el-col :span="23">
                <el-form-item>
                    <el-button type="primary" class="set-common-btn blue-button" @click.native="search">{{ $t('button.search') }}</el-button>
                    <el-button  class="set-common-btn blank-blue-button" @click.native="reset">{{ $t('button.reset') }}</el-button>
                </el-form-item>
             </el-col>
            </el-row>
          </el-form>
        </div>

 <div class="table-list">
      <div class="btnLists">
            <el-button type="success" size="mini"  class="set-common-btn blue-button" @click.native="add" v-permission="['/mmThresholdManager/add']">{{ $t('button.add') }}</el-button>
            <el-button type="primary" size="mini"  class="set-common-btn blank-blue-button" @click.native="examine" v-permission="['/threshold/manager/update']">批量审核</el-button>
            <!--<el-button type="danger" size="mini"  class="set-common-btn blue-button" @click.native="remove" v-permission="['/threshold/manager/delete']">{{ $t('button.delete') }}</el-button>-->
      </div>
        <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" border
                  :row-key="row=>row.id"
                  @current-change="handleCurrentChange"
                  @selection-change="handleSelectionChange"
                  @row-click="toggleSelection"
                  ref="thresholdTable">

          <el-table-column
            type="selection"
            width="55"
            :reserve-selection="true"
          ></el-table-column>
            <el-table-column type="index" width="55px" label="序号"></el-table-column>
            <el-table-column label="设备类别" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{scope.row.equipmentTypeName}}
                </template>
            </el-table-column>
            <el-table-column label="设备名称" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{scope.row.mmBasEquipment.equipmentName}}
                </template>
            </el-table-column>
            <el-table-column label="设备编号" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{scope.row.mmBasEquipment.equipmentCode}}
                </template>
            </el-table-column>

            <el-table-column label="审核状态" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{scope.row.dictIdName}}
                </template>
            </el-table-column>
          <el-table-column label="审核结果" show-overflow-tooltip>
            <template slot-scope="scope">
              <template  v-if="scope.row.isAudit === 1">通过</template>
              <template  v-if="scope.row.isAudit === 0">不通过</template>
            </template>
          </el-table-column>
          <el-table-column label="审核意见" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.auditOpinion}}
            </template>
          </el-table-column>
            <el-table-column label="审核日期" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{scope.row.auditTime}}
                </template>
            </el-table-column>
            <el-table-column label="审核人" show-overflow-tooltip>
                <template slot-scope="scope">
                    <template v-if="scope.row.auditUser != null">{{scope.row.auditUser.name}}</template>
                </template>
            </el-table-column>
          <el-table-column label="设备位置" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.installInfo.installLocation}}
            </template>
          </el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button type="text" size="mini" icon="el-icon-edit" @click.native="editItem(scope.row)" v-permission="['/threshold/manager/update']">{{ $t('button.edit') }}</el-button>
                    <el-button type="text" size="mini" icon="el-icon-delete" @click.native="removeItem(scope.row)" v-permission="['/threshold/manager/delete']">{{ $t('button.delete') }}</el-button>
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
      <!--新增-->
       <!-- 添加阈值弹框 -->
        <el-dialog
        class="el-dialog-style common-dialog-style"
                :title="formTitle"
                :visible.sync="formVisible"
                width="960px">
                <div class="block">
            <el-form ref="form" :model="form"  label-width="120px" :rules="thresholdRules" class="align-right has-Label-Width">
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="设备类别："  prop="equipmentType">
                      <el-select v-model="form.equipmentType" filterable placeholder="请选择" @change="selectEquipment" :disabled="!isAdd">
                        <el-option
                          v-for="item in equipment_type"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="设备编号：" prop="equipmentCode" >
                      <el-select v-model="form.equipmentCode" filterable placeholder="请选择" :disabled="!isAdd">
                        <el-option
                          v-for="item in equipment_code"
                          :key="item.id"
                          :label="item.equipmentCode"
                          :value="item.id">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                    <el-col :span="12">
                        <el-form-item label="一级阈值上限：" prop="firstUpperLimit" >
                            <el-input v-model="form.firstUpperLimit" minlength=1 oninput="value=value.replace(/[^(\-|\+)?\d+(\.\d+)]/g,'')"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="一级阈值下限："  prop="firstLowerLimit">
                            <el-input v-model="form.firstLowerLimit" minlength=1 oninput="value=value.replace(/[^(\-|\+)?\d+(\.\d+)]/g,'')"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="二级阈值上限："  >
                            <el-input v-model="form.secondUpperLimit" minlength=1 oninput="value=value.replace(/[^(\-|\+)?\d+(\.\d+)]/g,'')"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="二级阈值下限："  >
                            <el-input v-model="form.secondLowerLimit" minlength=1 oninput="value=value.replace(/[^(\-|\+)?\d+(\.\d+)]/g,'')"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="三级阈值上限："  >
                            <el-input v-model="form.thirdUpperLimit" minlength=1 oninput="value=value.replace(/[^(\-|\+)?\d+(\.\d+)]/g,'')"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="三级阈值下限："  >
                            <el-input v-model="form.thirdLowerLimit" minlength=1 oninput="value=value.replace(/[^(\-|\+)?\d+(\.\d+)]/g,'')"></el-input>
                        </el-form-item>
                    </el-col>

                </el-row>
                <el-form-item class="dialog-button-list">
                    <el-button type="primary" @click="save" class="set-common-btn blue-button">{{ $t('button.submit') }}</el-button>
                    <el-button @click.native="formVisible = false" class="set-common-btn blank-blue-button">{{ $t('button.cancel') }}</el-button>
                </el-form-item>
            </el-form>
                </div>
        </el-dialog>
      <!--编辑-->
     
      <el-dialog
      class="el-dialog-style common-dialog-style"
        :title="formTitle"
        :visible.sync="thresholdVisible"
        width="960px">
        <div class="table-list" style="margin-bottom: 50px;width:800px;margin:15px auto 0">
        <el-table :data="thresholdList" v-loading="listLoading" element-loading-text="Loading" border
                  :row-key="row=>row.id"
                  @current-change="handleCurrentChange"
                  max-height="331px"
                  style="height:auto"
                  >

          <el-table-column type="index" width="55px" label="序号"></el-table-column>
          <el-table-column label="设备类别" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.equipmentTypeName}}
            </template>
          </el-table-column>
          <el-table-column label="设备名称" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.mmBasEquipment.equipmentName}}
            </template>
          </el-table-column>
          <el-table-column label="设备编号" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.mmBasEquipment.equipmentCode}}
            </template>
          </el-table-column>
          <el-table-column label="一级下限" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.firstLowerLimit}}
            </template>
          </el-table-column>
          <el-table-column label="一级上限" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.firstUpperLimit}}
            </template>
          </el-table-column>
          <el-table-column label="二级下限" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.secondLowerLimit}}
            </template>
          </el-table-column>
          <el-table-column label="二级上限" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.secondUpperLimit}}
            </template>
          </el-table-column>
          <el-table-column label="三级下限" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.thirdLowerLimit}}
            </template>
          </el-table-column>
          <el-table-column label="三级上限" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.thirdUpperLimit}}
            </template>
          </el-table-column>
        </el-table>
      

  <el-pagination
    background
    class="outer-pagenation"
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
  <div class="block">
  <el-form ref="thresholdForm" :model="thresholdForm" label-width="80px" class="align-right has-Label-Width" :rules="examineRules">
    <el-row>
    <el-col>
      <el-form-item label="审核结果："  prop="isAudit">
        <el-select v-model="thresholdForm.isAudit" minlength=1>
          <el-option key="1" label="通过" value="1" ></el-option>
          <el-option key="0" label="不通过" value="0" ></el-option>
        </el-select>
      </el-form-item>
    </el-col>
 </el-row>
 <el-row>
      <el-col>
        <el-form-item label="审核意见："  prop="auditOpinion">
          <el-input type="textarea" v-model="thresholdForm.auditOpinion" minlength=1></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item id="myself" class="dialog-button-list">
      <el-button type="primary" @click="saveThreshold" class="set-common-btn blue-button">{{ $t('button.submit') }}</el-button>
      <el-button @click.native="thresholdVisible = false" class="set-common-btn blank-blue-button">{{ $t('button.cancel') }}</el-button>
    </el-form-item>
  </el-form>
  </div>

      </el-dialog>

    </div>
</template>

<script src="./mmThresholdManager.js"></script>


<style rel="stylesheet/scss" lang="scss" scoped>
    @import "src/styles/commonmyself.scss";
</style>

