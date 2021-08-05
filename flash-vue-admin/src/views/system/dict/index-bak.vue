<template>
  <div class="app-container">
    <div class="block">
        <el-form>
            <el-row>
              <el-col :span="6">
                <el-form-item label="字典名称：">
                   <el-input v-model="listQuery.name" size="mini" placeholder="请输入字典名称" />
                </el-form-item>
              </el-col>
              <el-col :span="18">
                <el-button type="success" size="mini" class="set-common-btn blue-button" @click.native="search">{{ $t('button.search') }}</el-button>
                <el-button type="primary" size="mini" class="set-common-btn blank-blue-button" @click.native="reset">{{ $t('button.reset') }}</el-button>
              </el-col>
            </el-row>
        </el-form>
    </div>
 <div class="table-list">
      <div class="btnLists">
          <el-button v-permission="['/dict/add']"  class="set-common-btn blue-button" @click.native="add">{{ $t('button.add') }}</el-button>
          <el-button v-permission="['/dict/update']"  class="set-common-btn blank-blue-button" @click.native="edit" size="mini">{{ $t('button.edit') }}</el-button>
          <el-button v-permission="['/dict/delete']" class="set-common-btn blue-button" @click.native="remove">{{ $t('button.delete') }}</el-button>

      </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      @current-change="handleCurrentChange"
    >
      <el-table-column label="ID" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="名称" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="详情" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.detail }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button v-permission="['/dict/update']" type="text" size="mini" icon="el-icon-edit" @click.native="editItem(scope.row)">{{ $t('button.edit') }}</el-button>
          <el-button v-permission="['/dict/delete']" type="text" size="mini" icon="el-icon-delete" @click.native="removeItem(scope.row)">{{ $t('button.delete') }}</el-button>
        </template>

      </el-table-column>

    </el-table>
 </div>
 <!-- 添加字典弹框 -->
    <el-dialog
    class="el-dialog-style common-dialog-style"
      :title="formTitle"
      :visible.sync="formVisible"
      width="960px"
    >
    <div class="block">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="名称：" prop="name">
          <el-input v-model="form.name" minlength="1" />
        </el-form-item>
         <el-row>
            <el-col>
              <el-form-item >
                <el-button @click="addDetail" class="set-common-btn blank-blue-button">新增字典</el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="noXscroll">
            <el-scrollbar>
        <el-form-item
          v-for="(rec, index) in form.details"
          :key="index"
          :label="'字典' + (index+1)+'：'" :prop="'details.' + index + '.value'"
          :rules="{
            required: true, message: '不能为空', trigger: 'blur'
          }"
        >
          <el-col :span="9">
            <el-input v-model="rec.key" placeholder="值" />
          </el-col>
          <el-col class="line" :span="1">&nbsp;</el-col>
          <el-col :span="9">
            <el-input v-model="rec.value" placeholder="名称" />
          </el-col>
          <el-col :span="2">
             <i class="el-icon-remove-outline operate-icon" @click.prevent="removeDetail(rec)"/>
            <!-- <el-button type="danger" icon="el-icon-delete" @click.prevent="removeDetail(rec)">{{ $t('button.delete') }}</el-button> -->
          </el-col>
        </el-form-item>
        </el-scrollbar>
      </el-row>
        <el-form-item class="dialog-button-list marginT10">
          <el-button type="primary" @click="save" class="set-common-btn blue-button">{{ $t('button.submit') }}</el-button>
          <!-- <el-button @click="addDetail" class="set-common-btn blank-blue-button">新增字典</el-button> -->
          <el-button @click.native="formVisible = false" class="set-common-btn blank-blue-button">{{ $t('button.cancel') }}</el-button>
        </el-form-item>
      </el-form>
    </div>
    </el-dialog>

  </div>
</template>

<script src="./dict.js"></script>
<style scoped lang="scss">
.common-dialog-style .block .el-form .el-row .el-col:nth-of-type(even){
  display: initial;
}
>>> .el-scrollbar {
	.el-scrollbar__wrap {
    max-height: 480px;
	}
}
</style>
