import Vue from 'vue'
import Vuex from 'vuex'
import api from './api'

import login from './stores/Login.js'
import mapPage from './stores/MapPage.js'
import transcoding from './stores/DeviceTranscoding.js'
import camera from './stores/DeviceCamera.js'
import deviceGroup from './stores/DeviceGroup.js'
import playback from './stores/VideoPlayback.js'
//import application from './stores/PlatformApply.js'
import examine from './stores/PlatformExamine.js'

import roleList from './stores/SystemRoleList.js'
import powerList from './stores/SystemPowerList.js'
import sysUser from './stores/SystemUserList.js'
import devicePlatform from './stores/DevicePlatform.js'
import platformApply from './stores/PlatformApply'

import deviceStatistics from './stores/DeviceStatistics'
import streamMedia from './stores/StreamMedia'
import message from './stores/Message'

import callManagement from './stores/CallManagement'
import accesslogByApp from './stores/AccesslogByApp'
import accesslogByUrl from './stores/AccesslogByUrl'
import joinerlogByApp from './stores/JoinerlogByApp'
import joinerlogByUrl from './stores/JoinerlogByUrl'
import borrowing from './stores/Borrowing'
import gateway from './stores/VideoGateway'
import cameraDetails from './stores/CameraDetails'
import userGroup from './stores/UserGroup'
import organization from './stores/Organization'
import road from './stores/Road'
import dashboard from './stores/Dashboard'
import ossConfig from './stores/ossConfig'
import poles from '@/stores/poles' // 首页地图 桩
import areaTypes from '@/stores/areaTypes' // 首页地图 区域类型对应点
import md5 from 'js-md5'

Vue.use(Vuex)

let v = new Vue() //新创建一个vue实例
let successCode = 200
const isNbtd = process.env.VUE_APP_TARGET === 'nbtd' // 南部通道(开发兼生产环境)

