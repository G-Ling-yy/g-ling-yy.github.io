
/**
 * 环信IM聊天功能封装
 *
 * 小程序版本
 *
 * @author 张喜津
 * @since  2021/11/09
 **/
class EasemobApi {
    /**
     * @param easemob object 环信im对象实例
     * @param appKey string 环信im 通信应用的 appKey 需要去官网申请
     */
    constructor(appKey) {
        console.log("初始化",appKey);
    }
    /**
    * 用户登录接口
    * @param user 用户名
    * @param pwd 用户密码，跟token二选一
    * @returns {message} 用户信息对象，access-token接口调用凭证
    **/
    login(user, pwd) {
        console.log("登录")
    }
    /**
    * 发送图片信息接口
    * @param options 参数容器
    * ------ options Properties ------
    * -- to         string参数 接收消息对象（id） 
    * @returns      操作结果
    **/
    joinChatRoom(options) {
        console.log("聊天室参数 ", options);
    }
    /**
    * 用户登出接口 无需传参 直接调用方法即可
    **/
    logout() {
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
        console.log("发送图片信息接口 ", options);
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
        console.log("发送文件信息接口 ", options);
    }
    /**
    * 发送文本消息
    * @param options 参数容器
    * --- options Properties ----
    * --- to               String 消息接收方的 userID 或 groupID
    * --- chatType         String 'chatroom' 聊天室聊天
    * --- payload          消息内容参数容器
    *     --- payload Properties ----
    *     --- msgObj       消息文本内容
    * @returns {message}   消息对象，用于描述一条消息具有的属性，如消息发送状态、类型、消息的内容、所属的会话 ID  
    * 
    **/
    sendTextMessage(options) {
        console.log("发送文本消息 ", options);
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
        console.log("发送音频信息",options);
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
        console.log("发送视频消息",options);
    }
    /**
    * 处理图片、文件、文本新消息的监听
    * @param hanlder  function 接收监听回调函数
    */
    onMessageListener(hanlder) {
        console.log("处理图片、文件、文本新消息的监听",hanlder);
    }

    /**
    * 处理错误消息的监听
    * @param onErrorState function 接收监听回调函数
    **/
    onError(onErrorState) {
        console.log("处理错误消息的监听",onErrorState);
    }
    /**
    * 登录/登出成功监听
    * @param onOpenedState function 接收监听回调函数
    **/
    onOpened(onOpenedState) {
        console.log("登录/登出成功监听",onOpenedState);
    }
}
export default EasemobApi;