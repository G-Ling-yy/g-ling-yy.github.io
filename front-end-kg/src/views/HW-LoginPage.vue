<template>
  <div class="login-box">
    <!--内容展示区-->
    <div class="login-form">
      <div class="login-title"></div>
      <div class="login-wrapper">
        <div class="login-content">
          <div class="form-title" v-if="title === 'passwordLogin'">用户登录</div>
          <div class="form-title" v-if="title === 'phoneLogin'">手机登录</div>
          <div class="form-title" v-if="title === 'wechartLogin'">微信登录</div>
          <div class="form-title" v-if="title === 'humanLogin'">人脸识别</div>
          <el-form
            :model="loginInfo"
            :rules="rules2"
            ref="ruleForm"
            label-position="left"
            label-width="0px"
            v-if="title === 'passwordLogin'"
          >
            <el-form-item prop="account">
              <el-input
                type="text"
                v-model="loginInfo.account"
                auto-complete="off"
                placeholder="请输入用户名"
                minlength="1"
                maxlength="20"
              >
                <i slot="prefix" class="icon-username"></i>
              </el-input>
            </el-form-item>
            <el-form-item prop="checkPass">
              <el-input
                type="password"
                v-model="loginInfo.checkPass"
                auto-complete="off"
                placeholder="请输入登录密码"
                maxlength="20"
              >
                <i slot="prefix" class="icon-password"></i>
              </el-input>
            </el-form-item>
            <div class="login-pwd-check">
              <el-checkbox v-model="login.checked" checked class="remember">记住密码</el-checkbox>
              <el-button type="text">忘记密码?</el-button>
            </div>
            <el-form-item class="login-button">
              <el-button
                type="primary"
                style="width:100%;"
                @click.native.prevent="handleSubmit()"
                :loading="logining"
                class="btn-login"
              >登录</el-button>
            </el-form-item>
          </el-form>
          <el-form
            :model="phoneLoginInfo"
            :rules="rules2"
            ref="phoneRuleForm"
            label-position="left"
            label-width="0px"
            v-if="title === 'phoneLogin'"
          >
            <el-form-item prop="phone" style="margin-bottom: 2.6rem">
              <el-input
                type="text"
                v-model="phoneLoginInfo.phone"
                auto-complete="off"
                placeholder="请输入手机号码"
                minlength="1"
                maxlength="20"
              >
                <i slot="prefix" class="phone"></i>
              </el-input>
            </el-form-item>
            <el-form-item prop="identCode" style="margin-bottom: 2.6rem">
              <el-input
                type="text"
                v-model="phoneLoginInfo.identCode"
                auto-complete="off"
                placeholder="请输入验证码"
                maxlength="6"
                style="width:70%"
              >
                <i slot="prefix" class="ident"></i>
              </el-input>
              <a href="javascript:;" class="getIdent" @click="handIdentCode()" v-show="show">获取验证码</a>
              <span v-show="!show" class="getIdent">{{ count }} s</span>
            </el-form-item>
            <el-form-item class="login-button" style="margin-bottom: 2.6rem">
              <el-button
                type="primary"
                style="width:100%;"
                @click.native.prevent="phoneSubmit()"
                :loading="logining"
                class="btn-login"
              >登录</el-button>
            </el-form-item>
          </el-form>

          <div class="login-type-check">
            <div class="login-type-title">其它登录</div>
            <el-row :gutter="12">
              <el-col :span="6" :offset="3">
                <el-button circle v-if="title !== 'phoneLogin'" @click="phoneLogin()">
                  <i class="icon-phone"></i>
                </el-button>
                <el-button circle v-if="title !== 'passwordLogin'" @click="passwordLogin()">
                  <i class="icon-pwd"></i>
                </el-button>
              </el-col>
              <el-col :span="6">
                <el-button circle>
                  <i class="icon-wechat"></i>
                </el-button>
              </el-col>
              <el-col :span="6">
                <el-button circle>
                  <i class="icon-rlsb"></i>
                </el-button>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </div>
    <!--底部展示区-->
    <!--<div class="footer">公路视频云联网平台</div>-->
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";

