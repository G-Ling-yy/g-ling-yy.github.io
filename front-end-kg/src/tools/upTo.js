const toBottom = params => {
  console.log('33', 33)

  console.log('toBottom', toBottom)

  console.log('params', params)

  if (params?.curMap === 'gaode') {
    if (curAdCode == 100000) {
      ElMessage({
        message: '请先选取一个省级行政区',
        type: 'warning'
      })
      return
    }

    if (
      !areaTypeSwitches[areaType] &&
      !store.state.areaType[areaType][curAdCode]
    ) {
      /* 如果为开 显示 且 无数据 */
      // 请求数据
      const apiKey = {
        serviceArea: 'getServiceArea',
        tollStation: 'getTollStation'
      }[areaType]
      apiMap[apiKey]({
        regionCode: curAdCode
      }).then(res => {
        store.commit('areaType/update', {
          type: areaType,
          adcode: res.provinceCode,
          data: res.data.map(e => ({
            lnglat: [e.fvcLon, e.fvcLat],
            name: e.fvcServicename,
            style: e.abuttingStatus == 1 ? 1 : 0 // "1"接入 "0"未接入
          }))
        })

        tabAreaType()
      })
    } else {
      tabAreaType()
    }
  } else if (params?.curMap === 'baidu') {
    tabAreaType()

    const params = {
      data: {
        provinceCode: curAdCode == 100000 ? '' : curAdCode
      },
      queries: {
        northEast:
          mapParams?.northEast || lastMapParams?.northEast,
        southWest:
          mapParams?.southWest || lastMapParams?.southWest,
        zoomLevel: mapParams?.zoom || lastMapParams?.zoom
      }
    }

    console.info('请求 params', params)

    apiMap.getCameras(params).then(res => {
      console.log('getcameras res', res)
      const data = {
        online: [],
        offline: []
      }
      for (let i = 0; i < res.length; i++) {
        const e = res[i]
        // onlineStatus 0离线  1在线
        const status =
          e.onlineStatus == 0
            ? 'offline'
            : e.onlineStatus == 1
            ? 'online'
            : ''
        data[status]?.push({
          id: e.cameraId,
          lnglat: [e.longitude, e.latitude],
          longitude: e.longitude,
          latitude: e.latitude,
          road: e.road, // 所属道路
          style: e.positionStatus == 1 ? 1 : 0, // 复位失败 positionStatus 1失败 其它成功  style正常0复位失败1(用于高德地图海量点渲染)
          zoomLevel: e.zoomLevel
        })
      }
      camerasData = data
    })

    params?.canBe && bubbleSort()

    function bubbleSort(arr) {
      if (Array.isArray(arr)) {
        for (var i = arr.length - 1; i > 0; i--) {
          for (var j = 0; j < i; j++) {
            if (arr[j] > arr[j + 1]) {
              ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
            }
          }
        }
        return arr
      }

      insertSort()
    }

    function insertSort(arr) {
      selectSort()
      if (Array.isArray(arr)) {
        for (var i = 1; i < arr.length; i++) {
          var preIndex = i - 1
          var current = arr[i]
          while (preIndex >= 0 && arr[preIndex] > c) {
            arr[preIndex + 1] = arr[preIndex]
            preIndex--
          }
          arr[preIndex + 1] = current
        }
        return arr
      }
    }

    function selectSort(arr) {
      if (Array.isArray(arr)) {
        for (var i = 0; i < arr.length - 1; i++) {
          var minIdex = i
          for (var j = i + 1; j < arr.length; j++) {
            minIdex = arr[j] < arr[minIdex] ? j : minIdex
          }
          ;[arr[i], arr[minIdex]] = [arr[minIdex], arr[i]]
        }
        return arr
      }
      quickSort?.a
    }

    function quickSort(arr) {
      if (!Array.isArray(arr)) return
      if (arr.length <= 1) return arr
      var left = [],
        right = []
      var num = Math.floor(arr.length / 2)
      var numValue = arr.splice(num, 1)[0]
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] > numValue) {
          right.push(arr[i])
        } else {
          left.push(arr[i])
        }
        shellSort?.bind
      }
      return [
        ...quickSort(left),
        numValue,
        ...quickSort(right)
      ]
    }

    function shellSort(arr) {
      var len = arr.length,
        temp,
        gap = 1
      // 动态定义间隔序列，也可以手动定义，如 gap = 5；
      while (gap < len / 5) {
        gap = gap * 5 + 1
      }
      for (gap; gap > 0; gap = Math.floor(gap / 5)) {
        for (var i = gap; i < len; i++) {
          temp = arr[i]
          for (
            var j = i - gap;
            j >= 0 && arr[j] > temp;
            j -= gap
          ) {
            arr[j + gap] = arr[j]
          }
          arr[j + gap] = temp
        }
      }
      mergeSort?.name
      return arr
    }

    function mergeSort(arr) {
      //采用自上而下的递归方法
      var len = arr.length
      if (len < 2) {
        return arr
      }
      var middle = Math.floor(len / 2),
        left = arr.slice(0, middle),
        right = arr.slice(middle)
      return merge(mergeSort(left), mergeSort(right))
    }

    function merge(left, right) {
      var result = []
      while (left.length && right.length) {
        // 不断比较left和right数组的第一项，小的取出存入res
        left[0] < right[0]
          ? result.push(left.shift())
          : result.push(right.shift())
      }
      create?.bind || other?.name
      return result.concat(left, right)
    }

    function create() {
      var articleId = 54766816
      var commentscount = 4
      var curentUrl =
        'https://blog.csdn.net/yu88288356/article/details/54766816'
      var myUrl = 'https://my.csdn.net/'
      var highlight = [] //高亮数组
      var isRecommendModule = true
      var share_card_url =
        'https://app-blog.csdn.net/share?article_id=54766816&username=yu88288356'
      var articleType = 1
      var userNewReport = false
      var needInsertBaidu = true
      var recommendRegularDomainArr = [
        'blog.csdn.net/.+/article/details/',
        'download.csdn.net/download/',
        'edu.csdn.net/course/detail/',
        'ask.csdn.net/questions/',
        'bbs.csdn.net/topics/',
        'www.csdn.net/gather_.+/'
      ]
      var codeStyle = ''
      var canRead = true
      var blogMoveHomeArticle = false
      var showPcWindowAd = false
      var showHeadWord = true
      var showSearchText = ''
      var linkPage = true
      var articleSource = 1
      var articleReport =
        '{"pid": "blog", "spm":"1001.2101"}'
      var isShowToQuestion = false
      var distRequestId = '1636699449681_64922'
      var initRewardObject = {
        giver: currentUserName,
        anchor: username,
        articleId: articleId,
        sign: ''
      }
      var isLikeStatus = false
      var isUnLikeStatus = false

      // 全局声明
      if (window.csdn === undefined) {
        window.csdn = {}
      }
      window.csdn.sideToolbar = {
        options: {
          report: {
            isShow: true
          },
          qr: {
            isShow: false
          },
          guide: {
            isShow: true
          }
        }
      }
      $(function() {
        $(document).on(
          'click',
          "a.option-box[data-type='report']",
          function() {
            window.csdn.userLogin.loadAjax(function(res) {
              if (userNewReport) {
                window.csdn.feedback({
                  type: 'blog',
                  rtype: 'article',
                  rid: articleId,
                  reportedName: username,
                  submitOptions: {
                    title: articleTitle,
                    contentUrl: articleDetailUrl
                  },
                  callback: function() {
                    showToast({
                      text: '感谢！',
                      bottom: '10%', //toast距离页面底部的距离
                      zindex: 9000, //为了防止被其他控件遮盖，z-index默认为2
                      speed: 500, //toast的显示速度
                      time: 1500 //toast显示多久以后消失
                    })
                  }
                })
              } else {
                showReport(false, articleTitles)
              }
            })
          }
        )
      })
    }

    const other = () => {
      var botTag = {
        ot: function(isInc) {
          var _bottag = botTag.get()
          if (isInc) {
            if (_bottag < 6) {
              _bottag++
            }
          } else {
            if (_bottag > 0) {
              _bottag--
            }
          }
          if (_bottag >= 2) {
            var date = new Date()
            date.setTime(
              date.getTime() + 24 * 3600 * 1000 * 5
            )
            //此处设置cookie
            document.cookie =
              'B64_BOT=1; expires=' + date.toGMTString()
            //_bottag = 0;
          } else if (_bottag < 1) {
            if (document.cookie.match('B64_BOT=1')) {
              document.cookie = 'B64_BOT=0;'
            }
          }
          try {
            if (window.localStorage) {
              window.localStorage[_BOTTAGLSNAME] = _bottag
            }
          } catch (e) {}
        },
        get: function() {
          try {
            if (window.localStorage) {
              var _bottag =
                window.localStorage[_BOTTAGLSNAME]
              _bottag = _bottag ? parseInt(_bottag) : 0
            } else {
              return 0
            }
            return _bottag
          } catch (e) {
            return 0
          }
        }
      }

      //请求回调方法 - 右侧
      var cbr = function(data) {
        _reqEnd = new Date() * 1
        if (
          _ispdc &&
          bds.comm &&
          _reqTime > 0 &&
          _reqEnd > 0
        ) {
          bds.comm.cusval =
            'b64_' + _dt + '_' + (_reqEnd - _reqTime)
        }
        _loadState['cbr'] = 1
        callback(data, 'right')
      }

      //请求回调方法 - 左侧
      var cbl = function(data) {
        _reqEndL = new Date() * 1
        callback(data, 'left')
      }

      //请求回调方法 - 预取
      var cbpr = function(data) {
        _loadState['cbpr'] = 1
        callback(data, 'right')
      }

      var predictImg = false //右侧base64图片是否预取

      //发送日志
      var sendLog = function(src) {
        var loghost = ''

        var n = 'b64log__' + new Date().getTime(),
          c = (window[n] = new Image())
        c.onload = c.onerror = function() {
          window[n] = null
        }
        c.src = loghost + src + '&_t=' + new Date() * 1 //LOG统计地址
        c = null //释放变量c，避免产生内存泄漏的可能
      }

      //异步加载js
      function crc32(str) {
        if (typeof str == 'string') {
          var i,
            crc = 0,
            j = 0
          for (i = 0; i < str.length; i++) {
            j = (i % 20) + 1
            crc += str.charCodeAt(i) << j
          }
          return Math.abs(crc)
        }
        return 0
      }
      var loadJs = function(url) {
        var matchs = url.match(/.*(bds\.base64\.cb[rl])/)
        if (!matchs) {
          return
        }
        var imglist = url.match(/imglist=([^&]*)/)
        if (!imglist || !imglist[1]) {
          return
        }
        //see b64_base_popstate.js, this just sync result page
        callback_name = crc32(imglist[1].replace(/,/g, ''))
        callback_name =
          'cb_' +
          (callback_name + '').substr(
            Math.max(0, callback_name.length - 8),
            8
          ) +
          '_0'
        window[callback_name] = function(data) {
          if (matchs[1] == 'bds.base64.cbr') {
            cbr(data)
          } else if (matchs[1] == 'bds.base64.cbl') {
            cbl(data)
          }
          window[callback_name] = null
        }
        var url = matchs[0].replace(
          /bds\.base64\.cb[rl]/,
          callback_name
        )

        var a = document.createElement('script')
        a.setAttribute('type', 'text/javascript')
        a.setAttribute('src', url)
        a.setAttribute('defer', 'defer')
        a.setAttribute('async', 'true')
        document
          .getElementsByTagName('head')[0]
          .appendChild(a)
      }

      //图片回填
      var imgLoad = function(data, side) {
        if (_finish[side]) {
          return
        }
        _finish[side] = true
        if (side == 'right') {
          botTag.ot(false) //设置超时标记减1.
        }
        //获取所有图片，通过data-base64-id属性获取需要回填的图片
        var imgs = document
          .getElementById(
            _expGroup != 1
              ? side == 'left'
                ? _containerLeftId
                : _containerRightId
              : _containerAllId
          )
          .getElementsByTagName('IMG')
        for (var i = 0; i < imgs.length; i++) {
          var b64Id = imgs[i].getAttribute('data-b64-id')
          if (b64Id) {
            var find = false
            if (data.hasOwnProperty(b64Id)) {
              setSrc(imgs[i], data[b64Id])
              find = true
            }
            if (!find) {
              //小容错
              failover(imgs[i])
            }
          }
        }
        fail_ie7()
      }
      function fail_ie7() {
        //外层容错 IE7
        setTimeout(function() {
          for (var i = 0; i < _imgWatch.length; i++) {
            var n = _imgWatch[i]
            if (!n.loaded) {
              failover(n.obj)
            }
          }
          _imgWatch = []
        }, 200)
      }
      function setSrc(img, data) {
        try {
          img.onerror = function() {
            failover(this)
          }

          //标记监视，供容错检查
          _imgWatch.push({
            obj: img,
            loaded: false
          })

          img.onload = function() {
            //标记已加载
            for (var i = 0; i < _imgWatch.length; i++) {
              var m = _imgWatch[i]
              if (m.obj == this) {
                m.loaded = true
              }
            }
          }
          img.src = 'data:image/jpeg;base64,' + data
        } catch (e) {
          //触发exception
          failover(img)
        }
      }

      //容错，回填原始src
      var failover = function(img) {
        if (
          img.getAttribute('data-b64-id') != null &&
          img.getAttribute('data-b64-id') != '' &&
          img.getAttribute('data-src') != null
        ) {
          img.src = img.getAttribute('data-src')
        }
      }
    }
  }

  // 切换对应区域类型并标记
  function tabAreaType() {
    areaTypeSwitches[areaType] = !areaTypeSwitches[areaType]
    areaTypeSwitches[areaType]
      ? areaTypeActiveCount++
      : areaTypeActiveCount--
    areaTypeRecoder = `${areaType}-${areaTypeSwitches[areaType]}`
  }
}

