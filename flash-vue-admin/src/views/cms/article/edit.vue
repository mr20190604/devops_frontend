<template>

  <div class="app-container">
    <div class="block">
      <el-form ref="form" :model="form" label-width="76px" class="align-right has-Label-Width">
        <el-input ref="content" v-model="form.content" type="hidden" />
        <el-row class="hasmarginBottom">
          <el-col :span="5">
            <el-form-item label="文章标题：">
              <el-input v-model="form.title" minlength="1" placeholder="文章标题" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="选择栏目：">
              <el-select v-model="form.idChannel" placeholder="选择栏目">
                <el-option
                  v-for="item in options"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="作者：">
              <el-input v-model="form.author" minlength="1" placeholder="作者" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item>
              <el-button class="set-common-btn blue-button" type="primary" @click="save">{{ $t('button.submit') }}</el-button>
              <el-button class="set-common-btn blank-blue-button" @click.native="back">{{ $t('button.back') }}</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item v-if="ifUpload" label="题图：">
              <el-upload
                class="upload-demo"
                drag
                :action="uploadUrl"
                :headers="uploadHeaders"
                :before-upload="handleBeforeUpload"
                :on-success="handleUploadSuccess"
              >
                <i class="el-icon-upload" />
                <div class="el-upload__text">上传图片</div>
              </el-upload>
            </el-form-item>

          </el-col>
        </el-row>
        <el-row v-if="ifUpload!==true">
          <el-col :span="12" class="flex flex-column marginT20">
            <p class="textAlignLeft"><img :src="articleImg" style="height:8rem;"></p>
            <el-button class="set-common-btn blue-button marginT10" @click.native="uploadImg">修改题图</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="table-list">
      <div :class="{fullscreen:fullscreen}" class="tinymce-container editor-container">
        <textarea :id="tinymceId" class="tinymce-textarea" />
        <div class="editor-custom-btn-container">
          <editorImage color="#1890ff" class="editor-upload-btn" @successCBK="imageSuccessCBK" />
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./edit.js"></script>

<style scoped lang="scss">
.main-container .block .el-form .el-row:last-child .el-col:last-child{
  text-align: left;
}
>>> .upload-demo{
  display: flex;
  .el-upload-list{
     margin-left: 10px;
  }
}
  .tinymce-container {
    position: relative;
    line-height: normal;
    padding-top: 12px;
  }

  .tinymce-container >>> .mce-fullscreen {
    z-index: 10000;
  }

  .tinymce-textarea {
    visibility: hidden;
    z-index: -1;
  }

  .editor-custom-btn-container {
    position: absolute;
    right: 4px;
    top: 15px;
    /*z-index: 2005;*/
  }

  .fullscreen .editor-custom-btn-container {
    z-index: 10000;
    position: fixed;
  }

  .editor-upload-btn {
    display: inline-block;
  }
</style>
