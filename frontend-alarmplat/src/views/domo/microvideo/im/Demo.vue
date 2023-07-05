<template>
  <div class="chat">
    <!-- <div class="lts">
      <div :class="roomId == v.id ? 'on':''" v-for="(v,i) in ltsList" :key="i" @click="joinRoom(v.id)">{{v.name}}</div>
    </div> -->
    <div class="top">
      <div v-for="(v, i) in msgList" :key="i" class="msgbox">
        {{ v.name }}：
        <span v-if="v.msgtype == 'TEXT'">{{ v.msg }}</span>
        <img
          :src="v.url"
          alt=""
          v-if="v.msgtype == 'IMAGE'"
          @click="downFile(v)"
        />
        <span class="top_img" @click="downFile(v)" v-if="v.msgtype == 'FILE'">
          {{ v.msg }}
        </span>
        <video
          :src="v.url"
          controls
          v-if="v.msgtype == 'VIDEO'"
          @click.stop
        ></video>
        <audio
          :src="v.url"
          controls
          v-if="v.msgtype == 'VOICE' && isUpload"
          @click.stop
        ></audio>
        <div class="progress"></div>
      </div>
    </div>
    <div class="bottom">
      <div>
        <label>
          <input
            style="position: absolute; opacity: 0"
            type="file"
            name="file"
            id="Album_img"
            accept="image/gif,image/jpeg,image/x-png"
            @change="pictureChange"
            ref="imgDom"
          />
          <img
            style="width: 30px; height: 30px; margin-left: 10px"
            src="./assets/images/camera.png"
          />
        </label>
        <label>
          <input
            style="position: absolute; opacity: 0"
            type="file"
            name="file"
            id="Album_img"
            accept="audio/*"
            @change="audioChange"
            ref="audioDom"
          />
          <img
            style="width: 30px; height: 30px; margin-left: 10px"
            src="./assets/images/audio.png"
          />
        </label>
        <label>
          <input
            style="position: absolute; opacity: 0"
            type="file"
            name="file"
            id="Album_File"
            accept="video/3gpp, video/mpeg, video/mp4"
            @change="videoChange"
            ref="videoDom"
          />
          <img
            style="width: 30px; height: 30px; margin-left: 10px"
            src="./assets/images/video.png"
          />
        </label>
        <label>
          <input
            style="position: absolute; opacity: 0"
            type="file"
            name="file"
            id="Album_File"
            accept="*"
            @change="fileChange"
            ref="fileDom"
          />
          <img
            style="width: 28px; height: 28px; margin-left: 10px"
            src="./assets/images/file.png"
          />
        </label>
      </div>
      <div>
        <textarea
          type="text"
          placeholder="请输入内容"
          v-model="messageText"
          @keyup.enter="sendTextMessage()"
        />
        <button @click="sendTextMessage">发送</button>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    /**
     * @description     聊天入口
     * @author          张宏伟(zhanghw@microvideo.cn)、张喜津
     * @time            2021/11/9 11:50
     */
    data() {
      return {
        msgList: [],
        messageText: '',
        userName: 'zxjtext06',
        pwd: '111111',
        roomId: '',
        ltsList: [
          {
            name: 'lulu9chatroom123',
            id: '157337163726849'
          },
          {
            name: '管理员测试',
            id: '165855012913153'
          },
          {
            name: '测试离开聊天室',
            id: '157338777485313'
          }
        ],
        isFileUpload: false
      }
    },
    methods: {
      joinRoom(roomId) {
        if (this.roomId != roomId && this.roomId != '') {
          // 执行退出聊天室操作
          this.$webIm.quitChatRoom(this.roomId).then((res) => {
            this.roomId = roomId
            this.$webIm
              .joinChatRoom(roomId)
              .then((res) => {
                const curretRoom = this.ltsList.filter(
                  (item) => item.id === this.roomId
                )
                alert('已加入' + curretRoom[0].name + '聊天室')
              })
              .catch((error) => {
                console.warn('joinChatRoom error ================ ', error)
              })
          })
        }
      },
      sendTextMessage() {
        this.$webIm
          .sendTextMessage('163406711685121', this.messageText, {
            chatType: 'chatroom'
          })
          .then((res) => {
            console.log('发送成功回调', res)
            this.messageText = ''
            if (res.code == 0) {
              const msgBody = res.data
              this.msgList.push({
                name: this.userName,
                msg: msgBody.msg,
                msgtype: msgBody.msgType
              })
            }
          })
      },
      // 文件上传
      fileChange(e) {
        const _this = this
        this.$webIm
          .sendFileMessage('163406711685121', e.target, {
            chatType: 'chatroom'
          })
          .then((res) => {
            console.log(res, '===========>', res.data.msgType)
            this.$refs.fileDom.value = null
            this.msgList.push({
              name: _this.userName,
              msg: res.data.fileName,
              msgtype: res.data.msgType,
              url: res.data.url
            })
          })
      },
      // 图片上传
      pictureChange(e) {
        const _this = this
        this.$webIm
          .sendImgMessage('163406711685121', e.target, { chatType: 'chatroom' })
          .then((res) => {
            console.log(res, '===========>', res.data.msgType)
            this.$refs.imgDom.value = null
            this.msgList.push({
              name: _this.userName,
              msg: res.data.fileName,
              msgtype: res.data.msgType,
              url: res.data.url
            })
          })
      },
      // 音频文件
      audioChange(e) {
        const _this = this

        //   this.msgList.push({
        //     name: _this.userName,
        //     msg: '正在发送中',
        //     msgtype: 'AUDIO',
        //     url: '',
        //     isUpload: false
        //   });

        //   let len = this.msgList.length;
        //   let index = len > 0 ? len - 1:0;

        this.$webIm
          .sendAudioMessage('163406711685121', e.target, {
            chatType: 'chatroom',
            onFileUploadProgress: this.onProgress
          })
          .then((res) => {
            this.$refs.audioDom.value = null
            this.msgList.push({
              name: _this.userName,
              msg: res.data.fileName,
              msgtype: res.data.msgType,
              url: res.data.url,
              isUpload: true
            })
            //   this.msgList[index].msg = res.data.fileName;
            //   this.msgList[index].msgtype = res.data.msgType;
            //   this.msgList[index].url = res.data.url;
            //   this.msgList[index].isUpload = true
          })
          .catch((error) => {
            console.log('sendAudioMessage => ', error)
          })
      },
      onProgress(res) {
        const totalSize = res.total
        const curUploadSize = res.loaded
        const progress = parseInt((curUploadSize / totalSize) * 100)
        console.log('文件上传回调 ======> ', res.total, res.loaded, progress)
      },
      // 视频文件
      videoChange(e) {
        const _this = this
        // let file = e.target
        this.$webIm
          .sendVideoMessage('163406711685121', e.target, {
            chatType: 'chatroom'
          })
          .then((res) => {
            console.log(res, '===========>', res.data.msgType)
            this.$refs.videoDom.value = null
            this.msgList.push({
              name: _this.userName,
              msg: res.data.fileName,
              msgtype: res.data.msgType,
              url: res.data.url
            })
            console.log(this.msgList)
          })
      },
      listenReceiveMessage(message) {
        console.log('注册一个消息监听', message)
        if (message.messageBody.contentsType.toLowerCase() == 'text') {
          this.msgList.push({
            name: message.messageBody.from,
            msg: message.messageBody.sourceMsg,
            msgtype: message.messageBody.contentsType
          })
        } else {
          this.msgList.push({
            name: message.messageBody.from,
            msg: message.messageBody.filename,
            msgtype: message.messageBody.contentsType,
            url: message.messageBody.url
          })
        }
      },
      //
      downFile(val) {
        // const blob = new Blob([res.data], { type: "application/xlsx" });
        const a = document.createElement('a')
        a.download = val.msg // 指定下载的文件名
        document.body.appendChild(a)
        a.href = val.url //  URL对象
        a.click() // 模拟点击
        a.remove()
      },
      listenLoginStatus(response) {
        console.log('listenLoginStatus =========> ')
        console.log(message)
      },
      listenOnError(message) {
        console.log('注册一个错误监听')
        console.log(message)
      },
      login() {
        // var account = this.GetQueryString("micro-account");
        // console.log('account => ',account)
        // var pwd = this.GetQueryString("pwd") ? this.GetQueryString("pwd"):"";
        // 腾讯IM用户不需要密码需使用public/debug下的签名工具 签名(需要在文件中替换自己的SDKAPPID)
        // var pwd = window.genTestUserSig(this.userName).userSig;
        this.$webIm.loginTest(this.userName, this.pwd).then((res) => {
          console.log('登录回调 ==> ', res)
          setTimeout(() => {
            this.$webIm.joinChatRoom('163406711685121').then((joinRes) => {
              console.log('加入聊天室成功 ==> ', joinRes)
            })
          }, 600)
        })
      },
      GetQueryString(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
        var r = decodeURI(window.location.search.substr(1)).match(reg)
        if (r != null) return unescape(r[2])
        return null
      }
    },
    mounted() {
      // this.msgList = localStorage.getItem("msgList");//本地缓存历史消息
      this.login()
      this.roomId = this.ltsList[0].id
      this.$webIm.addMessageHanlder('SDK_READY', this.listenLoginStatus)
      this.$webIm.addMessageHanlder(
        'MESSAGE_RECEIVED',
        this.listenReceiveMessage
      )
      this.$webIm.addMessageHanlder('ON_ERROR', this.listenOnError)
    }
  }
