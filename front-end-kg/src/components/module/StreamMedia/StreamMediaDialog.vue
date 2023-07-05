<template>
  <el-dialog
    :title="dialogTitle"
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
        <p class="head-title">基础信息</p>
        <el-form-item
          label="名称"
          prop="infoRequest.smName"
          :rules="[{ required: true, message: '名称不能为空' }]"
        >
          <el-input
            v-model="streamMediaData.infoRequest.smName"
            placeholder="请填写"
            style="width: 300px"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="厂商"
          prop="infoRequest.smType"
          :rules="[{ required: true, message: '厂商不能为空' }]"
        >
          <el-select
            v-model="streamMediaData.infoRequest.smType"
            placeholder="请选择"
            style="width: 300px"
          >
            <el-option
              v-for="item in vendors"
              :value-key="item.codeValue"
              :key="item.codeValue"
              :label="item.codeName"
              :value="item.codeValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="推流上限"
          prop="settingRequest.maxAccesses"
          :rules="[
            { required: true, message: '推流上限不能为空' },
            {
              pattern: /^([1-9]\d*|[0]{1,1})$/,
              message: '请输入正确的推流上限',
            },
          ]"
        >
          <el-input
            v-model="streamMediaData.settingRequest.maxAccesses"
            placeholder="请填写"
            style="width: 300px"
          ></el-input
          >路
        </el-form-item>
        <!-- <el-form-item
          label="云账号"
          prop="infoRequest.secretId"
          :rules="[{ required: true, message: '云账号不能为空' }]"
        > -->
        <el-form-item label="云账号" prop="infoRequest.secretId">
          <el-select
            v-model="streamMediaData.infoRequest.secretId"
            placeholder="请选择"
            style="width: 300px"
          >
            <el-option
              v-for="item in cloudNum"
              :value-key="item.secretId"
              :key="item.secretId"
              :label="item.cloudName"
              :value="item.secretId"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item
          label="备注"
          prop="infoRequest.smDesc"
          style="margin-bottom:0"
        >
          <el-input
            v-model="streamMediaData.infoRequest.smDesc"
            placeholder="请填写"
            style="width:300px;"
          ></el-input>
        </el-form-item> -->
      </div>
      <div class="form-con">
        <p class="head-title">推拉流信息</p>
        <div class="flex">
          <div class="inline-block left">
            <el-form-item
              label="推流地址"
              prop="settingRequest.smPushIp"
              style="margin-bottom: 0"
              :rules="[{ required: true, message: '推流地址不能为空' }]"
            >
              <el-input
                v-model="streamMediaData.settingRequest.smPushIp"
                placeholder="请填写"
                style="width: 300px"
              >
                <!-- <template slot="prepend">
                  <el-select
                    v-model="pushhttpOption"
                    placeholder="请选择"
                    style="width: 90px;float: left;"
                  >
                    <el-option
                      v-for="item in httpOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select></template> -->
              </el-input>
            </el-form-item>
          </div>
          <div class="inline-block">
            <el-form-item
              label="推流AppName"
              prop="settingRequest.smPushPort"
              :rules="[{ required: true, message: '推流端口不能为空' }]"
              style="margin-bottom: 0"
            >
              <el-input
                v-model="streamMediaData.settingRequest.smPushPort"
                placeholder="请填写"
              ></el-input>
            </el-form-item>
          </div>
        </div>
        <div class="flex">
          <div class="inline-block left">
            <el-form-item
              label="拉流地址"
              prop="settingRequest.smPullIp"
              style="margin-bottom: 0"
              :rules="[{ required: true, message: '拉流地址不能为空' }]"
            >
              <el-input
                v-model="streamMediaData.settingRequest.smPullIp"
                placeholder="请填写"
              >
                <template slot="prepend">
                  <el-select
                    v-model="pullhttpOption"
                    placeholder="请选择"
                    style="width: 90px; float: left"
                  >
                    <el-option
                      v-for="item in httpOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </template>
              </el-input>
            </el-form-item>
          </div>
          <div class="inline-block">
            <el-form-item
              label="拉流AppName"
              prop="settingRequest.smPullPort"
              :rules="[{ required: true, message: '拉流端口不能为空' }]"
              style="margin-bottom: 0"
            >
              <el-input
                v-model="streamMediaData.settingRequest.smPullPort"
                placeholder="请填写"
              ></el-input>
            </el-form-item>
          </div>
        </div>

        <!-- 输出协议勾选 -->
        <div class="checkbox-wrap">
          <el-form-item
            label="输出协议"
            prop="playFormat"
            :rules="[
              {
                required: true,
                message: '请勾选输出协议',
              },
            ]"
          >
            <el-checkbox-group v-model="streamMediaData.playFormat">
              <el-checkbox
                v-for="agreement of [
                  {
                    key: 'WebRTC协议',
                    value: 'webRTC',
                  },
                  {
                    key: 'HLS协议',
                    value: 'hls',
                  },
                  {
                    key: 'RTMP协议',
                    value: 'rtmp',
                  },
                  {
                    key: 'FLV协议',
                    value: 'flv',
                  },
                  {
                    key: 'rtsp协议',
                    value: 'rtsp',
                  },
                ]"
                :key="agreement.key"
                :label="agreement.value"
                >{{ agreement.key }}</el-checkbox
              >
            </el-checkbox-group>
          </el-form-item>
        </div>
        <!-- <div class="flex">
          <div class="inline-block left">
            <el-form-item
              label="AppName"
              prop="settingRequest.pushAppname"
              :rules="[{ required: true, message: 'AppName不能为空' }]"
              style="margin-bottom:0"
            >
              <el-input
                v-model="streamMediaData.settingRequest.pushAppname"
                placeholder="请填写"
              ></el-input>
            </el-form-item>
          </div>
          <div class="inline-block"></div>
        </div> -->
      </div>
      <div class="form-con">
        <p class="head-title">推拉流鉴权密钥设置</p>
        <div class="flex">
          <div class="inline-block left">
            <el-form-item
              label="推流鉴权密钥"
              prop="settingRequest.pushAppkey"
              :rules="[{ required: true, message: '推流鉴权密钥不能为空' }]"
              style="margin-bottom: 0"
            >
              <el-input
                v-model="streamMediaData.settingRequest.pushAppkey"
                placeholder="请填写"
              ></el-input>
            </el-form-item>
          </div>
          <div class="inline-block">
            <el-form-item
              label="有效时长"
              prop="settingRequest.pushExpires"
              :rules="[{ required: true, message: '有效时长不能为空' }]"
              style="margin-bottom: 0"
            >
              <el-input-number
                v-model="streamMediaData.settingRequest.pushExpires"
                controls-position="right"
                :min="1"
                :max="86400"
              ></el-input-number
              >秒
            </el-form-item>
          </div>
        </div>
        <div class="flex">
          <div class="inline-block left">
            <el-form-item
              label="拉流鉴权密钥"
              prop="settingRequest.pullAppkey"
              :rules="[{ required: true, message: '拉流鉴权密钥不能为空' }]"
              style="margin-bottom: 0"
            >
              <el-input
                v-model="streamMediaData.settingRequest.pullAppkey"
                placeholder="请填写"
              ></el-input>
            </el-form-item>
          </div>
          <div class="inline-block">
            <el-form-item
              label="有效时长"
              prop="settingRequest.pullExpires"
              :rules="[{ required: true, message: '有效时长不能为空' }]"
              style="margin-bottom: 0"
            >
              <el-input-number
                v-model="streamMediaData.settingRequest.pullExpires"
                controls-position="right"
                :min="1"
                :max="86400"
              ></el-input-number
              >秒
            </el-form-item>
          </div>
        </div>
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
//import $http from "../../../filters/http";
//import api from "../../../api";
export default {
  name: "Add",
  data() {
    return {
      dialogTitle: "流媒体新增",
      vendors: [],
      cloudNum: [],
      pullhttpOption: "http://",
      pushhttpOption: "http://",
      httpOptions: [
        {
          value: "http://",
          label: "http://",
        },
        {
          value: "https://",
          label: "https://",
        },
      ],
      streamMediaData: {
        smId: "",
        infoRequest: {
          isVirtual: "",
          smDesc: "",
          smMeta: "",
          smName: "",
          smType: "",
          secretId: "",
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
          smPushPort: 0,
        },
        smext: {
          model: "",
          vendor: "",
        },
        playFormat: [], // 输出协议选值
      },
    };
  },
  props: {
    visible: {
      //type: Boolean,
      default() {
        return false;
      },
    },
    handleType: {
      //type: String,
      default() {
        return "add"; // edit
      },
    },
    streamMetiaId: {
      default() {
        return {};
      },
    },
  },
  computed: {
    ...mapState(["streamMedia"]),
  },
  watch: {
    streamMetiaId(newVal) {
      if (!newVal) {
        return false;
      }

      console.info("streamMetiaId ", newVal);
      this.getStreamMediaInfo(newVal).then((res) => {
        if (res.code === 200) {
          this.streamMediaData.smId = newVal;
           this.streamMediaData.playFormat =
            res.data.playFormat || []
          let pullIP = res.data.smPullurl;
          let pushIP = res.data.smPushurl;
          this.pullhttpOption = pullIP.split("//")[0] + "//";
          this.pushhttpOption = pushIP.split("//")[0] + "//";
          console.log(this.pullhttpOption);
          this.streamMediaData.infoRequest = {
            smName: res.data.smName,
            smType: res.data.smType,
            secretId: res.data.secretId,
          };
          this.streamMediaData.settingRequest = {
            maxAccesses: res.data.maxAccesses,
            pullAppkey: res.data.pullAppkey,
            pullExpires: res.data.pullExpires,

            pushAppkey: res.data.pushAppkey,
            pushAppname: res.data.pushAppname,
            pushExpires: res.data.pushExpires,

            smPullIp: pullIP.split("//")[1],
            smPullPort: res.data.pullAppname,
            smPushIp: pushIP,
            smPushPort: res.data.pushAppname,
          };
        }
      });
    },
  },
  updated() {
    // 更新form验证状态
    this.$nextTick(() => {
      //console.info('this.$refs.streamMediaDataForm',this.$refs);
      if (this.$refs.streamMediaDataForm)
        this.$refs.streamMediaDataForm.clearValidate();
    });
  },
  mounted() {
    // 流媒体厂商
    let params = {
      codeType: "SMTYPE",
    };
    this.getCodemaster(params).then((res) => {
      this.vendors = res.data;
    });
    //云账号
    this.$api.getCloudSecret().then((res) => {
      this.cloudNum = res.data;
    });
  },
  methods: {
    ...mapActions([
      "getCodemaster",
      "addStreamMedia",
      "updateStreamMedia",
      "getStreamMediaInfo",
    ]),
    handleDialogClose() {
      // 关闭后还原data数据
      //Object.assign(this.$data, this.$options.data());
      this.$emit("update:streamMetiaId", "");
      this.$emit("update:visible", false);
      this.streamMediaData = {
        smId: "",
        infoRequest: {
          isVirtual: "",
          smDesc: "",
          smMeta: "",
          smName: "",
          smType: "",
          secretId: "",
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
          smPushPort: 0,
        },
        playFormat:[],
        smext: {
          model: "",
          vendor: "",
        },
      };
    },
    // 取消，关闭窗口
    cancel() {
      //findComponentUpward(this, "streamMedia").dialogTableVisible = false;
      this.$emit("update:visible", false);
    },
    submit() {
      this.$refs.streamMediaDataForm.validate((valid) => {
        if (valid) {
          this.streamMediaData.settingRequest.pullAppname =
            this.streamMediaData.settingRequest.pushAppname;
          let submitFuncName = "addStreamMedia";
          let instructionsAdd = {
            module: "资源管理",
            page: "流媒体管理",
            feature: "新增",
            description:
              "新增流媒体 " + this.streamMediaData.infoRequest.smName,
          };
          if (!_.isEmpty(this.streamMetiaId)) {
            console.log(this.streamMediaData.smId);
            this.streamMediaData.smId = this.streamMetiaId;
            submitFuncName = "updateStreamMedia";
            instructionsAdd.feature = "修改";
            instructionsAdd.description =
              "修改流媒体 " + this.streamMediaData.infoRequest.smName;
          }
          let streamParams = {
            smId: this.streamMediaData.smId,
            maxAccesses: this.streamMediaData.settingRequest.maxAccesses,
            pullAppkey: this.streamMediaData.settingRequest.pullAppkey,
            pullAppname: this.streamMediaData.settingRequest.smPullPort,
            pullExpires: this.streamMediaData.settingRequest.pullExpires,
            pushAppkey: this.streamMediaData.settingRequest.pushAppkey,
            pushAppname: this.streamMediaData.settingRequest.smPushPort,
            pushExpires: this.streamMediaData.settingRequest.pushExpires,
            secretId: this.streamMediaData.infoRequest.secretId,
            smName: this.streamMediaData.infoRequest.smName,
            smPullurl:
              this.pullhttpOption +
              this.streamMediaData.settingRequest.smPullIp,
            smPushurl:
              // this.pushhttpOption +
              this.streamMediaData.settingRequest.smPushIp,
            smType: this.streamMediaData.infoRequest.smType,
            // 模块操作描述
            instructions: instructionsAdd,
            playFormat: this.streamMediaData.playFormat // 输出协议

          };
          this[submitFuncName](streamParams).then((res) => {
            if (res.code == 200) {
              this.$emit("update:visible", false);
              this.$emit("handleSubmitSucess");
              this.dialogTableVisible = false;
              this.$message.success("流媒体新增成功");
            }
          });
        }
      });
    },
  },
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
