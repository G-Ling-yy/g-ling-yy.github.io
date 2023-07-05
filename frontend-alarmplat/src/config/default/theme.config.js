/**
 * @description:默认主题配置
 * @version:1.0.0
 * @date:2021/11/18
 * @lastEditTime: （最后更新日期）
 * @lastEditDescription: （更新注释）
 * @lastEditors: (最后更新作者)
 **/
const theme = {
  // 布局种类 horizontal vertical gallery comprehensive common
  layout: 'horizontal',
  // 主题名称 default ocean green glory white
  themeName: 'default',
  // 是否固定头部
  fixedHeader: true,
  // 是否显示顶部进度条
  showProgressBar: true,
  // 是否显示多标签页
  showTabsBar: true,
  // 是否显示语言选择组件
  showLanguage: true,
  // 是否显示刷新组件
  showRefresh: true,
  // 是否显示搜索组件
  showSearch: true,
  // 是否显示主题组件
  showTheme: true,
  // 是否显示通知组件
  showNotice: true,
  // 是否显示全屏组件
  showFullScreen: true,
  // 主题配置
  modifyVars: {
    'layout-color': '#1890ff',
    'layout-margin': '20px',
    'layout-padding': '20px',
    'layout-header-height': '65px'
  }
}
module.exports = theme
