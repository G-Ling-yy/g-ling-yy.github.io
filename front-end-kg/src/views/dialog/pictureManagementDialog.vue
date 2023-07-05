<template>
  <div id="viewBox" class="pic-box" ref="viewBox">
    <!-- 底部选项按钮 -->
    <div class="camera-type-panel">
      <div class="btn-wrap">
        <el-tooltip
          v-for="it in cameraTypeList"
          :key="it.type"
          class="item"
          effect="dark"
          :content="it.title"
          placement="top-start"
          popper-class="itemTips"
        >
          <div
            :class="cameraTypeClass(it.bg, it.type)"
            @click="cameraTypeSelectClick(it.type)"
          ></div>
        </el-tooltip>

        <div class="last-item"></div>
      </div>
    </div>

    <!-- 摄像机截图统计 -->
    <div
      class="scroll-wrapper"
      v-infinite-scroll="queryImgList"
      :infinite-scroll-disabled="isScrollDisabled"
      :infinite-scroll-immediate="false"
      :infinite-scroll-delay="500"
      @scroll="onscrolls"
    >
      <div
        style="width: 230px; height: 160px; float: left;"
        v-for="item in tableData"
        :key="item.id"
      >
        <!-- <img :src="item.snapshotUrl" /> -->
        <div
          v-if="item.ossPath == null ? false : true"
          @contextmenu="openMenu($event, item)"
          @mousedown.stop
          @contextmenu.prevent
        >
          <img
            :src="item.ossPath"
            :data-src="item.ossPath"
            :data-caption="item.snapshotName || ''"
            data-magnify="gallery"
            style="width: 220px; height: 128px"
          />
        </div>
        <div
          v-if="item.ossPath == null ? true : false"
          @contextmenu="openMenu($event, item)"
          @mousedown.stop
          @contextmenu.prevent
        >
          <img
            src="../../assets/images/sujiaokongImg/offlineCamera.jpg"
            style="width: 220px; height: 128px"
          />
        </div>
        <div class="imgInfo">
          <!-- 0：默认 1：道路沿线 2：桥梁 3：隧道 4：收费广场 5：收费站 6：服务区 7：ETC门架 8：移动视频源 9：移动视频源 -->
          <span
            class="imgName"
            @contextmenu="openMenu($event, item)"
            @mousedown.stop
            @contextmenu.prevent
          >
            <!-- <img
                v-if="item.cameraType == 0 ? true : false"
                src="../../assets/images/traffic_map/icon/qt-active.png"
              /> -->
            <img
              v-if="item.cameraType == 1 ? true : false"
              src="../../assets/images/traffic_map/newicon/dlyx-active.png"
              alt="道路"
            />
            <img
              v-if="item.cameraType == 2 ? true : false"
              src="../../assets/images/traffic_map/newicon/mj-active.png"
              alt="桥梁"
            />
            <img
              v-if="item.cameraType == 3 ? true : false"
              src="../../assets/images/traffic_map/newicon/qd-active.png"
              alt="隧道"
            />
            <img
              v-if="item.cameraType == 4 ? true : false"
              src="../../assets/images/traffic_map/icon/qt-active.png"
              alt="默认"
            />
            <img
              v-if="item.cameraType == 5 ? true : false"
              src="../../assets/images/traffic_map/newicon/sfz-active.png"
              alt="收费站"
            />
            <img
              v-if="item.cameraType == 6 ? true : false"
              src="../../assets/images/traffic_map/newicon/fwq-active.png"
              alt="服务区"
            />
            <img
              v-if="item.cameraType == 7 ? true : false"
              src="../../assets/images/traffic_map/newicon/etc-active.png"
              alt="ETC"
            />
            <img
              v-if="item.cameraType == 9 ? true : false"
              src="../../assets/images/traffic_map/icon/jyz-active.png"
              alt="加油站"
            />
            <img
              v-if="item.cameraType == 0 ? true : false"
              src="../../assets/images/traffic_map/icon/qt-active.png"
              alt="默认"
            />
          </span>
          <span class="shot-span" @click="voo()">{{
            item.snapshotName
          }}</span>
        </div>
      </div>

      <!-- 底部提示 -->
      <div class="footer-tip">
        {{
          isScrollDisabled
            ? '暂无更多数据'
            : '数据加载中···'
        }}
      </div>
    </div>
    <!-- 截图分类右击菜单 -->
    <div
      ref="contextmenu"
      v-show="genreVisible"
      :style="{
        left: left + 10 + 'px',
        top: this.top + 'px'
      }"
      class="contextmenu"
    >
      <li
        @click="infoWindowClassify(item.type)"
        v-for="(item, index) in genreVisibleList"
        :key="index"
      >
        <i
          class="el-icon-check"
          style="position: absolute;left: 2px;"
          v-show="item.isExhibition"
        ></i>
        {{ item.title }}
      </li>
    </div>
    <!-- 分页 -->
    <!-- <div class="table-pagination" style="background: #091543;">
      <p class="total-pagination" style="color: #fff;" @click="voo()">共{{ transcodingTotal }}条</p>
      <el-pagination
        background
        layout=" prev, pager, next, jumper "
        :total="transcodingTotal"
        :page-size="pageSize"
        :current-page="transcodingCurrentPage"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div> -->
  </div>
