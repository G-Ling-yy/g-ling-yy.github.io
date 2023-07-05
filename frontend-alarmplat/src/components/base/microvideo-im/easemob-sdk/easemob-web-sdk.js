import easemob from './lib/easemob-chat'
/**
* 环信IM聊天功能封装
* @author 张喜津
* @time  2021/11/09
**/

const rtc = {
	// 用来放置本地客户端。
	client: null,
	// 用来放置本地音视频频轨道对象。
	localAudioTrack: null,
	localVideoTrack: null,
};

let config = {
    /*
     * 应用 AppKey
     */
    //appkey:"gdpwq123#ceshi",1139211024231272#lxs  easemob-demo#easeim
    appkey: "",
    /*
     * 应用主机地址
     */
    Host: "easemob.com",
    /*
     * 是否开启https支持
     */
    https: true,
    /*
     * 公有云配置默认为 true，
     * 私有云配置请设置 isHttpDNS = false , 详细文档：http://docs-im.easemob.com/im/web/other/privatedeploy
     * */
    isHttpDNS: true,
    /*
     * isMultiLoginSessions
     * 是否开启 访问者可以登录多个网页并在所有网页上接收消息。
     */
    isMultiLoginSessions: false,
    /**
     * 是否使用 window.doQuery()
     * @parameter {Boolean} true or false
     */
    isWindowSDK: false,
    /**
     * @parameter {Boolean} true or false
     */
    isSandBox: false,// 内部测试环境，集成时设为false
    /**
     * 是否开启调试
     * @parameter {Boolean} true or false
     */
    isDebug: true,
    /**
     * 是否strophe显示日志
     * @parameter {Boolean} true or false
     */
    isStropheLog: false,
    /**
     * 当客户端断开连接时，将在后台自动连接xmpp服务器的次数。
     * won't auto connect if autoReconnectNumMax=0.
     */
    autoReconnectNumMax: 5,
    /**
     * 每次重新连接服务的时间间隔
     * works only if autoReconnectMaxNum >= 2.
     */
    autoReconnectInterval: 2,
    /**
     * 是否开启视频会议支持 supports WebKit and https only
     */
    isWebRTC: true,//window.RTCPeerConnection && /^https\:$/.test(window.location.protocol),
    /**
     *  cn: chinese
     *  us: english
     */
    i18n: "us",
    /*
     * 设置自动登录
     * Set to auto sign-in
     */
    isAutoLogin: true,
    /**
     * 个人聊天 消息缓存大小
     */
    p2pMessageCacheSize: 500,
    /**
     * 开启监听通知接收人送达新消息
     * See call back function onReceivedMessage
     */
    delivery: true,
    /**
     * 群组聊天（如群组、聊天室等）的消息缓存大小
     */
    groupMessageCacheSize: 200,
    /**
     * 5 actual logging methods, ordered and available:
     * 'TRACE', 'DEBUG', 'INFO', 'WARN', 'ERROR'
     */

    loglevel: "ERROR",

    /**
     * 开启本地缓存历史消息
     * enable localstorage for history messages
     */
    enableLocalStorage: true,

    AgoraAppId: '15cb0d28b87b425ea613fc46f7c9f974'
    /* 需要替换成自己的声网 appId，此 appId 有限量，仅供参考使用，同时获取声网 token 的接口仅能供此 appId 使用，换成自己的 appId 后需要自己去实现 app server 获取声网token。 */
}

let WebIM = {}

function initConfig(appKey) {
    try{
        WebIM = easemob;
        WebIM.config = config;
        config.appkey = appKey;
        WebIM.conn = new easemob.connection({
            appKey: WebIM.config.appkey,
            isMultiLoginSessions: WebIM.config.isMultiLoginSessions,
            https: WebIM.config.https,
            isAutoLogin: true,
            heartBeatWait: WebIM.config.heartBeatWait,
            autoReconnectNumMax: WebIM.config.autoReconnectNumMax,
            autoReconnectInterval: WebIM.config.autoReconnectInterval,
            isStropheLog: WebIM.config.isStropheLog,
            delivery: WebIM.config.delivery,
            //公有云 isHttpDNS 默认配置为true
            isHttpDNS: WebIM.config.isHttpDNS,
        })
        // WebIM.WebRTC = window.webrtc; // 本项目引入 UMD 文件有问题，暂时这样引入
        // WebIM.EMedia = window.emedia;
        // WebIM.AgoraRTC = AgoraRTC;
        // WebIM.rtc = rtc;
        return WebIM;
    }catch(error){
        console.log('错误信息 => ',error)
        return null;
    }
}

