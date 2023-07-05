<template>
  <div class="page">
    <!-- 四个柱子 入口处 人 车 物 环 -->
    <div class="entrances-wrap">
      <div
        v-for="(entrance, key) in entrances"
        class="entrance"
        :key="key"
        @mouseenter="entrance.animated = true"
      >
        <div :class="['content-wrap', key]">
          <!-- 内容 -->
          <div
            class="content"
            @click="
              key !== 'huan' && (curEntrance = entrance)
            "
          >
            <!-- 类型标志 -->
            <div
              :class="[
                'mark',
                key,
                entrance.animated && 'rotate'
              ]"
              @animationend="entrance.animated = false"
            />

            <!-- 文本内容 -->
            <div v-if="key === 'huan'" class="content-text">
              <h1 :class="key">敬请期待···</h1>
            </div>
            <div v-else class="content-text">
              <h1 :class="key">
                样本总量：{{ entrance.total ?? '--' }} 张
              </h1>

              <!-- 详情数据 -->
              <p
                v-for="(obj, i) of entrance.data.slice(
                  0,
                  8
                )"
                :key="i"
              >
                <span class="name">{{ obj.name }}：</span
                ><span class="count ellipsis">{{
                  obj.totalNum || 0
                }}</span
                >张
              </p>

              <div class="more">查看更多···</div>
            </div>
          </div>

          <!-- 引导箭头 -->
          <div
            v-if="key !== 'huan'"
            :class="[
              'guide-arrow flex-center',
              key === 'huan' && 'static'
            ]"
            @click="
              key !== 'huan' && (curEntrance = entrance)
            "
          >
            <icon icon="arrow-right-line" />
          </div>
        </div>

        <!-- 更新时间 -->
        <div
          v-if="key !== 'huan'"
          class="bottom-tip"
          @click="
            key !== 'huan' && (curEntrance = entrance)
          "
        >
          更新时间：{{ entrance.updateTime || '--:--:--' }}
        </div>
      </div>
    </div>

    <!-- 数据展示 -->
    <div :class="['data-wrap', curEntrance && 'show']">
      <DetailPanel
        :sample="curEntrance"
        @close="curEntrance = null"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue'
import apis from '@/api'
import DetailPanel from './modules/DetailPanel.vue'
import { useStore } from 'vuex'

const store = useStore()

/* 四个柱子 入口 */
const entrances = reactive({
    ren: {
      animated: false,
      name: '人',
      type: 'class_type_person',
      total: null,
      updateTime: null,
      data: []
    },
    che: {
      animated: false,
      name: '车',
      type: 'class_type_vehicle',
      total: null,
      updateTime: null,
      data: []
    },
    wu: {
      animated: false,
      name: '物',
      type: 'class_type_object',
      total: null,
      updateTime: null,
      data: []
    },
    huan: {
      animated: false,
      name: '环',
      type: 'class_type_envir',
      total: null,
      updateTime: null,
      data: []
    }
  }),
  // 当前入口
  curEntrance = ref(null),
  // 数据key的map
  keysMap = {
    class_type_person: 'ren',
    class_type_vehicle: 'che',
    class_type_object: 'wu',
    class_type_envir: 'huan'
  },
  // 获取入口总数
  getEntranceTotal = () =>
    apis.events.getSamplesTotal().then(res => {
      res.data.forEach(sample => {
        if (entrances[keysMap[sample.type]]) {
          entrances[keysMap[sample.type]].total =
            sample.totalNum
          entrances[keysMap[sample.type]].updateTime =
            sample.updateTime
        }
      })
    }),
  // 获取入口各标注类型数
  getObjCountBySampleType = classType =>
    apis.events
      .getObjCountBySampleType({ classType })
      .then(res => {
        entrances[keysMap[classType]] &&
          (entrances[keysMap[classType]].data = res.data)
      })

onMounted(() => {
  // 获取入口总数
  getEntranceTotal()

  // 获取入口各标注类型数
  ;[
    'class_type_person',
    'class_type_vehicle',
    'class_type_object'
  ].forEach(classType => {
    getObjCountBySampleType(classType)
  })

  // 监听入口详情面板弹出
  watch(curEntrance, nV => {
    if (nV) {
      // 检查标注对象字典数据
      store.dispatch(
        'dataDictionary/checkDicByKey',
        nV.type
      )
    } else {
      // 更新数据
      // 获取入口总数
      getEntranceTotal()

      // 获取入口各标注类型数
      ;[
        'class_type_person',
        'class_type_vehicle',
        'class_type_object'
      ].forEach(classType => {
        getObjCountBySampleType(classType)
      })
    }
  })
})
</script>

<style lang="less" scoped>
* {
  margin: 0;
  padding: 0;
}