</template>

<script>
import pictureManagementDialog from './pictureManagementDialog'
import { throttle } from 'lodash'
export default {
  props: {
    show: false,
    vo: {
      type: Object,
      default() {
        return {}
      }
    },
    selectType: Array,
    isActiveData: String
  },
  name: 'pictureEchartsDialog',
  components: {
    pictureManagementDialog
  },
  computed: {},
  data() {
    return {
      dialogss: false,
      orgList: [], //x轴
      onlineCountList: [],
      outlineCount: [],
      dayList: [],
      cameraTypeSelect: [],
      cameraTypeList: [
        { title: '道路', bg: 'dlyx-btn', type: '1' },
        { title: '桥梁', bg: 'mj-btn', type: '2' },
        { title: '隧道', bg: 'qd-btn', type: '3' },
        { title: '门架', bg: 'etc-btn', type: '7' },
        { title: '收费站', bg: 'sfz-btn', type: '5' },
        { title: '服务区', bg: 'fwq-btn', type: '6' },
        { title: '加油站', bg: 'online-btn', type: '9' },
        { title: '默认', bg: 'qt-btn', type: '0' }
      ],
      genreVisibleList: [
        { title: '道路', type: 1, isExhibition: true },
        { title: '桥梁', type: 2, isExhibition: true },
        { title: '隧道', type: 3, isExhibition: true },
        { title: '门架', type: 7, isExhibition: true },
        { title: '收费站', type: 5, isExhibition: true },
        { title: '服务区', type: 6, isExhibition: true },
        { title: '加油站', type: 9, isExhibition: true },
        { title: '默认', type: 0, isExhibition: true }
      ],
      dateTemp: '',
      tableData: [],
      transcodingCurrentPage: 1,
      pageSize: 70,
      currPage: '',
      transcodingTotal: 0,
      organizationId: '',
      // loading: true,
      isScrollDisabled: false,
      genreVisible: false,
      top: 0,
      left: 0,
      onscrolls: throttle(
        () => {
          this.genreVisible = false
          console.log('22', this)
        },
        1000,
        { trailing: false }
      )
    }
  },
  watch: {
    show: {
      handler(nV) {
        console.log('%c%s', 'font-size: 30px', '显示!', nV)
        if (nV) {
          this.cameraTypeSelect = this.selectType
          this.queryImgList()
        } else {
          this.reset()
          this.$parent.$parent.$emit('selfDisplay', {
            show: true,
            mark: 'self'
          })
        }
      },
      immediate: true
    },
    // 监听右击菜单的状态
    genreVisible(value) {
      if (value) {
        document.body.addEventListener(
          'click',
          this.contextmenuClose
        )
      } else {
        document.body.removeEventListener(
          'click',
          this.contextmenuClose
        )
      }
    }
  },
  created() {},
  mounted() {
    // this.drawBat();

    window.ss = this
    this.recentTime()
  },

  methods: {
    voo() {
      console.log(
        this.selectType,
        this.isActiveData,
        'voovoovoo',
        this
      )
    },

    /**
     *查询统计数据
     *
     */
    queryImgList() {
      // this.loading = true
      // 判断是否是直属截图
      let isDirectlyUnder = 2,
        orgName = this.vo.organizationName
      isDirectlyUnder = orgName.indexOf('直属') > -1 ? 1 : 2
      let obj = {
        cameraTypes: this.cameraTypeSelect,
        createDate: this.isActiveData,
        organizationId: this.vo.organizationId,
        currPage: this.transcodingCurrentPage,
        pageSize: this.pageSize,
        isDirectlyUnder: isDirectlyUnder //是否直属:1、直属 2、非直属
      }
      console.log(obj, '数据')
      this.$api
        .getImgList(obj)
        .then(res => {
          if (res.code == 200) {
            // this.loading = false
            if (res.pages === 0) {
              /* 空数据 */
              this.isScrollDisabled = true
            } else if (
              this.transcodingCurrentPage === res.currPage
            ) {
              /* 获取正确数据 */
              this.tableData = this.tableData.concat(
                res.data
              )
              this.transcodingCurrentPage === res.pages &&
                (this.isScrollDisabled = true)
              this.transcodingCurrentPage++
            }
          } else {
            this.$message.error(res.message)
          }
        })
        .finally(() => {
          $('[data-magnify=gallery]').magnify({
            callbacks: {
              beforeOpen: ctx => (this.magnifyCtx = ctx)
            },
            fixedModalPos: true,
            multiInstances: false,
            title: true,
            zIndex: 3000
          })
        })
    },
    // 用户分页处理
    // handleSizeChange(sizeVal) {
    //   this.pageSize = sizeVal
    //   this.queryImgList()
    // },
    // handleCurrentChange(curPage) {
    //   this.transcodingCurrentPage = curPage
    //   this.queryImgList()
    // },

    /**
     *获取前7天日期
     *
     */
    recentTime() {
      let myDate = new Date() // 获取今天日期
      myDate.setDate(myDate.getDate() - 6)
      let dateTemp
      let flag = 1
      for (var i = 0; i < 7; i++) {
        myDate.setDate(myDate.getDate())
        let MM = myDate.getMonth()
        let day = myDate.getDate()

        if (MM < 10) {
          MM = '0' + MM
        }
        if (day < 10) {
          day = '0' + day
        }
        dateTemp =
          myDate.getFullYear() +
          '-' +
          (myDate.getMonth() + 1) +
          '-' +
          day
        console.log(dateTemp, 'dateTemp')
        this.dayList.push(dateTemp)
        myDate.setDate(myDate.getDate() + flag)
      }
    },

    // 右击弹窗事件
    openMenu(e, row) {
      // console.log('右击弹窗',e,row)
      this.cameraRow = row
      this.left = e.clientX
      this.genreVisibleList.forEach(it => {
        if (
          parseInt(it.type) !== parseInt(row.cameraType)
        ) {
          it.isExhibition = false
        }
        if (parseInt(it.type) == parseInt(row.cameraType)) {
          it.isExhibition = true
        }
      })
      this.$nextTick(() => {
        let contextmenuRef = null
        contextmenuRef = this.$refs.contextmenu.offsetHeight
        if (
          e.clientY + contextmenuRef >=
          document.documentElement.clientHeight
        ) {
          this.top = e.clientY - contextmenuRef
        } else {
          this.top = e.clientY
        }
      })
      this.genreVisible = true
    },
    // 右击弹窗关闭
    contextmenuClose() {
      this.genreVisible = false
    },
    // 给摄像机重新分类
    infoWindowClassify(type) {
      // console.log(type, "type")
      let latObj = {
        cameraId: this.cameraRow.cameraId,
        classify: type
      }
      this.$api.updateCamera(latObj).then(res => {
        if (res.code == 200) {
          // this.tableData = []
          // this.currPage = this.transcodingCurrentPage = 1
          // this.queryImgList();
          this.tableData.map((it, i) => {
            if (
              it.cameraId === this.cameraRow.cameraId &&
              parseInt(it.cameraType) !== parseInt(type)
            ) {
              this.tableData.splice(i, 1)
            }
          })
          this.contextmenuClose()
          this.$message.success('摄像机已重新分类！')
        } else {
          this.$message.error('摄像机分类有误！')
        }
      })
    },
    //摄像机类别
    cameraTypeClass(bg, type) {
      return this.cameraTypeSelect.length != 0 &&
        this.cameraTypeSelect.indexOf(type) < 0
        ? bg
        : bg + ' active'
    },
    /**
     * 摄像机类型筛选切换
     * @param type
     */
    cameraTypeSelectClick(type) {
      if (this.cameraTypeSelect.length >= 7) {
        this.cameraTypeSelect = []
      }
      let iddx = this.cameraTypeSelect.indexOf(type)
      if (iddx >= 0) {
        this.cameraTypeSelect = []
      } else {
        this.cameraTypeSelect = [type]
        console.log(
          this.cameraTypeSelect,
          'this.cameraTypeSelect'
        )
      }
      this.tableData = []
      this.transcodingCurrentPage = 1
      this.isScrollDisabled = false
      this.magnifyCtx?.close?.()
      this.queryImgList()
    },
    reset() {
      this.item = ''
      this.cameraTypes = []
      this.tableData = []
      this.currPage = this.transcodingCurrentPage = 1
      this.isScrollDisabled = false
      this.magnifyCtx?.close?.()
    }
  }
}
</script>

