import { reactive } from 'vue'

/* 初始化formData创建函数 */
const createFormData = () => {
  /* dayjs */
  const dayjs = require('dayjs'),
    // today = dayjs().format('YYYY-MM-DD'),
    // yesterday = dayjs()
    //   .subtract(1, 'day')
    //   .format('YYYY-MM-DD'),
    JuneStart = dayjs('2022-6-1').format('YYYY-MM-DD'),
    JuneEnd = dayjs('2022-6-30').format('YYYY-MM-DD')

  return {
    // evts事件选项
    circleSwitches: {
      vehi_stop: {
        name: '停驶',
        checked: false,
        count: 0
      },
      into_forbidden_area: {
        name: '禁行闯入',
        checked: false,
        count: 0
      },
      abandon: {
        name: '抛洒物',
        checked: false,
        count: 0
      },
      vehi_converse: {
        name: '逆行',
        checked: false,
        count: 0
      },
      vehi_reverse: {
        name: '倒车',
        checked: false,
        count: 0
      },
      vehi_slow_pass: {
        name: '单车慢速',
        checked: false,
        count: 0
      },
      vehi_day_congestion: {
        name: '车辆拥堵',
        checked: false,
        count: 0
      }
    },
    eventType: 'vehi_stop', // evts事件参数（从 多选改单选 而设置的）
    corps: {
      0: {
        all: true,
        vid_yckj_test: false
      },
      1: {
        all: true,
        vid_yckj_test: true,
        vid_zglt_test: true,
        vid_jsxrd_test: true,
        vid_alibaba_test: true,
        vid_zxfl_test: true,
        vid_zjdh_test: true,
        vid_ysbg_test: true,
        vid_jslkj_test: true
      }
    }, // 已选厂商
    isPoc: 1, // 是否为poc数据（require）
    rangePickerValue: [JuneStart, JuneEnd] // 日期范围默认昨日
  }
}

const selfStore = reactive({
  formData: createFormData(),
  extraData: {}
})

selfStore.initialize = key => {
  switch (key) {
    case 'formData':
      selfStore[key] = createFormData()
      break
    default:
      selfStore[key] = {}
      break
  }
}

export default selfStore
