<template>
  <div class="content-wrapper">
    <div class="breadcrumb-wrapper header-t">
      <div class="left">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/dashboard' }">
            <i class="el-icon-coin"></i>
          </el-breadcrumb-item>
          <el-breadcrumb-item>资源管理</el-breadcrumb-item>
          <el-breadcrumb-item>开放管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <div class="left right">
        <el-button
          type="primary"
          plain
          class="query"
          @click="handleAppCheck"
          >创建应用</el-button
        >
          <!-- v-hasPermiss="10932210" -->
      </div>
    </div>
    <div class="selectBox">
      <el-select
        v-model="state"
        filterable
        placeholder="请选择启用状态"
        style="width:120px"
        @change="changeState"
        clearable
      >
        <el-option key="1" label="启用" value="1"></el-option>
        <el-option key="0" label="禁用" value="0"></el-option>
      </el-select>
    </div>
    <div class="open-manager-wrapper">
      <el-collapse accordion v-model="accordionCollapse" @change="handleChange">
        <el-collapse-item
          v-for="(item, idx) in openList"
          :key="idx"
          :name="item.id"
        >
          <template slot="title">
            <el-row class="collapse-title-wrap">
              <el-col :span="8">
                <h2 style="margin:0;padding-top:0;">
                  <i class="icon-listwrap"></i>
                  {{ item.appName }}
                  <span
                    >{{ item.gmtCreate }} 由 {{ item.gmtCreateName }} 创建</span
                  >
                </h2>
              </el-col>
              <el-col :span="10">
                <div class="title-item-wrap">
                  <strong>APPID:</strong>
                  {{ item.appId }}
                </div>
              </el-col>
              <el-col :span="4">
                <div class="title-icons-wrap">
                  <el-tooltip effect="dark" content="修改名称" placement="top">
                    <i class="el-icon-edit" @click="ExditApp($event, item)"></i>
                  </el-tooltip>
                  <el-tooltip effect="dark" content="权限配置" placement="top">
                    <!-- <i class="el-icon-coin" @click="handleRoleCheck($event, item)"></i> -->
                    <div
                      style="display: inline-block;margin:0 10px;"
                      v-if="true"
                    >
                      <check-manager
                        ref="checkcamera"
                        :dataList="item"
                        :UserOrgTree="UserOrgTreeChild"
                      ></check-manager>
                    </div>
                  </el-tooltip>
                  <el-tooltip
                    effect="dark"
                    :content="item.state == '0' ? '禁用' : '启用'"
                    placement="top"
                  >
                    <i
                      v-if="item.state == '1'"
                      class="el-icon-video-play error"
                      @click="handleAppDel($event, item)"
                    ></i>
                    <i
                      v-if="item.state == '0'"
                      class="el-icon-remove-outline error"
                      @click="handleAppDel($event, item)"
                    ></i>
                  </el-tooltip>
                  <el-tooltip effect="dark" content="新增key" placement="top">
                    <i
                      class="el-icon-plus"
                      @click="handleKeyCheck($event, item)"
                    ></i>
                  </el-tooltip>
                </div>
              </el-col>
              <el-col :span="2">
                <div class="title-icons-wrap">
                  <i
                    :class="
                      accordionCollapse === item.id
                        ? 'el-icon-arrow-up'
                        : 'el-icon-arrow-down'
                    "
                  ></i>
                </div>
              </el-col>
            </el-row>
          </template>
          <div class="keyRow">
            <vue-scroll :ops="$root.scrollOpsY">
              <el-table :data="tableData" v-loading="keyLoading">
                <el-table-column
                  fixed
                  prop="keyName"
                  label="KEY名称"
                  width="240px"
                ></el-table-column>
                <el-table-column prop="appKey" label="KEY"></el-table-column>
                <el-table-column prop="type" label="应用类型" width="150px">
                  <template slot-scope="scope">
                    <div>
                      {{
                        scope.row.type == 1
                          ? 'WEB服务'
                          : scope.row.type == 2
                          ? 'WEB端'
                          : scope.row.type == 3
                          ? '微信小程序'
                          : scope.row.type == 4
                          ? '智能分析'
                          : '&nbsp;&nbsp;&nbsp;'
                      }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="keySecret" label="keySecret">
                  <template slot-scope="scope">
                    <div>
                      {{ scope.row.appSecret }}
                      <span
                        @click="handleReset(scope.row)"
                        class="key-reset-btn"
                        >重置</span
                      >
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="200px">
                  <template slot-scope="scope">
                    <el-tooltip
                      effect="dark"
                      content="配置接口"
                      placement="top"
                    >
                      <el-button
                        class="table-control-btn"
                        type="primary"
                        icon="el-icon-document"
                        size="mini"
                        @click="handleInterfaceCheck($event, scope.row)"
                      ></el-button>
                    </el-tooltip>
                    <el-tooltip effect="dark" content="修改" placement="top">
                      <el-button
                        class="table-control-btn"
                        type="primary"
                        icon="el-icon-edit"
                        size="mini"
                        @click="handleKeyTitle(scope.row)"
                      ></el-button>
                    </el-tooltip>
                    <el-tooltip
                      effect="dark"
                      :content="scope.row.state == 0 ? '禁用' : '启用'"
                      placement="top"
                    >
                      <el-button
                        :class="
                          scope.row.state == 1
                            ? 'table-control-btn btn-color'
                            : 'grary-button'
                        "
                        type="danger"
                        icon="el-icon-remove-outline"
                        size="mini"
                        @click="handleKeyDel($event, scope.row)"
                      ></el-button>
                    </el-tooltip>
                  </template>
                </el-table-column>
              </el-table>
            </vue-scroll>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>

    <el-dialog
      :title="addTitle"
      :visible.sync="createAppDialogVisible"
      custom-class="gd-custom-dialog open-app-dialog"
      width="460px"
       v-dialogDrag
      :append-to-body="true"
      :close-on-click-modal="false"
    >
      <div>
        <el-form :model="appForm" label-width="80px" ref="appForm">
          <el-form-item
            label="应用名称"
            prop="appName"
            :rules="[{ required: true, message: '应用名称不能为空' }]"
          >
            <el-input
              v-model="appForm.appName"
              placeholder="请填写名称，不超过15字"
              maxlength="15"
            ></el-input>
            <!-- <el-input v-model="appForm.appName" maxlength="15" v-if="addTitle === '修改应用名称'"></el-input> -->
          </el-form-item>
          <el-form-item>
            <el-radio-group v-model="appForm.state">
              <el-radio :label="0" :value="0">禁用</el-radio>
              <el-radio :label="1" :value="1">启用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="createAppDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="createApp('appForm')"
          v-if="addTitle === '创建应用'"
          >保 存</el-button
        >
        <el-button
          type="primary"
          @click="updateAppTitle('appForm')"
          v-if="addTitle === '修改应用名称'"
          >保存</el-button
        >
      </span>
    </el-dialog>

    <el-dialog
      :title="Keytitle"
      :visible.sync="createKeyDialogVisible"
      width="600px"
      custom-class="gd-custom-dialog"
       v-dialogDrag
      :append-to-body="true"
      :close-on-click-modal="false"
    >
      <div>
        <el-form ref="keyForm" :model="keyForm" label-width="80px">
          <el-form-item
            label="KEY名称"
            prop="keyName"
          >
            <el-input v-model="keyForm.keyName"></el-input>
          </el-form-item>
          <el-form-item label="应用服务">
            <el-radio-group v-model="keyForm.type" v-if="Keytitle == '新增key'">
              <el-radio :label="1">WEB服务</el-radio>
              <el-radio :label="2">WEB端</el-radio>
              <el-radio :label="3">微信小程序</el-radio>
              <el-radio :label="4">智能分析</el-radio>
            </el-radio-group>
            <el-radio-group v-model="keyForm.type" v-if="Keytitle == '编辑key'">
              <el-radio :label="1" disabled>WEB服务</el-radio>
              <el-radio :label="2" disabled>WEB端</el-radio>
              <el-radio :label="3" disabled>微信小程序</el-radio>
              <el-radio :label="4" disabled>智能分析</el-radio>
            </el-radio-group>
          </el-form-item>
          <template v-if="keyForm.type === 1 || keyForm.type === 4">
            <el-form-item
              v-for="(white, index) in keyForm.whiteList"
              :label="index === 0 ? '白名单' : ''"
              :key="index"
              prop="whiteList"
              :rules="[
                {
                  validator: (rule, value, callback) =>
                    validateSkuMarketPrice(rule, white.value, callback),
                  trigger: 'blur',
                },
              ]"
            >
              <el-input
                auto-complete="off"
                v-model="white.value"
                style="width: calc(100% - 70px);"
                placeholder="请输入IP，格式如：127.0.0.1"
              ></el-input>

              <el-button
                v-if="index === 0 && keyForm.whiteList.length < 50"
                type="primary"
                @click.prevent="addWhiteList"
                icon="el-icon-circle-plus-outline"
              ></el-button>
              <el-button
                type="danger"
                @click.prevent="removeWhiteList(white)"
                v-if="index > 0"
                icon="el-icon-circle-close"
              ></el-button>
              <div
                style="color:#ff0303;"
                v-if="index === 49 && keyForm.whiteList.length == 50"
              >
                最多可配置50个白名单！
              </div>
            </el-form-item>
          </template>
          <!-- <el-form-item>
            <el-radio-group v-model="keyForm.state">
              <el-radio :label="0" :value="0">禁用</el-radio>
              <el-radio :label="1" :value="1">启用</el-radio>
            </el-radio-group>
          </el-form-item>-->
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="createKeyDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="createKeyDialog($event, 'keyForm')"
          >保 存</el-button
        >
      </span>
    </el-dialog>

    <el-dialog
      title="数据权限"
      :visible.sync="dataRoleDialogVisible"
      width="80%"
      custom-class="gd-custom-dialog"
       v-dialogDrag
      :append-to-body="true"
      :close-on-click-modal="false"
      style="float:left"
      @close="clearCameraList"
    >
      <div class="limite-B">
        <div class="dataBox-L">
          <!-- <div style="text-align: left;padding-right:10px">
            <span>
              已选：
              <span style="color:rgba(18,116,238,1);">{{ dataLimit.limiteLength }}</span>路摄像机
            </span>
          </div>-->
          <el-tree
            :data="UserOrgTreeChild"
            node-key="organizationId"
            :props="{
              children: 'childList',
              label: 'organizationName',
            }"
            @node-click="handleTreenode"
          ></el-tree>
        </div>
        <div class="dataBox-R">
          <!--搜索框-->
          <div class="search-wrapper camera-manage-search">
            <el-form :inline="true">
              <el-form-item v-if="uinfo.regionCode == 100000 ? true : false">
                <el-select
                  v-model="dataLimit.regionCode"
                  filterable
                  placeholder="省份"
                  style="width:164px"
                  clearable
                >
                  <el-option
                    v-for="item of provinces"
                    :key="item.regionCode"
                    :label="item.regionName"
                    :value="item.regionCode"
                  ></el-option>
                </el-select>
              </el-form-item>

              <el-form-item>
                <el-select
                  v-model="dataLimit.shouldRoad"
                  filterable
                  placeholder="路线"
                  style="width:164px"
                  @change="changeRoad"
                  clearable
                >
                  <!-- <el-option label="全部路线" value></el-option> -->
                  <el-option
                    v-for="item in dataLimit.roadList"
                    :key="item.roadId"
                    :label="item.roadName"
                    :value="item.roadId"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-select
                  v-model="dataLimit.onlineStatus"
                  filterable
                  placeholder="摄像机状态"
                  style="width:164px"
                  clearable
                >
                  <el-option
                    v-for="item of dataLimit.onlineStatusList"
                    :key="item.state"
                    :label="item.onlineStatus"
                    :value="item.state"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-select
                  v-model="dataLimit.classify"
                  filterable
                  placeholder="所属类别"
                  style="width:164px"
                  clearable
                >
                  <!-- <el-option label="全部" value></el-option> -->
                  <el-option
                    v-for="item of dataLimit.dimensionList"
                    :key="item.roadCode"
                    :label="item.roadName"
                    :value="item.roadCode"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-input
                  style="width:150px"
                  v-model="dataLimit.cameraName"
                  placeholder="摄像机名称"
                ></el-input>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" class="query" @click="queryList"
                  >搜索</el-button
                >
                <el-button type="primary" class="reset" @click="clearList"
                  >重置</el-button
                >
              </el-form-item>
            </el-form>
          </div>

          <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane :label="'全部' + dataLimit.total" name="all">
              <div style="float: right;padding-bottom: 8px;">
                <el-button @click="clearCameraList">取 消</el-button>
                <el-button type="primary" @click="bindCameraData"
                  >保 存</el-button
                >
              </div>
              <el-table
                class="custom-cloud-table"
                :data="tableList"
                v-loading="cameraTableLoading"
                @selection-change="handleSelectionChange"
                ref="multipleTable"
                border
                @select="getCameraApper"
                @select-all="getCameraApper"
                :row-key="getRowkeys"
              >
                <el-table-column
                  type="selection"
                  width="50"
                  align="center"
                ></el-table-column>
                <el-table-column label="序号" width="60" align="center">
                  <template slot-scope="scope">{{ scope.$index + 1 }}</template>
                </el-table-column>
                <el-table-column
                  prop="regionName"
                  label="省份"
                ></el-table-column>
                <el-table-column
                  prop="organizationName"
                  label="管辖单位"
                ></el-table-column>
                <el-table-column
                  prop="cameraName"
                  label="摄像机名称"
                  show-overflow-tooltip
                ></el-table-column>
                <el-table-column prop="roadName" label="路线"></el-table-column>
                <!-- <el-table-column prop="cameraType" label="摄像机类型">
              <template slot-scope="scope">
                <div>
                  {{
                  scope.row.cameraType == 1
                  ? "监控型枪机"
                  : scope.row.cameraType == 2
                  ? "监控型球机"
                  : scope.row.cameraType == 3
                  ? "全景机"
                  : scope.row.cameraType == 4
                  ? "抓拍机"
                  : ""
                  }}
                </div>
              </template>
                </el-table-column>-->
                <el-table-column prop="pile" label="桩号"></el-table-column>
                <!-- <el-table-column prop="lonAndlat" label="经纬度"> </el-table-column> -->
                <el-table-column prop="classify" label="所属类别">
                  <template slot-scope="scope">
                    <div>
                      {{
                        scope.row.classify == 0
                          ? '全部'
                          : scope.row.classify == 1
                          ? '道路沿线'
                          : scope.row.classify == 2
                          ? '桥梁'
                          : scope.row.classify == 3
                          ? '隧道'
                          : scope.row.classify == 4
                          ? '收费广场'
                          : scope.row.classify == 4
                          ? '故障'
                          : scope.row.classify == 5
                          ? '收费站'
                          : scope.row.classify == 6
                          ? '服务区'
                          : scope.row.classify == 7
                          ? 'ETC门架'
                          : scope.row.classify == 8
                          ? '移动视频源'
                          : ''
                      }}
                    </div>
                  </template>
                </el-table-column>
                <!-- <el-table-column prop="derection" label="方向"></el-table-column> -->
                <el-table-column prop="onlineStatus" label="摄像机状态">
                  <template slot-scope="scope">
                    <div>
                      {{
                        scope.row.onlineStatus == 1
                          ? '正常'
                          : scope.row.onlineStatus == 0
                          ? '离线'
                          : scope.row.onlineStatus == 2
                          ? '故障'
                          : ''
                      }}
                    </div>
                  </template>
                </el-table-column>
              </el-table>
              <div class="table-pagination userInfo-t">
                <p class="total-pagination">共{{ dataLimit.total }}条</p>
                <el-pagination
                  background
                  layout=" prev, pager, next, sizes, jumper "
                  @size-change="handleCamreaSizeChange"
                  @current-change="handleCamreaPageChange"
                  :current-page="dataLimit.currPage"
                  :page-size="pageSize"
                  :total="dataLimit.total"
                ></el-pagination>
              </div>
            </el-tab-pane>

            <el-tab-pane :label="'已选' + dataLimit2.total" name="selected">
              <div style="float: right;padding-bottom: 8px;">
                <el-button @click="clearCameraList">取 消</el-button>
                <el-button type="primary" @click="bindCameraData2"
                  >保 存</el-button
                >
              </div>
              <el-table
                class="custom-cloud-table"
                :data="tableList2"
                v-loading="cameraTableLoading"
                @selection-change="handleSelectionChange"
                ref="multipleTable2"
                border
                @select="getCameraApper"
                @select-all="getCameraApper"
                :row-key="getRowkeys"
              >
                <!-- <el-table-column :reserve-selection="true" type="selection" width="50" align="center"></el-table-column> -->
                <el-table-column
                  type="selection"
                  width="50"
                  align="center"
                ></el-table-column>
                <el-table-column label="序号" width="60" align="center">
                  <template slot-scope="scope">{{ scope.$index + 1 }}</template>
                </el-table-column>
                <el-table-column
                  prop="regionName"
                  label="省份"
                ></el-table-column>
                <el-table-column
                  prop="organizationName"
                  label="管辖单位"
                ></el-table-column>
                <el-table-column
                  prop="cameraName"
                  label="摄像机名称"
                  show-overflow-tooltip
                ></el-table-column>
                <el-table-column prop="roadName" label="路线"></el-table-column>
                <!-- <el-table-column prop="cameraType" label="摄像机类型">
              <template slot-scope="scope">
                <div>
                  {{
                  scope.row.cameraType == 1
                  ? "监控型枪机"
                  : scope.row.cameraType == 2
                  ? "监控型球机"
                  : scope.row.cameraType == 3
                  ? "全景机"
                  : scope.row.cameraType == 4
                  ? "抓拍机"
                  : ""
                  }}
                </div>
              </template>
                </el-table-column>-->
                <el-table-column prop="pile" label="桩号"></el-table-column>
                <!-- <el-table-column prop="lonAndlat" label="经纬度"> </el-table-column> -->
                <el-table-column prop="classify" label="所属类别">
                  <template slot-scope="scope">
                    <div>
                      {{
                        scope.row.classify == 0
                          ? '全部'
                          : scope.row.classify == 1
                          ? '道路沿线'
                          : scope.row.classify == 2
                          ? '桥梁'
                          : scope.row.classify == 3
                          ? '隧道'
                          : scope.row.classify == 4
                          ? '收费广场'
                          : scope.row.classify == 4
                          ? '故障'
                          : scope.row.classify == 5
                          ? '收费站'
                          : scope.row.classify == 6
                          ? '服务区'
                          : scope.row.classify == 7
                          ? 'ETC门架'
                          : scope.row.classify == 8
                          ? '移动视频源'
                          : ''
                      }}
                    </div>
                  </template>
                </el-table-column>
                <!-- <el-table-column prop="derection" label="方向"></el-table-column> -->
                <el-table-column prop="onlineStatus" label="摄像机状态">
                  <template slot-scope="scope">
                    <div>
                      {{
                        scope.row.onlineStatus == 1
                          ? '正常'
                          : scope.row.onlineStatus == 0
                          ? '离线'
                          : scope.row.onlineStatus == 2
                          ? '故障'
                          : ''
                      }}
                    </div>
                  </template>
                </el-table-column>
              </el-table>
              <div class="table-pagination">
                <p class="total-pagination">共{{ dataLimit2.total }}条</p>
                <el-pagination
                  background
                  layout=" prev, pager, next, sizes, jumper "
                  :current-page="dataLimit2.currPage"
                  @current-change="handleCamreaPageChange2"
                  @size-change="handleCamreaSizeChange2"
                  :total="dataLimit2.total"
                ></el-pagination>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </el-dialog>

    <el-dialog
      title="配置接口"
      :visible.sync="createInterfaceDialogVisible"
      custom-class="gd-custom-dialog"
       v-dialogDrag
      :append-to-body="true"
      :close-on-click-modal="false"
      @close="cancelDialog()"
    >
      <div class="beDone">
        <el-collapse v-model="activekey">
          <el-collapse-item
            v-for="(item, idx) in cameraListData"
            :key="item.id"
            :name="item.id"
            :disabled="item.fieldNames.length === 0 ? true : false"
          >
            <template slot="title">
              <el-row class="collapse-title-wrap">
                <el-checkbox
                  :indeterminate="isIndeterminate[idx]"
                  :checked="item.checked"
                  v-model="checkAll[idx]"
                  @change="(value) => handleCheckAllChange(value, idx)"
                  >{{ item.resourceName }}</el-checkbox
                >
              </el-row>
            </template>
            <el-checkbox-group
              v-model="checkedCamera[idx]"
              @change="(value) => handleCheckedfieldName(value, idx)"
            >
              <div class="float">
                <el-checkbox
                  v-for="(item2, index) in item.fieldNames"
                  :label="item2"
                  :key="item2.key"
                  style="width:45%;margin:0;padding-left:10px;"
                  :checked="item2.checked"
                  >{{ item2.key }}{{ item2.value }}</el-checkbox
                >
              </div>
            </el-checkbox-group>
          </el-collapse-item>
        </el-collapse>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog()">取 消</el-button>
        <el-button type="primary" @click="saveCameraLimit">保存</el-button>
      </span>
    </el-dialog>
    <div class="table-pagination">
      <p class="total-pagination">共{{ opentotal }}条</p>
      <el-pagination
        background
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
        layout="prev, pager, next, jumper"
        :total="opentotal"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import api from '../../../api/index';
