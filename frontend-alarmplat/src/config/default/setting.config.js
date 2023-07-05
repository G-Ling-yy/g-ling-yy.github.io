const testUrl = 'http://150.158.148.118:9626/v1',
// onlineUrl = 'http://192.168.136.91:9626/v1'
onlineUrl = 'http://139.198.167.138:9626/v1'

/* 本地开发api变更仅修改此处 */
// const devUrl = 'http://192.168.8.157:9626/v1' // 阿福紫东本地
// const devUrl = 'http://192.168.112.66:9626/v1' // 阿福苏交控本地
// const devUrl = 'http://192.168.8.227:9626/v1' // 徐瑞紫东本地
// const devUrl = 'http://192.168.112.78:9626/v1' // 徐瑞苏交控本地d
// const devUrl = testUrl // 本地连测试
const devUrl = onlineUrl // 本地连线上

/**
 * @description:默认通用配置
 * @version:1.0.0
 * @date:2021/11/18
 * @lastEditTime: （最后更新日期）
 * @lastEditDescription: （更新注释）
 * @lastEditors: (最后更新作者)
 **/
const setting = {
  // 开发以及部署时的URL
  // hash模式时在不确定二级目录名称的情况下建议使用""代表相对路径或者"/二级目录/"
  // history模式默认使用"/"或者"/二级目录/"
  publicPath: '',
  // 生产环境构建文件的目录名
  outputDir: 'dist',
  // 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录。
  assetsDir: 'static',
  // 开发环境每次保存时是否输出为eslint编译警告
  lintOnSave: true,
  // 进行编译的依赖
  transpileDependencies: ['vue-echarts', 'resize-detector'],
  // 默认的接口地址，暂时为mock-server，可配置成需要的接口地址
  baseURL:
    /* eslint operator-linebreak: off */
    process.env.NODE_ENV === 'production'
      ? process.env.VUE_APP_TESTENV === 'true'
        ? testUrl
        : onlineUrl
      : devUrl,
  // websocket接口地址
  // websocketURL: 'http://139.198.167.138:9626/v1/endpoint',
  websocketURL: 'http://192.168.136.91:9626/v1/endpoint',
  // 是否启用外部配置基础接口地址，可在public/outconfig.js中修改打包后接口地址
  outBaseURLAfterBuild: false,
  // 标题 （包括初次加载雪花屏的标题 页面的标题 浏览器的标题）
  title: 'AI慧眼云',
  // 标题分隔符
  titleSeparator: ' - ',
  // 标题是否反转 如果为false:"page - title"，如果为ture:"title - page"
  titleReverse: false,
  // 简写
  abbreviation: 'microvideo-pro',
  // 开发环境端口号
  devPort: '2578',
  // 版本号在package.json中配置
  version: process.env.VUE_APP_VERSION,
  // 缓存路由的最大数量
  keepAliveMaxNum: 99,
  // 路由模式，可选值为 history 或 hash
  routerMode: 'hash',
  // 无需校验token的路由
  routesWhiteList: [
    '/login',
    '/register',
    '/callback',
    '/404',
    '/403'
  ],
  // 加载时显示文字
  loadingText: '正在加载中...',
  // token名称
  tokenName: 'accessToken',
  // token在localStorage、sessionStorage、cookie存储的key的名称
  tokenTableName: 'accessToken',
  // token存储位置localStorage sessionStorage cookie
  storage: 'localStorage',
  // token失效回退到登录页时是否记录本次的路由
  recordRoute: true,
  // 是否显示logo，不显示时设置false，显示时请填写remixIcon图标名称，暂时只支持设置remixIcon
  logo: 'vuejs-fill',
  // 语言类型zh、en
  i18n: 'zh',
  // 在哪些环境下显示高亮错误
  errorLog: ['development', 'production'],
  // 是否开启登录拦截
  loginInterception: true,
  // 是否开启登录RSA加密
  loginRSA: false,
  // intelligence（前端导出路由）和all（后端导出路由）两种方式
  authentication: 'intelligence',
  // 是否开启roles字段进行角色权限控制（如果是all模式后端完全处理角色并进行json组装，可设置false不处理路由中的roles字段）
  rolesControl: true,
  // vertical gallery comprehensive common布局时是否只保持一个子菜单的展开
  uniqueOpened: false,
  // 需要加loading层的请求，防止重复提交
  debounce: ['doEdit'],
  // 需要自动注入并加载的模块
  providePlugin: {},
  // 代码生成机生成在view下的文件夹名称
  templateFolder: 'project',
  // 是否显示终端donation打印
  donation: false,
  // 画廊布局和综合布局时，是否点击一级菜单默认开启第一个二级菜单
  openFirstMenu: true
}
module.exports = setting
