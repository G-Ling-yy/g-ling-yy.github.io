import axios from 'axios'
import request from '@/utils/request'
import qs from 'qs'
import { baseURL } from '@/config'

export default {
  // 保留请求取消
  cancels: {},

  // 根据条件查询操作日志
  getOperationsLog(params) {
    this.cancels['getOperationsLog']?.()
    return request.post(
      '/operateLog/queryOperateLog',
      params,
      {
        cancelToken: new axios.CancelToken(c => {
          this.cancels['getOperationsLog'] = c
        })
      }
    )
  },

  // 导出操作日志
  exportOperationsLogFile: params =>
    new Promise(resolve =>
      resolve(
        `${baseURL}/operateLog/exportOperateLog?${qs.stringify(
          params
        )}`
      )
    )

// 查询统计表格数据记录
// queryOwnerRecord(params) {
//   this.cancels['queryOwnerRecord']?.()
//   return request.post(
//     `/statisticForOwner/queryStatisticsForOwnerRecord`,
//     params,
//     {
//       cancelToken: new axios.CancelToken(c => {
//         this.cancels['queryOwnerRecord'] = c
//       })
//     }
//   )
//  },

// //  查询统计表格数据(内层弹窗数据)
// queryForOwner(params) {
//   this.cancels['queryForOwner']?.()
//   return request.post(
//     `/statisticForOwner/queryStatisticsForOwner`,
//     params,
//     {
//       cancelToken: new axios.CancelToken(c => {
//         this.cancels['queryForOwner'] = c
//       })
//     }
//   )
// }
}