import axios from 'axios'
import request from '@/utils/request'
import qs from 'qs'
import { baseURL } from '@/config'

/* eslint no-unused-vars: off */
const faker = apiStr =>
  new Promise((resolve, reject) => {
    const data = {
      login: {
        code: 200,
        data: null,
        msg: '登录成功！',
        success: true
      },

      userInfo: {
        code: 200,
        data: {
          ability: ['READ'],
          avatar:
            'https://i.gtimg.cn/club/item/face/img/2/15922_100.gif',
          roles: ['admin'],
          username: 'admin'
        },
        msg: '登录成功！',
        success: true
      }
    }[apiStr] || {
      code: 200,
      data: {
        params: apiStr
      },
      mes: 'come from faker~'
    }
    setTimeout(() => {
      apiStr?.result === 'failed'
        ? reject('假装失败')
        : resolve(data)
    }, 1000)
  })

export default {
  // 保留请求取消
  cancels: {},

  // 假装请求
  fakeRequest: p => faker(p),

  // 获取原始报警列表数据
  getOriginAlarms(params) {
    return request({
      url: '/alarm/queryAlarmByPage',
      method: 'post',
      data: params
    })
  },

  // 获取常量(type:String : 1.对象 2.事件 3.厂商 4.产品)
  getConstantByType(params) {
    return request({
      url: `/constant/queryConstantByType?${qs.stringify(
        params
      )}`,
      method: 'get'
    })
  },

  // 获取数据导出列表数据
  getStories(params) {
    return request({
      url: '/story/queryStoryByCondition',
      method: 'post',
      data: params
    })
  },

  // 导出 “数据导出” 数据
  exportStoriesFile(params) {
    return new Promise(resolve =>
      resolve(
        `${baseURL}/story/exportStory?${qs.stringify(
          params
        )}`
      )
    )
  },

  // 获取数据标定列表数据
  getStories_1(params) {
    return request({
      url: '/story/queryStoryToSign',
      method: 'post',
      data: params
    })
  },

  // 标定story状态（signStatus: string : 1正确, 0误报）
  signStoryStatus(params) {
    return request({
      url: `/story/signStory/${params.storyId}/${params.eventType}/${params.signStatus}`,
      method: 'put'
    })
  },

  // 获取story弹窗对应bodies数据（storyId: string）
  getBodiesByStoryId(params) {
    return request({
      url: `/body/queryBodyByStoryId?${qs.stringify(
        params
      )}`,
      method: 'get'
    })
  },

  // 获取body对应媒体数据（storyBodyId: string）
  getMediaByBodyId(params) {
    return request({
      url: `/body/getMediasByBodyId?${qs.stringify(
        params
      )}`,
      method: 'get'
    })
  },

  // 获取body对应报警数据（storyBodyId: string）
  getAlarmsByBodyId(params) {
    return request({
      url: `/alarm/getAlarmInfoByBodyId?${qs.stringify(
        params
      )}`,
      method: 'get'
    })
  },

  // 获取alarm对应媒体数据（alarmId: string）
  getMediaByAlarmId(params) {
    return request({
      url: `/alarm/getMediaUrlById?${qs.stringify(params)}`,
      method: 'get'
    })
  },

  // 获取统计分析表格数据（corp: string, data: string）
  getStatisticsTable: params =>
    request({
      url: `/task/queryStatisticalDataByCorp?${qs.stringify(
        params
      )}`,
      method: 'get'
    }),

  // 获取统计分析图表v1数据（corp: string, data: string）
  getStatisticsChart: params =>
    request({
      url: `/task/getStatisticalData?${qs.stringify(
        params
      )}`,
      method: 'get'
    }),

  // 获取统计分析图表v2数据（corp: string, data: string）
  getCumulativeStatisticsChart: params =>
    request({
      url: `/task/getCumulativeStatisticalData?${qs.stringify(
        params
      )}`,
      method: 'get'
    }),

  // 获取统计分析图表v3数据（corp: string, data: string）
  getRightStatisticsChart: params =>
    request({
      url: `/task/getPocCorpEventTypeStatisticalData?${qs.stringify(
        params
      )}`,
      method: 'get'
    }),

  // 获取统计分析图表v4 饼图数据（corps: string[], isPoc: string 0/1, eventTypes: string[], startDate: string, endDate: string）
  getEvtsPercentStatistics(params) {
    this.cancels['getEvtsPercentStatistics']?.()
    return request.post(
      `/task/queryAlarmCountByEventType`,
      params,
      {
        cancelToken: new axios.CancelToken(c => {
          this.cancels['getEvtsPercentStatistics'] = c
        })
      }
    )
  },

  // 获取统计分析图表v4 各厂商标定柱状图数据（corps: string[], isPoc: string 0/1, eventTypes: string[], startDate: string, endDate: string）
  getCorpsCalibrationCount(params) {
    this.cancels['getCorpsCalibrationCount']?.()
    return request.post(
      `/task/querySignDetailByCondition`,
      params,
      {
        cancelToken: new axios.CancelToken(c => {
          this.cancels['getCorpsCalibrationCount'] = c
        })
      }
    )
  },

  // 获取统计分析图表v4 各厂商标定累计正确率折线图数据（corps: string[], isPoc: string 0/1, eventTypes: string[], startDate: string, endDate: string）
  getCorpsCumulativeRight(params) {
    this.cancels['getCorpsCumulativeRight']?.()
    return request.post(
      `/task/queryCorrectRateByCondition`,
      params,
      {
        cancelToken: new axios.CancelToken(c => {
          this.cancels['getCorpsCumulativeRight'] = c
        })
      }
    )
  },

  // 获取统计分析图表v4 柱状图弹窗his数据（corps: string[], isPoc: string 0/1, eventTypes: string[], startDate: string, endDate: string）
  getHistoriesByConditions(params) {
    this.cancels['getHistoriesByConditions']?.()
    return request.post(
      `/task/getHisDataByCondition`,
      params,
      {
        cancelToken: new axios.CancelToken(c => {
          this.cancels['getHistoriesByConditions'] = c
        })
      }
    )
  },

  // 获取统计分析图表v4 柱状图弹窗bodies数据（corps: string[], isPoc: string 0/1, eventTypes: string[], startDate: string, endDate: string）
  getBodiesByConditions(params) {
    this.cancels['getBodiesByConditions']?.()
    return request.post(
      `/task/getBodyByCondition`,
      params,
      {
        cancelToken: new axios.CancelToken(c => {
          this.cancels['getBodiesByConditions'] = c
        })
      }
    )
  },

  // 获取 实时标定 各类型标定 数据
  getCurCalibrateCountOfTypes(params) {
    this.cancels['getCurCalibrateCountOfTypes']?.()
    return request({
      url: '/body/queryStatisticsBodyRedis',
      method: 'post',
      data: params,
      cancelToken: new axios.CancelToken(c => {
        this.cancels['getCurCalibrateCountOfTypes'] = c
      })
    })
  },

  // 获取 实时标定 应标body 数据（alaType: string）
  getBodyFromRedisByEvtType(params) {
    this.cancels['getBodyFromRedisByEvtType']?.()
    return request.post(
      `/body/queryBodyByConditionRedis`,
      params,
      {
        cancelToken: new axios.CancelToken(c => {
          this.cancels['getBodyFromRedisByEvtType'] = c
        })
      }
    )
  },

  // 获取 实时标定 相同story应标body 数据（alaEventId: string）
  getBodyFromRedisByBodyId(params) {
    this.cancels['getBodyFromRedisByBodyId']?.()
    return request.get(
      `/body/queryExtraBodyRedis?${qs.stringify(params)}`,
      {
        cancelToken: new axios.CancelToken(c => {
          this.cancels['getBodyFromRedisByBodyId'] = c
        })
      }
    )
  },

  // 获取 实时标定 body详情 数据（alaEventId: string, storyId: string）
  getBodyDetailInfo(params) {
    this.cancels['getBodyDetailInfo']?.()
    return request.get(
      `/body/getBodyDetailInfo?${qs.stringify(params)}`,
      {
        cancelToken: new axios.CancelToken(c => {
          this.cancels['getBodyDetailInfo'] = c
        })
      }
    )
  },

  // 标定 实时标定 应标body数据（isCorrect: string : 1正确, 0误报; isSend: string 1 事故救援）
  setBodyCalibrateStatus(params) {
    return request({
      url: '/body/markBodyByConditionRedis',
      method: 'post',
      data: params
    })
  },

  // 获取 实时标定 最近报警消息body列表（）
  getLatestBodiesFromRedis: params =>
    request.post('/body/queryBodyLatestRedis', params),

  // 获取 实时数据 列表数据
  getStoriesFromRedis(params) {
    return request({
      url: '/body/queryAllStoryRedis',
      method: 'post',
      data: params
    })
  },

  /* 
  截图上传（
    file,
    alarmId: string,
    timestamp: string 视频时间戳,
    frameIndex: Number | String 视频帧下标,
    position: Array<object> 标记信息 [{
      objectType: string,
      objectTypeName: string,
      positionStr: Array<object> 点位信息 [{x, y}, {x, y}]
    }]
  ）
   */
  uploadSnapshot: params =>
    request({
      url: '/alarm/uploadImage',
      method: 'post',
      data: params,
      timeout: 20 * 1000
    }),

  // 批量归档bodies（bodyIds: string[], isFiled: number (归档状态: 0 不归, 1 归), option: number (选项: 0:选中 1:已标注:全部 2:判定错误:全部)）
  fileBodies: params =>
    request({
      url: '/annotation/batchFileBody',
      method: 'post',
      data: params
    }),

  // 通过hisId获取对应截图数据列表（alarmId: string, source区分前后端截图，不用处理，在此处统一固定死 1）
  getSnapshotsByAlarmId(params) {
    this.cancels['getSnapshotsByAlarmId']?.()
    return request.post(
      `/alarm/queryScreenshot`,
      Object.assign(params, { source: 1 }),
      {
        cancelToken: new axios.CancelToken(c => {
          this.cancels['getSnapshotsByAlarmId'] = c
        })
      }
    )
  },

  // 通过screenshotId获取对应截图数据（screenShotId: string, source区分前后端截图，不用处理，在此处统一固定死 1）
  getSnapshotById(params) {
    this.cancels['getSnapshotById']?.()
    return request.post(
      `/sample/queryScreenShotByScreenShotId`,
      Object.assign(params, { source: 1 }),
      {
        cancelToken: new axios.CancelToken(c => {
          this.cancels['getSnapshotById'] = c
        })
      }
    )
  },

  // 通过screenshotId删除对应截图（screenshotId: string）
  delSnapshotByScreenshotId(params) {
    return request({
      url: '/annotation/deleteScreenshot',
      method: 'post',
      data: params
    })
  },

  // 图像标注页面 获取最近指定bodies数据
  getBodiesByConditions2(params) {
    this.cancels['getBodiesByConditions2']?.()
    return request.post(
      `/annotation/queryLatestBodyInfo`,
      params,
      {
        cancelToken: new axios.CancelToken(c => {
          this.cancels['getBodiesByConditions2'] = c
        })
      }
    )
  },

  // 图像标注页面 获取body对应封面（bodyId: string）
  getBodyCoverImageByBodyId: params =>
    request.get(
      `/body/getBodyCoverImage?${qs.stringify(params)}`
    ),

  // 图像标注页面 根据bodyId和下标获取his视频数据（bodyId: string, rank: number）
  getHisMediaByBodyId(params) {
    this.cancels['getHisMediaByBodyId']?.()
    return request.post(
      `/annotation/queryAlarmInfoByBodyId`,
      params,
      {
        cancelToken: new axios.CancelToken(c => {
          this.cancels['getHisMediaByBodyId'] = c
        })
      }
    )
  },

  // 样本库页面 获取入口各类型总数
  getSamplesTotal: () =>
    request.post('/sample/queryTotalSamples'),

  // 样本库页面 根据分类查询对应对象样本数
  getObjCountBySampleType: params =>
    request.post(
      '/sample/queryObjectNumByClassType',
      params
    ),

  // 样本库页面 获取样本列表数据（classType: string, startDate, endDate, objectTypes: string[], markMan, locationType）
  getSamplesList(params) {
    this.cancels['getSamplesList']?.()
    return request.post(
      `/sample/querySampleDetails`,
      params,
      {
        cancelToken: new axios.CancelToken(c => {
          this.cancels['getSamplesList'] = c
        })
      }
    )
  },

  // 摄像机管理
  getCamerasByCondition(params) {
    this.cancels['getSamplesList']?.()
    return request.post(
      `/sample/querySampleDetails`,
      params,
      {
        cancelToken: new axios.CancelToken(c => {
          this.cancels['getSamplesList'] = c
        })
      }
    )
  },

  // 路段报警分析表格数据获取
  getRoadAlarmListByConditions(params) {
    this.cancels['getRoadAlarmListByConditions']?.()
    return request.post(
      `/body/getHisEventByCondition`,
      params,
      {
        cancelToken: new axios.CancelToken(c => {
          this.cancels['getRoadAlarmListByConditions'] = c
        })
      }
    )
  },

  // 获取每月标定数据统计数据
  getCalibrateStatisticsByMonth(params) {
    this.cancels['getCalibrateStatisticsByMonth']?.()
    return request.post(
      `/open/queryDailySignInfo`,
      params,
      {
        cancelToken: new axios.CancelToken(c => {
          this.cancels['getCalibrateStatisticsByMonth'] = c
        })
      }
    )
  },

  // 根据日期查询标定数据
  getCalibrateBodiesByDate(params) {
    this.cancels['getCalibrateBodiesByDate']?.()
    return request.post(
      `/open/querySignInfoByDay`,
      params,
      {
        cancelToken: new axios.CancelToken(c => {
          this.cancels['getCalibrateBodiesByDate'] = c
        })
      }
    )
  },

  // 获取业务报警溯源
  getVocationalAlarmSource(params) {
    this.cancels['getVocationalAlarmSource']?.()
    return request.post(
      `/business/queryBusinessAlarms`,
      params,
      {
        cancelToken: new axios.CancelToken(c => {
          this.cancels['getVocationalAlarmSource'] = c
        })
      }
    )
  },
  // 查询统计表格数据记录
queryOwnerRecord(params) {
  this.cancels['queryOwnerRecord']?.()
  return request.post(
    `/statisticForOwner/queryStatisticsForOwnerRecord`,
    params,
    {
      cancelToken: new axios.CancelToken(c => {
        this.cancels['queryOwnerRecord'] = c
      })
    }
  )
 },

//  查询统计表格数据(内层弹窗数据)
queryForOwner(params) {
  this.cancels['queryForOwner']?.()
  return request.post(
    `/statisticForOwner/queryStatisticsForOwner`,
    params,
    {
      cancelToken: new axios.CancelToken(c => {
        this.cancels['queryForOwner'] = c
      })
    }
  )
}
}