<style lang="less" scoped>
.el-dialog {
  margin: 0 auto !important;
}
.imgCountList {
  display: flex;
}
.el-dialog__wrapper {
  display: flex;
  align-items: center;
  /deep/ .el-dialog {
    margin: 0 auto !important;
  }
}
#viewBox {
  &.pic-box {
    padding: 20px 0;
  }

  .scroll-wrapper {
    max-height: 75vh;
    min-height: 20px;
    overflow-x: hidden;
    overflow-y: scroll;
    position: relative;
    &::-webkit-scrollbar {
      visibility: hidden;
      height: 6px; /* no */
      width: 6px; /* no */
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 3px; /* no */
      background-color: #0393d166;
    }

    .footer-tip {
      color: #fff;
      float: left;
      height: 20px;
      line-height: 20px;
      text-align: center;
      width: 100%;
    }
  }

  .camera-type-panel {
    height: 50px;
    width: 100%;
  }
  .btn-wrap {
    float: right;
    width: 25%;
    height: 100%;
    background-image: url('../../assets/images/traffic_map/camera_wrap_bg_right.png');
    background-repeat: no-repeat;
    background-position: left center;
    background-size: auto 100%;
    &:first-child {
      background-image: url('../../assets/images/traffic_map/camera_wrap_bg_left.png');
      background-position: right center;
      // padding-right: 26px;
      .collapse-btn {
        min-width: 13px;
        width: 13px;
        height: 9px;
        margin: 20px 0;
        padding: 0;
        transition: all 0.3s;
        background-image: url('../../assets/images/traffic_map/type-wrap-btn.png');
        background-position: right center;
        background-repeat: no-repeat;
        /*&:hover{
            height: 10px;
            !*background-image:url('../assets/images/traffic_map/type-wrap-btn-gif.gif');*!
          }*/
      }
    }
    &:last-child {
      padding-left: 5px;
      margin-left: -16px;
    }

    &.status-collapsed {
      background-image: url('../../assets/images/traffic_map/camera_wrap_bg_left-cos.png');
      .fl-btn,
      .ero-btn {
        width: 0;
        padding: 0;
      }
      .collapse-btn {
        background-image: url('../../assets/images/traffic_map/type-wrap-collapsed.png');
        /*&:hover{
            height: 10px;
            !*background-image:url('../assets/images/traffic_map/type-wrap-collapsed-gif.gif');*!
          }*/
      }
    }

    > div {
      padding: 0 7%;
      height: 100%;
      width: 15.5%;
      cursor: pointer;
      transition: all 0.3s;
      background-repeat: no-repeat;
      background-size: 100% 100%;
      background-position: 30% center;
      float: left;
      position: relative;

      & + div {
        margin-left: -5%;
      }
      /*&:hover,*/
      &.all-btn {
        background-image: url('../../assets/images/traffic_map/icon/all-active.png');
        z-index: 8;
        &.active {
          background-image: url('../../assets/images/traffic_map/icon/all-active.png');
        }
      }
      &.ol-btn {
        background-image: url('../../assets/images/traffic_map/icon/online.png');
        z-index: 3;
        &.active {
          background-image: url('../../assets/images/traffic_map/icon/online-active.png');
        }
      }
      &.fl-btn {
        background-image: url('../../assets/images/traffic_map/icon/offline.png');
        z-index: 2;
        &.active {
          background-image: url('../../assets/images/traffic_map/icon/offline-active.png');
        }
      }
      &.ero-btn {
        background-image: url('../../assets/images/traffic_map/icon/error.png');
        z-index: 1;
        &.active {
          background-image: url('../../assets/images/traffic_map/icon/error-active.png');
        }
      }
      &.dlyx-btn {
        background-image: url('../../assets/images/traffic_map/icon/dlyx.png');
        z-index: 6;
        &.active {
          background-image: url('../../assets/images/traffic_map/icon/dlyx-active.png');
        }
      }
      &.online-btn {
        background-image: url('../../assets/images/traffic_map/icon/jyz.png');
        z-index: 9;
        &.active {
          background-image: url('../../assets/images/traffic_map/icon/jyz-active.png');
        }
      }
      &.mj-btn {
        background-image: url('../../assets/images/traffic_map/icon/mj.png');
        z-index: 5;
        &.active {
          background-image: url('../../assets/images/traffic_map/icon/mj-active.png');
        }
      }
      &.qd-btn {
        background-image: url('../../assets/images/traffic_map/icon/qd.png');
        z-index: 4;
        &.active {
          background-image: url('../../assets/images/traffic_map/icon/qd-active.png');
        }
      }
      &.etc-btn {
        background-image: url('../../assets/images/traffic_map/icon/etc.png');
        z-index: 3;
        &.active {
          background-image: url('../../assets/images/traffic_map/icon/etc-active.png');
        }
      }
      &.sfz-btn {
        background-image: url('../../assets/images/traffic_map/icon/sfz.png');
        z-index: 2;
        &.active {
          background-image: url('../../assets/images/traffic_map/icon/sfz-active.png');
        }
      }
      &.fwq-btn {
        background-image: url('../../assets/images/traffic_map/icon/fwq.png');
        z-index: 1;
        &.active {
          background-image: url('../../assets/images/traffic_map/icon/fwq-active.png');
        }
      }
      &.qt-btn {
        background-image: url('../../assets/images/traffic_map/icon/qt.png');
        z-index: 0;

        &.active {
          background-image: url('../../assets/images/traffic_map/icon/qt-active.png');
        }
      }
      &.last-item {
        display: none;
        width: 86px;
        background-image: url('../../assets/images/traffic_map/header-left-bg.png');
      }
    }
    &:after {
      display: inline-block;
      content: '';
      height: 0;
      width: 0;
      clear: both;
    }
  }
  .imgInfo {
    display: flex;
    .imgName {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #fff;
      line-height: 22px;
      /deep/ img {
        width: 20px;
        height: 20px;
        float: left;
        margin: 0;
      }
    }
  }
  .shot-span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #fff;
    line-height: 22px;
  }
  .el-image-viewer__close {
    color: #fff;
    top: 23%;
    right: 28%;
  }
}
.contextmenu {
  margin: 0;
  background: #011251;
  z-index: 3000;
  position: fixed;
  list-style-type: none;
  padding: 5px 0;
  text-align: left;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 400;
  color: #7fa4ef;
  border: 1px solid #04a3e8;
  box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
  li {
    margin: 0;
    padding: 7px 16px;
    cursor: pointer;
    &:hover {
      background-color: #fff;
      color: #000;
    }
  }
}
</style>
