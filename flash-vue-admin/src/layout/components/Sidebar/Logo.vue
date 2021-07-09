<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}">
    <transition name="sidebarLogoFade">
      <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="">
        <img v-if="logo" :src="logo" class="sidebar-logo">
        <h1 v-else class="sidebar-title">{{ title }} </h1>
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="">
        <img v-if="logo" :src="logo" class="sidebar-logo">
        <h1 class="sidebar-title">{{ title }} </h1>
      </router-link>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      title: '数据资源一体化子系统',
      logo: '/img/logo.png'
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  // height: 50px;
  // line-height: 50px;
  background: #1c273a;
  text-align: center;
  overflow: hidden;
 padding: 30px 0 18px;

a{
 &.sidebar-logo-link {
    display: flex !important;
    align-items: center;
    height: 100%;
    justify-content: center;
    .sidebar-logo {
      width:20px;
      height: 20px;
      vertical-align: middle;
      margin-right: 7px;
    }

    .sidebar-title {
      background: linear-gradient(to right, #429ced, #69e5d0);
        background-clip: text;
        -webkit-background-clip: text;
        color: transparent;
      margin: 0;
      font-size: 16px;
      vertical-align: middle;
    }
  }
}
  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