if (!isNbtd) {
  // 临时写死用户信息
  const userInfoJSON =
    '{"account":"admin","Authorization":"eyJhbGciOiJIUzI1NiJ9.eyJvcmdhbml6YXRpb25JZCI6Ijk5MDEiLCJvcmdhbml6YXRpb25UeXBlIjoiOTkiLCJvcmdhbml6YXRpb25OYW1lIjoi5Lqk6YCa6L-Q6L6T6YOoIiwibG9naW5OYW1lIjoiYWRtaW4iLCJ1c2VyTmFtZSI6ImFkbWluIiwidXNlcklkIjoiMTAwMDAwMDAwNTMiLCJ1dWlkIjoiYTdlMjI1ODgtNGZmOC00YWVmLWIxZjAtZGM1Mjg3NGM0MGM3IiwiZXhwIjoxNjI3NzU1MzUwfQ.pmAwAubz9pEfG3N2Yl0rB_xm_eyTEX1vA8m7SUnQFHw","refreshToken":"eyJhbGciOiJIUzI1NiJ9.eyJvcmdhbml6YXRpb25JZCI6Ijk5MDEiLCJvcmdhbml6YXRpb25UeXBlIjoiOTkiLCJvcmdhbml6YXRpb25OYW1lIjoi5Lqk6YCa6L-Q6L6T6YOoIiwibG9naW5OYW1lIjoiYWRtaW4iLCJ1c2VyTmFtZSI6ImFkbWluIiwidXNlcklkIjoiMTAwMDAwMDAwNTMiLCJ1dWlkIjoiYTdlMjI1ODgtNGZmOC00YWVmLWIxZjAtZGM1Mjg3NGM0MGM3IiwiZXhwIjoxNjI3NzU1MzUwfQ.pmAwAubz9pEfG3N2Yl0rB_xm_eyTEX1vA8m7SUnQFHw","checkPass":"gdkjgdkj!","userName":"admins","userType":"3","organizationId":"9901","regionName":"全国","regionCode":100000,"organizationName":"交通运输部","organizationType":"99","userId":"10000000053","role":"100000001","source":"1","loginTime":"2021-06-24 14:15:50"}'
  localStorage.setItem('cloudplatform', userInfoJSON)

  const cloudsysinfoJSON =
    '{"logoUrl":"https://hngssnapshot.obs.cn-north-4.myhuaweicloud.com:443/20210617%2F65987e6112d6437bbaf65e0623cf1222.jpg","platformName":"视频中台3.3"}'
  localStorage.setItem('cloudsysinfo', cloudsysinfoJSON)

  
}
const xxx =
    '{"data":[{"id":"109311","label":"资源管理","functionType":"10","functionUrl":"","modelId":11,"parentCode":"1093","showText":"","status":"1","subId":93,"sysId":10,"children":[{"id":"109320","label":"摄像机管理","functionType":"10","functionUrl":"/deviceCameraManage","modelId":20,"parentCode":"109311","showText":"r","status":"1","subId":93,"sysId":10,"isLeaf":true},{"id":"109321","label":"对接管理","functionType":"10","functionUrl":"/deviceTranscodingManage","modelId":27,"parentCode":"109311","showText":"","status":"1","subId":93,"sysId":10,"isLeaf":true},{"id":"109322","label":"开放管理","functionType":"10","functionUrl":"/openManage","modelId":22,"parentCode":"109311","showText":"","status":"1","subId":93,"sysId":10,"isLeaf":true},{"id":"109323","label":"流媒体管理","functionType":"10","functionUrl":"/streamMediaManage","modelId":23,"parentCode":"109311","showText":"","status":"1","subId":93,"sysId":10,"isLeaf":true}],"hasChildren":true},{"id":"109313","label":"数据统计","functionType":"10","functionUrl":"/statistics","modelId":13,"parentCode":"1093","showText":"","status":"1","subId":93,"sysId":10,"children":[{"id":"109332","label":"摄像机统计","functionType":"10","functionUrl":"/cameraStatistics","modelId":13,"parentCode":"109313","showText":"/sta/online/runInfo","status":"1","subId":93,"sysId":10,"isLeaf":true},{"id":"109333","label":"异常统计","functionType":"10","functionUrl":"/AbnormalStatistics","modelId":13,"parentCode":"109313","showText":"/sta/error/errorInfo","status":"1","subId":93,"sysId":10,"isLeaf":true},{"id":"109334","label":"开放统计","functionType":"10","functionUrl":"/openStatistics","modelId":13,"parentCode":"109313","showText":"/sta/oc/appWeekVideoPlayRecordCo","status":"1","subId":93,"sysId":10,"isLeaf":true},{"id":"109351","label":"调取统计","functionType":"10","functionUrl":"/transferStatistics","modelId":51,"parentCode":"109313","showText":"/sta/playRecord/countDaily","status":"1","subId":93,"sysId":10,"isLeaf":true}],"hasChildren":true},{"id":"109314","label":"图像管理","functionType":"10","functionUrl":"","modelId":14,"parentCode":"1093","showText":"","status":"1","subId":93,"sysId":10,"children":[{"id":"109335","label":"截图管理","functionType":"10","functionUrl":"/screenshotManagement","modelId":14,"parentCode":"109314","showText":"","status":"1","subId":93,"sysId":10,"isLeaf":true},{"id":"109347","label":"图像质量检测","functionType":"10","functionUrl":"/imageDetection","modelId":47,"parentCode":"109314","showText":"/device/cameraState/quality-status-count","status":"1","subId":93,"sysId":10,"isLeaf":true},{"id":"109356","label":"事件分析","functionType":"10","functionUrl":"/eventAnalysis","modelId":56,"parentCode":"109314","showText":"/base/event-cq/list","status":"1","subId":93,"sysId":10,"isLeaf":true}],"hasChildren":true},{"id":"109315","label":"日志管理","functionType":"10","functionUrl":"/logManage","modelId":15,"parentCode":"1093","showText":"","status":"1","subId":93,"sysId":10,"children":[{"id":"109337","label":"操作日志","functionType":"10","functionUrl":"/operationLog","modelId":37,"parentCode":"109315","showText":"","status":"1","subId":93,"sysId":10,"isLeaf":true},{"id":"109338","label":"接口日志","functionType":"10","functionUrl":"/interfaceLog","modelId":38,"parentCode":"109315","showText":"/v1/data/opi-logs/list","status":"1","subId":93,"sysId":10,"isLeaf":true},{"id":"109349","label":"行为审计","functionType":"10","functionUrl":"/behaviorAudit","modelId":49,"parentCode":"109315","showText":"/data/action-log/list","status":"1","subId":93,"sysId":10,"isLeaf":true},{"id":"109354","label":"视频流状态日志","functionType":"10","functionUrl":"/streamLog","modelId":54,"parentCode":"109315","showText":"/base/record/videoStream-list","status":"1","subId":93,"sysId":10,"isLeaf":true}],"hasChildren":true},{"id":"109316","label":"系统管理","functionType":"10","functionUrl":"","modelId":16,"parentCode":"1093","showText":"","status":"1","subId":93,"sysId":10,"children":[{"id":"109329","label":"组织与用户","functionType":"10","functionUrl":"/systemUserOrganize","modelId":29,"parentCode":"109316","showText":"/user/list","status":"1","subId":93,"sysId":10,"isLeaf":true},{"id":"109330","label":"角色管理","functionType":"10","functionUrl":"/systemRoleList","modelId":30,"parentCode":"109316","showText":"","status":"1","subId":93,"sysId":10,"isLeaf":true},{"id":"1093309","label":"权限列表","functionType":"10","functionUrl":"/systemPowerList","modelId":30,"parentCode":"109316","showText":"/user/function/tree/","status":"1","subId":93,"sysId":10,"isLeaf":true},{"id":"109331","label":"路线管理","functionType":"10","functionUrl":"/roadManager","modelId":31,"parentCode":"109316","showText":"","status":"1","subId":93,"sysId":10,"isLeaf":true},{"id":"109339","label":"运维报告","functionType":"10","functionUrl":"/systemReportList","modelId":39,"parentCode":"109316","showText":"/sta/report/day/list","status":"1","subId":93,"sysId":10,"isLeaf":true},{"id":"109340","label":"系统设置","functionType":"10","functionUrl":"/styme","modelId":40,"parentCode":"109316","showText":"","status":"1","subId":93,"sysId":10,"children":[{"id":"109344","label":"名称/LOGO","functionType":"10","functionUrl":"","modelId":44,"parentCode":"109340","showText":"/user/logo","status":"1","subId":93,"sysId":10,"isLeaf":true},{"id":"109345","label":"个人信息","functionType":"10","functionUrl":"","modelId":45,"parentCode":"109340","showText":"/user/info","status":"1","subId":93,"sysId":10,"isLeaf":true}],"hasChildren":true}],"hasChildren":true},{"id":"10933610","label":"搜索","functionType":"20","functionUrl":"","modelId":36,"parentCode":"109336","showText":"","status":"1","subId":93,"sysId":10,"isLeaf":true},{"id":"10933611","label":"下载","functionType":"20","functionUrl":"","modelId":36,"parentCode":"109336","showText":"","status":"1","subId":93,"sysId":10,"isLeaf":true},{"id":"10933612","label":"删除","functionType":"20","functionUrl":"","modelId":36,"parentCode":"109336","showText":"","status":"1","subId":93,"sysId":10,"isLeaf":true}],"sign":"9b96a8d4d30d2b1dbfb60340779383f8"}'
  localStorage.setItem('PM_CK_MU', xxx)
