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
          <el-button type="success" size="mini"  icon="el-icon-plus" @click.native="add" v-permission="['/bas/pipeline/add']">{{ $t('button.add') }}</el-button>
          <el-button type="primary" size="mini"  icon="el-icon-edit" @click.native="edit" v-permission="['/bas/pipeline/update']">{{ $t('button.edit') }}</el-button>
          <el-button type="danger" size="mini"  icon="el-icon-delete" @click.native="remove" v-permission="['/bas/pipeline/delete']">{{ $t('button.delete') }}</el-button>
        </el-col>
      </el-row>
    </div>


    <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row
              :row-key="(row) => row.id"
              @current-change="handleCurrentChange">
      <el-table-column label="管线编号">
        <template slot-scope="scope">
          {{scope.row.pipelineCode}}
        </template>
      </el-table-column>

      <el-table-column label="起点管顶高程">
        <template slot-scope="scope">
          {{scope.row.startHeight}}
        </template>
      </el-table-column>
      <el-table-column label="终点管顶高程">
        <template slot-scope="scope">
          {{scope.row.endHeight}}
        </template>
      </el-table-column>
      <el-table-column label="起点埋深">
        <template slot-scope="scope">
          {{scope.row.startDeep}}
        </template>
      </el-table-column>
      <el-table-column label="终点埋深">
        <template slot-scope="scope">
          {{scope.row.endDeep}}
        </template>
      </el-table-column>
      <el-table-column label="材质">
        <template slot-scope="scope">
          {{scope.row.materialType}}
        </template>
      </el-table-column>
      <el-table-column label="管径">
        <template slot-scope="scope">
          {{scope.row.pipeDiameter}}
        </template>
      </el-table-column>
      <el-table-column label="管长">
        <template slot-scope="scope">
          {{scope.row.pipeLength}}
        </template>
      </el-table-column>
      <el-table-column label="所属行政区">
        <template slot-scope="scope">
          {{scope.row.districtCode}}
        </template>
      </el-table-column>
      <el-table-column label="所在道路">
        <template slot-scope="scope">
          {{scope.row.roadId}}
        </template>
      </el-table-column>
      <el-table-column label="位置描述">
        <template slot-scope="scope">
          {{scope.row.address}}
        </template>
      </el-table-column>
      <el-table-column label="经度">
        <template slot-scope="scope">
          {{scope.row.longitude}}
        </template>
      </el-table-column>
      <el-table-column label="纬度">
        <template slot-scope="scope">
          {{scope.row.latitude}}
        </template>
      </el-table-column>
      <el-table-column label="所属系统 water供水、gas燃气、bridge桥梁">
        <template slot-scope="scope">
          {{scope.row.systemFlag}}
        </template>
      </el-table-column>
      <el-table-column label="备注">
        <template slot-scope="scope">
          {{scope.row.notes}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="mini" icon="el-icon-edit" @click.native="editItem(scope.row)" v-permission="['/bas/pipeline/update']">{{ $t('button.edit') }}</el-button>
          <el-button type="text" size="mini" icon="el-icon-delete" @click.native="removeItem(scope.row)" v-permission="['/bas/pipeline/delete']">{{ $t('button.delete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script src="./pipelineInfo.js">

</script>

<style scoped>

</style>
