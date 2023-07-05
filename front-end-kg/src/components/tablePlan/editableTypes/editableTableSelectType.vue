<template>
    <el-select 
        v-model="model" 
        style="width:100%" 
        size="mini" 
        v-bind="dataProps" 
        @change="change">
        <el-option
            v-for="item in getConfig('optionsList')"
            :value="item.value"
            :key="item.value"
            :label="item.label"
        ></el-option>
    </el-select>
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
            const propsList = ['filterable', 'clearable', 'placeholder', 'optionsList', 'disabled', 'multiple'];
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
            this.$el.querySelector('input').click();
        },
        finished() {
            this.$emit('on-finished');
        }
    }
};
</script>
