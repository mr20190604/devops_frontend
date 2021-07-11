<template>
    <div class="app-container">
        <div class="block">
          <el-form label-width="76px" :inline="true">
            <el-row class="hasmarginBottom">
              <el-col :span="5">
                <el-form-item label="设施编码：">
                  <el-input v-model="listQuery.equipCode"  placeholder="请输入编号"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="5">

                <el-form-item label="报警等级：">
                  <dict-select v-model="listQuery.alarmLevel" dict-name="报警等级" placeholder="--请选择--"></dict-select>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="监测类型：">
                 <dict-select dict-name="设备类型" v-model="listQuery.monitorType"></dict-select>
                </el-form-item>
              </el-col>


              <el-col :span="5">
                <el-form-item label="审核状态：">
                  <el-select v-model="listQuery.isAudit"  placeholder="--请选择--">
                    <el-option
                      v-for="item in check_list"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>

                  </el-select>
                </el-form-item>

              </el-col>
            </el-row>

            <el-row class="hasmarginBottom">
              <el-col :span="5">
                <el-form-item label="审核结果：">
                  <el-select v-model="listQuery.auditStatus"  style="width: 100%"
                             :size="size"  placeholder="--请选择--">
                    <el-option
                      v-for="item in audit_list"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="5">
                <el-form-item label="解除状态：">
                  <el-select v-model="listQuery.isRelieve"  placeholder="--请选择--">
                    <el-option
                      v-for="item in relieve_list"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>

              </el-col>

              <el-col :span="14">
                <el-form-item label="报警时间：">
                  <el-date-picker
                    v-model="listQuery.searchTime"
                    size="mini"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    end-placeholder="结束日期">
                  </el-date-picker>
                </el-form-item>

              </el-col>
        </el-row>
        <el-row>
                <el-col :span="23">
                  <el-form-item>
                    <el-button type="primary" class="set-common-btn blue-button" @click.native="search">{{ $t('button.search') }}</el-button>
                    <el-button class="set-common-btn blank-blue-button" @click.native="reset">{{ $t('button.reset') }}</el-button>
                  </el-form-item>
                </el-col>

            </el-row>

          </el-form>

        </div>
      <div class="table-list">
      <div class="btnLists">
          <el-button type="success" class="set-common-btn blue-button" @click.native="add" v-permission="['/mmAlarmInfo/check']">审核</el-button>
           <!--<el-button type="primary" class="set-common-btn blank-blue-button" @click.native="dispose()" v-permission="['/mmAlarmInfo/dispose']">处置</el-button>-->
          <el-button type="danger" class="set-common-btn blue-button" @click.native="openAccept()" v-permission="['/mmAlarmInfo/notice']">通知</el-button>
          <!--<el-button type="danger" class="set-common-btn blank-blue-button" @click.native="openGenEvent()" v-permission="['/mmAlarmInfo/saveEventAndFiles']">生成事件</el-button>-->
      </div>
        <el-table :data="list" ref="alarmTable" v-loading="listLoading" element-loading-text="Loading" border fit
                  @current-change="handleCurrentChange" :row-key="getRowKey"
                  @selection-change="handleSelectionChange"
                  @row-click="toggleSelection"
        >
          <el-table-column
            type="selection"
            width="55"
            :reserve-selection="true"
          >
          </el-table-column>
          <el-table-column
            type="index"
            width="55"
            label="序号"
          >
          </el-table-column>
          <!--<el-table-column label="设施名称" >-->
            <!--<template slot-scope="scope">-->
            <!--</template>-->
          <!--</el-table-column>-->
          <!--<el-table-column label="设施类型" width="80px" align="center">-->
            <!--<template slot-scope="scope">-->
            <!--</template>-->
          <!--</el-table-column>-->

            <el-table-column label="设备名称" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{scope.row.equipment.equipmentName}}
                </template>
            </el-table-column>
          <el-table-column label="设备编号" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.equipment.equipmentCode}}
            </template>
          </el-table-column>
            <el-table-column label="报警类型" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{scope.row.monitorTypeName}}
                </template>
            </el-table-column>
          <el-table-column label="报警位置" show-overflow-tooltip>
            <template slot-scope="scope">
              <template >{{scope.row.alarmLocation}}</template>
            </template>
          </el-table-column>

          <el-table-column label="报警等级" show-overflow-tooltip>
            <template slot-scope="scope" >
              {{scope.row.alarmLevelName}}
            </template>
          </el-table-column>
          <el-table-column label="报警值"  show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.alarmValue}}<template v-if="scope.row.equipment.equipmentInstallInfos != null">{{scope.row.equipment.equipmentInstallInfos[0].equipmentUnit}}</template>
            </template>
          </el-table-column>

            <el-table-column label="报警时间" sortable width="160px" >
                <template slot-scope="scope">
                    {{scope.row.alarmTime}}
                </template>
            </el-table-column>
          <el-table-column label="审核状态"  show-overflow-tooltip style="width: 100px" align="center">
            <template slot-scope="scope">
              <template  v-if="scope.row.isAudit === 0">未审核</template>
              <template  v-if="scope.row.isAudit === 1">已审核</template>
            </template>
          </el-table-column>
          <el-table-column label="审核结果"  show-overflow-tooltip style="width: 100px" align="center">
            <template slot-scope="scope">
              <template  v-if="scope.row.auditStatus === 0">误报</template>
              <template  v-if="scope.row.auditStatus === 1">确认报警</template>
            </template>
          </el-table-column>
          <el-table-column label="解除状态"  show-overflow-tooltip style="width: 100px" align="center">
            <template slot-scope="scope">
              <template  v-if="scope.row.isRelieve === 0 ">未解除</template>
              <template  v-if="scope.row.isRelieve === 1 ">已解除</template>
            </template>
          </el-table-column>
            <!--<el-table-column label="处置状态" align="center" width="100px">-->
              <!--<template slot-scope="scope">-->
              <!--<template  v-if="scope.row.isFeedback === 0">未处置</template>-->
              <!--<template  v-if="scope.row.isFeedback === 1">处置中</template>-->
              <!--<template  v-if="scope.row.isFeedback === 2">已处置</template>-->
            <!--</template>-->

            <!--</el-table-column>-->
            <el-table-column label="操作" width="268" align="center">
                <template slot-scope="scope">
                  <el-button type="text" size="mini" icon="el-icon-paperclip" @click="openProcess(scope.row)">流程</el-button>
                  <el-button type="text" icon="el-icon-s-marketing"  size="mini" @click="openCurve(scope.row)">监测曲线</el-button>
                  <el-button type="text" icon="el-icon-location-outline"  size="mini">定位</el-button>
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
      <!--报警审核弹窗-->
        <el-dialog
        class="el-dialog-style common-dialog-style"
                :title="formTitle"
                :visible.sync="formVisible"
                onclose="cancle"
                width="960px">
                <div class="block">
            <el-form ref="form" :model="form" :rules="rules" label-width="98px" class="align-right has-Label-Width">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="报警类型："  >
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
                    <el-form-item label="初次报警值："  >
                      <el-input v-model="form.alarmFirstValue" minlength=1></el-input>
                    </el-form-item>
                  </el-col>
                    <el-col :span="12">
                        <el-form-item label="最新报警时间："  >
                            <el-date-picker v-model="form.alarmTime"
                                            class="date_picker"
                                            value-format="yyyy/MM/dd" minlength=1></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="报警级别："  >
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
                    <el-form-item label="报警实时值："  >
                      <el-input v-model="form.alarmValue" minlength=1></el-input>
                    </el-form-item>
                  </el-col>

                  <el-col :span="12">
                    <el-form-item label="报警设备："  >
                      <el-input v-model="form.equipmentName" minlength=1></el-input>
                    </el-form-item>
                  </el-col>

                  <el-col :span="12">
                    <el-form-item label="审核结果："  >
                      <el-select v-model="form.auditStatus" minlength=1>
                        <el-option key="1" label="确认报警" value="1" ></el-option>
                        <el-option key="0" label="误报" value="0" ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">

                  </el-col>

                </el-row>

              <el-row>
                <el-col>
                  <el-form-item label="审核意见："  >
                    <el-input type="textarea" v-model="form.auditOpinion" minlength=1></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
                <el-form-item id="myself"  class="dialog-button-list">
                    <el-button type="primary" @click="save" class="set-common-btn blue-button">{{ $t('button.submit') }}</el-button>
                    <el-button @click.native="cancle" class="set-common-btn blank-blue-button">{{ $t('button.cancel') }}</el-button>
                </el-form-item>

            </el-form>
            </div>
        </el-dialog>

      <!--报警处置弹窗-->
      <el-dialog
       class="el-dialog-style common-dialog-style"
        :title="disposeTitle"
        :visible.sync="disposeVisible"
        width="960px">
        <div id="disposeDiv" v-show="vShow" class="block">
          <el-form ref="disposeForm" :model="disposeForm" :rules="rules" label-width="78px">
            <el-row>
              <el-col :span="12">
                <el-form-item label="处置状态"  >
                  <el-select v-model="disposeForm.handleStatus" minlength=1>
                    <el-option key="1" label="处置中" value="1"></el-option>
                    <el-option key="2" label="已处置" value="2"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-button type="primary" @click="addDispose()" class="set-common-btn blue-button">处置</el-button>

              </el-col>
            </el-row>
            <el-row>
              <el-col>
                <el-form-item label="处置说明"  >
                  <el-input type="textarea" v-model="disposeForm.handleConent" minlength=1></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col>
                <el-form-item label="选择文件"  >
                  <el-upload
                    :action="uploadUrl"
                    :headers="uploadHeaders"
                    :on-change="handleChangeUpload"
                    :accept="fileAccept"
                    :on-remove="removeFile"
                    :file-list="fileList"
                    :multiple="multiple"
                  >
                    <el-button size="small" type="primary" class="set-common-btn blue-button">点击上传</el-button>
                    <div slot="tip" >总上传大小50M，单个文件最大10M,<template>允许的文件类型为</template><span style="color: red">{{fileAccept}}</span></div>
                  </el-upload>
                </el-form-item>
              </el-col>
            </el-row>

          </el-form>
        </div>
