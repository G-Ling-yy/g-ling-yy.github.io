<template>
<div class="copy-data">
    <div class="copy-data-con" v-if="isViewMode">
        <el-tooltip :content="value">
            <div class="copy-data-text">{{value}}</div>
        </el-tooltip>
        <a @click="copy">复制</a>
    </div>
</div>    
</template>
<script>
import store from '../../store';
export default {
    props: ['config', 'isViewMode', 'value'],
    methods: {
        copy(){
            var textBox = document.createElement('input');
            textBox.value = this.value;
            document.body.appendChild(textBox);
            textBox.select();                             // 选择对象
            document.execCommand("Copy");                 // 执行浏览器复制命令
            textBox.className = 'textBox';
            textBox.style.display='none';
        }
    }
}
</script>
<style lang="less">
.copy-data-con {
    width: calc(100% - 52px);
    display: flex;
    .copy-data-text {
        width: calc(100% - 36px);
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
    a {
        color: #1274ee;
    }
}

</style>