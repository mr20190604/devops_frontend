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
                    <el-button type="success" size="mini"  icon="el-icon-plus" @click.native="add" v-permission="['/inspection/plan/add']">{{ $t('button.add') }}</el-button>
                    <el-button type="primary" size="mini"  icon="el-icon-edit" @click.native="edit" v-permission="['/inspection/plan/update']">{{ $t('button.edit') }}</el-button>
                    <el-button type="danger" size="mini"  icon="el-icon-delete" @click.native="remove" v-permission="['/inspection/plan/delete']">{{ $t('button.delete') }}</el-button>
                </el-col>
            </el-row>
        </div>


        <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row
                  @current-change="handleCurrentChange">
            <el-table-column label="线路id">
                <template slot-scope="scope">
                    {{scope.row.pathId}}
                </template>
            </el-table-column>
            <el-table-column label="巡检类型,关联字典表">
                <template slot-scope="scope">
                    {{scope.row.inspectType}}
                </template>
            </el-table-column>
            <el-table-column label="巡查形式,关联字典表">
                <template slot-scope="scope">
                    {{scope.row.inspectForm}}
                </template>
            </el-table-column>
            <el-table-column label="计划开始日期">
                <template slot-scope="scope">
                    {{scope.row.startTime}}
                </template>
            </el-table-column>
            <el-table-column label="计划结束日期">
                <template slot-scope="scope">
                    {{scope.row.endTime}}
                </template>
            </el-table-column>
            <el-table-column label="审核状态,1-待审核,2-未通过,3-已通过">
                <template slot-scope="scope">
                    {{scope.row.auditStatus}}
                </template>
            </el-table-column>
            <el-table-column label="审核人">
                <template slot-scope="scope">
                    {{scope.row.auditPerson}}
                </template>
            </el-table-column>
            <el-table-column label="审核时间">
                <template slot-scope="scope">
                    {{scope.row.auditTime}}
                </template>
            </el-table-column>
            <el-table-column label="计划执行人员">
                <template slot-scope="scope">
                    {{scope.row.planPerson}}
                </template>
            </el-table-column>
            <el-table-column label="备注">
                <template slot-scope="scope">
                    {{scope.row.notes}}
                </template>
            </el-table-column>
            <el-table-column label="逻辑删除">
                <template slot-scope="scope">
                    {{scope.row.isDel}}
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="mini" icon="el-icon-edit" @click.native="editItem(scope.row)" v-permission="['/inspection/plan/update']">{{ $t('button.edit') }}</el-button>
                    <el-button type="text" size="mini" icon="el-icon-delete" @click.native="removeItem(scope.row)" v-permission="['/inspection/plan/delete']">{{ $t('button.delete') }}</el-button>
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
                        <el-form-item label="线路id"  >
                            <el-input v-model="form.pathId" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="巡检类型,关联字典表"  >
                            <el-input v-model="form.inspectType" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="巡查形式,关联字典表"  >
                            <el-input v-model="form.inspectForm" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="计划开始日期"  >
                            <el-input v-model="form.startTime" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="计划结束日期"  >
                            <el-input v-model="form.endTime" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="审核状态,1-待审核,2-未通过,3-已通过"  >
                            <el-input v-model="form.auditStatus" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="审核人"  >
                            <el-input v-model="form.auditPerson" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="审核时间"  >
                            <el-input v-model="form.auditTime" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="计划执行人员"  >
                            <el-input v-model="form.planPerson" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="备注"  >
                            <el-input v-model="form.notes" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="逻辑删除"  >
                            <el-input v-model="form.isDel" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item>
                    <el-button type="primary" @click="save">{{ $t('button.submit') }}</el-button>
                    <el-button @click.native="formVisible = false">{{ $t('button.cancel') }}</el-button>
                </el-form-item>

            </el-form>
        </el-dialog>
    </div>
</template>

<script src="./mmInspectionPlan.js"></script>


<style rel="stylesheet/scss" lang="scss" scoped>
    @import "src/styles/common.scss";
</style>

