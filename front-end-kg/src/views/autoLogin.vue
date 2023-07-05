<template>
  <div
    class="full-width full-height flex-div"
    v-loading="true"
    element-loading-text="载入中···"
  ></div>
</template>

<script>
import api from '@/api'
export default {
  name: '',
  beforeCreate() {
    // 随便调个接口触发跳转而已
    api
      .captchaLogin()
      .then(res => {
        const isLogin = 'isLogined'
        if (res) {
          // 有值则扫码登录成功可正常浏览
          sessionStorage.setItem(isLogin, true)
          setTimeout(() => {
            this.$router.replace('/index')
          })
        } else {
          sessionStorage.setItem(isLogin, false)
        }
      })
      .catch(err => {
        console.log('err', err)
      })
  }
}
</script>

<style scoped>
.full-width {
  width: 100%;
}
.full-height {
  height: 100%;
}
.flex-div {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
