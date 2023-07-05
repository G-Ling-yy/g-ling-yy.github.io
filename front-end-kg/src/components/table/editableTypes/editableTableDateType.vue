<template>
    <el-date-picker
        v-model="model"
        v-bind="dataProps"
        transfer
        @change="change"
        size="mini"
        style="width:100%;"
    ></el-date-picker>
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
                'format',
                'align',
                'popperClass',
                'pickerOptions',
                'rangeSeparator',
                'defaultValue',
                'defaultTime',
                'valueFormat',
                'name',
                'unlinkPanels',
                'prefixIcon',
                'clearIcon',
                'validateEvent',
                'clearable',
                'disabled',
                'editable',
                'separator',
                'readonly'
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
            this.$emit('on-change', this.model);
            this.finished();
        },
        focused() {
            this.$children[0].$refs.reference.focus();
        },
        finished() {
            this.$emit('on-finished');
        }
    }
};
</script>
