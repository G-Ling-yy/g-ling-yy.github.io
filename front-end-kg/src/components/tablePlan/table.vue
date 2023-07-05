<template>
    <div class="table-section">
        <pageable-table
            ref="table"
            :columns="innerColumn"
            :params="options.params"
            @on-after-ajax="afterAjax"
            @on-change-page="innerChangePage"
            @on-page-size-change="pageSizeChange"
            @on-selection-change="selectionChange"
            @on-select-all="selectAll"
            @on-sort-change="sortChange"
            :row-class-name="rowClassName"
            @on-row-click="rowClick"
            :size="options.size"
            :total="options.total"
            :pageVisible="options.pageVisible"
            @on-select="select"
            @cell-mouse-enter="cellMouseEnter"
            @cell-mouse-leave="cellMouseLeave"
            @cell-click="cellClick"
            @cell-dblclick="cellDblclick"
            @row-contextmenu="rowContextmenu"
            @row-dblclick="rowDblclick"
            @header-click="headerClick"
            @header-contextmenu="headerContextmenu"
            @filter-change="filterChange"
            @current-change="currentChange"
            @header-dragend="headerDragend"
            @expand-change="expandChange"
            @on-table-mounted="tableMounted"
            :border="options.border"
            :stripe="options.stripe"
            :height="options.height"
            :max-height="options.maxHeight"
            :pageable="options.pageable"
            :page-placement="options.pagePlacement"
            :selection="options.selection"
            :selectionCache="options.selectionCache"
            :uniqueId="options.uniqueId"
            :manualLoad="options.manualLoad"
            :pageSize="options.pageSize"
            :pageSizeOpts="options.pageSizeOpts"
            :need-custom-column="options.needCustomColumn"
            :graphqlModelConfig="options.graphqlModelConfig"
            :localData="options.localData"
            :pageable-setting="options.pageableSetting || {}"
            :pageNumber="options.pageNumber"
            :methodType="options.method"
            :fit="options.fit"
            :showHeader="options.showHeader"
            :highlightCurrentRow="options.highlightCurrentRow"
            :currentRowKey="options.currentRowKey"
            :rowClassName="options.rowClassName"
            :rowStyle="options.rowStyle"
            :cellClassName="options.cellClassName"
            :cellStyle="options.cellStyle"
            :headerRowClassName="options.headerRowClassName"
            :headerRowStyle="options.headerRowStyle"
            :headerCellClassName="options.headerCellClassName"
            :headerCellStyle="options.headerCellStyle"
            :rowKey="options.rowKey"
            :emptyText="options.emptyText"
            :defaultExpandAll="options.defaultExpandAll"
            :expandRowKeys="options.expandRowKeys"
            :defaultSort="options.defaultSort"
            :tooltipEffect="options.tooltipEffect"
            :showSummary="options.showSummary"
            :sumText="options.sumText"
            :summaryMethod="options.summaryMethod"
            :spanMethod="options.spanMethod"
            :selectOnIndeterminate="options.selectOnIndeterminate"
            :indent="options.indent"
            :lazy="options.lazy"
            :load="options.load"
            :treeProps="options.treeProps"
            :url="options.url"
            :headers="options.headers"
        >
        </pageable-table>
    </div>
</template>
<script>
import pageableTable from './pageableTable.vue';
import table_section_render_tooltip from './table_section_render_toolTip.vue';
import Vue from 'vue';
import editableItemWrap from './editableTypes/editableItemWrap';
import editableTableInputType from './editableTypes/inputType.vue';
import editableTableSelectType from './editableTypes/editableTableSelectType';
import editableTableSwitchType from './editableTypes/editableTableSwitchType';
import editableTableDateType from './editableTypes/editableTableDateType';
// import editableRemoteSelectType from './editableTypes/editableRemoteSelectType';
import editableTableNumberType from './editableTypes/editableTableNumberType.vue';
import editableTableTimeType from './editableTypes/editableTableTimeType.vue';
import editableTableCheckboxType from './editableTypes/editableTableCheckboxType.vue';

