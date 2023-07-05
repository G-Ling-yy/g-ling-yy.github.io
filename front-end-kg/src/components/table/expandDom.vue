<script>
export default {
    name: 'expandDom',
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
};
</script>
