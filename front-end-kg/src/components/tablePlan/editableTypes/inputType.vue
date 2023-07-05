<template>
    <el-input size="mini" v-model="model" @change="change" clearable v-bind="dataProps" ref="el-input " />
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
                'showWordLimit',
                'showPassword',
                'placeholder',
                'prefixIcon',
                'suffixIcon',
                'rows',
                'autosize',
                'autocomplete',
                'autoComplete',
                'name',
                'max',
                'min',
                'step',
                'resize',
                'autofocus',
                'form',
                'label',
                'tabindex',
                'validateEvent',
                'size',
                'disabled',
                'readonly',
                'maxlength',
                'minlength',
                'autosize',
                'clearable'
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
