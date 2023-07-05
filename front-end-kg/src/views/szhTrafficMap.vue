<template>
  <div :class="'map-box '">
    <div class="header-aside-box">
      <div class="header-datetime">
        {{ currentDateTime }}
      </div>
      <div class="header-user-info">
        <i class="icon-user"></i>
        <span>{{ userInfo ? userInfo.userName : "" }}</span>
        <i class="icon-switch-button" @click="userExit()"></i>

        <i
          @click="handleFullScreen"
          class="icon-full-screen"
          :class="hasFullScreen ? 'active' : ''"
        ></i>

        <!--<i class="el-icon-user"></i>
        <span>admin</span>
        <i class="el-icon-switch-button"></i>
        <i class="el-icon-full-screen"></i>-->
      </div>
      <div class="header-menu">
        <div class="header-menu-left">
          <div class="header-menu-button active">
            <router-link class="home" tag="div" :to="{ name: 'index' }"
              ><i class="el-icon-s-home"></i
            ></router-link>
          </div>
        </div>
        <div
          class="header-menu-right"
          :class="toggleSetting ? 'toggleSetting' : ''"
        >
          <div class="header-menu-button">
            <i v-if="toggleSetting" class="el-icon-setting"></i>
            <router-link
              v-else
              class="home"
              tag="div"
              :to="{ path: '/sptCameraManage' }"
              ><i class="el-icon-setting"></i
            ></router-link>
          </div>
        </div>
      </div>
    </div>

    <!--地图容器-->
    <traffic-amap
      ref="amapIns"
      @amapComplete="amapCompleteCallback"
      @amapClick="amapClickCallback"
      @amap-changed="refreshAmapMarks"
      :base-top-adcodes="regionCode"
      :base-top-adcodes-name="regionName"
    ></traffic-amap>
    <!--<emap @emap-complete="amapCompleteCallback"></emap>-->

    <!--左侧侧边栏-->
    <div class="left-aside-box" :class="leftSideCollapsed ? 'collapsed' : ''">
      <div
        class="collapse-control"
        @click="leftSideCollapsed = !leftSideCollapsed"
      >
        <i class="el-icon-arrow-left" v-if="!leftSideCollapsed"></i>
        <i class="el-icon-arrow-right" v-else></i>
      </div>

      <template v-if="!leftSideCollapsed">
        <div class="box-wrap">
          <div class="box-wrap-top">
            <div class="box-wrap-left-top"></div>
          </div>
          <div class="box-wrap-bottom"></div>

          <!--<div class="left-top"></div>
          <div class="right-top"></div>
          <div class="left-bottom"></div>
          <div class="right-bottom"></div>-->
          <div class="box-wrap-title">
            <div
              class="box-title-item title-mini"
              :class="cameraCategoryRoute === 1 ? 'active' : ''"
              @click="checkCameraRouterBtnClick(1)"
            >
              <span>路线</span>
            </div>
            <div
              class="box-title-item title-mini"
              :class="cameraCategoryRoute === 2 ? 'active' : ''"
              @click="checkCameraRouterBtnClick(2)"
            >
              <span>单位</span>
            </div>
          </div>

          <div class="box-wrap-body">
            <!--分类标题按钮-->
            <!--<div class="sort-box">
                <div :class="cameraCategoryRoute === 2 ? 'active' : ''" @click="checkCameraRouterBtnClick(2)">路线</div>
                <div :class="cameraCategoryRoute === 3 ? 'active' : ''" @click="checkCameraRouterBtnClick(3)">区域</div>
                <div :class="cameraCategoryRoute === 1 ? 'active' : ''" @click="checkCameraRouterBtnClick(1)">单位</div>
                &lt;!&ndash;<div  @click="$message.info('功能暂未开放！')">单位</div>
                <div  @click="$message.info('功能暂未开放！')">路线</div>
                <div class="active" @click="checkCameraRouterBtnClick(3)">区域</div>&ndash;&gt;
            </div>-->

            <!--分类下拉选择-->
            <el-select
              v-model="cameraCateSelect"
              class="camera-cate-select"
              popper-class="camera-cate-select-popper"
            >
              <el-option value="99" label="全部"></el-option>
              <template 
                v-for="classIfy in classIfyList"
                >
                <el-option
                  :value="classIfy.codeValue"
                  :label="classIfy.codeName"
                  v-if="classIfy.codeValue !== '0'"
                ></el-option>
              </template>
            </el-select>

            <!-- 左侧列表 -->
            <div class="left-progress-box">
              <el-row type="flex" v-if="currCategoryCode === 'camera'">
                <el-col :span="4"><span class="text-grey">序号</span></el-col>
                <el-col :span="15"><span class="text-grey">桩号</span></el-col>
                <el-col :span="5"><span class="text-grey">状态</span></el-col>
                <!--<el-col :span="5"><span class="text-grey">操作</span></el-col>-->
              </el-row>
              <!--:style="{height:currCategoryCode === 'camera' ? 'calc(100% - 20px)' : '100%'}" -->
              <div 
                  :style="{
                    height:
                      currCategoryCode === 'camera'
                        ? 'calc((100% - 50px) / 2)'
                        : 'calc((100% - 40px) / 2)',
                  }"
                >
                <div
                  class="camera-list-wrap"
                  style="height: 100%"
                  v-if="!cameraLoading"
                  >
                  <vue-scroll :ops="$root.scrollOpsY">
                    <div
                      class="progress-box progress-province"
                      v-if="currCategoryCode === 'company'"
                    >
                      <!--v-if="currentMapRegionCode === 100000 || (currentMapRegionCode !== 100000 && parseInt(provInfo.id) === currentMapRegionCode)"-->

                      <template v-if="leftTree.orgData.length">
                        <div
                          class="progress-item-wrap"
                          v-for="orgInfo in leftTree.orgData"
                          :key="orgInfo.id"
                          @click="
                            changeCameraCategoryPath(
                              orgInfo.id,
                              orgInfo.name,
                              'company'
                            )
                          "
                        >
                          <p>
                            <span class="progress-name"
                              >{{ orgInfo.name }}&nbsp;</span
                            >
                            <span
                              >{{ orgInfo.online }}/{{ orgInfo.total }}</span
                            >
                          </p>
                          <el-progress
                            :percentage="
                              parseInt((orgInfo.online / orgInfo.total) * 100)
                            "
                            :show-text="false"
                            color="#299dff"
                          ></el-progress>
                        </div>
                      </template>
                      <loading
                        message="暂无组织数据"
                        loadingStatus="empty"
                        class="traffic-map-empty"
                        v-else
                      ></loading>
                    </div>
                    <div
                      class="camera-list"
                      v-if="currCategoryCode === 'camera'"
                    >
                      <template v-if="leftTree.cameraList.length">
                        <el-row
                          type="flex"
                          v-for="(camera, idx) in leftTree.cameraList"
                          :key="camera.cameraId"
                          :class="selectCameraIndex === idx ? 'active' : ''"
                        >
                          <el-col :span="4">{{ idx + 1 }}</el-col>
                          <el-col :span="15" class="camera-name-content">
                            <span
                              class="text-info"
                              style="cursor:pointer"
                              @click="showCamera2AMap(camera, idx)"
                              >{{ camera.khPile }}</span
                            >
                          </el-col>
                          <el-col :span="5">
                            <span
                              :class="
                                camera.onlineStatus
                                  ? [
                                      '',
                                      'text-info',
                                      '',
                                      'text-error',
                                      'text-grey',
                                    ][camera.onlineStatus * 1]
                                  : 'text-grey'
                              "
                            >
                              {{
                                camera.onlineStatus
                                  ? ["", "在线", "", "故障", "离线"][
                                      camera.onlineStatus * 1
                                    ]
                                  : "未知"
                              }}
                            </span>
                          </el-col>
                          <!--<el-col :span="5"><span class="text-success" @click="showCamera2AMap(camera)">查看</span>
                        </el-col>-->
                        </el-row>
                      </template>
                      <loading
                        message="暂无摄像机数据"
                        loading-status="empty"
                        v-else
                      ></loading>
                    </div>
                    <div
                      class="progress-box progress-road"
                      v-if="currCategoryCode === 'road'"
                    >
                      <template v-if="leftTree.roadData.length">
                        <vue-scroll :ops="$root.scrollOpsY">
                          <div
                            class="progress-item-wrap"
                            v-for="roadInfo in leftTree.roadData"
                            :key="roadInfo.id"
                            @click="
                              changeCameraCategoryPath(
                                roadInfo.id,
                                roadInfo.id + '' + roadInfo.name,
                                'road'
                              )
                            "
                          >
                            <p>
                              <span class="progress-name"
                                >{{ roadInfo.id }}&nbsp;{{
                                  roadInfo.name
                                }}</span
                              >
                              <span
                                >{{ roadInfo.online }}/{{
                                  roadInfo.total
                                }}</span
                              >
                            </p>
                            <el-progress
                              :percentage="
                                parseInt(
                                  (roadInfo.offline / roadInfo.total) * 100
                                )
                              "
                              :show-text="false"
                              color="#299dff"
                            ></el-progress>
                          </div>
                        </vue-scroll>
                      </template>
                      <loading
                        message="暂无路线数据"
                        loadingStatus="empty"
                        class="traffic-map-empty"
                        v-else
                      ></loading>
                    </div>
                  </vue-scroll>
                </div>
                <loading message="数据加载中..." v-else></loading>
              </div>
              <div style="padding: 12px;">借阅数据</div>
              <div
                :style="{
                    height:
                      currCategoryCode === 'camera'
                        ? 'calc((100% - 50px) / 2)'
                        : 'calc((100% - 40px) / 2)',
                  }"
                >
                <div
                  class="camera-list-wrap"
                  style="height: 100%"
                  v-if="!borrowCameraLoading"
                  >
                  <vue-scroll :ops="$root.scrollOpsY">
                    <div
                      class="progress-box progress-province"
                      v-if="currBorrowCategoryCode === 'company'"
                    >
                      <!--v-if="currentMapRegionCode === 100000 || (currentMapRegionCode !== 100000 && parseInt(provInfo.id) === currentMapRegionCode)"-->

                      <template v-if="leftTree.borrowOrg.length">
                        <div
                          class="progress-item-wrap"
                          v-for="orgInfo in leftTree.borrowOrg"
                          :key="orgInfo.id"
                          @click="
                            changeCameraCategoryPath(
                              orgInfo.id,
                              orgInfo.name,
                              'company',
                              true
                            )
                          "
                        >
                          <p>
                            <span class="progress-name"
                              >{{ orgInfo.name }}&nbsp;</span
                            >
                            <span
                              >{{ orgInfo.online }}/{{ orgInfo.total }}</span
                            >
                          </p>
                          <el-progress
                            :percentage="
                              parseInt((orgInfo.online / orgInfo.total) * 100)
                            "
                            :show-text="false"
                            color="#299dff"
                          ></el-progress>
                        </div>
                      </template>
                      <loading
                        message="暂无组织数据"
                        loadingStatus="empty"
                        class="traffic-map-empty"
                        v-else
                      ></loading>
                    </div>
                    <div
                      class="camera-list"
                      v-if="currBorrowCategoryCode === 'borrowCamera'"
                    >
                      <template v-if="leftTree.borrowCamera.length">
                        <el-row
                          type="flex"
                          v-for="(camera, idx) in leftTree.borrowCamera"
                          :key="camera.cameraId"
                          :class="selectCameraIndex === idx ? 'active' : ''"
                        >
                          <el-col :span="4">{{ idx + 1 }}</el-col>
                          <el-col :span="15" class="camera-name-content">
                            <span
                              class="text-info"
                              style="cursor:pointer"
                              @click="showCamera2AMap(camera, idx)"
                              >{{ camera.khPile }}</span
                            >
                          </el-col>
                          <el-col :span="5">
                            <span
                              :class="
                                camera.onlineStatus
                                  ? [
                                      '',
                                      'text-info',
                                      '',
                                      'text-error',
                                      'text-grey',
                                    ][camera.onlineStatus * 1]
                                  : 'text-grey'
                              "
                            >
                              {{
                                camera.onlineStatus
                                  ? ["", "在线", "", "故障", "离线"][
                                      camera.onlineStatus * 1
                                    ]
                                  : "未知"
                              }}
                            </span>
                          </el-col>
                          <!--<el-col :span="5"><span class="text-success" @click="showCamera2AMap(camera)">查看</span>
                        </el-col>-->
                        </el-row>
                      </template>
                      <loading
                        message="暂无摄像机数据"
                        loading-status="empty"
                        v-else
                      ></loading>
                    </div>
                    <div
                      class="progress-box progress-road"
                      v-if="currBorrowCategoryCode === 'road'"
                      >
                      <template v-if="leftTree.borrowRoad.length">
                        <vue-scroll :ops="$root.scrollOpsY">
                          <div
                            class="progress-item-wrap"
                            v-for="roadInfo in leftTree.borrowRoad"
                            :key="roadInfo.id"
                            @click="
                              changeCameraCategoryPath(
                                roadInfo.id,
                                roadInfo.id + '' + roadInfo.name,
                                'road',
                                true
                              )
                            "
                          >
                            <p>
                              <span class="progress-name"
                                >{{ roadInfo.id }}&nbsp;{{
                                  roadInfo.name
                                }}</span
                              >
                              <span
                                >{{ roadInfo.online }}/{{
                                  roadInfo.total
                                }}</span
                              >
                            </p>
                            <el-progress
                              :percentage="
                                parseInt(
                                  (roadInfo.offline / roadInfo.total) * 100
                                )
                              "
                              :show-text="false"
                              color="#299dff"
                            ></el-progress>
                          </div>
                        </vue-scroll>
                      </template>
                      <loading
                        message="暂无路线数据"
                        loadingStatus="empty"
                        class="traffic-map-empty"
                        v-else
                      ></loading>
                    </div>
                  </vue-scroll>
                </div>
                <loading message="数据加载中..." v-else></loading>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!--地图工具按钮-->
    <div class="camera-type-panel">
      <!--<div class="map-back-btn" v-if="currCategoryPathIndex > 0" @click="gobackRoute">返回{{prevCategoryCode[2].name
          || '全国'}}
      </div>-->
      <div
        class="btn-wrap"
        :class="cameraStatusCollapsed ? 'status-collapsed' : ''"
      >
        <div
          class="ol-btn"
          :class="cameraStatusChange[1] ? 'active' : ''"
          @click="cameraStatusSelectClick('1')"
        ></div>
        <div
          class="fl-btn animated "
          :class="cameraStatusChange[4] ? 'active' : ''"
          @click="cameraStatusSelectClick('4')"
        ></div>
        <div
          class="ero-btn animated "
          :class="cameraStatusChange[3] ? 'active' : ''"
          @click="cameraStatusSelectClick('3')"
        ></div>
        <div class="collapse-btn" @click="cameraStatusCollapseClick"></div>
      </div>

      <div class="btn-wrap">
        <!--'1','2','3','7','5','6'-->
        <div
          class="dlyx-btn"
          :class="cameraTypeSelect.indexOf('1') >= 0 ? 'active' : ''"
          @click="cameraTypeSelectClick('1')"
        ></div>
        <div
          class="mj-btn"
          :class="cameraTypeSelect.indexOf('2') >= 0 ? 'active' : ''"
          @click="cameraTypeSelectClick('2')"
        ></div>
        <div
          class="qd-btn"
          :class="cameraTypeSelect.indexOf('3') >= 0 ? 'active' : ''"
          @click="cameraTypeSelectClick('3')"
        ></div>
        <div
          class="etc-btn"
          :class="cameraTypeSelect.indexOf('7') >= 0 ? 'active' : ''"
          @click="cameraTypeSelectClick('7')"
        ></div>
        <div
          class="sfz-btn"
          :class="cameraTypeSelect.indexOf('5') >= 0 ? 'active' : ''"
          @click="cameraTypeSelectClick('5')"
        ></div>
        <div
          class="fwq-btn"
          :class="cameraTypeSelect.indexOf('6') >= 0 ? 'active' : ''"
          @click="cameraTypeSelectClick('6')"
        ></div>
        <div
          class="qt-btn"
          :class="cameraTypeSelect.indexOf('4') >= 0 ? 'active' : ''"
          @click="cameraTypeSelectClick('4')"
        ></div>
        <div class="last-item"></div>
      </div>
    </div>

    <!--<div class="map-layer-wrap">
        <div class="base-layer-btn" v-if="mapLayerType==='google'" @click="checkMapType('base')">
            <span>地图</span>
        </div>
        <div class="google-layer-btn" v-if="mapLayerType==='base'" @click="checkMapType('google')">
            <span>卫星</span>
        </div>
    </div>-->

    <!--右侧侧边栏-->
    <div class="right-aside-box" :class="rightSideCollapsed ? 'collapsed' : ''">
      <div class="collapse-control" @click="rightSideCollapsedClick()">
        <i class="el-icon-arrow-right" v-if="!rightSideCollapsed"></i>
        <i class="el-icon-arrow-left" v-else></i>
      </div>

      <template v-if="!rightSideCollapsed">
        <div class="box-wrap right-chart-box">
          <div class="box-wrap-top">
            <div class="box-wrap-left-top"></div>
          </div>

          <div class="box-wrap-bottom"></div>

          <!--<div class="left-top"></div>
          <div class="right-top"></div>
          <div class="left-bottom"></div>
          <div class="right-bottom"></div>-->
          <div class="box-wrap-title">
            <div class="box-title-item active">
              <span>视频故障状况统计</span>
            </div>
          </div>

          <div class="box-wrap-body">
            <div id="abnormal-chart"></div>
          </div>
        </div>

        <div class="box-wrap right-list-box">
          <div class="box-wrap-top">
            <div class="box-wrap-left-top"></div>
          </div>
          <div class="box-wrap-bottom"></div>

          <div class="box-wrap-title">
            <div
              class="box-title-item"
              @click="changeRightProgress('province')"
              :class="rightProgressChose === 'province' ? 'active' : ''"
            >
              <span>各公司视频状况统计</span>
            </div>
            <div
              class="box-title-item"
              @click="changeRightProgress('road')"
              :class="rightProgressChose === 'road' ? 'active' : ''"
            >
              <span>各路线视频状况统计</span>
            </div>
          </div>
          <div class="box-wrap-body">
            <div
              class="progress-right-wrap"
              v-if="rightProgressChose === 'province'"
            >
              <template v-if="rightReginData.length > 0">
                <vue-scroll :ops="$root.scrollOpsY">
                  <div
                    class="progress-right-item"
                    v-for="(item, idx) in rightReginData"
                  >
                    <div class="progress-right-name">{{ item.name }}</div>
                    <div class="progress-right-body">
                      <div class="progress-right-content">
                        <el-row type="flex" class="right-list-item">
                          <el-col :span="8">接入 {{ item.total }}</el-col>
                          <el-col :span="8"
                            >在线
                            <span class="text-success">{{
                              item.online
                            }}</span></el-col
                          >
                          <el-col :span="8"
                            >离线
                            <span class="text-error">{{
                              item.offline
                            }}</span></el-col
                          >
                        </el-row>
                        <el-progress
                          :percentage="parseInt(item.rate.split('%')[0])"
                          :show-text="false"
                          color="#1ae57a"
                          status="exception"
                        ></el-progress>
                      </div>
                      <div class="progress-right-count">
                        <div>在线率</div>
                        <div>{{ item.rate }}</div>
                      </div>
                    </div>
                  </div>
                </vue-scroll>
              </template>
              <loading
                message="暂无数据"
                loadingStatus="empty"
                class="traffic-map-empty"
                v-else
              ></loading>
            </div>
            <div
              class="progress-right-wrap"
              v-if="rightProgressChose === 'road'"
            >
              <template v-if="rightRoadData.length > 0">
                <vue-scroll :ops="$root.scrollOpsY">
                  <div
                    class="progress-right-item"
                    v-for="(item, idx) in rightRoadData"
                  >
                    <div class="progress-right-name">{{ item.name }}</div>
                    <div class="progress-right-body">
                      <div class="progress-right-content">
                        <el-row type="flex" class="right-list-item">
                          <el-col :span="8">接入 {{ item.total }}</el-col>
                          <el-col :span="8"
                            >在线
                            <span class="text-success">{{
                              item.online
                            }}</span></el-col
                          >
                          <el-col :span="8"
                            >离线
                            <span class="text-error">{{
                              item.offline
                            }}</span></el-col
                          >
                        </el-row>
                        <el-progress
                          :percentage="parseInt(item.rate.split('%')[0])"
                          :show-text="false"
                          color="#1ae57a"
                          status="exception"
                        ></el-progress>
                      </div>
                      <div class="progress-right-count">
                        <div>在线率</div>
                        <div>{{ item.rate }}</div>
                      </div>
                    </div>
                  </div>
                </vue-scroll>
              </template>
              <loading
                message="暂无数据"
                loadingStatus="empty"
                class="traffic-map-empty"
                v-else
              ></loading>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script type="text/javascript" src="./js/szh-traffic-map.js"></script>
<style lang="less" src="./css/szh-traffic-map.less"></style>
