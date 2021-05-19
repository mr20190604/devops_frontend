<template>
  <div class="login-container" style=" background-image: url(./img/login_bj.png);">

    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
      style="position: absolute;top: 240px;right: 350px;width: 400px;"
    >
      <div class="title-container">
        <h3 class="title">{{ $t('login.title') }}</h3>
        <!--<lang-select class="set-language"/>-->
      </div>

      <el-form-item prop="username" style="background: #001c5a;opacity:0.5;">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          v-model="loginForm.username"
          :placeholder="$t('login.username')"
          name="username"
          type="text"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password" style="background: #001c5a;opacity:0.5;">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          v-model="loginForm.password"
          :type="pwdType"
          :placeholder="$t('login.password')"
          name="password"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon icon-class="eye" />
        </span>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-checkbox v-model="loginForm.remember" style="color:#1bb7b4;">记住密码</el-checkbox>
        </el-col>
        <el-col :span="12" style="text-align: right">
          <div style="color: #1bb7b4;font-weight: 500;cursor: pointer;font-size: 14px;display: inline-block;padding-right: 1px;line-height: 19px;">
            忘记密码?</div>
        </el-col>
      </el-row>
      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">{{ $t('login.logIn') }}</el-button>

      <!--<div style="position:relative;">
        <div class="tips">
          <span>{{ $t('login.username') }} : admin</span>
          <span>{{ $t('login.password') }} : admin</span>
        </div>
        <div class="tips">
          <span style="margin-right:18px;">{{ $t('login.username') }} : developer</span>
          <span>{{ $t('login.password') }} : developer</span>
        </div>
      </div>-->
    </el-form>

  </div>
</template>

<script src="./login.js"></script>
<style rel="stylesheet/scss" lang="scss" src="./login.scss"></style>
