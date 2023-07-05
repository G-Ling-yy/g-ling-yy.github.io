<template>
  <div class="content-wrapper">
    <div class="breadcrumb-wrapper">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/dashboard' }">
          <i class="el-icon-coin"></i>
        </el-breadcrumb-item>
        <el-breadcrumb-item>系统管理</el-breadcrumb-item>
        <el-breadcrumb-item>系统设置</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-tabs
      v-model="activeName"
      @tab-click="handleClick"
      type="card"
      class="gd-custom-tabs styme-tab"
      tab-position="top"
    >
      <el-tab-pane
        label="名称/LOGO"
        name="first"
        stretch="true"
      >
        <!-- <form enctype="multipart/form-data" ref="uploadform"> -->
        <div class="upload">
          <div>
            <el-input
              v-model="input"
              placeholder="请输入平台名称"
            ></el-input>
            <div class="inputContent">
              * 注：只允许输入汉字、字母和数字
            </div>
            <el-upload
              :auto-upload="false"
              class="avatar-uploader"
              action
              ref="uploadAvatar"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :on-change="changeFile"
              :before-upload="beforeAvatarUpload"
            >
              <i
                v-if="imageUrl && !isImgLoaded"
                class="el-icon-picture-outline"
              />
              <img
                v-if="imageUrl"
                v-show="isImgLoaded"
                :src="imageBaseUrl"
                class="avatar"
                @load="isImgLoaded = true"
              />
              <div v-else>
                <p class="uploadContent">
                  请上传PNG格式的正方形无底LOGO
                </p>
                <i class="el-icon-upload"></i>
              </div>
            </el-upload>
            <div v-if="imageUrl" class="inputContent">
              * 已上传平台LOGO，点击图片即可修改
            </div>
          </div>
          <div style="text-align: center;margin-top: 30px;">
            <el-button @click="subLogo" type="primary"
              >保存</el-button
            >
          </div>
        </div>
        <!-- </form> -->
      </el-tab-pane>
      <el-tab-pane
        label="个人信息"
        name="second"
        stretch="true"
      >
        <div class="contain_form">
          <el-form
            hide-required-asterisk
            :model="numberValidateForm"
            ref="numberValidateForm"
            label-width="76px"
            class="demo-ruleForm"
            style="margin-top:100px"
            label-position="left"
          >
            <el-form-item
              label="姓名:"
              prop="userName"
              :rules="[
                { required: true, message: '姓名不能为空' },
                { validator: checkName, trigger: 'blur' }
              ]"
            >
              <el-input
                type="text"
                v-model.number="numberValidateForm.userName"
                style="width:283px"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="电话:"
              prop="phoneNum"
              :rules="[
                { required: true, message: '电话不能为空' },
                {
                  type: 'number',
                  message: '电话必须为数字值'
                },
                { validator: checkMobile, trigger: 'blur' }
              ]"
            >
              <el-input
                type="text"
                v-model.number="numberValidateForm.phoneNum"
                style="width:283px"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="旧密码:"
              prop="oldPassword"
              :rules="[
                { validator: errPwd, trigger: 'blur' }
              ]"
              @input="changePsw($event)"
            >
              <el-input
                type="password"
                v-model="numberValidateForm.oldPassword"
                style="width:283px"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="修改密码:"
              prop="password"
              :rules="[
                { validator: validatePass, trigger: 'blur' }
              ]"
            >
              <el-input
                type="password"
                v-model="numberValidateForm.password"
                style="width:283px"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="确认密码:"
              prop="againPassword"
            >
              <el-input
                class="elIput"
                type="password"
                v-model.number="
                  numberValidateForm.againPassword
                "
                style="width:283px"
              ></el-input>
            </el-form-item>
            <div
              style="text-align: center;padding-bottom: 40px;"
            >
              <el-button
                type="primary"
                @click="submitForm('numberValidateForm')"
                >保存</el-button
              >
            </div>
          </el-form>
        </div>
      </el-tab-pane>
    </el-tabs>

    <div></div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
