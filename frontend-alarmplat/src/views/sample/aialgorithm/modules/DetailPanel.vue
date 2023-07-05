<template>
  <div class="wrapper">
    <!-- 顶部header -->
    <header>
      <div class="header-left">
        <!-- 返回按钮 -->
        <ma-button @click="emits('close')">返回</ma-button>
      </div>
      <div class="header-right">
        <span class="type"
          >样本类型：{{ sample?.name || '--' }}</span
        >
      </div>
    </header>

    <!-- 表单条件 -->
    <div class="form-wrap">
      <ma-form
        layout="inline"
        :model="formData"
        ref="formRef"
      >
        <!-- 位置类型 -->
        <ma-form-item v-if="false">
          <ma-select
            v-model:value="formData.locationType"
            allowClear
            placeholder="位置类型"
            style="width: 150px"
          >
            <ma-select-option
              v-for="opt of locationOpts"
              :key="`opt-${opt.key}`"
              :value="opt.value"
              >{{ opt.key }}</ma-select-option
            >
          </ma-select>
        </ma-form-item>

        <!-- 标注人 -->
        <ma-form-item>
          <ma-input
            v-model:value="formData.markMan"
            allowClear
            placeholder="标注人"
            style="width: 150px"
          >
          </ma-input>
        </ma-form-item>

        <!-- 标注时间（日期区间） -->
        <ma-form-item>
          <ma-range-picker
            v-model:value="formData.rangePickerValue"
            allowClear
            inputReadOnly
            :placeholder="['起日期', '止日期']"
            valueFormat="YYYY-MM-DD"
          />
        </ma-form-item>

        <!-- 查询按钮 -->
        <ma-form-item>
          <ma-button
            :loading="loading"
            type="primary"
            @click="seachHandler"
            >查询</ma-button
          >
        </ma-form-item>

        <!-- 重置按钮 -->
        <ma-form-item>
          <ma-button @click="reset">重置</ma-button>
        </ma-form-item>
      </ma-form>
    </div>

    <!-- 标注对象多选项 -->
    <div class="options-wrap">
      <div
        :class="[
          'option',
          !markCheckedOptions.length && 'checked'
        ]"
        @click="tabMarkOption('')"
      >
        全部
      </div>
      <div
        v-for="option of markOptions"
        :class="[
          'option',
          markCheckedOptions.includes(option.value) &&
            'checked'
        ]"
        :key="option"
        @click="tabMarkOption(option.value)"
      >
        {{ option?.key }}
      </div>
    </div>
    <!-- 表格 -->
    <div class="table-wrap">
      <Table
        :columns="columns"
        :customRow="customRow"
        :height="tableMaxHeight"
        :isSelect="false"
        :loading="loading"
        operationTitle="操作"
        :operationWidth="140"
        :pagination="pagination"
        row-key="screenshotId"
        :tableData="tableData"
        @change="tableChangeHandler"
      >
        <template #op-btn="{ record }">
          <!-- 详情按钮 -->
          <ma-button
            size="small"
            type="link"
            @click.stop="showSampleInfoModal(record)"
          >
            详情
          </ma-button>

          <!-- 删除按钮 -->
          <ma-button
            size="small"
            type="link"
            @click.stop="
              showDelSpsModal(record.screenshotId)
            "
          >
            删除
          </ma-button>
        </template>
      </Table>
      <!-- 样本删除确认弹窗 -->
      <ma-modal
        v-if="delSpsModalShow"
        v-model:visible="delSpsModalShow"
        centered
        class="picturemark-small-modal"
        :confirm-loading="delSpsLoading"
        :maskClosable="false"
        title="删除"
        width="400"
        @ok="delSnapshot(delSnapshotId)"
      >
        <div class="tips">
          <p class="tip">
            删除后，该标注样本将无法进行训练使用。确认删除吗？
          </p>
          <p class="tip">删除后无法恢复。</p>
        </div>
      </ma-modal>
      <!-- 样本详情弹窗 -->
      <SampleInfoModal
        :data="theRowData"
        :visible="sampleInfoModalShow"
        @close="
          v => {
            sampleInfoModalShow = false
            v && getTableData()
          }
        "
      />
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  reactive,
  computed,
  watch,
  onMounted,
  onBeforeUnmount
} from 'vue'
import { useStore } from 'vuex'
import Table from '@/components/base/Table.vue'
import createTableVariables from '@/assets/scripts/create-table-variables'
import { debounce } from '@/utils/lodash'
import apis from '@/api'
import { message } from 'ant-design-vue'
import SampleInfoModal from './SampleInfoModal.vue'

