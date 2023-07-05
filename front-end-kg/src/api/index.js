// 定义数据接口

import $http from '../filters/http'
//Vue.prototype.$http = AxiosFilter;
import QS from 'qs'
import Base64 from '../tools/base64'
//import store from '../store.js'
import axios from 'axios'
const requestingList = {}
//import vm from 'vue'

const urls = {
  refreshToken: '/auth/refreshToken',
  // 云录像
  cloudVideoPlay:
    'http://camera-record-tt.oss-cn-beijing.aliyuncs.com/file/1590393862900/7x0OUCNz.mp4?Expires=1590397483&OSSAccessKeyId=LTAI4GAbB12GYAgjLQxUaZe9&Signature=e2K0doUsuOjtlcW78%2BzLq2ElJc4%3D',
  uploadCloudVideo: '/v1/device/camera/record/auth-info', //获取oss上传配置参数
  addCloudVideoRecord: '/cloud/video/record/add/record', //新增云录像记录
  settleVideo: '/v1/device/camera/record/settle', //上传后回调
  getCloudVideoList: '/video/cloud/list', //获取摄像机记录查询
  getVideoDetail: '/video/cloud/get/', //获取录像地址
  // 地图打点经纬度转换
  getPositionLat: '/device/cameras/position2Map',
  getPositionLatNew: '/device/cameras/position2MapNew',
  getResetCameraPosition:
    '/device/cameras/resetCameraPosition', //摄像机点复位
  resetCameraPositionByRoadId:
    '/device/cameras/resetCameraPositionByRoadId', //根据道路ID复位全部摄像机点
  updateLonAndLat: '/device/cameras/updateLonAndLatById', //手动更新经纬度
  updateCamera: '/device/cameras/update-camera', //手动更新经纬度
  updateCameraMileage:
    '/device/cameras/updateCameraMileage', //摄像机修改桩号
  updateMapLevelStart:
    '/device/cameras/updateMapLevelStart', //摄像机修改图层

  //登陆页面
  requestLogin2: '/user/auth/login', //用户登录接口
  requestLogin: '/user/auth/sign', //用户登录接口
  captchaLogin: '/user/auth/captcha', //用户登录图片验证码
  // changePwd: "/user/modifyPassword", //修改密码
  changePwd: '/user/password', //修改密码
  changeModifyPwd: '/user/modify-others-password', //管理员修改密码

  getIdent: '/user/sms/sendSmsVerifyCode/', // 获取手机验证码

  phoneRequest: '/user/sms/smsLogin/', // 手机登录页面

  // 预案管理
  addPlan: '/device/plan/addPlan', //新增预案
  delPlan: '/device/plan/delPlan/', //删除预案
  delPlanCamera: '/device/plan/delPlanCamera', //删除预案中的摄像机
  modifyCameraOrder: '/device/plan/modifyCameraOrder', //调整预案中摄像机顺序
  modifyPlan: '/device/plan/modifyPlan', //修改预案
  getPlanList: '/device/plan/list', //查询预案
  queryCamerasByPlanId:
    '/device/plan/queryCamerasByPlanId/', //根据预案id查询摄像机
  queryGroupsByPlanId: '/device/plan/queryGroupsByPlanId/', //根据预案id查询分组
  querySelectedCamera: '/device/plan/selectedCamera', //关联的摄像机
  querySelectedAllCamera: '/device/plan/selectedAllCamera', //关联的摄像机

  getDashboardCountData: '/sta/acc/video',
  getDashboardAccessData: '/sta/acc/info',
  getCamerafresh: '/device/cameras/maplevel-fresh',
  getTranscodingList: '/device/transcodings/list', //获取视频上云网关查询列表
  getJournalLogList: '/device/transcodings/GWExternalLog', //获取视频上云网关对接日志
  getDownPlatformJournalList:
    '/data/opi-logs/down-platform', //获取视频下级平台对接日志
  getUpperPlatformJournalList:
    '/data/opi-logs/upper-platform', //获取视频上级平台对接日志
  getTranscodingCameraList:
    '/device/transcoding/camera/list/', //获取流媒体服务器下的摄像机列表
  exportTranscodingList: '/device/transcoding/export/', //视频上云网关列表导出
  addTranscoding: '/device/transcoding/add/', //新增视频上云网关
  editTranscoding: '/device/transcoding/edit/', //修改视频上云网关
  deleteTranscoding: '/device/transcoding/', //删除视频上云网关
  checkTranscoding: '/device/transcoding/check/', //设备编码查重接口
  getCameraRemainder:
    '/device/transcoding/cameraRemainder/', //视频上云网关剩余可挂载摄像机数量
  downTranscodingTemplate:
    '/device/transcoding/downTemplate', //视频上云网关批量导入模板获取接口
  uploadPublicKey: '/device/transcoding/uploadPublicKey/', //视频上云网关公钥文件上传
  uploadPrivateKey: '/device/transcoding/uploadPrivateKey/', //视频上云网关私钥文件上传
  updateOpenStatus: 'device/transcoding/updateOpenStatus/', //上云网关开放关闭
  updatePlayStatus: 'device/transcoding/updatePlayStatus/', //上云网关播放关闭
  // exportAccessorInfo: "device/transcoding/accessorInfo/export", //导出对接信息

  getCameraList: '/device/cameras/list', //摄像机查询接口
  exportCameraList: '/device/camera/export', //摄像机导出接口
  addCamera: '/device/camera/add/', //摄像机新增接口 单个

  importCamera: '/device/camera/import/', //摄像机新增接口 批量
  editCamera: '/device/camera/', //摄像机编辑接口
  checkCameraName: '/device/camera/nameCheck/', //摄像机名称查重
  deleteCamera: '/device/cameras/remove-status', //摄像机删除接口
  deleteBatchCamera: '/device/cameras/remove-status', //摄像机批量删除接口
  downCameraTemplate: '/device/camera/downTemplate', //摄像机批量新增模板获取接口
  batchUpdateDisplay: '/device/cameras/display-status', //批量更新摄像机的显示隐藏
  batchUpdateOpen: '/device/cameras/open-status', //批量更新摄像机的开放关闭
  updateOpStatus: '/device/camera/updateOpStatus', //更新摄像机状态
  updateStreamStatus: '/device/cameras/stream-status', //更新视频限制状态
  getBorrowTree: '/video/browse/region', // 获取摄像机树结构数据
  getCameraData: '/video/browse/camera', // 获取摄像机列表数据
  getGatewayInfo: '/device/transcodings/', // 获取上云网关详情
  getGatewayCameraList: '/device/cameras/list', // 获取上云网关下的摄像机列表
  getvideoStreamStatus: '/base/record/videoStream-status', // 视频流状态监测

  cameraYtControl: '/cameraOperate/video.PTZControl', // 云台控制
  authUpdateControl: '/device/cameras/control-status', //是否开放云台控制的权限

  getTemporaryCameraList: '/device/camera/temporaryList', //临时数据摄像机列表
  comfirmCamera: '/device/camera/confirm',

  getAllCameraAbnormalStatistics: '/sta/error/errorInfo', //获取摄像机故障统计信息
  getAllCameraRunStatistics: '/sta/online/runInfo', //获取摄像机运行统计信息
  getCountDaily: '/sta/playRecord/countDaily', //获取调取统计信息
  getRegionStatistics: '/sta/playRecord/regionStatistics', //获取调取统计信息
  getSourceStatistics: '/sta/playRecord/sourceStatistics', //获取调取统计数据来源信息
  getPlayRecordList: '/base/playRecord/list', //调取统计摄像机列表
  exportPlayRecord: '/base/playRecord/export', //导出调取统计列表

  getAllCameraAbnormalList: '/device/cameraState/errorList', //获取摄像机故障列表信息
  getCameraStatistics: '/device/platforms/home', //查询摄像机统计数据
  getCameraListForStatis:
    '/device/platforms/home/homepageList',
  getMileageList: '/base/mileage/list', //里程桩号
  postCameraListForPot: '/device/platforms/homepagePot', // 地图等级查找摄像机点位
  getCameraPlayUrl: '/device/cameras/playUrl', // 摄像机推流地址
  getCameraSnapShots: '/snapshot/list',
  maplevelInitialize: '/device/maplevel/initialize', // 路段图层初始化

  getCameraRunStatistic: '/runStatistic/cameraRun', //摄像机运行情况统计
  exportCameraRunStatistic: '/runStatistic/exportRunInfo', //摄像机运行情况统计导出
  getCameraFaultStatistic: '/runStatistic/cameraFault', //摄像机故障情况统计
  exportCameraFaultStatistic:
    '/runStatistic/exportFaultInfo', //摄像机故障情况统计导出
  getCameraVisitStatistic: '/visit/records/page',
  exportCameraVisitStatistic: '/visit/exportAccessInfo',
  /**
   * 摄像机组管理
   */

  // 摄像机组管理
  getDeviceGroupList: '/user/group/list', //摄像机组管理首页查询
  addDeviceList: '/user/group/groups', // 新增摄像机组
  updateDeviceList: '/user/group/group', //修改摄像机组
  getSelectdRole: '/user/group/selectedRole', //摄像机组已关联角色
  getSelectedUser: '/user/group/selectedUser', //摄像机组已关联的用户
  addDeviceGroup: '/device/group/add/', //新建/编辑摄像机组
  deleteDeviceGroup: '/user/group/batch', //删除摄像机组
  getDeviceCamera: '/user/group/selectedCamera', // 摄像机组关联的相机，回显
  addDev: '/user/group/cameras', //选择设备
  getDeviceDetailuser: '/user/group/allUser', //摄像机组详情所含用户
  checkDev: '/device/group/checkDev/', //查看设备
  checkUser: '/user/group/selectedRole', //获取已绑定的人员
  checkDeviceGroup: '/device/group/check/', //组名查重
  delGroupDev: '/device/group/delGDev/', //删除组设备
  delGroupUser: '/device/group/delGUsr', //删除组成员
  getGroupCameraList: '/device/camera/list/', //选择设备-摄像机查询接口（摄像机组管理）
  getGroupUserList: '/group/allUser', //选择设备-人员查询接口（摄像机组管理）
  getAllGroupList: '/user/list', //查看所有用户
  upDateRelationUser: '/user/group/batch', //批量修改摄像机组关联用户
  exportGroupList: '/device/group/exportInfo?', //导出列表

  selectedGroups: '/user/role/selectedGroups', //已选择的摄像机组
  deleteUnbindGroups: '/user/role/unbind-groups', //批量删除角色

  //角色列表
  userAddRole: '/user/adduser', // 新增用户接口
  editUserById: '/user/alter', //编辑用户接口
  userAccountCheck: '/user/check/', //{loginName}

  //权限管理
  getPowerList: '/user/function/tree/', //查询权限接口
  getRoleList: '/user/role/list', //查询角色接口
  addPower: '/user/function/functions', //新增权限接口
  editPower: '/user/function/function', //修改权限接口
  editPowerState: '/function/', //变更权限状态接口

  //角色管理
  editRoleStateMore: '/user/role/batch', //批量更新角色
  deleteRole: '/user/role/batch', //批量删除角色
  editRole: '/user/role/role', //编辑角色
  checkRoleName: '/user/role/roleName/', //校验角色名称
  addRole: '/user/role/roles', //新增角色
  getRoleUser: '/user/role/user/list', //查询角色下的用户
  getUserDetail: '/user/info', //获取用户详情

  //基础数据
  // getRegion: "/config/regions/list", //行政区划获取
  getRegion: '/base/regions/list', //行政区划获取
  getOrg: '/basic/org/all', //组织架构获取
  getOrgTop: '/basic/org/top', //组织架构顶层
  //getCodemaster: "/config/code-masters/list", //查询字典项接口 查询厂商
  getCodemaster: '/base/code-masters/list', //查询字典项接口 查询厂商

  getRoad: '/basic/road/all', //路名获取
  // getProvince: "/config/regions/list", //获取省份信息
  getProvince: '/base/regions/list', //获取省份信息
  // getRoadsByOrgId: "/config/roads/list", //路名获取
  getRoadsByOrgId: '/base/roads/list', //路名获取
  getCloudSecret: '/base/cloud-secret/list', //获取第三方云配置信息

  //路线管理
  // getRoadListOrInfo: "/config/roads/list", // 获取路线列表、单个路线信息
  // addRoadInfo: "/config/roads", // 添加路线信息
  // deleteRoadInfo: "/config/roads/", // 删除路线
  // editRoadInfo: "/config/roads/", // 修改路线
  getRoadListOrInfo: '/base/roads/list', // 获取路线列表、单个路线信息
  addRoadInfo: '/base/roads', // 添加路线信息
  deleteRoadInfo: '/base/roads/', // 删除路线
  editRoadInfo: '/base/roads/', // 修改路线

  findFuncByRole: '/user/function/roleFunction', //根据角色编码获取缓存中的权限列表
  // findFuncByRole: "/role/findFuncByRole?", //根据角色编码获取缓存中的权限列表
  getChoseListByAllRole: '/user/role/chooseFunc',
  /**
   * 省平台管理
   */
  //平台管理
  getDevicePlatformList: '/device/platforms/list', // 列表
  getDevicePlatformInfo: '/app', // 单个详情
  updateDevicePlatform: '/device/platforms/', // 更新
  addDevicePlatform: '/device/platforms', // 新增
  deleteDevicePlatform: '/device/platforms/', // 删除
  getPlatFormDetails: '/device/platforms/details/', //获取平台详情
  importPlatForm: '/device/platforms/import', //批量添加平台
  exportPlatFormModel: '/device/platforms/downloadTemplate', //导出平台上传模板
  // updateOpenPlatform:"/device/platforms/1/openStatus",//开放/关闭
  exportDevicePlatformKey: '/app/export/key', // 导出key
  exportDevicePlatformToken: '/app/export/token', // 导出token
  resetDevicePlatform: '/app/sign/reset', // 接入平台重新获取新的签名密钥接口
  checkDevicePlatformStatus: '/app/action',
  getaccInfo: '/app/accInfo',
  //更新平台私钥
  uploadPlatformPrivateKey: '/app/uploadPrivateKey/',

  getCameraBrowsePages: '/video/browse/pages', // 申请调阅查询
  getCameraApplyPages: '/video/apply/pages', // 审批代办
  postCameraBrowseApply: '/video/browse/apply', // 申请
  postCameraBrowseVerify: '/video/browse/verify', // 调阅审批

  getStreamMediaList: '/device/streamMedias/list', //获取流媒体列表GET
  getStreamMediaInfo: '/device/streamMedias/', //获取流媒体详情
  getStreamMediaTranscodingList: '/sm/transcoding/list', // 查询已绑定的视频上云网关和未绑定的视频上云网关
  addStreamMedia: '/device/streamMedias', // 新增流媒体
  updateStreamMedia: '/device/streamMedias/', // 更新流媒体PUT
  deleteStreamMedia: '/device/streamMedias/', // 删除流媒体

  bindStreamMedia: '/device/streamMedias/', // 绑定视频上云网关

  getMessagePages: '/message/pages', // {currPage}/{pageSize}  消息中心分页查询
  getReportDailyInfo: '/report/daily', // {date}
  putMessageStatus: '/message/checkStatus/update', // {messageId}  批量更新消息查看状态

  //statisCamera              :"/statis/camera/",                                 // 全国摄像头按维度状态统计
  // 开放管理
  // getCallManagement: "/api/list", // 获取开放api接口
  // addCallManagement: "/api/add", // 新增开放api接口
  // editCallManagement: "/api/update", // 修改开放api接口
  // authorizationCallManagement: "/app", // 查询授权
  // authorizationCall: "/app/grant", // 添加授权
  // relieveCall: "/app/ungrant", // 解除授权
  // deleteCallManage: "/delete", // 删除开放api接口
  // enableApi: "/api/open", // 接口启用接口
  // prohibitApi: "/api/block", // 接口禁用接口
  // getOpenList: "/open/app/list", //获取开放平台列表
  // getCameraBindList: "/open/app/camera/list", //获取所有
  // updateAppTitle: "/open/app/update/", //修改头部
  // deleteApp: "/open/app/modifyStatus/", //删除平台应用
  // getKeyList: "/open/appKey/list", //获取keylist
  // addNewKey: "/open/appKey/add", //   新增key
  // updateKeys: "/open/appKey/update/", //更新keyID
  // updateKeyStatus: "/open/appKey/modifyStatus/", //更新keyStatus
  // getKeyReset: "/open/appKey/resetSecret/", //重置key
  // cameraList: "/open/appKey/resourceList", //相机列表

  // 开放管理
  createApp: '/user/applications', //创建一个应用
  getOpenList: '/user/applications/list', //获取应用列表
  updateAppTitle: '/user/applications/', //更新应用名称和状态
  // CameraBind: "/user/applications/{id}/bind-camera", //绑定摄像机
  // getCameraBindList: "/user/applications/", //获取绑定的摄像机/user/applications/{id}/cameras
  addNewKey: '/user/application/keys', //创建一个key
  getKeyList: '/user/application/keys/list', //key列表
  getKeyReset: '/user/application/keys/secret/', //重置secret
  updateKeys: '/user/application/keys/', //更新key消息
  authorizationCall:
    '/user/application/keys/{id}/bind-purview', //绑定资源权限
  // :'GET /application/keys/{keyId}/purview',//获取key绑定的资源权限
  cameraList: '/user/resources/list', //获取资源列表

  // 日志管理
  getAccesslogByApp: '/statis/apiAccess/byAppCode',
  getAccesslogByUrl: '/statis/apiAccess/byUri',
  exportAccesslogByUrl: '/statis/apiAccess/exportCsv',

  getBorrowing: '/video/browse/pages', // 获取已申请摄像机列表
  applyBrowse: '/video/browse/apply', // 申请调阅

  seeCameraMsg: '/video/browse/camera/detail', // 查询调阅的摄像机信息

  approvalVerify: '/video/browse/verify', // 审批调阅

  getTranscoding: '/device/transcoding/list', // 获取视频上云网关表格数据
  // getVideoCameraData: "/transConfig/pageConfigCams", // 获取视频上云网关摄像机表格数据

  // getSelectData: "/transConfig/getCodeNames", // 获取新增中下拉框选项内容
  // getRoadCompany: "/transConfig/getRoadCompany", // 根据管辖单位id获取路段单位
  // getCities: "/transConfig/getCities", // 获取新增中城市下拉框选项内容

  // addConfigCam: "/transConfig/addConfigCam", // 新增摄像机
  // findById: "/transConfig/findById", // 编辑时查询下拉框数据的code
  // delCamerta: "/transConfig/delete", // 删除摄像机数据

  // batchDownload: "/transConfig/download", // 批量下载

  // uploadFile: "/transConfig/upload", // 批量上传

  // getTimeAdjustInfo: "/transfer/gateway.TimeAdjustInfo", //获取校时服务器信息
  // editTimeAdjustInfo: "/transfer/gateway.TimeChange", //校时服务器信息更改接口
  // getNetInfo: "/transfer/gateway.NetInfo", //获取上云网关服务的网络设置信息
  // editNetInfo: "/transfer/gateway.NetSetting", //上云网关网络设置
  // getRoutingInfo: "/transfer/gateway.RoutingInfo", //静态路由设置信息获取
  // addRoutingInfo: "/transfer/gateway.RoutingAdd", //静态路由设置新增接口
  // delRoutingInfo: "/transfer/gateway.RoutingDel", //静态路由设置删除接口
  // sysRestart: "/transfer/gateway.SysRestart", //系统重启
  // addVideoSendOut: "/transfer/gateway.VideoSendOut", //摄像机配置下发接口
  // delVideoSend: "/transfer/gateway.VideoInfoDel", //摄像机配置删除接口
  // getTokenInfo: "/transfer/video.TokenInfo", //TAuth获取的接口
  updateAuthToken:
    '/device/transcoding/updateAuthTokenByTranscode', //TAuth获取的接口
  getTemporaryList: '/device/camera/waitGwConfirmList', //获取需要审核的转码服务器列表
  getConfirm: '/device/camera/confirm', //摄像机审核通过接口
  // getTemporaryConfirm: "/device/cameras/wait-confirm/carema/list", // 获取待审核的摄像机列表
  getTemporaryConfirm: '/device/camera/waitCameraList', // 获取待审核的摄像机列表
  getTemporaryPass: '/device/reject/cameras/list', //获取未通过的摄像机列表
  getTemporaryPassCount: '/device/reject/cameras/count',
  // getCameraStatus: "/device/cameras/wait-confirm/carema/verifyresult", //根据转码审核摄像机
  getCameraStatus: '/device/camera/confirm', //根据转码审核摄像机

  // getExportTemporary: "/device/cameras/download/wait-confirm/excel-detail", //根据转码导出待审核摄像机
  getExportTemporary: '/device/camera/exportWaitCameraList', //根据转码导出待审核摄像机
  getExportTemporaryPass: '/device/reject/cameras/export',
  AddOrganizationList: '/user/organization', //新增组织
  delUserOrganization: '/user/organization/', //删除组织
  updateUserOrganization: '/user/organization/', //更新组织
  // 组织与用户
  // getUsersByOrg: "/org/orgUsers", //查询组织人员
  getOrgTree: '/org/orgTree', //组织树
  getUserRolesByUserId: '/org/userRoles/',
  editUserRole: '/org/editUserRole/',
  queryUserCamera: '/user/bind-camera-list',
  chooseCameraIds: '/user/bind-cameras-choose',
  cancelChooseCameraIds: '/user/bind-cameras-cancel-choose',
  //组织架构
  addOrganization: '/basic/org/add',
  getBindRoadsByOrganization: '/basic/bind/roads',
  delOrganization: '/basic/org/del',
  updateOrganization: '/basic/org/update',

  bindRoadToOrganization: '/basic/org/road/add',
  deleteRoadFromOrganization:
    '/basic/org/roa/user/logod/delete',
  // 组织用户相关
  addOrgUser: '/user/users', //新增用户
  getUsersByOrg: '/user/list', //用户列表
  delMoreUser: '/user/batch', //批量删除
  updateMoreModifyStatus: '/user/batch', //批量修改状态
  updateUserInfo: '/user/user', //修改用户
  // GET /org/exportUser
  exportOrgUser: '/user/download', //用户导出接口

  // 组织与用户
  getUsersByOrg: '/user/list', //查询组织用户列表
  addOrgUser: '/user/users', //新增组织用户
  updateUserInfo: '/user/user', //修改组织用户
  updateMoreModifyStatus: '/user/batch', //批量修改用户状态
  delMoreUser: '/user/batch', //批量删除
  getUserOrganization: '/user/organization/tree', //组织tree
  // getCountUserOrganization: "/user/organization/count/tree", //带统计的组织tree
  getCountUserOrganization:
    '/user/organization/cameraCountTree', //带统计的组织tree

  getCameraCount: '/user/organization/cameraCount/tree', //截图组织tree
  AddOrganizationList: '/user/organization', //新增组织
  updateUserOrganization: '/user/organization/', //更新组织
  delUserOrganization: '/user/organization/', //删除组织
  getOrgUserInfo: '/user/details', //获取用户详情
  // getOrgCompany: "/user/organization/company", //获取用户详情
  getOrgCompany: '/user/organization/roadCompany', //获取用户详情
  updateOrganizations:
    '/user/organization/update-organizations', //批量更新组织信息

  // 日志管理
  getInterfaceLogList: '/data/opi-logs/list?', //接口日志获取数据
  getOperationLogList: '/data/opt-log/list', //操作日志获取数据
  exportOperateLog: '/data/opt-log/export', //导出操作日志
  getActionLog: '/data/action-log/list', //获取行为审计列表
  getStreamLog: '/base/record/videoStream-list', //获取视频流状态日志
  exportActionLog: '/data/action-log/export', //获取行为审计列表

  //外部机构管理
  addExternaOrganization: '/external/organization', //新增机构
  deleteExternaOrganization:
    '/external/organization/delete', //根据id删除
  getExternalOrganizationList:
    '/external/organization/list', //获取组织机构列表
  updateExternalOrganization:
    '/external/organization/update/', //修改外部机构

  //外部用户管理
  createExternalUser: '/external/user/create', //创建外部用户
  deleteExternalUser: '/external/user/delete', //删除外部用户
  getExternalUserList: '/external/user/list', //获取外部用户列表
  updateExternalUser: '/external/user/update/', //更新外部用户

  // 运维报告
  queryCameraReportGroupDetail: '/sta/report/', //获取运维报告详情
  queryCameraReportList: '/sta/report/', //获取运维报告列表
  queryCameraAccessList: '/sta/report/', //摄像机接入列表
  exportCameraReportList: '/sta/report/', //导出运维报告
  queryCqCameraAccessList: '/sta/report/', //摄像机接入列表
  exportCqCameraReportList: '/sta/report/', //导出运维报告

  // 系统管理
  // getOperationList: "/sta/report/{reportType}?currPage={currPage}&pageSize={pageSize}&startDate={startDate}&endDate={endDate}&organizationType={organizationType}&regionCode={regionCode}",
  getReportList: '/sta/report', //运维报告列表
  getOperationInfo: '/sta/report',
  getSelectWeekList: '/sta/report/selectWeekList', //获取周列表

  // 运维报告
  getListDayReport: '/sta/report/listDayReport', //运维报告日报列表
  getDayDepartment: '/sta/report/listDayDepartment', //查询日报各路公司信息增预案
  getDayDepartmentRate: '/sta/report/listDayDepartmentRate', //查询日报所涉及路公司在线率排名信息
  getDayExtReport: '/sta/report/listDayExtReport', //查询日报扩展信息
  getDayExtRoadReport: '/sta/report/listDayExtRoadReport', //查询日报各路公司信息
  getMonthCurrentStat: '/sta/report/listMonthCurrentStat', //查询月报当前接入统计
  getMonthDepartment: '/sta/report/listMonthDepartment', //查询月报所涉及各路公司信息
  getMonthDepartmentRate:
    '/sta/report/listMonthDepartmentRate', //查询月报所涉及到路公司在线排名信息
  getMonthExtReport: '/sta/report/listMonthExtReport', //查询月报扩展信息
  getMonthExtRoadReport:
    '/sta/report/listMonthExtRoadReport', //查询月报所涉及到路线信息
  getMonthLine: '/sta/report/listMonthLine', //查询月报平均在线率、离线率、异常率
  getMonthReport: '/sta/report/listMonthReport', //查询月报信息
  getWeekCurrentStat: '/sta/report/listWeekCurrentStat', //查询周报当前接入统计
  getWeekDepartment: '/sta/report/listWeekDepartment', //查询周报所涉及各路公司信息
  getWeekDepartmentRate:
    '/sta/report/listWeekDepartmentRate', //查询周报所涉及路公司在线排名信息
  getWeekExtReport: '/sta/report/listWeekExtReport', //查询周报扩展信息
  getWeekExtRoadReport: '/sta/report/listWeekExtRoadReport', //查询周报所涉及到路线信息
  getWeekLine: '/sta/report/listWeekLine', //查询本周平均在线率、离线率、异常率
  getWeekReport: '/sta/report/listWeekReport', //查询周报信息
  exportDayDetail: '/sta/report/exportDayDetail', //导出日报信息
  exportWeekDetail: '/sta/report/exportWeekDetail', //导出周报信息
  exportMonthDetail: '/sta/report/exportMonthDetail', //导出月报信息

  /**
   * 开放统计
   */

  playCount: '/sta/acc/playCount', //国庆节统计
  findCameraAndPlayRecord:
    '/sta/oc/findCameraAndPlayRecord', //查询每个摄像机播放记录
  appWeekVideoPlayRecordCount:
    '/sta/oc/appWeekVideoPlayRecordCount', //周播放统计
  videoPlayRecordCount: '/sta/oc/videoPlayRecordCount', //视频播放记录数
  videoPlayRecord: '/device/camera/record/', //获取视频
  getOrgTree: '/user/organization/tree',

  // 图像管理

  getCameraVideo: '/cloud/video/record/list', //查询摄像机录像列表
  // getImgList: "/device/camera/image-list",   //查询截图列表
  getImgList: '/snapshot/queryScreenshotByCondition', //查询截图列表
  getImgStatistics: '/snapshot/querySnapshotStatistics', //获取截图统计数据
  getImgStatisticsClassify:
    '/snapshot/querySnapshotStatisticsByClassify', //按照摄像机位置分类统计摄像机截图数据

  getMessageList: '/base/message/list', //查询截图列表
  uploadImgs: '/snapshot/upload', //自动上传截图
  delCamera: '/device/camera/record', //删除、批量删除摄像机录像
  exportVideo: '/device/camera/record/', //用户导出视频
  delImg: '/snapshot/remove', //删除、批量删除截图
  batchDownloadImages: '/device/camera/batchDownloadImages', //批量下载
  // getRecentDaysList: "/device/camera/recent-days-list/", //快照天数列表
  submitReject: '/device/camera-borrow/audit-reject/', //审核驳回

  eventList: '/base/event-cq/list', //事件分析
  eventType: '/base/event-cq/info/type-names', //事件类型
  eventDownload: '/base/event-cq/download', //事件导出

  //借阅申请
  getBorrowList: '/device/camera-borrow/audit-list', //借阅审核列表
  getBorrowApplyList: '/device/camera-borrow/apply-list', //借阅申请列表
  getBorrowCamerasList:
    '/device/camera-borrow/audited-cameras', //借阅审核通过摄像机列表
  getMalfunctionReportList:
    '/device/malfunction-report/list', //摄像机故障列表
  getMalfunctionReportAdd: '/device/malfunction-report/add', //摄像机故障上
  CamerasForAudit:
    '/device/camera-borrow/cameras-for-audit', //获取借阅审核所需要的摄像机列表
  getGuZhangShenBao: '/v1/device/malfunction-report/add',
  getGuZhangShenBao:
    '/v1/device/camera-borrow/audit-reject',
  camerasChoose: '/device/camera-borrow/cameras-choose', //审核时选择摄像机
  delCamerasChoose:
    '/device/camera-borrow/cameras-cancel-choose', //审核时选择摄像机
  auditAgree: '/device/camera-borrow/audit-agree', //审核同意
  revokeBorrow: '/device/camera-borrow/cancel', //撤销申请
  getOssAuthInfo:
    '/device/camera-borrow/oss-upload-auth-info',
  downLoadOssAuthInfo:
    '/device/camera-borrow/oss-download-auth-info',
  addBorrowApply: '/device/camera-borrow',
  repeatBorrowApply: '/device/camera-borrow/reSubmit/',
  reUploadBorrowFile: '/device/camera-borrow/reUpload',
  downOssFile:
    '/device/camera-borrow/oss-download-auth-info',

  provinceTree: '/user/organization/province/tree', //省账号组织树

  querySuppPlatform: '/device/platforms/upper',
  saveSuppPlatform: '/device/platforms/upper',
  reportBatchCamera: '/report/cameraInfo', //摄像机上报
  cancelReportBatchCamera: '/report/deleteCameraInfo', //摄像机信息删除

  //省账号相关接口
  queryReginHomeCamera: '/base/cameras/regionHome/cameras', //首页获取摄像机
  queryHomeList: '/sta/acc/homeLeft', //左侧树的
  queryHomePieData: '/sta/acc/homeRightOnlineRate',
  queryHomeRightCompany: '/sta/acc/homeRightCompany',
  queryHomeRightRoad: '/sta/acc/homeRightRoad',
  //图像质量管理
  queryQualityCount:
    '/device/cameraState/quality-status-count', //异常统计
  exportErrorList: '/device/cameraState/errorList/download', //异常统计导出
  createReporting: '/errorReporting/create', //创建故障填报
  submitReporting: '/errorReporting/report', //故障上报

  queryQualityList:
    '/device/cameraState/quality-status-list',
  // exportQuality: "/device/cameraState/quality-status-list-export",
  exportQuality:
    '/device/cameraState/quality-status-export',
  exportCameraListInfo:
    '/device/cameras/download/camera-info',

  exportCameraListAll:
    '/device/cameras/download/excel-detail/all',
  getConfigContent: '/base/cloud-secret/secret-content', //获取云配置信息
  exportSnapshotList: '/snapshot/exportSnapshotList', //导出截图列表的摄像机数据

}
//异常统计
let getConfigContent = function(secret_id) {
  return $http
    .get(urls.getConfigContent + '/' + secret_id)
    .then(({ data }) => {
      return data
    })
}
let queryQualityCount = function(params) {
  return $http
    .get(
      urls.queryQualityCount + '?' + QS.stringify(params)
    )
    .then(({ data }) => {
      return data
    })
}
// 异常统计导出
let exportErrorList = function(data) {
  return $http
    .get(urls.exportErrorList + '?' + QS.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'blob' //二进制流,
    })
    .then(({ data }) => {
      return data
    })
}
//创建上报
let createReporting = function(params) {
  return $http
    .post(urls.createReporting, params)
    .then(({ data }) => {
      return data
    })
}
//上报故障
let submitReporting = function(params) {
  return $http
    .post(urls.submitReporting + '?' + QS.stringify(params))
    .then(({ data }) => {
      return data
    })
}

