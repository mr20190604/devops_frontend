<template>
  <treeselect
    v-model="value"
    :options="options"
    :placeholder="placeholder||'请选择'"
    :searchable="true"
    :load-options="loadOptions"
  >
    <div slot="value-label" slot-scope="{ node }">{{ node.raw.valueLabel }}</div>
  </treeselect>
</template>
<script>
import { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
import mmBasDistrictApi from '@/api/mm/mmBasDistrict'

export default {
  name: 'District',
  props: ['placeholder', 'parentCode'],
  data() {
    return {
      value: null,
      options: []
    }
  },
  created() {
    mmBasDistrictApi.getChildren(this.parentCode || '000000').then(response => {
      response.data.forEach(item => {
        const obj = {
          id: item.districtCode,
          label: item.districtName,
          valueLabel: item.districtName
        }
        if (item.parentCode.substring(2) === '0000') {
          obj.children = null
        }
        this.options.push(obj)
      })
    })
  },
  methods: {
    loadOptions({ action, parentNode, callback }) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        if (parentNode.children === null) {
          mmBasDistrictApi.getChildren(parentNode.id).then(response => {
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
          })
          callback()
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