</script>

<style scoped>
  .chat {
    width: 100%;
    border: 1px solid black;
  }
  .top {
    width: 100%;
    height: 500px;
    background: rgb(248, 248, 248);
    overflow: scroll;
  }
  .top_img {
    cursor: pointer;
    color: blue;
  }
  .bottom {
    width: 100%;
    height: 178px;
    background: powderblue;
    padding-bottom: 20px;
  }
  .bottom > div {
    text-align: left;
  }
  .bottom > div:nth-child(2) {
    box-sizing: border-box;
    padding: 0 8px;
  }
  textarea {
    width: 99.5%;
    height: 100px;
    resize: none;
  }
  .msgbox {
    text-align: left;
    padding-top: 8px;
    padding-left: 8px;
    box-sizing: border-box;
  }
  .lts {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .lts div {
    background: pink;
    width: 200px;
    height: 34px;
    text-align: center;
    line-height: 34px;
  }
  .top video {
    width: 300px;
    height: 300px;
  }
  .lts .on {
    color: rgba(165, 165, 165, 0.933);
  }
  .bar {
    height: 20px;
    width: 300px;
    background-color: #f5f5f5;
  }
  .bar::before {
    display: block;
    counter-reset: progress var(--percent);
    content: counter(progress) '%\2002';
    width: calc(1% * var(--percent));
    color: #fff;
    background-color: #2486ff;
    text-align: right;
    white-space: nowrap;
    overflow: hidden;
  }
  .progress {
    width: 100px;
    height: 100px;
  }
</style>
