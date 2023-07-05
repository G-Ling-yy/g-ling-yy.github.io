<template>
  <div class="navbar-box">
    <el-row>
      <el-col :span="16">
        <div class="logo">
          <!-- <img src="/public/sjklogo.png" /> -->
          <img
            class="btn"
            @click="$router.push('/index')"
            srcset="../../public/favicon.png"
          />
          <!-- <img :src="systemLogoUrl" /> -->
          {{ systemName }}
          <small>{{ BASETargetIsNbtd ? '' : BASECONFIG.SYSTEM_VERSION }}</small>
        </div>
        <!--全国公路视频基础联网平台云视频联网平台-->
      </el-col>
      <el-col :span="8">
        <div class="header-right">
          <div>
            <i
              class="iconfont iconhome-page icon-button"
              @click="
                $router.push(
                  userInfo && userInfo.userType === '4'
                    ? '/szhIndex'
                    : '/index'
                )
              "
              style="font-size: 2.4rem"
            ></i>
          </div>
          <!-- 信息弹窗 -->
          <!-- <div style="margin: 0px 8px" @click="popoverBtn()">
            <el-badge value="..." class="item">
              <el-popover placement="bottom" width="320" trigger="click">
                <vue-scroll :ops="$root.scrollOpsY">
                  <div class="popover_list">
                    <ul>
                      <li v-if="!mesgTotal">目前还没有消息</li>
                      <li
                        class="list_item"
                        v-for="item in messageList"
                        :key="item.relationId"
                        @click="handleClickItem(item)"
                      >
                        <img class="item_icon_d" :src="base + item.logo" />
                        <span :class="item.status == 1 ? 'shade' : ''"></span>
                        <div class="item_content">
                          <em>{{ item.gmtCreate }}</em>
                          <span :class="item.status == 1 ? 'goClick' : ''">{{
                            item.content
                          }}</span>
                        </div>
                        <i class="el-icon-arrow-right"></i>
                      </li>
                    </ul>
                    <div class="table-pagination">
                      <p class="total-pagination">共{{mesgTotal}}条</p>
                      <el-pagination
                        background
                        small
                        layout=" prev, pager, next, jumper "
                        :total="mesgTotal"
                        :page-size="pageSize"
                        :current-page="currentPage"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                      ></el-pagination>
                    </div>
                  </div>
                </vue-scroll>
                <el-badge :value="unreadCount" slot="reference">
                  <i class="iconfont iconshebeixiaoxi icon-button"></i>
                  @click="getMessageListData()"
                </el-badge>
              </el-popover>
            </el-badge>
          </div> -->
          <!-- 用户信息及修改密码 -->
          <!-- <div>
            <el-dropdown>
              <span class="el-dropdown-link">
                <i class="iconfont icon-Manager"></i>
                {{ userInfo ? userInfo.userName : "" }}
                <i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  icon="el-icon-unlock"
                  @click.native="changPwd()"
                  >修改密码</el-dropdown-item
                >
                <el-dropdown-item
                  icon="el-icon-switch-button"
                  @click.native="userExit()"
                  >退出登录</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
          </div> -->
        </div>
      </el-col>
    </el-row>

    <!-- 修改密码弹框 -->

    <el-dialog
      v-dialogDrag
      :append-to-body="true"
      custom-class="gd-custom-dialog"
      title="修改密码"
      :visible.sync="dialogFormVisible"
      width="30%"
      top="20vh"
    >
      <el-form
        :model="form"
        status-icon
        :rules="rules"
        ref="form"
      >
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
        <el-form-item
          label="新密码"
          :label-width="formLabelWidth"
          prop="pwd"
        >
          <el-input
            v-model="form.pwd"
            show-password
            type="password"
            @input="pwdchang"
          ></el-input>
        </el-form-item>
        <div class="input_span">
          <label style="margin-left: 40px">强度:</label>
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
        <el-button @click="dialogFormVisible = false"
          >取 消</el-button
        >
        <el-button
          type="primary"
          @click="startChange('form')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import api from '../api/index.js'
