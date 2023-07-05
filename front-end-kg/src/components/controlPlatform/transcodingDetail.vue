<template>
  <div class="transcoding-detail">
    <div class="table-control cloud-gateway-wrapper">
      <div class="cloud-gateway-header">
        <div class="title t-detail-flex">
          <div>
            <el-tooltip
              class="item"
              effect="dark"
              content="返回"
              placement="top-start"
            >
              <el-button
                type="primary"
                plain
                class="query"
                style="padding: 3px 0;width: 20PX;height: 20px;font-size: .6rem;margin: -2px 0 0 0px;"
                @click="goback()"
              >
                <i class="el-icon-top-left"></i>
              </el-button>
            </el-tooltip>
            <span style="padding-left:20px;">
              {{
                !this.$parent.showPlatFormDetail
                  ? gatewayInfo.transcodingName
                  : gatewayInfo.platformName
              }}
            </span>
          </div>
          <div>
            <span>
              {{ gatewayInfo.createDate }} 由
              {{ gatewayInfo.gmtCreateUser }} 创建
            </span>
          </div>
        </div>
        <!-- <div class="set-time">{{ gatewayInfo.createDate }}</div> -->
      </div>
      <div class="cloud-gateway-basic-info">
        <div class="cloud-gateway-title">基础信息</div>
        <div class="cloud-gateway-list">
          <el-col :span="4">
            <div class="grid-content">
              <div class="row-content">
                <div class="title">省份：</div>
                <el-tooltip :content="gatewayInfo.regionName + ''">
                  <div class="centent">
                    {{ gatewayInfo.regionName }}
                  </div>
                </el-tooltip>
              </div>
              <!-- <div class="row-content">
                <div class="title">最大接入数：</div>
                <el-tooltip :content="gatewayInfo">
                  <div class="centent">{{ gatewayInfo.channelNum }}</div>
                </el-tooltip>
              </div>-->
            </div>
          </el-col>
          <el-col :span="4">
            <div class="grid-content">
              <div class="row-content">
                <div class="title">所属组织：</div>
                <el-tooltip :content="gatewayInfo.organizationName">
                  <div class="centent">
                    {{ gatewayInfo.organizationName }}
                  </div>
                </el-tooltip>
              </div>
            </div>
          </el-col>

          <el-col :span="4">
            <div class="row-content">
              <div class="title">已接入数：</div>
              <el-tooltip :content="gatewayInfo.alreadyChannelNum + ''">
                <div class="centent">
                  {{ gatewayInfo.alreadyChannelNum }}
                </div>
              </el-tooltip>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="grid-content">
              <!-- <div class="row-content">
                <div class="title">所含路线：</div>
                <el-tooltip :content="gatewayInfo">
                  <div class="centent">{{ gatewayInfo.roadName }}</div>

                </el-tooltip>
              </div>-->
              <div class="row-content">
                <div class="title">联系人：</div>
                <el-tooltip :content="gatewayInfo.contactPerson">
                  <div class="centent">
                    {{ gatewayInfo.contactPerson }}
                  </div>
                </el-tooltip>
              </div>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="grid-content">
              <!-- <div class="row-content">
                <div class="title">设备厂商：</div>
                <el-tooltip :content="gatewayInfo">
                  <div class="centent">{{ gatewayInfo.vendorName }}</div>

                </el-tooltip>
              </div>-->
              <div class="row-content">
                <div class="title">联系电话：</div>
                <el-tooltip :content="gatewayInfo.contactPhone">
                  <div class="centent">
                    {{ gatewayInfo.contactPhone }}
                  </div>
                </el-tooltip>
              </div>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="row-content">
              <div class="title">所含路线：</div>
              <el-tooltip
                :content="
                  !this.$parent.showPlatFormDetail
                    ? gatewayInfo.roadNames
                    : gatewayInfo.road
                "
              >
                <div class="centent">
                  {{
                    !this.$parent.showPlatFormDetail
                      ? gatewayInfo.roadNames
                      : gatewayInfo.road
                  }}
                </div>
              </el-tooltip>
            </div>
          </el-col>
          <!-- <el-col :span="4">
            <div class="grid-content">
              <div class="row-content">
                <div class="title">所属流媒体：</div>
                <el-tooltip :content="gatewayInfo">
                  <div class="centent">{{ gatewayInfo.smName }}</div>

                </el-tooltip>
              </div>
            </div>
          </el-col>-->
        </div>
      </div>
      <div class="cloud-gateway-basic-info">
        <div class="cloud-gateway-title">对接信息</div>
        <div class="cloud-gateway-list">
          <el-col :span="4">
            <div class="grid-content">
              <div class="row-content">
                <div class="title">设备编号：</div>
                <el-tooltip :content="gatewayInfo.deviceCode">
                  <div class="centent">
                    {{ gatewayInfo.deviceCode }}
                  </div>
                </el-tooltip>
              </div>
              <div class="row-content">
                <div class="title">平台编号：</div>
                <el-tooltip :content="gatewayInfo.platformCode">
                  <div class="centent">
                    {{ gatewayInfo.platformCode }}
                  </div>
                </el-tooltip>
              </div>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="grid-content">
              <div class="row-content">
                <div class="title">User：</div>
                <el-tooltip :content="gatewayInfo.deviceUser">
                  <div class="centent">
                    {{ gatewayInfo.deviceUser }}
                  </div>
                </el-tooltip>
              </div>
              <div class="row-content">
                <div class="title">平台User：</div>
                <el-tooltip :content="gatewayInfo.platformUser">
                  <div class="centent">
                    {{ gatewayInfo.platformUser }}
                  </div>
                </el-tooltip>
              </div>
            </div>
          </el-col>
          <el-col
            :span="8"
            style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;"
          >
            <div class="grid-content">
              <div class="row-content">
                <div class="title">Token：</div>
                <el-tooltip :content="gatewayInfo.deviceToken">
                  <div class="centent">
                    {{ gatewayInfo.deviceToken }}
                  </div>
                </el-tooltip>
              </div>
              <div class="row-content">
                <div class="title">平台Token：</div>
                <el-tooltip :content="gatewayInfo.platformToken">
                  <div class="centent">
                    {{ gatewayInfo.platformToken }}
                  </div>
                </el-tooltip>
              </div>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="grid-content">
              <div class="row-content">
                <div class="title">访问地址：</div>
                <el-tooltip :content="gatewayInfo.urlAddress">
                  <div class="centent">
                    {{ gatewayInfo.urlAddress }}
                  </div>
                </el-tooltip>
              </div>
            </div>
          </el-col>
        </div>
      </div>

      <div class="cloud-gateway-camera-info" style="padding:20px;">
        <div class="cloud-gateway-title">
          归属摄像机信息
        </div>
        <div class="cloud-gateway-row" style="display:flex">
          <div class="search-wrapper">
            <el-form :inline="true">
              <el-form-item label="所属类别：" prop="classifyCode">
                <el-select
                  v-model="gatewayQuery.classifyCode"
                  placeholder="请选择所属类别"
                  style="width: 140px"
                >
                  <el-option
                    v-for="item in dimensionList"
                    :key="item.roadCode"
                    :label="item.roadName"
                    :value="item.roadCode + ''"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="摄像机状态：" prop="onlineStatus">
                <el-select
                  v-model="gatewayQuery.onlineStatus"
                  placeholder="请选择摄像机状态"
                  style="width: 100px"
                >
                  <el-option
                    style="width: 100px"
                    v-for="item in onlineStatus"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code + ''"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="摄像机类型：" prop="cameraType">
                <el-select
                  v-model="gatewayQuery.cameraType"
                  placeholder="请选择相机类型"
                  style="width: 100px"
                >
                  <el-option
                    v-for="item in cameraTypeList"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code + ''"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="桩号范围:" prop="kmPileMin">
                <el-input
                  v-model="gatewayQuery.kmPileMin"
                  placeholder="请输入起始公里数"
                  style="width: 150px;margin-right:10px"
                ></el-input
                >~
                <el-input
                  v-model="gatewayQuery.kmPileMax"
                  placeholder="请输入终点公里数"
                  style="width: 150px;margin-left: 10px"
                ></el-input>
              </el-form-item>
              <el-form-item label="摄像机名称：" prop="cameraName">
                <el-input
                  style="width:150px"
                  v-model="gatewayQuery.cameraName"
                  placeholder="请输入摄像机名称"
                ></el-input>
              </el-form-item>
              <el-form-item label="摄像机编号：" prop="cameraNum">
                <el-input
                  style="width:120px"
                  v-model="gatewayQuery.cameraNum"
                  placeholder="请输入摄像机编号"
                ></el-input>
              </el-form-item>
              <el-form-item label="高清状态：" prop="hdStatus">
                <el-select
                  v-model="gatewayQuery.hdStatus"
                  placeholder="请选择"
                  style="width: 100px"
                >
                  <el-option
                    v-for="item in hdStatusList"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>

          <!--<el-select v-model="gatewayQuery" placeholder="请选择" style="width: 140px">
                    <el-option
                            v-for="item in dimensionList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
          </el-select>-->
          <div class="btnInfo">
            <el-button type="primary" plain class="query" @click="cloudQuery"
              >搜索</el-button
            >
            <el-button
              type="info"
              plain
              class="query"
              style="background: #92969B !important;"
              @click="resetCloud"
              >重置</el-button
            >
            <el-dropdown split-button type="primary">
              批量处理
              <el-dropdown-menu slot="dropdown" class="camera-manage-dropdown">
                <el-dropdown-item>
                  <div @click="mutilStatusAll('stream-1')">
                    <span class="iconTips kl-icon"></span>
                    <span>推流</span>
                  </div>
                </el-dropdown-item>

                <el-dropdown-item>
                  <div @click="mutilStatusAll('stream-0')">
                    <span class="iconTips gl-icon"></span>
                    <span>停流</span>
                  </div>
                </el-dropdown-item>
                <el-dropdown-item>
                  <div @click="tallStatusAll(1)">
                    <span class="iconTips kl-icon"></span>
                    <span>推高清流</span>
                  </div>
                </el-dropdown-item>

                <el-dropdown-item>
                  <div @click="tallStatusAll(0)">
                    <span class="iconTips gl-icon"></span>
                    <span>停高清流</span>
                  </div>
                </el-dropdown-item>

                <el-dropdown-item>
                  <div @click="mutilStatusAll('display-1')">
                    <span class="iconTips bf-icon"></span>
                    <span>显示</span>
                  </div>
                </el-dropdown-item>

                <el-dropdown-item>
                  <div @click="mutilStatusAll('display-0')">
                    <span class="iconTips tz-icon"></span>
                    <span>隐藏</span>
                  </div>
                </el-dropdown-item>

                <el-dropdown-item>
                  <div @click="mutilStatusAll('open-1')">
                    <span class="iconTips kf-icon"></span>
                    <span>开放</span>
                  </div>
                </el-dropdown-item>

                <el-dropdown-item>
                  <div @click="mutilStatusAll('open-0')">
                    <span class="iconTips gb-icon"></span>
                    <span>关闭</span>
                  </div>
                </el-dropdown-item>
                <el-dropdown-item>
                  <div @click="mutilStatusAll('addDeviceGroup')">
                    <span class="iconTips tjsb-icon"></span>
                    <span>添加到摄像机组</span>
                  </div>
                </el-dropdown-item>
                <el-dropdown-item>
                  <div @click="deleteCamera()">
                    <span class="iconTips delete-icon"></span>
                    <span>删除</span>
                  </div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
        <div>
          <span class="text">摄像机接入数：</span>
          <span class="insert-num">{{ total }}</span>
        </div>
      </div>
    </div>

    <div
      class="table-content-body camera-table-h"
      :style="{ height: 'calc(100% - 420px)' }"
    >
      <el-table
        class="custom-cloud-table"
        :data="tableList"
        v-loading="cameraTableLoading"
        style="width:100%"
        max-height="100%"
        @selection-change="handleSelectionChange"
        border
        ref="tableDataRef"
      >
        <el-table-column
          type="selection"
          align="center"
          width="50"
          fixed="left"
        ></el-table-column>
        <el-table-column label="序号" align="center" width="60">
          <template slot-scope="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column
          v-if="cameraColData[0].istrue"
          prop="cameraName"
          label="摄像机名称"
          min-width="300"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          v-if="cameraColData[1].istrue"
          prop="regionName"
          label="地区"
          width="80"
        ></el-table-column>
        <el-table-column
          v-if="cameraColData[2].istrue"
          prop="organizationName"
          label="管辖单位"
          width="120"
        ></el-table-column>
        <el-table-column
          v-if="cameraColData[3].istrue"
          prop="roadCode"
          label="所属路线"
          width="120"
        ></el-table-column>
        <el-table-column
          v-if="cameraColData[4].istrue"
          prop="kmPile"
          label="桩号"
          width="100"
        ></el-table-column>
        <el-table-column
          v-if="cameraColData[5].istrue"
          prop="lonAndlat"
          label="经纬度"
          width="250"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <!-- style="text-decoration: underline; cursor:pointer" -->
            <div
              style="text-decoration: underline; cursor:pointer"
              @click="gatelonAndlat(scope.row)"
            >
              {{ scope.row.longAndLati }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          v-if="cameraColData[6].istrue"
          prop="classifyCode"
          label="所属类别"
          width="80"
        >
          <template slot-scope="scope">
            <!-- style="text-decoration: underline; cursor:pointer" -->
            <div>{{ getClassifyCodetext(scope.row) }}</div>
          </template>
        </el-table-column>
        <!-- <el-table-column v-if="cameraColData[7].istrue" prop="derectionCode" label="方向" width="80"></el-table-column> -->
         <!-- 高清状态 -->
         <el-table-column
          v-if="cameraColData[8].istrue"
          prop="onlineStatus"
          label="高清状态"
          align="center"
          width="100"
        >
          <template slot-scope="scope">
            <div>
              <span style="vertical-align: middle">
                {{
                  scope.row.hdStatus === '1' ? '在线' : '离线'
                }}
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          v-if="cameraColData[9].istrue"
          prop="onlineStatus"
          label="摄像机状态"
          width="100"
        >
          <template slot-scope="scope">
            <div>
              <span
                :style="
                  `width:5px;height:5px;display:inline-block;vertical-align: middle;margin-right: 5px;
                                           background:${
                                             scope.row.onlineStatus == null
                                               ? stateList[2].color
                                               : stateList[
                                                   parseInt(
                                                     scope.row.onlineStatus
                                                   )
                                                 ].color
                                           }`
                "
              ></span>
              <span style="vertical-align: middle">
                {{
                  scope.row.onlineStatus == null
                    ? stateList[2].name
                    : stateList[parseInt(scope.row.onlineStatus)].name
                }}
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          v-if="cameraColData[11].istrue"
          prop="streamStatus"
          label="推流状态"
          align="center"
          width="100"
        >
          <template slot-scope="scope">
            <div>
              <i
                v-if="scope.row.streamControlStatus === '1'"
                class="el-icon-s-claim table-status-icon text-success"
                style="font-size:1.5rem;"
              ></i>
              <i
                v-else
                class="el-icon-s-release table-status-icon text-error"
                style="font-size:1.5rem;"
              ></i>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          v-if="cameraColData[12].istrue"
          prop="playStatus"
          label="显示状态"
          align="center"
          width="100"
        >
          <!-- <template slot="header" slot-scope="scope">
            <span>显示状态</span>
            <el-dropdown>
              <span class="el-dropdown-link">
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <el-checkbox
                    @change="getGatewayCameraList()"
                    class="camera-filter-check"
                    v-model="gatewayQuery.displayStatus"
                  >显示</el-checkbox>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-checkbox
                    @change="getGatewayCameraList()"
                    class="camera-filter-check"
                    v-model="gatewayQuery.displayStatus1"
                  >隐藏</el-checkbox>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>-->
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              :content="scope.row.displayStatus === '1' ? '显示' : '隐藏'"
              placement="top"
            >
              <div
                @click="
                  toggleDisplayStatus(
                    scope.row.displayStatus === '1' ? '0' : '1',
                    scope.row.displayStatus === '1' ? '隐藏' : '显示',
                    scope.row
                  )
                "
              >
                <img
                  v-if="scope.row.displayStatus === '1'"
                  src="../../assets/images/icon/block.png"
                  style="width: 20px;height: 20px"
                />
                <img
                  v-else
                  src="../../assets/images/icon/hide.png"
                  style="width: 20px;height: 20px"
                />
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          v-if="cameraColData[13].istrue"
          prop="openStatus"
          label="开放状态"
          align="center"
          width="100"
        >
          <!-- <template slot="header" slot-scope="scope">
            <span>开放状态</span>
            <el-dropdown>
              <span class="el-dropdown-link">
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <el-checkbox
                    @change="getGatewayCameraList()"
                    class="camera-filter-check"
                    v-model="gatewayQuery.openStatus"
                  >开放</el-checkbox>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-checkbox
                    @change="getGatewayCameraList()"
                    class="camera-filter-check"
                    v-model="gatewayQuery.openStatus1"
                  >关闭</el-checkbox>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>-->
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              :content="scope.row.openStatus === '1' ? '开放' : '关闭'"
              placement="top"
            >
              <div
                @click="
                  toggleOpenStatus(
                    scope.row.openStatus === '1' ? '0' : '1',
                    scope.row.openStatus === '1' ? '关闭' : '开放',
                    scope.row
                  )
                "
              >
                <i
                  v-if="scope.row.openStatus === '1'"
                  class="el-icon-circle-check table-status-icon text-success"
                  style="font-size:1.5rem;"
                ></i>
                <i
                  v-else
                  class="el-icon-remove-outline table-status-icon text-error"
                  style="font-size:1.5rem;"
                ></i>
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          v-if="cameraColData[14].istrue"
          label="摄像机类型"
          width="100"
        >
          <template slot-scope="scope">{{
            getCameraType(scope.row.cameraType)
          }}</template>
        </el-table-column>
        <el-table-column
          v-if="cameraColData[15].istrue"
          prop="cameraNum"
          label="摄像机编号"
          min-width="200"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="130"
          max-height="100%"
          style="overflow:hidden"
          :render-header="renderHeader"
        >
          <template slot-scope="scope">
            <!--<span
                class="handle-icon handle-delete"
                @click="handleDelete(scope.row)"
              ></span>
              <span
                class="handle-icon handle-play"
                @click="handlePlay(scope.row)"
              ></span>
              <span
                class="handle-icon handle-watch"
                @click="handleWatch(scope.row)"
            ></span>-->

            <!-- <el-tooltip effect="dark" content="删除" placement="top">
              <el-button
                class="table-control-btn"
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="handleDelete(scope.row)"
              ></el-button>
            </el-tooltip>-->
            <el-tooltip effect="dark" content="播放视频" placement="top">
              <el-button
                class="table-control-btn"
                type="primary"
                icon="el-icon-video-play"
                size="mini"
                @click="handlePlay(scope.row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="查看详情" placement="top">
              <el-button
                class="table-control-btn"
                type="primary"
                icon="el-icon-document"
                size="mini"
                @click="handleWatch(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--分页控件-->
    <div class="table-pagination">
      <p class="total-pagination">共{{ total }}条</p>
      <el-pagination
        background
        layout=" prev, pager, next, sizes, jumper "
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
        :current-page="currentPage"
        :total="total"
      ></el-pagination>
    </div>
    <el-dialog
      title="添加到摄像机组"
      :visible.sync="appendDeiveGroupDialogVisible"
      width="400px"
      custom-class="device-group-dialog"
      v-dialogDrag
      :append-to-body="true"
      :close-on-click-modal="false"
    >
      <el-form :model="addDeiveGroupFrom">
        <el-form-item label>
          <div style="color: #000000">
            已选择视频数：
            <span style="font-size: 18px;color: #1274EE">{{
              this.multipleSelection.length
            }}</span>
          </div>
        </el-form-item>
        <el-form-item label class="clearfix">
          <el-select
            v-model="addDeiveGroupFrom.groupId"
            placeholder="请选择摄像机组"
            style="width: 82%;float: left;"
            clearable
          >
            <el-option
              v-for="(item, index) in deviceGroupList"
              :key="index"
              :label="item.groupName"
              :value="item.groupId"
            ></el-option>
          </el-select>
          <div
            style="float: right;margin: 0;width: 30px;height: 30px;"
            class="icon-img"
            @click="addDeiveGroupDialogVisible = true"
          ></div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="appendDeiveGroupDialogVisible = false"
          >取 消</el-button
        >
        <el-button type="primary" @click="appendDeiveGroup()">确 定</el-button>
      </div>
    </el-dialog>

    <!--新增摄像机组弹窗-->
    <el-dialog
      title="新增摄像机组"
      :visible.sync="addDeiveGroupDialogVisible"
      custom-class="device-group-dialog"
      width="400px"
      height="auto"
      v-dialogDrag
      :append-to-body="true"
      :close-on-click-modal="false"
    >
      <el-form :model="addDeiveGroupFrom">
        <el-form-item label>
          <div style="height:17px"></div>
        </el-form-item>
        <el-form-item label>
          <el-input
            v-model="addDeiveGroupFrom.groupName"
            placeholder="请输入内容"
          ></el-input>
        </el-form-item>
        <el-form-item label>
          <div style="height:18px"></div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDeiveGroupDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDeiveGroup()">确 定</el-button>
      </div>
    </el-dialog>
    <camera-play-dialog
      v-if="playerDialogVisible"
      :visible.sync="playerDialogVisible"
      :cameraInfo="playerCamera"
      :cameraId="cameraId"
      ref="cameraVideo"
    ></camera-play-dialog>
    <!--摄像机详情弹窗-->
    <el-dialog
      title="查看详情"
      :visible.sync="cameraDialogVisible"
      width="879px"
      custom-class="gd-dialog camera-details-dialog"
      v-dialogDrag
      :append-to-body="true"
      :close-on-click-modal="false"
      @close="clearCameraList"
    >
      <camera-detail
        v-if="cameraDialogVisible"
        ref="cameraDetail"
        :cameraDetailedInfo="cameraDetailedInfo"
      ></camera-detail>
    </el-dialog>

    <el-dialog
      :title="lonAndlatOperation.cameraName"
      :visible.sync="lonAndlatOperation.visible"
      custom-class="gd-dialog"
      width="80%"
      v-dialogDrag
      :append-to-body="true"
      :close-on-click-modal="false"
    >
      <div style="height:100%;">
        <TrafficAmap
          ref="lonAndlatMap"
          :cameraNumber="lonAndlatOperation.cameraNum"
        ></TrafficAmap>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import TrafficAmap from "../cameraMap.vue";

import CameraPlayDialog from "../module/CameraManage/CameraPlayDialog";
import cameraDetail from "../module/equipment/cameraDetail";
export default {
  components: {
    CameraPlayDialog,
    cameraDetail,
    TrafficAmap,
  },
  props: {
    selectedTran: Object,
    province: Array,
  },
  data() {
    return {
      cameraColData: [
        { title: "摄像机名称", istrue: true },
        { title: "地区", istrue: true },
        { title: "管辖单位", istrue: true },
        { title: "所属路线", istrue: true },
        { title: "桩号", istrue: true },
        { title: "经纬度", istrue: true },
        { title: "所属类别", istrue: true },
        { title: "方向", istrue: true },
        { title: "高清状态", istrue: true },
        { title: "摄像机状态", istrue: true },
        { title: "所属上云网关", istrue: true },
        { title: "推流状态", istrue: true },
        { title: "播放状态", istrue: true },
        { title: "开放状态", istrue: true },
        { title: "摄像机类型", istrue: true },
        { title: "摄像机编号", istrue: true },
      ],
      cameraId: "",
      lonAndlatOperation: {
        visible: false,
        cameraName: "",
        cameraNum: "",
      },
      video: {
        pageSize: 10,
        current: 1,
        total: 0,
      },
      tableData: [],
      areaList: [],
      areaValue: "",
      cameraType: "",
      orgCodeProps: {
        //lazy: true,
        expandTrigger: "hover",
        value: "organizationId",
        label: "organizationName",
        children: "childList",
        //lazyLoad:this.propsLazyload
      },
      directionList: [], //摄像机方向
      startMileage: "",
      endMileage: "",
      filters: {
        provinceCode: "",
        organizationId: "",
        roadCode: "",
        startMileage: this.startMileage,
        endMileage: this.endMileage,
        direction: "",
        classify: "",
        upCloud: "",
        cameraState: "",
        cameraType: "",
        onlineStatus: "",
      },
      orgTreeList: [],
      roadList: [],
      classifyList: [], //所属类别
      transCodeValue: "", //上云网关
      transCodeList: [], //上云网关
      onlineStatus: [
        {
          state: "0",
          cameraState: "离线",
        },
        {
          state: "1",
          cameraState: "正常",
        },
        {
          state: "2",
          cameraState: "故障",
        },
      ],
      hdStatusList: [
        {
          value: 1,
          name: "在线",
        },
        {
          value: 0,
          name: "离线",
        }
      ],
      cameraTableLoading: false,
      tableList: [],
      pageSize: 10,
      currentPage: 1,
      total: 0,
      pages: 0,
      loadOption: {
        fullscreen: true,
        lock: true,
        text: "加载中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.3)",
      },
      stateList: [
        { name: "离线", color: "#878787" },
        { name: "正常", color: "#26B55F" },
        { name: "故障", color: "#F9552F" },
      ],
      multipleSelection: [],
      appendDeiveGroupDialogVisible: false,
      addDeiveGroupDialogVisible: false,
      addDeiveGroupFrom: {
        groupName: "",
        groupId: "",
      },
      deviceGroupList: [],
      playerDialogVisible: false,
      playerDialogDetailVisible: false,
      playerCamera: {},
      cameraDialogVisible: false,
      cameraDetailedInfo: {},
      gatewayQuery: {
        kmPileMax: "",
        kmPileMin: "",
        transcodingId: "",
        classifyCode: "",
        cameraType: "",
        // cameraStatus: "", //摄像机状态
        cameraNum: "",
        cameraName: "",
        onlineStatus: "",
        hdStatus: null,
      },
      dimensionList: [
        {
          roadCode: "0",
          roadName: "默认",
        },
        {
          roadCode: "1",
          roadName: "道路沿线",
        },
        {
          roadCode: "2",
          roadName: "桥梁",
        },
        {
          roadCode: "3",
          roadName: "隧道",
        },
        {
          roadCode: "4",
          roadName: "收费广场",
        },
        {
          roadCode: "5",
          roadName: "收费站",
        },
        {
          roadCode: "6",
          roadName: "服务区",
        },
        {
          roadCode: "7",
          roadName: "ETC门架",
        },
        {
          roadCode: "8",
          roadName: "移动视频源",
        },
      ],
      onlineStatus: [
        { name: "离线", code: "0" },
        { name: "正常", code: "1" },
        { name: "故障", code: "2" },
      ],
      cameraTypeList: [
        { name: "监控型机枪", code: 1 },
        { name: "监控型球机", code: 2 },
        { name: "全景型", code: 3 },
        { name: "抓拍机", code: 4 },
      ],
      gatewayInfo: {},
      // 上云网关上回退当前页标记
      gatewayCurrentPage: 1,
    };
  },
  methods: {
    getCameraType(type) {
      var typeName;
      for (var i in this.cameraTypeList) {
        if (this.cameraTypeList[i].code + "" == type + "") {
          typeName = this.cameraTypeList[i].name;
        }
      }
      return typeName ? typeName : "";
    },
    getClassifyCodetext(row) {
      let classify = _.find(this.dimensionList, {
        roadCode: row.classifyCode,
      });
      return classify ? classify.roadName : row.classifyCode;
    },
    filterStreamStatus(value, row) {
      return row.streamStatus == value;
    },
    filterplayStatus(value, row) {
      return row.playStatus == value;
    },
    filterOpenStatus(value, row) {
      return row.openStatus == value;
    },
    filterVirtual(value, row) {
      return row.virtual == value;
    },
    //自定义操作列标题内容
    renderHeader(h, { c, d }) {
      let vm = this;
      return (
        <div>
          <span>操作</span>
        </div>
      );
    },
    handleCurrentChange(current) {
      this.video.current = current;
      this.cloudList();
    },

    handleVideoSizeChange(size) {
      this.video.pageSize = size;
      this.cloudList();
    },
    /**
     * 获取省份列表
     */
    loadArea() {
      this.$api
        .getProvince()
        .then((res) => {
          if (res.code != "200") {
            return Promise.reject;
          }

          this.areaList = res.data;
          this.areaList.unshift({
            regionCode: "",
            regionName: "全国",
            alias: "全国",
            parentRegionCode: "0",
          });
        })
        .catch(() => {});
    },

    changeDirection(val) {
      this.filters.direction = val;
    },
    changCameraType(val) {
      this.filters.cameraType = val;
    },
    changeTransCode(val) {
      console.log(val);
      this.filters.upCloud = val;
    },

    changeCamera(val) {
      this.filters.cameraState = val;
    },

    roadChange(val) {
      this.filters.roadCode = val;
    },

    loadDirection() {
      var _this = this;
      this.$api
        .getCodemaster({
          codeType: "DERECTION",
        })
        .then((data) => {
          if (data.code == "200") {
            _this.directionList = data.data;
          }
        });
    },

    //获取所有类别
    loadClassify() {
      var _this = this;
      this.$api
        .getCodemaster({
          codeType: "CLASSIFY",
        })
        .then((data) => {
          if (data.code == "200") {
            _this.classifyList = data.data;
          }
        });
    },

    queryRoadList(orgId) {
      console.log("queryRoadList=>", orgId);
      let _this = this;
      this.$api
        .getRoadsByOrgId({ organizationId: orgId + "" })
        .then((data) => {
          if (data.code !== 200) {
            return Promise.reject();
          }
          _this.roadList = data.data;
        })
        .catch(() => {});
    },

    queryOrgList(regionCode) {
      let _this = this,
        params = {};
      if (regionCode) params.regionCode = regionCode;
      this.$api.getOrgTree(params).then((data) => {
        if (data.code !== 200) {
          return Promise.reject();
        }
        let nlist = data.data;
        _this.orgTreeList = nlist;
      });
      // .catch(error => {
      //   this.$message({
      //     message:
      //       "获取组织架构树失败! [" + error.code + "]: " + error.message,
      //     type: "error"
      //   });
      // });
    },
    /**
     * 摄像机导出
     */
    exportCameraList() {
      let mutilData = this.multipleSelection;
      if (mutilData.length === 0) {
        this.$message.warning("请选择要导出的摄像机！");
        return false;
      }
      let caremanums = _.map(mutilData, (it) => it.cameraNum).join(",");
      this.$http
        .get("/base/cameras/download/excel-detail/" + caremanums, {
          responseType: "blob",
        })
        .then((data) => {
          var downloadElement = document.createElement("a");
          var href = window.URL.createObjectURL(data.data); // 创建下载的链接
          downloadElement.href = href;
          downloadElement.download = "摄像机信息表.xlsx"; // 下载后文件名
          document.body.appendChild(downloadElement);
          downloadElement.click(); // 点击下载
          document.body.removeChild(downloadElement); // 下载完成移除元素
          window.URL.revokeObjectURL(href); // 释放掉blob对象
        })
        .catch((error) => {
          this.$message({
            message: "摄像机导出失败! ",
            type: "error",
          });
        });
    },
    /**
     * 多选操作
     */
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    /**
     * 用户批量操作触发
     * @param obj
     */
    mutilStatusAll(obj) {
      if (this.multipleSelection.length === 0) {
        this.$message.warning("请选择要处理的摄像机！");
        return false;
      }
      // 判断是否为绑定到摄像机组 和 删除按钮触发
      if (obj == "addDeviceGroup") {
        this.getDeviceList();
        this.appendDeiveGroupDialogVisible = true;
        return;
      }

      let that = this,
        ar = obj.split("-"),
        dataList = [],
        idxAr = [];

      let msgAr = {
        stream: ["停流", "推流"],
        open: ["关闭", "开放"],
        display: ["隐藏", "显示"],
      };

      let msg = msgAr[ar[0]][ar[1]];

      // if (ar[0] === "stream" && that.multipleSelection.length > 20) {
      //   this.$message.warning("超出可一次控制数量，限制 20 个！");
      //   return false;
      // }

      this.$confirm("确定批量设定摄像机 " + msg + "?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        dangerouslyUseHTMLString: true,
        closeOnClickModal: false,
        customClass: "gd-confirm",
      })
        .then(() => {
          // 判断是否为推拉流
          switch (ar[0]) {
            case "stream":
              this.toggleStream(ar[1], msg);
              break;
            case "open":
              this.toggleOpenStatus(ar[1], msg);
              break;
            case "display":
              this.toggleDisplayStatus(ar[1], msg);
              break;
          }

          // this.checkStatus({ checkMsg: msg, data: dataList });
        })
        .catch(() => {});
    },
    // 推/停高清流
    tallStatusAll(val) {
      if (this.multipleSelection.length === 0) {
        this.$message.warning("请选择要处理的摄像机！");
        return false;
      }
      let msg = val === 1 ? "推高清流" : "停高清流";

      // if (ar[0] === "stream" && that.multipleSelection.length > 20) {
      //   this.$message.warning("超出可一次控制数量，限制 20 个！");
      //   return false;
      // }

      this.$confirm("确定批量设定摄像机 " + msg + "?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        dangerouslyUseHTMLString: true,
        closeOnClickModal: false,
        customClass: "gd-confirm",
      })
        .then(() => {
          // 推/停高清流接口调用
          this.toggleTall(val);
        })
        .catch(() => {});
    },
    toggleTall(status) {
      let cameraIds = null;
      cameraIds = _.map(this.multipleSelection, (it) => it.cameraNum);
      let msg = status === 1 ? "推高清流" : "停高清流",
        instructions = {
          module: "资源管理",
          page: "摄像机管理",
          feature: "批量处理-" + msg,
          description: "批量" + msg + cameraIds.length + "路摄像机",
        };
      this.updateStreamStatus({
        // checkMsg: msg,
        data: {
          streamType: parseInt(status) === 1 ? "2" : "-3",
          cameraNums: cameraIds,
        },
      }).then((msg) => {
        // this.$forceUpdate();
        this.getGatewayCameraList();
        // this.$message({
        //   message: "添加成功",
        //   type: "success"
        // });
      });
    },
    toggleStream(status, msg, row) {
      let cameraIds = null;
      if (row) {
        cameraIds = [row.cameraNum];
      } else {
        cameraIds = _.map(this.multipleSelection, (it) => it.cameraNum);
      }
      this.updateStreamStatus({
        checkMsg: msg,
        data: {
          streamType: parseInt(status) === 1 ? "0" : "-1",
          // streamStatus: status,
          cameraNums: cameraIds,
          // streamType: 20,
          instructions: {
            module: "资源管理",
            page: "摄像机管理",
            feature: "批量处理-" + msg,
            description: "批量" + msg + cameraIds.length + "路摄像机",
          },
        },
      }).then((msg) => {
        // this.$forceUpdate();
        this.getGatewayCameraList();
        // this.$message({
        //   message: "添加成功",
        //   type: "success"
        // });
      });
    },
    toggleOpenStatus(status, msg, row) {
      let ids = null;
      if (row) {
        ids = [row.cameraId];
      } else {
        ids = _.map(this.multipleSelection, (it) => it.cameraId);
      }
      this.$api
        .batchUpdateOpen({
          cameraIds: ids,
          openStatus: status,
          instructions: {
            module: "资源管理",
            page: "摄像机管理",
            feature: "批量处理-" + msg,
            description: "批量 " + msg + ids.length + "路，摄像机",
          },
        })
        .then((res) => {
          if (res.code === 200) {
            this.getGatewayCameraList();
          }
        });
    },
    toggleDisplayStatus(status, msg, row) {
      let ids = null;
      if (row) {
        ids = [row.cameraId];
      } else {
        ids = _.map(this.multipleSelection, (it) => it.cameraId);
      }
      this.$api
        .batchUpdateDisplay({
          cameraIds: ids,
          openStatus: status,
          instructions: {
            module: "资源管理",
            page: "摄像机管理",
            feature: "批量处理-" + msg,
            description: "批量 " + msg + ids.length + "路，摄像机",
          },
        })
        .then((res) => {
          if (res.code === 200) {
            this.getGatewayCameraList();
          }
        });
    },

    /**
     * 摄像机删除
     */
    deleteCamera() {
      if (this.multipleSelection.length === 0) {
        this.$message.warning("请选择要处理的摄像机！");
        return false;
      }
      this.$confirm("确定删除摄像机?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        dangerouslyUseHTMLString: true,
        closeOnClickModal: false,
        customClass: "gd-confirm",
      }).then(() => {
        var cams = [];
        for (var i = 0, len = this.multipleSelection.length; i < len; i++) {
          cams.push(this.multipleSelection[i].cameraId);
        }
        this.$api
          .deleteBatchCamera({
            cameraIds: cams,
            openStatus: "",
          })
          .then(() => {
            // this.query();
            this.getGatewayCameraList();
          });
      });
    },

    /**
     * 触发推拉流方法
     * @param obj
     */
    updateStreamStatus(obj) {
      let msg = obj.checkMsg,
        itemList = obj.data.cameraIds;

      return this.$api
        .updateStreamStatus(obj.data)
        .then((res) => {
          if (res.code !== 200) {
            return Promise.reject(res);
          }
          if (!_.isEmpty(res.data.errorList)) {
            let HTMLText = "";
            _.each(res.data.errorList, (v, k) => {
              HTMLText =
                HTMLText +
                "<p><span>" +
                k +
                ":</span><span>" +
                v +
                "</span></p>";
            });
            this.$alert(HTMLText, "警告", {
              dangerouslyUseHTMLString: true,
              type: "error",
            });
          }
          let success = res.data.success;
          if (_.isEmpty(res.data.success)) {
            let HTMLText = "";
            this.$alert(HTMLText, "状态信息", {
              message: msg + success + "路摄像机成功", //msg+'播放摄像机成功',
              type: "success",
            });
            // let len = 0;
            // _.each(res.data.success, (v, k) => {
            //   len++;
            // });
            // this.$message({
            //   message: len + "路摄像机操作成功", //msg+'播放摄像机成功',
            //   type: "success"
            // });
            // let cameraList = this.tableList,
            //   olen = cameraList.length,
            //   nlen = itemList.length;
            // for (let i = 0; i < nlen; i++) {
            //   for (let j = 0; j < olen; j++) {
            //     if (
            //       parseInt(cameraList[j].cameraId) === parseInt(itemList[i])
            //     ) {
            //       cameraList[j].streamStatus = obj.data.status + "";
            //       break;
            //     }
            //   }
            // }
            this.getGatewayCameraList();
          }

          // this.query();
        })
        .catch((err) => {
          this.$message({
            message: err.message,
            type: "error",
          });
        });
    },

    /**
     * 改变摄像机状态触发
     * @param obj
     */
    checkStatus(obj) {
      let msg = obj.checkMsg,
        itemList = obj.data;

      this.$api
        .updateOpStatus(obj.data)
        .then((data) => {
          if (data.code !== 2000) {
            return Promise.reject(data);
          }
          this.$message({
            message: msg + "摄像机，" + data.message, //msg+'播放摄像机成功',
            type: "success",
          });
          let cameraList = this.tableList,
            olen = cameraList.length,
            nlen = itemList.length;
          for (let i = 0; i < nlen; i++) {
            for (let j = 0; j < olen; j++) {
              if (
                parseInt(cameraList[j].cameraId) ===
                parseInt(itemList[i].cameraId)
              ) {
                cameraList[j].openStatus = itemList[i].openStatus;
                cameraList[j].playStatus = itemList[i].playStatus;
                break;
              }
            }
          }
          this.getGatewayCameraList();
        })
        .catch((err) => {
          this.$message({
            message: err.message,
            type: "error",
          });
        });
    },

    /**
     * 分页导航
     * @param val
     */
    handlePageChange(val) {
      this.currentPage = val;
      this.getGatewayCameraList();
    },

    /**
     * 分页导航 改变每页展示数量
     * @param index
     */
    handleSizeChange(index) {
      this.pageSize = index;
      this.currentPage = 1;

      this.getGatewayCameraList();
    },
    /**
     * 获取摄像机组列表
     */
    getDeviceList() {
      this.$api
        .getDeviceGroupList({
          currPage: 1,
          pageSize: 0,
        })
        .then((res) => {
          this.deviceGroupList = res.data;
        });
      return true;
    },
    /**
     * 摄像机添加到摄像机组
     */
    appendDeiveGroup() {
      var devs = [];
      if (!this.addDeiveGroupFrom.groupId) {
        return this.$message.warning("请选择添加到的摄像机组");
      }
      let name = _.find(this.deviceGroupList, {
        groupId: this.addDeiveGroupFrom.groupId,
      }).groupName;
      for (var i = 0, len = this.multipleSelection.length; i < len; i++) {
        devs.push(this.multipleSelection[i].cameraId);
      }
      this.$api
        .addDev({
          groupIds: [this.addDeiveGroupFrom.groupId],
          cameraIds: devs,
          instructions: {
            module: "资源管理",
            page: "摄像机管理",
            feature: "批量处理—添加到摄像机组",
            description:
              "批量添加" + devs.length + "路摄像机到摄像机组: " + name,
          },
        })
        .then((res) => {
          if (res.code !== 200) {
            this.$message({
              type: "error",
              message: res.message,
            });
            return;
          }
          this.appendDeiveGroupDialogVisible = false;
          this.addDeiveGroupFrom.groupId = "";
          this.$message.success("添加成功");
          this.getGatewayCameraList();
        });
    },

    /**
     * 添加摄像机组
     */
    addDeiveGroup() {
      if (!this.addDeiveGroupFrom.groupName) {
        return this.$message.warning("请输入摄像机组名称");
      }

      this.$api
        .addDeviceList({
          groupName: this.addDeiveGroupFrom.groupName,
          status: "1",
        })
        .then((res) => {
          if (res.code !== 200) {
            this.$message({
              type: "error",
              message: res.message,
            });
            return;
          }
          this.addDeiveGroupDialogVisible = false;
          this.addDeiveGroupFrom.groupName = "";
          this.getDeviceList();
        });
    },

    /**
     * 摄像机单个删除
     * @param obj
     */
    handleDelete(obj) {
      this.$confirm("确定删除摄像机?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        dangerouslyUseHTMLString: true,
        closeOnClickModal: false,
        customClass: "gd-confirm",
      }).then(() => {
        this.$api
          .deleteBatchCamera({
            cameraIds: [obj.cameraNum],
          })
          .then((res) => {
            // this.query();
            this.getGatewayCameraList();
          });
      });
    },

    /**
     * 视频播放
     * @param obj
     */
    handlePlay(obj) {
      this.playerCamera = obj;
      this.cameraId = obj.cameraId;
      this.playerDialogVisible = true;
      this.$nextTick(() => {
        this.$refs.cameraVideo.getVideoUrlToPlay(obj);
      });
    },
    /**
     * 查看摄像机详情
     * @param obj
     */
    handleWatch(obj) {
      let params = {
        id: obj.cameraNum,
      };
      this.$api.getCameraDetails(params).then((res) => {
        if (res.code == 200) {
          this.cameraDetailedInfo = res.data;
        }
        // this.$refs.cameraDetail.cloudList();
      });
      // this.cameraDetailedInfo = obj;
      this.cameraDialogVisible = true;
    },
    clearCameraList() {
      this.$refs.cameraDetail.resetCurrent();
    },
    // gatelonAndlat(obj) {
    //   this.lonAndlatOperation.visible = true;
    //   let latObj = {
    //     lon: obj.longAndLati.split('/')[0],
    //     lat: obj.longAndLati.split('/')[1],
    //   };

    //   this.getPositionLat(latObj).then((res) => {
    //     if (res.code == 200) {
    //       let data = res.data;
    //       obj.longitude = data.wgLon;
    //       obj.latitude = data.wgLat;
    //       let list = [obj];
    //       this.$nextTick(() => {
    //         this.$refs.lonAndlatMap.cameraViewPoint(list, obj.cameraName);
    //       });
    //     }
    //   });
    // },
    // 经纬度点击事件
    gatelonAndlat(obj) {
      this.lonAndlatOperation.visible = true;
      this.lonAndlatOperation.cameraName = obj.cameraName;
      this.lonAndlatOperation.cameraNum = obj.cameraNum;
      let latObj = [
        {
          lon: obj.longAndLati.split("/")[0],
          lat: obj.longAndLati.split("/")[1],
          cameraName: obj.cameraName,
          cameraNum: obj.cameraNum,
        },
      ];
      this.$api.getPositionLatNew(latObj).then((res) => {
        if (res.code == 200) {
          let data = res.data;
          let list = _.map(data, (it) => {
            return {
              longitude: it.wgLon,
              latitude: it.wgLat,
              cameraNum: it.cameraNum,
              cameraName: it.cameraName,
            };
          });
          this.$nextTick(() => {
            this.$refs.lonAndlatMap.cameraViewPoint(list, obj.cameraName);
          });
        }
      });
    },
    /**
     * 上云网关点击事件
     * @param obj
     */
    gatewayShow(obj) {
      this.gatewayQuery.transcodingId = obj.transcodingId;
      this.getGatewayCameraList();
      if (this.$parent.showPlatFormDetail) {
        this.getPlatformInfo(obj.transcodingId);
      } else {
        this.getGatewayInfo(obj.transcodingId);
      }
    },
    /**
     * 获取平台详情
     */
    getPlatformInfo(info) {
      let params = {
        id: info,
      };
      let vm = this;
      this.$api.getPlatFormDetails(params).then((res) => {
        if (res.code == 200) {
          vm.gatewayInfo = res.data;
          let region = _.find(vm.province, {
            regionCode: vm.gatewayInfo.regionName,
          });
          vm.gatewayInfo.regionName = region
            ? region.regionName
            : vm.gatewayInfo.regionName;
          vm.gatewayInfo.createDate = vm.timeFormat(vm.gatewayInfo.gmtCreate);
        }
      });
      return true;
      // .catch(error => {
      //   this.$message.error(error.message);
      // });
    },
    /**
     * 获取上云网关详情
     * @param id
     */
    getGatewayInfo(id) {
      let params = {
        id: id,
      };
      let vm = this;
      this.$api.getGatewayInfo(params).then((res) => {
        if (res.code != 200) {
          return Promise.reject();
        }

        this.gatewayInfo = res.data;
        //做时间格式化处理
        this.gatewayInfo.createDate = this.timeFormat(
          this.gatewayInfo.gmtCreate
        );
        vm.gatewayInfo.regionName = _.find(vm.province, {
          regionCode: vm.gatewayInfo.regionCode,
        }).regionName;
        console.log(
          "this.gatewayInfo.createDate" + this.gatewayInfo.createDate
        );
      });
      // .catch(() => {
      //   this.$message.error("获取上云网关详情失败");
      // });
    },

    /**
     * 获取上云网关下的摄像机列表
     */
    getGatewayCameraList() {
      var obj = {
        currPage: this.currentPage,
        pageSize: this.pageSize,
        ...this.gatewayQuery,
      };
      this.$api.getGatewayCameraList(obj).then((res) => {
        if (res.code != 200) {
          return Promise.reject();
        }
        this.tableList = res.data;
        console.log(this.tableList, "网关列表");
        this.total = res.total;
        this.pages = res.pages;
      });
    },
    // 搜索
    cloudQuery() {
      this.currentPage = 1
      this.getGatewayCameraList();
    },
    // 重置
    resetCloud() {
      (this.gatewayQuery = {
        kmPileMax: "",
        kmPileMin: "",
        transcodingId: this.gatewayQuery.transcodingId,
        classifyCode: "",
        cameraType: "",
        // cameraStatus: "", //摄像机状态
        cameraNum: "",
        cameraName: "",
        onlineStatus: "",
        hdStatus: null,
      }),
       this.currentPage = 1
        this.getGatewayCameraList();
    },
    /**
     * 后退
     */
    goback() {
      this.$emit("on-back");
    },
    timeFormat(time) {
      var d = new Date(time.substr(0, 19)); //加入substr(0, 19)处理兼容ios报错NAN
      var year = d.getFullYear(); //年
      var month = d.getMonth() + 1; //月
      var day = d.getDate(); //日

      var hh = d.getHours(); //时
      var mm = d.getMinutes(); //分
      var ss = d.getSeconds(); //秒

      var clock = year + "-";

      if (month < 10) clock += "0";

      clock += month + "-";

      if (day < 10) clock += "0";

      clock += day + " ";

      if (hh < 10) clock += "0";

      clock += hh + ":";
      if (mm < 10) clock += "0";
      clock += mm + ":";

      if (ss < 10) clock += "0";
      clock += ss;
      return clock;
    },
    cameraPlayDialogClose() {
      this.playerDialogDetailVisible = false;
      let box = this.$refs.videos;
      box.textContent = "";
    },
  },
  mounted() {
    this.gatewayShow(this.selectedTran);
    this.queryOrgList();
    this.loadArea();
    this.loadDirection();
    this.loadClassify();
    this.queryRoadList("");
  },
};
</script>
<style lang="less" scoped>
.transcoding-detail {
  background: #fff;
  .table-control {
    display: block;
  }
  .cloud-gateway-wrapper {
    padding: 0px;

    .cloud-gateway-header {
      width: 100%;
      height: 60px;
      text-align: left;
      border-bottom: 1px solid #d4d4d4;

      > .title {
        // display: inline-block;
        width: 100%;
        text-align: left;
        line-height: 60px;
        padding-left: 30px;
        padding-right: 30px;
        color: #000000;

        .el-button {
          vertical-align: middle;
          margin-left: 20px;
        }
      }

      > .set-time {
        display: inline-block;
        width: 30%;
        color: #a9a9a9;
        line-height: 60px;
        text-align: right;
        padding-right: 30px;
      }
    }

    .cloud-gateway-title {
      text-align: left;
      margin-bottom: 25px;
    }

    .cloud-gateway-title:before {
      content: " ";
      display: inline-block;
      width: 3px;
      height: 12px;
      background: rgba(18, 116, 238, 1);
      border-radius: 2px;
      margin-right: 7px;
    }

    .cloud-gateway-basic-info {
      padding: 20px 30px 40px;
      box-sizing: border-box;
      border-bottom: 1px dashed rgba(212, 212, 212, 1);

      .cloud-gateway-list {
        height: 28px;
        text-align: left;
        padding-left: 10px;

        .row-content {
          margin-bottom: 15px;
          font-size: 12px;

          .title {
            color: #a9a9a9;
            display: inline-block;
          }

          .centent {
            color: #000000;
            display: inline-block;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            width: calc(100% - 70px);
            vertical-align: bottom;
          }
        }
      }
    }

    .cloud-gateway-camera-info {
      box-sizing: border-box;
      text-align: left;

      .cloud-gateway-row {
        margin-bottom: 25px;
        padding-left: 10px;

        .text {
          color: #000000;
          display: inline-block;
        }

        .el-input__inner {
          height: 30px !important;
          border-radius: 2px;
          font-size: 12px;
        }

        .el-input__icon {
          line-height: 30px;
        }

        .insert-num {
          font-size: 18px;
          color: #1274ee;
        }

        > .el-dropdown {
          float: right;
          margin-top: -7px;
        }
      }

      > .cloud-gateway-row:last-child {
        margin-bottom: 0px;
      }
    }
  }

  /*表格样式*/
  .el-table {
    .el-table__fixed-body-wrapper {
      .handle-icon {
        display: inline-block;
        width: 35px;
        height: 35px;
        background-repeat: no-repeat;
        background-position: center;
        cursor: pointer;
      }

      .handle-delete {
        background-image: url("../../assets/images/camera_manage/delIcon.png");
      }

      .handle-delete:hover {
        background-image: url("../../assets/images/camera_manage/delIcon_hover.png");
      }

      .handle-play {
        background-image: url("../../assets/images/camera_manage/playIcon.png");
      }

      .handle-play:hover {
        background-image: url("../../assets/images/camera_manage/playIcon_hover.png");
      }

      .handle-watch {
        background-image: url("../../assets/images/camera_manage/watchIcon.png");
      }

      .handle-watch:hover {
        background-image: url("../../assets/images/camera_manage/watchIcon_hover.png");
      }
    }
  }
  .search-wrapper {
    width: 74%;
    height: auto;
    display: inline-block;
    padding: 0px;
  }
}
.t-detail-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.device-group-dialog .icon-img {
  display: inline-block;
  width: 35px;
  height: 35px;
  vertical-align: middle;
  cursor: pointer;
  background-image: url("../../assets/images/camera_manage/addIcon.png");
  background-repeat: no-repeat;
  background-position: center;
  margin-top: -4px;
  margin-left: 15px;
}
.table-control .el-col {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.btnInfo {
  vertical-align: top;
  width: 24%;
  .el-button-group {
    display: flex;
  }
}
</style>
