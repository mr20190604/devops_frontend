<template>
  <transition>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      @click="handleClick()"
    >
      <path
        id="outline"
        :d="innerD1"
        fill="none"
        stroke="#34fff8"
        stroke-width="1"
      />
      <path
        id="inline"
        :d="innerD2"
        fill="none"
        stroke="#34fff8"
        stroke-width="1"
      />
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
        :xlink:href="innerSrc"
        x="129"
        y="199"
        height="50"
        width="50"
      />
      <text x="150" y="345" fill="#34fff8" font-size="24" style="dominant-baseline:middle;text-anchor:middle;">{{
        innerName }}
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
    d1: {
      type: String,
      default: ''
    },
    d2: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      innerName: undefined,
      innerSrc: undefined,
      innerD1: undefined,
      innerD2: undefined,
      innerUrl: undefined
    }
  },
  watch: {
    name: function(value) {
      this.innerName = value
    },
    src: function(value) {
      this.innerSrc = value
    },
    d1: function(value) {
      this.innerD1 = value
    },
    d2: function(value) {
      this.innerD2 = value
    },
    url: function(value) {
      this.innerUrl = value
    }
  },
  created() {
    this.innerName = this.name
    this.innerSrc = this.src
    this.innerD1 = this.d1
    this.innerD2 = this.d2
    this.innerUrl = this.url
  },
  methods: {
    handleClick: function() {
      console.log(!!this.innerUrl)
      this.innerUrl && this.$router.push(this.innerUrl)
    }
  }
}
</script>

<style scoped>

  svg {
    cursor: pointer;
  }

  @keyframes loading {
    from {
      padding-left: 500px;
    }
    to {
      padding-left: 0;
    }
  }

  .v-enter-active {
    animation: loading 3s;
  }

</style>
