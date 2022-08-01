export default {
  props: {
    value: {
    },
  },
  watch: {
    value(next) {
      this.inputValue = next;
    },
    inputValue() {
      this.$emit("input", this.inputValue);
    },
  },
  data() {
    return {
      inputValue: null,
    };
  },
  created() {
    this.inputValue = this.value
  }
}