import checkManager from './checkManager.vue';
export default {
  name: 'OpenManager',
  components: { checkManager },
  data() {
    return {
      uinfo: {
        regionCode: JSON.parse(localStorage.getItem('cloudplatform'))
          .regionCode,
      },
      activeName: 'all',
      tableList: [],
      tableList2: [],
      dataLimit: {
        currPage: 1,
        pageSize: 10,
        pages: 0,
        total: 0,
        shouldRoad: '',
        classify: '',
        roadId: '',
        jurisdictionUnit: '',
        onlineStatus: '',
        cameraName: '',
        cameraTypeList: [
          { cameraName: '监控型枪机', cameraType: '1' },
          { cameraName: '监控型球机', cameraType: '2' },
          { cameraName: '全景机', cameraType: '3' },
          { cameraName: '抓拍机', cameraType: '4' },
        ],
        onlineStatusList: [
          {
            state: '0',
            onlineStatus: '离线',
          },
          {
            state: '1',
            onlineStatus: '正常',
          },
          {
            state: '2',
            onlineStatus: '故障',
          },
        ],
        dimensionList: [
          {
            roadCode: '0',
            roadName: '全部',
          },
          {
            roadCode: '1',
            roadName: '道路沿线',
          },
          {
            roadCode: '2',
            roadName: '桥梁',
          },
          {
            roadCode: '3',
            roadName: '隧道',
          },
          {
            roadCode: '4',
            roadName: '收费广场',
          },
          {
            roadCode: '5',
            roadName: '收费站',
          },
          {
            roadCode: '6',
            roadName: '服务区',
          },
          {
            roadCode: '7',
            roadName: 'ETC门架',
          },
          {
            roadCode: '8',
            roadName: '移动视频源',
          },
        ],
        kmPileMin: '',
        kmPileMax: '',
        limiteLength: 0,
        organizationId: null,
        roadList: [],
        orgTreeList: [], //管辖单位
        orgCodeProps: {
          //lazy: true,
          expandTrigger: 'hover',
          value: 'organizationName',
          label: 'organizationName',
          children: 'childList',
          //lazyLoad:this.propsLazyload
        },
        jurisdictionList: [],
        regionCode: '',
        cameras: [],
      },
      dataLimit2: {
        currPage: 1,
        pageSize: 10,
        pages: 0,
        total: 0,
        shouldRoad: '',
        classify: '',
        roadId: '',
        jurisdictionUnit: '',
        onlineStatus: '',
        cameraName: '',
        cameraTypeList: [
          { cameraName: '监控型枪机', cameraType: '1' },
          { cameraName: '监控型球机', cameraType: '2' },
          { cameraName: '全景机', cameraType: '3' },
          { cameraName: '抓拍机', cameraType: '4' },
        ],
        onlineStatusList: [
          {
            state: '0',
            onlineStatus: '离线',
          },
          {
            state: '1',
            onlineStatus: '正常',
          },
          {
            state: '2',
            onlineStatus: '故障',
          },
        ],
        dimensionList: [
          {
            roadCode: '0',
            roadName: '全部',
          },
          {
            roadCode: '1',
            roadName: '道路沿线',
          },
          {
            roadCode: '2',
            roadName: '桥梁',
          },
          {
            roadCode: '3',
            roadName: '隧道',
          },
          {
            roadCode: '4',
            roadName: '收费广场',
          },
          {
            roadCode: '5',
            roadName: '收费站',
          },
          {
            roadCode: '6',
            roadName: '服务区',
          },
          {
            roadCode: '7',
            roadName: 'ETC门架',
          },
          {
            roadCode: '8',
            roadName: '移动视频源',
          },
        ],
        kmPileMin: '',
        kmPileMax: '',
        limiteLength: 0,
        organizationId: null,
        roadList: [],
        orgTreeList: [], //管辖单位
        orgCodeProps: {
          //lazy: true,
          expandTrigger: 'hover',
          value: 'organizationName',
          label: 'organizationName',
          children: 'childList',
          //lazyLoad:this.propsLazyload
        },
        jurisdictionList: [],
        regionCode: '',
        cameras: [],
      },
      endMileage: '',
      keyLoading: false,
      cameraTableLoading: false,
      rowKey: 1,
      cameraListData: [],
      cameraListNum: 0,
      defaultApper: [[], [], []],
      checkAll: [false, false, false],
      isIndeterminate: [false, false, false],
      checkedCamera: [[], [], []],
      cameraFilesVal: {
        keyPurview: [
          {
            fieldName: [],
            resourceId: 0,
          },
          {
            fieldName: [],
            resourceId: 0,
          },
          {
            fieldName: [],
            resourceId: 0,
          },
        ],
      },
      allCheckedList: [[''], [''], ['']],
      Keytitle: '新增key',
      keyId: 0,
      currPage: 1,
      pageSize: 10,
      pages: 1,
      state: null,
      accordionCollapse: 0,
      createAppDialogVisible: false,
      createKeyDialogVisible: false,
      dataRoleDialogVisible: false,
      createInterfaceDialogVisible: false,
      openList: [],
      opentotal: 0,
      addTitle: '',
      appId: 0,
      id: 0,
      appForm: {
        appName: '',
        appId: '',
        state: 1,
        Id: '',
      },
      keyForm: {
        keyName: '',
        type: 1,
        whiteList: [
          {
            value: '',
            key: '',
          },
        ],
        state: 1,
        openAppId: 0,
      },
      whiteValue: '',
      activekey: '',
      tableData: [],
      bindCameraList: [],
      cameraRowList: [],
      delcameraRowList: [],
      cameraRow: [],
      removeCamera: [],
      selCameraList: [],
      delCameraList: [],
    };
  },
  computed: {
    ...mapState(['UserOrgTreeChild', 'provinces', 'UserOrgTree']),
  },
  created() {
    // this.getOrgTree();
    this.getUserOrganization();
    this.getProvince();
    this.getOpenList();
    this.query();
    this.CameraBind();
  },
  mounted() {},
  methods: {
    ...mapActions(['getProvince', 'getUserOrganization']),

    validateSkuMarketPrice(rule, value, callback) {
      if (value == '') {
        callback(new Error('必填项不能为空'));
      }else {
        //负数校验
        let reg2 = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
        if (!reg2.test(value)) {
          callback(new Error('填写正确的ip地址'));
        } else {
          callback();
        }
      }
      //  callback();
    },
    handleSelectionChange(rowList) {
      if (rowList.length) {
        // 获取到初始所有的选中的rowList
        this.cameraRowList = rowList;
        this.delcameraRowList = rowList;
      } else {
        this.delcameraRowList = [];
      }
      let cameras = rowList.map((item) => {
        let cameraId = item.cameraId;
        return cameraId;
      });
      this.dataLimit.cameras = cameras;
      this.dataLimit.limiteLength = rowList.length;
    },
    // key
    getRowkeys(row) {
      return row.cameraId;
    },
    handleCheckAllChange(val, idx) {
      //点击 一级checkbox
      this.checkAll[idx] = val;
      this.checkedCamera[idx] = val ? this.cameraListData[idx].fieldNames : [];
      this.isIndeterminate[idx] = false;
    },
    forceUpdate() {
      // 除去第一个分类，其它分类内容不更新的hack方法
      let temp = this.cameraListData; //这里的data 就是tree 使用的数组，将data 数据clone 一份
      let temp2 = this.checkAll;
      let temp3 = this.checkedCamera;
      this.cameraListData = []; //先将data 数组置为空
      this.checkAll = [];
      this.checkedCamera = [[], [], []];
      this.$nextTick(() => {
        //通过this.$nextTick()获取到的值为dom更新之后的值
        this.cameraListData = temp; //等dom 更新后再将data 数组重新赋值原来的数据
        this.checkAll = temp2;
        this.checkedCamera = temp3;
      });
    },
    cancelDialog() {
      this.createInterfaceDialogVisible = false;
    },
    changeState() {
      this.getOpenList();
    },
    //获取列表
    getOpenList(current) {
      api
        .getOpenList({
          currPage: current ? current : this.currPage,
          pageSize: 10,
          appName: this.appForm.appName,
          state: this.state,
        })
        .then((res) => {
          this.openList = res.data;
          this.opentotal = res.total;
          this.pages = res.pages;
          this.pageSize = res.pageSize;
          this.currPage = res.currentPage;
          this.accordionCollapse = res.data[0] ? res.data[0].id : '';
          this.handleChange(this.accordionCollapse);
        });
      return true;
    },
    //新增KEY
    createKeyDialog(e, form) {
      e.stopPropagation();
      this.keyForm.openAppId = this.id;
      let formData = _.cloneDeep(this.keyForm);
      if (this.keyForm.type == 2 || this.keyForm.type == 3) {
        formData.whiteList = null;
      } else {
        formData.whiteList = this.keyForm.whiteList.map((item) => {
          return item.value;
        });
      }
      let instructions = {
        module: '资源管理',
        page: '开放管理',
        feature: `${
          this.Keytitle == '新增key' ? '新增key名称' : '修改key名称'
        }`,
        description: `${
          this.Keytitle == '新增key' ? '新增key名称' : '修改key名称'
        }${this.keyForm.keyName}应用类型:${
          this.keyForm.type == 1
            ? 'web服务'
            : this.keyForm.type == 2
            ? 'web端'
            : this.keyForm.type == 3
            ? '微信小程序'
            : this.keyForm.type == 4
            ? '智能分析'
            : ''
        }`,
      };
      // this.$refs[form].validate(valid => {
      //   if (valid) {
      if (this.Keytitle === '新增key') {
        // this.keyForm.whiteList=whiteLists.concat(this.whiteValue)
        api.addNewKey(formData, instructions).then((res) => {
          if (res.code === 200) {
            this.createKeyDialogVisible = false;
            // console.log(res, "创建的key");
            this.$message({
              message: '创建成功',
              type: 'success',
            });
            this.keyForm = {
              keyName: '',
              type: 1,
              whiteList: [
                {
                  value: '',
                  key: '',
                },
              ],
              openAppId: 0,
            };
            this.handleChange(this.accordionCollapse);
          } else {
            this.$message({
              // message: res.message,
              message:res.message,
              type: "error"
             
            });
          }
        });
      } else {
        this.keyForm.keyId = this.keyId;
        this.keyForm.openAppId = null;
        let obj = this.keyForm;
        formData.keyId = this.keyId;
        api.updateKeys(formData, instructions).then((res) => {
          if (res.code === 200) {
            this.createKeyDialogVisible = false;
            this.$message({
              message: '修改成功',
              type: 'success',
            });
            this.keyForm = {
              keyName: '',
              type: 1,
              whiteList: [
                {
                  value: '',
                  key: '',
                },
              ],
              openAppId: 0,
            };
            this.handleChange(this.accordionCollapse);
          }
        });
      }
      //   }
      // });
    },
    //重置
    handleReset(item) {
      this.$confirm('提示', {
        title: '重置',
        message: '确定要重置KEYSecret？',
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        let appSecret = item.id;
        api.getKeyReset(appSecret).then((res) => {
          if (res.code === 200) {
            this.$message({
              message: '重置成功',
              type: 'success',
            });
            this.handleChange(this.accordionCollapse);
          }
        });
      });
    },
    /**
     * 分页导航
     * @param val
     */
    handlePageChange(val) {
      this.currPage = val;
      let current = val;
      this.getOpenList(current);
    },

    /**
     * 分页导航 改变每页展示数量
     * @param index
     */
    handleSizeChange(val) {
      console.log(`当前页: ${val}`);
    },
    //x数据权限分页
    handleCamreaPageChange(val) {
      this.dataLimit.currPage = val;
      this.query();
    },
    handleCamreaSizeChange(val) {
      this.dataLimit.pageSize = val;
      this.query();
    },
    handleCamreaPageChange2(val) {
      // console.log(this.dataLimit2.currPage = val,"分页")
      this.dataLimit2.currPage = val;
      this.CameraBind();
    },
    handleCamreaSizeChange2(val) {
      this.dataLimit2.pageSize = val;
      this.CameraBind();
    },
    //创建应用
    createApp(formName) {
      let instructions = {
        module: '资源管理',
        page: '开放管理',
        feature: '新增应用',
        description: '新增应用名称 ' + this.appForm.appName,
      };
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let appName = this.appForm.appName;
          api
            .createApp(
              {
                appName,
              },
              instructions
            )
            .then((res) => {
              if (res.code === 200) {
                this.createAppDialogVisible = false;
                this.$message({
                  message: '创建成功',
                  type: 'success',
                });
                this.appForm.appName = '';
                this.state = '';
                this.getOpenList();
              } else {
                this.$message({
                  message: '创建失败',
                  type: 'error',
                });
              }
            });
        } else {
          return false;
        }
      });
      // this.appForm.appName = ""; //清除数据
    },
    handleKeyTitle(item) {
      this.Keytitle = '编辑key';
      // console.log(item, "bainjikey");
      this.keyId = item.id;
      this.keyForm.keyName = item.keyName;
      this.keyForm.state = item.state;
      if (!this.keyForm.keyName) {
        return false;
      }
      this.keyForm.type = item.type;
      let whiteList =
        item.whiteList && item.whiteList.length > 0
          ? item.whiteList.map((item) => {
              return { value: item, key: '' };
            })
          : [
              {
                value: '',
                key: '',
              },
            ];
      this.keyForm.whiteList = whiteList;
      this.createKeyDialogVisible = true;
    },
    updateKeyDialog() {
      e.stopPropagation();
      this.keyForm.appId = this.appId;
      this.keyForm.whiteList = this.whiteData ? [this.whiteData] : null;
      let obj = this.keyForm;
      api.updateKey(obj).then((res) => {
        if (res.code === 200) {
          this.$message({
            message: '修改成功',
            type: 'success',
          });
          // this.keyForm = {
          //   keyName: "",
          //   type: 1,
          //   whiteList: [
          //     {
          //       value: "",
          //       key: ""
          //     }
          //   ],
          //    openAppId: 0
          // };
          this.handleChange(this.accordionCollapse);
        }

        this.createKeyDialogVisible = false;
      });
    },
    // 修改key名称
    updateAppTitle(formName) {
      let appName = this.appForm.appName,
        appId = this.appForm.appId,
        id = this.appForm.Id,
        state = this.appForm.state;
      this.id = this.appForm.Id;
      let instructions = {
        module: '资源管理',
        page: '开放管理',
        feature: '修改应用',
        description: `
          修改应用名称: 
            ${this.appForm.appName} 
            应用类型
           ${
          this.keyForm.type == 1
            ? 'web服务'
            : this.keyForm.type == 2
            ? 'web端'
            : this.keyForm.type == 3
            ? '微信小程序'
            : this.keyForm.type == 4
            ? '智能分析'
            : ''
        }`,
      };
      // console.log(this.appForm, "修改状态");
      this.$refs[formName].validate((valid) => {
        if (valid) {
          api
            .updateAppTitle(
              {
                appName,
                id,
                state,
              },
              instructions
            )
            .then((res) => {
              if (res.code === 200) {
                this.createAppDialogVisible = false;
                // console.log('1')
                this.$message({
                  message: '修改成功',
                  type: 'success',
                });
                setTimeout(() => {
                  this.appForm.appName = ''; //清除数据
                  this.getOpenList();
                }, 100);
              } else {
                this.$message({
                  message: '修改失败',
                  type: 'error',
                });
              }
            });
        } else {
          return false;
        }
      });
      // setTimeout(() => {
      //   this.appForm.appName = ""; //清除数据
      // }, 1000);
      // this.appForm.appName = ""; //清除数据
    },
    // 获取绑定的相机
    getCameraApper(rowList, row) {
      this.cameraRow = rowList; //选中的rowlist
      if (
        rowList.length < this.cameraRowList.length &&
        row &&
        this.cameraRowList.length < 9
      ) {
        //
        // 单取消 当当前选中的总 list 小于 初始的选中cameraRowList代表取消
        //当取消单个或多个
        this.delCameraList.push(row.cameraId);
        this.removeCamera = this.delCameraList; // 获取取消的相机list
      } else if (!rowList.length && !this.delcameraRowList.length) {
        //当全取消时,获取之前选中的row
        // this.bindCameraList = []; //清除掉之前选中的
        this.removeCamera = this.cameraRowList.map((item) => {
          return item.cameraId;
        });
      } else if (rowList.length === 10) {
        //全部选中
        this.bindCameraList = rowList.map((item) => {
          return item.cameraId;
        });
      } else if (
        (row && rowList.length) ||
        this.cameraRowList.length < rowList.length ||
        !this.delcameraRowList.length
      ) {
        //单选中, 当前选中项并且 大于 初始选中cameraRowList
        this.selCameraList.push(row.cameraId);
        this.bindCameraList = this.selCameraList;
      }
    },
    getAllCameraApper(valueList) {
      console.log(valueList);
    },
    //获取key列表
    handleChange(value) {
      this.rowKey = this.rowKey + 1;
      this.keyLoading = true;
      api.getKeyList({ openAppId: value }).then((res) => {
        this.tableData = res.data;
        this.keyLoading = false;
      });
    },
    removeWhiteList(item) {
      var index = this.keyForm.whiteList.indexOf(item);
      if (index !== -1) {
        this.keyForm.whiteList.splice(index, 1);
      }
    },
    addWhiteList() {
      this.keyForm.whiteList.push({
        value: '',
        key: Date.now(),
      });
    },
    handleAppCheck(e, key, type) {
      e.stopPropagation();
      this.appForm.appName = ''; //清除数据
      this.addTitle = '创建应用';
      this.createAppDialogVisible = true;
    },
    //修改名称
    ExditApp(e, item) {
      e.stopPropagation();
      // console.log(item, "修改名称");
      this.addTitle = '修改应用名称';
      this.createAppDialogVisible = true;
      this.appForm.appId = item.appId;
      this.appForm.Id = item.id;
      this.appForm.appName = item.appName;
      this.appForm.state = item.state;
    },
    handleKeyCheck(e, item) {
      this.Keytitle = '新增key';
      e.stopPropagation();
      this.appId = item.appId;
      this.id = item.id;
      this.createKeyDialogVisible = true;
      // this.whiteData = "";
      this.keyForm = {
        keyName: '',
        type: 0,
        whiteList: [
          {
            value: '',
            key: '',
          },
        ],
      };
    },

    // 权限配置
    handleRoleCheck(e, item) {
      this.dataLimit.cameraStateList = [
        {
          state: '0',
          cameraState: '离线',
        },
        {
          state: '1',
          cameraState: '正常',
        },
        {
          state: '2',
          cameraState: '故障',
        },
      ];
      this.dataLimit.dimensionList = [
        {
          roadCode: '0',
          roadName: '全部',
        },
        {
          roadCode: '1',
          roadName: '道路沿线',
        },
        {
          roadCode: '2',
          roadName: '桥梁',
        },
        {
          roadCode: '3',
          roadName: '隧道',
        },
        {
          roadCode: '4',
          roadName: '收费广场',
        },
        {
          roadCode: '5',
          roadName: '收费站',
        },
        {
          roadCode: '6',
          roadName: '服务区',
        },
        {
          roadCode: '7',
          roadName: 'ETC门架',
        },
        {
          roadCode: '8',
          roadName: '移动视频源',
        },
      ];
      // console.log(item, "权限配置");
      e.stopPropagation();
      this.removeCamera = [];
      this.appId = item.appId;
      this.appForm.appName = item.appName;
      this.id = item.id;
      this.dataRoleDialogVisible = true;
      this.queryRoadList();
      this.queryOrgList();
      this.query();
      this.CameraBind();
    },
    // 获取所有的cameraList
    cameraListDataInit() {
      this.cameraListNum = this.cameraListData.length;
      //清空
      this.defaultApper = [];
      this.checkAll = [];
      this.isIndeterminate = [];
      this.checkedCamera = [];
      this.cameraFilesVal = {
        keyPurview: [],
      };
      this.allCheckedList = [];
      //初始化
      for (var i = 0; i < this.cameraListNum; i++) {
        this.defaultApper.push([]);
        this.checkAll.push(false);
        this.isIndeterminate.push(false);
        this.checkedCamera.push([]);
        this.cameraFilesVal.keyPurview.push({ fieldName: [], resourceId: 0 });
        this.allCheckedList.push(['']);
      }
    },
    cameraList() {
      return new Promise((resolve, reject) => {
        api.cameraList().then((res) => {
          this.cameraListData = res.data;
          this.cameraListDataInit(); //数据数组初始化
          this.cameraListData.map((item, idx) => {
            item.checked = false; //1.一级全置为fasle
            this.cameraFilesVal.keyPurview[idx].resourceId = item.id; //获取到 resourceId
            item.fieldNames.map((item2) => {
              item2.checked = false; //2.二级全置为false
            });
            this.$forceUpdate();
          });
          this.$forceUpdate(); //刷新页面
          this.forceUpdate();
          resolve(true);
        });
      });
    },
    // 绑定相机
    async handleInterfaceCheck(e, row) {
      //点击《配置接口》
      e.stopPropagation();
      // console.log(row);
      this.keyId = row.id;
      this.createInterfaceDialogVisible = true;
      var list = await this.cameraList();
      var res = await api.findBindPurvie(this.keyId);
      res.data.map((item, idx) => {
        let list = item.fieldName;
        this.cameraListData.map((item2, idx2) => {
          //如果cameraListData中的一条list的fieldname为空，但这个list的id===res中的某一个的resourceId，那么就让这条list的勾上
          if (item2.fieldNames.length === 0 && item2.id === item.resourceId) {
            item2.checked = true;
          }
          if (item2.id === item.resourceId) {
            //findBindPurvie接口与cameraList接口返回的id顺序不一致，这边纠正。
            list.map((item3) => {
              if (this.defaultApper[idx2].indexOf(item3) < 0) {
                this.defaultApper[idx2].push(item3); //获取到所有list勾选的数据
              }
            });
          }
        });
      });
      this.allCheckedList = this.defaultApper;
      this.cameraListData.map((item, idx) => {
        item.fieldNames.map((item2, idx2) => {
          let checked2 =
            this.defaultApper[idx].indexOf(item2.key) < 0 ? false : true; //二级checkbox是否打勾
          this.$set(item2, 'checked', checked2);
          if (checked2) {
            //如果二级有checkbox打勾，再判断是全选还是部分选。
            this.checkAll[idx] =
              this.defaultApper[idx].length === item.fieldNames.length; //是否全选
            item.checked = this.checkAll[idx];
            this.isIndeterminate[idx] =
              this.defaultApper[idx].length > 0 && //是否半选
              this.defaultApper[idx].length < item.fieldNames.length;
          }
        });
      });
      this.forceUpdate();
    },
    //获取相机信息字段
    handleCheckedfieldName(value, idx) {
      let checkedCount = value.length;
      this.checkAll[idx] =
        checkedCount === this.cameraListData[idx].fieldNames.length;
      this.isIndeterminate[idx] =
        checkedCount > 0 &&
        checkedCount < this.cameraListData[idx].fieldNames.length; //修改
      this.allCheckedList[idx] = value.map((item, inx) => {
        let fieldNames = item.key;
        return fieldNames;
      });
      if (this.allCheckedList[idx].length === 0) {
        this.allCheckedList[idx] = ['']; //fieldName不能为空数组，放个空字符串
      }
      this.$forceUpdate();
    },
    //保存相机权限设置
    saveCameraLimit() {
      let key = this.keyId;
      this.checkAll.map((item, idx) => {
        if (item) {
          //全选情况下
          this.allCheckedList[idx] = this.cameraListData[idx].fieldNames.map(
            (item2, idx2) => {
              let fieldNames = item2.key;
              return fieldNames;
            }
          );
        } else if (this.isIndeterminate[idx] === false) {
          //既不是全选，也不是半选，即没有选择任何一个
          this.allCheckedList[idx] = [''];
        }
      });
      this.cameraFilesVal.keyPurview.map((item, idx) => {
        item.fieldName = this.allCheckedList[idx];
      });
      // console.log(this.cameraFilesVal.keyPurview.map((item, idx) => {
      //   item.fieldName = this.allCheckedList[idx];
      //   console.log(item.fieldName, "选中数据");
      // }), "数据");

      var i = 0;
      this.checkAll.map((item, idx) => {
        //如果一级checkbox没有选中的情况下，并且没有二级checkbox，不需要发送这条keyPurview，删掉此keyPurview
        if (!item && this.cameraListData[idx].fieldNames.length === 0) {
          this.cameraFilesVal.keyPurview.splice(idx - i++, 1); //删除一条，i+1，因为数组个数少一
        }
      });
      let obj = this.cameraFilesVal.keyPurview;
      let instructions = {
        module: '资源管理',
        page: '开放管理',
        feature: '新增key',
        description: `配置${this.appForm.appName}的接口,组织架构接口、获取摄像机接口`,
      };

      api.bindPurview(key, obj, instructions).then((res) => {
        if (res.code === 200) {
          this.$message({
            message: '配置接口已保存',
            type: 'success',
          });
          // this.createInterfaceDialogVisible = false;
          this.cancelDialog();
          this.handleChange(this.accordionCollapse);
        }
      });
    },
    // 禁用应用
    handleAppDel(e, item) {
      e.stopPropagation();

      this.$confirm('提示', {
        title: '提示',
        message: `${item.state == 1 ? '确定要禁用应用?' : '确定要启用应用?'}`,
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        let appId = item.appId;
        let instructions = {
          module: '资源管理',
          page: '开放管理',
          feature: item.state == 1 ? `禁用应用` : `启用应用`,
          description:
            item.state == 1 ? `禁用 ${item.appName}` : `启用${item.appName}`,
        };
        api
          .updateAppTitle(
            {
              id: item.id,
              appName: item.appName,
              state: item.state ? 0 : 1,
            },
            instructions
          )
          .then((res) => {
            if (res.code === 200) {
              if (item.state == 1) {
                this.$message({
                  message: '已禁用',
                  type: 'success',
                });
              } else {
                this.$message({
                  message: '已启用',
                  type: 'success',
                });
              }
              this.getOpenList();
            }
          });
      });
    },
    // keyID禁用
    handleKeyDel(e, item) {
      // console.log(item, "nginx");
      // this.keyForm.state = this.keyForm.state == 1 ? 0 : 1;
      e.stopPropagation();
      this.$confirm('提示', {
        title: '提示',
        message: `${item.state == 1 ? '确定要禁用Key?' : '确定要启用key?'}`,
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        let obj = {
          keyId: item.id,
          state: item.state == 0 ? 1 : 0,
          keyName: item.keyName,
          whiteList: item.whiteList,
        };
        let instructions = {
          module: '资源管理',
          page: '开放管理',
          feature: item.state == 1 ? `禁用key ` : `启用key`,
          description:
            item.state == 1 ? `禁用 ${item.appName}` : `启用${item.appName}`,
        };
        api.updateKeys(obj, instructions).then((res) => {
          if (item.state == 1) {
            this.$message({
              message: '已禁用',
              type: 'success',
            });
          } else {
            this.$message({
              message: '已启用',
              type: 'success',
            });
          }

          this.handleChange(this.accordionCollapse);
        });
      });
    },
    /**
     * 查询表格全部数据
     */
    query(current) {
      let params = {};
      params = {
        id: this.id,
        data: {
          currPage: this.dataLimit.currPage,
          pageSize: this.dataLimit.pageSize,
          openAppId: this.appId,
          regionCode: this.dataLimit.regionCode, //
          roadId: this.dataLimit.shouldRoad, //
          organizationId: this.dataLimit.organizationId,
          classify: this.dataLimit.classify, //
          cameraStatus: this.dataLimit.cameraStatus,
          onlineStatus: this.dataLimit.onlineStatus,
          cameraName: this.dataLimit.cameraName,
          cameraType: this.dataLimit.cameraType,
          regionName: this.dataLimit.regionName,
          roadName: this.dataLimit.roadName,
        },
      };
      // console.log(params,"dsdsa")
      this.cameraTableLoading = true;
      this.$api
        .getCameraBindList(params)
        .then((res) => {
          if (res.code != 200) {
            return Promise.reject();
          }
          this.tableList = res.data;
          this.dataLimit.total = res.total;
          this.dataLimit.pages = res.pages;
          // // 选中行
          // setTimeout(() => {
          //   this.tableList.forEach((row, index) => {
          //     if (row.isBind) {
          //       this.$refs.multipleTable.toggleRowSelection(row, true);
          //     } else {
          //       this.$refs.multipleTable.toggleRowSelection(row, false);
          //     }
          //   });
          // }, 1000);
          this.cameraTableLoading = false;
          //load.close();
        })
        .catch((error) => {
          //load.close();
          this.cameraTableLoading = false;
          this.$message.error(error.message);
        });
    },
    /**
     * 查询表格已选数据
     */
    CameraBind() {
      let params = {};
      params = {
        id: this.id,
        data: {
          currPage: this.dataLimit2.currPage,
          pageSize: this.dataLimit2.pageSize,
          openAppId: this.appId,
          regionCode: this.dataLimit2.regionCode, //
          roadId: this.dataLimit2.shouldRoad, //
          organizationId: this.dataLimit2.organizationId,
          classify: this.dataLimit2.classify, //
          cameraStatus: this.dataLimit2.cameraStatus,
          onlineStatus: this.dataLimit2.onlineStatus,
          cameraName: this.dataLimit2.cameraName,
          cameraType: this.dataLimit2.cameraType,
          regionName: this.dataLimit2.regionName,
          roadName: this.dataLimit2.roadName,
        },
      };
      this.$api.CameraBind(params).then((res) => {
        if (res.code != 200) {
          return Promise.reject();
        }
        this.tableList2 = res.data;
        this.dataLimit2.total = res.total;
        this.dataLimit2.pages = res.pages;
        // 选中行
        // setTimeout(() => {
        //   this.tableList2.forEach((row, index) => {
        //     if (row.isBind) {
        //       this.$refs.multipleTable.toggleRowSelection(row, true);
        //     } else {
        //       this.$refs.multipleTable.toggleRowSelection(row, false);
        //     }
        //   });
        // }, 1000);
      });
    },

    //选择相机类型
    changeCameraType(val) {
      this.dataLimit.cameraType = val;
    },
    //选择管辖单位
    changeJurisdictionUnit(val) {
      this.dataLimit.jurisdictionUnit = val.pop().toString();
    },
    //选择路线
    changeRoad() {},
    //搜索table
    queryList() {
      let obj = {
        cameraType: this.dataLimit.cameraType,
        roadId: this.dataLimit.roadId,
        organizationName: this.dataLimit.jurisdictionUnit,
        kmPileMax: this.dataLimit.kmPileMax,
        kmPileMin: this.dataLimit.kmPileMin,
      };
      this.query();
      this.CameraBind();
    },
    //重置
    clearList() {
      this.dataLimit.cameraType = '';
      this.dataLimit.roadId = '';
      this.dataLimit.jurisdictionUnit = '';
      this.dataLimit.regionCode = ''; //
      this.dataLimit.shouldRoad = ''; //
      this.dataLimit.classify = ''; //
      this.dataLimit.cameraStatus = '';
      this.dataLimit.onlineStatus = '';
      this.dataLimit.cameraName = '';
      this.dataLimit.organizationId = '';
      this.query();
    },
    queryRoadList(orgId) {
      let _this = this;
      let params = {
        currPage: 0,
        pageSize: 0,
      };
      this.$api
        .getRoadsByOrgId(params)
        .then((data) => {
          if (data.code !== 200) {
            return Promise.reject();
          }
          _this.dataLimit.roadList = data.data;
        })
        .catch(() => {});
    },
    //管辖单位
    queryOrgList(regionCode) {
      let _this = this,
        params = {};
      if (regionCode) params.regionCode = regionCode;
      this.$api.getOrgTree(params).then((data) => {
        if (data.code !== 200) {
          return Promise.reject();
        }
        let nlist = data.data;
        _this.dataLimit.orgTreeList = nlist;
      });
      // .catch(error => {
      //   v.$message({
      //     message:
      //       "获取组织架构树失败! [" + error.code + "]: " + error.message,
      //     type: "error"
      //   });
      // });
    },
    //选择tree节点
    handleTreenode(val) {
      this.dataLimit.organizationId = val.organizationId;
      this.query();
    },
    clearCameraList() {
      this.removeCamera = []; //清楚数
      this.dataLimit = {
        shouldRoad: '',
        cameraType: '',
        kmPileMin: '',
        kmPileMax: '',
        cameraTypeList: [
          { cameraName: '监控型枪机', cameraType: '1' },
          { cameraName: '监控型球机', cameraType: '2' },
          { cameraName: '全景机', cameraType: '3' },
          { cameraName: '抓拍机', cameraType: '4' },
        ],
      };
      this.dataRoleDialogVisible = false;
    },
    //保存摄像机数据权限
    bindCameraData() {
      let id = this.id;
      let addCameras = this.bindCameraList;
      let obj = {
        addCameras,
      };
      let instructions = {
        module: '资源管理',
        page: '开放管理',
        feature: '添加数据权限',
        description: `添加${this.appForm.appName}的数据权限`,
      };

      this.$api.bindCameraData(id, obj, instructions).then((res) => {
        if (res.code === 200) {
          this.$message({
            message: '数据保存成功',
            type: 'success',
          });
          this.dataLimit = {
            shouldRoad: '',
            cameraType: '',
            kmPileMin: '',
            kmPileMax: '',
            cameraTypeList: [
              { cameraName: '监控型枪机', cameraType: '1' },
              { cameraName: '监控型球机', cameraType: '2' },
              { cameraName: '全景机', cameraType: '3' },
              { cameraName: '抓拍机', cameraType: '4' },
            ],
          };
          this.addCameras = [];
          this.query();
          // this.CameraBind();
        }
      });
    },
    bindCameraData2() {
      let id = this.id;
      let delCameras = this.bindCameraList;
      let obj = {
        delCameras,
      };
      let instructions = {
        module: '资源管理',
        page: '开放管理',
        feature: '添加数据权限',
        description: `添加${this.appForm.appName}的数据权限`,
      };

      this.$api.bindCameraData(id, obj, instructions).then((res) => {
        if (res.code === 200) {
          this.$message({
            message: '数据保存成功',
            type: 'success',
          });
          this.dataLimit = {
            shouldRoad: '',
            cameraType: '',
            kmPileMin: '',
            kmPileMax: '',
            cameraTypeList: [
              { cameraName: '监控型枪机', cameraType: '1' },
              { cameraName: '监控型球机', cameraType: '2' },
              { cameraName: '全景机', cameraType: '3' },
              { cameraName: '抓拍机', cameraType: '4' },
            ],
          };
          this.delCameras = [];
          this.CameraBind();
          this.query();
        }
      });
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
  },
};
</script>

