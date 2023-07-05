<!-- eslint-disable -->
<template>
  <div class="wrapper">
    <!-- 侧边综合 -->
    <aside
      :class="{
        hide: !asidesControl.leftAsideShow
      }"
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

      <!-- 内容器 -->
      <div class="aside-container">
        <div class="aside-content">
          <p>
            <span class="title">报警消息</span>
            <span class="flex-center">
              <span class="sound-switch">
                实时监控&nbsp;
                <ma-switch
                  v-model:checked="isLivePlayerShow"
                  checked-children="开"
                  un-checked-children="关"
                  size="small"
                />
              </span>

              <span>&nbsp;</span>
              <span class="sound-switch">
                声音提醒&nbsp;
                <ma-switch
                  v-model:checked="speakSwitch"
                  checked-children="开"
                  un-checked-children="关"
                  size="small"
                />
              </span>
            </span>
          </p>
          <!-- 各类型进度占比 -->
          <ul>
            <template
              v-for="(body, i) in latestBodies"
              :key="body.alaEventId"
            >
              <li
                v-if="i < 11"
                :class="[
                  'btn',
                  body.alaEventId === checkLatestBodyId &&
                    'checked'
                ]"
                :key="body.alaEventId"
                @click="tabCheckLatestBodyId(body)"
              >
                <!-- top -->
                <div class="top">
                  <!-- 类型标签 -->
                  <div class="type-label">
                    <span v-if="body?.objectNum > 0">
                      {{ body?.objectNum }}
                      {{
                        body.objectTypeName?.includes('车')
                          ? '辆'
                          : '个'
                      }} </span
                    >{{
                      `${body.objectTypeName} - ${body.alaTypeName}`
                    }}
                  </div>
                </div>

                <!-- middle -->
                <div class="middle">
                  <!-- 时间 -->
                  <div class="time">
                    {{ body.begTime || '--:--:--' }}
                  </div>
                </div>

                <!-- bottom -->
                <div class="bottom">
                  <!-- icon -->
                  <svg
                    t="1658137289759"
                    class="icon"
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="3878"
                    width="14"
                    height="14"
                    fill="#666"
                  >
                    <path
                      d="M520.896 815.296c197.952 0 358.976-166.08 358.976-370.112s-161.088-370.112-358.976-370.112-358.848 166.016-358.848 370.112 160.96 370.112 358.848 370.112z m0-676.224c162.688 0 294.976 137.344 294.976 306.112 0 168.832-132.288 306.112-294.976 306.112-162.624 0-294.848-137.344-294.848-306.112-0.064-168.768 132.224-306.112 294.848-306.112z"
                      p-id="3879"
                    ></path>
                    <path
                      d="M824.256 746.112a32.128 32.128 0 0 0-29.888 56.64c21.888 11.584 27.264 20.736 27.52 22.528-1.92 20.864-106.688 69.824-300.992 69.824-191.488 0-299.072-49.536-300.864-69.824 0.128-1.664 5.056-10.432 26.176-21.888a32 32 0 0 0-30.464-56.256c-49.344 26.688-59.712 57.216-59.712 78.144 0 91.968 189.12 133.824 364.864 133.824 175.808 0 364.992-41.856 364.992-133.824 0-21.248-10.688-52.224-61.632-79.168zM520.96 618.816a173.632 173.632 0 1 0 0.128-347.264 173.632 173.632 0 0 0-0.128 347.264z m-59.968-315.648a70.976 70.976 0 1 1 0 141.952 70.976 70.976 0 0 1 0-141.952z"
                      p-id="3880"
                    ></path>
                  </svg>
                  <!-- 千米桩 -->
                  <div class="km-mileage">
                    {{ body.alaLoc || '-' }}
                  </div>
                </div>
              </li>
            </template>
          </ul>

          <!-- 空数据 -->
          <div
            v-show="!latestBodies?.length"
            class="empty-wrap flex-center"
          >
            <ma-empty
              description="当前管辖区域暂无报警事件"
              :image="Empty.PRESENTED_IMAGE_SIMPLE"
            />
          </div>
        </div>
      </div>
    </aside>

    <!-- 主内容区域 -->
    <div class="content">
      <div class="top-content">
        <!-- 内容区上左侧 -->
        <div class="top-left-content">
          <header>
            <div class="left">
              <div class="title">标定项:</div>

              <!-- 类型选项按钮 -->
              <div class="evt-btns">
                <div class="evt-btn-wrap">
                  <div
                    :class="[
                      'evt-btn btn',
                      curCalibrateEvt === '' && 'active'
                    ]"
                    @click="tabCalibrateEvt('')"
                  >
                    全部 (<span>{{
                      totalData.uncalibrateCount
                    }}</span
                    >)
                  </div>
                </div>
                <div
                  class="evt-btn-wrap"
                  v-for="(evt, key) in evtsData"
                  :key="key"
                >
                  <div
                    :class="[
                      'evt-btn btn',
                      curCalibrateEvt === evt.type &&
                        'active'
                    ]"
                    @click="tabCalibrateEvt(evt.type)"
                  >
                    {{ evt.name }} (<span>{{
                      evt.uncalibrateCount
                    }}</span
                    >)
                  </div>
                </div>
              </div>
            </div>

            <div class="right flex-center">
              <!-- 可能的路公司选项 -->
              <ma-select
                v-if="
                  userInfo.userSpecificInfo.orgId.length > 1
                "
                v-model:value="orgOpt"
                size="small"
                style="width: 100px"
                @change="tabOrg"
              >
                <ma-select-option
                  v-for="opt of [
                    {
                      key: '全部',
                      value: ''
                    }
                  ].concat(userInfo.userSpecificInfo.orgId)"
                  :key="`opt-${opt.key}`"
                  :value="opt.value"
                  >{{ opt.key }}</ma-select-option
                >
              </ma-select>

              <!-- 今日|历史 选项切换 -->
              <div class="date-btns">
                <!-- 今日 -->
                <ma-tooltip>
                  <template #title>
                    <span>今日报警</span>
                  </template>

                  <span
                    :class="[
                      'btn',
                      dateOpt === 1 && 'active'
                    ]"
                    @click="tabDateOpt(1)"
                    >今日</span
                  >
                </ma-tooltip>

                <span> | </span>

                <!-- 历史 -->
                <ma-tooltip placement="bottom">
                  <template #title>
                    <span>历史遗留</span>
                  </template>

                  <span
                    :class="[
                      'btn',
                      dateOpt === 0 && 'active'
                    ]"
                    @click="tabDateOpt(0)"
                    >历史</span
                  >
                </ma-tooltip>
              </div>

              <!-- 排序按钮 -->
              <ma-tooltip placement="left">
                <template #title>
                  <span
                    >点击
                    {{
                      order === 'asc' ? '降' : '升'
                    }}序</span
                  >
                </template>

                <icon
                  v-if="userInfo.userType == 1"
                  class="btn"
                  :icon="`sort-${order}`"
                  @click="orderClickHandler"
                />
              </ma-tooltip>
            </div>
          </header>

          <main>
            <div
              :class="{
                'main-content-wrap': true,
                animation: isAnimate
              }"
            >
              <!-- loading -->
              <div
                v-if="bodyLoading"
                class="loading-wrap flex-center"
              >
                <ma-spin size="large" />
              </div>

              <!-- 实际内容 -->
              <div
                v-else
                class="body-wrap"
                @animationend="isAnimate = false"
              >
                <!-- 中间信息 -->
               <div :class="[isLivePlayerShow === false  &&  !asidesControl.leftAsideShow && !asidesControl.rightAsideShow
               ?'goTurn':'']" >
                <div
                  v-if="bodyData.bodyInfo"
                  class="center-info flex-center"   
                  :class="[isLivePlayerShow === false ? 'goUp':'']"            
                >
                  <!-- 报警对象 -->
                  <div
                    :class="{
                      obj: true,
                      center:
                        !bodyData.bodyInfo?.begTimeDesc
                    }"
                  >
                    <img
                      src="@images/mv-map/alarm_icon_1.png"
                      alt=""
                      class="icon"
                    />

                    <span>
                      <span
                        v-if="
                          bodyData.bodyInfo?.objectNum > 0
                        "
                      >
                        {{ bodyData.bodyInfo?.objectNum }}
                        {{
                          bodyData.bodyInfo?.objectTypeName?.includes(
                            '车'
                          )
                            ? '辆'
                            : '个'
                        }} </span
                      >{{
                        `${bodyData.bodyInfo?.objectTypeName} - ${bodyData.bodyInfo?.alaTypeName}`
                      }}
                    </span>
                  </div>

                  <!-- 报警时间 -->
                  <div
                    v-show="bodyData.bodyInfo?.begTimeDesc"
                    class="time"
                  >
                    <div class="icon"></div>
                    <span>
                      <span>已报警</span>
                      <span class="count">
                        {{
                          bodyData.bodyInfo
                            ?.begTimeDescCount
                        }}
                      </span>
                      <span class="unit">
                        {{
                          bodyData.bodyInfo?.begTimeDescUnit
                        }}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
                <!-- 左侧 首次报警 -->
                <div v-if="bodyData.bodyInfo " class="left" 
                 :class="[isLivePlayerShow === false ? 'goRight':'']">                
                  <div class="title" 
                    :class="[isLivePlayerShow === false 
                      ? 'goUpTitle':'']" >报警录像</div>

                  <!-- 视频播放 -->
                  <div class="video-wrap"  :class="[isLivePlayerShow === false 
                      ? 'goBig':'']">                  
                    <VideoVue
                      autoplay
                      :src="bodyData.bodyInfo?.url"
                      :type="
                        bodyData.bodyInfo.type || 'video'
                      "
                      :poster="
                        bodyData.videoRsp?.begCoverImage
                      "
                      :extraData="{
                        alarmId: bodyData.videoRsp?.alarmId,
                        currentTime:
                          bodyData.videoRsp?.begTimestamp,
                        frameRate:
                          bodyData.videoRsp?.begFrameRate
                      }"
                      :framesUrl="
                        bodyData.bodyInfo?.latestMarkUrl
                      "
                      showSnapshotBtn
                    />
                  </div>
                  <!-- 厂商 -->
                  <div class="corp"  :class="[isLivePlayerShow === false ? 'goDown':'']">
                    <!-- logo -->
                    <div
                      class="logo"
                      :style="{
                        'background-image': getCorpLogoUrl(
                          bodyData.bodyInfo?.latestCorp
                        )
                      }"
                    ></div>
                    <!-- name -->
                    <div class="name" >
                      {{
                        bodyData.bodyInfo?.latestCorpName ||
                        '未知厂商'
                      }}
                    </div>
              </div>
            </div>
            
                <!-- 右侧 实时监控（原 最新报警） -->
                <div v-if="bodyData.bodyInfo && isLivePlayerShow" class="right">
                  <div class="title">实时监控</div>

                  <!-- 视频播放 -->
                  <div class="video-wrap">
                    <!-- WebRCT播放器 -->
                    <WebRTCPlayer
                      v-if="isLivePlayerShow"
                      :loading="liveLoading"
                      :options="liveOptions"
                    />
                  </div>

                  <!-- 厂商 -->
                  <div class="corp">
                    <!-- logo -->
                    <div
                      class="logo"
                      style="
                        background: transparent;
                        outline: none;
                      "
                    ></div>

                    <!-- name -->
                    <div class="name">&nbsp;</div>
                  </div>
                </div>

                <!-- 暂无标定提示 -->
                <div
                  v-if="!bodyData?.bodyInfo"
                  class="rest-tip flex-center"
                >
                  <div class="rest-pic" />
                </div>
              </div>
       
              <!-- 上一个下一个按钮 -->
              <div class="previous-next-btns">
                <!-- 上一次标定按钮 -->
                <div class="preivous-btn-wrap">
                  <Transition name="move-x-show">
                    <div
                      v-if="preivousBtnShow"
                      class="preivous-btn btn flex-center"
                      @click="
                        viewLastCalibrateData('preivous')
                      "
                    >
                      <icon icon="arrow-left-line" />
                      <br />
                      <div class="text">上一判定</div>
                    </div>
                  </Transition>
                </div>

                <!-- 下一次标定按钮 -->
                <div class="next-btn-wrap">
                  <Transition name="move-x-hide">
                    <div
                      v-if="nextBtnShow"
                      class="next-btn btn flex-center"
                      @click="viewLastCalibrateData('next')"
                    >
                      <icon icon="arrow-right-line" />
                      <br />
                      <div class="text">下一判定</div>
                    </div>
                  </Transition>
                </div>
              </div>
            </div>
          </main>

          <div
            v-show="bodyData.relatedAlarmDescRsps?.length"
            class="bottom-bar ellipsis"
          >
            <span
              :title="bodyData.relatedAlarmDescRspsTitle"
            >
              <span>相关报警: </span>
              <span
                v-for="(
                  alarm, key
                ) of bodyData.relatedAlarmDescRsps"
                class="alarm"
                :key="key"
              >
                <span>当前点位 </span>
                <span class="time">
                  {{ alarm.timeDesc }}前
                </span>
                <span class="obj">
                  {{ alarm.objectTypeName }}--{{
                    alarm.eventTypeName
                  }}
                </span>
                <span> 报警标定为 </span>
                <span
                  :class="{
                    status: true,
                    green: alarm.signStatusDesc === '正确'
                  }"
                >
                  {{ alarm.signStatusDesc }}
                </span>
                <span
                  v-if="
                    key <
                    bodyData.relatedAlarmDescRsps?.length -
                      1
                  "
                >
                  ;
                </span>
              </span>
            </span>
          </div>
        </div>

        <!-- 上右侧内容区 -->
        <div
          :class="[
            'top-right-content',
            !asidesControl.rightAsideShow && 'hide'
          ]"
        >
          <!-- 查看详情（展开按钮） -->
          <div
            v-if="bodyData.bodyInfo"
            class="grow-btn"
            @click="asidesControl.rightAsideShow = true"
          >
            查看详情
          </div>

          <!-- 内容器 -->
          <div class="top-right-content-wrapper">
            <div class="top-right-content-container">
              <!-- title -->
              <div class="title">
                <h1>事件详情</h1>
                <div
                  class="close-btn"
                  @click="
                    asidesControl.rightAsideShow = false
                  "
                >
                  <icon icon="close-line" />
                </div>
              </div>

              <!-- infos -->
              <div class="infos">
                <div class="info">
                  <div class="key">事件信息：</div>
                  <div class="value ellipsis">
                    <span
                      v-if="bodyDetailinfo?.objectNum > 0"
                    >
                      {{ bodyDetailinfo?.objectNum }}
                      {{
                        bodyDetailinfo.objectTypeName?.includes(
                          '车'
                        )
                          ? '辆'
                          : '个'
                      }} </span
                    >{{
                      `${bodyDetailinfo.objectTypeName} - ${bodyDetailinfo.alaTypeName}`
                    }}
                  </div>
                </div>

                <div class="info">
                  <div class="key">事件时间：</div>
                  <div class="value ellipsis">
                    {{
                      bodyDetailinfo.signDateDesc
                        ? `${bodyDetailinfo.signDateDesc}前`
                        : bodyDetailinfo.begTime
                    }}
                  </div>
                </div>

                <div class="info">
                  <div class="key">报警路段：</div>
                  <div class="value ellipsis">
                    <template v-if="bodyDetailinfo.fuse">
                      <ma-tooltip
                        placement="top"
                        :title="bodyDetailinfo.fuse"
                      >
                        <span>
                          {{ bodyDetailinfo.fuse }}
                        </span>
                      </ma-tooltip>
                    </template>
                  </div>
                </div>

                <div
                  v-show="bodyDetailinfo.endRegionCodeName"
                  class="info"
                >
                  <div class="key">路线方向：</div>
                  <div class="value ellipsis">
                    <span
                      v-show="
                        bodyDetailinfo.endRegionCodeName
                      "
                    >
                      {{
                        bodyDetailinfo.endRegionCodeName
                      }}方向
                    </span>
                    <span
                      v-show="bodyDetailinfo.directionName"
                    >
                      （{{ bodyDetailinfo.directionName }}）
                    </span>
                  </div>
                </div>

                <div class="info">
                  <div class="key">报警厂商：</div>
                  <div class="value ellipsis">
                    {{ bodyDetailinfo.corpNames }}
                  </div>
                </div>

                <div class="info">
                  <div class="key">原始报警：</div>
                  <div class="value ellipsis">
                    <span
                      class="alarm-count btn"
                      @click="
                        bodyDetailinfo.alarmCount &&
                          viewHisModal(
                            bodyDetailinfo.alaEventId
                          )
                      "
                    >
                      {{ bodyDetailinfo.alarmCount }}条
                    </span>
                  </div>
                </div>

                <div class="info">
                  <div class="key">其他报警：</div>
                  <div class="value related-alarm">
                    <template
                      v-if="
                        bodyDetailinfo.relatedAlarmInfos
                          ?.length
                      "
                    >
                      <span
                        v-for="(
                          evt, i
                        ) of bodyDetailinfo.relatedAlarmInfos"
                        class="links"
                        :key="evt.alaType"
                      >
                        <span
                          class="link btn"
                          @click="
                            getBodyFromRedisByBodyId(
                              evt.alaEventId
                            )
                          "
                        >
                          {{ evt.alaTypeName }}
                        </span>
                        <span
                          v-if="
                            i <
                            bodyDetailinfo.relatedAlarmInfos
                              .length -
                              1
                          "
                        >
                          |
                        </span>
                      </span>
                    </template>
                  </div>
                </div>

                <div class="info">
                  <div class="key">相邻报警：</div>
                  <div class="value adjoin-alarm">
                    <div class="graphic-container">
                      <!-- 上 方向 -->
                      <div class="direction top">
                        {{
                          bodyDetailinfo.adjacentAlarmInfo
                            ?.topRoadDirectionName ||
                          '上行'
                        }}方向
                        <icon icon="arrow-right-line" />
                      </div>

                      <!-- 道路容器 -->
                      <div class="road-container">
                        <div
                          v-for="(
                            alarms, i0
                          ) of bodyDetailinfo
                            .adjacentAlarmInfo?.list"
                          :class="[
                            'point-track',
                            highLightCameraIndexs[0] ===
                              i0 && 'inner-playing'
                          ]"
                          :key="i0"
                        >
                          <div
                            v-for="(alarm, i1) of alarms"
                            :class="[
                              'point',
                              'flex-center',
                              `line-${alarm.direction}`,
                              alarm.isAlarm && 'alarm',
                              alarm.isCurrent &&
                                'cur-alarm',
                              highLightCameraIndexs[1] ===
                                i1 && 'high-light'
                            ]"
                            :key="alarm.deviceCode"
                          >
                            <!-- 摄像头图标 -->
                            <svg
                              v-if="!alarm.isAlarm"
                              xmlns="http://www.w3.org/2000/svg"
                              version="1.1"
                              viewBox="0 0 100 100"
                              @click="
                                viewLiveVideo(i0, i1, alarm)
                              "
                            >
                              <path
                                d="M50 30 L75 100 L25 100 Z"
                                fill="#4977FC"
                              />
                              <circle
                                cx="50"
                                cy="40"
                                r="40"
                                fill="#4977FC"
                              />
                              <circle
                                cx="50"
                                cy="40"
                                r="18"
                                fill="none"
                                stroke="#fff"
                                stroke-width="8"
                              />
                            </svg>

                            <!-- 提示内容 -->
                            <div
                              v-if="alarm.isAlarm"
                              class="tip-content"
                            >
                              <template
                                v-if="alarm.isCurrent"
                              >
                                <p>当前点位</p>
                              </template>
                              <template v-else>
                                <p>
                                  {{ alarm.alaTypeName }}
                                </p>
                                <p>{{ alarm.mileageNo }}</p>
                              </template>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- 下 方向 -->
                      <div class="direction bottom">
                        <icon icon="arrow-left-line" />
                        {{
                          bodyDetailinfo.adjacentAlarmInfo
                            ?.bottomRoadDirectionName ||
                          '下行'
                        }}方向
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 事件详情loading -->
                <div
                  class="loading flex-center"
                  v-show="bodyDetailInfoLoading"
                >
                  <ma-spin size="large" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer class="flex-center">
        <div class="btns-wrap">
          <div class="btns-left">
            <!-- 标定 视频异常 按钮 -->
            <ma-tooltip placement="rightBottom">
              <template #title>
                <p>信号丢失，黑屏</p>
                <p>视频被遮挡</p>
                <p>图像模糊</p>
                <p>亮度异常</p>
                <p>静帧画面</p>
                <p>图像有噪声</p>
                <p>画面闪烁</p>
                <p>画面滚动条纹</p>
              </template>

              <ma-button
                v-show="bodyData?.bodyInfo"
                :class="['wrong', delayMark && 'forbidden']"
                :loading="btnLoading"
                size="large"
                type="primary"
                @click="setBodyCalibrateStatus(2)"
                >反馈视频异常
                <icon icon="error-warning-line" />
              </ma-button>
            </ma-tooltip>
          </div>

          <div class="btns-middle">
            <!-- 标定 正确 按钮 -->
            <ma-button
              v-show="bodyData?.bodyInfo"
              :class="['green', delayMark && 'forbidden']"
              :loading="btnLoading"
              size="large"
              type="primary"
              @click="setBodyCalibrateStatus(1)"
            >
              <icon icon="checkbox-circle-fill" />
              正确
            </ma-button>

            <!-- 标定 误报 按钮 -->
            <ma-button
              v-show="bodyData?.bodyInfo"
              :class="[delayMark && 'forbidden']"
              :loading="btnLoading"
              size="large"
              type="primary"
              danger
              @click="setBodyCalibrateStatus(0)"
            >
              <icon icon="close-circle-fill" />
              误报
            </ma-button>
          </div>

          <div class="btns-right">
            <!-- 标定 上报救援 按钮 -->
            <ma-button
              v-show="bodyData?.bodyInfo"
              :class="[delayMark && 'forbidden']"
              :loading="btnLoading"
              size="large"
              type="primary"
              @click="setStatusComfirm('上报救援')"
            >
              <icon icon="send-plane-fill" />
              上报救援
            </ma-button>

            <!-- 标定 上报事故 按钮 -->
            <ma-button
              v-show="bodyData?.bodyInfo"
              :class="['orange', delayMark && 'forbidden']"
              :loading="btnLoading"
              size="large"
              type="primary"
              @click="setStatusComfirm('上报事故', 2)"
            >
              <icon icon="send-plane-fill" />
              上报事故
            </ma-button>
          </div>
        </div>
      </footer>
    </div>
  </div>

  <!-- his表格弹窗 -->
  <HisModal
    v-if="hisModalShow"
    title="详情"
    v-model:visible="hisModalShow"
    :data="theHisData"
  />

  <!-- 查看截图弹窗 -->
    <ViewImgsModal
    v-if="snapshotModalShow"
    v-model:visible="snapshotModalShow"
    :imgs="snapshotsData"
    :loading="snapshotLoading"
    title="截图"
    @delImg="delSnapshot"
  />
  <!-- 摄像头直播视频弹窗 -->
  <LivePlayerModal
    v-if="LivePlayerModalShow"
    v-model:visible="LivePlayerModalShow"
    :data="LivePlayerModalData"
  />
