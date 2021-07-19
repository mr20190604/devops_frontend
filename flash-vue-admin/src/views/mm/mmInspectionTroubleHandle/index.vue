<template>
  <div class="app-container">
    <div class="block">
      <el-form label-width="76px" class="align-right has-Label-Width">
        <el-row class="hasmarginBottom">
          <el-col :span="5">
            <el-form-item label="隐患类型：">
              <dict-select v-model="listQuery.troubleType" dict-name="隐患类型" placeholder="请选择隐患类型"></dict-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="隐患来源：">
              <dict-select v-model="listQuery.troubleSource" dict-name="隐患来源" placeholder="请选择隐患来源"></dict-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="隐患等级：">
              <dict-select v-model="listQuery.troubleLevel" dict-name="隐患等级" placeholder="请选择隐患等级"></dict-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="维修人：">
              <el-select v-model="listQuery.repairPerson" filterable placeholder="请选择" @change="getTelephone">
                <el-option
                  v-for="item in repair_person"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="分配状态：">
              <dict-select v-model="listQuery.distributeStatus" dict-name="分配状态" placeholder="请选择分配状态"></dict-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="处置状态：">
              <dict-select v-model="listQuery.handleStatus" dict-name="处置状态" placeholder="请选择处置状态"></dict-select>
            </el-form-item>
          </el-col>
          <el-col :span="13">
            <el-button type="success" size="mini" class="set-common-btn blue-button" @click.native="search">{{
              $t('button.search') }}
            </el-button>
            <el-button type="primary" size="mini" class="set-common-btn blank-blue-button" @click.native="reset">{{
              $t('button.reset') }}
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="table-list">
      <div class="btnLists">
        <el-button type="success" size="mini" class="set-common-btn blue-button" @click.native="openAccept"
                   v-permission="['/inspection/trouble/handle/add']">分配
        </el-button>
      </div>
      <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" border :row-key="row=>row.id"
                @current-change="handleCurrentChange"
                @selection-change="handleSelectionChange"
                @row-click="toggleSelection"
                ref="handleTable">
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
        <el-table-column label="隐患描述" width="250px" show-overflow-tooltip>
          <template slot-scope="scope">
            <template v-if="scope.row.inspectionTrouble!==null">{{scope.row.inspectionTrouble.troubleInfo}}</template>
          </template>
        </el-table-column>
        <el-table-column label="隐患类型">
          <template slot-scope="scope">
            <template v-if="scope.row.inspectionTrouble!==null">
              <template v-if="scope.row.inspectionTrouble.troubleType==281">泄露</template>
              <template v-if="scope.row.inspectionTrouble.troubleType==282">占压</template>
              <template v-if="scope.row.inspectionTrouble.troubleType==283">开挖</template>
              <template v-if="scope.row.inspectionTrouble.troubleType==284">隐患风险</template>
              <template v-if="scope.row.inspectionTrouble.troubleType==285">设备破坏</template>
            </template>
          </template>
        </el-table-column>
        <el-table-column label="隐患来源">
          <template slot-scope="scope">
            <template v-if="scope.row.inspectionTrouble!==null">
              <template v-if="scope.row.inspectionTrouble.troubleSource==287">隐患上报</template>
              <template v-if="scope.row.inspectionTrouble.troubleSource==288">巡检上报</template>
            </template>
          </template>
        </el-table-column>
        <el-table-column label="隐患等级">
          <template slot-scope="scope">
            <template v-if="scope.row.inspectionTrouble!==null">
              <template v-if="scope.row.inspectionTrouble.troubleLevel==266">一级</template>
              <template v-if="scope.row.inspectionTrouble.troubleLevel==267">二级</template>
              <template v-if="scope.row.inspectionTrouble.troubleLevel==268">三级</template>
            </template>
          </template>
        </el-table-column>
        <el-table-column label="分配状态">
          <template slot-scope="scope">
            <template v-if="scope.row.distributeStatus==290">待分配</template>
            <template v-if="scope.row.distributeStatus==291">已分配</template>
          </template>
        </el-table-column>
        <el-table-column label="维修人员">
          <template slot-scope="scope">
            <template v-if="scope.row.repairUser!=null"> {{scope.row.repairUser.name}}</template>
          </template>
        </el-table-column>
        <el-table-column label="联系电话">
          <template slot-scope="scope">
            {{scope.row.repairPersonCellphone}}
          </template>
        </el-table-column>
        <el-table-column label="处置状态">
          <template slot-scope="scope">
            <template v-if="scope.row.handleStatus==293">待处置</template>
            <template v-if="scope.row.handleStatus==294">处置未完成</template>
            <template v-if="scope.row.handleStatus==295">处置完成</template>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="mini" icon="el-icon-view" @click.native="openProcess(scope.row)">查看</el-button>
            <el-button type="text" size="mini" icon="el-icon-location-outline">定位</el-button>
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
    <!-- 分配弹框 -->
    <el-dialog class="el-dialog-style common-dialog-style"
               :title="formTitle"
               :visible.sync="formVisible"
               width="960px">
      <div class="block">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px" class="align-right has-Label-Width">
          <el-row>
            <el-col :span="12">
              <el-form-item label="维修人员：">
                <el-select v-model="form.repairPerson" filterable placeholder="请选择" @change="getTelephone">
                  <el-option
                    v-for="item in repair_person"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系电话：">
                <el-input v-model="form.repairPersonCellphone" minlength=1></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item id="myself" class="dialog-button-list">
            <el-button type="primary" @click="saveOption" class="set-common-btn blue-button">{{ $t('button.submit') }}
            </el-button>
            <el-button @click.native="formVisible = false" class="set-common-btn blank-blue-button">{{
              $t('button.cancel') }}
            </el-button>
          </el-form-item>

        </el-form>
      </div>
    </el-dialog>
    <!-- 隐患流程跟踪弹框 -->
    <el-dialog
      class="el-dialog-style common-dialog-style"
      :title="processTitle"
      :visible.sync="processVisible"
      width="960px"
    >
      <div class="marginT26">
        <troubleProcess :troubleList="trouble_list" :troubleHandleList="trouble_handle_list"></troubleProcess>
      </div>
    </el-dialog>

  </div>
</template>

<script src="./mmInspectionTroubleHandle.js"></script>



