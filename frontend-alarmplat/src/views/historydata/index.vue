<template>
  <!-- 表单 -->
  <SelfForm
    ref="selfFormDom"
    @handleSearch="searchHandler"
  />

  <!-- 表格 -->
  <div class="table-wrap">
    <Table
      tableClass="self-table"
      :tableData="tableData"
      :row-key="'id'"
      :columns="columns"
      :height="tableMaxHeight"
      :loading="loading"
      :isSelect="false"
      :pagination="pagination"
      :operation="false"
      :show-view-btn="false"
      :showEditBtn="false"
      :showDelBtn="false"
      @change="tableChangeHandler"
    >
      <template #column-alarmClassifyTimes="{ record }">
        <span style="margin-right: 1em ;">{{
          record.alarmClassifyTimes
        }}</span>
        <ma-button
          @click="viewDetails(record)"
          size="small"
          v-if="record.signStatus != 1"
        >
          <template #icon
            ><icon icon="mark-pen-line"
          /></template>
          {{
            record.signStatus == 2 ? '数据标定' : '查看详情'
          }}
        </ma-button>
      </template>
    </Table>
  </div>
  <!-- 表格弹窗 -->
  <SelfModal
    v-if="selfModalShow"
    title="数据标定"
    v-model:visible="selfModalShow"
    :data="theData"
    @updateTable="getTableData"
  />
</template>

<script setup>
/* eslint no-unused-vars: off */
import {
  ref,
  computed,
  onMounted,
  onBeforeUnmount
} from 'vue'
import selfStore from './modules/self-store'
import SelfForm from './modules/SelfForm'
import Table from '@/components/base/Table.vue'
import createTableVariables from '@/assets/scripts/create-table-variables'
import SelfModal from './modules/SelfModal'
import { debounce } from '@/utils/lodash'

/* 表单 */
// 表单数据
const formData = computed(() => selfStore.formData),
  // 表单dom
  selfFormDom = ref(),
  // 表单搜索触发
  searchHandler = () => {
    pagination.current = 1
    getTableData()
  }

/* 表格 */
// 表头标题
const thTitle = ref('业务类型')
const {
    tableData,
    loading,
    pagination,
    columns,
    tableChangeHandler,
    getTableData
  } = createTableVariables({
    api: 'getStories_1',
    columns: [
      // 列配置
      {
        title: '序号',
        dataIndex: 'indexNum',
        key: 'indexNum',
        width: 60
      },
      {
        title: thTitle,
        dataIndex: 'eventTypeName',
        key: 'eventTypeName',
        width: 120
      },
      {
        title: '事件位置',
        dataIndex: 'location',
        key: 'location',
        width: 110
      },
      {
        title: '检测范围',
        dataIndex: 'cameraLocation',
        key: 'cameraLocation',
        // sorter: {
        //   multiple: 1
        // },
        sorter: true,
        sortDirections: ['descend'],
        width: 110
      },
      {
        title: '首次报警时间',
        dataIndex: 'begTime',
        key: 'begTime',
        reRender: data => data.split?.(' ')?.[1],
        // sorter: {
        //   multiple: 1
        // },
        width: 110
      },
      {
        title: '光照',
        dataIndex: 'dayNight',
        key: 'dayNight',
        width: 60
      },
      {
        title: '天气',
        dataIndex: 'weather',
        key: 'weather',
        width: 110
      },
      {
        title: '运行状态',
        dataIndex: 'runningStatus',
        key: 'runningStatus',
        reRender: data =>
          ({ 0: '已结束', 1: '进行中' }[data] || '-'),
        width: 90
      },
      {
        title: '报警分类次数',
        dataIndex: 'alarmClassifyTimes',
        key: 'alarmClassifyTimes',
        renderBySlot: true,
        width: 110
      },
      {
        title: '累计报警次数',
        dataIndex: 'alarmCount',
        key: 'alarmCount',
        // sorter: {
        //   multiple: 1
        // },
        sorter: true,
        sortDirections: ['descend'],
        width: 110
      }
    ],
    extData: formData.value,
    afterGetData: res => {
      thTitle.value = `${
        res.extra == 1 ? '业务' : '报警'
      }类型`

      res.data.forEach((e, i) => {
        e.indexNum =
          res.page.pageSize * (res.page.currentPage - 1) +
          i +
          1
      })
    },
    sorterCallBack: sorter => {
      const sorters =
        sorter instanceof Array ? sorter : [sorter]

      for (const key in sorterFieldObj) {
        formData.value[sorterFieldObj[key]] = undefined
      }

      // 无排序列
      if (
        sorters.length === 1 &&
        sorters[0].order === undefined
      )
        return

      // 有排序列
      sorters.forEach(e => {
        e.order &&
          (formData.value[sorterFieldObj[e.field]] =
            e.order === 'ascend' ? 0 : 1)
      })
    }
  }),
  sorterFieldObj = {
    cameraLocation: 'locationOrder',
    // begTime: 'begTimeOrder',
    alarmCount: 'alarmCountOrder'
  },
  tableMaxHeight = ref(`${innerHeight - 344}px`)

const theData = ref({}), // 当前选中行弹窗所需数据
  viewDetails = rowData => {
    console.log('rowData11111111111:', rowData)
    theData.value = {
      date: rowData.begTime.split?.(' ')?.[0],
      eventType: rowData.eventType,
      eventTypeName: rowData.eventTypeName,
      id: rowData.storyId,
      signStatus: rowData.signStatus,
      location: rowData.cameraLocation
    }
    selfModalShow.value = true
  },
  selfModalShow = ref(false) // 弹窗显隐

// 表格高度监听实例
let tableHeightObserver = new ResizeObserver(
  debounce(() => {
    const formHeight =
      selfFormDom.value?.$el?.offsetHeight || 44

    tableMaxHeight.value = `${
      innerHeight - 250 - formHeight
    }px`
  }, 200)
)

onMounted(() => {
  getTableData()

  // 监听导致表格高度变化的dom
  tableHeightObserver.observe(selfFormDom.value?.$el)
  tableHeightObserver.observe(document.body)
})

onBeforeUnmount(() => {
  // 初始化 formData 数据
  selfStore.initialize('formData')

  /* 关销 监听 实例 */
  tableHeightObserver.unobserve(selfFormDom.value?.$el)
  tableHeightObserver.unobserve(document.body)
  tableHeightObserver = null
})
</script>

<style lang="less" scoped>
/* 表格 */
.table-wrap {
  .ant-pagination {
    margin-bottom: 0;
  }
}
</style>