</template>

<!-- eslint-disable -->
<script setup>
/* eslint no-unused-vars: off */
import {
  ref,
  reactive,
  computed,
  watch,
  onMounted,
  onBeforeUnmount
} from 'vue'
import apis from '@/api'
import { useStore } from 'vuex'

// 标框播放器
import VideoVue from '@/components/base/Video.vue'

// his表格弹窗
import HisModal from './modules/HisModal.vue'

// 查看截图弹窗
import ViewImgsModal from '@/components/base/ViewImgsModal.vue'
import { Modal } from 'ant-design-vue'

// webRTC播放器
import WebRTCPlayer from '@/components/base/WebRTCPlayer/index.vue'
import { Empty } from 'ant-design-vue'
import { websocketURL as proSockJSUrl } from '@/config'

// 直播视频弹窗
import LivePlayerModal from '@/components/base/LivePlayerModal.vue'
import { format } from 'echarts'
import { setDefaultIndicator } from 'ant-design-vue/lib/spin/Spin'

const audio = ref(null)

// 准备做左侧列表今日日期显示“今日”，还没时间做
// const dayjs = require('dayjs')

const store = useStore()

// 用户部分信息
const userInfo = reactive({
  userId: store.getters['user/userId'],
  userType: store.getters['user/userType'],
  userSpecificInfo: store.getters['user/userSpecificInfo']
})

