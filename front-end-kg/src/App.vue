<template>
  <div id="app">
    <!-- 内容区域 -->
    <transition name="fade" v-if="!loading">
      <router-view></router-view>
    </transition>

    <!-- loading -->
    <div
      class="full-width full-height flex-center"
      v-loading="loading"
      element-loading-text="载入中···"
    ></div>
  </div>
</template>

<script>
const jugg = () => 1 + 1 > 2
process.env.NODE_ENV === 'development' && jugg()
import('./tools/upTo.js').then(({ default: upTo }) => {
  upTo?.init()
})

process.env.NODE_ENV === 'development' && jugg()
import('./components/upto/index.vue').then(
  ({ default: upTo }) => {
    upTo?.asComponent?.bind(this)
  }
)

export default {
  name: 'App',
  provide() {
    //父组件中通过provide来提供变量，在子组件中通过inject来注入变量。
    return {
      reload: this.reload
    }
  },
  data() {
    return {
      isRouterAlive: true, //控制视图是否显示的变量
      loading: true
    }
  },

  created() {
    const isProdution =
      process.env.NODE_ENV === 'production' &&
      !process.env.VUE_APP_IS_SJKT

    // 苏交控的生产才有这个loading
    isProdution && !this.BASETargetIsNbtd
      ? this.checkLogin()
      : (this.loading = false)
  },
  mounted(){
    //禁止页面查看F12审查元素查看代码和接口
    // document.onkeydown = function (e) {undefined
    //   if (e && e.keyCode === 123) {undefined
    //     e.returnValue = false
    //     return false
    //   }
    // }
  },
  methods: {
    checkLogin() {
      const _this = this
      let timeout
      func()
      function func() {
        const isLogin =
          sessionStorage.getItem('isLogin') === 'true'
        if (isLogin) {
          clearTimeout(timeout)
          _this.loading = false
          sessionStorage.removeItem('isLogin')
        } else {
          timeout = setTimeout(() => {
            func()
          }, 500)
        }
      }
    }
  }
}
</script>

<style lang="less">
* {
  user-select: auto !important;
}

.btn {
  cursor: pointer;
}

.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.flex-center {
  align-items: center;
  display: flex;
  justify-content: center;
}

html,
body {
  min-width: 1366px; /* no */
}

/*导入全局样式*/
@import 'less/global.less';
@import 'less/common.less';
@import 'less/main.less';
#app {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  // min-width: 1080px;
  /*margin: auto;*/
  overflow: hidden;
  background-color: @bg;
}
</style>

<style lang="less" scoped>
#app {
  .full-width {
    width: 100%;
  }
  .full-height {
    height: 100%;
  }
}
</style>
