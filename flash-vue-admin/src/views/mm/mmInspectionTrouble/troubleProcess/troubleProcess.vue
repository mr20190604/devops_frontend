<template>
  <div>
    <div>
      <el-steps :active="stepCount" align-center>
        <el-step title="隐患上报" :description="troubleReportTime()"><i  class="step01" slot="icon"></i></el-step>
        <el-step title="隐患审核" :description="troubleAuditTime()"><i v-if="auditStatus == 1" class="step02" slot="icon"></i><i v-else-if="auditStatus == 0" class="step07" slot="icon"></i></el-step>
        <el-step title="隐患处置" :description="troubleHandleTime()"><i v-if="handleStatus == 1" class="step03" slot="icon"></i><i v-else-if="handleStatus == 0" class="step08" slot="icon"></i></el-step>
      </el-steps>
    </div>
    <div>
       <el-scrollbar  style="height: 500px;margin-top:20px">
      <el-card>
        <div slot="header" class="clearfix">
          <span>隐患上报</span>
        </div>
        <div>
          <div class="table-list">
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
        </div>
      </el-card>

      <el-card>
        <div slot="header" class="clearfix">
          <span>隐患审核</span>
        </div>
        <div v-if="trouble_list[0].auditTime != null">
          <div class="table-list">
          <el-table :data="trouble_list" v-loading="false" max-height="120px" element-loading-text="Loading" border>
            <el-table-column label="审核人" width="80px" align="center">
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
        </div>
      </el-card>
      <el-card>
        <div slot="header" class="clearfix">
          <span>隐患处置</span>
        </div>
        <div v-if="trouble_handle_list.length > 0">
          <div v-if="trouble_handle_list[0].handleStatus > 1">
            <div class="table-list">
            <el-table :data="trouble_handle_list[0].mmInspectionTroubleHandleRecords" v-loading="false" max-height="200px" element-loading-text="Loading" border>
              <el-table-column label="处置人" width="80px" align="center">
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
                  <template v-if="scope.row.handleStatus == 293">待维修</template>
                  <template v-if="scope.row.handleStatus == 294">维修中</template>
                  <template v-if="scope.row.handleStatus == 295">已完成</template>
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
        </div>
      </el-card>
    </el-scrollbar>
    </div>
    <div>
      <!-- 附件预览弹框 -->
      <el-dialog class="el-dialog-style common-dialog-style" :title="fileTitle" :visible.sync="fileVisible" append-to-body="true" width="50%">
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
            auditStatus:0,
            handleStatus:0,
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
          this.auditStatus = 1;
          index = 2;
        } else {
          this.auditStatus = 0;
        }
        let flag = false;

        if (this.trouble_handle_list) {
          if (this.trouble_handle_list.length > 0) {
            if (this.trouble_handle_list[0].handleStatus > 1) {
              flag = true;
              index = 3
            }
          }
        }
        if (flag) {
          this.handleStatus = 1;
        } else {
          this.handleStatus = 0;
        }

        this.stepCount = index;
      }
    }
     

    }
</script>

<style lang="scss" scoped>
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
