<template>
  <div class="bg-white">
    <header-com />
    <div class="mod-container">
      <div class="mod-con-inner">
        <div class="mod-pass-style">修改初始密码</div>
        <div class="form-container">
          <div class="text-center modify-pass">
            为了你的账户安全，请首次登陆时请修改初始密码
          </div>
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item label="密码" prop="pass" class="margin-bottom-10">
              <div class="form-flex">
                <el-input
                  :type="passwordType"
                  v-model="ruleForm.pass"
                  autocomplete="off"
                  @focus="showTip = true"
                  @input="checkStrong"
                  class="flex-one"
                ></el-input
                ><!--     @blur="showTip = false"  -->
                <i
                  :class="[
                    {
                      'iconfont iconxianshi': passwordType === 'text',
                      'iconfont iconyincang': passwordType === 'password',
                    },
                    'pointer',
                  ]"
                  @click="toggleType('passwordType')"
                />
                <div class="tips" v-show="getShowTip">
                  <!--showTip-->
                  <p
                    :class="{
                      error: passwordRule['len'] == 0,
                      success: passwordRule['len'] == 1,
                    }"
                  >
                    长度8~20个字符；
                  </p>
                  <p
                    :class="{
                      error: passwordRule['alp'] == 0,
                      success: passwordRule['alp'] == 1,
                    }"
                  >
                    必须包含字母(区分大小写)；
                  </p>

                  <p
                    :class="{
                      error: passwordRule['num'] == 0,
                      success: passwordRule['num'] == 1,
                    }"
                  >
                    至少有一个数字；
                  </p>
                  <p
                    :class="{
                      error: passwordRule['chi'] == 0,
                      success: passwordRule['chi'] == 1,
                    }"
                  >
                    不允许有空格，中文；
                  </p>
                  <p
                    :class="{
                      error: passwordRule['fh'] == 0,
                      success: passwordRule['fh'] == 1,
                    }"
                  >
                    必须包含特殊符号；
                  </p>
                  <p
                    :class="{
                      error: passwordRule['ac'] == 0,
                      success: passwordRule['ac'] == 1,
                    }"
                  >
                    不能与账户名称相同；
                  </p>
                </div>
              </div>
            </el-form-item>
            <el-form-item
              label="密码强度"
              prop="strength"
              class="margin-bottom-10"
            >
              <div class="form-flex-container">
                <span
                  class="flex-one sp-item"
                  :class="{
                    'stren-1': currentStrength.includes(0),
                  }"
                  >弱</span
                >
                <span
                  class="flex-one sp-item"
                  :class="{
                    'stren-2': currentStrength.includes(1),
                  }"
                  >中</span
                >
                <span
                  class="flex-one sp-item"
                  :class="{
                    'stren-3': currentStrength.includes(2),
                  }"
                  >强</span
                >
              </div>
              <div class="line-tip">
                为了提升您的密码安全性，建议使用英文字母加数字加特殊字符组合密码
              </div>
            </el-form-item>
            <el-form-item label="确认密码" prop="checkPass">
              <div class="form-flex">
                <el-input
                  :type="conPasswordType"
                  v-model="ruleForm.checkPass"
                  autocomplete="off"
                  @focus="showConfTip = true"
                  @input="checkConfirm"
                  class="flex-one"
                ></el-input
                ><!--       @blur="showConfTip = false" -->
                <i
                  :class="[
                    {
                      'iconfont iconxianshi': conPasswordType === 'text',
                      'iconfont iconyincang': conPasswordType === 'password',
                    },
                    'pointer',
                  ]"
                  @click="toggleType('conPasswordType')"
                />
                <div class="tips" v-show="getShowConfTip">
                  <p
                    :class="{
                      error: conPasswordRule['sa'] == 0,
                      success: conPasswordRule['sa'] == 1,
                    }"
                  >
                    务必与新密码一致
                  </p>
                </div>
              </div>
            </el-form-item>

            <el-form-item>
              <el-button
                type="primary"
                :disabled="permitDisabled"
                @click="submitForm('ruleForm')"
                >提交</el-button
              >
              <el-button type="default" @click="goBack">返回</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderCom from './Header';
