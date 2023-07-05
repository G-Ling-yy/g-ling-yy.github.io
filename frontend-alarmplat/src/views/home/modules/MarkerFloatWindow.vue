<template>
  <div
    class="marker-float-window"
    ref="floatWindowRef"
    :style="{
      left: `calc(${x} + ${floatWindowOffset.x}px)`,
      top: `calc(${y} + ${floatWindowOffset.y}px)`,
      visibility: visible ? 'visible' : 'hidden'
    }"
  >
    <template v-if="loading">
      <div class="loading flex-center">
        <ma-spin />
      </div>
    </template>

    <template v-else-if="alarms.length < 2">
      <div class="space-between">
        <div class="left">
          <!-- icon -->
          <img
            :src="icons[`icon-${alarmStatus}`]"
            alt=""
            class="icon"
          />
          <span class="type">
            {{ alarms[0]?.eventTypeName }}
          </span>
          <span class="obj">
            --{{ alarms[0]?.objectTypeName }}
          </span>
        </div>
        <div class="right">
          <!-- 确认状态 -->
          <span class="status">
            {{ alarms[0]?.curStatus }}
          </span>
        </div>
      </div>

      <!-- 简易列表 -->
      <div class="maps-wrap">
        <div class="map">
          <div class="key flex-center">首次报警</div>
          <div class="value">{{ alarms[0]?.begTime }}</div>
        </div>

        <div class="map">
          <div class="key flex-center">报警厂商</div>
          <div class="value">{{ alarms[0]?.corpName }}</div>
        </div>

        <div class="map">
          <div class="key flex-center">报警位置</div>
          <div class="value">{{ alarmPosition }}</div>
        </div>
      </div>
    </template>

    <template v-else-if="alarms.length > 1">
      <h1>
        <!-- icon -->
        <img
          :src="icons[`icon-${alarmStatus}`]"
          alt=""
          class="icon"
        />
        报警详情
      </h1>

      <!-- 报警位置 -->
      <div class="position ellipsis">
        {{ alarmPosition }}
      </div>

      <!-- 简易列表 -->
      <div class="list-wrap">
        <div
          v-for="{ title, key } of listCols"
          class="col"
          :key="key"
        >
          <div class="row">{{ title }}</div>
          <div
            v-for="alarm of alarms"
            class="row"
            :key="alarm.index"
          >
            {{ alarm[key] }}
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
/* eslint no-unused-vars: off */
import { ref, reactive, watch, nextTick } from 'vue'
import apis from '@/api'
import { debounce } from '@/utils/lodash'

const props = defineProps({
  marker: {
    type: Object,
    default: () => ({})
  },

  x: {
    type: String,
    default: '30%'
  },

  y: {
    type: String,
    default: '30%'
  },

  visible: {
    type: Boolean,
    default: false
  }
})

/* 相关图标 */
const icons = [1, 2, 3].reduce((acc, e) => {
  acc[
    `icon-${e}`
  ] = require(`@images/mv-map/alarm_icon_0${e}.png`)
  return acc
}, {})

// 容器 dom
const floatWindowRef = ref(),
  // 容器位置偏移量（用于调整浮窗位置）
  floatWindowOffset = reactive({
    x: 0,
    y: 0
  }),
  // 调整自身位置
  adjustSelfPosition = () => {
    const { top, right, bottom } =
        floatWindowRef.value.getBoundingClientRect?.(),
      gap = 10

    // 若 上 超界
    if (top < 0) {
      floatWindowOffset.y = -top + gap
    } else if (bottom > innerHeight) {
      /* 若 底 超界 */
      floatWindowOffset.y = innerHeight - bottom - gap
    }

    // 若 右 超界
    if (right > innerWidth) {
      floatWindowOffset.x = innerWidth - right - gap
    }
  }

