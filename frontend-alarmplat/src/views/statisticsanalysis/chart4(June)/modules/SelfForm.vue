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
        <div class="total">合计 {{ evtsTotal }}</div>
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
          <div class="extraInfo">{{ evt.count || 0 }}</div>
        </div>
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
          inputReadOnly
          :placeholder="['起日期', '止日期']"
          valueFormat="YYYY-MM-DD"
          @change="rangePickerChange"
        />
        <!-- <ma-range-picker v-model:value="value" /> -->
      </div>

      <div class="right flex-center">
        <!-- 厂商选项 -->
        <div
          v-for="corp of corpOptions"
          :class="[
            'check-btn',
            formData.corps[formData.isPoc][corp.value] &&
              'checked'
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

const dayjs = require('dayjs')
let today = dayjs().format('YYYY-MM-DD'),
  yesterday = dayjs()
    .subtract(1, 'day')
    .format('YYYY-MM-DD'),
  near7days = dayjs()
    .subtract(7, 'day')
    .format('YYYY-MM-DD'),
  near30days = dayjs()
    .subtract(30, 'day')
    .format('YYYY-MM-DD')

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
      evtsTotal: 0 // 事件总数
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
        POCCorpOptions = [
          {
            key: '平台',
            value: 'all'
          },
          {
            key: '预策',
            value: 'vid_yckj_test'
          },
          {
            key: '联通',
            value: 'vid_zglt_test'
          },
          {
            key: '鑫瑞德',
            value: 'vid_jsxrd_test'
          },
          {
            key: '阿里',
            value: 'vid_alibaba_test'
          },
          {
            key: '中兴',
            value: 'vid_zxfl_test'
          },
          {
            key: '大华',
            value: 'vid_zjdh_test'
          },

          {
            key: '宇视',
            value: 'vid_ysbg_test'
          }
          // {
          //   key: '金三立',
          //   value: 'vid_jslkj_test'
          // }
        ]

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
    }
  },

  created() {
    process.env.NODE_ENV === 'development' &&
      (window.chart4Form_vue = this)

    today = dayjs().format('YYYY-MM-DD')
    yesterday = dayjs()
      .subtract(1, 'day')
      .format('YYYY-MM-DD')
    near7days = dayjs()
      .subtract(7, 'day')
      .format('YYYY-MM-DD')
    near30days = dayjs()
      .subtract(30, 'day')
      .format('YYYY-MM-DD')

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

    // 厂商勾选变更
    triggerCorp(corp) {
      const corps = this.formData.corps[this.formData.isPoc]
      corps[corp] = !corps[corp]

      this.$emit('handle-search')
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
      height: 60px;
      line-height: 60px;
      margin-right: 0.5rem;
      position: relative;
      text-align: center;
      transition: 0.1s;
      width: 60px;
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
          margin-right: 0.5rem;
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
        height: 32px;
        line-height: 30px;
        margin-right: 0.5rem;
        padding: 0 15px;
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
</style>