<div class="table-list">
        <el-table :data="disposeList" v-loading="disposeLoading" element-loading-text="Loading" border fit>
          <el-table-column label="处置时间" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.createTime}}
            </template>
          </el-table-column>

          <el-table-column label="处置人" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.user.name}}
            </template>
          </el-table-column>

          <el-table-column label="处置说明" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.handleConent}}
            </template>
          </el-table-column>
          <el-table-column label="处置状态" show-overflow-tooltip>
            <template slot-scope="scope">
              <template v-if="scope.row.handleStatus == 1" id="handleStatus1">处置中</template>
              <template v-if="scope.row.handleStatus == 2" id="handleStatus2">已处置</template>
            </template>
          </el-table-column>
          <el-table-column label="附件" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-button type="text" size="mini" icon="el-icon-view" @click.native="previewFile(scope.row)" >预览</el-button>
            </template>
          </el-table-column>
        </el-table>
</div>
      </el-dialog>

      <!--附件预览弹窗-->
      <el-dialog
      class="el-dialog-style common-dialog-style"
        :title="previewTitle"
        :visible.sync="previewVisible"
        width="60%" style="margin-top: 0px;">
        <file-preview :files="files" :download-file-url="downloadUrl"></file-preview>
      </el-dialog>

      <!--信息发送弹窗-->
      <el-dialog
      class="el-dialog-style common-dialog-style send-dialog-style"
        :title="acceptTitle"
        :visible.sync="acceptVisible"
        width="740px">
     
        <div>
          <template>
            <el-transfer
            class="marginT20"
              v-model="value"
              :titles="['接收人列表','接收人']"
              :data="acceptPerson"
            ></el-transfer>
          </template>
        </div>

        <div>
          <div class="block">
          <el-form ref="acceptForm" :model="acceptForm" :rules="rules" label-width="78px" class="align-right has-Label-Width" style="width:auto;padding-left:0;padding-right:0;">
            <el-row>
              <el-col>
                <el-form-item label="通知内容："  >
                  <el-input type="textarea" v-model="acceptForm.noticeContent" minlength=1 style="width:583px"></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col>
                <el-form-item align="center" class="dialog-button-list">
                  <el-button type="primary" @click="msgSend()" class="set-common-btn blue-button">发送</el-button>
                  <el-button  @click="acceptVisible = false" class="set-common-btn blank-blue-button">取消</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          </div>
        </div>
      </el-dialog>

      <!--报警流程弹窗-->
       <el-dialog
       class="el-dialog-style common-dialog-style"
      :title="formTitle"
      :visible.sync="processVisiable"
      width="960px"
    >
      <div class="marginT26">
        <process :checkList="checkList" :disposeList="disposeList" :screenList="screenList"></process>
      </div>

    </el-dialog>
