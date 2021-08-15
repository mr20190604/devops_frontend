<template>
  <div class="process-report-wrap">
    <div>
      <el-steps :active="stepCount" align-center>
        <el-step title="隐患上报" :description="troubleReportTime()"><i slot="icon" class="step01" /></el-step>
        <el-step title="隐患审核" :description="troubleAuditTime()"><i v-if="auditStatus == 1" slot="icon" class="step02" /><i v-else-if="auditStatus == 0" slot="icon" class="step07" /></el-step>
        <el-step title="隐患处置" :description="troubleHandleTime()"><i v-if="handleStatus == 1" slot="icon" class="step03" /><i v-else-if="handleStatus == 0" slot="icon" class="step08" /></el-step>
      </el-steps>
    </div>
    <div>
      <el-scrollbar style="height: 500px;margin-top:20px">
        <el-card>
          <div slot="header" class="clearfix">
            <span>隐患上报</span>
          </div>
          <div>
            <div class="table-list">
              <el-table v-loading="false" :data="troubleList" max-height="120px" element-loading-text="Loading" border>
                <el-table-column label="上报人" width="80px" align="center" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <template v-if="scope.row.reportUser != null">{{ scope.row.reportUser.name }}</template>
                  </template>
                </el-table-column>
                <el-table-column label="联系电话" width="120px" align="center">
                  <template slot-scope="scope">
                    <template v-if="scope.row.reportUser != null">{{ scope.row.reportUser.phone }}</template>
                  </template>
                </el-table-column>
                <el-table-column label="上报时间" width="180px" align="center">
                  <template slot-scope="scope">
                    {{ scope.row.reportTime }}
                  </template>
                </el-table-column>

                <el-table-column label="隐患类型" width="80px" align="center">
                  <template slot-scope="scope">
                    {{ scope.row.troubleTypeName }}
                  </template>
                </el-table-column>

                <el-table-column label="隐患位置" show-overflow-tooltip>
                  <template slot-scope="scope">
                    {{ scope.row.address }}
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                  <template slot-scope="scope">
                    <el-button type="text" icon="el-icon-view" size="mini" @click.native="previewFile(scope.row)">预览</el-button>
                    <el-button type="text" icon="el-icon-location-outline" size="mini">定位</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-card>

        <el-card>
          <div slot="header" class="clearfix">
            <span>隐患审核</span>
          </div>
          <div v-if="troubleList[0].auditTime != null">
            <div class="table-list">
              <el-table v-loading="false" :data="troubleList" max-height="120px" element-loading-text="Loading" border>
                <el-table-column label="审核人" width="80px" align="center" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <template v-if="scope.row.auditUser != null">{{ scope.row.auditUser.name }}</template>
                  </template>
                </el-table-column>
                <el-table-column label="审核时间" width="180px" align="center">
                  <template slot-scope="scope">
                    {{ scope.row.auditTime }}
                  </template>
                </el-table-column>
                <el-table-column label="审核结果" width="80px" align="center">
                  <template slot-scope="scope">
                    <template v-if="scope.row.auditResult == 0">不通过</template>
                    <template v-if="scope.row.auditResult == 1">通过</template>
                  </template>
                </el-table-column>
                <el-table-column label="隐患等级" width="80px" align="center">
                  <template slot-scope="scope">
                    {{ scope.row.troubleLevelName }}
                  </template>
                </el-table-column>
                <el-table-column label="备注" show-overflow-tooltip>
                  <template slot-scope="scope">
                    {{ scope.row.notes }}
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-card>
        <el-card>
          <div slot="header" class="clearfix">
            <span>隐患处置</span>
          </div>
          <div v-if="troubleHandleList.length > 0">
            <div v-if="troubleHandleList[0].handleStatus > 1">
              <div class="table-list">
                <el-table v-loading="false" :data="troubleHandleList[0].mmInspectionTroubleHandleRecords" class="handleTable" :class="{'showMoreTable':isShowMore}" element-loading-text="Loading" border>
                  <el-table-column label="处置人" width="80px" align="center" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <template v-if="troubleHandleList[0].repairUser != null">{{ troubleHandleList[0].repairUser.name }}</template>
                    </template>
                  </el-table-column>
                  <el-table-column label="处置时间" width="180px" align="center">
                    <template slot-scope="scope">
                      {{ scope.row.handleTime }}
                    </template>
                  </el-table-column>
                  <el-table-column label="处置结果" width="80px" align="center">
                    <template slot-scope="scope">
                      <template v-if="scope.row.handleStatus == 293">待维修</template>
                      <template v-if="scope.row.handleStatus == 294">继续处置</template>
                      <template v-if="scope.row.handleStatus == 295">完成</template>
                    </template>
                  </el-table-column>
                  <el-table-column label="备注" show-overflow-tooltip>
                    <template slot-scope="scope">
                      {{ scope.row.notes }}
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                      <el-button type="text" icon="el-icon-view" size="mini" @click.native="previewFile(scope.row)">预览</el-button>
                      <el-button type="text" icon="el-icon-location-outline" size="mini" @click.native="previewFile(scope.row)">定位</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                 <p class="more-btn" v-if="troubleHandleList[0].mmInspectionTroubleHandleRecords.length>2" @click="showMoreAlarm">更多</p>
              </div>
            </div>
          </div>
        </el-card>
      </el-scrollbar>
    </div>
    <div>
      <!-- 附件预览弹框 -->
      <el-dialog class="el-dialog-style common-dialog-style" :title="fileTitle" :visible.sync="fileVisible" append-to-body="true" width="50%">
        <file-preview :files="files" :download-file-url="downloadUrl" />

      </el-dialog>

    </div>

  </div>

