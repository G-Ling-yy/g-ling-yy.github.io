import tim from './lib/tim-js'
import timUploadPlugin from './lib/tim-upload-plugin';
import T from './lib/tim-js-friendship'; 
/**
 * 腾讯IM封装
 * @author 张宏伟
 * @time 2021年11月9日 9:30
 ** */

let tencent = null;
class TimeSdk{
    /**
    * 实例化sdk
    * @param key      Number 接入时需要将0替换为您的云通信应用的 SDKAppID，类型为 Number
    * @returns        object 返回tim实例对象
    **/
    constructor(key){
        tencent = this.initConfig(key)
    }

    initConfig(key){
        if(key){
            //加载腾讯官方sdk
            // 初始化 SDK 实例
            const im = tim.create({
                SDKAppID: key
            })
            // window.setLogLevel = im.setLogLevel
            // 0 普通级别，日志量较多，接入时建议使用
            // 1 release级别，SDK 输出关键信息，生产环境时建议使用
            // 2 告警级别，SDK 只输出告警和错误级别的日志
            // 3 错误级别，SDK 只输出错误级别的日志
            // 4 无日志级别，SDK 将不打印任何日志
            im.setLogLevel(4)
            
            // 注册插件。
            // 即时通信 IM SDK 发送图片、语音、视频、文件等消息需要使用上传插件，将文件上传到腾讯云对象存储。
            im.registerPlugin({ 'tim-upload-plugin': timUploadPlugin });
    
            return im;
        }else{
            console.log("初始化实例失败");
            return null;
        }
    }
    
    /**
    * 登录腾讯im系统
    * @param uid  string 用户id
    * @param ukey string 用户key 本地可用腾讯GenerateTestUserSig工具生成测试key服务器版需后端生成
    * @returns rsponse 登录成功结果回调 ;
    **/
    login(uid,ukey){
        return tencent.login({userID: uid, userSig: ukey});
    }

    /*
     * 登出腾讯im系统
     */
    logout(){
        return tencent.logout();
    }
    /**
    * 发送文本消息
    * @param options 参数容器
    * --- options Properties ----
    * --- to               String 消息接收方的 userID 或 groupID
    * --- conversationType String 会话类型，取值TIM.TYPES.CONV_C2C（端到端会话） 或 TIM.TYPES.CONV_GROUP（群组会话）
    * --- cloudCustomData  cloudCustomData:'your cloud custom data' 消息自定义数据（云端保存，会发送到对端，程序卸载重装后还能拉取到，v2.10.2起支持）
    * --- payload          消息内容参数容器
    * --- payload Properties ----
    * --- msgObj       消息文本内容
    * @returns {message} 消息对象，用于描述一条消息具有的属性，如消息发送状态、类型、消息的内容、所属的会话 ID
    **/
    sendTextMessage(options){
        // 发送文本消息，Web 端与小程序端相同
        // 1. 创建消息实例，接口返回的实例可以上屏
        options.payload.text = options.payload.msgObj;
        let message = tencent.createTextMessage(options);
        // 2. 发送消息
        return tencent.sendMessage(message);
    }

    /**
    * 发送图片消息
    * @param options 参数容器
    * --- options Properties ----
    * --- to               String 消息接收方的 userID 或 groupID
    * --- conversationType String 会话类型，取值TIM.TYPES.CONV_C2C（端到端会话） 或 TIM.TYPES.CONV_GROUP（群组会话）
    * --- cloudCustomData  cloudCustomData:'your cloud custom data' 消息自定义数据（云端保存，会发送到对端，程序卸载重装后还能拉取到，v2.10.2起支持）
    * --- payload          消息内容参数容器
    * --- payload Properties ----
    * --- msgObj       HTMLInputElement | File | Object  用于选择图片的 DOM 节点（Web）或者 File 对象
    * @returns {message} 消息对象，用于描述一条消息具有的属性，如消息发送状态、类型、消息的内容、所属的会话 ID
    **/
    sendImgMessage(options){
        // 1. 创建消息实例，接口返回的实例可以上屏
        options.payload.file = options.payload.msgObj;
        let message = tencent.createImageMessage(options);
        // 2. 发送消息
        return tencent.sendMessage(message);
    }

    /**
    * 发送音频消息
    * @param options 参数容器
    * --- options Properties ----
    * --- to               String 消息接收方的 userID 或 groupID
    * --- conversationType String 会话类型，取值TIM.TYPES.CONV_C2C（端到端会话） 或 TIM.TYPES.CONV_GROUP（群组会话）
    * --- cloudCustomData  cloudCustomData:'your cloud custom data' 消息自定义数据（云端保存，会发送到对端，程序卸载重装后还能拉取到，v2.10.2起支持）
    * --- payload          消息内容参数容器
    * --- payload Properties ----
    * --- msgObj       录音之后得到的文件
    * @returns {message} 消息对象，用于描述一条消息具有的属性，如消息发送状态、类型、消息的内容、所属的会话 ID
    **/
    sendAudioMessage(options){
        // Web 端发送图片消息示例1 - 传入 DOM 节点
        // 1. 创建消息实例，接口返回的实例可以上屏
        options.payload.file = options.payload.msgObj;
        let message = tencent.createAudioMessage(options);
        // 2. 发送消息
        return tencent.sendMessage(message);
    }

