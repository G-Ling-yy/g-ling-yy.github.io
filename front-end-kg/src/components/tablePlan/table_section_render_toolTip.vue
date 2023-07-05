<template>
    <el-tooltip effect="dark" :content="content" :disabled="!showTooltip">
        <span
            ref="content"
            @mouseenter="handleTooltipIn"
            @mouseleave="handleTooltipOut"
            class="ivu-table-cell-tooltip-content"
            >{{ content }}</span
        >
    </el-tooltip>
</template>
<script>
export default {
    props: ['content'],
    data() {
        return {
            showTooltip: false
        };
    },

    methods: {
        handleTooltipIn() {
            const $content = this.$refs.content;
            this.showTooltip = $content.scrollWidth > $content.offsetWidth;
        },
        handleTooltipOut() {
            this.showTooltip = false;
        }
    }
};
</script>