let queryQualityList = function(params) {
  return $http
    .get(urls.queryQualityList + '?' + QS.stringify(params))
    .then(({ data }) => {
      return data
    })
}

let exportQuality = function(params) {
  return $http
    .get(urls.exportQuality + '?' + QS.stringify(params), {
      responseType: 'blob'
    })
    .then(({ data }) => {
      return data
    })
}
/**
 * token失效，获取新的token
 */
let getCameraVideo = function(data) {
  return $http
    .post(
      `${urls.getCameraVideo}?currPage=${data.currPage}&pageSize=${data.pageSize}&timeStart=${data.saveTime}&timeEnd=${data.confirmTime}&cameraNum=${data.cameraNum}`
    )
    .then(({ data }) => {
      return data
    })
}
let captchaLogin = function(params) {
  return $http
    .get(urls.captchaLogin + '?' + QS.stringify(params))
    .then(({ data }) => {
      return data
    })
}
//首页截图列表
let getImgList = function(params) {
  cancelGetImgList()
  return $http
    .get(urls.getImgList + '?' + QS.stringify(params), {
      cancelToken: new axios.CancelToken(c => {
        requestingList['getImgList'] = c
      })
    })
    .then(({ data }) => {
      return data
    })
}
const cancelGetImgList = () => {
  requestingList['getImgList']?.()
  delete requestingList['getImgList']
}

//截图数据统计
let getImgStatistics = function(params) {
  return $http
    .get(urls.getImgStatistics + '?' + QS.stringify(params))
    .then(({ data }) => {
      return data
    })
}
//截图类别数据统计
let getImgStatisticsClassify = function(params) {
  return $http
    .get(
      urls.getImgStatisticsClassify +
        '?' +
        QS.stringify(params)
    )
    .then(({ data }) => {
      return data
    })
}

