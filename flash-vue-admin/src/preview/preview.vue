<template>
  <div>
    <iframe v-if="fileType === 1"  :style="previewStyle" :src="previewFileUrl"></iframe>
    <img v-if="fileType === 2" style="previewStyle" :src="previewFileUrl"/>
    <video v-if="fileType === 3"  style="previewStyle" src="previewFileUrl"></video>
  </div>
</template>

<script>
    export default {
        name: "preview",
        props:['previewFileUrl','previewStyle','fileType'],
        data() {
          return {

          }
        }
    }
</script>

<style scoped>

</style>
