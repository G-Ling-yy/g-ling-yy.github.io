<template>
  <div class="page">
    <!-- 引入地图 -->
    <mv-map
      :mapConfig="{
        theme: 'light',
        animateEnable: true,
        center: [119.328793, 32.87042],
        mapStyle: 'amap://styles/whitesmoke'
      }"
      ref="mvMapRef"
      @map-load="mvMapLoad"
    ></mv-map>

    <!-- 标记点浮窗 -->
    <MarkerFloatWindow
      :marker="curHoverMarker"
      :visible="markerFloatWindowShow"
      :x="markerFloatWindowPosition.x"
      :y="markerFloatWindowPosition.y"
    />

    <!-- 内容展示 -->
    <div class="wrapper">
      <!-- 上阴影 -->
      <div class="top-shadow" />

      <!-- 左侧栏 -->
      <aside
        :class="[
          'left',
          !asidesControl.leftAsideShow && 'hide'
        ]"
      >
        <!-- 收展按钮 -->
        <div
          class="shrink-btn btn flex-center"
          @click="
            asidesControl.leftAsideShow =
              !asidesControl.leftAsideShow
          "
        >
          <icon icon="arrow-left-s-line" />
        </div>

        <!-- 报警摄像机列表 块 -->
        <section class="block camera">
          <!-- 标题 -->
          <div class="title">
            <h1>报警摄像机列表</h1>
          </div>
          <!-- 树内容容器 -->
          <div class="content-wrap tree">
            <div class="content">
              <!-- 树 -->
              <ma-tree
                v-model:expandedKeys="expandedKeys"
                block-node
                :fieldNames="{
                  children: 'list',
                  title: 'name',
                  key: 'id'
                }"
                show-icon
                show-line
                :tree-data="treeData"
                @select="treeNodeSelectHandler"
              >
                <!-- 前置图标 -->
                <template #icon="{ signStatus }">
                  <template v-if="signStatus !== null">
                    <img
                      :src="icons[`icon-${signStatus}`]"
                      alt=""
                      class="icon"
                    />
                  </template>
                </template>

                <!-- 标题内容 -->
                <template
                  #title="{
                    name,
                    signStatus,
                    endRegionCodeName
                  }"
                >
                  <span class="title">{{ name }}</span>

                  <span
                    v-if="
                      signStatus !== null &&
                      endRegionCodeName
                    "
                    class="suffix"
                  >
                    &nbsp;(往{{ endRegionCodeName }}方向)
                  </span>
                </template>
              </ma-tree>

              <!-- 空数据 -->
              <div
                v-show="!treeData?.length"
                class="empty-wrap flex-center"
              >
                <ma-empty
                  description="当前管辖区域暂无报警事件"
                  :image="Empty.PRESENTED_IMAGE_SIMPLE"
                />
              </div>

              <!-- 树loading -->
              <div
                class="loading flex-center"
                v-show="treeLoading"
              >
                <ma-spin size="large" />
              </div>
            </div>
          </div>
        </section>

        <!-- 今日报警事件 块 -->
        <section class="block alarm">
          <!-- 标题 -->
          <div class="title">
            <h1>今日报警事件</h1>
          </div>
          <!-- 图内容容器 -->
          <div class="content-wrap chart">
            <div class="content">
              <!-- 图表 -->
              <TodayAlarmChart ref="todayAlarmChartRef" />
            </div>
          </div>
        </section>

        <!-- 底部额外跟随 -->
        <div class="bottom-extra">
          <!-- 报警条数 -->
          <div
            :class="[
              'alarm-count-wrap',
              alarmCountShow && 'show'
            ]"
          >
            <!-- 显隐按钮 -->
            <div
              class="btn flex-center"
              @click="alarmCountShow = !alarmCountShow"
            >
              <icon icon="filter-line" />
            </div>

            <!-- 内容面板 -->
            <div class="panel-wrap">
              <div
                :class="[
                  'panel',
                  checkedAlarmStatus > 0 && 'checked'
                ]"
              >
                <div
                  v-for="alarmStatus of 3"
                  :class="[
                    'content-box',
                    `box-${alarmStatus}`,
                    alarmStatus === checkedAlarmStatus &&
                      'checked'
                  ]"
                  :key="alarmStatus"
                  @click="filterMarkersShow(alarmStatus)"
                >
                  <!-- icon -->
                  <img
                    :src="icons[`icon-${alarmStatus}`]"
                    alt=""
                    class="icon"
                  />
                  <!-- text -->
                  <div class="text">
                    <div class="title">
                      {{
                        `${
                          {
                            1: '未',
                            2: '超过5分钟',
                            3: '5分钟内'
                          }[alarmStatus] || ''
                        }确认报警`
                      }}
                    </div>
                    <div class="count">
                      <span>{{
                        alarmCountData[alarmStatus]
                      }}</span
                      >条
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <!-- 右侧栏 -->
      <aside
        :class="[
          'right',
          !asidesControl.rightAsideShow && 'hide'
        ]"
      >
        <!-- 收展按钮 -->
        <div
          class="shrink-btn btn flex-center"
          @click="hideRightAside"
        >
          <icon icon="arrow-right-s-line" />
        </div>

        <!-- 直播摄像机 块 -->
        <section class="block live">
          <!-- 标题 -->
          <div class="title flex-center">
            <img
              :src="icons[`icon-${alarmInfos.status}`]"
              alt=""
              class="icon"
            />
            <h1
              class="ellipsis"
              :title="alarmInfos.cameraName"
            >
              {{ alarmInfos.cameraName }}
            </h1>
          </div>
          <!-- 直播视频区域 -->
          <div class="live-wrap">
            <div class="live-container">
              <!-- WebRCT播放器 -->
              <WebRTCPlayer
                v-if="asidesControl.rightAsideShow"
                :options="liveOptions"
              />
            </div>
          </div>
        </section>

        <!-- 事件动态 块 -->
        <section class="block trends">
          <!-- 标题 -->
          <div class="title">
            <h1>事件动态</h1>
          </div>
          <!-- 事件动态内容 -->
          <div
            :class="[
              'event-trends-container',
              animation && 'animation'
            ]"
            @animationend="animation = false"
          >
            <div
              v-for="(eventTrend, i) of eventTrends"
              class="event-trend"
              :key="i"
            >
              <template v-if="eventTrend.bodyId">
                <p class="text">
                  <span class="time">
                    {{ eventTrend.time }}
                  </span>
                  <span class="time-describe">
                    {{ eventTrend.timeDifference }}
                  </span>
                </p>
                <p class="text">
                  <span class="obj">
                    {{
                      `${
                        eventTrend.objectNum > 0
                          ? `${eventTrend.objectNum} ${
                              eventTrend.objectTypeName?.includes(
                                '车'
                              )
                                ? '辆'
                                : '个'
                            }`
                          : ''
                      }${eventTrend.objectTypeName} - ${
                        eventTrend.eventTypeName
                      }`
                    }}
                  </span>
                </p>

                <!-- 视频区域 -->
                <div class="video-wrap">
                  <div class="video-container">
                    <!-- Video组件 -->
                    <Video
                      :src="eventTrend?.begMediaUrl"
                      :showSnapshotBtn="false"
                      :framesUrl="eventTrend?.markUrl"
                    />

                    <!-- 标定状态标记 -->
                    <div
                      :class="[
                        'calibrate-status',
                        eventTrend.isPersonMark
                          ? eventTrend.isCorrect
                            ? 'right'
                            : 'wrong'
                          : ''
                      ]"
                    >
                      {{
                        eventTrend.isPersonMark
                          ? eventTrend.isCorrect
                            ? '正确'
                            : '错误'
                          : '未标定'
                      }}
                    </div>
                  </div>
                </div>
              </template>

              <template v-else-if="eventTrend.userName">
                <p class="text">
                  <span class="time">
                    {{ eventTrend.time }}
                  </span>
                  <span class="time-describe">
                    {{ eventTrend.timeDifference }}
                  </span>
                </p>

                <p class="text">
                  <span class="user">{{
                    eventTrend.userName || '[未知用户]'
                  }}</span
                  >&nbsp;标定&nbsp;
                  <span class="strong">
                    {{ eventTrend.alarmTimeDifference
                    }}{{ eventTrend.begTime }}
                    {{
                      `${
                        eventTrend.objectNum > 0
                          ? `${eventTrend.objectNum} ${
                              eventTrend.objectTypeName?.includes(
                                '车'
                              )
                                ? '辆'
                                : '个'
                            }`
                          : ''
                      }${eventTrend.objectTypeName} - ${
                        eventTrend.eventTypeName
                      }`
                    }} </span
                  >&nbsp;为&nbsp;
                  <span
                    :class="{
                      status: true,
                      correct: eventTrend.isCorrect
                    }"
                  >
                    {{
                      eventTrend.isCorrect ? '正确' : '错误'
                    }}
                  </span>
                </p>
                <p
                  v-if="eventTrend.reportType > 0"
                  class="text"
                >
                  <span class="report">
                    上报{{
                      {
                        1: '救援',
                        2: '事故'
                      }[eventTrend.reportType]
                    }}
                    —— 推送指挥调度云
                  </span>
                </p>
              </template>
            </div>

            <!-- loading -->
            <div
              v-show="eventTrendsLoading"
              class="loading flex-center"
            >
              <ma-spin size="large" />
            </div>
          </div>
        </section>

        <!-- 提示 -->
        <div class="tip ellipsis">
          *报警信息来源：<span
            v-for="corp of alarmInfos.sourceCorps"
            :key="corp.corp"
            >{{ corp.corpName }}</span
          >
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  reactive,
  onMounted,
  onBeforeUnmount,
  getCurrentInstance
} from 'vue'
// 引入 今日报警事件图表
import TodayAlarmChart from './modules/TodayAlarmChart.vue'
// 引入 标记点浮窗
import MarkerFloatWindow from './modules/MarkerFloatWindow.vue'
import apis from '@/api'
// webRTC播放器
import WebRTCPlayer from '@/components/base/WebRTCPlayer/index.vue'
// 标框播放器
import Video from '@/components/base/Video.vue'
import { Empty } from 'ant-design-vue'
import { websocketURL as proSockJSUrl } from '@/config'

