<template>
<div>
    <el-dialog
        title="信息确认"
        :visible.sync="showEdit"
        width="1065px"
        custom-class="gd-custom-dialog"
        v-dialogDrag
        :append-to-body="true"
        :close-on-click-modal="false"
        >
        <div style="{text-align: center;}">已入库：{{tip.success}}, 错误：{{data.length}}</div>
        <c-table 
            v-if="showEdit"
            ref="table" 
            :options="options"
            @on-table-mounted="tableMounted"
            ></c-table>
        <!-- <div>

        </div> -->
        <span slot="footer" class="dialog-footer">
            <el-button @click="showEdit = false">取 消</el-button>
            <el-button type="primary" @click="confirmData">确 定</el-button>
        </span>
    </el-dialog>
</div>    
</template>
<script>
import cTable from './table/table';
export default {
    components: { cTable },
    props: {
        data:{
            type: Array,
            default: []
        },
        columns: {
            type: Array,
            default: []
        },
        tip: {
            type: Object,
            default: () => {
               return {
                    success: 0
               }
            }
        }
    },
    watch: {
        'data'(){
            this.resetTableData();
        }
    },
    data(){
        return {
            options: {
                pageable: false,
                total: 1,
                localData: [],
                columns: this.columns,
                border: true,
                editingMode: true
            },
            showEdit: false,
            errorKeys: []
        }
    },
    methods: {
        tableMounted(){
            this.$nextTick(() => {
                this.$refs.table.toggleErrorMessage(this.errorKeys);
            });
            
        },
        showConfirmTable(flag){
            flag && this.resetTableData();
            this.$nextTick(() => {
                this.showEdit = flag;
            });
        },
        resetTableData(){
            this.options.localData = _.map(this.data, (it, i) => {
                let obj = _.cloneDeep(it);
                _.each(it, (v, k) => {
                    if(k.indexOf('Err') !== -1){
                        let key = k.split('Err');
                        this.errorKeys.push({
                            key: key[0],
                            message: v,
                            rowIndex: i
                        });
                        obj[key[0]+ '_readonly'] = false;
                    }else {
                        if(k.indexOf('_readonly') === -1){
                            obj[k+ '_readonly'] = true;
                        }
                    }
                });
                console.log(obj)
                return obj;
            });
        },
        confirmData(){
            let data = this.$refs.table.getTableData();
            this.$emit('confirm-data', data);
        }
    }    
}
</script>
<style lang="less">

</style>