<template>
    <div class="app-container">
        <div class="block">
            <el-row  :gutter="20">
                <el-col :span="4">
                    <el-input v-model="listQuery.id" size="mini" placeholder="请输入id"></el-input>
                </el-col>
                <el-col :span="6">
                    <el-button type="success" size="mini" icon="el-icon-search" @click.native="search">{{ $t('button.search') }}</el-button>
                    <el-button type="primary" size="mini" icon="el-icon-refresh" @click.native="reset">{{ $t('button.reset') }}</el-button>
                </el-col>
            </el-row>
            <br>
            <el-row>
                <el-col :span="24">
                    <el-button type="success" size="mini"  icon="el-icon-plus" @click.native="add" v-permission="['/inspection/path/add']">{{ $t('button.add') }}</el-button>
                    <el-button type="primary" size="mini"  icon="el-icon-edit" @click.native="edit" v-permission="['/inspection/path/update']">{{ $t('button.edit') }}</el-button>
                    <el-button type="danger" size="mini"  icon="el-icon-delete" @click.native="remove" v-permission="['/inspection/path/delete']">{{ $t('button.delete') }}</el-button>
                </el-col>
            </el-row>
        </div>


        <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row
                  :row-key="(row) => row.id"
                  @current-change="handleCurrentChange">
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
            <el-table-column label="线路名称">
                <template slot-scope="scope">
                    {{scope.row.pathName}}
                </template>
            </el-table-column>
            <el-table-column label="线路状态">
                <template slot-scope="scope">
                    {{scope.row.pathStatus}}
                </template>
            </el-table-column>
            <el-table-column label="创建人">
                <template slot-scope="scope">
                    {{scope.row.notes}}
                </template>
            </el-table-column>
            <el-table-column label="创建时间">
                <template slot-scope="scope">
                    {{scope.row.isDel}}
                </template>
            </el-table-column>
          <el-table-column label="路线信息" width="500px">
            <template slot-scope="scope">
              {{scope.row.isDel}}
            </template>
          </el-table-column>
            <el-table-column label="操作" width="300px">
                <template slot-scope="scope">
                    <el-button type="text" size="mini" icon="el-icon-edit" @click.native="editItem(scope.row)" v-permission="['/inspection/path/update']">{{ $t('button.edit') }}</el-button>
                    <el-button type="text" size="mini" icon="el-icon-delete" @click.native="removeItem(scope.row)" v-permission="['/inspection/path/delete']">{{ $t('button.delete') }}</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination
                background
                layout="total, sizes, prev, pager, next, jumper"
                :page-sizes="[10, 20, 50, 100,500]"
                :page-size="listQuery.limit"
                :total="total"
                @size-change="changeSize"
                @current-change="fetchPage"
                @prev-click="fetchPrev"
                @next-click="fetchNext">
        </el-pagination>

        <el-dialog
                :title="formTitle"
                :visible.sync="formVisible"
                width="70%">
            <el-form ref="form" :model="form" :rules="rules" label-width="120px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="线路名称："  >
                            <el-input v-model="form.pathName" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="线路状态： "  >
                            <el-input v-model="form.pathStatus" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                  <el-col :span="12">
                    <el-form-item label="管线信息："  >
                      <el-input type="textarea" v-model="form.accidentDesc" minlength=1></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item >
                      <el-button @click="addLine" class="set-common-btn blank-blue-button width92">添加管线</el-button>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-form-item id="myself">
                    <el-button type="primary" @click="save">{{ $t('button.submit') }}</el-button>
                    <el-button @click.native="formVisible = false">{{ $t('button.cancel') }}</el-button>
                </el-form-item>

            </el-form>
        </el-dialog>
      <el-dialog
        :title="formTitle"
        :visible.sync="pipelineVisible"
        width="70%">

      <pipelineInfo></pipelineInfo>

      </el-dialog>
    </div>
</template>

<script src="./mmInspectionPath.js"></script>


<style rel="stylesheet/scss" lang="scss" scoped>
    @import "src/styles/commonmyself.scss";
</style>

