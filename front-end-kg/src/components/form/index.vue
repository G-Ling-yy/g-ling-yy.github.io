<template>
<div class="formStyle">
    <c-el-form  
        v-if="visible"
        v-model="model"  
        ref="form"
        :item-width="options.itemWidth"
        :cols="options.cols || 1"
        :isViewMode="options.isViewMode"
        :groupNameClass="options.groupNameClass || ''"
        :label-position="options.labelPosition || 'right'"
        :label-width="options.labelWidth "
        :labelColon="options.labelColon"
        :fillType = "options.fillType"
        :type="options.type || 'plain'"
        :requiredWordType="options.requiredWordType"
        :parent="self"
        :height="options.height"
        :container="options.container"
        :offset="options.offset"
        :showChangeTip="options.showChangeTip"
        :groupNameVisible="options.groupNameVisible"
        :inline="options.inline"
        :label-suffix="options.labelSuffix"
        :hide-required-asterisk="options.hideRequiredAsterisk"
        :show-message="options.showMessage"
        :inline-message="options.inlineMessage"
        :status-icon="options.statusIcon"
        :validate-on-rule-change="options.validateOnRuleChange"
        :size="options.size"
        :disabled="options.isViewMode"
        :formItemList="options.formItemList"
        @on-change="change"
        @on-scroll-group-name-change="scrollGroupChange" 
        ></c-el-form>
</div>    
</template>
<script>
import cElForm from './cElForm';
export default {
    name: 'cForm',
    components: {cElForm},
    props: {
        options: {
            type: Object,
            default: () => {
                return {}
            }
        }
    },
    watch:{
        'options.model'(val, oldVal){
            if(val === oldVal){
                return
            }
            this.visible = false
            this.$nextTick(()=>{
                this.model = this.options.model
                this.visible = true
            })
        }
    },
    data(){
        return {
            visible:true,
            self:this,
            model: this.options.model || {}
        }
    },
    computed:{
        validFormItemList(){
            if(this.options.validList){
                let newList = []
                _.each(this.options.formItemList,(el)=>{
                    if(el && el.id){
                        let findId =  _.find(this.options.validList,(item)=>{
                            return item === el.id
                        })
                        if(findId){
                            newList.push(el)
                        }
                    }
                })
                return newList
            }else{
                return this.options.formItemList
            }
        }
    },
    methods:{
        getValue(){
            return this.model
        },

        change(t){
            this.$emit('change', t)
        },

        validate(options){
            return this.$refs.form.validate(options)
        },

        validateField(field){
            this.$refs.form.validateField(field)
        },

        resetFields(){
            this.$refs.form.resetFields()
        },

        goAnchor(groupName){
            this.$refs.form.goAnchor(groupName)
        },

        getFormItemInstance(name){
            return this.$refs.form.getFormItemInstance(name)
        },

        scrollGroupChange(groupName){
            this.$emit('on-scroll-group-name-change', groupName)
        },

        refreshVisibleStatus(){
            this.$refs.form.checkExpression()
        },

        getModel(){
            return this.$refs.form.getModel()
        }
    }
}
</script>
<style lang="less">
.formStyle{
    .el-form-item{
        display: flex;
    }
}
</style>