.page {
  height: calc(100% + 40px);
  margin: -20px;
  position: relative;
  overflow: hidden;
  width: calc(100% + 40px);

  .entrances-wrap {
    @gap: 20px;

    display: flex;
    height: 100%;
    padding: @gap;
    width: 100%;

    .entrance {
      display: flex;
      flex: 1;
      flex-direction: column;
      height: 100%;
      justify-content: space-between;
      margin-right: @gap;

      &:last-child {
        margin-right: 0;
      }

      .content-wrap {
        background: center / cover no-repeat;
        cursor: pointer;
        height: calc(100% - 3rem);
        position: relative;
        width: 100%;
        &.ren {
          background-image: url(~@images/ai_algorithm/bg_ren.png);
        }
        &.che {
          background-image: url(~@images/ai_algorithm/bg_che.png);
        }
        &.wu {
          background-image: url(~@images/ai_algorithm/bg_wu.png);
        }
        &.huan {
          background-image: url(~@images/ai_algorithm/bg_huan.png);
          cursor: default;
        }
        &:hover {
          .content {
            background-color: #384c91bf;

            .mark {
              top: 50%;
              transform: translate(
                -50%,
                calc(-100% - 5rem)
              );
            }

            .content-text {
              bottom: calc(50% - 2rem);
              transition: 0.5s;

              h1 {
                margin-bottom: 0.5rem;
              }
            }
          }
        }

        .content {
          background-color: #00000074;
          color: #fff;
          height: 100%;
          overflow: hidden;
          position: relative;
          text-align: center;
          transition: 0.3s;
          width: 100%;

          .mark {
            background: center / contain no-repeat;
            height: 7.625rem;
            left: 50%;
            position: absolute;
            transform: translate(-50%, -50%);
            top: 40%;
            transition: 0.3s;
            width: 7.625rem;
            &.ren {
              background-image: url(~@images/ai_algorithm/mark_ren.png);
            }
            &.che {
              background-image: url(~@images/ai_algorithm/mark_che.png);
            }
            &.wu {
              background-image: url(~@images/ai_algorithm/mark_wu.png);
            }
            &.huan {
              background-image: url(~@images/ai_algorithm/mark_huan.png);
            }
          }

          .content-text {
            bottom: 0;
            position: absolute;
            transform: translateY(
              calc(100% - 3.2rem - 1.5rem)
            );
            transition: 0.3s;
            width: 100%;

            h1 {
              color: #fff;
              font-size: 1.2rem;
              font-weight: bold;
              line-height: 1.2rem;
              margin-bottom: 2rem;
              padding-bottom: 2rem;
              position: relative;
              &::after {
                border-top: 2px solid #ffffff99;
                bottom: 1rem;
                content: '';
                display: block;
                left: 0;
                margin: 0 auto;
                position: absolute;
                right: 0;
                width: 3rem;
              }
              &::before {
                content: '';
                display: inline-block;
                height: 1.2rem;
                line-height: 1.2rem;
                vertical-align: top;
                width: 1.2rem;
              }
              &.ren::before {
                background: url(~@images/ai_algorithm/icon_ren.png)
                  center / contain no-repeat;
              }
              &.che::before {
                background: url(~@images/ai_algorithm/icon_che.png)
                  center / contain no-repeat;
              }
              &.wu::before {
                background: url(~@images/ai_algorithm/icon_wu.png)
                  center / contain no-repeat;
              }
              &.huan::before {
                background: url(~@images/ai_algorithm/icon_huan.png)
                  center / contain no-repeat;
              }
            }

            p {
              display: flex;
              .name {
                text-align: right;
                width: 55%;
              }

              .count {
                max-width: calc(45% - 1rem);
              }
            }

            .more {
              margin-top: 1rem;
            }
          }
        }

        .guide-arrow {
          background-color: #fff;
          border-radius: 50%;
          bottom: -1.5rem;
          box-shadow: 0 0.1rem 0.4rem #aaa;
          height: 3rem;
          left: 0;
          margin: 0 auto;
          position: absolute;
          right: 0;
          width: 3rem;

          i {
            animation: wagging 0.6s infinite alternate;
            color: @layout-color;
            font-size: 1.5rem;
            position: relative;
            top: 1px;
          }
        }
      }

      .bottom-tip {
        color: #999;
        font-size: 0.875px;
      }
    }
  }

  .data-wrap {
    background-color: #fff;
    height: 100%;
    left: 100%;
    position: absolute;
    transition: 0.3s;
    top: 0;
    width: 100%;
    &.show {
      left: 0;
    }
  }
}

@keyframes wagging {
  0% {
    transform: translateX(-10%);
  }

  100% {
    transform: translateX(20%);
  }
}
</style>
