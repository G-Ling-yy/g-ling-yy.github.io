import axios from "axios"

export default {
  data: () => ({
    polesObj: {
      hectometer: null,
      kilometer: null
    }
  }),

  computed: {
    // 所有桩数据
    polesHectometerData: vm => vm.$store.state.poles.data.hectometer,

    // 千米桩数据
    polesKilometerData: vm => vm.$store.state.poles.data.kilometer
  },

  methods: {
    // 切换桩显示
    tabPolesShow(isShow) {
      if (!document.createElement('canvas').getContext) {
        alert('当前环境不支持 Canvas！')
        return
      }

      if (true) {
        console.log('百度桩暂停(return)')
        return
      }

      console.log('桩 tabshow', isShow)
      if (this.polesObj.kilometer) { // 已有相关实例，直接操作显隐
        console.log('已有桩实例 直接操作桩显示show:', isShow)
        if (isShow) {
          this.polesObj.kilometer?.show()
          this.zoom >= 14 && this.polesObj.hectometer?.show()
        } else {
          this.polesObj.kilometer?.hide()
          this.polesObj.hectometer?.hide()
        }
      } else if (this.polesKilometerData) { // 未建相关实例但已有缓存数据
        console.log('未建相关实例但已有缓存数据')
        this.createPoles(null, isShow)
      } else { // 啥也没有，请求数据来再创建相关实例

      }
    },

    // 加载海量点数据
    loadPolesData() { },

    // 创建桩海量点实例
    createPoles(data, isShow) {
      const convertor = new BMap.Convertor()
      let hectometer = [], kilometer = []

      // 数据整理
      if (data) { // 从接口获取完整数据来的
        for (let i = 0; i < data.length; i++) {
          const m = data[i]

          // 百度坐标转换
          convertor.translate([new BMap.Point(m.longitude, m.latitude)], 1, 5, ({ status, points }) => {
            if (status === 0) { // 如果转换成功
              if (i < 10) {
                console.log('i', i)
                console.log('m.lo m.la', m.longitude, m.latitude)
                console.log('BMap.pont()', new BMap.Point(m.longitude, m.latitude))
                console.log('转换后 point', points)
                console.log('----------------')
              }
              if (m.roadStr && m.roadStr.indexOf("+") < 0) {
                kilometer.push(points);
              } else {
                hectometer.push(points)
              }
            }
          })
        }
        that.$store.commit('poles/setHectometerData', hectometer)
        that.$store.commit('poles/setKilometerData', kilometer)
      } else { // 从vuex直接用的
        // for (let i = 0; i < this.polesHectometerData.length; i++) {
        //   const m = this.polesHectometerData[i]

        //   // 百度坐标转换
        //   convertor.translate([new BMap.Point(m.longitude, m.latitude)], 1, 5, ({ status, points }) => {
        //     if (status === 0) { // 如果转换成功
        //       // if (i < 10) {
        //       //   console.log('i', i)
        //       //   console.log('m.lo m.la', m.longitude, m.latitude)
        //       //   console.log('BMap.pont()', new BMap.Point(m.longitude, m.latitude))
        //       //   console.log('转换后 point', points)
        //       //   console.log('----------------')
        //       // }
        //       hectometer.push(points)
        //     }
        //   })
        // }

        // for (let i = 0; i < this.polesKilometerData.length; i++) {
        //   const m = this.polesKilometerData[i]

        //   // 百度坐标转换
        //   convertor.translate([new BMap.Point(m.longitude, m.latitude)], 1, 5, ({ status, points }) => {
        //     if (status === 0) { // 如果转换成功
        //       // if (i < 10) {
        //       //   console.log('i', i)
        //       //   console.log('m.lo m.la', m.longitude, m.latitude)
        //       //   console.log('BMap.pont()', new BMap.Point(m.longitude, m.latitude))
        //       //   console.log('转换后 point', points)
        //       //   console.log('----------------')
        //       // }
        //       kilometer.push(points[0])
        //     }
        //   })
        // }

        for (let i = 0; i < this.polesHectometerData.length; i++) {
          const e = this.polesHectometerData[i]

          hectometer.push(new BMap.Point(e.longitude, e.latitude))
        }

        for (let i = 0; i < this.polesKilometerData.length; i++) {
          const e = this.polesKilometerData[i]

          kilometer.push(new BMap.Point(e.longitude, e.latitude))
        }
      }

      // 创建
      this.polesObj.hectometer = new BMap.PointCollection(hectometer, {
        color: '#19bb9a',
        // shape: // 形状shape默认BMAP_POINT_SHAPE_CIRCLE圆形
        size: BMAP_POINT_SIZE_BIG
      })
      this.polesObj.kilometer = new BMap.PointCollection(kilometer, {
        color: '#19bb9a',
        shape: BMAP_POINT_SHAPE_SQUARE,// 形状shape默认BMAP_POINT_SHAPE_CIRCLE圆形
        size: BMAP_POINT_SIZE_BIG
      })

      // this.map.addOverlay(this.polesObj.hectometer)
      // this.map.addOverlay(this.polesObj.kilometer)

      // // 判断显隐
      // if (isShow) {
      //   this.polesObj.kilometer.show()
      //   this.zoom >= 14 ? this.polesObj.hectometer.show() : this.polesObj.hectometer.hide()
      // } else {
      //   this.polesObj.hectometer.hide()
      //   this.polesObj.kilometer.hide()
      // }
    }
  }
}