export default {
  data() {
    var account = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("账号名不能为空"));
      } else {
        const reg = /^[\u4e00-\u9fa5_a-zA-Z0-9]{1,20}$/;
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error("账号名格式错误"));
        }
      }
    };

    var checkPass = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("密码不能为空"));
      } else {
        if (value.length < 6) {
          return callback(new Error("密码长度不能低于6位！"));
        }
        callback();
      }
    };
    var phone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("手机号不能为空"));
      } else {
        const reg = /^1[3456789]\d{9}$/;
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error("手机号格式错误！"));
        }
      }
    };
    var identCode = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("验证码不能为空"));
      } else {
        if (value.length < 6) {
          return callback(new Error("密码长度不能低于6位！"));
        }
        callback();
      }
    };
    return {
      show: true,
      count: "",
      timer: null,
      logining: false,
      loginInfo: {
        account: "",
        checkPass: ""
      },
      phoneLoginInfo: {
        phone: "",
        identCode: ""
      },
      rules2: {
        account: [{ required: true, validator: account, trigger: "blur" }],
        checkPass: [{ required: true, validator: checkPass, trigger: "blur" }],
        phone: [{ required: true, validator: phone, trigger: "blur" }],
        identCode: [{ required: true, validator: identCode, trigger: "blur" }]
      },
      title: "passwordLogin"
    };
  },

  computed: {
    ...mapState(["login"])
  },

  methods: {
    ...mapActions(["requestLogin", "getIdent", "phoneRequest"]),

    /**
     * 点击登录
     */
    handleSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (!valid) {
          return this.$message({
            message: "请核对登录信息",
            type: "error"
          });
        }
        // var loginParams = `username=${this.ruleForm.account}&password=${this.$md5(this.ruleForm.checkPass)}`;
        this.requestLogin(this.loginInfo);
      });
    },
    /**
     *手机登录和用户登录页面切换
     */
    phoneLogin() {
      this.title = "phoneLogin";
    },
    /**
     *手机登录
     */
    phoneSubmit() {
      this.$refs.phoneRuleForm.validate(valid => {
        if (!valid) {
          return this.$message({
            message: "请核对登录信息",
            type: "error"
          });
        }
        this.phoneRequest(this.phoneLoginInfo);
      });
    },
    /**
     *用户登录
     */
    passwordLogin() {
      this.title = "passwordLogin";
    },
    /**
     *获取验证码
     */
    handIdentCode() {
      this.getCode();
      this.getIdent(this.phoneLoginInfo.phone);
    },
    // 手机获取验证码
    getCode() {
      const TIME_COUNT = 60;
      if (!this.timer) {
        this.count = TIME_COUNT;
        this.show = false;
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= TIME_COUNT) {
            this.count--;
          } else {
            this.show = true;
            clearInterval(this.timer);
            this.timer = null;
          }
        }, 1000);
      }
    }
  },
  mounted() {
    if (JSON.parse(localStorage.getItem("PM_CK_LG"))) {
      this.loginInfo.account = JSON.parse(
        localStorage.getItem("PM_CK_LG")
      ).userName;
      this.loginInfo.checkPass = JSON.parse(
        localStorage.getItem("PM_CK_LG")
      ).userPass;
    }

    let _this = this;

    // 回车提交表单
    document.onkeydown = function(e) {
      // 兼容FF和IE和Opera
      var theEvent = window.event || e;
      var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
      if (code === 13) {
        _this.handleSubmit();
      }
    };
  }
};
</script>

