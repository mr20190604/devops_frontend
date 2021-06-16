<template>
  <div>
    <div>
      <el-steps :active="stepCount" align-center>
        <el-step title="隐患上报" :description="troubleReportTime()"></el-step>
        <el-step title="隐患审核" :description="troubleAuditTime()"></el-step>
        <el-step title="隐患处置" :description="troubleHandleTime()"></el-step>
      </el-steps>
    </div>
    <div style="overflow-y: auto;height: 400px">
      <el-card>
        <div slot="header" class="clearfix">
          <span>隐患上报</span>
        </div>
        <div>
          <el-table :data="trouble_list" v-loading="false" max-height="120px" element-loading-text="Loading" border>
            <el-table-column label="上报人" width="80px" align="center">
              <template slot-scope="scope">
                <template v-if="scope.row.reportUser != null">{{scope.row.reportUser.name}}</template>
              </template>
            </el-table-column>
            <el-table-column label="联系电话" width="120px" align="center">
              <template slot-scope="scope">
                <template v-if="scope.row.reportUser != null">{{scope.row.reportUser.phone}}</template>
              </template>
            </el-table-column>
            <el-table-column label="上报时间" width="180px" align="center">
              <template slot-scope="scope">
                {{scope.row.reportTime}}
              </template>
            </el-table-column>

            <el-table-column label="隐患类型" width="80px" align="center">
              <template slot-scope="scope">
                {{scope.row.troubleTypeName}}
              </template>
            </el-table-column>

            <el-table-column label="隐患位置" >
              <template slot-scope="scope">
                {{scope.row.address}}
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button type="text" icon="el-icon-view" @click.native="previewFile(scope.row)"  size="mini">预览</el-button>
                <el-button type="text" icon="el-icon-location-outline"  size="mini" >定位</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>

      <el-card>
        <div slot="header" class="clearfix">
          <span>隐患审核</span>
        </div>
        <div v-if="trouble_list[0].auditTime != null">
          <el-table :data="trouble_list" v-loading="false" max-height="120px" element-loading-text="Loading" border>
            <el-table-column label="审核人"width="80px" align="center">
              <template slot-scope="scope">
                <template v-if="scope.row.auditUser != null">{{scope.row.auditUser.name}}</template>
              </template>
            </el-table-column>
            <el-table-column label="审核时间" width="180px" align="center">
              <template slot-scope="scope">
                {{scope.row.auditTime}}
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
                {{scope.row.troubleLevelName}}
              </template>
            </el-table-column>
            <el-table-column label="备注">
              <template slot-scope="scope">
                {{scope.row.notes}}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
      <el-card>
        <div slot="header" class="clearfix">
          <span>隐患处置</span>
        </div>
        <div v-if="trouble_handle_list.length > 0">
          <div v-if="trouble_handle_list[0].handleStatus > 1">
            <el-table :data="trouble_handle_list[0].mmInspectionTroubleHandleRecords" v-loading="false" max-height="200px" element-loading-text="Loading" border>
              <el-table-column label="处置人"width="80px" align="center">
                <template slot-scope="scope">
                  <template v-if="trouble_handle_list[0].repairUser != null">{{trouble_handle_list[0].repairUser.name}}</template>
                </template>
              </el-table-column>
              <el-table-column label="处置时间" width="180px" align="center">
                <template slot-scope="scope">
                  {{scope.row.handleTime}}
                </template>
              </el-table-column>
              <el-table-column label="处置结果" width="80px" align="center">
                <template slot-scope="scope">
                  <template v-if="scope.row.handleStatus == 1">维修中</template>
                  <template v-if="scope.row.handleStatus == 2">已完成</template>
                </template>
              </el-table-column>
              <el-table-column label="备注">
                <template slot-scope="scope">
                  {{scope.row.notes}}
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <el-button type="text" icon="el-icon-view"  size="mini" @click.native="previewFile(scope.row)">预览</el-button>
                  <el-button type="text" icon="el-icon-location-outline" @click.native="previewFile(scope.row)"  size="mini" >定位</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-card>
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
        name: "troubleProcess",
        props:{
          trouble_list:{
            type:Array,
            default:'',
          },
          trouble_handle_list:{
            type:Array,
            default:'',
          }

        },
      data() {
          return {
            files:null,
            fileVisible:false,
            fileTitle:'附件预览',
            downloadUrl:'',
            auditStatus:false,
            handleStatus:false,
            stepCount:1
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
      troubleReportTime() {
        this.calculateStepCount()
        return this.trouble_list[0].reportTime  ? this.trouble_list[0].reportTime:'';
      },
      troubleAuditTime() {
        return this.trouble_list[0].auditTime  ? this.trouble_list[0].auditTime:'';
      },troubleHandleTime() {
        if (this.trouble_handle_list) {
          if (this.trouble_handle_list.length > 0) {
            if (this.trouble_handle_list[0].handleStatus == 3) {
              return this.trouble_handle_list[0].handleTime
            }
          }
        }
        return '';
      },calculateStepCount() {
        let index = 1
        if (this.trouble_list[0].auditTime) {
          this.auditStatus = true
          index = 2
        }

        if (this.trouble_handle_list) {
          if (this.trouble_handle_list.length > 0) {
            if (this.trouble_handle_list[0].handleStatus > 1) {
              this.handleStatus = true
              index = 3
            }
          }
        }

        this.stepCount = index;
      }
    }
     

    }
</script>

<style scoped>

</style>
