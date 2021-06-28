<template>
  <div class="app-container">
    <div class="table-list">
      <div class="btnLists">
        <el-button type="success" size="mini"  class="set-common-btn blue-button" @click.native="add"
                   v-permission="['/riskUnit/add']">{{ $t('button.add') }}
        </el-button>

        <el-button type="danger"  class="set-common-btn blank-blue-button" @click.native="removeBatch"
                   v-permission="['/riskUnit/delete']">批量删除
        </el-button>
      </div>
    <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row
              :row-key="row=>row.id"
              height="331"
              @selection-change="handleSelectionChange"
              @current-change="handleCurrentChange"
              ref="unitTable" @row-click="toggleSelection">
      <el-table-column
        type="selection"
        width="55"
        :reserve-selection="true"
      >
      </el-table-column>
      <el-table-column
        type="index"
        width="50"
      >
      </el-table-column>
      <el-table-column label="风险单元名称" show-overflow-tooltip>
        <template slot-scope="scope">
          <span class="updateText" @click="viewUnit(scope.row)"> {{scope.row.riskName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="风险类型" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.riskTypeName}}
        </template>
      </el-table-column>
      <el-table-column label="负责人" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.headPerson}}
        </template>
      </el-table-column>

      <el-table-column label="风险物质" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.detail}}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="mini" icon="el-icon-edit" @click.native="editItem(scope.row)"
                     v-permission="['/riskUnit/edit']">{{ $t('button.edit') }}
          </el-button>
          <el-button type="text"  size="mini" icon="el-icon-delete" @click.native="removeItem(scope.row)"
                     v-permission="['/riskUnit/delete']">{{ $t('button.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    </div>
    <div>
    <el-pagination
      background
      class="outer-pagenation"
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="[5,10, 20, 50, 100,500]"
      :page-size="listQuery.limit"
      :total="total"
      @size-change="changeSize"
      @current-change="fetchPage"
      @prev-click="fetchPrev"
      @next-click="fetchNext">
    </el-pagination>
    <div class="align-center">
      <el-button type="primary" @click="closeFatherDialog" class="set-common-btn blue-button">{{ $t('button.submit') }}</el-button>
      <el-button @click="closeFatherDialog" class="set-common-btn blank-blue-button">关闭</el-button>
    </div>
</div>
<!-- 添加风险单元弹框 -->
    <el-dialog
      class="common-dialog-style height700"
      :title="formTitle"
      :visible.sync="formVisible"
      :modal="false"
      width="960px" height="642px">
      <div class="block">
        <el-form ref="form" :model="form" :rules="rules" label-width="104px"  class="align-right has-Label-Width">
          <el-row>

            <el-col :span="12">
              <el-form-item label="风险单元名称：">
                <el-input v-model="form.riskName" minlength=1></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="重大危险源：">
                <el-select v-model="form.isDangerSource" minlength=1 placeholder="请选择是否">
                  <el-option
                    v-for="item in isDangerSource"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="风险类型：">
                <el-select v-model="form.riskType" minlength=1>
                  <el-option
                    v-for="item in risk_type"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="负责人：">
                <el-input v-model="form.headPerson" minlength=1></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系电话：">
                <el-input v-model="form.personTel" minlength=1 oninput="value=value.replace(/[^0-9.]/g,'')"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row style="border:1px solid #f3f5fb;padding-top:15px;padding-bottom:10px;">

             <el-scrollbar class="material-scrollbar">
          <el-form-item
            class="risk-material-item"

            v-for="(rec, index) in form.details"
            :label="'风险物质' + (index+1)+'：'"
            :key="index"
            :prop="'details.' + index + '.criticalQuantity'"
            :rules="{                required: false, message: '不能为空', trigger: 'blur'                }"
          >
         
            <el-col :span="4">
              <el-form-item>
                <el-input class="el-input-style" v-model="rec.materialId"  minlength=1 @input="onInput()" ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="现存量：" label-width="80px">
                <el-input class="el-input-style" v-model="rec.currentStock"  @input="onInput()" minlength=1 oninput="value=value.replace(/[^0-9.]/g,'')" ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="临界量：" label-width="80px" style="margin-left: 40px">
                <el-input class="el-input-style" v-model="rec.criticalQuantity "  @input="onInput()" oninput="value=value.replace(/[^0-9.]/g,'')" minlength=1  ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="3" style="text-align: center">
              <i v-if="index==form.details.length-1" class="el-icon-circle-plus-outline operate-icon"  @click.prevent="addDetail"/>
              <i v-if="form.details.length>1" class="el-icon-remove-outline operate-icon" style="margin-left: 10px" @click.prevent="removeDetail(rec)"/>
              <!-- <el-button @click.prevent="removeDetail(rec)" type="danger" class="set-common-btn blank-blue-button">{{ $t('button.delete') }}
              </el-button> -->
            </el-col>
          </el-form-item>
</el-scrollbar>
          </el-row>
          <el-row>
            <el-form-item  class="align-center" style="margin-top:10px">
              <el-button type="primary" class="set-common-btn blue-button" @click="save">{{ $t('button.submit') }}</el-button>

              <el-button @click.native="formVisible = false" class="set-common-btn blank-blue-button">{{ $t('button.cancel') }}</el-button>
            </el-form-item>
           </el-row>
        </el-form>
      </div>
    </el-dialog>
    <el-dialog
      class="common-dialog-style height700"
      :title="formTitle"
      :visible.sync="unitVisible"
      :modal="false"
      width="960px" height="642px">
      <div class="block">
        <el-form ref="form" :model="form" :rules="rules" label-width="104px"  class="align-right has-Label-Width">
          <el-row>

            <el-col :span="12">
              <el-form-item label="风险单元名称：">
                <el-input v-model="form.riskName" minlength=1></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="重大危险源：">
                <el-select v-model="form.isDangerSource" minlength=1 placeholder="请选择是否">
                  <el-option
                    v-for="item in isDangerSource"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="风险类型：">
                <el-select v-model="form.riskType" minlength=1>
                  <el-option
                    v-for="item in risk_type"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="负责人：">
                <el-input v-model="form.headPerson" minlength=1></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系电话：">
                <el-input v-model="form.personTel" minlength=1 oninput="value=value.replace(/[^0-9.]/g,'')"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row style="border:1px solid #f3f5fb;padding-top:15px;padding-bottom:10px;">

            <el-scrollbar class="material-scrollbar">
              <el-form-item
                class="risk-material-item"

                v-for="(rec, index) in form.details"
                :label="'风险物质' + (index+1)+'：'"
                :key="index"
                :prop="'details.' + index + '.criticalQuantity'"
                :rules="{                required: false, message: '不能为空', trigger: 'blur'                }"
              >

                <el-col :span="4">
                  <el-form-item>
                    <el-input class="el-input-style" v-model="rec.materialId"  minlength=1 @input="onInput()" ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="7">
                  <el-form-item label="现存量：" label-width="80px">
                    <el-input class="el-input-style" v-model="rec.currentStock"  @input="onInput()" minlength=1 oninput="value=value.replace(/[^0-9.]/g,'')" ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="临界量：" label-width="80px" style="margin-left: 40px">
                    <el-input class="el-input-style" v-model="rec.criticalQuantity "  @input="onInput()" oninput="value=value.replace(/[^0-9.]/g,'')" minlength=1  ></el-input>
                  </el-form-item>
                </el-col>
              </el-form-item>
            </el-scrollbar>
          </el-row>
        </el-form>
      </div>
    </el-dialog>

  </div>
</template>

<script  src="./unitInfo.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .common-dialog-style{
    .operate-icon{
      height: 28px;
      line-height: 28px;
      font-size: 20px;
      color: #1a80ff;
    }
   >>> .el-dialog{
       min-height: 642px;
    }
   
    .el-form{
      .el-form-item{
        &.risk-material-item{
         margin-bottom: 0;
         >>> .el-form-item__content{
            .el-form-item{
               
             .el-form-item__label{
                width: 76px !important;
              }
             .el-form-item__content{
                .el-input{
                  width: 82px !important;
                  input{
                    width: 100% !important;
                  }
                }
             }

            }
          }
        }
      }
    }
    >>> .el-scrollbar{
  .el-scrollbar__wrap{
    max-height: 300px; // 最大高度
    overflow-x: hidden;
  } 
}
  }
</style>