/**
 * 处理响应结果
 * @param {*} status  执行状态码 0: 执行成功 1: 执行失败
 * @param {*} data    sdk执行响应结果
 * @param {*} options 扩展参数 接收文件上传回调
 * @returns response  返回处理之后的JSON对象
 */
function createResponse(status,data,options = {}){
    let response = {
        code: status,
        data: data,
        message: status === 0 ? '操作成功':'操作失败'
    }
    let {onFileUploadError,onFileUploadProgress,onFileUploadComplete} = options;
    if(typeof onFileUploadError == 'function'){
        response.onFileUploadError = onFileUploadError;
    }
    if(typeof onFileUploadProgress == 'function'){
        response.onFileUploadProgress = onFileUploadProgress;
    }
    if(typeof onFileUploadComplete == 'function'){
        response.onFileUploadComplete = onFileUploadComplete;
    }
    return response;
}

/**
 * 格式化时间
 * @returns {String} 返回处理之后的时间
 */
function GetDateTimeToString() {
    var date_ = new Date();
    var year = date_.getFullYear();
    var month = date_.getMonth() + 1;
    var day = date_.getDate();
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;

    var hours = date_.getHours();
    var mins = date_.getMinutes();
    var secs = date_.getSeconds();
    var msecs = date_.getMilliseconds();
    if (hours < 10) hours = "0" + hours;
    if (mins < 10) mins = "0" + mins;
    if (secs < 10) secs = "0" + secs;
    if (msecs < 10) secs = "0" + msecs;
    return year + "/" + month + "/" + day + " " + hours + ":" + mins;
}

const successCode = 0;
const errorCode = 0;

class EasemobApi {

    /**
     * @param easemob object 环信im对象实例
     * @param appKey string 环信im 通信应用的 appKey 需要去官网申请
     */
    constructor(appKey) {
        // this.easemob = easemob;
        // this.appKey = appKey;
        // console.log(easemob, appKey,"989786789")
        WebIM = initConfig(appKey);
        // console.log(WebIM)
    }

    /**
    * 用户登录接口
    * @param user 用户名
    * @param pwd 用户密码，跟token二选一
    * @returns {message} 用户信息对象，access-token接口调用凭证
    **/
    login(user, pwd) {
        return new Promise((resolve, reject)=>{
            var options = {
                user: user,
                pwd: pwd,
                appKey: WebIM.config.appkey,
                apiUrl: 'https://a1.easecdn.com',
                success: function(res){
                    resolve(createResponse(successCode,res))
                },
                fail: function(error){
                    reject(createResponse(errorCode,error))
                }
            };
            WebIM.conn.open(options);
        })
    }

    /**
    * 加入聊天室
    * @param roomId string参数 聊天室（id）
    * @returns      操作结果
    **/
    joinChatRoom(roomId) {
        return new Promise((resolve, reject)=>{
            WebIM.conn.joinChatRoom({
                roomId: roomId,
                success: function (res) {
                    resolve(createResponse(successCode,res.data));
                },
                fail: function (error) {
                    reject(createResponse(errorCode,error));
                }
            });
        })
        
    }

    /**
    * 退出聊天室
    * @param roomId string参数 聊天室（id）
    * @returns      操作结果
    **/
    quitChatRoom(roomId){
        return new Promise((resolve, reject)=>{
            WebIM.conn.quitChatRoom({
                roomId: roomId, // 聊天室id
                success: function (res) {
                    resolve(createResponse(successCode,res));
                },
                fail: function (error) {
                    reject(createResponse(errorCode,error));
                }
            });
        }) 
    }

