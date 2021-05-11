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
                    <el-button type="success" size="mini"  icon="el-icon-plus" @click.native="add" v-permission="['/product/info/add']">{{ $t('button.add') }}</el-button>
                    <el-button type="primary" size="mini"  icon="el-icon-edit" @click.native="edit" v-permission="['/product/info/update']">{{ $t('button.edit') }}</el-button>
                    <el-button type="danger" size="mini"  icon="el-icon-delete" @click.native="remove" v-permission="['/product/info/delete']">{{ $t('button.delete') }}</el-button>
                </el-col>
            </el-row>
        </div>


        <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row
                  @current-change="handleCurrentChange">
            <el-table-column label="产品编码">
                <template slot-scope="scope">
                    {{scope.row.productCode}}
                </template>
            </el-table-column>
            <el-table-column label="产品名称">
                <template slot-scope="scope">
                    {{scope.row.productName}}
                </template>
            </el-table-column>
            <el-table-column label="是否有毒（0：否，1：是）">
                <template slot-scope="scope">
                    {{scope.row.isPoisonHarm}}
                </template>
            </el-table-column>
            <el-table-column label="是否易燃易爆（0：否，1：是）">
                <template slot-scope="scope">
                    {{scope.row.isInflammableExplosive}}
                </template>
            </el-table-column>
            <el-table-column label="所属形状类型（气体，固体，液体），参见字典">
                <template slot-scope="scope">
                    {{scope.row.formId}}
                </template>
            </el-table-column>
            <el-table-column label="生产企业">
                <template slot-scope="scope">
                    {{scope.row.enterpriseId}}
                </template>
            </el-table-column>
            <el-table-column label="逻辑删除">
                <template slot-scope="scope">
                    {{scope.row.isDel}}
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="mini" icon="el-icon-edit" @click.native="editItem(scope.row)" v-permission="['/product/info/update']">{{ $t('button.edit') }}</el-button>
                    <el-button type="text" size="mini" icon="el-icon-delete" @click.native="removeItem(scope.row)" v-permission="['/product/info/delete']">{{ $t('button.delete') }}</el-button>
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
                        <el-form-item label="产品编码"  >
                            <el-input v-model="form.productCode" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="产品名称"  >
                            <el-input v-model="form.productName" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="是否有毒（0：否，1：是）"  >
                            <el-input v-model="form.isPoisonHarm" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="是否易燃易爆（0：否，1：是）"  >
                            <el-input v-model="form.isInflammableExplosive" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="所属形状类型（气体，固体，液体），参见字典"  >
                            <el-input v-model="form.formId" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="生产企业"  >
                            <el-input v-model="form.enterpriseId" minlength=1></el-input>
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

<script src="./dsiProductInfo.js"></script>


<style rel="stylesheet/scss" lang="scss" scoped>
    @import "src/styles/common.scss";
</style>

