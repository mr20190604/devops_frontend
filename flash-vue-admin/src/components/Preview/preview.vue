<template>
  <div>
    <!--fileType-->
    <iframe :style="previewStyle" :src="previewFileUrl" />
    <!--<img v-if="fileType === 2" style="previewStyle" :src="previewFileUrl"/>
    <video v-if="fileType === 3"  style="previewStyle" src="previewFileUrl"></video>-->
  </div>
</template>

<script>
export default {
  name: 'Preview',
  props: ['previewFileUrl', 'previewStyle'],
  data() {
    return {

    }
  }
}
</script>

<style scoped>

</style>
