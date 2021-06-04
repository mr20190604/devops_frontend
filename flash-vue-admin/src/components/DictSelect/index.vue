<template>
  <el-select
    v-model="dictValue"
    style="width: 100%"
    :size="size"
    :placeholder="inner_placeholder"
    clearable
    :disabled="disabled"
    @change="change"
  >
    <el-option
      v-for="item in dictList"
      :key="item.id"
      :label="item.name"
      :value="item.id"
    />
  </el-select>
</template>

<script>
  import { getDicts } from '@/api/system/dict'

  export default {
    name: 'DictSelect',
    props: {
      value: {
        type: [String, Number],
        default: ''
      },
      size: {
        type: String,
        default: ''
      },
      dictName: {
        type: String,
        default: '',
        require: true
      },
      placeholder: {
        type: String,
        default: ''
      }, disabled: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        dictList: [],
        dictValue: '',
        inner_placeholder: undefined
      }
    },
    watch: {
      value() {
        this.dictValue = this.value
      }
    },
    created() {
      this.dictValue = this.value
      if (this.placeholder) {
        this.inner_placeholder = this.placeholder
      } else {
        this.inner_placeholder = '请选择' + this.dictName
      }
      this.getDictList()
    },
    methods: {
      getDictList() {
        getDicts(this.dictName).then(response => {
          this.dictList = response.data
        })
      },
      change(value) {
        this.$emit('input', value)
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .el-form-item__content {
    width: 200px;
  }
</style>
