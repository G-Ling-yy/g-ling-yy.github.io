import businessApi from "./api/business-api";
/**
 * <MicroVideoIm> 插件封装
 *
 * @author 张宏伟
 * @time   2021年11月9日 16:30
 *
 * 插件使用方式(以vue为例)
 * import webIm from './microVideoIm-sdk/index';
 * Vue.use(webIm,{
 *        key: "1139211024231272#lxs",
 *        type: 'easemob-web' //以环信webIm为例
 *        ......
 * })
 *
 * xxx.vue
 * //从bussiness 登录业务接口中获取用户名和key
 * this.$webIm.loginSys(......).then((res)=>{
 *   // 登录环信或腾讯im成功自动启动监听
 *   // localStorage.SetItem('rooms', res.rooms);//多个聊天室根据业务需求自行处理本demo以单个聊天室为例
 *   localStorage.SetItem('roomId', res.roomId);
 *   this.$webIm.loginIm(res.uid,res.key).then((response)=>{
 *        ......
 *   })
 * })
 * //添加自定义处理器
 * this.$webIm.addMessageHanlder('SDK_READY',this.listenLoginStatus) //监听登录状态回调
 * this.$webIm.addMessageHanlder('MESSAGE_RECEIVED',this.listenReceiveMessage) //监听接收新消息回调
 * ......
 *
 * //发送信息
 * <textarea  type="text" placeholder="请输入内容" v-model="messageText"/>
 * <button @click="sendTextMessage">发送</button>
 * sendTextMessage(){
 *   let roomId = localStorage.getItem('roomId');
 *   this.$webIm.sendTextMessage(roomId,this.messageText).then((res)=>{
 *       ......
 *   })
 * }
 * ......
 *
 ** */

let instance = null; //存储im实例

/**
 * 统一处理请求参数
 * @param   toUser   String               接收人id || 群组id || 聊天室id
 * @param   msgObj   String || File       发送的消息内容可以是文本可以是对象可以是文件对象可以是图片等
 * @param   options  扩展参数容器
 *  -----   options Properties    -----
 *  -----   chatType             String   聊天类型 concat|group|chatroom  单人|群组|聊天室 腾讯没有聊天室所以不支持chatroom
 *  -----   onFileUploadError    function 文件上传失败的回调
 *  -----   onFileUploadProgress function 文件上传进度的回调
 *  -----   onFileUploadComplete function 文件上传成功的回调
 * @returns OBJECT                        返回处理之后的通用JSON格式对象
 **/

function createMessage(toUser, msgObj, options = {}) {
  //对发送消息参数进行处理
  const {
    chatType,
    onFileUploadError,
    onFileUploadProgress,
    onFileUploadComplete,
  } = options;
  return {
    msg: msgObj,
    to: toUser,
    chatType: chatType,
    onFileUploadError: onFileUploadError, //消息上传失败回调
    onFileUploadProgress: onFileUploadProgress, // 消息上传进度的回调
    onFileUploadComplete: onFileUploadComplete, // 消息上传成功回调
  };
}

/**
 * 初始化im
 * @param  options  OBJECT  初始化参数容器
 *  -----  options Properties  -----
 *  -----  key     String   腾讯应用appid 必须为Number类型 或者 环信应用appkey 必须为String类型
 *  -----  type    String   easemob-web 环信Web
 *                          easemob-xcx 环信小程序
 *                          tencent-web 腾讯Web
 *                          tencent-xcx 腾讯小程序
 * @returns object          返回腾讯或环信im实例
 * @throws  error           程序初始化失败异常信息
 **/