    /**
    * 用户登出接口 无需传参 直接调用方法即可
    **/
    logout() {
        return WebIM.conn.close()
    }

    /**
    * 发送图片信息接口
    * @param options 参数容器
    * ------ options Properties ------
    * -- chatType   string参数 聊天类型  用于设置当前聊天模式为单聊、群聊（groupChat）、聊天室（chatRoom），不设置默认为单聊
    * -- to         string参数 接收消息对象（id） 
    * -- roomType   boolean参数 是否多人聊天类型 
    * -- file       文件主体 用于选择视频文件的 DOM 节点（Web）
    * -- ext        object参数 扩展消息，可以没有这个字段，但是如果有，值不能是“ext:null”这种形式，否则出错
    * -- onFileUploadError 消息上传失败回调
    * -- onFileUploadProgress 上传进度的回调
    * -- onFileUploadComplete 消息上传成功
    * -- success 信息发送成功回调，sdk会将消息id登记到日志进行备份处理
    * -- fail    信息发送失败回调且如禁言、拉黑后发送消息会失败，sdk会将消息id登记到日志进行备份处理
    * @returns {message} 消息对象，如消息发送状态、接受对象ID、消息id
    **/
    sendImgMessage(options) {
        return new Promise((resolve, reject)=>{
            let file = WebIM.utils.getFileUrl(options.msg);
            const id = WebIM.conn.getUniqueId();
            const msgObj = new WebIM.message("img", id);
            msgObj.set({
                file: file,
                to: options.to,
                chatType: options.chatType,
                roomType: options.chatType == "chatroom"?true:false,
                onFileUploadError: function(e){
                    if(typeof options.onFileUploadError === 'function'){
                        options.onFileUploadError(e)
                    } 
                },
                onFileUploadProgress: function(e){
                    if(typeof options.onFileUploadProgress === 'function'){
                        options.onFileUploadProgress(e)
                    }
                },
                onFileUploadComplete: function(e){
                    if(typeof options.onFileUploadComplete === 'function'){
                        options.onFileUploadComplete(e)
                    }
                },
                success: function (e) {
                    //消息发送成功之后环信只返回了一个messageId
                    options.sendTime = GetDateTimeToString();
                    options.msgType = "IMAGE";
                    options.url=msgObj.body.body.url
                    options.fileName=msgObj.body.file.filename
                    resolve(createResponse(successCode,options))
                },
                fail: function (error) {
                    reject(createResponse(errorCode,error))
                }
            });
            console.log(msgObj.body)
            WebIM.conn.send(msgObj.body);
        });
    }

    /**
    * 发送文件信息接口
    * @param options 参数容器
    * ------ options Properties ------
    * -- chatType   string参数 聊天类型  用于设置当前聊天模式为单聊、群聊（groupChat）、聊天室（chatRoom），不设置默认为单聊
    * -- to         string参数 接收消息对象（id） 
    * -- roomType   boolean参数 是否多人聊天类型 
    * -- file       文件主体 用于选择视频文件的 DOM 节点（Web）
    * -- ext        object参数 扩展消息，可以没有这个字段，但是如果有，值不能是“ext:null”这种形式，否则出错
    * -- onFileUploadError 消息上传失败回调
    * -- onFileUploadProgress 上传进度的回调
    * -- onFileUploadComplete 消息上传成功
    * -- success 信息发送成功回调，sdk会将消息id登记到日志进行备份处理
    * -- fail    信息发送失败回调且如禁言、拉黑后发送消息会失败，sdk会将消息id登记到日志进行备份处理
    * @returns {message} 消息对象，如消息发送状态、接受对象ID、消息id
    **/
    sendFileMessage(options) {
        return new Promise((resolve, reject)=>{
            let file = WebIM.utils.getFileUrl(options.msg);
            const id = WebIM.conn.getUniqueId();
            const msgObj = new WebIM.message("file", id);
            msgObj.set({
                file: file,
                to: options.to,
                chatType: options.chatType,
                roomType: options.chatType == "chatroom"?true:false,
                onFileUploadError: function(e){
                    if(typeof options.onFileUploadError === 'function'){
                        options.onFileUploadError(e)
                    } 
                },
                onFileUploadProgress: function(e){
                    if(typeof options.onFileUploadProgress === 'function'){
                        options.onFileUploadProgress(e)
                    }
                },
                onFileUploadComplete: function(e){
                    if(typeof options.onFileUploadComplete === 'function'){
                        options.onFileUploadComplete(e)
                    }
                },
                success: function (e) {
                    options.sendTime = GetDateTimeToString();
                    options.msgType = "FILE";
                    options.url=msgObj.body.body.url
                    options.fileName=msgObj.body.file.filename
                    resolve(createResponse(successCode,options))
                },
                fail: function (error) {
                    reject(createResponse(errorCode,error))
                }
            });
            console.log(msgObj.body)
            WebIM.conn.send(msgObj.body);
        }) 
    }

