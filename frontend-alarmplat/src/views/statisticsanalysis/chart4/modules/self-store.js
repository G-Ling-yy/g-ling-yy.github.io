import { reactive } from 'vue'

/* 初始化formData创建函数 */
const createFormData = () => {
  /* dayjs */
  const dayjs = require('dayjs'),
    // 新特定需求 时间范围定死在5号起步
    deadline = dayjs('2023-1-5'),
    // 新需求 时间范围在 1-5 ~ 2-4
    defaultStartDay =
      dayjs('2023-1-5').format('YYYY-MM-DD'),
    defaulEndDay = dayjs('2023-2-4').format('YYYY-MM-DD'),
    // today = dayjs().format('YYYY-MM-DD'),
    yesterday =
      dayjs().subtract(1, 'day') > deadline
        ? dayjs().subtract(1, 'day').format('YYYY-MM-DD')
        : deadline.format('YYYY-MM-DD')
  return {
    // evts事件选项
    circleSwitches: {
      isEmpty: true
    },
    eventType: 'vehi_stop', // evts事件参数（从 多选改单选 而设置的）
    corps: {
      0: {
        all: {
          name: '平台',
          checked: true
        },
        vid_yckj_test: {
          name: '预策',
          checked: false
        }
      },
      1: {
        // 接口获取剩余数据
      }
    }, // 已选厂商
    isPoc: 1, // 是否为poc数据（require）
    rangePickerValue: [defaultStartDay, defaulEndDay] // 日期范围默认 1-5 ~ 2-4
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