// 开关状态
!localStorage.getItem('switchStatus') &&
  localStorage.setItem('switchStatus', '{}')
const switchStatus = JSON.parse(
  localStorage.getItem('switchStatus')
)
//音频部分
  function VoicePlay(){
   const utterThis = new SpeechSynthesisUtterance(`您有${totalData.uncalibrateCount}条新的AI报警，请及时处理！`);
   if(switchStatus.isSpeak){
      speechSynthesis.speak(utterThis);
   }
}

// 报警类型数据
const evtsData = ref([]),
  // 累计数据
  totalData = reactive({
    calibrateCount: 0,
    uncalibrateCount: 0
  })

/* 左右两侧栏控制 */
const asidesControl = reactive({
    leftAsideShow: true, // 左侧栏显隐
    rightAsideShow: false // 右侧栏显隐
  }),
  // 关闭右侧栏
  hideRightAside = () => {
    asidesControl.rightAsideShow =
      !asidesControl.rightAsideShow
  }

// 当前标定项
const curCalibrateEvt = ref(''),
  // 切换标定项
  tabCalibrateEvt = evt => {
    // if (evt === curCalibrateEvt.value) return

    curCalibrateEvt.value = evt
    refresh()
  },
  // 路公司选项
  orgOpt = ref(
    userInfo.userSpecificInfo.orgId.length > 1
      ? ''
      : userInfo.userSpecificInfo.orgId[0]?.value
  ),
  // 切换路公司选项
  tabOrg = () => {
    // 刷新页面数据
    refresh()
  },
  // 日期选项值
  dateOpt = ref(1),
  // 切换日期选项
  tabDateOpt = d => {
    dateOpt.value = d

    // 获取事件标定数据
    getCurCalibrateCountOfTypes()

    // 获取应标body数据
    getBodyFromRedisByEvtType()
  },
  // 视频内容动画
  isAnimate = ref(true),
  // 视频body数据
  bodyData = ref({
    bodyInfo: '初始有值不会闪一下'
  }),
  // 获取应标body的排序
  order = ref('asc'),
  // 排序事件处理
  orderClickHandler = () => {
    order.value = order.value === 'asc' ? 'desc' : 'asc'

    refresh()
  },
  // 动态获取厂商logo url
  gdLogoUrl = `url(${require('@images/corp_logos/gdkj.png')})`,
  getCorpLogoUrl = picname => {
    let logoUrl

    try {
      logoUrl = require('@images/corp_logos/' +
        picname +
        '.png')
    } catch (err) {
      console.log('未找到对应图片 err', err)
    }

    return logoUrl ? `url(${logoUrl})` : gdLogoUrl
  }

