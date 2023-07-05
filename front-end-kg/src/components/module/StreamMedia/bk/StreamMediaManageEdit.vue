<template>
  <div class="con">
    <el-form
      :model="addData"
      ref="addData"
      label-width="100px"
      class="demo-ruleForm"
    >
      <div class="form-con">
        <p class="head-title">基础信息</p>
        <el-form-item
          label="名称"
          prop="infoRequest.smName"
          :rules="[{ required: true, message: '名称不能为空' }]"
        >
          <el-input
            v-model="addData.infoRequest.smName"
            placeholder="请填写"
            style="width:300px;"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="厂商"
          prop="infoRequest.smType"
          :rules="[{ required: true, message: '厂商不能为空' }]"
        >
          <el-select
            v-model="addData.infoRequest.smType"
            placeholder="请选择"
            style="width:300px;"
          >
            <el-option
              v-for="item in vendors"
              :value-key="item.codeValue"
              :key="item.codeValue"
              :label="item.codeName"
              :value="item.codeValue"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="推流上限"
          prop="settingRequest.maxAccesses"
          :rules="[{ required: true, message: '推流上限不能为空' }]"
        >
          <el-input
            v-model="addData.settingRequest.maxAccesses"
            placeholder="请填写"
            style="width:300px;"
          ></el-input>
          路
        </el-form-item>
        <el-form-item
          label="备注"
          prop="infoRequest.smDesc"
          style="margin-bottom:0"
        >
          <el-input
            v-model="addData.infoRequest.smDesc"
            placeholder="请填写"
            style="width:300px;"
          ></el-input>
        </el-form-item>
      </div>
      <div class="form-con">
        <p class="head-title">推拉流信息</p>
        <div>
          <div class="flex">
            <div class="inline-block">
              <el-form-item
                label="推流地址"
                prop="settingRequest.smPushIp"
                style="margin-bottom:0"
              >
                <el-input
                  v-model="addData.settingRequest.smPushIp"
                  placeholder="请填写"
                ></el-input>
              </el-form-item>
            </div>
            <div class="inline-block">
              <el-form-item
                label="推流端口"
                prop="settingRequest.smPushPort"
                :rules="[{ required: true, message: '推流端口不能为空' }]"
                style="margin-bottom:0"
              >
                <el-input
                  v-model="addData.settingRequest.smPushPort"
                  placeholder="请填写"
                ></el-input>
              </el-form-item>
            </div>
          </div>
        </div>
        <div>
          <div class="flex">
            <div class="inline-block">
              <el-form-item
                label="拉流地址"
                prop="settingRequest.smPullIp"
                style="margin-bottom:0"
              >
                <el-input
                  v-model="addData.settingRequest.smPullIp"
                  placeholder="请填写"
                ></el-input>
              </el-form-item>
            </div>
            <div class="inline-block">
              <el-form-item
                label="拉流端口"
                prop="settingRequest.smPullPort"
                :rules="[{ required: true, message: '拉流端口不能为空' }]"
                style="margin-bottom:0"
              >
                <el-input
                  v-model="addData.settingRequest.smPullPort"
                  placeholder="请填写"
                ></el-input>
              </el-form-item>
            </div>
          </div>
        </div>
        <div class="flex">
          <div class="inline-block">
            <el-form-item
              label="AppName"
              prop="settingRequest.pushAppname"
              :rules="[{ required: true, message: 'AppName不能为空' }]"
              style="margin-bottom:0"
            >
              <el-input
                v-model="addData.settingRequest.pushAppname"
                placeholder="请填写"
              ></el-input>
            </el-form-item>
          </div>
        </div>
      </div>
      <div class="form-con">
        <p class="head-title">推拉流鉴权密钥设置</p>
        <div>
          <div class="flex">
            <div class="inline-block">
              <el-form-item
                label="推流鉴权密钥"
                prop="settingRequest.pushAppkey"
                style="margin-bottom:0;"
              >
                <el-input
                  v-model="addData.settingRequest.pushAppkey"
                  placeholder="请填写"
                ></el-input>
              </el-form-item>
            </div>
            <div class="inline-block">
              <el-form-item
                label="有效时长"
                prop="settingRequest.pushExpires"
                :rules="[{ required: true, message: '有效时长不能为空' }]"
                style="margin-bottom:0"
              >
                <el-input-number
                  v-model="addData.settingRequest.pushExpires"
                  controls-position="right"
                  :min="1"
                  :max="10"
                ></el-input-number>
                秒
              </el-form-item>
            </div>
          </div>
        </div>
        <div>
          <div class="flex">
            <div class="inline-block">
              <el-form-item
                label="拉流鉴权密钥"
                prop="settingRequest.pullAppkey"
                style="margin-bottom:0"
              >
                <el-input
                  v-model="addData.settingRequest.pullAppkey"
                  placeholder="请填写"
                ></el-input>
              </el-form-item>
            </div>
            <div class="inline-block">
              <el-form-item
                label="有效时长"
                prop="settingRequest.pullExpires"
                :rules="[{ required: true, message: '有效时长不能为空' }]"
                style="margin-bottom:0"
              >
                <el-input-number
                  v-model="addData.settingRequest.pullExpires"
                  controls-position="right"
                  :min="1"
                  :max="10"
                ></el-input-number>
                秒
              </el-form-item>
            </div>
          </div>
        </div>
      </div>
      <div class="btn-con">
        <button class="cancel" @click="cancel">取消</button>
        <button class="submit" @click="submit('addData')">保存</button>
      </div>
    </el-form>
  </div>