/* gcoord转换地图坐标 */
const gcoord =
  getCurrentInstance().appContext.config.globalProperties
    .$gcoord

/* 相关图标 */
const icons = [1, 2, 3].reduce((acc, e) => {
  acc[
    `icon-${e}`
  ] = require(`@images/mv-map/alarm_icon_0${e}.png`)
  return acc
}, {})

/* 地图相关 */
const mvMapRef = ref(),
  // 地图加载完成回调
  mvMapLoad = map => {
    mvMapAMap = map
    mvMapInstance = mvMapRef.value?.$mapSdk('mv-map')

    /* 创建选中点标记 */
    checkedMarker = mvMapInstance?.createMvMapMarkerLayer({
      icon: 'icon-alarm-1',
      path: [0, 0],
      offset: [-30, -34],
      size: [60, 60],
      zIndex: 110 // 点标记的叠加顺序，默认100
    })
    checkedMarker.hide()
    checkedMarker.on('mouseover', e => {
      // 浮窗显示及定位
      const { clientX: x, clientY: y } = e.originEvent
      curHoverMarker.value = checkedMarker.getExtData()
      markerFloatWindowShow.value = true
      markerFloatWindowPosition.x = `${x + 30}px`
      markerFloatWindowPosition.y = `${y}px`
    })

    checkedMarker.on('mouseout', e => {
      markerFloatWindowShow.value = false
    })

    // 实时路况图层
    new AMap.TileLayer.Traffic({
      autoRefresh: true,
      zIndex: 10
    }).setMap(mvMapAMap)

    // 获取报警点位数据
    getAlarmPoints()

    // 获取64路poc点位数据
    getPocPoints()

    // 行政边界区域绘制
    ;(async () => {
      provinceLayer =
        await mvMapInstance.createMvMapProvince(
          provinceConfig
        )
    })()
  },
  // 行政边界区域配置
  provinceConfig = {
    code: '320000', // 区域码
    depth: 1, // 区域类型（1 省, 2 区, 3 县）
    fillColor: '#1a79ff26', // 填充色
    cityBorderColor: '#888', // 市级区域边界色
    countyBorderColor: 'transparent', // 县级区域边界色
    // 区域边界（false 则 不绘制）
    provinceBorder: {
      borderColor: '#006cff', // 区域边界色
      borderWeight: 2 // 区域边界宽
    },
    // 区域外界（false 则 不绘制）
    // provinceOutside: false
    provinceOutside: {
      borderColor: 'transparent', // 外界边界色
      borderWeight: 0, // 外界边界宽
      fillColor: '#DEE7FF', // 外界填充色
      fillOpacity: 0.3, // 外界填充色透明度
      bubble: false // 图层遮罩是否允许点击事件冒泡 默认false
    }
  }

