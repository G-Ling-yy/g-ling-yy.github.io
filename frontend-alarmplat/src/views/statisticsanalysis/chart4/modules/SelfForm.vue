<template>
  <ma-form
    class="self-form"
    layout="inline"
    :model="formData"
  >
    <header>
      <div class="left flex-center">
        <div class="title">自然报警统计</div>
        <div
          v-for="item of circleRadios"
          :class="[
            'circle-btn radio',
            item.value === formData.isPoc && 'active'
          ]"
          :key="item.key"
          @click="tabPoc(item.value)"
        >
          {{ item.key }}
        </div>
      </div>

      <div class="right flex-center">
        <!-- 事件选项 -->
        <div class="total">合计 {{ evtsTotal }}</div>

        <template v-if="formData.circleSwitches.isEmpty">
          <div class="loading-tip">加载中···</div>
        </template>

        <template v-else>
          <div
            v-for="(evt, key) in formData.circleSwitches"
            :class="[
              'circle-btn switch',
              key === formData.eventType && 'active'
            ]"
            :key="key"
            @click="switchEvt(evt, key)"
          >
            {{ evt.name }}
            <div class="extraInfo">
              {{ evt.count || 0 }}
            </div>
          </div>
        </template>
      </div>
    </header>

    <footer v-if="curChartType !== 'line'">
      <div class="left flex-center">
        <!-- 日期按钮 -->
        <ma-radio-group
          v-model:value="dateRadio"
          button-style="solid"
          @change="dateRadioChange"
        >
          <ma-radio-button
            v-for="item of dateRadios"
            :key="item.value"
            :value="item.value"
            >{{ item.label }}</ma-radio-button
          >
        </ma-radio-group>

        <!-- 日期范围 -->
        <ma-range-picker
          v-model:value="formData.rangePickerValue"
          :allowClear="false"
          :disabledDate="disabledDate"
          inputReadOnly
          :placeholder="['起日期', '止日期']"
          valueFormat="YYYY-MM-DD"
          @change="rangePickerChange"
        />
      </div>

      <div class="right flex-center">
        <!-- 厂商选项 -->
        <div
          v-for="corp of corpOptions"
          :class="[
            'check-btn',
            formData.corps[formData.isPoc][corp.value]
              ?.checked && 'checked'
          ]"
          :key="corp.key"
          @click="triggerCorp(corp.value)"
        >
          {{ corp.key }}
        </div>
      </div>
    </footer>
  </ma-form>
</template>

<script>
import selfStore from './self-store'

const dayjs = require('dayjs'),
  // 新特定需求 时间范围定死在5号起步
  deadline = dayjs('2023-1-5')
let today = dayjs().format('YYYY-MM-DD'),
  yesterday =
    dayjs().subtract(1, 'day') > deadline
      ? dayjs().subtract(1, 'day').format('YYYY-MM-DD')
      : deadline.format('YYYY-MM-DD'),
  near7days =
    dayjs().subtract(7, 'day') > deadline
      ? dayjs().subtract(7, 'day').format('YYYY-MM-DD')
      : deadline.format('YYYY-MM-DD'),
  near30days =
    dayjs().subtract(30, 'day') > deadline
      ? dayjs().subtract(30, 'day').format('YYYY-MM-DD')
      : deadline.format('YYYY-MM-DD')

