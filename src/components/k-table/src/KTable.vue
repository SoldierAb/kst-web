<template>
  <k-table
    min-height="400"
    style="width: 100%"
    :data="dataSource"
    :height="height"
    :span-method="spanMethod"
    :default-expand-all="defaultExpandAll"
    @row-click="rowClick"
    @cell-click="cellClick"
    @sort-change="sortChange"
    @selection-change="handleSelectionChange"
  >
    <div v-for="(item,index) in headerData" :key="item+index">
      <k-table-column v-if="item.comps" v-bind="item">
        <template slot-scope="scope">
          <span v-for="(cp,cindex) in item.comps" :key="cp+cindex">
            <slot
              v-if="cp.event"
              :name="`${cp.event}`"
              v-bind="{$config:cp,$data:dataSource,$index:scope.$index}"
            >
              <component
                :is="`El${cp.comp}`"
                v-show="cp.showRules?cp.showRules({$data:dataSource,$index:scope.$index}):true"
                v-bind="{...dataSource[scope.$index],...cp.props}"
                :disabled="cp.disableRules?cp.disableRules({$data:dataSource,$index:scope.$index}):false"
                @click.native.prevent="$emit('act',cp.event,scope.$index, dataSource)"
              >
                <el-text v-if="cp.label">{{cp.label}}</el-text>
              </component>
            </slot>
            <component
              :is="`El${cp.comp}`"
              v-else
              v-show="cp.showRules?cp.showRules({$data:dataSource,$index:scope.$index}):true"
              v-bind="{...dataSource[scope.$index],...cp.props}"
              :disabled="cp.disableRules?cp.disableRules({$data:dataSource,$index:scope.$index}):false"
              @click.native.prevent="$emit('act',cp.event,scope.$index, dataSource)"
            >
              <el-text v-if="cp.label">{{cp.label}}</el-text>
            </component>
          </span>
        </template>
      </k-table-column>
      <span v-else-if="item.type==='selection'">
        <k-table-column
          v-if="(item.showRules?item.showRules({$data:dataSource}):true)"
          type="selection"
          fixed="left"
          width="55"
        />
      </span>
      <k-table-column v-else v-bind="item">
        <template slot-scope="scope">
          <slot
            v-if="item.type==='expand'"
            name="expand"
            v-bind="{$data:dataSource,$index:scope.$index}"
          >
            <el-text>{{dataSource[scope.$index]}}</el-text>
          </slot>
          <slot v-else :name="`${item.prop}`" v-bind="{$data:dataSource,$index:scope.$index}">
            <el-text>{{dataSource[scope.$index][item.prop]|filterAct(item.formatType)}}</el-text>
          </slot>
        </template>
      </k-table-column>
    </div>
    <template slot="empty">{{loading?'':'暂无数据'}}</template>
  </k-table>
</template>

<script>
import { Table, TableColumn } from 'element-ui';
export default {
  name: 'KTable',
  components: {
    KTable: Table,
    KTableColumn: TableColumn,
  },
  props: {
    tableData: {
      type: Array,
      default() {
        return [];
      },
    },
    headerData: {
      type: Array,
      default() {
        return [];
      },
    },
    spanMethod: {
      type: Function,
    },
    loading: {
      type: Boolean,
    },
    height: {
      type: Number,
    },
    defaultExpandAll: {
      type: Boolean,
      default() {
        return true;
      },
    },
  },
  data() {
    return {
      multipleSelection: [],
    };
  },
  computed: {
    dataSource() {
      return this.tableData;
    },
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.$emit('selection-change', val);
    },
    rowClick(row, col, event) {
      this.$emit('row-click', row, col, event);
    },
    cellClick(cell, row, col, event) {
      this.$emit('cell-click', cell, row, col, event);
    },
    sortChange({ column, prop, order }) {
      this.$emit('sort-change', column, prop, order);
    },
  },
};
</script>