function init(options) {
  try {
    if (options.type === "easemob-web" && options.baseUrl != "") {
      logger("easemob-web init", JSON.stringify(options));
      let eim = require("./easemob-sdk/easemob-web-sdk");
      return new eim.default(options.key); //初始化环信im
    } else if (options.type === "easemob-xcx" && options.baseUrl != "") {
      logger("easemob-xcx init", JSON.stringify(options));
      let eim = require("./easemob-sdk/easemob-xcx-sdk");
      return new eim.default(options.key); //初始化环信im
    } else if (options.type === "tencent-web" && options.baseUrl != "") {
      logger("tencent-web init", JSON.stringify(options));
      let tim = require("./tencent-sdk/tim-web-sdk");
      return new tim.default(options.key); //初始化腾讯im
    } else if (options.type === "tencent-xcx" && options.baseUrl != "") {
      logger("tencent-xcx init", JSON.stringify(options));
      let tim = require("./tencent-sdk/tim-xcx-sdk");
      return new tim.default(options.key); //初始化腾讯im
    }
    logger("init-error", "初始化参数有误", 1);
    throw new Error("init-error：, 初始化参数有误");
  } catch (error) {
    logger("init-error", error, 1);
    throw new Error("init-error: ", error);
  }
}

/**
 * 对齐毫秒字符串
 * @param   {*}    ms  毫秒
 * @returns String 对齐后的毫秒时间字符串
 **/

function padMs(ms) {
  const len = ms.toString().length;
  let ret;
  switch (len) {
    case 1:
      ret = `00${ms}`;
      break;
    case 2:
      ret = `0${ms}`;
      break;
    default:
      ret = ms;
      break;
  }
  return ret;
}

/**
 * log输出前缀
 * @param   method    String         方法名
 * @param   printData String||OBJECT 输出的数据
 * @param   type      Number         输出类型 0 默认输出 1错误输出
 * @returns {String}  日志前缀
 **/

function logger(method, printData = {}, type = 0) {
  const date = new Date();
  if (type === 0)
    console.log(
      `<MicroVideoIm> ${method} ${date.toLocaleTimeString("en-US", {
        hour12: false,
      })}.${padMs(date.getMilliseconds())} => ${printData} `
    );
  else
    console.warn(
      `<MicroVideoIm> ${method} ${date.toLocaleTimeString("en-US", {
        hour12: false,
      })}.${padMs(date.getMilliseconds())} => ${printData} `
    );
}

class socketApi {
  constructor(options) {
    console.log(options.baseUrl);
    this.baseUrl = options.baseUrl;
    //初始化api参数
    instance = init(options);
  }

  /**
   * 自定义处理器
   **/
  messageHanlder = {
    SDK_READY: [], // 腾讯/环信登录登出监听
    MESSAGE_RECEIVED: [], // 腾讯/环信接收新消息方法监听
    ON_ERROR: [], // 腾讯/环信错误信息监听
  };

  /**
   * 登录im系统(demo测试用)
   * @param   uid        string   用户id
   * @param   ukey       string   用户key 腾讯本地可用GenerateTestUserSig工具生成测试key 服务器需获取后端生成得key
   * @returns promise             返回Promise对象 {code,data,message}
   **/
  async loginTest(uid, ukey) {
    return new Promise((resolve, reject) => {
      instance
        .login(uid, ukey)
        .then((response) => {
          logger(
            "scoket-api-login-success startListner",
            JSON.stringify(response)
          );
          if (response.code == 0) {
            logger(
              "scoket-api-login-success startListner",
              JSON.stringify(response)
            );
            this.startListner(); //启动监听
            resolve(response);
          } else {
            logger("scoket-api-login-error", JSON.stringify(error), 1);
            reject(error);
          }
        })
        .catch((error) => {
          logger("scoket-api-login-error", JSON.stringify(error), 1);
          reject(error);
        });
    });
  }

  /**
   * 登录im系统
   * @param   uid        string   用户id
   * @param   ukey       string   用户key 腾讯本地可用GenerateTestUserSig工具生成测试key 服务器需获取后端生成得key
   * @returns promise             返回Promise对象 {code,data,message}
   **/
  async login() {
    return new Promise((resolve, reject) => {
      businessApi
        .getUserInfo(this.baseUrl)
        .then((res) => {
          logger("request-api-getUserInfo-success", JSON.stringify(res));
          instance
            .login(res.data.uid, res.data.ukey)
            .then((response) => {
              if (response.code == 0) {
                logger(
                  "scoket-api-login-success startListner",
                  JSON.stringify(response)
                );
                this.startListner(); //启动监听
                resolve(response);
              } else {
                logger("scoket-api-login-error", JSON.stringify(error), 1);
                reject(error);
              }
            })
            .catch((error) => {
              logger("scoket-api-login-error", JSON.stringify(error), 1);
              reject(error);
            });
        })
        .catch((error) => {
          logger("request-api-login-error", JSON.stringify(error), 1);
          reject(error);
        });
    });
  }