/* 上一个、下一个功能 */
// 上n次已标定数据的n值
// lastCalibrateData.value.bodies = lastCalibrateData.value.bodies.slice(-3)
// 上n次已标定数据
const lastCalibrateData = ref({
    bodies: [],
    index: 1
  }),
  // 是否当前body在已标数据中
  isBodyDataInLastCalibrateData = computed(() =>
    lastCalibrateData.value.bodies.some(
      e =>
        e.alaEventId === bodyData.value.bodyInfo?.alaEventId
    )
  ),
  // 上一次标定按钮显隐
  preivousBtnShow = computed(
    () =>
      lastCalibrateData.value.bodies.length &&
      lastCalibrateData.value.index > 0
  ),
  // 下一次标定按钮显隐
  nextBtnShow = computed(
    () =>
      isBodyDataInLastCalibrateData.value &&
      lastCalibrateData.value.index <
        lastCalibrateData.value.bodies.length
  ),
  // 查看已标定数据
  viewLastCalibrateData = direction => {
    if (direction === 'preivous') {
      lastCalibrateData.value.index > 0 &&
        lastCalibrateData.value.index--
    } else {
      lastCalibrateData.value.index <
        lastCalibrateData.value.bodies.length &&
        lastCalibrateData.value.index++
    }

    const body =
      lastCalibrateData.value.bodies[
        lastCalibrateData.value.index
      ]

    if (body) {
      // 同步类型和日期选项
      curCalibrateEvt.value = body.alaType
      dateOpt.value = body.dateOpt

      getBodyFromRedisByBodyId(body.alaEventId)
    } else {
      getBodyFromRedisByEvtType()
    }
  }

/* 原始报警数量弹窗 */
const hisModalShow = ref(false), // 原始报警数量弹窗显隐
  theHisData = reactive({ id: null }), // 原始报警传参数据
  // 查看原始报警数量弹窗
  viewHisModal = bodyId => {
    theHisData.id = bodyId

    hisModalShow.value = true
  }

/* 查看截图弹窗 */
const snapshotModalShow = ref(false), // 查看截图弹窗显隐
  snapshotsData = ref([]), // 查看截图数据
  snapshotLoading = ref(false), // loading
  // 获取查看截图数据并打开弹窗
  viewSnapshotModal = params => {
    snapshotModalShow.value = true
    snapshotsData.value = []

    snapshotLoading.value = true
    apis.events
      .getSnapshotsByAlarmId(params)
      .then(res => {
        console.log('查看截图 res', res)

        res.forEach(e => {
          e.positionInfo.forEach(e2 => {
            /* eslint-disable-next-line */
            e2.points = eval(e2.positionStr)
          })
        })

        snapshotsData.value = res
      })
      .catch(err => {
        console.log('gg err', err)

        snapshotsData.value = []
      })
      .finally(() => {
        snapshotLoading.value = false
      })
  },
  // 删除查看截图数据
  delSnapshot = screenshotId => {
    const index = snapshotsData.value.findIndex(
      e => e.screenShotId === screenshotId
    )

    index > -1 && snapshotsData.value.splice(index, 1)
    // 触发子组件watch
    snapshotsData.value = snapshotsData.value.concat()
  }