const props = defineProps({
    sample: {
      type: Object,
      default: () => ({})
    }
  }),
  emits = defineEmits(['close']),
  store = useStore()

/* 表单 */
const formData = reactive({
    locationType: null, // 位置类型
    markMan: '', // 标注人
    rangePickerValue: ['', ''] // 标注时间
  }),
  formRef = ref(),
  // 位置类型选项
  locationOpts = ref([
    {
      key: '道路沿线',
      value: 1
    },
    {
      key: '收费站',
      value: 5
    },
    {
      key: '桥梁',
      value: 2
    },
    {
      key: '隧道',
      value: 3
    },
    {
      key: 'ETC门架',
      value: 7
    }
  ]),
  // 查询
  seachHandler = () => {
    // 初始化当前页为 1
    pagination.current = 1

    // 获取表格数据
    getTableData()
  },
  // 重置
  reset = () => {
    // 表单重置
    formData.locationType = null
    formData.markMan = ''
    formData.rangePickerValue = ['', '']

    // 标注对象重置
    markCheckedOptions.value = []

    // 查询
    seachHandler()
  }

/* 标注对象多选项 */
const markOptions = computed(() => {
    return (
      store.state.dataDictionary[props.sample?.type] || []
    )
  }),
  // 当前选中项
  markCheckedOptions = ref([]),
  // 切换当前选中项
  tabMarkOption = markOption => {
    // 若 markOption传参无值（全部）
    if (!markOption) {
      markCheckedOptions.value = []
    } else {
      const fulllength = markOptions.value.length,
        array = markCheckedOptions.value.map(e => e)

      array.includes(markOption)
        ? array.splice(
            array.findIndex(e => e === markOption),
            1
          )
        : array.push(markOption)

      markCheckedOptions.value =
        array.length < fulllength ? array : []
    }

    // 初始化当前页为 1
    pagination.current = 1

    // 获取表格数据
    getTableData()
  }

/* 表格 */
// 传参
const getExtData = () => ({
  classType: props.sample?.type,
  startDate: formData.rangePickerValue?.[0],
  endDate: formData.rangePickerValue?.[1],
  markMan: formData.markMan,
  locationType: formData.locationType,
  objectTypes: markCheckedOptions.value
})
const {
    tableData,
    loading,
    pagination,
    columns,
    tableChangeHandler,
    getTableData
  } = createTableVariables({
    api: 'getSamplesList',
    columns: [
      // 列配置
      {
        title: '序号',
        dataIndex: 'indexNum',
        width: 60,
        maxWidth: 60
      },
      {
        title: '标注对象',
        dataIndex: 'markObject',
        width: 300
      },
      {
        title: '标注时间',
        dataIndex: 'markTime',
        width: 160
      },
      {
        title: '标注人',
        dataIndex: 'userName',
        width: 150
      },
      {
        title: '报警数据来源',
        dataIndex: 'corpName',
        reRender: data => `【${data}】 上报`,
        width: 220
      },
      {
        title: '报警设备位置',
        dataIndex: 'alaLoc',
        width: 150
      }
      // {
      //   title: '位置类型',
      //   dataIndex: 'alaLocType',
      //   width: 120
      // },
      // {
      //   title: '训练厂商数',
      //   dataIndex: 'corpNum',
      //   width: 100
      // }
    ],
    extData: getExtData,
    afterGetData: res => {
      res.data.forEach((e, i) => {
        e.indexNum =
          res.page.pageSize * (res.page.currentPage - 1) +
          i +
          1
      })
    }
  }),
  tableMaxHeight = ref(`${innerHeight - 420}px`),
  customRow = record => ({
    onClick: () => {
      showSampleInfoModal(record)
    }
  })

