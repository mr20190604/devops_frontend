<template>
    <div class="app-container">
        <div class="block">
          <el-form label-width="76px" :inline="true">
            <el-row class="hasmarginBottom">
              <el-col :span="6">
                <el-form-item label="设施编码：">
                  <el-input v-model="listQuery.equipCode"  placeholder="请输入编号"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">

                <el-form-item label="报警等级：">
                  <dict-select v-model="listQuery.alarmLevel" dict-name="报警等级" placeholder="--请选择--"></dict-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="监测类型：">
                 <dict-select dict-name="设备类型" v-model="listQuery.monitorType"></dict-select>
                </el-form-item>
              </el-col>


              <el-col :span="6">
                <el-form-item label="排查状态：">
                <dict-select  dict-name="排查状态" v-model="listQuery.screenStatus"></dict-select>
                </el-form-item>

              </el-col>
            </el-row>

            <el-row class="hasmarginBottom">
              <el-col :span="6">
                <el-form-item label="处置状态：">
                  <el-select v-model="listQuery.isFeedBack"  placeholder="--请选择--">
                    <el-option
                      v-for="item in feedback_list"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="6">
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

              <el-col :span="10">
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
                <el-col>
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
          <el-button  class="set-common-btn blue-button" @click.native="openAccept" v-permission="['/mmAlarmHandle/screen']">现场排查</el-button>
           <el-button  class="set-common-btn blank-blue-button" @click.native="dispose()" v-permission="['/mmAlarmHandle/handle']">现场处置</el-button>
      </div>
        <el-table :data="list" ref="alarmTable" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row
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
              <template v-if="scope.row.equipment.equipmentInstallInfos != null">{{scope.row.equipment.equipmentInstallInfos[0].installLocation}}</template>
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

            <el-table-column label="报警时间" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{scope.row.alarmTime}}
                </template>
            </el-table-column>
          <el-table-column label="排查状态"  show-overflow-tooltip>
            <template slot-scope="scope">
            {{scope.row.screenStatusName}}
            </template>
          </el-table-column>
          <el-table-column label="排查结果"  show-overflow-tooltip>
            <template slot-scope="scope">
              <template v-if="scope.row.mmAlarmScreenInfos != null">
                <template v-if="scope.row.mmAlarmScreenInfos[0] != null">
                  <template  v-if="scope.row.mmAlarmScreenInfos[0].screenResult === 0 ">误报</template>
                  <template  v-if="scope.row.mmAlarmScreenInfos[0].screenResult === 1 ">确认报警</template>

                </template>
              </template>
            </template>
          </el-table-column>
          <el-table-column label="处置状态" align="center" width="100px">
            <template slot-scope="scope">
              <template  v-if="scope.row.isFeedback === 0">未处置</template>
              <template  v-if="scope.row.isFeedback === 1">处置中</template>
              <template  v-if="scope.row.isFeedback === 2">已处置</template>
            </template>
          </el-table-column>
          <el-table-column label="解除状态"  show-overflow-tooltip>
            <template slot-scope="scope" >
              <template  v-if="scope.row.isRelieve === 0 ">未解除</template>
              <template  v-if="scope.row.isRelieve === 1 ">已解除</template>
            </template>
          </el-table-column>
            <el-table-column label="操作" width="220px" align="center">
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

      <!--报警处置弹窗-->
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
                    :accept="fileAccept"
                    :on-remove="removeFile"
                    :file-list="fileList"
                    :multiple="multiple"
                  >
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" >总上传大小50M，单个文件最大10M,<template>允许的文件类型为</template><span style="color: red">{{fileAccept}}</span></div>
                  </el-upload>
                </el-form-item>
              </el-col>
            </el-row>

          </el-form>
        </div>

        <el-table :data="disposeList" v-loading="disposeLoading" element-loading-text="Loading" max-height="200px" border fit>
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

      <!--附件预览弹窗-->
      <el-dialog
        :title="previewTitle"
        :visible.sync="previewVisible"
        width="60%" style="margin-top: 0px;">
        <file-preview :files="files" :download-file-url="downloadUrl"></file-preview>
      </el-dialog>

      <!--现场排查-->
      <el-dialog
        :title="acceptTitle"
        :visible.sync="acceptVisible"
        width="40%" style="margin-top: 0px;">
        <div align="center">
          <el-form :model="screenForm">
            <el-row>
              <el-col :span="12">
                <el-form-item  label="排查人">
                  <el-select v-model="screenForm.screenPerson" @change="changeScreenPerson">
                    <el-option
                      v-for="item in acceptPerson"
                      :key="item.key"
                      :label="item.label"
                      :value="item.key"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item  label="联系电话">
                  <el-input  v-model="screenForm.screenPhone" disabled  minlength=1></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item>
                  <el-button  class="set-common-btn blue-button" @click.native="updateScreen" >确定</el-button>
                  <el-button  class="set-common-btn blank-blue-button" @click.native="acceptVisible = false" >取消</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>

      </el-dialog>

      <!--报警流程弹窗-->
       <el-dialog
      :title="formTitle"
      :visible.sync="processVisiable"
      width="60%"
    >
      <div>
        <process :checkList="checkList" :disposeList="disposeList" :screenList="screenList"></process>
      </div>

    </el-dialog>

      <!--监测曲线弹窗-->
      <el-dialog
        :title="formTitle"
        :visible.sync="echartVisiable"
        width="50%"
        @close="clearData"
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

      <el-dialog class="dialogTitleBackground dialogTitle"
        :title="genEventTitle"
        :visible.sync="genEventVisible"
      >
        <genEvent v-if="genEventVisible" :alarmRow="selRow" @closeGenEvent="closeGenEvent"></genEvent>
      </el-dialog>

    </div>
</template>

<script src="./mmAlarmHandle.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped >
  @import "src/styles/commonmyself.scss";
</style>