//事件分析
let eventList = function(params) {
  return $http
    .get(urls.eventList + '?' + QS.stringify(params))
    .then(({ data }) => {
      return data
    })
}
//事件类型
let eventType = function(params) {
  return $http
    .get(urls.eventType + '?' + QS.stringify(params))
    .then(({ data }) => {
      return data
    })
}
// 事件导出
let eventDownload = function(data) {
  return $http
    .get(urls.eventDownload + '?' + QS.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'blob' //二进制流,
    })
    .then(({ data }) => {
      return data
    })
}
//获取消息列表
let getMessageList = function(params) {
  return $http
    .get(urls.getMessageList + '?' + QS.stringify(params))
    .then(({ data }) => {
      return data
    })
}

//摄像机管理 借阅审核
let getBorrowList = function(params) {
  return $http
    .get(urls.getBorrowList + '?' + QS.stringify(params))
    .then(({ data }) => {
      return data
    })
}
//借阅申请
let getBorrowApplyList = function(params) {
  return $http
    .get(
      urls.getBorrowApplyList + '?' + QS.stringify(params)
    )
    .then(({ data }) => {
      return data
    })
}

let getNewToken = function(token) {
  return $http
    .get(urls.refreshToken + '?' + QS.stringify(token))
    .then(({ data }) => {
      return data
    })
}

/**
 * 摄像机组管理
 */
// 查询摄像机组列表
let getDeviceList = function(params) {
  return $http
    .get(urls.getDeviceList + '?' + QS.stringify(params))
    .then(({ data }) => {
      return data
    })
}
// 获取摄像机组所含用户
let getAllUser = function(params) {
  return $http
    .get(urls.getAllUser + '?' + QS.stringify(params))
    .then(({ data }) => {
      return data
    })
}
// 获取摄像机组已关联的角色
let getSelectedRole = function(params) {
  return $http
    .get(urls.getSelectedRole + '?' + QS.stringify(params))
    .then(({ data }) => {
      return data
    })
}

/**
 * 用户登录接口
 * url  /user/login/{loginName}/{passwd}
 */
let requestLogin = function(params) {
  return $http
    .post(urls.requestLogin, params)
    .then(({ data }) => {
      return data
    })
}
let requestLogin2 = function(params) {
  return $http
    .post(urls.requestLogin2, params)
    .then(({ data }) => {
      return data
    })
}
/***
 *获取验证码
 *
 */
let getIdent = function(data) {
  return $http
    .get(urls.getIdent + data)
    .then(({ statusText, data }) => {
      console.log(data)
      // if (statusText != "OK") {
      //     return Promise.reject();
      // }
      return data
    })
}
/**
 * 手机验证码登录
 * @param {*} data
 */
let phoneRequest = function(data) {
  return $http
    .get(urls.phoneRequest + data)
    .then(({ statusText, data }) => {
      console.log(data)
      // if (statusText != "OK") {
      //     return Promise.reject();
      // }
      return data
    })
}

/**
 * 修改密码
 */
let changePwd = function(data) {
  return $http
    .put(urls.changePwd, data)
    .then(({ data }) => {
      return data
    })
}
//管理员修改密码
let changeModifyPwd = function(data) {
  return $http
    .put(urls.changeModifyPwd, data)
    .then(({ data }) => {
      return data
    })
}

let getOrgTree = function(params) {
  return $http
    .get(urls.getOrgTree, { params: params })
    .then(({ data }) => {
      return data
    })
}

let addOrganization = function(params) {
  return $http
    .post(urls.addOrganization, params)
    .then(({ data }) => {
      return data
    })
}

let getBindRoadsByOrganization = function(params) {
  return $http
    .get(urls.getBindRoadsByOrganization, { data: params })
    .then(({ data }) => {
      return data
    })
}

let delOrganization = function(params) {
  return $http
    .delete(
      urls.delOrganization + '?' + QS.stringify(params)
    )
    .then(({ data }) => {
      return data
    })
}

let updateOrganization = function(data) {
  return $http
    .post(urls.updateOrganization, data)
    .then(({ data }) => {
      return data
    })
}

let bindRoadToOrganization = function(data) {
  return $http
    .post(urls.bindRoadToOrganization, data)
    .then(({ data }) => {
      return data
    })
}

// 预案管理
/**
 * 新增预案
 */
let addPlan = function(params) {
  return $http
    .post(urls.addPlan, params)
    .then(({ data }) => {
      return data
    })
}

/**
 * 删除预案
 */
let delPlan = function(params) {
  return $http
    .post(urls.delPlan + params.planId, params.params)
    .then(({ data }) => {
      return data
    })
}

/**
 * 删除预案中的摄像机
 */
let delPlanCamera = function(params) {
  return $http
    .post(urls.delPlanCamera + '?' + QS.stringify(params))
    .then(({ data }) => {
      return data
    })
}

/**
 * 调整预案中摄像机顺序
 */
let modifyCameraOrder = function(params) {
  return $http
    .post(
      urls.modifyCameraOrder + '?' + QS.stringify(params)
    )
    .then(({ data }) => {
      return data
    })
}

/**
 * 修改预案
 */
let modifyPlan = function(params) {
  return $http
    .post(
      urls.modifyPlan + '?' + QS.stringify(params.data),
      params.params
    )
    .then(({ data }) => {
      return data
    })
}

// 查询预案
let getPlanList = function(params) {
  return $http
    .get(urls.getPlanList + '?' + QS.stringify(params))
    .then(({ data }) => {
      return data
    })
}

// 根据预案id查询摄像机
let queryCamerasByPlanId = function(params) {
  return $http
    .get(
      urls.queryCamerasByPlanId +
        params.planId +
        '?' +
        QS.stringify(params.params)
    )
    .then(({ data }) => {
      return data
    })
}

// 根据预案id查询分组
let queryGroupsByPlanId = function(params) {
  return $http
    .get(
      urls.queryGroupsByPlanId +
        params.planId +
        '?' +
        QS.stringify(params.params)
    )
    .then(({ data }) => {
      return data
    })
}

// 选择的摄像机
let querySelectedCamera = function(params) {
  return $http
    .get(
      urls.querySelectedCamera + '?' + QS.stringify(params)
    )
    .then(({ data }) => {
      return data
    })
}

// 关联的摄像机
let querySelectedAllCamera = function(params) {
  return $http
    .get(
      urls.querySelectedAllCamera +
        '?' +
        QS.stringify(params)
    )
    .then(({ data }) => {
      return data
    })
}

// 获取组织用户列表
let getSysUserByOrg = function(params) {
  return $http
    .get(urls.getUsersByOrg + '?' + QS.stringify(params))
    .then(({ data }) => {
      return data
    })
}

let queryUserCamera = function(params) {
  return $http
    .post(
      urls.queryUserCamera +
        '/' +
        params.mustOrganizationId,
      params
    )
    .then(({ data }) => {
      return data
    })
}
let CamerasForAudit = function(params) {
  return $http
    .post(urls.CamerasForAudit + '/' + params.borrowId, {
      ...params
    })
    .then(({ data }) => {
      return data
    })
}
let camerasChoose = function(params) {
  return $http
    .post(urls.camerasChoose + '/' + params.borrowId, {
      ...params.userBindCameraReq
    })
    .then(({ data }) => {
      return data
    })
}

let chooseCameraIds = function(params) {
  return $http
    .post(urls.chooseCameraIds + '/' + params.userId, {
      ...params.userBindCameraReq
    })
    .then(({ data }) => {
      return data
    })
}

let delCamerasChoose = function(params) {
  return $http
    .delete(urls.delCamerasChoose + '/' + params.borrowId, {
      data: {
        ...params.userBindCameraReq
      }
    })
    .then(({ data }) => {
      return data
    })
}
let cancelChooseCameraIds = function(params) {
  return $http
    .delete(
      urls.cancelChooseCameraIds + '/' + params.userId,
      {
        data: {
          ...params.userBindCameraReq
        }
      }
    )
    .then(({ data }) => {
      return data
    })
}

let getUserRolesByUserId = function(params) {
  return $http
    .get(
      urls.getUserRolesByUserId + '?' + QS.stringify(params)
    )
    .then(({ data }) => {
      return data
    })
}

let editUserRole = function(data) {
  return $http
    .post(urls.editUserRole, data)
    .then(({ data }) => {
      return data
    })
}
/**
 * 摄像机刷新图层
 * @param {*} data
 */

let getCamerafresh = function(data) {
  return $http
    .get(urls.getCamerafresh + '?' + QS.stringify(data))
    .then(({ data }) => {
      return data
    })
}
/**
 *
 * 获取视频上云网关列表
 * 必填  currPage 当前页   pageSize 显示多少条
 * 非必填  provinceCode 省份编码    department 管养单位    road 路线编码    transCodingName 转码名称    userCode  用户编码     organizationCode  组织编码
 */
let getTranscodingList = function(data) {
  return $http
    .get(urls.getTranscodingList + '?' + QS.stringify(data))
    .then(({ data }) => {
      return data
    })
}

/**
 * 获取流媒体服务器下的摄像机列表
 * 必填  deviceCode 设备编码    currPage 当前页   pageSize 显示多少条
 * 非必填
 */
let getTranscodingCameraList = function(data) {
  return $http
    .get(urls.getTranscodingCameraList + data)
    .then(({ data }) => {
      return data
    })
}

/**
 *
 * 获取视频上云网关对接日志
 */
let getJournalLogList = function(data) {
  return $http
    .get(urls.getJournalLogList + '?' + QS.stringify(data))
    .then(({ data }) => {
      return data
    })
}

/**
 *
 * 获取视频下级平台对接日志
 */
let getDownPlatformJournalList = function(data) {
  return $http
    .get(
      urls.getDownPlatformJournalList +
        '?' +
        QS.stringify(data)
    )
    .then(({ data }) => {
      return data
    })
}

/**
 *
 * 获取视频上级平台对接日志
 */
let getUpperPlatformJournalList = function(data) {
  return $http
    .get(
      urls.getUpperPlatformJournalList +
        '?' +
        QS.stringify(data)
    )
    .then(({ data }) => {
      return data
    })
}

/**
 * 视频上云网关导出
 * 必填
 * 非必填 provinceCode  省份编码     road  路线   transCodingName  转码名称   userCode  用户code    organizationCode  组织code
 */
let exportTranscodingList = function(data) {
  return $http
    .post(urls.exportTranscodingList, data, {
      responseType: 'arraybuffer'
    })
    .then(({ data }) => {
      return data
    })
}

/**
 * 增加流媒体服务器
 * 必填
 * 非必填 transcodingName 转码名称  provinceCode省份编码   orangizionId  组织id    roadId  线路id   port 端口  ipAddress  IP地址   transcodingCode 转码code  cameraNum 摄像机数量  channelNum  最大路数限制
 */
let addTranscoding = function(data) {
  return $http
    .post(urls.addTranscoding, data)
    .then(({ data }) => {
      return data
    })
}

/**
 * 修改流媒体服务器
 * 必填
 * 非必填 transcodingName 转码名称  provinceCode省份编码   orangizionId  组织id    roadId  线路id   port 端口  ipAddress IP地址   transcodingCode 转码code  cameraNum 摄像机数量  channelNum  最大路数限制
 */
let editTranscoding = function(data) {
  return $http
    .post(
      urls.editTranscoding + `${data.transcodingId}`,
      data
    )
    .then(({ data }) => {
      return data
    })
}

/**
 * 删除流媒体服务器
 * 必填   transcodingId  转码设备id
 */
let deleteTranscoding = function(data) {
  return $http
    .delete(urls.deleteTranscoding + data.transcodingId, {
      data: data
    })
    .then(({ data }) => {
      return data
    })
}

/**
 * 设备编码查重接口
 * 必填   transcodingCode  转码设备code
 * 2000-视频上云网关已挂满    2001-视频上云网关未挂满   2002-视频上云网关不存在
 */
let checkTranscoding = function(data) {
  return $http
    .get(urls.checkTranscoding + data)
    .then(({ data }) => {
      return data
    })
}

/**
 * 视频上云网关剩余可挂载摄像机数量
 * url   /device/transcoding/cameraRemainder/{transcodingId}
 */
let getCameraRemainder = function(data) {
  return $http
    .get(urls.getCameraRemainder + data)
    .then(({ data }) => {
      return data
    })
}

/**
 * 视频上云网关批量导入模板获取接口
 */
let downTranscodingTemplate = function() {
  return $http
    .get(urls.downTranscodingTemplate, {
      responseType: 'arraybuffer'
    })
    .then(({ data }) => {
      return data
    })
}

/**
 * 视频上云网关公钥文件上传
 */
