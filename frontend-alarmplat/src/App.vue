<template>
  <div id="vue-admin-beautiful">
     <ma-config-provider :locale="zhCN">
     <router-view></router-view>
    </ma-config-provider>
  </div>
</template>
<script>
// 全局配置 英->中
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
dayjs.locale('en')
export default {
  name: 'App',
  data() {
    return {
      zhCN
    }
  }
  }
</script>
<style lang="less">
@import '~@/assets/styles/normalize/reset.less';
</style>