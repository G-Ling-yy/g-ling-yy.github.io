<template>
<div class="spt-up-manage">
    <div class="spt-up-manage-title">
        <span>部平台</span>
        <i class="el-icon-edit"></i>
    </div>
    <div class="spt-up-manage-form">
        <c-form :options="manageForm"></c-form>
    </div>
</div>    
</template>
<script>
import cForm from '../../form';
export default {
    components: {cForm},
    data(){
        return {
            manageForm: {
                cols: 3,
                model: {},
                formItemList: [{
                    label: '用户名',
                    name: 'name',
                    type: 'input'
                },
                {
                    label: '密码',
                    name: 'pwd',
                    type: 'input',
                    showPassword: true
                }]
            }
        }
    }
}
</script>
<style lang="less">

</style>