import { reactive } from 'vue'

const selfStore = reactive({
  formData: {}
})

selfStore.initialize = key => {
  selfStore[key] = {}
}

export default selfStore
