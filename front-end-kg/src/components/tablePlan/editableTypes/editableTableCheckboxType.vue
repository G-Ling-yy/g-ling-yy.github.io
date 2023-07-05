<template>
    <el-checkbox v-model="model" @change="change" size="mini" ref="checkbox">&nbsp;</el-checkbox>
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

    methods: {
        change() {
            this.$emit('on-change', this.model);
        }
    },

    destroyed() {}
};
</script>
