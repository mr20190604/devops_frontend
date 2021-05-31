<template>
  <div class="navbar">
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <template>
        <!--<div class="right-menu-item" style="border:  2px solid #3db8da; width: 30px;height: 30px;border-radius: 30px; margin-top: 16px; ">
          <i
            style="position: absolute;
            width: 15px;
            height: 15px;
            border-top: 4px solid #333;
            border-right: 4px solid #333;
            transform:rotate(-135deg);
            margin-top: 6px;
            margin-left: 8px;"
          >
          </i>
        </div>-->
        <!-- gis -->
        <!-- <a class="right-menu-item" target="_blank" title="GIS" href="http://192.168.1.172:8088/start.html#p=%E7%9B%91%E6%B5%8B%E6%8A%A5%E8%AD%A6_1&id=wzt85l" style="vertical-align: top;">
          <i style="display: inline-block;width: 18px;height: 18px;background-image:url('/jczx.png');background-position: center;background-size: 18px;margin-top: 16px;" />
        </a> -->
        <!-- <search id="header-search" class="right-menu-item" title="快速入口" /> -->
      </template>
      <el-dropdown class="avatar-container right-menu-item" trigger="click">
        <div class="avatar-wrapper">
          <img class="user-avatar" src="/head.png" alt="" />
          <span>欢迎您{{ $store.state.user.name }}</span>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/account/profile">
            <el-dropdown-item>
              {{ $t("navbar.profile") }}
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">{{
              $t("navbar.logOut")
            }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <!--<template>
        <div class="right-menu-item">欢迎{{name}}</div>
      </template>-->
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import Search from "@/components/HeaderSearch";

export default {
  components: {
    Breadcrumb,
    Hamburger,
    Search
  },
  computed: {
    ...mapGetters(["sidebar", "avatar"])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    async logout() {
      await this.$store.dispatch("user/logout");
      this.$router.push("/login");
    }
  }
};
</script>

<style lang="scss" scoped>
.el-popper[x-placement^="bottom"] {
  margin-top: 6px;
  .popper__arrow {
    left: 43.5px !important;
  }
}
.el-dropdown-menu {
  border: 1px solid rgb(238, 236, 242);
  background-color: rgb(255, 255, 255);
  box-shadow: 1px 1.732px 7px 0px rgba(111, 111, 112, 0.25);
  padding: 7px 0;
  width: 99px;

  .el-dropdown-menu__item {
    line-height: 38px;
    &.el-dropdown-menu__item--divided {
      margin-top: 0;
      border: none;
      position: relative;
      color: #676767;
      &::before {
        height: 1px;
        width: 81px;
        position: absolute;
        top: 0px;
        left: 8px;
        background: #c2c3c9;
        margin: 0;
      }
    }
    &:hover {
      background-color: #fff;
      color: #1a80ff;
    }
  }
}
.navbar {
  height: 56px;
  line-height: 56px;
  border-radius: 0px !important;
  box-shadow: 0px 2px 7px 0px rgba(111, 111, 112, 0.25);

  .hamburger-container {
    line-height: 50px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .breadcrumb-container {
    float: left;
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .right-menu {
    float: right;
    height: 100%;
    &:focus {
      outline: none;
    }
    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
    }
    .screenfull {
      height: 20px;
    }

    .right-menu-item {
      vertical-align: top;
    }
    .theme-switch {
      vertical-align: 15px;
    }
    .avatar-container {
      margin-right: 20px;
      display: flex;
      align-items: center;
      .avatar-wrapper {
        position: relative;
        display: flex;
        align-items: center;
        span {
          font-size: 16px;
          color: #333;
        }
        .user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          overflow: hidden;
          margin-right: 10px;
        }
        .el-icon-caret-bottom {
          cursor: pointer;
          font-size: 16px;
          margin-left: 10px;
        }
      }
    }
  }
}
</style>
