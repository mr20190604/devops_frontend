<template>
    <div class="app-container">
        <div class="block">
            <el-form label-width="120px" :inline="true" >
              <el-row>
                <el-form-item label="设备类型">
                  <dict-select dict-name="设备类型" v-model="listQuery.equipmentType"  placeholder="请选择"/>
                </el-form-item>
                <el-form-item label="设备编号">
                  <el-input v-model="listQuery.equipmentCode" placeholder="请输入设备编号"></el-input>
                </el-form-item>

                <el-form-item label="设备状态">
                  <dict-select v-model="listQuery.equipmentStatus1" dict-name="设备状态" placeholder="请选择"/>
                </el-form-item>

              </el-row>

              <el-row>

                <el-form-item label="上报时间">
                  <el-date-picker type="datetime" v-model="listQuery.startTime" placeholder="开始时间"></el-date-picker>
                  <el-date-picker type="datetime" v-model="listQuery.endTime" placeholder="结束时间"></el-date-picker>
                </el-form-item>

                <el-form-item style="float: right;margin-right: 100px">

                  <el-button type="primary" icon="el-icon-search" @click.native="search">{{ $t('button.search') }}</el-button>
                  <el-button  icon="el-icon-refresh" @click.native="reset">{{ $t('button.reset') }}</el-button>
                </el-form-item>


              </el-row>






            </el-form>
            <br>
        </div>


        <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row
                  @current-change="handleCurrentChange">
          <el-table-column type="index" width="50px" label="序号">
          </el-table-column>
            <el-table-column label="设备名称">
                <template slot-scope="scope">
                    {{scope.row.equipmentName}}
                </template>
            </el-table-column>
            <el-table-column label="设备编码">
                <template slot-scope="scope">
                    {{scope.row.equipmentCode}}
                </template>
            </el-table-column>
            <el-table-column label="设备类型">
                <template slot-scope="scope">
                    {{scope.row.equipmentTypeName}}
                </template>
            </el-table-column>

            <el-table-column label="设备状态">
                <template slot-scope="scope">
                    {{scope.row.equipmentStatus1Name}}
                </template>
            </el-table-column>

            <el-table-column label="地址">
                <template slot-scope="scope">
                  {{scope.row.equipmentInstallInfo.installLocation}}
                </template>
            </el-table-column>
            <el-table-column label="实时值">
                <template slot-scope="scope">
                    {{scope.row.realValue}}
                </template>
            </el-table-column>
            <el-table-column label="报送时间">
                <template slot-scope="scope">
                    {{scope.row.reportTime}}
                </template>
            </el-table-column>

            <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button type="text" size="mini" @click.native="viewCurve(scope.row)"  v-permission="['/mmBasEquipment/curve']">监测曲线</el-button>
                  <el-button type="text" size="mini"   v-permission="['/mmBasEquipment/thresholdSearch']">阈值查询</el-button>
                  <el-button type="text" size="mini"   v-permission="['/mmBasEquipment/location']">定位</el-button>
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
                width="40%"

                @close="closeTimer"
        >
          <div align="center">
            <v-chart :options="lineData" ref="myEchart"/>
          </div>
        </el-dialog>
    </div>
</template>

<script src="./mmBasEquipment.js"></script>


<style rel="stylesheet/scss" lang="scss" scoped>
    @import "src/styles/common.scss";
</style>