// import { modifyPass } from '@/api/eventApi';
// import { fromCode } from '@/utils/tool';
export default {
  name: 'ResetPass',
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        pass: '',
        checkPass: '',
      },
      rules: {
        pass: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' },
        ],
        checkPass: [
          { required: true, message: '确认密码不能为空', trigger: 'blur' },
          { validator: validatePass2, trigger: 'blur' },
        ],
      },
      // strengthArr: ['弱', '中', '强'],
      currentStrength: [],
      showTip: false,
      showConfTip: false,
      passwordType: 'password',
      conPasswordType: 'password',
      loginName: '',
      oldPass: '',
      passwordRule: {
        len: 2,
        alp: 2,
        num: 2,
        chi: 2,
        fh: 2,
        ac: 2,
      },
      conPasswordRule: {
        sa: 2,
      },
      /*  permitDisabled: true, */
    };
  },
  components: {
    HeaderCom,
  },
  computed: {
    permitDisabled() {
      let passBool = false;
      let confirmBool = false;
      let keys = Object.keys(this.passwordRule);
      keys.forEach((item) => {
        if (this.passwordRule[item] == 2 || this.passwordRule[item] == 0) {
          passBool = true;
        }
      });
      if (this.conPasswordRule.sa == 2 || this.conPasswordRule.sa == 0) {
        confirmBool = true;
      }
      // console.log(passBool, confirmBool);
      return passBool || confirmBool;
    },
    getShowTip() {
      let passBool = false;
      // let confirmBool = false;
      let keys = Object.keys(this.passwordRule);
      keys.forEach((item) => {
        if (this.passwordRule[item] == 2 || this.passwordRule[item] == 0) {
          passBool = true;
        }
      });
      return this.showTip && passBool;
    },
    getShowConfTip() {
      let confirmBool = false;
      if (this.conPasswordRule.sa == 2 || this.conPasswordRule.sa == 0) {
        confirmBool = true;
      }
      return this.showConfTip && confirmBool;
    },
  },
  watch: {},
  created() {
    // console.log('haha', this.$route);
    this.loginName = decodeURIComponent(this.$route.query.loginame);
    this.oldPass = fromCode(this.$route.query.loginpass);
  },
  methods: {
    goBack() {
      this.$router.push({ path: '/login' });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // console.log('papa', this.ruleForm, this.loginName, this.oldPass);
          let obj = {
            logName: this.loginName,
            oldPassword: this.oldPass,
            password: this.ruleForm.pass,
          };
          modifyPass(obj).then((res) => {
            if (res.code == 200) {
              this.$message.success('密码重置成功');
              this.$router.push('/login');
            } else {
              this.$message.error(res.message);
            }
          });
        } else {
          return false;
        }
      });
    },
    checkStrong(e) {
      let sValue = this.ruleForm.pass;
      let modes = [];
      //正则表达式验证符合要求的
      //提示
      if (/^.{8,20}$/.test(sValue)) {
        this.passwordRule.len = 1;
      } else {
        this.passwordRule.len = 0;
      }
      if (/([A-Za-z]{1,20})([0-9]*)/.test(sValue)) {
        this.passwordRule.alp = 1;
      } else {
        this.passwordRule.alp = 0;
      }

      if (/([0-9]{1,20})([A-Za-z]*)/.test(sValue)) {
        this.passwordRule.num = 1;
      } else {
        this.passwordRule.num = 0;
      }
      if (/(\s+)|([\u4e00-\u9fa5]+)/.test(sValue)) {
        this.passwordRule.chi = 0;
      } else {
        this.passwordRule.chi = 1;
      }
      if (
        /[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]/im.test(
          sValue
        )
      ) {
        this.passwordRule.fh = 1;
      } else {
        this.passwordRule.fh = 0;
      }
      if (this.loginName && this.loginName == sValue) {
        this.passwordRule.ac = 0;
      } else {
        this.passwordRule.ac = 1;
      }

      if (sValue.length < 1) {
        modes = [];
      }
      if (/\d/.test(sValue)) {
        //数字
        modes = [0];
      }
      if (/[a-zA-Z]/.test(sValue)) {
        //大小写
        modes = [0, 1];
      }
      if (/[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/.test(sValue)) {
        modes = [0, 1, 2];
      } //特殊字符
      this.currentStrength = modes;
      this.checkConfirm();
    },
    toggleType(type) {
      this[type] = this[type] == 'password' ? 'text' : 'password';
    },
    checkConfirm() {
      let initValue = this.ruleForm.pass;
      let confValue = this.ruleForm.checkPass;
      if (initValue === confValue) {
        this.conPasswordRule.sa = 1;
      } else {
        this.conPasswordRule.sa = 0;
      }
    },
  },
};
</script>