let uploadPublicKey = function(data) {
  return $http
    .post(urls.uploadPublicKey + +data.id, data.info, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    .then(({ data }) => {
      return data
    })
}

/**
 * 视频上云网关私钥文件上传
 */
let uploadPrivateKey = function(data) {
  return $http
    .post(urls.uploadPrivateKey + data.id, data.info, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    .then(({ data }) => {
      return data
    })
}
//上云网关开放关闭
let updateOpenStatus = function(data) {
  return $http
    .post(
      urls.updateOpenStatus +
        data.transcodingId +
        '?' +
        QS.stringify(data.openStatus)
    )
    .then(({ data }) => {
      return data
    })
}
//上云网关播放关闭
let updatePlayStatus = function(data) {
  return $http
    .post(
      urls.updatePlayStatus +
        data.transcodingId +
        '?' +
        QS.stringify(data.playStatus)
    )
    .then(({ data }) => {
      return data
    })
}
// 导出对接信息
let exportAccessorInfo = function(params) {
  return $http
    .get(
      `/device/transcodings/download/${params.transCodingId}/accessorInfo`,
      {
        responseType: 'blob'
      }
    )
    .then(({ data }) => {
      return data
    })
}
// 导出对接信息(下级)
let exportPlatAccessorInfo = function(params) {
  return $http
    .get(
      `/device/platforms/download/${params.transCodingId}/accessorInfo`,
      {
        responseType: 'blob'
      }
    )
    .then(({ data }) => {
      return data
    })
}

let exportCameraListInfo = function(params) {
  return $http
    .get(
      urls.exportCameraListInfo +
        '?' +
        QS.stringify(params),
      {
        responseType: 'blob'
      }
    )
    .then(({ data }) => {
      return data
    })
}
let exportSnapshotList = function(params) {
  return $http
    .get(
      urls.exportSnapshotList +
        '?' +
        QS.stringify(params),
      {
        responseType: 'blob'
      }
    )
    .then(({ data }) => {
      return data
    })
}
let exportCameraListAll = function(params) {
  return $http
    .get(
      urls.exportCameraListAll + '?' + QS.stringify(params),
      {
        responseType: 'blob'
      }
    )
    .then(({ data }) => {
      return data
    })
}
/**
 * 批量导入平台
 * @param {*} data
 */

let importPlatForm = function(params) {
  return $http
    .post(urls.importPlatForm, params.file)
    .then(({ data }) => {
      return data
    })
}
/**
 * 导平台上传模板
 * @param {*} params
 */
let exportPlatFormModel = function(params) {
  return $http
    .get(urls.exportPlatFormModel, {
      responseType: 'blob'
    })
    .then(({ data }) => {
      return data
    })
}
//导出平台对应的摄像机
/**
 * 获取摄像机列表
 * 必填  currPage 当前页   pageSize 显示多少条
 * 头部   organizationCode    组织权限        userId  用户id 绑定用户信息
 * 非必填  provinceCode 省份编码    organizationCode  管辖单位    roadName 路线   cameraName 相机名    userCode  用户编码
 *         classifyCode  所属类别 0-道路 1-服务区 2-收费站 3-桥隧 4-ETC门架 5-加油站
 *         directionCode   方向 0-上行 1-下行 2-上下行
 */
let getCameraList = function(params) {
  return $http
    .get(urls.getCameraList + '?' + QS.stringify(params))
    .then(({ data }) => {
      return data
    })
}

//快照天数列表
let getRecentDaysList = function(params) {
  return $http
    .get(urls.getRecentDaysList + '/' + params.days)
    .then(({ data }) => {
      return data
    })
}
//借阅审核摄像机列表
let getBorrowCamerasList = function(params) {
  return $http
    .get(
      `${urls.getBorrowCamerasList}/${params.borrowId}?currPage=${params.currPage}&pageSize=${params.pageSize}`
    )
    .then(({ data }) => {
      return data
    })
}
//故障列表
let getMalfunctionReportList = function(params) {
  return $http
    .get(
      urls.getMalfunctionReportList +
        '?' +
        QS.stringify(params)
    )
    .then(({ data }) => {
      return data
    })
}

//保存故障信息
let getMalfunctionReportAdd = function(params) {
  return $http
    .get(
      urls.getMalfunctionReportAdd +
        '?' +
        QS.stringify(params)
    )
    .then(({ data }) => {
      return data
    })
}
let videoPlayRecord = function(params) {
  return $http
    .get(urls.videoPlayRecord + '/' + params)
    .then(({ data }) => {
      return data
    })
}
/**
 * 获取摄像机详情
 * @param {*} data  cameraNum
 */
let getCameraDetails = function(params) {
  return $http
    .get(`/device/cameras/${params.id}/detail`)
    .then(({ data }) => {
      return data
    })
}
let getTemporaryCameraList = function(data) {
  return $http
    .post(
      urls.getTemporaryCameraList +
        `?currPage=${data.currPage}&pageSize=${data.pageSize}`,
      data.info
    )
    .then(({ data }) => {
      return data
    })
}

let comfirmCamera = function(data) {
  return $http
    .post(urls.comfirmCamera, data)
    .then(({ data }) => {
      return data
    })
}

/**
 * 摄像机列表导出
 * 必填
 * 头部   organizationCode    组织权限        userId  用户id 绑定用户信息
 * 非必填 provinceCode 省份编码    department  部门      road  路线    cameraName  相机名     directionCode   方向 0-上行 1-下行 2-上下行
 *        classifyCode  所属类别 0-道路 1-服务区 2-收费站 3-桥隧 4-ETC门架 5-加油站
 *        transcodingName   视频上云网关名称
 */
let exportCameraList = function(data) {
  return $http
    .post(urls.exportCameraList, data, {
      responseType: 'arraybuffer'
    })
    .then(({ data }) => {
      return data
    })
}

/**
 * 摄像机新增接口 单个
 * 必填
 * 头部   organizationCode    组织权限        userId  用户id 绑定用户信息
 * 非必填 cameraName  相机名      roadId  路线id    cameraKmpile 千米桩  cameraHmpile  百米桩   longitude   经度      latitude  纬度    classify 所属类别 0-道路 1-服务区 2-收费站 3-桥隧 4-ETC门架 5-加油站
 *        direction  方向 0-上行 1-下行 2-上下行
 *        transcodingCode    流媒体服务器code
 */
let addCamera = function(data) {
  return $http
    .post(urls.addCamera, data)
    .then(({ data }) => {
      return data
    })
}

/**
 * 摄像机编辑接口
 * url  device/camera/{cameraId}
 * 必填
 * 非必填 cameraName  相机名      roadId  路线id    cameraKmpile 千米桩  cameraHmpile  百米桩   longitude   经度      latitude  纬度    classify 所属类别 0-道路 1-服务区 2-收费站 3-桥隧 4-ETC门架 5-加油站
 *        direction  方向 0-上行 1-下行 2-上下行
 *        transcodingCode    流媒体服务器code
 */
let editCamera = function(data) {
  return $http
    .post(urls.editCamera + data.cameraId, data)
    .then(({ data }) => {
      return data
    })
}

/**
 * 摄像机名称查重
 * url  device/camera/nameCheck/{cameraName}
 */
let checkCameraName = function(data) {
  return $http
    .get(urls.checkCameraName + data)
    .then(({ data }) => {
      return data
    })
}

/**
 * 摄像机删除接口
 * 头部   organizationCode    组织权限        userId  用户id 绑定用户信息
 * url  /device/camera/delete/{cameraID}
 */

let deleteCamera = function(data) {
  return $http
    .delete(urls.deleteCamera, {
      data: data
    })
    .then(({ data }) => {
      return data
    })
}

/**
 * 摄像机批量删除接口
 */
let deleteBatchCamera = function(data) {
  return $http
    .delete(urls.deleteBatchCamera, {
      data: data
    })
    .then(({ data }) => {
      return data
    })
}

/**
 * 摄像机批量新增模板获取接口
 */
let downCameraTemplate = function() {
  return $http
    .get(urls.downCameraTemplate, {
      responseType: 'arraybuffer'
    })
    .then(({ data }) => {
      return data
    })
}

/**
 * 是否开放云台控制的权限
 *
 */
let authUpdateControl = function(params) {
  return $http
    .post(
      urls.authUpdateControl + '?' + QS.stringify(params)
    )
    .then(({ data }) => {
      return data
    })
}

/**
 * 摄像机播放、启用状态
 */
let updateOpStatus = function(data) {
  return $http
    .post(urls.updateOpStatus, data)
    .then(({ data }) => {
      return data
    })
}

let batchUpdateOpen = function(data) {
  return $http
    .post(urls.batchUpdateOpen, data)
    .then(({ data }) => {
      return data
    })
}
let batchUpdateDisplay = function(data) {
  return $http
    .post(urls.batchUpdateDisplay, data)
    .then(({ data }) => {
      return data
    })
}

let updateStreamStatus = function(params) {
  return $http
    .post(urls.updateStreamStatus, params)
    .then(({ data }) => {
      return data
    })
}

/**
 * 获取摄像机组管理列表
 * 必填  currPage 当前页   pageSize 显示多少条
 * 非必填  param 对象{regionName  省份名    organizationName  单位名称      userName   创建者      groupName   组名      }
 */
let getDeviceGroupList = function(params) {
  return $http
    .get(
      urls.getDeviceGroupList + '?' + QS.stringify(params)
    )
    .then(({ data }) => {
      return data
    })
}
/**
 * 新增摄像机组
 *
 */
let addDeviceList = function(params) {
  return $http
    .post(urls.addDeviceList, params)
    .then(({ data }) => {
      return data
    })
}
/**
 * 编辑摄像机组
 */
let updateDeviceList = function(params) {
  return $http
    .put(urls.updateDeviceList, params)
    .then(({ data }) => {
      return data
    })
}
let auditAgree = function(params) {
  return $http
    .put(urls.auditAgree + '/' + params.borrowId, params)
    .then(({ data }) => {
      return data
    })
}
let revokeBorrow = function(params) {
  return $http
    .put(urls.revokeBorrow + '/' + params.borrowId, params)
    .then(({ data }) => {
      return data
    })
}
/**
 * 获取已关联的摄像机组
 */
let getSelectdRole = function(params) {
  return $http
    .get(urls.getSelectdRole + '?' + QS.stringify(params))
    .then(({ data }) => {
      return data
    })
}
//
let getSelectedUser = function(params) {
  return $http
    .get(urls.getSelectedUser + '?' + QS.stringify(params))
    .then(({ data }) => {
      return data
    })
}
//已选择的摄像机
let selectedGroups = function(params) {
  return $http
    .get(urls.selectedGroups + '?' + QS.stringify(params))
    .then(({ data }) => {
      return data
    })
}
/**
 * 批量关联摄像机组用户
 *  groupIds (Array[]): 要修改的组id ,
 * relationIds (Array[], optional): 关联的用户id或角色code ,
 * status (integer, optional): 状态（1关联用户，2关联角色）
 */
let upDateRelationUser = function(data) {
  return $http
    .put(urls.upDateRelationUser, data)
    .then(({ data }) => {
      return data
    })
}
/**
 * 新建/编辑摄像机组
 * 头部   userId    用户id
 * 必填   groupName   分组名称
 * 非必填    groupId     摄像机组ID,如果更新则需要传入，否则不传入
 */
let addDeviceGroup = function(data) {
  return $http
    .post(urls.addDeviceGroup, data)
    .then(({ data }) => {
      return data
    })
}

/**
 * 删除摄像机组
 * 必填   groupIds  摄像机组ID,
 */
let deleteDeviceGroup = function(data) {
  return $http
    .delete(urls.deleteDeviceGroup, { data: data })
    .then(({ data }) => {
      return data
    })
}
/**
 * 起停用摄像机组
 */
let openOrStopDevice = function(data) {
  return $http
    .put(`/user/group/${data.groupId}/openStatus`, {
      ...data
    })
    .then(({ data }) => {
      return data
    })
}
/**
 * 摄像机组关联的相机
 */
let getDeviceCamera = function(params) {
  return $http
    .get(urls.getDeviceCamera + '?' + QS.stringify(params))
    .then(({ data }) => {
      return data
    })
}
/**
 * 选择设备
 * 必填   groupId   摄像机组的Id    devs  设备Id的集合
 * 非必填
 */
let addDev = function(data) {
  return $http.post(urls.addDev, data).then(({ data }) => {
    return data
  })
}

/**
 * 选择人员
 * 必填   groupId   摄像机组的Id    users 人员Id的list集合
 * 非必填
 */
let getDeviceDetailuser = function(params) {
  return $http
    .get(
      urls.getDeviceDetailuser + '?' + QS.stringify(params)
    )
    .then(({ data }) => {
      return data
    })
}

/**
 * 查看设备
 * 必填  currPage 当前页   pageSize 显示数量     param   额外参数    groupId   组Id
 * 非必填
 */
let checkDev = function(data) {
  return $http
    .post(urls.checkDev, data)
    .then(({ data }) => {
      return data
    })
}

/**
 * 查看人员
 * 必填  currPage 当前页   pageSize 显示数量     param   额外参数    groupId   组Id
 * 非必填
 */
let checkUser = function(params) {
  return $http
    .get(urls.checkUser + '?' + QS.stringify(params))
    .then(({ data }) => {
      return data
    })
}

/**
 * 组名查重
 * 必填  groupName  组名 返回"0"不存在 “1”存在
 */
let checkDeviceGroup = function(data) {
  return $http
    .post(urls.checkDeviceGroup, data)
    .then(({ data }) => {
      return data
    })
}

/**
 * 删除组设备
 * 必填   devs  设备Id的集合       groupId   组Id
 */
let delGroupDev = function(data) {
  return $http
    .delete(urls.delGroupDev, { data: data })
    .then(({ data }) => {
      return data
    })
}

/**
 * 删除组成员
 * 必填   groupId  组id       users   人员ID的list集合
 */
let delGroupUser = function(data) {
  return $http
    .post(urls.delGroupUser, data)
    .then(({ data }) => {
      return data
    })
}

/**
 * 选择设备-摄像机查询接口（摄像机组管理）
 * url  device/camera/list/{groupid}？currPage= & pageSize=
 * 非必填   provinceCode 省份编码    organizationName  管辖单位    roadName  路线    cameraName  相机名
 *          classifyCode    所属类别 0-道路 1-服务区 2-收费站 3-桥隧 4-ETC门架 5-加油站
 *          directionCode   方向 0-上行 1-下行 2-上下行
 */
let getGroupCameraList = function(data) {
  return $http
    .post(
      urls.getGroupCameraList +
        `${data.groupid}?currPage=${data.currPage}&pageSize=${data.pageSize}`,
      data.info
    )
    .then(({ data }) => {
      return data
    })
}

/**
 * 选择设备-摄像机查询接口（摄像机组管理）
 * url  user/list/{groupid}？currPage= & pageSize=
 * 非必填   provinceCode 省份编码
 */
let getGroupUserList = function(data) {
  return $http
    .post(
      urls.getGroupUserList +
        `${data.groupid}?currPage=${data.currPage}&pageSize=${data.pageSize}`,
      data.info
    )
    .then(({ data }) => {
      return data
    })
}

/**
 * 摄像机组列表导出
 * 必填
 * 头部非必填   regionName  省份名      organizationName    单位      userName    创建人     groupName   组名
 */
let exportGroupList = function(data) {
  return $http
    .get(urls.exportGroupList + data, {
      responseType: 'arraybuffer'
    })
    .then(({ data }) => {
      return data
    })
}

/**
 * 查询权限接口
 * url   /function/{functionCode}
 */
let getPowerList = function() {
  return $http.get(urls.getPowerList).then(({ data }) => {
    return data
  })
}

/**
 * 查询角色接口
 */
let getRoleList = function(params) {
  return $http
    .get(urls.getRoleList + '?' + QS.stringify(params))
    .then(({ data }) => {
      return data
    })
}

/**
 * 新增权限接口
 * 必填  functionName  权限名      path  权限路径     functionDesc  权限描述      functionType 权限类型 00菜单 10：画面 20：按钮
 *       status   权限状态 1：启用 0:禁用        parentCode  父节点编码
 */
let addPower = function(data) {
  return $http
    .post(urls.addPower, data)
    .then(({ data }) => {
      return data
    })
}

/**
 * 新增角色接口
 * 非必填  roleName  角色名      roleDesc   角色描述      status  用户状态 1启用 0禁用
 */
let addRole = function(data) {
  return $http.post(urls.addRole, data).then(({ data }) => {
    return data
  })
}

/**
 * 修改权限接口
 * url  /function/editFunc
 * 非必填  functionName    path      functionType      functionDesc
 */
// let editPower = function (data) {
//   return $http.post(urls.editPower, data).then(({ data }) => {
//     return data;
//   });
// };
let editPower = function(data) {
  return $http
    .put(urls.editPower, data)
    .then(({ data }) => {
      return data
    })
}

/**
 * 变更权限状态接口
 * url  /function/{functionCode}/{status}
 */
let editPowerState = function(data) {
  return $http
    .post(
      urls.editPowerState + `${data.functionCode}/${status}`
    )
    .then(({ data }) => {
      return data
    })
}

/**
 * 修改角色接口
 * url  /role/{roleCode}
 * 非必填  roleName    roleDesc
 */
let editRole = function(data) {
  return $http.put(urls.editRole, data).then(({ data }) => {
    return data
  })
}

//批量修改角色状态
let editRoleStateMore = function(obj) {
  return $http
    .put(urls.editRoleStateMore, obj)
    .then(({ data }) => {
      return data
    })
}

let deleteRole = function(obj) {
  return $http
    .delete(urls.deleteRole, {
      headers: {
        operateNote: Base64.encode(
          JSON.stringify(obj.instructionsDel)
        )
      },
      data: obj
    })
    .then(({ data }) => {
      return data
    })
}

let deleteUnbindGroups = function(obj) {
  return $http
    .delete(urls.deleteUnbindGroups, {
      data: obj
    })
    .then(({ data }) => {
      return data
    })
}

/**
 * 角色绑定权限接口
 * url  /role/{roleCode}/function
 */
let roleAddPower = function(data) {
  return $http
    .post(urls.roleAddPower, data)
    .then(({ data }) => {
      return data
    })
}

/**
 * 用户角色绑定接口
 * url  /role/{roleCode}/user
 * 非必填  users   userCode
 */
let addUserRole = function(data) {
  return $http
    .post(urls.addUserRole + `${data.roleCode}/user`, data)
    .then(({ data }) => {
      return data
    })
}

/**
 * 用户角色解绑接口
 * url  /role/{roleCode}/user
 * 非必填  users   userCode
 */
let roleDelPower = function(data) {
  return $http
    .delete(
      urls.roleDelPower + `${data.roleCode}/user`,
      data
    )
    .then(({ data }) => {
      return data
    })
}

/**
 * 查询角色用户接口
 * url  /role/{roleCode}/user
 * 非必填  users   userCode
 */
let getRoleUser = function(params) {
  return $http
    .get(urls.getRoleUser + '?' + QS.stringify(params))
    .then(({ data }) => {
      return data
    })
}

// 获取用户详情=====系统设置
let getUserDetail = function(data) {
  return $http
    .put(urls.getUserDetail, data)
    .then(({ data }) => {
      return data
    })
}
/**
 * 角色名查重
 * 必填  roleName
 * 返回值  1：存在 0：不存在
 */
let checkRoleName = function(data) {
  return $http
    .get(urls.checkRoleName + data)
    .then(({ data }) => {
      return data
    })
}

/**
 * 行政区划获取
 * url   /region/{regionCode}
 * 获取行政区划列表 1-1、当regionCode为0时 ，返回1级别行政单位列表（34省/直辖市） 1-2、当regionCode为1级行政单位的regionCode时，返回当前省下各级行政单位的树状表
 */
let getRegion = function(data) {
  return $http
    .get(urls.getRegion + '?' + QS.stringify(data))
    .then(({ data }) => {
      return data
    })
}

/**
 * 组织架构获取
 */
let getOrg = function(params) {
  return $http
    .get(urls.getOrgTree + '?' + QS.stringify(params))
    .then(({ data }) => {
      return data
    })
}
let getOrgTop = function(params) {
  return $http
    .get(urls.getOrgTop + '?' + QS.stringify(params))
    .then(({ data }) => {
      return data
    })
}
/**
 * 查询字典项接口
 * url  /basic/codemaster/{codeType}
 * CLASSIFY     DERECTION   可传参数
 */
let getCodemaster = function(params) {
  return $http
    .get(urls.getCodemaster + '?' + QS.stringify(params))
    .then(({ data }) => {
      return data
    })
}
/**
 *
 */
let getCloudSecret = function() {
  return $http.get(urls.getCloudSecret).then(({ data }) => {
    return data
  })
}

/**
 * 路名获取
 */
let getRoad = function() {
  return $http.get(urls.getRoad).then(({ data }) => {
    return data
  })
}

let getRoadsByOrgId = function(obj) {
  return $http
    .get(urls.getRoadsByOrgId + '?pageSize=0')
    .then(({ data }) => {
      return data
    })
}

/*
getRoadListOrInfo           : '/basic/road/info',                               // 获取路线列表、单个路线信息
    addRoadInfo                 : '/basic/road/add',                                // 添加路线信息
    deleteRoadInfo              : '/basic/road/delete/',                            // 删除路线
    editRoadInfo                : '/basic/road/edit/',                              // 修改路线
*/
/**
 * 获取路线列表、单个路线信息
 * params currPage=1&pageSize=10
 * body
     {
      "roadCode": "1",		//路线编码（模糊
      //"roadId": "",			//路线id
      "roadName": "",		//路线名称（模糊
      "roadType": "1"		//路线类型
    }
 * @param obj
 * @returns {*|PromiseLike<any>|Promise<any>}
 */
let getRoadList = function(obj) {
  return $http
    .get(urls.getRoadListOrInfo + '?' + QS.stringify(obj))
    .then(({ data }) => {
      return data
    })
}
let getRoadInfo = function(obj) {
  return $http
    .post(
      urls.getRoadListOrInfo + '?currPage=0&pageSize=0',
      obj
    )
    .then(({ data }) => {
      return data
    })
}
/**
 * 添加路线信息
 * body
     {
      "linkedRegion": [             	//关联城市
        "110000","120000","130000"		//城市编码
      ],
      "roadCode": "hhh",				//路线编码（必填）
      "roadName": "ppp",				//路线名称（必填）
      "roadRegion": "110000",			//省级高速所属省份编码
      "roadType": "1"					//路线类型（必填）
    }
 * @param obj
 * @returns {*|PromiseLike<any>|Promise<any>}
 */
let addRoadInfo = function(obj) {
  return $http
    .post(urls.addRoadInfo, obj)
    .then(({ data }) => {
      return data
    })
}
/**
 * 删除路线
 * urlParam: roadId-路线id
 * @param roadId
 * @returns {*|PromiseLike<any>|Promise<any>}
 */
let deleteRoadInfo = function(roadId) {
  return $http
    .delete(urls.deleteRoadInfo + roadId)
    .then(({ data }) => {
      return data
    })
}
/**
 * 修改路线
 * urlParam: roadId-路线id
 * body:
    {
      "linkedRegion": [             	//关联城市
        "110000","120000","130000"		//城市编码
      ],
      "roadCode": "hhh",				//路线编码（必填）
      "roadName": "ppp",				//路线名称（必填）
      "roadRegion": "110000",			//省级高速所属省份编码
      "roadType": "1"					//路线类型（必填）
    }
 * @param obj
 * @returns {*|PromiseLike<any>|Promise<any>}
 */
let editRoadInfo = function(obj) {
  return $http
    .put(urls.editRoadInfo + obj.roadId, obj)
    .then(({ data }) => {
      return data
    })
}

/**
 * 获取省份信息
 */

let getProvince = function(params) {
  return $http
    .get(urls.getProvince + '?' + QS.stringify(params))
    .then(({ data }) => {
      return data
    })
}

/**
 * 根据角色编码获取缓存中的权限列表
 * 必填  roleCode  角色code
 */
let findFuncByRole = function(data) {
  return $http.get(urls.findFuncByRole).then(({ data }) => {
    return data
  })
}

// let findFuncByRole = function(data) {
//   return $http.get(urls.findFuncByRole + data).then(({ data }) => {
//     return data;
//   });
// };

// 获取角色下已绑定的权限
let getChoseListByAllRole = function(params) {
  return $http
    .get(
      urls.getChoseListByAllRole +
        '?' +
        QS.stringify(params)
    )
    .then(({ data }) => {
      return data
    })
}

let getDevicePlatformList = params => {
  return $http
    .get(
      urls.getDevicePlatformList +
        '?' +
        QS.stringify(params)
    )
    .then(({ data }) => {
      return data
    })
}

let addDevicePlatform = params => {
  return $http
    .post(
      urls.addDevicePlatform +
        '?' +
        QS.stringify(params.params),
      params.formData ? params.formData.file : null,
      params.formData
        ? {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        : ''
    )
    .then(({ data }) => {
      return data
    })
}
/**
 * 开放/关闭平台 1/0
 */
let updateOpenPlatform = function(params) {
  return $http
    .put(
      `/device/platforms/${params.transcodingId}/openStatus`,
      params.status
    )
    .then(({ data }) => {
      return data
    })
}
/**
 *
 * @param {*} params
 *显示/隐藏平台 1/0
 */
let updateApperPlatform = function(params) {
  return $http
    .put(
      `/device/platforms/${params.transcodingId}/displayStatus `,
      params.status
    )
    .then(({ data }) => {
      return data
    })
}
//更新平台私钥
let uploadPlatformPrivateKey = params => {
  console.log(params)
  return $http
    .post(
      urls.uploadPlatformPrivateKey + params.appCode,
      params.file,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )
    .then(({ data }) => {
      return data
    })
}
/**
 *
 * @param {*} params
 * 更新平台
 */
let updateDevicePlatform = params => {
  return $http
    .put(
      urls.updateDevicePlatform + params.id,
      params.params
    )
    .then(({ data }) => {
      return data
    })
}
/**
 * 删除平台
 * @param {*} params
 */
let delDevicePlatform = params => {
  return $http
    .delete(urls.deleteDevicePlatform + params.id)
    .then(({ data }) => {
      return data
    })
}
/**
 * 平台详情
 * @param {*} params
 */
let getPlatFormDetails = function(params) {
  return $http
    .get(urls.getPlatFormDetails + params.id)
    .then(({ data }) => {
      return data
    })
}
let checkDevicePlatformStatus = params => {
  return $http
    .delete(
      urls.checkDevicePlatformStatus +
        '?' +
        QS.stringify(params)
    )
    .then(({ data }) => {
      return data
    })
}
let getaccInfo = (params, data) => {
  return $http
    .post(
      urls.getaccInfo + '?' + `transcodingId=${params}`,
      data
    )
    .then(({ data }) => {
      return data
    })
}
let exportPlatformKey = params => {
  return $http
    .post(
      urls.exportDevicePlatformKey +
        '?' +
        QS.stringify(params),
      {
        responseType: 'arraybuffer'
      }
    )
    .then(({ data }) => {
      return data
    })
}

let exportPlatformToken = params => {
  return $http
    .post(
      urls.exportDevicePlatformToken +
        '?' +
        QS.stringify(params),
      {
        responseType: 'arraybuffer'
      }
    )
    .then(({ data }) => {
      return data
    })
}

let resetDevicePlatform = params => {
  return $http
    .post(urls.resetDevicePlatform, params)
    .then(({ data }) => {
      return data
    })
}

let getCameraBrowsePages = function(params) {
  console.info('getCameraBrowsePages', params)
  return $http
    .post(urls.getCameraBrowsePages, params)
    .then(({ data }) => {
      return data
    })
}

let getCameraApplyPages = function(params) {
  console.info('getCameraApplyPages', params)
  return $http
    .post(urls.getCameraApplyPages, params)
    .then(({ data }) => {
      return data
    })
}

let postCameraBrowseApply = function(params) {
  return $http
    .post(urls.postCameraBrowseApply, params)
    .then(({ data }) => {
      return data
    })
}

let postCameraBrowseVerify = function(params) {
  return $http
    .post(urls.postCameraBrowseVerify, params)
    .then(({ data }) => {
      return data
    })
}

/**
 * 摄像机统计
 * @param params
 * @returns {PromiseLike<any> | Promise<any>}
 */
let getDeviceStatistics = function(params) {
  return $http
    .post(
      urls.getCameraStatistics + '/' + params.dimensionType,
      params.data
    )
    .then(({ data }) => {
      return data
    })
}

let getCameraListForStatis = function(data) {
  return $http
    .post(
      urls.getCameraListForStatis +
        '?' +
        QS.stringify(data.params),
      data.data
    )
    .then(({ data }) => {
      return data
    })
}
// let getMileageList = function(param) {
//   return $http
//     .get(urls.getMileageList ,param)
//     .then(({ data }) => {
//       return data;
//     });
// };
let getMileageList = function(data) {
  return $http
    .get(urls.getMileageList + '?' + QS.stringify(data))
    .then(({ data }) => {
      return data
    })
}
// let getCameraPlayUrl = function(data) {
//   return $http
//     .get(urls.getCameraPlayUrl + "?" + QS.stringify(data))
//     .then(({ data }) => {
//       return data;
//     });
// };
/**
 * 地图等级查找摄像机点位
 */
let postCameraListForPot = function(param) {
  return $http
    .post(
      urls.postCameraListForPot +
        '?' +
        QS.stringify(param.params),
      param.data,
      {
        cancelToken: new axios.CancelToken(c => {
          requestingList['postCameraListForPot'] = c
        })
      }
    )
    .then(({ data }) => {
      return data
    })
}
const cancelPostCameraListForPot = () => {
  requestingList['postCameraListForPot']?.()
  delete requestingList['postCameraListForPot']
}

/**
 * 地图等级查找全国摄像机点位
 */
// let postCameraListForPot = function (data) {
//   var urlstr=urls.postCameraListForPot + "?" + QS.stringify(data.params);
//   try{
//     return $http
//     .post(
//       urlstr,
//       data.data
//     )
//     .then(({ data }) => {
//       return $http.post("http://101.201.125.81:9527/v1"+urlstr,{})
//       .then((res)=>{
//         console.log(res,"mvp")
//         res.data.data.forEach(it => {
//           data.data.push(it)
//         });
//         console.log(data.data.length,"length")
//         return data;
//       })
//       .catch(e=>{
//         return data;
//       })

//     })
//   }catch(e){
//     return $http.post("http://101.201.125.81:9527/v1"+urlstr,{})
//     .then(({sdres})=>{
//       console.log(sdres,'js')
//       return sdres;
//     });
//   }

// };

/**
 * 摄像机推流地址
 */
let getCameraPlayUrl = function(data) {
  return $http
    .get(urls.getCameraPlayUrl + '?' + QS.stringify(data))
    .then(({ data }) => {
      return data
    })
}

let getCameraSnapShots = function(data) {
  return $http
    .get(
      urls.getCameraSnapShots + '?' + QS.stringify(data),
      {
        headers: {
          // Origin:"https://hngscloud.com"
        }
      }
    )
    .then(({ data }) => {
      return data
    })
}

let maplevelInitialize = function(data) {
  return $http
    .post(urls.maplevelInitialize, data)
    .then(({ data }) => {
      return data
    })
}

/**
 * 摄像机运行情况统计
 * @param data
 * @returns {PromiseLike<any> | Promise<any>}
 */
let getCameraRunStatistic = function(data) {
  return $http
    .post(
      urls.getCameraRunStatistic +
        '?' +
        QS.stringify(data.params),
      data.data
    )
    .then(({ data }) => {
      return data
    })
}

/**
 * 摄像机运行情况统计
 * @param data
 * @returns {PromiseLike<any> | Promise<any>}
 */
let getAllCameraAbnormalStatistics = function(params) {
  let cloudplatform = JSON.parse(
    localStorage.getItem('cloudplatform')
  )
  return $http
    .get(
      urls.getAllCameraAbnormalStatistics +
        '?' +
        QS.stringify(params),
      {
        headers: {
          organizationId: cloudplatform.organizationId
        }
      }
    )
    .then(({ data }) => {
      return data
    })
}
/**
 * 调取统计
 * @param data
 * @returns {PromiseLike<any> | Promise<any>}
 */
let getCountDaily = function(params) {
  return $http
    .get(urls.getCountDaily + '?' + QS.stringify(params))
    .then(({ data }) => {
      return data
    })
}
/**
 * 区域统计
 * @param data
 * @returns {PromiseLike<any> | Promise<any>}
 */
let getRegionStatistics = function(params) {
  return $http
    .get(
      urls.getRegionStatistics + '?' + QS.stringify(params)
    )
    .then(({ data }) => {
      return data
    })
}
/**
 * 调取统计数据来源
 * @param data
 * @returns {PromiseLike<any> | Promise<any>}
 */
let getSourceStatistics = function(params) {
  return $http
    .get(
      urls.getSourceStatistics + '?' + QS.stringify(params)
    )
    .then(({ data }) => {
      return data
    })
}
// 调取统计摄像机列表
let getPlayRecordList = function(params) {
  return $http
    .get(
      urls.getPlayRecordList + '?' + QS.stringify(params)
    )
    .then(({ data }) => {
      return data
    })
}
// 导出调取统计列表
let exportPlayRecord = function(data) {
  return $http
    .get(urls.exportPlayRecord + '?' + QS.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'blob' //二进制流,
    })
    .then(({ data }) => {
      return data
    })
}
/**
 * 摄像机运行情况统计
 * @param data
 * @returns {PromiseLike<any> | Promise<any>}
 */
let getAllCameraRunStatistics = function(params) {
  return $http
    .get(
      urls.getAllCameraRunStatistics +
        '?' +
        QS.stringify(params)
    )
    .then(({ data }) => {
      return data
    })
}
let getAllCameraAbnormalList = function(data) {
  let cloudplatform = JSON.parse(
    localStorage.getItem('cloudplatform')
  )
  return $http
    .get(
      urls.getAllCameraAbnormalList +
        '?' +
        QS.stringify(data.params),
      {
        headers: {
          organizationId: cloudplatform.organizationId
        }
      }
    )
    .then(({ data }) => {
      return data
    })
}

let getDashboardCountData = function(params) {
  params = {
    day: 30
  }
  return $http
    .get(
      urls.getDashboardCountData +
        '?' +
        QS.stringify(params)
    )
    .then(({ data }) => {
      return data
    })
}
let playCount = function(params) {
  return $http.get(urls.playCount).then(({ data }) => {
    return data
  })
}
let getDashboardAccessData = function(params) {
  return $http
    .get(urls.getDashboardAccessData)
    .then(({ data }) => {
      return data
    })
}

/**
 * 摄像机运行情况统计导出
 * @param data
 * @returns {PromiseLike<any> | Promise<any>}
 */
let exportCameraRunStatistic = function(data) {
  return $http
    .get(
      urls.exportCameraRunStatistic +
        '?' +
        QS.stringify(data),
      {
        responseType: 'arraybuffer'
      }
    )
    .then(({ data }) => {
      return data
    })
}

/**
 * 摄像机故障情况统计
 * @param data
 * @returns {PromiseLike<any> | Promise<any>}
 */
let getCameraFaultStatistic = function(data) {
  return $http
    .post(
      urls.getCameraFaultStatistic +
        '?' +
        QS.stringify(data.params),
      data.data
    )
    .then(({ data }) => {
      return data
    })
}

/**
 * /摄像机故障情况统计导出
 * @param data
 * @returns {PromiseLike<any> | Promise<any>}
 */
let exportCameraFaultStatistic = function(data) {
  return $http
    .get(
      urls.exportCameraFaultStatistic +
        '?' +
        QS.stringify(data),
      {
        responseType: 'arraybuffer'
      }
    )
    .then(({ data }) => {
      return data
    })
}

let getCameraVisitStatistic = function(data) {
  return $http
    .post(
      urls.getCameraVisitStatistic +
        '?' +
        QS.stringify(data.params),
      data.data
    )
    .then(({ data }) => {
      return data
    })
}

let exportCameraVisitStatistic = function(data) {
  return $http
    .get(
      urls.exportCameraVisitStatistic +
        '?' +
        QS.stringify(data),
      {
        responseType: 'arraybuffer'
      }
    )
    .then(({ data }) => {
      return data
    })
}

/**
 * 查询流媒体列表
 */
let getStreamMediaList = function(data) {
  return $http
    .get(urls.getStreamMediaList + '?' + QS.stringify(data))
    .then(({ data }) => {
      return data
    })
}
/**
 * 获取流媒体详情
 * GET /v1/device/streamMedias/{id}
 */
let getStreamMediaInfo = function(data) {
  return $http
    .get(urls.getStreamMediaInfo + data)
    .then(({ data }) => {
      return data
    })
}

/**
 * 查询已绑定的视频上云网关和未绑定的视频上云网关
 */
let getStreamMediaTranscodingList = function(data) {
  return $http
    .post(urls.getStreamMediaTranscodingList, data)
    .then(({ data }) => {
      return data
    })
}

/**
 * 新增流媒体
 */
let addStreamMedia = function(data) {
  return $http
    .post(urls.addStreamMedia, data)
    .then(({ data }) => {
      return data
    })
}

/**
 * 更新流媒体/device/streamMedias/{id}
 */
let updateStreamMedia = function(data) {
  return $http
    .put(urls.updateStreamMedia + data.smId, data)
    .then(({ data }) => {
      return data
    })
}

/**
 * 删除流媒体
 * DELETE /v1/device/streamMedias/{id}
 * 逻辑删除流媒体，如果流媒体下有上云网关或摄像机不能删除
 */
let deleteStreamMedia = function(data) {
  return $http
    .delete(urls.deleteStreamMedia + data.smId, {
      headers: {
        operateNote: Base64.encode(
          JSON.stringify(data.instructionsDel)
        )
      }
    })
    .then(({ data }) => {
      return data
    })
}

/**
 * 绑定视频上云网关
 */
let bindStreamMedia = function(data) {
  return $http
    .put(
      urls.bindStreamMedia + data.flag + '/bind',
      data.list,
      {
        headers: {
          operateNote: Base64.encode(
            JSON.stringify(data.instructions)
          )
        }
      }
    )
    .then(({ data }) => {
      return data
    })
}

let getMessagePages = function(params) {
  return $http
    .get(urls.getMessagePages + '?' + QS.stringify(params))
    .then(({ data }) => {
      return data
    })
}

let getReportDailyInfo = function(params) {
  return $http
    .get(
      urls.getReportDailyInfo + '?' + QS.stringify(params)
    )
    .then(({ data }) => {
      return data
    })
}

let putMessageStatus = function(params) {
  return $http
    .put(urls.putMessageStatus, params)
    .then(({ data }) => {
      return data
    })
}

let userAddRole = function(data) {
  return $http
    .post(urls.userAddRole, data)
    .then(({ data }) => {
      return data
    })
}
let editUserById = function(data) {
  return $http
    .post(urls.editUserById + `/${data.userId}`, data)
    .then(({ data }) => {
      return data
    })
}
let userAccountCheck = function(data) {
  return $http
    .get(urls.userAccountCheck + `${data}`, data)
    .then(({ data }) => {
      return data
    })
}
/**
 * 获取开放api接口
 * @param data
 * @returns {*}
 */
let getCallManagement = function(data) {
  return $http
    .post(urls.getCallManagement, data)
    .then(({ data }) => {
      return data
    })
}

/**
 * 新增开放api接口
 * @param data
 * @returns {*}
 */
let addCallManagement = function(data) {
  let cloudplatform = JSON.parse(
    localStorage.getItem('cloudplatform')
  )
  return $http
    .post(urls.addCallManagement, data, {
      headers: {
        UserId: cloudplatform.userId,
        organizationId: cloudplatform.organizationId
      }
    })
    .then(({ data }) => {
      console.log(cloudplatform.userId)
      return data
    })
}

/**
 * 修改开放api接口
 * @param data
 * @returns {*}
 */
let editCallManagement = function(data) {
  let cloudplatform = JSON.parse(
    localStorage.getItem('cloudplatform')
  )
  return $http
    .put(urls.editCallManagement, data, {
      headers: {
        UserId: cloudplatform.userId,
        organizationId: cloudplatform.organizationId
      }
    })
    .then(({ data }) => {
      return data
    })
}

/**
 * 查询授权
 * @param data
 * @returns {*}
 */
let authorizationCallManagement = function(data) {
  return $http
    .get(
      `${urls.authorizationCallManagement}/${data.api_id}?flag=${data.flag}`
    )
    .then(({ data }) => {
      return data
    })
}

/**
 * 授权
 * @param data
 * @returns {*}
 */
let authorizationCall = function(data) {
  return $http
    .post(urls.authorizationCall, data)
    .then(({ data }) => {
      return data
    })
}

/**
 * 解除授权
 * @param data
 * @returns {*}
 */
let relieveCall = function(data) {
  return $http
    .put(urls.relieveCall, data)
    .then(({ data }) => {
      return data
    })
}

/**
 * 删除开放api接口
 * @param data
 * @returns {*}
 */
let deleteCallManage = function(data) {
  return $http
    .delete(`${urls.deleteCallManage}/${data}`)
    .then(({ data }) => {
      return data
    })
}

/**
 * 接口启用接口
 * @param data
 * @returns {*}
 */
let enableApi = function(data) {
  return $http
    .put(urls.enableApi, data)
    .then(({ data }) => {
      return data
    })
}

/**
 * 接口禁用接口
 * @param data
 * @returns {*}
 */
let prohibitApi = function(data) {
  return $http
    .put(urls.prohibitApi, data)
    .then(({ data }) => {
      return data
    })
}

/**
 * 获取已申请摄像机列表
 * @param data
 * @returns {*}
 */
let getBorrowing = function(data) {
  return $http
    .post(urls.getBorrowing, data)
    .then(({ data }) => {
      return data
    })
}

/**
 * 获取摄像机树结构数据
 * @param data
 * @returns {*}
 */
let getBorrowTree = function() {
  return $http.get(urls.getBorrowTree).then(({ data }) => {
    return data
  })
}

/**
 * 获取摄像机列表数据
 * @param data
 * @returns {*}
 */
let getCameraData = function(data) {
  return $http
    .post(urls.getCameraData, data)
    .then(({ data }) => {
      return data
    })
}

/**
 * 获取上云网关详情
 */
let getGatewayInfo = function(params) {
  return $http
    .get(urls.getGatewayInfo + params.id)
    .then(({ data }) => {
      return data
    })
}

/**
 * 获取上云网关下的摄像机列表
 */
let getGatewayCameraList = function(data) {
  return $http
    .get(
      urls.getGatewayCameraList + '?' + QS.stringify(data)
    )
    .then(({ data }) => {
      return data
    })
}

let cameraYtControl = function(params, instructions) {
  return $http
    .get(
      urls.cameraYtControl + '?' + QS.stringify(params),
      {
        headers: {
          operateNote: Base64.encode(
            JSON.stringify(instructions)
          )
        }
      }
    )
    .then(({ data }) => {
      return data
    })
}

/**
 * 视频流状态监测
 */
let getvideoStreamStatus = function(data) {
  return $http
    .get(
      urls.getvideoStreamStatus + '?' + QS.stringify(data)
    )
    .then(({ data }) => {
      return data
    })
}

/**
 * 申请调阅
 * @param data
 * @returns {*}
 */
let applyBrowse = function(data) {
  return $http
    .post(urls.applyBrowse, data)
    .then(({ data }) => {
      return data
    })
}

/**
 * 获取调用方访问列表数据
 * @param data
 * @returns {*}
 */
let getAccesslogByApp = function(data) {
  return $http
    .get(urls.getAccesslogByApp + '?' + QS.stringify(data))
    .then(({ data }) => {
      return data
    })
}

/**
 * 获取调用方访问列表数据
 * @param data
 * @returns {*}
 */
let getJoinerlogByApp = function(data) {
  return $http
    .get(urls.getAccesslogByApp + '?' + QS.stringify(data))
    .then(({ data }) => {
      return data
    })
}

/**
 * 查看摄像机调阅
 * @param data
 * @returns {*}
 */
let seeCameraMsg = function(data) {
  return $http
    .get(`${urls.seeCameraMsg}?applyId=${data}`)
    .then(({ data }) => {
      return data
    })
}

/**
 * 获取调用方访问列表数据
 * @param data
 * @returns {*}
 */
let getAccesslogByUrl = function(data) {
  return $http
    .get(
      urls.getAccesslogByUrl +
        '/' +
        data.appCode +
        '?' +
        QS.stringify(data)
    )
    .then(({ data }) => {
      return data
    })
}

/**
 * 获取接入方访问列表数据
 * @param data
 * @returns {*}
 */
let getJoinerlogByUrl = function(data) {
  return $http
    .get(
      urls.getAccesslogByUrl +
        '/' +
        data.appCode +
        '?' +
        QS.stringify(data)
    )
    .then(({ data }) => {
      return data
    })
}

/**
 * 明细下载
 * @param data
 * @returns {*}
 */
let exportAccesslog = function(data) {
  return $http
    .get(
      urls.exportAccesslogByUrl + '?' + QS.stringify(data),
      {
        responseType: 'arraybuffer'
      }
    )
    .then(({ data }) => {
      return data
    })
}

/**
 * 审批调阅
 * @param data
 * @returns {*}
 */
let approvalVerify = function(data) {
  return $http
    .post(urls.approvalVerify, data)
    .then(({ data }) => {
      return data
    })
}

/**
 * 获取视频上云网关表格数据
 * @param data
 * @returns {*}
 */
let getTranscoding = function(data) {
  return $http
    .post(
      `${urls.getTranscoding}?currPage=${data.currPage}&pageSize=${data.pageSize}`,
      data
    )
    .then(({ data }) => {
      return data
    })
}

/**
 * 获取视频上云网关摄像机表格数据
 * @param data
 * @returns {*}
 */
let getVideoCameraData = function(data) {
  return $http
    .post(
      `${urls.getVideoCameraData}?currentPage=${data.currPage}&pageSize=${data.pageSize}`,
      data
    )
    .then(({ data }) => {
      return data
    })
}

/**
 * 获取新增中下拉框选项内容
 * @param data
 * @returns {*}
 */
let getSelectData = function(data) {
  return $http
    .get(`${urls.getSelectData}?codeType=${data}`)
    .then(({ data }) => {
      return data
    })
}

/**
 * 根据管辖单位id获取路段单位
 * @param data
 * @returns {*}
 */
let getRoadCompany = function(data) {
  return $http
    .get(`${urls.getRoadCompany}?organizationId=${data}`)
    .then(({ data }) => {
      return data
    })
}

/**
 * 获取新增中城市下拉框选项内容
 * @param data
 * @returns {*}
 */
let getCities = function(data) {
  return $http
    .get(`${urls.getCities}?regionCode=${data}`)
    .then(({ data }) => {
      return data
    })
}

/**
 * 新增摄像机
 * @param data
 * @returns {*}
 */
let addConfigCam = function(data) {
  return $http
    .post(urls.addConfigCam, data)
    .then(({ data }) => {
      return data
    })
}

/**
 * 编辑时查询下拉框数据的code
 * @param data
 * @returns {*}
 */
let findById = function(data) {
  return $http
    .get(`${urls.findById}?configId=${data}`)
    .then(({ data }) => {
      return data
    })
}

/**
 * 删除摄像机数据
 * @param data
 * @returns {*}
 */
let delCamerta = function(data) {
  return $http
    .post(urls.delCamerta, data)
    .then(({ data }) => {
      return data
    })
}

/**
 * 批量下载
 * @param data
 * @returns {*}
 */
let batchDownload = function(data) {
  return $http
    .get(`${urls.batchDownload}?${data}`, {
      responseType: 'arraybuffer'
    })
    .then(({ data }) => {
      return data
    })
}

/**
 * 批量上传
 * @type {string}
 */
let uploadFile = urls.uploadFile

/**
 * 获取校时服务器信息接口
 * @param data
 * @returns {*}
 */
let getTimeAdjustInfo = function(obj) {
  return $http
    .get(urls.getTimeAdjustInfo + '?' + QS.stringify(obj))
    .then(({ data }) => {
      return data
    })
}

/**
 * 获取校时服务器信息更改接口
 * @param data
 * @returns {*}
 */
let editTimeAdjustInfo = function(obj) {
  return $http
    .post(
      urls.editTimeAdjustInfo + '?' + QS.stringify(obj.url),
      obj.formData
    )
    .then(({ data }) => {
      return data
    })
}

/**
 * 获取上云网关服务的网络设置信息
 * @param data
 * @returns {*}
 */
let getNetInfo = function(obj) {
  return $http
    .get(urls.getNetInfo + '?' + QS.stringify(obj))
    .then(({ data }) => {
      return data
    })
}

/**
 * 上云网关网络设置
 * @param data
 * @returns {*}
 */
let editNetInfo = function(obj) {
  return $http
    .post(
      urls.editNetInfo + '?' + QS.stringify(obj.url),
      obj.formData
    )
    .then(({ data }) => {
      return data
    })
}

/**
 * 静态路由设置信息获取
 * @param data
 * @returns {*}
 */
let getRoutingInfo = function(obj) {
  return $http
    .get(urls.getRoutingInfo + '?' + QS.stringify(obj))
    .then(({ data }) => {
      return data
    })
}

/**
 * 静态路由设置新增接口
 * @param data
 * @returns {*}
 */
let addRoutingInfo = function(obj) {
  return $http
    .post(
      urls.addRoutingInfo + '?' + QS.stringify(obj.url),
      obj.formData
    )
    .then(({ data }) => {
      return data
    })
}

/**
 * 静态路由设置删除接口
 * @param data
 * @returns {*}
 */
let delRoutingInfo = function(obj) {
  return $http
    .post(
      urls.delRoutingInfo + '?' + QS.stringify(obj.url),
      obj.formData
    )
    .then(({ data }) => {
      return data
    })
}

/**
 * 系统重启
 * @param data
 * @returns {*}
 */
let sysRestart = function(obj) {
  return $http
    .post(
      urls.sysRestart + '?' + QS.stringify(obj.url),
      obj.formData
    )
    .then(({ data }) => {
      return data
    })
}

/**
 * 摄像机配置下发
 * @param data
 * @returns {*}
 */
let addVideoSendOut = function(obj) {
  return $http
    .post(
      urls.addVideoSendOut + '?' + QS.stringify(obj.url),
      obj.formData
    )
    .then(({ data }) => {
      return data
    })
}

/**
 * 摄像机配置删除接口
 * @param data
 * @returns {*}
 */
let delVideoSend = function(obj) {
  return $http
    .post(
      urls.delVideoSend + '?' + QS.stringify(obj.url),
      obj.formData
    )
    .then(({ data }) => {
      return data
    })
}

/**
 * TAuth获取的接口
 * @param data
 * @returns {*}
 */
let getTokenInfo = function(obj) {
  return $http
    .get(urls.getTokenInfo + '?' + QS.stringify(obj))
    .then(({ data }) => {
      return data
    })
}

/**
 * 更新视频上云网关Token
 * @param data
 * @returns {*}
 */
let updateAuthToken = function(obj) {
  return $http
    .post(
      urls.updateAuthToken + '?' + obj.url,
      obj.formData
    )
    .then(({ data }) => {
      return data
    })
}
/**
 * 开放管理
 *
 */

let createApp = function(obj, instructions) {
  return $http
    .post(urls.createApp, obj, {
      headers: {
        operateNote: Base64.encode(
          JSON.stringify(instructions)
        )
      }
    })
    .then(({ data }) => {
      return data
    })
}
let getOpenList = function(obj) {
  return $http
    .get(urls.getOpenList + '?' + QS.stringify(obj))
    .then(({ data }) => {
      return data
    })
}
//   更新
let updateAppTitle = function(obj, instructions) {
  return $http
    .put(urls.updateAppTitle + obj.id, obj, {
      headers: {
        operateNote: Base64.encode(
          JSON.stringify(instructions)
        )
      }
    })
    .then(({ data }) => {
      return data
    })
}
// 删除
let deleteApp = function(obj) {
  return $http
    .post(urls.deleteApp + obj.appId)
    .then(({ data }) => {
      return data
    })
}
// 获取keylist
let getKeyList = function(obj) {
  return $http
    .get(
      urls.getKeyList + '?' + `openAppId=${obj.openAppId}`
    )
    .then(({ data }) => {
      return data
    })
}
//创建key
let addNewKey = function(obj, instructions) {
  return $http
    .post(urls.addNewKey, obj, {
      headers: {
        operateNote: Base64.encode(
          JSON.stringify(instructions)
        )
      }
    })
    .then(({ data }) => {
      return data
    })
}
//更新key消息
let updateKeys = function(obj, instructions) {
  return $http
    .put(urls.updateKeys + obj.keyId, obj, {
      headers: {
        operateNote: Base64.encode(
          JSON.stringify(instructions)
        )
      }
    })
    .then(({ data }) => {
      return data
    })
}

// 重置
let getKeyReset = function(appSecret) {
  return $http
    .put(urls.getKeyReset + appSecret)
    .then(({ data }) => {
      return data
    })
}
//相机接口
// let cameraList = function(obj) {
//   return $http.get(urls.cameraList).then(({ data }) => {
//     return data;
//   });
// };
let cameraList = function(obj) {
  return $http.get(urls.cameraList).then(({ data }) => {
    return data
  })
}
let updateKeyStatus = function(obj) {
  let cloudplatform = JSON.parse(
    localStorage.getItem('cloudplatform')
  )
  return $http
    .post(urls.updateKeyStatus + obj)
    .then(({ data }) => {
      return data
    })
}
//绑定资源权限 bindPurview:"/open/appKey/{id}/bindPurview",
let bindPurview = function(id, obj, instructions) {
  return $http
    .post(
      `/user/application/keys/${id}/bind-purview`,
      obj,
      {
        headers: {
          operateNote: Base64.encode(
            JSON.stringify(instructions)
          )
        }
      }
    )
    .then(({ data }) => {
      return data
    })
}
// 获取绑定的摄像机
let getCameraBindList = function(obj) {
  return $http
    .get(`/user/applications/${obj.id}/not-bind-cameras`, {
      params: obj.data
    })
    .then(({ data }) => {
      return data
    })
}
// 绑定摄像机
let CameraBind = function(obj) {
  return $http
    .get(`/user/applications/${obj.id}/bind-cameras`, {
      params: obj.data
    })
    .then(({ data }) => {
      return data
    })
}

//保存数据权限
// /user/applications/${id}/bind-camera
let bindCameraData = function(id, obj, instructions) {
  return $http
    .post(`/user/applications/${id}/bind-camera`, obj, {
      headers: {
        operateNote: Base64.encode(
          JSON.stringify(instructions)
        )
      }
    })
    .then(({ data }) => {
      return data
    })
}
let findBindPurvie = function(key) {
  return $http
    .get(`/user/application/keys/${key}/purview`)
    .then(({ data }) => {
      return data
    })
}
//获取默认相机回显
// let findBindPurvie = function(key) {
//   return $http.get(`/open/appKey/findBindPurview/${key}`).then(({ data }) => {
//     return data;
//   });
// };
let getAllGroupList = function(params) {
  // +`currPage=${1}&pageSize=${10}`
  return $http
    .get(urls.getAllGroupList + '?' + QS.stringify(params))
    .then(({ data }) => {
      return data
    })
}
// 获取摄像机组详情————摄像机list
let getDeviceCameraList = function(params) {
  // /user/group/122/cameraList
  return $http
    .get(
      `/user/group/${params.id}/cameraList` +
        '?' +
        QS.stringify(params.info)
    )
    .then(({ data }) => {
      return data
    })
}
// 获取需要审核的相机
let getTemporaryList = function(params) {
  return $http
    .get(urls.getTemporaryList + '?' + QS.stringify(params))
    .then(({ data }) => {
      return data
    })
}
// 审核通过接口
let getConfirm = function(params) {
  return $http
    .post(urls.getConfirm, params)
    .then(({ data }) => {
      return data
    })
}
// 待审核
let getTemporaryConfirm = function(params) {
  return $http
    .get(
      urls.getTemporaryConfirm + '?' + QS.stringify(params)
    )
    .then(({ data }) => {
      return data
    })
}
// 未通过
let getTemporaryPass = function(params) {
  return $http
    .get(urls.getTemporaryPass + '?' + QS.stringify(params))
    .then(({ data }) => {
      return data
    })
}
// 未通过
let getTemporaryPassCount = function(params) {
  return $http
    .get(
      urls.getTemporaryPassCount +
        '?' +
        QS.stringify(params)
    )
    .then(({ data }) => {
      return data
    })
}
// 根据转码审核摄像机
let getCameraStatus = function(data) {
  return $http
    .post(urls.getCameraStatus, data)
    .then(({ data }) => {
      return data
    })
}
// 转码信息导出
let getExportTemporary = function(params) {
  return $http
    .get(
      urls.getExportTemporary + '?' + QS.stringify(params),
      {
        headers: { 'Content-Type': 'application/json' },
        responseType: 'blob' //二进制流,
      }
    )
    .then(({ data }) => {
      return data
    })
}
//未通过审核的列表导出
let getExportTemporaryPass = function(params) {
  return $http
    .get(
      urls.getExportTemporaryPass +
        '?' +
        QS.stringify(params),
      {
        headers: { 'Content-Type': 'application/json' },
        responseType: 'blob' //二进制流,
      }
    )
    .then(({ data }) => {
      return data
    })
}
/***
 *
 * 组织用户相关
 */
// 省账号组织结构
let provinceTree = function() {
  return $http.get(urls.provinceTree).then(({ data }) => {
    return data
  })
}

/***
 *
 * 组织tree
 */
let getUserOrganization = function(data) {
  return $http
    .get(
      urls.getUserOrganization + '?' + QS.stringify(data)
    )
    .then(({ data }) => {
      return data
    })
}

/***
 *
 * 组织tree（统计）
 */
let getCountUserOrganization = function(data) {
  return $http
    .get(
      urls.getCountUserOrganization +
        '?' +
        QS.stringify(data)
    )
    .then(({ data }) => {
      return data
    })
}

/***
 *
 * 组织tree（截图）
 */
let getCameraCount = function(data) {
  return $http
    .get(urls.getCameraCount + '?' + QS.stringify(data))
    .then(({ data }) => {
      return data
    })
}

let getOrgCompany = function(data) {
  return $http
    .get(urls.getOrgCompany + '?' + QS.stringify(data))
    .then(({ data }) => {
      return data
    })
}
// 批量更新组织
let updateOrganizations = function(params) {
  return $http
    .post(urls.updateOrganizations, params)
    .then(({ data }) => {
      return data
    })
}
// 新增组织POST /organization
let AddOrganizationList = function(params) {
  return $http
    .post(urls.AddOrganizationList, params)
    .then(({ data }) => {
      return data
    })
}
// 更新组织
let updateUserOrganization = function(id, params) {
  return $http
    .put(urls.updateUserOrganization + id, params)
    .then(({ data }) => {
      return data
    })
}
// 删除组织
let delUserOrganization = function(id, params) {
  return $http
    .delete(
      urls.delUserOrganization +
        id +
        '?' +
        QS.stringify(params)
    )
    .then(({ data }) => {
      return data
    })
}
/***
 *
 * 组织用户
 */
/**
 */

//  获取用户详情
let getOrgUserInfo = function(data) {
  return $http
    .get(urls.getOrgUserInfo + '?' + QS.stringify(data))
    .then(({ data }) => {
      return data
    })
}
// 新增组织用户
let addOrgUser = function(params) {
  return $http
    .post(urls.addOrgUser, params)
    .then(({ data }) => {
      return data
    })
}
//批量删除视频

let delCamera = function(params) {
  return $http
    .delete(urls.delCamera, { data: params })
    .then(({ data }) => {
      return data
    })
}
//批量删除截图
let delImg = function(params) {
  return $http
    .delete(urls.delImg, { data: params })
    .then(({ data }) => {
      return data
    })
}
//批量删除截图
let batchDownloadImages = function(data) {
  return $http.get(
    urls.batchDownloadImages + '?urls=' + data,
    {
      responseType: 'appl' //二进制流,
    }
  )
}
//批量删除组织用户
let delMoreUser = function(params) {
  return $http
    .delete(urls.delMoreUser, { data: params })
    .then(({ data }) => {
      return data
    })
}
let updateMoreModifyStatus = function(params) {
  return $http
    .put(urls.updateMoreModifyStatus, params)
    .then(({ data }) => {
      return data
    })
}
// 更新用户
let updateUserInfo = function(params) {
  return $http
    .put(urls.updateUserInfo, params)
    .then(({ data }) => {
      return data
    })
}
let exportVideo = function(data) {
  return $http
    .get(
      urls.exportVideo + '?' + `recordId=${data.recordId}`,
      {
        headers: { 'Content-Type': 'application/json' },
        responseType: 'blob' //二进制流,
      }
    )
    .then(({ data }) => {
      return data
    })
}
//用户导出
let exportOrgUser = function(data) {
  return $http
    .get(urls.exportOrgUser + '?' + QS.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'blob' //二进制流,
    })
    .then(({ data }) => {
      return data
    })
}
// 故障填报提交
let getGuZhangShenBao = function(params) {
  return $http
    .get(
      urls.getGuZhangShenBao +
        '?' +
        `cameraNum=${params.cameraNum}` +
        '&' +
        `reportUserCode=${params.reportUserCode}` +
        '&' +
        `cameraStatus=${params.cameraStatus}` +
        '&' +
        `malfunctionType=${params.malfunctionType}` +
        '&' +
        `malfunctionData=${params.malfunctionData}`
    )
    .then(({ data }) => {
      return data
    })
}
// 摄像机借阅-驳回
let SheXiangJiJieYue = function(params) {
  this.$http
    .put(SheXiangJiJieYue, this.neirong)
    .then(response => {
      console.log(response)
    })
}

// 开放统计
let findCameraAndPlayRecord = function(data) {
  //摄像机数和播放记录
  return $http
    .get(
      urls.findCameraAndPlayRecord + '?' + `appId=${data}`
    )
    .then(({ data }) => {
      return data
    })
}
let appWeekVideoPlayRecordCount = function(data) {
  //周播放记录
  return $http
    .get(
      urls.appWeekVideoPlayRecordCount +
        '?' +
        `appId=${data}`
    )
    .then(({ data }) => {
      return data
    })
}
let videoPlayRecordCount = function(data) {
  //视频播放记录
  return $http
    .get(urls.videoPlayRecordCount + '?' + `appId=${data}`)
    .then(({ data }) => {
      return data
    })
}
/**
 * 获取接口日志
 * @param {*} data
 */
let getInterfaceLogList = function(data) {
  return $http
    .get(urls.getInterfaceLogList + QS.stringify(data))
    .then(({ statusText, data }) => {
      return data
    })
}
/**
 * 获取操作日志
 */
let getOperationLogList = function(data) {
  return $http
    .get(
      urls.getOperationLogList + '?' + QS.stringify(data)
    )
    .then(({ data }) => {
      return data
    })
}
/**
 * 获取行为审计列表
 */
let getActionLog = function(data) {
  return $http
    .get(urls.getActionLog + '?' + QS.stringify(data))
    .then(({ data }) => {
      return data
    })
}
/**
 * 获取视频流状态日志
 */
let getStreamLog = function(data) {
  return $http
    .get(urls.getStreamLog + '?' + QS.stringify(data))
    .then(({ data }) => {
      return data
    })
}
/**
 * 导出行为审计
 */
let exportActionLog = function(data) {
  return $http
    .get(urls.exportActionLog + '?' + QS.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'blob' //二进制流,
    })
    .then(({ data }) => {
      return data
    })
}

