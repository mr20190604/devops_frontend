import first from '@/views/bigData/first/first.vue'
import second from '@/views/bigData/second/second.vue'
import third from '@/views/bigData/third/third.vue'

export default {
  name: "bigDataAnalysis",
  components:{
    first, second, third
  },
  data(){
    return {
      activeName: 'first'
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    }
  }
}

