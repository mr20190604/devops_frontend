<template>
  <div class="app-container">
    <div class="block">
      <el-form label-width="76px" :inline="true">
        <el-row class="hasmarginBottom">
          <el-col :span="5">
            <el-form-item label="设施编码：">
              <el-input v-model="listQuery.equipCode" placeholder="请输入编号" />
            </el-form-item>
          </el-col>
          <el-col :span="5">

            <el-form-item label="报警等级：">
              <dict-select v-model="listQuery.alarmLevel" dict-name="报警等级" placeholder="--请选择--" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="监测类型：">
              <dict-select v-model="listQuery.monitorType" dict-name="设备类型" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="排查状态：">
              <dict-select v-model="listQuery.screenStatus" dict-name="排查状态" />
            </el-form-item>

          </el-col>
        </el-row>

        <el-row class="hasmarginBottom">
          <el-col :span="5">
            <el-form-item label="处置状态：">
              <el-select v-model="listQuery.isFeedBack" placeholder="--请选择--">
                <el-option
                  v-for="item in feedback_list"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="5">
            <el-form-item label="解除状态：">
              <el-select v-model="listQuery.isRelieve" placeholder="--请选择--">
                <el-option
                  v-for="item in relieve_list"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
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
                end-placeholder="结束日期"
              />
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
        <el-button v-permission="['/mmAlarmHandle/screen']" class="set-common-btn blue-button" @click.native="openAccept">现场排查</el-button>
        <el-button v-permission="['/mmAlarmHandle/handle']" class="set-common-btn blank-blue-button" @click.native="dispose()">现场处置</el-button>
      </div>
      <el-table
        ref="alarmTable"
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
        :row-key="getRowKey"
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

        <el-table-column label="设备名称" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.equipment.equipmentName }}
          </template>
        </el-table-column>
        <el-table-column label="设备编号" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.equipment.equipmentCode }}
          </template>
        </el-table-column>
        <el-table-column label="报警类型" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.monitorTypeName }}
          </template>
        </el-table-column>
        <el-table-column label="报警位置" show-overflow-tooltip>
          <template slot-scope="scope">
            <template v-if="scope.row.equipment.equipmentInstallInfos != null">{{ scope.row.equipment.equipmentInstallInfos[0].installLocation }}</template>
          </template>
        </el-table-column>

        <el-table-column label="报警等级" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.alarmLevelName }}
          </template>
        </el-table-column>
        <el-table-column label="报警值" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.alarmValue }}<template v-if="scope.row.equipment.equipmentInstallInfos != null">{{ scope.row.equipment.equipmentInstallInfos[0].equipmentUnit }}</template>
          </template>
        </el-table-column>

        <el-table-column label="报警时间" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.alarmTime }}
          </template>
        </el-table-column>
        <el-table-column label="排查状态" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.screenStatusName }}
          </template>
        </el-table-column>
        <el-table-column label="排查结果" show-overflow-tooltip>
          <template slot-scope="scope">
            <template v-if="scope.row.mmAlarmScreenInfos != null">
              <template v-if="scope.row.mmAlarmScreenInfos[0] != null">
                <template v-if="scope.row.mmAlarmScreenInfos[0].screenResult === 0 ">误报</template>
                <template v-if="scope.row.mmAlarmScreenInfos[0].screenResult === 1 ">确认报警</template>

              </template>
            </template>
          </template>
        </el-table-column>
        <el-table-column label="处置状态" align="center" width="100px">
          <template slot-scope="scope">
            <template v-if="scope.row.isFeedback === 0">未处置</template>
            <template v-if="scope.row.isFeedback === 1">处置中</template>
            <template v-if="scope.row.isFeedback === 2">已处置</template>
          </template>
        </el-table-column>
        <el-table-column label="解除状态" show-overflow-tooltip>
          <template slot-scope="scope">
            <template v-if="scope.row.isRelieve === 0 ">未解除</template>
            <template v-if="scope.row.isRelieve === 1 ">已解除</template>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="268" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="mini" icon="el-icon-paperclip" @click="openProcess(scope.row)">流程</el-button>
            <el-button type="text" icon="el-icon-s-marketing" size="mini" @click="openCurve(scope.row)">监测曲线</el-button>
            <el-button type="text" icon="el-icon-location-outline" size="mini">定位</el-button>
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
        @next-click="fetchNext"
      />
    </div>

    <!--附件预览弹窗-->
    <el-dialog
      :title="previewTitle"
      :visible.sync="previewVisible"
      class="el-dialog-style common-dialog-style"
      width="60%"
      style="margin-top: 0px;"
    >
      <file-preview :files="files" :download-file-url="downloadUrl" />
    </el-dialog>

    <!--现场排查-->
    <el-dialog
      class="el-dialog-style common-dialog-style"
      :title="acceptTitle"
      :visible.sync="acceptVisible"
      width="960px"
    >
      <div class="block">
        <el-form :model="screenForm">
          <el-row>
            <el-col :span="12">
              <el-form-item label="排查人：">
                <el-select v-model="screenForm.screenPerson" @change="changeScreenPerson">
                  <el-option
                    v-for="item in acceptPerson"
                    :key="item.key"
                    :label="item.label"
                    :value="item.key"
                  />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="联系电话：">
                <el-input v-model="screenForm.screenPhone" disabled minlength="1" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item class="dialog-button-list">
                <el-button class="set-common-btn blue-button" @click.native="updateScreen">确定</el-button>
                <el-button class="set-common-btn blank-blue-button" @click.native="acceptVisible = false">取消</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>

    </el-dialog>

    <!--现场处置-->
    <el-dialog
      class="el-dialog-style common-dialog-style"
      :title="disposeTitle"
      :visible.sync="disposeVisible"
      width="960px"
    >

      <div class="block">
        <el-form :model="handleForm">
          <el-row>
            <el-col :span="12">
              <el-form-item label="出质人：">
                <el-select v-model="handleForm.handlePerson" @change="changeHandlePerson">
                  <el-option
                    v-for="item in handlePerson"
                    :key="item.key"
                    :label="item.label"
                    :value="item.key"
                  />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="联系电话：">
                <el-input v-model="handleForm.handlePhone" disabled minlength="1" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item class="dialog-button-list">
                <el-button class="set-common-btn blue-button" @click.native="updateHandlePerson">确定</el-button>
                <el-button class="set-common-btn blank-blue-button" @click.native="acceptVisible = false">取消</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-dialog>

    <!--报警流程弹窗-->
    <el-dialog
      :title="formTitle"
      class="el-dialog-style common-dialog-style"
      :visible.sync="processVisiable"
      width="960px"
    >
      <div class="marginT26">
        <process :check-list="checkList" :dispose-list="disposeList" :screen-list="screenList" />
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
          <el-form :inline="true" style="width:900px">
            <el-row>
              <el-col :span="6">
                <el-form-item>
                  <ul class="date-ul-change">
                    <li :class="dateCur==0?'isFocus':'isNotFocus'" @click="day()">今日</li>
                    <li :class="dateCur==1?'isFocus':''" @click="OneWeeks()">本周</li>
                    <li :class="dateCur==2?'isFocus':''" @click="month()">本月</li>
                  </ul>
                </el-form-item>
              </el-col>
              <el-col :span="12">

                <el-form-item label="">
                  <el-date-picker
                    v-model="modelTime"
                    size="mini"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    end-placeholder="结束日期"
                  />

                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-button type="primary" class="set-common-btn blue-button" @click.native="searchData">{{ $t('button.search') }}</el-button>
                <el-button class="set-common-btn blank-blue-button" @click.native="resetModel">{{ $t('button.reset') }}</el-button>
              </el-col>
            </el-row>
          </el-form>

        </div>

        <div align="center" style="width: 100%">
          <v-chart ref="myEchart" :options="lineData" style="width: 100%;" />
        </div>
      </div>
    </el-dialog>

    <el-dialog
      class="dialogTitleBackground dialogTitle"
      :title="genEventTitle"
      :visible.sync="genEventVisible"
    >
      <genEvent v-if="genEventVisible" :alarm-row="selRow" @closeGenEvent="closeGenEvent" />
    </el-dialog>

  </div>
</template>

<script src="./mmAlarmHandle.js"></script>
<style lang="scss" scoped>
*{
  margin: 0;
  padding: 0;
}
.common-dialog-style.chart-dialog-style .block .el-form .el-row .el-col:nth-of-type(even){
  display: initial;
}
.date-ul-change{
  display: flex;
  // width: 196px;
  border-radius: 0 4px 4px 0;
  li{
    // padding: 0 20px;
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

