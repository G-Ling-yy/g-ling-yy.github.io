<template>
  <div :class="'map-box ' + boxOnTop">

    <div class="header-aside-box" v-if="boxOnTop === ''">
      <div class="header-datetime">
        {{currentDateTime}}
      </div>
      <div class="header-user-info">
        <i class="icon-user"></i>
        <span>{{userInfo ? userInfo.userName : ''}}</span>
        <i class="icon-switch-button"  @click="userExit()"></i>

        <i @click="handleFullScreen" class="icon-full-screen" :class="hasFullScreen ? 'active' : ''"></i>

        <!--<i class="el-icon-user"></i>
        <span>admin</span>
        <i class="el-icon-switch-button"></i>
        <i class="el-icon-full-screen"></i>-->
      </div>
      <div class="header-menu">
        <div class="header-menu-left">
          <div class="header-menu-button active">
            <router-link
              class="home"
              tag="div"
              :to="{name:'index'}"
            ><i class="el-icon-s-home"></i></router-link>

          </div>
        </div>
        <div class="header-menu-right">
          <div class="header-menu-button">
            <router-link
              class="home"
              tag="div"
              :to="{path:'/dashboard'}"
            ><i class="el-icon-setting"></i></router-link>
          </div>
        </div>
      </div>
    </div>

    <!--地图容器-->
    <traffic-amap ref="amapIns"
                  @amapComplete="amapCompleteCallback"
                  @amapClick="amapClickCallback"
                  @amap-changed="refreshAmapMarks"
                  :base-top-adcodes="regionCode"
                  :base-top-adcodes-name="regionName"
                  :style="boxOnTop === '' ? 'height:calc(100% - 86px)' : ''"
    ></traffic-amap>
    <!--<emap @emap-complete="amapCompleteCallback"></emap>-->


    <!--左侧侧边栏-->
    <div class="left-aside-box" :class="leftSideCollapsed ? 'collapsed' : ''" >

      <div class="collapse-control" @click="leftSideCollapsed = !leftSideCollapsed">
        <i class="el-icon-arrow-left" v-if="!leftSideCollapsed"></i>
        <i class="el-icon-arrow-right" v-else></i>
      </div>

      <template v-if="!leftSideCollapsed">
        <div class="box-wrap"  >
          <div class="box-wrap-top">
            <div class="box-wrap-left-top"></div>
          </div>
          <div class="box-wrap-bottom"></div>

          <!--<div class="left-top"></div>
          <div class="right-top"></div>
          <div class="left-bottom"></div>
          <div class="right-bottom"></div>-->
          <div class="box-wrap-title">

            <div class="box-title-item title-mini" :class="cameraCategoryRoute === 2 ? 'active' : ''" @click="checkCameraRouterBtnClick(2)">
              <span>路线</span>
            </div>
            <div class="box-title-item title-mini" :class="cameraCategoryRoute === 3 ? 'active' : ''" @click="checkCameraRouterBtnClick(3)">
              <span>区域</span>
            </div>
            <div class="box-title-item title-mini" :class="cameraCategoryRoute === 1 ? 'active' : ''" @click="checkCameraRouterBtnClick(1)">
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
            <el-select v-model="cameraCateSelect" class="camera-cate-select" popper-class="camera-cate-select-popper">
              <el-option value="99" label="全部"></el-option>
              <template v-for="classIfy in classIfyList" >
                <el-option :value="classIfy.codeValue" :label="classIfy.codeName" v-if="classIfy.codeValue !== '0'"></el-option>
              </template>
            </el-select>

            <!-- 左侧列表 -->
            <div class="left-progress-box">

              <el-breadcrumb separator-class="el-icon-arrow-right" v-if="currCategoryPathIndex > 0 || currentMapRegionCode !== 100000">
                <template v-if="regionCode === 100000 && cameraCategoryRouteList[cameraCategoryRoute][0]['code'] !== 'road'">
                  <el-breadcrumb-item ><span @click="breadcrumbClick($event)">全国</span></el-breadcrumb-item>
                </template>
                <!-- <template v-if="cameraCategoryRouteList[cameraCategoryRoute][0]['code'] === 'road'">
                  <el-breadcrumb-item ><span @click="breadcrumbClick($event)">全部</span></el-breadcrumb-item>
                </template> -->
                <template v-for="(rout,ridx) in cameraCategoryRouteList[cameraCategoryRoute]">
                  <el-breadcrumb-item v-if="rout.name"><span @click="breadcrumbClick($event,rout,ridx)">{{rout.name}}</span>
                  </el-breadcrumb-item>
                </template>
                <!--<el-breadcrumb-item>南京</el-breadcrumb-item>-->
              </el-breadcrumb>

              <el-row type="flex" v-if="currCategoryCode === 'camera'">
                <el-col :span="4"><span class="text-grey">序号</span></el-col>
                <el-col :span="15"><span class="text-grey">桩号</span></el-col>
                <el-col :span="5"><span class="text-grey">状态</span></el-col>
                <!--<el-col :span="5"><span class="text-grey">操作</span></el-col>-->
              </el-row>
              <!--:style="{height:currCategoryCode === 'camera' ? 'calc(100% - 20px)' : '100%'}" -->
              <div class="camera-list-wrap"
                   :style="{height:currCategoryPathIndex > 0 ? (currCategoryCode === 'camera' ? 'calc(100% - 120px)' : 'calc(100% - 95px)') : 'calc(100% - 75px)'}"
                   v-if="!cameraLoading">
                <vue-scroll :ops="$root.scrollOpsY">
                  <div class="progress-box progress-province" v-if="currCategoryCode === 'province'">

                    <!--v-if="currentMapRegionCode === 100000 || (currentMapRegionCode !== 100000 && parseInt(provInfo.id) === currentMapRegionCode)"-->

                    <template v-if="deviceStatistics.deviceStatisticsListByProvince.length">
                      <div class="progress-item-wrap"
                           v-for="provInfo in deviceStatistics.deviceStatisticsListByProvince"
                           @mouseover="districtMouseover(provInfo.id)"
                           @click="changeCameraCategoryPath(provInfo.id,provInfo.name,'province')">
                        <p>
                          <span class="progress-name">{{provInfo.name}}&nbsp;</span>
                          <span>{{provInfo.online}}/{{provInfo.total}}</span>
                        </p>
                        <el-progress :percentage="parseInt(provInfo.rate*100)" :show-text="false"
                                     color="#299dff"></el-progress>
                      </div>
                    </template>
                    <loading message="暂无省份数据" loadingStatus="empty" v-else></loading>

                  </div>
                  <div class="progress-box progress-city" v-if="currCategoryCode === 'city'">

                    <template v-if="deviceStatistics.deviceStatisticsListByCity.length">
                      <div class="progress-item-wrap"
                           v-for="cityInfo in  deviceStatistics.deviceStatisticsListByCity"
                           @mouseover="districtMouseover(cityInfo.id)"
                           @click="changeCameraCategoryPath(cityInfo.id,cityInfo.name,'city')">
                        <p>
                          <span class="progress-name">{{cityInfo.name}}&nbsp;</span>
                          <span>{{cityInfo.online}}/{{cityInfo.total}}</span>
                        </p>
                        <el-progress :percentage="parseInt(cityInfo.rate*100)" :show-text="false"
                                     color="#299dff"></el-progress>
                      </div>
                    </template>
                    <loading message="暂无城市数据" loadingStatus="empty" v-else></loading>
                  </div>
                  <div class="progress-box progress-company" v-if="currCategoryCode === 'company'">
                    <!--<div class="progress-item-wrap" v-for="a in 6" @click="changeCameraCategoryPath('cp','大港汽渡'+a,'company')">
                        <p>大港汽渡{{a}}</p>
                        <el-progress :percentage="80" :show-text="false" color="#299dff"></el-progress>
                    </div>-->
                    <template v-if="deviceStatistics.deviceStatisticsListByOrg.length">
                      <div class="progress-item-wrap"
                           v-for="orgInfo in  deviceStatistics.deviceStatisticsListByOrg"
                           @click="changeCameraCategoryPath(orgInfo.id,orgInfo.name,'company')">
                        <p>
                          <span class="progress-name">{{orgInfo.name}}&nbsp;</span>
                          <span>{{orgInfo.online}}/{{orgInfo.total}}</span>
                        </p>
                        <el-progress :percentage="parseInt(orgInfo.rate*100)" :show-text="false"
                                     color="#299dff"></el-progress>
                      </div>
                    </template>
                    <loading message="暂无组织数据" loadingStatus="empty" v-else></loading>
                  </div>
                  <div class="camera-list" v-if="currCategoryCode === 'camera'">
                    <template v-if="deviceStatistics.deviceStatisticsList.length">
                      <el-row type="flex" v-for="(camera,idx) in deviceStatistics.deviceStatisticsList" :class="selectCameraIndex === idx ? 'active' : ''">
                        <el-col :span="4">{{idx+1}}</el-col>
                        <el-col :span="15" class="camera-name-content">
                          <span class="text-info" style="cursor:pointer" @click="showCamera2AMap(camera,idx)">K{{camera.kmPile}}+{{camera.hmPile}}</span>
                        </el-col>
                        <el-col :span="5">
                                            <span :class="camera.onlineStatus ? ['text-grey','text-info','text-error'][camera.onlineStatus*1] : 'text-grey'">
                                                {{camera.onlineStatus ? ['离线','在线','故障'][camera.onlineStatus * 1] : '未知'}}
                                            </span>
                        </el-col>
                        <!--<el-col :span="5"><span class="text-success" @click="showCamera2AMap(camera)">查看</span>
                        </el-col>-->
                      </el-row>
                    </template>
                    <loading message="暂无摄像机数据" loading-status="empty" v-else></loading>
                  </div>
                  <div class="progress-box progress-road"  v-if="currCategoryCode === 'road'">
                    <template v-if="Object.keys(deviceStatistics.deviceStatisticsListByRoad).length">
                      <el-collapse v-model="progressRoadCollapseIndex">
                        <el-collapse-item v-for="(staticKeys,skey) in Object.keys(deviceStatistics.deviceStatisticsListByRoad)"
                                          :title="staticKeys" :name="skey">
                          <vue-scroll :ops="$root.scrollOpsY">
                            <div class="progress-item-wrap"
                                 v-for="roadInfo in  deviceStatistics.deviceStatisticsListByRoad[staticKeys]"
                                 @click="changeCameraCategoryPath(roadInfo.id,roadInfo.id + '' + roadInfo.name,'road')">
                              <p>
                                <span class="progress-name">{{roadInfo.id}}&nbsp;{{roadInfo.name}}</span>
                                <span>{{roadInfo.online}}/{{roadInfo.total}}</span>
                              </p>
                              <el-progress :percentage="parseInt(roadInfo.rate * 100)" :show-text="false"
                                           color="#299dff"></el-progress>
                            </div>
                          </vue-scroll>
                        </el-collapse-item>
                      </el-collapse>
                    </template>
                    <loading message="暂无路线数据" loadingStatus="empty" v-else></loading>
                  </div>
                </vue-scroll>
                <!--<div class="progress-box progress-road" v-else>
                    <template v-if="Object.keys(deviceStatistics.deviceStatisticsListByRoad).length">
                        <el-collapse v-model="progressRoadCollapseIndex">
                            <el-collapse-item v-for="(staticKeys,skey) in Object.keys(deviceStatistics.deviceStatisticsListByRoad)"
                                              :title="staticKeys" :name="skey">
                                <vue-scroll :ops="$root.scrollOpsY">
                                <div class="progress-item-wrap"
                                     v-for="roadInfo in  deviceStatistics.deviceStatisticsListByRoad[staticKeys]"
                                     @click="changeCameraCategoryPath(roadInfo.id,roadInfo.id + '' + roadInfo.name,'road')">
                                    <p>
                                        <span class="progress-name">{{roadInfo.id}}&nbsp;{{roadInfo.name}}</span>
                                        <span>{{roadInfo.online}}/{{roadInfo.total}}</span>
                                    </p>
                                    <el-progress :percentage="parseInt(roadInfo.rate * 100)" :show-text="false"
                                                 color="#299dff"></el-progress>
                                </div>
                                </vue-scroll>
                            </el-collapse-item>
                        </el-collapse>
                    </template>
                    <loading message="暂无路线数据" loadingStatus="empty" v-else></loading>
                </div>-->

                <!--<template v-if="['province','city','company', 'road'].indexOf(currCategoryCode) >= 0">
                </template>-->
              </div>
              <loading message="数据加载中..." v-else></loading>


            </div>
          </div>
        </div>
      </template>

    </div>


    <!--地图工具按钮-->
    <div class="camera-type-panel" v-if="0" >
      <!--<div class="map-back-btn" v-if="currCategoryPathIndex > 0" @click="gobackRoute">返回{{prevCategoryCode[2].name
          || '全国'}}
      </div>-->
      <!--<div class="btn-wrap" :class="cameraStatusCollapsed ? 'status-collapsed' : ''">
        <div class="ol-btn" :class="cameraStatusChange.indexOf('1') >= 0  ? 'active' : ''" @click="cameraStatusSelectClick('1')"></div>
        <div class="fl-btn animated " :class="cameraStatusChange.indexOf('0') >= 0  ? 'active' : ''" @click="cameraStatusSelectClick('0')"></div>
        <div class="ero-btn animated " :class="cameraStatusChange.indexOf('2') >= 0  ? 'active' : ''" @click="cameraStatusSelectClick('2')"></div>
        <div class="collapse-btn" @click="cameraStatusCollapseClick"></div>
      </div>-->

      <div class="btn-wrap">
        <!--'1','2','3','7','5','6'-->
        <div class="dlyx-btn" :class="cameraTypeSelect.indexOf('1') >= 0  ? 'active' : ''" @click="cameraTypeSelectClick('1')"></div>
        <div class="mj-btn" :class="cameraTypeSelect.indexOf('2') >= 0 ? 'active' : ''" @click="cameraTypeSelectClick('2')"></div>
        <div class="qd-btn" :class="cameraTypeSelect.indexOf('3') >= 0 ? 'active' : ''" @click="cameraTypeSelectClick('3')"></div>
        <div class="qt-btn" :class="cameraTypeSelect.indexOf('4') >= 0 ? 'active' : ''" @click="cameraTypeSelectClick('4')"></div>
        <div class="etc-btn" :class="cameraTypeSelect.indexOf('7') >= 0 ? 'active' : ''" @click="cameraTypeSelectClick('7')"></div>
        <div class="sfz-btn" :class="cameraTypeSelect.indexOf('5') >= 0 ? 'active' : ''" @click="cameraTypeSelectClick('5')"></div>
        <div class="fwq-btn" :class="cameraTypeSelect.indexOf('6') >= 0 ? 'active' : ''" @click="cameraTypeSelectClick('6')"></div>
        <div class="last-item" ></div>
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

      <template  v-if="!rightSideCollapsed">

        <div class="box-wrap right-chart-box"  >
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
              <span>全国视频故障状况统计</span>
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
            <div class="box-title-item" @click="changeRightProgress('province')"
                 :class="rightProgressChose === 'province' ? 'active' : ''" >
              <span>各省份视频状况统计</span>
            </div>
            <div class="box-title-item" @click="changeRightProgress('road')"
                 :class="rightProgressChose === 'road' ? 'active' : ''" >
              <span>各路线视频状况统计</span>
            </div>
          </div>
          <div class="box-wrap-body">
            <div class="progress-right-wrap" v-if="rightProgressChose === 'province'" >
              <template v-if="deviceStatistics.deviceStatisticsByRegionAll.length>0">
                <vue-scroll :ops="$root.scrollOpsY">
                  <div class="progress-right-item" v-for="(item,idx) in deviceStatistics.deviceStatisticsByRegionAll">
                    <span class="progress-right-name">{{item.name}}</span>
                    <div class="progress-right-content">
                      <el-row type="flex" class="right-list-item">
                        <el-col :span="8">接入 {{item.total}}</el-col>
                        <el-col :span="8">正常 <span class="text-success">{{item.online}}</span></el-col>
                        <el-col :span="8">故障 <span class="text-error">{{item.inerror+item.offline}}</span></el-col>
                      </el-row>
                      <el-progress :percentage="parseInt((item.rate*100).toFixed(1))" :show-text="false"
                                   color="#1ae57a" status="exception"></el-progress>
                    </div>
                    <div class="progress-right-count"><span>正常率</span><span>{{(item.rate*100).toFixed(1)}}%</span></div>
                  </div>
                </vue-scroll>
              </template>
              <loading message="数据加载中..." loadingStatus="empty"v-else></loading>
            </div>
            <div class="progress-right-wrap" v-if="rightProgressChose === 'road'"  >
              <template v-if="deviceStatistics.deviceStatisticsByRegionAll.length>0">
                <vue-scroll :ops="$root.scrollOpsY">
                  <div class="progress-right-item" v-for="(item,idx) in deviceStatistics.deviceStatisticsByRoadAll">
                    <span class="progress-right-name">{{item.id}}</span>
                    <div class="progress-right-content">
                      <el-row type="flex" class="right-list-item">
                        <el-col :span="8">接入 {{item.total}}</el-col>
                        <el-col :span="8">正常 <span class="text-success">{{item.online}}</span></el-col>
                        <el-col :span="8">故障 <span class="text-error">{{item.inerror+item.offline}}</span></el-col>
                      </el-row>
                      <el-progress :percentage="parseInt((item.rate*100).toFixed(1))" :show-text="false"
                                   color="#1ae57a" status="exception"></el-progress>
                    </div>
                    <div class="progress-right-count"><span>正常率</span><span>{{(item.rate*100).toFixed(1)}}%</span></div>
                  </div>
                </vue-scroll>
              </template>
              <loading message="数据加载中..." loadingStatus="empty"v-else></loading>
            </div>
          </div>

        </div>
      </template>

    </div>

  </div>
</template>


<script type="text/javascript" src="./sjk-map.js"></script>
<style lang="less" src="./sjk-map.less"></style>
