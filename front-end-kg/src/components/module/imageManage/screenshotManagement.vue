<template>
  <div
    class="content-wrapper system-user-organize"
    ref="viewbox"
  >
    <div class="breadcrumb-wrapper">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/dashboard' }">
          <i class="iconfont icondashboard"></i>
        </el-breadcrumb-item>
        <el-breadcrumb-item>图像管理</el-breadcrumb-item>
        <el-breadcrumb-item>截图管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="organize-content" style="height:90%">
      <el-card class="box-card centent-l">
        <div slot="header" class="clearfix">
          <image-tree
            @on-click="clickScreenshot"
          ></image-tree>
        </div>
      </el-card>

      <el-card class="box-card centent-r">
        <div class="text item content-rbody">
          <div
            class="camera-search-display camera-manage-search"
          >
            <div
              :class="
                isAllHeight % 2 != 0
                  ? 'common-search-all-h'
                  : 'search-wrapper'
              "
              style="width:100%;height:auto;"
            >
              <!-- <div class="search-wrapper change-padding"> -->
              <el-form
                :inline="true"
                class="demo-form-inline"
              >
                <el-form-item>
                  <el-date-picker
                    v-model="searchInfo.selectDate"
                    type="datetimerange"
                    :picker-options="pickerOptions"
                    range-separator="~"
                    :start-placeholder="stime"
                    :end-placeholder="etime"
                    align="left"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :default-time="['00:00:00', '23:59:59']"
                  ></el-date-picker>
                </el-form-item>
                <el-form-item prop="type">
                  <el-select
                    v-model="searchInfo.type"
                    placeholder="截图状态"
                    style="width: 120px;"
                  >
                    <el-option
                      label="自动截图"
                      value="1"
                    ></el-option>
                    <el-option
                      label="手动截图"
                      value="2"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-button
                    type="primary"
                    class="query"
                    @click="query"
                    >搜索</el-button
                  >
                  <el-button
                    type="primary"
                    class="reset"
                    @click="handleReset"
                    >重置</el-button
                  >
                </el-form-item>
                <el-form-item>
                  <el-button
                    type="primary"
                    plain
                    class="query"
                    @click="delImg"
                    >删除</el-button
                  >
                  <!-- <el-button type="primary" plain class="query" @click="downLoad">下载</el-button> -->
                </el-form-item>
              </el-form>
            </div>
          </div>
          <div class="r-table">
            <el-row :gutter="24" style="margin:0">
              <div
                class="el-image-wrapper"
                style="width: 300px;height: 240px;float: left; padding:0.5%"
                v-for="(item, i) in tableData"
                :key="item.id"
                @selection-change="selsChange"
              >
                <!-- <img :src="item.snapshotUrl" /> -->
                <el-image
                  :src="item.snapshotUrl"
                  :preview-src-list="[item.snapshotUrl]"
                  style="{    width: 100%;
                    height: calc(100% - 64px);}"
                >
                </el-image>
                <el-checkbox
                  style="position: relative;top: -167px;right: -2px;"
                  :key="item.id"
                  @change="args => chooseData(args, item)"
                ></el-checkbox>
                <div class="imgInfo">
                  <span
                    class="manualImg"
                    v-if="item.type == 1"
                    >自动</span
                  >
                  <span class="automaticImg" v-else
                    >手动</span
                  >
                  <span class="imgTime">{{
                    item.snapshotTime
                  }}</span>
                  <span
                    :id="'output' + i"
                    class="imgSize"
                    >{{
                      getImgSize(item.snapshotUrl, i)
                    }}</span
                  >
                  <!-- <el-button size="small" type="primary" @click="downloadImage(item)">下载</el-button> -->
                  <span
                    class="operate-btn bold"
                    type="md-download"
                    @click="downloadImage(item.snapshotUrl)"
                  >
                    <img
                      src="../../../assets/images/icon/notDownload.png"
                      style="width:20px;heigth:20px"
                    />
                  </span>
                </div>
              </div>
            </el-row>
          </div>
          <!-- 分页 -->

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
              @current-change="handleCurrentChange"
            ></el-pagination>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import api from '@/api'
