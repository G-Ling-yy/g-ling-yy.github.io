<template>
    <el-time-select
        v-model="model"
        v-bind="dataProps"
        size="mini"
        @change="change"
        style="width:100%;"
    ></el-time-select>
</template>
<script>
export default {
    props: ['value', 'row', 'column', 'getConfig'],

    data: function() {
        return {
            model: this.value
        };
    },

    watch: {
        value() {
            this.model = this.value;
        }
    },

    computed: {
        dataProps() {
            const propsList = [
                'type',
                'placeholder',
                'startPlaceholder',
                'endPlaceholder',
                'isRange',
                'arrowControl',
                'align',
                'popperClass',
                'pickerOptions',
                'rangeSeparator',
                'valueFormat',
                'defaultValue',
                'name',
                'clearable',
                'prefixIcon',
                'clearIcon',
                'size',
                'disabled',
                'readonly',
                'editable'
            ];
            let obj = {};
            _.each(propsList, it => {
                obj[it] = this.getConfig(it);
            });
            return obj;
        }
    },

    methods: {
        change() {
            this.$nextTick(() => {
                this.$emit('on-change', this.model);
            });
        },

        focused() {
            this.$children[0].$refs.reference.focus();
        },
        finished() {
            // clearable的时候需要nexttick下
            this.$nextTick(() => {
                this.$emit('on-finished');
            });
        }
    }
};
</script>
