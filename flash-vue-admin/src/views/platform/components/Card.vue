<template>
  <transition>
    <svg
      ref="svg"
      xmlns="http://www.w3.org/2000/svg"
      @click="handleClick()"
    >
      <path
        id="outline"
        fill="none"
        stroke="#34fff8"
        stroke-width="1"
        :d="target[0].d1"
      >
        <animate
          v-if="isRunning"
          ref="animate1"
          attributeName="d"
          repeatCount="1"
          :keyTimes="keyTimes"
          :values="target.map(item=>item.d1).join(';')"
          :dur="dur"
          :begin="begin"
          restart="always"
        />
      </path>
      <path
        id="inline"
        fill="none"
        stroke="#34fff8"
        stroke-width="1"
        :d="target[0].d2"
      >
        <animate
          v-if="isRunning"
          ref="animate2"
          attributeName="d"
          repeatCount="1"
          :keyTimes="keyTimes"
          :values="target.map(item=> item.d2).join(';')"
          :dur="dur"
          :begin="begin"
          restart="always"
        />
      </path>
      <image
        :xlink:href="src"
        x="79"
        y="149"
        height="150"
        width="150"
      />
      <text
        x="150"
        y="345"
        fill="#34fff8"
        font-size="24"
        style="dominant-baseline:middle;text-anchor:middle;"
      >{{ name }}
      </text>
    </svg>
  </transition>
</template>

<script>
export default {
  name: 'Card',
  props: {
    name: {
      type: String,
      default: ''
    },
    src: {
      type: String,
      default: ''
    },
    url: {
      type: String,
      default: ''
    },
    index: {
      type: Number,
      default: 0
    },
    cycle: {
      type: Number,
      default: 0
    },
    isPaused: {
      type: Boolean,
      default: false
    },
    isRunning: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      source: [
        {
          d1: 'M 0,-30 Q 154,8 308,20 L 308,490 Q 154,500 0,540 Z',
          d2: 'M 10,-20 Q 154,20 298,30 L 298,480 Q 154,490 10,530 Z'
        },
        {
          d1: 'M 0,5 Q 154,28 308,30 L 308,475 Q 154,480 0,500 Z',
          d2: 'M 10,15 Q 154,38 298,40 L 298,465 Q 154,470 10,490 Z'
        },
        {
          d1: 'M 0,25 Q 154,38 308,38 L 308,470 Q 154,475 0,485 Z',
          d2: 'M 10,35 Q 154,48 298,48 L 298,460 Q 154,465 10,475 Z'
        },
        {
          d1: 'M 0,35 Q 154,43 308,43 L 308,465 Q 154,465 0,475 Z',
          d2: 'M 10,45 Q 154,53 298,53 L 298,455 Q 154,455 10,465 Z'
        },
        {
          d1: 'M 0,40 Q 154,45 308,38 L 308,470 Q 154,465 0,470 Z',
          d2: 'M 10,50 Q 154,55 298,48 L 298,460 Q 154,455 10,460 Z'
        },
        {
          d1: 'M 0,45 Q 154,45 308,33 L 308,475 Q 154,465 0,465 Z',
          d2: 'M 10,55 Q 154,55 298,43 L 298,465 Q 154,455 10,455 Z'
        },
        {
          d1: 'M 0,40 Q 154,35 308,20 L 308,485 Q 154,475 0,470 Z',
          d2: 'M 10,50 Q 154,45 298,30 L 298,475 Q 154,465 10,460 Z'
        },
        {
          d1: 'M 0,30 Q 154,25 308,0 L 308,505 Q 154,485 0,480 Z',
          d2: 'M 10,40 Q 154,35 298,10 L 298,495 Q 154,475 10,470 Z'
        },
        {
          d1: 'M 0,20 Q 154,10 308,-30 L 308,540 Q 154,500 0,490 Z',
          d2: 'M 10,30 Q 154,20 298,-20 L 298,530 Q 154,490 10,480 Z'
        }
      ],
      target: [],
      keyTimes: undefined,
      dur: '20s',
      begin: '0s',
      interval: undefined
    }
  },
  watch: {
    isPaused(value) {
      if (value) {
        this.$refs.svg.pauseAnimations()
      } else {
        this.$refs.svg.unpauseAnimations()
      }
    }
  },
  created() {
    if (this.isRunning) {
      let indexOf = Math.floor(this.index / 2)
      if (this.index > 8) {
        this.begin = ((this.index - 10) / 2 + 1) * 4 + 's'
        indexOf = 4
      }
      const temp = [0]
      for (let i = 0; i < 5; i++) {
        temp.push(temp[temp.length - 1] + (1.0 / 5))
      }
      this.keyTimes = temp.join(';')
      const source = this.source.filter((item, index) => index % 2 === 0).reverse()
      this.target = source.filter((item, index) => index >= source.length - 1 - indexOf)
        .concat(source.filter((item, index) => index < source.length - 1 - indexOf))
        .concat(source.find((item, index) => index === source.length - 1 - indexOf))
    } else {
      this.target.push(this.source[this.index])
    }
  },
  beforeDestroy() {
    this.interval && clearInterval(this.interval)
  },
  mounted() {
    const that = this
    this.interval = setInterval(function() {
      const time = parseInt(that.begin) * 1000
      setTimeout(function() {
        that.$refs['animate1'] && that.$refs['animate1'].beginElement()
        that.$refs['animate2'] && that.$refs['animate2'].beginElement()
      }, time)
    }, this.cycle * 1000)
  },
  methods: {
    handleClick: function() {
      this.url && this.$router.push(this.url)
    }
  }
}
</script>

<style scoped>
  svg {
    cursor: pointer;
  }
</style>
