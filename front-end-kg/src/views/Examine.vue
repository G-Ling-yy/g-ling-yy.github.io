<template>
  <div class="content-wrapper camera-manage-wrapper" ref="viewbox" style="padding:2%">
    <div class="camera-manage-con" style="{height: calc(100% - 14px - 20px)}">
      <div class="cameraheader" v-if="!isCloudGateway">
        <!-- <el-button type="primary" plain class="query" @click="exportCameraList()">数据导出</el-button> -->
        <!-- <el-dropdown split-button type="primary">
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
            <el-dropdown-item v-show="IsSuppPlatform">
            <div @click="reportCamera('1')">
              <i class="el-icon-upload2"></i>
              <span>上报</span>
            </div>
            </el-dropdown-item>
            <el-dropdown-item>
              <div @click="reportCamera('0')">
                <i class="el-icon-close"></i>
                <span>取消上报</span>
              </div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown> -->
      </div>
      <!--搜索框-->
      <div v-if="!isCloudGateway">
        <div class="camera-manage-search">
          <div :class="isAllHeight % 2 != 0 ? 'common-search-all-h' : 'search-wrapper'">
            <el-form :inline="true">
              <el-form-item label="省份:" prop="regionCode" v-if="uinfo.regionCode == 100000 ? true : false">
                <el-select
                  v-model="filters.provinceCode"
                  filterable
                  placeholder="全国"
                  style="width:90px"
                  @change="regionChange"
                  clearable
                >
                  <el-option
                    v-for="item in areaList"
                    :key="item.regionCode"
                    :label="item.alias"
                    :value="item.regionCode"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="管辖单位:">
                <el-cascader
                  v-model="jurisdictionValue"
                  filterable
                  :class="jurisdictionList.length ? 'input-selected' : ''"
                  clearable
                  :show-all-levels="false"
                  :options="orgTreeList"
                  :props="orgCodeProps"
                  style="width: 100px"
                  @change="orgChange"
                  @clear="orgChange"
                ></el-cascader>
              </el-form-item>
              <el-form-item label="所属路线:">
                <el-select
                  v-model="filters.roadCode"
                  filterable
                  :class="filters.roadCode ? 'input-selected' : ''"
                  placeholder="路线"
                  clearable
                  style="width:100px"
                  @change="roadChange"
                >
                  <el-option label="请选择" value></el-option>
                  <el-option
                    v-for="(item,index) in roadList"
                    :key="index"
                    :label="item.roadCode + ` ` + item.roadName"
                    :value="item.roadCode"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="所属上云网关:">
                <el-input
                  v-model="filters.upCloud"
                  style="width:170px"
                  placeholder="请输入所属上云网关"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item label="摄像机状态:">
                <el-select
                  v-model="filters.onlineStatus"
                  filterable
                  placeholder="请选择"
                  style="width:100px"
                  @change="changeCamera"
                  clearable
                >
                  <el-option
                    v-for="item in onlineStatusList"
                    :key="item.state"
                    :label="item.onlineStatus"
                    :value="item.state"
                  ></el-option>
                </el-select>
              </el-form-item>
              
              <el-form-item label="是否上报:">
                <el-select
                  v-model="filters.isReport"
                  filterable
                  placeholder="请选择"
                  style="width:120px"
                  clearable
                  >
                  <el-option :value="1" label="已上报"></el-option>
                  <el-option :value="0" label="未上报"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="摄像机类型:">
                <el-select
                  v-model="filters.cameraType"
                  filterable
                  placeholder="请选择"
                  style="width:120px"
                  @change="changCameraType"
                  clearable
                >
                  <el-option
                    v-for="item in cameraTypeList"
                    :key="item.code"
                    :label="item.codeName"
                    :value="item.codeValue"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="方向:">
                <el-select
                  v-model="filters.direction"
                  filterable
                  placeholder="请选择"
                  style="width:120px"
                  @change="changeDirection"
                  clearable
                >
                  <el-option
                    v-for="item in directionList"
                    :key="item.codeValue"
                    :label="item.codeName"
                    :value="item.codeValue"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="所属类别:">
                <el-select
                  v-model="filters.classify"
                  filterable
                  placeholder="请选择"
                  style="width:120px"
                  clearable
                >
                  <el-option
                    v-for="item in classifyList"
                    :key="item.codeValue"
                    :label="item.codeName"
                    :value="item.codeValue"
                  ></el-option>
                </el-select>
              </el-form-item>
              
              <el-form-item label="桩号范围:">
                <div style="display: flex">
                  <el-input
                    v-model="filters.startMileage"
                    placeholder="起始公里数"
                    style="width: 120px;margin-right: 10px;padding-right:0px;"
                    clearable
                  ></el-input>
                  <span style="margin-right: 10px">~</span>
                  <el-input
                    v-model="filters.endMileage"
                    placeholder="终点公里数"
                    style="width: 120px;padding-right:0px;"
                    clearable
                  ></el-input>
                </div>
              </el-form-item>
              
              
            <el-form-item label="是否可控:">
              <el-select
                v-model="filters.ptzControlStatus"
                filterable
                placeholder="请选择"
                style="width:120px"
                clearable
                >
                <el-option :value="1" label="可控"></el-option>
                <el-option :value="0" label="不可控"></el-option>
              </el-select>
              </el-form-item>
            <!-- <el-form-item label="是否开放云台控制:">
              <el-select
                v-model="filters.ptzStatus"
                filterable
                placeholder="请选择"
                style="width:120px"
                clearable
                >
                <el-option :value="1" label="是"></el-option>
                <el-option :value="0" label="否"></el-option>
              </el-select>
              </el-form-item> -->
                 <!-- <el-form-item label="是否智能设备:">
              <el-select
                v-model="filters.isReport3"
                filterable
                placeholder="请选择"
                style="width:120px"
                clearable
                >
                <el-option :value="1" label="是"></el-option>
                <el-option :value="0" label="否"></el-option>
              </el-select>
              </el-form-item> -->

              <!-- <el-form-item label="对接方式:">
              <el-select
                v-model="cameraType"
                filterable
                placeholder="请选择"
                style="width:120px"
                @change="changeDirection"
                clearable
              >
                <el-option
                  v-for="item in cameraTypeList"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                ></el-option>
              </el-select>
              </el-form-item>-->
              <el-form-item label="摄像机名称：">
                <el-input style="width:150px" v-model="filters.cameraName" placeholder="请输入摄像机名称"></el-input>
              </el-form-item>
              <el-form-item label="摄像机编号：">
                <el-input style="width:150px" v-model="filters.cameraNum" placeholder="请输入摄像机编号"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div class="search-btn-right">
            <div class="btn-padding">
              <el-button type="primary" class="query" @click="queryList">查询</el-button>
              <el-button type="primary" class="reset" @click="resetSerach">重置</el-button>
              <!-- <el-button
                class="query"
                v-if="showCancel"
                @click="reportCamera('0')"
                type="primary"
              >取消上报</el-button> -->
            </div>
          </div>
        </div>
        <div class="search-opt">
          <div
            @click="seachMore"
            v-if="isAllHeight % 2 == 0"
            class="have-more-info camera-more-info"
          >
            <div style="margin-top:-18px;">
              展开条件
              <img src="../assets/images/icon/down.png" />
            </div>
          </div>
          <div
            @click="seachMore"
            v-if="isAllHeight % 2 != 0"
            class="have-more-info camera-more-info"
          >
            <div style="margin-top:-18px;">
              收起条件
              <img src="../assets/images/icon/up.png" />
            </div>
          </div>
        </div>
      </div>
      <!--表格区域-->
      <!-- 网关公用表头 -->
      <div class="table-control cloud-gateway-wrapper" v-if="isCloudGateway">
        <div class="cloud-gateway-header">
          <div class="title">
            <el-button
              type="primary"
              plain
              class="query"
              style="padding: 3px 0;width: 20PX;height: 20px;font-size: .6rem;margin: -2px 0 0 0px;"
              @click="goback()"
            >
              <i class="el-icon-top-left"></i>
            </el-button>
            <span style="padding-left:20px;">{{ gatewayInfo.transcodingName }}</span>
          </div>
          <div class="set-time">{{ gatewayInfo.createDate }}</div>
        </div>

        <div class="cloud-gateway-basic-info">
          <div class="cloud-gateway-title">基础信息</div>
          <div class="cloud-gateway-list">
            <el-col :span="4" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
              <div class="grid-content">
                <div class="row-content">
                  <div class="title">省份：</div>
                  <div class="centent">{{ gatewayInfo.regionName }}</div>
                </div>
                <div class="row-content">
                  <div class="title">最大接入数：</div>
                  <div class="centent">{{ gatewayInfo.channelNum }}</div>
                </div>
              </div>
            </el-col>
            <el-col :span="4" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
              <div class="grid-content">
                <div class="row-content">
                  <div class="title">管辖单位：</div>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="gatewayInfo.organizationName"
                    placement="top-start"
                  >
                    <div class="centent">{{ gatewayInfo.organizationName }}</div>
                  </el-tooltip>
                </div>
                <div class="row-content">
                  <div class="title">已接入数：</div>
                  <div class="centent">{{ gatewayInfo.alreadyChannelNum }}</div>
                </div>
              </div>
            </el-col>

            <el-col :span="4" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
              <div class="grid-content">
                <div class="row-content">
                  <div class="title">设备厂商：</div>
                  <div class="centent">{{ gatewayInfo.vendor }}</div>
                </div>
                <div class="row-content">
                  <div class="title">联系电话：</div>
                  <div class="centent">{{ gatewayInfo.contactPhone }}</div>
                </div>
              </div>
            </el-col>
            <el-col :span="4" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
              <div class="grid-content">
                <div class="row-content">
                  <div class="title">所属流媒体：</div>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="gatewayInfo.smName"
                    placement="top-start"
                  >
                    <div class="centent">{{ gatewayInfo.smName }}</div>
                  </el-tooltip>
                </div>
                <div class="row-content">
                  <div class="title">联系人：</div>
                  <div class="centent">{{ gatewayInfo.contactPerson }}</div>
                </div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content">
                <div class="row-content">
                  <div class="title">路线：</div>
                  <div class="centent">{{ gatewayInfo.roadNames }}</div>
                </div>
              </div>
            </el-col>
          </div>
        </div>

        <div class="cloud-gateway-camera-info">
          <div class="cloud-gateway-title">归属摄像机信息</div>
          <div class="cloud-gateway-row" style="display: flex">
            <div style="width:85%">
               <el-form>
              <el-form-item label="桩号范围：">
                <el-input
                  v-model="gatewayQuery.kmPileMin"
                  placeholder="请输入起始公里数"
                  style="width: 120px;margin-right:10px"
                ></el-input>~
                <el-input
                  v-model="gatewayQuery.kmPileMax"
                  placeholder="请输入终点公里数"
                  style="width: 120px;margin-left: 10px"
                ></el-input>
              </el-form-item>
              <el-form-item label="所属类别：">
                <el-select
                  v-model="gatewayQuery.classifyCode"
                  placeholder="请选择所属类别"
                  style="width: 120px"
                >
                  <el-option
                    v-for="item in classifyList"
                    :key="item.code"
                    :label="item.codeName"
                    :value="item.codeValue + ''"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="摄像机状态：">
                <el-select
                  v-model="gatewayQuery.onlineStatus"
                  placeholder="请选择摄像机状态"
                  style="width: 120px"
                >
                  <el-option
                    v-for="item in onlineStatusList"
                    :key="item.state"
                    :label="item.onlineStatus"
                    :value="item.state"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="摄像机类型：">
                <el-select
                  v-model="gatewayQuery.cameraType"
                  placeholder="请选择相机类型"
                  style="width: 120px"
                >
                  <el-option
                    v-for="item in cameraTypeList"
                    :key="item.code"
                    :label="item.codeName"
                    :value="item.codeValue + ''"
                  ></el-option>
                </el-select>
              </el-form-item>
              </el-form>
            </div>
           <div style="width:14%">
              <el-button type="primary" plain class="query" @click="cloudQuery">搜索</el-button>
              <el-button
                type="info"
                plain
                class="query"
                style="background: #92969B !important;"
                @click="resetCloud"
              >重置</el-button>
           </div>
            
          </div>
          <div class="cloud-gateway-row detail-search">
            <div>
              <span class="text">摄像机接入数：</span>
              <span class="insert-num">{{ gatewayInfo.alreadyChannelNum }}</span>
            </div>

            <div>
              <el-button type="primary" plain class="query" @click="exportCameraList(true)">数据导出</el-button>
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
        </div>
      </div>
      <div v-if="tableVisible" class="table-content-body camera-table-h">
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
          <el-table-column type="selection" align="center" width="50" fixed="left"></el-table-column>
          <el-table-column label="序号" align="center" width="60">
            <template slot-scope="scope">{{ scope.$index + 1 }}</template>
          </el-table-column>
          <el-table-column
            v-if="cameraColData[0].istrue"
            :prop="cameraColData[0].key"
            :label="cameraColData[0].title"
          >
            <template slot-scope="scope">
                <el-input placeholder="请输入内容" v-show="scope.row.show" v-model="scope.row.regionName"></el-input>
                <span v-show="!scope.row.show">{{scope.row.regionName}}</span>
            </template>
          </el-table-column>

          <el-table-column
            v-if="cameraColData[1].istrue"
            :prop="cameraColData[1].key"
            :label="cameraColData[1].title"
            show-overflow-tooltip
            width="120"
          ></el-table-column>
          <el-table-column
            v-if="cameraColData[2].istrue"
            :label="cameraColData[2].title"
            min-width="300"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <div style="float: left;padding-right: 5px;line-height: 18px;">
                {{scope.row[cameraColData[2].key]}}
              </div>
              <img
                    v-if="scope.row.isReport === '1'"
                    src="../assets/images/icon/Reporting.png"
                    style="width: 15px;height: 16px;"
                  />
            </template>
          </el-table-column>
          <el-table-column
            v-if="cameraColData[3].istrue"
            :prop="cameraColData[3].key"
            :label="cameraColData[3].title"
            width="120"
          >
            <template slot-scope="scope">
              {{ scope.row.roadCode }}{{scope.row.roadName}}
            </template>
          </el-table-column>
          <el-table-column
            v-if="cameraColData[4].istrue"
            :prop="cameraColData[4].key"
            :label="cameraColData[4].title"
            width="100"
          ></el-table-column>
          <el-table-column
            v-if="cameraColData[5].istrue"
            :prop="cameraColData[5].key"
            :label="cameraColData[5].title"
            width="210"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <!-- style="text-decoration: underline; cursor:pointer" -->
              <div
                style="text-decoration: underline; cursor:pointer"
                @click="gatelonAndlat(scope.row)"
              >{{ scope.row.longAndLati }}</div>
            </template>
          </el-table-column>
          <el-table-column
            v-if="cameraColData[6].istrue"
            :prop="cameraColData[6].key"
            :label="cameraColData[6].title"
            width="100"
          >
            <template slot-scope="scope">
              <div @click="handCameraStatus(scope.row)">
                <span :style="getStyles(scope.row.onlineStatus)"></span>
                <span style="vertical-align: middle; cursor: pointer;">
                  {{
                  getStatuss(scope.row.onlineStatus)
                  }}
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            v-if="cameraColData[7].istrue && !isCloudGateway"
            :prop="cameraColData[7].key"
            :label="cameraColData[7].title"
            width="200"
          >
            <template slot="header" slot-scope="scope">
              <span>{{cameraColData[7].title}}</span>
              <el-dropdown>
                <span class="el-dropdown-link">
                  <!-- <i class="el-icon-arrow-down el-icon--right"></i> -->
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    <el-checkbox
                      @change="query()"
                      class="camera-filter-check"
                      v-model="filters.gateway"
                    >网关</el-checkbox>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-checkbox
                      @change="query()"
                      class="camera-filter-check"
                      v-model="filters.gateway1"
                    >平台</el-checkbox>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
            <template slot-scope="scope">
              <el-tag
                v-if="scope.row.reportSource !== '1'"
                effect="dark"
                size="mini"
                type="success"
              >平台</el-tag>
              <el-tag v-else effect="dark" size="mini">网关</el-tag>
              <div
                style="text-decoration: underline; cursor:pointer"
                @click="gatewayShow(scope.row)"
              >{{ scope.row.transcodingName }}</div>
            </template>
          </el-table-column>
          <el-table-column
            v-if="cameraColData[8].istrue"
            :prop="cameraColData[8].key"
            :label="cameraColData[8].title"
            align="center"
            width="100"
          >
            <template slot="header" slot-scope="scope">
              <span>{{cameraColData[8].title}}</span>
              <el-dropdown>
                <span class="el-dropdown-link">
                  <!-- <i class="el-icon-arrow-down el-icon--right"></i> -->
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    <el-checkbox
                      @change="query()"
                      class="camera-filter-check"
                      v-model="filters.stream"
                    >推流</el-checkbox>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-checkbox
                      @change="query()"
                      class="camera-filter-check"
                      v-model="filters.stream1"
                    >停流</el-checkbox>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
            <template slot-scope="scope">
              <el-tooltip
                class="item"
                effect="dark"
                placement="top"
                :content="scope.row.streamControlStatus === '1' ? '推流' : '开流'"
              >
                <div
                  style="cursor:pointer"
                  @click="toggleStream( scope.row.streamControlStatus === '1' ? '0' : '1',  scope.row.streamControlStatus === '1' ? '停流' : '推流', scope.row)"
                >
                <img
                    v-if="scope.row.streamControlStatus === '1'"
                    src="../assets/images/icon/success.png"
                    style="width: 20px;height: 20px"
                  />
                  <img
                    v-else
                    src="../assets/images/icon/stop.png"
                    style="width: 20px;height: 20px"
                  />
                  <!-- <i
                    v-if="scope.row.streamControlStatus === '1'"
                    class="el-icon-s-claim table-status-icon text-success"
                    style="font-size:1.5rem;"
                  ></i>
                  <i
                    v-else
                    class="el-icon-s-release table-status-icon text-error"
                    style="font-size:1.5rem;"
                  ></i> -->
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            v-if="cameraColData[9].istrue"
            :prop="cameraColData[9].key"
            :label="cameraColData[9].title"
            align="center"
            width="100"
          >
            <template slot="header" slot-scope="scope">
              <span>{{cameraColData[9].title}}</span>
              <el-dropdown>
                <span class="el-dropdown-link">
                  <!-- <i class="el-icon-arrow-down el-icon--right"></i> -->
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    <el-checkbox
                      @change="query()"
                      class="camera-filter-check"
                      v-model="filters.displayStatus"
                    >显示</el-checkbox>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-checkbox
                      @change="query()"
                      class="camera-filter-check"
                      v-model="filters.displayStatus1"
                    >隐藏</el-checkbox>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
            <template slot-scope="scope">
              <el-tooltip
                class="item"
                effect="dark"
                :content="scope.row.displayStatus === '1' ? '显示' : '隐藏'"
                placement="top"
              >
                <div
                style="cursor:pointer"
                  @click="toggleDisplayStatus(scope.row.displayStatus === '1' ? '0' : '1', scope.row.displayStatus === '1' ? '隐藏' : '显示', scope.row)"
                >
                  <img
                    v-if="scope.row.displayStatus === '1'"
                    src="../assets/images/icon/block.png"
                    style="width: 20px;height: 20px"
                  />
                  <img
                    v-else
                    src="../assets/images/icon/hide.png"
                    style="width: 20px;height: 20px"
                  />
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            v-if="cameraColData[10].istrue"
            :prop="cameraColData[10].key"
            :label="cameraColData[10].title"
            align="center"
            width="100"
          >
            <template slot="header" slot-scope="scope">
              <span>{{cameraColData[10].title}}</span>
              <el-dropdown>
                <span class="el-dropdown-link">
                  <!-- <i class="el-icon-arrow-down el-icon--right"></i> -->
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    <el-checkbox
                      @change="query()"
                      class="camera-filter-check"
                      v-model="filters.openStatus"
                    >开放</el-checkbox>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-checkbox
                      @change="query()"
                      class="camera-filter-check"
                      v-model="filters.openStatus1"
                    >关闭</el-checkbox>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
            <template slot-scope="scope">
              <el-tooltip
                class="item"
                effect="dark"
                :content="scope.row.openStatus === '1' ? '开放' : '关闭'"
                placement="top"
              >
                <div
                  style="cursor:pointer"
                  @click="toggleOpenStatus(scope.row.openStatus === '1' ? '0' : '1', scope.row.openStatus === '1' ? '关闭' : '开放', scope.row)"
                >
                <img
                    v-if="scope.row.openStatus === '1'"
                    src="../assets/images/icon/success.png"
                    style="width: 20px;height: 20px"
                  />
                  <img
                    v-else
                    src="../assets/images/icon/stop.png"
                    style="width: 20px;height: 20px"
                  />
                 
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            v-if="cameraColData[11].istrue"
            :prop="cameraColData[11].key"
            :label="cameraColData[11].title"
            align="center"
            width="100"
          >
            <template slot="header" slot-scope="scope">
              <span>{{cameraColData[11].title}}</span>
              <el-dropdown>
                <span class="el-dropdown-link">
                  <!-- <i class="el-icon-arrow-down el-icon--right"></i> -->
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    <el-checkbox
                      @change="query()"
                      class="camera-filter-check"
                      v-model="filters.isReport"
                    >已上报</el-checkbox>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-checkbox
                      @change="query()"
                      class="camera-filter-check"
                      v-model="filters.isReport1"
                    >未上报</el-checkbox>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
            <template slot-scope="scope">
              <el-tooltip
                class="item"
                effect="dark"
                :content="scope.row.isReport === '1' ? '已上报' : '未上报'"
                placement="top"
              >
                <div
                  style="cursor:pointer"
                  @click="reportCamera(scope.row.isReport === '1' ? '0' : '1', scope.row.isReport === '1' ? '已上报' : '未上报', scope.row)" 
                >
                  <!-- @click="reportCamera(scope.row.isReport === '1' ? '0' : '1', scope.row.isReport === '1' ? '关闭' : '开放', scope.row)" -->

                <img
                    v-if="scope.row.isReport === '1'"
                    src="../assets/images/icon/success.png"
                    style="width: 20px;height: 20px"
                  />
                  <img
                    v-else
                    src="../assets/images/icon/stop.png"
                    style="width: 20px;height: 20px"
                  />
                 
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
          <!-- 是否可控 -->
          <el-table-column
            v-if="cameraColData[12].istrue && !isCloudGateway"
            :prop="cameraColData[12].key"
            :label="cameraColData[12].title"
            align="center"
            width="100"
          >
            <template slot="header" slot-scope="scope">
              <span>{{cameraColData[12].title}}</span>
            </template>
            <template slot-scope="scope">
              <!-- <el-tooltip
                class="item"
                effect="dark"
                :content="scope.row.openStatus === '1' ? '可控' : '不可控'"
                placement="top"
              > -->
                <div
                >
                   <img
                    v-if="scope.row.ptzControlStatus === 1"
                    src="../assets/images/icon/success.png"
                    style="width: 20px;height: 20px"
                  />
                  <img 
                    v-else
                    src="../assets/images/icon/stop.png"
                    style="width: 20px;height: 20px"
                  />
                  &nbsp;
                  <!-- 上级可控 -->
                   <i  style="cursor:pointer"
                    v-if="scope.row.ptzControlStatus === 1 && scope.row.ptzStatus === 1"
                    class="icon-control"
                    @click="togglePtzStatus(scope.row)"
                  ></i>
                  <i  style="cursor:pointer"
                    v-if="scope.row.ptzControlStatus === 1 && scope.row.ptzStatus === 0"
                    class="icon-not-control"
                    @click="togglePtzStatus(scope.row)"
                  ></i>
                </div>
              <!-- </el-tooltip> -->
            </template>
          </el-table-column>
          
          <el-table-column
            v-if="cameraColData[13].istrue"
            :prop="cameraColData[13].key"
            :label="cameraColData[13].title"
            width="80"
          ></el-table-column>
          <el-table-column
            v-if="cameraColData[14].istrue"
            :prop="cameraColData[14].key"
            :label="cameraColData[14].title"
            width="80"
          ></el-table-column>
          <el-table-column
            v-if="cameraColData[15].istrue"
            :prop="cameraColData[15].key"
            :label="cameraColData[15].title"
            width="100"
          ></el-table-column>
          <el-table-column
            v-if="cameraColData[16].istrue"
            :prop="cameraColData[16].key"
            :label="cameraColData[16].title"
            min-width="200"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="150"
            max-height="100%"
            style="overflow:hidden"
            :render-header="renderHeader"
          >
            <template slot-scope="scope">
              <!-- <span
                class="handle-icon handle-play"
                @click="handlePlay(scope.row)"
              ></span>
              <span
                class="handle-icon handle-watch"
                @click="handleWatch(scope.row)"
              ></span>-->
              <!-- <el-tooltip effect="dark" content="删除" placement="top">
              <i class="el-icon-delete" @click="handleDelete(scope.row)"></i>
              </el-tooltip>-->
              <el-tooltip effect="dark" content="播放视频" placement="top">
                <img
                  src="../assets/images/icon/play.png"
                  @click="handlePlay(scope.row)"
                  style="width:35px;height:35px;cursor:pointer"
                  alt
                />
              </el-tooltip>
              <el-button @click="scope.row.show =true">编辑</el-button>
              <el-button @click="scope.row.show =false">保存</el-button>
              <!-- <el-tooltip effect="dark" content="查看详情" placement="top">
                <img
                  src="../assets/images/icon/info.png"
                  @click="handleWatch(scope.row)"
                  style="width:35px;height:35px;cursor:pointer"
                  alt
                />
              </el-tooltip> -->
              <el-tooltip effect="dark" content="取消上报" placement="top" v-if="scope.row.isReport === '1'">
                <el-button
                  style="padding: 0px 4px;height: 24px;margin-top: 5px;"
                  class="query"
                  type="primary"
                  @click="reportCamera(0, scope.row)"
                  icon="el-icon-close"
                  size="mini"
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--分页控件-->
      <div class="table-pagination">
        <p class="total-pagination">共{{total}}条</p>
        <el-pagination
          background
          layout=" prev, pager, next, sizes, jumper "
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
          :current-page="filters.currPage"
          :total="total"
        ></el-pagination>
      </div>
    </div>
    
    <!--添加到摄像机组弹窗-->
    <div class="addGroupDialog">
      <el-dialog
        title="添加到摄像机组"
        :visible.sync="appendDeiveGroupDialogVisible"
        width="400px"
        custom-class="gd-dialog device-group-dialog"
        v-dialogDrag
        :append-to-body="true"
        :close-on-click-modal="false"
      >
        <el-form :model="addDeiveGroupFrom">
          <el-form-item label>
            <div style="color: #000000">
              已选择视频数：
              <span style="font-size: 18px;color: #1274EE">
                {{
                this.multipleSelection.length
                }}
              </span>
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
          <el-button @click="appendDeiveGroupDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="appendDeiveGroup()">确 定</el-button>
        </div>
      </el-dialog>
    </div>

  
        <!--云台优先级设置弹窗弹窗-->
    <el-dialog
      title="云台控制优先级设置"
      :visible.sync="setPriorityDialogVisible"
       custom-class="priority-dialog"
      width="460px"
      v-dialogDrag
      :append-to-body="true"
      :destroy-on-close="true"
    >
    <cloudPriority
        v-if="setPriorityDialogVisible"
        ref="cloudPriority"
      ></cloudPriority>
    <span slot="footer" class="dialog-footer">
      <el-button @click="setPriorityDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="setBtn">确 定</el-button>
    </span>
    </el-dialog>

    <!--新增摄像机组弹窗-->
    <el-dialog
      title="新增摄像机组"
      :visible.sync="addDeiveGroupDialogVisible"
      custom-class="gd-dialog device-group-dialog"
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
          <el-input v-model="addDeiveGroupFrom.groupName" placeholder="请输入内容"></el-input>
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

    <!-- 摄像机上报或取消上报结果提示窗 -->
    <el-dialog
      title="提示"
      :visible.sync="cameraResultDialogVisible"
      width="360px"
      custom-class="camera-transfer-dialog"
      v-dialogDrag
      :append-to-body="true"
      :destroy-on-close="true"
    >
    <div class="camera-result-dialog">
      <i class="el-icon-warning"></i>
      <span>成功{{succeedList.length}}路，失败{{errorList.length}}路</span>
      <p @click="cameraReportDetailsDialogVisible = true, cameraResultDialogVisible = false">查看详情</p>
    </div>
     <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="cameraResultDialogVisible = false">确 定</el-button>
    </span>
     </el-dialog>

     <!--摄像机上报或取消上报详情数据-->
    <el-dialog
      :visible.sync="cameraReportDetailsDialogVisible"
      width="720px"
      custom-class="camera-transfer-dialog"
      v-dialogDrag
      :append-to-body="true"
      :destroy-on-close="true"
      :before-close='cameraReportDetailsClose'
    >
    <template slot="title">
        <div class="camera-report-title">
         <span class="dialog-status">共{{reportTotal}}条数据</span>
          <div class="camera-report-radio">
              <el-radio-group v-model="radio" @change="radioChange" >
                  <el-radio :label="1">全选</el-radio>
                  <el-radio :label="2">成功</el-radio>
                  <el-radio :label="3">失败</el-radio>
              </el-radio-group>
          </div>
          <i class="el-icon-document-checked"></i>
        </div>
      </template>
      <camera-report-details
        v-if="cameraReportDetailsDialogVisible"
        @reportTotal="(val)=>{this.reportTotal = val}"
        ref="cameraTransfer"
        :cameraTransferInfo="cameraTransferInfo"
        :cameraReportDetailsList="cameraReportDetailsList"
        :succeedList="succeedList"
        :errorList="errorList"
      ></camera-report-details>
    </el-dialog>

    <!--摄像机状态弹窗-->
    <el-dialog
      :visible.sync="cameraStatusDialogVisible"
      width="720px"
      custom-class="camera-transfer-dialog"
      v-dialogDrag
      :append-to-body="true"
      :destroy-on-close="true"
    >
    <template slot="title">
        <div>
         <span class="dialog-status">视频流状态</span>
         <span class="dialog-transfer">当前视频传输状态</span>
         <span :style="getStyles(cameraTransferInfo.cameraStatus)"></span>
         <span class="dialog-regular">
            {{
              getStatuss(cameraTransferInfo.cameraStatus)
            }}
           </span>
        </div>
      </template>
      <camera-transfer
        v-if="cameraStatusDialogVisible"
        ref="cameraTransfer"
        :cameraTransferInfo="cameraTransferInfo"
      ></camera-transfer>
    </el-dialog>
    
    <!--摄像机播放弹窗-->
    <camera-play-dialog
      v-if="playerDialogVisible"
      :visible.sync="playerDialogVisible"
      :cameraInfo="playerCamera"
      :cameraId="cameraId"
      ref="cameraVideo"
    ></camera-play-dialog>
    <el-dialog
      title="播放视频"
      :visible="playerDialogDetailVisible"
      width="885px"
      @close="cameraPlayDialogClose"
      custom-class="gd-dialog camera-player-dialog gd-custom-dialog"
      v-dialogDrag="{ fullScreen: false }"
      :append-to-body="true"
      :close-on-click-modal="false"
    >
      <div ref="videos"></div>
    </el-dialog>
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
    <!-- 经纬度弹窗 -->
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
        <TrafficAmap ref="lonAndlatMap" :cameraNumber="lonAndlatOperation.cameraNum"></TrafficAmap>
      </div>
    </el-dialog>
    <el-dialog
      title="自定义列"
      :visible.sync="customColVisible"
      width="40%"
      v-dialogDrag
      :append-to-body="true"
      :close-on-click-modal="false"
    >
      <div style="height: 100%">
        <el-checkbox-group
          v-model="showCols" 
          class="gd-dialog-check"
          @change="handleCheckedCitiesChange">
          <el-checkbox v-for="col in cameraColData" :label="col.key" :key="col.key" :checked="col.istrue">{{col.title}}</el-checkbox>
        </el-checkbox-group>
        <div slot="footer" class="dialog-footer">
          <el-button @click="customColVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmCustomCols()">确 定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import TrafficAmap from "../components/cameraMap.vue";
