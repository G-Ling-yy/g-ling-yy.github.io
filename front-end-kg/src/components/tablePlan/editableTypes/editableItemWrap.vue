<template>
    <div class="editable-table-item" :class="{ 'el-table-form-item__error': errorMessage }">
        <template v-if="!isReadOnly()">
            <div class="error" v-if="errorMessage">
                <el-tooltip effect="light" :content="errorMessage" popper-class="table-error-tip">
                    <component
                        v-if="editing || editingMode"
                        :is="column.editorInnerComponent"
                        @on-change="change"
                        v-model="value"
                        :column="column"
                        :row="row"
                        :getConfig="getConfig"
                        ref="formItem"
                    ></component>
                    <div
                        class="editing-readonly"
                        v-else
                        :class="{ 'editing-icon': column.editingIcon }"
                        @click="changeEditType"
                    >
                        <span class="value">{{ getReadOnlyValue() }}</span>
                        <span class="edit-btn" @click="doEdit" v-if="column.editingIcon">
                            <i class="el-icon-edit"></i>
                        </span>
                    </div>
                </el-tooltip>
            </div>
            <div class="editable-form-item" v-else>
                <component
                    v-if="editing || editingMode"
                    :is="column.editorInnerComponent"
                    @on-change="change"
                    v-model="value"
                    :column="column"
                    :row="row"
                    :getConfig="getConfig"
                    ref="formItem"
                ></component>
                <div
                    class="editing-readonly"
                    v-else
                    :class="{ 'editing-icon': column.editingIcon }"
                    @click="changeEditType"
                >
                    <span class="value">{{ getReadOnlyValue() }}</span>
                    <span class="edit-btn" @click="doEdit" v-if="column.editingIcon">
                        <i class="el-icon-edit"></i>
                    </span>
                </div>
            </div>
        </template>
        <template v-else>
            <div class="readonly-value">{{ getReadOnlyValue() }}</div>
        </template>
    </div>
</template>
<script>
import AsyncValidator from 'async-validator';
import Vue from 'vue';
let currentEditingItem = null;
document.addEventListener('click', event => {
    let node = event.target,
        editing = false;
    while (node !== document.body) {
        if (!node) {
            break;
        }
        if (node.className && node.className.indexOf && node.className.indexOf('ivu-select-dropdown') !== -1) {
            editing = true;
            break;
        }
        node = node.parentNode;
    }

    if (
        currentEditingItem &&
        document.body.contains(event.target) &&
        !currentEditingItem.$el.contains(event.target) &&
        !editing
    ) {
        currentEditingItem.editing = false;
    }
});
export default {
    props: ['row', 'column', 'tableOptions'],

    data: function() {
        return {
            errorMessage: '',
            value: this.row[this.column.key],
            editing: false
        };
    },

    created() {
        let arr = this.column.key.split('.');
        let res = this.row;
        _.each(arr, (it, index) => {
            if (index < arr.length - 1) {
                if (res[it] === undefined) {
                    Vue.set(res, it, {});
                }
                res = res[it];
            } else {
                Vue.set(res, it, res[it]);
            }
        });
        // this.$set(this.row, this.column.key, this.row[this.column.key]);
    },

    mounted() {
        if (!this.isReadOnly()) {
            this.validate();
        }
    },

    computed: {
        editableConfig() {
            return _.get(this.row, this.column.key + '_editableConfig') || {};
        },
        editingMode() {
            return this.tableOptions.editingMode;
        }
    },

    watch: {
        row: {
            handler(newVal) {
                // Vue.set(this.row, this.column.key, this.row[this.column.key])
                this.value = newVal[this.column.key];
                this.validate();
            },
            deep: true
        }
    },

    methods: {
        doEdit(event) {
            event.stopPropagation();
            if (currentEditingItem) {
                currentEditingItem.editing = false;
            }
            this.editing = true;
            currentEditingItem = this;
            this.$nextTick(() => {
                this.$refs.formItem && this.$refs.formItem.focused && this.$refs.formItem.focused();
            });
        },
        changeEditType(event) {
            this.doEdit(event);
        },
        getReadOnlyValue() {
            let readonlyRender = this.getConfig('readonlyRender');
            if (readonlyRender) {
                return readonlyRender({ row: this.row, column: this.column, value: this.value });
            } else {
                return this.value;
            }
        },
        finished() {
            this.editing = false;
        },
        isReadOnly() {
            return this.getConfig('readonly');
        },
        change(value, extend) {
            this.value = value;
            this.extend = extend;
            this.$emit('on-change', this.value, extend);
            this.validate();
        },

        validate() {
            let validatorRule = this.getConfig('validator');

            if (!validatorRule) {
                return;
            }
            const validator = new AsyncValidator({ [this.column.key]: validatorRule });

            let row = _.cloneDeep(this.row);

            validator.validate({ [this.column.key]: this.value }, row, errors => {
                _.each(errors, it => {
                    this.errorMessage = it.message;
                });

                if (!errors || errors.length === 0) {
                    this.errorMessage = '';
                }
            });
        },

        getConfig(key) {
            if (this.row[this.column.key + '_' + key] !== undefined) {
                return this.row[this.column.key + '_' + key];
            } else {
                return this.column[key];
            }
        },

        toggleErrorMessage(obj){
            this.errorMessage = obj.message;
        }
    }
};
</script>
<style lang="less">
.editable-table-item {
    padding: 1px;
    position: relative;
    height: 100%;
    display: flex;
    align-items: center;

    > div {
        width: 100%;
    }

    .editable-form-item {
        width: 100%;
        z-index: 1;
    }

    .error {
        width: calc(~'100% + 2px');
        height: calc(~'100% + 2px');
        margin-left: -2px;
        margin-top: 0px;
        top: -1px;
    }

    .editing-readonly {
        height: 28px;
        padding: 0 4px;
        display: inline-block;
        width: 100%;
        position: relative;
        &:hover {
            background: #e4e4e4;
        }
    }

    &.el-table-form-item__error .editing-readonly {
        border: 1px solid #ed4014 !important;
    }

    .edit-btn {
        position: absolute;
        right: 4px;
        cursor: pointer;

        &:hover {
        }
    }
}
</style>
<style>
.table-error-tip.el-tooltip__popper[x-placement^='bottom'] .popper__arrow,
.table-error-tip.el-tooltip__popper[x-placement^='bottom'] .popper__arrow::after {
    border-bottom-color: #ff9900 !important;
}
.table-error-tip.el-tooltip__popper[x-placement^='left'] .popper__arrow,
.table-error-tip.el-tooltip__popper[x-placement^='left'] .popper__arrow::after {
    border-left-color: #ff9900 !important;
}
.table-error-tip.el-tooltip__popper[x-placement^='right'] .popper__arrow,
.table-error-tip.el-tooltip__popper[x-placement^='right'] .popper__arrow::after {
    border-right-color: #ff9900 !important;
}
.table-error-tip.el-tooltip__popper[x-placement^='top'] .popper__arrow,
.table-error-tip.el-tooltip__popper[x-placement^='top'] .popper__arrow::after {
    border-top-color: #ff9900 !important;
}
.table-error-tip.el-tooltip__popper.is-light {
    border: #ff9900;
    background: #ff9900;
    color: #fff;
}
.el-table-form-item__error .el-input__inner {
    border: 1px solid #ed4014 !important;
}
</style>
