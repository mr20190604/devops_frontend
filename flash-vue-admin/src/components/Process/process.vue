<template>
  <div>
    <el-timeline>
      <el-timeline-item timestamp="审核" placement="top" >
        <el-card v-if="checkList != null">
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
      <el-timeline-item timestamp="处置" placement="top">
        <el-card v-if="disposeList != null">
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
            </el-table>
          </div>
        </el-card>
      </el-timeline-item>
      <el-timeline-item timestamp="信息发送" placement="top">
        <el-card v-if="acceptList != null">
          <div>
            <el-table :data="acceptList" v-loading="false" element-loading-text="Loading" border>
              <el-table-column label="发送时间">
                <template slot-scope="scope">
                  {{scope.row.createTime}}
                </template>
              </el-table-column>
              <el-table-column label="信息内容">
                <template slot-scope="scope">
                  {{scope.row.noticeContent}}
                </template>
              </el-table-column>
              <el-table-column label="接收人">
                <template slot-scope="scope">
                  {{scope.row.auditUser.name}}
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </el-timeline-item>
    </el-timeline>

  </div>
    
</template>

<script>
    export default {
        name: "process",
        props:['checkList','disposeList','acceptList'],
        data(){
          return {

          }
        }
    }
</script>

<style scoped>

</style>