//import {Loading} from "element-ui";
import { mapState, mapActions } from "vuex";
// import flvPlayer from "../camera/FlvPlayer";
// import threePlayer from "../camera/ThreeVideo";
import CameraPlayDialog from "../components/module/CameraManage/CameraPlayDialog";
// import cameraDetail from "../equipment/cameraDetail";
import cloudPriority from "../components/module/CameraManage/cloudPriority";
import cameraTransfer from "../components/module/CameraManage/cameraTransfer";
import cameraReportDetails from "../components/module/CameraManage/cameraReportDetails";
import qs from "qs";
export default {
  components: {
    CameraPlayDialog,
    cloudPriority,
    // cameraDetail,
    TrafficAmap,
    cameraTransfer,  // 视频流状态
    cameraReportDetails // 摄像机上报或取消上报详情
  },

  data() {
    return {
      uinfo:{
        regionCode: JSON.parse(localStorage.getItem("cloudplatform")).regionCode,
      },
      showCols: [],
      // 自定义列
      cameraColData: [
        { title: "地区", istrue: true, key: "regionName" },
        { title: "管辖单位", istrue: true, key: "organizationName" },
        { title: "摄像机名称", istrue: true, key: "cameraName" },
        { title: "所属路线", istrue: true, key: "roadCode" },
        { title: "桩号", istrue: true, key: "kmPile" },
        { title: "经纬度", istrue: true, key: "longAndLati" },
        { title: "摄像机状态", istrue: true, key: "onlineStatus" },
        { title: "接入方", istrue: true, key: "transcodingName" },
        { title: "推流状态", istrue: true, key: "streamControlStatus" },
        { title: "显示状态", istrue: true, key: "displayStatus" },
        { title: "开放状态", istrue: true, key: "openStatus" },
        { title: "上报状态", istrue: true, key: "isReport" },
        { title: "是否可控", istrue: true, key: "ptzControlStatus" },
        // { title: "是否智能设备", istrue: true, key: "openStatus" },
        { title: "所属类别", istrue: true, key: "classifyCode" },
        { title: "方向", istrue: true, key: "derectionCode" },
        { title: "摄像机类型", istrue: true, key: "cameraType" },
        { title: "摄像机编号", istrue: true, key: "cameraNum" }
      ],
      customColVisible: false,
      colOptions: [],
      colSelect: [],
      cameraId: "",
      lonAndlatOperation: {
        visible: false,
        cameraName: "",
        cameraNum: ""
      },
      isAllHeight: 0,
      video: {
        pageSize: 10,
        current: 1,
        total: 0
      },
      isThreePlayer: false,
      tableData: [],
      areaList: [],
      areaValue: "",
      jurisdictionValue: "", //管辖
      jurisdictionList: [],
      cameraType: "",
      orgCodeProps: {
        //lazy: true,
        expandTrigger: "hover",
        value: "organizationId",
        label: "organizationName",
        children: "childList",
        checkStrictly: true
        //lazyLoad:this.propsLazyload
      },
      directionList: [], //摄像机方向
      startMileage: "",
      endMileage: "",
      filters: {
        cameraNum:"",
        cameraName:"",
        provinceCode: "",
        organizationId: "",
        roadCode: "",
        startMileage: this.startMileage,
        endMileage: this.endMileage,
        direction: "",
        classify: "",
        ptzControlStatus: '', // 是否可控
        upCloud: "",
        cameraState: "",
        cameraType: "",
        cameraNumber: "",
        pageSize: 10,
        currPage: 1,
        onlineStatus:"",
        isReport:""
      },
      orgTreeList: [],
      roadList: [],
      classifyList: [], //所属类别
      transCodeValue: "", //上云网关
      transCodeList: [], //上云网关
      onlineStatusList: [
        {
          state: "0",
          onlineStatus: "离线"
        },
        {
          state: "1",
          onlineStatus: "正常"
        },
        {
          state: "2",
          onlineStatus: "故障"
        }
      ],
      cameraStateValue: "",
      cameraTableLoading: false,
      tableList: [],
      // pageSize: 10,
      // currentPage: 1,
      total: 0,
      pages: 0,
      loadOption: {
        fullscreen: true,
        lock: true,
        text: "加载中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.3)"
      },
      selectHandle: [],
      checkAll: false,
      stateList: [
        { name: "离线", color: "#878787" },
        { name: "正常", color: "#26B55F" },
        { name: "故障", color: "#F9552F" }
      ],
      multipleSelection: [],
      appendDeiveGroupDialogVisible: false,
      addDeiveGroupDialogVisible: false,
      addDeiveGroupFrom: {
        groupName: "",
        groupId: ""
      },
      deviceGroupList: [],
      playerDialogVisible: false,
      playerDialogDetailVisible: false,
      stepSize: 0,
      playerCamera: {},
      cameraDialogVisible: false,
      cameraResultDialogVisible: false,// 摄像机上报或取消上报结果
      succeedList:[], // 成功的摄像机
      errorList: [],  // 失败的摄像机
      cameraReportDetailsList: [], // 摄像机上报或取消上报详情数据
      cameraStatusDialogVisible: false, // 摄像机状态弹出框
      cameraReportDetailsDialogVisible: false, // 摄像机上报或取消上报详情弹窗
      radio: 1,//摄像机上报或取消上报
      reportTotal: 0,// 上报或取消摄像机数量
      cameraTransferInfo: {}, // 摄像机状态当前行数据
      setPriorityDialogVisible: false, // 云台优先级设置弹窗
      
      cameraDetailedInfo: {},
      datePicker: "",
      startTime: "",
      endTime: "",
      cloudVideoData: [
        {
          date: "2020-05-22 17:34",
          name: "lmy",
          address: "32s"
        }
      ],
      activeNames: ["1", "3"],
      isCloudGateway: false,
      gatewayQuery: {
        kmPileMax: "",
        kmPileMin: "",
        transcodingId: "",
        classifyCode: "",
        cameraType: "",
        direction: "",
        synOnlineStatus: "", //摄像机状态
        onlineStatus:""
      },
      dimensionList: [
        { name: "道路", code: "0" },
        { name: "服务区", code: "1" },
        { name: "收费站", code: "2" },
        { name: "隧道", code: "3" },
        { name: "ETC门架", code: "4" },
        { name: "加油站", code: "5" }
      ],
      onlineStatus: [
        { name: "离线", code: "0" },
        { name: "在线", code: "1" },
        { name: "故障", code: "2" }
      ],
      cameraTypeList: [
        { name: "监控型机枪", code: "1" },
        { name: "监控型球机", code: "2" },
        { name: "全景型", code: "3" },
        { name: "抓拍机", code: "4" }
      ],
      gatewayInfo: {},
      // 上云网关上回退当前页标记
      gatewayCurrentPage: 1,
      cloudVideoDetail: [], //云视频详情
      recordFilePath: "",
      downloadPath: "", //下载地址
      tableVisible: true,
      showCancel: false,
      IsSuppPlatform: JSON.parse(localStorage.getItem("IsSuppPlatform")) // 判断是否需要上报
    };
  },
  created() {
    console.log(this.$route.query,'view create')
    this.$api
      .querySuppPlatform()
      .then(res => {
        if (res.code === "404") {
          this.showCancel = false;
          return;
        }
        this.showCancel = true;
      })
      .catch(() => {});
  },
  watch: {
    colOptions(valArr) {
      var arr = this.colSelect.filter(i => valArr.indexOf(i) < 0); // 未选中
      this.cameraColData.filter(i => {
        if (arr.indexOf(i.title) != -1) {
          i.istrue = false;
          this.$nextTick(() => {
            this.$refs.tableDataRef.doLayout();
          });
        } else {
          i.istrue = true;
          this.$nextTick(() => {
            this.$refs.tableDataRef.doLayout();
          });
        }
      });
    }
  },
  computed: {
    ...mapState(["deviceStatistics"]),
    usePlayerType() {
      // return 'ali';
      return this.$root.playerType;
    }
  },
  methods: {
    ...mapActions(["getCameraPlayUrl", "getPositionLat"]),
    handleCheckedCitiesChange(value) {},
    getStyles(status) {
      let background = "";
      if (!status) {
        background = this.stateList[2].color;
      } else {
        if (status === "0") {
          background = this.stateList[0].color;
        } else if (status === "2") {
          background = this.stateList[2].color;
        } else {
          background = this.stateList[1].color;
        }
      }

      return {
        width: "5px",
        height: "5px",
        display: "inline-block",
        "vertical-align": "middle",
        "margin-right": "5px",
        background: background
      };
    },
    getStatuss(status) {
      let text = "";
      if (!status) {
        text = this.stateList[2].name;
      } else {
        if (status === "0") {
          text = this.stateList[0].name;
        } else if (status === "2") {
          text = this.stateList[2].name;
        } else {
          text = this.stateList[1].name;
        }
      }
      return text;
    },
    regionChange(val) {},
    // 推流删选
    filterStreamStatus(value, row) {
      return row.streamControlStatus == value;
    },
    filterplayStatus(value, row) {
      return row.displayStatus == value;
    },
    filterOpenStatus(value, row) {
      return row.openStatus === value;
    },
    filterVirtual(value, row) {
      return row.reportSource == value;
    },
    //自定义操作列标题内容
    renderHeader(h, { c, d }) {
      let vm = this;
      return (
        <div>
          <span>操作</span>
          <span
            onClick={() => {
              this.customColVisible = true;
            }}
            class="select-question"
          ></span>
        </div>
      );
    },
    confirmCustomCols() {
      _.each(this.cameraColData, it => {
        let col = _.find(this.showCols, v => {
          return v === it.key;
        });
        if (!col) {
          it.istrue = false;
        } else {
          it.istrue = true;
        }
      });
      this.tableVisible = false;
      this.$nextTick(() => {
        this.tableVisible = true;
      });
      this.customColVisible = false;
    },
    
    handleCurrentChange(current) {
      this.video.current = current;
      this.cloudList();
    },

    handleVideoSizeChange(size) {
      this.video.pageSize = size;
      this.cloudList();
    },
    // 查看更多
    seachMore() {
      this.isAllHeight++;
    },
    /**
     * 获取省份列表
     */
    loadArea() {
      this.$api
        .getProvince({
          regionLevel: 1
        })
        .then(res => {
          if (res.code != "200") {
            return Promise.reject;
          }

          this.areaList = res.data;
          this.areaList.unshift({
            regionCode: "",
            regionName: "全国",
            alias: "全国",
            parentRegionCode: "0"
          });
        })
        .catch(() => {});
    },

    /**
     * 单位列表change事件
     * @param val
     */
    orgChange(val) {
      this.filters.roadCode = "";
      // this.roadList = [];
      this.filters.organizationId = "";
      if (val.length) {
        let orgId = val[val.length - 1];
        this.filters.organizationId = orgId;
        // this.queryRoadList(orgId);
        // this.queryUpCloud();
      }
    },

    changeDirection(val) {
      this.filters.direction = val;
    },
    changCameraType(val) {
      this.filters.cameraType = val;
    },
    changeTransCode(val) {
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
          codeType: "DERECTION"
        })
        .then(data => {
          if (data.code == "200") {
            _this.directionList = data.data;
          }
        });
    },
    loadCameraType() {
      var _this = this;
      this.$api
        .getCodemaster({
          codeType: "CAMERA_TYPE"
        })
        .then(data => {
          if (data.code == "200") {
            _this.cameraTypeList = data.data;
          }
        });
    },
    // 云台优先级设置
    setPriority (){
      this.setPriorityDialogVisible = true
    },

    //获取所有类别
    loadClassify() {
      var _this = this;
      this.$api
        .getCodemaster({
          codeType: "CLASSIFY"
        })
        .then(data => {
          if (data.code == "200") {
            _this.classifyList = data.data;
          }
        });
    },

    queryRoadList(orgId) {
      let _this = this;
      this.$api
        .getRoadsByOrgId({ regionCode: orgId + "" })
        .then(data => {
          if (data.code !== 200) {
            return Promise.reject();
          }
          _this.roadList = data.data;
        })
        .catch(() => {});
    },

    queryUpCloud() {
      // let _this = this,
      //   params = {};
      // params = {
      //   currPage: 0,
      //   pageSize: 0,
      //   provinceCode: this.filters.provinceCode,
      //   organizationCode: this.filters.organizationId
      // };
      // this.$api.getTranscodingList(params).then(msg => {
      //   _this.transCodeList = msg.data;
      // });
    },

    queryOrgList(regionCode) {
      let _this = this,
        params = {};
      if (regionCode) params.regionCode = regionCode;
      this.$api
        .getOrgTree(params)
        .then(data => {
          if (data.code !== 200) {
            return Promise.reject();
          }
          let nlist = data.data[0].childList;
          _.each(nlist, it => {
            it.disabled = true;
          });
          _this.orgTreeList = nlist;
        })
        // .catch(error => {
        //   this.$message({
        //     message:
        //       "获取组织架构树失败! [" + error.code + "]: " + error.message,
        //     type: "error"
        //   });
        // });
    },

    queryList() {
      this.filters.currPage = 1;
      this.query();
    },
    /**
     * 查询表格数据
     */
    query() {
      let _this = this;
      let gateway = null;
      let stream = null;
      let openStatus = null;
      let displayStatus = null;
      //let load=Loading.service(this.loadOption);

      if (this.filters.gateway && this.filters.gateway1) {
        gateway = null;
      } else {
        if (this.filters.gateway) {
          gateway = "1";
        } else if (this.filters.gateway1) {
          gateway = "2";
        }
      }
      if (this.filters.stream && this.filters.stream1) {
        stream = null;
      } else {
        if (this.filters.stream) {
          stream = "1";
        } else if (this.filters.stream1) {
          stream = "0";
        }
      }
      if (this.filters.openStatus && this.filters.openStatus1) {
        openStatus = null;
      } else {
        if (this.filters.openStatus) {
          openStatus = "1";
        } else if (this.filters.openStatus1) {
          openStatus = "0";
        }
      }
      // if (this.filters.isReport && this.filters.isReport1) {
      //   isReport = null;
      // } else {
      //   if (this.filters.isReport) {
      //     isReport = "1";
      //   } else if (this.filters.isReport1) {
      //     isReport = "0";
      //   }
      // }
      if (this.filters.displayStatus && this.filters.displayStatus1) {
        displayStatus = null;
      } else {
        if (this.filters.displayStatus) {
          displayStatus = "1";
        } else if (this.filters.displayStatus1) {
          displayStatus = "0";
        }
      }
      let params = {
        currPage: this.filters.currPage,
        pageSize: this.filters.pageSize,
        displayStatus: displayStatus,
        streamStatus: stream,
        openStatus: openStatus,
        reportSource: gateway,
        // userId: "",
        // provinceCode: this.filters.provinceCode,//备用
        // organizationName: "",
        displayStatus: this.displayStatus,
        streamStatus: this.streamControlStatus,
        cameraName: this.filters.cameraName,
        kmPileMax: this.filters.endMileage, //
        kmPileMin: this.filters.startMileage, //
        // regionId: this.areaValue,
        regionId: this.filters.provinceCode, //
        organizationId: this.filters.organizationId, //
        roadCode: this.filters.roadCode, //
        derectionCode: this.filters.direction, //
        classifyCode: this.filters.classify, //
        ptzControlStatus: this.filters.ptzControlStatus, // 是否可控
        transcodingName: this.filters.upCloud,
        cameraType: this.filters.cameraType,
        isReport:this.filters.isReport,
        // appName: "",
        // cameraStatus: this.filters.cameraState,
        onlineStatus: this.filters.onlineStatus,

        // connectionWay: "",
        cameraNum: this.filters.cameraNum
      };

      this.cameraTableLoading = true;
      this.$api
        .getCameraList(params)
        .then(res => {
          if (res.code != 200) {
            return Promise.reject();
          }
          this.tableList = [];
          this.tableList = _.map(res.data, it => {
            let classify = _.find(this.classifyList, {
              codeValue: it.classifyCode
            });
            let cameraType = _.find(this.cameraTypeList, {
              codeValue: it.cameraType
            });
            let derectionCode = _.find(this.directionList, {
              codeValue: it.derectionCode
            });
            return {
              ...it,
              classifyCode: classify ? classify.codeName : "",
              derectionCode: derectionCode ? derectionCode.codeName : "",
              cameraType: cameraType ? cameraType.codeName : ""
            };
          });
          this.total = res.total;
          this.pages = res.pages;
          this.selectHandle = [];
          // if (res.data.total <= 10) {
          //   this.showPagination = false;
          // }
          for (var i = 0; i < this.tableList.length; i++) {
            this.tableList[i].checkModel = false;
          }

          this.cameraTableLoading = false;
          //load.close();
        })
        .catch(error => {
          //load.close();
          this.cameraTableLoading = false;
          this.$message.error(error.message);
        });
    },
    resetSerach() {
      (this.filters.openStatus = ""), (this.areaValue = "");
      this.jurisdictionValue = "";
      this.classify = "";
      this.filters.roadCode = "";
      this.cameraStateValue = "";
      this.filters.startMileage = "";
      this.filters.endMileage = "";
      this.filters.direction = "";
      this.filters.classify = "";
      this.filters.ptzControlStatus = ""; // 是否可控
      this.filters.upCloud = "";
      this.filters.cameraState = "";
      this.filters.organizationId = "";
      this.filters.cameraType = "";
      this.filters.cameraNum = "";
      this.filters.cameraName = "";
      this.filters.provinceCode = "";
      this.filters.isReport="";
      this.filters.stream = false;
      this.filters.stream1 = false;
      this.filters.openStatus = false;
      this.filters.openStatus1 = false;
      this.filters.displayStatus = false;
      this.filters.displayStatus1 = false;
      this.filters.gateway = false;
      this.filters.gateway1 = false;
      // this.filters.isReport = false;
      // this.filters.isReport1 = false;
      this.queryList();
    },
    /**
     * 摄像机导出
     */
    exportCameraList(isDetail) {
      let mutilData = this.multipleSelection;
      let api = null;
      let caremanums = null;
      // if (mutilData.length === 0) {
      let params = {
        cameraName: this.filters.cameraName,
        kmPileMax: this.filters.endMileage, //
        kmPileMin: this.filters.startMileage, //
        regionId: this.filters.provinceCode, //
        organizationId: this.filters.organizationId, //
        roadCode: this.filters.roadCode, //
        derectionCode: this.filters.direction, //
        classifyCode: this.filters.classify, //
        ptzControlStatus: this.filters.ptzControlStatus, // 是否可控
        transcodingId: this.filters.upCloud,
        cameraType: this.filters.cameraType,
        onlineStatus: this.filters.onlineStatus,
        cameraNum: this.filters.cameraNum
      };
      api = this.$http
        .get(
          "/device/cameras/download/excel-detail/all?" + qs.stringify(params),
          {
            responseType: "blob"
          }
        )
        // }
        // else {
        //   // caremanums = _.map(mutilData, it => it.cameraNum).join(",");
        //   api = this.$http
        //   .get("/device/cameras/download/excel-detail/" + caremanums, {
        //     responseType: "blob"
        //   })
        // }
        // api
        .then(data => {
          var downloadElement = document.createElement("a");
          var href = window.URL.createObjectURL(data.data); // 创建下载的链接
          downloadElement.href = href;
          downloadElement.download = "摄像机信息表.xlsx"; // 下载后文件名
          document.body.appendChild(downloadElement);
          downloadElement.click(); // 点击下载
          document.body.removeChild(downloadElement); // 下载完成移除元素
          window.URL.revokeObjectURL(href); // 释放掉blob对象
        })
        .catch(error => {
          this.$message({
            message: "摄像机导出失败! ",
            type: "error"
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
        display: ["隐藏", "显示"]
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
        customClass: "gd-confirm"
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
    toggleStream(status, msg, row) {
      let cameraIds = null;
      if (row) {
        cameraIds = [row.cameraNum];
      } else {
        cameraIds = _.map(this.multipleSelection, it => it.cameraNum);
      }

      this.updateStreamStatus({
        checkMsg: msg,
        data: {
          streamType: parseInt(status) === 1 ? '0' : '-1',
          cameraNums: cameraIds,
          // streamType: 20,
          instructions: {
            module: "资源管理",
            page: "摄像机管理",
            feature: "批量处理-" + msg,
            description: "批量" + msg + cameraIds.length + "路摄像机"
          }
        }
      }).then(msg => {
        // this.$forceUpdate();
        this.query();
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
        ids = _.map(this.multipleSelection, it => it.cameraId);
      }
      this.$api
        .batchUpdateOpen({
          cameraIds: ids,
          openStatus: status,
          instructions: {
            module: "资源管理",
            page: "摄像机管理",
            feature: "批量处理-" + msg,
            description: "批量 " + msg + ids.length + "路，摄像机"
          }
        })
        .then(res => {
          if (res.code === 200) {
            this.getGatewayCameraList();
          }
        });
    },
    // 是否开放云台控制的权限事件
    togglePtzStatus (row) {
      let obj = {
        cameraId: row.cameraId,
        ptzStatus: row.ptzStatus === 1 ? 0 : 1
      }
      let message = row.ptzStatus === 1 ? "关闭" : "";
       this.$confirm("提示", {
        title: "提示",
        message: "确定" + message + "向上级平台开放云台控制的权限吗？",
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(() => {
        this.$api
          .authUpdateControl(obj)
            .then(res => {
              if (res.code === 200) {
                this.$message.success('操作成功！')
                this.getGatewayCameraList();
              }
            });
        }).catch(() => {
         
      });
    },
    toggleDisplayStatus(status, msg, row) {
      let ids = null;
      if (row) {
        ids = [row.cameraId];
      } else {
        ids = _.map(this.multipleSelection, it => it.cameraId);
      }
      this.$api
        .batchUpdateDisplay({
          cameraIds: ids,
          openStatus: status,
          instructions: {
            module: "资源管理",
            page: "摄像机管理",
            feature: "批量处理-" + msg,
            description: "批量 " + msg + ids.length + "路，摄像机"
          }
        })
        .then(res => {
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
        customClass: "gd-confirm"
      }).then(() => {
        var cams = [];
        for (var i = 0, len = this.multipleSelection.length; i < len; i++) {
          cams.push(this.multipleSelection[i].cameraId);
        }
        this.$api
          .deleteBatchCamera({
            cameraIds: cams,
            openStatus: "",
            instructions: {
              module: "资源管理",
              page: "摄像机管理",
              feature: "批量处理—删除",
              description: "批量删除" + cams.length + "路摄像机"
            }
          })
          .then(() => {
            this.query();
            // this.getGatewayCameraList();
          });
      });
    },

    /**
     * 摄像机上报
     */
    reportCamera(type, row) {
      if (this.multipleSelection.length === 0 && !row) {
        this.$message.warning("请选择要处理的摄像机！");
        return false;
      }
      let message = type === "1" ? "上报" : "取消上报";
      this.$confirm("确定" + message + "摄像机?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        dangerouslyUseHTMLString: true,
        closeOnClickModal: false,
        customClass: "gd-confirm"
      }).then(() => {
        var cams = [];
        for (var i = 0, len = this.multipleSelection.length; i < len; i++) {
          cams.push(this.multipleSelection[i].cameraNum);
        }
        if (!cams.length) {
          cams.push(row.cameraNum);
        }
        let api = null;
        if (type === "1") {
          api = this.$api.reportBatchCamera({
            cameraNums: cams,
            instructions: {
              module: "资源管理",
              page: "摄像机管理",
              feature: "批量处理—" + message,
              description: "批量" + message + cams.length + "路摄像机"
            }
          }).then(res => {
          if (res.code !== 200) {
            return Promise.reject(res);
          }
          // console.log(res.data)
          // let success = res.data.success;
          // let cameraNums=res.data.cameraNums;
          // if (cameraNums == null || cameraNums.length == 0) {
            // let HTMLText = '';
            // this.$alert(HTMLText, '上报列表', {
            //   message: "上报" + success + "路摄像机成功", //msg+'播放摄像机成功',
            //   type: 'success'
            // })
            this.cameraResultDialogVisible = true
            this.cameraReportConsequenceDetails(res.data);
             this.query();
            
          // }else {
          //   let HTMLText = '';
          //   this.$alert(HTMLText, '错误', {
          //     message: cameraNums, //msg+'播放摄像机成功',
          //     type: 'error'
          //  })
          // this.cameraResultDialogVisible = true
            // this.getGatewayCameraList();
            // this.getGatewayCameraList();
          // this.query();
          // }
          // this.query();
        })
        .catch(err => {
          this.$message({
            message: err.message,
            type: "error"
          });
        });
        } else {
          api = this.$api.cancelReportBatchCamera({
            cameraNums: cams,
            instructions: {
              module: "资源管理",
              page: "摄像机管理",
              feature: "批量处理—" + message,
              description: "批量" + message + cams.length + "路摄像机"
            }
          });
        }
        api.then((res) => {
          this.query();
          this.cameraResultDialogVisible = true
          this.cameraReportConsequenceDetails(res.data);
          // this.getGatewayCameraList();
        });
      });
    },

    // 摄像机上报或取消上报结果事件
    cameraReportConsequenceDetails (req) {
      console.log(req)
      if (req.reportMsg !== null) {
        this.cameraReportDetailsList = req.reportMsg
        console.log(123,this.cameraReportDetailsList)
        this.succeedList = req.reportMsg.filter(item =>
          // console.log('数量121323', item,item.status === 0)
          item.status === 0
        )
        this.errorList = req.reportMsg.filter(item =>{
           item.status === 1
        })
        console.log('数量', this.succeedList , this.errorList)
      }
    },
    // 复选框change事件
    radioChange (val) {
      this.$refs.cameraTransfer.radioChange(val)
    },
    // 摄像机上报或取消上报结果关闭事件
    cameraReportDetailsClose () {
      this.cameraReportDetailsDialogVisible = false
      this.cameraReportDetailsList = []
      this.succeedList = []
      this.errorList = []
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
        .then(res => {
          if (res.code !== 200) {
            return Promise.reject(res);
          }
          let success =res.data.success;
          let errorList=res.data.errorList;
          if (errorList == null || errorList.length == 0) {
            let HTMLText = '';
            this.$alert(HTMLText, '推流', {
              message: "推流" + success + "路摄像机成功", //msg+'播放摄像机成功',
              type: 'success'
            })
            // this.getGatewayCameraList();
          this.query();
            
          }else {
            let HTMLText = '';
            this.$alert(HTMLText, '停流', {
              message: errorList, //msg+'播放摄像机成功',
              type: 'error'
           })
            // this.getGatewayCameraList();
          this.query();
          }
          // this.query();
        })
        .catch(err => {
          this.$message({
            message: err.message,
            type: "error"
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
        .then(data => {
          if (data.code !== 2000) {
            return Promise.reject(data);
          }
          this.$message({
            message: msg + "摄像机，" + data.message, //msg+'播放摄像机成功',
            type: "success"
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
          if (this.isCloudGateway) {
            this.getGatewayCameraList();
          }
        })
        .catch(err => {
          this.$message({
            message: err.message,
            type: "error"
          });
        });
    },

    /**
     * 分页导航
     * @param val
     */
    handlePageChange(val) {
      this.filters.currPage = val;

      if (this.isCloudGateway) {
        return this.getGatewayCameraList();
      }

      this.query();
    },

    /**
     * 分页导航 改变每页展示数量
     * @param index
     */
    handleSizeChange(index) {
      this.filters.pageSize = index;
      this.filters.currPage = 1;

      if (this.isCloudGateway) {
        //
        return this.getGatewayCameraList();
      }

      this.query();
    },
    /**
     * 获取摄像机组列表
     */
    getDeviceList() {
      return this.$api
        .getDeviceGroupList({
          currPage: 1,
          pageSize: 0
        })
        .then(res => {
          this.deviceGroupList = res.data;
          console.log(this.deviceGroupList);
        });
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
        groupId: this.addDeiveGroupFrom.groupId
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
              "批量添加" + devs.length + "路摄像机到摄像机组: " + name
          }
        })
        .then(res => {
          if (res.code !== 200) {
            this.$message({
              type: "error",
              message: res.message
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
          status: "1"
        })
        .then(res => {
          if (res.code !== 200) {
            this.$message({
              type: "error",
              message: res.message
            });
            return;
          }
          this.addDeiveGroupDialogVisible = false;
          this.addDeiveGroupFrom.groupName = "";
          this.getDeviceList().then(() => {
            this.addDeiveGroupFrom.groupId = res.data;
          });
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
        customClass: "gd-confirm"
      }).then(() => {
        this.$api
          .deleteBatchCamera({
            cameraIds: [obj.cameraNum]
          })
          .then(res => {
            if (this.isCloudGateway) {
              this.getGatewayCameraList();
            } else {
              this.query();
            }
          });
      });
    },

     /**
     * 查看摄像机状态
     * @param obj
     */
    handCameraStatus(obj) {
      this.cameraStatusDialogVisible = true;
      console.log(obj)
      this.cameraTransferInfo = obj
    },

    /**
     * 视频播放
     * @param obj
     */
    handlePlay(obj) {
      this.playerCamera = obj;
      this.cameraId = obj.cameraId;
      this.playerDialogVisible = true;
      // obj.instructions = {
      //   module: "资源管理",
      //   page: "摄���机管理",
      //   feature: "播放视频",
      //   description:
      //     "播放："+ obj.cameraName,
      // }
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
        id: obj.cameraNum
      };
      this.$api.getCameraDetails(params).then(res => {
        if (res.code == 200) {
          this.cameraDetailedInfo = res.data;
          this.cameraDetailedInfo.cameraId=obj.cameraId
        }
        this.cameraDialogVisible = true;
        // this.$refs.cameraDetail.cloudList();
      });
      // this.cameraDetailedInfo = obj;
    },
    clearCameraList() {
      this.$refs.cameraDetail.resetCurrent();
    },
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
          cameraNum: obj.cameraNum
        }
      ];
      this.$api.getPositionLatNew(latObj).then(res => {
        if (res.code == 200) {
          let data = res.data;
          let list = _.map(data, it => {
            return {
              longitude: it.wgLon,
              latitude: it.wgLat,
              cameraNum: it.cameraNum,
              cameraName: it.cameraName
            };
          });
          this.$nextTick(() => {
            this.$refs.lonAndlatMap.cameraViewPoint(list, obj.cameraName);
          });
        }
      });
    },
    setBtn(){
      this.setPriorityDialogVisible = false;
      this.$message({
          message: '云台优先级设置成功！',
          type: 'success'
        });
    },
    /**
     * 上云网关点击事件
     * @param obj
     */
    gatewayShow(obj) {
      this.gatewayInfo = ""
      this.tableList = ""
      this.gatewayCurrentPage = this.filters.currPage;
      this.filters.currPage = 1;
      this.gatewayQuery.transcodingId = obj.transcodingId;
      // 1物理网关 2平台
      if (obj.reportSource === "1") {
        this.getGatewayInfo(obj.transcodingId);
      } else if (obj.reportSource === "2"){
        this.getPlatformInfo(obj.transcodingId);
      }
      this.getGatewayCameraList();
      this.isCloudGateway = true;
      this.multipleSelection = [];
    },
         /**
     * 获取平台详情
     */
    getPlatformInfo(info) {
      let params = {
        id: info,
      };
      this.$api.getPlatFormDetails(params).then((res) => {
        if (res.code == 200) {
          this.gatewayInfo = res.data;
          // let region = _.find(vm.province, {
          //   regionCode: vm.gatewayInfo.regionName,
          // });
          // vm.gatewayInfo.regionName = region
          //   ? region.regionName
          //   : vm.gatewayInfo.regionName;
          this.gatewayInfo.createDate = this.timeFormat(this.gatewayInfo.gmtCreate);
          console.log( 'pingtai',this.gatewayInfo )
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
        id: id
      };
      this.$api.getGatewayInfo(params).then(res => {
        if (res.code != 200) {
          this.$message({
            message: res.code + res.message,
            type: "error"
          });
          return Promise.reject();
        }
        this.gatewayInfo = res.data;
        console.log(this.gatewayInfo);
        //做时间格式化处理
        this.gatewayInfo.createDate = this.timeFormat(
          this.gatewayInfo.gmtCreate
        );
      });
    },

    /**
     * 获取上云网关下的摄像机列表
     */
    getGatewayCameraList(transcodingId) {
      let stream = null;
      let openStatus = null;
      let displayStatus = null;
      //let load=Loading.service(this.loadOption);

      if (this.filters.stream && this.filters.stream1) {
        stream = null;
      } else {
        if (this.filters.stream) {
          stream = "1";
        } else if (this.filters.stream1) {
          stream = "0";
        }
      }
      if (this.filters.openStatus && this.filters.openStatus1) {
        openStatus = null;
      } else {
        if (this.filters.openStatus) {
          openStatus = "1";
        } else if (this.filters.openStatus1) {
          openStatus = "0";
        }
      }
      if (this.filters.displayStatus && this.filters.displayStatus1) {
        displayStatus = null;
      } else {
        if (this.filters.displayStatus) {
          displayStatus = "1";
        } else if (this.filters.displayStatus1) {
          displayStatus = "0";
        }
      }
      var obj = {
        currPage: this.filters.currPage,
        pageSize: this.filters.pageSize,
        displayStatus: displayStatus,
        streamStatus: stream,
        openStatus: openStatus,
        cameraName: this.gatewayQuery.cameraName,
        kmPileMax: this.gatewayQuery.kmPileMax, //
        kmPileMin: this.gatewayQuery.kmPileMin, // // regionId: this.areaValue,
        //         regionId: this.gatewayQuery.provinceCode, //
        organizationId: this.gatewayQuery.organizationId, //
        roadCode: this.gatewayQuery.roadCode, //
        derectionCode: this.gatewayQuery.direction, //
        transcodingId: this.gatewayQuery.transcodingId,
        cameraType: this.gatewayQuery.cameraType, // 摄像机类型
        cameraStatus: this.gatewayQuery.synOnlineStatus, //网关摄像机状态
        onlineStatus: this.gatewayQuery.onlineStatus,
        classifyCode: this.gatewayQuery.classifyCode
      };
      this.$api.getCameraList(obj).then(res => {
        if (res.code != 200) {
          return Promise.reject();
        }
        let vm = this;
        this.tableList = _.map(res.data, it => {
          let classify = _.find(vm.classifyList, {
            codeValue: it.classifyCode
          });
          let cameraType = _.find(vm.cameraTypeList, {
            codeValue: it.cameraType
          });
          let derectionCode = _.find(vm.directionList, {
            codeValue: it.derectionCode
          });
          return {
            ...it,
            classifyCode: classify ? classify.codeName : "",
            derectionCode: derectionCode ? derectionCode.codeName : "",
            cameraType: cameraType ? cameraType.codeName : ""
          };
        });
        this.total = res.total;
        this.pages = res.pages;
      });
    },
    // 搜索
    cloudQuery() {
      this.getGatewayCameraList();
    },
    // 重置
    resetCloud() {
      var gatewayparams = {
        kmPileMax: "",
        kmPileMin: "",
        // transcodingId: "",
        classifyCode: "",
        cameraType: "",
        openStatus: "",
        synOnlineStatus: "", //摄像机状态
        onlineStatus:""
      };
      for(var key in gatewayparams){
        this.gatewayQuery[key]=gatewayparams[key]
      }
      // this.filter.stream = false;
      // this.filter.stream1 = false;
      // this.filter.openStatus = false;
      // this.filter.openStatus1 = false;
      // this.filter.displayStatus = false;
      // this.filter.displayStatus1 = false;
      this.getGatewayCameraList();
      console.log(this.$route,this,"sssssssssss")
    },
    /**
     * 后退
     */
    goback() {
      var that = this;
      if (this.$route.params.id) {
        this.$router.push({
          name: "流媒体详情",
          params: {
            id: that.$route.params.id
          }
        });
      } else {
        this.isCloudGateway = false;
        this.multipleSelection = [];
        this.filters.currPage = this.gatewayCurrentPage;
        this.query();
      }
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
    }
  },
  mounted() {
    console.log(this.$route.query,'view mounted')
    //跳转到筛选摄像机名的列表页
    var param=this.$route.query
    var _this=this;
    if(param){
      for(var k in param){
       _this.filters[k]=param[k]
      }
    }
    
    let uinfo = JSON.parse(localStorage.getItem("cloudplatform"));
    if (this.$route.params.id) {
      this.isCloudGateway = true;
      this.gatewayQuery.transcodingId = this.$route.params.transcodingId;
      this.loadCameraType();
      this.getGatewayCameraList();
      this.loadClassify();
      this.loadDirection();
      // this.getGatewayInfo(this.$route.params.id);
      this.getGatewayInfo(this.gatewayQuery.transcodingId);
    } else {
      this.queryOrgList();
      this.loadArea();
      this.loadDirection();
      this.loadClassify();
      this.loadCameraType();
      this.queryRoadList("");
      this.queryUpCloud();
      // setTimeout(() => {
      //   this.queryList();
      // }, 1000);
        this.queryList();
    }
  }
};
</script>
 
<style lang="less" src="../components/css/CameraManager.less"></style>
<style lang="less" scoped>
.el-icon-delete {
  line-height: 24px;
  color: red;
}
.query,.reset{
    height: 40px;
}
.gd-dialog-check {
  height: calc(~"100% - 40px");
}
.dialog-footer {
  text-align: right;
}
.device-group-dialog.gd-dialog {
  height: auto;
}
.camera-manage-con {
  height: calc(100% - 14px - 20px);
  overflow: auto;
  display: flex;
  flex-direction: column;
}
.custom-cloud-table .el-table__body {
  padding-bottom: 40px;
}
.popper__arrow {
  display: none !important;
}

.camera-manage-search {
  display: flex;
  justify-content: space-between;
  background: #fff;
}
.search-opt {
  text-align: center;
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}
.camera-more-info {
  color: #929a9e !important;
  cursor: pointer;
  line-height: 14px !important;
  font-size: 14px;
  border-top: 18px solid #fff;
  border-left: 12px solid transparent;
  border-right: 12px solid transparent;
  height: 0;
  width: 140px;
}
.cloud-gateway-row .el-form .el-form-item {
  display: flex;
  float: left;
}
// 是否可控图标渲染
.icon-control {
  display: inline-block;
  width: 21px;
  height: 21px;
  background-image: url('../assets/images/icon/control.png');
  background-size: 100% 100%;
}
.icon-not-control {
  display: inline-block;
  width: 21px;
  height: 21px;
  background-image: url('../assets/images/icon/notControl.png');
  background-size: 100% 100%;
}
// 摄像机状态弹窗
.dialog-status {
  font-size: 20px;
  color: #666666;
  font-weight: 700;
  margin-right: 20px;
}
.dialog-transfer {
  color: #AAAAAF;
  margin-right: 10px;
}
.dialog-regular {
  display: inline-block;
  line-height: 20px;
  color: #4B7902;
  vertical-align: middle;
    img {
      width: 16px;
      height: 16px;
      vertical-align: middle;
    }
}

// 摄像机上报或取消上报结果提示窗
.camera-result-dialog {
  span {
    margin-left: 10px;
    margin-right: 20px;
  }
  p {
    display: inline-block;
    color: #169BD5;
    cursor: pointer;
  }
}
.camera-report-title {
  position: relative;
  .camera-report-radio {
      display: inline-block;
  }
  i {
    position: absolute;
    top: 0;
    right: 30px;
    // width: 20px;
    // height: 20px;
    cursor: pointer;
  }
}

</style>
