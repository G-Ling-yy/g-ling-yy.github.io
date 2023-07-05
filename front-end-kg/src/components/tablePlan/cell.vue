<template>
    <div>
        <template slot-scope="props">
            <template v-if="!item.render">
                <template v-if="item.formatter">
                    <span v-html="item.formatter(props.row, item)"></span>
                </template>
                <template v-else>
                    <span>{{ props.row[item.key] }}</span>
                </template>
            </template>
            <template v-else>
                <expand-dom
                    :column="item"
                    :row="props.row"
                    :rowIndex="props.$index"
                    :render="item.render"
                    :index="index"
                ></expand-dom>
            </template>
        </template>
    </div>
</template>

<script>
export default {
    name: 'cell',
    props: {
        item: {
            type: Object
        },
        index: {
            type: Number
        }
    },
    mounted() {
        // console.log(this.item)
    },
    components: {
        expandDom: {
            functional: true,
            props: {
                row: Object,
                render: Function,
                index: Number,
                column: {
                    type: Object,
                    default: null
                }
            },
            render: (h, ctx) => {
                const params = {
                    row: ctx.props.row,
                    index: ctx.data.attrs.rowIndex
                };
                if (ctx.props.column) {
                    params.column = ctx.props.column;
                }
                return ctx.props.render(h, params);
            }
        }
    }
};
</script>
