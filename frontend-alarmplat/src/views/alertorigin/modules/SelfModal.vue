<template>
  <ma-modal
    :maskClosable="false"
    :title="`${title}${
      mediaData.length
        ? `(${curMeidaIndex + 1}/${mediaData.length || 0})`
        : ''
    }`"
    :footer="null"
    visible="visible"
    ok-text="确定"
    cancel-text="取消"
    @ok="emits('update:visible', false)"
    @cancel="emits('update:visible', false)"
    width="calc(52vw + 24px * 2 + 50px * 2)"
  >
    <div class="media-wrap flex-center">
      <ma-spin v-if="mediaLoading" size="large" />

      <template v-else>
        <Slider
          :isCanTabFrame="mediaData.length > 1"
          @tabFrame="tabFrame"
        >
          <template #frame0>
            <VideoVue
              v-if="
                viewingMediaData[0] &&
                viewingMediaData[0].type === 'video'
              "
              autoplay
              :extraData="{
                alarmId: data.id
              }"
              key="alert-video"
              ref="videoVueRef0"
              :src="viewingMediaData[0].src"
              :framesUrl="viewingMediaData[0].framesUrl"
            />
            <VideoVue
              v-else-if="
                viewingMediaData[0] &&
                viewingMediaData[0].type === 'image'
              "
              type="image"
              :src="viewingMediaData[0].src"
            />
            <!-- 无证据提示 -->
            <VideoVue v-else />
          </template>

          <template #frame1>
            <VideoVue
              v-if="
                viewingMediaData[1] &&
                viewingMediaData[1].type === 'video'
              "
              autoplay
              :extraData="{
                alarmId: data.id
              }"
              key="alert-video"
              ref="videoVueRef1"
              :src="viewingMediaData[1].src"
              :framesUrl="viewingMediaData[1].framesUrl"
            />
            <VideoVue
              v-else-if="
                viewingMediaData[1] &&
                viewingMediaData[1].type === 'image'
              "
              type="image"
              :src="viewingMediaData[1].src"
            />
          </template>
        </Slider>
      </template>
    </div>
  </ma-modal>
</template>

<script setup>
import apis from '@/api'
import VideoVue from '@/components/base/Video.vue'
import Slider from '@/components/base/Slider.vue'
const { ref, reactive, onMounted } = require('vue')

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

const mediaLoading = ref(false),
  mediaData = reactive([]), // 媒体证据数据
  curMeidaIndex = ref(0), // 当前媒体证据下标
  viewingMediaData = reactive([{}, {}]), // 查看中的媒体证据数据
  videoVueRef0 = ref(), // frame0里的视频组件
  videoVueRef1 = ref(), // frame1里的视频组件
  tabFrame = (direction, curFrameIndex) => {
    // 更新当前媒体证据下标
    curMeidaIndex.value += direction
    // 首尾极限值处理
    curMeidaIndex.value < 0 &&
      (curMeidaIndex.value = mediaData.length - 1)
    curMeidaIndex.value >= mediaData.length &&
      (curMeidaIndex.value = 0)

    // 暂停可能的视频
    if (
      viewingMediaData[curFrameIndex ? 0 : 1]?.type ===
      'video'
    ) {
      const videoVueRef = curFrameIndex
        ? videoVueRef0.value
        : videoVueRef1.value
      videoVueRef?.videoDom?.pause?.()
    }
    // 播放可能的视频
    if (viewingMediaData[curFrameIndex]?.type === 'video') {
      const videoVueRef = curFrameIndex
        ? videoVueRef1.value
        : videoVueRef0.value
      videoVueRef?.videoDom?.play?.()
    }

    // 更新查看中的媒体证据数据
    viewingMediaData[curFrameIndex] =
      mediaData[curMeidaIndex.value]
  }

onMounted(() => {
  mediaLoading.value = true
  apis.events
    .getMediaByAlarmId({
      alarmId: props.data.id
    })
    .then(({ data }) => {
      /* 当前数据固定 0或1 个视频内容开头，后续 0或n 个图片内容 */

      // 若 有视频内容
      if (data?.mediaUrl) {
        mediaData.push({
          type: 'video',
          src: data?.mediaUrl,
          framesUrl: data?.markUrl
        })
      }

      // 若 有图片内容
      if (data?.imageUrls?.length) {
        data.imageUrls.forEach(src => {
          mediaData.push({
            type: 'image',
            src
          })
        })
      }

      // 查看媒体证据数据赋值
      viewingMediaData[0] = mediaData[0]
    })
    .finally(() => {
      mediaLoading.value = false
    })
})
</script>

<style lang="less" scoped>
.media-wrap {
  min-height: 20vw;
  margin: 0 auto;

  .slider-container {
    height: 29.25vw;

    ::v-deep(.container > .tip) {
      font-size: 2rem;
    }
  }
}
</style>
