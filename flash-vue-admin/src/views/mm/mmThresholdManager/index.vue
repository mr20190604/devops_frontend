<template>
    <div class="app-container">
        <div class="block">
          <el-form :model="listQuery" ref="listQuery">
            <el-row class="hasmarginBottom">
                <el-col :span="6">
                    <el-form-item label="设备名称：">
                    <el-input v-model="listQuery.equipmentName"  placeholder="请输入设备名称"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="设备编号：">
                    <el-input v-model="listQuery.equipmentCode"  placeholder="请输入设备编号"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="审核状态：">
                    <dict-select v-model="listQuery.dictId" dict-name="阈值审核状态"  placeholder="请输入备名称"/>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="设备类别：">
                    <dict-select dict-name="设备类型" v-model="listQuery.equipmentType"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
              <el-col>
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
            <el-button type="primary" size="mini"  class="set-common-btn blank-blue-button" @click.native="edit" v-permission="['/threshold/manager/update']">{{ $t('button.edit') }}</el-button>
            <el-button type="danger" size="mini"  class="set-common-btn blue-button" @click.native="remove" v-permission="['/threshold/manager/delete']">{{ $t('button.delete') }}</el-button>
      </div>
        <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" border
                  :row-key="row=>row.id"
                  @current-change="handleCurrentChange">

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

            <el-table-column label="阈值状态" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{scope.row.dictIdName}}
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
              {{scope.row.mmBasEquipment.equipmentInstallInfo.installLocation}}
            </template>
          </el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button type="text" size="mini" class="set-common-btn blue-button" @click.native="editItem(scope.row)" v-permission="['/threshold/manager/update']">{{ $t('button.edit') }}</el-button>
                    <el-button type="text" size="mini" class="set-common-btn blank-blue-button" @click.native="removeItem(scope.row)" v-permission="['/threshold/manager/delete']">{{ $t('button.delete') }}</el-button>
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
                width="70%">
            <el-form ref="form" :model="form" :rules="rules" label-width="120px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="一级阈值上限"  >
                            <el-input v-model="form.firstUpperLimit" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="一级阈值下限"  >
                            <el-input v-model="form.firstLowerLimit" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="二级阈值上限"  >
                            <el-input v-model="form.secondUpperLimit" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="二级阈值下限"  >
                            <el-input v-model="form.secondLowerLimit" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="三级阈值上限"  >
                            <el-input v-model="form.thirdUpperLimit" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="三级阈值下限"  >
                            <el-input v-model="form.thirdLowerLimit" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="设备类别"  >
                            <el-input v-model="form.equipmentType" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                  <el-col :span="12">
                    <el-form-item label="设备编号"  >
                      <el-input v-model="form.equipmentType" minlength=1></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-form-item align="center" >
                    <el-button type="primary" @click="save">{{ $t('button.submit') }}</el-button>
                    <el-button @click.native="formVisible = false">{{ $t('button.cancel') }}</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script src="./mmThresholdManager.js"></script>


