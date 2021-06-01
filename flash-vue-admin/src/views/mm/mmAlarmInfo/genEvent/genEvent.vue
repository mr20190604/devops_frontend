<template>
  <el-form ref="form" :model="mmManagerEvent" :rules="rules" label-width="120px">
    <el-row>
      <!--<el-col :offset="3" :span="10">
        <el-form-item label="事件编码：" class="formLable">
          <el-input v-model="form.eventCode" minlength="1" placeholder="请输入事件编码" />
        </el-form-item>
      </el-col>-->
      <el-col :offset="3" :span="10">
        <el-form-item label="事件类型：" class="formLable">
          <dict-select v-model="mmManagerEvent.eventType" dict-name="事件类型" />
        </el-form-item>
      </el-col>
      <el-col :pull="2" :span="10">
        <el-form-item label="事件名称：" class="formLable">
          <el-input v-model="mmManagerEvent.eventName" minlength="1" placeholder="请输入事件名称" />
        </el-form-item>
      </el-col>
      <el-col :offset="3" :span="10">
        <el-form-item label="事件地点：" class="formLable">
          <el-input v-model="mmManagerEvent.eventAddress" minlength="1" placeholder="请输入事件地点" />
        </el-form-item>
      </el-col>
      <el-col :offset="3" :span="16">
        <el-form-item label="事件描述：" class="formLable">
          <el-input :autosize="{ minRows: 2, maxRows: 4}" type="textarea" v-model="mmManagerEvent.eventDesc" minlength="1" placeholder="请输入事件描述" />
        </el-form-item>
      </el-col>
      <el-col :offset="4" :span="16">
        <el-upload
          :action="uploadUrl"
          :headers="uploadHeaders"
          :on-change="handleChangeUpload"
          :on-success="uploadSuccess"
          :on-remove="removeFile"
          :file-list="fileList"
          :multiple="multiple"
          :limit="fileLimit"
          accept=".doc,.docx,.pdf,.zip,.rar"
        >
          <!--accept=".doc,.docx,.pdf,.zip,.rar"-->
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" >最多上传个数{{fileLimit}};单个文件上限10MB;允许上传的文件类型为<span style="color: red">.doc,.docx,.pdf,.zip,.rar</span></div>
        </el-upload>
      </el-col>
    </el-row>
    <el-form-item id="myself">
      <el-button type="primary" @click="save">{{ $t('button.submit') }}</el-button>
      <el-button @click="closeGenEvent">{{ $t('button.cancel') }}</el-button>
    </el-form-item>

  </el-form>
</template>

<script src="./genEvent.js"></script>

<style scoped>

</style>
