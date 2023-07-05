<template>
  <div class="map-wrap">
    <m-map ref="map" :mapConfig="mapConfig" :top="top" :left="left" @map-load="onMapLoad" :bottom="bottom" />
    <WindowInfo ref="windowInfo" v-show="windowInfoVisible" />
  </div>
</template>

<script>
import WindowInfo from './WindowInfo'

export default {
  /**
   * @description     地图入口
   * @author          刘晖(liuh@microvideo.cn)
   * @time            2021/11/9 11:50
   * @updata          by smigoo:制作vue3.0版本地图组件
   */
  name: 'Index',
  components: { WindowInfo },
  data() {
    return {
      map: null, // 组件传过来的实例
      left: [
        {
          id: 'addMarkers',
          title: '工区-添加标记点2domo',
          buttonType: 'gq',
          eventType: 'mapMark',
          loadData: this.getAddMarkers2,
          before: () => {
            console.log('发生前的回调')
          },
          onClick: (e, data) => {
            console.log(e, data, '地图覆盖物点击回调事件')
          },
          after: (map, markers) => {
            // 将本次生成赋值到this
            this[`onlyMarkers`] = markers
          },
          // 仅删除本次生成点的示范
          cancelEvent: () => {
            if (this.onlyMarkers && this.onlyMarkers.length) {
              this.$mapFunction.removeMark(this.onlyMarkers)
            }
          }
        },
        {
          id: 'fwq',
          title: '服务区-移除所有标记点domo',
          buttonType: 'fwq',
          eventType: 'removeMark',
          loadData: null,
          before: () => {
            console.log('发生前的回调')
          },
          after: () => {
            console.log('发生后的回调')
          }
        },
        {
          id: 'sfz',
          title: '收费站',
          buttonType: 'sfz',
          eventType: 'mapMark',
          loadData: null,
          before: () => {
            console.log('发生前的回调')
          },
          after: () => {
            console.log('发生后的回调')
          }
        },
        {
          id: 'qd',
          title: '汽渡-显示标记点domo',
          buttonType: 'qd',
          eventType: 'showMarker',
          loadData: null,
          before: () => {
            console.log('发生前的回调')
          },
          after: () => {
            console.log('发生后的回调')
          }
        },
        {
          id: 'tcq',
          title: '停车场-创建弹框domo',
          buttonType: 'tcq',
          eventType: 'createWindow',
          loadData: () => {
            const data = {
              content: this.$refs.windowInfo.$el,
              path: [119.378231 + 0.48058 * 1.5 * Math.random(), 32.458852 + 0.60079 * 1.5 * Math.random()]
            }
            this.windowInfoVisible = true
            return data
          },
          before: () => {
            console.log('发生前的回调')
          },
          onClick: (e, data) => {
            console.log(e, data, '地图覆盖物点击回调事件')
          },
          after: () => {
            console.log('发生后的回调')
          }
        },
        {
          id: 'custom5',
          title: '打开实时路况domo',
          buttonType: 'custom',
          eventType: 'openTraffic',
          loadData: () => {
            null
          },
          icon: [`${require('@/assets/images/map-demo/traffic.png')}`, `${require('@/assets/images/map-demo/traffic-a.png')}`],
          before: () => {
            console.log('发生前的回调')
          },
          after: () => {
            console.log('发生后的回调')
          }
        }
      ],
      bottom: [
        {
          id: 'sn',
          title: '枢纽-关闭窗体domo',
          buttonType: 'sn',
          eventType: 'closeWindowInfo',
          loadData: () => {
            this.windowInfoVisible = false
          },
          before: () => {
            console.log('发生前的回调')
          },
          after: () => {
            console.log('发生后的回调')
          }
        },
        {
          id: 'ql',
          title: '桥梁-获取中心点domo',
          buttonType: 'ql',
          eventType: 'getMapCenter',
          loadData: null,
          before: () => {
            console.log('发生前的回调')
          },
          after: (map, center) => {
            this.$message.success('中心点坐标为：' + center.pos.join(','))
          }
        },
        {
          id: 'sd',
          title: '隧道-获取层级domo',
          buttonType: 'sd',
          eventType: 'getMapZoom',
          loadData: null,
          before: () => {
            console.log('发生前的回调')
          },
          after: (map, zoom) => {
            this.$message.success('当前缩放层级为：' + zoom)
          }
        },
        {
          id: 'lx',
          title: '路线-区域镂空效果demo',
          buttonType: 'lx',
          eventType: 'showArea',
          loadData: () => {
            return '江苏省'
          }
        },
        {
          id: 'zh',
          title: '桩号-设置显示范围domo',
          buttonType: 'zh',
          eventType: 'setMapBounds',
          loadData: () => {
            return [
              [118.27467, 32.255442],
              [119.609509, 31.714976]
            ]
          },
          before: () => {
            console.log('发生前的回调')
          },
          onClick: (e, data) => {
            console.log(e, data, '地图覆盖物点击回调事件')
          },
          after: () => {
            console.log('发生后的回调')
          }
        }
      ],
      top: [
        {
          id: 0,
          title: '一个自定义事件',
          buttonType: 'custom', // 自定义样式
          eventType: this.myEvent,
          icon: [
            `${require('@/assets/images/map-demo/icon1.png')}`, // 正常状态 本地图片需要require
            `${require('@/assets/images/map-demo/icon1-a.png')}` // 激活状态
          ],
          before: () => {
            console.log('发生前的回调')
          },
          after: () => {
            console.log('完成了一个自定义事件')
          }
        },
        {
          id: 'custom2',
          title: '热力图demo', // 鼠标移时展示的描述,打点测试
          buttonType: 'custom',
          eventType: 'heatMap', // 热力图
          loadData: () => {
            const points = [
              {
                path: [120.63719, 31.085986],
                count: 100,
                name: '标题1'
              },
              {
                path: [120.826878, 31.209575],
                count: 100,
                name: '标题2'
              },
              {
                path: [120.67322820959635, 31.556686095801712],
                count: 100,
                name: '标题3'
              }
            ]
            const config = {
              radius: 30
              // gradient: {
              //   0.4: '#FD4F59',
              //   0.65: '#5CB4A6',
              //   0.85: '#FC7EAD',
              //   1.0: '#FEFA63'
              // }
            }
            return {
              points,
              config
            }
          },
          icon: [`${require('@/assets/images/map-demo/han.png')}`, `${require('@/assets/images/map-demo/han-a.png')}`],
          before: () => {
            console.log('发生前的回调')
          },
          onClick: (e, data) => {
            this.$message.success('添加了热力图点击事件：' + data.name)
            console.log(e, data, '热力图点击事件')
          },
          after: () => {
            console.log('发生后的回调---热力图对象', this.$refs.map.heatMap)
          }
        },
        {
          id: 'custom4',
          title: '设置添加图层domo',
          buttonType: 'custom', // 自定义样式
          eventType: 'addLayer', // 添加图片图层
          loadData: () => {
            return {
              url: require('@/assets/images/map-demo/newMap.png'),
              path: [
                [105.054228, 19.197873],
                [130.202934, 42.1416]
              ],
              zooms: [7, 10],
              opacity: 0.9
            }
          },
          style: ``,
          icon: [`${require('@/assets/images/map-demo/layer.png')}`, `${require('@/assets/images/map-demo/layer-a.png')}`],
          before: () => {
            console.log('发生前的回调')
          },
          onClick: (e, data) => {
            console.log(e, data, '地图覆盖物点击回调事件')
          },
          after: () => {
            console.log('发生后的回调')
          }
        },
        {
          id: 'custom1',
          title: '添加地图控件domo',
          buttonType: 'custom',
          eventType: 'mapControl',
          loadData: () => {
            return ['scale', 'toolBar', 'controlBar', 'overView']
          },
          icon: [`${require('@/assets/images/map-demo/controls.png')}`, `${require('@/assets/images/map-demo/controls-a.png')}`]
        },
        {
          id: 'custom2',
          title: '右击菜单domo',
          buttonType: 'custom',
          eventType: 'mapRightClick',
          loadData: () => {
            return [
              {
                name: '绘制矩形',
                event: this.drawRegion,
                param: 'rectangle'
              },
              {
                name: '绘制圆形',
                event: this.drawRegion,
                param: 'circle'
              },
              {
                name: '绘制多边形',
                event: this.drawRegion,
                param: {
                  name: 'polygon',
                  lineColor: '#ffffff',
                  areaColor: '#ff0000'
                }
              },
              {
                name: '清除绘制内容',
                event: this.clearRegion
              }
            ]
          },
          icon: [`${require('@/assets/images/map-demo/menu.png')}`, `${require('@/assets/images/map-demo/menu-a.png')}`],
          before: () => {
            console.log('发生前的回调')
          },
          after: () => {
            console.log('发生后的回调')
          }
        },
        {
          id: 'lk',
          title: '路况-标记点demo',
          buttonType: 'lk',
          eventType: 'mapMark',
          // cancelEvent:'',当checked为false时，默认执行取消事件。如果想要自定义需要使用cancelEvent字段。
          loadData: this.getAddMarkers,
          before: map => {
            console.log('发生前的回调')
          },
          onClick: (e, data) => {
            this.$message.success(`点击了${data.name}`)
            console.log(e, data, '点击地图覆盖物回调事件')
          },
          mouseOver: (e, data) => {
            console.log(e, data, 'mouseOver地图覆盖物回调事件')
          },
          mouseOut: (e, data) => {
            console.log(e, data, 'mouseOut覆盖物回调事件')
          },
          after: (map, instance) => {
            console.log(instance, map, '打点后获取的点数组')
          }
        },
        {
          id: 'qbb',
          title: '情报板-可拖动区域domo',
          buttonType: 'qbb',
          eventType: 'limitBounds',
          loadData: () => {
            // 获取传参的方法
            return [
              [118.27467, 32.255442],
              [119.609509, 31.714976]
            ]
          },
          before: () => {
            console.log('发生前的回调')
          },
          onClick: (e, data) => {
            console.log(e, data, '地图覆盖物点击回调事件')
          },
          after: () => {
            const item = this.top.filter(item => item.id === 'qbb')[0]
            const isChecked = item.isChecked
            console.log(isChecked, this.map.getBounds(), '可拖动区域')
            if (isChecked) {
              this.$message.success('地图范围设置成功')
            } else {
              this.$message.success('地图范围清除成功')
            }
          }
        },
        {
          id: 'jdd',
          title: '交调点-切换地图样式domo',
          buttonType: 'jdd',
          eventType: 'mapStyle',
          before: () => {},
          loadData: () => {
            if (
              this.mapConfig.mapStyle == 'amap://styles/9cdea5bfec221e6791bb4492c74a0fbd' // 浅
            ) {
              this.mapConfig.mapStyle = 'amap://styles/71422d8cf6d8e6228fc5283f83817efa'
              return '71422d8cf6d8e6228fc5283f83817efa'
            } else {
              this.mapConfig.mapStyle = 'amap://styles/9cdea5bfec221e6791bb4492c74a0fbd'
              return '9cdea5bfec221e6791bb4492c74a0fbd'
            }
          }
        },
        {
          id: 'dlsj',
          title: '道路事件-画线domo',
          buttonType: 'dlsj',
          eventType: 'createLine',
          loadData: () => {
            const data = [
              {
                name: 'S58',
                path: [
                  [120.338348, 31.458074],
                  [120.332769, 31.453736],
                  [120.328542, 31.450551],
                  [120.32498, 31.448391],
                  [120.317899, 31.444949],
                  [120.301848, 31.437736],
                  [120.294016, 31.434166],
                  [120.286227, 31.430907],
                  [120.275048, 31.427264],
                  [120.26552, 31.423913],
                  [120.257281, 31.42135],
                  [120.245779, 31.420086],
                  [120.236338, 31.420709],
                  [120.234514, 31.421093],
                  [120.234514, 31.421093]
                ],
                config: {
                  lineWidth: 8,
                  lineColor: '#FF0000',
                  selectWidth: 10,
                  selectColor: '#2eff00'
                }
              },
              {
                name: '太湖隧道道路',
                path: [
                  [120.234514, 31.421093],
                  [120.217949, 31.426238],
                  [120.208078, 31.431603],
                  [120.201621, 31.43504],
                  [120.155938, 31.459442],
                  [120.138493, 31.46885],
                  [120.137227, 31.469344]
                ],
                config: {
                  lineWidth: 8,
                  lineColor: 'yellow',
                  selectWidth: 10,
                  selectColor: '#FFEA00',
                  lineStyle: 'dashed'
                }
              }
            ]
            return data
          },
          before: () => {
            console.log('发生前的回调')
          },
          onClick: (e, data) => {
            console.log('点击回调')
            this.$message.success('点击了' + data.name)
          },
          mouseOver: (e, data) => {
            console.log(e, data, 'mouseOver画线的回调')
          },
          mouseOut: (e, data) => {
            console.log(e, data, 'mouseOut画线的回调')
          },
          after: (map, line) => {
            this['currLine'] = line
            console.log('发生后的回调', line, this.currLine)
          }
        },
        {
          id: 'sxt',
          title: '摄像头-聚合domo',
          buttonType: 'sxt',
          eventType: 'markerCluster', // 创建聚合点
          loadData: () => {
            const points1 = []
            const points2 = []
            const points3 = []
            for (let i = 0; i < 100; i++) {
              points1.push({
                icon: 'normal-icon-gs-qbb',
                path: [120.234514 + 0.48058 * 0.9 * Math.random(), 31.426238 + 0.30079 * 0.1 * Math.random()],
                size: [50, 50],
                type: 0
              })
              points2.push({
                icon: 'normal-icon-gs-sfz',
                path: [120.138493 + 1.48058 * 6.1 * Math.random(), 31.459442 + 0.20079 * 2.6 * Math.random()],
                size: [30, 30],
                type: 1
              })
              points3.push({
                icon: 'normal-icon-gs-fwq',
                path: [120.201621 + 0.48058 * 1.5 * Math.random(), 31.469344 + 0.10079 * 0.3 * Math.random()],
                type: 2
              })
            }
            return [
              {
                color: 'green',
                arr: points1
              },
              {
                color: 'yellow',
                arr: points2
              },
              {
                color: 'red',
                arr: points3
              }
            ]
          },
          before: () => {
            console.log('发生前的回调')
          },
          after: () => {
            console.log('发生后的回调')
          }
        },

        {
          id: 'jycl',
          title: '救援车辆-海量点domo',
          buttonType: 'jycl',
          eventType: 'massPointUI', // 添加海量点
          loadData: () => {
            var data = this.createPoints(this.$mapFunction.getMapCenter(), 100000)
            return {
              data,
              // 在线生成配置参考网站：
              // https://webapi.amap.com/ui/1.1/ui/misc/PointSimplifier/examples/adjust-style.html
              config: {
                color: 'blue',
                url: require('@/assets/images/map-demo/icon-jc.png'),
                width: 20,
                height: 18
              }
            }
          },
          before: () => {
            console.log('发生前的回调')
          },
          onClick: (e, data) => {
            console.log(data.data.data.title, '海量点回调事件')

            this.$message.success('点击了，当前点数据标题为：' + data.data.data.title)
          },
          after: () => {
            console.log('发生后的回调')
          }
        },
        {
          id: 'jc',
          title: '警车',
          buttonType: 'jc',
          eventType: 'mapMark',
          loadData: null,
          before: () => {
            console.log('发生前的回调')
          },
          onClick: (e, data) => {
            console.log(e, data, '地图覆盖物点击回调事件')
          },
          after: () => {
            console.log('发生后的回调')
          }
        },
        {
          id: 'zfc',
          title: '执法车',
          buttonType: 'zfc',
          eventType: 'mapMark',
          loadData: null,
          before: () => {
            console.log('发生前的回调')
          },
          onClick: (e, data) => {
            console.log(e, data, '地图覆盖物点击回调事件')
          },
          after: () => {
            console.log('发生后的回调')
          }
        }
      ],
      type: [
        {
          type: 'lk'
        },
        {
          type: 'qbb'
        }
      ],
      mapConfig: {
        zoom: 8,
        center: [120.5042185, 31.3285654]
      },
      markers: null,
      mouseTool: null,
      windowInfoVisible: null
    }
  },
  methods: {
    /*
     * 自定义事件
     */
    myEvent() {
      // 获取激活状态可以定义不同事件（建议根据id判断，现为示范）
      const isChecked = this.top[0].isChecked
      if (isChecked) {
        // 激活
        const position = [116.341811, 39.9055024]
        const zooms = 12
        this.$mapFunction.setCenterAndZoom(position, zooms)
        this.$message.success('移动到了116.341811, 39.9055024，层级为12')
      } else {
        // 未激活
        const position = [120.5042185, 31.328565]
        const zooms = 9
        this.$mapFunction.setCenterAndZoom(position, zooms)
        this.$message.success('移动到了120.5042185, 31.328565，层级为9')
        console.log('turn off')
      }
    },
    /*
     * 获取需要显示的点坐标
     */
    getAddMarkers() {
      const points = [
        {
          icon: 'normal-icon-gl-etc',
          path: [120.102398, 30.867198],
          name: '湖州',
          size: [32, 32],
          data: {
            title: '可添加业务信息'
          }
        },
        {
          icon: 'normal-icon-gs-qbb',
          path: [120.57345, 31.2953],
          name: '虎丘区',
          size: [32, 36]
        },
        {
          icon: 'normal-icon-gs-tcp',
          path: [120.42038, 30.86686],
          name: '南浔区',
          size: [32, 36]
        },
        {
          icon: 'normal-icon-gs-qbb',
          path: [120.638317, 31.159815],
          name: '业务标题22',
          size: [32, 36]
        },
        {
          icon: 'normal-icon-gs-qbb',
          path: [120.236338, 31.420709],
          name: '业务标题72',
          size: [32, 36]
        }
      ]
      return points
    },
    /*
     * 获取需要显示的点坐标
     */
    getAddMarkers2() {
      const points = [
        {
          icon: 'normal-icon-gl-etc',
          path: [120.737129, 31.030807],
          name: '业务标题',
          size: [32, 32],
          data: {
            title: '可添加业务信息'
          }
        },
        {
          icon: 'normal-icon-gs-qbb',
          path: [120.59819, 31.3301349],
          name: '业务标题2',
          size: [32, 36]
        }
      ]
      return points
    },
    // 海量点测试
    createPoints(center, num) {
      var data = []
      for (var i = 0, len = num; i < len; i++) {
        data.push({
          position: [center.getLng() + (Math.random() > 0.5 ? 1 : -1) * Math.random(), center.getLat() + (Math.random() > 0.5 ? 1 : -1) * Math.random()],
          // 业务信息
          data: {
            title: '测试1' + Math.round(Math.random() * 100 + 20), // 想要显示的标题
            date: '2022-01-06'
          }
        })
      }
      return data
    },
    // 绘图
    drawRegion(type) {
      this.$mapFunction.drawMapRegion(type, this.markers, (e, data) => {
        data.map((item, index) => {
          this.$mapFunction.setMapMarkerStyle(item, 'icon-event-jtsg')
        })
        console.log('区域内点有' + data.length + '个')
      })
    },
    // 清除绘图
    clearRegion() {
      this.$mapFunction.clearMapRegion(this.mouseTool)
    },
    onMapLoad(map) {
      this.map = map
    }
  },
  mounted() {},
  created() {}
}
</script>

<style lang="less" scoped>
.map-wrap {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  position: relative;
}
</style>
