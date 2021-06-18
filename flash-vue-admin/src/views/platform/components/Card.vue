<template>
  <transition>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      @click="handleClick()"
    >
      <path
        id="outline"
        fill="none"
        stroke="#34fff8"
        stroke-width="1"
      >
        <animate
          attributeName="d"
          repeatCount="indefinite"
          :keyTimes="keyTimes"
          :values="target.map(item=>item.d1).join(';')"
          :dur="dur"
        />
      </path>
      <path
        id="inline"
        fill="none"
        stroke="#34fff8"
        stroke-width="1"
      >
        <animate
          attributeName="d"
          repeatCount="indefinite"
          :keyTimes="keyTimes"
          :values="target.map(item=> item.d2).join(';')"
          :dur="dur"
        />
      </path>
      <circle
        cx="154"
        cy="224"
        r="60"
        stroke-width="0"
        fill="#4c8df9"
        fill-opacity="0.1"
      />
      <circle
        cx="154"
        cy="224"
        r="50"
        stroke-width="0"
        fill="#4c8df9"
        fill-opacity="0.2"
      />
      <image
        :xlink:href="src"
        x="129"
        y="199"
        height="50"
        width="50"
      />
      <text x="150" y="345" fill="#34fff8" font-size="24" style="dominant-baseline:middle;text-anchor:middle;">{{ name
      }}
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
          d1: 'M 0,25 Q 154,38 308,38 L 308,470 Q 154,475 0,485 Z',
          d2: 'M 10,35 Q 154,48 298,48 L 298,460 Q 154,465 10,475 Z'
        },
        {
          d1: 'M 0,40 Q 154,45 308,38 L 308,470 Q 154,465 0,470 Z',
          d2: 'M 10,50 Q 154,55 298,48 L 298,460 Q 154,455 10,460 Z'
        },
        {
          d1: 'M 0,40 Q 154,35 308,20 L 308,485 Q 154,475 0,470 Z',
          d2: 'M 10,50 Q 154,45 298,30 L 298,475 Q 154,465 10,460 Z'
        },
        {
          d1: 'M 0,20 Q 154,10 308,-30 L 308,540 Q 154,500 0,490 Z',
          d2: 'M 10,30 Q 154,20 298,-20 L 298,530 Q 154,490 10,480 Z'
        }
      ],
      target: [],
      keyTimes: '',
      dur: '40s'
    }
  },
  created() {
    const temp = [0]
    for (let i = 0; i < 10; i++) {
      temp.push(temp[temp.length - 1] + (1.0 / 10))
    }
    this.keyTimes = temp.join(';')
    const copy = JSON.parse(JSON.stringify(this.source))
    this.source = this.source.concat(copy).reverse()
    this.target = this.source.filter((item, index) => index >= this.source.length - 1 - this.index)
      .concat(this.source.filter((item, index) => index < this.source.length - 1 - this.index))
      .concat(this.source.find((item, index) => index === this.source.length - 1 - this.index))
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
