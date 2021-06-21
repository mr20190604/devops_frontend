<template>
    <div class="app-container">
        <div class="block">
          <el-form>
            <el-row>
              <el-col :span="6">
                <el-form-item label="模板编号：">
                  <el-input v-model="listQuery.tplCode" size="mini" placeholder="请输入模板编号"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                 <el-form-item label="发送日期：">
                    <el-date-picker
                      v-model="rangeDate"
                      size="mini"
                      type="datetimerange"
                      range-separator="至"
                      start-placeholder="发送起始日期"
                      end-placeholder="发送截至日期"
                      value-format="yyyyMMddHHmmss"
                      align="right">
                    </el-date-picker>
                </el-form-item>
              </el-col>
               <el-col :span="10">
                  <el-button type="success" class="set-common-btn blue-button" @click.native="search">{{ $t('button.search') }}</el-button>
                  <el-button type="primary" class="set-common-btn blank-blue-button" @click.native="reset">{{ $t('button.reset') }}</el-button>
                  <el-button type="danger" class="set-common-btn blue-button" @click.native="clear" v-permission="['/message/clear']">{{ $t('button.clear') }}</el-button>
              </el-col>
            </el-row>
            
          </el-form>
          </div>

  <div class="table-list paddingTop12">
        <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row
                  @current-change="handleCurrentChange">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form  inline label-width="90px" class="flash-table-expand expand-log-form align-right has-Label-Width">
                <el-form-item label="模板编码：">
                  <span>{{ props.row.tplCode }}</span>
                </el-form-item>
                <el-form-item label="消息内容：">
                  <span>{{ props.row.content }}</span>
                </el-form-item>
                <el-form-item label="接收者：">
                  <span>{{ props.row.receiver }}</span>
                </el-form-item>
                <el-form-item label="发送日期：">
                  <span>{{ props.row.createTime }}</span>
                </el-form-item>
                <el-form-item label="消息类型：">
                  <span>{{ props.row.type==0?"短信":"邮件" }}</span>
                </el-form-item>
                <el-form-item label="发送结果：">
                  <span>{{ props.row.state==1?"成功":"失败" }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
            <el-table-column label="模板编码">
                <template slot-scope="scope">
                    {{scope.row.tplCode}}
                </template>
            </el-table-column>
            <el-table-column label="接收者">
                <template slot-scope="scope">
                    {{scope.row.receiver}}
                </template>
            </el-table-column>
          <el-table-column label="发送日期">
            <template slot-scope="scope">
              {{scope.row.createTime}}
            </template>
          </el-table-column>
            <el-table-column label="消息类型">
                <template slot-scope="scope">
                    {{scope.row.type==0?"短信":"邮件"}}
                </template>
            </el-table-column>
            <el-table-column label="状态">
              <template slot-scope="scope">
                {{scope.row.state==1?"成功":"失败"}}
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
                :current-page.sync="listQuery.page"
                @size-change="changeSize"
                @current-change="fetchPage"
                @prev-click="fetchPrev"
                @next-click="fetchNext">
        </el-pagination>

    </div>
    </div>
</template>

<script src="./t_message.js"></script>