  /**
   * 登出im系统
   * @returns promise 返回Promise对象 {......};
   **/
  async logout() {
    logger("scoket-api-logout");
    return await instance.logout();
  }

  /**
   * 环信im专用api加入聊天室
   * @param   roomId  String   聊天室id
   * @retruns promise          返回Promise对象 {code,data,message};
   **/
  joinChatRoom(roomId) {
    return new Promise((resolve, reject) => {
      instance
        .joinChatRoom(roomId)
        .then((response) => {
          if (response.code == 0) {
            logger("scoket-api-joinChatRoom success", JSON.stringify(response));
            resolve(response);
          } else {
            logger(
              "scoket-api-joinChatRoom error",
              JSON.stringify(response),
              1
            );
            reject(response);
          }
        })
        .catch((error) => {
          logger("scoket-api-joinChatRoom error", JSON.stringify(error), 1);
          reject(error);
        });
    });
  }

  /**
   * 环信im专用api退出聊天室
   * @param   roomId  String    聊天室id
   * @returns promise           返回Promise对象 {code,data,message};
   **/
  quitChatRoom(roomId) {
    return new Promise((resolve, reject) => {
      instance
        .quitChatRoom(roomId)
        .then((response) => {
          if (response.code == 0) {
            logger("scoket-api-quitChatRoom success", JSON.stringify(response));
            resolve(response);
          } else {
            logger("scoket-api-quitChatRoom error", JSON.stringify(error), 1);
            reject(response);
          }
        })
        .catch((error) => {
          logger("scoket-api-quitChatRoom error", JSON.stringify(error), 1);
          reject(error);
        });
    });
  }

  /**
   * 发送消息
   * @param   toUser    String 消息接收对象 userId或者roomId
   * @param   msgObj    String || File || OBJECT 发送的消息类型支持字符串、图片、音视频文件、文件等类型
   * @returns promise   返回Promise对象 {code,data,message}
   **/
  sendMessage(toUser, msgObj, options = {}) {
    return new Promise((resolve, reject) => {
      instance
        .sendTextMessage(createMessage(toUser, msgObj, options))
        .then((response) => {
          logger("scoket-api-sendMessage success", JSON.stringify(response));
          resolve(response);
        })
        .catch((error) => {
          logger("scoket-api-sendMessage error", JSON.stringify(error), 1);
          reject(error);
        });
    });
  }

  /**
   * 发送文本消息
   * @param   toUser    String 消息接收对象 userId或者groupId
   * @param   msg       String || OBJECT 发送的字符串类型消息
   * @returns promise   返回Promise对象 {code,data,message}
   **/
  sendTextMessage(toUser, msg, options = {}) {
    return new Promise((resolve, reject) => {
      instance
        .sendTextMessage(createMessage(toUser, msg, options))
        .then((response) => {
          if (response.code == 0) {
            logger(
              "scoket-api-sendTextMessage success",
              JSON.stringify(response)
            );
            resolve(response);
          } else {
            logger(
              "scoket-api-sendTextMessage error",
              JSON.stringify(response)
            );
            reject(response);
          }
        })
        .catch((error) => {
          logger("scoket-api-sendTextMessage error", JSON.stringify(error), 1);
          reject(error);
        });
    });
  }

  /**
   * 发送图片消息
   * @param   toUser    String   消息接收对象 userId或者groupId
   * @param   imgFile   File     图片格式的消息对象
   * @returns promise   返回Promise对象 {code,data,message}
   **/
  sendImgMessage(toUser, imgFile, options) {
    return new Promise((resolve, reject) => {
      instance
        .sendImgMessage(createMessage(toUser, imgFile, options))
        .then((response) => {
          if (response.code === 0) {
            logger(
              "scoket-api-sendImgMessage success",
              JSON.stringify(response)
            );
            resolve(response);
          } else {
            logger(
              "scoket-api-sendImgMessage error",
              JSON.stringify(response),
              1
            );
            reject(response);
          }
        })
        .catch((error) => {
          logger("scoket-api-sendImgMessage error", JSON.stringify(error), 1);
          reject(error);
        });
    });
  }