// 标记点浮窗显隐
const markerFloatWindowShow = ref(false),
  curHoverMarker = ref({}), // 当前hover的marker标记点
  // 标记点浮窗位置
  markerFloatWindowPosition = reactive({
    x: '40%',
    y: '50%'
  })

// 获取报警点位数据
const getAlarmPoints = () =>
    apis.alarmLive.getAlarmsByFilter().then(res => {
      // 若 有值 （则 打点）
      if (res?.alarmCameraDetails?.length) {
        const points = res.alarmCameraDetails.map(e => ({
          storyId: e.storyId,
          id: e.cameraId,
          path: gcoord.transform(
            [Number(e.lon), Number(e.lat)],
            gcoord.WGS84,
            gcoord.GCJ02
          ),
          icon: `icon-alarm-${e.signStatus}`,
          signStatus: e.signStatus,
          // name: e.storyId,
          // zIndex: 100, // 点标记的叠加顺序，默认100
          size: [30, 30],
          visible: checkedAlarmStatus.value
            ? e.signStatus == checkedAlarmStatus.value
            : true
        }))

        // 清除之前可能的markers
        mvMapInstance?.removeMvMapMarkerLayer(markers)

        markers = mvMapInstance?.createMvMapMarkerLayer(
          points,
          {},
          (e, { id, storyId, path, icon }) => {
            // 隐藏当前实际标记
            // lastCheckedMarkerInstance?.show()
            // lastCheckedMarkerInstance = e.target
            // lastCheckedMarkerInstance?.hide()

            // 展开右侧栏
            asidesControl.rightAsideShow = true

            // 选中标记赋值与显示
            checkedMarker.setExtData({
              storyId
            })
            mvMapInstance.setMvMapMarkerIcon(
              checkedMarker,
              icon
            )
            checkedMarker.setPosition(path)
            checkedMarker.show()

            // 设置地图中心位置及缩放至11级
            // mvMapAMap.setZoomAndCenter(
            //   11,
            //   e.target.getPosition()
            // )

            // 获取直播参数
            getLiveOptions(id)

            // 获取事件动态
            getEventTrends(storyId)
          }
        )

        markers.forEach(marker => {
          marker.on('mouseover', e => {
            // 浮窗显示及定位
            const { clientX: x, clientY: y } = e.originEvent
            curHoverMarker.value = marker.getExtData()
            markerFloatWindowShow.value = true
            markerFloatWindowPosition.x = `${x + 30}px`
            markerFloatWindowPosition.y = `${y}px`
          })

          marker.on('mouseout', e => {
            markerFloatWindowShow.value = false
          })
        })
      }

      // 报警数量赋值
      alarmCountData[1] = res.unconfirmedCount
      alarmCountData[2] = res.overFiveCount
      alarmCountData[3] = res.withinFiveCount
    }),
  // 获取64路poc点位数据
  getPocPoints = () => {
    apis.alarmLive.getPocCameras().then(({ data }) => {
      // console.log('获取64路poc点位数据 data', data)
      // 若 有值 （则 打点）
      if (data?.length) {
        const points = data.map(e => ({
          id: e.cameraId,
          path: gcoord.transform(
            [Number(e.lon), Number(e.lat)],
            gcoord.WGS84,
            gcoord.GCJ02
          ),
          icon: `icon-poc`
        }))

        massMarksLayer =
          mvMapInstance?.createMvMapMassMarksLayer(points, {
            iconSize: [12, 12],
            iconAnchor: 'bottom-center'
            // zIndex: 110 // 图层叠加的顺序值 默认 110
          })
      }
    })
  }

