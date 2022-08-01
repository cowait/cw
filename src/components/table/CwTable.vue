<template>
  <div class="cw-table">
    <section class="table-filter clearfix">
      <slot name="filter"></slot>
    </section>

    <el-table
      v-bind="{
        ...$attrs,
        data: $attrs.tableData || fetchData,
        ref: $attrs.ref,
        border: $attrs.border || true,
      }"
      v-on="$listeners"
      ref='table'
    >
      <el-table-column v-if="config.hasCheck" type="selection" width="55">
      </el-table-column>
      <el-table-column v-if="config.hasIndex" type="index" width="50" label="序号">
      </el-table-column>
      <template v-for="item in config.columns">
        <el-table-column
          v-if="!item.isCustomColumn"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :fixed="item.fixed"
          :min-width="item['minWidth']"
          :show-overflow-tooltip="item['showOverflowTooltip']"
        >
          <template slot-scope="scope">
            <slot
              :name="`column-${item.prop}`"
              :data="scope.row"
              v-if="item.isSlot"
            ></slot>
            <span v-else>
              {{ scope.row[item.prop] }}
            </span>
          </template>
        </el-table-column>
        <slot v-if="item.isCustomColumn" :name="`column-${item.prop}`" :data="item">
        </slot>
      </template>
      <slot></slot>
    </el-table>

    <el-pagination
      class="pagination"
      v-if="config.hasPage"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageParams.page"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageParams.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pageParams.total"
      v-bind="config.pageConfig || {}"
    >
    </el-pagination>
  </div>
</template>

<script>
import lazyFetchMixin from "@/mixins/lazyFetchMixin";

export default {
  name: 'CwTable',
  props: {
    noWatchParams: {
      type: Object,
      default: () => {},
    },
  },
  mixins: [lazyFetchMixin],
  data() {
    return {
      pageParams: {
        size: 10,
        page: 1,
        total: 0,
      },
    };
  },
  methods: {
    commonFetch() {
      this.pageParams.page = 1;
      this.requestFetch()
    },
    async requestFetch() {
      if (!this.config.request) {
        return
      }
      this.$emit('beforeFetch')
      let params = {}
      if (this.config.getParams) {
        params = this.config.getParams()
      } else {
        params = this.getParams();
      }
      let res = await this.config.request(params);
      if (this.config.dataParse) {
        res = this.config.dataParse(res);
      }
      this.fetchData = res.list;
      this.pageParams.total = res.total;
      this.$emit("afterFetch", res);
      return res
    },
    handleSizeChange(value) {
      this.pageParams.page = 1;
      this.pageParams.size = value;
      this.requestFetch();
    },
    handleCurrentChange(value) {
      this.pageParams.page = value;
      this.requestFetch();
    },
    getParams() {
      const pageParams = this.getPageParams()
      const noWatchParams = {...this.noWatchParams}
      
      if (this.params) {
        Object.keys(this.params).forEach((item) => {
          if (this.params[item] === "") {
            this.params[item] = undefined;
          }
        });
      }
      Object.keys(noWatchParams).forEach((item) => {
        if (noWatchParams[item] === "") {
          noWatchParams[item] = undefined;
        }
      });
      return {
        ...pageParams,
        ...noWatchParams,
        ...this.params,
      };
    },
    getPageParams() {
      const pageParams = {};
      if (this.config.hasPage) {
        if (this.config.pageSizeKey) {
          pageParams[this.config.pageSizeKey] = this.pageParams.size;
        } else {
          pageParams["size"] = this.pageParams.size;
        }
        if (this.config.pageIndexKey) {
          pageParams[this.config.pageIndexKey] = this.pageParams.page;
        } else {
          pageParams["page"] = this.pageParams.page;
        }
      }
      return pageParams
    },
    // 获取复选框的勾选项
    getSelection() {
      return this.$refs.table.selection
    },
    getTableData() {
      return this.fetchData
    }
  },
};
</script>

<style scoped lang="scss">
.cw-table {
  .table-filter {
    .table-filter-right {
      float: right;
    }
  }

  .pagination {
    text-align: right;
    margin-top: 10px;
  }
  :deep(.cell) {
    word-break: break-word;
  }

  :deep(.el-table__body) {
    width: 100%;
    table-layout: fixed !important;
  }
}
</style>
