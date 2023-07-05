<template>
  <div class="content-wrapper spt-monitor-manage" ref="viewbox">
    <el-form :model="form" status-icon :rules="rules" ref="form">
        <el-form-item
          label="旧密码"
          :label-width="formLabelWidth"
          prop="oldPwd"
        >
          <el-input
            v-model="form.oldPwd"
            autocomplete="off"
            show-password
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item label="新密码" :label-width="formLabelWidth" prop="pwd">
          <el-input
            v-model="form.pwd"
            show-password
            type="password"
            @input="pwdchang"
          ></el-input>
        </el-form-item>
        <div class="input_span">
          <label style="margin-left: 40px;color: #9FB8DA;">强度</label>
          <span id="one"></span>
          <span id="two"></span>
          <span id="three"></span>
        </div>
        <div id="font">
          <span>弱</span>
          <span>中</span>
          <span>强</span>
        </div>
        <el-form-item
          label="确认密码"
          :label-width="formLabelWidth"
          prop="surePwd"
        >
          <el-input
            v-model="form.surePwd"
            autocomplete="off"
            show-password
            type="password"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="startChange('form')" style="float: right;margin:0 44% 5% 0;">确 定</el-button>
      </div>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
import api from "../../../api/index.js";
import Axios from "axios";

export default {
  name: "changPwd",
  data() {
      var _that = this;
    let errPwd = (rule, value, callback) => {
      try {
        if (this.errPwd) {
          callback(new Error("密码有误"));
        } else {
          callback();
        }
      } catch (e) {}
    };
    let oldPwd = (rule, value, callback) => {
      try {
        if (value === "") {
          callback(new Error("请输入旧密码"));
        }
        callback();
      } catch (e) {}
    };
    let validatePass = (rule, value, callback) => {
      // console.log(value,'put-val')
      // _that.pwdchang(value)
      try {
        if (value === "") {
          callback(new Error("请输入新密码"));
        } else if (value.length < 8) {
          callback(new Error("密码不能低于8位,密码由字母和数字组成"));
        } else {
          if (this.form.pwd !== "") {
            this.$refs.form.validateField("surePwd");
          }
          callback();
        }
      } catch (e) {}
    };
    let validatePass2 = (rule, value, callback) => {
      try {
        if (value === "") {
          callback(new Error("请再次输入新密码"));
        } else if (value !== this.form.pwd) {
          callback(new Error("两次输入密码不一致!"));
        } else {
          callback();
        }
      } catch (e) {}
    };
    return {
      pwd: "",
      msgText: "",
      mesgTotal: 0,
      currentPage: 1,
      pageSize: 4,
      systemName: "公路视频云联网",
      peopleNum: 20, //在线人数
      messageNum: 0,
      hasDeviceManage: true,
      logoUrl: "",
      platformName: "公路视频云联网",

      dialogFormVisible: false,
      form: { oldPwd: "", pwd: "", surePwd: "" },
      rules: {
        oldPwd: [{ validator: errPwd, trigger: "blur" }, { validator: oldPwd }],
        pwd: [{ validator: validatePass, trigger: "blur" }],
        surePwd: [{ validator: validatePass2, trigger: "blur" }],
      },
      formLabelWidth: "80px",
      errPwd: false,
      isFrist: true,
      routeName: "",
    };
  },
  computed: {
      ...mapState([
      "login",
      "userInfo",
      "message",
      "systemLogoUrl",
      // "systemName",
    ]),
  },
  created() {
      
  },
  mounted() {
      let uinfo = JSON.parse(localStorage.getItem("cloudplatform"));
    console.log(uinfo, "uinfo");
    this.isFrist = uinfo.isFrist;
    this.dialogFormVisible = this.isFrist;
  },
  methods: {
    ...mapActions(["logout"]),
      pwdchang(value) {
      console.log(value, this.form.pwd, "value");
    },
    checkStrong(sValue) {
      var modes = 0;
      //正则表达式验证符合要求的
      if (sValue.length < 1) return modes;
      if (/\d/.test(sValue)) modes++; //数字
      if (/[a-z]/.test(sValue)) modes++; //小写
      if (/[A-Z]/.test(sValue)) modes++; //大写
      if (/\W/.test(sValue)) modes++; //特殊字符

      //逻辑处理
      switch (modes) {
        case 1:
          return 1;
          break;
        case 2:
          return 2;
          break;
        case 3:
        case 4:
          return sValue.length < 4 ? 3 : 4;
          break;
      }
      return modes;
    },
    pwdchang(newname, oldname) {
      this.msgText = this.checkStrong(newname);
      if (this.msgText > 1 || this.msgText == 1) {
        document.getElementById("one").style.background = "red";
      } else {
        document.getElementById("one").style.background = "#eee";
      }
      if (this.msgText > 2 || this.msgText == 2) {
        document.getElementById("two").style.background = "orange";
      } else {
        document.getElementById("two").style.background = "#eee";
      }
      if (this.msgText == 4) {
        document.getElementById("three").style.background = "#00D1B2";
      } else {
        document.getElementById("three").style.background = "#eee";
      }
    },
      // 执行修改密码
    startChange(form) {
      this.$refs[form].validate((valid) => {
        if (valid || this.errPwd) {
          api
            .changePwd({
              isFrist: this.isFrist,
              password: this.form.pwd,
              oldPassword: this.form.oldPwd,
            })
            .then((res) => {
              this.errPwd = true;
              if (res.code === 5004) {
                // 密码错误
                this.$refs[form].validateField("oldPwd");
                this.errPwd = false;
              } else if (res.code === 400) {
                this.$message({ message: res.message, type: "warning" });
              } else {
                this.errPwd = false;
                this.dialogFormVisible = false;
                let cloudplatform = JSON.parse(
                  localStorage.getItem("cloudplatform")
                );
                console.log(this.cloudplatform,"cloudplatform")
                cloudplatform.isFrist = false;
                localStorage.setItem(
                  "cloudplatform",
                  JSON.stringify(cloudplatform)
                );
                this.$message({ message: "修改成功", type: "success" });
                this.logout();
              }
            });
        } else {
          return false;
        }
      });
    },
  }
};
</script>