let mvMapInstance, // mv-map实例
  mvMapAMap, // mv-map实例中的map地图实例
  markers, // 点标记数据
  checkedMarker, // 选中点标记
  // lastCheckedMarkerInstance, // 最近选中点标记实例
  massMarksLayer, // 海量点
  provinceLayer // 行政边界区域

/* 左右两侧栏控制 */
const asidesControl = reactive({
    leftAsideShow: true, // 左侧栏显隐
    rightAsideShow: false // 右侧栏显隐
  }),
  // 关闭右侧栏
  hideRightAside = () => {
    // 隐藏选中标记
    checkedMarker?.hide()

    // 还原最近选中点标记实例
    // lastCheckedMarkerInstance?.show()
    // lastCheckedMarkerInstance = null

    asidesControl.rightAsideShow =
      !asidesControl.rightAsideShow
  }

/* 左侧栏 */
/* 报警摄像机列表树 */
const treeData = ref([]), // 列表树数据
  // 列表树展开节点
  expandedKeys = ref([]),
  // 列表树loading
  treeLoading = ref(false),
  // 获取列表树数据
  getTreeData = (showLoading = true) => {
    showLoading && (treeLoading.value = true)

    apis.alarmLive
      .getAlarmsTree()
      .then(res => {
        treeData.value = res

        // 若 首次加载树数据
        if (!expandedKeys.value.length && res.length) {
          // 默认展开第一层摄像机节点
          expandedKeys.value = getFirstFinalNodeIds(res[0])
        }
      })
      .finally(() => {
        treeLoading.value = false
      })
  },
  // 树节点点击触发
  treeNodeSelectHandler = (
    selectedKeys,
    { node, selectedNodes }
  ) => {
    // 若 非叶子摄像机节点
    if (node.signStatus === null) {
      // 点击自动收展
      // 若 当前节点展开
      if (node.expanded) {
        // 收起
        const i = expandedKeys.value.findIndex(
          e => e === node.id
        )
        expandedKeys.value.splice(i, 1)
      } else {
        // 展开
        expandedKeys.value = expandedKeys.value.concat(
          node.id
        )
      }
    } else {
      /* 叶子摄像机节点 */
      // 展开右侧栏
      asidesControl.rightAsideShow = true

      // 获取直播参数
      getLiveOptions(selectedNodes[0].id)

      // 获取事件动态
      getEventTrends(selectedNodes[0].storyId)

      // 尝试对应地图摄像机
      const point = markers.find(
        e => e.getExtData()?.id === node.dataRef.id
      )
      // 若 有对应标记点
      if (point) {
        const { path, icon } = point.getExtData(),
          storyId = node.dataRef.storyId

        // 设置地图中心位置
        mvMapAMap.setCenter(path)

        // 选中标记赋值与显示
        checkedMarker.setExtData({
          storyId
        })
        mvMapInstance.setMvMapMarkerIcon(
          checkedMarker,
          icon
        )
        checkedMarker.setPosition(path)
        checkedMarker.show()
      }
    }
  },
  // 获取至第一个最终非摄像机子节点的id数组
  getFirstFinalNodeIds = data => {
    const ids = []

    getChildNodeId(data)

    function getChildNodeId(node) {
      ids.push(node?.id)

      node?.list?.length &&
        node?.signStatus === null &&
        getChildNodeId(node?.list[0])
    }

    return ids
  }