export default {
  data() {
    //合法手机号验证
    let checkMobile = (rule, value, callback) => {
      // 验证手机号的正则表达式
      const reg = /^1[3456789]\d{9}$/
      !reg.test(value)
        ? callback(new Error('请输入正确手机号'))
        : callback()
    }
    let checkName = (rule, value, callback) => {
      const reg = /^[A-Za-z-_\u4e00-\u9fa5]{1,20}$/
      if (value === '') {
        callback(new Error('请输入姓名'))
      } else if (!reg.test(value)) {
        callback(new Error('姓名由1-20位中文、英文组成'))
      } else {
        callback()
      }
    }

    let errPwd = (rule, value, callback) => {
      if (this.olePwdErr) {
        callback(new Error('旧密码有误'))
      } else {
        callback()
      }
    }
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        // callback(new Error("请输入密码"));
      } else {
        if (this.numberValidateForm.password !== '') {
          this.$refs.numberValidateForm.validateField(
            'checkPass'
          )
        }
      }
      callback()
    }
    var validatePass2 = (rule, value, callback) => {
      if (
        this.numberValidateForm.password &&
        value === ''
      ) {
        callback(new Error('请再次输入密码'))
      } else if (
        value !== this.numberValidateForm.password
      ) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }

    return {
      checkMobile,
      checkName,
      validatePass,
      validatePass2,
      errPwd,
      olePwdErr: false,
      activeName: 'first',
      userInfo: {},
      numberValidateForm: {
        userId: 0,
        isFrist: false,
        userName: '',
        phoneNum: 0,
        password: '',
        againPassword: '',
        oldPassword: ''
      },
      imageUrl: '',
      imageBaseUrl: '',
      isImgLoaded: false, // 图片加载完成
      input: '公路视频云联网',
      result: ''
    }
  },
  computed: {
    ...mapState(['sysUser', 'roleList', 'orgTreeData'])
  },
  mounted() {
    let sysinfo = JSON.parse(
      localStorage.getItem('cloudsysinfo')
    )
    // console.log(sysinfo);
    this.imageBaseUrl =
      sysinfo?.logoUrl ||
      'https://logo123.obs.cn-east-3.myhuaweicloud.com/logo.png'
    this.imageUrl = this.imageBaseUrl
    this.input = sysinfo.platformName || '视频中台3.3'

    //获取用户个人信息
    // let uInfo = JSON.parse(localStorage.getItem("cloudplatform"));
    this.$api
      .getUserDetail({
        // userId: uInfo.userId,
        userName: '',
        phoneNumber: ''
      })
      .then(res => {
        if (res.code === 200) {
          // console.log(res.data);
          this.numberValidateForm.phoneNum = parseFloat(
            res.data.phoneNumber
          )
          this.numberValidateForm.userName =
            res.data.userName
        }
      })
    // let uInfo = JSON.parse(localStorage.getItem("cloudplatform"));
    // this.getSysUserList({
    //   page: {
    //     pageSize: 1,
    //     currentPage: 1,
    //   },
    //   info: {
    //     userId: uInfo.userId,
    //   },
    // }).then((res) => {
    //   if (res.code === 200) {
    //     let list = res.data;
    //     this.numberValidateForm = {
    //       userId: list[0].userId,
    //       isFrist: false,
    //       // userName: list[0].userName,
    //       // phoneNum: parseFloat(list[0].phoneNum),
    //       password: "",
    //       againPassword: "",
    //       oldPassword: "",
    //       organizationId: uInfo.organizationId,
    //       status: uInfo.userStatus,
    //     };
    //   }
    // });
  },
  methods: {
    ...mapActions([
      'changePwdAction',
      'getSysUserList',
      'editUserAction'
      // 'logout',
    ]),
    ...mapMutations(['setSystemLogoUrl', 'setSystemName']),
    // ...mapActions(["changePwd"]),
    handleClick(tab, event) {
      // console.log(tab, event);
    },
    submitForm(formName) {
      //let that = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          // console.log(this.numberValidateForm);
          if (
            this.numberValidateForm.password &&
            this.numberValidateForm.againPassword &&
            !this.numberValidateForm.oldPassword
          ) {
            this.olePwdErr = true
            this.$refs.numberValidateForm.validateField(
              'oldPassword'
            )
            return true
          }
          this.$api
            .getUserDetail({
              userName: this.numberValidateForm.userName,
              // userId: this.numberValidateForm.userId,
              phoneNumber: this.numberValidateForm.phoneNum
              // organizationId: this.numberValidateForm.organizationId,
              // status: "1",
            })
            .then(res => {
              if (res.code === 200) {
                if (
                  this.numberValidateForm.password &&
                  this.numberValidateForm.againPassword
                ) {
                  this.changePwdAction({
                    //userId:this.numberValidateForm.userId,
                    // isFrist: false,
                    password: this.numberValidateForm
                      .password,
                    oldPassword: this.numberValidateForm
                      .oldPassword
                  }).then(res => {
                    this.olePwdErr = true
                    if (res.code === 5004) {
                      // 密码错误
                      this.$refs.numberValidateForm.validateField(
                        'oldPwd'
                      )
                      this.olePwdErr = false
                      return false
                    }
                    this.olePwdErr = false

                    this.$message.success(
                      '修改个人信息成功！'
                    )
                    // this.logout();
                  })
                  return true
                }
                this.$message.success('修改个人信息成功！')
              }
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    handleAvatarSuccess(res, file) {
      // console.log("file", file);
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload(file) {
      //const isJPG = file.type === "image/jpeg"; // "image/jpeg"
      const isPNG = file.type === 'image/png' // "image/jpeg"
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isPNG) {
        this.$message.error('上传图片只能是 PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }

      // console.log("file", console.log(file));
      localStorage.setItem('file', file)

      // console.log(localStorage.getItem("file"));

      var This = this
      var reader = new FileReader()
      reader.readAsDataURL(file.raw)
      reader.onload = function(e) {
        this.result //base64编码
        This.imageBaseUrl = this.result
        This.imageUrl = this.result
      }

      // console.log(This.imageBaseUrl);
    },
    changeFile(file, fileList) {
      //const isJPGORPNG = file.raw.type === "image/png"; // || file.raw.type === "image/jpeg"
      //const isJPG = file.type === "image/jpeg"; // "image/jpeg"
      const isPNG =
        file.raw.type === 'image/jpeg' ||
        file.raw.type === 'image/png' // "image/jpeg"
      const isLt1M = file.size / 1024 / 1024 < 2

      if (!isPNG) {
        this.$message.info('请上传jpg、jpeg、png图片格式')
        return
      }
      if (!isLt1M) {
        this.$message.info('上传图片大小不能超过 2MB!')
        return
      }

      // console.log(file, fileList);
      // console.log("file", file);
      // localStorage.setItem('file',file);

      this.imageBaseUrl = file
      this.imageBaseUrl = file
      var This = this
      var reader = new FileReader()
      reader.readAsDataURL(file.raw)
      reader.onload = function(e) {
        this.result //base64编码
        This.imageBaseUrl = this.result
        This.imageUrl = this.result
      }
    },
    dataURLtoBlob(dataurl) {
      if (dataurl.split(',')[0].match(/:(.*?);/)) {
        var arr = dataurl.split(','),
          mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]),
          n = bstr.length,
          u8arr = new Uint8Array(n)
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n)
        }
        return new Blob([u8arr], { type: mime })
      } else {
        if (!dataurl.trim()) {
          this.$message({
            type: 'error',
            message: 'LOGO不能为空！'
          })
        }
      }
    },

    subLogo() {
      const reg = /^[A-Za-z0-9-_.\u4e00-\u9fa5]{1,20}$/
      if (!reg.test(this.input)) {
        this.$message({
          message:
            '系统名称只能是[1-20位]汉字、数字、大小写字母、“_”、“.” 组合！',
          type: 'info'
        })
        return false
      }
      if (!this.imageBaseUrl.trim()) {
        this.$message({
          message: '请上传logo',
          type: 'info'
        })
        return
      }
      let params = new FormData()
      const imgFile = this.dataURLtoBlob(this.imageBaseUrl)
      params.append('file', imgFile)
      params.append('name', this.input)
      this.$http
        // .post(`/basic/logo/upload?name=${this.input}`, params)//老版本接口
        .post(`/user/logo`, params)
        .then(res => {
          let data = res.data,
            logo = res.data.data.logoUrl
          if (data.code === 200) {
            let logoUrl =
                logo ||
                'https://logo123.obs.cn-east-3.myhuaweicloud.com/logo.png',
              platformName = this.input
            this.setSystemLogoUrl(logoUrl)
            this.setSystemName(this.input)
            localStorage.setItem(
              'cloudsysinfo',
              JSON.stringify({
                logoUrl: logoUrl,
                platformName: this.input
              })
            )
            this.$message({
              message: '保存成功',
              type: 'success'
            })
          }
        })
    }
  }
}
</script>

