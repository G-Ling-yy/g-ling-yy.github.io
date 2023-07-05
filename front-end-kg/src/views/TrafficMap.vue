<template>
  <div class="map-box">
    <div class="header-aside-box">
      <div class="header-menu">
        <div class="header-menu-left">
          <div class="header-menu-button">
            <div
              class="btn"
              @click="initQueryAmapMarks(100000)"
            />
            <div class="bg">
              <i class="el-icon-s-home" />
            </div>
          </div>
        </div>
        <h1
          class="header-menu-title nbtd"
          v-if="BASETargetIsNbtd"
        >
          <!-- 南部通道视频平台 -->
          视频中台3.3
          <!-- 高网中心视频平台 -->
        </h1>
        <h1 class="header-menu-title" v-else>
          视频中台<span
            class="num"
            style="letter-spacing: 6px"
            >3</span
          >
          <span class="pot">.</span>
          <span class="num">3</span>
        </h1>
        <div class="header-menu-right">
          <div class="header-menu-button">
            <div
              class="btn"
              :class="toggleSetting ? 'toggleSetting' : ''"
              @click="toggleSetting ? false : $router.push('/dashboard')"
            />
            <div class="bg">
              <i class="el-icon-setting" />
            </div>
          </div>
          <el-tooltip
            class="item"
            effect="dark"
            content="轮巡预案"
            placement="top"
            popper-class="itemTips"
          >
            <img
              style="position: absolute; top: 12px; left: 100px"
              src="../assets/images/yuanImg/planImg.png"
              @click="
                $router.push({ path: '/InspectionDialog' })
              "
            />
          </el-tooltip>
        </div>
      </div>
      <span class="indexSearchMain">
        <div class="indexSearchShow">
          <!-- <i class="el-icon-search indexSearchShowBtn"></i> -->

          <i
            class="el-icon-search indexSearchShowBtn"
            v-if="searchIcon"
            @click="searchShow()"
          ></i>
          <i
            class="el-icon-back indexSearchShowBtn"
            v-if="!searchIcon"
            @click="searchBack()"
          ></i>
        </div>
        <div class="indexSearch" v-if="searchIsShow">
          <!-- <div class="indexSearch"> -->
          <!-- <indexSearch></indexSearch> -->
          <div class="indexSearchHeader">
            <el-input
              v-model="searchBlock"
              placeholder="请输入关键字"
            ></el-input>
            <i
              class="el-icon-search"
              @click="refreshAmapMarks"
            ></i>
            <i
              class="el-icon-back"
              style="color: #fff; line-height: 36px; font-size: 14px"
              @click="initQueryAmapMarks(100000)"
              v-if="
                cloudplatform.regionCode == 500000
                  ? true
                  : false
              "
            ></i>

            <el-popover
              placement="right"
              width="280"
              trigger="click"
              content="您可以输入路线、桩号、摄像机名称；"
            >
              <i
                class="el-icon-question"
                slot="reference"
              ></i>
            </el-popover>
          </div>

          <div
            class="searchList"
            v-show="searchList"
            v-if="
              cloudplatform.regionCode == 500000
                ? true
                : false
            "
          >
            <p
              v-for="item in searchData"
              :key="item.key"
              @click="searchCell(item)"
            >
              {{ item.name }}
            </p>
            <p @click="isResult ? searchMore() : false">
              {{
                isResult ? '查看更多搜索结果' : '没有更多了'
              }}
            </p>
          </div>
        </div>
      </span>
    </div>

    <!--地图容器-->
    <keep-alive>
      <!--部地图 高德-->
      <traffic-amap
        ref="amapIns"
        :mapStatus="mapStatus"
        @amapComplete="amapCompleteCallback"
        v-if="curMap === 'gaode'"
        @amapClick="amapClickCallback"
        @amap-changed="refreshAmapMarks"
        @invokeEvent="invokeMethod"
        @mapLayerTypeUpdate="
          (type, isShow) => (mapLayerTypes[type] = isShow)
        "
        @zoomUpdate="judgeTabMapSwitch"
        @tabMap="map => tabMap(map, 'auto')"
        @tabArea="
          adcode => {
            regionCode = adcode
            mileIsShow = false
            judgeTabMapSwitch(mapStatus.zoom)
            closeSwitch()
          }
        "
        :base-top-adcodes="regionCode"
        :base-top-adcodes-name="regionName"
        :cameraRenderer="cameraRenderer"
      ></traffic-amap>

      <!-- 百度地图 -->
      <baidu-map
        v-if="curMap === 'baidu'"
        ref="BMap"
        :mapStatus="mapStatus"
        @mapLayerTypeUpdate="
          (type, isShow) => (mapLayerTypes[type] = isShow)
        "
        @updateCameras="refreshAmapMarks"
        @tabMap="map => tabMap(map, 'auto')"
      />
    </keep-alive>

    <!-- 操作层 -->
    <main>
      <!-- 左翼 -->
      <aside
        class="left"
        :class="{ hidden: !asideShow.left }"
      >
        <!-- 主内容 -->
        <!-- //
        //
        视频列表组件
        //
         -->
        <video-list
          ref="videoList"
          @handleTreeNode="showCamera2AMap"
        ></video-list>
        <!-- 右侧附加(style示意位置，写好组件删除) -->
        <div class="ext-wrap top">
          <!-- //
        //
        组件
        //
         -->
        </div>

        <!-- 右侧附加(style示意位置，写好组件删除) -->
        <div class="ext-wrap bottom">
          <!-- 在线离线按钮 -->
          <div class="state-box">
            <el-checkbox
              class="on-line"
              v-model="checkedCities.onLine"
              @change="cameraDisplayState()"
              label="在线"
            ></el-checkbox>
            <!-- <el-checkbox  class="fault"     v-model='checkedCities.fault'   @change="cameraDisplayState()" label="故障"></el-checkbox> -->
            <el-checkbox
              class="off-line"
              v-model="checkedCities.offLine"
              @change="cameraDisplayState()"
              label="离线"
            ></el-checkbox>
          </div>
        </div>

        <!-- 收缩按钮 -->
        <div
          v-if="asideBtnShow"
          class="aside-btn btn"
          @click="toggle('left')"
        />
      </aside>

      <!-- 右侧弹窗 -->
      <div
        class="layer right"
        :class="{ visible: layerShow.right }"
      >
        <div class="content">
          <!-- 主内容 -->
          <!-- 监控模式组件 -->
          <monitoring-pattern
            ref="monitoringPattern"
            @monitoring-close="switchMonitorActive()"
          ></monitoring-pattern>
        </div>
      </div>
    </main>

    <!--地图工具按钮-->
    <div class="camera-type-panel">
      <!-- 底部选项按钮 -->
      <div class="btn-wrap">
        <el-tooltip
          v-for="it in cameraTypeList"
          :key="it.type"
          class="item"
          effect="dark"
          :content="it.title"
          placement="top-start"
          popper-class="itemTips"
        >
          <div
            :class="cameraTypeClass(it.bg, it.type)"
            @click="cameraTypeSelectClick(it.type)"
          ></div>
        </el-tooltip>
        <div class="last-item"></div>
      </div>
    </div>

    <!-- 首页图层切换 -->
    <div class="map-layer-wrap">
      <!-- 监控开关 -->
      <div
        class="btn monitor"
        :class="{ active: monitorActive }"
        title="监控"
        @click="switchMonitorActive"
      />

      <!-- 截图按钮 -->
      <div class="pictureManagement">
        <i class="el-icon-picture" @click="changImg()"></i>
      </div>
      <!-- 三大模块显隐 -->
      <!-- <div
        style="margin: 14px 12px 0 0"
        v-if="
          cloudplatform.userName == 'admins' ? false : true
        "
      >
        <el-tooltip
          class="item"
          effect="dark"
          content="全景地图"
          placement="top"
          popper-class="itemTips"
        >
          <i
            @click="threeMouldeClick()"
            v-if="showHide"
            class="iconfont iconchanggui"
          ></i>
          <i
            @click="threeMouldeClick()"
            v-if="!showHide"
            class="iconfont iconjianhua"
          ></i>
        </el-tooltip>
      </div> -->

      <!-- 公里桩开关 -->
      <el-tooltip
        class="item"
        effect="dark"
        content="公里桩"
        placement="top-start"
        popper-class="itemTips"
      >
        <img
          src="../assets/images/traffic_map/icon/stake.png"
          @click="mileShow()"
          style="
            width: 24px;
            height: 14px;
            margin-right: 12px;
            transform: translateY(4px);
            transition: 0.3s;
          "
          :style="{
            filter: `grayscale(${mileIsShow ? 0 : 1})`
          }"
        />
      </el-tooltip>

      <div class="trafficLayerBtn">
        <el-tooltip
          class="item"
          effect="dark"
          content="路况"
          placement="top-start"
          popper-class="itemTips"
        >
          <img
            src="../assets/images/traffic_map/trafficLayer.png"
            v-show="!mapLayerTypes.trafficLayer"
            @click="checkMapType(1, true)"
          />
        </el-tooltip>
        <el-tooltip
          class="item"
          effect="dark"
          content="路况"
          placement="top-start"
          popper-class="itemTips"
        >
          <img
            src="../assets/images/traffic_map/trafficLayerA.png"
            v-show="mapLayerTypes.trafficLayer"
            @click="checkMapType(1, false)"
          />
        </el-tooltip>
      </div>

      <!-- 地图切换按钮 -->
      <!-- <el-dropdown style="height: 28px" @command="tabMap">
        <p
          style="color: #fff; cursor: pointer; padding: 0 12px"
        >
          {{ mapName }}地图
        </p>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="gaode"
            >高德地图</el-dropdown-item
          >
          <el-dropdown-item
            command="baidu"
            :class="{
              'not-allowed': !mapsAllowedTab.includes(
                'baidu'
              )
            }"
            >百度地图</el-dropdown-item
          >
        </el-dropdown-menu>
      </el-dropdown> -->

      <!-- <img
        src="../assets/images/traffic_map/satelliteMap.png"
        @click="checkMapType(0, false)"
        v-if="mapLayerTypes.satellite"
      />
      <img
        src="../assets/images/traffic_map/baseMap.png"
        @click="checkMapType(0, true)"
        v-if="!mapLayerTypes.satellite"
        style="cursor: pointer"
      /> -->
      <div>
        <el-switch
          v-model="mapLayerTypes.satellite"
          @change="show => checkMapType(0, show)"
          class="switch"
          active-color="#1D73A3"
          inactive-color="#38498E"
        >
        </el-switch>
      </div>
      <p>卫星</p>
      <div v-if="cameraRenderer !== null">
        <el-switch
          v-model="cameraRenderer"
          @change="checkPatternType"
          class="switch"
          active-color="#1D73A3"
          active-value="normal"
          inactive-color="#38498E"
          inactive-value="mass"
        >
        </el-switch>
      </div>
      <p v-if="cameraRenderer !== null">运维模式</p>
      <!-- 全国模式 -->
      <div >
        <el-switch
          v-model="nationwidePattern"
          @change="checkNationwidePattern"
          class="switch"
          active-color="#1D73A3"
          inactive-color="#38498E"
        >
        </el-switch>
      </div>
      <p >全国模式</p>
    </div>

    <!-- 截图管理弹窗 -->
    <el-dialog
      :visible.sync="dialogTableVisibles"
      width="90%"
      top="0"
      :close-on-click-modal="false"
      :append-to-body="true"
      @open="
        () => {
          picEchartMark = ''
        }
      "
      @opened="
        () => {
          $refs.refPicEct &&
            $refs.refPicEct.myChart &&
            $refs.refPicEct.myChart.resize()
        }
      "
      @closed="
        () => {
          if (picEchartMark !== 'self') {
            $refs.refPicEct.reset()
          }
        }
      "
      custom-class="pic-dialog"
    >
      <pictureEcharts-dialog
        ref="refPicEct"
        @selfDisplay="
          data => {
            dialogTableVisibles = data.show
            picEchartMark = data.mark
          }
        "
      ></pictureEcharts-dialog>
    </el-dialog>
  </div>
