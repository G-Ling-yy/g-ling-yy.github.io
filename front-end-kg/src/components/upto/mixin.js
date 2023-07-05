export default {
  methods: {
    tabOptions() {
      var nav = document.getElementById('nav')
      var oNav = nav.getElementsByTagName('li')

      var container = document.getElementById('container')
      var oDiv = container.getElementsByClassName('tab')
      for (var i = 0; i < oNav.length; i++) {
        oNav[i].index = i
        oNav[i].onclick = function() {
          for (var i = 0; i < oNav.length; i++) {
            oNav[i].className = ''
            oDiv[i].style.display = 'none'
          }
          this.className = 'act'
          oDiv[this.index].style.display = 'block'
        }
        for (var m = 1; m < oNav.length; m++) {
          oNav[m].className = ''
          oDiv[m].style.display = 'none'
        }
      }
    },

    factivated() {
      // 向父组件传递当前组件图层状态（暂注，当前需求要从父组件拿状态数据来改变当前子组件）
      // for (let key in this.mapLayerTypes) {
      //   this.$emit('mapLayerTypeUpdate', key, this.mapLayerTypes[key])
      // }

      /* 从父组件拿状态数据来改变当前子组件 */
      console.log(
        'mapStatus',
        this.mapStatus,
        this.mapStatus.zoom
      )

      // 更新regionCode
      this.regionCode = this.mapStatus.regionCode

      // 地图中心点
      const centerPoint = new BMapGL.Point(
        ...this.$gcoord.transform(
          this.mapStatus.center,
          'GCJ02',
          'BD09'
        )
      )
      // 地图中心点偏移
      const shiftCenterPoint = new BMapGL.Point(
        ...this.$gcoord.transform(
          [
            this.mapStatus.center[0] + 0.0000001,
            this.mapStatus.center[1] + 0.0000001
          ],
          'GCJ02',
          'BD09'
        )
      )

      // 延时时间（首次加载延时1500ms）
      const duration = this.loading ? 1500 : 100

      // 取消一开始可能触发的请求
      this.updateMarkers.cancel()

      setTimeout(() => {
        // 先移动到指定点附近以确定触发地图的move (有时候首次加载直接到指定点而不触发move)
        this.map.centerAndZoom(
          shiftCenterPoint,
          this.mapStatus.zoom
        )
        this.zoom = this.mapStatus.zoom
        this.updateMarkers.cancel()

        // 可能的改变卫星模式(只要进入百度就是默认开启卫星)
        this.map.addEventListener(
          'moveend',
          this.tabMapTypeAfterMoveend
        )

        setTimeout(() => {
          // 改变子组件地图中心和层级
          this.map.centerAndZoom(
            centerPoint,
            this.mapStatus.zoom
          )
        }, duration)
      }, duration)
    },

    addtomarker(marker) {
      const that = this,
        flag = true,
        markData = marker.getExtData(),
        selfIcon = marker.getIcon()
      marker.sjk_selfIcon = selfIcon
      let timeout
      const dragstartHandler = e => {
        if (
          that.lastDragMarker &&
          that.lastDragMarker !== marker
        ) {
          // 如果最后操作marker有值且与当前操作marker不等
          that.lastDragMarker.setIcon(
            that.lastDragMarker.sjk_selfIcon
          )
        }
        that.lastDragMarker = marker

        // 临时移除点击事件
        marker.off('click', clickHandler)

        // 关闭可能的右键弹窗
        that.$refs.amapPlayer.cameraInfoAlongEditVisable = false
      }
      const dragendHandler = e => {
        // 拖拽完成事件
        console.log('拖拽完成了')
        // marker.setDraggable(false)

        /* 更新摄像机位置 */
        const lnglat = marker.getPosition()
        that.$refs.amapPlayer.updateCameraLnglatForm({
          position: {
            lon: lnglat.lng,
            lat: lnglat.lat
          },
          flag
        })
        let params = {
          cameraId: markData.cameraId,
          longitude: lnglat.lng,
          latitude: lnglat.lat
        }
        markData.longitude = params.longitude
        markData.latitude = params.latitude
        markData.position = e.lnglat
        api.updateLonAndLat(params).then(res => {
          if (res.code == 200) {
            that.$message.success('摄像机经纬度更新成功')
          } else {
            that.$message.error({
              message: res.message,
              type: 'error'
            })
          }
        })

        setTimeout(() => {
          marker.on('click', clickHandler)
        }, 0)
      }
      const clickHandler = e => {
        console.log('marker.click单击触发')

        clearTimeout(timeout)

        // 还原拖拽导致可能改变了的图标
        marker.setIcon(selfIcon)

        // 禁止直接拖拽
        marker.setDraggable(false)

        if (!that.checkMark) {
          //创建标记操作的摄像机点
          that.createCheckMark()
        }

        //子组件右击编辑窗口开启状态下，点击播放视频失效
        if (
          that.$refs.amapPlayer.cameraInfoAlongEditVisable
        ) {
          that.$message({
            message: '请关闭修改窗口',
            type: 'warning'
          })
          return
        }
        that.setSelectCameraIndex(0)
        let cameraInfo = e.target.getExtData()
        that.checkMark.setPosition(marker.getPosition())
        that.checkMark.show()

        that.cameraInfoWindowShow({
          data: cameraInfo
        })

        that.curActMarker = marker
      }

      // 按下事件
      marker.on('mousedown', e => {
        if (
          e.originEvent.button === 0 &&
          !that.$refs.amapPlayer.visible &&
          !marker.getDraggable()
        ) {
          // 如果左键按下 (左键 0 右键 2)
          marker.setIcon(selfIcon)
          // 延时500ms后启动拖拽效果
          timeout = setTimeout(() => {
            console.log('鼠标按下1000ms了 可拖拽')
            marker === that.curActMarker &&
              that.checkMark?.hide()
            marker.setDraggable(true)
            marker.setIcon(that.dragIcon)
            marker.on('dragstart', dragstartHandler)
            marker.on('dragend', dragendHandler)

            if (
              that.lastDragMarker &&
              that.lastDragMarker !== marker
            ) {
              /* 如果最后操作marker有值且与当前操作marker不等 */
              that.lastDragMarker.setDraggable(false)
              that.lastDragMarker.setIcon(
                that.lastDragMarker.sjk_selfIcon
              )
            }
          }, 1000)
        }
      })

      // 单击事件
      marker.on('click', clickHandler)

      // 摄像机图标右击事件
      marker.on('rightclick', function(a) {
        console.log('marker 右击 a', a)

        //子组件单机视频窗口开启状态下，右键弹窗失效
        if (that.$refs.amapPlayer.visible) {
          that.$message({
            message: '请先关闭视频弹窗',
            type: 'warning'
          })
          return
        }

        clearTimeout(timeout)
        // 还原拖拽导致可能改变了的图标
        marker.setIcon(selfIcon)
        marker.setDraggable(false)

        if (!that.checkMark) {
          //创建标记操作的摄像机点
          that.createCheckMark()
        }

        that.addEventMarker(a)

        // that.removeMarker(that.delMark)
        // 右击赋值当前摄像机为当前操作摄像机
        that.curActMarker = marker
        that.currentMarkerZoom = marker.getExtData().zoomLevel
      })
    },

    floadMileMarker(mileageList) {
      console.log(
        mileageList[1],
        mileageList.length,
        '桩号==>'
      )
      var that = this
      console.time('桩号js耗时')
      AMapUI.load(
        ['ui/misc/PointSimplifier', 'lib/$'],
        function(PointSimplifier, $) {
          if (!PointSimplifier.supportCanvas) {
            alert('当前环境不支持 Canvas！')
            return
          }
          const kilometer = [],
            hectometer = []
          for (let i = 0; i < mileageList.length; i++) {
            const m = mileageList[i]
            if (
              m.roadStr &&
              m.roadStr.indexOf('+000') > 0
            ) {
              kilometer.push(m)
            } else {
              hectometer.push(m)
            }
          }
          that.$store.commit(
            'poles/setHectometerData',
            hectometer
          )
          that.$store.commit(
            'poles/setKilometerData',
            kilometer
          )

          function onIconLoad() {
            that.milePointFier.renderLater()
          }

          function onIconError(e) {
            console.log('load img err', e)
          }
          var mimg = {}
          for (var k in that.mileImg) {
            mimg[
              k
            ] = PointSimplifier.Render.Canvas.getImageContent(
              that.mileImg[k],
              onIconLoad,
              onIconError
            )
          }

          const createSimper = () =>
            new PointSimplifier({
              map: that.mapInstance, //所属的地图实例
              autoSetFitView: false,
              getPosition: function(item) {
                if (!item) {
                  return null
                }
                //返回经纬度
                return [item.longitude, item.latitude]
              },
              getHoverTitle: function(it) {
                return `${it.roadStr}`
              },

              //使用GroupStyleRender
              renderConstructor:
                PointSimplifier.Render.Canvas
                  .GroupStyleRender,
              renderOptions: {
                //鼠标hover时的title信息
                hoverTitleStyle: {
                  position: 'top'
                },
                getGroupId: function(item) {
                  var rm =
                    item.roadStr.indexOf('+') < 0
                      ? 0
                      : parseInt(
                          item.roadStr.substr(
                            item.roadStr.indexOf('+')
                          )
                        ) / 100
                  return rm + ''
                },
                groupStyleOptions: function(gId) {
                  return {
                    pointStyle: {
                      //绘制点占据的矩形区域
                      content: mimg[gId],
                      //宽度
                      width: gId == 0 ? 24 : 14,
                      fillStyle: null,
                      //高度
                      height: 14,
                      //定位点为中心
                      offset: ['-50%', '-50%']
                    },
                    // hover时候框样式
                    pointHoverStyle: {
                      content: gId == 0 ? 'rect' : 'circle',
                      strokeStyle: '#ffa500',
                      height: 16,
                      width: gId == 0 ? 26 : 16
                    }
                  }
                }
              }
            })

          // 千米桩
          that.milestoneSimplifier.kilometer = createSimper()
          that.milestoneSimplifier.kilometer.setData(
            kilometer
          )
          that.milestoneSimplifier.kilometer.hide()

          // 所有桩
          that.milestoneSimplifier.all = createSimper()
          that.milestoneSimplifier.all.setData(mileageList)
          that.milestoneSimplifier.all.hide()

          if (that.mileIsShow) {
            that.milePointFier.show()
          } else {
            that.milePointFier.hide()
          }
        }
      )
      console.timeEnd('桩号js耗时')
    },

    pwdchang(value) {
      console.log(value, this.form.pwd, 'value')
    },

    popoverBtn() {
      this.getMessageListData()
    },

    // 获取消息列表数据
    getMessageListData(curPage) {
      let obj = {
        currPage: this.currentPage,
        pageSize: this.pageSize
      }
      this.$api.getMessageList(obj).then(res => {
        if (res.code == 200) {
          this.messageList = res.data
          this.mesgTotal = res.total
          this.pageSize = res.pageSize
          // console.log(this.messageList, 'this.messageList')
        } else {
          this.$message.error(res.message)
        }
      })
    },

    // 更新消息状态
    updateReadStatus(messageId) {
      this.$http
        .get(`/updateReadStatus?messageId=${messageId}`)
        .then(
          res => {
            let data = res.data
          },
          err => {
            console.log(err)
          }
        )
    },

    checkStrong(sValue) {
      var modes = 0
      //正则表达式验证符合要求的
      if (sValue.length < 1) return modes
      if (/\d/.test(sValue)) modes++ //数字
      if (/[a-z]/.test(sValue)) modes++ //小写
      if (/[A-Z]/.test(sValue)) modes++ //大写
      if (/\W/.test(sValue)) modes++ //特殊字符

      //逻辑处理
      switch (modes) {
        case 1:
          return 1
          break
        case 2:
          return 2
          break
        case 3:
        case 4:
          return sValue.length < 4 ? 3 : 4
          break
      }
      return modes
    },

    pwdchang(newname, oldname) {
      this.msgText = this.checkStrong(newname)
      if (this.msgText > 1 || this.msgText == 1) {
        document.getElementById('one').style.background =
          'red'
      } else {
        document.getElementById('one').style.background =
          '#eee'
      }
      if (this.msgText > 2 || this.msgText == 2) {
        document.getElementById('two').style.background =
          'orange'
      } else {
        document.getElementById('two').style.background =
          '#eee'
      }
      if (this.msgText == 4) {
        document.getElementById('three').style.background =
          '#00D1B2'
      } else {
        document.getElementById('three').style.background =
          '#eee'
      }
    },

    // 消息列表分页处理
    handleSizeChange(val) {
      this.currentPage = 1
      this.pageSize = val
      this.getMessageListData()
    },

    handleCurrentChange(val) {
      this.currentPage = val
      this.getMessageListData()
    },

    /**
     * 地图加载
     */
    mapLoad() {
      var _this = this

      // 地图图层初始化配置
      this.view = new ol.View({
        projection: _this.projection, // 坐标系如果不设置，默认为墨卡托
        center: _this.initCenter, // 设置地图中心点
        zoom: _this.initZoom, // 初始化显示层级
        minZoom: 4, // 最小显示层级
        maxZoom: 16 // 最大显示层级
        // constrainResolution: true,              // 因为存在非整数的缩放级别，所以设置该参数为true来让每次缩放结束后自动缩放到距离最近的一个整数级别，这个必须要设置，当缩放在非整数级别时地图会糊
      })

      this.map = new ol.Map({
        target: 'mapCon', // 容器id
        layers: [
          _this.lwzxbkMapLayer,
          _this.lwzxrouteMapLayer,
          _this.lwzxzhujiMapLayer,
          _this.lwzxblueMapLayer
        ], // 默认加载图层
        view: _this.view
      })

      /**
       * 地图悬浮时触发
       */
      this.map.on('pointermove', function(e) {
        var pixel = _this.map.getEventPixel(e.originalEvent)

        if (_this.popupOverlay) {
          _this.popupOverlay.setPosition(undefined)
        }

        _this.map.forEachFeatureAtPixel(pixel, function(
          feature
        ) {
          // 获取摄像机自定义信息
          var obj = feature.getProperties()

          // 未携带名称的图层直接返回
          if (!obj.name) {
            return
          }

          var container = document.getElementById('popup')
          var content = document.getElementById(
            'popup-content'
          )
          var popupCloser = document.getElementById(
            'popup-closer'
          )

          _this.popupOverlay = new ol.Overlay({
            //设置弹出框的容器
            element: container,
            positioning: 'top-left',
            offset: [10, 10],
            //是否自动平移，即假如标记在屏幕边缘，弹出时自动平移地图使弹出框完全可见
            autoPan: true
          })

          //coodinate存放了点击时的坐标信息
          var coodinate = e.coordinate

          //设置弹出框内容，可以HTML自定义
          content.innerHTML = `<div>${obj.khPile}</div>`
          //设置overlay的显示位置
          _this.popupOverlay.setPosition(coodinate)
          //显示overlay
          _this.map.addOverlay(_this.popupOverlay)
        })
      })

      /**
       * 地图添加点击事件
       */
      this.map.on('singleclick', function(e) {
        var pixel = _this.map.getEventPixel(e.originalEvent)

        // 摄像机标志（每次点击只能触发一次）
        var camFlag = true

        _this.map.forEachFeatureAtPixel(pixel, function(
          feature
        ) {
          if (!camFlag) {
            return
          }

          // 获取摄像机自定义信息
          var cameraInfo = feature.getProperties()

          //coodinate存放了点击时的坐标信息
          var coodinate = e.coordinate

          if (cameraInfo.onlineStatus === '1') {
            _this.addActCameraIcon(cameraInfo)
            _this.cameraInfoWindowShow(
              { data: cameraInfo },
              coodinate || null
            )
          } else {
            _this.$message({
              type: 'warning',
              message: '离线视频不能播放'
            })
          }

          camFlag = false
        })
      })

      /**
       * 地图被放大或者缩小/移动后触发
       */
      this.map.on('moveend', function(evt) {
        if (window.setMapTimeout) {
          clearTimeout(window.setMapTimeout)
        }

        // 设置0.75秒防抖
        window.setMapTimeout = setTimeout(() => {
          _this.cameraLoad()
        }, 750)
      })
    },

    /**
     * 地图默认图层样式加载
     */
    mapConfigLoad() {
      var _this = this

      // 地图底图加载
      this.lwzxbkMapLayer = new ol.layer.Tile({
        //extent: [2423601.4157865737,-2324350.537143386,19812052.859356128,9945726.086343195],
        name: '背景',
        source: new ol.source.TileWMS({
          url:
            this.geowebcacheUrl +
            '/geowebcache/service/wms',
          params: {
            VERSION: '1.1.1',
            LAYERS: 'lwzx_bk',
            FORMAT: 'image/png',
            SRS: 'EPSG:3857'
          },
          tileGrid: new ol.tilegrid.TileGrid({
            //resolution和conf.xml中保持一致
            resolutions: [
              78271.517018034036,
              39135.758509017018,
              19567.879254508509,
              9783.9394949623238,
              4891.9698797730935,
              2445.9849398865467,
              1222.992337651342,
              611.49616882567102,
              305.74808441283551,
              152.87417449834899,
              76.436954957243259,
              38.218609770552874,
              19.109304885276437,
              9.5546524426382184,
              4.7773262213191092,
              2.3886631106595546,
              1.1943315553297773,
              0.59716577766488865
            ],
            tileSize: [256, 256],
            origin: [-22041258.62706707, 33265069.154240012]
          })
        })
      })

      // 路线标记加载
      this.lwzxrouteMapLayer = new ol.layer.Tile({
        //extent: [2423601.4157865737,-2324350.537143386,19812052.859356128,9945726.086343195],
        name: '路线',
        source: new ol.source.TileWMS({
          url:
            this.geowebcacheUrl +
            '/geowebcache/service/wms',
          params: {
            VERSION: '1.1.1',
            LAYERS: 'lwzx_route',
            FORMAT: 'image/png',
            SRS: 'EPSG:3857'
          },
          tileGrid: new ol.tilegrid.TileGrid({
            //resolution和conf.xml中保持一致
            resolutions: [
              78271.517018034036,
              39135.758509017018,
              19567.879254508509,
              9783.9394949623238,
              4891.9698797730935,
              2445.9849398865467,
              1222.992337651342,
              611.49616882567102,
              305.74808441283551,
              152.87417449834899,
              76.436954957243259,
              38.218609770552874,
              19.109304885276437,
              9.5546524426382184,
              4.7773262213191092,
              2.3886631106595546,
              1.1943315553297773,
              0.59716577766488865
            ],
            tileSize: [256, 256],
            origin: [-22041258.62706707, 33265069.154240012]
          })
        })
      })

      // 蓝背景加载
      this.lwzxblueMapLayer = new ol.layer.Tile({
        //extent: [2423601.4157865737,-2324350.537143386,19812052.859356128,9945726.086343195],
        name: '蓝背景',
        source: new ol.source.TileWMS({
          url:
            this.geowebcacheUrl +
            '/geowebcache/service/wms',
          params: {
            VERSION: '1.1.1',
            LAYERS: 'lwzx_blue',
            FORMAT: 'image/png',
            SRS: 'EPSG:3857'
          },
          tileGrid: new ol.tilegrid.TileGrid({
            //resolution和conf.xml中保持一致
            resolutions: [
              78271.517018034036,
              39135.758509017018,
              19567.879254508509,
              9783.9394949623238,
              4891.9698797730935,
              2445.9849398865467,
              1222.992337651342,
              611.49616882567102,
              305.74808441283551,
              152.87417449834899,
              76.436954957243259,
              38.218609770552874,
              19.109304885276437,
              9.5546524426382184,
              4.7773262213191092,
              2.3886631106595546,
              1.1943315553297773,
              0.59716577766488865
            ],
            tileSize: [256, 256],
            origin: [-22041258.62706707, 33265069.154240012]
          })
        })
      })

      // 高速公路标记加载
      this.lwzxzhujiMapLayer = new ol.layer.Tile({
        //extent: [2423601.4157865737,-2324350.537143386,19812052.859356128,9945726.086343195],
        name: '标记',
        source: new ol.source.TileWMS({
          url:
            this.geowebcacheUrl +
            '/geowebcache/service/wms',
          params: {
            VERSION: '1.1.1',
            LAYERS: 'lwzx_zhuji',
            FORMAT: 'image/png',
            SRS: 'EPSG:3857'
          },
          tileGrid: new ol.tilegrid.TileGrid({
            //resolution和conf.xml中保持一致
            resolutions: [
              78271.517018034036,
              39135.758509017018,
              19567.879254508509,
              9783.9394949623238,
              4891.9698797730935,
              2445.9849398865467,
              1222.992337651342,
              611.49616882567102,
              305.74808441283551,
              152.87417449834899,
              76.436954957243259,
              38.218609770552874,
              19.109304885276437,
              9.5546524426382184,
              4.7773262213191092,
              2.3886631106595546,
              1.1943315553297773,
              0.59716577766488865
            ],
            tileSize: [256, 256],
            origin: [-22041258.62706707, 33265069.154240012]
          })
        })
      })
    },

    /**
     * 摄像机加载
     */
    cameraLoad() {
      var _this = this

      if (this.camVectorLayer.length) {
        for (
          var i = 0, lens = this.camVectorLayer.length;
          i < lens;
          i++
        ) {
          this.map.removeLayer(this.camVectorLayer[i])
        }

        this.camVectorLayer = []
      }

      // 标点渲染
      function show_dian(info) {
        //实例化Vector要素，通过矢量图层添加到地图容器中
        let iconFeature = new ol.Feature({
          //坐标点
          geometry: new ol.geom.Point(
            ol.proj.fromLonLat([
              info.longitude,
              info.latitude
            ])
          ),
          //名称属性
          name: info.cameraName,
          khPile: info.khPile,
          cameraId: info.cameraId,
          cameraNum: info.cameraNum,
          onlineStatus: info.onlineStatus,
          lonlat: [info.longitude, info.latitude],
          //自定义数据，作用:唯一标识符
          key: info.cameraNum
        })
        iconFeature.setStyle(createLabelStyle(info))
        //矢量标注的数据源
        let vectorSource = new ol.source.Vector({
          features: [iconFeature]
        })
        //矢量标注图层
        let vectorLayer = new ol.layer.Vector({
          source: vectorSource,
          zIndex: 200
        })
        _this.map.addLayer(vectorLayer)
        _this.camVectorLayer.push(vectorLayer)
        //实例化Vector要素，通过矢量图层添加到地图容器中 end
      }

      /**
       * 创建标注样式函数,设置image为图标ol.style.Icon
       */
      var createLabelStyle = function(feature) {
        var imgUrl = ''

        switch (feature.onlineStatus) {
          case '0':
            imgUrl = _this.cameraOfflineImgUrl[1]
            break
          case '1':
            imgUrl = _this.cameraImgUrl[1]
            break
          case '2':
            imgUrl = _this.cameraErrorImgUrl[1]
            break
        }

        return new ol.style.Style({
          image: new ol.style.Icon({
            anchor: [0.5, 20], //锚点
            anchorOrigin: 'top-right', //锚点源
            anchorXUnits: 'fraction', //锚点X值单位
            anchorYUnits: 'pixels', //锚点Y值单位
            offsetOrigin: 'top-right', //偏移原点
            opacity: 1,
            scale: 0.3,
            src: imgUrl
          })
          // text: new ol.style.Text({
          //     //位置
          //     textAlign: 'center',
          //     //基准线
          //     textBaseline: 'middle',
          //     //文字样式
          //     font: 'normal 14px 微软雅黑',
          //     //文本内容
          //     text: feature.get('name'),
          //     //文本填充样式（即文字颜色）
          //     fill: new ol.style.Fill({ color: '#aa3300' }),
          //     stroke: new ol.style.Stroke({ color: '#ffcc33', width: 2 })
          // })
        })
      }

      var mapSize = this.map
        .getView()
        .calculateExtent(this.map.getSize())

      var firstNode = this.mercatorTolonlat({
        x: mapSize[0],
        y: mapSize[1]
      })
      var firstNodeLonLat = wgs84_to_gcj02(
        firstNode.x,
        firstNode.y
      )

      var secondNode = this.mercatorTolonlat({
        x: mapSize[2],
        y: mapSize[3]
      })
      var secondNodeLonLat = wgs84_to_gcj02(
        secondNode.x,
        secondNode.y
      )

      // 获取摄像机地图列表
      this.$api
        .postCameraListForPot({
          params: {
            zoomLevel: this.map.getView().getZoom(),
            northEast: secondNodeLonLat.join(','),
            southWest: firstNodeLonLat.join(',')
          },
          data: this.getCamPostBody
        })
        .then(res => {
          let lonLat = []

          // 遍历绚烂设备标点
          for (
            let i = 0, lens = res.data.length;
            i < lens;
            i++
          ) {
            lonLat = gcj02_to_wgs84(
              res.data[i].longitude,
              res.data[i].latitude
            )
            // lonLat = _this.lonLat2Mercator({
            //     lng: lonLat[0],
            //     lat: lonLat[1]
            // });

            res.data[i].longitude = lonLat[0]
            res.data[i].latitude = lonLat[1]

            show_dian(res.data[i])
          }
        })
    }
  }
}
