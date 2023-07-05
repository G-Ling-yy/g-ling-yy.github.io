<template>
  <ma-modal
    centered
    :maskClosable="false"
    :footer="null"
    :title="title"
    visible="visible"
    ok-text="确定"
    cancel-text="取消"
    @cancel="
      emits('update:visible', false),
        isFetchSignSuccess && emits('updateTable')
    "
    width="calc(100vw - 110px)"
  >
    <div class="media-wrap">
      <div class="left">
        <!-- 表格 -->
        <div class="table-wrap">
          <Table
            tableClass="self-table"
            :customRow="customRow"
            :tableData="tableData"
            :row-key="'id'"
            :columns="columns"
            height="calc(55px * 10)"
            :loading="loading"
            :isSelect="false"
            :operation="false"
            :pagination="pagination"
            @change="tableChangeHandler"
          >
            <!-- 报警次数 -->
            <template #column-alarmCount="{ record }">
              <span style="margin-right: 1em">{{
                record.alarmCount
              }}</span>
              <ma-button
                @click.stop="viewDetails(record)"
                size="small"
                v-if="record.deviceType === 'camera'"
              >
                <template #icon
                  ><icon icon="eye-line"
                /></template>
                查看详情
              </ma-button>
            </template>
          </Table>
        </div>
      </div>

      <div class="right">
        <div class="media-show">
          <h1>
            首次告警：<span>{{
              mediaLoading
                ? '加载中···'
                : mediaData.begTime || ''
            }}</span>
          </h1>
          <div class="media">
            <!-- 占位图 -->
            <img
              v-if="mediaData.nodata && !mediaLoading"
              src="@/assets/images/placeholder_img.png"
            />

            <div
              v-else-if="mediaLoading"
              class="loading flex-center"
            >
              <ma-spin size="large" />
            </div>
            <VideoVue
              v-else-if="mediaData.begUrl"
              autoplay
              :framesUrl="mediaData.begMarkPath"
              :src="mediaData.begUrl"
              :type="
                mediaData.begImageUrl ? 'image' : 'video'
              "
            ></VideoVue>
            <div v-else class="tip flex-center">
              暂无媒体证据
            </div>
          </div>
        </div>
        <div class="media-show">
          <h1>
            最新告警：<span>{{
              mediaLoading
                ? '加载中···'
                : mediaData.lastTime || ''
            }}</span>
          </h1>
          <div class="media">
            <!-- 占位图 -->
            <img
              v-if="mediaData.nodata && !mediaLoading"
              src="@/assets/images/placeholder_img.png"
            />

            <div
              v-else-if="mediaLoading"
              class="loading flex-center"
            >
              <ma-spin size="large" />
            </div>
            <VideoVue
              v-else-if="mediaData.endUrl"
              autoplay
              :framesUrl="mediaData.endMarkPath"
              :src="mediaData.endUrl"
              :type="
                mediaData.endImageUrl ? 'image' : 'video'
              "
            ></VideoVue>
            <div v-else class="tip flex-center">
              暂无媒体证据
            </div>
          </div>
        </div>
      </div>

      <!-- 大loading遮罩 -->
      <div class="loading flex-center" v-show="allLoading">
        <ma-spin size="large" />
      </div>
    </div>
  </ma-modal>
</template>

<script setup>
import apis from '@/api'
import Table from '@/components/base/Table.vue'
import createTableVariables from '@/assets/scripts/create-table-variables'
import { getFirstMatchParentEl } from '@/utils/myTools'
import VideoVue from '@/components/base/Video.vue'

const { ref, onMounted } = require('vue')

const props = defineProps({
    data: {
      type: Object,
      default: () => ({})
    },

    title: {
      type: String,
      default: 'modal'
    },

    visible: {
      type: Boolean,
      default: false
    }
  }),
  emits = defineEmits(['update:visible', 'updateTable'])

const allLoading = ref(false), // 组件loading遮罩
  isFetchSignSuccess = ref(false) // 是否成功发送标定请求
let checkdRowDom // 选中行dom

