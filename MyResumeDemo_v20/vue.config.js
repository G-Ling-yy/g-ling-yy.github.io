module.exports = {
	// 选项...
	// 
	/* 部署生产环境和开发环境下的URL：可对当前环境进行区分，
		baseUrl 从 Vue CLI 3.3 起已弃用，
		要使用publicPath 
    baseUrl: process.env.NODE_ENV === 'production' ? './' : '/' */
	publicPath: './',

	// 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录
	assetsDir: "assets",

	// webpack-dev-server 相关配置
	devServer: {
		// 自动打开浏览器
		open: true
	}
}