<template>
    <!-- 默认渲染列 -->
    <el-table-column
        :type="item.type"
        :index="item.index"
        :column-key="item.columnKey"
        :label="item.title"
        :prop="item.key"
        :width="item.width"
        :min-width="item.minWidth"
        :fixed="item.fixed"
        :render-header="item.renderHeader"
        :sortable="item.sortable"
        :sort-method="item.Method"
        :sort-by="item.sortBy"
        :sort-orders="item.sortOrders"
        :resizable="item.resizable"
        :formatter="item.formatter"
        :show-overflow-tooltip="item.showOverflowTooltip"
        :align="item.align"
        :header-align="item.headerAlign"
        :class-name="item.className"
        :label-class-name="item.labelClassName"
        :reserve-selection="item.reserveSelection"
        :filters="item.filters"
        :filter-placement="item.filterPlacement"
        :filter-multiple="item.filterMultiple"
        :filter-method="item.filterMethod"
        :filtered-value="item.filteredValue"
    >
        <template slot-scope="scope" v-if="!item.type">
            <template v-if="!item.render">
                <template v-if="item.formatter">
                    <span v-html="item.formatter(scope.row, item)"></span>
                </template>
                <template v-else>
                    <span>{{ scope.row[item.key] }}</span>
                </template>
            </template>
            <template v-else>
                <expand-dom
                    :column="item"
                    :row="scope.row"
                    :rowIndex="scope.$index"
                    :render="item.render"
                    :index="index"
                ></expand-dom>
            </template>
        </template>

        <template v-if="item.children">
            <table-column v-for="(child, index) in item.children" :key="index" :item="child"></table-column>
        </template>
    </el-table-column>
</template>

<script>
// import TableColumn from 'element-ui/lib/table-column';
import expandDom from './expandDom';
export default {
    name: 'tableColumn',
    props: {
        item: {
            type: Object
        },
        index: {
            type: Number
        }
    },
    created() {
        // console.log(this.item.type);
    },
    components: {
        // elTableColumn: TableColumn,
        expandDom
    }
};
</script>
