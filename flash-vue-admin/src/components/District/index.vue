<template>
  <treeselect
    :value="content"
    :options="options"
    :placeholder="inner_placeholder"
    :searchable="true"
    :load-options="loadOptions"
    @input="handleInput"
  >
    <div slot="value-label" slot-scope="{ node }">{{ node.raw.valueLabel }}</div>
  </treeselect>
</template>
<script>
import { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
import mmBasDistrictApi from '@/api/mm/mmBasDistrict'

export default {
  name: 'District',
  props: ['placeholder', 'parentCode', 'value'],
  data() {
    return {
      content: null,
      options: []
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
    value: function(newValue, oldValue) {
      this.content = newValue
    }
  },
  created() {
    mmBasDistrictApi.getChildren(this.parentCode || '000000').then(response => {
      response.data.forEach(item => {
        const obj = {
          id: item.districtCode,
          label: item.districtName,
          valueLabel: item.districtName,
          parentId: item.parentCode
        }
        if (item.parentCode.substring(2) === '0000') {
          obj.children = null
        }
        this.options.push(obj)
      })

      if (!this.value) return

      let isExist = this.options.some(item => item.id === this.value)
      if (!isExist) {
        if (!this.parentCode || this.parentCode === '000000') {
          let currentParentCode = this.value.substring(0, 2) + '0000'
          let currentOptions = this.options.find(item => item.id === currentParentCode)
          this.appendChildren(currentOptions).then(children => {
            isExist = children.some(item => item.id === this.value)
            if (!isExist) {
              currentParentCode = this.value.substring(0, 4) + '00'
              currentOptions = children.find(item => item.id === currentParentCode)
              // 处理单独划市的情况
              if (!currentOptions) {
                currentParentCode = this.value.substring(0, 2) + '0100'
                currentOptions = children.find(item => item.id === currentParentCode)
              }
              currentOptions && this.appendChildren(currentOptions)
            }
          })
        } else {
          const currentParentCode = this.value.substring(0, 4) + '00'
          const currentOptions = this.options.find(item => item.id === currentParentCode)
          currentOptions && this.appendChildren(currentOptions)
        }
      }

      this.content = this.value
    })
  },
  methods: {
    loadOptions({ action, parentNode, callback }) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        if (parentNode.children === null) {
          this.appendChildren(parentNode).then(() => {
            callback()
          })
        }
      }
    },
    appendChildren(parentNode) {
      return mmBasDistrictApi.getChildren(parentNode.id).then(response => {
        parentNode.children = []
        response.data.forEach(item => {
          const obj = {
            id: item.districtCode,
            label: item.districtName,
            valueLabel: parentNode.valueLabel + '-' + item.districtName
          }
          if (item.parentCode.substring(2) === '0000') {
            obj.children = null
          }
          parentNode.children.push(obj)
        })
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

<style>
  /*支持el-form的 inline 模式*/
  .el-form--inline .vue-treeselect{
    width: 200px;
    height: 40px;
  }

  /*调整文字居中*/
  .vue-treeselect__placeholder{
    height: 40px;
    height: 40px;
    line-height: 40px;
  }

  .vue-treeselect__single-value > div{
    height: 40px;
    line-height: 40px;
  }

  /*支持el-form size模式*/
  /*mini*/
  .el-form-item--mini  .vue-treeselect__placeholder{
    font-size: 12px;
    height: 26px;
    line-height: 26px;
  }

  .el-form-item--mini .vue-treeselect__input-container{
    height: 26px;
  }

  .el-form-item--mini  .vue-treeselect__single-value > div{
    height: 26px;
    line-height: 26px;
  }

  .el-form-item--mini .vue-treeselect__control{
    height: 26px;
  }


</style>
