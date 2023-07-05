import SockJS from  'sockjs-client';
import  Stomp from 'stompjs';
const initFirst = function(){
  // 建立连接对象
  let stompClient = "",
    socket = new SockJS('ws://121.36.255.226:8090');
  // 获取STOMP子协议的客户端对象
  stompClient = Stomp.over(socket);
  stompClient.heartbeat.outgoing=20000;
  stompClient.heartbeat.incoming=0;
  return stompClient;
};
const connection = function(mystompClient,callback){
  // 定义客户端的认证信息,按需求配置
  let headers = {
    // Authorization:用户身份验证信息
  }
  // 向服务器发起websocket连接
  mystompClient.connect(headers,() => {
    mystompClient.subscribe('订阅名称', (msg) => { // 订阅服务端提供的某个topic
      callback(msg);
    },headers);
  }, (err)=>{
    let errdata={
      type:"err",
      model:"",
      msg:err };
    callback(errdata);
  });
};
const disconnect = function(mystompClient){
  if(mystompClient) {
    mystompClient.disconnect();
  }
};

export {
  initFirst,
  connection,
  disconnect
}
