<template>
  <div style="width: 100%;" class="file-container">
    <el-row class="flex justify-between marginT20">
      <!--<el-col :class="!fileShow?'fullWidth':'smallWidth'" >-->
      <el-col :class="drawer?'fullWidth':'smallWidth'" >
        <div class="grid-content bg-purple">
            <div class="table-list" style="padding-left:0" modal-append-to-body="false" >
              <el-table v-loading="loading" :data="init_list" element-loading-text="Loading" max-height="331px" style="overflow-x: hidden">
                <el-table-column label="附件名称" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <div @click="viewFile(scope.row)">
                      {{ scope.row.fileInfo.originalFileName }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                  <template slot-scope="scope">
                    <el-button type="text" size="mini" icon="el-icon-download" @click.native="downloads(scope.row)">下载</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
        </div>
      </el-col>
      <el-col style="width: 40px;">
        <template>
          <button class="openButton" type="button" @click="drawer == true ? drawer = false:drawer=true">
             <span v-if="drawer == false" class="el-icon-arrow-right" > </span>
            <span v-if="drawer == true" class="el-icon-arrow-left"  > </span>
          </button>
          <!--<button type="primary" >-->
           <!---->
          <!--</button>-->
        </template>
      </el-col>
      <el-col class="remainWidth" v-if="fileShow" >
        <div class="grid-content bg-purple">
          <preview  :preview-style="previewStyle" :preview-file-url="previewFileUrl" />
        </div>
      </el-col>
    </el-row>

  </div>

</template>

<script>

import { isCanPreview, downloadFile } from '@/utils/preview.js'
import { getApiUrl, getPreviewUrl } from '@/utils/utils'
export default {
  name: 'FilePreview',
  props: {
    files: {
      default: undefined
    },
    downloadFileUrl: {
      type: String,
      default: undefined
    }
  },
  data() {
    return ({
      list: null,
      loading: true,
      previewStyle: null,
      previewFileUrl: null,
      previewTitle: '',
      fileShow: true,
      previewStyle: {
        height: '600px',
        width: '100%'
      },
      drawer:false,
      flag:false

    })
  },
  computed: {
    init_list: function() {
      this.list = this.files
      this.loading = false
      if (this.files) {
        if (this.files.length < 1) {
          this.fileShow = false
        } else {
          this.viewFile(this.files[0])
        }
      }
      return this.list
    }

  }, methods: {
    init() {
      this.loading = false
    },
    viewFile(record) {
      if (!record.fileInfo) {
        this.$message({
          message: this.$t('不存在预览文件'),
          type: 'success'
        })
        this.fileShow = false
      }
      if (!isCanPreview(record.fileInfo.originalFileName)) {
        this.$message({
          message: this.$t('该文件类型不支持预览'),
          type: 'success'
        })
        this.fileShow = false
      } else {
        this.fileShow = true
        const originUrl = this.downloadFileUrl + record.fileInfo.id + '&fileName=' + record.fileInfo.originalFileName
        const preview = getPreviewUrl(1, originUrl, [record.fileInfo.originalFileName])
        this.previewTitle = record.lawName
        this.previewFileUrl = preview
      }
    }, downloads(record) {
      const param = {
        idFile: record.fileInfo.id,
        fileName: record.fileInfo.originalFileName
      }
      downloadFile('/file/download', param, record.fileInfo.originalFileName)
    },
    openDrawer() {
      console.log(this.drawer)
      if (this.drawer) {
        this,drawer = false
      } else {
        this,drawer = true
      }
    }

  }
}
</script>

<style scoped>
  @import url("//unpkg.com/element-ui@2.15.3/lib/theme-chalk/index.css");

.grid-content{
  margin-left: 2%;
}
.fullWidth{
  width: 60%;
  transition: width 0.5s;
}
.smallWidth{
  width: 0px;
  transition: width 0.4s;
}
.remainWidth{
  width: 100%;
}
  >>> .el-table__body-wrapper{
    overflow-x: hidden;
  }

  .openButton{
    margin-top: 250px;
    height: 50px;
    width: 20px;
    border: none;
    background: none;
    cursor: pointer;
    outline: none;
  }
</style>
