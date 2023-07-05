<template>
  <el-dialog
    title="归属上云网关信息"
    :visible="visible"
    width="1000px"
    custom-class="gd-custom-dialog"
    @close="dialogClose"
    v-dialogDrag
    :append-to-body="true"
    :close-on-click-modal="false"
  >
    <div>
      <div>
        <p style="display: inline-block">
          归属上云网关数：<span style="color: #1274EE;font-size: 16px">{{
            tableData.total
          }}</span>
        </p>
        <div style="float: right">
          <el-dropdown split-button type="primary">
            批量处理
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="deleteConnect(false)">
                <img
                  style="margin-right: 5px"
                  src="../../../assets/images/StreamMediaManage/icon-delete2.png"
                  alt=""
                />解绑
              </el-dropdown-item>
              <el-dropdown-item @click.native="openMedia"
                ><img
                  style="margin-right: 5px"
                  src="../../../assets/images/StreamMediaManage/icon-refresh.png"
                  alt=""
                />重新挂载流媒体</el-dropdown-item
              >
              <el-dialog
                class="reloadMedia"
                title="重新挂载流媒体"
                :visible.sync="choiceMediaFlag"
                :modal-append-to-body="false"
                width="350px"
                custom-class="gd-dialog"
                v-dialogDrag
                :append-to-body="true"
                :close-on-click-modal="false"
              >
                <choiceMedia
                  v-if="choiceMediaFlag"
                  ref="choiceMedia"
                ></choiceMedia>
              </el-dialog>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <el-table
        class="custom-cloud-table"
        :data="tableData.data"
        border
        @select="changeFun"
        @select-all="changeFun"
        style="width: 100%"
        >
        <el-table-column type="selection" align="center" width="55">
        </el-table-column>
        <el-table-column
          type="index"
          :index="indexMethod"
          label="序号"
          width="60"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="organizationName" label="管辖单位">
        </el-table-column>
        <el-table-column prop="transcodingName" label="名称"> </el-table-column>
        <el-table-column label="状态">
          <template>
            <p>正常</p>
          </template>
        </el-table-column>
        <el-table-column prop="vendorDesc" label="设备厂商"> </el-table-column>
        <el-table-column class="img-con" label="操作">
          <template class="" slot-scope="scope">
            <div class="img-con">
              <img
                src="../../../assets/images/StreamMediaManage/icon-disconnect.png"
                @click="deleteSingleId(scope.row.transcodingId)"
                alt=""
              />
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="table-pagination">
                <p class="total-pagination">共{{tableData.total}}条</p>
        <el-pagination
          background
          :page-sizes="[3, 5, 10]"
          :page-size="postData.pageSize"
          :current-page="postData.currPage"
          layout=" prev, pager, next, sizes, jumper "
          @size-change="changePageSize"
          @current-change="changeCurrentPage"
          :total="tableData.total"
        >
        </el-pagination>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { mapActions, mapState } from "vuex";