    /**
    * 发送视频消息
    * @param options 参数容器
    * --- options Properties ----
    * --- to               String 消息接收方的 userID 或 groupID
    * --- conversationType String 会话类型，取值TIM.TYPES.CONV_C2C（端到端会话） 或 TIM.TYPES.CONV_GROUP（群组会话）
    * --- cloudCustomData  cloudCustomData:'your cloud custom data' 消息自定义数据（云端保存，会发送到对端，程序卸载重装后还能拉取到，v2.10.2起支持）
    * --- payload          消息内容参数容器
    * --- payload Properties ----
    * --- msgObj       HTMLInputElement | File | Object  用于选择图片的 DOM 节点（Web）或者 File 对象
    * @returns {message} 消息对象，用于描述一条消息具有的属性，如消息发送状态、类型、消息的内容、所属的会话 ID
    **/
    sendVideoMessage(options){
        // Web 端发送图片消息示例1 - 传入 DOM 节点
        // 1. 创建消息实例，接口返回的实例可以上屏
        options.payload.file = options.payload.msgObj;
        let message = tencent.createVideoMessage(options);
        // 2. 发送消息
        return tencent.sendMessage(message);
    }

    /**
    * 发送文件消息
    * @param options 参数容器
    * --- options Properties ----
    * --- to               String 消息接收方的 userID 或 groupID
    * --- conversationType String 会话类型，取值TIM.TYPES.CONV_C2C（端到端会话） 或 TIM.TYPES.CONV_GROUP（群组会话）
    * --- cloudCustomData  cloudCustomData:'your cloud custom data' 消息自定义数据（云端保存，会发送到对端，程序卸载重装后还能拉取到，v2.10.2起支持）
    * --- payload          消息内容参数容器
    * --- payload Properties ----
    * --- msgObj       HTMLInputElement | File | Object  用于选择图片的 DOM 节点（Web）或者 File 对象
    * @returns {message} 消息对象，用于描述一条消息具有的属性，如消息发送状态、类型、消息的内容、所属的会话 ID
    **/
    sendFileMessage(options){
        // Web 端发送图片消息示例1 - 传入 DOM 节点
        // 1. 创建消息实例，接口返回的实例可以上屏
        options.payload.file = options.payload.msgObj;
        let message = tencent.createFileMessage(options);
        // 2. 发送消息
        return tencent.sendMessage(message);
    }
    
    /**
    * im监听事件
    * @param {*} handler 接收监听回调自定义函数
    */
    onMessageListener(handler){
        // 登录/登出/SDK NOT READ 会触发 T.EVENT.SDK_READY 事件，该事件触发后，可正常使用 SDK 接口
        tencent.on(T.EVENT.SDK_READY, (response)=>{
            handler({
                messageType: T.EVENT.SDK_READY,
                messageBody: response 
            })
        })
        // T.EVENT.MESSAGE_RECEIVED 收到新消息
        tencent.on(T.EVENT.MESSAGE_RECEIVED, (event)=>{
            handler({
                messageType: T.EVENT.MESSAGE_RECEIVED,
                messageBody: event 
            })
        })
        // TIM.EVENT.CONVERSATION_LIST_UPDATED 会话列表更新
        // TIM.EVENT.NET_STATE_CHANGE 网络监测 
        // TIM.EVENT.MESSAGE_READ_BY_PEER 已读回执
    }

    //  处理器类型
    // messageHanlder = {
    //     'SDK_READY': [], // 腾讯/环信登录登出监听
    //     'MESSAGE_RECEIVED': [], // 腾讯/环信接收新消息方法监听
    //     'ON_ERROR': [],// 腾讯/环信错误信息监听
    // };
    /**
    * 添加处理器
    * @param messageType 处理器函数名称
    * @param messageHanlderIn 自定义函数
    **/
    addMessageHanlder(messageType, messageHanlderIn) {
        console.log("messageType === ", messageType);
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
        instance.onMessageListener((message) => {
            // console.log("接收监听回调 === ", message)
            if (message == null) return;
            let messageTypeParam = message.messageType;
            for (let messageType of Object.keys(this.messageHanlder)) {
                try {
                    if (messageTypeParam === messageType) {
                        let hanlderList = this.messageHanlder[messageTypeParam];
                        if (hanlderList) {
                            for (let hanlder of hanlderList) {
                                try {
                                    hanlder(message);
                                } catch (error) {
                                    hanlder(error);
                                }
                            }
                        }
                    }
                } catch (error) {
                    throw new Error('messageHanlder error ', error);
                }
            }
        });
    }
    /**
    * 统一处理请求参数
    * @param     toUser       String 接收人id或者群组id
    * @param     msgObj       String || File 要发送的消息可以是文本可以是文件对象可以是图片等 
    * @returns   {result}     返回处理之后的通用参数
    **/
    createMessage(toUser, msgObj) {
        return {
            to: toUser,
            conversationType: 'GROUP',//腾讯im 会话类型，C2C- 端到端会话 GROUP- 群组会话(默认)
            cloudCustomData: msgObj,//腾讯im 消息自定义数据（云端保存，会发送到对端，程序卸载重装后还能拉取到，v2.1success.2起支持）
            roomType: true,
            payload: {
                msgObj: msgObj
            }
        };
    }
}

export default TimeSdk;