import { reactive } from 'vue'

const selfStore = reactive({
  formData: {
    isPoc: 0 // 是否为poc数据（require）
  }
})

selfStore.initialize = key => {
  switch (key) {
    case 'formData':
      selfStore[key] = {
        isPoc: 0 // 是否为poc数据（require）
      }
      break
    default:
      selfStore[key] = {}
      break
  }
}

export default selfStore