<style lang="less">
.styme-tab {
  height: calc(100% - 34px);
}
.upload {
  /*display: flex;
  flex-direction: column;
  align-items: center;*/
  width: 290px;
  margin: 100px auto 40px;
  .el-input,
  .el-upload {
    margin: 0;
    width: 100%;
  }
  .inputContent {
    line-height: 22px;
    margin: 10px 0 20px;
    font-size: 12px;
    color: #8d9dae;
  }

  .uploadContent {
    position: absolute;
    top: 170px;
    left: 50px;
    font-size: 12px;
    color: #8d9dae;
  }
  .avatar-uploader {
    > div {
      width: 100%;
    }
    .el-upload {
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      border: 1px dashed #ccc;
      width: 290px;
      background-color: #f8f8f8;
    }
    .el-upload:hover {
      border-color: #409eff;
    }
    .el-icon-upload {
      color: #d8d8d8;
    }

    i {
      font-size: 7rem;
      line-height: 240px;
      color: #989898;
    }
  }
  .avatar {
    width: 288px;
    height: 100%;
    display: block;
  }
}

.contain_form {
  display: flex;
  justify-content: center;
  align-items: center;
  .inputContent {
    font-size: 12px;
    color: #333;
    margin: 20px 0px 20px 0;
  }
  .el-icon-plus:before {
    border-radius: 50%;
    border: 2px solid rgb(140, 147, 157);
    padding: 48px;
  }
  .avatar-uploader-icon {
    background-color: #eee;
  }
  .el-button {
    margin-top: 30px;
  }
}
</style>
