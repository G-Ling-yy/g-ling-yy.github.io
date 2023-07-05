import api from '@/api'

export default {
  data() {
    return {
      markers: {
        // 摄像机markers实例数据
        online: {
          // 在线
          0: [],
          1: [],
          2: [],
          3: [],
          4: [],
          5: [],
          6: [],
          7: [],
          8: [],
          9: []
        },
        offline: {
          // 离线
          0: [],
          1: [],
          2: [],
          3: [],
          4: [],
          5: [],
          6: [],
          7: [],
          8: [],
          9: []
        },
        error: {
          // 故障(数据可能会有)
          0: [],
          1: [],
          2: [],
          3: [],
          4: [],
          5: [],
          6: [],
          7: [],
          8: [],
          9: []
        }
      },
      curActMarker: null, // 当前操作摄像机marker
      curDragMarker: null, // 当前拖拽摄像机marker(需求要用不同图标区别于点击操作marker)
      isPlayerDialogShow: false // 左下角视频弹窗显隐
    }
  },

  computed: {},

  methods: {
    // 处理摄像机数据
    handleCamerasData(camerasData) {
      console.log(
        'bmap: camerasData length',
        camerasData.length
      )

      // 数据过多直接g
      if (camerasData.length > 1000) return

      // 清空地图摄像机覆盖物
      // this.map.clearOverlays() 不能用这个 会把可能的服务区和收费站图标清除
      const overlays = this.map.getOverlays()
      for (let i = 0; i < overlays?.length; i++) {
        overlays[i]._sjkMark === 'camera' &&
          this.map.removeOverlay(overlays[i])
      }

      if (camerasData.length) {
        console.time('BMapGL打点js耗时')
        // 清空本地marker实例保存数组和map的overlay
        for (const key in this.markers) {
          this.markers[key] = {
            0: [],
            1: [],
            2: [],
            3: [],
            4: [],
            5: [],
            6: [],
            7: [],
            8: [],
            9: []
          }
        }

        // 遍历数据渲染marker
        for (let i = 0; i < camerasData.length; i++) {
          const camera = camerasData[i]

          /* 根据摄像机数据创建对应marker实例 */
          const point = new BMapGL.Point(
            ...this.$gcoord.transform(
              [camera.longitude, camera.latitude],
              'GCJ02',
              'BD09'
            )
          )
          // 图标优先级：离线offline > 复位失败resetFailed > 在线online
          const icon =
            camera.onlineStatus == 0
              ? this.icons.offline
              : camera.positionStatus == 1
              ? this.icons.resetFailed
              : camera.onlineStatus == 1
              ? this.icons.online
              : this.icons.error
              // 判断是否播放高清视频
              if(camera.hdStatus == 1){
                icon = this.icons.highImg
              }
          const marker = new BMapGL.Marker(point, {
            icon
          })

          // 为摄像机marker实例绑定数据
          marker.extData = camera
          marker._sjkMark = 'camera'

          // 为marker实例添加事件
          this.addEventsForMarker(marker)

          // 生成的marker实例保存到本地对应数组
          this.markers[
            {
              0: 'offline',
              1: 'online',
              2: 'error'
            }[camera.onlineStatus]
          ][camera.classify].push(marker)

          // 添加到地图
          this.map.addOverlay(marker)
        }
        console.timeEnd('BMapGL打点js耗时')
      }

      // 恢复marker的事件响应
      this.markersDom.style.pointerEvents = 'auto'
    },

    // 为marker实例添加事件
    addEventsForMarker(marker) {
      // marker原icon
      const selfIcon = marker.getIcon()
      // marker活动icon
      const activeIcon =
        {
          6: this.icons.pActive
        }[marker.extData.classify] || this.icons.active

      // 绑定数据于marker
      marker.selfIcon = selfIcon
      marker.isClickable = true // marker可点击与否
      marker.isDraggable = false // marker可拖拽与否

      // 保存延时调用
      let timeouter = null
      // 鼠标按下
      marker.addEventListener(
        'mousedown',
        ({ domEvent }) => {
          if (
            domEvent.button === 0 &&
            !marker.isDraggable
          ) {
            // 如果左键按下 (左键 0 右键 2)
            timeouter = setTimeout(() => {
              marker.setIcon(this.icons.dragged)
              marker.enableDragging()
              marker.isDraggable = true
              marker.isClickable = false

              if (
                this.curDragMarker?.extData.cameraId !==
                marker.extData.cameraId
              ) {
                // 另起摄像机拖拽
                // 恢复之前操作marker原本图标
                this.curDragMarker?.setIcon(
                  this.curDragMarker.selfIcon
                )
                this.curDragMarker?.disableDragging()
                this.curDragMarker &&
                  (this.curDragMarker.isDraggable = false)
                this.curDragMarker = marker
              }
            }, 1000)
          }
        }
      )

      // 拖拽完成
      marker.addEventListener(
        'dragend',
        _.debounce(({ latLng }) => {
          const [
            longitude,
            latitude
          ] = this.$gcoord.transform(
            [latLng.lng, latLng.lat],
            this.$gcoord.BD09,
            this.$gcoord.GCJ02
          )
          /* 更新摄像机位置 */
          api
            .updateLonAndLat({
              cameraId: marker.extData.cameraId,
              longitude,
              latitude
            })
            .then(res => {
              if (res.code == 200) {
                this.$message.success(
                  '摄像机经纬度更新成功'
                )
              } else {
                this.$message.error({
                  message: res.message,
                  type: 'error'
                })
              }
            })
        }, 500)
      )

      // 鼠标点击
      marker.addEventListener('click', () => {
        console.log(
          'click marker.isClickable',
          marker.isClickable
        )
        if (!marker.isClickable) {
          // 如果允许拖拽则此次无点击效果
          console.log('当前可拖拽 取消点击效果')
          marker.isClickable = true
          return
        }
        timeouter &&
          (clearTimeout(timeouter), (timeouter = null))
        marker.setIcon(activeIcon)
        marker.disableDragging()
        marker.isDraggable = false

        if (
          this.curActMarker?.extData.cameraId !==
          marker.extData.cameraId
        ) {
          // 恢复之前操作marker原本图标
          this.curActMarker?.setIcon(
            this.curActMarker.selfIcon
          )
          this.curActMarker = marker
        }

        console.log('鼠标点击', marker)

        /* 打开视频弹窗 */
        this.isPlayerDialogShow = true
        this.$refs.playerDialog.onPlayerDialog()
        this.$refs.playerDialog.getVideoUrlToPlay(
          marker.extData
        )
      })

      // 鼠标移出
      marker.addEventListener('mouseout', () => {
        timeouter &&
          (clearTimeout(timeouter), (timeouter = null))
      })
    }
  }
}
