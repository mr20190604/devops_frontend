<template>
    <div class="app-container" style="height: 600px;padding-top: 30px">
      <div class="table-list outer-table-list">
        <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row
                  @current-change="handleCurrentChange">
          <el-table-column
            type="index"
            width="55"
            label="序号"
          />
          <el-table-column label="设备名称" show-overflow-tooltip>
            <template slot-scope="scope">
              <span class="updateText" @click="viewEquipemnt(scope.row)">{{ scope.row.equipmentName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="设备编码" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.equipmentCode }}
            </template>
          </el-table-column>
          <el-table-column label="设备类型" show-overflow-tooltip>
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
          <el-table-column label="设备状态" show-overflow-tooltip>
            <template slot-scope="scope">
              <template v-if="scope.row.equipmentStatus==321">入库</template>
              <template v-if="scope.row.equipmentStatus==322">离线</template>
              <template v-if="scope.row.equipmentStatus==323">上线</template>
              <template v-if="scope.row.equipmentStatus==324">报废</template>
            </template>
          </el-table-column>
          <el-table-column label="审核状态" show-overflow-tooltip>
            <template slot-scope="scope">
              <template v-if="scope.row.examineStatus==252">待审核</template>
              <template v-if="scope.row.examineStatus==253">审核通过</template>
              <template v-if="scope.row.examineStatus==254">审核未通过</template>
            </template>
          </el-table-column>
          <el-table-column label="注册状态" show-overflow-tooltip>
            <template slot-scope="scope">
              <template v-if="scope.row.registStatus==574">未注册</template>
              <template v-if="scope.row.registStatus==575">提交</template>
              <template v-if="scope.row.registStatus==576">已注册</template>
              <template v-if="scope.row.registStatus==577">关闭</template>
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
                        <el-form-item label="设备名称"  >
                            <el-input v-model="form.equipmentName" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="设备编码"  >
                            <el-input v-model="form.equipmentCode" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="点位号（自动生成，唯一）"  >
                            <el-input v-model="form.pointLocation" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="父设备ID"  >
                            <el-input v-model="form.parentId" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="设备类型（字典）"  >
                            <el-input v-model="form.equipmentType" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="行政区划"  >
                            <el-input v-model="form.districtCode" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="设备状态（字典，入库，离线，上线，报废）"  >
                            <el-input v-model="form.equipmentStatus" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="设备运行状态（字典）"  >
                            <el-input v-model="form.equipmentRunStatus" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="设备数据状态（0：中断，1：正常）"  >
                            <el-input v-model="form.dataStatus" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="管理单位"  >
                            <el-input v-model="form.manageEnterprise" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="基本信息"  >
                            <el-input v-model="form.baseinfo" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="技术指标"  >
                            <el-input v-model="form.specifications" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="接入设备"  >
                            <el-input v-model="form.accessDevice" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="传输通道"  >
                            <el-input v-model="form.channel" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="厂商"  >
                            <el-input v-model="form.manufacturer" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="型号"  >
                            <el-input v-model="form.modelNumber" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="精度"  >
                            <el-input v-model="form.accuracy" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="灵敏度"  >
                            <el-input v-model="form.sensitivity" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="供电方式（市电，电池，太阳能）"  >
                            <el-input v-model="form.powerModel" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="供电电压,220V,4.8V"  >
                            <el-input v-model="form.supplyVoltage" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="传输方式：有限网络、有线直连、无线NB-IOT、无线GPRS"  >
                            <el-input v-model="form.transmissionType" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="传输信号强度：0-100"  >
                            <el-input v-model="form.transmissionTransmission" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="传输频率，单位秒"  >
                            <el-input v-model="form.transmissionFrequency" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="欠压保护比"  >
                            <el-input v-model="form.underVoltageProtect" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="检修策略"  >
                            <el-input v-model="form.overhaulStrategy" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="平均检修周期"  >
                            <el-input v-model="form.overhaulCycle" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="是否叶子节点（0：否，1：是）"  >
                            <el-input v-model="form.isLeaf" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="子系统划分"  >
                            <el-input v-model="form.sysFlag" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="备注"  >
                            <el-input v-model="form.notes" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="审核状态：0-待审核，1-审核通过，2-审核未通过"  >
                            <el-input v-model="form.examineStatus" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="注册状态（未注册，提交，已注册，关闭）"  >
                            <el-input v-model="form.registStatus" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="提交注册时间"  >
                            <el-input v-model="form.registDate" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="是否加密（0：否，1：是）"  >
                            <el-input v-model="form.isEncrypt" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="设备生产日期"  >
                            <el-input v-model="form.productDate" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="逻辑删除"  >
                            <el-input v-model="form.isDel" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="所属监测站（保留）"  >
                            <el-input v-model="form.monitorStation" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="设备是否需要默认展现（保留方便演示直接指定设备，0：否，1：是）"  >
                            <el-input v-model="form.isDisplay" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="RFID编号（保留）"  >
                            <el-input v-model="form.rfid" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="二维码编号（保留）"  >
                            <el-input v-model="form.qrCode" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="对应模板xml中的标签类型id"  >
                            <el-input v-model="form.terminalId" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="xml中的扩展参数(json格式字符串)"  >
                            <el-input v-model="form.extenParam" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="xml中terminal的指令(目前只会一个终端一组指令，json字符串存储)"  >
                            <el-input v-model="form.commands" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="安装批次"  >
                            <el-input v-model="form.installBatch" minlength=1></el-input>
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

<script src="./mmBasEquipmentHistory.js"></script>


<style rel="stylesheet/scss" lang="scss" scoped>
    @import "src/styles/common.scss";
</style>

