<template>
    <div class="app-container">

      <div class="block">
        <el-form>
          <el-row >
            <el-col :span="12">
              <el-form-item label="设备名称">
                <el-input v-model="listQuery.equipmentName" placeholder="请输入设备名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="设备编码">
                <el-input v-model="listQuery.equipmentCode" placeholder="请输入设备编码"></el-input>
              </el-form-item>
            </el-col>

          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="设备类型">
                <dict-select v-model="listQuery.equipmentType" dict-name="设备类型">
                </dict-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-button type="primary" class="set-common-btn blue-button" @click.native="search">{{ $t('button.search') }}</el-button>
              <el-button class="set-common-btn blank-blue-button" @click.native="reset">{{ $t('button.reset') }}</el-button>
            </el-col>

          </el-row>

        </el-form>


      </div>

      <div class="table-list" style="padding-bottom: 48px;">
        <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row
                  @current-change="handleCurrentChange" @selection-change="handleSelectionChange" ref="equipTable">

          <el-table-column
            type="index"
            width="55"
            label="序号"
          />
          <el-table-column label="设备名称" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.equipmentName}}
            </template>
          </el-table-column>
          <el-table-column label="设备编码" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.equipmentCode}}
            </template>
          </el-table-column>
          <el-table-column label="设备类型" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.equipmentTypeName}}
            </template>
          </el-table-column>
         <el-table-column label="操作">
           <template slot-scope="scope">
             <el-button
               type="text"
               size="mini"
               icon="el-icon-edit"
               @click.native="dataReplace(scope.row)"
             >更换
             </el-button>
           </template>
         </el-table-column>

        </el-table>
      </div>

      <div>
        <el-row>
          <el-col :span="8">
            <div >
              <!--分页-->
              <el-pagination
                background
                class="position-pagination"
                layout="total, sizes, prev, pager, next, jumper"
                :page-sizes="[9]"
                :page-size="listQuery.limit"
                :total="total"
                @size-change="changeSize"
                @current-change="fetchPage"
                @prev-click="fetchPrev"
                @next-click="fetchNext"
                style="width: 60%"
              >
              </el-pagination>
            </div>
          </el-col>
        </el-row>
      </div>

    </div>
</template>

<script>
  import mmBasEquipmentApi from '@/api/mm/mmBasEquipment'
  export default {
        name: "equipList",
        props: {
        },
        data() {
          return {
            listQuery:{
              equipmentName:'',
              equipmentCode:'',
              equipmentType:'',
              page: 1,
              limit: 9,
            },
            list:null,
            selRow: {},
            selection: [],
            listLoading: true,
            total:0,


          }
        },
      created() {
          this.init();
      },
      methods:{
        init: function () {
          this.fetchData()
        },
        fetchData:function() {
          mmBasEquipmentApi.getList(this.listQuery).then(response => {
            this.list = response.data.records;
            this.listLoading = false;
            this.total = response.data.total
          });
        },
        search: function () {
          console.log('search')

        },
        reset: function () {
          console.log('reset')
        },
        handleCurrentChange(currentRow, oldCurrentRow) {
          this.selRow = currentRow
        },
        handleSelectionChange(selection) {
          this.selection = selection
        },
        fetchNext() {
          this.listQuery.page = this.listQuery.page + 1;
          this.fetchData()
        },
        fetchPrev() {
          this.listQuery.page = this.listQuery.page - 1;
          this.fetchData()
        },
        fetchPage(page) {
          this.listQuery.page = page;
          this.fetchData()
        },
        changeSize(limit) {
          this.listQuery.limit = limit;
          this.fetchData()
        },
        dataReplace(record) {
          console.log('dataReplace')

        }
      }
    }
</script>

<style scoped>

</style>
