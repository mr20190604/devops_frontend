<template>
  <div class="bg">
    <p class="title">{{ systemName }}</p>
    <div>
      <Card
        v-for="item in list"
        :key="item.d1"
        class="outerRectangle"
        :name="item.name"
        :src="item.img"
        :url="item.url"
        :d1="item.d1"
        :d2="item.d2"
      />
    </div>
    <div class="left" @click="handleLeftClick" />
    <div class="right" @click="handleRightClick" />
  </div>
</template>

<script>
import Card from './components/Card'

export default {
  name: 'Platform',
  components: {
    Card
  },
  data() {
    return {
      systemName: '苍穹环境智能监测平台',
      list: [
        {
          name: '大数据分析子系统',
          img: '/img/analysis.png',
          url: '',
          d1: 'M0 -30 Q154 8 308 20 L308 490 Q154 500 0 540 Z',
          d2: 'M10 -20 Q154 20 298 30 L298 480 Q154 490 10 530 Z'
        },
        {
          name: '数据资源一体化子系统',
          img: '/img/integration.png',
          url: '/enterpriseBaseinfo',
          d1: 'M0 25 Q154 38 308 38 L308 470 Q154 475 0 485 Z',
          d2: 'M10 35 Q154 48 298 48 L298 460 Q154 465 10 475 Z'
        }, {
          name: '三维地理信息系统',
          img: '/img/GIS.png',
          url: '',
          d1: 'M0 40 Q154 45 308 38 L308 470 Q154 465 0 470 Z',
          d2: 'M10 50 Q154 55 298 48 L298 460 Q154 455 10 460 Z'
        }, {
          name: '预测预警子系统',
          img: '/img/warning.png',
          url: '',
          d1: 'M0 40 Q154 35 308 20 L308 485 Q154 475 0 470 Z',
          d2: 'M10 50 Q154 45 298 30 L298 475 Q154 465 10 460 Z'
        }, {
          name: '数据资源辅助子系统',
          img: '/img/checking-in.png',
          url: '',
          d1: 'M0 20 Q154 10 308 -30 L308 540 Q154 500 0 490 Z',
          d2: 'M10 30 Q154 20 298 -20 L298 530 Q154 490 10 480 Z'
        }
      ]
    }
  },
  methods: {
    handleLeftClick: function() {
      const prev = this.list.shift()
      this.list.push(prev)

      // 调整边框数据
      const last = JSON.parse(JSON.stringify(this.list[this.list.length - 1]))
      this.list.forEach((item, index, array) => {
        // 实现逆序功能
        index = array.length - 1 - index
        item = array[index]

        if (index === 0) {
          item.d1 = last.d1
          item.d2 = last.d2
        } else {
          item.d1 = array[index - 1].d1
          item.d2 = array[index - 1].d2
        }
      })
    },
    handleRightClick: function() {
      const next = this.list.pop()
      this.list.unshift(next)

      // 调整边框数据
      const first = JSON.parse(JSON.stringify(this.list[0]))
      this.list.forEach((item, index, array) => {
        if (index === array.length - 1) {
          item.d1 = first.d1
          item.d2 = first.d2
        } else {
          item.d1 = array[index + 1].d1
          item.d2 = array[index + 1].d2
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .bg {
    width: 100%;
    height: 100%;
    background-image: url("../../assets/img/bg.png");
    overflow: hidden;
  }

  .title {
    padding: 0;
    margin: 45px 0 0 0;
    color: #34fff8;
    text-align: center;
    font-size: 36px;
  }

  .bg > div {
    margin-top: 210px;
    height: 520px;
    width: 80%;
    margin-left: 10%;
    overflow: hidden;
  }

  .outerRectangle {
    height: 100%;
    width: 320px;
    display: inline;
    float: left;
    margin-left: 30px;
    margin-right: 30px;
    padding: 5px;
  }

  .outerRectangle:first-child {
    margin-left: -160px;
  }

  .outerRectangle:last-child {
    margin-right: -160px;
    float: right;
  }

  .left, .right {
    display: inline;
    height: 62px !important;
    width: 63px !important;
    position: fixed;
    top: 52%;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    margin: 0 !important;
    cursor: pointer;
  }

  .left {
    left: 50px;
    background-image: url("../../assets/img/dark.png");
  }

  .left:hover {
    background-image: url("../../assets/img/light.png");
    transform: rotate(180deg);
  }

  .right {
    right: 50px;
    background-image: url("../../assets/img/dark.png");
    transform: rotate(180deg);
  }

  .right:hover {
    background-image: url("../../assets/img/light.png");
    transform: rotate(360deg);
  }

</style>