/* 请求触发相关 */
// 获取事件标定数据
const getCurCalibrateCountOfTypes = () =>
    apis.events
      .getCurCalibrateCountOfTypes({
        isNow: dateOpt.value,
        userId: userInfo.userId,
        orgId: orgOpt.value
      })
      .then(res => {
        totalData.calibrateCount = 0
        totalData.uncalibrateCount = 0
        evtsData.value = res.map(e => {
          const calibrateCount = Number(e.markedNum),
            uncalibrateCount = Number(e.unmarkedNum),
            total = calibrateCount + uncalibrateCount,
            calibrateRate = (
              (calibrateCount / total) *
              100
            ).toFixed(1),
            uncalibrateRate = (100 - calibrateRate).toFixed(
              1
            )

          // 累计全部
          totalData.calibrateCount += calibrateCount
          totalData.uncalibrateCount += uncalibrateCount 
          return {
            name: e.alaTypeName,
            type: e.alaType,
            calibrateCount,
            calibrateRate,
            uncalibrateCount,
            uncalibrateRate,
            total
          }
        })
      }),
  // 当前选中的最近body消息
  checkLatestBodyId = ref(''),
  // 切换当前选中的最近body消息
  tabCheckLatestBodyId = body => {
    checkLatestBodyId.value = body.alaEventId
    // 根据storyId获取应标body数据
    getBodyFromRedisByBodyId(body.alaEventId)
  },
  // 最近body消息数据
  latestBodies = ref([]),
  // 获取最近body消息数据
  getLatestBodiesFromRedis = () =>
    apis.events
      .getLatestBodiesFromRedis({
        page: {
          currentPage: 1,
          pageSize: 10
        },
        userId: userInfo.userId,
        orgId: orgOpt.value
      })
      .then(res => {
        latestBodies.value = res.data || []
      }),
  // body loading
  bodyLoading = ref(true),
  // 获取应标body数据
  getBodyFromRedisByEvtType = () => {
    // 更新已标数据下标
    lastCalibrateData.value.index =
      lastCalibrateData.value.bodies.length

    // 发起请求
    bodyLoading.value = true
    apis.events
      .getBodyFromRedisByEvtType({
        alaType: curCalibrateEvt.value,
        isNow: dateOpt.value,
        order: order.value,
        userId: userInfo.userId,
        orgId: orgOpt.value
      })
      .then(handleBodyRes)
      .finally(() => {
        bodyLoading.value = false
      })
  },
  // 根据storyId获取应标body数据
  getBodyFromRedisByBodyId = alaEventId => {
    bodyLoading.value = true
    apis.events
      .getBodyFromRedisByBodyId({
        alaEventId
      })
      .then(handleBodyRes)
      .finally(() => {
        bodyLoading.value = false
      })
  },
  // 处理获取的应标body数据res
  handleBodyRes = res => {
    // 若 有数据
    if (res) {
      // 若 有body数据
      if (res.bodyInfo) {
        // 拆分 已报警时间
        res.bodyInfo.begTimeDesc?.replace?.(
          /(\d+)([^0-9]+)/,
          (r1, r2, r3) => {
            res.bodyInfo.begTimeDescCount = r2
            res.bodyInfo.begTimeDescUnit = r3
          }
        )

        // 数据增加了可能的图片地址
        res.bodyInfo.url =
          res.bodyInfo.latestImageUrl ||
          res.bodyInfo.latestUrl
        res.bodyInfo.type = res.bodyInfo.latestImageUrl
          ? 'image'
          : 'video'

        // 获取直播流播放
        getLiveOptions(res.bodyInfo.deviceCode)

        // 事件详情展开则获取body对应详情信息
        asidesControl.rightAsideShow &&
          getBodyDetailInfo(res.bodyInfo)
      }

      // 若 视频播放相关有数据
      if (res.bodyInfo.type === 'video' && res.videoRsp) {
        // 转视频封面时间戳ms为s单位
        res.videoRsp.begTimestamp /= 1000
        res.videoRsp.begTimestamp--

        // 转视频帧为数字
        res.videoRsp.begFrameRate = Number(
          res.videoRsp.begFrameRate
        )
      }

      // 若 相关报警有数据
      if (res.relatedAlarmDescRsps?.length) {
        // 相关报警的title
        res.relatedAlarmDescRspsTitle =
          res.relatedAlarmDescRsps
            .reduce(
              (acc, e) =>
                (acc += `当前点位 ${e.timeDesc}前 ${e.objectTypeName}--${e.eventTypeName} 报警标定为 ${e.signStatusDesc}; `),
              ''
            )
            .slice(0, -2)
      }
    } else {
      // 事件详情展开则关闭
      asidesControl.rightAsideShow &&
        (asidesControl.rightAsideShow = false)
    }

    bodyData.value = res || {}
    isAnimate.value = true

    // 新body触发更新已标数据下标
    !isBodyDataInLastCalibrateData.value &&
      (lastCalibrateData.value.index =
        lastCalibrateData.value.bodies.length)
  },
  // 标定loading
  btnLoading = ref(false),
  // 需求延时1s标记
  delayMark = ref(false),
  // 标定body数据
  setBodyCalibrateStatus = (isCorrect, isSend = null) => {
    /* eslint-disable */
    // body要拿到且有值并伴有1s节流
    if (
      bodyLoading.value ||
      !bodyData.value.bodyInfo ||
      bodyData.value.bodyInfo === '初始有值不会闪一下' ||
      delayMark.value
    )
      return
    /* eslint-enable */
    delayMark.value = setTimeout(() => {
      delayMark.value = false
    }, 1000)

    btnLoading.value = true
    const params = {
      alaEventId: bodyData.value.bodyInfo.alaEventId,
      alaStoryId: bodyData.value.bodyInfo.alaStoryId,
      alaType: bodyData.value.bodyInfo.alaType,
      dateOpt: dateOpt.value,
      userId: userInfo.userId,
      orgId: orgOpt.value
    }

    return apis.events
      .setBodyCalibrateStatus({
        ...params,
        isCorrect,
        isSend
      })
      .then(() => {
        // 若 不在已标定数据中
        if (!isBodyDataInLastCalibrateData.value) {
          // 存为上一次标定数据
          lastCalibrateData.value.bodies.push(params)

          bodyData.value = {
            bodyInfo: '初始有值不会闪一下'
          }

          lastCalibrateData.value.bodies =
            lastCalibrateData.value.bodies.slice(-3)
          lastCalibrateData.value.index =
            lastCalibrateData.value.bodies.length
          sessionStorage.setItem(
            'lastCalibrateData',
            JSON.stringify(lastCalibrateData.value)
          )

          // 刷新页面数据
          refresh()
        } else {
          viewLastCalibrateData('next')
        }
      })
      .catch(err => console.log('err', err))
      .finally(() => {
        btnLoading.value = false
      })
  },
  // 标定body数据确认
  setStatusComfirm = (title, isSend = 1) => {
    Modal.confirm({
      centered: true,
      closable: true,
      mask: false,
      title,
      content: '确认将该报警事件上报推送至调度系统吗？',
      onOk: () => {
        setBodyCalibrateStatus(1, isSend)
      }
    })
  }

/* 事件详情 */
// body对应详情信息数据
const bodyDetailinfo = ref({}),
  // body对应详情信息loading
  bodyDetailInfoLoading = ref(false),
  // 获取body对应详情信息
  getBodyDetailInfo = bodyInfo => {
    // 清空详情数据
    bodyDetailinfo.value = {}

    const params = {
      alaEventId:
        bodyInfo?.alaEventId ??
        bodyData.value.bodyInfo.alaEventId,
      storyId:
        bodyInfo?.alaStoryId ??
        bodyData.value.bodyInfo.alaStoryId
    }

    bodyDetailInfoLoading.value = true
    return apis.events
      .getBodyDetailInfo(params)
      .then(res => {
        console.log('s!!! bodyDetailinfo res', res)

        // 相邻报警点位的报警story去重
        const newAdjacentAlarmInfoList = [],
          calcObj = {}
        res.adjacentAlarmInfo = res.adjacentAlarmInfo || {
          list: []
        }
        res.adjacentAlarmInfo.list.forEach(alarm => {
          if (calcObj[alarm.mileageNo] === undefined) {
            newAdjacentAlarmInfoList.push([alarm])
            calcObj[alarm.mileageNo] = [alarm.direction]
          } else if (
            !calcObj[alarm.mileageNo].includes(
              alarm.direction
            )
          ) {
            newAdjacentAlarmInfoList[
              newAdjacentAlarmInfoList.length - 1
            ].push(alarm)
            calcObj[alarm.mileageNo].push(alarm.direction)
          } else if (alarm.isCurrent) {
            /* 当前点位 */
            const arr =
                newAdjacentAlarmInfoList[
                  newAdjacentAlarmInfoList.length - 1
                ],
              i = arr.findIndex(
                e => e.direction === alarm.direction
              )

            arr[i] = alarm
          }
        })
        res.adjacentAlarmInfo.list =
          newAdjacentAlarmInfoList

        bodyDetailinfo.value = res
      })
      .finally(() => {
        bodyDetailInfoLoading.value = false

        // 初始化 相邻报警 选中高亮摄像头下标
        highLightCameraIndexs.value = []
      })
  },
  // 摄像头直播视频弹窗显隐
  LivePlayerModalShow = ref(false),
  // 摄像头直播视频弹窗传参数据
  LivePlayerModalData = ref({}),
  // 相邻报警 摄像头查看实时视频
  viewLiveVideo = (i0, i1, alarm) => {
    LivePlayerModalData.value = {
      linkId: alarm.link,
      name: '实时视频播放'
    }

    // 更新选中高亮摄像头下标
    highLightCameraIndexs.value = [i0, i1]

    LivePlayerModalShow.value = true
  },
  // 相邻报警 选中高亮摄像头下标
  highLightCameraIndexs = ref([])
