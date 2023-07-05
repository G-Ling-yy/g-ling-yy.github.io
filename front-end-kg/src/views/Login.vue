<template>
  <div class="login-box">
    <!--内容展示区-->
    <div class="login-form">
      <div
        :class="
          `${BASETargetIsNbtd ? 'is-nbtd' : ''} login-title`
        "
        style="text-align: center;-"
      >
        <!-- {{ BASETargetIsNbtd ? '视频中台3.3' : '' }} -->
        高网中心视频平台
      </div>
      <div class="login-wrapper">
        <div class="login-content">
          <div class="form-title">用户登录</div>
          <el-form
            :model="loginInfo"
            :rules="rules2"
            ref="ruleForm"
            label-position="left"
            label-width="0px"
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
            <div class="imgCodeInfo">
              <el-input
                type="imgCode"
                v-model="loginInfo.imgCode"
                placeholder="请输入验证码"
              >
              </el-input>
              <img
                @click="imgBaseBtn"
                :src="'data:image/jpg;base64,' + imgBase"
              />
            </div>
            <div class="login-pwd-check">
              <el-checkbox
                v-model="login.checked"
                checked
                class="remember"
                >记住密码</el-checkbox
              >
              <!-- <el-button type="text">忘记密码?</el-button> -->
            </div>
            <el-form-item class="login-button">
              <el-button
                type="primary"
                style="width:100%;"
                @click.native.prevent="handleSubmit()"
                :loading="logining"
                class="btn-login"
                v-preventReClick
                >登录</el-button
              >
            </el-form-item>
          </el-form>

          <!-- <div class="login-type-check">
            <div class="login-type-title">其它登录</div>
            <el-row :gutter="12">
              <el-col :span="6" :offset="3">
                <el-button circle>
                  <i class="icon-phone"></i>
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
          </div> -->
        </div>
      </div>
    </div>

    <!--底部展示区-->
    <div class="footer" v-if="foot_net_record.length > 0">
      {{ foot_net_record }}
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import config_bae from '../config'

export default {
  data() {
    var account = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('账号名不能为空'))
      } else {
        const reg = /^[\u4e00-\u9fa5_a-zA-Z0-9]{1,20}$/
        if (reg.test(value)) {
          callback()
        } else {
          return callback(new Error('账号名格式错误'))
        }
      }
    }
    var net_record = ''
    for (var k in config_bae.RECORD_URL) {
      var it = config_bae.RECORD_URL[k]
      if (it.orgin == window.location.hostname) {
        net_record = it.value
      }
    }

    var checkPass = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('密码不能为空'))
      } else {
        if (value.length < 8) {
          return callback(
            new Error('密码长度不能低于6位！')
          )
        }
        callback()
      }
    }

    return {
      imgBase: '',
      uuid: '',
      logining: false,
      foot_net_record: net_record,
      loginInfo: {
        account: '',
        checkPass: '',
        imgCode: ''
      },
      rules2: {
        account: [
          {
            required: true,
            validator: account,
            trigger: 'blur'
          }
        ],
        checkPass: [
          {
            required: true,
            validator: checkPass,
            trigger: 'blur'
          }
        ]
      }
    }
  },

  computed: {
    ...mapState(['login'])
  },

  created() {
    const isProdution =
      process.env.NODE_ENV === 'production' &&
      !process.env.VUE_APP_IS_SJKT

    // 苏交控的生产没有该页面
    if (isProdution && !this.BASETargetIsNbtd) {
      this.$router.replace('/index')
    }
  },

  methods: {
    ...mapActions([
      'requestLogin',
      'getLoginStatus',
      'querySuppPlatform',
      'userLoginDepart'
    ]),

    /**
     * 点击登录
     */
    handleSubmit() {
      // this.captchaLogin()
      console.log('ceshiii')
      this.$refs.ruleForm.validate(valid => {
        if (!valid) {
          return this.$message({
            message: '请核对登录信息',
            type: 'error'
          })
        }
        // var loginParams = `username=${this.ruleForm.account}&password=${this.$md5(this.ruleForm.checkPass)}`;
        // this.requestLogin(this.loginInfo);
        this.userLoginDepart(this.loginInfo)
          .then(() => {})
          .catch()

        // 判断登录状态是否需要上报
        this.getLoginStatus().then(res => {
          if (res) {
            console.log(res,'sdsadasdas')
            this.querySuppPlatform()
          }
        })
      })
    },
    //获取base64验证码接口
    captchaLogin() {
      let data = {}
      this.$api.captchaLogin(data).then(res => {
        if (res.code == 200) {
          this.imgBase = res.data.imageBase64
          this.loginInfo.uuid = res.data.uuid
          console.log(this.uuid)
        }
      })
    },
    //点击验证码图片刷新数据
    imgBaseBtn() {
      this.captchaLogin()
    }
    /**
     *手机登录
     */
  },

  mounted() {
    console.log('测试！！！')
    if (JSON.parse(localStorage.getItem('PM_CK_LG'))) {
      this.loginInfo.account = JSON.parse(
        localStorage.getItem('PM_CK_LG')
      ).userName
      this.loginInfo.checkPass = JSON.parse(
        localStorage.getItem('PM_CK_LG')
      ).userPass
    }
    this.captchaLogin()
    let _this = this

    // 回车提交表单
    document.onkeydown = function(e) {
      // 兼容FF和IE和Opera
      var theEvent = window.event || e
      var code =
        theEvent.keyCode ||
        theEvent.which ||
        theEvent.charCode
      if (code === 13) {
        _this.handleSubmit()
      }
    }
  }
}
</script>