</template>

<script>
import { getApiUrl, getPreviewUrl } from '@/utils/utils'

export default {
  name: 'TroubleProcess',
  props: {
    troubleList: {
      type: Array,
      default: () =>[]
    },
    troubleHandleList: {
      type: Array,
      default:() =>[]
    }

  },
  data() {
    return {
      files: null,
      fileVisible: false,
      fileTitle: '附件预览',
      downloadUrl: '',
      auditStatus: 0,
      handleStatus: 0,
      stepCount: 1,
      isShowMore:false
    }
  },
  created() {

    this.downloadUrl = getApiUrl() + '/file/download?idFile=';
  },
  methods: {
     showMoreAlarm(){
          this.isShowMore = true;
        },
    previewFile(record) {
      this.fileTitle = '附件预览'
      this.files = record.files
      this.fileVisible = true
    },
    troubleReportTime() {
      this.calculateStepCount()
      return this.troubleList[0].reportTime ? this.troubleList[0].reportTime : ''
    },
    troubleAuditTime() {
      return this.troubleList[0].auditTime ? this.troubleList[0].auditTime : ''
    }, troubleHandleTime() {
      if (this.troubleHandleList) {
        if (this.troubleHandleList.length > 0) {
          if (this.troubleHandleList[0].handleStatus == 3) {
            return this.troubleHandleList[0].handleTime
          }
        }
      }
      return ''
    }, calculateStepCount() {
      let index = 1
      if (this.troubleList[0].auditTime) {
        this.auditStatus = 1
        index = 2
      } else {
        this.auditStatus = 0
      }
      let flag = false

      if (this.troubleHandleList) {
        if (this.troubleHandleList.length > 0) {
          if (this.troubleHandleList[0].handleStatus > 1) {
            flag = true
            index = 3
          }
        }
      }
      if (flag) {
        this.handleStatus = 1
      } else {
        this.handleStatus = 0
      }

      this.stepCount = index
    }
  }

}
</script>


<style lang="scss" scoped >
>>> .el-table{
  &.handleTable {
    height: 136px;
    overflow-y: hidden;
  }
  &.showMoreTable{
    height: auto;
  }
}
.more-btn{
  text-align: right;
  color: #409eff;
  cursor: pointer;
  margin-top: 10px;
}
 .el-step.is-horizontal .el-step__line{
    top: 50%;
    left: 94px;
    right: 48px;
  }
.el-step__head.is-process {
  border-color: #dedede;
}
.el-step__head.is-finish {
  border-color: #285edf;
}
.el-step__title.is-process {
  color: #dedede;
}
.el-step__title.is-finish {
  color: #285edf;
}

>>> .el-step.is-center .el-step__description {
  padding-left: 10%;
  padding-right: 10%;
}
</style>