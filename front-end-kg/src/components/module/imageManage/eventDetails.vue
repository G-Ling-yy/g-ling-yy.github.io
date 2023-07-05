<template>
<div>
    <el-dialog
      :title="dialogTitle"
      :visible="visible"
      width="850px"
      @close="handleDialogClose"
      custom-class="gd-custom-dialog"
      v-dialogDrag
      :append-to-body="true"
      :close-on-click-modal="true"
    >
      <div class="box">
          <h3>{{eventRowData.sjbt}}</h3>
          <span class="box-head">
            <i>来源:{{eventRowData.sjly}} </i>
            <i>更新时间：{{eventRowData.updateTime}}</i>
            <i>工单号：{{eventRowData.lwxxOid}}</i>
          </span>
          <div class="box-list">
            <p class="box-list-title">事件类型</p>
            <p class="box-list-main">{{eventRowData.typeName}}</p>
          </div>
          <div class="box-list">
            <p class="box-list-title">事件等级</p>
            <p class="box-list-main">{{eventRowData.sjdj}}</p>
          </div>
          <div class="box-list">
            <p class="box-list-title">管制状态</p>
            <p class="box-list-main">
              <span v-if="eventRowData.czzt == 0">
                  无管制
              </span>
              <span v-if="eventRowData.czzt == 1">
                  管制中
              </span>
            </p>
          </div>
          <div class="box-list">
            <p class="box-list-title">上报单位</p>
            <p class="box-list-main">{{eventRowData.tbdwName}}</p>
          </div>
          <div class="box-list">
            <p class="box-list-title">发现时间</p>
            <p class="box-list-main">{{eventRowData.sj}}</p>
          </div>
          <div class="box-list">
            <p class="box-list-title">所属区域</p>
            <p class="box-list-main">{{eventRowData.areaName}}</p>
          </div>
          <div class="box-list">
            <p class="box-list-title">所属路段</p>
            <p class="box-list-main">{{eventRowData.roadId}}</p>
          </div>
          <div class="box-list">
            <p class="box-list-title">管辖单位</p>
            <p class="box-list-main">{{eventRowData.tbdw}}</p>
          </div>
          <div class="box-list">
            <p class="box-list-title">发生时间</p>
            <p class="box-list-main">{{eventRowData.sj}}</p>
          </div>
          <div class="box-list">
            <p class="box-list-title">发生地点</p>
            <p class="box-list-main">{{eventRowData.sjdd}}</p>
          </div>
          <div class="box-list">
            <p class="box-list-title">经纬度</p>
            <p class="box-list-main">{{eventRowData.lon}}/{{eventRowData.lat}}</p>
          </div>
          <div class="box-list">
            <p class="box-list-title">事件描述</p>
            <p class="box-list-main">{{eventRowData.sjgk}}</p>
          </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  name: "details",
  data() {
    return {
      dialogTitle: "事件详情",
      eventRowData: null,
    };
  },
  props: {
    visible: {
      default() {
        return false;
      },
    },
  },
  
  computed: {
  },
  watch: {
    streamMetiaId(newVal) {
      if (!newVal) {
        return false;
      }
    },
  },
  mounted() {
  },
  methods: {
    handleDialogClose() {
      // 关闭后还原data数据
      this.$emit("update:visible", false);
    },
    eventDetails(val) {
      this.eventRowData = val
      console.log('jdhs',val)
    }
  },
};
</script>

<style lang="less" scoped>
  .box {
    width: 100%;
    padding: 10px;
    // background-color: pink;
    border: 1px solid #666;
      h3 {
        display: inline-block;
        margin: 0;
        font-weight: 400;
        font-size: 18px;
        width: 100%;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        padding: 10px 0; 
        // background-color: pink;
      }
      .box-head {
        i {
          display: inline-block;
          font-size: 12px;
          color: #333;
          font-style:normal;
          margin-right: 20px;
          margin-bottom: 10px;
        }
      }
      .box-list {
        width: 100%;
        margin-bottom: 10px;
          .box-list-title {
            display: inline-block;
            width: 9%;
            line-height: 32px;
            vertical-align: top;
            margin: 0;
            // text-align: right;
          }
          .box-list-main {
             display: inline-block;
             width: 90%;
             line-height: 32px;
             margin: 0;
          }
      }
  }
</style>