/**
 * //新增机构
 */
let addExternaOrganization = function(data) {
  return $http
    .post(urls.addExternaOrganization, data)
    .then(({ data }) => {
      return data
    })
}
/**
 * //根据id删除
 */
let deleteExternaOrganization = function(data) {
  return $http
    .delete(urls.deleteExternaOrganization, { data: data })
    .then(({ data }) => {
      return data
    })
}

/**
 * 获取组织机构列表
 */
let getExternalOrganizationList = function(data) {
  return $http
    .get(
      urls.getExternalOrganizationList +
        '?' +
        QS.stringify(data)
    )
    .then(({ data }) => {
      return data
    })
}

/**
 * 修改外部机构
 */
let updateExternalOrganization = function(data) {
  return $http
    .post(
      urls.updateExternalOrganization + data.id,
      data.data
    )
    .then(({ data }) => {
      return data
    })
}

/**
 * 创建外部用户
 */
let createExternalUser = function(data) {
  return $http
    .post(urls.createExternalUser, data)
    .then(({ data }) => {
      return data
    })
}
/**
 * 删除外部用户
 */
let deleteExternalUser = function(data) {
  return $http
    .delete(urls.deleteExternalUser, { data: data })
    .then(({ data }) => {
      return data
    })
}

/**
 * 获取外部用户列表
 */