<style lang="less" scoped>
.beDone {
  /deep/.el-icon-arrow-right:before {
    content: '';
  }
}
.keyRow {
  height: 100%;
  overflow-y: auto;
}
/deep/.el-table th,
.el-table tr {
  background: rgba(235, 239, 243, 1);
}
/*/deep/ .el-table__row {
  background: #f7f9fa;
}*/
.btn-color {
  background: #00b8ff;
}
.grary-button {
  background: #cccccc;
}
.key-reset-btn {
  display: inline-block;
  margin-left: 20px;
  color: #00b8ff;
  cursor: pointer;
}
.limite-B {
  width: 100%;
  height: 560px;
  display: flex;
  justify-content: 'space-between';
  .dataBox-L {
    border: 1px solid rgba(213, 218, 223, 1);
    border-left: 0;
    padding: 10px;
    width: 20%;
    height: 100%;
    overflow-y: auto;
  }
  .dataBox-R {
    width: 80%;
    border: 1px solid rgba(213, 218, 223, 1);
    border-left: 0;
    border-right: 0;
    padding: 10px;
    height: 100%;
    overflow-y: auto;
  }
}

.float {
  float: left;
  padding-bottom: 20px;
}
.dialog-footer {
  padding-top: 0;
}
.header-t {
  height: 30px;
  display: flex;
  justify-content: 'space-between';
  //align-items: center;
  margin-bottom: 10px;
  .left {
    width: 50%;
  }
  .right {
    text-align: right;
  }
}

