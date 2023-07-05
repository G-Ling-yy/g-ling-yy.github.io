<template>
  <div class="camera-detail">
    <div class="camera-name">
      <div class="one-camera">
        <span style="color:#000;">{{
          cameraDetailedInfo.cameraName
        }}</span>
        <span
          style="font-size:12px;color: #A9A9A9;user-select: all;"
          >CameraNumber：{{
            cameraDetailedInfo.cameraNum
          }}</span
        >
      </div>
      <div
        class="change-time"
        style="font-size:12px;color: #A9A9A9;"
      >
        <span>更新时间&nbsp;</span>
        <span>{{ cameraDetailedInfo.lastUpdateTime }}</span>
      </div>
    </div>
    <el-collapse v-model="activeNames">
      <el-collapse-item title="基本信息" name="1">
        <el-col
          :span="6"
          style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;"
        >
          <div class="grid-content">
            <div class="row-content">
              <div class="title">地区：</div>

              <el-tooltip
                class="item"
                effect="dark"
                :content="cameraDetailedInfo.regionId"
                placement="top-start"
              >
                <div class="centent ellipsis">
                  <!-- {{
                cameraDetailedInfo.provinceName +
                "/" +
                cameraDetailedInfo.cityName +
                "/" +
                cameraDetailedInfo.regionName
                }}-->
                  {{ cameraDetailedInfo.regionId }}
                </div>
              </el-tooltip>
            </div>

            <div class="row-content">
              <div class="title">经纬度：</div>

              <div class="centent">
                {{
                  cameraDetailedInfo.longAndLati
                    .split('/')
                    .map(e => (+e).toFixed(8))
                    .join('/')
                }}
              </div>
            </div>

            <div class="row-content">
              <div class="title">摄像机类型：</div>
              <div class="centent">
                {{ cameraDetailedInfo.cameraType }}
              </div>

              <!-- 摄像机类型 1:监控型枪机 2:监控型球机 3:全景型 4:抓拍型 -->
            </div>

            <div class="row-content">
              <div class="title">开放状态：</div>
              <div class="centent">
                {{ cameraDetailedInfo.openStatus }}
              </div>
            </div>
            <!-- <div class="row-content" style="width:800px">
              <div class="title">所属摄像机组：</div>
              <el-tooltip
                class="item"
                effect="dark"
                :content="cameraDetailedInfo.groupNames"
                placement="top-start"
              >
                <div class="centent">{{ cameraDetailedInfo.groupNames }}</div>
              </el-tooltip>
            </div> -->
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content">
            <div class="row-content">
              <div class="title">管辖单位：</div>

              <el-tooltip
                class="item"
                effect="dark"
                :content="
                  cameraDetailedInfo.organizationName
                "
                placement="top-start"
              >
                <div class="centent ellipsis">
                  {{ cameraDetailedInfo.organizationName }}
                </div>
              </el-tooltip>
            </div>

            <div class="row-content">
              <div class="title">桩号：</div>

              <el-tooltip
                class="item"
                effect="dark"
                :content="cameraDetailedInfo.kmPile"
                placement="top-start"
              >
                <div class="centent ellipsis">
                  {{ cameraDetailedInfo.kmPile }}
                </div>
              </el-tooltip>
            </div>
            <div class="row-content">
              <div class="title">接入方式：</div>
              <div class="centent">
                {{
                  cameraDetailedInfo.reportSource === '1'
                    ? '网关'
                    : '平台'
                }}
              </div>
            </div>
            <div class="row-content">
              <div class="title">摄像机状态：</div>
              <div class="centent">
                <!-- <span class="square-state"></span> -->
                <!--              :style="
                      `background:${
                        cameraDetailedInfo.onlineStatus == null
                          ? stateList[2].color
                          : stateList[cameraDetailedInfo.onlineStatus].color
                      }`
                "-->
                {{ cameraDetailedInfo.cameraStatus }}
              </div>
              <!-- 1-在线正常、2-在线黑屏、3-在线故障、4-离线 -->
            </div>
          </div>
        </el-col>
        <el-col
          :span="6"
          style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;"
        >
          <div class="grid-content">
            <!-- <div class="row-content" style="min-width：0">
              <div class="title">摄像机名称：</div>
              <el-tooltip
                class="item"
                effect="dark"
                :content="cameraDetailedInfo.cameraName"
                placement="top-start"
              >
                <div class="centent">{{ cameraDetailedInfo.cameraName }}</div>
              </el-tooltip>
            </div> -->
            <div class="row-content">
              <div class="title">所属类别：</div>
              <div class="centent">
                {{
                  cameraDetailedInfo.classifyCode == 0
                    ? '默认'
                    : cameraDetailedInfo.classifyCode == 1
                    ? '道路沿线'
                    : cameraDetailedInfo.classifyCode == 2
                    ? '桥梁'
                    : cameraDetailedInfo.classifyCode == 3
                    ? '隧道'
                    : cameraDetailedInfo.classifyCode == 4
                    ? '收费广场'
                    : cameraDetailedInfo.classifyCode == 5
                    ? '收费站'
                    : cameraDetailedInfo.classifyCode == 6
                    ? '服务区'
                    : cameraDetailedInfo.classifyCode == 7
                    ? 'ETC门架'
                    : cameraDetailedInfo.classifyCode == 8
                    ? '移动视频源'
                    : ''
                }}
              </div>
            </div>

            <div class="row-content">
              <div class="title">兴趣点：</div>

              <el-tooltip
                class="item"
                effect="dark"
                :content="cameraDetailedInfo.poiName"
                placement="top-start"
              >
                <div class="centent ellipsis">
                  {{ cameraDetailedInfo.poiName }}
                </div>
              </el-tooltip>
            </div>

            <div class="row-content">
              <div class="title">接入方：</div>
              <el-tooltip
                class="item"
                effect="dark"
                :content="
                  cameraDetailedInfo.transcodingName
                "
                placement="top-start"
              >
                <div class="centent ellipsis">
                  {{ cameraDetailedInfo.transcodingName }}
                </div>
              </el-tooltip>
            </div>
            <!-- <div class="row-content">
              <div class="title">上云网关上报状态：</div>
              <div class="centent">{{ cameraDetailedInfo.cameraStatus }}</div>
            </div> -->
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content">
            <div class="row-content">
              <div class="title">路线：</div>

              <el-tooltip
                class="item"
                effect="dark"
                :content="
                  cameraDetailedInfo.roadCode +
                    cameraDetailedInfo.roadName
                "
                placement="top-start"
              >
                <div class="centent ellipsis">
                  {{
                    cameraDetailedInfo.roadCode +
                      cameraDetailedInfo.roadName
                  }}
                </div>
              </el-tooltip>
            </div>

            <div class="row-content">
              <div class="title">方向：</div>

              <div class="centent">
                <!-- {{ cameraDetailedInfo.derectionCode ==1 ? "下行" :cameraDetailedInfo.derectionCode ==2 ? "上下行" :cameraDetailedInfo.derectionCode ==3 ? "上行" :　""
                }} -->
                {{ cameraDetailedInfo.derectionCode }}
              </div>
              <!-- 摄像机方向：3-上行、1-下行、2-上下行 -->
            </div>

            <div class="row-content">
              <div class="title">显示状态：</div>

              <div class="centent">
                {{ cameraDetailedInfo.displayStatus }}
              </div>
            </div>
            <!-- <div class="row-content">
              <div class="title">推流状态：</div>
              <div class="centent">{{ cameraDetailedInfo.streamControlStatus}}</div>
            </div> -->
          </div>
        </el-col>
      </el-collapse-item>
      <el-collapse-item title="快照" name="2">
        <div class="tablePic">
          <!-- <el-radio-group v-model="tabPosition"></el-radio-group> -->
          <div class="tablePicRight">
            <p
              v-for="(item, index) in dayList"
              :key="index"
              @click="query"
            >
              {{ item }}
            </p>
          </div>
          <div class="imgDataList">
            <el-image
              v-for="item in imageData"
              :key="item.id"
              :src="item.snapshotUrl"
              :preview-src-list="[item.snapshotUrl]"
            >
            </el-image>
          </div>

          <!-- <el-tabs
            v-model="activeName"
            :tab-position="tabPosition"
            :active-name="activeDate"
            @tab-click="query"
          >
            <el-tab-pane :label="item" :name="item" v-for="(item , index) in dayList" :key="index"> -->

          <!-- </el-tab-pane> -->
          <!-- </el-tabs> -->
        </div>
        <div class="table-pagination">
          <p class="total-pagination">
            共{{ transcodingTotal }}条
          </p>
          <el-pagination
            background
            layout=" prev, pager, next, jumper "
            :total="transcodingTotal"
            :page-size="pageSize"
            :current-page="transcodingCurrentPage"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange2"
          ></el-pagination>
        </div>
      </el-collapse-item>
      <el-collapse-item title="云端录像" name="3">
        <div class="cloud-video-header">
          <el-date-picker
            v-model="datePicker"
            type="datetimerange"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
          <el-button
            type="primary"
            plain
            class="query"
            @click="queryCloudVideo()"
            >搜索</el-button
          >
          <el-button
            type="info"
            plain
            class="query"
            style="background: #92969B !important;"
            @click="resetVideo()"
            >重置</el-button
          >
        </div>
        <div class="cloud-video-table">
          <el-table
            :data="cloudVideoDetail"
            border
            style="width: 100%"
          >
            <el-table-column
              width="80px"
              label="序号"
              align="center"
            >
              <template slot-scope="scope"
                >{{ scope.$index > 8 ? '' : '0'
                }}{{ scope.$index + 1 }}</template
              >
            </el-table-column>
            <el-table-column
              prop="saveTime"
              label="保存时间"
              min-width="100"
            ></el-table-column>
            <el-table-column
              prop="userName"
              label="录制人"
              min-width="100"
            ></el-table-column>
            <el-table-column
              prop="duration"
              label="时长"
              min-width="100"
            ></el-table-column>
            <el-table-column label="查看" min-width="100">
              <template slot-scope="scope">
                <el-tooltip
                  effect="dark"
                  content="播放视频"
                  placement="top"
                >
                  <el-button
                    class="table-control-btn"
                    type="primary"
                    icon="el-icon-video-play"
                    size="mini"
                    @click="handleplayVideo(scope.row)"
                  ></el-button>
                </el-tooltip>
                <el-tooltip
                  effect="dark"
                  content="导出"
                  placement="top"
                >
                  <el-button
                    class="table-control-btn"
                    type="primary"
                    icon="el-icon-download"
                    size="mini"
                    @click="handlePlayExport(scope.row)"
                  ></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="table-pagination">
          <p class="total-pagination">
            共{{ video.total }}条
          </p>
          <el-pagination
            background
            layout="prev, pager, next, total"
            :total="video.total"
            @current-change="handleCurrentChange"
          ></el-pagination>
        </div>
      </el-collapse-item>
    </el-collapse>
    <el-dialog
      title="播放视频"
      :visible="playerDialogDetailVisible"
      width="885px"
      @close="cameraPlayDialogClose"
      custom-class=" camera-player-dialog gd-custom-dialog"
      v-dialogDrag="{ fullScreen: false }"
      :append-to-body="true"
      :close-on-click-modal="false"
    >
      <div>
        <video
          v-if="this.recordFilePath != null"
          style="width: 100%; height: 100%;"
          controls="true"
          muted="true"
          autoplay="true"
        >
          <source
            :src="getVideoPath(this.recordFilePath)"
            type="audio/mp4"
          />
        </video>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import ossutil from '../../../tools/ossUtil'