//import $http from '../../../filters/http';
//import api from '../../../api';
import choiceMedia from "../../controlPlatform/choiceMedia.vue";
export default {
  name: "InfoEle",
  props: {
    smId: {
      default() {
        return 0;
      },
    },
    visible: {
      default() {
        return false;
      },
    },
  },
  watch: {
    smId(val) {
      this.getInfoData(val);
    },
  },
  mounted() {
    this.downVendor();
  },
  components: {
    choiceMedia,
  },
  data() {
    return {
      multipleSelection: "",
      tableData: {},
      list: [],
      choiceMediaFlag: false,
      postData: {
        currPage: 1,
        pageSize: 10,
        streamId: "",
      },
      smData: {
        currPage: 1,
        pageSize: 10,
        smName: "",
        smType: "",
        vendor: "",
      },
      vendorData: [],
    };
  },
  computed: {
    ...mapState(["streamMedia", "transcoding"]),
  },
  methods: {
    ...mapActions([
      "getTranscodingList",
      "bindStreamMedia",
      "getStreamMediaList",
    ]),
    // 获取设备厂商
    async downVendor() {
      const { data: res } = await this.$http.get(
        "/base/code-masters/list?codeType=VENDOR"
      );
      this.vendorData = res.data;
    },
    getInfoData(id) {
      this.list = [];
      let that = this;
      if (id) {
        this.postData.streamId = id;
      }
      // this.getTranscodingList(this.postData);
      this.$api.getTranscodingList(this.postData).then((res) => {
        if (res.code == 200) {
          that.tableData = res;
          this.tableData.data = _.map(res.data, (it) => {
            let vendor = _.find(that.vendors, {
              codeValue: it.vendor,
            });
            it.vendorName = vendor ? vendor.codeName : "无";
            return it;
          });
        } else {
          this.$message.error(res.message);
        }
      });
    },
    indexMethod(index) {
      return index + 1 + this.postData.pageSize * (this.postData.currPage - 1);
    },
    changePageSize(page) {
      this.postData.pageSize = page;
      this.getInfoData();
    },
    changeCurrentPage(page) {
      this.postData.currPage = page;
      this.getInfoData();
    },
    cancel() {},
    submit() {},
    changeFun(selection) {
      this.list = [];
      console.log(selection);
      for (var i = 0; i < selection.length; i++) {
        this.list.push({
          transCodingId: selection[i].transcodingId,
          smId: this.smId,
          transcodingName: selection[i].transcodingName,
        });
      }
    },
    deleteSingleId(transcodeId) {
      this.list = [];
      this.list.push({ transCodingId: transcodeId, smId: this.smId });
      this.deleteConnect(true);
    },
    deleteConnect(flag) {
      let _this = this;
      //flag判断是否删除单个
      if (_this.list.length === 0) {
        _this.$message({
          message: "请选择条目",
          type: "warning",
        });
        return false;
      }
      _this
        .$confirm("是否确定解绑该上云网关?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          dangerouslyUseHTMLString: true,
          closeOnClickModal: false,
          customClass: "gd-confirm",
        })
        .then(() => {
          let transcodingIdList = [];
          let transcodingNames = [];
          _this.list.forEach((item) => {
            transcodingIdList.push(item.transCodingId);
            transcodingNames.push(item.transcodingName);
          });
          let params = {
            flag: 0,
            list: transcodingIdList,
            instructions: {
              module: "资源管理",
              page: "流媒体管理",
              feature: "解绑",
              description: "解绑流媒体" + transcodingNames.toString(),
            },
          };
          _this.bindStreamMedia(params).then((res) => {
            //var res=res.data;
            if (res.code === 200) {
              _this.getInfoData();
              _this.$parent.query();
              _this.$message({
                message: "解绑成功",
                type: "success",
              });
              if (flag) {
                _this.list = [];
              }
            } else {
              _this.$message.error(res.message);
            }
          });
        });

      /*this.$http.post("sm/transCoding/bind",{flag:1,list:this.list}).then((res)=>{
          //var res=res.data;
          if(res.code==200){
            this.$message({
              message: '解绑成功',
              type: 'success'
            });
            if(flag){
              this.list=[];
            }
          }else{
            this.$message.error(res.message);
          }
        })*/
    },

    reConnect(id) {
      let _this = this;
      console.log(id);
      //flag判断是否删除单个
      if (_this.list.length === 0) {
        return false;
      }
      for (var i = 0; i < _this.list.length; i++) {
        _this.list[i].smId = id;
      }
      let transcodingIdList = [];
      let transcodingNames = [];
      _this.list.forEach((item) => {
        transcodingIdList.push(item.transCodingId);
        transcodingNames.push(item.transcodingName);
      });
      let params = {
        flag: _this.list[0].smId,
        list: transcodingIdList,
        instructions: {
          module: "资源管理",
          page: "流媒体管理",
          feature: "重新挂载流媒体",
          description: "重新挂载流媒体" + transcodingNames.toString(),
        },
      };
      _this.bindStreamMedia(params).then((res) => {
        //var res=res.data;
        if (res.code === 200) {
          _this.choiceMediaFlag = false;
          _this.visible = false;
          _this.getInfoData();
          _this.$parent.query();
          _this.$message({
            message: "绑定成功",
            type: "success",
          });
          if (flag) {
            _this.list = [];
          }
        } else {
          _this.$message.error(res.message);
        }
      });
      /*this.$http.post("sm/transCoding/bind",{flag:0,list:this.list}).then((res)=>{
          //var res=res.data;
          if(res.code==200){
            this.$message({
              message: '绑定成功',
              type: 'success'
            });
            this.choiceMediaFlag=false;
          }else{
            this.$message.error(res.message);
          }
        })*/
    },
    openMedia() {
      var that = this;
      if (this.list.length == 0) {
        this.$message({
          message: "请选择条目",
          type: "warning",
        });
        return false;
      }
      this.choiceMediaFlag = true;
      setTimeout(() => {
        that.$refs.choiceMedia.getData();
        that.$refs.choiceMedia.parentPage = "InfoEle";
      }, 10);
    },
    dialogClose() {
      this.$emit("update:visible", false);
    },
  },
};
</script>

<style scoped>
.img-con img {
  vertical-align: middle;
  cursor: pointer;
}
.img-con img:not(:last-child) {
  margin-right: 10px;
}
.el-select,
.el-input {
  margin-right: 0;
  height: 40px;
}

</style>