let getExternalUserList = function(data) {
  return $http
    .get(
      urls.getExternalUserList + '?' + QS.stringify(data)
    )
    .then(({ data }) => {
      return data
    })
}

/**
 * 更新外部用户
 */
let updateExternalUser = function(data) {
  return $http
    .post(urls.updateExternalUser + data.id, data.data)
    .then(({ data }) => {
      return data
    })
}

/**
 * 获取运维报告详情
 */
let queryCameraReportGroupDetail = function(params) {
  return $http
    .get(
      urls.queryCameraReportGroupDetail +
        params.type +
        '/allgroup' +
        '?' +
        QS.stringify(params.data)
    )
    .then(({ data }) => {
      return data
    })
}

/**
 * 获取运维报告列表
 */
let queryCameraReportList = function(params) {
  return $http
    .post(
      urls.queryCameraReportList + params.type + '/list',
      params.data
    )
    .then(({ data }) => {
      return data
    })
}

/**
 * 获取摄像机接入列表
 */
let queryCameraAccessList = function(params) {
  return $http
    .get(
      urls.queryCameraAccessList +
        params.type +
        '/group' +
        '?' +
        QS.stringify(params.data)
    )
    .then(({ data }) => {
      return data
    })
}

// 导出运维报告
let exportCameraReportList = function(params) {
  return $http
    .get(
      urls.exportCameraReportList +
        params.type +
        '/export' +
        '?' +
        QS.stringify(params.data),
      {
        responseType: 'blob'
      }
    )
    .then(({ data }) => {
      return data
    })
}
/**
 * cq获取摄像机接入列表
 */
