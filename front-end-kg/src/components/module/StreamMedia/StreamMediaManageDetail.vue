<template>
  <div class="content-wrapper">
    <div class="breadcrumb-wrapper">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/dashboard' }"
          ><i class="iconfont icondashboard"></i
        ></el-breadcrumb-item>
        <el-breadcrumb-item>设备管理</el-breadcrumb-item>
        <el-breadcrumb-item>流媒体管理</el-breadcrumb-item>
        <el-breadcrumb-item>流媒体详情</el-breadcrumb-item>
        <el-breadcrumb-item>{{ smData.smName }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="detail-head">
        <div class="head-left">
          <el-button type="primary" @click="back" style="vertical-align: middle"
            >返回</el-button
          >
          <p style="padding-left:20px;">{{ smData.smName }}</p>
        </div>
        <!-- <p class="head-right">创建时间：{{ smData.createDate }}</p> -->
      </div>
      <div class="detail-list">
        <p class="list-head">基础信息</p>
        <ul class="list-detail">
          <li>
            <span>设备厂商：</span>
            <!-- <span v-if="vendor">{{ vendor }}</span> -->
            <span v-if="smData.smVendorName">{{ smData.smVendorName }}</span>
            <span v-else class="gray-text">---</span>
          </li>
          <li>
            <span>推流上限：</span>
            <span v-if="smData.maxAccesses">{{ smData.maxAccesses }}</span>
            <span v-else class="gray-text">---</span>
          </li>
          <li>
            <span>已接入：</span>
            <span v-if="smData.channelNum">{{ smData.channelNum }}</span>
            <span v-else class="gray-text">---</span>
          </li>
          <li>
            <span>云账号：</span>
            <span v-if="smData.cloudName">{{ smData.cloudName }}</span>
            <span v-else class="gray-text">---</span>
          </li>
        </ul>
      </div>
      <div class="detail-list">
        <p class="list-head">推拉流信息</p>
        <ul class="list-detail">
          <li>
            <span>推流地址：</span>
            <span v-if="smData.smPushurl">{{ smData.smPushurl }}</span>
            <span v-else class="gray-text">---</span>
          </li>
          <li>
            <span>推流AppName：</span>
            <span v-if="smData.pullAppname">{{ smData.pullAppname }}</span>
            <span v-else class="gray-text">---</span>
          </li>
          <li>
            <span>拉流地址：</span>
            <span v-if="smData.smPullurl">{{ smData.smPullurl }}</span>
            <span v-else class="gray-text">---</span>
          </li>
          <li>
            <span>拉流AppName：</span>
            <span v-if="smData.pullAppname">{{ smData.pullAppname }}</span>
            <span v-else class="gray-text">---</span>
          </li>
          <li>
            <span>AppName：</span>
            <span v-if="smData.pushAppname">{{ smData.pushAppname }}</span>
            <span v-else class="gray-text">---</span>
          </li>
        </ul>
      </div>
      <div class="detail-list">
        <p class="list-head">推拉流鉴权密钥设置</p>
        <ul class="list-detail">
          <li>
            <span>推流鉴权密钥：</span>
            <span v-if="smData.pushAppkey">{{ smData.pushAppkey }}</span>
            <span v-else class="gray-text">---</span>
          </li>
          <li>
            <span>有效时长：</span>
            <span v-if="smData.pushExpires">{{ smData.pushExpires }}</span>
            <span v-else class="gray-text">---</span>
          </li>
          <li>
            <span>拉流鉴权密钥：</span>
            <span v-if="smData.pullAppkey">{{ smData.pullAppkey }}</span>
            <span v-else class="gray-text">---</span>
          </li>
          <li>
            <span>有效时长：</span>
            <span v-if="smData.pullExpires">{{ smData.pullExpires }}</span>
            <span v-else class="gray-text">---</span>
          </li>
        </ul>
      </div>
      <div class="detail-table">
        <p class="list-head">归属上云网管信息</p>
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
          <el-table-column prop="transcodingName" label="名称">
          </el-table-column>
          <el-table-column label="状态">
            <template>
              <div>正常</div>
            </template>
          </el-table-column>
          <el-table-column prop="vendorDesc" label="设备厂商">
          </el-table-column>
          <el-table-column class="img-con" label="操作">
            <template class="" slot-scope="scope">
              <div class="img-con">
                <el-tooltip class="item" effect="dark" content="解除绑定" placement="top-end">
                <img
                  src="../../../assets/images/StreamMediaManage/icon-disconnect.png"
                  @click="deleteSingleId(scope.row)"
                  alt=""
                />
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="详情" placement="top-end">
                <img
                  src="../../../assets/images/StreamMediaManage/icon-look.png"
                  alt=""
                  @click="toDetail(scope.row.transcodingId)"
                />
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="table-pagination">
                <p class="total-pagination">共{{tableData.total}}条</p>
          <el-pagination
            :hide-on-single-page="true"
            background
            :page-sizes="[3, 5, 10]"
            :page-size="3"
            layout="sizes, ->, prev, pager, next, jumper, ->, total, slot"
            @size-change="changePageSize"
            @current-change="changeCurrentPage"
            :total="tableData.total"
          >
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState } from "vuex";
import $http from "../../../filters/http";
import api from "../../../api";
import choiceMedia from "../../controlPlatform/choiceMedia.vue";
export default {
  name: "detail",
  props: {},
  mounted() {
    this.smId = this.$route.params.id;
    $http.get("/base/code-masters/list?codeType=VENDOR").then((res) => {
      var res = res.data;
      if (res.code == 200) {
        this.vendors = res.data;
      } else {
        this.$message.error(res.message);
      }
    });
    // this.$nextTick(() => {
    this.getDetail(this.smId);
    this.getInfoData(this.smId);
    // });
  },
  components: {
    choiceMedia,
  },
  data() {
    return {
      smId: "",
      smData: {},
      vendor: "",
      vendors: [],
      multipleSelection: "",
      tableData: {},
      list: [],
      choiceMediaFlag: false,
      postData: {
        currPage: 1,
        pageSize: 1000,
        streamId: "",
      },
    };
  },
  methods: {
    ...mapActions(["getTranscodingList", "bindStreamMedia"]),
    back() {
      this.$router.push("/streamMediaManage");
    },
    getDetail(id) {
      var that = this;
      $http.get("/device/streamMedias/" + id).then((res) => {
        var res = res.data;
        if (res.code == 200) {
          that.smData = res.data;
          for (var i = 0; i < that.vendors.length; i++) {
            if (that.vendors[i].codeValue == that.smData.smType) {
              that.vendor = that.vendors[i].codeName;
            }
          }
        } else {
          this.$message.error(res.message);
        }
      });
    },
    toDetail(tId) {
      this.$router.push({
        name: "摄像机管理",
        params: {
          id: this.$route.params.id,
          transcodingId: tId,
        },
      });
    },
    getInfoData(id) {
      this.list = [];
      var that = this;
      if (id) {
        this.postData.streamId = id;
      }
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
    deleteSingleId(row) {
      this.list = [];
      this.list.push({ transCodingId: row.transcodingId, smId: this.smId });
      this.deleteConnect(true);
    },
    deleteConnect(flag) {
      //flag判断是否删除单个
      if (this.list.length == 0) {
        this.$message({
          message: "请选择条目",
          type: "warning",
        });
        return false;
      }
      console.log(this.list);
      let transcodingIdList = [];
      let transcodingNames = [];
      this.list.forEach((item) => {
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
      this.bindStreamMedia(params).then((res) => {
        var res = res.data;
        if (res.code == 200) {
          this.$message({
            message: "解绑成功",
            type: "success",
          });
          this.getInfoData();
          if (flag) {
            this.list = [];
          }
        } else {
          this.$message.error(res.message);
        }
      });
    },
    reConnect(id) {
      //flag判断是否删除单个
      if (this.list.length === 0) {
        return false;
      }
      for (var i = 0; i < this.list.length; i++) {
        this.list[i].smId = id;
      }

      let transcodingIdList = [];
      let transcodingNames = [];
      this.list.forEach((item) => {
        transcodingIdList.push(item.transCodingId);
        transcodingNames.push(item.transcodingName);
      });
      let params = {
        flag: this.list[0].smId,
        list: transcodingIdList,
        instructions: {
          module: "资源管理",
          page: "流媒体管理",
          feature: "重新挂载流媒体",
          description: "重新挂载流媒体" + transcodingNames.toString(),
        },
      };
      this.bindStreamMedia(params).then((res) => {
        //var res=res.data;
        if (res.code === 200) {
          this.choiceMediaFlag = false;
          this.getInfoData();
          this.$message({
            message: "绑定成功",
            type: "success",
          });
          if (flag) {
            this.list = [];
          }
          // this.getInfoData();
        } else {
          this.$message.error(res.message);
        }
      });
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
        that.$refs.choiceMedia.parentPage = "detail";
      }, 10);
    },
  },
};
</script>

<style scoped>
.breadcrumb-wrapper {
  margin-bottom: 20px;
}
.img-con img {
  vertical-align: middle;
  cursor: pointer;
}
.img-con img:not(:last-child) {
  margin-right: 10px;
}
.container {
  padding: 0 0 20px;
  background: #fff;
  border-radius: 4px;
}
.detail-table .el-button {
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  background: #fff;
  border: 1px solid #dcdfe6;
  color: #606266;
  -webkit-appearance: none;
  text-align: center;
  box-sizing: border-box;
  outline: 0;
  margin: 0;
  transition: 0.1s;
  font-weight: 500;
  padding: 12px 20px;
  font-size: 14px;
  border-radius: 4px;
}
.detail-head {
  padding: 20px;
  border-bottom: 1px solid #d4d4d4;
}
.detail-list {
  padding: 20px;
  border-bottom: 1px dashed #d4d4d4;
}
.detail-head > *,
.head-left > * {
  display: inline-block;
}
.head-left button {
  margin-left: 10px;
}
.head-right {
  float: right;
}
.list-head {
  margin: 0;
  padding-left: 5px;
  border-left: 3px solid #1274ee;
  margin-bottom: 20px;
}
.list-detail {
  padding-left: 20px;
}
.list-detail li {
  display: inline-block;
  margin-right: 40px;
  font-size: 12px;
}
.gray-text,
.list-detail li span:first-child {
  color: #a9a9a9;
}
.detail-table {
  padding: 20px;
}
.table-pagination {
  padding: 20px;
}
</style>
