<template>
  <div>
    <div
      id="camera-info-window-view"
      v-show="visible"
      :style="{ left: style.left }"
    >
      <!-- 云台控制 -->
      <!-- <div class="camera-cloud">
        <img src="../assets/images/icon/clound.png"  @click="clickCloudControl()" style="width:30px" />
      </div> -->
      <div
        id="camera-info-window"
        class="camera-info-window"
      >
        <!-- 播放器 -->
        <!-- <div class="info-window-wrapper" @mousedown="mousedown($event,'camera-info-window-view')"> -->
        <div class="info-window-wrapper">
          <div class="info-window-control">
            <i
              class="el-icon-close"
              @click="dialogClose"
            ></i>
          </div>
          <!--<div class="info-window-top-right"></div>-->
          <div class="info-window-bottom-left"></div>

          <div class="info-window-body">
            <div
              class="camera-image"
              v-loading="getUrlLoading"
              element-loading-background="rgba(0, 0, 0, 0.8)"
            >
              <!-- <ali-player
                ref="aliplayer"
                v-if="
                  usePlayerType === 'ali' || isAliPlayer
                "
                :useFlashPrism="true"
                :autoplay="true"
                :isLive="true"
                :rePlay="false"
                :showBuffer="true"
                controlBarVisibility="hover"
                :source="videoUrl"
              >
              </ali-player> -->
              <!--<h5d-player ref="dplayerH5"  v-if="usePlayerType === 'dplayer'"></h5d-player>-->

              <!-- flv播放器 -->
              <flv-player
                ref="flvPlay"
                v-show="
                  usePlayerType === 'flv' &&
                    !isThreePlayer &&
                    !isAliPlayer &&
                    (!BASETargetIsNbtd || 
                    !iswebRTC)
                "
                video-type="flv"
                :cameraInfo="cameraInfo"
              ></flv-player>

              <!-- 全景播放器 -->
              <three-player
                ref="threePlay"
                v-show="
                  usePlayerType === 'flv' &&
                    isThreePlayer &&
                    !isAliPlayer &&
                    (!BASETargetIsNbtd || 
                    !iswebRTC)
                "
                video-type="flv"
              ></three-player>

              <!-- webRTC播放器 -->
              <webRTC-player
                v-show="BASETargetIsNbtd && iswebRTC"
                ref="refWebRTCPlayer"
                :device="deviceInfo"
              />
            </div>
            <div
              class="camera-content"
              v-show="currentCamera"
            >
              <div class="camera-controls">
                <!-- <span @click="imgCut">截图</span> -->
                <span @click="playerFullScreen()">全屏</span>
                <!-- 高标清切换 -->
                <span
                  title="切换至高清"
                  @click="resolutionChange('1')"
                  v-if="resolutionValue === '0'"
                  >高清</span
                >
                <span
                  title="切换至标清"
                  @click="resolutionChange('0')"
                  v-else
                  >标清</span
                >
              </div>
            </div>
            <!-- 视频调节设置 -->
            <div class="regulation">
              <!-- <div class="regulation" v-if="cameraRegulationVisable"> -->
              <!-- <div class="regulation-ico">
              <i class="el-icon-close" @click="regulationClose" ></i>
            </div> -->
              <!-- 亮度 -->
              <div class="slider">
                <div class="block">
                  <span class="demonstration">亮度</span>
                  <el-slider
                    v-model="adjustBright"
                    @input="adjust()"
                  ></el-slider>
                </div>
              </div>
              <!-- 亮度 -->
              <div class="slider">
                <div class="block">
                  <span class="demonstration">对比度</span>
                  <el-slider
                    v-model="adjustContrast"
                    @input="adjust()"
                  ></el-slider>
                </div>
              </div>
              <!-- 锐度 -->
              <!-- <div class="slider" >
                  <div class="block">
                    <span class="demonstration">锐度</span>
                      <el-slider :min="0" :max="10" v-model="adjustAcutance" @input="adjust()"></el-slider>
                  </div>
              </div> -->
            </div>

            <!--摄像头信息-->
            <div
              class="camera-info-wrapper"
              v-if="
                cameraInfoVisable && !cameraInfoEditVisable
              "
              :class="cameraInfoVisable ? 'hasVisable' : ''"
            >
              <div class="info-window-control">
                <i
                  class="el-icon-close"
                  @click="dialogClose"
                ></i>
                <!-- <i class="el-icon-edit-outline" @click="cameraInfoEditVisable = true, cameraInfoVisable=false" v-has-permiss="10931010"></i> -->
              </div>
              <div class="info-window-top-right"></div>
              <div class="info-window-bottom-left"></div>

              <div class="info-window-body">
                <div class="info-window-title">
                  <p style="padding:0;margin:0">
                    摄像机详情
                  </p>
                </div>
                <!-- <el-form
                    class="camera-info-name"
                    size="mini"
                    label-position="left"
                  >
                    <el-tooltip
                      class="itemVideoName"
                      effect="dark"
                      :content="cameraInfo.cameraName"
                      placement="top-start"
                    >
                      <el-form-item label="名称">
                        {{ cameraInfo.cameraName }}
                      </el-form-item>
                    </el-tooltip>
                  </el-form> -->
                <div class="camera-info-name">
                  <span class="camera-info-title"
                    >名称</span
                  >
                  <span class="camera-info-content">{{
                    cameraInfo.cameraName
                  }}</span>
                </div>
                <div
                  class="info-window-content"
                  style="display: flex;"
                >
                  <el-form
                    class="camera-info-form"
                    size="mini"
                    label-position="left"
                  >
                    <el-tooltip
                      effect="dark"
                      :content="cameraInfo.cameraNum"
                      placement="top-start"
                    >
                      <el-form-item
                        label="编号"
                        class="cameraInfoTip"
                      >
                        {{ cameraInfo.cameraNum }}
                      </el-form-item>
                    </el-tooltip>
                    <el-form-item label="路线">
                      <!-- {{cameraInfo.roadCode}} -->
                      <div @change="leaveInput(cameraInfo)">
                        <span
                          v-if="!editing"
                          @dblclick="edit"
                          >{{ cameraInfo.roadCode }}</span
                        >
                        <el-input
                          type="text"
                          class="editInput"
                          v-if="editing"
                          v-model="cameraInfo.roadCode"
                          @blur="save"
                        ></el-input>
                      </div>
                    </el-form-item>
                    <el-form-item label="桩号">
                      <!-- {{cameraInfo.kmPile}} -->
                      <div @change="leaveInput(cameraInfo)">
                        <span
                          v-if="!editing"
                          @dblclick="edit"
                          >{{ cameraInfo.kmPile }}</span
                        >
                        <el-input
                          type="text"
                          class="editInput"
                          v-if="editing"
                          v-model="cameraInfo.kmPile"
                          @blur="save"
                        ></el-input>
                      </div>
                    </el-form-item>
                    <el-form-item label="方向">
                      {{ cameraInfo.derectionCode }}
                    </el-form-item>
                    <el-form-item label="类型">
                      {{ cameraInfo.cameraType }}
                    </el-form-item>
                    <el-form-item label="状态">
                      {{
                        cameraInfo.onlineStatus == 0
                          ? '离线'
                          : cameraInfo.onlineStatus == 1
                          ? '在线 '
                          : cameraInfo.onlineStatus == 2
                          ? '异常 '
                          : ''
                      }}
                    </el-form-item>

                    <el-tooltip
                      effect="dark"
                      :content="cameraInfo.transcodingName"
                      placement="top-start"
                    >
                      <el-form-item
                        label="所属网关"
                        class="cameraInfoTip"
                      >
                        {{ cameraInfo.transcodingName }}
                      </el-form-item>
                    </el-tooltip>

                    <el-tooltip
                      effect="dark"
                      :content="cameraInfo.organizationName"
                      placement="top-start"
                    >
                      <el-form-item
                        label="管辖单位"
                        class="cameraInfoTip"
                      >
                        {{ cameraInfo.organizationName }}
                      </el-form-item>
                    </el-tooltip>

                    <el-form-item label="所属高速">
                      {{ cameraInfo.roadName }}
                    </el-form-item>

                    <el-form-item label="所属类别">
                      {{
                        cameraInfo.classifyCode == 0
                          ? '默认'
                          : cameraInfo.classifyCode == 1
                          ? '道路沿线 '
                          : cameraInfo.classifyCode == 2
                          ? '桥梁 '
                          : cameraInfo.classifyCode == 3
                          ? '隧道 '
                          : cameraInfo.classifyCode == 4
                          ? '收费广场 '
                          : cameraInfo.classifyCode == 5
                          ? '收费站 '
                          : cameraInfo.classifyCode == 6
                          ? '服务区 '
                          : cameraInfo.classifyCode == 9
                          ? '加油站 '
                          : cameraInfo.classifyCode == 7
                          ? 'ETC门架 '
                          : cameraInfo.classifyCode == 8
                          ? '移动视频源 '
                          : ''
                      }}
                    </el-form-item>
                  </el-form>
                  <el-form
                    class="camera-info-form"
                    size="mini"
                    label-position="left"
                  >
                    <el-form-item
                      label="经度"
                      class="cameraInfoTip"
                    >
                      {{ getLongAndLati(0) }}
                    </el-form-item>
                    <el-form-item
                      label="纬度"
                      class="cameraInfoTip"
                    >
                      {{ getLongAndLati(1) }}
                    </el-form-item>
                    <el-form-item label="所属地">
                      {{ cameraInfo.regionId }}
                    </el-form-item>

                    <el-form-item label="兴趣点">
                      {{ cameraInfo.poiName }}
                    </el-form-item>

                    <el-form-item label="网关ID">
                      {{ cameraInfo.transcodingId }}
                    </el-form-item>
                    <el-form-item label="道路ID">
                      {{ cameraInfo.roadId }}
                    </el-form-item>
                    <el-form-item label="组织ID">
                      {{ cameraInfo.organizationId }}
                    </el-form-item>

                    <el-form-item label="云台控制">
                      {{
                        cameraInfo.ptzControlStatus == 0
                          ? '不可控'
                          : '可控'
                      }}
                    </el-form-item>
                    <el-form-item label="是否上报">
                      {{
                        cameraInfo.isReport == 0
                          ? '未上报'
                          : '上报'
                      }}
                    </el-form-item>

                    <el-form-item label="起始图层">
                      {{ cameraInfo.mapLevelStart }}
                      <!-- <div  v-preventReSubmit>
                         <el-input-number @change="leaveMapInput(cameraInfo)" v-model="cameraInfo.mapLevelStart" controls-position="right" :min="1" :max="18" style="width:75px;"></el-input-number>
                        </div> -->
                    </el-form-item>
                  </el-form>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 云台控制 -->
        <div class="videoCloud" v-show="isCloudHigh()">
          <div class="video-console" v-if="isCloudControl">
            <div class="cloud-console" style="color:#fff">
              云台控制
            </div>
            <div class="control-wrap">
              <div class="control-center">云台</div>
              <div class="control-panel">
                <div
                  class="control-top"
                  @click="controlChange(3)"
                >
                  <i class="el-icon-caret-top"></i>
                </div>
                <div
                  class="control-right"
                  @click="controlChange(2)"
                >
                  <i class="el-icon-caret-top"></i>
                </div>
                <div
                  class="control-bottom"
                  @click="controlChange(4)"
                >
                  <i class="el-icon-caret-top"></i>
                </div>
                <div
                  class="control-left"
                  @click="controlChange(1)"
                >
                  <i class="el-icon-caret-top"></i>
                </div>
              </div>
            </div>
            <div class="control-column">
              <div class="zoom">
                <div class="left-btn">
                  <div
                    class="minus"
                    @click="controlChange(5)"
                  ></div>
                </div>
                变倍
                <div class="right-btn">
                  <div
                    class="add"
                    @click="controlChange(6)"
                  ></div>
                </div>
              </div>
              <div class="focusing">
                <div class="left-btn">
                  <div
                    class="minus"
                    @click="controlChange(7)"
                  ></div>
                </div>
                聚焦
                <div class="right-btn">
                  <div
                    class="add"
                    @click="controlChange(8)"
                  ></div>
                </div>
              </div>
              <div class="aperture">
                <div class="left-btn">
                  <div
                    class="minus"
                    @click="controlChange(9)"
                  ></div>
                </div>
                光圈
                <div class="right-btn">
                  <div
                    class="add"
                    @click="controlChange(10)"
                  ></div>
                </div>
              </div>
            </div>
            <div class="step-size">
              <span style="color:#fff">步长</span>
              <el-input-number
                v-model="stepSize"
                controls-position="right"
                :min="1"
                :max="8"
              ></el-input-number>
            </div>
          </div>
        </div>
        <!--截图预览-->
        <images-view ref="cameraImages"></images-view>
        <div
          class="info-window-wrapper camera-images-wrapper"
          v-if="false"
          v-show="cameraImagesVisable"
          :class="cameraImagesVisable ? 'hasVisable' : ''"
        >
          <div class="info-window-control">
            <i
              class="el-icon-close"
              @click="cameraImagesClose"
            ></i>
          </div>
          <div class="info-window-top-right"></div>
          <div class="info-window-bottom-left"></div>

          <div class="info-window-body">
            <div class="info-window-title">查看快照</div>
            <div class="info-window-content">
              <images-view ref="cameraImages"></images-view>
            </div>
          </div>
        </div>

        <!-- :style="cameraInfoVisable ? {} : {top:'-30px'}" -->
        <!--摄像头信息编辑-->
        <div
          class="info-window-wrapper camera-info-edit-wrapper"
          v-if="cameraInfoEditVisable && !cameraInfoVisable"
        >
          <div class="info-window-control">
            <i
              class="el-icon-close"
              @click="
                cameraInfoEditVisable = false
                cameraInfoVisable = true
              "
            ></i>
          </div>
          <div class="info-window-top-right"></div>
          <div class="info-window-bottom-left"></div>

          <div class="info-window-body">
            <div class="info-window-title">
              摄像机详情编辑
            </div>
            <div class="info-window-content">
              <el-form
                ref="cameraInfoForm"
                class="camera-info-form"
                :rules="addFormRules"
                :model="cameraInfoForm"
                label-width="120px"
                size="mini"
                label-position="left"
              >
                <el-form-item label="所在行政区">
                  <span class="form-item-text">{{
                    cameraInfoForm.provinceName
                  }}</span>
                </el-form-item>
                <el-form-item label="摄像机名称">
                  <el-input
                    v-model="cameraInfoForm.cameraName"
                    clearable
                  ></el-input>
                </el-form-item>
                <el-form-item label="摄像机状态">
                  <span class="form-item-text">{{
                    ['离线', '在线', '故障'][
                      cameraInfoForm.status
                    ]
                  }}</span>
                </el-form-item>
                <el-form-item label="摄像机桩号">
                  <el-input
                    v-model="cameraInfoForm.pile"
                  ></el-input>
                  <el-input-number
                    v-model="cameraInfoForm.cameraKmpile"
                    :controls="false"
                    :min="0"
                    style="width:60px;"
                  ></el-input-number
                  >&nbsp;km&nbsp;
                  <el-input
                    v-model="addForm.cameraHmpile"
                  ></el-input>
                  <el-input-number
                    v-model="cameraInfoForm.cameraHmpile"
                    :controls="false"
                    :min="0"
                    style="width:60px;"
                  ></el-input-number
                  >&nbsp;m
                </el-form-item>
                <el-form-item label="经度">
                  <el-input-number
                    @change="lnglatChange(true)"
                    v-model="cameraInfoForm.longitude"
                    :controls="false"
                    :min="1"
                    :max="181"
                    style="width:100%;"
                  ></el-input-number>
                </el-form-item>
                <el-form-item label="纬度">
                  <el-input-number
                    @change="lnglatChange(true)"
                    v-model="cameraInfoForm.latitude"
                    :controls="false"
                    :min="1"
                    :max="91"
                    style="width:100%;"
                  ></el-input-number>
                </el-form-item>
                <el-form-item label="图层(起~止)">
                  <el-input-number
                    v-model="cameraInfoForm.maplevelStart"
                    controls-position="right"
                    :min="1"
                    :max="18"
                    style="width:75px;"
                  ></el-input-number
                  >&nbsp;&nbsp;~&nbsp;
                  <el-input-number
                    v-model="cameraInfoForm.maplevelEnd"
                    controls-position="right"
                    :min="1"
                    :max="18"
                    style="width:75px;position: absolute;right: 0px;top: 1px;}"
                  ></el-input-number>
                </el-form-item>
                <el-form-item label="所属类别">
                  <el-select
                    v-model="cameraInfoForm.classify"
                    placeholder="请选择所属类别"
                    popper-class="camera-info-popper"
                  >
                    <el-option
                      v-for="(item, key) in classIfyList"
                      :key="key"
                      :label="item.codeName"
                      :value="item.codeValue"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="摄像机方向">
                  <el-select
                    v-model="cameraInfoForm.derection"
                    placeholder="请选择摄像机方向"
                    popper-class="camera-info-popper"
                  >
                    <el-option
                      v-for="(item, key) in derectionList"
                      :key="key"
                      :label="item.codeName"
                      :value="item.codeValue"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <!--<el-form-item :label="'所属视频上云网关'">
                    <el-select v-model="cameraInfoForm.transcodingId" placeholder="请选择所属视频上云网关" popper-class="camera-info-popper">
                        <el-option v-for="trans in transcoding.transcodingList" :label="trans.transcodingName" :value="trans.transcodingId"></el-option>
                    </el-select>
                </el-form-item>-->
                <el-form-item label="管辖单位">
                  <!--<el-select v-model="cameraInfoForm.organizationCode" placeholder="请选择管辖单位" popper-class="camera-info-popper">
                      <el-option  v-for="item in orgList" :label="item.organizationName" :value="item.organizationId"></el-option>
                  </el-select>-->
                  <span class="form-item-text">{{
                    cameraInfoForm.organizationName
                  }}</span>
                </el-form-item>
                <el-form-item label="路线">
                  <el-select
                    v-model="cameraInfoForm.roadId"
                    placeholder="请选择路线"
                    popper-class="camera-info-popper"
                  >
                    <el-option
                      v-for="(item, key) in roadList"
                      :key="key"
                      :label="item.roadName"
                      :value="item.roadCode"
                    ></el-option>
                  </el-select>
                  <span
                    class="camera-icon-button"
                    style="margin-right: 14px"
                    @click.stop="editMaplevel(true)"
                    >图层初始化</span
                  >
                  <span
                    class="camera-icon-button"
                    @click.stop="resetCameraLonLat(true)"
                    >复位</span
                  >
                </el-form-item>
                <el-row
                  class="camera-info-buttons"
                  :gutter="20"
                >
                  <el-col :span="12">
                    <el-button
                      type="primary"
                      @click="onInfoSubmit(true)"
                      size="mini"
                      >确定</el-button
                    >
                  </el-col>
                  <el-col :span="12">
                    <el-button
                      size="mini"
                      @click="
                        cameraInfoEditVisable = false
                        cameraInfoVisable = true
                      "
                      >取消</el-button
                    >
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--摄像头信息编辑 右击弹窗-->
    <div
      class="camera-info-window camera-alone-info"
      id="camera-info-edit-window-view"
      v-show="cameraInfoAlongEditVisable"
      :style="{
        top: page.top + 'px',
        left: page.left + 8 + 'px'
      }"
      v-drag
      ref="showPanel"
    >
      <!-- @mouseleave="leave" -->
      <div
        class="info-window-wrapper "
        @mousedown.self.stop="
          mousedown($event, 'camera-info-edit-window-view')
        "
      >
        <!-- @mouseleave="leave" -->
        <!-- 关闭按钮 -->
        <!-- <div class="info-window-control">
          <i class="el-icon-close" @click="cameraInfoAlongEditVisable = false"></i>
        </div> -->
        <div class="info-window-top-right"></div>
        <div class="info-window-bottom-left"></div>

        <div class="info-window-body">
          <!-- <div class="info-window-title" @mousedown.self.stop="mousedown($event,'camera-info-edit-window-view')">摄像机详情编辑</div> -->
          <div class="info-window-content">
            <span
              class="info-window-content-title"
              @click="cameraScreen()"
            >
              {{ cameraDialogInfo.road }}
            </span>
            <div class="info-window-classify">
              摄像机分类:
            </div>
            <div class="info-window-classify-info">
              <span
                class="info-window-content-title"
                @click="infoWindowClassify(1)"
                ><i
                  class="el-icon-check"
                  v-if="
                    cameraDialogInfo.classify == 1
                      ? true
                      : false
                  "
                ></i
                >道路</span
              >
              <span
                class="info-window-content-title"
                @click="infoWindowClassify(2)"
                ><i
                  class="el-icon-check"
                  v-if="
                    cameraDialogInfo.classify == 2
                      ? true
                      : false
                  "
                ></i
                >桥梁</span
              >
              <span
                class="info-window-content-title"
                @click="infoWindowClassify(3)"
                ><i
                  class="el-icon-check"
                  v-if="
                    cameraDialogInfo.classify == 3
                      ? true
                      : false
                  "
                ></i
                >隧道</span
              >
              <span
                class="info-window-content-title"
                @click="infoWindowClassify(7)"
                ><i
                  class="el-icon-check"
                  v-if="
                    cameraDialogInfo.classify == 7
                      ? true
                      : false
                  "
                ></i
                >ETC门架</span
              >
              <span
                class="info-window-content-title"
                @click="infoWindowClassify(5)"
                ><i
                  class="el-icon-check"
                  v-if="
                    cameraDialogInfo.classify == 5
                      ? true
                      : false
                  "
                ></i
                >收费站</span
              >
              <span
                class="info-window-content-title"
                @click="infoWindowClassify(6)"
                ><i
                  class="el-icon-check"
                  v-if="
                    cameraDialogInfo.classify == 6
                      ? true
                      : false
                  "
                ></i
                >服务区</span
              >
              <span
                class="info-window-content-title"
                @click="infoWindowClassify(9)"
                ><i
                  class="el-icon-check"
                  v-if="
                    cameraDialogInfo.classify == 9
                      ? true
                      : false
                  "
                ></i
                >加油站</span
              >
              <span
                class="info-window-content-title"
                @click="infoWindowClassify(0)"
                ><i
                  class="el-icon-check"
                  v-if="
                    cameraDialogInfo.classify == 0
                      ? true
                      : false
                  "
                ></i
                >其它</span
              >
            </div>
            <div class="info-window-resetCamera">
              <div>
                <div class="info-window-classify">
                  上移一层↑
                </div>
                <div class="info-window-classify">
                  下移一层↓
                </div>
              </div>
              <!-- <p>{{ currentMapZoom }}</p> -->
              <p>{{ cameraDialogInfo.zoomLevel }}</p>
            </div>
            <span
              class="info-window-content-title"
              @click="resetCameraLonLat(cameraDialogInfo)"
              >复位</span
            >
            <span
              class="info-window-content-title"
              @click="
                resetCameraRoadLonLat(cameraDialogInfo)
              "
              >全线复位</span
            >

            <!-- <el-form ref="cameraInfoAlongForm" class="camera-info-form" :rules="addFormRules"
                     :model="cameraInfoAlongForm" size="mini" label-position="left">
              <el-form-item >
              </el-form-item>
            </el-form> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script src="./js/AmapPlayerDialog.js"></script>
<style
  lang="less"
  src="./css/AmapPlayerDialog.less"
></style>
