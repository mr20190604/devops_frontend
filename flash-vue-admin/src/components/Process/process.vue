<template>
  <div>
    <div>
      <el-steps :active="stepCount" align-center>
        <el-step title="监测报警" :description="assignmentAlarmTime()"><i  class="step01" slot="icon"></i></el-step>
        <el-step title="报警审核" :description="assignmentAuditTime()"><i v-if="auditStatus == 1" class="step02" slot="icon"></i><i v-else-if="auditStatus == 0" class="step07" slot="icon"></i></el-step>
        <el-step title="报警排查" :description="assignmentScreenTime()"><i v-if="screenStatus == 1" class="step03" slot="icon"></i><i v-else-if="screenStatus == 0" class="step08" slot="icon"></i></el-step>
        <el-step title="报警处置" :description="assignmentHandleTime()"><i v-if="handleStatus == 1" class="step04" slot="icon"></i><i v-else-if="handleStatus == 0" class="step09" slot="icon"></i></el-step>
        <el-step title="报警解除" :description="assignmentRelieveTime()"><i v-if="relieveStatus == 1" class="step05" slot="icon"></i><i v-else-if="relieveStatus == 0" class="step10" slot="icon"></i></el-step>
      </el-steps>
    </div>



    <div>
      <el-scrollbar  style="height: 500px;margin-top:20px">
      <el-card >
        <div slot="header" class="clearfix">
          <span>监测报警</span>
        </div>
        <div>
       <div class="table-list">
          <el-table :data="checkList" v-loading="false" max-height="100px" element-loading-text="Loading" border>
            <el-table-column label="设备名称" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.equipment.equipmentName}}
              </template>
            </el-table-column>
            <el-table-column label="报警位置" show-overflow-tooltip>
              <template slot-scope="scope">
                <template v-if="scope.row.equipment.equipmentInstallInfos != null">{{scope.row.equipment.equipmentInstallInfos[0].installLocation}}</template>
              </template>
            </el-table-column>
            <el-table-column label="报警时间" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.alarmTime}}
              </template>
            </el-table-column>

            <el-table-column label="报警等级" width="80px" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.alarmLevelName}}
              </template>
            </el-table-column>

            <el-table-column label="报警值" width="80px" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.alarmValue}}<template v-if="scope.row.equipment.equipmentInstallInfos != null">{{scope.row.equipment.equipmentInstallInfos[0].equipmentUnit}}</template>
              </template>
            </el-table-column>

            <el-table-column label="审核状态" width="80px" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <template  v-if="scope.row.isAudit === 0">未审核</template>
                <template  v-if="scope.row.isAudit === 1">已审核</template>
              </template>
            </el-table-column>

            <el-table-column label="解除状态" width="80px" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <template  v-if="scope.row.isRelieve === 0 ">未解除</template>
                <template  v-if="scope.row.isRelieve === 1 ">已解除</template>
              </template>
            </el-table-column>
          </el-table>
       </div>
        </div>
      </el-card>
      <el-card >
        <div slot="header" class="clearfix">
          <span>报警审核</span>
        </div>
        <div v-if="checkList[0].isAudit == 1">
          <div class="table-list">
          <el-table :data="checkList" v-loading="false" max-height="100px" element-loading-text="Loading" border >
            <el-table-column label="审核人" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.auditUser.name}}
              </template>
            </el-table-column>
            <el-table-column label="审核时间" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.auditTime}}
              </template>
            </el-table-column>
            <el-table-column label="审核值" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.auditValue}}<template v-if="scope.row.equipment.equipmentInstallInfos != null">{{scope.row.equipment.equipmentInstallInfos[0].equipmentUnit}}</template>
              </template>
            </el-table-column>
            <el-table-column label="审核结果" show-overflow-tooltip>
              <template slot-scope="scope">
                <template v-if="scope.row.auditStatus == 0" id="audit1">误报</template>
                <template v-if="scope.row.auditStatus == 1" id="audit2">确认报警</template>
              </template>
            </el-table-column>

            <el-table-column label="审核意见" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.auditOpinion}}
              </template>
            </el-table-column>

          </el-table>
          </div>
        </div>
      </el-card>
      <el-card >
        <div slot="header" class="clearfix">
          <span>报警排查</span>
        </div>
        <div v-if="checkList[0].screenStatus == 258">
          <div class="table-list">
          <el-table :data="screenList" v-loading="false" max-height="120px" element-loading-text="Loading" border>
            <el-table-column label="排查人" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.screenUser.name}}
              </template>
            </el-table-column>
            <el-table-column label="排查时间" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.screenTime}}
              </template>
            </el-table-column>
            <el-table-column label="排查结果" show-overflow-tooltip>
              <template slot-scope="scope">
                <template v-if="scope.row.screenResult == 0" >误报</template>
                <template v-if="scope.row.screenResult == 1" >确认报警</template>
              </template>
            </el-table-column>
            <el-table-column label="备注" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.remark}}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="220px" align="center">
              <template slot-scope="scope">
                <el-button type="text" icon="el-icon-view" @click.native="previewFile(scope.row)"  size="mini">预览</el-button>
              </template>
            </el-table-column>
          </el-table>
          </div>
        </div>
      </el-card>
      <el-card >
        <div slot="header" class="clearfix">
          <span>报警处置</span>
        </div>
        <div v-if="checkList[0].isFeedback > 0">
          <div class="table-list">
          <el-table :data="disposeList" v-loading="false" max-height="200px" element-loading-text="Loading" border>
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

            <el-table-column label="操作" width="220px" align="center">
              <template slot-scope="scope">
                <el-button type="text" icon="el-icon-view" @click.native="previewFile(scope.row)"  size="mini">预览</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        </div>
      </el-card>

      <el-card >
        <div slot="header" class="clearfix">
          <span>报警解除</span>
        </div>
        <div v-if="checkList[0].isRelieve == 1">
          <div class="table-list">
          <el-table :data="checkList" v-loading="false" max-height="120px" element-loading-text="Loading" border>
            <el-table-column label="解除人" show-overflow-tooltip>
              <template slot-scope="scope">
                <template v-if="scope.row.relieveUser != null">{{scope.row.relieveUser.name}}</template>
                <template v-if="scope.row.relieveUser == null">system</template>
              </template>
            </el-table-column>

            <el-table-column label="解除时间" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.relieveTime}}
              </template>
            </el-table-column>

            <el-table-column label="解除意见" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.relieveOpinion}}
              </template>
            </el-table-column>
            <!--<el-table-column label="操作" width="220px" align="center">-->
            <!--<template slot-scope="scope">-->
            <!--<el-button type="text" icon="el-icon-view" @click.native="previewFile(scope.row)"  size="mini">预览</el-button>-->
            <!--</template>-->
            <!--</el-table-column>-->
          </el-table>
        </div>
        </div>
      </el-card>
      </el-scrollbar>
    </div>
    <div>
      <el-dialog :title="fileTitle" :visible.sync="fileVisible" :modal-append-to-body="false" width="50%">
        <file-preview :files="files"  :download-file-url="downloadUrl">
        </file-preview>

      </el-dialog>
    </div>

  </div>