<style lang="less">
.login-box {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #0b132f; /*@Darkblue;*/
  background-image: url('../assets/images/login/bg@2x.jpg');
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
      background-image: url("../assets/images/login/title@gw.png");
      // background-image: url('../assets/images/login/title@2x.png');
      background-repeat: no-repeat;
      background-size: 100% auto;
      background-position: center;

      &.is-nbtd {
        -webkit-background-clip: text;
        background-image: linear-gradient(
          90deg,
          #01c1f2,
          #28b486
        );
        color: transparent;
        font-size: 42px;
        font-weight: bold;
        letter-spacing: 20px;
        line-height: 47px;
        overflow: hidden;
        white-space: nowrap;
      }
    }

    .login-wrapper {
      width: 100%;
      padding-bottom: 110%; /*实现自适应正方形，撑开盒子高度*/
      /*height: 520px;*/
      background-image: url('../assets/images/login/inform@2x.png');
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
        .el-form-item {
          margin-bottom: 1.4rem;
          height: 22%;

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
                  box-shadow: inset 0 0 8px 3px
                    rgba(0, 0, 0, 0.3);
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
                background-size: 100% auto;
                background-position: center;
                &.icon-username {
                  background-image: url('../assets/images/login/username@2x.png');
                }
                &.icon-password {
                  background-image: url('../assets/images/login/password@2x.png');
                }
                &.icon-username {
                  background-image: url('../assets/images/login/username@2x.png');
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
              background-image: url('../assets/images/login/rlsb@2x.png');
            }
            &.icon-phone {
              background-image: url('../assets/images/login/sj@2x.png');
            }
            &.icon-wechat {
              background-image: url('../assets/images/login/wx@2x.png');
            }
            &.icon-pwd {
              background-image: url('../assets/images/login/ym@2x.png');
            }
          }
        }
      }
    }
  }

  .footer {
    position: absolute;
    bottom: 20px;
    left: 50%;
    margin-left: -70px;
    color: #bbb;
    font-size: 14px;
  }
}
.imgCodeInfo {
  img {
    padding-left: 10px;
    height: 40px;
  }
  display: flex;
}
</style>