// alarms数据
const alarms = ref([]),
  alarmStatus = ref(1), // 报警状态（详情接口后可能会变更）
  alarmPosition = ref(''), // 报警位置
  loading = ref(false),
  // 获取 markers数据
  getAlarms = debounce(() => {
    apis.alarmLive
      .getAlarmDetailByStoryId({
        storyId: props.marker.storyId
      })
      .then(res => {
        alarms.value = res.map((e, i) => ({
          ...e,
          index: i + 1,
          begTime: e.begTime.split?.(' ')?.[1],
          curStatus: e.signStatus > 1 ? '进行中' : '未标定',
          // 1 个/辆 报警对象描述
          objectTypeNameDesc:
            e.objectNum > 0
              ? `${e.objectNum} ${
                  e.objectTypeName?.includes('车')
                    ? '辆'
                    : '个'
                }${e.objectTypeName}`
              : e.objectTypeName
        }))

        alarmStatus.value =
          res[0]?.signStatus ||
          props.marker?.signStatus ||
          1
        alarmPosition.value = res[0]?.cameraName || ''
      })
      .finally(() => {
        loading.value = false

        nextTick(() => {
          // 调整自身位置
          adjustSelfPosition()
        })
      })
  }, 300),
  // list列表构造对象
  listCols = [
    {
      title: '序号',
      key: 'index'
    },
    {
      title: '报警内容',
      key: 'eventTypeName'
    },
    {
      title: '对象',
      key: 'objectTypeNameDesc'
    },
    {
      title: '首次报警',
      key: 'begTime'
    },
    {
      title: '当前状态',
      key: 'curStatus'
    }
  ]

watch(
  () => props.visible,
  nV => {
    if (nV) {
      loading.value = true
      getAlarms()
    } else {
      /* 初始化 */
      // 取消请求
      getAlarms.cancel()
      // 清空数据
      alarms.value = []
      alarmPosition.value = ''
      // 清空偏移
      floatWindowOffset.x = 0
      floatWindowOffset.y = 0
    }
  }
)

watch(
  () => props.marker,
  (nV, oV) => {
    // 清空偏移
    floatWindowOffset.x = 0
    floatWindowOffset.y = 0

    if (nV && oV && props.visible) {
      loading.value = true
      getAlarms()
    }
  }
)
</script>

<style lang="less" scoped>
*:not([class|='ant']) {
  margin: 0;
  padding: 0;
}

@gap: 1.25rem;
@titleHeight: 60px;

.marker-float-window {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 1.31px 1.51px 24px 2px rgba(28, 60, 149, 0.15);
  min-height: 160px;
  left: 30%;
  pointer-events: none;
  position: fixed;
  top: 30%;
  transform: translateY(-50%);
  transition: all 0.2s, visibility 0s;
  min-width: 320px;
  z-index: 2;

  .space-between {
    align-items: flex-end;
    display: flex;
    height: 2rem;
    justify-content: space-between;
    padding: 0 @gap;
    margin-bottom: 0.5rem;
    width: 320px;

    > .left {
      .icon {
        height: 1rem;
        margin-right: 5px;
        transform: translateY(-2px);
        width: 1rem;
      }

      .type {
        color: #000;
        font-size: 1rem;
        font-weight: bold;
      }

      .obj {
        color: #333;
        font-size: 0.875rem;
      }
    }

    > .right {
      .status {
        color: #ff4d35fe;
        font-size: 0.875rem;
      }
    }
  }

  .maps-wrap {
    border: 1px solid #e8e8e8;
    border-bottom: none;
    margin: 0 @gap 1rem;
    width: calc(320px - @gap * 2);

    .map {
      display: flex;
      min-height: 2rem;

      .key {
        border-bottom: 1px solid #e8e8e8;
        border-right: 1px solid #e8e8e8;
        padding: 0 0.5rem;
        white-space: nowrap;
      }

      .value {
        align-items: center;
        border-bottom: 1px solid #e8e8e8;
        display: flex;
        flex: 1;
        padding: 0 0.5rem;
      }
    }
  }

  h1 {
    border-bottom: 1px solid #e8e8e8;
    color: #000;
    font-size: 1rem;
    font-weight: bold;
    height: @titleHeight;
    line-height: calc(@titleHeight - 1px);
    padding-left: @gap;
    min-width: 31.25vw;

    .icon {
      height: 1rem;
      margin-right: 5px;
      transform: translateY(-2px);
      width: 1rem;
    }
  }

  .position {
    color: #000;
    font-size: 0.875rem;
    height: 3rem;
    line-height: 3rem;
    padding-left: @gap;
    max-width: 40vw;
  }

  .list-wrap {
    display: flex;
    margin: 0 @gap @gap;

    .col {
      white-space: nowrap;
      &:first-child {
        text-align: center;
        width: 6rem;
      }
      &:nth-child(2) {
        flex: 1;
      }
      &:nth-child(3),
      &:nth-child(4),
      &:nth-child(5) {
        width: 8rem;
      }

      .row {
        border-bottom: 1px solid #e7ebf2;
        color: #333;
        font-size: 1rem;
        height: 2rem;
        line-height: 2rem;
        &:first-child {
          background-color: #f5f6f7;
          font-weight: bold;
        }
      }
    }
  }
}
</style>
