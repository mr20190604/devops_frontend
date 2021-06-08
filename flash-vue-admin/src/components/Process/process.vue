<template>
  <div>

    <el-timeline>
      <el-timeline-item timestamp="监测报警" placement="top">
        <el-card >
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
      </el-timeline-item>
      <el-timeline-item timestamp="报警审核" placement="top" >
        <el-card v-if="checkList[0].auditTime != null">
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
      </el-timeline-item>
      <el-timeline-item timestamp="报警排查" placement="top">
        <el-card  v-if="checkList[0].screenStatus == 258">
          <div>
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
      </el-timeline-item>
      <el-timeline-item timestamp="报警处置" placement="top">
          <el-card v-if="checkList[0].isFeedback > 0">
            <div>
              <el-table :data="disposeList" v-loading="false" element-loading-text="Loading" border>
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

      </el-timeline-item>
      <el-timeline-item timestamp="报警解除" placement="top">
        <el-card v-if="checkList[0].relieveTime != null">
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
      </el-timeline-item>

    </el-timeline>

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
        props:['checkList','disposeList','screenList'],
        data(){
          return {
            files:null,
            fileVisible:false,
            fileTitle:'附件预览',
            downloadUrl:''

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
      }
    }
</script>

<!--<style rel="stylesheet/scss" lang="scss" scoped >-->
  <!--@import "src/styles/commonmyself.scss";-->
<!--</style>-->


