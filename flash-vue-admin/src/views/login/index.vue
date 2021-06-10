<template>
  <div
    class="login-container"
    style="background-image: url(./img/login_bj.png)"
  >
    <div class="login-wrap">
      <div class="title-container">
        <img src="@/assets/img/login-title.png" alt="" />
      </div>
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        auto-complete="on"
        label-position="left"
      >
        <h3>用户登录</h3>
        <el-form-item prop="username">
          <span class="icon">
            <img src="@/assets/img/login-user-icon.png" alt="" />
          </span>
          <el-input
            v-model="loginForm.username"
            :placeholder="$t('login.username')"
            name="username"
            type="text"
            auto-complete="on"
          />
        </el-form-item>

        <el-form-item prop="password">
          <span class="icon">
            <img src="@/assets/img/login-pwd-icon.png" alt="" />
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
        <div class="forget-pwd-wrap">
          <el-checkbox v-model="loginForm.remember">记住密码</el-checkbox>
          <p>忘记密码?</p>
        </div>

        <el-button
          :loading="loading"
          type="primary"
          @click.native.prevent="handleLogin"
          >{{ $t("login.logIn") }}</el-button
        >
      </el-form>
    </div>
  </div>
</template>

<script src="./login.js"></script>
<style lang="scss" scoped>
.login-container {
  width: 100%;
  height: 100%;
  position: relative;
  .login-wrap {
    width: 501px;
    position: absolute;
    right: 12.6vw;
    top: 18vh;
    .title-container {
      text-align: center;
      margin-bottom: 36px;
    }
    >>> .login-form {
      width: 501px;
      height: 498px;
      background: url("../../assets/img/login-box-bg.png") no-repeat center;
      background-size: cover;
      margin: 0 auto;
      h3 {
        text-align: center;
        font-size: 32px;
        font-weight: normal;
        color: #00bff4;
        letter-spacing: 11px;
        padding-top: 28px;
        line-height: 102px;
      }
      .forget-pwd-wrap {
        display: flex;
        align-items: center;
        width: 449px;
        justify-content: space-between;
        margin: 0 auto;
        p {
          font-size: 18px;
          color: #fff;
        }
        .el-checkbox {
          display: flex;
          align-items: center;
          .el-checkbox__input {
            .el-checkbox__inner {
              border: 3px solid rgb(11, 161, 248);
              opacity: 0.4;
              border-radius: 0px;
              width: 18px;
              height: 18px;
              background-color: rgba(6, 135, 205, 0.302);
            }
          }
          .el-checkbox__label {
            font-size: 18px;
            color: #fff;
          }
        }
      }
      .el-button {
        display: block;
        background-color: rgb(11, 161, 248);
        font-size: 32px;
        letter-spacing: 11px;
        width: 449px;
        height: 56px;
        margin: 24px auto 0;
      }
      .el-form-item {
        display: flex;
        justify-content: center;
        background-size: cover;
        margin-bottom: 24px;
        .el-form-item__content {
          line-height: 56px;
          display: flex;
          align-items: center;
          width: 449px;
          height: 56px;
          line-height: 56px;
          background: url("../../assets/img/login-border.png") no-repeat center;
          background-size: cover;
          background-color: #fff;
          .icon {
            width: 46px;
            margin-left: 25px;
            display: flex;
            align-items: center;
            flex-shrink: 0;
          }
          .el-input__inner {
            border-radius: 0px;
            padding-left: 0;
            height: 54px;
            line-height: 1;
            background: #fff;
            border: none;
            font-size: 18px;
            color: #313131;
          }
        }
      }
    }
  }
}
input:-webkit-autofill{
   background: none !important;
box-shadow:0 0 0 1000px white inset !important;
	-webkit-box-shadow:0 0 0 1000px white inset !important;
}
input:-internal-autofill-selected {
             
            }
</style>

