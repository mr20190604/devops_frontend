<template>
  <div class="bg">
    <p class="title">{{ systemName }}</p>
    <div class="outerBox">
      <div
        ref="innerBox"
        class="innerBox"
        :class="{running:isRunning}"
        :style="{marginLeft:marginLeft,width:list.length*3*380+'px'}"
        @mouseover="handleMouseover"
        @mouseout="handleMouseout"
      >
        <Card
          v-for="(item,index) in list"
          :key="index+'_a'"
          class="outerRectangle"
          :name="item.name"
          :src="item.img"
          :url="item.url"
          :index="item.index"
          :cycle="(list.length * 2 - 5) * 4"
          :is-paused="isPaused"
          :is-running="isRunning"
        />
        <template v-if="list.length>4">
          <template v-for="count of 2">
            <Card
              v-for="(item,index) in list"
              :key="index+'_'+count"
              class="outerRectangle"
              :name="item.name"
              :src="item.img"
              :url="item.url"
              :index="list.length*count*2+item.index"
              :cycle="(list.length * 2 - 5) * 4"
              :is-paused="isPaused"
              :is-running="isRunning"
            />
          </template>
        </template>
      </div>
    </div>
    <div v-if="isRunning" class="left" @click="handleLeftClick" />
    <div v-if="isRunning" class="right" @click="handleRightClick" />
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
      list: [],
      isPaused: false,
      isRunning: true,
      marginLeft: '-180px'
    }
  },
  created() {
    const childSys = JSON.parse(JSON.stringify(this.$store.state.user.childSys))

    if (this.$store.state.user.name === '管理员') {
      childSys[2].mmChildSysModel.sysName = '苍穹监测系统'
      childSys.splice(3, 1)
    }

    if (childSys.length === 1) {
      this.marginLeft = '580px'
    } else if (childSys.length === 2) {
      this.marginLeft = '380px'
    } else if (childSys.length === 3) {
      this.marginLeft = '200px'
    } else if (childSys.length === 4) {
      this.marginLeft = '10px'
    }

    this.isRunning = childSys.length > 4

    this.list = childSys.map((item, index) => {
      const result = {
        name: item.mmChildSysModel.sysName,
        url: item.mmChildSysModel.sysUrl,
        img: item.mmChildSysModel.sysIcon
      }

      if (childSys.length === 1) {
        result.index = 4
      } else if (childSys.length === 2) {
        result.index = 3 + index * 2
      } else if (childSys.length === 3) {
        result.index = 2 + index * 2
      } else if (childSys.length === 4) {
        result.index = 1 + index * 2
      } else if (childSys.length === 5) {
        result.index = index * 2
      } else if (childSys.length > 5) {
        result.index = index * 2
      }
      return result
    })
  },
  mounted() {
    if (this.isRunning) {
      const marginLeft = (this.list.length * 2 - 5) * 380 * -1 - 180
      const E2F3E2C0085 = `@keyframes E2F3E2C0085 {
                        0%{
                          margin-left: -180px;
                        }
                        100%{
                          margin-left: ` + marginLeft + `px;
                        }
                      }`
      document.styleSheets[0].insertRule(E2F3E2C0085, 0)
      this.$refs.innerBox.style.animation = 'E2F3E2C0085 ' + (this.list.length * 2 - 5) * 4 + 's linear 0s infinite'
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
    },
    handleMouseover() {
      this.isPaused = true
      this.$refs.innerBox.style.animationPlayState = 'paused'
    },
    handleMouseout() {
      this.isPaused = false
      this.$refs.innerBox.style.animationPlayState = 'running'
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

  .particles {
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

  .innerBox {
    height: 100%;
  }

  .outerRectangle {
    height: 100%;
    width: 320px;
    display: inline;
    margin-left: 30px;
    margin-right: 30px;
    padding: 5px;
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