/* 今日报警事件 */
const todayAlarmChartRef = ref()

/* 报警数量信息相关 */
const alarmCountShow = ref(false), // 报警数量信息显隐
  // 报警数量信息数据
  alarmCountData = reactive({
    1: 0,
    2: 0,
    3: 0
  }),
  // 当前选中显示的报警状态值
  checkedAlarmStatus = ref(0),
  // 筛选markers显示
  filterMarkersShow = alarmStatus => {
    // 若 新选 等于 已选
    if (alarmStatus === checkedAlarmStatus.value) {
      // 选中值清零
      checkedAlarmStatus.value = 0

      // 则 清选 并 markers全展示
      markers.forEach(marker => marker.show())
    } else {
      // 选中值赋值
      checkedAlarmStatus.value = alarmStatus

      // 遍历 控制 显隐
      markers.forEach(marker => {
        const signStatus = marker.getExtData().signStatus

        marker[
          signStatus == alarmStatus ? 'show' : 'hide'
        ]()
      })
    }

    // lastCheckedMarkerInstance?.hide()
  }

/* 右侧栏 */
/* 实时视频 */
// 直播参数
const liveOptions = ref({}),
  // 获取直播参数
  getLiveOptions = id =>
    apis.alarmLive
      .getAlarmLiveByCameraId({
        id,
        videoFormat: 'WEBRTC',
        videoRate: '-1'
      })
      .then(res => {
        const {
            url: playUrl,
            router: IP,
            wsUrl: webWss
          } = res,
          params = {
            connectId: res.connectId,
            pushStreamRecordId: res.heartbeatId
          }

        liveOptions.value = { playUrl, IP, webWss, params }
      })
      .catch(() => {
        liveOptions.value = {}
      })

/* 事件动态 */
const eventTrends = ref([]), // 事件动态数据
  eventTrendsLoading = ref(false),
  // 获取事件动态
  getEventTrends = storyId => {
    eventTrendsLoading.value = true
    return apis.alarmLive
      .getAlarmTrendsByStoryId({
        storyId
      })
      .then(res => {
        console.log('getAlarmTrendsByStoryId res', res)

        // 事件动态数据赋值
        eventTrends.value = res.alarmDynamics.map(e => ({
          ...e,
          begTime: e.begTime.split?.(' ')?.[1],
          time: e.time.split?.(' ')?.[1],
          signTime: e.signDate?.split?.(' ')?.[1]
        }))

        // 报警信息厂商赋值
        alarmInfos.sourceCorps = res.corps

        // 报警摄像机名称赋值
        alarmInfos.cameraName = res.cameraName

        // 报警状态赋值
        alarmInfos.status =
          res.signStatus ??
          res.alarmDynamics[0]?.signStatus ??
          1

        // 开启动画
        animation.value = true
      })
      .finally(() => {
        eventTrendsLoading.value = false
      })
  },
  // 动画开关
  animation = ref(false),
  // 报警信息
  alarmInfos = reactive({
    sourceCorps: [], // 信息来源厂商
    cameraName: '', // 摄像机名称
    status: 1 // 报警状态
  })

