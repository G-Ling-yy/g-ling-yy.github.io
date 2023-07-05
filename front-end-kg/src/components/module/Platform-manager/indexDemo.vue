<template>
  <div class="content-wrapper">
      <div class="breadcrumb-wrapper" v-if="isFromDash">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/dashboard' }">
            <i class="iconfont icondashboard"></i>
          </el-breadcrumb-item>
          <!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
          <el-breadcrumb-item>对接管理</el-breadcrumb-item>
          <el-breadcrumb-item>平台管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    <div v-if="!showPlatFormDetail" class="platForm-Box">
      <div class="camera-search-display camera-manage-search">
        <div :class="isAllHeight % 2 != 0 ? 'common-search-all-h' : 'search-wrapper'">
          <el-row>
            <el-col :span="20">
              <el-form
                :inline="true"
                hide-required-asterisk
                :model="searchValidateForm"
                ref="searchValidateFormRef"
              >
                <el-form-item class="belongsToProvince" label="省份" prop="regionCode">
                  <el-select
                    v-model="searchValidateForm.regionCode"
                    style="width: 150px;"
                    placeholder="请选择"
                  >
                    <el-option
                      style="width: 150px;"
                      v-for="item in provinceOptions"
                      :key="item.regionCode"
                      :label="item.regionName"
                      :value="item.regionCode"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="所属组织" prop="organizationId">
                  <el-select
                    v-model="searchValidateForm.organizationId"
                    style="width: 150px;"
                    placeholder="请选择"
                  >
                    <el-option
                      style="width: 150px;"
                      v-for="item in devicePlatData"
                      :key="item.organizationId"
                      :label="item.organizationName"
                      :value="item.organizationId"
                    ></el-option>
                  </el-select>
                  <!-- <el-cascader
                    v-model="searchValidateForm.organizationId"
                    clearable
                    :show-all-levels="false"
                    :options="UserOrgTreeChild"
                    :props="orgCodeProps"
                    style="width: 150px"
                    @change="organizationIdChange"
                    @clear="organizationIdChange"
                  ></el-cascader> -->
                </el-form-item>
              </el-form>
            </el-col>
            <!-- <el-col :span="4" style="text-align: right;">
            <el-dropdown class="add" trigger="click">
              <span class="el-dropdown-link">
                <i></i>
              </span>
              <el-dropdown-menu slot="dropdown" style="width: 150px;">
                <el-dropdown-item>
                  <div @click="addOnly()">新增</div>
                </el-dropdown-item>
                <el-dropdown-item>
                  <div @click="uploadDialogVisible = true">批量新增</div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            </el-col>-->
          </el-row>
        </div>
        <div class="search-btn-right">
          <div class="btn-padding">
            <el-button type="primary" class="query" @click="submitSearchForm">查询</el-button>
            <el-button type="primary" class="reset" @click="resetForm">重置</el-button>
          </div>
          <div>
            <div class="have-more-info">
              <el-dropdown class="add" trigger="click">
                <span class="el-dropdown-link">
                  <i></i>
                </span>
                <el-dropdown-menu slot="dropdown" style="width: 150px;">
                  <el-dropdown-item>
                    <div @click="addOnly()">新增</div>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <div @click="uploadDialogVisible = true">批量新增</div>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
          <!-- <span @click="seachMore" v-if="isAllHeight%2==0" class="have-more-info">更多</span>
          <span @click="seachMore" v-if="isAllHeight%2!=0" class="have-more-info">收起</span>-->
        </div>
      </div>
      <div class="transcoding-list-wrapper">
        <div class="content" v-for="(item, index) in devicePlatData" :key="index">
          <div class="content-header">
            <div>
              <!-- <i class="onlineStatusOk" v-if="item.onlineStatus == 1"></i> -->
              <!-- <i v-else class="onlineStatusNo"></i> -->
              <span style="padding-left:20px;">{{ item.platformName }}</span>
            </div>
            <el-dropdown trigger="hover">
              <span class="el-dropdown-link">
                操作
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <div class="con-bTn">
                  <!-- <div class="normal">
                    <span @click="updateOpenStatus(item, '1')">开流</span>
                    <span @click="updateOpenStatus(item, '0')">关流</span>
                  </div>-->
                  <div class="normal">
                    <span @click="updatePlayStatus(item, '1')">显示</span>
                    <span @click="updatePlayStatus(item, '0')">隐藏</span>
                  </div>
                  <div class="normal">
                    <span @click="updateOpenStatus(item, '1')">开放</span>
                    <span @click="updateOpenStatus(item, '0')">关闭</span>
                  </div>
                  <div class="normal">
                    <span class="Modify" @click="editPlatForm(item)">编辑</span>
                  </div>
                  <div class="normal">
                    <span class="Del" @click="delDataPlatForm(item)">删除</span>
                  </div>
                  <!-- <div class="normal">
                    <span @click="play(1, item.transcodingId, $event)">播放</span>
                    <span @click="play(0, item.transcodingId, $event)">停止</span>
                  </div>-->
                  <div class="bigBox">
                    <span @click="exportAccessorInfo(item)">导出对接参数</span>
                  </div>
                  <div class="bigBox" @click="exportCameraInfo(item)">
                    <span>导出摄像机数据</span>
                  </div>
                </div>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div class="content-L" @click="cameraInfo(item)">
            <p>
              <span>省份：</span>
              <span style="color: #192b3d; ">{{ item.regionName }}</span>
            </p>
            <p>
              <span>所属组织：</span>
              <span style="color: #192b3d;">{{ item.organizationName }}</span>
            </p>
            <p>
              <span class="datacontent-p">已接入量：</span>
              <span style="color: #192b3d;">
                {{
                item.alreadyChannelNum
                }}
              </span>
              <span style="padding-left:15px;">
                (在线:
                <span style="color: #33CC00;">
                  {{
                  item.onlineChannelNum
                  }}
                </span>
              </span>
              <span style="padding-left:10px;">
                离线:
                <span style="color: #FF0000;">
                  {{
                  item.offlineChannelNum
                  }}
                </span>
                )
              </span>
            </p>

            <p>
              <span>联系人：</span>
              <span style="color: #192b3d; padding-bottom:0">
                {{
                item.contactPerson
                }}
              </span>
            </p>
            <p>
              <span class="telPhone">联系电话：</span>
              <span style="color: #192b3d;">{{ item.contactPhone }}</span>
            </p>
          </div>
        </div>
      </div>
      <div class="table-pagination">
                <p class="total-pagination">共{{deviceTotal}}条</p>
      <el-pagination
        background
        layout=" prev, pager, next, sizes, jumper "
        :total="deviceTotal"
        :page-size="pageSize"
        :current-page="currentPage"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
      </div>
      <!-- 新增修改对话框 -->
      <el-dialog
        :title="myTitle"
        :visible.sync="dialogVisible"
        width="35%"
        @close="addDialogClose"
        custom-class="gd-custom-dialog"
        v-dialogDrag
        :append-to-body="true"
        :close-on-click-modal="false"
        >
        <el-form
          :model="gatewayInfo"
          ref="ruleAddPlatformForm"
          label-width="100px"
          class="demo-ruleForm"
          label-position="left"
          :rules="addPlatformFormRules"
        >
          <div class="labeletop">
            <i class="basicBgc"></i>
            <span class="basicInfo">基础信息</span>
          </div>
          <!-- <el-form-item class="commonality" label="平台名称:" prop="regionCode">
          <el-select class="inputstyle" v-model="addPlatformForm.regionCode" placeholder="请选择">
            <el-option
              v-for="item in provinceOptions"
              :key="item.regionCode"
              :label="item.regionName"
              :value="item.regionCode + ''"
            ></el-option>
          </el-select>
          </el-form-item>-->
          <el-form-item class="commonality" label="名称:" prop="platformName">
            <el-input class="inputstyle" v-model="gatewayInfo.platformName"></el-input>
          </el-form-item>
          <el-form-item class="commonality" label="所属机构:" prop="organizationId">
            <el-cascader
              v-model="gatewayInfo.organizationId"
              clearable
              :show-all-levels="false"
              :options="UserOrgTreeChild"
              :props="orgCodeProps"
              style="width: 150px"
              @change="orgChange"
              @clear="orgChange"
            ></el-cascader>
          </el-form-item>
          <div class="labeletop">
            <i class="basicBgc"></i>
            <span class="basicInfo">接口信息</span>
          </div>
          <el-form-item class="commonality" label="访问地址:" prop="urlAddress">
            <el-select v-model="gatewayInfo.urlHeaders" style="width:90px;margin-right: 0px;">
              <el-option label="http://" value="http://"></el-option>
              <el-option label="https://" value="https://"></el-option>
            </el-select>
            <el-input class="inputstyle" v-model="gatewayInfo.urlAddress"></el-input>
          </el-form-item>
          <el-form-item class="commonality" label="平台编号:" prop="deviceCode">
            <el-input class="inputstyle" v-model="gatewayInfo.deviceCode"></el-input>
          </el-form-item>
          <el-form-item class="commonality" label="平台User:" prop="deviceUser">
            <el-input class="inputstyle" v-model="gatewayInfo.deviceUser"></el-input>
          </el-form-item>
          <el-form-item class="commonality" label="平台Token:" prop="deviceToken">
            <el-input class="inputstyle" v-model="gatewayInfo.deviceToken"></el-input>
          </el-form-item>

          <el-form-item class="commonality" label="私钥:" style="margin-top: 10px;" prop="file">
            <!-- 上传文件 -->
            <span v-if="gatewayInfo.hasPrivateKey==1" style="padding-right:10px">已有私钥</span>
            <input type="file" id="fileupload" name="upload" ref="tokenFiles" @change="fileChange" />
          </el-form-item>
          <div class="labeletop">
            <i class="basicBgc"></i>
            <span class="basicInfo">联系人信息</span>
          </div>
          <el-form-item class="commonality" label="联系人:" prop="contactPerson">
            <el-input class="inputstyle" v-model="gatewayInfo.contactPerson"></el-input>
          </el-form-item>
          <el-form-item class="commonality" label="联系电话:" prop="contactPhone">
            <el-input class="inputstyle" v-model="gatewayInfo.contactPhone"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogClose">取 消</el-button>
          <el-button type="primary" @click="addPlatform">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 批量增加平台对话框 -->
      <el-dialog
        title="上传文件"
        :visible.sync="uploadDialogVisible"
        width="20%"
        :before-close="handleClose"
        custom-class="gd-custom-dialog"
        v-dialogDrag
        :append-to-body="true"
        :close-on-click-modal="false"
      >
        <div>
          请先下载
          <span
            class="copy"
            @click="exportPlatFrom"
            style="color:#0062ff;cursor: pointer;    text-decoration: underline;"
          >模板</span>
          ,填写好信息后上传
        </div>
        <!-- <span>
          请先下载
          <span
            class="templateStyle"
            @click="exportPlatFrom"
            style="color:#0062ff;cursor: pointer;    text-decoration: underline;"
          >模板</span>，填写好信息后上传!
        </span>-->
        <el-upload
          action="http://47.99.190.75:10001/v1/device/platforms/import"
          class="upload-demo"
          :headers="uploadHeaders"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          multiple
          :file-list="fileList"
          ref="mutiUpload"
          :auto-upload="false"
          :on-success="batchUpload"
        >
          <div class="uploadBtn">点击上传</div>
          <!-- <div class="uploadFile">
            <span class="uploadBgc"></span>
            <el-button class="uploadBtn" slot="trigger">点击上传</el-button>
            <p class="instructions">支持扩展名：.xlsx，.xls</p>
          </div>-->
          <!-- <p class="instructions">支持扩展名：.xlsx，.xls</p> -->
        </el-upload>支持扩展名：.xlsx,.xls
        <span slot="footer" class="dialog-footer">
          <el-button @click="uploadDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmationPreview">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 批量增加信息确认 -->
      <el-dialog
        title="信息确认"
        :visible.sync="batchAddDialogVisible"
        width="60%"
        :before-close="handleClose"
        custom-class="gd-custom-dialog"
        v-dialogDrag
        :append-to-body="true"
        :close-on-click-modal="false"
      >
        <el-card class="box-card confirmationBox">
          <div v-for="o in 13" :key="o" class="text item confirmation">{{ "列表内容 " + o }}</div>
        </el-card>
        <span slot="footer" class="dialog-footer">
          <el-button @click="batchAddDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="batchAddDialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <edit-table
      ref="table"
      :data="batchWrongData"
      :columns="batchWrongColumns"
      @confirm-data="confirmBatchData"
    ></edit-table>
    <!-- @confirm-data="confirmBatchData" -->
    <!-- 摄像机信息查询 -->
    <transcodingDetail
      v-if="showPlatFormDetail"
      :selectedTran="selectedTran"
      :province="provinceOptions"
      ref="platFormDetail"
      @on-back="showPlatFormDetail= false"
    ></transcodingDetail>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import $http from "../../../filters/http";
