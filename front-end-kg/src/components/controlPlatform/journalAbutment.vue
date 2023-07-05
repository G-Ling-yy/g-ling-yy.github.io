<template>
    <div >
         <!-- 对接日志弹框 -->
    <el-dialog title="对接日志" 
        :visible.sync="dialogTableVisible" 
        v-dialogDrag
        :append-to-body="true"
        :close-on-click-modal="false"
        :before-close="dialogClose"
        >
      <el-table 
        :data="logTableData"
        max-height="500" 
        border>
         <el-table-column
            type="index"
            label="序号"
            align="center"
            width="60"
          ></el-table-column>
          <el-table-column 
            prop="gmtCreate" 
            label="时间" 
            width></el-table-column>
          <el-table-column 
            prop="operation" 
            label="对接描述" 
            width>
            <!-- <template slot-scope="scope">
              <div style="color:#ccc;font-size:12px">
                成功<span
                @click="toSuccessInfo(scope.row.smId)"
                style="cursor: pointer;color:blue;"
                >{{222}}</span>
                失败<span
                @click="toFailInfo(scope.row.smId)"
                style="cursor: pointer;color:red;"
                >{{123}}</span>
              </div>
            </template> -->
          </el-table-column>
        <el-table-column 
            prop="opiStatus" 
            label="对接状态" 
            width>
            <template slot-scope="scope">
                <div>
                <img
                    v-if="scope.row.opiStatus === 1"
                    src="../../assets/images/icon/success.png"
                    style="width: 20px;height: 20px"
                  />
                  <img
                    v-else
                    src="../../assets/images/icon/stop.png"
                    style="width: 20px;height: 20px"
                  />
                 
                </div>
            </template>
            </el-table-column>
          <el-table-column 
            prop="resBody" 
            label="错误原因" 
            width>
          </el-table-column>
      </el-table>
        <!--分页控件-->
      <div class="table-pagination">
        <p class="total-pagination">共{{total}}条</p>
        <el-pagination
          background
          layout=" prev, pager, next, sizes, jumper "
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
          :current-page="currPage"
          :total="total"
        ></el-pagination>
      </div>
    </el-dialog>

    <!-- <el-dialog title="共128条数据" :visible.sync="dialogSuccess" v-dialogDrag
      :append-to-body="true"
      :close-on-click-modal="false">
      <el-table :data="logSuccessTableData" border>
         <el-table-column
            type="index"
            label="序号"
            align="center"
            width="60"
          ></el-table-column>
          <el-table-column prop="describe" label="错误描述" width>
          </el-table-column>
      </el-table>
    </el-dialog> -->
    <el-dialog 
        title="共123条数据" 
        :visible.sync="dialogDetail" 
        v-dialogDrag
        :append-to-body="true"
        :close-on-click-modal="false">
      <el-table 
        :data="logDetailTableData" 
        border>
         <el-table-column
            type="index"
            label="序号"
            align="center"
            width="60"
          ></el-table-column>
          <el-table-column prop="describe" label="错误描述" width>
          </el-table-column>
      </el-table>
    </el-dialog>
    </div>
</template>
<script>
export default {
     props: {
        // journalDataRow: {
        //     type: Object,
        //     default() {
        //     return {};
        //     }
        // },
        dialogTableVisible: {
            type: Boolean,
            default:false
        }
  },
    watch: {
        
    },
    data() {
        return {
            total: 0,
            currPage:1,
            pageSize: 10,
            type: 0,
            id: '',
            logTableData: [], // 对接日志表格数据
            dialogDetail:false, // 日志详情对话框
            logDetailTableData: [
               {
                describe: '阿萨大大'
                }, {
                describe: '十大大苏打撒旦'
                }
           ]  // 日志详情
        }
    },
    created () {
    },
    methods: {
        // 获取对接日志详情
        dockingLog (val, type) {
            // type: 1 上云网关对接日志 2 下级平台对接日志  3上级平台对接日志
            console.log('首次触发获取对接日志详情',val, type)
            this.type = type
            this.id = val
            if (type === 1) {
                this.getJournalLogList(val, type)
            } else if(type === 2) {
                this.getDownPlatformJournalList (val, type)
            } else if (type === 3) {
                this.getUpperPlatformJournalList(val, type)
            }
            
        },
        // 上云网关对接日志
        getJournalLogList (val, type) {
            let obj = {
                currPage:this.currPage,
                pageSize: this.pageSize,
                transcodingId: val.transcodingId //当前行transcodingId
             }
            this.$api
            .getJournalLogList(obj)
            .then(res => {
                console.log('获取对接日志详情接口值（网关）',res.data)
                this.logTableData = res.data
                this.total = res.total
                 if(this.logTableData.length) {
                    this.logTableData.forEach(item => {
                        if(item.opiStatus === 1) {
                            item.resBody = ''
                        }
                    })
                }
            })
        },
         // 下级平台对接日志
        getDownPlatformJournalList  (val, type) {
            let obj = {
                currPage:this.currPage,
                pageSize: this.pageSize,
                transcodingId: val.transcodingId //当前行transcodingId
             }
            this.$api
            .getDownPlatformJournalList (obj)
            .then(res => {
                console.log('获取对接日志详情接口值（下级平台）',res.data)
                this.logTableData = res.data
                this.total = res.total
                if(this.logTableData.length) {
                    this.logTableData.forEach(item => {
                        if(item.opiStatus === 1) {
                            item.resBody = ''
                        }
                    })
                }
                
            })
        },
         // 上级平台对接日志
        getUpperPlatformJournalList  (val, type) {
            let obj = {
                currPage:this.currPage,
                pageSize: this.pageSize,
                transcodingId: val.transcodingId //当前行transcodingId
             }
            this.$api
            .getUpperPlatformJournalList (obj)
            .then(res => {
                console.log('获取对接日志详情接口值（上级平台）',res.data)
                this.logTableData = res.data
                this.total = res.total
                if(this.logTableData.length) {
                    this.logTableData.forEach(item => {
                        if(item.opiStatus === 1) {
                            item.resBody = ''
                        }
                    })
                }
                
            })
        },
        // 成功详情
        toSuccessInfo (val) {
            this.dialogDetail = true;
        },
        // 失败详情
        toFailInfo (val) {
            this.dialogDetail = true;
        },
        // 关闭对话框的回调
        dialogClose () {
            this.currPage = 1,
            this.pageSize = 10,
            this.type = 0
            this.id = ''
            this.$emit('dialog-close', false)
        },
           /**
     * 分页导航
     * @param val
     */
    handlePageChange(val) {
        console.log('分页导航',val)
        this.currPage = val
        this.dockingLog(this.id, this.type)
    },

    /**
     * 分页导航 改变每页展示数量
     * @param index
     */
    handleSizeChange(index) {
      console.log('分页导航 改变每页展示数量',index)
        this.pageSize = index
        this.currPage = 1
        this.dockingLog(this.id, this.type)
        },
    }
}
</script>
<style lang="less" scoped>

</style>