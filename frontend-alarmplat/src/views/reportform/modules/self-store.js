import { reactive } from 'vue'

const selfStore = reactive({
  formData: {}
})

selfStore.initialize = (key = 'formData') => {
  selfStore[key] = {}
}

export default selfStore