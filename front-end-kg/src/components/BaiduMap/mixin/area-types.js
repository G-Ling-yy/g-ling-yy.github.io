import api from '@/api'

export default {
  data() {
    return {
      serviceArea: {}, // 服务区点集合对象
      tollStation: {} // 收费站点集合对象
    }
  },

  computed: {
    // 区域类型对应的图标
    areaImgs: vm => ({
      serviceArea: {
        online: vm.icons.serviceAreaOnline,
        offline: vm.icons.serviceAreaOffline
      },

      tollStation: {
        online: vm.icons.tollStationOnline,
        offline: vm.icons.tollStationOffline
      }
    }),

    // 服务区点数据
    serviceAreaData: vm =>
      vm.$store.state.areaTypes.serviceArea,

    // 收费站点数据
    tollStationData: vm =>
      vm.$store.state.areaTypes.tollStation
  },

  methods: {
    // 显示对应类型区域点
    showAreaTypeMarkers(areaType) {
      if (
        this[areaType][this.regionCode] &&
        this[areaType][
          this.regionCode
        ][0]?.isVisible?.() === false
      ) {
        /* 指定对象存在则直接展示 */
        this[areaType][this.regionCode].forEach(e =>
          e.show()
        )
      } else {
        /* 否则调接口 */
        this.getAreaDataByType(areaType)
      }
    },

    // 隐藏对应类型区域点
    hideAreaTypeMarkers(areaType) {
      if (
        this[areaType][this.regionCode] &&
        this[areaType][
          this.regionCode
        ][0]?.isVisible?.() === true
      ) {
        this[areaType][this.regionCode].forEach(e =>
          e.hide?.()
        )
      }
    },

    // 绘制对应类型区域点
    drawAreaTypeMarkers(areaType, dataList) {
      const onlineIcon = this.areaImgs[areaType].online
      const offlineIcon = this.areaImgs[areaType].offline
      !this[areaType][this.regionCode] &&
        (this[areaType][this.regionCode] = [])

      // 清空重绘
      for (
        let i = 0;
        i < this[areaType][this.regionCode].length;
        i++
      ) {
        this.map.removeOverlay(
          this[areaType][this.regionCode][i]
        )
      }
      for (let i = 0; i < dataList.length; i++) {
        const data = dataList[i]
        const marker = new BMapGL.Marker(
          new BMapGL.Point(
            data.bd09Longitude,
            data.bd09Latitude
          ),
          {
            enableClicking: false, // 是否响应点击事件。默认为true
            enableMassClear: false, // 是否在调用map.clearOverlays清除此覆盖物，默认为true
            icon: data.abuttingStatus
              ? onlineIcon
              : offlineIcon,
            title: data.name
          }
        )
        marker._sjk_type = 'typeArea'

        this[areaType][this.regionCode].push(marker)
        this.map.addOverlay(marker)
      }
    },

    // 获取当前范围内对应类型区域点数据
    getAreaDataByType(areaType) {
      const apiKey = {
        serviceArea: 'getServiceAreaPots',
        tollStation: 'getTollStationPots'
      }[areaType]
      const transform = this.$gcoord.transform
      const { ne, sw } = this.map.getBounds()
      const { neAry, swAry } = {
        neAry: transform([ne.lng, ne.lat], 'BD09', 'GCJ02'),
        swAry: transform([sw.lng, sw.lat], 'BD09', 'GCJ02')
      }
      const { northEast, southWest } = {
        northEast: `${neAry[0]},${neAry[1]}`,
        southWest: `${swAry[0]},${swAry[1]}`
      }

      return api[apiKey]({
        regionCode: this.regionCode,
        northEast,
        southWest
      }).then(res => {
        const data = res.data
        if (data?.data?.length > 0) {
          const dataList = data.data.map(e => {
            const [bd09Longitude, bd09Latitude] = transform(
              [e.fvcLon, e.fvcLat],
              'GCJ02',
              'BD09'
            )
            return {
              bd09Longitude,
              bd09Latitude,
              name: e.fvcServicename,
              abuttingStatus: e.abuttingStatus == 1 // "1"接入 "0"未接入
            }
          })

          // 调用绘制
          this.drawAreaTypeMarkers(areaType, dataList)
        }
      })
    }
  }
}
