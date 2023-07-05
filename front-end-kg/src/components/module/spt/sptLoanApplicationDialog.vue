<template>
  <el-dialog
    title="新增"
    :visible="visible"
    width="850px"
    @close="handleDialogClose"
    custom-class="gd-custom-dialog"
    v-dialogDrag
    :append-to-body="true"
    :close-on-click-modal="false"
  >
    <el-form
      :model="streamMediaData"
      ref="streamMediaDataForm"
      label-width="120px"
      class="stream-media-form"
    >
      <div class="form-con">
        <p class="head-title">新增</p>
        <el-form-item label="时间:" prop="regionCode">
          <el-date-picker
            v-model="formData.borrowTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
        </el-form-item>
        <el-form-item  label="原因:" prop="regionCode">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入内容"
            v-model="formData.applyReason"
          ></el-input>
        </el-form-item>
        <el-form-item  label="视频清晰度:" prop="regionCode">
            <el-radio v-model="formData.videoType" label="0">标清</el-radio>
            <el-radio v-model="formData.videoType" label="1">高清</el-radio>
        </el-form-item>
        <el-form-item  label="上传附件:" prop="regionCode">
            <upload-file
              @after-upload-oss="afterUploadOss"
              ></upload-file>
        </el-form-item>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="submit()">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapState, mapActions } from "vuex";
import uploadFile from './uploadFile';
export default {
  name: "Add",
  components: {uploadFile},
  data() {
    return {
      searchInfo: {
        selectDate: "",
        textarea2:""
      },
      textarea2: "",
      radio: '1',
      streamMediaData: {},
      formData: {}
    };
  },
  props: {
    visible: {
      //type: Boolean,
      default() {
        return false;
      }
    },
    borrowId: {
      type: String
    },
  },
  computed: {
    ...mapState(["streamMedia"])
  },

  mounted() {},
  methods: {
    ...mapActions([
      "getCodemaster",
      "addStreamMedia",
      "updateStreamMedia",
      "getStreamMediaInfo"
    ]),
    handleDialogClose() {
      // 关闭后还原data数据
      //Object.assign(this.$data, this.$options.data());
      this.$emit("update:visible", false);
      this.streamMediaData = {
        smId: "",
        infoRequest: {
          isVirtual: "",
          smDesc: "",
          smMeta: "",
          smName: "",
          smType: "",
          secretId: ""
        },
        settingRequest: {
          maxAccesses: 0,
          pullAppkey: "",
          pullAppname: "",
          pullExpires: 0,
          pushAppkey: "",
          pushAppname: "",
          pushExpires: 0,
          smPullIp: "",
          smPullPort: 0,
          smPushIp: "",
          smPushPort: 0
        },
        smext: {
          model: "",
          vendor: ""
        }
      };
    },
    // 取消，关闭窗口
    cancel() {
      //findComponentUpward(this, "streamMedia").dialogTableVisible = false;
      this.$emit("update:visible", false);
    },
    submit() {
      if(this.formData.borrowTime){
        let time = this.formData.borrowTime;
        this.formData.borrowStartTime = time[0];
        this.formData.borrowEndTime = time[1];
      }
      let api = null;
      if(this.borrowId){
        api = this.$api.repeatBorrowApply({
          ...this.formData,
          borrowId: this.borrowId
        })
      }else {
        api = this.$api.addBorrowApply({
          ...this.formData
        })
      }
      api.then(res => {
        if(res.code === 200){
          this.visible = false;
          this.$emit('after-change-apply');
        }
      })
    },
    afterUploadOss(attachmentOssUrl){
      this.$set(this.formData, 'attachmentOssUrl', attachmentOssUrl);
    }
  }
};
</script>

<style lang="less" scoped>
/deep/.el-dialog__body {
  padding: 15px 20px 0 !important;
}
/deep/.el-dialog__footer {
  padding-top: 0 !important;
  padding-bottom: 30px !important;
}
.stream-media-form {
  .form-con {
    padding: 20px 0;
    &:first-child {
      padding-top: 0;
    }
    &:not(:last-child) {
      border-bottom: 1px dashed #d4d4d4;
    }

    .head-title {
      padding: 0 10px;
      border-left: 3px solid #1274ee;
    }

    .flex {
      display: flex;
      justify-content: space-between;
      margin-bottom: 15px;
      .common-title {
        width: 75px;
      }
      .inline-block {
        display: inline-block;
      }
      .left,
      .right {
        display: inline-block;
      }
      .left {
        margin-right: 20px;
        .el-input,
        .el-input input {
          width: 300px;
          height: 30px;
        }
      }
      .right {
        .el-input,
        .el-input input {
          width: 180px;
          height: 30px;
        }
        .common-title {
          width: 75px;
        }
      }
      .red-tips {
        color: #ff1212;
      }
    }
  }
}
</style>
