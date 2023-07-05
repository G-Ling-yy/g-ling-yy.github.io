globalThis.outBaseURL = 'http://139.198.167.138:9626/v1'

// 为解决 默认保存左侧栏收缩状态，收缩状态下刷新页面会可能导致选中菜单溢出显示bug
localStorage.setItem(
  'vue-admin-collapse',
  `{"collapse": false}`
)