export default {
  props: {
    cameraDetailedInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    cameraId: {
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      activeDate: '',
      imageData: {},
      dayList: [],
      transcodingTotal: 0,
      transcodingCurrentPage: 1,
      currPage: 1,
      pageSize: 8,
      postData: {
        currPage: 1,
        pageSize: 50,
        cameraNum: '',
        saveTime: '',
        confirmTime: '',
        saveUserName: ''
      },
      tabPosition: 'left',
      // cameraDetailedInfo: {},
      activeNames: ['1', '3'],
      activeName: 0,
      stateList: [
        { name: '离线', color: '#878787' },
        { name: '正常', color: '#26B55F' },
        { name: '故障', color: '#F9552F' }
      ],
      datePicker: null,
      cloudVideoDetail: [],
      startTime: '',
      endTime: '',
      video: {},
      video: {
        pageSize: 10,
        current: 1,
        total: 0
      },
      playerDialogDetailVisible: false
    }
  },
  created() {
    this.loadDirection()
    // this.cloudList();
    // this.getRecentDaysList();
    this.getImgListData()
    this.getCameraList()
  },
  mounted() {
    this.getCameraList()
    this.getImgListData()
    this.getTime()
    this.recentTime()
  },
  methods: {
    getVideoPath(path) {
      console.log(ossutil.getFileUrl(path), '路径')
      return ossutil.getFileUrl(path)
    },
    loadDirection() {
      var _this = this
      this.$api
        .getCodemaster({
          codeType: 'DERECTION'
        })
        .then(data => {
          if (data.code == '200') {
            // this.cameraDetailedInfo.derectionCode = _.find(data.data, {
            //   codeValue: this.cameraDetailedInfo.derectionCode
            // });
            _this.directionList = data.data
          }
        })
    },
    loadClassify() {
      var _this = this
      this.$api
        .getCodemaster({
          codeType: 'CLASSIFY'
        })
        .then(data => {
          if (data.code == '200') {
            this.cameraDetailedInfo.classifyCode = _.find(
              data.data,
              {
                codeValue: this.cameraDetailedInfo
                  .classifyCode
              }
            )
            _this.classifyList = data.data
          }
        })
    },
    // handleplayVideo(row) {
    //   //播放视频
    //   let vid = row.recordId;
    //   this.playerDialogDetailVisible = true;
    //   this.$api.videoPlayRecord(vid).then(res => {
    //     this.recordFilePath = res.data;
    //     let box = this.$refs.videos,
    //       videoPlay = document.createElement("video"),
    //       videoSource = document.createElement("source");
    //     box.appendChild(videoPlay);
    //     videoPlay.appendChild(videoSource);
    //     videoPlay.controls = true;
    //     videoPlay.autoplay = true;
    //     videoPlay.muted = true;
    //     videoPlay.style.width = "100%";
    //     videoPlay.style.height = "100%";
    //     videoSource.src = this.recordFilePath;
    //     videoSource.type = "video/mp4";
    //   });
    // },
    handleplayVideo(row) {
      //播放视频
      let vid = row.recordId
      this.playerDialogDetailVisible = true
      this.recordFilePath = row.recordFilePath
    },
    handlePlayExport(row) {
      let fileName = `${this.cameraDetailedInfo.cameraName}${this.cameraDetailedInfo.cameraNum}`
      var xhr = new XMLHttpRequest()

      this.$api.videoPlayRecord(row.recordId).then(res => {
        this.downloadPath = res.data
        let url = this.downloadPath
        xhr.open('GET', url, true)
        xhr.responseType = 'blob' // 返回类型blob 在线下载需要blob行
        xhr.onload = function() {
          if (xhr.readyState === 4 && xhr.status === 200) {
            let blob = this.response
            // 转换一个blob链接
            let u = window.URL.createObjectURL(
              new Blob([blob], { type: 'video/mp4' })
            )
            let a = document.createElement('a')
            a.download = `${fileName}.mp4`
            a.href = u
            a.style.display = 'none'
            document.body.appendChild(a)
            a.click()
            a.remove()
          }
        }
        xhr.send()
      })
    },
    //获取当前时间
    getTime() {
      this.nowtime = new Date()
      console.log('nowtime: ', this.nowtime)
    },
    //前7天日期
    recentTime() {
      let myDate = new Date() // 获取今天日期
      myDate.setDate(myDate.getDate() - 6)
      let dayList = []
      let dateTemp
      let flag = 1
      console.log('day format', this.timeFormat(myDate))
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
        dateTemp =
          myDate.getFullYear() +
          '-' +
          (myDate.getMonth() + 1) +
          '-' +
          day +
          ' ' +
          hh +
          ':' +
          mm +
          ':' +
          ss
        // dateTemp = ;
        dayList = this.dayList.push(dateTemp)
        myDate.setDate(myDate.getDate() + flag)
      }
      console.log('30days', this.dayList)
    },
    timeFormat(time) {
      var d
      if ('string' == typeof time) {
        d = new Date(time.substr(0, 19)) //加入substr(0, 19)处理兼容ios报错NAN
      } else {
        d = time
      }

      var year = d.getFullYear() //年
      var month = d.getMonth() + 1 //月
      var day = d.getDate() //日
      var hh = d.getHours() //时
      var mm = d.getMinutes() //分
      var ss = d.getSeconds() //秒
      var clock = year + '-'
      if (month < 10) clock += '0'
      clock += month + '-'
      if (day < 10) clock += '0'
      clock += day + ' '
      if (hh < 10) clock += '0'
      clock += hh + ':'
      if (mm < 10) clock += '0'
      clock += mm + ':'
      if (ss < 10) clock += '0'
      clock += ss
      return clock
    },
    // cloudList() {
    //   let params = {
    //     currPage: this.video.current,
    //     pageSize: 10
    //   };
    //   let userName = JSON.parse(localStorage.getItem("cloudplatform")).userName;
    //   let data = {
    //     saveUserName: userName,
    //     cameraNum: this.cameraDetailedInfo.cameraNum,
    //     timeStart: this.startTime,
    //     timeEnd: this.endTime
    //   };
    //   this.$api.getCamera(params, data).then(res => {
    //     this.cloudVideoDetail = res.data;
    //     this.video.current = res.currentPage;
    //     this.video.total = res.total;
    //   });
    // },
    getCameraList() {
      this.postData.cameraNum = this.cameraDetailedInfo.cameraNum
      this.$api.getCameraVideo(this.postData).then(res => {
        if (res.code == 200) {
          this.cloudVideoDetail = res.data
          console.log(this.cloudVideoDetail, 'ssss')
        } else {
          this.$message.error(res.message)
        }
      })
    },
    //获取天数列表
    // getRecentDaysList() {
    //   let params = {
    //     days: 7
    //   };
    //   this.$api.getRecentDaysList(params).then(res => {
    //     this.dayList = res.data;
    //     this.activeDate = this.dayList[0];
    //     this.getImgListData(this.dayList[0]);
    //   });
    // },
    getImgListData() {
      let obj = {
        pageSize: this.pageSize,
        currPage: this.transcodingCurrentPage,
        // startTime: this.dayList[0],
        endTime: this.dayList[1],
        cameraId: this.cameraDetailedInfo.cameraId
      }
      console.log(obj, 'obj')
      this.$api.getImgList(obj).then(res => {
        if (res.code == 200) {
          this.imageData = []
          setTimeout(() => {
            this.imageData = res.data
          }, 500)

          this.pageSize = res.pageSize
          this.transcodingTotal = res.total
        } else {
          this.$message.error(res.message)
        }
      })
    },
    query(item) {
      this.getImgListData(item.name)
    },

    /**
     * 查询云录像list
     */
    queryCloudVideo() {
      this.postData.saveTime = this.datePicker[0]
      this.postData.confirmTime = this.datePicker[1]
      this.getCameraList()
    },
    //重置
    resetVideo() {
      this.postData.saveTime = ''
      this.postData.confirmTime = ''
      this.datePicker = null
      this.getCameraList()
    },
    cameraPlayDialogClose() {
      this.playerDialogDetailVisible = false
      this.recordFilePath = null
    },
    handleCurrentChange(current) {
      this.video.current = current
      // this.cloudList();
    },
    handleSizeChange(sizeVal) {
      this.pageSize = sizeVal
      this.getImgListData()
    },
    handleCurrentChange2(curPage) {
      this.transcodingCurrentPage = curPage
      this.getImgListData()
    },
    resetCurrent() {
      this.video.current = 1
    }
  }
}
</script>

