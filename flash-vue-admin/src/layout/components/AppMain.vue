<template>
  <div>
    <section class="app-main">
      <transition name="fade-transform" mode="out-in">
        <keep-alive :include="cachedViews">
          <router-view :key="key" />
        </keep-alive>
      </transition>
    </section>
     <!--<div class="footer">
      <p>
        <a href="https://www.9-heng.com/" style="color: #0a76a4;" target="_blank">Copyright © 2021  中科九衡科技有限公司</a> -->
        <!--<span>版权所有</span>
        <img src="../../assets/img/备案.png" alt="备案" style="margin-left: 30px;margin-right: 10px;">
        <span>皖公网安备 34019202001488号</span>
        <span style="margin-left: 30px;">皖ICP备18001116号</span>
      </p>
    </div>-->
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
    min-height: calc(100vh - 96px);
    width: calc(100% - 40px);
    position: relative;
    overflow: hidden;
    margin:20px;
    background: #fff;
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

  // .footer{
  //   border-top: 1px solid #cccccc;
  // }

  .footer > p {
    margin: 0;
    padding: 5px;
    text-align: center;
    font-size: 14px;
  }
</style>