/* websocket */
const devSockJSUrl =
     // 'http://192.168.8.155:9626/v1/endpoint',开发推送链接地址
    // 'http://139.198.167.138:9626/v1/endpoint',
    // 徐瑞国创园本地
    'http://192.168.136.91:9626/v1/endpoint',
  SockJSUrl =
    process.env.NODE_ENV === 'production'
      ? proSockJSUrl
      : devSockJSUrl, // 推送链接地址
  // 检查SockJS
  checkSockJS = (theme = '') => {
    if (globalThis.SockJS && globalThis.Stomp) {
      return connectSockJS(theme)
    }

    // 无则引入
    const $sockjs = document.querySelector(
        'script[name=sockjs]'
      ),
      $stomp = document.querySelector('script[name=stomp]')

    $sockjs.onload = () => {
      globalThis.SockJS &&
        globalThis.Stomp &&
        connectSockJS(theme)
    }

    $stomp.onload = () => {
      globalThis.SockJS &&
        globalThis.Stomp &&
        connectSockJS(theme)
    }

    $sockjs.src = $sockjs.dataset.src
    $stomp.src = $stomp.dataset.src
  },
  // 链接SockJS
  connectSockJS = (theme = '') => {
    console.log('%c%s', 'color:#00f', 'socket主题:', theme)
    const socket = new SockJS(SockJSUrl),
      // 链接成功回调
      cb = frame => {
        console.log('Connected: ' + frame)
        stompClient.subscribe(
          `/topic/${theme}`,
          msgPushHandler
        )
      },
      // 链接失败回调
      errCb = err => {
        console.log('链接失败 err: ', err)

        stompClient.disconnect()

        if (retryCount < retryMaxCount) {
          retryCount++

          // 重连
          console.log('尝试自动重连中···')
          connectSockJS(theme)
        }
      }
    stompClient = Stomp.over(socket)
    stompClient.connect({}, cb, errCb)
  },
  // 消息推送处理
  msgPushHandler = ({ body }) => {
    const data = JSON.parse(body)?.data

    if (data) {
      // 获取列表树数据
      getTreeData(false)

      // 调实例获取图表数据
      todayAlarmChartRef.value?.getChartData?.(false)

      // 获取报警点位数据
      getAlarmPoints()
    }
  },
  // 失败重连上限次数
  retryMaxCount = 1
let stompClient,
  // 失败重连计数器
  retryCount = 0

onMounted(() => {
  // 获取列表树数据
  getTreeData()

  // websocket检查启动
  checkSockJS('alarmLive')
})

onBeforeUnmount(() => {
  // 销毁地图组件实例
  mvMapRef.value?.destroy?.()

  // 推送心跳销毁
  try {
    stompClient?.disconnect?.()
  } catch (err) {
    console.log('stompClient?.disconnect() err: ', err)
  }
})
</script>

<style lang="less" scoped>
*:not([class|='ant']) {
  margin: 0;
  padding: 0;
}

@gap: 1.25rem;