Vue.component('editableTableItemWrap', editableItemWrap);
Vue.component('editableTableInputType', editableTableInputType);
Vue.component('editableTableSelectType', editableTableSelectType);
Vue.component('editableTableSwitchType', editableTableSwitchType);
Vue.component('editableTableDateType', editableTableDateType);
// Vue.component('editableRemoteSelectType', editableRemoteSelectType);
Vue.component('editableTableNumberType', editableTableNumberType);
Vue.component('editableTableTimeType', editableTableTimeType);
Vue.component('editableTableCheckboxType', editableTableCheckboxType);
export default {
    name: 'cTable',
    components: {
        pageableTable
    },
    props: {
        options: {
            type: Object,
            default: () => {
                return {};
            }
        }
    },

    data: function() {
        return {
            selectedRadioRow: null,
            columns: [],
            columnsCopy: []
        };
    },

    watch: {
        'options.columns': {
            deep: true,
            handler() {
                this.columnsCopy = _.cloneDeep(this.options.columns);
            }
        },
        'options.pageNumber'() {
           this.currentPageNumber = this.options.pageNumber;
        },
        'options.pageSize'() {
            this.currentPageSize = this.options.pageSize;
        }
    },

    created() {
        this.columnsCopy = _.cloneDeep(this.options.columns);
    },

    computed: {
        innerColumn() {
            this.columns = this.columnsCopy;

            let columns = this.initColumns(this.columnsCopy);

            if (this.options.selection) {
                let hasFixed = this.options.selectionFixed || _.find(this.options.columns, it => it.fixed === 'left');

                columns = [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center',
                        defaultVisible: true
                    }
                ].concat(columns);
            }

            if (this.options.singleSelection) {
                columns = [
                    {
                        width: 50,
                        title: ' ',
                        align: 'center',
                        defaultVisible: true,
                        render: (h, { row, index }) => {
                            const Radio = Vue.component('Radio');
                            const t = () => {
                                this.selectRadioRow(row, index);
                            };
                            let self = this;

                            if (!self.selectedRadioRow) {
                                self.selectedRadioRow = {};
                            }
                            return (
                                <span onClick={t}>
                                    <el-radio label={row.id} value={self.selectedRadioRow.id}>
                                        &nbsp;
                                    </el-radio>
                                </span>
                            );
                        }
                    }
                ].concat(columns);
            }

            return columns;
        }
    },

    methods: {
        tableMounted() {
            this.$emit('on-table-mounted');
        },
        initColumns(cols) {
            let self = this;
            let columns = [];
            _.each(cols, item => {
                Vue.set(item, 'defaultVisible', item.defaultVisible || false);
                Vue.set(item, 'alwaysVisible', item.alwaysVisible || false);
                Vue.set(item, '_uuid', _.uniqueId());

                if (item.editType) {
                    switch (item.editType) {
                        case 'input':
                            item.editorInnerComponent = 'editableTableInputType';
                            item.component = 'editableTableItemWrap';
                            break;
                        case 'select':
                            item.editorInnerComponent = 'editableTableSelectType';
                            item.component = 'editableTableItemWrap';
                            break;
                        //         case 'remoteSelect':
                        //             item.editorInnerComponent = 'editableRemoteSelectType';
                        //             item.component = 'editableTableItemWrap';
                        //             break;
                        case 'switch':
                            item.editorInnerComponent = 'editableTableSwitchType';
                            item.component = 'editableTableItemWrap';
                            break;
                        case 'checkbox':
                            item.editorInnerComponent = 'editableTableCheckboxType';
                            item.component = 'editableTableItemWrap';
                            break;
                        case 'date':
                        case 'daterange':
                        case 'datetime':
                        case 'datetimerange':
                        case 'year':
                        case 'month':
                            item.editorInnerComponent = 'editableTableDateType';
                            item.component = 'editableTableItemWrap';
                            break;
                        case 'time':
                        case 'timerange':
                            item.editorInnerComponent = 'editableTableTimeType';
                            item.component = 'editableTableItemWrap';
                            break;
                        case 'custom':
                            item.editorInnerComponent = item.component;
                            item.component = 'editableTableItemWrap';
                            break;
                        case 'number':
                            item.editorInnerComponent = 'editableTableNumberType';
                            item.component = 'editableTableItemWrap';
                            break;
                        default:
                            break;
                    }
                }

                this.options.conditions = this.options.conditions || {};

                if (item.key) {
                    Vue.set(this.options.conditions, item.key, this.options.conditions[item.key] || null);
                }

                if (this.options.validButtons) {
                    item.buttons = _.filter(item.buttons, it => _.includes(this.options.validButtons, it.id));
                }

                // 对原生组件中对key功能做扩展，支持子对象选择
                if (!item.render && item.key && item.key.indexOf('.') > 0) {
                    item.render = (h, data) => {
                        let Table_section_render_tooltip = table_section_render_tooltip;
                        let { row, column, index } = data;
                        let content = _.get(row, item.key);
                        if (column.dictList) {
                            let obj = _.find(column.dictList, it => {
                                return it.id === content;
                            });
                            content = obj ? obj.name : content;
                        }
                        if (column.tooltip) {
                            return <Table_section_render_tooltip content={content}></Table_section_render_tooltip>;
                        } else {
                            return <span>{content}</span>;
                        }
                    };
                }

                if (!item.render && item.dictList) {
                    item.render = (h, data) => {
                        let { row, column, index } = data;
                        let content = _.get(row, item.key);
                        let obj = _.find(column.dictList, it => {
                            return it.id === content;
                        });
                        content = obj ? obj.name : content;
                        return <span>{content}</span>;
                    };
                }

                // 操作按钮 支持属性（name onClick visibleExpression）
                /**
                     * {
                            name: '删除',
                            visibleExpression: 'row.tableName == "t_meta_entity"',
                            onClick: 'on-del'
                        }
                     */
                if (item.buttons && item.buttons.length > 0) {
                    item.render = (h, { row, index }) => {
                        let reg = /\.(png|jpg|gif|jpeg|webp)$/;
                        return (
                            <div>
                                {_.map(item.buttons, (it, btnIndex) => (
                                    <div
                                        onClick={self.wrapperFunc(
                                            self.buttonClick,
                                            self.getButtonDisabled(it, row, index),
                                            it.onClick,
                                            row,
                                            index,
                                            it
                                        )}
                                        v-show={self.buttonShow(it.visibleExpression || it.visible, row)}
                                        >
                                        {it.showTip && it.icon && <el-tooltip effect="dark" 
                                                content={it.name} 
                                                placement={it.placement || 'bottom'}
                                                
                                                >
                                                {reg.test(it.icon) && <img src={it.icon} class={it.class}/>}
                                                {!reg.test(it.icon) && <i class={btn.icon + btn.class}></i>}
                                                </el-tooltip>}
                                        {!it.showTip && <el-link el-link
                                            type={it.type || 'default'}
                                            size={it.size || 'mini'}
                                            underline={it.underline || false}
                                            icon={it.icon || null}
                                            disabled={self.getButtonDisabled(it, row, index)}
                                            >
                                            {it.name}
                                            </el-link>
                                        }
                                        {btnIndex < item.buttons.length - 1 &&
                                            self.buttonShow(
                                                item.buttons[btnIndex + 1].visibleExpression ||
                                                    item.buttons[btnIndex + 1].visible,
                                                row
                                            ) && <el-divider direction="vertical"></el-divider>}
                                    </div>
                                ))}
                            </div>
                        );
                    };
                }

                if (item.renderExpression) {
                    item.render = (h, { row }) => {
                        return <span>{eval('(function(){' + item.renderExpression + '}())')}</span>;
                    };
                }

                if (item.renderHeaderExpression) {
                    item.renderHeader = (h, { row }) => {
                        return <span>{eval('(function(){' + item.renderHeaderExpression + '}())')}</span>;
                    };
                }

                let tplItemRender = item.render;

                if (tplItemRender) {
                    item.render = (h, data) => {
                        return tplItemRender(h, data, this);
                    };
                }

                if (item.component) {
                    item.render = (h, data) => {
                        let Comp = Vue.component(item.component);
                        let mock = this.mock;
                        let self = this;
                        let row = {};
                        let index = null;
                        if (this.options.rowKey) {
                            let current = this.getCurrentRow(this.$refs.table.tableData, data.row);
                            row = current.row;
                            index = current.index;
                        } else {
                            row = this.$refs.table.tableData[data.index];
                            index = data.index;
                        }
                        return (
                            <Comp
                                ref={item.key + '' + data.index}
                                mock={mock}
                                onOn-change={(value, extend) => {
                                    console.log(self);
                                    self.editChange(data, item, value, extend);
                                }}
                                row={row}
                                column={item}
                                key={item.key + '' + data.index}
                                tableOptions={this.options}
                            ></Comp>
                        );
                    };
                }

                if (item.headerComponent) {
                    item.renderHeader = (h, { column, index }) => {
                        let Comp = Vue.component(item.headerComponent);
                        let self = this;
                        return (
                            <div>
                                <div class="table-search-txt">{column.label}</div>
                                <div class="table-search-wrap">
                                    <Comp
                                        v-model={self.options.conditions[column.key]}
                                        onOn-change={() => {
                                            self.conditionChange(column);
                                        }}
                                        column={column}
                                    ></Comp>
                                </div>
                            </div>
                        );
                    };
                }

                if (this.options.validColumns) {
                    let filter = _.filter(this.options.validColumns, el => {
                        return el === item.id;
                    });
                    if (filter && filter.length > 0) {
                        columns.push(item);
                    }
                } else {
                    columns.push(item);
                }

                if (item.children) {
                    item.chidren = this.initColumns(item.children);
                }
            });

            return columns;
        },

        editChange(data, item, value, extend) {
            let oldValue = data.row[item.key];
            let row = {};
            let index = null;
            if (this.options.rowKey) {
                let current = this.getCurrentRow(this.$refs.table.tableData, data.row);
                row = current.row;
                index = current.index;
            } else {
                row = this.$refs.table.tableData[data.index];
                index = data.index;
            }
            row[item.key] = value;
            this.restoreCheckedStatus(row, item.key, value);
            this.$emit('on-edit-change', {
                row: row,
                index: index,
                column: item,
                value: value,
                oldValue: oldValue,
                extend
            });
        },

        getCurrentRow(list, data) {
            let row = {};
            let rowKey = this.options.rowKey;
            let index = null;
            _.each(list, (it, i) => {
                if (row[rowKey]) {
                    return;
                }
                if (it[rowKey] === data[rowKey]) {
                    row = it;
                    index = i;
                } else {
                    if (it.children && it.children.length) {
                        let current = this.getCurrentRow(it.children, data);
                        row = current.row;
                        index = current.index;
                    }
                }
            });
            return {
                row: row,
                index: index
            };
        },

        /**
         * 恢复选中状态及修改同步选中对象里的值（保证通过getselected方法获取到是最新的值）
         * @param row
         * @param key
         * @param value
         */
        restoreCheckedStatus(row, key, value) {
            if (!this.options.selection) {
                return;
            }

            const selectedRow = this.getSelected();

            _.each(this.$refs.table.tableData, it => {
                let selected = _.find(selectedRow, it2 => it2.__uniqId === it.__uniqId);
                if (selected) {
                    it._checked = true;
                    if (it.__uniqId === row.__uniqId) {
                        selected[key] = value;
                    }
                } else {
                    it._checked = false;
                }
            });
        },
        rowClassName(row, index) {
            let res = '';
            if (this.options.rowClassName) {
                res = this.options.rowClassName(row, index);
            }

            if (row._isChecked) {
                res += ' ' + 'table-row-selected';
            }

            if (this.selectedRadioRow && this.selectedRadioRow._index === index) {
                res += ' ' + 'table-row-selected';
            }

            return res;
        },
        reload(params) {
            this.$refs.table.reload(params);
        },

        getSelected() {
            if (this.options.singleSelection) {
                return this.selectedRadioRow;
            } else {
                return this.$refs.table.getSelected();
            }
        },
        getDelSelected () {
             return this.$refs.table.getDelSelected();
        },
        assignment (localData) {
            this.$refs.table.assignment(localData);
        },
        initialization () {
            this.$refs.table.initialization()
        },
        afterAjax(res) {
            this.$emit('on-after-ajax', res);
        },

        innerChangePage(pageNumber) {
            if (this.options.singleSelection) {
                this.selectedRadioRow = null;
            }
            this.$emit('on-change-page', pageNumber);
        },

        pageSizeChange(pageSize) {
            this.options.pageSize = pageSize;
            this.options.pageNumber = 1;
            this.$emit('on-page-size-change', pageSize);
        },

        changePage(pageNumber) {
            this.options.pageNumber = pageNumber;
            this.$refs.table.changePage(pageNumber);
        },

        selectionChange(selection) {
            if (this.options.singleSelection) {
                this.selectedRadioRow = null;
            }
            this.$emit('on-selection-change', selection);
        },

        selectAll(selections) {
            this.$emit('on-select-all', selections);
        },

        select(selection, row) {
            this.$emit('on-select', selection, row);
        },

        cellMouseEnter(row, column, cell, event) {
            this.$emit('cell-mouse-enter', row, column, cell, event);
        },

        cellMouseLeave(row, column, cell, event) {
            this.$emit('cell-ouse-leave', row, column, cell, event);
        },

        cellClick(row, column, cell, event) {
            this.$emit('cell-click', row, column, cell, event);
        },

        cellDblclick(row, column, cell, event) {
            this.$emit('cell-dblclick', row, column, cell, event);
        },

        rowContextmenu(row, column, event) {
            this.$emit('row-contextmenu', row, column, event);
        },

        rowDblclick(row, column, event) {
            this.$emit('row-dblclick', row, column, event);
        },

        headerClick(column, event) {
            this.$emit('header-click', column, event);
        },

        headerContextmenu(column, event) {
            this.$emit('header-contextmenu', column, event);
        },

        filterChange(filters) {
            this.$emit('filter-change', filters);
        },

        currentChange(currentRow, oldCurrentRow) {
            this.$emit('current-change', currentRow, oldCurrentRow);
        },

        headerDragend(newWidth, oldWidth, column, event) {
            this.$emit('header-dragend', newWidth, oldWidth, column, event);
        },

        expandChange(row, expanded) {
            this.$emit('expand-change', row, expanded);
        },

        sortChange(column, prop, order) {
            this.$emit('on-sort-change', column, prop, order);
        },

        buttonClick(event, row, index, item) {
            row = this.$refs.table.tableData[index];
            this.$emit(event, row, index);
        },

        getButtonDisabled(item, row, index) {
            if (typeof item.disabled === 'function') {
                return item.disabled(row);
            } else {
                return item.disabled;
            }
        },

        buttonShow(visibleExpression, row) {
            let options = this.options;
            if (!visibleExpression) {
                return true;
            }

            if (typeof visibleExpression === 'function') {
                return visibleExpression(row);
            } else {
                return eval('(' + visibleExpression + ')');
            }
        },
        wrapperFunc(func, disabled, ...args) {
            return function() {
                if (disabled) {
                    return false;
                }
                func(...args);
            };
        },
        showCustomColumnModal() {
            this.$refs.table.showCustomColumnModal();
        },

        getOriginTable(flag) {
             this.$refs.table.getOriginTable(flag);
        },

        reloadFirstPage(params) {
            return this.$refs.table.reloadFirstPage(params);
        },

        getTableData() {
            return this.$refs.table.getTableData();
        },

        getCustomCellInstance(params) {
            return this.$refs.table.getCustomCellInstance(params.columnName, params.rowIndex, params.columnIndex);
        },

        rowClick(row, column, event) {
            this.$emit('on-row-click', row, column, event);
        },

        selectRadioRow(row, index) {
            this.selectedRadioRow = row;
            this.$emit('on-single-selection-change', {
                row,
                index
            });
        },
        delSelectedRadioRow () {
            this.$refs.table.delClearSelection()
        },
        conditionChange(column) {
            this.$emit('on-condition-change', {
                column: column,
                conditions: this.options.conditions
            });
        },

        validate() {
            let validateResult = [];
            let tableData = this.$refs.table.tableData;

            _.each(this.options.columns, (column, columnIndex) => {
                if (column.key) {
                    _.each(tableData, (row, rowIndex) => {
                        let formItem = this.getCustomCellInstance({
                            columnName: column.key,
                            rowIndex: rowIndex,
                            columnIndex:
                                this.options.selection || this.options.singleSelection ? columnIndex + 1 : columnIndex
                        });

                        if (formItem && formItem.errorMessage) {
                            validateResult.push({
                                columnKey: column.key,
                                rowIndex,
                                errorMessage: formItem.errorMessage
                            });
                        }
                    });
                }
            });

            return new Promise((resolve, reject) => {
                if (validateResult.length === 0) {
                    resolve();
                } else {
                    reject(validateResult);
                }
            });
        },

        validateRow(row) {
            let validateResult = [];
            let tableData = this.$refs.table.tableData;
            _.each(this.options.columns, column => {
                if (column.key) {
                    const rowIndex = _.findIndex(tableData, it => {
                        return it === row;
                    });
                    let formItem = this.getCustomCellInstance({
                        columnName: column.key,
                        rowIndex: rowIndex
                    });

                    if (formItem && formItem.errorMessage) {
                        validateResult.push({
                            columnKey: column.key,
                            rowIndex,
                            errorMessage: formItem.errorMessage
                        });
                    }
                }
            });

            return Promise.resolve(validateResult);
        },
        toggleErrorMessage(errorArrs){
            let validateResult = [];
            let tableData = this.$refs.table.tableData;
            _.each(this.options.columns, (column, columnIndex) => {
                if(column.key){
                    let errorCol = _.find(errorArrs, {
                        key: column.key
                    });
                    if(errorCol){
                        let formItem = this.getCustomCellInstance({
                            columnName: column.key,
                            rowIndex: errorCol.rowIndex,
                            columnIndex: columnIndex
                        });
                        formItem && formItem.toggleErrorMessage(errorCol);
                    }
                }
            });
        }
    }
};
</script>

<style lang="less">
.table-section {
    th {
        .cell {
            width: 100%;
        }

        div {
            display: block;
            line-height: normal;
        }
    }

    .table-search-wrap {
        width: calc(100% + 32px);
        margin-left: -16px;
        margin-bottom: 4px;
    }

    .table-search-txt {
        display: block;
        line-height: normal;
    }

    .el-table {
        overflow: visible;

        .editable-table-item {
            width: 100% !important;
        }
    }

    .el-divider__text,
    .el-link {
        font-size: 12px;
    }
}
</style>
