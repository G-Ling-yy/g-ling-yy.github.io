import http from '../filters/http'
import api from '../api'
import Vue from 'vue'
import router from '../router'
import md5 from 'js-md5'
import Utils from '../filters/utils'
import jsencrypt from '@/tools/jsencrypt'
import { toCode } from '@/utils/tool'
import { Message } from 'element-ui'

/* function getQueryString(name) {
  let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");

  let r = null;
  if (window.location.href.indexOf("/main") > -1) {
    r = window.location.hash
      .substr(window.location.hash.indexOf("?") + 1)
      .match(reg);
    if (r != null) {
      return unescape(r[2]);
    }
    return null;
  }
} */

let v = new Vue() //新创建一个vue实例

const state = {
  menu: null,
  checked: true, // 记住密码
  isLogin: false,
  pubKey: null,
  SECRET_KEY:
    '*……%F%……&FCVW……&#V*&CIE……B&*CF……VFdF*&V%RV*rd*&vrvfdvfsaf&……t&*FfvsfdvfbFFFGFfggug7866t%￥&￥&%*……'
}

const actions = {
  /**
   * 查询登录状态
   * @returns {boolean}
   */
  getLoginStatus(store) {
    let userInfo = localStorage.getItem('cloudplatform'),
      roleInfo = localStorage.getItem('PM_CK_BN'),
      menuinfo = localStorage.getItem('PM_CK_MU')
    if (userInfo || roleInfo || menuinfo) {
      store.commit('setIsLogin', true)
      return true
    }
    return false
  },

  /**
   * 用户登录接口
   * @param store
   * @param obj
   */
  requestLogin(store, obj) {
    api
      .requestLogin({
        loginName: obj.account,
        loginPwd: obj.checkPass,
        verificationCode: obj.imgCode,
        uuid: obj.uuid
      })
      .then(data => {
        if (data && data.code != 200) {
          v.$message({
            message:
              '登录失败! [' +
              data.code +
              ']: ' +
              data.message,
            type: 'error'
          })
          return Promise.reject()
        }

        if (store.state.checked) {
          data.data.userInfo.checkPass = obj.checkPass
          localStorage.setItem(
            'PM_CK_LG',
            JSON.stringify({
              userName: obj.account,
              userPass: obj.checkPass
              // userId:data.data.userInfo.userId
            })
          )
        } else {
          localStorage.removeItem('PM_CK_LG')
        }
        store.dispatch('dologin', data)
      })
  },
  /**
   * 加密登录
   * @param {*} store
   * @param {*} obj
   */
  // 登录前的获取公钥(pubKey)
  getPubKey(store) {
    return api.getPubKey().then(res => {
      store.state.pubKey = res.data?.publicKey
      jsencrypt.setPublicKey(res.data?.publicKey)
    })
  },
  async userLoginDepart(store, params) {
    store.state.pubKey === null &&
      (await store.dispatch('getPubKey'))
    return api
      .requestLoginEncrypt({
        loginName: jsencrypt.encrypt(params.account),
        loginPwd: jsencrypt.encrypt(params.checkPass),
        verificationCode: params.imgCode,
        uuid: params.uuid
      })
      .then(data => {
        if (data && data.code != 200) {
          // debugger;
          if (data.code == 4008) {
            return router.push({
              path: `/reset-pass?loginame=${encodeURIComponent(
                params.account
              )}&loginpass=${toCode(params.checkPass)}`
            })
          } else {
            v.$message({
              message:
                '登录失败! [' +
                data.code +
                ']: ' +
                data.message,
              type: 'error'
            })
          }
          return Promise.reject()
        }
        const isLogin = 'isLogined'
        sessionStorage.setItem(isLogin, true)
        Cookies.set('token', data.data?.token)
        http.defaults.headers.common.Authorization = Cookies.get(
          'token'
        )
        Message.success('登录成功！')

        if (store.state.checked) {
          data.data.userInfo.checkPass = params.checkPass
          localStorage.setItem(
            'PM_CK_LG',
            JSON.stringify({
              userName: params.account,
              userPass: params.checkPass
              // userId:data.data.userInfo.userId
            })
          )
        } else {
          localStorage.removeItem('PM_CK_LG')
        }
        store.dispatch('dologin', data)
      })
  },
  /**
   * 用户登录临时自动登入接口
   * @param store
   * @param obj
   */
  autoLogin(store, obj) {
    console.log('obj', obj)
    api
      .requestLogin({
        loginName: obj.a,
        loginPwd: obj.p
      })
      .then(data => {
        if (data && data.code != 200) {
          v.$message({
            message:
              '登录失败! [' +
              data.code +
              ']: ' +
              data.message,
            type: 'error'
          })
          return Promise.reject()
        }
        // if (store.state.checked) {
        data.data.userInfo.checkPass = obj.p
        localStorage.setItem(
          'PM_CK_LG',
          JSON.stringify({
            userName: obj.a,
            userPass: obj.p
            // userId:data.data.userInfo.userId
          })
        )
        // } else {
        //   localStorage.removeItem("PM_CK_LG");
        // }
        store.dispatch('dologin', data)
      })
  },
  autoLogin2(store, obj, mypath) {
    console.log('obj2', obj)
    api
      .requestLogin2({
        loginName: obj.a,
        loginPwd: obj.p
      })
      .then(data => {
        if (data && data.code != 200) {
          v.$message({
            message:
              '登录失败! [' +
              data.code +
              ']: ' +
              data.message,
            type: 'error'
          })
          return Promise.reject()
        }
        // if (store.state.checked) {
        data.data.userInfo.checkPass = obj.p
        localStorage.setItem(
          'PM_CK_LG',
          JSON.stringify({
            userName: obj.a,
            userPass: obj.p
            // userId:data.data.userInfo.userId
          })
        )
        // } else {
        //   localStorage.removeItem("PM_CK_LG");
        // }
        store.dispatch('dologin2', data, mypath)
      })
  },

  /**
   * 手机获取验证码接口
   */
  getIdent(store, str) {
    api.getIdent(`${str}`).then(data => {
      if (data && data.code != 200) {
        v.$message({
          message:
            '登录失败! [' +
            data.code +
            ']: ' +
            data.message,
          type: 'error'
        })
        return Promise.reject()
      }
    })
  },
  /**
   * 手机验证登录
   */
  phoneRequest(store, obj) {
    api
      .phoneRequest(`${obj.phone}/${obj.identCode}`)
      .then(data => {
        if (data && data.code != 200) {
          v.$message({
            message:
              '登录失败! [' +
              data.code +
              ']: ' +
              data.message,
            type: 'error'
          })
          return Promise.reject()
        }

        if (store.state.checked) {
          data.data.userInfo.identCode = obj.identCode
          localStorage.setItem(
            'PM_CK_LG',
            JSON.stringify({
              userName: obj.phone,
              userPass: obj.identCode
            })
          )
        } else {
          localStorage.removeItem('PM_CK_LG')
        }

        store.dispatch('dologin', data)
      })
  },

  /**
   * 写入用户信息
   * @param store
   * @param data
   */
  dologin(store, data) {
    let userInfo = data.data.userInfo,
      info = {}
    info['isFrist'] = data.data.isFrist
    info['account'] = userInfo.loginName
    info['Authorization'] = data.data.token
    info['refreshToken'] = data.data.refreshToken
    //info["checkPass"]           = "";
    info['checkPass'] = userInfo.checkPass
    info['userName'] = userInfo.userName
    info['userType'] = userInfo.userType
    info['organizationId'] = userInfo.organizationId
    info['regionName'] = userInfo.regionName || '全国'
    info['regionCode'] = userInfo.regionCode
      ? parseInt(userInfo.regionCode)
      : 100000
    info['organizationName'] = userInfo.organizationName
    info['organizationType'] = userInfo.organizationType
    info['userId'] = userInfo.userId
    info['role'] = userInfo.role
    info['source'] = userInfo.source || 1
    info['loginTime'] = Utils.date('Y-m-d H:i:s')

    let sysInfo = {
      logoUrl: data.data.logoUrl,
      platformName: data.data.name
    }

    store.commit('setSystemLogoUrl', data.data.logoUrl)
    store.commit('setSystemName', data.data.name)
    localStorage.setItem(
      'cloudsysinfo',
      JSON.stringify(sysInfo)
    )

    //存储登录信息
    localStorage.setItem(
      'cloudplatform',
      JSON.stringify(info)
    )

    //缓存用户
    store.commit('setUserInfo', info)

    // if (true || info.userType === "4") {
    if (info.userType === '4') {
      let list = [
        {
          id: '109324',
          label: '摄像机管理',
          functionType: '10',
          functionUrl: '/sptCameraManage',
          modelId: 24,
          parentCode: '109320',
          showText: '',
          status: '1',
          subId: 93,
          sysId: 10,
          isLeaf: true
        },
        {
          id: '109325',
          label: '网关管理',
          functionType: '10',
          functionUrl: '/sptGatewayManage',
          modelId: 25,
          parentCode: '109320',
          showText: '',
          status: '1',
          subId: 93,
          sysId: 10,
          isLeaf: true
        },
        {
          id: '109326',
          label: '监控画面',
          functionType: '10',
          functionUrl: '/sptMonitorManage',
          modelId: 26,
          parentCode: '109320',
          showText: '',
          status: '1',
          subId: 93,
          sysId: 10,
          isLeaf: true
        },
        {
          id: '109327',
          label: '借阅申请',
          functionType: '10',
          functionUrl: '/sptLoanApplication',
          modelId: 26,
          parentCode: '109320',
          showText: '',
          status: '1',
          subId: 93,
          sysId: 10,
          isLeaf: true
        },
        {
          id: '109328',
          label: '故障填报',
          functionType: '10',
          functionUrl: '/sptFailureReport',
          modelId: 26,
          parentCode: '109320',
          showText: '',
          status: '1',
          subId: 93,
          sysId: 10,
          isLeaf: true
        },
        {
          id: '109329',
          label: '组织机构管理',
          functionType: '10',
          functionUrl: '/sptOrganizationManagement',
          modelId: 26,
          parentCode: '109320',
          showText: '',
          status: '1',
          subId: 93,
          sysId: 10,
          isLeaf: true
        },
        {
          id: '109330',
          label: '摄像机审核',
          functionType: '10',
          functionUrl: '/sptCameraBox',
          modelId: 26,
          parentCode: '109320',
          showText: '',
          status: '1',
          subId: 93,
          sysId: 10,
          isLeaf: true
        }
      ]
      let locals = md5(
        JSON.stringify(list) + store.state.SECRET_KEY
      )
      localStorage.setItem(
        'PM_CK_MU',
        JSON.stringify({ data: list, sign: locals })
      )
      store.commit('setIsLogin', true)
      router.push({ path: '/szhIndex' })
      return
    }

    Promise.all([
      //查询有权限的菜单[]
      // store.dispatch("findFuncByRole"),
      //查询所有已绑定的权限
      // store.dispatch("getPermissionsList", { roleCode: userInfo.role }),//苏交控
      store.dispatch('getChoseListByAllRoleAction', {
        roleCode: userInfo.role
      }) //其他环境
    ]).then(result => {
      // alert("sdsd", result);
      // console.info("endddddd     sss ");
      router.push({ path: '/index' })
    })
    // Promise.all([
    //   //查询有权限的菜单
    //   store.dispatch("findFuncByRole", `roleCode=${userInfo.role}`),
    //   //查询所有已绑定的权限
    //   // store.dispatch("getPermissionsList", { roleCode: userInfo.role }),//苏交控
    //   store.dispatch("getChoseListByAllRoleAction", {
    //     roleCode: userInfo.role,
    //   }), //其他环境
    // ]).then((result) => {
    //   //alert('sdsd',result);
    //   //console.info('endddddd     sss ');
    //   router.push({ path: "/index" });
    // });
  },
  dologin2(store, data, mypath) {
    let userInfo = data.data.userInfo,
      info = {}
    info['isFrist'] = data.data.isFrist
    info['account'] = userInfo.loginName
    info['Authorization'] = data.data.token
    info['refreshToken'] = data.data.refreshToken
    //info["checkPass"]           = "";
    info['checkPass'] = userInfo.checkPass
    info['userName'] = userInfo.userName
    info['userType'] = userInfo.userType
    info['organizationId'] = userInfo.organizationId
    info['regionName'] = userInfo.regionName || '全国'
    info['regionCode'] = userInfo.regionCode
      ? parseInt(userInfo.regionCode)
      : 100000
    info['organizationName'] = userInfo.organizationName
    info['organizationType'] = userInfo.organizationType
    info['userId'] = userInfo.userId
    info['role'] = userInfo.role
    info['source'] = userInfo.source || 1
    info['loginTime'] = Utils.date('Y-m-d H:i:s')

    let sysInfo = {
      logoUrl: data.data.logoUrl,
      platformName: data.data.name
    }

    store.commit('setSystemLogoUrl', data.data.logoUrl)
    store.commit('setSystemName', data.data.name)
    localStorage.setItem(
      'cloudsysinfo',
      JSON.stringify(sysInfo)
    )

    //存储登录信息
    localStorage.setItem(
      'cloudplatform',
      JSON.stringify(info)
    )

    //缓存用户
    store.commit('setUserInfo', info)

    // if (true || info.userType === "4") {
    if (info.userType === '4') {
      let list = [
        {
          id: '109324',
          label: '摄像机管理',
          functionType: '10',
          functionUrl: '/sptCameraManage',
          modelId: 24,
          parentCode: '109320',
          showText: '',
          status: '1',
          subId: 93,
          sysId: 10,
          isLeaf: true
        },
        {
          id: '109325',
          label: '网关管理',
          functionType: '10',
          functionUrl: '/sptGatewayManage',
          modelId: 25,
          parentCode: '109320',
          showText: '',
          status: '1',
          subId: 93,
          sysId: 10,
          isLeaf: true
        },
        {
          id: '109326',
          label: '监控画面',
          functionType: '10',
          functionUrl: '/sptMonitorManage',
          modelId: 26,
          parentCode: '109320',
          showText: '',
          status: '1',
          subId: 93,
          sysId: 10,
          isLeaf: true
        },
        {
          id: '109327',
          label: '借阅申请',
          functionType: '10',
          functionUrl: '/sptLoanApplication',
          modelId: 26,
          parentCode: '109320',
          showText: '',
          status: '1',
          subId: 93,
          sysId: 10,
          isLeaf: true
        },
        {
          id: '109328',
          label: '故障填报',
          functionType: '10',
          functionUrl: '/sptFailureReport',
          modelId: 26,
          parentCode: '109320',
          showText: '',
          status: '1',
          subId: 93,
          sysId: 10,
          isLeaf: true
        },
        {
          id: '109329',
          label: '组织机构管理',
          functionType: '10',
          functionUrl: '/sptOrganizationManagement',
          modelId: 26,
          parentCode: '109320',
          showText: '',
          status: '1',
          subId: 93,
          sysId: 10,
          isLeaf: true
        },
        {
          id: '109330',
          label: '摄像机审核',
          functionType: '10',
          functionUrl: '/sptCameraBox',
          modelId: 26,
          parentCode: '109320',
          showText: '',
          status: '1',
          subId: 93,
          sysId: 10,
          isLeaf: true
        }
      ]
      let locals = md5(
        JSON.stringify(list) + store.state.SECRET_KEY
      )
      localStorage.setItem(
        'PM_CK_MU',
        JSON.stringify({ data: list, sign: locals })
      )
      store.commit('setIsLogin', true)
      router.push({ mypath: path ? path : '/szhIndex' })

      return
    }

    Promise.all([
      //查询有权限的菜单
      store.dispatch('findFuncByRole'),
      //查询所有已绑定的权限
      // store.dispatch("getPermissionsList", { roleCode: userInfo.role }),//苏交控
      store.dispatch('getChoseListByAllRoleAction', {
        roleCode: userInfo.role
      }) //其他环境
    ]).then(result => {
      // alert("sdsd", result);
      // console.info("endddddd     sss ");
      router.push({ path: '/index' })
    })
    // Promise.all([
    //   //查询有权限的菜单
    //   store.dispatch("findFuncByRole", `roleCode=${userInfo.role}`),
    //   //查询所有已绑定的权限
    //   // store.dispatch("getPermissionsList", { roleCode: userInfo.role }),//苏交控
    //   store.dispatch("getChoseListByAllRoleAction", {
    //     roleCode: userInfo.role,
    //   }), //其他环境
    // ]).then((result) => {
    //   //alert('sdsd',result);
    //   //console.info('endddddd     sss ');
    //   router.push({ path: "/index" });
    // });
  },

  /**
   * 退出登录
   * @param store
   */
  logout(store) {
    //PM_CK_BN
    // localStorage.removeItem("cloudplatform"); //fixsxy暂时
    // localStorage.removeItem("IsSuppPlatform");
    // localStorage.removeItem("PM_CK_BN");
    // localStorage.removeItem("PM_CK_MU");
    // store.commit("setIsLogin", false);
    // router.push({ path: "/login" });
  },

  /**
   * 根据角色编码获取缓存中的权限列表
   * @param store
   * @param obj
   */
  findFuncByRole(store, obj) {
    var _this = this
    return api.findFuncByRole(obj).then(data => {
      console.log(data, '角色编码')
      if (data && data.code !== 200) {
        v.$message({
          message:
            '获取权限列表失败! [' +
            data.code +
            ']: ' +
            data.message,
          type: 'error'
        })
        return Promise.reject()
      }
      let list = [],
        len = data.data.length
      list = _.filter(
        data.data,
        it => it.functionCode !== '109310'
      )
      list = JSON.parse(
        JSON.stringify(list).replace(
          /childNode/g,
          'children'
        )
      )
      list = JSON.parse(
        JSON.stringify(list).replace(
          /functionDesc/g,
          'label'
        )
      )
      list = JSON.parse(
        JSON.stringify(list).replace(/functionCode/g, 'id')
      )
      let newList = v.Utils.reviseTreeData(list)
      let urls = Utils.getChildUrls({ children: newList })
      console.log(urls, 'role_urls')
      let locals = md5(
        JSON.stringify(newList) + store.state.SECRET_KEY
      )
      localStorage.setItem(
        'PM_CK_MU',
        // JSON.stringify({ newList })
        //路由导航
        JSON.stringify({ data: newList, sign: locals })
      )
      // 把获取的所有路径保存到本地
      localStorage.setItem('PM_urls', JSON.stringify(urls))
    })
  },

  getChoseListByAllRoleAction(store, obj) {
    return api.getChoseListByAllRole(obj).then(data => {
      if (data && data.code !== 200) {
        v.$message({
          message:
            '获取用户权限列表失败! [' +
            data.code +
            ']: ' +
            data.message,
          type: 'error'
        })
        return Promise.reject()
      }

      let rlist = data.data[obj.roleCode]

      if (rlist && rlist.length) {
        store.commit('setIsLogin', true)

        let rs = rlist.join(','),
          locals = md5(rs + store.state.SECRET_KEY)
        localStorage.setItem(
          'PM_CK_BN',
          JSON.stringify({ data: rs, sign: locals })
        )
      }
    })
  },

  /**
   * 角色已绑定权限接口查询
   * @param store
   * @param obj
   */
  getPermissionsList(store, obj) {
    return api.getChoseList(obj).then(data => {
      if (data && data.code !== 200) {
        v.$message({
          message:
            '获取用户权限列表失败! [' +
            data.code +
            ']: ' +
            data.message,
          type: 'error'
        })
        return Promise.reject()
      }

      let rlist = data.data[parseInt(obj.roleCode)]

      if (rlist && rlist.length) {
        store.commit('setIsLogin', true)

        let rs = rlist.join(','),
          locals = md5(rs + store.state.SECRET_KEY)
        localStorage.setItem(
          'PM_CK_BN',
          JSON.stringify({ data: rs, sign: locals })
        )
      }
    })
  },

  /**
   * 验证菜单内容，防止恶意修改
   * @param store
   * @param locals
   * @returns {boolean}
   */
  checkMenus(store, locals) {
    try {
      let arr = JSON.parse(locals),
        mlist = arr.data,
        sign = arr.sign
      if (
        sign &&
        md5(
          JSON.stringify(mlist) + store.state.SECRET_KEY
        ) === sign
      ) {
        return mlist
      }
      store.dispatch('logout')
    } catch (e) {
      store.dispatch('logout')
    }
    return false
  },
  /**
   * 判断是否有上级平台
   * @param store
   */
  querySuppPlatform(store) {
    api.querySuppPlatform({}).then(res => {
      if (res.code === 200) {
        localStorage.setItem(
          'IsSuppPlatform',
          JSON.stringify(true)
        )
      } else {
        localStorage.setItem(
          'IsSuppPlatform',
          JSON.stringify(false)
        )
      }
    })
  }
}

