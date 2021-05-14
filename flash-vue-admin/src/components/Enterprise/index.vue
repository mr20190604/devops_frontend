<template>
  <el-select
    v-model="content"
    style="width: 100%"
    :placeholder="inner_placeholder"
    @change="change"
  >
    <el-option
      v-for="item in list"
      :key="item.id"
      :label="item.enterpriseName"
      :value="item.id"
    />
  </el-select>
</template>

<script>
import enterpriseApi from '@/api/dsi/dsiEnterpriseBaseinfo'

export default {
  name: 'Enterprise',
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      list: [],
      content: '',
      inner_placeholder: undefined
    }
  },
  watch: {
    value() {
      this.content = this.value
    }
  },
  created() {
    this.content = this.value
    if (this.placeholder) {
      this.inner_placeholder = this.placeholder
    } else {
      this.inner_placeholder = '请选择企业'
    }
    this.getEnterpriseList()
  },
  methods: {
    getEnterpriseList() {
      enterpriseApi.queryAll().then(response => {
        this.list = response.data
        console.log(this.list)
      })
    },
    change(value) {
      this.$emit('input', value)
    }
  }
}
</script>
