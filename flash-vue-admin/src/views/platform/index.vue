<template>
  <div class="bg">
    <vue-particles
        color="#dedede"
        :particleOpacity="0.4"
        :particlesNumber="60"
        shapeType="star"
        :particleSize="3"
        linesColor="#dedede"
        :linesWidth="1"
        :lineLinked="false"
        :lineOpacity="0.4"
        :linesDistance="150"
        :moveSpeed="3"
        :hoverEffect="false"
        hoverMode="grab"
        :clickEffect="true"
        clickMode="push"
        class="particles"
      >
      </vue-particles>
    <!-- <p class="title">{{ systemName }}</p> -->
    <div class="recommendPage">
      <swiper :options="swiperOption" ref="mySwiper">
        <swiper-slide v-for="(item, index) in swiperData" :key="index">
          <div :style="{ 'background-image': 'url(' + item.img + ')' }"></div>
        </swiper-slide>

        <!-- <div class="swiper-pagination" slot="pagination"></div> -->
       
      </swiper>
    </div>
     <div class="swiper-button-prev common-swiper-button el-icon-arrow-left" slot="button-prev" ></div>
     <div class="swiper-button-next common-swiper-button el-icon-arrow-right />" slot="button-next" ></div>
  </div>
</template>

<script>
// 引入插件
import { swiper, swiperSlide } from "vue-awesome-swiper";
import "swiper/dist/css/swiper.css";

export default {
  components: {
    swiper,
    swiperSlide
  },
  data() {
    return {
      // systemName: "苍穹环境智能监测平台",
      swiperData: [
        {
          img: "/img/swiper-img1.png"
        },
        {
          img: "/img/swiper-img2.png"
        },
        {
          img: "/img/swiper-img3.png"
        },
        {
          img: "/img/swiper-img4.png"
        },
        {
          img: "/img/swiper-img5.png"
        }
      ],
      swiperOption: {
        effect: "coverflow",
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: "auto",
        coverflow: {
          rotate: 40,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true
        },
        loop: true,
        autoplay: {
          delay: 300000,
          stopOnLastSlide: false,
          disableOnInteraction: false
        },
        // 显示分页
        // pagination: {
        //   el: ".swiper-pagination",
        //   clickable: true //允许分页点击跳转
        // },
        // 设置点击箭头
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev"
        }
      }
    };
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper;
    }
  }
};
</script>
<style scoped lang="scss">
.bg {
  width: 100%;
  height: 100%;
  background: url("../../assets/img/bg.png") no-repeat top center;
  background-size: 100% 1005;
  overflow: hidden;
  .particles{
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
  .title {
    padding: 0;
    margin: 45px 0 0 0;
    color: #34fff8;
    text-align: center;
    font-size: 36px;
  }
  .common-swiper-button {
     width: 62px;
    height: 62px;
    background: none;
    border-radius: 50%;
    border: 5px solid rgba(168,213,232,.27);
    text-align: center;
    line-height: 53px;
    font-size: 30px;
    color: rgba(168,213,232,.27);
    font-weight: bold;
      &.swiper-button-next {
        right: 60px;
        // background: url("/img/swiper-right-btn.png");
      }
      &.swiper-button-prev {
        left: 60px;
        // background: url("/img/swiper-left-btn.png");
      }
    }

.recommendPage {
  margin-top: 32.6vh;
  >>> .swiper-container {
    position: relative;
    width: 1200px;
    height: 375px;
    .swiper-slide {
      width: 325px;
      height: 375px;
      div {
        width: 100%;
        height: 100%;
      }
      .swiper-slide-shadow-left{
        background-image:linear-gradient(to left, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0))
      }
      .swiper-slide-shadow-right{
        background-image:linear-gradient(to right, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0))
      }
    }
    
  }
}
}
</style>
