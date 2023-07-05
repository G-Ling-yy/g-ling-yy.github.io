<template>
  <div class="slider-container">
    <!-- 左切按钮 -->
    <div
      :class="[
        'tab-btn left flex-center',
        !isCanTabFrame && 'disabled'
      ]"
      @click="tabFrame()"
    >
      <slot name="btnLeft">
        <icon icon="arrow-left-s-fill" />
      </slot>
    </div>

    <!-- 视口 -->
    <div class="viewport">
      <!-- 0index wrapper -->
      <div :class="['wrapper', animateClass[0]]">
        <div class="container">
          <slot name="frame0"></slot>
        </div>
      </div>

      <!-- 1index wrapper -->
      <div :class="['wrapper', animateClass[1]]">
        <div class="container">
          <slot name="frame1"></slot>
        </div>
      </div>
    </div>

    <!-- 右切按钮 -->
    <div
      :class="[
        'tab-btn right flex-center',
        !isCanTabFrame && 'disabled'
      ]"
      @click="tabFrame(-1)"
    >
      <slot name="btnRight">
        <icon icon="arrow-right-s-fill" />
      </slot>
    </div>
  </div>
</template>

<script setup>
/* eslint no-unused-vars: off */
import { reactive } from 'vue'

const props = defineProps({
    isCanTabFrame: {
      type: Boolean,
      default: false
    }
  }),
  emits = defineEmits(['tabFrame'])

// 动画类控制
const animateClass = reactive(['', ''])

// 当前显示框下标
let curFrameIndex = 0,
  anotherFrameIndex = 1

// 左右切换控制
const tabFrame = (direction = 1) => {
  // 若 不允切换
  if (!props.isCanTabFrame) return

  // 1 代表 向左切换
  if (direction === 1) {
    animateClass[curFrameIndex] = 'leave-to-left'
    animateClass[anotherFrameIndex] = 'enter-from-right'
  } else if (direction === -1) {
    animateClass[curFrameIndex] = 'leave-to-right'
    animateClass[anotherFrameIndex] = 'enter-from-left'
  }

  // 更新显示框下标
  if (curFrameIndex === 0) {
    curFrameIndex = 1
    anotherFrameIndex = 0
  } else {
    curFrameIndex = 0
    anotherFrameIndex = 1
  }

  emits('tabFrame', direction, curFrameIndex)
}
</script>

<style lang="less" scoped>
.slider-container {
  align-items: center;
  display: flex;
  height: 100%;
  min-height: 180px;
  width: 100%;
  min-width: 420px;

  .tab-btn {
    border-radius: 50%;
    cursor: pointer;
    height: 30px;
    margin: 0 10px;
    transition: 0.2s;
    width: 30px;
    min-width: 30px;
    &:hover {
      background-color: #0003;
    }
    &:active {
      background-color: #0006;
    }
    &.disabled {
      color: #aaa;
      cursor: not-allowed;
      &:hover,
      &:active {
        background: none;
      }
    }

    i {
      font-size: 2rem;
    }
  }

  .viewport {
    height: 100%;
    min-height: 180px;
    overflow: hidden;
    position: relative;
    width: 100%;
    min-width: 320px;

    .wrapper {
      background-color: #333;
      bottom: 0;
      left: 0;
      position: absolute;
      right: 0;
      top: 0;
      &:nth-child(2) {
        transform: translateX(100%);
      }
      &.enter-from-left {
        animation: enter-from-left linear 0.3s 1 forwards;
      }
      &.leave-to-left {
        animation: leave-to-left linear 0.3s 1 forwards;
      }
      &.enter-from-right {
        animation: enter-from-right linear 0.3s 1 forwards;
      }
      &.leave-to-right {
        animation: leave-to-right linear 0.3s 1 forwards;
      }

      .container {
        height: 100%;
      }
    }
  }
}
</style>
