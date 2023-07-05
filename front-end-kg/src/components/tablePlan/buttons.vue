<template>
    <div>
        <div v-if="btn.icon">
            <el-tooltip 
                effect="dark" 
                :content="btn.text" 
                :placement="defaultPlacement">
                <div 
                    class="table-buttons"
                    @click="click"
                    >
                    <img
                        v-if="isImage" 
                        :class="btn.class"
                        :src="btn.icon"/>
                    <i 
                        v-else
                        :class="btn.icon + btn.class"
                        ></i>
                </div>
            </el-tooltip>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        btn: {
            type: Object,
            default: () => {
                return {}
            }
        } 
    },
    computed: {
        isImage(){
            var reg = /\.(png|jpg|gif|jpeg|webp)$/;
            return reg.test(this.btn.icon);
        }
    },
    data(){
        return {
            defaultPlacement: this.btn.palcement ? this.btn.palcement : 'bottom'
        }
    },
    methods: {
        click(){
            this.$emit('on-click-opt', this.btn);
        }
    }
}
</script>
<style lang="less">

</style>