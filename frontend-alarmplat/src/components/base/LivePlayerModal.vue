<template>
  <ma-modal
    centered
    class="title-ellipsis"
    :footer="null"
    :maskClosable="false"
    visible="visible"
    :width="`min(calc(87vw + 48px), calc(${
      liveOptions.length <= 1
        ? 50
        : liveOptions.length === 2
        ? 86
        : 87
    }vw + 48px))`"
    @ok="emits('update:visible', false)"
    @cancel="emits('update:visible', false)"
  >
    <template #title>
      <ma-tooltip placement="topLeft" :title="data.name">
        <div class="title ellipsis">
          {{ data.name || '&nbsp;' }}
        </div>
      </ma-tooltip>
    </template>

    <!-- loading -->
    <div v-if="loading" class="loading flex-center">
      <ma-spin size="large" />
    </div>
    <template v-else>
      <div v-if="liveOptions.length" class="medias-wrap">
        <div
          v-for="(liveOption, index) in liveOptions"
          class="media-wrap flex-center"
          :key="index"
          :style="{ height: videoHeight }"
        >
          <!-- WebRCT播放器 -->
          <WebRTCPlayer :options="liveOption" />
        </div>
      </div>

      <div v-else class="tip flex-center">暂无数据</div>
    </template>
  </ma-modal>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import apis from '@/api'
// webRTC播放器
import WebRTCPlayer from '@/components/base/WebRTCPlayer/index.vue'

const props = defineProps({
    data: {
      type: Object,
      default: () => ({})
    },

    visible: {
      type: Boolean,
      default: false
    }
  }),
  emits = defineEmits(['update:visible'])

const videoHeight = computed(() =>
  liveOptions.value.length <= 1
    ? '28.125vw'
    : liveOptions.value.length === 2
    ? '24.1875vw'
    : '16.3125vw'
)

// 直播参数
const liveOptions = ref([]),
  loading = ref(false),
  // 获取直播参数
  getLiveOptions = linkId => {
    loading.value = true
    return apis.alarmLive
      .getAlarmLiveByLinkId({
        link: linkId,
        videoFormat: 'WEBRTC',
        videoRate: '-1'
      })
      .then(res => {
        liveOptions.value =
          res.data?.reduce((acc, e) => {
            const {
                url: playUrl,
                router: IP,
                wsUrl: webWss
              } = e,
              params = {
                connectId: e.connectId,
                pushStreamRecordId: e.heartbeatId
              }

            return acc.concat({
              playUrl,
              IP,
              webWss,
              params
            })
          }, []) || []
      })
      .catch(() => {
        liveOptions.value = []
      })
      .finally(() => {
        loading.value = false
      })
  }

onMounted(() => {
  getLiveOptions(props.data?.linkId)
})
</script>

<style lang="less" scoped>
.title {
  width: calc(100% - 20px);
}

.loading {
  height: 28.125vw;
  position: initial;
}

.medias-wrap {
  display: flex;
  min-height: 16.3125vw;

  .media-wrap {
    flex: 1;

    .tip {
      color: #aaa;
      font-size: 26px;
    }
  }
}

.tip {
  color: #aaa;
  font-size: 3vw;
  height: 28.125vw;
}
</style>
