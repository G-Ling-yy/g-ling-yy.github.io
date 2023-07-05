/**
 * @description:网络配置
 * @version:1.0.0
 * @date:2021/11/18
 * @lastEditTime: （最后更新日期）
 * @lastEditDescription: （更新注释）
 * @lastEditors: (最后更新作者)
 **/
const network = {
  // 配后端数据的接收方式application/json;charset=UTF-8 或 application/x-www-form-urlencoded;charset=UTF-8
  contentType: 'application/json;charset=UTF-8',
  // 消息框消失时间
  messageDuration: 3000,
  // 最长请求时间
  requestTimeout: 1000 * 10,
  // 操作正常code，支持String、Array、int多种类型
  successCode: [200, 0, '200']
}
module.exports = network