.page {
  background-color: #fff;
  height: calc(100% + 80px);
  margin: -40px;
  overflow: hidden;
  position: relative;
  width: calc(100% + 80px);

  /* 上层展示 */
  .wrapper {
    align-items: center;
    display: flex;
    height: 100%;
    justify-content: space-between;
    left: 0;
    pointer-events: none;
    position: absolute;
    top: 0;
    width: 100%;

    .top-shadow {
      left: 0;
      height: 30px;
      overflow: hidden;
      position: absolute;
      top: 0;
      width: 100%;
      &::before {
        box-shadow: 0 2px 20px 2px #688ca54d;
        content: '';
        display: block;
        width: 100%;
      }
      z-index: 1;
    }

    aside {
      @titleHeight: 3.75rem;
      @chartHeight: 240px;

      height: calc(100% - @gap * 2);
      pointer-events: auto;
      position: relative;
      transition: 0.3s;
      &.left {
        padding-left: @gap;
        width: max(calc(21.25rem + @gap), 300px);
        &.hide {
          transform: translateX(-100%);

          .shrink-btn {
            i {
              transform: scaleX(-1);
            }
          }
        }

        .shrink-btn {
          border-top-right-radius: 14px 8px;
          border-bottom-right-radius: 14px 8px;
          right: -14px;
        }

        section.block {
          &.camera {
            height: calc(
              100% - @titleHeight - @chartHeight - @gap
            );
            margin-bottom: @gap;

            > .title {
              background: url(~@images/camera.png) right/
                2.75rem no-repeat;
            }
          }
          &.alarm {
            > .title {
              background: url(~@images/alarm_light.png)
                right/ 2.75rem no-repeat;
            }
          }

          .content-wrap {
            &.tree {
              height: calc(100% - @titleHeight);
              padding: @gap calc(@gap - 5px);

              .content {
                ::v-deep(.ant-tree) {
                  .ant-tree-node-content-wrapper {
                    white-space: nowrap;

                    /* 前置图标 */
                    .ant-tree-iconEle {
                      img.icon {
                        height: 16px;
                        transform: translateY(-2px);
                        width: 16px;
                      }
                    }

                    /* 标题内容 */
                    .ant-tree-title {
                      span {
                        font-size: 0.8rem;
                        white-space: nowrap;
                        &.title {
                          color: #666;
                        }
                        &.suffix {
                          color: #666;
                        }
                        &.count {
                          color: @layout-color;
                        }
                      }
                    }
                  }
                }

                .empty-wrap {
                  height: 100%;
                }
              }
            }
            &.chart {
              height: @chartHeight;
            }

            .content {
              height: 100%;
              overflow: overlay;
              position: relative;
              width: 100%;
            }
          }
        }

        .bottom-extra {
          bottom: 0;
          position: absolute;
          right: -@gap;
          transform: translateX(100%);

          .alarm-count-wrap {
            position: relative;
            &.show {
              .btn {
                background-color: @layout-color;
                color: #fff;
              }

              .panel-wrap {
                transition: none;
                width: 50vw;
                .panel {
                  transform: translateX(0);
                }
              }
            }

            .btn {
              background-color: #fff;
              border-radius: 4px;
              color: @layout-color;
              height: 2.25rem;
              transition: 0.2s;
              width: 2.25rem;
            }

            .panel-wrap {
              bottom: 0;
              min-height: 100px;
              overflow: hidden;
              pointer-events: none;
              position: absolute;
              right: calc(-@gap / 2);
              transform: translateX(100%);
              transition: 1s;
              width: 0;

              .panel {
                bottom: 0;
                display: flex;
                left: 0;
                position: absolute;
                transition: 0.5s;
                transform: translateX(-150%);
                &.checked {
                  .content-box {
                    opacity: 0.6;
                    &.checked {
                      opacity: 1;
                    }
                  }
                }

                .content-box {
                  align-items: center;
                  background-color: #fff;
                  background-image: linear-gradient(
                    180deg,
                    transparent,
                    transparent
                  );
                  border-radius: 4px;
                  border-top: 4px solid transparent;
                  box-shadow: 1.31px 1.51px 24px 2px
                    #1c3c9526;
                  cursor: pointer;
                  display: flex;
                  padding: 0.8rem 1rem;
                  pointer-events: auto;
                  margin-right: calc(@gap / 2);
                  transition: 0.3s;
                  min-width: 5rem;
                  &:last-child {
                    margin-right: 0;
                  }
                  &.box-1 {
                    border-color: #f7583e;
                  }
                  &.box-2 {
                    border-color: #f5a946;
                  }
                  &.box-3 {
                    border-color: #3f68da;
                  }

                  .icon {
                    height: 2rem;
                    margin-right: 1rem;
                    width: 2rem;
                  }

                  .text {
                    height: 2.4rem;
                    white-space: nowrap;

                    .title {
                      color: #666;
                      font-size: 0.875rem;
                      height: 0.875rem;
                      line-height: 0.875rem;
                    }

                    .count {
                      color: #333;
                      font-size: 0.5rem;

                      span {
                        font-size: 1.5rem;
                        height: 1.5rem;
                        line-height: 1.5rem;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      &.right {
        display: flex;
        flex-direction: column;
        padding-right: @gap;
        width: 24vw;
        min-width: 320px;
        &.hide {
          transform: translateX(100%);

          .shrink-btn {
            opacity: 0;
            visibility: hidden;

            i {
              transform: scaleX(-1);
            }
          }
        }

        .shrink-btn {
          border-top-left-radius: 14px 8px;
          border-bottom-left-radius: 14px 8px;
          left: -14px;
          visibility: visible;
        }

        section.block {
          &.live {
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
            > .title {
              .icon {
                height: 1rem;
                margin-right: 5px;
                width: 1rem;
                + h1 {
                  line-height: 1;
                }
              }

              h1 {
                flex: 1;
                padding-right: @gap;
                &::before {
                  content: none;
                }
              }
            }
          }
          &.trends {
            border-top-left-radius: 0;
            border-top-right-radius: 0;
            flex: 1;
            overflow: hidden;

            > .title {
              background: url(~@images/traffic_light.png)
                calc(100% - @gap) / 2.75rem no-repeat;
              margin-bottom: @gap;
            }
          }

          /* 直播视频区域 */
          .live-wrap {
            padding: @gap;
            position: relative;
            &::before {
              content: '';
              display: block;
              padding-top: 56.25%;
            }

            .live-container {
              background-color: #000;
              border-radius: 4px;
              height: calc(100% - @gap * 2);
              left: @gap;
              overflow: hidden;
              position: absolute;
              top: @gap;
              width: calc(100% - @gap * 2);
            }
          }

          /* 事件动态内容 */
          .event-trends-container {
            background-color: #f6f9fe;
            border-radius: 6px;
            height: calc(100% - @titleHeight);
            margin: 0 @gap;
            overflow-x: hidden;
            overflow-y: overlay;
            padding: @gap calc(@gap * 1.5) 2rem;
            position: relative;
            &.animation {
              animation: falls 1s 1 forwards;
            }

            .event-trend {
              border-left: 1px dashed #2d5cf6;
              font-size: 14px;
              padding: 0 0 1rem @gap;

              p.text {
                line-height: 1.2rem;
                margin-bottom: 10px;
                position: relative;
                &:first-child {
                  &::after {
                    background-color: #fff;
                    border: 2px solid #2d5cf6;
                    border-radius: 50%;
                    content: '';
                    display: block;
                    height: 10px;
                    left: calc(-@gap - 5px);
                    outline: 6px solid #f6f9fe;
                    position: absolute;
                    top: calc(50% - 5px);
                    width: 10px;
                  }
                }

                .time {
                  color: #2d5cf6;
                  height: 1.2rem;
                  line-height: 1.2rem;
                  margin-right: 1rem;
                  position: relative;
                  z-index: 1;
                }

                .time-describe {
                  color: #666;
                  font-weight: bold;
                }

                .obj {
                  color: #000;
                  font-size: 1rem;
                  min-width: 10em;
                }

                .duration {
                  color: #f7583e;
                  padding-right: 0.5rem;
                }

                .lastest {
                  color: #999;
                }

                .calibrate {
                  color: #333;

                  .result {
                    color: #00c566;
                  }
                }

                .strong {
                  color: @layout-color;
                }

                .status {
                  color: #f7583e;
                  &.correct {
                    color: #00c566;
                  }
                }

                .report {
                  background-color: #ff731619;
                  color: #ff7316fe;
                  padding: 0 2rem 0 0.5rem;
                }
              }

              .video-wrap {
                margin-bottom: 10px;
                position: relative;
                &::before {
                  content: '';
                  display: block;
                  padding-top: 56.25%;
                }

                .video-container {
                  background-color: #000;
                  border-radius: 4px;
                  height: 100%;
                  left: 0;
                  overflow: hidden;
                  position: absolute;
                  top: 0;
                  width: 100%;

                  /* Video组件 */
                  .container {
                    min-width: initial;
                  }

                  .calibrate-status {
                    background-color: #d0d0d0;
                    color: #fff;
                    font-size: 12px;
                    height: 20px;
                    line-height: 20px;
                    position: absolute;
                    right: 20px;
                    text-align: center;
                    top: 20px;
                    transform: translate(50%, -50%)
                      rotate(45deg);
                    width: 40%;
                    &.right {
                      background-color: #00c566;
                    }
                    &.wrong {
                      background-color: #f7583e;
                    }
                  }
                }
              }
            }

            @keyframes falls {
              0% {
                max-height: 0;
              }
              100% {
                max-height: 100vh;
              }
            }
          }
        }

        .tip {
          background-color: #fdecee;
          bottom: 0;
          color: #f7583e;
          font-size: 12px;
          height: 2rem;
          line-height: 2rem;
          left: 0;
          padding-left: @gap;
          position: absolute;
          width: calc(100% - @gap);
        }
      }

      .shrink-btn {
        background-color: #fff;
        border: 1px solid #c7cedb66;
        height: 70px;
        opacity: 0.3;
        position: absolute;
        top: calc(50% - 35px);
        transition: 0.2s;
        width: 14px;
        &:hover {
          box-shadow: 0 0 4px 0 #26325621;
          opacity: 1;
        }
        &:active {
          border-color: #c7cedb;
        }

        i {
          color: #9aa9c5;
        }
      }

      section.block {
        background-color: #fff;
        border-radius: 6px;

        > .title {
          border-bottom: 1px solid #ebeef1;
          height: @titleHeight;
          min-height: @titleHeight;
          line-height: calc(@titleHeight - 1px);
          padding-left: @gap;

          h1 {
            color: #000;
            font-size: 16px;
            font-weight: bold;
            padding-left: 0.5rem;
            position: relative;
            &::before {
              background-color: #3f68da;
              content: '';
              display: block;
              height: 15px;
              left: 0;
              position: absolute;
              top: calc(50% - 8px);
              width: 3px;
            }
          }
        }
      }
    }
  }
}
</style>
