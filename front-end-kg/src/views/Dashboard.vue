// 新建组织：systemUserOrganize 添加用户：systemUserOrganize
添加上云网关： // 流媒体新增：StreamMediaManage 添加平台：
新增开放应用：
<template>
  <!--<iframe style="height:100%;width:100%;" frameborder=”no” border=”0″ marginwidth=”0″ marginheight=”0″ scrolling=”no”
  allowtransparency=”yes” src="https://tangrl.com/web/dash/dashboard.html"></iframe>-->
  <div class="control-box">
    <div class="container">
      <div class="summary-wrapper">
        <div
          class="summary-item bg-info-deep"
          @click="$router.push('/deviceCameraManage')"
        >
          <span class="el-camera common"></span>
          <div>
            <span class="summary-item-name"
              >摄像机接入量</span
            >
            <span
              class="summary-item-number"
              style="font-family: sans-serif"
            >
              {{
                Utils.formatToThousands(
                  systemCount.cameraTotal
                )
              }}
            </span>
          </div>
        </div>
        <div
          class="summary-item bg-info-s"
          @click="$router.push('/deviceTranscodingManage')"
        >
          <span class="el-cloud common"></span>
          <div>
            <span class="summary-item-name"
              >上云网关接入量</span
            >
            <span
              class="summary-item-number"
              style="font-family: sans-serif"
            >
              {{
                Utils.formatToThousands(
                  systemCount.transcodingTotal
                )
              }}
            </span>
          </div>
        </div>
        <div
          class="summary-item bg-info-l"
          @click="$router.push('/streamMediaManage')"
        >
          <span class="el-stream common"></span>
          <div>
            <span class="summary-item-name"
              >流媒体接入量</span
            >
            <span
              class="summary-item-number"
              style="font-family: sans-serif"
            >
              {{
                Utils.formatToThousands(
                  systemCount.streamTotal
                )
              }}
            </span>
          </div>
        </div>
        <div
          class="summary-item bg-success"
          v-if="uinfo.regionCode == 100000 ? true : false"
          @click="
            $router.push(
              '/deviceTranscodingManage?isFromDash=true'
            )
          "
        >
          <span class="el-plantForm common"></span>
          <div>
            <span class="summary-item-name"
              >接入平台数</span
            >
            <span
              class="summary-item-number"
              style="font-family: sans-serif"
            >
              {{
                Utils.formatToThousands(
                  systemCount.platformTotal
                )
              }}
            </span>
          </div>
        </div>
        <div
          class="summary-item bg-info-p"
          @click="$router.push('/openManage')"
        >
          <span class="el-open common"></span>
          <div>
            <span class="summary-item-name"
              >开放应用数</span
            >
            <span
              class="summary-item-number"
              style="font-family: sans-serif"
            >
              {{
                Utils.formatToThousands(
                  systemCount.openAppTotal
                )
              }}
            </span>
          </div>
        </div>
      </div>

      <div class="container-center">
        <el-row style="height: 100%">
          <el-col
            :span="16"
            style="padding-right: 10px; height: 100%"
          >
            <div class="quckily-c">
              <el-card
                shadow="never"
                style="height: 100%; margin-bottom: 10px"
              >
                <div slot="header" class="clearfix">
                  <span
                    style="font-size: 16px; font-weight: bold"
                    >快捷入口</span
                  >
                </div>
                <div class="quick-access-wrap clearfix">
                  <div
                    class="quick-access-item"
                    v-for="(vo, idx) in fastApp"
                    :key="idx"
                    @click.stop="() => ClickFastApp(idx)"
                  >
                    <!-- @click="$router.push(vo.path)" -->
                    <img
                      :src="vo.icon"
                      class="common imgFlex"
                    />
                    <span>{{ vo.name }}</span>
                  </div>
                </div>
              </el-card>
            </div>
            <el-row style="height: calc(100% - 35% - 10px)">
              <el-col
                :span="12"
                style="padding-right: 10px; height: 100%"
              >
                <el-card
                  shadow="never"
                  style="height: 100%"
                  v-loading="getAbnormalDataLoading"
                  class="error-count"
                >
                  <div slot="header" class="clearfix">
                    <span
                      style="font-size: 16px; font-weight: bold"
                      >故障统计</span
                    >
                  </div>
                  <fault-model></fault-model>
                </el-card>
              </el-col>
              <el-col :span="12" style="height: 100%">
                <el-card
                  shadow="never"
                  style="height: 100%"
                >
                  <div slot="header" class="clearfix">
                    <span
                      style="font-size: 16px; font-weight: bold"
                      >视频调取统计</span
                    >
                  </div>
                  <div style="height: 100%">
                    <div
                      id="openBarChart"
                      class="echart-wrapper"
                      style="height: 100%; width: 100%"
                    ></div>
                    <!-- <div id="chartBox1" style="height: 70%;width:100%"></div> -->
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="8" style="height: 100%">
            <el-card
              shadow="never"
              class="task-wrapper-card"
              style="height: 100%"
            >
              <div slot="header" class="clearfix">
                <span
                  style="font-size: 16px; font-weight: bold"
                  >待处理任务</span
                >
              </div>
              <div
                class="task-wrapper"
                v-loading="taskLoading"
              >
                <template v-if="taskDataList.length">
                  <vue-scroll :ops="$root.scrollOpsY">
                    <div
                      class="task-item"
                      v-for="(vo, idx) in taskDataList"
                      :key="idx"
                    >
                      <div class="task-info">
                        <el-tag
                          size="mini"
                          effect="plain"
                          :type="'success'"
                        >
                          {{ vo.type }}
                        </el-tag>
                        {{ vo.date }}
                      </div>
                      <div
                        class="task-title"
                        v-html="vo.content"
                      ></div>
                    </div>
                  </vue-scroll>
                </template>
                <loading
                  loadingStatus="empty"
                  message="暂无任务"
                  v-else
                ></loading>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
      <div class="container-bottom">
        <el-row style="height: 100%">
          <el-col
            :span="16"
            style="padding-right: 10px; height: 100%"
          >
            <el-card shadow="never" style="height: 100%">
              <div
                id="province-state-chart"
                style="height: 100%; width: 100%"
              ></div>
            </el-card>
          </el-col>
          <el-col :span="8" style="height: 100%">
            <el-card shadow="never" style="height: 100%">
              <div
                style="line-height: 30px; font-size: 16px; font-weight: bold"
              >
                摄像机运行情况
              </div>
              <canvas
                id="abnormal-chart"
                style="height: 100%"
              ></canvas>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>
    <el-dialog
      title="创建应用"
      :visible.sync="sixnone"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      custom-class="gd-custom-dialog open-app-dialog"
      width="30%"
    >
      <el-form
        :model="appForm"
        label-width="80px"
        ref="appForm"
        style="height: auto"
      >
        <el-form-item
          label="应用名称"
          style="margin: 0; padding-bottom: 20px"
          prop="appName"
          :rules="[
            { required: true, message: '应用名称不能为空' }
          ]"
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
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="createAppDialogVisible = false">取 消</el-button> -->
        <el-button
          type="primary"
          @click="createApp('appForm')"
          >保 存</el-button
        >
      </span>
    </el-dialog>
    <!-- 新增修改对话框 -->
    <stream-media-dialog
      v-if="dialogTableVisible"
      :visible.sync="dialogTableVisible"
    ></stream-media-dialog>
    <add-platform-dialog
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
    ></add-platform-dialog>
    <add-org-dialog
      v-if="addDialog.addProviceVisable"
      :visible.sync="addDialog.addProviceVisable"
    >
    </add-org-dialog>
    <add-user-dialog
      v-if="addUserOrgVisable"
      :visible.sync="addUserOrgVisable"
    >
    </add-user-dialog>
    <add-device-dialog
      v-if="showTranscodeDetail"
      :visible.sync="showTranscodeDetail"
    ></add-device-dialog>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import checkCamera from '../components/module/SystemRole/checkCamera'