    /**
    * 发送文本消息
    * @param options 参数容器
    * --- options Properties ----
    * --- to               String 消息接收方的 userID 或 groupID
    * --- chatType         String 'chatroom' 聊天室聊天
    * --- msg          消息内容参数容器
    * @returns {message}   消息对象，用于描述一条消息具有的属性，如消息发送状态、类型、消息的内容、所属的会话 ID  
    * 
    **/
    sendTextMessage(options) {
        return new Promise((resolve, reject)=>{
            const id = WebIM.conn.getUniqueId();
            const msgObj = new WebIM.message("txt", id);
            if(typeof options.msg == 'object'){
                options.msg = JSON.stringify(options.msg)
            }
            msgObj.set({
                msg: options.msg,
                to: options.to,
                chatType: options.chatType,
                roomType: options.chatType == "chatroom"?true:false,
                success: function (e) {
                    options.sendTime = GetDateTimeToString();
                    options.msgType = "TEXT";
                    resolve(createResponse(successCode,options))
                },
                fail: function (error) {
                    reject(createResponse(errorCode,error))
                }
            });
            WebIM.conn.send(msgObj.body);
        })
    }

    /**
    * 发送文件信息接口
    * @param options 参数容器
    * ------ options Properties ------
    * -- chatType   string参数 聊天类型  用于设置当前聊天模式为单聊、群聊（groupChat）、聊天室（chatRoom），不设置默认为单聊
    * -- to         string参数 接收消息对象（id） 
    * -- roomType   boolean参数 是否多人聊天类型 
    * -- file       文件主体 用于选择视频文件的 DOM 节点（Web）
    * -- ext        object参数 扩展消息，可以没有这个字段，但是如果有，值不能是“ext:null”这种形式，否则出错
    * -- length 音频文件时长，单位(s) string参数
    * -- onFileUploadError 消息上传失败回调
    * -- onFileUploadProgress 上传进度的回调
    * -- onFileUploadComplete 消息上传成功
    * -- success 信息发送成功回调，sdk会将消息id登记到日志进行备份处理
    * -- fail    信息发送失败回调且如禁言、拉黑后发送消息会失败，sdk会将消息id登记到日志进行备份处理
    * @returns {message} 消息对象，如消息发送状态、接受对象ID、消息id
    **/
    sendAudioMessage(options) {
        return new Promise((resolve, reject)=>{
            let file = WebIM.utils.getFileUrl(options.msg);
            const id = WebIM.conn.getUniqueId();
            const msgObj = new WebIM.message("audio", id);
            msgObj.set({
                file: file,
                to: options.to,
                chatType: options.chatType,
                roomType: options.chatType == "chatroom"?true:false,
                onFileUploadError: function(e){
                    if(typeof options.onFileUploadError === 'function'){
                        options.onFileUploadError(e)
                    }   
                },
                onFileUploadProgress: function(e){
                    if(typeof options.onFileUploadProgress === 'function'){
                        options.onFileUploadProgress(e)
                    }
                },
                onFileUploadComplete: function(e){
                    if(typeof options.onFileUploadComplete === 'function'){
                        options.onFileUploadComplete(e)
                    }
                },
                success: function (e) {
                    //消息发送成功之后环信只返回了一个messageId
                    options.sendTime = GetDateTimeToString();
                    options.msgType = "VOICE";
                    options.url=msgObj.body.body.url
                    options.fileName=msgObj.body.file.filename
                    resolve(createResponse(successCode,options))
                },
                fail: function (error) {
                    reject(createResponse(errorCode,error))
                }
            });
            console.log(msgObj.body)
            WebIM.conn.send(msgObj.body);
        });
    }

