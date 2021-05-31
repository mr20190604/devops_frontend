<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <!-- 切换 -->
    <ul class="screen-desk-warp" v-if="!isCollapse">
       <router-link to="/" tag="li" class="index-li">
         <img src="@/assets/img/slide-screen.png" alt="">
       </router-link>
       <router-link to="/" tag="li" class="index-li">
        <img src="@/assets/img/slide-desk.png" alt="">
       </router-link>
    </ul>
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    routes() {
      return this.$store.state.menu.routes
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if st path, the sidebar will highlight the path you sete
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
<style scoped lang="scss">
.screen-desk-warp{
  display: flex;
  justify-content: center;
   background: #1c273a;
   padding-bottom:26px;
  li{
    margin: 0 9px;
    cursor: pointer;
  }
}
</style>