import api from '@/api'
import DevicetranDialog from '../components/controlPlatform/DevicetranDialog'
import Loading from '../components/common/Loading'
import neworg from '../assets/images/dashboard/neworg.png'
import newOpen from '../assets/images/dashboard/newOpen.png'
import addUser from '../assets/images/dashboard/addUser.png'
import addCloud from '../assets/images/dashboard/addCloud.png'
import addstream from '../assets/images/dashboard/addstream.png'
import addinsert from '../assets/images/dashboard/addinsert.png'
import addDeviceDialog from '../components/dashDialog/addDeviceDialog'
import addUserDialog from '../components/dashDialog/addUserDialog'
import addOrgDialog from '../components/dashDialog/addOrgDialog'
import StreamMediaDialog from '../components/module/StreamMedia/StreamMediaDialog'
import addPlatformDialog from '../components/dashDialog/addPlatformDialog'
import FaultModel from '../components/module/Statistics/faultModel.vue'
import util from '../filters/utils'

export default {
  components: {
    Loading,
    //ControlNavBar,
    StreamMediaDialog,
    DevicetranDialog,
    addDeviceDialog,
    addUserDialog,
    addOrgDialog,
    addPlatformDialog,
    FaultModel
  },
  data() {
    //合法手机号验证
    var checkMobile = (rule, value, callback) => {
      // 验证手机号的正则表达式
      const reg = /^1[3456789]\d{9}$/
      !reg.test(value)
        ? callback(new Error('请输入正确手机号'))
        : callback()
    }
    return {
      uinfo: {
        regionCode: JSON.parse(
          localStorage.getItem('cloudplatform')
        ).regionCode
      },
      dialogTableVisible: false,
      appForm: {
        appName: '',
        appId: '',
        state: 1,
        Id: ''
      },
      addDialog: {
        addProviceVisable: false
      },
      myTitle: '',
      dialogVisible: false,
      sixnone: false,
      pieCharts: '',
      lineChart: '',
      lineChart2: '',
      barCharts: '',
      insertData: [],
      abnormalData: [],
      taskLoading: true,
      taskDataList: [],
      insertList: [],
      cityVideoData: [],
      getAbnormalDataLoading: true,
      transferCount: {
        todayCount: 0,
        totalCount: 0
      },
      systemCount: {
        cameraTotal: 0,
        streamTotal: 0,
        openAppTotal: 0,
        platformTotal: 0,
        transcodingTotal: 0
      },
      // 黑屏 被遮挡 画面模糊 有闪烁 被冻结 亮度故障 有噪声 有滚动条纹
      abnormalTypeCount: [
        { name: '黑屏', value: 0 },
        { name: '被遮挡', value: 0 },
        { name: '画面模糊', value: 0 },
        { name: '有闪烁', value: 0 },
        { name: '被冻结', value: 0 },
        { name: '亮度故障', value: 0 },
        { name: '有噪声', value: 0 },
        { name: '有滚动条纹', value: 0 }
      ],
      fastApp: [
        {
          icon: neworg,
          name: '新建组织'
          // path: "/systemUserOrganize",
        },
        {
          icon: addUser,
          name: '添加用户'
          // path: "/systemUserOrganize",
        },
        {
          icon: addCloud,
          name: '添加上云网关'
          // path: "/deviceTranscodingManage",
        },
        {
          icon: addstream,
          name: '添加流媒体'
          // path: "/streamMediaManage",
        },
        {
          icon: addinsert,
          name: '添加平台'
          // path: "/devicePlatformManage",
        },
        {
          icon: newOpen,
          name: '新增开放系统'
          // path: "/openManage",
        }
      ],
      org: {},
      barChartSelectPath: [],
      showTranscodeDetail: false,
      addUserOrgVisable: false
    }
  },

  computed: {
    ...mapState([
      'userInfo',
      'UserOrgTree',
      'sysUser',
      'setSysUserList',
      'roleList',
      'orgTreeData',
      'provinces',
      'UserOrgTreeChild'
    ])
  },
  mounted() {
    this.getAllData()
    this.recentTime()
    this.$nextTick(() => {
      //this.loadBasicData();
      //this.drawLine('chartBox1','视频设备接入数量',this.insertList,this.insertData,'#1c71f0');
      //this.drawLine('chartBox2','视频设备故障数量',this.insertList,this.abnormalData,'#ff780c');
      this.queryCameraState()
      this.queryTaskList()

      this.getDashboardCountDataAction().then(res => {
        if (res.code === 200) {
          this.transferCount = JSON.parse(
            JSON.stringify(res.data)
          )
          console.log(this.transferCount, 'dsdadadad')
          let everyDayCount = res.data.everyDayCount
          if (everyDayCount) {
            let insertList = [],
              insertData = []
            everyDayCount.forEach(vo => {
              insertList.push(vo.date)
              insertData.push(vo.count)
            })
            //console.info("insertData   ", insertList,insertData);
            this.drawLine(
              'chartBox1',
              '视频设备接入数量',
              insertList,
              insertData,
              '#1c71f0'
            )
          }
        }
      })
      let vm = this
      this.getDashboardAccessDataAction().then(res => {
        if (res.code === 200) {
          vm.systemCount = res.data
        }
      })

      this.getAllCameraAbnormalStatisticsAction({
        organizationId: ''
      })
        .then(res => {
          //console.info("getAllCameraAbnormalStatisticsAction ", res);
          this.getAbnormalDataLoading = false
          if (res.code === 200) {
            let errorTypeData = [],
              getRate = (num, baseNm, fixNm) => {
                if (fixNm) {
                  return parseFloat(
                    ((num / baseNm) * 100).toFixed(fixNm)
                  )
                }
                return parseFloat(
                  Math.ceil((num / baseNm) * 100)
                )
              }

            if (res.data.total) {
              errorTypeData = [
                {
                  name: '黑屏',
                  value: getRate(
                    res.data.btotal,
                    res.data.inerror,
                    0
                  )
                },
                {
                  name: '被遮挡',
                  value: getRate(
                    res.data.ctotal,
                    res.data.inerror,
                    0
                  )
                },
                {
                  name: '画面模糊',
                  value: getRate(
                    res.data.dtotal,
                    res.data.inerror,
                    0
                  )
                },
                {
                  name: '亮度故障',
                  value: getRate(
                    res.data.etotal,
                    res.data.inerror,
                    0
                  )
                },
                {
                  name: '有闪烁',
                  value: getRate(
                    res.data.htotal,
                    res.data.inerror,
                    0
                  )
                },
                {
                  name: '被冻结',
                  value: getRate(
                    res.data.ftotal,
                    res.data.inerror,
                    0
                  )
                },
                {
                  name: '有噪声',
                  value: getRate(
                    res.data.gtotal,
                    res.data.inerror,
                    0
                  )
                },
                {
                  name: '有滚动条纹',
                  value: getRate(
                    res.data.itotal,
                    res.data.inerror,
                    0
                  )
                }
              ]
            }
            this.abnormalTypeCount = errorTypeData
          }
        })
        .catch(e => {
          //console.info(e);
          this.getAbnormalDataLoading = false
          this.abnormalTypeCount = [
            { name: '黑屏', value: 0 },
            { name: '被遮挡', value: 0 },
            { name: '画面模糊', value: 0 },
            { name: '有闪烁', value: 0 },
            { name: '被冻结', value: 0 },
            { name: '亮度故障', value: 0 },
            { name: '有噪声', value: 0 },
            { name: '有滚动条纹', value: 0 }
          ]
        })
    })
  },
  methods: {
    ...mapActions(['getUserOrganization', 'getCountDaily']),

    //创建应用
    createApp(formName) {
      let instructions = {
        module: '资源管理',
        page: '开放管理',
        feature: '新增应用',
        description: '新增应用名称?' + this.appForm.appName
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          let appName = this.appForm.appName
          api
            .createApp(
              {
                appName
              },
              instructions
            )
            .then(res => {
              if (res.code === 200) {
                this.createAppDialogVisible = false
                this.$message({
                  message: '创建成功',
                  type: 'success'
                })
                this.appForm.appName = ''
                this.state = ''
                // this.getOpenList();
              } else {
                this.$message({
                  message: '创建失败',
                  type: 'error'
                })
              }
            })
        } else {
          return false
        }
      })
      this.appForm.appName = '' //清除数据
      this.sixnone = false
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    ClickQX() {
      this.TanChuang = false
    },
    ClickQD() {},

    parentsCateChanged(val) {
      if (val) {
        this.organizationId = val[val.length - 1]
        // this.newDialog.organizationId = this.organizationId;
        console.log(this.organizationId)
      }
    },
    closeHandleChange(visible) {
      if (!visible) {
        this.newDialog.organizationId = this.organizationId
        console.log(
          'close=====' + this.newDialog.organizationId
        )
      }
    },
    ClickFastApp(index) {
      console.log(index)
      if (index == 0) {
        // console.log(index, "新增组织");
        this.addDialog.newTitle = '新增组织'
        this.addDialog.addProviceVisable = true
        // this.org = {

        // };
      } else if (index == 1) {
        this.addUserOrgVisable = true
        this.addUserOrg = '添加用户'
        this.$nextTick(() => {
          this.newDialog.userStatus = '1'
        })
      } else if (index == 2) {
        this.showTranscodeDetail = true
      } else if (index == 3) {
        this.dialogTableVisible = true
      } else if (index == 4) {
        this.dialogVisible = true
      } else if (index == 5) {
        this.sixnone = true
      } else {
        alert('本服务还未开通，请稍后再试！')
      }
    },

    ...mapActions([
      'getDeviceStatistics',
      'getDashboardCountDataAction',
      'getDashboardAccessDataAction',
      'getAllCameraAbnormalStatisticsAction'
    ]),

    queryTaskList() {
      this.taskLoading = true
      let obj = {
        pageSize: 100,
        currPage: 1
      }
      let params = {
        /*organizationName: this.jurisdiction,
          provinceCode: this.provinceCode,
          transcodingName: this.couldGateWay*/
      }
      this.$api.getTemporaryList(obj, params).then(res => {
        this.taskLoading = false
        if (res.total && res.data) {
          res.data.forEach(vo => {
            this.taskDataList.push(
              Object.assign(
                {},
                {
                  type: '摄像机审核',
                  date: this.Utils.date('Y-m-d H:i'),
                  content: `${vo.transcodingName} 有 <strong>${vo.confirmAddOpCameraNum}</strong> 路新增的、<strong>${vo.confirmUpOpCameraNum}</strong> 路更新的、<strong>${vo.confirmRmOpCameraNum}</strong> 路删除的摄像机待审核`
                },
                vo
              )
            )
          })
        }
      })
    },

    abnormalTypeProgressColor(percentage) {
      if (percentage < 50) {
        return '#67c23a'
      } else if (percentage < 70) {
        return '#e6a23c'
      } else {
        return '#993700'
      }
    },
    abnormalTypeProgressFormat(percentage) {
      return percentage === 100 ? '100' : percentage //`${percentage}`;
    },

    /**
     * 折线图加载函数
     * @param id
     */
    drawLine(id, title, list, data, color) {
      if (!document.getElementById(id)) return
      this.lineChart = this.$echarts.init(
        document.getElementById(id)
      )
      this.lineChart.setOption({
        tooltip: {
          trigger: 'axis',
          backgroundColor: '#ffffff',
          borderWidth: 0,
          padding: 10,
          textStyle: {
            color: '#000'
          },
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'line', // 默认为直线，可选为：'line' | 'shadow'
            lineStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: 'rgb(255,255,255)' // 0% 处的颜色
                  },
                  {
                    offset: 0.2,
                    color: '#1274EE' // 0% 处的颜色
                  },
                  {
                    offset: 0.5,
                    color: '#1274EE' // 0% 处的颜色
                  },
                  {
                    offset: 0.8,
                    color: '#1274EE' // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: 'rgb(255,255,255)' // 100% 处的颜色
                  }
                ],
                global: false // 缺省为 false
              }, // "#1274EE",
              type: 'dashed'
            }
          },
          extraCssText:
            'box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.35);'
        },
        title: {
          show: false,
          left: 'center',
          text: title,
          textStyle: {
            fontSize: 12,
            fontWeight: 'bold'
          }
        },
        grid: {
          top: '0',
          left: '-38',
          right: '0%',
          bottom: '0%',
          containLabel: true
        },
        /*legend: [
            {
              align: 'left',
              //name: "{a|今日调取}\n{b|2345234}",
              data: ["{a|总调取}\n{b|2345234}"],
              selectedMode: false,
              icon: 'circle',
              inactiveColor: '#dedede',
              rich: {
                a: {
                  fontSize: 12,
                  color: '#77899c',
                },
                b: {
                  color: "#858585",
                  fontSize: 16,
                  lineHeight: 30
                }
              },
            },
            {
              align: 'right',
              //name: "{a|今日调取}\n{b|2345234}",
              data: ["{a|今日调取}\n{b|2345234}"],
              selectedMode: false,
              icon: 'circle',
              inactiveColor: '#dedede',
              rich: {
                a: {
                  fontSize: 12,
                  color: '#77899c',
                },
                b: {
                  color: "#858585",
                  fontSize: 16,
                  lineHeight: 30
                }
              },
            }
          ],*/
        xAxis: {
          show: false,
          boundaryGap: false,
          data: list
        },
        yAxis: {
          show: false,
          type: 'value'
        },
        series: [
          {
            type: 'line',
            name: '调取量',
            stack: '调取量',
            data: data,
            smooth: 0.6,
            areaStyle: {},
            itemStyle: {
              barBorderRadius: [20, 20, 0, 0],
              emphasis: {
                /*text: pieChartDataTotal + 10000000,*/
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              },
              color: new this.$echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                [
                  { offset: 0, color: '#3494ff' },
                  {
                    offset: 1,
                    color: 'rgba(69,139,255,0.61)'
                  }
                ]
              )
            }
          },
          {
            type: 'line',
            name: '今日调取',
            stack: '调取量',
            smooth: 0.6,
            areaStyle: {}
          }
        ]
      })
      window.addEventListener('resize', () => {
        this.lineChart.resize()
      })
    },

    /**
     * 饼图加载函数
     * @param
     */
    pieChart(id, chartData, chartDataTotal) {
      // 基于准备好的dom，初始化echarts实例
      let obj = document.getElementById(id)
      if (!obj) {
        return false
      }
      //console.log("obj=>",obj)

      this.pieCharts = this.$echarts.init(obj)

      // 绘制图表
      this.pieCharts.setOption({
        tooltip: {
          show: true,
          trigger: 'item',
          //formatter: "{a} <br/>{b}: {c}"//{a} <br/>
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        title: {
          text: chartDataTotal,
          //subtext: datasubtext[0],
          x: 'center',
          y: 'center',
          textStyle: {
            fontSize: 12,
            fontWeight: 'normal',
            color: ['#4563d0']
          }
        },
        grid: {
          left: '0%',
          right: '5%',
          bottom: '0%',
          containLabel: true
        },
        series: [
          {
            name: '摄像机接入统计',
            type: 'pie',
            radius: ['26%', '40%'],
            avoidLabelOverlap: true,
            //center: ['40%', '50%'],
            //hoverAnimation: false,
            //legendHoverLink: false,
            //silent: false,
            label: {
              //formatter: '{b}: {@2012} ({d}%)',
              formatter: '{a|{b}}  {b|{c}} {per|{d}%}  ',
              // padding:[0,0,5,0],
              alignTo: 'labelLine',
              margin: '25%',
              rich: {
                a: {
                  color: '#999',
                  fontSize: 10,
                  lineHeight: 30
                },
                b: {
                  color: '#999',
                  fontSize: 10,
                  lineHeight: 22
                },
                per: {
                  color: '#666',
                  fontSize: 10,
                  lineHeight: 22
                }
              }
            },
            encode: {
              itemName: 'product',
              value: '2012',
              tooltip: '2012'
            },
            /*labelLine: {
                normal: {
                  show: false
                }
              },*/
            itemStyle: {
              emphasis: {
                text: chartDataTotal + 10000000,
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              },
              color: function(params) {
                var colorList = [
                  '#4563d0',
                  '#ff5215',
                  '#cdcdcd'
                ]
                return colorList[params.dataIndex]
              }
            },
            data: chartData
          }
        ]
      })
      // window.addEventListener("resize", () => {
      //   this.pieCharts.resize();
      // });
    },

    /**
     * 柱状加载函数
     */
    barChart(id, chartData, chartTitle) {
      this.barCharts = this.$echarts.init(
        document.getElementById(id)
      )
      this.barCharts.setOption({
        tooltip: {
          trigger: 'axis',
          backgroundColor: '#ffffff',
          borderWidth: 0,
          // padding: 10,
          textStyle: {
            color: '#000'
          },
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          },
          extraCssText:
            'box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.35);'
        },
        grid: {
          left: '5%',
          right: '5%',
          bottom: '3%',
          containLabel: true
        },
        legend: {
          x: 'right',
          data: chartData.name,
          padding: [0, 10],
          selectedMode: true,
          itemWidth: 10,
          itemHeight: 10,
          icon: 'circle',
          inactiveColor: '#dedede',
          itemGap: 20,
          textStyle: {
            fontSize: 14,
            color: '#77899c',
            width: 80
          },
          tooltip: {
            show: true
          }
        },
        title: {
          x: 'left',
          text: chartTitle,
          textStyle: {
            fontSize: 15,
            fontWeight: 'bold'
          }
        },
        xAxis: {
          name: '组织',
          type: 'category',
          data: chartData.titles,
          //网格样式
          splitLine: {
            show: true,
            lineStyle: {
              color: ['rgba(157, 157, 157, 0.3)'],
              width: 1,
              type: 'dashed'
            }
          }
        },
        yAxis: {
          name: '数量',
          type: 'value',
          //网格样式
          splitLine: {
            show: true,
            lineStyle: {
              color: ['rgba(157, 157, 157, 0.3)'],
              width: 1,
              type: 'dashed'
            }
          }
        },

        series: chartData.newData
      })
      window.addEventListener('resize', () => {
        this.barCharts.resize()
      })
    },

    /**
     * 获取摄像机状态数据
     */
    queryCameraState() {
      console.log('this.userInfo=>', this.userInfo)
      this.$api
        .getAllCameraRunStatistics({
          organizationId: this.userInfo.organizationId
        })
        .then(res => {
          //console.log("res=>",res)

          //组装饼图加载所用数据
          let total = 0,
            offline = 0,
            online = 0,
            inerror = 0,
            offlineList = [],
            onlineList = [],
            inerrorList = [],
            titles = []
          let data = res.data.childInfo
          for (var i = 0, len = data.length; i < len; i++) {
            total += data[i].total
            offline += data[i].offline
            online += data[i].online
            inerror += data[i].inerror
            offlineList.push(data[i].offline)
            onlineList.push(data[i].online)
            inerrorList.push(data[i].inerror)
            titles.push(data[i].name)
          }
          //console.log(offline,online,inerror);
          this.pieChart(
            'abnormal-chart',
            [
              {
                value: res.data.online,
                name: '正常'
              },
              {
                value: res.data.inerror,
                name: '故障'
              },
              {
                value: res.data.offline,
                name: '离线'
              }
            ],
            res.data.total
          )

          //加载柱状图
          this.queryCityCameraState(
            onlineList,
            offlineList,
            inerrorList,
            titles
          )
        })
    },

    /**
     * 获取各省视频运行状态
     */
    queryCityCameraState(online, offline, inerror, titles) {
      //console.log("arr=>",online,offline,inerror,titles);
      let newData = [
        {
          name: '正常',
          type: 'bar',

          barWidth: '17%',
          itemStyle: {
            emphasis: { barBorderRadius: 30 },
            normal: {
              color: '#4563d0',
              barBorderRadius: [0, 0, 0, 0]
            }
          },
          data: online
        },
        {
          name: '故障',
          type: 'bar',
          barWidth: '17%',
          itemStyle: {
            emphasis: { barBorderRadius: 30 },
            normal: {
              color: '#ff5215',
              barBorderRadius: [0, 0, 0, 0]
            }
          },
          data: inerror
        },
        {
          name: '离线',
          type: 'bar',
          barWidth: '17%',
          itemStyle: {
            emphasis: { barBorderRadius: 30 },
            normal: {
              color: '#cdcdcd',
              barBorderRadius: [0, 0, 0, 0]
            }
          },
          data: offline
        }
      ]

      this.barChart(
        'province-state-chart',
        { newData, titles },
        `摄像机接入统计(${this.addDate(
          new Date().getTime(),
          '-'
        )})`
      )
    },

    /**
     * 获取当前日期
     * return 年-月-日
     */
    addDate(dateTime, flag) {
      let nowDate = new Date(dateTime)
      let date = {
        year: nowDate.getFullYear(),
        month: nowDate.getMonth() + 1,
        date: nowDate.getDate()
      }
      let systemDate =
        date.year +
        flag +
        (date.month > 9 ? '' : 0) +
        date.month +
        flag +
        (date.date > 9 ? '' : 0) +
        date.date
      return systemDate
    },

    /**
     * 加载页面基础数据
     */
    loadBasicData() {
      let dateList = [],
        newdataList = [],
        abnormalList = [],
        nowadays = new Date().getTime(),
        num = 1000 * 3600 * 24
      for (let i = 14; i >= 0; i--) {
        dateList.push(this.addDate(nowadays - num * i, '/'))
        if (newdataList.length == 0) {
          newdataList[0] = 1200
        } else {
          newdataList.push(
            newdataList[newdataList.length - 1] +
              (Math.random() * 100).toFixed() * 1
          )
        }
        abnormalList.push((Math.random() * 100).toFixed())
      }
      this.insertList = dateList
      this.insertData = newdataList
      this.abnormalData = abnormalList
    },

    getAllData() {
      let myDate = new Date()
      myDate.setTime(myDate.getTime() - 1)
      let dateTemp
      let endDay
      let offset = 0
      var perDay = new Date()
      perDay.setTime(myDate.getTime() - 1)
      perDay.setDate(perDay.getDate() - 6)
      dateTemp = util.date('Y-m-d', perDay)
      endDay = util.date('Y-m-d', myDate)
      let params = {
        startDate: dateTemp,
        endDate: endDay
      }
      console.log(params, 'params')
      this.getAllDataLoading = true
      this.getCountDaily(params).then(res => {
        this.getAllDataLoading = false
        if (res.code === 200) {
          this.abnormalTotal = res.data.total
          let orgList = res.data,
            xAxisList = [],
            seriesData = []
          this.baseDataList = orgList

          this.openBarChartInit('openBarChart', '', {
            xAxis: this.recentTime(),
            series: res.data.series
          })
        }
      })
    },
    recentTime() {
      let myDate = new Date() // 获取今天日期
      myDate.setDate(myDate.getDate() - 6)
      let dayList = []
      let dateTemp
      let flag = 1
      for (var i = 0; i < 7; i++) {
        myDate.setDate(myDate.getDate())
        let MM = myDate.getMonth()
        let day = myDate.getDate()
        let hh = myDate.getHours()
        let mm = myDate.getMinutes()
        let ss = myDate.getSeconds()
        if (MM < 10) {
          MM = '0' + MM
        }
        if (day < 10) {
          day = '0' + day
        }
        if (hh < 10) {
          hh = '0' + hh
        }
        if (mm < 10) {
          mm = '0' + mm
        }
        if (ss < 10) {
          ss = '0' + ss
        }
        dateTemp = myDate.getMonth() + 1 + '-' + day
        // dateTemp = ;
        dayList.push(dateTemp)
        myDate.setDate(myDate.getDate() + flag)
      }
      return dayList
    },
    openBarChartInit(elId, chartTitle, chartData) {
      // 基于准备好的dom，初始化echarts实例
      let obj = document.getElementById(elId)
      if (!obj) {
        return false
      }

      let baseLend = [],
        max = Math.max.apply(Math, chartData.series)
      chartData.series.forEach(it => {
        it.type = 'line'
        it.smooth = true
        ;(it.areaStyle = {}), baseLend.push(it.name)
      })
      let myChart = this.$echarts.init(obj),
        labelOption = {
          show: true,
          position: 'top',
          distance: 10,
          align: 'center',
          verticalAlign: 'bottom',
          rotate: 0,
          formatter: '{c}', // '{c}  {name|{a}}'
          fontSize: 16,
          rich: {
            name: {
              textBorderColor: '#fff'
            }
          }
        },
        options = {
          title: {
            text: chartTitle,
            textStyle: {
              fontSize: 14,
              color: '#333',
              fontStyle: 'normal',
              fontWeight: 'normal'
            }
          },
          tooltip: {
            trigger: 'axis',
            backgroundColor: '#ffffff',
            borderWidth: 0,
            padding: 10,
            textStyle: {
              color: '#000'
            },
            axisPointer: {
              // 坐标轴指示器，坐标轴触发有效
              type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
              shadowStyle: {
                color: 'rgba(0, 0, 0, 0.1)'
              }
            },
            extraCssText:
              'box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.35);'
          },
          legend: { data: baseLend },

          grid: {
            top: '80px',
            left: '0%',
            right: '10%',
            bottom: '0%',
            containLabel: true
          },
          xAxis: {
            name: '日期',
            type: 'category',
            data: chartData.xAxis,
            axisLabel: {
              color: '#000'
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: '#f2f2f2',
                width: 1,
                type: 'solid'
              }
            },
            minorTick: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#1274EE',
                width: 1,
                type: 'solid'
              }
            }
          },
          yAxis: {
            name: '数量',
            type: 'value',
            minorTick: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              color: '#000'
            },
            //网格样式
            splitLine: {
              show: true,
              lineStyle: {
                color: '#f2f2f2',
                width: 1,
                type: 'solid'
              }
            },
            axisLine: {
              lineStyle: {
                color: '#1274EE',
                width: 1,
                type: 'solid'
              }
            }
          },
          color: ['#FDAD00', '#1274EE'],
          series: chartData.series
        }

      //console.info('myChart ', myChart);
      // 绘制图表
      console.log('chart option', options)
      myChart.setOption(options)
      window.addEventListener('resize', () => {
        myChart.resize()
      })
      myChart.off('click')
      myChart.on('click', params => {
        //let sersName = params.name;
        console.info('click', params)
        let type = params.componentType
        if (type === 'series') {
          let vo = this.baseDataList[params.dataIndex]
          this.barChartSelectPath.push(vo.id)
          //that.cameraStatusSelectClick(s.indexOf(params.name.split(' ')[0]) + '');/**/
          this.getAllData(vo.id)
        }
      })
    }
  }
}
</script>