<style scoped>
.bg-white {
  background: rgba(235, 239, 243, 1);
  width: 100%;
  height: 100%;
}
.form-container {
  background: #fff;
  padding: 60px 30% 60px 20%;
  box-shadow: 0px 1px 6px 0px rgba(20, 22, 37, 0.1);
  border-radius: 4px;
  max-height: 420px;
}
.form-container >>> .el-form .el-form-item .el-form-item__label {
  line-height: 40px;
}
.form-flex {
  position: relative;
}
.form-flex-container {
  display: flex;
}
.form-flex-container .flex-one {
  flex: 1;
}
.form-flex .tips {
  position: absolute;
  width: 210px;
  border: 1px solid #ececec;
  box-shadow: 0 0 4px 4px #ececec;
  line-height: 1;
  padding: 10px;
  right: -220px;
  top: 0;
  border-radius: 3px;
}
.form-flex .tips::before,
.form-flex .tips::after {
  content: '';
  position: absolute;
  left: -20px;
  top: 14px;
  border: 8px solid transparent;
  border-right-color: #ececec;
  width: 0;
  height: 0;
  z-index: 1;
}
.form-flex .tips::after {
  border: 8px solid transparent;
  border-right-color: #fff;
  z-index: 2;
  left: -15px;
  top: 14px;
}
.form-flex .tips p {
  margin: 0;
  line-height: 1.2;
  position: relative;
  color: rgba(191, 191, 191, 1);
  padding-left: 10px;
}
.form-flex .tips p::before {
  content: '';
  position: absolute;
  left: 0;
  top: 4px;
  width: 4px;
  height: 4px;
  background: rgba(191, 191, 191, 1);
}
.form-flex .tips p.success {
  color: rgba(78, 176, 59, 1);
}
.form-flex .tips p.success::before {
  content: '√';
  color: rgba(78, 176, 59, 1);
  width: 0;
  height: 0;
  font-weight: bold;
  top: 0;
}
.form-flex .tips p.error {
  color: rgba(252, 67, 67, 1);
}
.form-flex .tips p.error::before {
  content: '×';
  color: rgba(252, 67, 67, 1);
  width: 0;
  height: 0;
  font-weight: bold;
  top: -1px;
}
.form-flex-container .sp-item {
  background: #ececec;
  line-height: 20px;
  text-align: center;
  color: #333;
  margin-top: 10px;
}
.form-flex-container .sp-item:nth-child(2) {
  margin: 10px 10px 0;
}
.margin-bottom-10 {
  margin-bottom: 10px !important;
}
.form-flex-container .sp-item.stren-1 {
  background: rgba(252, 67, 67, 1);
  color: #fff;
}
.form-flex-container .sp-item.stren-2 {
  background: rgba(252, 150, 67, 1);
  color: #fff;
}
.form-flex-container .sp-item.stren-3 {
  background: rgba(95, 205, 87, 1);
  color: #fff;
}
.line-tip {
  margin: 5px 0;
  line-height: 1;
  color: rgb(163, 161, 161);
  font-size: 12px;
}
.modify-pass {
  text-align: center;
  margin-bottom: 40px;
  color: rgb(20, 22, 37);
  margin-left: 15%;
}

.pointer {
  cursor: pointer;
  position: absolute;
  right: 10px;
  top: 5px;
  color: rgb(142, 135, 135);
  font-size: 14px;
}
.mod-pass-style {
  text-align: center;
  font-size: 30px;
  margin: 20px 0;
}
.mod-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 86%;
}
.mod-container .mod-con-inner {
  width: 65%;
  max-width: 770px;
}
/* .icon-eyes {
  background: url('./icon-eyes.png') no-repeat;
  background-size: 100% 100%;
  width: 18px;
  height: 12px;
}
.icon-close {
  background: url('./icon-close.png') no-repeat;
  background-size: 100% 100%;
  width: 18px;
  height: 12px;
} */
</style>
