<template>
  <div class="bg">
    <p class="title">{{ systemName }}</p>
    <div class="outerBox">
      <div class="innerBox">
        <template v-for="count of 2">
          <Card
            v-for="(item,index) in list"
            :key="index+'_'+count"
            class="outerRectangle"
            :name="item.name"
            :src="item.img"
            :url="item.url"
            :index="item.index"
          />
        </template>
      </div>
    </div>
    <div class="left" @click="handleLeftClick" />
    <div class="right" @click="handleRightClick" />
    <!-- 星星动效 -->
    <vue-particles
      color="#dedede"
      :particle-opacity="0.4"
      :particles-number="60"
      shape-type="star"
      :particle-size="3"
      lines-color="#dedede"
      :lines-width="1"
      :line-linked="false"
      :line-opacity="0.4"
      :lines-distance="150"
      :move-speed="3"
      :hover-effect="false"
      hover-mode="grab"
      :click-effect="true"
      click-mode="push"
      class="particles"
    />
  </div>
</template>

<script>
import Card from './components/Card'

export default {
  name: 'Test',
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
          index: 0
        },
        {
          name: '数据资源一体化子系统',
          img: '/img/integration.png',
          url: '',
          index: 1
        }, {
          name: '三维地理信息系统',
          img: '/img/GIS.png',
          url: '',
          index: 2
        }, {
          name: '预测预警子系统',
          img: '/img/warning.png',
          url: '',
          index: 3
        }, {
          name: '数据资源辅助子系统',
          img: '/img/checking-in.png',
          url: '',
          index: 4
        }
      ]
    }
  },
  created() {
    const childSys = this.$store.state.user.childSys
    childSys.forEach((item, index) => {
      this.list[index].name = item.mmChildSysModel.sysName
      this.list[index].url = item.mmChildSysModel.sysUrl
      this.list[index].img = item.mmChildSysModel.sysIcon
    })
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
    background-image: url("../../assets/img/bg1.png");
    overflow: hidden;
  }

  .particles{
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
    height: 100%;
    width: 100%;
  }

  .title {
    padding: 0;
    margin: 45px 0 0 0;
    color: #34fff8;
    text-align: center;
    font-size: 36px;
    font-weight: bold;
  }

  .outerBox {
    margin-top: 210px;
    height: 520px;
    width: 80%;
    margin-left: 10%;
    overflow: hidden;
  }

  @keyframes running {
    0%{
      margin-left: 0;
    }
    100%{
      margin-left: -1900px;
    }
  }

  .innerBox{
    height: 100%;
    width: 3800px;
    animation: running 20s linear 0s infinite;
  }

  .outerRectangle {
    height: 100%;
    width: 320px;
    display: inline;
    margin-left: 30px;
    margin-right: 30px;
    padding: 5px;
  }

  .outerRectangle:first-child {
    margin-left: -160px;
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