export default {
  name: 'SelfForm',

  props: {
    curChartType: {
      type: String,
      default: 'bar'
    }
  },

  data() {
    return {
      dateRadio: '', // 日期范围快选值
      evtsTotal: 0, // 事件总数
      // 准备扳机记录（事件、厂商等条件数据获取准备记录，全部完成触发搜索）
      readyTriggers: {
        isEventsReady: false, // 事件 准备
        isCorpsReady: false // 厂商 准备
      }
    }
  },

  computed: {
    formData: {
      get: () => selfStore.formData,
      set: v => {
        selfStore.formData = v
      }
    },

    extraData: {
      get: () => selfStore.extraData,
      set: v => {
        selfStore.extraData = v
      }
    },

    // 报警厂商选项
    corpOptions() {
      // 非POC厂商选项
      const corpOptions = [
          {
            key: '平台',
            value: 'all'
          },
          {
            key: '预策',
            value: 'vid_yckj_test'
          }
        ],
        // POC厂商选项 (默认添加 平台 all)
        POCCorpOptions = [
          {
            key: '平台',
            value: 'all'
          }
        ]

      ;(
        this.$store.state.dataDictionary[
          'ff80818159af9032015a1258ae5f001a:online_corp'
        ] || []
      ).forEach(e => {
        // 过滤 感动
        if (e.value != 'vid_microvideo') {
          POCCorpOptions.push({
            key: e.key.replace('科技', ''),
            value: e.value
          })
        }
      })

      return this.formData.isPoc
        ? POCCorpOptions
        : corpOptions
    }
  },

  watch: {
    // 监听饼图数据变化渲染右上角事件类型数量
    'extraData.pieData': function (nV, oV) {
      this.evtsTotal = 0
      nV.forEach(e => {
        this.evtsTotal += e.alarmCount

        this.formData.circleSwitches[e.eventType] &&
          (this.formData.circleSwitches[e.eventType].count =
            e.alarmCount)
      })
    },

    // 监听vuex里 onlie_corp 数据
    '$store.state.dataDictionary.ff80818159af9032015a1258ae5f001a:online_corp':
      {
        handler: function (nV, oV) {
          if (nV && !oV) {
            // 记录已选厂商数据的初始化
            const corps = {
              all: { name: '平台', checked: true }
            }

            this.$store.state.dataDictionary[
              'ff80818159af9032015a1258ae5f001a:online_corp'
            ].forEach(e => {
              // 过滤 感动
              if (e.value != 'vid_microvideo') {
                corps[e.value] = {
                  name: e.key.replace('科技', ''),
                  checked: true
                }
              }
            })

            // 更新记录已选厂商数据
            this.formData.corps[1] = corps
            this.readyTriggers.isCorpsReady = true
          }
        }
      },

    // 监听准备工作情况
    readyTriggers: {
      handler: function (nV) {
        // 若 条件满足（厂商准备完成 和 事件准备完成）
        if (nV.isCorpsReady && nV.isEventsReady) {
          // 触发搜索
          this.$emit('handle-search')
        }
      },
      deep: true
    }
  },

  created() {
    process.env.NODE_ENV === 'development' &&
      (window.chart4Form_vue = this)

    // 防止缓存导致刷新页面不能正确获取日期
    today = dayjs().format('YYYY-MM-DD')
    yesterday =
      dayjs().subtract(1, 'day') > deadline
        ? dayjs().subtract(1, 'day').format('YYYY-MM-DD')
        : deadline.format('YYYY-MM-DD')
    near7days =
      dayjs().subtract(7, 'day') > deadline
        ? dayjs().subtract(7, 'day').format('YYYY-MM-DD')
        : deadline.format('YYYY-MM-DD')
    near30days =
      dayjs().subtract(30, 'day') > deadline
        ? dayjs().subtract(30, 'day').format('YYYY-MM-DD')
        : deadline.format('YYYY-MM-DD')

    /* POC选项 */
    this.circleRadios = [
      // {
      //   key: '宿淮盐',
      //   value: 0
      // },
      {
        key: 'POC',
        value: 1
      }
    ]

    /* 事件选项 */
    if (
      this.$store.state.dataDictionary['enable_event']
        ?.length
    ) {
      /* 初始化事件选项 */
      const circleSwitches = {}
      this.$store.state.dataDictionary['enable_event']
        .filter(
          e =>
            !['vehi_accident', 'vehi_rescue'].includes(
              e.value
            )
        )
        .forEach(e => {
          circleSwitches[e.value] = {
            name: e.key,
            checked: false,
            count: 0
          }
        })
      // 触发更新 和 准备记录
      this.formData.circleSwitches = circleSwitches
      this.readyTriggers.isEventsReady = true
    } else {
      this.getDicByKey('enable_event').then(() => {
        /* 初始化事件选项 */
        const circleSwitches = {}
        this.$store.state.dataDictionary['enable_event']
          .filter(
            e =>
              !['vehi_accident', 'vehi_rescue'].includes(
                e.value
              )
          )
          .forEach(e => {
            circleSwitches[e.value] = {
              name: e.key,
              checked: false,
              count: 0
            }
          })

        // 触发更新 和 准备记录
        this.formData.circleSwitches = circleSwitches
        this.readyTriggers.isEventsReady = true
      })
    }

    /* 日期选项 及 初始值*/
    this.dateRadios = [
      {
        label: '近30日',
        value: 'near30days'
      },
      {
        label: '近7日',
        value: 'near7days'
      },
      {
        label: '昨日',
        value: 'yesterday'
      }
      // {
      //   label: '今日',
      //   value: 'today'
      // }
    ]
    // this.dateRadio = 'yesterday'

    /* 厂商选项 */
    // 若 无在线厂商数据
    if (
      !this.$store.state.dataDictionary[
        'ff80818159af9032015a1258ae5f001a:online_corp'
      ]?.length
    ) {
      this.getDicByKey(
        'ff80818159af9032015a1258ae5f001a:online_corp'
      )
    } else {
      // 记录已选厂商数据的初始化
      const corps = {
        all: {
          name: '平台',
          checked: true
        }
      }

      this.$store.state.dataDictionary[
        'ff80818159af9032015a1258ae5f001a:online_corp'
      ].forEach(e => {
        // 过滤 感动
        if (e.value != 'vid_microvideo') {
          corps[e.value] = {
            name: e.key.replace('科技', ''),
            checked: true
          }
        }
      })

      // 更新记录已选厂商数据
      this.formData.corps[1] = corps
      this.readyTriggers.isCorpsReady = true
    }
  },

  methods: {
    // POC切换
    tabPoc(isPoc) {
      if (isPoc === this.formData.isPoc) return

      this.formData.isPoc = isPoc

      this.$emit('handle-search')
    },

    // 事件类型变更
    switchEvt(evt, key) {
      if (this.formData.eventType === key) return

      this.formData.eventType = key
      this.extraData.isTriggerByEvt = true

      this.$emit('handle-search')
    },

    // 日期单选变更
    dateRadioChange({ target }) {
      switch (target.value) {
        case 'today':
          this.formData.rangePickerValue = [today, today]
          break
        case 'yesterday':
          this.formData.rangePickerValue = [
            yesterday,
            yesterday
          ]
          break
        case 'near7days':
          this.formData.rangePickerValue = [
            near7days,
            yesterday
          ]
          break
        case 'near30days':
          this.formData.rangePickerValue = [
            near30days,
            yesterday
          ]
          break
        default:
          break
      }

      this.$emit('handle-search')
    },

    // 日期范围组件变更
    rangePickerChange() {
      this.dateRadio = ''

      this.$emit('handle-search')
    },

    // 禁选日期（23-01-05之前禁选）
    disabledDate(current) {
      return current < dayjs('2023-01-05')
    },

    // 厂商勾选变更
    triggerCorp(corp) {
      const corps = this.formData.corps[this.formData.isPoc]
      corps[corp].checked = !corps[corp].checked

      this.$emit('handle-search')
    },

    // 获取字典
    getDicByKey(key, loading) {
      loading && (this[loading] = true)
      return this.$store
        .dispatch('dataDictionary/getDicByKey', key)
        .finally(() => {
          loading && (this[loading] = false)
        })
    }
  }
}
</script>