<style lang="less">
.control-box {
  .el-card__header {
    padding: 10px 20px !important;
  }
  // .el-card__body {
  //   padding: 12px 20px;
  // }
  width: 100%;
  height: 100%;
  .container {
    width: 100%;
    height: 100%;
    .summary-wrapper {
      height: 13%;
      // height: 110px;
      display: flex;
      margin-bottom: 10px;
      // .common {
      //   display: inline-block;
      //   // width: 68px;
      //   // height: 68px;
      //     width: 60%;
      //   height:60%;
      //   background-repeat: no-repeat;
      //   // background-size: 60% 60%;
      //   position: absolute;
      //   left: 20px;
      //   top: 50%;
      //   transform: translate(0, -50%);
      // }
      .el-camera {
        background-image: url('../assets/images/dashboard/cameraAccess.png');
      }
      .el-cloud {
        background-image: url('../assets/images/dashboard/cloudAccess.png');
      }
      .el-stream {
        background-image: url('../assets/images/dashboard/streamingAccess.png');
      }
      .el-plantForm {
        background-image: url('../assets/images/dashboard/plantAccess.png');
      }
      .el-open {
        background-image: url('../assets/images/dashboard/openAccess.png');
      }
      .summary-item {
        flex: 1;
        height: 100%;
        margin-right: 10px;
        border-radius: 4px;
        position: relative;
        transition: all 0.4s;
        cursor: pointer;
        .common {
          display: inline-block;
          // width: 68px;
          // height: 68px;
          width: 21%;
          height: 62%;
          background-repeat: no-repeat;
          background-size: 100% 100%;
          position: absolute;
          left: 20px;
          top: 50%;
          transform: translate(0, -50%);
        }
        &:last-child {
          margin: 0;
        }
        &:hover {
          box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.32);
        }
        i {
          display: inline-block;
          width: 70px;
          // height: 70px;
          position: absolute;
          font-size: 3rem;
          // line-height: 70px;
          text-align: center;
          color: #fff;
          left: 30px;
          top: 50%;
          transform: translateY(-50%);
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.3);
        }
        > div {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          left: 40%;
          span {
            display: block;
            font-size: 14px;
            line-height: 30px;
            // &.summary-item-name {
            // }
            &.summary-item-number {
              line-height: 40px;
              font-size: 36px;
            }
          }
        }
      }
    }
    .container-center {
      // height: calc(100% - 350px);
      height: calc(100% - 43%);
      margin-bottom: 10px;
      .common {
        // width: 68px;
        // height: 68px;
        width: 43%;
        height: 64%;
        background-repeat: no-repeat;
        background-size: 68px 68px;
      }
      .el-card__body {
        height: calc(100% - 39px);
        padding: 10px 20px;
      }
      .error-count {
        .el-card__body {
          display: flex;
          text-align: center;
          flex-direction: column;
          padding: 10px 20px;
        }
      }
      .quckily-c {
        height: 35%;
        margin-bottom: 10px;
        .el-card__body {
          height: calc(100% - 39px);
          display: flex;
          align-items: center;
          padding: 10px 20px;
        }
      }

      .quick-access-wrap {
        width: 100%;
        padding: 10px 0;
        // height: calc(100% - 39px);
        text-align: center;
        display: flex;
        justify-content: space-between;

        .quick-access-item {
          width: 15%;
          // padding-top: 10px;
          float: left;
          cursor: pointer;
          border-radius: 2px;
          transition: all 0.4s;
          & + .quick-access-item {
            margin-left: 10px;
          }
          &:hover {
            color: #000;
            /*background: rgba(0,0,0,0.1);*/
            i {
              width: 75px;
              height: 75px;
              line-height: 75px;
              background: #2b8ec1;
            }
          }

          i,
          span {
            display: block;
            transition: all 0.3s;
          }
          i {
            margin: 0 auto;
            width: 70px;
            height: 70px;
            font-size: 3rem;
            line-height: 70px;
            text-align: center;
            color: #fff;
            border-radius: 50%;
            background: #2db6f4;
          }
          span {
            font-size: 14px;
            line-height: 20px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }

      .line-chart-legend {
        // display: flex;
        height: 30%;
        .el-col {
          > span {
            display: block;
            font-size: 14px;
            line-height: 25px;
            &:last-child {
              font-size: 30px;
              line-height: 40px;
            }
          }

          &:last-child {
            text-align: right;
          }
        }
      }

      .task-wrapper-card {
        .el-card__body {
          padding: 10px;
          height: calc(100% - 40px);
          .task-wrapper {
            height: 100%;
            overflow-y: auto;
            .task-item {
              border-bottom: 1px solid #dedede;
              padding: 10px;
              line-height: 30px;
              &:last-child {
                border-bottom: 0 none;
              }
              // .task-info {
              // }
              .task-title {
                line-height: 22px;
              }
            }
          }
        }
      }

      .abnormal-type-progress {
        margin-bottom: 5px;
        .el-progress-bar__outer {
          overflow: visible;
          background: transparent;
          .el-progress-bar__innerText {
            position: absolute;
            color: #000;
            top: 50%;
            transform: translateY(-50%);
          }
        }
      }
    }
    .container-bottom {
      height: calc(30% - 10px);
      // margin-bottom: 10px;
      .el-card__body {
        height: 100%;
      }
    }
    .item-box {
      background-color: @white;
      border-radius: 4px;
      border: solid 1px #e6eced;
      height: calc(100% / 3.09);
      width: 100%;
      margin-bottom: 10px;
      padding-top: 15px;
      box-sizing: border-box;

      #chartBox1,
      #chartBox2 {
        width: 100%;
        height: 100%;
      }

      .pie-chart {
        width: 20%;
        height: 100%;
        display: inline-block;

        #abnormal-chart {
          width: 100%;
          height: 80%;
        }
      }

      .bar-chart {
        width: 100%;
        height: 100%;
        display: inline-block;

        #province-state-chart {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
.tooltip-box {
  background-color: rgba(0, 0, 0, 0.6);
  color: #ffffff;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border-radius: 15px;
  padding: 0px 12px;
  position: relative;
}
.tooltip-box:before {
  display: inline-block;
  content: '';
  width: 0;
  height: 0;
  border: 4px solid rgba(0, 0, 0, 0);
  border-top: 4px solid rgba(0, 0, 0, 0.6);
  position: absolute;
  bottom: -8px;
  left: 0px;
  right: 0px;
  margin: auto;
}
</style>
