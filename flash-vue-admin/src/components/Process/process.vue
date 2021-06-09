<template>
  <div>
    <div>
      <el-steps :active="stepCount" align-center>
        <el-step title="监测报警" :description="assignmentAlarmTime()"><i class="step01" slot="icon"></i></el-step>
        <el-step title="报警审核" :description="assignmentAuditTime()"><i class="step02" slot="icon"></i></el-step>
        <el-step title="报警排查" :description="assignmentScreenTime()"><i class="step03" slot="icon"></i></el-step>
        <el-step title="报警处置" :description="assignmentHandleTime()"><i class="step04" slot="icon"></i></el-step>
        <el-step title="报警解除" :description="assignmentRelieveTime()"><i class="step05" slot="icon"></i></el-step>
      </el-steps>
    </div>
        <el-card >
          <div slot="header" class="clearfix">
            <span>监测报警</span>
          </div>
          <div>
            <el-table :data="checkList" v-loading="false" element-loading-text="Loading" border>
              <el-table-column label="设备名称">
                <template slot-scope="scope">
                  {{scope.row.equipment.equipmentName}}
                </template>
              </el-table-column>
              <el-table-column label="报警位置">
                <template slot-scope="scope">
                  <template v-if="scope.row.equipment.equipmentInstallInfos != null">{{scope.row.equipment.equipmentInstallInfos[0].installLocation}}</template>
                </template>
              </el-table-column>
              <el-table-column label="报警时间">
                <template slot-scope="scope">
                  {{scope.row.alarmTime}}
                </template>
              </el-table-column>

              <el-table-column label="报警等级" width="80px" align="center">
                <template slot-scope="scope">
                  {{scope.row.alarmLevelName}}
                </template>
              </el-table-column>

              <el-table-column label="报警值" width="80px" align="center">
                <template slot-scope="scope">
                    {{scope.row.alarmValue}}<template v-if="scope.row.equipment.equipmentInstallInfos != null">{{scope.row.equipment.equipmentInstallInfos[0].equipmentUnit}}</template>
                </template>
              </el-table-column>

              <el-table-column label="审核状态" width="80px" align="center">
                <template slot-scope="scope">
                  <template  v-if="scope.row.isAudit === 0">未审核</template>
                  <template  v-if="scope.row.isAudit === 1">已审核</template>
                </template>
              </el-table-column>

              <el-table-column label="解除状态" width="80px" align="center">
                <template slot-scope="scope">
                  <template  v-if="scope.row.isRelieve === 0 ">未解除</template>
                  <template  v-if="scope.row.isRelieve === 1 ">已解除</template>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
        <el-card v-if="checkList[0].auditTime != null">
          <div slot="header" class="clearfix">
            <span>报警审核</span>
          </div>
         <div>
           <el-table :data="checkList" v-loading="false" element-loading-text="Loading" border>
             <el-table-column label="审核人">
               <template slot-scope="scope">
                 {{scope.row.auditUser.name}}
               </template>
             </el-table-column>
             <el-table-column label="审核时间">
               <template slot-scope="scope">
                 {{scope.row.auditTime}}
               </template>
             </el-table-column>
             <el-table-column label="审核值">
               <template slot-scope="scope">
                 {{scope.row.auditValue}}<template v-if="scope.row.equipment.equipmentInstallInfos != null">{{scope.row.equipment.equipmentInstallInfos[0].equipmentUnit}}</template>
               </template>
             </el-table-column>
             <el-table-column label="审核结果">
               <template slot-scope="scope">
                 <template v-if="scope.row.auditStatus == 0" id="audit1">误报</template>
                 <template v-if="scope.row.auditStatus == 1" id="audit2">确认报警</template>
               </template>
             </el-table-column>

             <el-table-column label="审核意见">
               <template slot-scope="scope">
                 {{scope.row.auditOpinion}}
               </template>
             </el-table-column>

           </el-table>
         </div>
        </el-card>
        <el-card >
          <div slot="header" class="clearfix">
            <span>报警排查</span>
          </div>
          <div v-if="checkList[0].screenStatus == 258">
            <el-table :data="screenList" v-loading="false" element-loading-text="Loading" border>
              <el-table-column label="排查人">
                <template slot-scope="scope">
                  {{scope.row.screenUser.name}}
                </template>
              </el-table-column>
              <el-table-column label="排查时间">
                <template slot-scope="scope">
                  {{scope.row.screenTime}}
                </template>
              </el-table-column>
              <el-table-column label="排查结果">
                <template slot-scope="scope">
                  <template v-if="scope.row.screenResult == 0" >误报</template>
                  <template v-if="scope.row.screenResult == 1" >确认报警</template>
                </template>
              </el-table-column>
              <el-table-column label="备注">
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
        </el-card>
          <el-card v-if="checkList[0].isFeedback > 0">
            <div slot="header" class="clearfix">
              <span>报警处置</span>
            </div>
            <div>
              <el-table :data="disposeList" v-loading="false" max-height="200px" element-loading-text="Loading" border>
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

                <el-table-column label="操作" width="220px" align="center">
                  <template slot-scope="scope">
                    <el-button type="text" icon="el-icon-view" @click.native="previewFile(scope.row)"  size="mini">预览</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-card>

        <el-card v-if="checkList[0].relieveTime != null">
          <div slot="header" class="clearfix">
            <span>报警解除</span>
          </div>
          <div>
            <el-table :data="checkList" v-loading="false" element-loading-text="Loading" border>
              <el-table-column label="解除人">
                <template slot-scope="scope">
                  <template v-if="scope.row.relieveUser != null">{{scope.row.relieveUser.name}}</template>
                  <template v-if="scope.row.relieveUser == null">system</template>
                </template>
              </el-table-column>

              <el-table-column label="解除时间">
                <template slot-scope="scope">
                  {{scope.row.relieveTime}}
                </template>
              </el-table-column>

              <el-table-column label="解除意见">
                <template slot-scope="scope">
                  {{scope.row.relieveOpinion}}
                </template>
              </el-table-column>
              <el-table-column label="操作" width="220px" align="center">
                <template slot-scope="scope">
                  <el-button type="text" icon="el-icon-view" @click.native="previewFile(scope.row)"  size="mini">预览</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>


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
          if (this.checkList[0].auditTime) {
            index = 2
          }
          if (this.checkList[0].screenStatus == 258) {
            index = 3
          }
          if (this.checkList[0].isFeedback > 0) {
            index = 4
          }
          if (this.checkList[0].relieveTime) {
            index = 5
          }
          this.stepCount = index
        }
      }
    }
</script>

<style lang="scss" scoped >



  .step01{
    background-image:url("~@/assets/img/buzhouyi.png");
  }
  .step02{
    background-image:url("~@/assets/img/buzhouer.png");
  }
  .step03{
    background-image:url("~@/assets/img/buzhousan.png");
  }
  .step04{
    background-image:url("~@/assets/img/buzhousi.png");
  }
  .step05{
    background-image:url("~@/assets/img/buzhouwu.png");
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


