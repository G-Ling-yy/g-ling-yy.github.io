<template>
    <el-input-number
        v-model="model"
        @change="change"
        v-bind="dataProps"
        style="width:100%"
        size="mini"
    ></el-input-number>
</template>
<script>
export default {
    props: ['value', 'row', 'column', 'getConfig'],

    data: function() {
        return {
            model: this.value === undefined ? null : this.value
        };
    },
    computed: {
        dataProps() {
            const propsList = [
                'max',
                'min',
                'step',
                'size',
                'disabled',
                'placeholder',
                'formatter',
                'parser',
                'readonly',
                'editable',
                'precision',
                'activeChange'
            ];
            let obj = {};
            _.each(propsList, it => {
                obj[it] = this.getConfig(it);
            });
            return obj;
        }
    },

    watch: {
        value() {
            this.model = this.value;
        }
    },

    methods: {
        change() {
            this.$emit('on-change', this.model);
        },
        focused() {
            this.$el.querySelector('input').focus();
        },
        finished() {
            this.$emit('on-finished');
        }
    }
};
</script>
