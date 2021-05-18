<template>
    <div class="app-container">
        <div class="block">
          <el-form label-width="120px" :inline="true" >
            <el-form-item label="文件标题">
              <el-input v-model="listQuery.lawName"  placeholder="请输文件标题"></el-input>
            </el-form-item>
            <el-form-item label="制定机关">
              <el-input v-model="listQuery.formulateOffice"  placeholder="请输制定机关"></el-input>
            </el-form-item>
            <el-form-item label="法律性质">
              <el-input v-model="listQuery.lawNature"  placeholder="请输法律性质"></el-input>
            </el-form-item>
            <el-form-item label="时效性">
              <el-select v-model="listQuery.isValid"  placeholder="请选择时效性">
                <el-option
                  v-for="item in timeliness"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="公布日期">
              <el-input v-model="listQuery.publicationDate"  placeholder="请选择日期"></el-input>
            </el-form-item>
            <el-form-item label="适用类型">
              <el-input v-model="listQuery.adaptType"  placeholder="请选择适用类型"></el-input>
            </el-form-item>
          </el-form>
          <el-row :gutter="24">
            <el-col :span="6">
              <el-button type="success" size="mini"  icon="el-icon-search" @click.native="search">{{ $t('button.search') }}
              </el-button>
              <el-button type="primary" size="mini"  icon="el-icon-refresh" @click.native="reset">{{ $t('button.reset') }}
              </el-button>
            </el-col>
          </el-row>
            <br>
            <el-row>
                <el-col :span="24">
                    <el-button type="success" size="mini"  icon="el-icon-plus" @click.native="add" v-permission="['/law/statute/add']">{{ $t('button.add') }}</el-button>
                    <el-button type="primary" size="mini"  icon="el-icon-edit" @click.native="edit" v-permission="['/law/statute/update']">{{ $t('button.edit') }}</el-button>
                    <el-button type="danger" size="mini"  icon="el-icon-delete" @click.native="remove" v-permission="['/law/statute/delete']">{{ $t('button.delete') }}</el-button>
                </el-col>
            </el-row>
        </div>


        <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row
                  @current-change="handleCurrentChange">
            <el-table-column label="文件标题">
                <template slot-scope="scope">
                    {{scope.row.lawName}}
                </template>
            </el-table-column>
            <el-table-column label="文件类别">
                <template slot-scope="scope">
                    {{scope.row.lawCategory}}
                </template>
            </el-table-column>
            <el-table-column label="适用类型">
                <template slot-scope="scope">
                    {{scope.row.adaptType}}
                </template>
            </el-table-column>
            <el-table-column label="制定机关">
                <template slot-scope="scope">
                    {{scope.row.formulateOffice}}
                </template>
            </el-table-column>
            <el-table-column label="法律性质">
                <template slot-scope="scope">
                    {{scope.row.lawNature}}
                </template>
            </el-table-column>
            <el-table-column label="时效性">
                <template slot-scope="scope">
                    {{scope.row.timeName}}
                </template>
            </el-table-column>
            <el-table-column label="公布日期">
                <template slot-scope="scope">
                    {{scope.row.publicationDate}}
                </template>
            </el-table-column>
           <!-- <el-table-column label="备注">
                <template slot-scope="scope">
                    {{scope.row.remark}}
                </template>
            </el-table-column>
            <el-table-column label="逻辑删除">
                <template slot-scope="scope">
                    {{scope.row.isDel}}
                </template>
            </el-table-column>-->
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="mini" icon="el-icon-edit" @click.native="editItem(scope.row)" v-permission="['/law/statute/update']">{{ $t('button.edit') }}</el-button>
                    <el-button type="text" size="mini" icon="el-icon-delete" @click.native="removeItem(scope.row)" v-permission="['/law/statute/delete']">{{ $t('button.delete') }}</el-button>
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
                        <el-form-item label="法律法规名称"  >
                            <el-input v-model="form.lawName" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="文件类别"  >
                            <el-input v-model="form.lawCategory" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="适用类型"  >
                            <el-input v-model="form.adaptType" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="制定机关"  >
                            <el-input v-model="form.formulateOffice" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="法律性质"  >
                            <el-input v-model="form.lawNature" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="时效性"  >
                            <el-select v-model="form.isValid" minlength=1>
                              <el-option
                                v-for="item in timeliness"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                              </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="公布日期"  >
                            <el-input v-model="form.publicationDate" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <!--<el-col :span="12">
                        <el-form-item label="备注"  >
                            <el-input v-model="form.remark" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="逻辑删除"  >
                            <el-input v-model="form.isDel" minlength=1></el-input>
                        </el-form-item>
                    </el-col>-->
                </el-row>
                <el-form-item>
                    <el-button size="mini" type="primary" @click="save">{{ $t('button.submit') }}</el-button>
                    <el-button size="mini" @click.native="formVisible = false">{{ $t('button.cancel') }}</el-button>
                </el-form-item>

            </el-form>
        </el-dialog>
    </div>
</template>

<script src="./dsaLawStatute.js"></script>


<style rel="stylesheet/scss" lang="scss" scoped>
    @import "src/styles/common.scss";
</style>

