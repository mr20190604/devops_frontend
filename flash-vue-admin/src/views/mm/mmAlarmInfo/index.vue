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

            <el-form-item style="float: right;margin-right: 100px">
              <el-button type="primary" icon="el-icon-search" @click.native="search">{{ $t('button.search') }}</el-button>
              <el-button  icon="el-icon-refresh" @click.native="reset">{{ $t('button.reset') }}</el-button>
            </el-form-item>


          </el-form>

            <br>
            <el-row>
                <el-col :span="24">
                    <el-button type="success" size="mini"  icon="el-icon-plus" @click.native="add" v-permission="['/mmAlarmInfo/check']">审核</el-button>
                    <el-button type="primary" size="mini"  icon="el-icon-plus" @click.native="dispose()" v-permission="['/mmAlarmInfo/dispose']">处置</el-button>
                    <el-button type="danger" size="mini"  icon="el-icon-plus" @click.native="openAccept()" v-permission="['/mmAlarmInfo/notice']">通知</el-button>
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
                    {{scope.row.monitorTypeName}}
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
            <el-table-column label="处置状态">
              <template slot-scope="scope">
                <template  v-if="scope.row.isFeedback === 0">未处置</template>
                <template  v-if="scope.row.isFeedback === 1">处置中</template>
                <template  v-if="scope.row.isFeedback === 2">已处置</template>
              </template>

            </el-table-column>
            <el-table-column label="操作" width="200px">
                <template slot-scope="scope">
                    <el-button type="text" size="mini" @click="openProcess(scope.row)">流程</el-button>
                  <el-button type="text" size="mini" @click="openCurve(scope.row)">监测曲线</el-button>
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

                  <el-col :span="12">
                    <el-form-item label="报警设备"  >
                      <el-input v-model="form.equipmentId" minlength=1></el-input>
                    </el-form-item>
                  </el-col>

                  <el-col :span="12">
                    <el-form-item label="审核结果"  >
                      <el-select v-model="form.auditStatus" minlength=1>
                        <el-option key="1" label="确认报警" value="1" ></el-option>
                        <el-option key="0" label="误报" value="0" ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="审核人"  >
                      <el-input v-model="form.auditPerson" minlength=1></el-input>
                    </el-form-item>
                  </el-col>
                    <el-col :span="12">
                        <el-form-item label="审核意见"  >
                            <el-input type="textarea" v-model="form.auditOpinion" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item id="myself">
                    <el-button type="primary" @click="save">{{ $t('button.submit') }}</el-button>
                    <el-button @click.native="formVisible = false">{{ $t('button.cancel') }}</el-button>
                </el-form-item>

            </el-form>
        </el-dialog>

      <el-dialog
        :title="disposeTitle"
        :visible.sync="disposeVisible"
        width="60%">
        <div id="disposeDiv" v-show="vShow">
          <el-form ref="disposeForm" :model="disposeForm" :rules="rules" label-width="120px">
            <el-row>
              <el-col :span="12">
                <el-form-item label="处置状态"  >
                  <el-select v-model="disposeForm.handleStatus" minlength=1>
                    <el-option key="1" label="处置中" value="1"></el-option>
                    <el-option key="2" label="已处置" value="2"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-button type="primary" @click="addDispose()">处置</el-button>

              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="处置说明"  >
                  <el-input type="textarea" v-model="disposeForm.handleConent" minlength=1></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="选择文件"  >
                  <el-upload
                    :action="uploadUrl"
                    :headers="uploadHeaders"
                    :on-change="handleChangeUpload"
                    accept=".doc,.docx,.pdf,.zip,.rar"
                    :on-remove="removeFile"
                    :file-list="fileList"
                    :multiple="multiple"
                  >
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" >最大上传大小10Mb</div>
                  </el-upload>
                </el-form-item>
              </el-col>
            </el-row>

          </el-form>
        </div>

        <el-table :data="disposeList" v-loading="disposeLoading" element-loading-text="Loading" border fit>
          <el-table-column label="处置时间">
            <template slot-scope="scope">
              {{scope.row.createTime}}
            </template>
          </el-table-column>

          <el-table-column label="处置人">
            <template slot-scope="scope">
              {{scope.row.user.name}}
            </template>
          </el-table-column>

          <el-table-column label="处置说明">
            <template slot-scope="scope">
              {{scope.row.handleConent}}
            </template>
          </el-table-column>
          <el-table-column label="处置状态">
            <template slot-scope="scope">
              <template v-if="scope.row.handleStatus == 1" id="handleStatus1">处置中</template>
              <template v-if="scope.row.handleStatus == 2" id="handleStatus2">已处置</template>
            </template>
          </el-table-column>
          <el-table-column label="附件">
            <template slot-scope="scope">
              <el-button type="text" size="mini" icon="el-icon-view" @click.native="previewFile(scope.row)" >预览</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
      <el-dialog
        :title="previewTitle"
        :visible.sync="previewVisible"
        width="60%"style="margin-top: 0px;">

        <el-row style="width: 100%;height: 600px">
          <el-col style="width: 25%;height: 620px">
            <div class="grid-content bg-purple" >
              <el-table :data="files" v-loading="fileLoading" element-loading-text="Loading">
                <el-table-column label="附件名称">
                  <template slot-scope="scope">
                    <div @click="viewFile(scope.row)">
                      {{scope.row.fileInfo.originalFileName}}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button type="text" size="mini" icon="el-icon-download"  @click.native="downloads(scope.row)" >下载</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-col>
          <el-col style="width: 75%;height: 600px;padding-top: 20px">
            <div class="grid-content bg-purple">
              <preview :previewStyle="previewStyle" :previewFileUrl="previewFileUrl"></preview>
            </div>

          </el-col>
        </el-row>
      </el-dialog>
      <el-dialog
        :title="acceptTitle"
        :visible.sync="acceptVisible"
        width="40%"style="margin-top: 0px;">

        <div style="padding-left: 10%">
          <template>
            <el-transfer
              v-model="value"
              :titles="['接收人列表','接收人']"
              :data="acceptPerson"
            ></el-transfer>
          </template>
        </div>

        <div>

          <el-form ref="acceptForm" :model="acceptForm" :rules="rules" label-width="120px">
            <el-row>
              <el-col style="padding-top: 20px" :span="20">
                <el-form-item label="通知内容"  >
                  <el-input type="textarea" v-model="acceptForm.noticeContent" minlength=1></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="20">
                <el-form-item align="center">
                  <el-button type="primary" @click="msgSend()">发送</el-button>
                  <el-button  @click="acceptVisible = false">取消</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-dialog>

       <el-dialog
      :title="formTitle"
      :visible.sync="processVisiable"
      width="60%"
    >
      <div>
        <process :checkList="checkList" :disposeList="disposeList" :acceptList="acceptList"></process>
      </div>

    </el-dialog>

      <el-dialog
        :title="formTitle"
        :visible.sync="echartVisiable"
        width="50%"
      >
        <div style="padding-left: 10px">
          <el-form  :inline="true">
            <el-form-item>
              <el-button  icon="el-icon-search" >本日</el-button>
              <el-button  icon="el-icon-search" >本周</el-button>
              <el-button  icon="el-icon-search" >本月</el-button>
            </el-form-item>
            <el-form-item label="">
              <el-date-picker type="datetime"  value-format="yyyy-MM-dd HH:mm:ss"  placeholder="--请选择--"></el-date-picker>
              <el-date-picker type="datetime"  value-format="yyyy-MM-dd HH:mm:ss" placeholder="--请选择--"></el-date-picker>
            </el-form-item>
            <el-button type="primary" icon="el-icon-search" >{{ $t('button.search') }}</el-button>
          </el-form>

        </div>

        <div align="center" style="width: 100%">
          <v-chart :options="lineData" ref="myEchart" style="width: 80%;"/>
        </div>
      </el-dialog>


    </div>
</template>

<script src="./mmAlarmInfo.js"></script>


<style rel="stylesheet/scss" lang="scss" >
    @import "src/styles/commonmyself.scss";
</style>