export default new Vuex.Store({
  state: {
    userInfo:
      JSON.parse(localStorage.getItem('cloudplatform')) ||
      {}, //用户登录返回信息
    userPermissions: localStorage.getItem('userPermission'),
    roleAddUserFormVisible: false,
    regionList: [], //行政区划列表
    orgList: [], //组织架构列表
    orgTreeData: [], //组织树数据
    classIfyList: [], //所属类型列表
    derectionList: [], //方向列表
    roadList: [], //路段名列表
    provinces: [], //省份信息列表
    positionLat: {}, //经纬度
    vendorList: [], // 设备厂商

    currentPageName: '', //当前页面名称
    navActiveIndex: '', //当前菜单高亮位置
    selectCameraIndex: null,

    systemLogoUrl: '',
    systemName: '',
    UserOrgTree: [],
    UserOrgTreeChild: [],
    ossConfig: undefined
  },

  actions: {
    // 获取组织用户结构
    getUserOrganization(store) {
      return api.getUserOrganization().then(data => {
        if (data?.code != successCode) {
          // v.$message({
          //   message: "获取行政区域失败! [" + data.code + "]: " + data.message,
          //   type: "error",
          // });
          return Promise.reject()
        }
        let UserOrgTreeChild = data.data[0].childList
        //禁止第一级选择
        // _.each(UserOrgTreeChild, it => {
        //   it.disabled = true;
        // })
        store.commit('setUserOrgain', data.data)
        store.commit('setUserOrgainChild', UserOrgTreeChild)
      })
    },

    // 行政区划获取
    getRegion(store, obj) {
      api.getRegion(obj).then(data => {
        if (data?.code != successCode) {
          // v.$message({
          //   message: "获取行政区域失败! [" + data.code + "]: " + data.message,
          //   type: "error",
          // });
          return Promise.reject()
        }

        store.commit('setRegionList', data.data)
      })
      /*.catch((error)=>{
                     v.$message({
                         message: '获取行政区域失败! ['+error.code+']: '+error.message,
                         type: 'error'
                     });
                 })*/
    },

    // 行政区划获取
    getRegionSingle(store, obj) {
      return api.getRegion(obj).then(data => {
        if (data?.code != successCode) {
          // v.$message({
          //   message: "获取行政区域失败! [" + data.code + "]: " + data.message,
          //   type: "error",
          // });
          return Promise.reject()
        }
        return data
        //store.commit("setRegionList",data.data);
      })
      /*.catch((error)=>{
                     v.$message({
                         message: '获取行政区域失败! ['+error.code+']: '+error.message,
                         type: 'error'
                     });
                 })*/
    },

    // 组织架构获取
    getOrg(store) {
      api.getOrg().then(data => {
        if (data?.code != successCode) {
          // v.$message({
          //   message: "获取组织架构失败! [" + data.code + "]: " + data.message,
          //   type: "error",
          // });
          return Promise.reject()
        }
        store.commit('setOrgList', data.data)
      })
      /*.catch((error)=>{
                     v.$message({
                         message: '获取组织架构失败! ['+error.code+']: '+error.message,
                         type: 'error'
                     });
                 })*/
    },
    // 组织架构获取
    getOrgTop(store) {
      api.getOrgTop().then(data => {
        if (data?.code != successCode) {
          v.$message({
            message:
              '获取组织架构失败! [' +
              data.code +
              ']: ' +
              data.message,
            type: 'error'
          })
          return Promise.reject()
        }
        console.log(store)
        // store.commit("setOrgList", data.data);
      })
      /*.catch((error)=>{
                     v.$message({
                         message: '获取组织架构失败! ['+error.code+']: '+error.message,
                         type: 'error'
                     });
                 })*/
    },
    /**
     * 获取角色绑定列表

     */
    getRoleList(store, obj) {
      return api.getRoleList(obj).then(data => {
        //console.log("data=>",data);
        if (data.code != 200) {
          v.$message({
            message:
              '获取角色列表失败! [' +
              data.code +
              ']: ' +
              data.message,
            type: 'error'
          })
          return Promise.reject()
        }
      })
    },

    getOrgTree(store, obj) {
      return api.getOrgTree(obj).then(data => {
        if (data?.code != successCode) {
          // v.$message({
          //   message: "获取组织架构树失败! [" + data.code + "]: " + data.message,
          //   type: "error",
          // });
          return Promise.reject()
        }
        //// console.log('getOrgTree222 ',data);

        /*let list = JSON.parse(JSON.stringify(data.data).replace(/childNode/g, 'children'));
                list=JSON.parse(JSON.stringify(list).replace(/functionDesc/g, 'label'));
                list=JSON.parse(JSON.stringify(list).replace(/functionCode/g, 'id'));
                let newList=v.Utils.reviseTreeData(list);*/

        /*let list = data.data;
                let newList=v.Utils.reviseTreeData(list);*/

        //console.info('setOrgTreeData   ',JSON.stringify(newList));

        store.commit('setOrgTreeData', data.data)
        return data
      })
    },

    // 查询字典项接口
    getCodemaster(store, obj) {
      return api.getCodemaster(obj).then(data => {
        if (data?.code != successCode) {
          // v.$message({
          //   message: "获取字典项失败! [" + data.code + "]: " + data.message,
          //   type: "error",
          // });
          return Promise.reject()
        }
        // console.log("getCodemaster=>",data);
        if (obj.codeType == 'CLASSIFY') {
          store.commit('setClassIfyList', data.data)
        } else if (obj.codeType == 'DERECTION') {
          store.commit('setDerectionList', data.data)
        } else if (obj.codeType == 'VENDOR') {
          store.commit('setVendorList', data.data)
        }
        return data
      })
    },

    // 路名获取
    getRoad(store, obj) {
      // api.getRoad(obj).then((data) => {
      //   if (data?.code != successCode) {
      //     v.$message({
      //       message: "获取路段列表失败! [" + data.code + "]: " + data.message,
      //       type: "error",
      //     });
      //     return Promise.reject();
      //   }
      //   // // console.log("road=>",data);
      //   store.commit("setRoadList", data.data);
      // });
    },

    // 根据组织查路名获取
    getRoadsByOrgId(store, obj) {
      api.getRoadsByOrgId(obj).then(data => {
        if (data.code !== successCode) {
          v.$message({
            message:
              '获取路段列表失败! [' +
              data.code +
              ']: ' +
              data.message,
            type: 'error'
          })
          return Promise.reject()
        }
        // // console.log("road=>",data);
        store.commit('setRoadList', data.data)
      })
    },

    // 获取省份信息
    getProvince(store) {
      return api
        .getProvince({
          regionLevel: 1
        })
        .then(data => {
          // // console.log("data=>",data);
          if (data?.code != successCode) {
            // v.$message({
            //   message: "获取省份信息失败! [" + data.code + "]: " + data.message,
            //   type: "error",
            // });
            return Promise.reject()
          }
          store.commit('setProvinces', data.data)
          return data
        })
    },
    // 经纬度转换
    getPositionLat(store, obj) {
      return api.getPositionLat(obj).then(data => {
        // // console.log("data=>",data);
        if (data?.code != successCode) {
          v.$message({
            message:
              '获取j02坐标失败! [' +
              data.code +
              ']: ' +
              data.message,
            type: 'error'
          })
          return Promise.reject()
        }
        store.commit('setPositionLat', data.data)
        return data
      })
    },

    // 获取省组织用户结构
    provinceTree(store) {
      return api.provinceTree().then(data => {
        if (data?.code != successCode) {
          // v.$message({
          //   message: "获取行政区域失败! [" + data.code + "]: " + data.message,
          //   type: "error",
          // });
          return Promise.reject()
        }
      })
    },
    //获取oss配置缓存信息
    async getOssConfig(store, obj) {
      await api.getConfigContent(2).then(res => {
        var data = JSON.parse(res.data)
        store.commit('setOssConfig', data)
        return data
      })
    }
  },

  mutations: {
    setUserOrgain(state, nv) {
      state.UserOrgTree = nv
    },
    setUserOrgainChild(state, nv) {
      state.UserOrgTreeChild = nv
    },
    setCurrentPageName(state, val) {
      state.currentPageName = val
    },

    setNavActiveIndex(state, val) {
      state.navActiveIndex = val
    },
    setSelectCameraIndex(state, val) {
      state.selectCameraIndex = val
    },

    setUserInfo(state, nv) {
      state.userInfo = nv
    },
    setRegionList(state, nv) {
      state.regionList = nv
    },
    setOrgList(state, nv) {
      state.orgList = nv
    },
    setOrgTreeData(state, nv) {
      state.orgTreeData = nv
      console.log('state.orgTreeData=>', state.orgTreeData)
    },
    setClassIfyList(state, nv) {
      state.classIfyList = nv
    },
    setDerectionList(state, nv) {
      state.derectionList = nv
    },
    setVendorList(state, nv) {
      state.vendorList = nv
    },
    setRoadList(state, nv) {
      state.roadList = nv
    },
    setProvinces(state, nv) {
      state.provinces = nv
    },
    setPositionLat(state, nv) {
      state.positionLat = nv
    },
    setUserPermission(state, nv) {
      state.userPermissions = nv
    },
    setOssConfig(state, nv) {
      state.ossConfig = nv
    },
    setSystemLogoUrl(state, nv) {
      state.systemLogoUrl = nv
    },
    setSystemName(state, nv) {
      state.systemName = nv
    }
  },

  modules: {
    login,
    mapPage,
    transcoding,
    camera,
    deviceGroup,
    playback,
    examine,
    roleList,
    powerList,
    sysUser,
    devicePlatform,
    platformApply,
    deviceStatistics,
    streamMedia,
    message,
    organization,
    road,
    callManagement,
    accesslogByApp,
    accesslogByUrl,
    joinerlogByApp,
    joinerlogByUrl,
    borrowing,
    userGroup,
    gateway,
    cameraDetails,
    dashboard,
    ossConfig,
    poles,
    areaTypes
  }
})