<!--监测曲线弹窗-->
      <el-dialog
      class="el-dialog-style common-dialog-style chart-dialog-style"
        :title="formTitle"
        :visible.sync="echartVisiable"
        width="960px"
        @close="clearData"
      >
        <div class="app-container">
        <div class="block">
          <el-form  :inline="true" style="width:900px">
            <el-form-item>
               <ul class="date-ul-change">
                <li @click="day()" :class="dateCur==0?'isFocus':''">今日</li>
                <li @click="OneWeeks()"  :class="dateCur==1?'isFocus':''">本周</li>
                <li @click="month()"  :class="dateCur==2?'isFocus':''">本月</li>
              </ul>
           
            </el-form-item>
            <el-form-item label="">
              <el-date-picker el-date-picker
                              v-model="modelTime"
                              size="mini"
                              :picker-options="pickerOptions"
                              type="datetimerange"
                              range-separator="至"
                              start-placeholder="开始日期"
                              value-format="yyyy-MM-dd HH:mm:ss"
                              end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
            <el-button type="primary" class="set-common-btn blue-button" @click.native="searchData">{{ $t('button.search') }}</el-button>
            <el-button  class="set-common-btn blank-blue-button " @click.native="resetModel">{{ $t('button.reset') }}</el-button>

          </el-form>

        </div>

        <div align="center" style="width: 100%">
          <v-chart :options="lineData" ref="myEchart" style="width: 90%;"/>
        </div>
        </div>
      </el-dialog>

      <el-dialog class="dialogTitleBackground dialogTitle"
        :title="genEventTitle"
        :visible.sync="genEventVisible"
      >
        <genEvent v-if="genEventVisible" :alarmRow="selRow" @closeGenEvent="closeGenEvent"></genEvent>
      </el-dialog>

    </div>
</template>

<script src="./mmAlarmInfo.js"></script>
<style lang="scss" scoped>
*{
  margin: 0;
  padding: 0;
}
 .send-dialog-style{
   >>> .el-dialog__body{
     padding-left:33px;
   }
>>> .el-transfer{
  width: 583px;
 
 margin-left: 77px;
}
}

.common-dialog-style.chart-dialog-style .block .el-form .el-row .el-col:nth-of-type(even){
  display: initial;
}
.date-ul-change{
  display: flex;
  // width: 196px;
  border-radius: 0 4px 4px 0;
  li{
    /*padding: 0 20px;*/
    width: 64px;
    text-align: center;
    font-size: 12px;
    height: 28px;
    line-height: 28px;
    list-style: none;
    border:  1px solid #DCDFE6;
    border-right: none;
    cursor: pointer;
    transition: all .3s cubic-bezier(.645,.045,.355,1);
    &:last-child{
     border-right:  1px solid #DCDFE6;
     border-radius: 0px 4px 4px 0;
    }
    &.isFocus{
          color: #FFF;
    background-color: #409EFF;
    border-color: #409EFF;
    }
    &:nth-of-type(1){
      border-radius: 4px 0px 0px 4px;
      
    }
  }

}
</style>

