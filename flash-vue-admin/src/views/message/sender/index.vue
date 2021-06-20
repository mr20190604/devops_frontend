<template>
    <div class="app-container">
        <div class="block">
            <el-form>
            <el-row>
              <el-col :span="6">
                <el-form-item label="名称：">
                  <el-input v-model="listQuery.name" size="mini" placeholder="请输入名称"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                 <el-form-item label="发送类：">
                  <el-input v-model="listQuery.className" size="mini" placeholder="请输入发送类"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-button type="primary" class="set-common-btn blue-button" @click.native="search">{{ $t('button.search') }}</el-button>
                <el-button type="primary" class="set-common-btn blank-blue-button" @click.native="reset">{{ $t('button.reset') }}</el-button>
            </el-col>
            </el-row>
            
          </el-form>
       
        </div>

 <div class="table-list">
      <div class="btnLists">
           <el-button type="success" size="mini" class="set-common-btn blue-button" @click.native="add" v-permission="['/sender/edit']">{{ $t('button.add') }}</el-button>
           <el-button type="primary" size="mini" class="set-common-btn blank-blue-button" @click.native="edit" v-permission="['/sender/edit']">{{ $t('button.edit') }}</el-button>
           <el-button type="danger" size="mini" class="set-common-btn blue-button" @click.native="remove" v-permission="['/sender/remove']">{{ $t('button.delete') }}</el-button>
      </div>
        <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row
                  @current-change="handleCurrentChange">
            <el-table-column label="名称" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{scope.row.name}}
                </template>
            </el-table-column>
            <el-table-column label="发送类" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{scope.row.className}}
                </template>
            </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" size="mini" icon="el-icon-edit" @click.native="editItem(scope.row)" v-permission="['/sender/edit']">{{ $t('button.edit') }}</el-button>
              <el-button type="text" size="mini" icon="el-icon-delete" @click.native="removeItem(scope.row)" v-permission="['/sender/remove']">{{ $t('button.delete') }}</el-button>

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
    <!-- 添加消息发送者弹框 -->
        <el-dialog
                class="el-dialog-style common-dialog-style"  
                :title="formTitle"
                :visible.sync="formVisible"
                width="960px">
                <div class="block">
            <el-form ref="form" :model="form" :rules="rules">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="名称："  >
                            <el-input v-model="form.name" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="发送类："  >
                            <el-input v-model="form.className" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                 <el-form-item class="dialog-button-list">
                  <el-button type="primary"  class="set-common-btn blue-button" @click="save">{{ $t('button.submit') }}</el-button>
                  <el-button @click.native="formVisible = false" class="set-common-btn blank-blue-button">{{ $t('button.cancel') }}</el-button>
                </el-form-item>
              
            </el-form>
            </div>
        </el-dialog>
    </div>
</template>

<script src="./t_message_sender.js"></script>

