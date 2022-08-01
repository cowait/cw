export default {
  props: {
    data: {
      type: Function
    },
    config: {
      type: Object
    },
    params: {
      type: Object,
      default: () => {}
    },
    request: {
      type: Function
    }
  },
  data() {
    return {
      fetchData: []
    }
  },
  methods: {
    fetch () {
      this.commonFetch()
    },
    async commonFetch () {
      this.$emit('beforeFetch')
      let res = await this.config.request();
      if (this.config.dataParse) {
        res = this.config.dataParse(res)
      }
      this.fetchData = res;
      if (this.config.dataParse) {
        this.fetchData = this.config.dataParse(this.fetchData)
      }
      this.$emit('afterFetch', res)
    }
  },
  watch: {
    params: {
      deep: true,
      handler(next) {
        const nextKey = JSON.stringify(next)
        const oldKey = JSON.stringify(this.oldParamBackup || {})
        if (nextKey !== oldKey) {
          this.fetch()
        }
        this.oldParamBackup = {
          ...next
        }
      }
    }
  },
  mounted() {
    if (this.config && this.config.unImmediate) {
      return
    } else {
      this.fetch()
    }
  },
}