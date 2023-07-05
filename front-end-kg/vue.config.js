const path = require('path')
const webpack = require('webpack')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const Timestamp = new Date().getTime()
const isProdution =
  process.env.NODE_ENV === 'production' &&
  !process.env.VUE_APP_IS_SJKT

module.exports = {
  /* 部署生产环境和开发环境下的URL：可对当前环境进行区分，baseUrl 从 Vue CLI 3.3 起已弃用，要使用publicPath */
  publicPath: './', //process.env.NODE_ENV === 'production' ? '/public/' : './',
  /* 输出文件目录：在npm run build时，生成文件的目录名称 */
  //outputDir: 'dist',
  /* 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录 */
  //assetsDir: "",
  /*指定生成的 index.html 的输出路径 (相对于 outputDir)。也可以是一个绝对路径。*/
  //indexPath:'index.html',
  /* 默认情况下，生成的静态资源在它们的文件名中包含了 hash 以便更好的控制缓存，你可以通过将这个选项设为 false 来关闭文件名哈希。(false的时候就是让原来的文件名不改变) */
  //filenameHashing: true,
  /* 代码保存时进行eslint检测 */

  //lintOnSave: true,
  /* 是否在构建生产包时生成 sourceMap 文件，false将提高构建速度 */
  productionSourceMap: false,
  devServer: {
    open: true,
    proxy: {
      // '/v1/': {
      // '/v2/': {
      '/v': {
        // target: isProdution ?
        //   'https://mvp.jchc.cn'
        //   :
        //   'https://hdsp.gandongyun.com/',//感动云
          // 'http://139.198.178.191',//联网
          // 'http://118.195.183.245:9521/', //测试环境
          // 'http://139.198.155.14:8081' , //南部通道
        target: isProdution ? "https://mvp.jchc.cn" : "https://mvp.jchc.cn",
        logLevel: 'debug',
        // 以下解决https 访问问题。上面的可以访问http
        changeOrigin: true,
        //secure: false
      //   pathRewrite:{
      //     '^/v1/': '/'
      // }
      }
    },
    disableHostCheck: true
  },

  /*cors 相关 https://jakearchibald.com/2017/es-modules-in-browsers/#always-cors*/
  // corsUseCredentials: false,
  /*webpack 配置，键值对象时会合并配置，为方法时会改写配置
  https://cli.vuejs.org/guide/webpack.html#simple-configuration*/
  // configureWebpack: {
  //     externals: {
  //         'AMap': 'AMap', // 高德地图配置
  //         'AMapUI': 'AMapUI' // 高德地图配置
  //     }
  // },
  /*配置高于chainWebpack中关于 css loader 的配置*/
  css: {
    /*是否开启支持 foo.module.css 样式*/
    //requireModuleExtension:true,

    /*是否使用 css 分离插件 ExtractTextPlugin，采用独立样式文件载入，不采用 <style> 方式内联至 html 文件中*/
    //extract: true,

    /*是否构建样式地图，false 将提高构建速度*/
    sourceMap: false

    // css预设器配置项
    /*loaderOptions: {
        css: {
            // options here will be passed to css-loader
        },

        postcss: {
            // options here will be passed to postcss-loader
        }
    }*/
  },
  /*第三方插件配置*/
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: ['./src/less/var.less']
    }
  },

  // chainWebpack: config => {
  //   config.plugins.delete('prefetch')
  //   config.plugins.delete('preload')
  // },

  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@i': path.resolve(__dirname, './src/assets')
      }
    },
    output: {
      filename: `js/[name].${Timestamp}.js`, // 每次构建打包时给文件名加上时间戳，确保每次版本更新的文件名不一样
      chunkFilename: `js/[name].${Timestamp}.js`
    },
    plugins: [
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

      // 下面是下载的插件的配置
      new CompressionWebpackPlugin({
        test: /\.(js)?$/i,
        // algorithm: 'gzip',
        // test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
        threshold: 102400,
        minRatio: 0.8
      }),
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 5,
        minChunkSize: 1000
      })
    ]
  }
}