  /**
   * 发送音频文件消息
   * @param   toUser      String 消息接收对象 userId或者roomId
   * @param   audioFile   File   音频格式的文件对象
   * @returns promise   返回Promise对象 {code,data,message}
   **/
  sendAudioMessage(toUser, audioFile, options) {
    return new Promise((resolve, reject) => {
      instance
        .sendAudioMessage(createMessage(toUser, audioFile, options))
        .then((response) => {
          if (response.code === 0) {
            logger(
              "scoket-api-sendAudioMessage success",
              JSON.stringify(response)
            );
            resolve(response);
          } else {
            logger(
              "scoket-api-sendAudioMessage error",
              JSON.stringify(response),
              1
            );
            reject(response);
          }
        })
        .catch((error) => {
          logger("scoket-api-sendAudioMessage error", JSON.stringify(error), 1);
          reject(error);
        });
    });
  }

  /**
   * 发送视频文件消息
   * @param   toUser      String 消息接收对象 userId或者groupId
   * @param   videoFile   File   视频格式的文件对象
   * @returns promise     返回Promise对象 {code,data,message}
   **/
  sendVideoMessage(toUser, videoFile, options) {
    return new Promise((resolve, reject) => {
      instance
        .sendVideoMessage(createMessage(toUser, videoFile, options))
        .then((response) => {
          if (response.code === 0) {
            logger(
              "scoket-api-sendVideoMessage success",
              JSON.stringify(response)
            );
            resolve(response);
          } else {
            logger(
              "scoket-api-sendVideoMessage error",
              JSON.stringify(response)
            );
            reject(response);
          }
        })
        .catch((error) => {
          logger("scoket-api-sendVideoMessage error", JSON.stringify(error));
          reject(error);
        });
    });
  }

  /**
   * 发送文件消息
   * @param   toUser      String 消息接收对象 userId或者groupId
   * @param   fileObj     File   任意格式的文件对象
   * @returns promise     返回Promise对象 {code,data,message}
   **/
  sendFileMessage(toUser, fileObj, options) {
    return new Promise((resolve, reject) => {
      instance
        .sendFileMessage(createMessage(toUser, fileObj, options))
        .then((response) => {
          if (response.code === 0) {
            logger(
              "scoket-api-sendFileMessage success",
              JSON.stringify(response)
            );
            resolve(response);
          } else {
            logger(
              "scoket-api-sendFileMessage error",
              JSON.stringify(response),
              1
            );
            reject(response);
          }
        })
        .catch((error) => {
          logger("scoket-api-sendFileMessage error", JSON.stringify(error), 1);
          reject(error);
        });
    });
  }

  /**
   * 添加处理器
   * @param messageType      处理器函数名称
   * @param messageHanlderIn 自定义函数
   **/
  addMessageHanlder(messageType, messageHanlderIn) {
    logger("addMessageHanlder", { messageType, messageHanlderIn });
    let hanlderList = this.messageHanlder[messageType];
    if (hanlderList == null) {
      hanlderList = [];
      this.messageHanlder[messageType] = hanlderList;
    }
    hanlderList.push(messageHanlderIn);
  }

  /**
   * 启动监听
   **/
  startListner() {
    logger("startListner is start");
    instance.onMessageListener((message) => {
      if (message == null) return;
      for (let messageType of Object.keys(this.messageHanlder)) {
        if (messageType === message.messageType) {
          let hanlderList = this.messageHanlder[message.messageType];
          if (hanlderList) {
            for (let hanlder of hanlderList) {
              try {
                hanlder(message);
              } catch (error) {
                logger(
                  "onMessageListener " + messageType + " error",
                  JSON.stringify(message),
                  1
                );
              }
            }
          }
        }
      }
    });
  }
}

function createSocket(options) {
  return new socketApi(options);
}

export default createSocket;