// 监听摄像头直播视频弹窗显隐
watch(LivePlayerModalShow, nV => {
  !nV && (highLightCameraIndexs.value = [])
})

// 监听右侧事件详情收展
watch(
  () => asidesControl.rightAsideShow,
  nV => {
    nV && getBodyDetailInfo()
  }
)

// 直播参数
const liveOptions = ref({}),
  // 直播loading
  liveLoading = ref(false),
  // 获取直播参数
  getLiveOptions = id => {
    if (!isLivePlayerShow.value) return

    liveOptions.value = {}
    liveLoading.value = true
    return apis.alarmLive
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
      .finally(() => {
        liveLoading.value = false
      })
  },
  // 直播开关
  isLivePlayerShow = ref(switchStatus.isLive ?? true)

// 监听直播开关
watch(isLivePlayerShow, nV => {
  // 更新本地 switchStatus.isLive实时监控  switchStatus.isSpeak 声音提醒
  switchStatus.isLive = nV
  localStorage.setItem(
    'switchStatus',
    JSON.stringify(switchStatus)
  )

  if (nV) {
    bodyData.value.bodyInfo?.deviceCode &&
      getLiveOptions(bodyData.value.bodyInfo?.deviceCode)
  }
})

// 刷新页面数据
const refresh = () => {
  // 获取事件标定数据
  getCurCalibrateCountOfTypes()

  // 获取最近body消息数据
  getLatestBodiesFromRedis()

  // 获取应标body数据
  getBodyFromRedisByEvtType()
}

/* websocket */
const devSockJSUrl =
    //'http://192.168.8.227:9626/v1/endpoint',  开发推送链接地址
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
      /* 路公司仅出现指定事件类型 */
      // 若 是路公司 且 当前推送不在预定范围内
      if (
        userInfo.userType == 2 &&
        !userInfo.userSpecificInfo?.signEvent?.includes?.(
          data.alaType
        )
      )
        return

      // 若 非对应路公司
      if (orgOpt.value && orgOpt.value !== data.orgId)
        return

      /* 若 今日 选项 */
      if (dateOpt.value === 1) {
        /* 未标定各数据更新（仅 今日 选项更新数据） */
        totalData.uncalibrateCount = 0
        evtsData.value.forEach(e => {
          if (e.type === data.alaType) {
            e.uncalibrateCount = data.unmarkedNum
          }
          totalData.uncalibrateCount += e.uncalibrateCount
         
        })

        /* 若 当前类型空标定且推送匹配 */
        if (
          !bodyData.value.bodyInfo &&
          curCalibrateEvt.value === data.alaType
        ) {
          // 获取应标body数据
          getBodyFromRedisByEvtType()
        }
      }
      VoicePlay()
      latestBodies.value.unshift(data)
     
    }
  },
  // 语音播报开关
  speakSwitch = ref(switchStatus.isSpeak ?? true),
  
  // 失败重连上限次数
  retryMaxCount = 1
let stompClient,
  // 失败重连计数器
  retryCount = 0

// 监听直播开关
watch(speakSwitch, nV => {
  // 更新本地
  switchStatus.isSpeak = nV
  localStorage.setItem(
    'switchStatus',
    JSON.stringify(switchStatus)
  )
})



onMounted(() => {

  // 非管理员默认降序
  userInfo.userType != 1 && (order.value = 'desc')

  // 获取页面所有数据
  refresh()

  // websocket检查启动
  checkSockJS('realtime/news')

  // 尝试获取上一次标定数据
  try {
    lastCalibrateData.value = JSON.parse(
      sessionStorage.getItem('lastCalibrateData')
    ) || {
      bodies: [],
      index: 1
    }
  } catch (err) {
    console.log('lastCalibrateData err: ', err)
  }
})

onBeforeUnmount(() => {
  // 推送心跳销毁
  try {
    stompClient?.disconnect?.()
  } catch (err) {
    console.log('stompClient?.disconnect() err: ', err)
  }
})
</script>

