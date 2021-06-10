<template>
  <div class="bg">
    <!-- 星星动效 -->
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
    <!-- 轮播 -->
    <div
      class="recommendPage"
      @mouseenter="onMouseEnter"
      @mouseleave="onMouseLeave"
    >
      <swiper :options="swiperOption" ref="mySwiper">
        <swiper-slide
          v-for="(item, index) in swiperData"
          :key="index"
          :data-item="index"
        >
          <div :style="{ 'background-image': 'url(' + item.img + ')' }"></div>
        </swiper-slide>
      </swiper>
    </div>
    <div
      class="swiper-button-prev common-swiper-button el-icon-arrow-left"
      slot="button-prev"
    ></div>
    <div
      class="swiper-button-next common-swiper-button el-icon-arrow-right"
      slot="button-next"
    ></div>
  </div>
</template>

<script>
// 引入插件
let vm = null;
import { swiper, swiperSlide } from "vue-awesome-swiper";
import "swiper/dist/css/swiper.css";
export default {
  components: {
    swiper,
    swiperSlide,
  },
  data() {
    return {
      // systemName: "苍穹环境智能监测平台",
      swiperData: [
        {
          img: "/img/swiper-img1.png",
          url: "#",
          title: "大数据分析系统",
        },
        {
          img: "/img/swiper-img2.png",
          url: "/enterpriseBaseinfo",
          title: "数据资源一体系统",
        },
        {
          img: "/img/swiper-img3.png",
          url: "#",
          title: "三维地理信息系统",
        },
        {
          img: "/img/swiper-img4.png",
          url: "#",
          title: "预测预警子系统",
        },
        {
          img: "/img/swiper-img5.png",
          url: "#",
          title: "数据资源辅助系统",
        },
      ],
      swiperOption: {
        speed: 3000,
        effect: "coverflow",
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: "auto",
        coverflowEffect: {
          rotate: 42,
          stretch: -40,
          depth: 200,
          modifier: 1,
          slideShadows: false,
        },

        loop: true,
        autoplay: {
          delay: 1800,
          stopOnLastSlide: false,
          disableOnInteraction: false,
        },
        // 显示分页
        // pagination: {
        //   el: ".swiper-pagination",
        //   clickable: true //允许分页点击跳转
        // },
        // 设置点击箭头
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
        on: {
          click: function () {
            const index = this.clickedSlide.attributes["data-item"].nodeValue;

            vm.handleClickSlide(index);
          },
        },
      },
    };
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper;
    },
  },
  created() {
    vm = this;
  },

  methods: {
    handleClickSlide(index) {
      this.$router.push(this.swiperData[index].url);
    },
    onMouseEnter() {
      this.swiper.autoplay.stop();
    },
    onMouseLeave() {
      this.swiper.autoplay.start();
    },
  },
};
</script>
<style scoped lang="scss">
.bg {
  width: 100%;
  height: 100%;
  background: url("../../assets/img/bg.png") no-repeat top center;
  background-size: 100% 100%;
  overflow: hidden;
  .particles {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }

  .common-swiper-button {
    width: 62px;
    height: 62px;
    background: none;
    border-radius: 50%;
    border: 5px solid rgba(168, 213, 232, 0.27);
    text-align: center;
    line-height: 53px;
    font-size: 30px;
    color: rgba(168, 213, 232, 0.47);
    font-weight: bold;
    transition: all 0.3s linear;
    &.swiper-button-next {
      right: 60px;
      // background: url("/img/swiper-right-btn.png");
    }
    &.swiper-button-prev {
      left: 60px;
      // background: url("/img/swiper-left-btn.png");
    }
    &:hover {
      color: rgba(255, 255, 255, 0.6);
      border: 5px solid rgba(255, 255, 255, 0.4);
    }
  }

  .recommendPage {
    margin-top: 34.3vh;
    >>> .swiper-container {
      position: relative;
      width: 1265px;
      height: 370px;
      .swiper-slide {
        width: 320px;
        height: 370px;
        div {
          width: 100%;
          height: 100%;
          background-size: 100% 100%;
          a {
            display: block;
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
}
</style>
