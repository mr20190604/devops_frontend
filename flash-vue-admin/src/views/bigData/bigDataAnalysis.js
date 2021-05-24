import first from '@/views/bigData/first/first.vue'

export default {
  name: "bigDataAnalysis",
  components:{
    first
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

