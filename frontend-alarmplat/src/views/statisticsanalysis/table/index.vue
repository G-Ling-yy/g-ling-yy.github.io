<template>
  <!-- 表单 -->
  <SelfForm @handleSearch="getTableData" />

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
      :operation="false"
      :show-view-btn="false"
      :showEditBtn="false"
      :showDelBtn="false"
    >
      <!-- 检出率 -->
      <template #column-checkRate="{ record }">
        <div>{{ record.checkRate }}</div>
        <div>白天：{{ record.checkRateDay }} 夜晚：{{ record.checkRateNight }}</div>
        <div>晴天：{{ record.checkRateSun }} 非晴天：{{ record.checkRateNoSun }}</div>
      </template>

      <!-- 正确率 -->
      <template #column-correctRate="{ record }">
        <div>{{ record.correctRate }}</div>
        <div>白天：{{ record.correctRateDay }} 夜晚：{{ record.correctRateNight }}</div>
        <div>晴天：{{ record.correctRateSun }} 非晴天：{{ record.correctRateNoSun }}</div>
      </template>

      <!-- 主动发现率 -->
      <template #column-earlyRate="{ record }">
        <div>{{ record.earlyRate }}</div>
        <div>白天：{{ record.earlyRateDay }} 夜晚：{{ record.earlyRateNight }}</div>
        <div>晴天：{{ record.earlyRateSun }} 非晴天：{{ record.earlyRateNoSun }}</div>
      </template>

      <!-- 相机检出距离 -->
      <template #column-cameraCheckRange="{ record }">
        <div>
          检出平均数：{{
            record.avgRangeChecked + (record.avgRangeChecked === '无' ? '' : '米')
          }}
        </div>
        <div>
          检出中位数：{{
            record.medianRangeChecked + (record.medianRangeChecked === '无' ? '' : '米')
          }}
        </div>
        <!-- <div>
          非检出平均值：{{
            record.avgRangeNoChecked + (record.avgRangeNoChecked === '无' ? '' : '米')
          }}
        </div>
        <div>
          非检出中位数：{{
            record.medianRangeNoChecked +
            (record.medianRangeNoChecked === '无' ? '' : '米')
          }}
        </div> -->
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
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'
import selfStore from './modules/self-store'
import SelfForm from './modules/SelfForm'
import Table from '@/components/base/Table.vue'
import createTableVariables from '@/assets/scripts/create-table-variables'
import SelfModal from './modules/SelfModal'

/* 表单 */
const formData = computed(() => selfStore.formData)

/* 表格 */
const { tableData, loading, columns, getTableData } = createTableVariables({
    api: 'getStatisticsTable',
    columns: [
      // 列配置
      {
        title: '序号',
        dataIndex: 'indexNum',
        width: 60
      },
      {
        title: '统计时间',
        dataIndex: 'dataSourceDate',
        width: 110
      },
      {
        title: '厂商',
        dataIndex: 'corpName',
        width: 110
      },
      {
        title: '检出率',
        dataIndex: 'checkRate',
        renderBySlot: true,
        width: 230,
        maxWidth: 230
      },
      {
        title: '正确率',
        dataIndex: 'correctRate',
        renderBySlot: true,
        width: 230,
        maxWidth: 230
      },
      {
        title: '主动发现率',
        dataIndex: 'earlyRate',
        renderBySlot: true,
        width: 230,
        maxWidth: 230
      },
      {
        title: '业务转换率',
        dataIndex: 'bsRate',
        width: 100
      },
      {
        title: '报错率',
        dataIndex: 'errorRate',
        width: 70
      },
      {
        title: '相机检出距离',
        dataIndex: 'cameraCheckRange',
        renderBySlot: true,
        width: 180
      }
    ],
    extData: formData.value,
    pagination: false,
    afterGetData: res => {
      res.data.forEach((e, i) => {
        e.indexNum = i + 1
      })
    }
  }),
  tableMaxHeight = computed(() => {
    return `${innerHeight - 300}px`
  })

const theData = ref({}), // 当前选中行弹窗所需数据
  viewDetails = rowData => {
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

onMounted(() => {
  getTableData()
})

onBeforeUnmount(() => {
  // 初始化 formData 数据
  selfStore.initialize('formData')
})
</script>

<style lang="less" scoped>
/* 表格 */
.table-wrap {
  height: calc(100% - 300px);
}
</style>