    /**
    * 发送视频消息接口
    * @param options 参数容器
    * ------ options Properties ------
    * -- chatType   string参数 聊天类型  用于设置当前聊天模式为单聊、群聊（groupChat）、聊天室（chatRoom），不设置默认为单聊
    * -- to         string参数 接收消息对象（id） 
    * -- roomType   boolean参数 是否多人聊天类型 
    * -- file       文件主体 用于选择视频文件的 DOM 节点（Web）
    * -- ext        object参数 扩展消息，可以没有这个字段，但是如果有，值不能是“ext:null”这种形式，否则出错
    * -- onFileUploadError 消息上传失败回调
    * -- onFileUploadProgress 上传进度的回调
    * -- onFileUploadComplete 消息上传成功
    * -- success 信息发送成功回调，sdk会将消息id登记到日志进行备份处理
    * -- fail    信息发送失败回调且如禁言、拉黑后发送消息会失败，sdk会将消息id登记到日志进行备份处理
    * @returns {message} 消息对象，如消息发送状态、接受对象ID、消息id
    **/
    sendVideoMessage(options) {
        return new Promise((resolve, reject)=>{
            let file = WebIM.utils.getFileUrl(options.msg);
            const id = WebIM.conn.getUniqueId();
            const msgObj = new WebIM.message("video", id);
            msgObj.set({
                file: file,
                to: options.to,
                chatType: options.chatType,
                roomType: options.chatType == "chatroom"?true:false,
                onFileUploadError: function(e){
                    if(typeof options.onFileUploadError === 'function'){
                        options.onFileUploadError(e)
                    } 
                },
                onFileUploadProgress: function(e){
                    if(typeof options.onFileUploadProgress === 'function'){
                        options.onFileUploadProgress(e)
                    }
                },
                onFileUploadComplete: function(e){
                    if(typeof options.onFileUploadComplete === 'function'){
                        options.onFileUploadComplete(e)
                    }
                },
                success: function (e) {
                    //消息发送成功之后环信只返回了一个messageId
                    options.sendTime = GetDateTimeToString();
                    options.msgType = "VIDEO";
                    options.url=msgObj.body.body.url
                    options.fileName=msgObj.body.file.filename
                    resolve(createResponse(successCode,options))
                },
                fail: function (error) {
                    reject(createResponse(errorCode,error))
                }
            });
            WebIM.conn.send(msgObj.body);
        });
    }

    /**
    * 处理图片、文件、文本新消息的监听
    * @param hanlder  function 接收监听回调函数
    */
    onMessageListener(hanlder) {
        WebIM.conn.listen({
            onTextMessage: (response) => {
                hanlder({
                    messageType: "MESSAGE_RECEIVED",
                    messageBody: response
                });
            },
            onPictureMessage: (response) => {
                hanlder({
                    messageType: "MESSAGE_RECEIVED",
                    messageBody: response
                });
            },
            onFileMessage: (response) => {
                hanlder({
                    messageType: "MESSAGE_RECEIVED",
                    messageBody: response
                });
            },
            onAudioMessage: (response) => {
                hanlder({
                    messageType: "MESSAGE_RECEIVED",
                    messageBody: response
                });
            },
            onVideoMessage: (response) => {
                hanlder({
                    messageType: "MESSAGE_RECEIVED",
                    messageBody: response
                });
            },
            onOpened: (response) => {
                hanlder({
                    messageType: "SDK_READY",
                    messageBody: response
                });
            },
            onError: function(message){
            },
            onClosed: function (message) {
            } // 连接关闭回调
        })
    }
}
export default EasemobApi;