<style lang="less" scoped>

.navbar-box {
  width: 100%;
  height: @NavHeight;
  position: relative;
  /* z-index: 1; */

  .logo {
    padding-left: 100px;
    font-weight: 700;
    font-size: 24px;
    line-height: 70px;
    letter-spacing: 2px;
    color: @white;
    position: relative;
    img {
      display: inline-block;
      height: 40px;
      position: absolute;
      left: 14px;
      top: 14px;
    }
  }

  .header-right {
    padding: 20px 0 0;
    line-height: 30px;
    text-align: center;
    display: flex;
    justify-content: flex-end;
    i.icon-button {
      color: #fff;
      font-size: 2rem;
      cursor: pointer;
      transition: all 0.4s;
      &:hover {
        color: #b4bccc;
      }
    }
    .el-dropdown {
      color: #fff;
      span {
        display: inline-block;
        line-height: 28px;
        position: relative;
        padding-left: 34px;
        cursor: pointer;
        i.iconfont {
          font-size: 2.4rem;
          position: absolute;
          left: 0;
        }
      }
      &:hover {
        color: #b4bccc;
      }
    }
  }
}
.popover_list {
  max-height: 350px;
  // overflow: scroll;
  .list_item {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    line-height: 30px;
    padding: 10px;
    border-bottom: 1px solid #e5e5e5;
    &:hover {
      background-color: #ecf5ff;
      cursor: pointer;
    }
    .el-icon-arrow-right:before {
      margin-right: 10px;
    }
    .shade {
      position: absolute;
      display: inline-block;
      width: 26px;
      height: 26px;
      border-radius: 13px;
      background-color: rgba(160, 160, 160, 0.5);
    }
    .item_icon_d {
      display: inline-block;
      width: 26px;
      height: 26px;
      border-radius: 13px;
      color: #fff;
      text-align: center;
    }
    .item_icon_w {
      display: inline-block;
      width: 26px;
      height: 26px;
      border-radius: 13px;
      color: #fff;
      text-align: center;
      background-color: purple;
    }
    .item_icon_y {
      display: inline-block;
      width: 26px;
      height: 26px;
      border-radius: 13px;
      color: #fff;
      text-align: center;
      background-color: red;
    }

    .item_content {
      display: flex;
      flex-direction: column;
      em {
        height: 20px;
        font-size: 12px;
        font-family: Arial;
        font-weight: 400;
        font-style: normal;
        color: rgba(176, 176, 176, 1);
      }
      span {
        line-height: 20px;
        font-size: 14px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        color: rgba(0, 0, 0, 1);
      }
      .goClick {
        // background-color: #ccc;
        color: rgba(176, 176, 176, 1);
      }
    }
  }
}
#inputValue {
  width: 240px;
  margin-left: 20px;
  padding-left: 10px;
  border-radius: 3px;
}
.input_span span {
  display: inline-block;
  width: 85px;
  height: 10px;
  background: #eee;
  line-height: 20px;
}

#one {
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  border-right: 0px solid;
  margin-left: 20px;
  margin-right: 3px;
}

#two {
  border-left: 0px solid;
  border-right: 0px solid;
  margin-left: -5px;
  margin-right: 3px;
}

#three {
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  border-left: 0px solid;
  margin-left: -5px;
}
#font span:nth-child(1) {
  color: red;
  margin-left: 80px;
}
#font span:nth-child(2) {
  color: orange;
  margin: 0 60px;
}
#font span:nth-child(3) {
  color: #00d1b2;
}
</style>