</template>



<script>
  import { getApiUrl, getPreviewUrl } from '@/utils/utils'

    export default {
        name: "process",
        props:
          {
            checkList:{
              type:Array,
              default:""
            },disposeList:{
              type:Array,
              default:""
            },screenList:{
              type:Array,
              default:""
            }

            },
        data(){
          return {
            files:null,
            fileVisible:false,
            fileTitle:'附件预览',
            downloadUrl:'',
            alarmTime:'',
            auditTime:'',
            screenTime:'',
            handleTime:'',
            relieveTime:'',
            stepCount:1,
            auditStatus:0,
            screenStatus:0,
            handleStatus:0,
            relieveStatus:0
          }
        },

      created() {
          this.downloadUrl = getApiUrl() + '/file/download?idFile='
      },
      methods:{
        previewFile(record) {
            this.fileTitle = '附件预览'
            this.files = record.files
            this.fileVisible = true
          },
        assignmentAlarmTime() {
          this.calculateStepCount();
          return this.checkList[0].alarmTime ? this.checkList[0].alarmTime:'';
        },
        assignmentAuditTime() {
          return this.checkList[0].auditTime ? this.checkList[0].auditTime:''
        },
        assignmentScreenTime() {
          if (this.screenList) {
            if (this.screenList.length == 0) {
              return ''
            } else if (this.checkList[0].screenStatus != 258 ) {
              return ''
            }
          }

          return this.screenList[0].screenTime ? this.screenList[0].screenTime:''
        },
        assignmentHandleTime() {
          if (this.disposeList) {
            if (this.disposeList.length == 0) {
              return ''
            }
          }

          if (this.checkList[0].isFeedback == 2) {
            return this.disposeList[this.disposeList.length-1].createTime
          } else {
            return ''
          }
        },
        assignmentRelieveTime() {
          return this.checkList[0].relieveTime ? this.checkList[0].relieveTime:''
        },calculateStepCount() {
          let index = 1
          if (this.checkList[0].isAudit == 1) {
            this.auditStatus = 1;
            index = 2
          } else {
            this.auditStatus = 0;
          }
          if (this.checkList[0].screenStatus == 258) {
            this.screenStatus = 1;
            index = 3
          } else {
            this.screenStatus = 0;
          }

          if (this.checkList[0].isFeedback > 0) {
            this.handleStatus = 1;
            index = 4
          } else {
            this.handleStatus = 0;
          }
          if (this.checkList[0].isRelieve == 1) {
            this.relieveStatus = 1;
            index = 5
          } else {
            this.relieveStatus = 0;
          }
          this.stepCount = index
        }
      }
    }
