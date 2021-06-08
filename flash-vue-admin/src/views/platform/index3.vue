<template>
  <div class="bg">
    <!-- <p class="title">{{ systemName }}</p> -->
    <div class="recommendPage">
      <swiper :options="swiperOption" ref="mySwiper">
        <swiper-slide v-for="(item, index) in swiperData" :key="index">
          <div :style="{ 'background-image': 'url(' + item.img + ')' }"></div>
        </swiper-slide>

        <!-- <div class="swiper-pagination" slot="pagination"></div> -->
       
      </swiper>
    </div>
     <div class="swiper-button-prev common-swiper-button" slot="button-prev" ></div>
     <div class="swiper-button-next common-swiper-button" slot="button-next" ></div>
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
          slideShadows: false
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
  },
  mounted() {
    // current swiper instance
    // 然后你就可以使用当前上下文内的swiper对象去做你想做的事了
    console.log("this is current swiper instance object", this.swiper);
    // this.swiper.slideTo(3, 1000, false);
  }
};
</script>
<style scoped lang="scss">
.bg {
  width: 100%;
  height: 100%;
  background-image: url("../../assets/img/bg.png");
  overflow: hidden;
  .title {
    padding: 0;
    margin: 45px 0 0 0;
    color: #34fff8;
    text-align: center;
    font-size: 36px;
  }
  .common-swiper-button {
      width: 62px;
      height: 63px;
      &.swiper-button-next {
        right: 60px;
        background: url("/img/swiper-right-btn.png");
      }
      &.swiper-button-prev {
        left: 60px;
        background: url("/img/swiper-left-btn.png");
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
        display: none;
        background-image:linear-gradient(to left, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0))
      }
      .swiper-slide-shadow-left{
        display: none;
        background-image:linear-gradient(to right, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0))
      }
    }
    
  }
}
}
</style>