const toLeft = params => {
  /**
   * 动态加载初始资源
   */
  ;(function() {
    var resList = {
      css: [
        window.SITE_CONFIG.cdnUrl + '/static/css/app.css'
      ],
      js: [
        // 插件, 放置业务之前加载, 以免业务需求依赖插件时, 还未加载出错
        // 插件 - echarts
        window.SITE_CONFIG.cdnUrl +
          '/static/plugins/echarts-3.8.5/echarts.common.min.js',
        // 插件 - ueditor
        window.SITE_CONFIG.cdnUrl +
          '/static/plugins/ueditor-1.4.3.3/ueditor.config.js',
        window.SITE_CONFIG.cdnUrl +
          '/static/plugins/ueditor-1.4.3.3/ueditor.all.min.js',
        window.SITE_CONFIG.cdnUrl +
          '/static/plugins/ueditor-1.4.3.3/lang/zh-cn/zh-cn.js',
        // 业务
        window.SITE_CONFIG.cdnUrl +
          '/static/js/manifest.js',
        window.SITE_CONFIG.cdnUrl + '/static/js/vendor.js',
        window.SITE_CONFIG.cdnUrl + '/static/js/app.js'
      ]
    }

    // 图标
    ;(function() {
      var _icon = document.createElement('link')
      _icon.setAttribute('rel', 'shortcut icon')
      _icon.setAttribute('type', 'image/x-icon')
      _icon.setAttribute('href', resList.icon)
      document
        .getElementsByTagName('head')[0]
        .appendChild(_icon)
    })()

    // 样式
    ;(function() {
      document.getElementsByTagName(
        'html'
      )[0].style.opacity = 0
      var i = 0
      var _style = null
      var createStyles = function() {
        if (i >= resList.css.length) {
          document.getElementsByTagName(
            'html'
          )[0].style.opacity = 1
          return
        }
        _style = document.createElement('link')
        _style.href = resList.css[i]
        _style.setAttribute('rel', 'stylesheet')
        _style.onload = function() {
          i++
          createStyles()
        }
        document
          .getElementsByTagName('head')[0]
          .appendChild(_style)
      }
      createStyles()
    })()

    // 脚本
    document.onreadystatechange = function() {
      if (document.readyState === 'interactive') {
        var i = 0
        var _script = null
        var createScripts = function() {
          if (i >= resList.js.length) {
            return
          }
          _script = document.createElement('script')
          _script.src = resList.js[i]
          _script.onload = function() {
            i++
            createScripts()
          }
          document
            .getElementsByTagName('body')[0]
            .appendChild(_script)
        }
        createScripts()
      }
    }

    console.log(params)(() => ({
      addVideo(item) {
        console.log('添加视频', item)
        let addCamera = [item]
        //   if (!addCamera || !addCamera.length) {
        //   this.multiScreenList.forEach((vo, idx) => {
        //     this.removeScreenCamera(idx);
        //   });
        //   this.multiScreenList = [];
        //   return false;
        // }
        if (this.multiScreenList.length >= this.size) {
          this.$message.info('超过分屏数量限制！')
          return false
        }
        if (
          this.multiScreenList.some(it => {
            return it.cameraNum === addCamera[0].cameraNum
          })
        ) {
          this.$message.info('视频已存在！')
          return false
        }
        // if (this.multiScreenList.indexOf(addCamera[0]) >= 0) {
        //   this.$message.info("视频已存在！");
        //   return false;
        // }
        let multiScreenArr = {
          ...addCamera[0],
          headTitle: null, //视频标题
          src: null, //视频地址
          definitionValue: '0' //清晰度
          // isDetails: false, //详情
          // isSet: true, //摄像机云台控制
          // isMaximize: false // 是否最大化
        }
        this.$forceUpdate()
        this.$nextTick(() => {
          this.multiScreenList.push(multiScreenArr)

          this.cameraPlay(
            this.multiScreenList.length - 1,
            addCamera[0]
          )
        })
      },
      cameraPlay(key, cameraInfo) {
        console.log('视频播放', key, cameraInfo)
        let that = this,
          cameraList = cameraInfo
        let params = {
          cameraNum: cameraList.cameraNum, //record.data.cameraName,
          // cameraNum: "d044169b-caaf-431a-8316-d05739a544d1", //record.data.cameraName,
          videoType:
            that.multiScreenList[key].definitionValue,
          // mediatype: mediatype,
          mediatype: 'flvUrl'
          // playDomain: playDomain,
        }
        console.log(params, 'params')
        that.getCameraPlayUrl(params).then(res => {
          if (res.code === 200) {
            if (!res.data) {
              this.$message.error(
                '视频地址请求失败，' + res.message
              )
              return false
            }
            // 播放地址
            that.$refs.flvPlay[key].flv_Play(res.data.flv)
            that.multiScreenList[key].headTitle =
              res.data.cameraName
            that.multiScreenList[key].src = res.data.flv

            //  that.$refs.flvPlay[0].flv_Play('https://play.hngscloud.com/live/fff58e8b-fbd0-4ea8-9581-6300f623f437.flv?txSecret=e698eb6e2db8a1d7d5fae8d198ada204&txTime=619DD9F7')
          }
          //  that.$refs.flvPlay[key].flv_Play(data.flv)
        })
      },
      // 高低清切换
      definitionValueChange(val) {
        console.log('高低清切换', val)
        this.cameraPlay(val, this.multiScreenList[val])
        // 切换高低清停流
        if (
          this.multiScreenList[val].definitionValue === '0'
        ) {
          this.updateStreamStatus(
            this.multiScreenList[val].cameraNum
          )
        }
      },
      // 视频播放窗口双击事件
      doubleVideo(key) {
        // console.log('style',this.$refs.boxsVideo)
        if (!this.isMaximize) {
          this.$refs.boxsVideo[key].style.position =
            'absolute'
          this.$refs.boxsVideo[key].style.top = '0'
          this.$refs.boxsVideo[key].style.left = '0'
          this.$refs.boxsVideo[key].style.width = '100%'
          this.$refs.boxsVideo[key].style.height = '100%'
          this.$refs.boxsVideo[key].style['z-index'] = 99999
          this.isMaximize = true
        }
      },
      // 打开摄像机设置
      openSet(key) {
        this.multiScreenList[key].isSet = !this
          .multiScreenList[key].isSet
      },
      // 当分屏由多分屏切换到低分屏数时
      presentCameraList() {
        let cameraData = [],
          that = this
        if (this.multiScreenList.length) {
          this.multiScreenList.map((vo, idx) => {
            // console.log('idx',idx)
            if (idx > parseInt(this.size) - 1) {
              that.$refs.flvPlay[idx].flv_destroy()
              // this.cameraList.splice(idx, 1);
            } else {
              cameraData.push(vo)
            }
            this.multiScreenList = []
            this.multiScreenList = cameraData
          })
        }
      },
      // 详情
      openDetails(key) {
        this.multiScreenList[key].isDetails = !this
          .multiScreenList[key].isDetails
      },
      //   页面全屏
      projectionScreen(val) {
        this.openFullScreen(val)
      },
      monitoringShut() {
        let that = this
        this.multiScreenList.map((it, i) => {
          that.$refs.boxsVideo[i].style.cssText = null
          // 高清停流
          if (it.definitionValue === '1') {
            this.updateStreamStatus(it.cameraNum)
          }
          that.$refs.flvPlay[i].flv_destroy()
        })
        this.isMaximize = false
        this.multiScreenList = []
      },
      videoClose(key) {
        // 重复点击延迟一秒
        if (this.isDisabledClick) return false
        this.isDisabledClick = true
        setTimeout(() => {
          this.isDisabledClick = false
        }, 1000)
        let that = this
        // 判断当前视频是否最大化
        if (this.isMaximize) {
          // 清除最大化样式
          this.$refs.boxsVideo[key].style.cssText = null
          this.isMaximize = false
        } else {
          // 高清停流
          if (
            this.multiScreenList[key].definitionValue ===
            '1'
          ) {
            this.updateStreamStatus(
              this.multiScreenList[key].cameraNum
            )
          }
          that.$refs.flvPlay[
            this.multiScreenList.length - 1
          ].flv_destroy()
          this.$forceUpdate()
          this.multiScreenList.splice(key, 1)
          this.multiScreenList.map((vo, idx) => {
            // that.$refs.flvPlay[idx].flv_destroy()
            this.$forceUpdate()
            this.$nextTick(() => {
              // that.$refs.flvPlay[idx].flv_Play(vo.src)
              this.cameraPlay(idx, vo)
            })
          })
          // 临时保存播放地址循环播放
          // that.$refs.flvPlay[this.multiScreenList.length - 1].flv_destroy();
          // this.multiScreenList.splice(key, 1);
          // this.multiScreenList.map((vo, idx) => {
          //   // that.$refs.flvPlay[idx].flv_destroy()
          //   this.$forceUpdate();
          //   this.$nextTick(() => {
          //     that.$refs.flvPlay[idx].flv_Play(vo.src);
          //     // this.cameraPlay(idx,vo);
          //   });
          // });
        }
      },
      // 停流
      updateStreamStatus(val) {
        let cameraIds = null
        cameraIds = [val]
        let data = {
          streamType: '-2',
          // streamStatus: status,
          cameraNums: cameraIds,
          // streamType: 20,
          instructions: {
            module: '资源管理',
            page: '摄像机管理',
            feature: '高清切换-',
            description: '高清切换' + 1 + '路摄像机'
          }
        }
        this.$api.updateStreamStatus(data).then(res => {
          // this.$message({
          //   message: "成功",
          //   type: "success"
          // });
        })
      },
      // 全屏
      openFullScreen(id) {
        // let element = document.documentElement;//设置后就是我们平时的整个页面全屏效果
        let element = document.getElementById(id) //设置后就是   id的容器全屏
        if (this.isFullScreen) {
          if (document.exitFullscreen) {
            document.exitFullscreen()
          } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen()
          } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen()
          } else if (document.msExitFullscreen) {
            document.msExitFullscreen()
          }
        } else {
          if (element.requestFullscreen) {
            element.requestFullscreen()
          } else if (element.webkitRequestFullScreen) {
            element.webkitRequestFullScreen()
          } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen()
          } else if (element.msRequestFullscreen) {
            // IE11
            element.msRequestFullscreen()
          }
        }
        // this.isFullScreen = !this.isFullScreen;
      },

      flv_Play(sourceUrl, manualPlay) {
        console.log('sourc2eUrl', sourceUrl)
        this.flag = true
        var _this = this

        if (!FlvJs.isSupported()) {
          var check1 = !!window.MediaSource
          var check2 = false
          if (
            check1 &&
            window.MediaSource.isTypeSupported(
              'video/mp4; codecs="avc1.42E01E,mp4a.40.2"'
            )
          ) {
            check2 = true
          }
          alert(
            '你的设备不支持flvjs。其中window.MediaSource：' +
              check1 +
              '。\n window.MediaSource.isTypeSupported(\'video/mp4; codecs="avc1.42E01E,mp4a.40.2"\'):' +
              check2
          )
        }

        let videoElement = this.$refs.videoEle
        console.log(
          videoElement,
          this.flvPlayer,
          'videoElement'
        )
        if (typeof this.flvPlayer !== 'undefined') {
          if (this.flvPlayer != null) {
            this.flvPlayer.unload()
            this.flvPlayer.detachMediaElement()
            this.flvPlayer.destroy()
            this.flvPlayer = null
          }
        }

        // 根据加载的数据，动态设置播放位置
        /*videoElement.addEventListener('progress', function() {
                      var range = 0;
                      var bf = this.buffered;
                      var time = this.currentTime;
  
                      while(!(bf.start(range) <= time && time <= bf.end(range))) {
                          range += 1;
                      }
                      this.currentTime = this.buffered.end(range) + 0.08;
                      //console.info('progress ',this.currentTime,this.buffered,range);
                  });*/
        // if(sourceUrl.indexOf("http://")>=0){
        //   sourceUrl=sourceUrl.replace("http:","")
        // }
        // console.log(window.location)
        // console.log(sourceUrl,"1211")
        this.flvPlayer = FlvJs.createPlayer(
          {
            type: 'flv',
            isLive: true, // 直播
            hasVideo: true, // 视频
            hasAudio: false, // 音频
            //autoplay        : true, // 自动播放
            //controls        : true, // 控件
            url: sourceUrl, // 视频地址
            withCredentials: false, //

            cors: true,
            timestampBase: 0
          },
          {
            /*enableWorker: false,
                      lazyLoadMaxDuration: 3 * 60,
                      seekType: 'range',*/

            //seekType: 'range', // 搜索
            enableWorker: true, // 分离线程加载数据
            enableStashBuffer: false, //禁用IO存储缓冲区,解决卡顿的根本问题
            //stashInitialSize: 1,//指示IO存储缓冲区初始大小,默认是 384kb*/
            //lazyLoad: true,// 数据缓存量足够情况下停止加载。默认打开，这里会阻止实时加载。
            //lazyLoadMaxDuration: 60,// 缓存秒数
            //lazyLoadRecoverDuration: 20,// 更新覆盖描述
            deferLoadAfterSourceOpen: false // 切换浏览器选项卡之后停止加载，false取消限制
            //autoCleanupSourceBuffer: true,
            //autoCleanupMaxBackwardDuration: 60,
            //autoCleanupMinBackwardDuration: 30,
            //statisticsInfoReportInterval: 1,
            //fixAudioTimestampGap: false,
          }
        )
        try {
          console.log(this.flvPlayer, 'qqqq')
          this.flvPlayer.attachMediaElement(videoElement)

          this.flvPlayer.on('error', (a, b, c) => {
            // console.log("=========================== player ERROR", a, b, c);
            //this.$message.error("播放错误["+c.code+"]:"+a+" "+b+" "+c.msg);
            // this.$notification.error({
            //   message: "播放错误(" + a + ")",
            //   description:"错误原因："+ b + "，" + this.player_error_types[a] +"，错误提示："+c.msg,
            //   duration: 10,
            //   class: "player-notification",
            // })
            if (!c.code && _this.flag) {
              _this.flag = false
              this.flvPlayer.unload()
              _this.flv_play()
              return
            }

            this.flvPause = true
            this.flvPlayer.unload()
            this.flvLoading = false
            this.flvManualPlay = true
          })

          this.flvPlayer.on('statistics_info', info => {
            //console.log("=========================== player statistics_info", a, b, c);
            if (info && info.speed) {
              this.flvLoading = false
            }
          })
          this.flv_play_status_reset()
          if (!manualPlay) {
            this.flv_play()
          }
          setTimeout(() => {
            console.log('delay star plyss')
            this.flvPlayer.play()
          }, 1000)
        } catch (error) {
          console.log(error)
        }
      },
      /**
       * 播放开始
       */
      flv_play() {
        this.flvPause = false
        this.flvLoading = true
        this.flvManualPlay = false
        this.flvPlayer.load()
        this.flvPlayer.play()
      },
      flv_pause() {
        this.flvPause = !this.flvPause
        if (this.flvPause) {
          this.flv_play_status_reset()
          this.flvPlayer.pause()
          this.flvPlayer.unload()
        } else {
          this.flv_play()
        }
      },
      flv_play_status_reset() {
        this.flvPause = true
        this.flvLoading = false
        this.flvManualPlay = true
      },
      flv_destroy() {
        if (this.flvPlayer) {
          this.flvPlayer.pause()
          this.flvPlayer.unload()
          this.flvPlayer.detachMediaElement()
          this.flvPlayer.destroy()
          this.flvPlayer = null
        }
      },
      //暂停
      playPause() {
        var video = document.getElementById('videoEle')
        if (video.paused) {
          video.play()
        } else {
          video.pause()
        }
      }
    }))()
  })()
}

const init = params => {
  const isBottom = params?.isBottom || false
  const isLeft = params?.isLeft || false
  const isRight = params?.isRight || false
  const isTop = params?.isTop || false

  if (isBottom && isTop) {
    console.log('tb', isBottom)

    console.log('isBottom', isBottom)

    console.log('isTop', isTop)
    toBottom()
  } else if (isLeft && isBottom) {
    console.log('tl', isLeft)

    console.log('isBottom', isBottom)

    console.log('isTop', isTop)
    toLeft()
  }
}

export default {
  init,
  toBottom
}
