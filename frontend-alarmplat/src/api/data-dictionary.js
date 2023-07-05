import axios from 'axios'
import request from '@/utils/request'
import qs from 'qs'

export default {
  // 保留请求取消
  cancels: {},

  // 获取数据字典外层列表数据
  getOutData(params) {
    this.cancels['getOutData']?.()

    return request.post(
      '/constant/queryConstantTypes',
      params,
      {
        cancelToken: new axios.CancelToken(c => {
          this.cancels['getOutData'] = c
        })
      }
    )
  },

  // 设置数据字典外层列表数据（type: String, typeDesc?: String）
  setOutData(params) {
    // this.cancels['setOutData']?.()

    return request.post(
      '/constant/saveConstantTypeByType',
      params,
      {
        cancelToken: new axios.CancelToken(c => {
          this.cancels['setOutData'] = c
        })
      }
    )
  },

  // 删除数据字典外层列表数据（type: String）
  delOutData(params) {
    // this.cancels['delOutData']?.()

    return request.post(
      '/constant/deleteConstantTypeByType',
      params,
      {
        cancelToken: new axios.CancelToken(c => {
          this.cancels['delOutData'] = c
        })
      }
    )
  },

  // 获取数据字典内层列表数据（type: String）
  getInnerData(params) {
    // this.cancels['getInnerData']?.()

    return request.get(
      `/constant/queryConstants?${qs.stringify(params)}`,
      {
        cancelToken: new axios.CancelToken(c => {
          this.cancels['getInnerData'] = c
        })
      }
    )
  },

  // 设置（或新增）数据字典内层列表数据（全部: String）
  setInnerData(params) {
    // this.cancels['setInnerData']?.()

    return request.post(
      '/constant/saveConstantById',
      params,
      {
        cancelToken: new axios.CancelToken(c => {
          this.cancels['setInnerData'] = c
        })
      }
    )
  },

  // 删除数据字典内层列表数据（id: String）
  delInnerData(params) {
    // this.cancels['delInnerData']?.()

    return request.post(
      '/constant/deleteConstantById',
      params,
      {
        cancelToken: new axios.CancelToken(c => {
          this.cancels['delInnerData'] = c
        })
      }
    )
  }
}
