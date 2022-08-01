<template>
  <el-select
    class="cw-select"
    ref="select"
    v-model="inputValue"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <el-option
      v-for="item in options"
      :key="item.value || item[config.valueKey]"
      :label="item.label || item[config.labelKey]"
      :value="item.value || item[config.valueKey]"
    >
    </el-option>
  </el-select>
</template>

<script>
import inputValueMixin from '@/mixins/inputValueMixin'
export default {
  name: 'CwSelect',
  mixins: [inputValueMixin],
  props: {
    options: {
      type: Array,
      default: () => [],
    },
    config: {
      type: Object,
      default: function () {
        return {}
      },
    },
  },
  data() {
    return {
    };
  },
  methods: {
    getSelectedItem() {
      const selectedItem = this.options.find(
        (item) => item[this.config.valueKey] === this.inputValue
      );
      return selectedItem || {};
    },
    getSelectedLabel() {
      const selectedItem = this.getSelectedItem();
      return selectedItem[this.config.labelKey];
    },
  },
};
</script>

<style scoped lang="scss">
</style>