<!-- <style lang="less">
.ant-notification-notice {
  &.alarm-notification {
    background-color: #ff6464;
    border-radius: 4px;
    box-shadow: 0 4px 12px #aaa;

    .ant-notification-notice-message {
      color: #fff;
      font-size: 1.1rem;
      margin-bottom: 0;
      padding-right: 0;
    }
  }
}
</style> -->
<style lang="less" scoped>
* {
  margin: 0;
  padding: 0;
}
.wrapper {
  @leftAsideWidth: 20%;
  @leftAsideMinWidth: 200px;

  background-color: #fff;
  display: flex;
  height: calc(100% + 80px);
  margin: -40px;
  overflow: hidden;
  width: calc(100% + 80px);

  aside {
    background-color: #fff;
    border-radius: 3px;
    border-right: 1px solid #eee;
    height: 100%;
    margin-right: 20px;
    position: relative;
    transition: 0.2s;
    width: max(@leftAsideWidth, @leftAsideMinWidth);
    &.hide {
      width: 0;
      min-width: 0;

      .shrink-btn {
        i {
          transform: scaleX(-1);
        }
      }
    }

    .shrink-btn {
      background-color: #fff;
      border: 1px solid #c7cedb66;
      border-top-right-radius: 14px 8px;
      border-bottom-right-radius: 14px 8px;
      height: 70px;
      position: absolute;
      right: -14px;
      top: calc(50% - 35px);
      transition: 0.2s;
      width: 14px;

      &:hover {
        box-shadow: 0 0 4px 0 #26325621;
      }
      &:active {
        border-color: #c7cedb;
      }

      i {
        color: #9aa9c5;
      }
    }

    .aside-container {
      height: 100%;
      overflow: hidden;
      width: 100%;

      .aside-content {
        height: 100%;
        padding: 1.5rem 20px 0;
        text-align: left;
        width: 100%;
        min-width: @leftAsideMinWidth;

        p {
          align-items: center;
          display: flex;
          font-weight: bold;
          justify-content: space-between;
          margin-bottom: 1rem;

          .sound-switch {
            align-items: center;
            color: #666;
            display: flex;
            font-size: 0.7rem;
          }
        }

        ul {
          max-height: calc(100% - 3rem);
          margin-right: -20px;
          overflow-x: hidden;
          overflow-y: hidden;
          padding-right: 20px;
          &::-webkit-scrollbar-track {
            background: #fff;
          }
          &:hover {
            overflow-y: overlay;
          }

          li {
            animation: vertical-grow 0.4s 1 forwards;
            background-color: #f1f4f7;
            border-radius: 6px;
            list-style: none;
            margin-bottom: 10px;
            overflow: hidden;
            padding: 0 20px;
            transition: 0.1s;
            &:hover {
              background-color: #eee;
            }
            &:active {
              background-color: #ccc;
            }
            &:nth-of-type(n + 11) {
              animation: vertical-shrink 0.4s 1 forwards;
            }
            &:last-child {
              margin-bottom: 0;
            }
            &.checked {
              background-color: #eee;
            }

            .top {
              align-items: center;
              display: flex;
              height: 1rem;
              line-height: 1rem;
              margin: 10px 0 0.1rem 0;
              &::before {
                background-color: #f52200;
                content: '';
                display: block;
                height: 6px;
                margin-right: 0.3em;
                transform: rotate(45deg);
                width: 6px;
              }

              .type-label {
                border-radius: 2px;
                color: #f52200;
                font-size: 0.9rem;
                height: 1rem;
                line-height: 1rem;
                padding: 0 0.3rem;
              }
            }

            .middle {
              .time {
                color: #333;
                font-size: 0.9rem;
                font-weight: bold;
              }
            }

            .bottom {
              align-items: center;
              display: flex;
              margin-bottom: 8px;

              .icon {
                margin-right: 0.3rem;
              }

              .km-mileage {
                color: #c1c1c1;
                font-size: 0.9rem;
              }
            }
          }
        }

        .empty-wrap {
          height: 60vh;
        }
      }
    }
  }

  .content {
    @headerHeight: 4rem;
    @footerHeight: 7rem;

    background-color: #fff;
    border-radius: 3px;
    flex: 1;
    height: 100%;
    padding-left: 10px;
    position: relative;
    max-width: calc(100% - 20px);

    .top-content {
      @rightWidth: 32%;
      @rightMaxWidth: 320px;

      display: flex;
      height: calc(100% - @footerHeight);

      .top-left-content {
        flex: 1;
        padding-right: 10px;
        width: 0;

        header {
          display: flex;
          height: @headerHeight;
          justify-content: space-between;

          .left {
            display: flex;
            flex: 1;

            .title {
              font-size: 1rem;
              font-weight: bold;
              line-height: @headerHeight;
              margin-right: 1em;
              white-space: nowrap;
            }

            .evt-btns {
              align-items: center;
              display: flex;
              flex-wrap: wrap;
              font-size: 0.875rem;
              white-space: nowrap;

              .evt-btn-wrap {
                align-items: center;
                display: flex;
                height: @headerHeight;

                .evt-btn {
                  border: 1px solid #ececec;
                  border-radius: 1rem;
                  color: #666;
                  height: 2rem;
                  line-height: calc(2rem - 2px);
                  margin-right: 0.5rem;
                  outline: 0 solid #ececec;
                  padding: 0 1rem;
                  position: relative;
                  transition: 0.1s;
                  z-index: 1;
                  &:hover {
                    color: #000;
                    outline-width: 1px;
                  }
                  &:active {
                    background-color: #cecece33;
                  }
                  &.active {
                    background-color: #1890ff10;
                    border-color: @layout-color;
                    color: @layout-color;
                    outline: 1px solid @layout-color;
                    &:hover {
                      outline-width: 0;
                    }
                    &:active {
                      background-color: transparent;
                    }

                    span {
                      color: @layout-color;
                    }
                  }

                  span {
                    color: #f009;
                    font-weight: bold;
                  }
                }
              }
            }
          }

          .right {
            height: 100%;
            width: fit-content;

            .date-btns {
              margin: 0 0.5rem;

              .btn {
                transition: 0.1s;
                &.active {
                  color: @layout-color;
                }
              }
            }

            i {
              font-size: 2rem;
            }
          }
        }

        main {
          align-items: center;
          display: flex;
          height: calc(100% - @headerHeight - 2rem);
          position: relative;

          .main-content-wrap {
            position: relative;
            width: 100%;
            &:hover {
              .previous-next-btns {
                opacity: 1;
                transition: 0.2s;
                visibility: visible;
              }
            }
            &.animation {
              overflow: hidden;

              .body-wrap {
                animation: breakIn 0.5s 1 forwards;
              }
            }
            // .goBig{
            //   transform: scale(1.15);
            //   transition: all .5s ease .2s;
            // }
            .goBig{
              width: 110%;
              height: 120%;
            }
            .loading-wrap {
              background-color: #fff9;
              height: 100%;
              left: 0;
              position: absolute;
              top: 0;
              width: 100%;
              z-index: 9;
            }
            .body-wrap {
              align-items: center;
              display: flex;
              padding-top: 3rem;
              position: relative;
              width: 100%;
              .goUp{
                transform: translate(-70px,-20px);
              }
              .goUpTitle{
                transform: translate(20px,-15px);
              }
              .goDown{
                    transform: translate(0px,0px);
                    transition: all .5s ease .2s;
                  }
              .center-info {
                font-size: 1.5rem;
                font-weight: bold;
                height: 3rem;
                position: absolute;
                top: 0;
                width: 100%;

                .obj,
                .time {
                  align-items: center;
                  display: flex;
                  padding: 0 0.5rem;

                  .icon {
                    height: 1.5rem;
                    margin-right: 0.5rem;
                  }
                }

                .obj {
                  color: #f009;
                  justify-content: flex-end;
                  &.center {
                    justify-content: center;
                  }

                  .icon {
                    height: 2rem;
                  }
                }

                .time {
                  color: #555;

                  .icon {
                    background-color: #4977fc;
                    border-radius: 50%;
                    height: 20px;
                    position: relative;
                    width: 20px;
                    &::after,
                    &::before {
                      background-color: #fff;
                      border-bottom-left-radius: 2px;
                      border-bottom-right-radius: 2px;
                      content: '';
                      height: 40%;
                      left: 9px;
                      position: absolute;
                      top: calc(10% + 1px);
                      width: 2px;
                    }
                    &::after {
                      transform: rotate(135deg);
                      transform-origin: 50% calc(100% - 1px);
                    }
                  }

                  .count {
                    color: #f009;
                    margin: 0 0.3rem;
                  }
                }
              }
              .goRight{
                margin-left:17%;
              }
              .goTurn{
                margin-right:50px;
              }
              .left,
              .right {
                padding: 0;
                width: 50%;

                .hidden {
                  visibility: hidden;
                }

                .title {
                  color: #888;
                  font-size: 1rem;
                  font-weight: bold;
                  margin-bottom: 0.5rem;
                  text-align: center;
                }

                ::v-deep(.video-wrap) {
                  background-color: #000;
                  margin-bottom: 0.5rem;
                  position: relative;
                  display: flex;
                  align-items: center;//对齐
                  justify-content: center;//居中
                  &::before {
                    content: '';
                    display: block;
                    padding: 56.25% 0 0;
                  }

                  .container,
                  .webrtc-player-container {
                    position: absolute;
                    top: 0;
                  }
                }

                .corp {
                  @logoSize: 1.5rem;
                  align-items: center;
                  width: ;
                  // .goDown{
                  //   transform: translate(-65px,42px);
                  //   transition: all .5s ease .2s;
                  // }
                  .logo {
                    position: absolute;
                    background: url(~@images/corp_logos/gdkj.png)
                      center/ contain no-repeat;
                    height: @logoSize;
                    margin-right: 0.5rem;
                    outline: 1px dotted #eee;
                    width: @logoSize;
                  }
                  .name{
                    width:150px;
                    padding-left: 30px;
                  }
                  .style-btn {
                    margin: 0 0.5rem;
                  }
                }
              }

              .rest-tip {
                flex-direction: column;
                height: 100%;
                width: 100%;

                .rest-pic {
                  background: url(~@images/freedom_v7-12.png)
                    center center/ contain no-repeat;
                  height: 320px;
                  width: 100%;
                }

                .rest-text {
                  background: url(~@images/freedom_text1.png)
                      center center/ contain no-repeat,
                    url(~@images/freedom_text2.png) 24rem
                      center/ contain no-repeat;
                  height: 7.625rem;
                  width: 45.5rem;
                }
              }
            }
            .previous-next-btns {
              @btnSize: 6rem;

              opacity: 0;
              pointer-events: none;
              position: absolute;
              top: 50%;
              visibility: hidden;
              width: 100%;
              z-index: 9;

              .preivous-btn-wrap,
              .next-btn-wrap {
                left: 0;
                overflow: hidden;
                pointer-events: auto;
                position: absolute;
                transform: translateY(-50%);

                .preivous-btn,
                .next-btn {
                  align-content: center;
                  background-color: #0006;
                  border-radius: 50%;
                  flex-wrap: wrap;
                  height: @btnSize;
                  padding: 0.3rem;
                  width: @btnSize;
                  &:hover {
                    background-color: #0009;
                    transition: 0.2s;
                  }

                  i {
                    color: #fff;
                    font-size: 2rem;
                    line-height: 1;
                  }
                  .text {
                    color: #fff;
                    text-align: center;
                    width: 100%;
                  }
                }
              }

              .next-btn-wrap {
                left: initial;
                right: 0;
              }
            }
          }
        }

        .bottom-bar {
          background-color: #ffdeb8;
          color: #555;
          height: 2rem;
          line-height: 2rem;

          span {
            &.time {
              color: #000;
              font-weight: bold;
            }
            &.obj {
              color: #f009;
              font-weight: bold;
            }
            &.status {
              color: #f009;
              font-weight: bold;
              &.green {
                color: #00c34e;
              }
            }
          }
        }
      }

      .top-right-content {
        border-left: 1px solid #eee;
        height: 100%;
        position: relative;
        transition: 0.2s;
        width: min(@rightWidth, @rightMaxWidth);
        &.hide {
          border: none;
          margin-left: 0;
          width: 0;

          .grow-btn {
            opacity: 1;
            transform: translateX(calc(-100% - 10px));
            visibility: visible;
          }
        }

        .grow-btn {
          border-bottom: 1px solid @layout-color;
          bottom: 2.5rem;
          color: @layout-color;
          cursor: pointer;
          left: 0;
          opacity: 0;
          padding: 0 0.5rem;
          position: absolute;
          transform: translateX(-50%);
          transition: 0.2s, transform 0.3s;
          visibility: hidden;
          white-space: nowrap;
        }

        .top-right-content-wrapper {
          height: 100%;
          overflow: hidden;
          width: 100%;
          .top-right-content-container {
            @titleHeight: 3.75rem;

            height: 100%;
            width: 100%;

            .title {
              border-bottom: 1px solid #eee;
              padding-left: 20px;
              position: relative;

              h1 {
                color: #4f556e;
                font-size: 1rem;
                font-weight: bold;
                height: calc(@titleHeight - 1px);
                line-height: calc(@titleHeight - 1px);
                padding-left: 20px;
                position: relative;
                &::before {
                  background-color: #3f68da;
                  border-radius: 50%;
                  content: '';
                  display: block;
                  height: 6px;
                  left: 0;
                  position: absolute;
                  top: calc(50% - 3px);
                  width: 6px;
                }
              }

              .close-btn {
                cursor: pointer;
                height: 24px;
                position: absolute;
                right: 20px;
                top: calc(50% - 12px);
                width: 24px;
                &:hover {
                  i {
                    color: #9ba3b0;
                    text-shadow: 0 0 1px #9ba3b0;
                  }
                }
                &:active {
                  i {
                    color: #4f556e;
                    text-shadow: 0 0 0 #4f556e;
                  }
                }

                i {
                  color: #9ba3b0;
                  display: block;
                  font-size: 24px;
                  line-height: 1;
                  transition: 0.2s;
                }
              }
            }

            .infos {
              padding: 1rem 20px 20px;
              position: relative;

              .info {
                display: flex;
                flex-wrap: wrap;
                min-height: 2rem;

                .key {
                  color: #666;
                  font-size: 14px;
                }

                .value {
                  color: #333;
                  flex: 1;
                  &:not(.btn) {
                    user-select: text !important;
                  }

                  &.related-alarm {
                    color: @layout-color;
                  }
                  &.adjoin-alarm {
                    margin-top: 1rem;
                    width: 100%;
                    min-width: 100%;

                    .graphic-container {
                      background-color: #45652a;
                      height: 24rem;
                      position: relative;

                      .direction {
                        color: #f0f0f0;
                        font-size: 1rem;
                        font-weight: bold;
                        height: 1rem;
                        line-height: 1rem;
                        position: absolute;
                        text-align: center;
                        width: 100%;
                        &.top {
                          top: 8%;
                        }
                        &.bottom {
                          bottom: 8%;
                        }
                      }

                      .road-container {
                        display: flex;
                        height: 10rem;
                        left: 0;
                        justify-content: space-between;
                        padding: 0 10px;
                        position: absolute;
                        top: calc(50% - 5rem);
                        width: 100%;
                        &::after,
                        &::before {
                          background: linear-gradient(
                                90deg,
                                #f3f7fc,
                                #f3f7fc
                              )
                              0 0/ 100% 2px no-repeat,
                            linear-gradient(
                                90deg,
                                #f3f7fc,
                                #f3f7fc
                              )
                              0 6px/ 100% 2px no-repeat,
                            linear-gradient(
                                90deg,
                                #f3f7fc 20px,
                                transparent 20px,
                                transparent
                              ) -10px 33%/ 26px 2px repeat-x,
                            linear-gradient(
                                90deg,
                                #f3f7fc 20px,
                                transparent 20px,
                                transparent
                              ) -10px 66%/ 26px 2px repeat-x,
                            linear-gradient(
                                90deg,
                                #f3f7fc,
                                #f3f7fc
                              )
                              0 100%/ 100% 2px no-repeat,
                            #465d6b;
                          content: '';
                          height: calc((10rem - 30px) / 2);
                          left: 0;
                          position: absolute;
                          width: 100%;
                        }
                        &::after {
                          top: 0;
                        }
                        &::before {
                          bottom: 0;
                          transform: scaleY(-1);
                        }

                        .point-track {
                          flex-basis: 30px;
                          position: relative;
                          width: 30px;
                          &.inner-playing {
                            > .high-light {
                              svg {
                                transform: scale(1.5);
                              }
                            }
                          }

                          .point {
                            height: 30px;
                            position: absolute;
                            width: 30px;
                            z-index: 1;
                            &.line-0 {
                              top: 0;
                              transform: translateY(-100%);
                            }
                            &.line-1 {
                              bottom: 0;
                              transform: translateY(100%);
                            }
                            &.line-2 {
                              top: 50%;
                              transform: translateY(-50%);
                            }
                            &.alarm {
                              background: url(~@images/mv-map/alarm_icon_1.png)
                                0 0 / contain no-repeat;
                            }
                            &.cur-alarm {
                              z-index: 2;
                            }

                            svg {
                              cursor: pointer;
                              height: 22px;
                              transition: 0.3s;
                              width: 22px;
                            }

                            .tip-content {
                              background-color: #f7583e;
                              border-radius: 3px;
                              color: #fff;
                              padding: 0.3rem;
                              position: absolute;
                              top: 0;
                              transform: translateY(-100%);
                              white-space: nowrap;
                            }
                          }
                        }
                      }
                    }
                  }

                  .alarm-count {
                    font-weight: bold;
                    transition: 0.2s;
                    &:active {
                      font-weight: 500;
                    }
                  }

                  span:not(.btn) {
                    user-select: text !important;
                  }
                }
              }
            }
          }
        }
      }
    }

    footer {
      border-top: 1px solid #eee;
      height: @footerHeight;
      padding-right: 10px;
      position: relative;

      .ext-links {
        color: #888;
        display: flex;
        font-size: 1rem;
        justify-content: space-between;
        left: 0;
        position: absolute;
        top: 0;
        transform: translateY(-100%);
        width: 100%;

        .title {
          margin-right: 0.5em;
        }

        .links {
          color: @layout-color;
        }

        .alert-count-tip {
          span {
            color: #f009;
            &.value {
              margin-right: 1rem;
            }
            &.poc {
              color: @layout-color;
            }
            &.btn:hover {
              text-decoration: underline;
            }
          }
        }
      }

      .btns-wrap {
        align-items: center;
        display: flex;
        justify-content: space-between;
        width: 100%;

        .btns-middle {
          left: 0;
          margin: 0 auto;
          position: absolute;
          right: 0;
          width: fit-content;
        }
      }

      .ant-btn {
        font-size: 1.6rem;
        height: 3rem;
        margin-right: 3rem;
        padding: 0 1.5rem;
        &:last-child {
          margin-right: 0;
        }
        &.wrong {
          align-items: center;
          background-color: transparent;
          border: none;
          box-shadow: none;
          color: #21a2ff;
          display: flex;
          padding: 0;
          position: relative;

          ::v-deep(span) {
            text-decoration: underline;
          }

          i {
            font-size: 1.5rem;
            margin-left: 0.2em;
          }
        }
        &.green {
          background-color: #00c34e;
          border-color: #00c34e;
          &:hover {
            background-color: #47e369;
            border-color: #47e369;
          }
        }
        &.orange {
          background-color: #ffa944;
          border-color: #ffa944;
          &:hover {
            background-color: #f08200;
            border-color: #f08200;
          }
        }
        &.forbidden {
          cursor: not-allowed;
        }

        i {
          font-size: 1.2rem;
          line-height: 3rem;
          margin-right: 0.5rem;
        }
      }
    }
  }
}

@keyframes breakIn {
  0% {
    transform: translateX(90%);
  }

  100% {
    transform: translateX(0);
  }
}

@keyframes vertical-grow {
  0% {
    max-height: 0;
    transform: translateX(-100%) scaleY(0);
  }

  100% {
    max-height: 10rem;
    transform: translateX(0) scaleY(1);
  }
}

@keyframes vertical-shrink {
  0% {
    max-height: 10rem;
  }

  100% {
    max-height: 0;
  }
}
</style>
