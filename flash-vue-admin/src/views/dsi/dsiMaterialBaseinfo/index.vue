<template>
  <div class="app-container">
    <div class="block">
      <el-form>
        <el-row>
          <el-col :span="6">
            <el-form-item label="关键字：">
              <el-input
                v-model="listQuery.key"
                placeholder="请输入关键字(编码、名称)"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="原料类别：">
              <dict-select
                v-model="listQuery.materialType"
                dict-name="原料类别"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="是否危化品：">
              <dict-select
                v-model="listQuery.isDanger"
                dict-name="是否"
                placeholder="是否危化品"
              />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-button type="primary" class="set-common-btn blue-button" @click.native="search">{{ $t('button.search')
                }}
              </el-button>
              <el-button @click.native="reset" class="set-common-btn blank-blue-button">{{ $t('button.reset') }}
              </el-button>
            </el-form-item>
          </el-col>

        </el-row>

      </el-form>
    </div>
    <div class="table-list outer-table-list">
      <div class="btnLists">
        <el-button
          class="set-common-btn blue-button"
          v-permission="['/material/baseinfo/add']"
          type="success"
          size="mini"
          @click.native="add"
        >{{ $t('button.add') }}
        </el-button>
        <el-button
          class="set-common-btn blank-blue-button"
          v-permission="['/material/baseinfo/delete']"
          type="danger"
          size="mini"
          @click.native="removeBatch"
        >批量删除
        </el-button
        >
      </div>
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        border
        :row-key="(row) => row.id"
        @current-change="handleCurrentChange"
        @selection-change="handleSelectionChange"
        @row-click="toggleSelection"
        ref="materialTable"
      >
        <el-table-column
          type="selection"
          width="55"
          :reserve-selection="true"
        />
        <el-table-column type="index" width="55" label="序号"/>
        <el-table-column label="原料编码" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.materialCode }}
          </template>
        </el-table-column>
        <el-table-column label="化学名称" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.chemistryName }}
          </template>
        </el-table-column>
        <el-table-column label="英文名称" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.englishName }}
          </template>
        </el-table-column>
        <el-table-column label="中文别名" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.shortName }}
          </template>
        </el-table-column>
        <el-table-column label="原料类别" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.materialTypeName }}
          </template>
        </el-table-column>
        <el-table-column label="理化性质" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.physicochemicalProperties }}
          </template>
        </el-table-column>
        <el-table-column label="健康危害" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.healthHazards }}
          </template>
        </el-table-column>
        <el-table-column label="危险特性" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.dangerousCharacteristic }}
          </template>
        </el-table-column>
        <el-table-column label="CAS编号" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.casCode }}
          </template>
        </el-table-column>
        <el-table-column label="是否危化品" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.isDangerName }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="170">
          <template slot-scope="scope">
            <el-button
              v-permission="['/material/baseinfo/update']"
              type="text"
              size="mini"
              class="font14"
              icon="el-icon-edit"
              @click.native="editItem(scope.row)"
            >{{ $t('button.edit') }}
            </el-button>
            <el-button
              v-permission="['/material/baseinfo/delete']"
              type="text"
              size="mini"
              class="font14 marginleft23"
              icon="el-icon-delete"
              @click.native="removeItem(scope.row)"
            >{{ $t('button.delete') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      background
      class="position-pagination"
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="[10, 20, 50, 100, 500]"
      :page-size="listQuery.limit"
      :total="total"
      @size-change="changeSize"
      @current-change="fetchPage"
      @prev-click="fetchPrev"
      @next-click="fetchNext"
    />

    <el-dialog
      class="common-dialog-style"
      :title="formTitle"
      :visible.sync="formVisible"
      width="960px"
    >
      <div class="block">
        <el-form ref="form" :model="form" :rules="rules" label-width="84px" class="align-right has-Label-Width">
          <el-row>
            <el-col :span="12">
              <el-form-item label="原料编号：">
                <el-input
                  v-model="form.materialCode"
                  minlength="1"
                  placeholder="请输入原料编号"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="化学名：">
                <el-input
                  v-model="form.chemistryName"
                  minlength="1"
                  placeholder="请输入化学名称"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="英文名：">
                <el-input
                  v-model="form.englishName"
                  minlength="1"
                  placeholder="请输入英文名称"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="中文名：">
                <el-input
                  v-model="form.shortName"
                  minlength="1"
                  placeholder="请输入中文别名"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="原料类别：">
                <dict-select v-model="form.materialType" dict-name="原料类别"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="理化性质：">
                <el-input
                  v-model="form.physicochemicalProperties"
                  minlength="1"
                  placeholder="请输入理化性质"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="健康危害：">
                <el-input
                  v-model="form.healthHazards"
                  minlength="1"
                  placeholder="请输入健康危害"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="危险特性：">
                <el-input
                  v-model="form.dangerousCharacteristic"
                  minlength="1"
                  placeholder="请输入危险特性"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="CAS编号：">
                <el-input
                  v-model="form.casCode"
                  minlength="1"
                  placeholder="请输入CAS编号"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否危化品：">
                <dict-select
                  v-model="form.isOriginal"
                  dict-name="是否"
                  placeholder="请选择是否危化品"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item class="dialog-button-list">
            <el-button type="primary" @click="save" class="set-common-btn blue-button">{{
              $t('button.submit')
              }}
            </el-button>
            <el-button @click.native="formVisible = false" class="set-common-btn blank-blue-button">{{
              $t('button.cancel')
              }}
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script src="./dsiMaterialBaseinfo.js"></script>