let queryCqCameraAccessList = function(params) {
  return $http
    .get(
      urls.queryCqCameraAccessList +
        params.type +
        '/cqGroup' +
        '?' +
        QS.stringify(params.data)
    )
    .then(({ data }) => {
      return data
    })
}
// 导出运维报告
let exportCqCameraReportList = function(params) {
  return $http
    .get(
      urls.exportCqCameraReportList +
        params.type +
        '/cqExport' +
        '?' +
        QS.stringify(params.data),
      {
        responseType: 'blob'
      }
    )
    .then(({ data }) => {
      return data
    })
}

/**
 * 导出操作日志
 */
let exportOperateLog = function(data) {
  return $http
    .get(urls.exportOperateLog + '?' + QS.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'blob' //二进制流,
    })
    .then(({ data }) => {
      return data
    })
}
let cloudVideoPlay = function(params) {
  return $http
    .put(urls.cloudVideoPlay, params, {
      headers: {
        'Content-Type': 'video/mp4',
        'x-oss-meta-author': 'aliy' // Date: "1590045279",
      }
    })
    .then(({ data }) => {
      return data
    })
}
let uploadCloudVideo = function(params) {
  return $http
    .get(urls.uploadCloudVideo + '?' + QS.stringify(params))
    .then(({ data }) => {
      return data
    })
}
let settleVideo = function(params) {
  return $http
    .get(urls.settleVideo + '?' + QS.stringify(params))
    .then(({ data }) => {
      return data
    })
}
let getCloudVideoList = function(params, obj) {
  return $http
    .post(
      urls.getCloudVideoList + '?' + QS.stringify(params),
      obj
    )
    .then(({ data }) => {
      return data
    })
}
let getVideoDetail = function(params) {
  return $http
    .get(urls.getVideoDetail + params)
    .then(({ data }) => {
      return data
    })
}
let getPositionLat = function(params) {
  return $http
    .get(urls.getPositionLat + '?' + QS.stringify(params))
    .then(({ data }) => {
      return data
    })
}
let getPositionLatNew = function(params) {
  return $http
    .post(urls.getPositionLatNew, params)
    .then(({ data }) => {
      return data
    })
}

//摄像机复位
let getResetCameraPosition = function(params) {
  return $http
    .get(
      urls.getResetCameraPosition +
        '?' +
        QS.stringify(params)
    )
    .then(({ data }) => {
      return data
    })
}
//道路全线复位
// let resetCameraPositionByRoadId = function(params) {
//   return $http.post(urls.resetCameraPositionByRoadId, params).then(({ data }) => {
//     return data;
//   });
// };
let resetCameraPositionByRoadId = function(params) {
  return $http
    .post(
      urls.resetCameraPositionByRoadId +
        '?' +
        QS.stringify(params)
    )
    .then(({ data }) => {
      return data
    })
}
//手动更新摄像机经纬度
let updateLonAndLat = function(params) {
  return $http
    .post(urls.updateLonAndLat, params)
    .then(({ data }) => {
      return data
    })
}
//手动更新摄像机桩号
let updateCameraMileage = function(params) {
  return $http
    .post(urls.updateCameraMileage, params)
    .then(({ data }) => {
      return data
    })
}
//手动更新摄像机图层
let updateMapLevelStart = function(params) {
  return $http
    .post(urls.updateMapLevelStart, params)
    .then(({ data }) => {
      return data
    })
}

//更新摄像机类别
let updateCamera = function(params) {
  return $http
    .post(urls.updateCamera, params)
    .then(({ data }) => {
      return data
    })
}

// 运维报告

let getOperationInfo = function(data) {
  return $http
    .get(
      `${urls.getOperationInfo}/${data.report_type}/${data.report_id}`
    )
    .then(({ data }) => {
      return data
    })
}
// 运维报告日报列表
let getListDayReport = function(params) {
  return $http
    .get(urls.getListDayReport + '?' + QS.stringify(params))
    .then(({ data }) => {
      return data
    })
}

// 查询日报各路公司信息增预案
let getDayDepartment = function(params) {
  return $http
    .get(urls.getDayDepartment + '?' + QS.stringify(params))
    .then(({ data }) => {
      return data
    })
}

// 查询日报所涉及路公司在线率排名信息
let getDayDepartmentRate = function(params) {
  return $http
    .get(
      urls.getDayDepartmentRate + '?' + QS.stringify(params)
    )
    .then(({ data }) => {
      return data
    })
}

// 查询日报扩展信息
let getDayExtReport = function(params) {
  return $http
    .get(urls.getDayExtReport + '?' + QS.stringify(params))
    .then(({ data }) => {
      return data
    })
}

// 查询日报各路公司信息
let getDayExtRoadReport = function(params) {
  return $http
    .get(
      urls.getDayExtRoadReport + '?' + QS.stringify(params)
    )
    .then(({ data }) => {
      return data
    })
}

// 查询月报当前接入统计
let getMonthCurrentStat = function(params) {
  return $http
    .get(
      urls.getMonthCurrentStat + '?' + QS.stringify(params)
    )
    .then(({ data }) => {
      return data
    })
}

// /查询月报所涉及各路公司信息
let getMonthDepartment = function(params) {
  return $http
    .get(
      urls.getMonthDepartment + '?' + QS.stringify(params)
    )
    .then(({ data }) => {
      return data
    })
}

// 查询月报所涉及到路公司在线排名信息
let getMonthDepartmentRate = function(params) {
  return $http
    .get(
      urls.getMonthDepartmentRate +
        '?' +
        QS.stringify(params)
    )
    .then(({ data }) => {
      return data
    })
}

// 查询月报扩展信息
let getMonthExtReport = function(params) {
  return $http
    .get(
      urls.getMonthExtReport + '?' + QS.stringify(params)
    )
    .then(({ data }) => {
      return data
    })
}

// 查询月报所涉及到路线信息
let getMonthExtRoadReport = function(params) {
  return $http
    .get(
      urls.getMonthExtRoadReport +
        '?' +
        QS.stringify(params)
    )
    .then(({ data }) => {
      return data
    })
}

// 查询月报平均在线率、离线率、异常率
let getMonthLine = function(params) {
  return $http
    .get(urls.getMonthLine + '?' + QS.stringify(params))
    .then(({ data }) => {
      return data
    })
}

// 查询月报信息
let getMonthReport = function(params) {
  return $http
    .get(urls.getMonthReport + '?' + QS.stringify(params))
    .then(({ data }) => {
      return data
    })
}

// 查询周报当前接入统计
let getWeekCurrentStat = function(params) {
  return $http
    .get(
      urls.getWeekCurrentStat + '?' + QS.stringify(params)
    )
    .then(({ data }) => {
      return data
    })
}

// 查询周报所涉及各路公司信息
let getWeekDepartment = function(params) {
  return $http
    .get(
      urls.getWeekDepartment + '?' + QS.stringify(params)
    )
    .then(({ data }) => {
      return data
    })
}

// 查询周报所涉及路公司在线排名信息
let getWeekDepartmentRate = function(params) {
  return $http
    .get(
      urls.getWeekDepartmentRate +
        '?' +
        QS.stringify(params)
    )
    .then(({ data }) => {
      return data
    })
}

// 查询周报扩展信息
let getWeekExtReport = function(params) {
  return $http
    .get(urls.getWeekExtReport + '?' + QS.stringify(params))
    .then(({ data }) => {
      return data
    })
}

// 查询周报所涉及到路线信息
let getWeekExtRoadReport = function(params) {
  return $http
    .get(
      urls.getWeekExtRoadReport + '?' + QS.stringify(params)
    )
    .then(({ data }) => {
      return data
    })
}

