<template>
    <div class="app-container">
        <div class="block">
          <el-form label-width="120px" :inline="true">
            <el-form-item label="设备编号">
              <el-input v-model="listQuery.equipCode"  placeholder="请输入编号"></el-input>
            </el-form-item>

            <el-form-item label="报警等级">
              <dict-select v-model="listQuery.alarmLevel" dict-name="报警等级" placeholder="--请选择--"></dict-select>
            </el-form-item>



            <el-form-item label="设备类型">
              <el-select v-model="listQuery.monitorType"  placeholder="--请选择--">

              </el-select>
            </el-form-item>

            <el-form-item label="审核状态">
              <el-select v-model="listQuery.isAudit"  placeholder="--请选择--">
                <el-option
                  v-for="item in check_list"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>

              </el-select>
            </el-form-item>
            <el-form-item style="float: right;margin-right: 100px">
                <el-button type="success" size="mini" icon="el-icon-search" @click.native="search">{{ $t('button.search') }}</el-button>
                <el-button type="primary" size="mini" icon="el-icon-refresh" @click.native="reset">{{ $t('button.reset') }}</el-button>
              </el-form-item>
            <br>
            <el-form-item label="处置状态">
              <el-select v-model="listQuery.isFeedBack"  placeholder="--请选择--">
                <el-option
                  v-for="item in feedback_list"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="报警时间">
              <el-date-picker type="datetime" v-model="listQuery.startTime" value-format="yyyy-MM-dd HH:mm:ss"  placeholder="--请选择--"></el-date-picker>
              <el-date-picker type="datetime" v-model="listQuery.endTime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="--请选择--"></el-date-picker>
            </el-form-item>



          </el-form>

            <br>
            <el-row>
                <el-col :span="24">
                    <el-button type="success" size="mini"  icon="el-icon-plus" @click.native="add" v-permission="['/mmAlarmInfo/check']">审核</el-button>
                    <el-button type="primary" size="mini"  icon="el-icon-plus" @click.native="edit" v-permission="['/mmAlarmInfo/dispose']">处置</el-button>
                    <el-button type="danger" size="mini"  icon="el-icon-plus" @click.native="remove" v-permission="['/mmAlarmInfo/notice']">通知</el-button>
                  <el-button type="danger" size="mini"  icon="el-icon-plus" @click.native="remove" v-permission="['/mmAlarmInfo/event']">生成事件</el-button>
                </el-col>
            </el-row>
        </div>


        <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row
                  @current-change="handleCurrentChange">
          <el-table-column
            type="selection"
            width="55"
            :reserve-selection="true"
          >
          </el-table-column>
          <el-table-column
            type="index"
            width="50"
            label="序号"
          >
          </el-table-column>

            <el-table-column label="设备名称">
                <template slot-scope="scope">
                    {{scope.row.equipment.equipmentName}}
                </template>
            </el-table-column>
          <el-table-column label="设备编号">
            <template slot-scope="scope">
              {{scope.row.equipment.equipmentCode}}
            </template>
          </el-table-column>
            <el-table-column label="报警类型">
                <template slot-scope="scope">
                    {{scope.row.monitorType}}
                </template>
            </el-table-column>
          <el-table-column label="报警位置">
            <template slot-scope="scope">
              {{scope.row.equipment.pointLocation}}
            </template>
          </el-table-column>

          <el-table-column label="报警等级">
            <template slot-scope="scope" >
              {{scope.row.alarmLevelName}}
            </template>
          </el-table-column>
          <el-table-column label="报警值">
            <template slot-scope="scope">
              {{scope.row.alarmValue}}
            </template>
          </el-table-column>

            <el-table-column label="报警时间">
                <template slot-scope="scope">
                    {{scope.row.alarmTime}}
                </template>
            </el-table-column>
          <el-table-column label="审核状态">
            <template slot-scope="scope">
              <template  v-if="scope.row.isAudit === 0">未审核</template>
              <template  v-if="scope.row.isAudit === 1">已审核</template>
            </template>
          </el-table-column>
          <el-table-column label="审核人">
            <template slot-scope="scope">
              {{scope.row.auditPerson}}
            </template>
          </el-table-column>
            <el-table-column label="处置状态">
              <template slot-scope="scope">
                <template  v-if="scope.row.isFeedback === 0">未处置</template>
                <template  v-if="scope.row.isFeedback === 1">已处置</template>
              </template>

            </el-table-column>
            <el-table-column label="操作" width="200px">
                <template slot-scope="scope">
                    <el-button type="text" size="mini">流程</el-button>
                  <el-button type="text" size="mini">监测曲线</el-button>
                  <el-button type="text" size="mini">定位</el-button>
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

        <el-dialog
                :title="formTitle"
                :visible.sync="formVisible"
                width="60%">
            <el-form ref="form" :model="form" :rules="rules" label-width="120px">
                <el-row>
                    <!--<el-col :span="12">
                        <el-form-item label="编号"  >
                            <el-input v-model="form.alarmCode" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="所在分区"  >
                            <el-input v-model="form.districtCode" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="报警设备"  >
                            <el-input v-model="form.equipmentId" minlength=1></el-input>
                        </el-form-item>
                    </el-col>-->
                    <el-col :span="12">
                        <el-form-item label="报警类型"  >
                            <el-select v-model="form.monitorType" minlength=1>
                              <el-option
                                v-for="item in alarm_type"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                              </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                  <el-col :span="12">
                    <el-form-item label="初次报警值"  >
                      <el-input v-model="form.alarmFirstValue" minlength=1></el-input>
                    </el-form-item>
                  </el-col>
                    <el-col :span="12">
                        <el-form-item label="最新报警时间"  >
                            <el-date-picker v-model="form.alarmTime"
                                            class="date_picker"
                                            :picker-options="pickerOptions"
                                            value-format="yyyy/MM/dd" minlength=1></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="报警级别"  >
                            <el-select v-model="form.alarmLevel" minlength=1>
                              <el-option
                                v-for="item in alarm_level"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                              </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                  <el-col :span="12">
                    <el-form-item label="报警实时值"  >
                      <el-input v-model="form.alarmValue" minlength=1></el-input>
                    </el-form-item>
                  </el-col>
                 <!-- <el-col :span="12">
                    <el-form-item label="设备名称"  >
                      <el-input v-model="form" minlength=1></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="设备位置"  >
                      <el-input v-model="form" minlength=1></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="设备类型"  >
                      <el-input v-model="form" minlength=1></el-input>
                    </el-form-item>
                  </el-col>-->
                  <el-col :span="12">
                    <el-form-item label="报警设备"  >
                      <el-input v-model="form.equipmentId" minlength=1></el-input>
                    </el-form-item>
                  </el-col>
                    <!--<el-col :span="12">
                        <el-form-item label="最高级别报警值"  >
                            <el-input v-model="form.alarmMaxValue" minlength=1></el-input>
                        </el-form-item>
                    </el-col>-->
                   <!-- <el-col :span="12">
                        <el-form-item label="最高级别报警时间"  >
                            <el-input v-model="form.alarmMaxTime" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="最高报警级别（字典）"  >
                            <el-input v-model="form.alarmMaxLevel" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="报警解除时间"  >
                            <el-input v-model="form.alarmRelieveTime" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    -->
                  <el-col :span="12">
                    <el-form-item label="审核结果"  >
                      <el-radio-group v-model="form.isDangerSource" minlength=1>
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="审核人"  >
                      <el-input v-model="form.auditPerson" minlength=1></el-input>
                    </el-form-item>
                  </el-col>
                    <el-col :span="12">
                        <el-form-item label="审核意见"  >
                            <el-input v-model="form.auditOpinion" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                   <!-- <el-col :span="12">
                        <el-form-item label="审核人"  >
                            <el-input v-model="form.auditPerson" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="是否进行处置（0：否，1：是）"  >
                            <el-input v-model="form.isFeedback" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="报警解除标识（0：否，1：是）"  >
                            <el-input v-model="form.isRelieve" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="初步判断"  >
                            <el-input v-model="form.prejudgment" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="是否生成事件（0：否，1：是）"  >
                            <el-input v-model="form.isGenEvent" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="报警审核时间"  >
                            <el-input v-model="form.auditTime" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="逻辑删除"  >
                            <el-input v-model="form.isDel" minlength=1></el-input>
                        </el-form-item>
                    </el-col>-->
                </el-row>
                <el-form-item id="myself">
                    <el-button type="primary" @click="save">{{ $t('button.submit') }}</el-button>
                    <el-button @click.native="formVisible = false">{{ $t('button.cancel') }}</el-button>
                </el-form-item>

            </el-form>
        </el-dialog>
    </div>
</template>

<script src="./mmAlarmInfo.js"></script>


<style rel="stylesheet/scss" lang="scss"  >
    @import "src/styles/commonmyself.scss";
</style>