import Axios from 'axios'
import Qs from 'qs'
export default {
  data() {
    var _that = this
    let errPwd = (rule, value, callback) => {
      try {
        if (this.errPwd) {
          callback(new Error('密码有误'))
        } else {
          callback()
        }
      } catch (e) {}
    }
    let oldPwd = (rule, value, callback) => {
      try {
        if (value === '') {
          callback(new Error('请输入旧密码'))
        }
        callback()
      } catch (e) {}
    }
    let validatePass = (rule, value, callback) => {
      // console.log(value,'put-val')
      // _that.pwdchang(value)
      try {
        if (value === '') {
          callback(new Error('请输入新密码'))
        } else if (value.length < 8) {
          callback(
            new Error(
              '密码不能低于8位,密码由字母和数字组成'
            )
          )
        } else {
          if (this.form.pwd !== '') {
            this.$refs.form.validateField('surePwd')
          }
          callback()
        }
      } catch (e) {}
    }
    let validatePass2 = (rule, value, callback) => {
      try {
        if (value === '') {
          callback(new Error('请再次输入新密码'))
        } else if (value !== this.form.pwd) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      } catch (e) {}
    }
    return {
      pwd: '',
      msgText: '',
      mesgTotal: 0,
      currentPage: 1,
      pageSize: 4,
      // systemName: this. BASETargetIsNbtd ? '视频中台3.3' : '视频中台',
      systemName: this. BASETargetIsNbtd ? '高网中心' : '视频中台',
      peopleNum: 20, //在线人数
      messageNum: 0,
      hasDeviceManage: true,
      logoUrl: '',
      platformName: '视频中台',

      dialogFormVisible: false,
      form: { oldPwd: '', pwd: '', surePwd: '' },
      rules: {
        oldPwd: [
          { validator: errPwd, trigger: 'blur' },
          { validator: oldPwd }
        ],
        pwd: [{ validator: validatePass, trigger: 'blur' }],
        surePwd: [
          { validator: validatePass2, trigger: 'blur' }
        ]
      },
      formLabelWidth: '80px',
      errPwd: false,
      isFrist: true,

      routeName: '',
      // 消息列表
      messageList: [],
      // 未读消息的条数
      unreadCount: null,
      // 消息的总条数
      totalCount: null,
      path: 'ws://121.36.224.140:9009/message/push/3',
      socket: '',
      base: 'data:image/png;base64,'
    }
  },
  created() {
    // try {
    //   var plateData = JSON.parse(localStorage.getItem("cloudsysinfo"));
    //   this.systemName = plateData.platformName;
    // } catch (e) {}
    this.getMessageListData()
    // this.webSocketLink();
  },
  computed: {
    ...mapState([
      'login',
      'userInfo',
      'message',
      'systemLogoUrl'
      // "systemName",
    ])

    /*gridData(){
          let list = [];
          for(let i = 0;i<40;i++){
              list.push({
                  date: this.Utils.date('Y-m-d H:i:s',parseInt((new Date().getTime()+i*10000)/1000)),
                  message: i + '服务器数据库摄像头，显示播放停止，状态正常故障，数量'+10*i
              });
          }

          return list;
      }*/
  },
  mounted() {
    // window.onbeforeunload = function (e) {
    //   var storage = window.localStorage;
    //   storage.clear();
    // };
    let uinfo = JSON.parse(
      localStorage.getItem('cloudplatform')
    )
    console.log(uinfo, 'uinfo')
    this.isFrist = uinfo.isFrist
    this.dialogFormVisible = this.isFrist
    this.refreshButton()
    //this.logoUrl = uinfo.logoUrl || "https://logo123.obs.cn-east-3.myhuaweicloud.com/logo.png";
    //this.platformName = uinfo.platformName || "全国公路联网视频云平台";

    //console.info(uinfo);

    /*this.getMessageTotal({
        pageSize:100,
        currPage:1,
        status:0,
      }).then((res)=>{
        if(res.code === 200){
          this.messageNum = res.total;
        }
      });*/
  },
  beforeUpdate() {
    this.refreshButton()
  },
  methods: {
    ...mapActions([
      'logout',
      'getMessageTotal',
      'checkMenus'
    ]),
    pwdchang(value) {
      console.log(value, this.form.pwd, 'value')
    },
    checkStrong(sValue) {
      var modes = 0
      //正则表达式验证符合要求的
      if (sValue.length < 1) return modes
      if (/\d/.test(sValue)) modes++ //数字
      if (/[a-z]/.test(sValue)) modes++ //小写
      if (/[A-Z]/.test(sValue)) modes++ //大写
      if (/\W/.test(sValue)) modes++ //特殊字符

      //逻辑处理
      switch (modes) {
        case 1:
          return 1
          break
        case 2:
          return 2
          break
        case 3:
        case 4:
          return sValue.length < 4 ? 3 : 4
          break
      }
      return modes
    },
    pwdchang(newname, oldname) {
      this.msgText = this.checkStrong(newname)
      if (this.msgText > 1 || this.msgText == 1) {
        document.getElementById('one').style.background =
          'red'
      } else {
        document.getElementById('one').style.background =
          '#eee'
      }
      if (this.msgText > 2 || this.msgText == 2) {
        document.getElementById('two').style.background =
          'orange'
      } else {
        document.getElementById('two').style.background =
          '#eee'
      }
      if (this.msgText == 4) {
        document.getElementById('three').style.background =
          '#00D1B2'
      } else {
        document.getElementById('three').style.background =
          '#eee'
      }
    },
    // 消息列表分页处理
    handleSizeChange(val) {
      this.currentPage = 1
      this.pageSize = val
      this.getMessageListData()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getMessageListData()
    },
    popoverBtn() {
      this.getMessageListData()
    },
    // 获取消息列表数据
    getMessageListData(curPage) {
      let obj = {
        currPage: this.currentPage,
        pageSize: this.pageSize
      }
      this.$api.getMessageList(obj).then(res => {
        if (res.code == 200) {
          this.messageList = res.data
          this.mesgTotal = res.total
          this.pageSize = res.pageSize
          // console.log(this.messageList, 'this.messageList')
        } else {
          this.$message.error(res.message)
        }
      })
      // let formData = new FormData();
      // formData.append("userId", "10000000053");
      // formData.append("pageIndex", 1);
      // this.$http.post("/listMessage", formData).then(
      //   (res) => {
      //     let data = res.data;
      //     if (data.code == 200) {
      //       this.messageList = data.data.messageList;
      //       this.unreadCount = data.data.unreadCount;
      //       this.totalCount = res.data.totalCount;
      //     }
      //   },
      //   (err) => {
      //     console.log(err);
      //   }
      // );
    },
    // 更新消息状态
    updateReadStatus(messageId) {
      this.$http
        .get(`/updateReadStatus?messageId=${messageId}`)
        .then(
          res => {
            let data = res.data
          },
          err => {
            console.log(err)
          }
        )
    },
    // 启用websocket服务
    // webSocketLink() {
    //   let _this = this;
    //   var ws = new WebSocket();
    //   // "ws://121.36.224.140:9009/message/push/10000000053"
    //   // "ws://139.9.157.61:9527/message/push/10000000053" //申请一个WebSocket对象，参数是服务端地址，同http协议使用http://开头一样，WebSocket协议的url使用ws://开头，另外安全的WebSocket协议使用wss://开头
    //   ws.onopen = function () {
    //     //当WebSocket创建成功时，触发onopen事件
    //     // console.log("open");
    //     ws.send("hello"); //将消息发送到服务端
    //   };
    //   ws.onmessage = function (e) {
    //     //当客户端收到服务端发来的消息时，触发onmessage事件，参数e.data包含server传递过来的数据
    //     // console.log(e.data, "11111111111");
    //     if (e.data) {
    //       _this.messageList.unshift(JSON.parse(e.data));
    //     }
    //     // console.log(e.data, "11111111111");
    //   };
    //   ws.onclose = function (e) {
    //     //当客户端收到服务端发送的关闭连接请求时，触发onclose事件
    //     console.log("close");
    //   };
    //   ws.onerror = function (e) {
    //     //如果出现连接、处理、接收、发送数据失败的时候触发onerror事件
    //     console.log(error);
    //   };
    // },
    refreshButton() {
      let route = this.$route.name
      //判断 视频上云网关 摄像机详情 显示按钮高亮
      this.routeName =
        route === 'videoGateway' ||
        route === 'cameraDetails'
          ? 'active'
          : ''

      // 判断是否有控制台权限，没有权限只展示地图
      // 用于省平台内嵌功能
      let menuList = localStorage.getItem('PM_CK_MU'),
        _this = this
      //console.info('mlmenuListist  ',menuList);
      _this.checkMenus(menuList).then(mlist => {
        // console.info('mlist  ',mlist);
        if (!mlist || !mlist.length) {
          _this.hasDeviceManage = false
        }
      })
    },
    // 点击消息框每一项处理函数
    handleClickItem(item) {
      console.log(this.messageList, item)
      // if (item.status != 0) {
      //   item.status = 0;
      // }
      // let arr = [];
      // if (arr.indexOf(id) !== -1) {
      //   arr.push(id);
      // }
      var linkParams = item.linkParams

      console.log(linkParams, 'linkParams')
      if (item.status == 0) {
        this.updateReadStatus(item.messageId)
      }
      // this.getMessageListData();

      this.$router
        .push({
          //跳转空页面刷新防止当前页面搜索无反应
          path: '/redirect',
          query: {
            path: 'deviceCameraManage',
            query: { cameraNum: linkParams }
          }
        })
        .catch(error => console.log('router failed', error))
      this.$message({
        message: '您已跳转到所对应的摄像机',
        type: 'success'
      })
    },
    userExit() {
      const h = this.$createElement
      const newDatas = [h('p', null, '确定退出系统？')]
      this.$confirm('提示', {
        title: '提示',
        message: h('div', null, newDatas),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(() => {
          this.$message({
            message: '退出成功',
            type: 'success'
          })

          //localStorage.setItem('cloudplatform',null);

          this.logout()

          // this.$router.push("/login");
          // this.$router.go(0);
          // var info=JSON.parse(localStorage.getItem("managementSystem") );
          // var obj={};
          // obj.username=info.username;
          // obj.password=info.password;
          // localStorage.setItem("managementSystem",JSON.stringify(obj));
        })
        .catch(() => {})
    },

    messageClick() {
      //messageCenter
      this.$router.push('/messageCenter')
    },

    // 修改密码点击事件
    changPwd() {
      this.dialogFormVisible = true
    },

    // 执行修改密码
    startChange(form) {
      this.$refs[form].validate(valid => {
        if (valid || this.errPwd) {
          api
            .changePwd({
              isFrist: this.isFrist,
              password: this.form.pwd,
              oldPassword: this.form.oldPwd
            })
            .then(res => {
              this.errPwd = true
              if (res.code === 5004) {
                // 密码错误
                this.$refs[form].validateField('oldPwd')
                this.errPwd = false
              } else if (res.code === 400) {
                this.$message({
                  message: res.message,
                  type: 'warning'
                })
              } else {
                this.errPwd = false
                this.dialogFormVisible = false
                let cloudplatform = JSON.parse(
                  localStorage.getItem('cloudplatform')
                )
                cloudplatform.isFrist = false
                localStorage.setItem(
                  'cloudplatform',
                  JSON.stringify(cloudplatform)
                )
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
                this.logout()
              }
            })
        } else {
          return false
        }
      })
    }
  }
}
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