const mutations = {
  /*setMyRoleMenuList(state,val){
        state.myRoleMenuList = val;
    }*/

  setIsLogin(state, val) {
    state.isLogin = val
  },
  setMenu(state, val) {
    state.menu = val

    let list = [
      {
        id: '109311',
        label: '资源管理',
        functionType: '10',
        functionUrl: '',
        modelId: 11,
        parentCode: '1093',
        showText: '',
        status: '1',
        subId: 93,
        sysId: 10,
        children: [
          {
            id: '109320',
            label: '摄像机管理',
            functionType: '10',
            functionUrl: '/deviceCameraManage',
            modelId: 20,
            parentCode: '109311',
            showText: 'r',
            status: '1',
            subId: 93,
            sysId: 10,
            isLeaf: true
          },
          {
            id: '109321',
            label: '对接管理',
            functionType: '10',
            functionUrl: '/deviceTranscodingManage',
            modelId: 27,
            parentCode: '109311',
            showText: '',
            status: '1',
            subId: 93,
            sysId: 10,
            isLeaf: true
          },
          {
            id: '109322',
            label: '开放管理',
            functionType: '10',
            functionUrl: '/openManage',
            modelId: 22,
            parentCode: '109311',
            showText: '',
            status: '1',
            subId: 93,
            sysId: 10,
            isLeaf: true
          },
          {
            id: '109323',
            label: '流媒体管理',
            functionType: '10',
            functionUrl: '/streamMediaManage',
            modelId: 23,
            parentCode: '109311',
            showText: '',
            status: '1',
            subId: 93,
            sysId: 10,
            isLeaf: true
          }
        ],
        hasChildren: true
      },
      {
        id: '109313',
        label: '数据统计',
        functionType: '10',
        functionUrl: '/statistics',
        modelId: 13,
        parentCode: '1093',
        showText: '',
        status: '1',
        subId: 93,
        sysId: 10,
        children: [
          {
            id: '109332',
            label: '摄像机统计',
            functionType: '10',
            functionUrl: '/cameraStatistics',
            modelId: 13,
            parentCode: '109313',
            showText: '/sta/online/runInfo',
            status: '1',
            subId: 93,
            sysId: 10,
            isLeaf: true
          },
          {
            id: '109333',
            label: '异常统计',
            functionType: '10',
            functionUrl: '/AbnormalStatistics',
            modelId: 13,
            parentCode: '109313',
            showText: '/device/cameraState/errorList',
            status: '1',
            subId: 93,
            sysId: 10,
            isLeaf: true
          },
          {
            id: '109334',
            label: '开放统计',
            functionType: '10',
            functionUrl: '/openStatistics',
            modelId: 13,
            parentCode: '109313',
            showText: '/sta/oc/appWeekVideoPlayRecordCo',
            status: '1',
            subId: 93,
            sysId: 10,
            isLeaf: true
          },
          {
            id: '109351',
            label: '调取统计',
            functionType: '10',
            functionUrl: '/transferStatistics',
            modelId: 51,
            parentCode: '109313',
            showText: '/sta/playRecord/sourceStatistics',
            status: '1',
            subId: 93,
            sysId: 10,
            isLeaf: true
          }
        ],
        hasChildren: true
      },
      {
        id: '109314',
        label: '图像管理',
        functionType: '10',
        functionUrl: '',
        modelId: 14,
        parentCode: '1093',
        showText: '',
        status: '1',
        subId: 93,
        sysId: 10,
        children: [
          {
            id: '109335',
            label: '截图管理',
            functionType: '10',
            functionUrl: '/screenshotManagement',
            modelId: 14,
            parentCode: '109314',
            showText: '',
            status: '1',
            subId: 93,
            sysId: 10,
            isLeaf: true
          },
          {
            id: '109347',
            label: '图像质量检测',
            functionType: '10',
            functionUrl: '/imageDetection',
            modelId: 47,
            parentCode: '109314',
            showText: '/device/cameraState/quality-stat',
            status: '1',
            subId: 93,
            sysId: 10,
            isLeaf: true
          }
        ],
        hasChildren: true
      },
      {
        id: '109315',
        label: '日志管理',
        functionType: '10',
        functionUrl: '/logManage',
        modelId: 15,
        parentCode: '1093',
        showText: '',
        status: '1',
        subId: 93,
        sysId: 10,
        children: [
          {
            id: '109337',
            label: '操作日志',
            functionType: '10',
            functionUrl: '/operationLog',
            modelId: 37,
            parentCode: '109315',
            showText: '',
            status: '1',
            subId: 93,
            sysId: 10,
            isLeaf: true
          },
          {
            id: '109338',
            label: '接口日志',
            functionType: '10',
            functionUrl: '/interfaceLog',
            modelId: 38,
            parentCode: '109315',
            showText: '',
            status: '1',
            subId: 93,
            sysId: 10,
            isLeaf: true
          },
          {
            id: '109349',
            label: '行为审计',
            functionType: '10',
            functionUrl: '/behaviorAudit',
            modelId: 49,
            parentCode: '109315',
            showText: '/data/action-log/list',
            status: '1',
            subId: 93,
            sysId: 10,
            isLeaf: true
          },
          {
            id: '109354',
            label: '视频流状态日志',
            functionType: '10',
            functionUrl: '/streamLog',
            modelId: 54,
            parentCode: '109315',
            showText: '/base/record/list',
            status: '1',
            subId: 93,
            sysId: 10,
            isLeaf: true
          }
        ],
        hasChildren: true
      },
      {
        id: '109316',
        label: '系统管理',
        functionType: '10',
        functionUrl: '',
        modelId: 16,
        parentCode: '1093',
        showText: '',
        status: '1',
        subId: 93,
        sysId: 10,
        children: [
          {
            id: '109329',
            label: '组织与用户',
            functionType: '10',
            functionUrl: '/systemUserOrganize',
            modelId: 29,
            parentCode: '109316',
            showText: '',
            status: '1',
            subId: 93,
            sysId: 10,
            isLeaf: true
          },
          {
            id: '109330',
            label: '角色管理',
            functionType: '10',
            functionUrl: '/systemRoleList',
            modelId: 30,
            parentCode: '109316',
            showText: '',
            status: '1',
            subId: 93,
            sysId: 10,
            isLeaf: true
          },
          {
            id: '1093309',
            label: '权限列表',
            functionType: '10',
            functionUrl: '/systemPowerList',
            modelId: 30,
            parentCode: '109316',
            showText: '',
            status: '1',
            subId: 93,
            sysId: 10,
            isLeaf: true
          },
          {
            id: '109331',
            label: '路线管理',
            functionType: '10',
            functionUrl: '/roadManager',
            modelId: 31,
            parentCode: '109316',
            showText: '',
            status: '1',
            subId: 93,
            sysId: 10,
            isLeaf: true
          },
          {
            id: '109339',
            label: '运维报告',
            functionType: '10',
            functionUrl: '/systemReportList',
            modelId: 39,
            parentCode: '109316',
            showText: '',
            status: '1',
            subId: 93,
            sysId: 10,
            isLeaf: true
          },
          {
            id: '109340',
            label: '系统设置',
            functionType: '10',
            functionUrl: '/styme',
            modelId: 40,
            parentCode: '109316',
            showText: '',
            status: '1',
            subId: 93,
            sysId: 10,
            children: [
              {
                id: '109344',
                label: '名称/LOGO',
                functionType: '10',
                functionUrl: '',
                modelId: 44,
                parentCode: '109340',
                showText: '/user/logo',
                status: '1',
                subId: 93,
                sysId: 10,
                isLeaf: true
              },
              {
                id: '109345',
                label: '个人信息',
                functionType: '10',
                functionUrl: '',
                modelId: 45,
                parentCode: '109340',
                showText: '/user/info',
                status: '1',
                subId: 93,
                sysId: 10,
                isLeaf: true
              }
            ],
            hasChildren: true
          }
        ],
        hasChildren: true
      },
      {
        id: '10933610',
        label: '搜索',
        functionType: '20',
        functionUrl: '',
        modelId: 36,
        parentCode: '109336',
        showText: '',
        status: '1',
        subId: 93,
        sysId: 10,
        isLeaf: true
      },
      {
        id: '10933611',
        label: '下载',
        functionType: '20',
        functionUrl: '',
        modelId: 36,
        parentCode: '109336',
        showText: '',
        status: '1',
        subId: 93,
        sysId: 10,
        isLeaf: true
      },
      {
        id: '10933612',
        label: '删除',
        functionType: '20',
        functionUrl: '',
        modelId: 36,
        parentCode: '109336',
        showText: '',
        status: '1',
        subId: 93,
        sysId: 10,
        isLeaf: true
      }
    ]
    let locals = md5(
      JSON.stringify(list) + state.SECRET_KEY
    )
    localStorage.setItem(
      'PM_CK_MU',
      JSON.stringify({ data: list, sign: locals })
    )
    let menulist = [
      '/deviceCameraManage',

      '/deviceTranscodingManage',

      '/openManage',

      '/streamMediaManage',

      '/cameraStatistics',

      '/AbnormalStatistics',

      '/openStatistics',

      '/transferStatistics',

      '/statistics',

      '/screenshotManagement',

      '/imageDetection',

      '/operationLog',

      '/interfaceLog',

      '/behaviorAudit',

      '/streamLog',

      '/logManage',

      '/systemUserOrganize',

      '/systemRoleList',

      '/systemPowerList',

      '/roadManager',

      '/systemReportList',

      '/styme'
    ]
    localStorage.setItem(
      'PM_urls',
      JSON.stringify(menulist)
    )
  }
}

export default {
  state,
  mutations,
  actions
}
