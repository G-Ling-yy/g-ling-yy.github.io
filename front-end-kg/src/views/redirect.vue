<!-- 空页面，负责中转到目标页面 -->
<template>
  <div></div>
</template>
 
<script>
export default {
  name: 'refresh',
  data () {
    return {
    }
  },
  created() {
    const { params, query } = this.$route
    // const { path } = params
    this.$router.replace(query)
  },
  render: function(h) {
    return h() // avoid warning message
  }
}
 
</script>
<style scoped>
</style>