<template>
  <div class="login-container">
    <!-- 左侧地球 -->
    <div class="left-earth">
      <!-- 三角形加圆 -->
      <div class="earth-triangle earth-triangle-one">
        <!-- 圆 -->
        <div class="circle">
          <div class="pulse common-pluse"></div>
          <div class="pulse1 common-pluse"></div>
        </div>
        <p><img src="/img/earth-triangle-one.png" alt="" /></p>
      </div>
      <div class="earth-triangle earth-triangle-two">
        <!-- 圆 -->
        <div class="circle">
          <div class="pulse common-pluse"></div>
        </div>
        <p><img src="/img/earth-triangle-two.png" alt="" /></p>
      </div>
      <!-- 数字 -->
      <div class="earth-num">
        <div class="counter" v-for="(item, index) in 6" :key="index">
          <countTo
            :startVal="startVal"
            :endVal="endVal"
            :duration="Number(index + 2 + '000')"
            :decimals="decimals"
          ></countTo>
        </div>
      </div>
    </div>
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
          >{{ $t("login.logIn") }}
        </el-button>
      </el-form>
    </div>
  </div>
</template>

<script src="./login.js"></script>
<style>
input:-webkit-autofill {
  box-shadow: 0 0 0 1000px #fff inset !important;
  -webkit-box-shadow: 0 0 0 1000px #fff inset !important;
}
</style>
<style lang="scss" scoped>
.login-container {
  width: 100%;
  height: 100%;
  position: relative;
  background: url("/img/login_bj.png") no-repeat center;
  background-size: 100% 100%;
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
          background-size: cover;
          background: #fff url("../../assets/img/login-border.png") no-repeat
            center;

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
            // height: 54px;
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
  .left-earth {
    position: relative;
    left: 10.6771vw;
    top: 26.8519vh;
    background: rgba(0, 0, 0, 0.6);
    .earth-num {
      .counter {
        color: #fff;
        font-family: "Digital";
        position: absolute;
        &:nth-of-type(1) {
          left: 2.9167vw;
          top: 15.0926vh;
        }
        &:nth-of-type(2) {
          left: 15.625vw;
          top: 30.0926vh;
        }
        &:nth-of-type(3) {
          left: 14.4792vw;
          top: 19.6296vh;
        }
        &:nth-of-type(4) {
          left: 24.4792vw;
          top: 16.9444vh;
        }
        &:nth-of-type(5) {
          left: 27.7604vw;
          top: 8.8889vh;
        }
        &:nth-of-type(6) {
          left: 19.1667vw;
          top: 5.463vh;
        }
        &:nth-of-type(6),
        &:nth-of-type(2),
        &:nth-of-type(1) {
          font-size: 30px;
          font-weight: normal;
        }
        &:nth-of-type(3) {
          font-size: 24px;
        }
        &:nth-of-type(4) {
          font-size: 20px;
        }
        &:nth-of-type(5) {
          font-size: 18px;
        }
      }
    }
    /* 产生动画（向外扩散变大）的圆圈  */
    .common-pluse {
      position: absolute;
      opacity: 0.612;
      -webkit-border-radius: 50%;
      -moz-border-radius: 50%;
      border-radius: 50%;
      z-index: 1;
      left: 50%;
      top: 50%;
      background-image: radial-gradient(
        circle closest-side at center,
        rgba(31, 206, 198, 0.2) 0%,
        rgba(29, 225, 206, 0.6) 100%
      );
      background-image: -webkit-radial-gradient(
        circle closest-side at center,
        rgba(31, 206, 198, 0.2) 0%,
        rgba(29, 225, 206, 0.6) 100%
      );
      background-image: -moz-radial-gradient(
        circle closest-side at center,
        rgba(31, 206, 198, 0.2) 0%,
        rgba(29, 225, 206, 0.6) 100%
      );
      background-image: -ms-radial-gradient(
        circle closest-side at center,
        rgba(31, 206, 198, 0.2) 0%,
        rgba(29, 225, 206, 0.6) 100%
      );
    }
    .earth-triangle-one {
      position: absolute;
      width: 90px;
      left: 6.4583vw;
      p {
        margin-left: 5px;
        margin-top: -40px;
      }
      .circle {
        width: 90px;
        height: 90px;
        position: relative;
        z-index: 1;
        .pulse {
          width: 42px;
          height: 42px;
          margin-top: -21px;
          margin-left: -21px;
          -webkit-animation: warn 3s ease-out;
          -moz-animation: warn 3s ease-out;
          animation: warn 3s ease-out;
          -webkit-animation-iteration-count: infinite;
          -moz-animation-iteration-count: infinite;
          animation-iteration-count: infinite;
        }

        .pulse1 {
          width: 90px;
          height: 90px;
          margin-top: -45px;
          margin-left: -45px;
          -webkit-animation: warn1 3s ease-out;
          -moz-animation: warn1 3s ease-out;
          animation: warn1 3s ease-out;
          -webkit-animation-iteration-count: infinite;
          -moz-animation-iteration-count: infinite;
          animation-iteration-count: infinite;
        }
      }
    }
    .earth-triangle-two {
      position: absolute;
      width: 40px;
      left: 20.8333vw;
      .circle {
        width: 38px;
        height: 38px;
        position: relative;
        .pulse {
          width: 38px;
          height: 38px;
          left: 0;
          top: 0;
          opacity: 0.1;

          -webkit-animation: breath 3s ease-in-out;
          -moz-animation: breath 3s ease-in-out;
          animation: breath 3s ease-in-out;
          -webkit-animation-iteration-count: infinite;
          -moz-animation-iteration-count: infinite;
          animation-iteration-count: infinite;
        }
      }
      p {
        margin-top: -18px;
      }
    }

    @keyframes warn {
      0% {
        transform: scale(0.3);
        -webkit-transform: scale(0.3);
        opacity: 0;
      }

      25% {
        transform: scale(0.3);
        -webkit-transform: scale(0.3);
        opacity: 0.1;
      }

      50% {
        transform: scale(0.5);
        -webkit-transform: scale(0.5);
        opacity: 0.3;
      }

      75% {
        transform: scale(0.8);
        -webkit-transform: scale(0.8);
        opacity: 0.5;
      }

      100% {
        transform: scale(1);
        -webkit-transform: scale(1);
        opacity: 0;
      }
    }

    @keyframes warn1 {
      0% {
        transform: scale(0.3);
        -webkit-transform: scale(0.3);
        opacity: 0;
      }

      25% {
        transform: scale(0.3);
        -webkit-transform: scale(0.3);
        opacity: 0.1;
      }

      50% {
        transform: scale(0.3);
        -webkit-transform: scale(0.3);
        opacity: 0.3;
      }

      75% {
        transform: scale(0.5);
        -webkit-transform: scale(0.5);
        opacity: 0.5;
      }

      100% {
        transform: scale(0.8);
        -webkit-transform: scale(0.8);
        opacity: 0;
      }
    }
    // 呼吸灯效果
    @keyframes breath {
      from {
        opacity: 0.1;
      } /* 动画开始时的不透明度 */
      50% {
        opacity: 1;
      } /* 动画50% 时的不透明度 */
      to {
        opacity: 0.1;
      } /* 动画结束时的不透明度 */
    }

    @-webkit-keyframes breath {
      from {
        opacity: 0.1;
      } /* 动画开始时的不透明度 */
      50% {
        opacity: 1;
      } /* 动画50% 时的不透明度 */
      to {
        opacity: 0.1;
      } /* 动画结束时的不透明度 */
    }
  }
}
</style>