// 查询本周平均在线率、离线率、异常率
let getWeekLine = function(params) {
  return $http
    .get(urls.getWeekLine + '?' + QS.stringify(params))
    .then(({ data }) => {
      return data
    })
}

// 查询周报信息
let getWeekReport = function(params) {
  return $http
    .get(urls.getWeekReport + '?' + QS.stringify(params))
    .then(({ data }) => {
      return data
    })
}

// 导出日报信息
let exportDayDetail = function(params) {
  return $http
    .get(urls.exportDayDetail + '/' + params.reportId, {
      responseType: 'blob'
    })
    .then(({ data }) => {
      return data
    })
}

// 导出周报信息
let exportWeekDetail = function(params) {
  return $http
    .get(urls.exportWeekDetail + '/' + params.reportId, {
      responseType: 'blob'
    })
    .then(({ data }) => {
      return data
    })
}

// 导出月报信息
let exportMonthDetail = function(params) {
  return $http
    .get(urls.exportMonthDetail + '/' + params.reportId, {
      responseType: 'blob'
    })
    .then(({ data }) => {
      return data
    })
}

// let authorizationCallManagement = function (data) {
//   return $http
//     .get(`${urls.authorizationCallManagement}/${data.api_id}?flag=${data.flag}`)
//     .then(({ data }) => {
//       return data;
//     });
// };
let getReportList = function(data) {
  return $http
    .get(
      `${urls.getReportList}/${data.reportType}?currPage=${data.currPage}&pageSize=${data.pageSize}&startDate=${data.startDate}&endDate=${data.endDate}&organizationType=${data.organizationType}&organizationId=${data.organizationId}`
    )
    .then(({ data }) => {
      return data
    })
}
let getSelectWeekList = function(data) {
  return $http
    .get(urls.getSelectWeekList + '?' + QS.stringify(data))
    .then(({ data }) => {
      return data
    })
}
// let submitReject = (params) => {
//   return $http
//     .put(urls.submitReject + params.id, params)
//     .then(({ data }) => {
//       return data;
//     });
// };
/**
 * 修改开放api接口
 * @param data
 * @returns {*}
 */
let submitReject = function(data) {
  return $http
    .put(urls.submitReject + data.borrowId, {
      auditRejectReason: data.borrowAuditRejectReq
    })
    .then(({ data }) => {
      return data
    })
}

/**
 * 获取上级平台的详情
 * @param {} data
 */
let querySuppPlatform = function(data) {
  return $http
    .get(urls.querySuppPlatform, data)
    .then(({ data }) => {
      return data
    })
}
/**
 * 保存上级平台的详情
 * @param {} data
 */
let saveSuppPlatform = function(data) {
  var str = 'organizationId=9901'
  for (var k in data) {
    str += '&' + k + '=' + data[k]
  }
  return $http
    .post(urls.saveSuppPlatform + '?' + str, data)
    .then(({ data }) => {
      return data
    })
}
/**
 * 摄像机上报的接口
 * @param {*} data
 */
let reportBatchCamera = function(data) {
  return $http
    .post(urls.reportBatchCamera, data)
    .then(({ data }) => {
      return data
    })
}
/**
 * 摄像机上报的接口
 * @param {*} data
 */
let cancelReportBatchCamera = function(data) {
  return $http
    .post(urls.cancelReportBatchCamera, data)
    .then(({ data }) => {
      return data
    })
}
//省账号
/**
 *
 * @param {data} data
 * 获取首页摄像机以及摄像机点位
 */
let queryReginHomeCamera = function(data) {
  return $http
    .get(
      urls.queryReginHomeCamera + '?' + QS.stringify(data)
    )
    .then(({ data }) => {
      return data
    })
}
/**
 * 获取首页左侧的统计值
 */
let queryHomeLeftList = function(data) {
  return $http
    .get(urls.queryHomeList + '?' + QS.stringify(data))
    .then(({ data }) => {
      return data
    })
}

/**
 * 获取首页右侧的在线统计值
 */
let queryHomePieData = function(data) {
  return $http
    .get(urls.queryHomePieData + '?' + QS.stringify(data))
    .then(({ data }) => {
      return data
    })
}
/**
 *
 */
let queryHomeRightCompany = function(data) {
  return $http
    .get(
      urls.queryHomeRightCompany + '?' + QS.stringify(data)
    )
    .then(({ data }) => {
      return data
    })
}

let queryHomeRightRoad = function(data) {
  return $http
    .get(urls.queryHomeRightRoad + '?' + QS.stringify(data))
    .then(({ data }) => {
      return data
    })
}

let getOssAuthInfo = function(data) {
  return $http
    .get(urls.getOssAuthInfo + '?' + QS.stringify(data))
    .then(({ data }) => {
      return data
    })
}

let downLoadOssAuthInfo = function(data) {
  return $http
    .get(urls.downLoadOssAuthInfo + '/' + data.borrowId)
    .then(({ data }) => {
      return data
    })
}

let addBorrowApply = function(data) {
  return $http
    .post(urls.addBorrowApply, data)
    .then(({ data }) => {
      return data
    })
}
let repeatBorrowApply = function(data) {
  return $http
    .put(urls.repeatBorrowApply + data.borrowId, data)
    .then(({ data }) => {
      return data
    })
}
let reUploadBorrowFile = function(data) {
  return $http
    .put(
      urls.reUploadBorrowFile + '/' + data.borrowId,
      data
    )
    .then(({ data }) => {
      return data
    })
}
/** 新增云录像记录*/
let addCloudVideoRecord = function(data) {
  return $http
    .post(urls.addCloudVideoRecord, data)
    .then(({ data }) => {
      return data
    })
}
let downOssFile = function(data) {
  return $http
    .get(
      urls.downOssFile +
        '/' +
        data.borrowId +
        '?' +
        QS.stringify({
          ossId: data.ossId
        })
    )
    .then(({ data }) => {
      return data
    })
}
let uploadImgs = function(params) {
  return $http
    .post(urls.uploadImgs, params)
    .then(({ data }) => {
      return data
    })
}

// 获取地图服务区点数据
const getServiceAreaPots = params =>
  $http
    .get(
      `/device/cameras/selectServiceArea?${QS.stringify(
        params
      )}`
    )
    .then(({ data }) => data)

// 获取地图收费站点数据
const getTollStationPots = params =>
  $http
    .get(
      `/device/cameras/selectTollStation?${QS.stringify(
        params
      )}`
    )
    .then(({ data }) => data)
const requestLoginEncrypt = function(params) {
  return $http
    .post('/user/auth/loging', params)
    .then(({ data }) => {
      return data
    })
}
const getPubKey = function() {
  return $http
    .get('/user/auth/publicKey')
    .then(({ data }) => {
      return data
    })
}
// 获取码率配置
const getBitrateConfig = () =>
  $http.get(`/bitrateConfig`).then(({ data }) => data)

// 获取流媒体配置（{ transcodingId: String }）
const getStreamMediaConfig = params =>
  $http
    .get(
      `/device/transcodings/getConfigStreamMedia?${QS.stringify(
        params
      )}`
    )
    .then(({ data }) => data)

// 配置流媒体（{ streamBitrate: Array, transcodingId: String }）
const configureStreamMedia = params =>
  $http
    .post('/device/transcodings/configStreamMedia', params)
    .then(({ data }) => data)

export default {
  captchaLogin,
  queryQualityCount,
  queryQualityList,
  exportQuality,
  downOssFile,
  reUploadBorrowFile,
  repeatBorrowApply,
  addBorrowApply,
  downLoadOssAuthInfo,
  getOssAuthInfo,
  queryHomeRightCompany,
  queryHomeRightRoad,
  queryHomePieData,
  cancelReportBatchCamera,
  reportBatchCamera,
  querySuppPlatform,
  saveSuppPlatform,
  queryReginHomeCamera,
  queryHomeLeftList,
  queryUserCamera,
  getPositionLatNew,
  getCameraDetails, //摄像机详情
  getDeviceList,
  getPositionLat,
  getVideoDetail,
  getCloudVideoList,
  settleVideo,
  uploadCloudVideo,
  cloudVideoPlay,
  videoPlayRecordCount,
  appWeekVideoPlayRecordCount,
  findCameraAndPlayRecord,
  exportOrgUser,
  getOrgUserInfo,
  updateUserInfo,
  updateMoreModifyStatus,
  addOrgUser,
  delMoreUser,
  delUserOrganization,
  updateUserOrganization,
  AddOrganizationList,
  getUserOrganization,
  getCountUserOrganization,
  getCameraCount,
  getTemporaryList,
  getConfirm,
  getTemporaryConfirm,
  getTemporaryPass,
  getTemporaryPassCount,
  getCameraStatus,
  getExportTemporary,
  getExportTemporaryPass,
  getCameraBindList,
  getIdent,
  phoneRequest,
  addPlan,
  delPlan,
  delPlanCamera,
  modifyCameraOrder,
  modifyPlan,
  getPlanList,
  queryCamerasByPlanId,
  queryGroupsByPlanId,
  querySelectedCamera,
  querySelectedAllCamera,
  CameraBind,
  addNewKey,
  updateKeys,
  updateKeyStatus,
  getKeyReset,
  cameraList,
  bindPurview,
  requestLogin,
  bindCameraData,
  findBindPurvie,
  changePwd,
  getOrgTree,
  getSysUserByOrg,
  getUserRolesByUserId,
  editUserRole,
  addOrganization,
  bindRoadToOrganization,
  getBindRoadsByOrganization,
  delOrganization,
  updateOrganization,
  getCamerafresh,
  getTranscodingList,
  getTranscodingCameraList,
  getJournalLogList,
  getDownPlatformJournalList,
  getUpperPlatformJournalList,
  exportTranscodingList,
  addTranscoding,
  editTranscoding,
  deleteTranscoding,
  checkTranscoding,
  getCameraRemainder,
  downTranscodingTemplate,
  uploadPublicKey,
  uploadPrivateKey,
  updateOpenStatus,
  updatePlayStatus,
  exportAccessorInfo,
  exportPlatAccessorInfo,
  importPlatForm,
  exportPlatFormModel,
  getCameraList,
  exportCameraList,
  addCamera,
  editCamera,
  checkCameraName,
  deleteCamera,
  deleteBatchCamera,
  downCameraTemplate,
  updateOpStatus,
  authUpdateControl,
  batchUpdateOpen,
  batchUpdateDisplay,
  updateStreamStatus,

  getDeviceStatistics,
  postCameraListForPot,
  cancelPostCameraListForPot,
  getCameraListForStatis,

  getTemporaryCameraList,

  // comfirmCamera,
  //摄像机组管理
  getDeviceGroupList,
  addDeviceList,
  getSelectdRole,
  getSelectedUser,
  updateDeviceList,
  upDateRelationUser,
  getAllGroupList,
  getDeviceCameraList,
  addDeviceGroup,
  deleteDeviceGroup,
  openOrStopDevice,
  getDeviceCamera,
  addDev,
  getDeviceDetailuser,
  checkDev,
  checkUser,
  checkDeviceGroup,
  delGroupDev,
  delGroupUser,
  getGroupCameraList,
  getGroupUserList,
  exportGroupList,

  getPowerList,
  getRoleList,
  addPower,
  addRole,
  editPower,
  editPowerState,
  editRole,
  editRoleStateMore,
  deleteRole,
  roleAddPower,
  addUserRole,
  roleDelPower,
  getRoleUser,
  getUserDetail,
  checkRoleName,

  getRegion,
  getOrg,
  getOrgTop,
  getCodemaster,
  getCloudSecret,
  getRoad,
  getRoadsByOrgId,
  getProvince,

  getRoadList,
  getRoadInfo,
  addRoadInfo,
  deleteRoadInfo,
  editRoadInfo,

  findFuncByRole,
  getChoseListByAllRole,

  getDevicePlatformList,
  addDevicePlatform,
  updateDevicePlatform,
  updateOpenPlatform,
  updateApperPlatform,
  updateApperPlatform,
  delDevicePlatform,
  getPlatFormDetails,
  exportPlatformKey,
  exportPlatformToken,
  resetDevicePlatform,
  checkDevicePlatformStatus,
  getaccInfo,
  uploadPlatformPrivateKey,

  getCameraBrowsePages,
  getCameraApplyPages,
  postCameraBrowseApply,
  postCameraBrowseVerify,

  getAllCameraRunStatistics,
  getAllCameraAbnormalStatistics,
  getAllCameraAbnormalList,
  getDashboardCountData,
  getDashboardAccessData,

  getCameraRunStatistic,
  exportCameraRunStatistic,
  getCameraFaultStatistic,
  exportCameraFaultStatistic,
  getCameraVisitStatistic,
  exportCameraVisitStatistic,

  getStreamMediaList,
  getStreamMediaInfo,
  getStreamMediaTranscodingList,
  addStreamMedia,
  updateStreamMedia,
  deleteStreamMedia,
  bindStreamMedia,

  getCameraPlayUrl,
  getCameraSnapShots,
  maplevelInitialize,
  getMessagePages,
  getReportDailyInfo,
  putMessageStatus,
  userAddRole,
  editUserById,
  userAccountCheck,
  getCallManagement,
  addCallManagement,
  editCallManagement,
  authorizationCallManagement,
  authorizationCall,
  relieveCall,
  deleteCallManage,
  enableApi,
  prohibitApi,
  getBorrowing,
  getBorrowTree,
  getCameraData,
  getGatewayInfo,
  getGatewayCameraList,
  getvideoStreamStatus,
  cameraYtControl,
  applyBrowse,
  seeCameraMsg,

  getAccesslogByApp,
  getAccesslogByUrl,
  getJoinerlogByApp,
  getJoinerlogByUrl,
  exportAccesslog,
  approvalVerify,

  getTranscoding,
  getVideoCameraData,
  getSelectData,
  getRoadCompany,
  getCities,
  addConfigCam,
  findById,
  delCamerta,
  batchDownload,
  uploadFile,
  getTimeAdjustInfo,
  editTimeAdjustInfo,
  getNetInfo,
  editNetInfo,
  getRoutingInfo,
  addRoutingInfo,
  delRoutingInfo,
  sysRestart,
  addVideoSendOut,
  delVideoSend,
  getTokenInfo,
  updateAuthToken,
  createApp,
  getOpenList,
  updateAppTitle,
  deleteApp,
  getKeyList,

  getInterfaceLogList,
  getOperationLogList,
  exportOperateLog,
  getNewToken,
  getCameraVideo,
  getImgList,
  getImgStatistics,
  getImgStatisticsClassify,
  delCamera,
  exportVideo,
  delImg,
  getReportList, //运维报告列表
  getOperationInfo, //运维报告详情
  getBorrowList,
  submitReject,
  videoPlayRecord,
  batchDownloadImages,
  getBorrowApplyList,
  // getRecentDaysList,
  getBorrowCamerasList,
  chooseCameraIds,
  cancelChooseCameraIds,
  getMalfunctionReportList,
  getMalfunctionReportAdd,
  getGuZhangShenBao,
  SheXiangJiJieYue,
  // getMalfunctionReportAdd,
  CamerasForAudit,
  camerasChoose,
  provinceTree,
  delCamerasChoose,
  auditAgree,
  revokeBorrow,
  exportCameraListInfo,
  exportCameraListAll,
  exportSnapshotList,
  getConfigContent,
  addCloudVideoRecord,
  playCount,
  getActionLog,
  exportActionLog,

  // 外部机构
  addExternaOrganization,
  deleteExternaOrganization,
  getExternalOrganizationList,
  updateExternalOrganization,
  // 外部用户
  createExternalUser,
  deleteExternalUser,
  getExternalUserList,
  updateExternalUser,
  // 运维报告
  queryCameraReportGroupDetail,
  queryCameraReportList,

  // 运维报告
  getListDayReport,
  getDayDepartment,
  getDayDepartmentRate,
  getDayExtReport,
  getDayExtRoadReport,
  getMonthCurrentStat,
  getMonthDepartment,
  getMonthDepartmentRate,
  getMonthExtReport,
  getMonthExtRoadReport,
  getMonthLine,
  getMonthReport,
  getWeekCurrentStat,
  getWeekDepartment,
  getWeekDepartmentRate,
  getWeekExtReport,
  getWeekExtRoadReport,
  getWeekLine,
  getWeekReport,
  getStreamLog,

  // 调取统计相关接口
  getCountDaily,
  getSourceStatistics,
  getRegionStatistics,
  getPlayRecordList,
  exportPlayRecord,

  exportDayDetail,
  exportWeekDetail,
  exportMonthDetail,
  getMessageList,
  uploadImgs,
  getOrgCompany,
  updateOrganizations,
  exportErrorList,
  requestLogin2,
  eventList,
  eventType,
  eventDownload,
  //摄像机接入
  queryCameraAccessList,
  queryCqCameraAccessList,
  exportCameraReportList,
  exportCqCameraReportList,
  createReporting,
  submitReporting,
  selectedGroups,
  deleteUnbindGroups,
  changeModifyPwd,
  getSelectWeekList,
  getMileageList,
  //首页摄像机点信息编辑
  getResetCameraPosition,
  updateCameraMileage,
  updateMapLevelStart,
  updateLonAndLat,
  updateCamera,
  resetCameraPositionByRoadId,

  getServiceAreaPots,
  getTollStationPots,
  requestLoginEncrypt, //登录
  getPubKey,
  getBitrateConfig, // 获取码率配置
  getStreamMediaConfig, // 获取流媒体配置
  configureStreamMedia, // 配置流媒体
}
