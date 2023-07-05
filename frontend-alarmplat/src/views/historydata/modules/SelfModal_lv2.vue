<template>
  <ma-modal
    centered
    :footer="null"
    :title="title"
    visible="visible"
    @ok="emits('update:visible', false)"
    @cancel="emits('update:visible', false)"
    width="calc(100vw - 400px)"
  >
    <div class="media-wrap">
      <div class="left">
        <!-- 简易操作栏 -->
        <div class="simple-bar">
          <div class="info">
            {{ data.date || '' }} {{ data.location || '' }}
          </div>
        </div>
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
            :operation="false"
            :show-view-btn="false"
            :showEditBtn="false"
            :showDelBtn="false"
          />
        </div>
      </div>
      <div class="right">
        <div class="media-show">
          <div class="media">
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
              v-else-if="mediaData.src"
              autoplay
              :framesUrl="mediaData.markUrl"
              :src="mediaData.src"
              :type="
                mediaData.src.includes('.mp4')
                  ? 'video'
                  : 'image'
              "
            ></VideoVue>
            <div v-else class="tip flex-center">
              暂无媒体证据
            </div>
          </div>
        </div>
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

const { ref, computed, onMounted } = require('vue')

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
  emits = defineEmits(['update:visible'])

let checkdRowDom

/* 简易操作栏 */

/* 表格 */
const { tableData, loading, columns, getTableData } =
    createTableVariables({
      api: 'getAlarmsByBodyId',
      columns: [
        // 列配置
        {
          title: '序号',
          dataIndex: 'indexNum',
          width: 50
        },
        {
          title: '报警位置',
          dataIndex: 'location',
          width: 100
        },
        {
          title: '报警类型',
          dataIndex: 'eventTypeName',
          reRender: (data, row) =>
            `${
              row.objectNum > 0
                ? `${row.objectNum} ${
                    row.objectTypeName?.includes('车')
                      ? '辆'
                      : '个'
                  }`
                : ''
            }${row.objectTypeName} - ${data}`,
          width: 60
        },
        {
          title: '报警厂商',
          dataIndex: 'corpName',
          width: 70
        },
        {
          title: '报警时间',
          dataIndex: 'detectTime',
          reRender: data => data.split?.(' ')?.[1],
          width: 60
        }
      ],
      extData: {
        storyBodyId: props.data.id
      },
      pagination: false,
      afterGetData: res => {
        console.log('res111111111111:', res)
        res.data.forEach((e, i) => {
          e.indexNum = i + 1
          console.log('e1111111111111:', e)
          console.log('i1111111111111:', i)
        })
      }
    }),
  tableMaxHeight = computed(() => {
    return `${innerHeight - 320}px`
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

      mediaLoading.value = true
      apis.events
        .getMediaByAlarmId({ alarmId: record.id })
        .then(({ data }) => {
          mediaData.value = {
            ...data,
            src: data.mediaUrl || data.imageUrls?.[0]
          }
        })
        .finally(() => {
          mediaLoading.value = false
        })
    }
  }),
  mediaLoading = ref(false),
  mediaData = ref({ nodata: true }) // 所查媒体数据

onMounted(() => {
  // 获取表格数据
  getTableData()
})
</script>

<style lang="less" scoped>
.media-wrap {
  align-items: center;
  display: flex;
  max-height: 80vh;
  margin: 0 auto;

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
        min-height: calc((@rightWidth - 30px) / 16 * 9);
        position: relative;

        img {
          display: block;
          margin: 0 auto;
          max-height: calc((@rightWidth - 30px) / 16 * 9);
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