// 详情弹窗
const theRowData = ref({}), // 当前选中行弹窗所需数据
  showSampleInfoModal = rowData => {
    theRowData.value = rowData
    sampleInfoModalShow.value = true
  },
  sampleInfoModalShow = ref(false) // 弹窗显隐

// 删除弹窗
const delSpsModalShow = ref(false), // 删除弹窗显隐
  delSpsLoading = ref(false), // 删除loading
  delSnapshotId = ref(null), // 待删除的id
  // 删除指定截图
  delSnapshot = async screenshotId => {
    const msg = message.info('截图删除中···', 999)
    delSpsLoading.value = true
    await apis.events
      .delSnapshotByScreenshotId({
        screenshotId
      })
      .then(res => {
        console.log('截图删除成功 res', res)

        msg?.()
        message.success('截图删除成功')

        // 关闭确认删除弹窗
        delSpsModalShow.value = false

        // 获取表格数据
        getTableData()
      })
      .catch(err => {
        console.log('截图删除失败 err', err)
        msg?.()
      })
      .finally(() => {
        delSpsLoading.value = false
      })
  },
  // 显示删除截图确认弹窗
  showDelSpsModal = screenshotId => {
    delSnapshotId.value = screenshotId
    delSpsModalShow.value = true
  }

// 表格高度监听实例
let tableHeightObserver = new ResizeObserver(
  debounce(() => {
    tableMaxHeight.value = `${innerHeight - 420}px`
  }, 200)
)

onMounted(() => {
  console.log('afterGetData:', afterGetData())
  // 监听 props.sample
  watch(
    () => props.sample,
    nV => {
      if (nV) {
        reset()
      }
    }
  )

  // 监听导致表格高度变化的dom
  tableHeightObserver.observe(document.body)
})

onBeforeUnmount(() => {
  /* 关销 监听 实例 */
  tableHeightObserver.unobserve(document.body)
  tableHeightObserver = null
})
</script>

<style lang="less" scoped>
@gap: 20px;

.wrapper {
  background-color: #f0f2f5;
  height: 100%;
  & > * {
    background-color: #fff;
  }

  header {
    align-items: center;
    border-bottom: 1px solid #cbd1dd;
    display: flex;
    height: 3rem;
    justify-content: space-between;
    padding: 0 @gap;

    .header-left {
      .ant-btn {
        padding: 0 15px;
      }
    }
  }

  .form-wrap {
    align-items: center;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    display: flex;
    height: 4rem;
    margin-bottom: @gap;
    padding: 0 @gap;

    .ant-form {
      .ant-form-item {
        margin: 0 1rem 0 0;
      }
    }
  }

  .options-wrap {
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    display: flex;
    padding: @gap;

    .option {
      color: #666;
      cursor: pointer;
      font-size: 1rem;
      margin-right: 1rem;
      height: 1rem;
      line-height: 1rem;
      padding: 0 0.5rem;
      position: relative;
      transition: 0.2s;
      &:last-child {
        margin-right: 0;
      }
      &::after {
        background-color: transparent;
        border-radius: 2px;
        bottom: calc(-@gap / 2 + 2px);
        content: '';
        height: 2px;
        left: 0;
        position: absolute;
        transition: 0.2s;
        transform: scaleX(0);
        transform-origin: center;
        width: 100%;
      }
      &:hover {
        color: @layout-color;
      }
      &.checked {
        color: @layout-color;
        &::after {
          background-color: @layout-color;
          transform: scaleX(1);
        }
      }
    }
  }

  .table-wrap {
    height: calc(100% - 7rem);
    padding: 0 @gap @gap;
  }
}
</style>