<style lang="less">
.login-box {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #0b132f; /*@Darkblue;*/
  background-image: url("../assets/images/login/bg@2x.jpg");
  background-repeat: no-repeat;
  background-size: auto 100%;
  background-position: center;
  background-attachment: fixed;

  .login-form {
    position: absolute;
    /*box-sizing: border-box;*/
    top: 50%;
    /*right: 240px;*/
    right: 12.5%;
    margin: auto;
    width: 25%;
    /*margin-top:-260px;*/
    transform: translateY(-53%);
    /*padding:0 48px;*/

    .login-title {
      height: 47px;
      /*width:464px;*/
      margin: 0 auto 48px;
      background-image: url("../assets/images/login/title@2x.png");
      background-repeat: no-repeat;
      background-size: 100% auto;
      background-position: center;
    }

    .login-wrapper {
      width: 100%;
      padding-bottom: 110%; /*实现自适应正方形，撑开盒子高度*/
      /*height: 520px;*/
      background-image: url("../assets/images/login/inform@2x.png");
      background-repeat: no-repeat;
      background-size: 100%;
      background-position: top;
      position: relative;
    }

    .login-content {
      /*box-sizing: border-box;*/
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      padding: 10%;
      .form-title {
        font-size: 1.4rem;
        /*line-height: 30px;*/
        text-align: center;
        color: #fff;
        margin-bottom: 1.2rem;
      }
      .el-form {
        display: block;
        height: 64%;
        margin-bottom: 1.8rem;
        .phone-item {
          margin-bottom: 2.6rem !important;
        }
        .el-form-item {
          margin-bottom: 1.4rem;
          height: 22%;
          .phone {
            background-image: url("../assets/images/login/shouji@2x.png");
          }
          .ident {
            background-image: url("../assets/images/login/yanzhengma@2x.png");
          }

          &.login-button {
            width: 100%;
            margin: 0;

            .el-button {
              &.btn-login {
                border-radius: 6px;
                height: 100%;
                line-height: 100%;
                padding: 0;
                background-color: #1fafde;
                border: 0 none;
                transition: background-color 0.3s;
                > span {
                  color: #fff;
                  font-size: 1.4rem;
                  letter-spacing: 10px;
                }
                &:hover {
                  background-color: #20beee;
                }
                &:active {
                  /*background-color: #106c8a;*/
                  background-color: rgba(31, 175, 222, 0.6);
                  box-shadow: inset 0 0 8px 3px rgba(0, 0, 0, 0.3);
                  span {
                    color: #4ec3ff;
                  }
                }
              }
            }
          }

          .el-form-item__content {
            height: 100%;
            position: relative;
            line-height: inherit;
            .getIdent {
              position: absolute;
              right: 0px;
              color: rgba(0, 184, 255, 1);
              line-height: 60px;
            }
            .el-input {
              height: 100%;
              position: relative;
              .el-input__inner {
                border-radius: 4px;
                padding: 0 1.4rem 0 4.7rem;
                height: 100%;
                background: transparent;
                border: 2px solid rgba(0, 192, 255, 0.6);
                /*opacity:0.6;*/
                color: #fff;
                font-size: 20px;
                &:-internal-autofill-selected {
                  background: transparent !important;
                }
              }

              i {
                display: inline-block;
                height: 1.4rem;
                width: 1.2rem;
                position: absolute;
                top: 50%;
                left: 22px;
                transform: translateY(-50%);
                background-repeat: no-repeat;
                background-size: auto 100%;
                background-position: center;
                &.icon-username {
                  background-image: url("../assets/images/login/username@2x.png");
                }
                &.icon-password {
                  background-image: url("../assets/images/login/password@2x.png");
                }
                &.icon-username {
                  background-image: url("../assets/images/login/username@2x.png");
                }
              }
            }
            /*img{
                                position: absolute;
                                top: 0px;
                                bottom: 0px;
                                margin: auto;
                                right: 5%;
                                width: 8%;
                            }
                            .el-form-item__error{
                                !*padding-top: 10px;*!
                                padding-left: 20px;
                                color: #41ccf4;
                            }*/
          }
        }

        .login-pwd-check {
          padding-top: 4px;
          margin-bottom: 0.875rem;

          .el-checkbox {
            .el-checkbox__input {
              .el-checkbox__inner {
                width: 17px;
                height: 17px;
                background: transparent;
                border-color: #00b8ff;

                &::after {
                  height: 9px;
                  left: 5px;
                  border-color: #00b8ff;
                }
              }
            }
            .el-checkbox__label {
              font-size: 16px;
              color: #fff;
            }
          }
          .el-button {
            float: right;
            padding: 0;
            span {
              font-size: 16px;
              color: #fff;
            }
          }
        }
      }
      .login-type-check {
        text-align: center;

        .login-type-title {
          font-size: 18px;
          color: #fff;
          margin-bottom: 10px;
        }

        .el-button {
          padding: 0;
          background: transparent;
          border: 0 none;
          i {
            display: inline-block;
            height: 3rem;
            width: 3rem;
            /*position:absolute;
                            top:50%;
                            left:22px;
                            transform: translateY(-50%);*/
            background-repeat: no-repeat;
            background-size: 100% auto;
            background-position: center;
            &.icon-rlsb {
              background-image: url("../assets/images/login/rlsb@2x.png");
            }

            &.icon-phone {
              background-image: url("../assets/images/login/sj@2x.png");
            }
            &.icon-wechat {
              background-image: url("../assets/images/login/wx@2x.png");
            }
            &.icon-pwd {
              background-image: url("../assets/images/login/ym@2x.png");
            }
          }
        }
      }
    }
  }

  /*.footer{
            position: absolute;
            bottom: 61px;
            left: 50%;
            margin-left: -70px;
            color: @white;
            font-size: 14px;
        }*/
}
</style>