</template>

<script>
function findComponentUpward(context, componentName, componentNames) {
  if (typeof componentName === "string") {
    componentNames = [componentName];
  } else {
    componentNames = componentName;
  }

  let parent = context.$parent;
  let name = parent.$options.name;
  while (parent && (!name || componentNames.indexOf(name) < 0)) {
    parent = parent.$parent;
    if (parent) name = parent.$options.name;
  }
  return parent;
}
import { mapActions, mapState } from "vuex";
import $http from "../../../../filters/http";
import api from "../../../../api";
export default {
  name: "Edit",
  props: {
    smId: String
  },
  created() {
    $http.get("/base/code-masters/list?codeType=VENDOR").then(res => {
      var res = res.data;
      if (res.code == 200) {
        this.vendors = res.data;
      } else {
        this.$message.error(res.message);
      }
    });
  },
  data() {
    return {
      vendors: [],
      addData: {
        infoRequest: {
          isVirtual: "",
          smDesc: "",
          smMeta: "",
          smName: "",
          smType: ""
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
      }
    };
  },
  methods: {
    getEditData(id) {
      $http.get("/sm/detail/" + id).then(res => {
        var res = res.data;
        if (res.code == 200) {
          this.addData.smId = id;
          this.addData.infoRequest.smDesc = res.data.smDesc;
          this.addData.infoRequest.smName = res.data.smName;
          this.addData.infoRequest.smType = res.data.smType;
          this.addData.settingRequest.maxAccesses = res.data.maxAccesses;
          this.addData.settingRequest.pullAppkey = res.data.pullAppkey;
          this.addData.settingRequest.pullExpires = res.data.pullExpires;
          this.addData.settingRequest.pushAppkey = res.data.pushAppkey;
          this.addData.settingRequest.pushAppname = res.data.pushAppname;
          this.addData.settingRequest.pushExpires = res.data.pushExpires;
          this.addData.settingRequest.smPullIp = res.data.smPullIp;
          this.addData.settingRequest.smPullPort = res.data.smPullPort;
          this.addData.settingRequest.smPushIp = res.data.smPushIp;
          this.addData.settingRequest.smPushPort = res.data.smPushPort;
        } else {
          this.$message.error(res.message);
        }
      });
    },
    cancel() {
      findComponentUpward(this, "streamMedia").dialogTableVisibleEdit = false;
    },
    submit(formName) {
      var that = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addData.settingRequest.pullAppname = this.addData.settingRequest.pushAppname;
          $http.post("/sm/update", this.addData).then(res => {
            var res = res.data;
            if (res.code == 200) {
              this.$message({
                message: "保存成功",
                type: "success"
              });
              that.$refs[formName].resetFields();
              findComponentUpward(
                that,
                "streamMedia"
              ).dialogTableVisibleEdit = false;
              findComponentUpward(that, "streamMedia").getData();
            } else {
              this.$message.error(res.message);
            }
          });
        }
      });
    }
  }
};
</script>

<style scoped>
.con .form-con:first-child {
  padding-top: 0;
}
.el-dialog__wrapper .gd-dialog .el-dialog__body .el-form .el-form-item {
  margin-bottom: 10px;
}
.el-dialog__wrapper
  .gd-dialog
  .el-dialog__body
  .el-form
  .el-form-item
  .el-form-item__content
  .el-input
  .el-input__inner {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}
.con .form-con:not(:last-child) {
  border-bottom: 1px dashed #d4d4d4;
}
.con .form-con {
  padding: 20px 0;
}
.head-title {
  padding: 0 10px;
  border-left: 3px solid #1274ee;
}
.inline-block > * {
  display: inline-block;
}
.flex {
  display: flex;
  justify-content: space-between;
}
.img-con img {
  vertical-align: middle;
  cursor: pointer;
}
.img-con img:not(:last-child) {
  margin-right: 3px;
}
.inline-block .el-input {
  width: auto;
}
.left .el-input,
.left .el-input input {
  width: 300px;
  height: 40px;
}
.right .el-input,
.right .el-input input {
  width: 180px;
  height: 40px;
}
.left .common-title {
  width: 100px;
}
.right .common-title {
  width: 75px;
}
.red-tips {
  color: #ff1212;
}
.left,
.right {
  display: inline-block;
}
.left {
  margin-right: 20px;
}
.form-con > *:not(:last-child) {
  margin-bottom: 10px;
}
.btn-con {
  text-align: center;
  margin-top: 15px;
}
.btn-con button {
  width: 80px;
  height: 35px;
  line-height: 35px;
  display: inline-block;
  border-radius: 4px;
  cursor: pointer;
}
.btn-con .cancel {
  margin-right: 15px;
  border: 1px solid #92969b;
  color: #000;
}
.btn-con .submit {
  background: #1274ee;
  color: #fff;
  border: 1px solid #1274ee;
}
</style>
