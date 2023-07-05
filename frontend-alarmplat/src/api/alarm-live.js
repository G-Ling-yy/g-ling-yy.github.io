import axios from 'axios'
import request from '@/utils/request'
import qs from 'qs'

export default {
  // 保留请求取消
  cancels: {},

  // 获取地图报警列表数据（可选signStatus: number 0 全部, 1 未标定, 2 超过5分钟确认报警, 3 五分钟内确认报警）
  getAlarmsByFilter() {
    this.cancels['getAlarmsByFilter']?.()
    return request.post(
      `/alarmLive/queryFilterAlarmInfo`,
      {},
      {
        cancelToken: new axios.CancelToken(c => {
          this.cancels['getAlarmsByFilter'] = c
        })
      }
    )
  },

  // 获取地图64路什么Poc摄像机数据
  getPocCameras: () =>
    request.post(`/alarmLive/queryPocCameraInfo`),

  // 获取报警摄像机树
  getAlarmsTree() {
    this.cancels['getAlarmsTree']?.()
    return request.post(
      `/alarmLive/queryAlarmCameraList`,
      {},
      {
        cancelToken: new axios.CancelToken(c => {
          this.cancels['getAlarmsTree'] = c
        })
      }
    )
  },

  // 获取今日报警数量统计（可选signStatus: number 0 全部, 1 未标定, 2 超过5分钟确认报警, 3 五分钟内确认报警）
  getTodayAlarmStatistics() {
    this.cancels['getTodayAlarmStatistics']?.()
    return request.post(
      `/alarmLive/queryStatisticsToday`,
      {},
      {
        cancelToken: new axios.CancelToken(c => {
          this.cancels['getTodayAlarmStatistics'] = c
        })
      }
    )
  },

  // 根据storyId获取报警详情（storyId: string）
  getAlarmDetailByStoryId(params) {
    this.cancels['getAlarmDetailByStoryId']?.()
    return request.post(
      `/alarmLive/queryAlarmDetailByParam`,
      params,
      {
        cancelToken: new axios.CancelToken(c => {
          this.cancels['getAlarmDetailByStoryId'] = c
        })
      }
    )
  },

  // 根据storyId获取报警动态（storyId: string）
  getAlarmTrendsByStoryId(params) {
    this.cancels['getAlarmTrendsByStoryId']?.()
    return request.post(
      `/alarmLive/queryAlarmDynamicsByParam`,
      params,
      {
        cancelToken: new axios.CancelToken(c => {
          this.cancels['getAlarmTrendsByStoryId'] = c
        })
      }
    )
  },

  // 根据cameraId获取报警直播流数据（id: string 传值cameraId, videoFormat: string 'FLV', videoRate: string '-1'）
  getAlarmLiveByCameraId(params) {
    this.cancels['getAlarmLiveByCameraId']?.()
    return request.post(`/open/getCameraPlayURL`, params, {
      cancelToken: new axios.CancelToken(c => {
        this.cancels['getAlarmLiveByCameraId'] = c
      })
    })
  },

  // 根据linkId获取报警直播流数据（link: string 传值linkId, videoFormat: string 'FLV', videoRate: string '-1'）
  getAlarmLiveByLinkId(params) {
    this.cancels['getAlarmLiveByLinkId']?.()
    return request.post(
      `/open/getCameraPlayURLByLink`,
      params,
      {
        cancelToken: new axios.CancelToken(c => {
          this.cancels['getAlarmLiveByLinkId'] = c
        })
      }
    )
  }
}
