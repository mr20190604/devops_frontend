<template>
    <div class="app-container">
        <div class="block">
            <el-row  :gutter="20">
              <el-col :span="4">
                <el-input v-model="listQuery.repositoriesName" size="mini" placeholder="请输入资源库名称"></el-input>
              </el-col>
              <el-col :span="4">
                <el-input v-model="listQuery.districtCode" size="mini" placeholder="请选择所在地区"></el-input>
              </el-col>
              <el-col :span="4">
                <el-input v-model="listQuery.personName" size="mini" placeholder="请输入负责人"></el-input>
              </el-col>
            </el-row>
          <el-row  :gutter="20">
              <el-col :span="4">
                <el-input v-model="listQuery.enterpriseId" size="mini" placeholder="请输入所属企业"></el-input>
              </el-col>
              <el-col :span="4">
                <el-input v-model="listQuery.address" size="mini" placeholder="请输入地址"></el-input>
              </el-col>
                <el-col :span="6">
                    <el-button type="success" size="mini" icon="el-icon-search" @click.native="search">{{ $t('button.search') }}</el-button>
                    <el-button type="primary" size="mini" icon="el-icon-refresh" @click.native="reset">{{ $t('button.reset') }}</el-button>
                </el-col>
            </el-row>
            <br>
            <el-row>
                <el-col :span="24">
                    <el-button type="success" size="mini"  icon="el-icon-plus" @click.native="add" v-permission="['/park/emergency/pool/add']">{{ $t('button.add') }}</el-button>
                    <el-button type="primary" size="mini"  icon="el-icon-edit" @click.native="edit" v-permission="['/park/emergency/pool/update']">{{ $t('button.edit') }}</el-button>
                    <el-button type="danger" size="mini"  icon="el-icon-delete" @click.native="remove" v-permission="['/park/emergency/pool/delete']">{{ $t('button.delete') }}</el-button>
                </el-col>
            </el-row>
        </div>


        <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row
                  @current-change="handleCurrentChange">
            <!--<el-table-column label="序号">-->
                <!--<template slot-scope="scope">-->
                    <!--{{scope.row.code}}-->
                <!--</template>-->
            <!--</el-table-column>-->
            <el-table-column label="资源库名称">
                <template slot-scope="scope">
                    {{scope.row.repositoriesName}}
                </template>
            </el-table-column>
          <el-table-column label="所属企业">
            <template slot-scope="scope">
              {{scope.row.enterpriseId}}
            </template>
          </el-table-column>
          <el-table-column label="行政区划">
            <template slot-scope="scope">
              {{scope.row.districtCode}}
            </template>
          </el-table-column>
          <el-table-column label="地址">
            <template slot-scope="scope">
              {{scope.row.address}}
            </template>
          </el-table-column>
            <el-table-column label="负责人">
                <template slot-scope="scope">
                    {{scope.row.personName}}
                </template>
            </el-table-column>
            <el-table-column label="联系电话">
                <template slot-scope="scope">
                    {{scope.row.personTel}}
                </template>
            </el-table-column>


           <!-- <el-table-column label="经度">
                <template slot-scope="scope">
                    {{scope.row.longitude}}
                </template>
            </el-table-column>
            <el-table-column label="纬度">
                <template slot-scope="scope">
                    {{scope.row.latitude}}
                </template>
            </el-table-column>
            <el-table-column label="逻辑删除">
                <template slot-scope="scope">
                    {{scope.row.isDel}}
                </template>
            </el-table-column>-->
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="mini" icon="el-icon-edit" @click.native="editItem(scope.row)" v-permission="['/park/emergency/pool/update']">{{ $t('button.edit') }}</el-button>
                    <el-button type="text" size="mini" icon="el-icon-delete" @click.native="removeItem(scope.row)" v-permission="['/park/emergency/pool/delete']">{{ $t('button.delete') }}</el-button>
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
                   <!-- <el-col :span="12">
                        <el-form-item label="序号"  >
                            <el-input v-model="form.code" minlength=1></el-input>
                        </el-form-item>
                    </el-col>-->
                    <el-col :span="12">
                        <el-form-item label="资源库名称"  >
                            <el-input v-model="form.repositoriesName" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                  <el-col :span="12">
                    <el-form-item label="所属企业"  >
                      <el-input v-model="form.enterpriseId" minlength=1></el-input>
                    </el-form-item>
                  </el-col>
                    <el-col :span="12">
                        <el-form-item label="负责人"  >
                            <el-input v-model="form.personName" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="联系电话"  >
                            <el-input v-model="form.personTel" minlength=1></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item label="地址"  >
                            <el-input v-model="form.address" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="经度"  >
                            <el-input v-model="form.longitude" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="纬度"  >
                            <el-input v-model="form.latitude" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <!--<el-col :span="12">
                        <el-form-item label="逻辑删除"  >
                            <el-input v-model="form.isDel" minlength=1></el-input>
                        </el-form-item>
                    </el-col>-->
                </el-row>
                <el-form-item>
                    <el-button type="primary" @click="save">{{ $t('button.submit') }}</el-button>
                    <el-button @click.native="formVisible = false">{{ $t('button.cancel') }}</el-button>
                </el-form-item>

            </el-form>
        </el-dialog>
    </div>
</template>

<script src="./dsiParkEmergencyPool.js"></script>


<style rel="stylesheet/scss" lang="scss" scoped>
    @import "src/styles/common.scss";
</style>

