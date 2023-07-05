import axios from 'axios'
import request from '@/utils/request'
import qs from 'qs'
import { baseURL } from '@/config'

export default {
  // 保留请求取消
  cancels: {},

  // 根据条件查询摄像机列表
  getCamerasByCondition(params) {
    this.cancels['getCamerasByCondition']?.()
    return request.post(
      '/cameraManage/getCameraListByParam',
      params,
      {
        cancelToken: new axios.CancelToken(c => {
          this.cancels['getCamerasByCondition'] = c
        })
      }
    )
  },

  // 导出摄像机列表
  exportCamerasFile: params =>
    new Promise(resolve =>
      resolve(
        `${baseURL}/cameraManage/exportCameraListByParam?${qs.stringify(
          params
        )}`
      )
    ),

  // 同步摄像机（qsId: string, userId: string）
  syncCameras: params =>
    request.post('open/syncVideoPage', params),

  // 获取同步时间
  getSyncTime: params =>
    request.post('cameraManage/getSyncDate', params)
}