<style lang="less">
.camera-detail {
  .camera-name {
    display: flex;
    justify-content: space-between;
    height: 80px;
    // line-height: 80px;
    padding: 0px 20px;
    box-sizing: border-box;
    border-bottom: 1px solid rgba(212, 212, 212, 1);
    .one-camera {
      display: flex;
      flex-direction: column;
      > span {
        line-height: 60px;
        height: 30%;
      }
    }
    .change-time {
      line-height: 80px;
    }
    // >span:first-child {
    //   display: inline-block;
    //   width: 70%;
    //   color: #000000;
    // }

    // >span:last-child {
    //   display: inline-block;
    //   width: 30%;
    //   text-align: right;
    //   color:rgba(10,17,33,0.5);
    // }
  }

  > .el-collapse {
    border-top: 0px;

    .el-collapse-item {
      .el-collapse-item__header {
        padding: 0px 20px;
        border-bottom: 1px dashed rgba(212, 212, 212, 1);

        .el-collapse-item__arrow {
          width: 18px;
          height: 18px;
          background: #e8eaef;
          border-radius: 50%;
          text-align: center;
          line-height: 19px;
          font-size: 12px;
        }
      }

      .el-collapse-item__header.is-active {
        border-bottom-color: transparent;
      }

      .el-collapse-item__header:before {
        content: ' ';
        display: inline-block;
        width: 3px;
        height: 12px;
        background: rgba(18, 116, 238, 1);
        border-radius: 2px;
        margin-right: 7px;
      }

      .el-collapse-item__wrap {
        padding: 0px 20px 15px;
        border-bottom: 1px dashed rgba(212, 212, 212, 1);

        .el-collapse-item__content {
          .grid-content {
            .row-content {
              .title {
                display: inline-block;
                color: #a9a9a9;
                font-size: 12px;
              }

              .centent {
                display: inline-block;
                color: #000000;
                font-size: 12px;
                &.ellipsis {
                  vertical-align: bottom;
                  max-width: 10em;
                }

                .square-state {
                  display: inline-block;
                  width: 5px;
                  height: 5px;
                  background: rgba(38, 181, 95, 1);
                  vertical-align: middle;
                  margin-right: 5px;
                  margin-top: -2px;
                }
              }
            }
          }

          .cloud-video-header {
            margin-bottom: 17px;

            .el-button--primary {
              width: auto;
              height: 30px;
              border-radius: 2px;
              padding: 0 15px;
              border: 0;
              vertical-align: top;
              text-align: center;
              transition: all 0.3s;
              background-color: #1274ee !important;

              span {
                color: #ffffff;
              }
            }

            .el-button--info {
              width: auto;
              height: 30px;
              border-radius: 2px;
              padding: 0 15px;
              border: 0;
              vertical-align: top;
              text-align: center;
              transition: all 0.3s;
              margin-left: 10px;
              background-color: rgba(
                100,
                100,
                100,
                0.52
              ) !important;
              color: #ffffff;
            }

            .el-date-editor {
              width: 358px;
              height: 30px;
              vertical-align: middle;
              border-radius: 2px;
              margin-right: 30px;

              .el-input__icon,
              .el-range-separator {
                line-height: 20px;
              }

              .el-range-input {
                width: 40%;
              }
            }
          }

          .cloud-video-table {
            .el-table {
              .el-table__header {
                thead {
                  tr {
                    th {
                      height: 45px;
                      box-sizing: border-box;
                      padding: 10px 0px;
                      background: rgba(243, 243, 243, 1);
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    .el-collapse-item:last-child {
      .el-collapse-item__wrap {
        border-bottom: 0px !important;
      }
    }
  }
}
.tablePic {
  display: flex;
  .tablePicRight {
    width: 20%;
  }
  .imgDataList {
    width: 70%;
    .el-image {
      width: 25%;
      padding: 1%;
      img {
        width: 100%;
      }
    }
  }
}
</style>
