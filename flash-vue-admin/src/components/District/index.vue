<template>
  <treeselect
    :value="content"
    :options="options"
    :placeholder="inner_placeholder"
    :searchable="false"
    :load-options="loadOptions"
    no-children-text="没有子级别"
    @input="handleInput"
    :disabled="disabled"

  >
    <div slot="value-label" slot-scope="{ node }">{{ node.raw.valueLabel }}</div>
  </treeselect>
</template>
<script>
import { LOAD_ROOT_OPTIONS, LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
import mmBasDistrictApi from '@/api/mm/mmBasDistrict'

export default {
  name: 'District',
  props: {
    placeholder: {
      type: String,
      default: undefined
    },
    parentCode: {
      type: String,
      default: '000000'
    },
    value: {
      type: String,
      default: undefined
    },
    disabled:{
      type:Boolean,
      default:false
    }
  },
  data() {
    return {
      content: null,
      options: null,
      isMatched: false
    }
  },
  computed: {
    inner_placeholder: function() {
      if (this.placeholder) {
        return this.placeholder
      } else {
        if (!this.parentCode) {
          return '请选择省份'
        } else {
          if (this.parentCode === '000000') {
            return '请选择省份'
          } else if (this.parentCode.substring(2) === '0000') {
            return '请选择城市'
          } else {
            return '请选择区域'
          }
        }
      }
    }
  },
  watch: {
    value: function(newValue) {
      this.content = newValue
    }
  },
  created() {
    this.content = this.value
  },
  methods: {
    setDefaultExpanded(list) {
      if (!this.content || this.isMatched) {
        return
      }
      const matchOptions = list.find(item => item.id === this.content)
      if (matchOptions) {
        this.isMatched = true
        return
      }
      let currentParentCode
      let currentOptions
      if (list[0].id.substring(2) === '0000') {
        currentParentCode = this.content.substring(0, 2) + '0000'
        currentOptions = list.find(item => item.id === currentParentCode)
        if (currentOptions) {
          currentOptions.isDefaultExpanded = true
        }
      } else if (list[0].id.substring(4) === '00') {
        currentParentCode = this.content.substring(0, 4) + '00'
        currentOptions = list.find(item => item.id === currentParentCode)
        if (currentOptions) {
          currentOptions.isDefaultExpanded = true
        }
      }
    },
    loadOptions({ action, parentNode, callback }) {
      if (action === LOAD_ROOT_OPTIONS) {
        mmBasDistrictApi.getChildren(this.parentCode || '000000').then(response => {
          this.options = []
          const list = response.data.map(item => {
            const obj = {
              id: item.districtCode,
              label: item.districtName,
              valueLabel: item.districtName,
              parentId: item.parentCode
            }
            if (item.parentCode.substring(2) === '0000') {
              obj.children = null
            }
            return obj
          })
          this.setDefaultExpanded(list)
          this.options = list
          callback && callback()
        })
      } else if (action === LOAD_CHILDREN_OPTIONS) {
        if (parentNode.children === null) {
          this.appendChildren(parentNode).then(() => {
            callback && callback()
          })
        }
      }
    },
    appendChildren(parentNode) {
      return mmBasDistrictApi.getChildren(parentNode.id).then(response => {
        parentNode.children = []
        const list = response.data.map(item => {
          const obj = {
            id: item.districtCode,
            label: item.districtName,
            valueLabel: parentNode.valueLabel + '-' + item.districtName,
            parentId: item.parentCode
          }
          if (item.parentCode.substring(2) === '0000') {
            obj.children = null
          }
          return obj
        })
        this.setDefaultExpanded(list)
        parentNode.children = list
        return Promise.resolve(parentNode.children)
      })
    },
    handleInput(value) {
      this.content = value
      this.$emit('input', this.content)
    }
  }
}
</script>

<style lang="scss">

  $default-height: 33px;
  $mini-height: 26px;

  .vue-treeselect {
    width: 200px;
    height: $default-height;
  }

  /*调整文字居中*/
  .vue-treeselect__placeholder, .vue-treeselect__control {
    height: $default-height;
    line-height: $default-height;
  }

  .vue-treeselect__single-value > div {
    height: $default-height;
    line-height: $default-height;
  }

  /*支持el-form size模式*/
  /*mini*/
  .el-form-item--mini .vue-treeselect__placeholder, .el-form-item--mini .vue-treeselect__control {
    font-size: 12px;
    height: $mini-height;
    line-height: $mini-height;
  }

  .el-form-item--mini .vue-treeselect__input-container {
    height: $mini-height;
  }

  .el-form-item--mini .vue-treeselect__single-value > div {
    height: $mini-height;
    line-height: $mini-height;
  }

  .el-form-item--mini .vue-treeselect__control {
    height: $mini-height;
  }

  .vue-treeselect--disabled .vue-treeselect__single-value > div {
    background-color: #F5F7FA;
    border-color: #E4E7ED;
    color: #C0C4CC;
    cursor: not-allowed;
  }

</style>
