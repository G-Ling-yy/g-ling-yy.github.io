<template>
    <ma-modal
    centered
    :footer="null"
    width="calc(100vw - 110px)"
    visible="visible"
    title="AI报警数据统计报表"
    ok-text="确定"
    cancel-text="取消"
    @ok="emits('update:visible', false)"
    @cancel="emits('update:visible', false)">
    <div>
        <span class="count-time">
        统计时间：2023-09-12 ~ 2023-09-19
        </span>
        <ma-button>
            导出数据
        </ma-button>
    </div>
    <div class="table-wrap">
        <ma-table
        tableClass="self-table"
        :scroll="{ x: 1600, y: 600 }"
        :dataSource="tableData"
        :rowKey="'id'"
        height="calc(59px * 10)"
        :isSelect="false"
        :loading="loading"
        :columns="columns"
        bordered
        :show-view-btn="false"
        :showEditBtn="false"
        :showDelBtn="false"
        :pagination="false"
        :locale="{emptyText: '目前暂无数据'}"
        >
        </ma-table>
    </div>
    </ma-modal>
</template>

<script setup>
import createTableVariables from '@/assets/scripts/create-table-variables'
import { ref, onMounted, computed, h } from 'vue'
import apis from '@/api'
import selfStore from './self-store'

// const visible = ref(false)
// const showModal = () => {
//     visible.value = true
// }
// const handleOk = e => {
//     console.log(e)
//     visible.value = false
// }

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

// 合并行
const customRenderFirst = ({ value, index, column, record }) => {
          const obj = {
            children: value,
            props: {}
          }
          if (record.indexNum === '合计') {
            if (column.dataIndex === 'indexNum') {
              obj.props.colSpan = 5
            } else if (['orgName', 'corps', 'cameraNum', 'eventTypeName'].includes(column.dataIndex)) {
              obj.props.colSpan = 0
            }
            obj.props.rowSpan = 1
          } else {
            if (column.dataIndex === 'eventTypeName') {
              obj.props.rowSpan = 1
            } else {
              switch (index) {
                case 0:
                  obj.props.rowSpan = 11
                  break
                default:
                  obj.props.rowSpan = 0
              }
            }
          }
          return obj
        }

const {
    tableData,
    getTableData,
    columns,
    loading,
    tableChangeHandler
} = createTableVariables({
api: 'queryForOwner',
columns : [
      {
        title: '序号',
        dataIndex: 'indexNum',
        width: 50,
        customRender: customRenderFirst
      },
      {
        title: '业主单位',
        dataIndex: 'orgName',
        width: 150,
        // customRender: customRender,
        customCell: (record) => {
            if (record) {
                return {
                    style:{
                        whiteSpace: 'pre-wrap'
                    }
                }
            }
        },
        customRender: customRenderFirst
       },
      {
        title: '检测算法厂商',
        dataIndex: 'corps',
        className: 'wrapCorp',
        width: 120,
        // customRender: customRender,
        customCell: (record) => {
            if (record) {
                return {
                    style:{
                        whiteSpace: 'pre-wrap'
                    }
                }
            }
        },
        customRender: customRenderFirst
      },
      {
        title: '检测设备数',
        dataIndex: 'cameraNum',
        width: 100,
        customRender: customRenderFirst
      },
      {
        title: '算法报警',
        width: 200,
        children: [
            {
                title: '报警事件',
                dataIndex: 'eventTypeName',
                width: 100,
                customRender: customRenderFirst
            },
            {
                title: '自然报警数',
                dataIndex: 'abnormalBodyNum',
                width: 100
            },
            {
                title: '机器治理数',
                dataIndex: 'algorithmAccuracy',
                width: 100
            }
        ]
      },
      {
        title: '超过10分钟持续报警数',
        dataIndex: 'detail.abnormalBodyNum',
        width: 170
      },
      {
        title: '人工治理',
        width: 250,
        children: [
            {
                title: '错误报警数',
                dataIndex: 'artificialManagement.signErrorNum',
                width: 100
            },
            {
                title: '正确报警数',
                dataIndex: 'artificialManagement.signCorrectNum',
                width: 100
            }
        ]
      },
      {
          title: '算法正确率',
          dataIndex: 'detail.algorithmAccuracy',
          width: 100
      },
       {
        title: '算法检出率',
        dataIndex: ['detail', 'checkRate'],
        width: 100
      },
      {
          title: '业务报警',
          width: 400,
          children: [
              {
                  title: '报警事件',
                  dataIndex: 'reportList.eventTypeName',
                  width: 80
              },
              {
                  title: '推送数',
                  dataIndex: 'reportList.reportNum',
                  width: 80
              },
              {
                  title: '采纳数',
                  dataIndex: 'reportList.acceptNum',
                  width: 80
              }
          ]
      },
       {
          title: '业务反馈报警数',
          dataIndex: 'abnormalBodyNum',
          width: 150,
          customRender: customRenderFirst
       }
    ],
    extData: {
      recordId: props.data.recordId
    },
    afterGetData: res => {
        console.log('11111111111111111111')
        res = [...res[0].detail, {
          indexNum: '合计',
          algorithmAccuracy: '机器治理数总数',
          abnormalBodyNum: res[0].totalAlarmNum // 自然报警数
        }].map(e => ({
          ...e,
          orgName: res[0].orgName,
          corps: res[0].corps,
          eventTypeName: '报警事件'
        }))
        res.forEach((e, i) => {
          !e.indexNum && (e.indexNum = i + 1)
          console.log('2222222222222222222')
        })

        console.log('res,', res)
        return res
      }
})

onMounted(() => {
    // 获取表格数据
  getTableData()
})

</script>

<style lang="less" scoped>
::v-deep .ant-table-cell{
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
}
.count-time{
    padding: 0 1rem 0 0;
}
.table-wrap{
    margin-top: 1rem;
}

</style>