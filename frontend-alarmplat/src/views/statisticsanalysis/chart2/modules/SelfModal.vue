<template>
  <ma-modal
    :title="title"
    visible="visible"
    ok-text="确定"
    cancel-text="取消"
    @ok="emits('update:visible', false)"
    @cancel="emits('update:visible', false)"
    width="800px"
  >
    <div class="media-wrap flex-center">
      <ma-spin v-if="mediaLoading" size="large" />
      <div v-else-if="!src" class="tip">暂无媒体类型证据</div>
      <video v-else :src="src" autoplay controls loop></video>
    </div>
  </ma-modal>
</template>

<script setup>
import apis from '@/api'
const { ref, onMounted } = require('vue')

const props = defineProps({
    data: {
      type: Object,
      default: () => ({})
    },

    title: {
      type: String,
      default: 'modal'
    },

    visible: {
      type: Boolean,
      default: false
    }
  }),
  emits = defineEmits(['update:visible'])

const mediaLoading = ref(true),
  src = ref('')

onMounted(() => {
  apis.events
    .getEvidenceById({
      alarmId: props.data.id
    })
    .then(res => {
      src.value = res.data
    })
    .finally(() => {
      mediaLoading.value = false
    })
})
</script>

<style lang="less" scoped>
.media-wrap {
  min-height: 300px;
  margin: 0 auto;

  .tip {
    color: #aaa;
    font-size: 26px;
  }
}
</style>