import checkCamera from '../SystemRole/checkCamera'
import imageTree from './imageTree'
import util from '../../../filters/utils'
import JSZip from 'jszip'
// import FileSaver from "file-saver";
import Base64 from '../../../tools/base64'
export default {
  name: 'screenshotManagement',

  components: { checkCamera, imageTree },

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
      sels: [], //选中的值显示
      searchInfo: {
        selectDate: '',
        type: ''
      },
      stime: '',
      etime: '',
      tableData: {},
      pageSize: 12,
      currPage: '',
      activeName: 'second',
      showPagination: false,
      isAllHeight: 0,
      phoneNumber: [
        {
          required: true,
          message: '请输入手机号',
          trigger: 'blur'
        },
        { validator: checkMobile, trigger: 'blur' }
      ],
      titleh: {
        organizationId: '',
        UName: '',
        uStatus: '',
        loginUser: '',
        orgName: '',
        flag: true,
        selectManyProvince: true,
        parentId: 0
      },
      cascaderProps: {
        value: 'organizationId',
        label: 'organizationName',
        children: 'childList',
        checkStrictly: true,
        multiple: false
      },

      addUserOrgVisable: false,
      addUserOrg: '',
      // userTableData: [],
      transcodingTotal: 0,
      transcodingCurrentPage: 1,
      userIdArr: [],
      orgProviceList: [],
      userSelList: [],
      orgUserList: [],
      idArr: [],
      organizationId: '',
      choosedImg: [],
      cameraId: '',
      url: '',
      pickerMinDate: '',
      pickerOptions: {
        //onPick当type="datetimerange"时有效
        onPick: ({ maxDate, minDate }) => {
          this.pickerMinDate = minDate.getTime()
          if (maxDate) {
            this.pickerMinDate = ''
          }
        },
        disabledDate: time => {
          if (this.pickerMinDate != '') {
            let tow = 1 * 24 * 3600 * 1000 //重点是在这里计算相差几天
            let minTime = this.pickerMinDate - tow
            let maxTime = this.pickerMinDate + tow
            return (
              time.getTime() < minTime ||
              time.getTime() > maxTime
            )
          }
        }
      }
    }
  },

  computed: {
    ...mapState([
      'sysUser',
      'setSysUserList',
      'roleList',
      'orgTreeData',
      'provinces'
    ])
  },

  created() {
    this.getImgListData()
  },

  mounted() {
    // this.getUserListData();
    this.getRoleList()
    window.localStorage.setItem('orgId', this.idArr)
    window.addEventListener(
      'scroll',
      this.handleScroll,
      true
    )
    this.$nextTick(() => {
      let width = document
        .querySelector('.centent-r')
        .getBoundingClientRect().width
    })
  },

  destroyed() {
    window.removeEventListener(
      'scroll',
      this.handleScroll,
      true
    )
  },

  methods: {
    ...mapActions([
      'getSysUserList',
      'getUserOrganization',
      'getRoleList',
      'queryImgList',
      'getDeviceStatistics'
    ]),

    // handleClick(tab, event) {
    //   console.log(tab, event)
    // },

    // 监听滚动事件
    handleScroll() {
      let scrollTop = this.$refs.viewbox?.getBoundingClientRect()
        .top
      if (scrollTop) {
        this.showPagination = true
        // return
      } else {
        this.showPagination = false
      }
    },

    clickScreenshot(item) {
      this.cameraId = item.cameraId
      this.getImgListData()
    },

    getImgSize(url, i) {
      let than = this
      fetch(url)
        .then(function(res) {
          return res.blob()
        })
        .then(function(data) {
          document.getElementById(
            'output' + i
          ).innerHTML = than.getfilesize(data.size)
        })
    },

    // 字节转文件大小单位（K、M、G、T）保留两位小数
    getfilesize(size) {
      if (!size) return ''
      const num = 1024.0 //byte
      if (size < num) return size + 'B'
      if (size < Math.pow(num, 2))
        return (size / num).toFixed(2) + 'KB' //kb
      if (size < Math.pow(num, 3))
        return (size / Math.pow(num, 2)).toFixed(2) + 'M' //M
      if (size < Math.pow(num, 4))
        return (size / Math.pow(num, 3)).toFixed(2) + 'G' //G
      return (size / Math.pow(num, 4)).toFixed(2) + 'T' //T
    },

    downloadImage(imgsrc, name) {
      //下载图片地址和图片名
      var image = new Image()
      // 解决跨域 Canvas 污染问题
      // image.setAttribute("crossOrigin", "anonymous");
      image.crossOrigin = 'Anonymous'
      image.onload = function() {
        var canvas = document.createElement('canvas')
        canvas.width = image.width
        canvas.height = image.height
        var context = canvas.getContext('2d')
        context.drawImage(
          image,
          0,
          0,
          image.width,
          image.height
        )
        var url = canvas.toDataURL('image/jpeg') //得到图片的base64编码数据
        var a = document.createElement('a') // 生成一个a元素
        var event = new MouseEvent('click') // 创建一个单击事件
        a.download = name || '摄像机截图' // 设置图片名称
        a.href = url // 将生成的URL设置为a.href属性
        a.dispatchEvent(event) // 触发a的单击事件
      }
      let fileSize = image.fileSize
      image.src = imgsrc
    },

    // getFileName(url) {
    //   var urlSlashCount = url.split('/').length
    //   return url.split('/')[urlSlashCount - 1].toLowerCase()
    // },
    // 获取所有图片
    getImgListData(curPage) {
      const myDate = new Date()
      myDate.setTime(myDate.getTime() - 1)
      let dateTemp
      let endDay
      let offset = 0
      var perDay = new Date()
      perDay.setTime(myDate.getTime() - 1)
      perDay.setDate(perDay.getDate() - 1)
      dateTemp = util.date('Y-m-d H:i:s', perDay)
      endDay = util.date('Y-m-d H:i:s', myDate)
      let Ftime = util.date('Y-m-d', perDay)
      let Ttime = util.date('Y-m-d', myDate)
      this.stime = Ftime
      this.etime = Ttime
      console.log(this.stime, this.stime, 'myDate')
      let obj
      if (
        this.searchInfo.selectDate == null ||
        this.searchInfo.selectDate == ''
      ) {
        obj = {
          status: this.searchInfo.status,
          currPage: curPage || this.transcodingCurrentPage,
          type: this.searchInfo.type,
          startTime: dateTemp,
          endTime: endDay,
          cameraId: this.cameraId,
          pageSize: this.pageSize
        }
      } else {
        obj = {
          pageSize: this.pageSize,
          status: this.searchInfo.status,
          type: this.searchInfo.type,
          currPage: curPage || this.transcodingCurrentPage,
          startTime: this.searchInfo.selectDate[0]
            ? this.searchInfo.selectDate[0]
            : '',
          endTime: this.searchInfo.selectDate[1]
            ? this.searchInfo.selectDate[1]
            : '',
          cameraId: this.cameraId
        }
      }

      console.log(obj, '数据')
      this.$api.getImgList(obj).then(res => {
        if (res.code == 200) {
          this.pageSize = res.pageSize
          this.transcodingTotal = res.total
          this.tableData = res.data
        } else {
          this.$message.error(res.message)
        }
      })
    },

    selsChange(sels) {
      this.sels = sels
    },

    // 批量处理
    getuserSelect(val) {
      this.userSelList = val.map(item => {
        return item.userId
      })
    },

    handleSelectionChange(val) {
      this.userSelList = val.map(item => {
        return item.userId
      })
    },

    chooseData(checked, img) {
      if (checked) {
        this.choosedImg.push(img)
      } else {
        this.choosedImg = this.choosedImg.filter(it => {
          return it.id !== img.id
        })
      }
    },

    // 删除
    delImg() {
      this.$confirm('提示', {
        title: '提示',
        message: '确认删除吗？',
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(res => {
          // [this.choosedVideo.recordId]
          let imgIds = _.map(this.choosedImg, it => {
            return it.id
          })
          api.delImg(imgIds).then(res => {
            if (res.code == 200) {
              this.$message.success({
                message: '已删除',
                type: 'success'
              })
              this.getImgListData()
            }
          })
        })
        .catch(() => {})
    },

    // downLoad(){
    //     let imgs = _.map(this.choosedImg, it => {
    //       return Base64.encode(it.ossUrl);
    //     }).join(',');
    //     window.open('http://47.99.190.75:10001/v1/device/camera/batchDownloadImages?urls=' + imgs);
    //     this.$nextTick(() => {
    //       this.choosedImg = [];
    //     })
    //     // api.batchDownloadImages(imgs).then(res => {
    //     // })
    // },

    //实现将项目的图片转化成base64
    getBase64ByUrl(src, callback, outputFormat) {
      var xhr = new XMLHttpRequest()
      xhr.open('GET', src, true)
      xhr.responseType = 'arraybuffer'
      xhr.onload = function(e) {
        if (xhr.status == 200) {
          var uInt8Array = new Uint8Array(xhr.response)
          var i = uInt8Array.length
          var binaryString = new Array(i)
          while (i--) {
            binaryString[i] = String.fromCharCode(
              uInt8Array[i]
            )
          }
          var data = binaryString.join('')
          var base64 = window.btoa(data)
          var dataUrl =
            'data:' +
            (outputFormat || 'image/jpg') +
            ';base64,' +
            base64
          callback.call(this, dataUrl)
        }
      }
      xhr.send()
    },

    // 用户分页处理
    handleSizeChange(sizeVal) {
      this.pageSize = sizeVal
      this.getImgListData()
    },
    handleCurrentChange(curPage) {
      this.transcodingCurrentPage = curPage
      this.getImgListData()
    },

    // 搜索
    query() {
      this.getImgListData(1)
    },

    // 重置
    handleReset() {
      this.transcodingCurrentPage = 1
      this.searchInfo.selectDate = ''
      this.searchInfo.type = ''
      this.cameraId = ''
      this.pickerMinDate = ''
      this.getImgListData(1)
    }

    // 选择状态
    // changeState(val) {}
  }
}
</script>
<style lang="less" src="../../css/imageManage.less"></style>

<style lang="less" scoped>
.centent-r {
  .el-card__body {
    .content-rbody {
      .r-table {
        .el-image-wrapper {
          .el-image {
            width: 100%;
          }
        }
      }
    }
  }
}
</style>