import api from "../../../api/index.js";
import DevicePlatform from "./components/DevicePlatform-info.vue";
import { log } from "util";
import { Promise } from "q";
import store from "../../../store";
import transcodingDetail from "../../../components/controlPlatform/transcodingDetail";
import editTable from "../../editTable.vue";
export default {
  components: {
    DevicePlatform,
    transcodingDetail,
    editTable
  },

  data() {
    let Authorization = store.state.userInfo
      ? store.state.userInfo.Authorization
      : "";
    return {
      gatewayInfo: {
        urlHeaders: 'http://'
      },
      selectedTran: {},
      showPlatFormDetail: false,
      uploadHeaders: {
        Authorization: Authorization
      },
      isAllHeight: 0,
      myTitle: "",
      //新增修改平台对话框
      dialogVisible: false,
      // 批量增加平台对话框
      uploadDialogVisible: false,
      // 批量增加信息确认
      batchAddDialogVisible: false,
      // 摄像机信息对话框
      cameraInfoListDialogVisible: false,
      // 省平台名称
      appName: "",
      searchValidateForm: {
        regionCode: "", //省份
        appName: "", //省平台名称
        organizationId: "" //组织id
      },
      addPlatformFormRules: {
        regionCode: [
          { required: true, message: "请选择省份", trigger: "blur" }
        ],
        platformName: [
          { required: true, message: "请输入平台名称", trigger: "blur" }
        ],
        organizationId: [
          { required: true, message: "请输入管辖单位", trigger: "blur" }
        ],
        contactPerson: [
          { required: true, message: "请输入联系人", trigger: "blur" }
        ],
        contactPhone: [
          { required: true, message: "请输入电话", trigger: "blur" }
        ]
        // responsiblePerson: [
        //   { required: true, message: "请输入联系人", trigger: "blur" }
        // ],
        // phone: [{ required: true, message: "请输入联系电话", trigger: "blur" }]
      },
      //新增表单
      addPlatformForm: {
        regionCode: "", //省份
        platformName: "", //名称
        note: "", //备注
        ipAddress: "", //访问地址
        platformUser: "", //User
        platformCode: "", //省平台编号
        organizationName: "", //业主单位
        organizationId: "",
        responsiblePerson: "", //联系人
        phone: "", //电话
        file: "",
        transcodingToken: "",
        realmName: "",
        pullSsl: null,
        hasPrivateKey: 0
      },
      appCode: "",
      editPlatformForm: [],
      devicePlatData: [], //得到查询结果存放此数组中
      // 控制编辑还是新增
      addAndmodify: "add",
      //摄像机条件查询表单
      cameraInfoForm: {
        startMileage: "",
        endMileage: "",
        classifyCode: "", //所属类型
        cameraType: "", //摄像机类型
        cameraStatus: "" //摄像机状态
      },
      dimensionList: [],
      dimensionType: [],
      // 摄像机类型
      cameraTypeList: [
        {
          cameraValue: "1",
          cameraName: "监控型枪机"
        },
        {
          cameraValue: "2",
          cameraName: "监控型球机"
        },
        {
          cameraValue: "3",
          cameraName: "全景机"
        },
        {
          cameraValue: "4",
          cameraName: "抓拍机"
        }
      ],
      cameraTableLoading: false,
      // 摄像机状态
      cameraStateList: [
        {
          typeValue: 0, //state
          typeName: "离线" //cameraState
        },
        {
          typeValue: 1, //state
          typeName: "正常" //cameraState
        },
        {
          typeValue: 2, //state
          typeName: "故障" //cameraState
        }
      ],

      tableList: [],

      fileList: [],
      provinceOptions: [],
      value: "",
      currentPage4: 1,
      dialogVisible: false,
      addFormVisible: false,
      multipleSelection: [],
      currPage: 1,
      pageSize: 10,
      total: 0,
      deleteId: "",
      editFormVisible: false,
      orgCodeProps: {
        expandTrigger: "hover",
        value: "organizationId",
        label: "organizationName",
        children: "childList",
        checkStrictly: true
      },
      batchWrongColumns: [
        {
          title: "平台名称",
          key: "platformName",
          editType: "input",
          width: 200
        },
        {
          title: "组织名称",
          key: "organizationName",
          editType: "input",
          width: 200
        },
        {
          title: "user",
          key: "platformCodePeer",
          editType: "input",
          width: 200
        },
        {
          title: "设备编号",
          key: "deviceCodePeer",
          editType: "input",
          width: 100
        },
        {
          title: "token",
          key: "authTokenPeer",
          editType: "input",
          width: 200
        },
        {
          title: "访问地址",
          key: "gw1Address",
          editType: "input",
          width: 100
        },
        {
          title: "联系人",
          key: "responsiblePerson",
          editType: "input",
          width: 100
        },
        {
          title: "手机号",
          key: "phone",
          editType: "input",
          width: 100
        }
      ],
      batchWrongData: [],
      tip: {
        success: 0
      },
      isFromDash: false,
      pageSize: 10,
      currentPage: 1,
      deviceTotal: 0
    };
  },
  computed: {
    ...mapState(["DPList", "UserOrgTreeChild"])
  },
  created() {
    if(this.$route.query.isFromDash){
      this.isFromDash = true;
    }
    this.getPlatFormdata();
  },
  watch: {
    // 关闭弹出框清空form数据
    // uploadDialogVisible(res) {
    //   if (!res) {
    //     this.emptyFormData();
    //   }
    // }
  },
  methods: {
    ...mapActions(["getDevicePlatformList", "addDevicePlatform", "getOrgTree"]),
    handleSizeChange(newSize) {
      this.pageSize = newSize;
      this.currentPage = 1;
      this.getPlatFormdata();
    },
    handleCurrentChange(newPage) {
      this.currentPage = newPage;
      this.getPlatFormdata();
    },
    /**
     * 单位列表change事件
     * @param val
     */
    orgChange(val) {
      if (val && val.length) {
        // let orgId=val.shift()
        let orgIdTwo=val[1];
        let orgIdone = val[val.length - 1];
        this.addPlatformForm.organizationId =orgIdone;
        this.addPlatformForm.regionCode=orgIdTwo
      }
    },
    // 批量上传成功
    batchUpload(response, file, fileList) {
      this.clearDialogForm();
      if (response.code !== 200) {
        this.$message({
          type: "error",
          message: response.message
        });
        // return;
      }
      console.log(response.data)
      this.tip.success = response.data ? response.data.success : 0;
      if (response.data && response.data.error && response.data.error.length) {
        this.batchWrongData = response.data.error;
        _.each(this.batchWrongColumns, it => {
          if (it.key === "regionName") {
            it.optionsList = _.map(this.options, v => {
              return {
                value: v.regionCode,
                label: v.regionName
              };
            });
          }
          if (it.key === "organizationName") {
            it.optionsList = this.options1;
          }
          if (it.key === "smName") {
            it.optionsList = _.map(this.options3, v => {
              return {
                value: v.smId,
                label: v.smName
              };
            });
          }
          if (it.key === "vendorName") {
            it.optionsList = _.map(this.options2, v => {
              return {
                value: v.codeValue,
                label: v.codeName
              };
            });
          }
        });
        this.$nextTick(() => {
          this.$refs.table.showConfirmTable(true);
        });
      } else {
        this.$nextTick(() => {
          this.$refs.table.showConfirmTable(false);
        });
        this.$message({
          type: "success",
          message: "成功上传" + response.data.success + "条"
        });
      }
    },
    // getErrorData(data) {
    //   this.batchWrongData = data;
    //   this.$nextTick(() => {
    //     this.$refs.table.showConfirmTable(true);
    //   });
    // },
   confirmBatchData(data) {
      this.$http.post('/device/platforms/batch', {
        platformList: data
      }).then(res => {
        let data = res.data;
        if (data.code === 200) {
          if (data.data.error) {
            this.batchWrongData = data.data.error;
          } else {
            this.$refs.table.showConfirmTable(false);
            this.$message({
              message: '成功入库' + data.data.success + '条',
              type: 'success'
            });
          }
        } else {
          this.$message({
            message: data.data.message,
            type: 'error'
          })
        }
      })
    },

    /**
     * 获取管辖单位
     */
    /**
     * 单位列表change事件
     * @param val
     */
    organizationIdChange(val) {
      if (val) {
        this.searchValidateForm.organizationId = val[val.length - 1];
      }
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    /**
     * 分页导航 改变每页展示数量
     * @param index
     */
    handleSizeChange(index) {
      this.pageSize = index;

      this.query();
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },

    showdeleteVisiable(e) {
      this.dialogVisible = true;
      this.deleteId = e.roadId;
    },

    editCanse() {
      this.editFormVisible = false;
      this.addForm = {};
    },
    // -----------------------------  creat 4/8  ---------------------------
    /**
     * 分页导航
     * @param val
     */
    handlePageChange(val) {
      this.currPage = val;

      this.query();
    },
    // 获取省平台列表
    getPlatFormdata() {
      let params = {
        regionCode: this.searchValidateForm.regionCode,
        organizationId: this.searchValidateForm.organizationId,
        pageSize: this.pageSize,
        currPage: this.currentPage
      };
      this.$api.getDevicePlatformList(params).then(res => {
        if (res.code == 200) {
          this.devicePlatData = res.data;
          console.log(this.devicePlatData,"wsssss")
          this.deviceTotal = res.total;
        }
      });
    },
    // 根据省 搜索得到平台列表
    submitSearchForm() {
      let params = {
        regionCode: this.searchValidateForm.regionCode,
        organizationId: this.searchValidateForm.organizationId,
        pageSize: 0,
        currPage: 1
      };
      this.$refs.searchValidateFormRef.validate(valid => {
        if (valid) {
          this.$api.getDevicePlatformList(params).then(res => {
            if (res.code == 200) {
              this.devicePlatData = res.data;
              // this.$message({
              //   message: "未搜索到平台",
              //   type: "warning"
              // });
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 重置表单
    resetForm() {
      this.$refs.searchValidateFormRef.resetFields();
      this.submitSearchForm();
    },
    resetcameraForm() {
      this.$refs.searchcameraFormRef.resetFields();
      this.query();
    },
    // 获取省份列表
    loadArea() {
      this.$api
        .getProvince({
          regionLevel: 1
        })
        .then(res => {
          if (res.code != "200") {
            return Promise.reject;
          }

          this.provinceOptions = res.data;
          // this.provinceOptions.unshift({
          //   regionCode: "",
          //   regionName: "全国",
          //   alias: "全国",
          //   parentRegionCode: "0",
          // });
        })
        .catch(() => {});
    },
    emptyFormData() {
      for (let key in this.addPlatformForm) {
        this.addPlatformForm[key] = "";
      }
    },
    clearDialogForm() {
      this.$refs.mutiUpload.clearFiles();
    },

    addOnly() {
      this.myTitle = "新增";
      this.addAndmodify = "add";
      this.gatewayInfo.hasPrivateKey = 0;
      this.dialogVisible = true;
      this.$refs.ruleAddPlatformForm.resetFields();
      this.clearFile();
      this.emptyFormData();
    },
    //新增平台
    addPlatform() {
      if (this.addAndmodify == "add") {
        this.$refs.ruleAddPlatformForm.validate(valid => {
          if (!valid) return;
          var params = {
            params: {
              platformCodePeer: this.gatewayInfo.deviceCode, //user
              platformName: this.gatewayInfo.platformName, //平台名称
              authTokenPeer: this.gatewayInfo.deviceToken, //token
              deviceCodePeer: this.gatewayInfo.deviceCode, //设备编号
              organizationId: this.addPlatformForm.organizationId
                ? this.addPlatformForm.organizationId
                : this.gatewayInfo.organizationId, //业主单位

                regionCode:this.addPlatformForm.regionCode,
              // organizationId: 1,//组织ids
              responsiblePerson: this.gatewayInfo.contactPerson,
              phone: this.gatewayInfo.contactPhone,
              gw1Address: this.gatewayInfo.urlHeaders + this.gatewayInfo.urlAddress
              // regionCode: this.addPlatformForm.regionCode,
              // appName: this.addPlatformForm.platformName,
              // note: this.addPlatformForm.note,
              // gw1Address:
              //   this.addPlatformForm.realmName + this.addPlatformForm.ipAddress, //访问地址
              // platformCodePeer: this.addPlatformForm.platformUser, //user
              // platformName: this.addPlatformForm.platformName, //平台名称
              // authTokenPeer: this.addPlatformForm.transcodingToken, //token
              // deviceCodePeer: this.addPlatformForm.platformCode, //设备编号
              // organizationId: this.addPlatformForm.organizationId, //业主单位
              // // organizationId: 1,//组织ids
              // responsiblePerson: this.addPlatformForm.responsiblePerson,
              // phone: this.addPlatformForm.phone
              // pullSsl: this.addPlatformForm.realmName
            },
            formData: this.addPlatformForm.file
              ? {
                  file: this.addPlatformForm.file
                }
              : null,
              instructions: {
                module: "资源管理",
                page: "对接管理-平台管理",
                feature: '新增平台',
                description:
                  "新增平台: " + this.gatewayInfo.platformName
              }
          };
          this.$api.addDevicePlatform(params).then(msg => {
            if (msg.code == 200) {
              this.$message.success("新增平台成功");
              this.dialogVisible = false;
              this.getPlatFormdata();
              this.$refs.ruleAddPlatformForm.resetFields();
              this.emptyFormData();
              this.addPlatformForm.file = "";
            } else {
              this.$message.error("新增平台失败");
            }
          });
        });
      } else {
        this.$refs.ruleAddPlatformForm.validate(valid => {
          if (!valid) return;
          var params = {
            id: this.gatewayInfo.transcodingId,
            params: {
             gw1Address: this.gatewayInfo.urlHeaders + this.gatewayInfo.urlAddress,//访问地址
              platformCodePeer: this.gatewayInfo.deviceUser, //user
              platformName: this.gatewayInfo.platformName, //平台名称
              authTokenPeer: this.gatewayInfo.deviceToken, //token
              deviceCodePeer: this.gatewayInfo.deviceCode, //设备编号
              organizationId: this.addPlatformForm.organizationId
                ? this.addPlatformForm.organizationId
                : this.gatewayInfo.organizationId, //业主单位
                  regionCode:this.addPlatformForm.regionCode,
              responsiblePerson: this.gatewayInfo.contactPerson,
              phone: this.gatewayInfo.contactPhone
            },
            // params: {
            //   ...this.gatewayInfo
            // },
            //   gw1Address:
            //     this.addPlatformForm.realmName + this.addPlatformForm.ipAddress, //访问地址
            //   platformCodePeer: this.addPlatformForm.platformUser, //user
            //   platformName: this.addPlatformForm.platformName, //平台名称
            //   authTokenPeer: this.addPlatformForm.transcodingToken, //token
            //   deviceCodePeer: this.addPlatformForm.platformCode, //设备编号
            //   organizationName: this.addPlatformForm.organizationName, //业主单位
            //   // organizationId: 1,//组织ids
            //   responsiblePerson: this.addPlatformForm.responsiblePerson,
            //   phone: this.addPlatformForm.phone
            //   // pullSsl: this.addPlatformForm.realmName
            // },
            formData: this.addPlatformForm.file
              ? {
                  file: this.addPlatformForm.file
                }
              : null
          };
          this.$api
            .updateDevicePlatform(params)
            .then(msg => {
              // console.log(msg);
              if (msg.code == 200) {
                this.$message.success("修改平台成功");
                this.dialogVisible = false;
                this.getPlatFormdata();
                this.$refs.ruleAddPlatformForm.resetFields();
                this.emptyFormData();
                this.gatewayInfo = {
                  urlAddress: "", //访问地址
                  deviceUser: "", //user
                  platformName: "", //平台名称
                  deviceToken: "", //token
                  deviceCode: "", //设备编号
                  organizationId: "", //业主单位
                  platformCode: "",
                  // organizationId: 1,//组织ids
                  contactPerson: "",
                  contactPhone: "",
                  hasPrivateKey: ""
                };
                this.addPlatformForm.file = "";
              }
            })
            .catch(() => {
              this.$message.error("修改平台失败");
              this.dialogVisible = false;
            });
        });
      }
    },
    editPlatForm(item) {
      this.myTitle = "修改";
      this.addAndmodify = "edit";
      this.appCode = item.transcodingId;
      this.dialogVisible = true;
      // this.addPlatformForm.regionName = item.regionName; //省份
      // this.addPlatformForm.platformName = item.platformName; //名称
      // this.addPlatformForm.note = item.note; //备注
      // this.addPlatformForm.ipAddress = item.urlAddress; //访问地址
      // this.addPlatformForm.platformUser = item.platformUser; //User
      // this.addPlatformForm.platformCode = item.platformCode; //省平台编号
      // this.addPlatformForm.organizationId = item.organizationId; //所属机构 m没有
      // this.addPlatformForm.responsiblePerson = item.contactPerson; //联系人
      // this.addPlatformForm.phone = item.contactPhone; //电话
      // this.addPlatformForm.regionCode = item.regionCode;
      // this.addPlatformForm.transcodingToken = item.platformToken; //平台token
      // this.addPlatformForm.realmName = item.pullSsl;
      // this.addPlatformForm.hasPrivateKey = item.hasPrivateKey;
      this.getPlatformInfo(item.transcodingId);
    },
    //删除平台
    delDataPlatForm(item) {
      let params = {
        id: item.transcodingId,
        instructions: {
          module: "资源管理",
          page: "对接管理-平台管理",
          feature: '删除平台',
          description:
            "删除平台: " + item.platformName
        }
      };
      this.$confirm("确定删除吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(() => {
        this.$api.delDevicePlatform(params).then(msg => {
          if (msg.code == 200) {
            this.$message.success("删除平台成功");
            this.getPlatFormdata();
          } else {
            this.$message.error("删除平台失败");
          }
        });
      });
    },
    //0 关 1 开
    updateOpenStatus(item, openStatus) {
      var params = {
        transcodingId: item.transcodingId,
        status: {
          status: openStatus
        },
        instructions: {
          module: "资源管理",
          page: "对接管理-平台管理",
          feature: openStatus === 1 ? '开放' : '关闭',
          description:
            openStatus === 1 ? '开放' : '关闭' + item.platformName + '下所有摄像机'
        }
      };
      this.$api.updateOpenPlatform(params).then(res => {
        if (res.code == 200) {
          this.$message.success("操作成功");
        } else {
          this.$message.info(res.message);
        }
      });
    },
    //0 关闭 1 播放
    updatePlayStatus(item, playStatus) {
      console.log(item.transcodingId);
      var params = {
        transcodingId: item.transcodingId,
        status: {
          status: playStatus
        },
        instructions: {
          module: "资源管理",
          page: "对接管理-平台管理",
          feature: playStatus === 1 ? '显示' : '隐藏',
          description:
            playStatus === 1 ? '显示' : '隐藏' + item.platformName + '下所有摄像机'
        }
      };
      this.$api.updateApperPlatform(params).then(res => {
        if (res.code == 200) {
          this.$message.success("操作成功");
        } else {
          this.$message.info(res.message);
        }
      });
    },
    // 导出摄像机数据
    exportCameraInfo(item) {
      // var transcodingId = {
      //   transCodingId: item.transcodingId
      // };
      this.$http
        .get(
          "/base/cameras/download/camera-info?transcodingId=" +
            item.transcodingId,
          {
            responseType: "blob"
          }
        )
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

    //导出对接信息
    exportAccessorInfo(item) {
      var transcodingId = {
        transCodingId: item.transcodingId
      };
      this.$api
        .exportPlatAccessorInfo(transcodingId)
        .then(data => {
          var downloadElement = document.createElement("a");
          var href = window.URL.createObjectURL(data); // 创建下载的链接
          downloadElement.href = href;
          downloadElement.download = item.platformName+".xlsx"; // 下载后文件名

          document.body.appendChild(downloadElement);
          downloadElement.click(); // 点击下载
          document.body.removeChild(downloadElement); // 下载完成移除元素
          window.URL.revokeObjectURL(href); // 释放掉blob对象
        })
        .catch(error => {
          this.$message({
            message: "对接信息导出失败! ",
            type: "error"
          });
        });
    },

    cameraInfo(info) {
      this.showPlatFormDetail = true;
      this.selectedTran = info;
    },
    /**
     * 获取平台详情
     */
    getPlatformInfo(info) {
      let params = {
        id: info
      };
      this.$api.getPlatFormDetails(params).then(res => {
        if (res.code == 200) {
          let address = res.data.urlAddress.split('//');
          this.gatewayInfo = {
            ...res.data,
            urlAddress: address[1],
            urlHeaders: address[0] + '//'
          };
          // this.gatewayInfo.createDate = this.timeFormat(
          //   this.gatewayInfo.gmtCreate
          // );
        }
      });
      return true;
      // .catch(error => {
      //   this.$message.error(error.message);
      // });
    },
    //  获取摄像机列表
    query(info) {
      let _this = this;
      //let load=Loading.service(this.loadOption);
      let params = {
        currPage: this.currPage,
        pageSize: this.pageSize,
        //         cameraName: this.filters.cameraName,
        kmPileMax: this.cameraInfoForm.endMileage,
        kmPileMin: this.cameraInfoForm.startMileage, // // regionId: this.areaValue,
        //         regionId: this.filters.provinceCode, //
        //         organizationId: this.filters.organizationId, //
        //         roadCode: this.filters.roadCode, //
        //         derectionCode: this.filters.direction, //
        classifyCode: this.cameraInfoForm.classifyCode, //所属类别
        transcodingId: info && info.transcodingId ? info.transcodingId : "",
        cameraType: this.cameraInfoForm.cameraType, // appName: "",
        // groupId: '',
        cameraStatus: this.cameraInfoForm.cameraStatus //摄像机状态 // connectionWay: "",
        //         cameraNum: this.filters.cameraNumber
      };

      this.cameraTableLoading = true;
      this.$api.getCameraList(params).then(res => {
        if (res.code != 200) {
          return Promise.reject();
        }

        this.tableList = [];
        this.tableList = res.data;
        this.total = res.total;
        this.pages = res.pages;
        this.selectHandle = [];
        for (var i = 0; i < this.tableList.length; i++) {
          this.tableList[i].checkModel = false;
        }

        this.cameraTableLoading = false;
        //load.close();
      });
      // .catch(error => {
      //   //load.close();
      //   this.cameraTableLoading = false;
      //   this.$message.error(error.message);
      // });
    },
    UploadUrl: function() {
      return api.importPlatForm;
    },
    handlePreview(file, fileList) {
      console.log(file, fileList);
    },
    handleRemove() {},
    addDialogClose() {
      this.dialogVisible = false;
      this.$refs.ruleAddPlatformForm.resetFields();
      this.emptyFormData();
    },
    // 信息确认
    confirmationPreview() {
      // this.batchAddDialogVisible = true;
      this.uploadDialogVisible = false;
      this.$refs.mutiUpload.submit();
      this.getPlatFormdata();
    },
    // 复制token
    copyTXT(obj) {
      if (obj == null) {
        this.$message({
          message: "复制文本为空",
          type: "warning"
        });
        return;
      }
      var textBox = document.createElement("input");
      textBox.value = obj;
      document.body.appendChild(textBox);
      textBox.select();
      if (document.execCommand("copy")) {
        document.execCommand("copy");
        textBox.className = "textBox";
        textBox.style.display = "none";
        this.$message({
          message: "复制成功!",
          type: "success",
          duration: 1000
        });
      }
    },

    // 提交token  //提交访问地址
    commitTokenAndAdressIp(item) {
      console.log(this.addPlatformForm.realmName);
      console.log(item);
      var params = {
        pullIp: this.addPlatformForm.ipAddress
          ? this.addPlatformForm.ipAddres
          : item.accAddress,
        pullSsl: this.addPlatformForm.realmName
          ? this.addPlatformForm.realmName
          : item.pullSsl,
        accToken: this.addPlatformForm.transcodingToken
          ? this.addPlatformForm.transcodingToken
          : item.transcodingToken,
        accUser: item.platformUser,
        accDeviceCode: item.platformCode,
        instructions: {
          module: "资源管理",
          page: "对接管理-平台管理",
          feature: '编辑平台',
          description:
            "编辑平台: " + this.gatewayInfo.platformName
        }
      };
      var tid = item.transcodingId;
      this.$api.getaccInfo(tid, params).then(msg => {
        // console.log(msg);
        if (msg.code == 200) {
          this.$message.success("修改平台成功");
          this.getPlatFormdata();
        } else {
          this.$message.error("修改平台失败");
        }
      });
      // var params = {
      //   appName: item.platformName,
      //   phone: item.phone,
      //   responsiblePerson: item.responsiblePerson,
      //   UserId: "",
      //   accDeviceCode: item.platformCode,
      //   accToken: item.transcodingToken,
      //   accUser: item.platformUser,
      //   appCode: item.platformUser,
      //   note: item.note,
      //   organizationName: item.organizationName,
      //   port: 0,
      //   pullIp: item.ipAddress,
      //   regionCode: item.regionCode
      // };
      // this.$api.updateDevicePlatform(params).then(msg => {
      //   // console.log(msg);
      //   if (msg.code == 200) {
      //     this.$message.success("修改平台成功");
      //     this.submitSearchForm();
      //   } else {
      //     this.$message.error("修改平台失败");
      //   }
      // });
    },

    //获取所有类别
    loadClassify() {
      var _this = this;
      this.$api.getCodemaster("CLASSIFY").then(data => {
        if (data.code == "200") {
          this.dimensionList = data.data;
          console.log(this.dimensionList);
        }
      });
    },
    submitSearchCamera() {
      this.pageSize = 10;
      this.currPage = 1;
      console.log(this.cameraInfoForm);
      this.query();
    },
    fileChange(file) {
      var fileObj = file.target.files[0];
      var formData = new FormData();
      formData.append("file", fileObj);
      this.addPlatformForm.file = formData;
    },
    clearFile() {
      //清除input上传文件
      var obj = document.getElementById("fileupload");
      obj.outerHTML = obj.outerHTML;
    },
    privateKeyUpload(file, appCode) {
      // var obj = document.getElementById("fileKey");
      // obj.outerHTML = obj.outerHTML;
      var fileObj = file.target.files[0];
      var formData = new FormData();
      formData.append("file", fileObj);
      var params = {
        appCode: appCode,
        file: formData
      };
      console.log(params);
      this.$api.uploadPlatformPrivateKey(params).then(msg => {
        if (msg.code == 200) {
          this.$message.success("更新平台私钥成功");
          this.getPlatFormdata();
        }
      });
    },
    //下载上传模板
    exportPlatFrom() {
      this.$api
        .exportPlatFormModel()
        .then(res => {
          if (!res) return;
          let url = window.URL.createObjectURL(res);
          let aLink = document.createElement("a");
          aLink.style.display = "none";
          aLink.href = url;
          aLink.setAttribute("download", "平台管理信息表.xls");
          document.body.appendChild(aLink);
          aLink.click();
          document.body.removeChild(aLink);
          window.URL.revokeObjectURL(url);
        })
        .catch(function(error) {
          //   this.$message.error(error);
        });
    }
  },

  mounted() {
    this.loadArea();
    // this.query();
  }
};
</script>

<style lang="less" scoped>
.platForm-Box {
  .transcoding-list-wrapper {
    .content {
      width: calc(~"(100% - 24px) / 3");
      background-color: #ffffff;
      margin-bottom: 13px;
      box-shadow: 0px 1px 1px 0px rgba(20, 22, 37, 0.08);
      border-radius: 4px;
      margin: 4px 4px;
      cursor: pointer;
    }
    display: flex;
    flex-wrap: wrap;
    .content-header {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      font-weight: 400;
      color: rgba(0, 0, 0, 1);
      line-height: 50px;
      border-bottom: 1px solid rgba(212, 212, 212, 1);
      .onlineStatusOk {
        display: inline-block;
        width: 5px;
        height: 5px;
        background: rgba(38, 181, 95, 1);
        margin-left: 22px;
        margin-right: 4px;
        vertical-align: middle;
      }
      .onlineStatusNo {
        display: inline-block;
        width: 5px;
        height: 5px;
        margin-left: 22px;
        margin-right: 4px;
        vertical-align: middle;
        background: rgba(249, 85, 47, 1);
        vertical-align: middle;
      }

      span {
        font-size: 14px;
        font-weight: 400;
        color: rgba(0, 0, 0, 1);
        line-height: 50px;
        margin-right: 12px;
      }
      .Modify {
        display: inline-block;
        width: 24px;
        height: 24px;
        background-image: url("../../../assets/images/traffic_map/dev_b.png");
        border-radius: 4px;
        cursor: pointer;
        position: relative;
        top: 8px;
      }
      .Del {
        display: inline-block;
        width: 24px;
        height: 24px;
        background-image: url("../../../assets/images/traffic_map/dev_del.png");
        border-radius: 4px;
        cursor: pointer;
        position: relative;
        top: 8px;
      }
      .tail {
        display: inline-block;
        position: absolute;
        right: 8px;
        height: 14px;
        font-size: 14px;
        font-weight: 400;
        color: rgba(10, 17, 33, 1);
        line-height: 50px;
        opacity: 0.5;
      }
    }
    .line {
      width: 1px;
      height: 268px;
      border: 1px solid rgba(212, 212, 212, 1);
    }
    .lineA {
      position: absolute;
      left: 80%;
      top: 50px;
      width: 1px;
      height: 268px;
      border: 1px solid rgba(212, 212, 212, 1);
    }
    .content-L {
      width: 100%;
      height: 150px;
      font-size: 12px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: rgba(169, 169, 169, 1);
      line-height: 26px;
      padding: 12px;
      p {
        margin: 0;
        padding: 0;
      }
      .ssgs {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
}
/deep/.el-dialog__body {
  padding: 15px 20px 10px !important;
}
/deep/.el-dialog__footer {
  padding-top: 0 !important;
  padding-bottom: 30px !important;
}
.el-select {
  width: 160px;
}
.tokenStyle {
  width: 60%;
  overflow: hidden; /*超过指定的宽度和高度也隐藏 同时也隐藏子元素 */
  display: inline-block; /* 块级元素显示在这一行，不换行，其他块级元素也可以显示在这一行 */
  white-space: nowrap; /* 所有的文本都显示在这一行 */
  text-overflow: ellipsis; /* 多余的文本用省略号显示 */
}
.content {
  margin-bottom: 20px;
  > div {
    // margin-bottom: 10px;
    border-radius: 4px;
  }
  /deep/ .el-card {
    &:hover {
      box-shadow: 0 0 11px 3px rgba(20, 22, 37, 0.09);
    }
    .el-card__body {
      padding: 0;
      .card-body {
        padding: 20px;
      }
    }
  }
}
.contain {
  width: 100%;
  height: 100%;
}
.contain_top_form {
  padding: 23px 0;
  display: flex;
  align-items: center;
  background: #ffffff;
  margin: 18px 0 12px 0;
  box-shadow: 0px 1px 1px 0px rgba(20, 22, 37, 0.08);
  border-radius: 4px;
}
.commBtn {
  padding: 0 5px;
}

.control_buttons {
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  background: #ffffff;
  padding: 20px 0;
  padding-right: 20px;
}
.contain_table {
  display: flex;
  align-items: center;
  justify-content: center;
}
.pagination {
  background: #ffffff;
  padding: 20px;
}
.add {
  display: inline-block;
  border-radius: 4px;
  cursor: pointer;
  // margin-top: 5px;
  i {
    display: inline-block;
    width: 24px;
    height: 24px;
    background-image: url("../../../assets/images/traffic_map/dev_add.png");
  }
}
.container-wrapper .el-dropdown,
.gd-custom-dialog .el-dropdown {
  line-height: 0px;
}
.inputstyle {
  width: 243px;
  height: 30px;
  background: rgba(255, 255, 245, 1);
  /* margin-left: 30px; */
}
.basicInfo {
  width: 55px;
  height: 14px;
  font-size: 14px;
  font-family: Source Han Sans CN;
  font-weight: 400;
  // color: rgba(10, 17, 33, 1);
  color: #333333;
  line-height: 50px;
  margin-left: 7px;
}
.basicBgc {
  display: inline-block;
  width: 3px;
  height: 12px;
  background: rgba(18, 116, 238, 1);
  border-radius: 2px;
  margin-left: 20px;
}
.labeletop {
  width: 100%;
  height: 30px;
  margin-top: -20px;
  margin-bottom: 15px;
  float: left;
}
.commonality {
  margin-left: 30px;
  margin-bottom: 15px;
}
.uploadStyle {
  width: 29px;
  height: 15px;
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  text-decoration: underline;
  cursor: pointer;
  color: rgba(18, 116, 238, 1);
}
.templateStyle {
  color: #1274ee;
  font-style: normal;
}
.datadocking {
  margin-left: -30px;
}
.uploadBtn {
  margin-top: 10px;
  // text-decoration: underline;
  color: #fff;
}

.uploadFile {
  position: relative;
}
.uploadBgc {
  position: absolute;
  top: 9px;
  left: 14px;
  display: inline-block;
  width: 15px;
  height: 15px;
  background-image: url("../../../assets/images/traffic_map/dev-upload.png");
}
.addbtn {
  width: 100px;
  height: 40px;
  margin-bottom: 10px;
}
.instructions {
  width: 160px;
  height: 30px;
  position: absolute;
  top: -7px;
  left: 100px;
}
.uploadAgain {
  text-decoration: underline;
  color: rgba(18, 116, 238, 1);
}
.confirmationBox {
  height: 650px;
  overflow: scroll;
}
.confirmation {
  float: left;
  width: 445px;
  height: 278px;
  border: 1px solid rgba(231, 231, 231, 1);
  border-radius: 4px;
  margin-left: 10px;
  margin-bottom: 10px;
}

.card-content {
  width: 468px;
  float: left;
  margin-bottom: 15px;
}
.title {
  font-weight: 500;
  float: left;
}
.datalabeletop {
  margin-left: -20px;
  margin-top: -22px;
  margin-bottom: -18px;
}
.datalabelecenter {
  margin-left: -25px;
  margin-top: -22px;
  margin-bottom: -18px;
}
.read {
  margin-top: -8px;
}
.datacontent-info {
  /* position: absolute; */
  width: 446px;
  height: 110px;
  font-size: 12px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  // color: rgba(169, 169, 169, 1);
  // color: #8d9dae;
  color: #cccccc;
  padding-left: 4px;
  p {
    width: 100%;
    white-space: nowrap;
  }
}
/*.datacontent-p {
  margin-left: -5px;
}*/
.title:before {
  width: 3px;
  height: 12px;
  background: rgba(18, 116, 238, 1);
  border-radius: 2px;
}
.title-T {
  margin-top: 10px;
}
.content-info {
  width: 288px;
  height: 117px;
  font-size: 12px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: rgba(169, 169, 169, 1);
  margin-left: 30px;
  margin-bottom: 40px;
}
.content-info2 {
  font-size: 12px;
  color: rgba(169, 169, 169, 1);
  padding-left: 4px;
}

.content-info3 {
  width: 100%;
  height: 150px;
  font-size: 12px;
  padding-left: 5px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: rgba(169, 169, 169, 1);
  line-height: 10px;
  /deep/.el-input__inner {
    height: 26px !important;
  }
}
.labeletop {
  height: 30px;
  margin-top: -20px;
  margin-bottom: 15px;
}
.basicBgc {
  display: inline-block;
  width: 3px;
  height: 12px;
  background: rgba(18, 116, 238, 1);
  border-radius: 2px;
}
.basicInfo {
  width: 55px;
  height: 14px;
  font-size: 14px;
  font-family: Source Han Sans CN;
  font-weight: 400;
  color: rgba(10, 17, 33, 1);
  line-height: 50px;
  margin-left: 7px;
}
.buttom {
  width: 548px;
  height: 1px;
  border-bottom: 1px solid rgba(212, 212, 212, 1);
}
.footBtn {
  width: 100%;
  padding: 10px 20px;
  position: relative;
  background: rgba(255, 255, 255);
  box-shadow: 0px 1px 1px 0px rgba(20, 22, 37, 0.08);
  border-top: 1px solid rgba(212, 212, 212, 1);
}
.copy {
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: rgba(18, 116, 238, 1);
  margin-left: 6px;
  margin-right: 6px;
}
.commit {
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: rgba(18, 116, 238, 1);
  margin-left: 6px;
  margin-right: 6px;
  text-decoration: underline;
  cursor: pointer;
}
.copy:hover {
  cursor: pointer;
  text-decoration: underline;
}
.tokenInput {
  width: 200px;
}
</style>
<style lang="less">
.add.el-dropdown {
  vertical-align: middle;
}
</style>
