/**
 * @description vue.config.js全局配置
 */
const path = require('path')
const {
  /* baseURL, */
  publicPath,
  assetsDir,
  outputDir,
  lintOnSave,
  transpileDependencies,
  title,
  devPort,
  providePlugin,
  modifyVars
} = require('./src/config')
const { version } = require('./package.json')
const Webpack = require('webpack')
// const FileManagerPlugin = require('filemanager-webpack-plugin')
const dayjs = require('dayjs')
// const date = dayjs().format('YYYY_M_D')
const time = dayjs().format('YYYY-M-D HH:mm:ss')
process.env.VUE_APP_TITLE = title || 'vue-admin'
process.env.VUE_APP_UPDATE_TIME = time
process.env.VUE_APP_VERSION = version

const resolve = dir => {
  return path.join(__dirname, dir)
}

// const mockServer = () => {
//   if (process.env.NODE_ENV === 'development') {
//     return require('./mock/mockServer.js')
//   } else {
//     return ''
//   }
// }

module.exports = {
  publicPath,
  assetsDir,
  outputDir,
  lintOnSave,
  transpileDependencies,
  devServer: {
    hot: true,
    port: devPort,
    open: true,
    noInfo: false,
    overlay: {
      warnings: true,
      errors: true
    },
    // 注释掉的地方是前端配置代理访问后端的示例
    // proxy: {
    //   [baseURL]: {
    //     target: `http://你的后端接口地址`,
    //     ws: true,
    //     changeOrigin: true,
    //     pathRewrite: {
    //       ["^/" + baseURL]: "",
    //     },
    //   },
    // },
    proxy: {
      '^/micro-demo': {
        target: 'http://bcs.microvideo.cn',
        ws: false,
        pathRewrite: {
          '^/micro-demo': '/micro-demo'
        },
        logLevel: 'debug'
      }

      // '/v1': {
      //   target: 'http://192.168.8.150:9626',
      //   ws: false,
      //   changeOrigin: true
      // }
    }
    // after: mockServer()
  },
  configureWebpack() {
    return {
      resolve: {
        // 配置alias简称
        alias: {
          '@': resolve('src'),
          '*': resolve(''),
          '@images': resolve('src/assets/images'),
          '@scripts': resolve('src/assets/scripts')
        }
      },
      plugins: [new Webpack.ProvidePlugin(providePlugin)]
    }
  },
  // 对内部的webpack配置(比如修改、增加Loader选项)(链式操作).
  chainWebpack(config) {
    config.resolve.symlinks(true)
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icon/remixIcon'))
      .end()
    config.module
      .rule('remixIcon')
      .test(/\.svg$/)
      .include.add(resolve('src/icon/remixIcon'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({ symbolId: 'remix-icon-[name]' })
      .end()
    config.when(
      process.env.NODE_ENV === 'development',
      config => {
        config.devtool('source-map')
      }
    )
    config.when(
      process.env.NODE_ENV !== 'development',
      config => {
        config.performance.set('hints', false)
        config.devtool('none')
        config.optimization.splitChunks({
          chunks: 'all',
          cacheGroups: {
            libs: {
              name: 'vue-admin-libs',
              test: /[\\/]node_modules[\\/]/,
              priority: 10,
              chunks: 'initial'
            }
          }
        })
        config.optimization.minimizer('terser').tap(arg => {
          arg[0].terserOptions.compress.drop_console = true
          return arg
        })
        // config.plugin('banner').end()
        config.module
          .rule('images')
          // .use('image-webpack-loader')
          // .loader('image-webpack-loader')
          // .options({
          //   bypassOnDebug: true
          // })
          .end()
      }
    )
  },
  runtimeCompiler: true,
  productionSourceMap: false,
  css: {
    requireModuleExtension: true,
    sourceMap: true,
    // 全局样式
    loaderOptions: {
      less: {
        lessOptions: {
          javascriptEnabled: true,
          modifyVars
        }
      }
    }
  }
}
