import request from '@/utils/request'
import qs from 'qs'

export default {
  // 获取 归属路线 数据
  getBelongingRoute: params =>
    request.post(
      'cameraManage/getRoadAttrList',
      params || { orgId: null }
    )
}
