let newVar = {
  SYSTEM_VERSION: '3.3',
  WEBSOCKET_SERVER_URL: 'ws://121.36.255.226:8090',

  ////////////////////////////////////////////////////////////////////////
  /////////
  /////////              接口地址配置
  /////////
  ////////////////////////////////////////////////////////////////////////
  // 开发

  API_BASE_URL: '/v1', //测试环境/
  // API_BASE_URL: "http://118.195.183.245:9527/v1", //测试环境/
  // API_BASE_URL: "https://mvp.jchc.cn/v1",      //苏交控
  // API_BASE_URL: "http://192.168.200.58:9527/v1/", //王义本地环境/

  //////////////////////////////////////////////////////////// ////////////
  /////////
  /////////              切换播放器类型
  /////////
  ////////////////////////////////////////////////////////////////////////
  /**
   * 'flv'       blibli    flv.js      H5播放器
   * 'ali'       aliplayer             flash
   */
  VIDEO_PLAYER_TYPE: 'flv',
  //视频流类型
  VIDEO_MEDIA_TYPE: 'flvUrl' //rtmpUr flvUrl m3u8Url webrtc
}

export default newVar