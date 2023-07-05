<template>
  <div class="page camera-management-page">
    <!-- 查询条件 -->
    <div class="form-wrap">
      <SelfFormVue @search="search" />
    </div>

    <main>
      <!-- 表格 -->
      <div class="table-wrap">
        <Table
          :customRow="customRow"
          tableClass="self-table"
          :tableData="tableData"
          :row-key="'id'"
          :columns="columns"
          :height="tableMaxHeight"
          :loading="loading"
          :isSelect="false"
          :pagination="pagination"
          :operation="false"
          operationTitle="操作"
          :operationWidth="80"
          :show-view-btn="false"
          :showEditBtn="false"
          :showDelBtn="false"
          @change="tableChangeHandler"
        >
          <!-- 报警来源 -->
          <template #column-relatedCorpsName="{ record }">
            <ma-tooltip
              placement="topLeft"
              :title="record.relatedCorpsName"
            >
              <div class="ellipsis">
                <span>
                  {{ record.relatedCorpsName }}
                </span>
              </div>
            </ma-tooltip>
          </template>
        </Table>
      </div>

      <!-- 报警录像 -->
      <section>
        <div class="title">报警录像</div>

        <!-- 首次报警 -->
        <div class="media-wrap">
          <div class="info">
            <span> 首次报警录像: </span>
            <span>
              {{ checkdRowData.begTime }}
            </span>
          </div>

          <div class="video-wrap">
            <VideoVue
              v-if="checkdRowData.bodyId"
              autoplay
              :loading="mediaLoading"
              :src="mediaData.begUrl"
              :extraData="{
                frameRate: mediaData.xxx
              }"
              :framesUrl="mediaData.begMarkPath"
              :showSnapshotBtn="false"
              :type="
                mediaData.begImageUrl ? 'image' : 'video'
              "
            />
            <!-- 占位图 -->
            <img
              v-else
              src="@/assets/images/placeholder_img.png"
            />
          </div>
        </div>

        <!-- 最新报警 -->
        <div class="media-wrap">
          <div class="info">
            <span> 最新报警录像: </span>
            <span>
              {{ checkdRowData.endTime }}
            </span>
          </div>

          <div class="video-wrap">
            <VideoVue
             format="YYYY-MM-DD"
              v-if="checkdRowData.bodyId"
              autoplay
              :loading="mediaLoading"
              :src="mediaData.endUrl"
              :extraData="{
                frameRate: mediaData.yyy
              }"
              :framesUrl="mediaData.endMarkPath"
              :showSnapshotBtn="false"
              :type="
                mediaData.endImageUrl ? 'image' : 'video'
              "
            />
            <!-- 占位图 -->
            <img
              v-else
              src="@/assets/images/placeholder_img.png"
            />
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import {
  ref,
  computed,
  onMounted,
  onBeforeUnmount
} from 'vue'
import SelfFormVue from './modules/SelfForm.vue'
import selfStore from './modules/self-store'
import Table from '@/components/base/Table.vue'
import createTableVariables from '@/assets/scripts/create-table-variables'
import { getFirstMatchParentEl } from '@/utils/myTools'
import { debounce } from '@/utils/lodash'
import apis from '@/api'
// 标框播放器
import VideoVue from '@/components/base/Video.vue'

/* 表单数据 */
const formData = computed(() => selfStore.formData),
  search = () => {
    pagination.current = 1

    getTableData()
  }