/* 表格 */
const {
    children,
    tableData,
    loading,
    columns,
    pagination,
    tableChangeHandler,
    getTableData
  } = createTableVariables({
    api: 'getCalibrateBodiesByDate',
    columns: [
      // 列配置,修改
      {
        title: '序号',
        dataIndex: 'indexNum',
        width: 120
      },
       {
        title: '时间',
        dataIndex: ['begTime', 'signDate'],
        width: 210,
        reRender: (data, row) => `上报 : ${row.begTime}  标定 : ${row.signDate}`
      },
      // {
      //   title: '上报时间',
      //   dataIndex: 'begTime',
      //   width: 180,
      //   reRender: data => `${data}`
      // },
      // {
      //   title: '标定时间',
      //   dataIndex: 'signDate',
      //   width: 180,
      //   reRender: data => `${data}`
      // },
       {
        title: '差值',
        dataIndex: 'difference',
        reRender: data => `${data}分钟`,
        width: 120
      },
       {
        title: '标定人',
        dataIndex: 'userName',
        width: 160,
        reRender: (data, row) =>
          `${
            row.userName == null
            ? ''
            : `${data}`
        }`
      },
      {
        title: '厂商名称',
        dataIndex: 'corpName',
        width: 170,
        reRender: data => `${data}`
      },
      // { 原本的代码
      //   title: '日期',
      //   dataIndex: 'begTime',
      //   reRender: data => data.split?.(' ')?.[0]
      // },
      // {
      //   title: '时间',
      //   dataIndex: 'begTime',
      //   reRender: data => data.split?.(' ')?.[1]
      // },
      {
        title: '报警类型',
        dataIndex: 'eventTypeName',
        ellipsis: true,
        reRender: (data, row) =>
          `${
            row.objectNum > 0
              ? `${row.objectNum} ${
                  row.objectTypeName?.includes('车')
                    ? '辆'
                    : '个'
                }`
              : ''
          }${row.objectTypeName} - ${data}`
      },
      {
        title: '标定状态',
        width: 170,
        dataIndex: 'signStatus'
      }
    ],
    extData: props.data,
    afterGetData: res => {
      console.log('111111111111112222222222222:', props)
      res.data.forEach((e, i) => {
        e.indexNum =
          res.page.pageSize * (res.page.currentPage - 1) +
          i +
          1
      })

      // 清 表格选中行效果 及 右侧视频内容
      checkdRowDom?.classList?.remove('checked')
      mediaData.value = { nodata: true }
    }
  }),
  customRow = record => ({
    onClick: evt => {
      /* 获取对应body的媒体数据 */
      // 选中当前行高亮
      const trDom = getFirstMatchParentEl(
        evt.target,
        'tr.ant-table-row'
      )
      checkdRowDom?.classList?.remove('checked')
      trDom.classList.add('checked')
      checkdRowDom = trDom

      mediaLoading.value = true
      apis.events
        .getMediaByBodyId({
          storyBodyId: record.storyBodyId
        })
        .then(res => {
          mediaData.value = {
            ...res,
            begUrl: res.begImageUrl || res.begPath,
            endUrl: res.endImageUrl || res.lastPath,
            begTime: res.begTime?.split?.(' ')?.[1],
            lastTime: res.lastTime?.split?.(' ')?.[1]
          }
        })
        .finally(() => {
          mediaLoading.value = false
        })
    }
  })

// 媒体查询
const mediaLoading = ref(false),
  mediaData = ref({ nodata: true })

onMounted(() => {
  // 获取表格数据
  getTableData()
  console.log('tableData2222222222222:', tableData)
})
</script>

<style lang="less" scoped>
.media-wrap {
  align-items: flex-start;
  display: flex;
  max-height: 80vh;
  min-height: 657px;
  margin: 0 auto;
  position: relative;
  & > .loading {
    background-color: #0003;
    cursor: not-allowed;
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
    z-index: 99;
  }

  .left {
    flex: 1;
    height: 100%;

    /* 简易操作栏 */
    .simple-bar {
      align-items: center;
      display: flex;
      height: 40px;
      justify-content: space-between;
      margin-bottom: 15px;

      .info {
        font-size: 18px;
      }

      .act-bar {
        & > * {
          margin-right: 10px;
        }

        .sign-status {
          display: inline-block;
        }
      }
    }
  }

  .right {
    @rightWidth: 22vw;

    height: 100%;
    overflow-x: hidden;
    overflow-y: overlay;
    width: @rightWidth;
    min-width: @rightWidth;

    .media-show {
      margin-bottom: 6vh;
      padding: 0 15px;
      &:last-child {
        margin-bottom: 0;
      }

      h1 {
        color: #1890ff;
        font-size: 18px;

        span {
          color: #000000d9;
          font-size: 15px;
        }
      }

      .media {
        height: calc((@rightWidth - 30px) / 16 * 9);
        position: relative;

        img {
          display: block;
          margin: 0 auto;
          height: calc((@rightWidth - 30px) / 16 * 9);
        }

        .loading,
        video,
        .tip {
          height: calc((@rightWidth - 30px) / 16 * 9);
        }

        video {
          display: block;
        }

        .tip {
          text-align: center;
        }
      }
    }
  }
}
</style>
