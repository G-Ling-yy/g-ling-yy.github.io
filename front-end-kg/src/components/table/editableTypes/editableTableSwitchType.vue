<template>
    <el-switch
        v-model="model"
        @change="change"
        v-bind="dataProps"
        ref="switch"
        :active-value="column.activeValue"
        :inactive-value="column.inactiveValue"
    ></el-switch>
</template>
<script>
export default {
    props: ['value', 'row', 'column', 'getConfig'],

    data() {
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
                'disabled',
                'activeIconClass',
                'inactiveIconClass',
                'activeText',
                'inactiveText',
                'activeValue',
                'inactiveValue',
                'activeColor',
                'inactiveColor',
                'name',
                'validateEvent'
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
        finished() {
            this.$emit('on-finished');
        }
    },

    destroyed() {}
};
</script>
