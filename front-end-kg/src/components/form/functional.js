export default {
    name: 'functional',
    functional: true,
    props: {
        info: Object,
        render: Function,
    },
    render: (h, ctx) => {
        return ctx.props.render(h, ctx.props.info);
    }
};
