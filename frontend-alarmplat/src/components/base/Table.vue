<template>
  <!-- 公共表格组件 -->
  <!-- 是否需要分页,ant表格自带的,里选了fasle(不重要) -->
  <!-- 是否需要表格前面的选择按钮 -->
  <ma-table
    :class="'common-table'"
    :row-class-name="rowClassName"
    :customRow="customRow"
    :dataSource="tableData"
    :pagination="pagination"
    :default-expanded-row-keys="defaultExpandedRowKeys"
    :row-key="record => record[rowKey]"
    :loading="loading"
    :scroll="{ x: width, y: height }"
    :row-selection="rowSelection"
    :childrenColumnName="childrenName"
    :showHeader="showHeader"
  >
    <ma-table-column
      v-for="item in columns"
      :align="item.align"
      :key="item.dataIndex"
      :title="item.title"
      :data-index="item.dataIndex"
      :resizable="item.resizable"
      :sorter="item.sorter"
      :sortDirections="item.sortDirections"
      :showSorterTooltip="item.showSorterTooltip"
      :width="item.width"
      :maxWidth="item.maxWidth"
      :minWidth="item.minWidth"
    >
      <template #default="{ record }">
        <template v-if="!item.renderBySlot">
          <span>
            {{
              item.reRender?.(
                record[item.dataIndex],
                record
              ) || record[item.dataIndex]
            }}
          </span>
        </template>
        <template v-if="item.renderBySlot">
          <slot
            :name="`column-${item.dataIndex}`"
            :record="record"
          ></slot>
        </template>
      </template>
    </ma-table-column>
    <ma-table-column
      class="operation-column"
      v-if="operation"
      key="action"
      :title="operationTitle"
      :width="operationWidth"
    >
      <template #default="{ record }">
        <span>
          <ma-button
            v-if="showViewBtn"
            @click="toView(record)"
            size="small"
          >
            <template #icon
              ><icon icon="edit-line"
            /></template>
            详情
          </ma-button>
          <ma-button
            v-if="showEditBtn"
            @click="toEdit(record)"
            size="small"
          >
            <template #icon
              ><icon icon="edit-line"
            /></template>
            编辑
          </ma-button>
          <ma-popconfirm
            v-if="showDelBtn"
            :title="delMessage"
            @confirm="toDel(record)"
          >
            <template #icon>
              <icon
                :icon="`notification-2-line`"
                style="
                  color: #f56c6c;
                  position: absolute;
                  left: 0;
                  top: 2px;
                "
              />
            </template>
            <ma-button
              size="small"
              danger
              v-if="showDelBtn"
            >
              <template #icon
                ><icon icon="delete-bin-7-line"
              /></template>
              删除
            </ma-button>
          </ma-popconfirm>
          <slot name="op-btn" :record="record"></slot>
        </span>
      </template> 
    </ma-table-column>
    <!--  插槽后面-slot:[item] 如果是动态渲染插槽需要使用这种方式 -->
    <!-- renderArr 是父组件传递过来的用了插槽的名字,等下会在父组件中讲清楚,通过这个数组来遍历生成插槽 -->
    <!-- 再通过这个插槽传递数据给父组件,做一些编辑提交的操作等等 -->
    <!-- <template v-slot:[item]="scope" v-for="item in renderArr">
      <slot :name="item" :scope="scope"></slot>
    </template> -->
  </ma-table>
</template>
<script>
export default {
  name: 'CommonTable',
  props: {
    // 表头配置通过这来渲染表格
    columns: {
      type: Array
    },
    // 通过父组件传递过来的表格数据
    tableData: {
      type: Array,
      default: () => []
    },

    pagination: {
      type: [Boolean, Object],
      default: false
    },
    // table的key
    rowKey: {
      type: String,
      default: ''
    },
    // 是否需要loading
    loading: {
      type: Boolean,
      default: true
    },
    // 是否需要选择
    isSelect: {
      type: Boolean,
      default: false
    },
    // 是否显示表头
    showHeader: {
      type: Boolean,
      default: true
    },
    // 选择方法
    rowSelection: {
      type: Object,
      default: () => null
    },
    rowClassName: {
      type: Function,
      default: () => {}
    },

    customRow: {
      type: Function,
      default: () => undefined
    },

    // 表格宽度
    width: {
      type: String,
      default: 'calc(100% - 8px)'
    },
    // 表格高度
    height: {
      type: String,
      default: 'auto'
    },
    // 是否显示操作栏
    operation: {
      type: Boolean,
      default: true
    },

    // 操作栏标题
    operationTitle: {
      type: String,
      default: '操作'
    },

    // 操作栏宽度
    operationWidth: {
      type: Number,
      default: 200
    },
    // 是否显示详情按钮
    showViewBtn: {
      type: Boolean,
      default: false
    },
    // 是否显示编辑按钮
    showEditBtn: {
      type: Boolean,
      default: false
    },
    // 是否显示删除按钮
    showDelBtn: {
      type: Boolean,
      default: false
    },
    // 删除按钮二次确认提示语
    delMessage: {
      type: String,
      default: '请确认是否删除？'
    },
    // 是否显示按钮分割线
    // showDivider: {
    //   type: Boolean,
    //   default: true
    // }
    // 树结构子级别名称
    childrenName: {
      type: String,
      default: 'children'
    },
    defaultExpandedRowKeys: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  methods: {
    // 详情
    toView(item) {
      this.$emit('toView', item)
    },
    // 删除
    toDel(item) {
      this.$emit('toDel', item)
    },
    // 编辑
    toEdit(item) {
      this.$emit('toEdit', item)
    }
    // customRow(record, index) {
    //   return {
    //     onClick: () => {
    //       // this.$emit('rowClick', record, index)
    //     }
    //   }
    // }
  },
  data() {
    return {}
  },
  mounted() {}
}
</script>
<style lang="less">
.common-table {
  .ant-table-body {
    overflow: auto !important;
    table {
      min-width: unset !important;
    }
    .ant-table-tbody {
      button {
        margin: 0 5px;
      }
    }
  }
  .operation-column {
    button {
      margin: 0 6px;
    }
  }
}
</style>
