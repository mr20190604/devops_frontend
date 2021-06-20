<template>
  <div style="width: 100%;max-height: 600px">
    <el-row class="flex justify-between marginT20">
      <el-col :class="!fileShow?'fullWidth':'smallWidth'">
        <div class="grid-content bg-purple">
          <div class="table-list">
          <el-table v-loading="loading" :data="init_list" element-loading-text="Loading">
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
      <el-col class="remainWidth" v-if="fileShow">
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
      }

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
    }
  }
}
</script>

<style scoped>
.grid-content{
  margin-left: 2%;
}
.fullWidth{
  width: 100%;
}
.smallWidth{
  width: 33%;
}
.remainWidth{
  width: 68%;
}
</style>