</script>

<style lang="scss" scoped >
>>> .el-scrollbar__wrap{
  overflow-x: hidden;
  .el-scrollbar__bar.is-horizontal{
    display: none;
  }
}
.el-card{
  margin-bottom: 10px;
}
  >>> .el-card__header{
    padding: 0 10px;
    border-bottom: 1px solid #EBEEF5;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    height: 30px;
    line-height: 30px;
    color: #409EFF;
  }

>>> .el-step{
  .el-step__icon{
    width: 50px;
    height: 50px;
    border: none;
    border-radius: 0%;
    margin-top: -15px;
    i{
      display: block;
      width: 100%;
      height: 100%;
      &.step01{
        background:url("~@/assets/img/buzhouyi.png") no-repeat center;
        background-size: cover;
      }
      &.step02{
        background:url("~@/assets/img/buzhouer.png") no-repeat center;
        background-size: cover;
      }
      &.step03{
        background:url("~@/assets/img/buzhousan.png") no-repeat center;
        background-size: cover;
      }
      &.step04{
        background:url("~@/assets/img/buzhousi.png") no-repeat center;
        background-size: cover;
      }
      &.step05{
        background:url("~@/assets/img/buzhouwu.png") no-repeat center;
        background-size: cover;
      }
      &.step06{
        background:url("~@/assets/img/监测报警暗.png") no-repeat center;
        background-size: cover;
      }
      &.step07{
        background:url("~@/assets/img/报警审核暗.png") no-repeat center;
        background-size: cover;
      }
      &.step08{
        background:url("~@/assets/img/报警排查暗.png") no-repeat center;
        background-size: cover;
      }
      &.step09{
        background:url("~@/assets/img/报警处置暗.png") no-repeat center;
        background-size: cover;
      }
      &.step10{
        background:url("~@/assets/img/报警解除暗.png") no-repeat center;
        background-size: cover;
      }

    }
  }
}

 


    .el-step.is-horizontal .el-step__line{
      top: 50%;
      left: 94px;
      right: 48px;
    }
    .el-step__head.is-process{
      border-color: #dedede;
    }
    .el-step__head.is-finish{
      border-color: #285edf;
    }
    .el-step__title.is-process{
      color: #dedede;
    }
    .el-step__title.is-finish{
      color: #285edf;
    }

</style>


