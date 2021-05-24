<template>
    <div class="app-container">
        <div class="block">
          <el-form label-width="120px" :inline="true" >
            <el-form-item label="车牌号码">
              <el-input v-model="listQuery.vehicleLicense"  placeholder="请输入车牌号码"></el-input>
            </el-form-item>
            <el-form-item label="车辆类别">
              <el-select  v-model="listQuery.vehicleType"  placeholder="请选择车辆类别">
                <el-option
                  v-for="item in vehicleType_list"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
              <el-form-item label="负责人">
              <el-input v-model="listQuery.vehicleResponsible"  placeholder="请输入负责人"></el-input>
              </el-form-item>
                <el-form-item label="所属企业">
              <el-select v-model="listQuery.enterpriseId"  placeholder="请输入所属企业">
                <el-option
                  v-for="item in enterprise_list"
                  :key="item.id"
                  :label="item.enterpriseName"
                  :value="item.id">
                </el-option>
              </el-select>
                </el-form-item>
            <el-form-item style="float: right;margin-right: 100px">
              <el-button type="primary"  icon="el-icon-search" @click.native="search">{{ $t('button.search') }}</el-button>
              <el-button icon="el-icon-refresh" @click.native="reset">{{ $t('button.reset') }}</el-button>
            </el-form-item>
            <br>
                  <el-form-item label="车辆型号">
              <el-input v-model="listQuery.vehicleModel" placeholder="请选择车辆型号"></el-input>
                  </el-form-item>

          </el-form>
            <br>
            <el-row>
                <el-col :span="24">
                    <el-button type="primary"  icon="el-icon-plus" @click.native="add" v-permission="['/park/emergency/vehicle/add']">{{ $t('button.add') }}</el-button>
                    <!--<el-button type="primary" size="mini"  icon="el-icon-edit" @click.native="edit" v-permission="['/park/emergency/vehicle/update']">{{ $t('button.edit') }}</el-button>-->
                    <el-button  icon="el-icon-delete" @click.native="remove" v-permission="['/park/emergency/vehicle/delete']">批量删除</el-button>
                </el-col>
            </el-row>
        </div>


        <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row
                  @current-change="handleCurrentChange">
          <el-table-column
            type="selection"
            width="55"
            :reserve-selection="true"
          >
          </el-table-column>
          <el-table-column
            type="index"
            width="50"
            label="序号"
          >
          </el-table-column>
          <el-table-column label="车辆名称">
                <template slot-scope="scope">
                    {{scope.row.vehicleName}}
                </template>
            </el-table-column>
            <el-table-column label="归属企业">
                <template slot-scope="scope">
                    {{scope.row.enterpriseName}}
                </template>
            </el-table-column>
            <el-table-column label="车牌号">
                <template slot-scope="scope">
                    {{scope.row.vehicleLicense}}
                </template>
            </el-table-column>
            <el-table-column label="车辆编号" width="100px">
                <template slot-scope="scope">
                    {{scope.row.vehicleCode}}
                </template>
            </el-table-column>
            <el-table-column label="车辆类别">
                <template slot-scope="scope">
                    {{scope.row.vehicleTypeName}}
                </template>
            </el-table-column>
            <el-table-column label="车辆型号">
                <template slot-scope="scope">
                    {{scope.row.vehicleModel}}
                </template>
            </el-table-column>
            <el-table-column label="行政区划" width="100px">
                <template slot-scope="scope">
                    {{scope.row.districtName}}
                </template>
            </el-table-column>
            <el-table-column label="负责人" width="80px">
                <template slot-scope="scope">
                    {{scope.row.vehicleResponsible}}
                </template>
            </el-table-column>
            <el-table-column label="联系电话">
                <template slot-scope="scope">
                    {{scope.row.personTel}}
                </template>
            </el-table-column>
            <el-table-column label="生产厂家">
                <template slot-scope="scope">
                    {{scope.row.manufacturer}}
                </template>
            </el-table-column>
            <!--<el-table-column label="经度">
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
            <el-table-column label="操作" width="200px">
                <template slot-scope="scope">
                    <el-button type="text" size="mini" icon="el-icon-edit" @click.native="editItem(scope.row)" v-permission="['/park/emergency/vehicle/update']">{{ $t('button.edit') }}</el-button>
                    <el-button type="text" size="mini" icon="el-icon-delete" @click.native="removeItem(scope.row)" v-permission="['/park/emergency/vehicle/delete']">{{ $t('button.delete') }}</el-button>
                    <el-button type="text" size="mini" icon="el-icon-view"  @click.native="openFileView(scope.row)" >预览</el-button>

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
                width="60%">
            <el-form ref="form" :model="form" :rules="rules" label-width="120px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="车辆名称"  >
                            <el-input v-model="form.vehicleName" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="归属企业"  >
                            <el-select v-model="form.enterpriseId" minlength=1>
                              <el-option
                                v-for="item in enterprise_list"
                                :key="item.id"
                                :label="item.enterpriseName"
                                :value="item.id">
                              </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="车牌号"  >
                            <el-input v-model="form.vehicleLicense" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="车辆编号"  >
                            <el-input v-model="form.vehicleCode" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="车辆类别"  >
                            <el-select v-model="form.vehicleType" minlength=1>
                              <el-option
                                v-for="item in vehicleType_list"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                              </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="车辆型号"  >
                            <el-input v-model="form.vehicleModel" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="行政区划"  >
                            <district v-model="form.districtCode" minlength=1></district>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="负责人" >
                            <el-input v-model="form.vehicleResponsible" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="联系电话"  >
                            <el-input v-model="form.personTel" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="生产厂家"  >
                            <el-input v-model="form.manufacturer" minlength=1></el-input>
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
                  <el-col :span="12">
                    <el-form-item label="选择文件">
                      <el-upload
                        :action="uploadUrl"
                        :headers="uploadHeaders"
                        :on-change="handleChangeUpload"
                        :on-success="uploadSuccess"
                        accept=".jpg,.png,.jpeg,.gif,.bmp,.doc"
                        :on-remove="removeFile"
                        :file-list="fileList"
                        :multiple="multiple"
                      >
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" >最大上传大小10Mb</div>
                      </el-upload>
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
        :title="viewTitle"
        :visible.sync="viewVisible"
        width="50%" style="margin-top: 0px"
      >
        <el-table :data="files"
                  v-loading="fileLoading"
                  element-loading-text="Loading"
                  border
        >
          <el-table-column label="文件名称">
            <template slot-scope="scope" >
              <div style="color: #409EFF"  @click="previewFile(scope.row)">{{scope.row.fileInfo.originalFileName}}</div>
            </template>
          </el-table-column>

          <el-table-column label="上传时间">
            <template slot-scope="scope">
              {{scope.row.createTime}}
            </template>
          </el-table-column>
        </el-table>

      </el-dialog>

      <el-dialog
        :title="previewTitle"
        :visible.sync="previewVisible"
        width="50%" style="margin-top: 0px">
        <preview :previewStyle="previewStyle" :previewFileUrl="previewFileUrl" :fileType="fileType"></preview>
      </el-dialog>
    </div>
</template>

<script src="./dsiParkEmergencyVehicle.js"></script>


<style rel="stylesheet/scss" lang="scss"  >
    @import "src/styles/commonmyself.scss";
</style>