</template>

<script
  type="text/javascript"
  src="./js/traffic-map.js"
></script>

<style lang="less" src="./css/traffic-map.less"></style>
<style lang="less">
.map-box {
  * {
    ::-webkit-scrollbar {
      visibility: hidden;
      height: 6px; /* no */
      width: 6px; /* no */
    }

    ::-webkit-scrollbar-track {
      background-color: transparent;
    }

    ::-webkit-scrollbar-thumb {
      border-radius: 3px; /* no */
      background-color: #00b8cebb;
    }
  }
}
</style>
<style lang="less" scoped>
.map-box {
  @headerHeight: 86px;

  main {
    height: calc(100% - @headerHeight);
    pointer-events: none;
    position: absolute;
    top: @headerHeight;
    width: 100%;

    aside {
      height: 100%;
      pointer-events: auto;
      position: absolute;
      top: 0;
      transition: 0.3s;
      width: 400px;
      z-index: 9;
      /* 左翼 */
      &.left {
        // background-color: #0000ee99;
        left: 0;
        &.hidden {
          left: -400px;

          .aside-btn {
            &::after,
            &::before {
              transform-origin: 100% center;
            }
          }
        }

        .ext-wrap {
          right: 0;
          transform: translateX(100%);
          &.top {
            &.hidden {
              opacity: 0;
              transform: none;
              transition: 0.3s;
              visibility: hidden;
            }
          }
        }

        .aside-btn {
          border-radius: 0 28px 28px 0;
          box-shadow: -10px 0 20px 4px #00b8ce70 inset;
          right: 0;
          transform: translateX(100%);
          &::after,
          &::before {
            transform-origin: 0 center;
          }
        }
      }

      /* 右翼 */
      &.right {
        background-color: #00eeee44;
        right: 0;
        &.hidden {
          right: -400px;

          .aside-btn {
            &::after,
            &::before {
              transform-origin: 0 center;
            }
          }
        }

        .ext-wrap {
          left: 0;
          transform: translateX(-100%);
          &.top {
            &.hidden {
              opacity: 0;
              transform: none;
              transition: 0.3s;
              visibility: hidden;
            }
          }
        }

        .aside-btn {
          border-radius: 28px 0 0 28px;
          box-shadow: 10px 0 20px 4px rgb(0 184 206 / 44%)
            inset;
          left: 0;
          transform: translateX(-100%);
          &::after,
          &::before {
            transform-origin: 100% center;
          }
        }
      }

      .ext-wrap {
        // background-color: #aa000099;
        position: absolute;
        &.top {
          top: 0;
        }
        &.bottom {
          bottom: 0;
          z-index: 1;
        }
      }

      .aside-btn {
        height: 120px;
        position: absolute;
        top: calc(50% - 60px);
        width: 28px;
        &::after,
        &::before {
          background-color: #00b8ce;
          border-radius: 2px;
          content: '';
          display: block;
          height: 2px;
          left: calc(50% - 5px);
          pointer-events: none;
          position: absolute;
          top: calc(50% - 1px);

          transition: 0.3s;
          width: 10px;
        }
        &::after {
          transform: rotate(45deg);
        }
        &::before {
          transform: rotate(-45deg);
        }
      }
    }

    .layer {
      height: 100%;
      opacity: 0;
      pointer-events: auto;
      position: absolute;
      transition: 0.3s;
      visibility: hidden;
      z-index: 9;
      &.visible {
        opacity: 1;
        visibility: visible;
      }

      /* 右侧弹窗 */
      &.right {
        padding-left: 10px;
        right: 0;
        transform: translateX(100%);
        width: calc(100% - 400px);
        &.visible {
          transform: translateX(0);
        }
        & > .content {
          height: 100%;
          width: 100%;
        }
      }

      /* 底部弹窗 */
      &.bottom {
        background-color: #0009;
        bottom: 0;
        transform: translateY(100%);
        width: 100%;
        &.visible {
          transform: translateY(0);
        }
      }
    }
  }

  .map-layer-wrap {
    .monitor {
      background: url('~@/assets/images/icon/monitor.png') 0
        0 / contain no-repeat;
      filter: grayscale(1);
      height: 20px;
      margin-top: 12px;
      transition: 0.3s;
      width: 20px;
      &.active {
        filter: grayscale(0);
      }
    }
  }
}

/deep/ .pic-dialog {
  background: #091543;
  border: 1px solid #0393d1;
  box-shadow: 0 0 8px 0 #0393d1;
}
/deep/ .el-dialog__body {
  padding: 0;
}
.el-dialog__wrapper {
  display: flex;
  align-items: center;
  /deep/ .el-dialog {
    margin: 0 auto !important;
  }
}
/deep/ .switch {
  width: 40px;
  height: 20px;
  margin: 12px 4px;
  .el-switch__core:after {
    background-color: #071139;
  }
}
</style>
