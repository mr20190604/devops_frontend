<template>
    <div class="app-container">
        <div class="block">
          <el-form>
            <el-row class="hasmarginBottom">
                <el-col :span="6">
                  <el-form-item label="车牌号码：">
                    <el-input v-model="listQuery.vehicleLicense"  placeholder="请输入车牌号码"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="车辆类别：">
                    <el-select  v-model="listQuery.vehicleType"  placeholder="请选择车辆类别">
                      <el-option
                        v-for="item in vehicleType_list"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="负责人：">
                    <el-input v-model="listQuery.vehicleResponsible"  placeholder="请输入负责人"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="所属企业：">
                        <el-select v-model="listQuery.enterpriseId"  placeholder="请输入所属企业">
                          <el-option
                            v-for="item in enterprise_list"
                            :key="item.id"
                            :label="item.enterpriseName"
                            :value="item.id">
                          </el-option>
                        </el-select>
                     </el-form-item>
                </el-col>
             </el-row>
             <el-row>
               <el-col :span="6">
                 <el-form-item label="车辆型号：">
                     <el-input v-model="listQuery.vehicleModel" placeholder="请选择车辆型号"></el-input>
                  </el-form-item>
               </el-col>
               <el-col :span="18">
                  <el-form-item>
                    <el-button type="primary" class="set-common-btn blue-button" @click.native="search">{{ $t('button.search') }}</el-button>
                    <el-button class="set-common-btn blank-blue-button" @click.native="reset">{{ $t('button.reset') }}</el-button>
                  </el-form-item>
               </el-col>
             </el-row>
          </el-form>
          
        </div>

<div class="table-list">
      <div class="btnLists">
          <el-button type="success" size="mini" class="set-common-btn blue-button" @click.native="add" v-permission="['/park/emergency/vehicle/add']">{{ $t('button.add') }}</el-button>
          <el-button type="danger" size="mini"  class="set-common-btn blank-blue-button" @click.native="batchDelete" v-permission="['/park/emergency/vehicle/delete']">批量删除</el-button>
      </div>
        <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" border fit
                  :row-key="row=>row.id"
                  @selection-change="handleSelectionChange"
                  @current-change="handleCurrentChange"
                  @row-click="toggleSelection"
                  ref="vehicleTable"
        >
          <el-table-column
            type="selection"
            width="55"
            :reserve-selection="true"
          >
          </el-table-column>
          <el-table-column
            type="index"
            width="55"
            label="序号"
          >
          </el-table-column>
          <el-table-column label="车辆名称" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{scope.row.vehicleName}}
                </template>
            </el-table-column>
            <el-table-column label="归属企业" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{scope.row.enterpriseName}}
                </template>
            </el-table-column>
            <el-table-column label="车牌号" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{scope.row.vehicleLicense}}
                </template>
            </el-table-column>
            <el-table-column label="车辆编号" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{scope.row.vehicleCode}}
                </template>
            </el-table-column>
            <el-table-column label="车辆类别" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{scope.row.vehicleTypeName}}
                </template>
            </el-table-column>
            <el-table-column label="车辆型号" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{scope.row.vehicleModel}}
                </template>
            </el-table-column>
            <el-table-column label="行政区划" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{scope.row.districtName}}
                </template>
            </el-table-column>
            <el-table-column label="负责人" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{scope.row.vehicleResponsible}}
                </template>
            </el-table-column>
            <el-table-column label="联系电话" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{scope.row.personTel}}
                </template>
            </el-table-column>
            <el-table-column label="生产厂家" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{scope.row.manufacturer}}
                </template>
            </el-table-column>

            <el-table-column label="操作" align="center" width="240px">
                <template slot-scope="scope">
                    <el-button type="text" size="mini" icon="el-icon-edit" @click.native="editItem(scope.row)" v-permission="['/park/emergency/vehicle/update']">{{ $t('button.edit') }}</el-button>
                    <el-button type="text" size="mini" icon="el-icon-delete" @click.native="removeItem(scope.row)" v-permission="['/park/emergency/vehicle/delete']">{{ $t('button.delete') }}</el-button>
                    <el-button type="text" size="mini" icon="el-icon-view"  @click.native="previewFile(scope.row)" >预览</el-button>

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
        <el-dialog
                :title="formTitle"
                :visible.sync="formVisible"
                onclose="cancleDelete"
                width="60%">
            <el-form ref="form" :model="form" :rules="rules" label-width="120px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="车辆名称："  >
                            <el-input v-model="form.vehicleName" minlength=1 placeholder="请输入车辆名称"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="归属企业："  >
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
                        <el-form-item label="车牌号："  >
                            <el-input v-model="form.vehicleLicense" minlength=1 placeholder="请输入车牌号"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="车辆编号："  >
                            <el-input v-model="form.vehicleCode" minlength=1 placeholder="请输入车牌编号"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="车辆类别："  >
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
                        <el-form-item label="车辆型号："  >
                            <el-input v-model="form.vehicleModel" minlength=1 placeholder="请输入车辆型号"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="行政区划："  >
                            <district v-model="form.districtCode" minlength=1></district>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="负责人：" >
                            <el-input v-model="form.vehicleResponsible" minlength=1 placeholder="请输入负责人"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="联系电话："  >
                            <el-input v-model="form.personTel" oninput="value=value.replace(/[^0-9.]/g,'')" minlength=1 placeholder="请输入联系电话"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="生产厂家："  >
                            <el-input v-model="form.manufacturer" minlength=1 placeholder="请输入生产厂家"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="经度："  >
                            <el-input v-model="form.longitude" oninput="value=value.replace(/[^0-9.]/g,'')" placeholder="请输入经度" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="纬度："  >
                            <el-input v-model="form.latitude" oninput="value=value.replace(/[^0-9.]/g,'')" placeholder="请输入纬度" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                  <el-col :span="16">
                    <el-form-item label="选择文件：">
                      <el-upload
                        :action="uploadUrl"
                        :headers="uploadHeaders"
                        :on-change="handleChangeUpload"
                        :on-success="uploadSuccess"
                        :accept="fileAccept"
                        :on-remove="removeFile"
                        :file-list="fileList"
                        :multiple="multiple"
                      >
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" >总上传大小50M，单个文件最大10M,<template>允许的文件类型为</template><span style="color: red">{{fileAccept}}</span></div>
                      </el-upload>
                    </el-form-item>
                  </el-col>

                </el-row>
                <el-form-item id="myself">
                    <el-button type="primary" @click="save">{{ $t('button.submit') }}</el-button>
                    <el-button @click.native="cancleDelete">{{ $t('button.cancel') }}</el-button>
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

