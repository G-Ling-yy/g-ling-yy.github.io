<template>
    <div class="tree-select-wrap">
        <tree-body
            @input="change"
            v-model="data"
            :multiple="item.multiple"
            :options="item.optionsList"
            :placeholder="item.placeholder"
            :clearable="item.clearable"
            :disabled="disabled"
        >
        </tree-body>
    </div>
</template>

<script>
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
import TreeBody from '@riophae/vue-treeselect';
export default {
    components: {
        TreeBody
    },
    name: 'TreeSelect',
    props: {
        item: {
            type: Object,
            default: () => {}
        },
        disabled: Boolean(),
        value: {
            type: String
        }
    },
    data() {
        return {
            data: this.value
        };
    },
    watch: {
        value: {
            handler() {
                this.data = this.value;
            },
            immediate: true
        }
    },
    methods: {
        change(e) {
            this.$emit('change', this.data);
            this.$emit('input', this.data);
        }
    }
};
</script>

<style>
.vue-treeselect__control {
    height: 30px;
}
</style>
