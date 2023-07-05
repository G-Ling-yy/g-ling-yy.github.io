/**
 * @description:此处填写自定义配置
 * @version:1.0.0
 * @date:2021/11/18
 * @lastEditTime: （最后更新日期）
 * @lastEditDescription: （更新注释）
 * @lastEditors: (最后更新作者)
 **/
const config = {
  layout: 'vertical',
  donation: true,
  templateFolder: 'project',
  // 用户相关配置
  userConfig: {
    // 用户类型
    userType: {
      admin: 1, // 管理员
      roadCorp: 2, // 路公司
      shyRoadCorp: 9999, // 宿淮盐路公司
      corp: 3 // 厂商
    }
  }
}

module.exports = config
