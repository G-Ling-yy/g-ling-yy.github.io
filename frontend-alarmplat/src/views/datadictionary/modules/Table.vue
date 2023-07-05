<template>
  <ma-table
    childrenColumnName="null"
    :columns="columns"
    :dataSource="tableData"
    :expandedRowKeys="expandedRowKeys"
    :loading="loading"
    :pagination="pagination"
    :scroll="{ y: tableHeight }"
    @change="tableChangeHandler"
    @expand="tableExpandHandler"
  >
    <!-- 单元格自定义内容 -->
    <template #bodyCell="{ column, record, text }">
      <!-- 可编辑栏 -->
      <template
        v-if="['typeDesc'].includes(column.dataIndex)"
      >
        <!-- 编辑中 -->
        <template v-if="record.isSelfEditing">
          <ma-input
            v-model:value="
              editableData[record.key][column.dataIndex]
            "
            autofocus
          />
        </template>

        <!-- 非编辑中 -->
        <template v-else>{{ text }}</template>
      </template>

      <!-- 操作栏 -->
      <template v-if="column.key === 'operation'">
        <!-- 操作按钮 -->
        <div class="btns">
          <!-- 新增按钮 -->
          <span
            class="edit btn"
            @mousedown="mousedownAddHandler"
            @click="clickAddHandler(record)"
          >
            新增
          </span>

          <!-- 编辑中 -->
          <template v-if="record.isSelfEditing">
            <!-- 取消按钮 -->
            <span
              class="del btn"
              @click="cancelRow(record)"
            >
              取消
            </span>

            <!-- 保存按钮 -->
            <span class="edit btn" @click="saveRow(record)">
              保存
            </span>
          </template>

          <!-- 非编辑中 -->
          <!-- 编辑按钮 -->
          <span
            v-else
            class="edit btn"
            @click="editRow(record)"
            >编辑</span
          >

          <!-- 删除按钮 -->
          <ma-popconfirm
            :title="`确定删除 字典：${
              record.typeDesc || ''
            }?`"
            @confirm="delRow(record)"
          >
            <span class="del btn">删除</span>
          </ma-popconfirm>
        </div>
      </template>
    </template>

    <!-- 展开内容 -->
    <template #expandedRowRender="{ record }">
      <ma-table
        :columns="innerColumns"
        :dataSource="record.children"
        :loading="record.loading"
        :pagination="false"
      >
        <!-- 单元格自定义内容 -->
        <template
          #bodyCell="{
            column: innerColumn,
            record: innerRecord,
            text: innerText
          }"
        >
          <!-- 可编辑栏 -->
          <template
            v-if="
              ['key', 'value', 'order'].includes(
                innerColumn.dataIndex
              )
            "
          >
            <!-- 编辑中 -->
            <template v-if="innerRecord.isSelfEditing">
              <ma-input
                v-model:value="
                  record.editInnerTableData[
                    innerRecord._id
                  ][innerColumn.dataIndex]
                "
                autofocus
              />
            </template>

            <!-- 非编辑中 -->
            <template v-else>{{ innerText }}</template>
          </template>

          <!-- 自定义渲染栏 -->
          <template v-if="innerColumn.key === 'enable'">
            <!-- 编辑中 -->
            <template v-if="innerRecord.isSelfEditing">
              <ma-switch
                v-model:checked="
                  record.editInnerTableData[
                    innerRecord._id
                  ][innerColumn.dataIndex]
                "
                :checkedValue="1"
                :unCheckedValue="0"
              />
            </template>

            <!-- 非编辑中 -->
            <template v-else>
              <ma-switch
                :checked="
                  innerRecord[innerColumn.dataIndex]
                "
                :checkedValue="1"
                disabled
                :unCheckedValue="0"
              />
            </template>
          </template>

          <!-- 操作栏 -->
          <template v-if="innerColumn.key === 'operation'">
            <!-- 操作按钮 -->
            <div class="btns">
              <!-- 编辑中 -->
              <template v-if="innerRecord.isSelfEditing">
                <!-- 取消按钮 -->
                <span
                  class="del btn"
                  @click="
                    cancelInnerRow(innerRecord, record)
                  "
                >
                  取消
                </span>

                <!-- 保存按钮 -->
                <span
                  class="edit btn"
                  @click="saveInnerRow(innerRecord, record)"
                >
                  保存
                </span>
              </template>

              <!-- 非编辑中 -->
              <!-- 编辑按钮 -->
              <span
                v-else
                class="edit btn"
                @click="editInnerRow(innerRecord, record)"
              >
                编辑
              </span>

              <!-- 删除按钮 -->
              <ma-popconfirm
                v-if="innerRecord.id"
                :title="`确定删除 id：${
                  innerRecord.id || ''
                }?`"
                @confirm="delInnerRow(innerRecord, record)"
              >
                <span class="del btn">删除</span>
              </ma-popconfirm>
            </div>
          </template>
        </template>
      </ma-table>
    </template>
  </ma-table>

  <!-- 新增类 弹窗 -->
  <FormModal
    v-if="formModalShow"
    v-model:visible="formModalShow"
    @addSuccess="getTableData"
  />
</template>

<script setup>
/* eslint no-unused-vars: off */
import {
  ref,
  reactive,
  computed,
  onMounted,
  onBeforeUnmount
} from 'vue'
import createTableVariables from '@/assets/scripts/create-table-variables'
import apis from '@/api'
import { cloneDeep } from '@/utils/lodash'
import { message } from 'ant-design-vue'
import FormModal from './Form'
import { useStore } from 'vuex'

const store = useStore()

/* 表格 */
// 外层表格
const {
    tableData,
    loading,
    pagination,
    columns,
    tableChangeHandler,
    getTableData
  } = createTableVariables({
    api: 'dataDictionary/getOutData',
    columns: [
      // 列配置
      {
        title: '类序号',
        dataIndex: 'indexNum',
        width: 80,
        minWidth: 80
      },
      {
        title: '类型',
        dataIndex: 'key'
      },
      {
        title: '描述',
        dataIndex: 'typeDesc'
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        width: 300
      }
    ],
    pagination: {
      pageSize: 20
    },
    extData: {},
    afterGetData: res => {
      expandedRowKeys.splice(0)
      res.data.forEach((e, i) => {
        e.indexNum =
          res.page.pageSize * (res.page.currentPage - 1) +
          i +
          1 // 序号
        e.isAdding = false // 内层新增中
        e.loading = false // 内层获取loading
        e.isSelfEditing = false // 外层自身编辑中
        e.editInnerTableData = {} // 内层编辑数据
      })
    }
  }),
  expandedRowKeys = reactive([]), // 展开行keys控制
  curExpandRecord = ref({}), // 当前展开行record
  // 点击展开图标时触发
  tableExpandHandler = (expanded, record) => {
    if (expanded) {
      expandedRowKeys.push(record.key)
      getInnerTableData(record)
    } else {
      expandedRowKeys.splice(
        expandedRowKeys.indexOf(record.key),
        1
      )
    }
  },
  tableHeightUpdatedMark = ref(0), // 用于触发表格高度的重新计算
  // 用于触发表格高度的重新计算
  updateTableHeightMark = () => {
    tableHeightUpdatedMark.value++
  },
  // 表格高度
  tableHeight = computed(() => {
    const m = tableHeightUpdatedMark.value
    return `${innerHeight - 290}px`
  }),
  // 用于编辑的克隆对象
  editableData = reactive({}),
  // 编辑record
  editRow = record => {
    record.isSelfEditing = true
    editableData[record.key] = cloneDeep(record)
  },
  // 取消编辑record
  cancelRow = record => {
    record.isSelfEditing = false
    delete editableData[record.key]
  },
  // 保存编辑record
  saveRow = record => {
    const type = editableData[record.key].key,
      typeDesc = editableData[record.key].typeDesc
    loading.value = true
    apis.dataDictionary
      .setOutData({
        type,
        typeDesc
      })
      .then(() => {
        message.success('修改成功')
        record.typeDesc = typeDesc
      })
      .finally(() => {
        loading.value = false
        record.isSelfEditing = false
      })
  },
  // 删除record
  delRow = record => {
    apis.dataDictionary
      .delOutData({
        type: record.key
      })
      .then(() => {
        message.success('删除成功')
        delete editableData[record.key]

        // 本地表格数据删除外层record
        tableData.value.splice(
          tableData.value.findIndex(
            e => e.key === record.key
          ),
          1
        )
        tableData.value.forEach((e, i) => {
          e.indexNum =
            pagination.pageSize * (pagination.current - 1) +
            i +
            1 // 更新序号
        })
      })
  },
  // 新增内层row
  addInnerRow = async record => {
    // 若未展开则展开
    !expandedRowKeys.includes(record.key) &&
      expandedRowKeys.push(record.key)

    // 若没数据则获取
    if (!record.children?.length) {
      await getInnerTableData(record)
    }

    if (!record.isAdding) {
      const indexNum = record.children.length + 1,
        newInnerRow = {
          enable: 1,
          indexNum,
          isSelfEditing: true,
          key: '',
          order: '0',
          value: '',
          _id: 'newRowId'
        }
      record.children.push(newInnerRow)

      record.editInnerTableData['newRowId'] =
        cloneDeep(newInnerRow)
      record.isAdding = true
    }
  },
  // 新增 类 弹窗 显隐
  formModalShow = ref(false),
  // 新增按钮按下处理
  mousedownAddHandler = () => {
    formTimeout = setTimeout(() => {
      formModalShow.value = true
    }, 500)
  },
  // 新增按钮点击处理
  clickAddHandler = record => {
    clearTimeout(formTimeout)
    if (formModalShow.value) return

    addInnerRow(record)
  }

let formTimeout // 新增按钮长按触发

// 内层表格
// 列配置
const innerColumns = [
    {
      title: '序号',
      dataIndex: 'indexNum',
      width: 60,
      minWidth: 60
    },
    {
      title: 'id',
      dataIndex: 'id',
      width: 100,
      maxWidth: 100
    },
    {
      title: 'key',
      dataIndex: 'key'
    },
    {
      title: 'value',
      dataIndex: 'value'
    },
    {
      title: 'order',
      dataIndex: 'order'
    },
    {
      title: '启用',
      dataIndex: 'enable',
      key: 'enable',
      width: 150,
      maxMidth: 150
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      width: 200,
      maxMidth: 200
    }
  ],
  // 获取内层表格数据
  getInnerTableData = record => {
    curExpandRecord.value = record

    record.loading = true
    return apis.dataDictionary
      .getInnerData({
        type: record.key
      })
      .then(res => {
        const dic = [] // 用于更新store dictionary

        res.forEach((e, i) => {
          e.indexNum = i + 1 // 序号
          e.enable = Number(e.enable) // 是否启用字段统一数字类型
          e.isSelfEditing = false // 外层自身编辑中
          e._id = e.id

          dic.push({
            key: e.value,
            value: e.key
          })
        })
        curExpandRecord.value.children = res

        // 更新store dictionary
        store.commit('dataDictionary/setKeyDic', {
          key: record.key,
          dic
        })
      })
      .finally(() => {
        record.loading = false
      })
  },
  // 编辑内层row
  editInnerRow = (row, record) => {
    row.isSelfEditing = true
    record.editInnerTableData[row._id] = cloneDeep(row)
  },
  // 取消编辑内层row
  cancelInnerRow = (row, record) => {
    // 新增内层row的取消
    if (row._id === 'newRowId') {
      record.children.splice(-1)
      record.isAdding = false
    } else {
      /* 非新增内层row的取消 */
      row.isSelfEditing = false
    }

    delete record.editInnerTableData[row._id]
  },
  // 保存编辑内层row
  saveInnerRow = (row, record) => {
    // 各传参值
    const key = record.editInnerTableData[row._id].key,
      value = record.editInnerTableData[row._id].value,
      enable = record.editInnerTableData[row._id].enable,
      order = record.editInnerTableData[row._id].order

    // 简单校验
    if (!key || !value || !order) {
      message.warn('提交字段空值提醒')
      return
    }

    record.loading = true
    apis.dataDictionary
      .setInnerData({
        enable,
        id: row.id,
        key,
        order,
        type: record.key,
        typeDesc: record.typeDesc,
        value
      })
      .then(() => {
        message.success('修改成功')

        // 如果保存的是新增则取消标记
        row._id === 'newRowId' && (record.isAdding = false)

        // 重刷是因为可能的order或新增会影响顺序
        getInnerTableData(record)
      })
      .finally(() => {
        record.loading = false
        record.isSelfEditing = false
      })
  },
  // 删除内层row
  delInnerRow = (row, record) => {
    record.loading = true
    apis.dataDictionary
      .delInnerData({
        id: row.id,
        type: row.type
      })
      .then(() => {
        message.success('删除成功')
        record.children.splice(
          record.children.findIndex(e => e.id === row.id),
          1
        )
        delete record.editInnerTableData[row._id]

        // 删空了则同时删除外层
        if (!record.children.length) {
          // 本地表格数据删除外层record
          tableData.value.splice(
            tableData.value.findIndex(
              e => e.key === record.key
            ),
            1
          )
          tableData.value.forEach((e, i) => {
            e.indexNum =
              pagination.pageSize *
                (pagination.current - 1) +
              i +
              1 // 更新序号
          })
        }
      })
      .finally(() => {
        record.loading = false
      })
  }

onMounted(() => {
  getTableData()

  addEventListener('resize', updateTableHeightMark)
})

onBeforeUnmount(() => {
  removeEventListener('resize', updateTableHeightMark)
})
</script>

<style lang="less" scoped>
* {
  user-select: none;
}

.ant-spin-container {
  .ant-table-body {
    .ant-table-tbody {
      .ant-table-cell {
        .btns {
          .btn {
            color: @layout-color;
            margin-right: 1rem;
            &:last-child {
              margin-right: 0;
            }
          }
        }
      }
    }
  }
}
</style>
