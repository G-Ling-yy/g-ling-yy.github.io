<template>
    <lit-section
        :mock="mock"
        :section-url="remoteSelectUrl"
        :lit-options="selectOptions"
        :lit-events="selectEvents"
        @on-component-ready="componentReady"
    />
</template>
<script>
export default {
    props: ['value', 'row', 'column', 'getConfig'],

    created() {
        this.$watch(
            () => {
                return this.row[this.column.key];
            },
            () => {
                let config = this.getNewestInfo();

                this.selectOptions.value = config.value;
                this.selectOptions.labelInValue = config.labelInValue;
            }
        );
    },

    data: function() {
        let config = this.getNewestInfo();

        return {
            selectOptions: {
                labelInValue: config.labelInValue,
                value: config.value,
                placeholder: this.getConfig('placeholder'),
                remoteMethod: query => {
                    return this.column.remoteMethod(query, this.row);
                }
            },
            componentReadied: false,
            remoteSelectUrl:
                'https://rongzer-oss.oss-cn-hangzhou.aliyuncs.com/fe-components/comp_c1d6f6d6c8b84e29919ec6617f1cbd56/__comp_48860ea190854b548a45ac305ee190e7/cd21ffd4-0289-4140-92c6-eeb3055997f9.js',
            selectEvents: {
                'on-change': (value, extend) => {
                    this.$emit(
                        'on-change',
                        typeof value === 'object' ? { value: value.value, valueDisplay: value.label } : value,
                        extend
                    );
                    this.finished();
                }
            }
        };
    },

    computed: {
        dataProps() {
            const propsList = ['placeholder'];
            let obj = {};
            _.each(propsList, it => {
                obj[it] = this.getConfig(it);
            });
            return obj;
        }
    },

    methods: {
        getNewestInfo() {
            let value, valueDisplay;
            if (typeof this.row[this.column.key] === 'object') {
                value = this.row[this.column.key].value;
                valueDisplay = this.row[this.column.key].valueDisplay;
            } else {
                value = this.row[this.column.key];
                valueDisplay = undefined;
            }

            let labelInValue = false;

            if (valueDisplay) {
                labelInValue = true;
                value = { id: value, name: valueDisplay };
            } else {
                value = value || '';
            }

            return { labelInValue: true, value };
        },
        focused() {
            let inter = setInterval(() => {
                if (this.componentReadied) {
                    this.$el.querySelector('.ivu-select-input').focus();
                }
                clearInterval(inter);
            }, 100);
        },
        componentReady() {
            this.componentReadied = true;
        },
        finished() {
            this.$emit('on-finished');
        }
    }
};
</script>
