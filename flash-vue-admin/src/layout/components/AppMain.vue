<template>
  <div>
    <section class="app-main">
      <transition name="fade-transform" mode="out-in">
        <keep-alive :include="cachedViews">
          <router-view :key="key" />
        </keep-alive>
      </transition>
    </section>
     <div class="footer">
      <p>
        <!-- 中科九衡 -->
        <a href="https://www.9-heng.com/" target="_blank">Copyright © 2021  科技有限公司</a>
        <!--<span>版权所有</span>
        <img src="../../assets/img/备案.png" alt="备案" style="margin-left: 30px;margin-right: 10px;">
        <span>皖公网安备 34019202001488号</span>
        <span style="margin-left: 30px;">皖ICP备18001116号</span>-->
      </p>
    </div>
  </div>

</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.fullPath
    }
  }
}
</script>

<style lang="scss" scoped>
  .app-main {
    height: calc(100vh - 107px);
    width: calc(100% - 40px);
    position: relative;
    overflow: hidden;
    margin:20px;
    margin-bottom: 0;
  }

  .fixed-header + .app-main {
    padding-top: 50px;
  }

  .hasTagsView {
    .app-main {
      min-height: calc(100vh - 84px);
    }

    .fixed-header + .app-main {
      padding-top: 84px;
    }
  }

  .footer{
    p{
   line-height: 30px;
    text-align: center;
   a{
     font-size: 12px;
     color: #b5bcc4;
   }
  }
  }

  
</style>

