<template>
  <div class="app-container">
    <div class="block">
      <el-form>
            <el-row>
              <el-col :span="6">
                <el-form-item label="参数名：">
                  <el-input v-model="listQuery.cfgName" size="mini" :placeholder="$t('config.name')"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="参数值：">
                  <el-input v-model="listQuery.cfgValue" size="mini"  :placeholder="$t('config.value')"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-button type="success" size="mini" class="set-common-btn blue-button" @click.native="search">{{ $t('button.search') }}</el-button>
                <el-button type="primary" size="mini" class="set-common-btn blank-blue-button" @click.native="reset">{{ $t('button.reset') }}</el-button>
              </el-col>
            </el-row>
        </el-form>
    </div>

 <div class="table-list">
      <div class="btnLists">
          <el-button type="success" size="mini" class="set-common-btn blue-button" @click.native="add" v-permission="['/cfg/add']">{{ $t('button.add') }}</el-button>
          <el-button type="primary" size="mini" class="set-common-btn blank-blue-button" @click.native="edit" v-permission="['/cfg/update']">{{ $t('button.edit') }}</el-button>
          <el-button type="danger" size="mini" class="set-common-btn blue-button" @click.native="remove" v-permission="['/cfg/delete']">{{ $t('button.delete') }}</el-button>
          <el-button type="info" size="mini" class="set-common-btn blank-blue-button" @click.native="exportXls">{{ $t('button.export') }}</el-button>
      </div>
    <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row
    @current-change="handleCurrentChange">

      <el-table-column label="ID" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.id}}
        </template>
      </el-table-column>
      <el-table-column :label="$t('config.name')" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.cfgName}}
        </template>
      </el-table-column>
      <el-table-column :label="$t('config.value')" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.cfgValue}}
        </template>
      </el-table-column>
      <el-table-column :label="$t('config.descript')" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.cfgDesc}}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="mini" icon="el-icon-edit" @click.native="editItem(scope.row)" v-permission="['/cfg/update']">{{ $t('button.edit') }}</el-button>
          <el-button type="text" size="mini" icon="el-icon-delete" @click.native="removeItem(scope.row)" v-permission="['/cfg/delete']">{{ $t('button.delete') }}</el-button>
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
    <el-dialog
      :title="formTitle"
      :visible.sync="formVisible"
      width="70%">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('config.name')" prop="cfgName">
              <el-input v-model="form.cfgName" minlength=1></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('config.value')" prop="cfgValue">
              <el-input v-model="form.cfgValue"  minlength=1></el-input>
            </el-form-item>
          </el-col>


          <el-col :span="12">
            <el-form-item :label="$t('config.descript')" prop="cfgDesc">
              <el-input v-model="form.cfgDesc"></el-input>
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

<script src="./cfg.js"></script>