/* 表格 */
const {
    tableData,
    loading,
    pagination,
    columns,
    tableChangeHandler,
    getTableData
  } = createTableVariables({
    api: 'getRoadAlarmListByConditions',
    columns: [
      // 列配置
      {
        title: '序号',
        dataIndex: 'indexNum',
        width: 60
      },
      {
        title: '事件类型',
        dataIndex: 'eventTypeName',
        width: 90
      },
      {
        title: '报警日期',
        dataIndex: 'begTime',
        reRender: data => data?.split(' ')?.[0],
        width: 110
      },
      {
        title: '首次报警时间',
        dataIndex: 'begTime',
        reRender: data => data?.split(' ')?.[1],
        width: 100
      },
      {
        title: '最新报警时间',
        dataIndex: 'endTime',
        reRender: data => data?.split(' ')?.[1],
        width: 100
      },
      {
        title: '报警位置',
        dataIndex: 'mileageNo',
        width: 120
      },
      {
        title: '归属路线',
        dataIndex: 'roadName',
        reRender: (data, row) => `${row.roadCode}${data}`,
        width: 120
      },
      {
        title: '报警来源',
        dataIndex: 'relatedCorpsName',
        renderBySlot: true,
        width: 150
      },
      {
        title: '自然报警数',
        dataIndex: 'alarmCount',
        width: 90
      }
    ],
    extData: () => formData.value,
    afterGetData: res => {
      res.data.forEach((e, i) => {
        e.indexNum =
          res.page.pageSize * (res.page.currentPage - 1) +
          i +
          1
      })
    },
    beforeGetData: () => {
      checkdRowDom?.classList?.remove('checked')
      checkdRowData.value = {}
      mediaData.value = {}
    },
    pagination: {
      pageSize: 100
    }
  }),
  customRow = record => ({
    onClick: evt => {
      /* 获取对应body的媒体数据 */
      console.log('record', record)
      // 选中当前行高亮
      const trDom = getFirstMatchParentEl(
        evt.target,
        'tr.ant-table-row'
      )
      checkdRowDom?.classList?.remove('checked')
      trDom.classList.add('checked')
      checkdRowDom = trDom

      checkdRowData.value = record

      mediaLoading.value = true
      apis.events
        .getMediaByBodyId({
          storyBodyId: record.bodyId
        })
        .then(res => {
          mediaData.value = {
            ...res,
            begUrl: res.begImageUrl || res.begPath,
            endUrl: res.endImageUrl || res.lastPath
          }
        })
        .finally(() => {
          mediaLoading.value = false
        })
    }
  }),
  tableMaxHeight = ref(`${innerHeight - 330}px`)

let checkdRowDom // 选中行dom

const checkdRowData = ref({}), // 选中行数据
  mediaData = ref({}), // 媒体数据
  mediaLoading = ref(false)

// 表格高度监听实例
let tableHeightObserver = new ResizeObserver(
  debounce(() => {
    tableMaxHeight.value = `${innerHeight - 330}px`
  }, 200)
)

onMounted(() => {
  // 监听导致表格高度变化的dom
  tableHeightObserver.observe(document.body)
})

onBeforeUnmount(() => {
  // 初始化 formData 数据
  selfStore.initialize()

  /* 关销 监听 实例 */
  tableHeightObserver.unobserve(document.body)
  tableHeightObserver = null
})
</script>

<style lang="less" scoped>
*:not([class|='ant']) {
  margin: 0;
  padding: 0;
}

.page {
  background-color: #f0f2f5;
  display: flex;
  flex-direction: column;
  height: calc(100% + 40px);
  margin: -20px;
  overflow: hidden;
  position: relative;
  width: calc(100% + 40px);

  .form-wrap {
    background-color: #fff;
    border-radius: 4px;
    margin-bottom: 20px;
    padding: 1rem 1rem 0;
  }

  main {
    display: flex;
    flex: 1;

    .table-wrap {
      background-color: #fff;
      padding: 1rem;
      width: min(
        calc(100% - 320px),
        calc(100% - 20% - 20px)
      );

      .ant-table-wrapper {
        .ant-table-body {
          .ant-table-cell {
            span {
              &.high-light {
                color: @layout-color;
              }
            }
          }
        }
      }
    }

    > section {
      background-color: #fff;
      margin-left: 20px;
      padding: 1rem;
      width: max(300px, 20%);

      .title {
        font-weight: bold;
        margin-bottom: 1rem;
      }

      .media-wrap {
        .info {
          color: @layout-color;
        }

        .video-wrap {
          background-color: #333;
          margin-bottom: 0.5rem;
          position: relative;
          &::before {
            content: '';
            display: block;
            padding: 56.25% 0 0;
          }

          .container,
          > img {
            left: 0;
            position: absolute;
            top: 0;
          }

          > img {
            height: 100%;
            object-fit: cover;
            width: 100%;
          }
        }
      }
    }
  }
}
</style>
