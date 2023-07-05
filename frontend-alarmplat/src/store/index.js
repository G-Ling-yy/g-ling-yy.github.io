/**
 * @description 导入所有 vuex 模块，自动加入namespaced:true，用于解决vuex命名冲突，勿改。
 */
import { createStore } from 'vuex'

const files = require.context('./modules', false, /\.js$/)
const modules = {}
files.keys().forEach(key => {
  modules[
    key
      .replace(/(\.\/|\.js)/g, '')
      .replace(/-(\w)/g, (p1, p2) =>
        p2?.toLocaleUpperCase()
      )
  ] = files(key).default
})
Object.keys(modules).forEach(key => {
  modules[key]['namespaced'] = true
})
export default createStore({
  modules
})