.open-manager-wrapper {
  /deep/ .el-collapse-item {
    margin-bottom: 10px;
    .el-collapse-item__header {
      height: auto;
      padding: 30px 5px;
      i.el-collapse-item__arrow {
        display: none;
      }
      .collapse-title-wrap {
        width: 100%;
        > div {
          height: 48px;
          & + div {
            border-left: 1px solid #e7eaed;
          }
        }
        /*h2:hover {
          font-size: 1.3rem;
          color: #1274ee;
        }*/
        h2 {
          line-height: 30px;
          position: relative;
          padding-left: 106px;
          font-size: 1.5rem;
          letter-spacing: 1px;
          margin: 15px 0 0;
          padding-top: 5px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          i {
            display: inline-block;
            width: 41px;
            height: 47px;
            position: absolute;
            left: 40px;
            top: 50%;
            transform: translateY(-50%);
            background-image: url('../../../assets/images/icon/listwrap.png');
            background-repeat: no-repeat;
            background-size: auto 100%;
            background-position: center;
          }
          span {
            letter-spacing: 0;
            display: block;
            color: #b3b3b3;
            font-weight: normal;
            font-size: 0.875rem;
          }
        }
        .title-item-wrap {
          line-height: 48px;
          padding-left: 90px;
        }
        .title-icons-wrap {
          text-align: center;
          i {
            font-size: 1.4rem;
            line-height: 48px;
            & + i {
              margin-left: 12px;
            }
            &:hover {
              color: #1274ee;
            }
            &.error:hover {
              color: #ff5151;
            }
          }
        }
      }
    }

    .el-collapse-item__wrap {
      background: #f7f9fa;
      .el-collapse-item__content {
        height: auto;
        padding: 10px;
        margin: 0;
        border-top: 1px solid #f1f3f3;
        overflow-y: auto;

        .row-table-head {
          line-height: 40px;
          background-color: #ebeff3;
          div {
            padding: 0 0 0 30px;
          }
        }
        .row-table-body {
          height: 400px;
          padding-top: 10px;
          .el-col {
            line-height: 38px;
            padding: 0 0 0 30px;
          }
        }

        /*.el-table{
            background: transparent;
            max-height: 400px;
            th,td{
              padding-left: 15px;
              border: 0 none;
              background: transparent;
            }
            tr{
              background: transparent;
            }
            th{
              background: #ebeff3;
            }
          }*/
      }
    }
  }
}
.selectBox {
  .el-select {
    width: 180px !important;
  }
}
</style>
