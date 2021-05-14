<template>
  <el-select :value="content" clearable placeholder="请选择事件类型" @change="handleChange">
    <el-option v-for="item in list" :key="item.id" :label="item.name" :value="item.id" />
  </el-select>
</template>

<script>
import * as dictApi from '@/api/system/dict.js'

export default {
  name: 'EventType',
  props: ['value'],
  data() {
    return {
      content: undefined,
      list: []
    }
  },
  watch: {
    value: function(newValue, oldValue) {
      this.content = newValue
    }
  },
  created() {
    this.content = this.value
    dictApi.getDicts('事件类型').then(response => {
      this.list = response.data
    })
  },
  methods: {
    handleChange: function(value) {
      this.content = value
      this.$emit('input', value)
    }
  }
}
</script>

<style scoped>

</style>