<style lang="less" scoped>
.self-form {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;

  header {
    display: flex;
    height: 80px;
    justify-content: space-between;
    padding-bottom: 20px;

    .circle-btn {
      background: linear-gradient(#aaa, #aaa);
      border-radius: 50%;
      color: #fff;
      cursor: pointer;
      font-size: 0.9rem;
      height: 3.75rem;
      line-height: 3.75rem;
      margin-right: 0.5rem;
      position: relative;
      text-align: center;
      transition: 0.1s;
      width: 3.75rem;
      &:active {
        box-shadow: 0 0 0.6rem 0 #ccc inset;
      }
      &.active {
        background: linear-gradient(
          45deg,
          #427eb5,
          #1890ff
        );
        box-shadow: -1px 1px 0.4rem 0 #aaa;
        &:active {
          background: linear-gradient(
            45deg,
            #2c87da,
            #2c87da
          );
          box-shadow: none;
        }
      }
      &:last-child {
        margin-right: 0;
      }

      .extraInfo {
        bottom: -20px;
        color: #333;
        font-size: 0.7rem;
        height: 20px;
        line-height: 20px;
        position: absolute;
        width: 100%;
      }
    }

    .left {
      height: 100%;

      .title {
        font-weight: bold;
        margin-right: 0.8rem;
      }
    }

    .right {
      height: 100%;

      .total {
        font-weight: bold;
        margin-right: 0.8rem;
      }
    }
  }

  footer {
    display: flex;
    height: 40px;
    justify-content: space-between;

    .left {
      height: 100%;

      .ant-radio-group {
        .ant-radio-button-wrapper {
          height: 2rem;
          line-height: calc(2rem - 2px);
          margin-right: 0.5rem;
          padding: 0 1rem;
        }
      }
    }

    .right {
      height: 100%;

      .check-btn {
        background-color: #fff;
        border: 1px solid #d9d9d9;
        color: #000000d9;
        cursor: pointer;
        height: 2rem;
        line-height: calc(2rem - 2px);
        margin-right: 0.5rem;
        padding: 0 1rem;
        transition: 0.3s;
        &:hover {
          color: @layout-color;
        }
        &:first-child {
          border-radius: 2px 0 0 2px;
        }
        &:last-child {
          border-radius: 0 2px 2px 0;
          margin-right: 0;
        }
        &.checked {
          background-color: @layout-color;
          border-color: @layout-color;
          color: #fff;
        }
      }
    }
  }
}

@media (width: 1366px) {
  .self-form {
    footer {
      .left {
        .ant-radio-group {
          .ant-radio-button-wrapper {
            margin-right: 0.2rem;
            padding: 0 0.5rem;
          }
        }
      }

      .right {
        .check-btn {
          padding: 0 0.4rem;
        }
      }
    }
  }
}
</style>
