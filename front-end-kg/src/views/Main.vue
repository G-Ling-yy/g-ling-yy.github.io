<template>
  <el-container class="container-wrapper">
    <el-header class="container-header">
      <!--头部-->
      <nav-bar
        v-show="!$route.meta.hideNav"
        v-if="showNavbar"
      ></nav-bar>
    </el-header>
    <el-container class="container-body">
      <!--左侧菜单-->
      <el-aside
        class="container-side"
        :width="sideCollapsed ? '0px' : '226px'"
      >
        <vue-scroll :ops="$root.scrollOpsY">
          <side-menu></side-menu>
        </vue-scroll>
        <div
          class="side-collapse-btn"
          @click="sideCollapseCheck"
        >
          <i
            class="el-icon-s-unfold"
            v-if="sideCollapsed"
          ></i>
          <i class="el-icon-s-fold" v-else></i>
        </div>
      </el-aside>
      <!--内容区-->
      <el-main class="container-content">
        <vue-scroll :ops="$root.scrollOpsY">
          <div
            style="height: calc(100vh - 70px); padding: 20px;"
          >
            <router-view
              class="fadeIn animated"
            ></router-view>
          </div>
        </vue-scroll>
        <el-backtop
          target=".container-content>.__vuescroll .__panel"
          :bottom="60"
          :visibility-height="300"
        >
          <div id="backToTop">
            <i class="el-icon-upload2"></i>
          </div>
        </el-backtop>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex'
import NavBar from '../components/NavBar.vue'
import SideMenu from '../components/Menu.vue'

export default {
  name: '',
  components: {
    NavBar,
    SideMenu
  },
  data() {
    return {
      showNavbar: true,
      sideCollapsed: false
    }
  },
  computed: {
    ...mapState(['userInfo'])
  },

  created() {
    /* 动态jquery脚本加载 */
    const jqueryJs = Array.from(document.scripts).find(
      e => e.title === 'jqueryMin'
    )

    jqueryJs && (jqueryJs.src = jqueryJs.dataset.src)
  },

  mounted() {
    // 加载基础数据
    //this.getUserOrganization();
    this.getProvince()
    this.getOrg()
    this.getOrgTree()
    this.getRoad()
    this.getCodemaster({ codeType: 'CLASSIFY' })
    this.getCodemaster({ codeType: 'DERECTION' })
    if (
      this.userInfo.source &&
      this.userInfo.source === '2' &&
      this.userInfo.userType !== '4'
    ) {
      this.showNavbar = false
    }

    let sinfo = JSON.parse(
      localStorage.getItem('cloudsysinfo')
    )
    let logoUrl =
        sinfo.logoUrl ||
        'https://logo123.obs.cn-east-3.myhuaweicloud.com/logo.png',
      platformName = sinfo.platformName || '视频中台3.3'
    this.setSystemLogoUrl(logoUrl)
    this.setSystemName(platformName)
  },

  methods: {
    ...mapActions([
      'getProvince',
      'getOrg',
      'getRoad',
      'getCodemaster',
      'getOrgTree',
      'getUserOrganization'
    ]),
    ...mapMutations(['setSystemLogoUrl', 'setSystemName']),
    sideCollapseCheck() {
      this.sideCollapsed = !this.sideCollapsed
      if (this.sideCollapsed) {
        document.querySelector(
          '.table-pagination'
        ).style.width =
          document.body.clientWidth - 40 + 'px'
        document.querySelector(
          '.table-pagination'
        ).style.left = 20 + 'px'
        // console.log(document.body.clientWidth - 40, "dfe");
      } else {
        document.querySelector(
          '.table-pagination'
        ).style.width = 1440 + 'px'
        document.querySelector(
          '.table-pagination'
        ).style.left = 246 + 'px'
      }
    }
  }
}
</script>
<style lang="less">
.container-wrapper {
  height: 100vh;
  .container-header {
    height: @NavHeight!important;
    background: #2a2f37;
  }
  .container-body {
    height: calc(100% - 70px);
    .container-side {
      height: 100%;
      background: #fff;
      position: relative;
      overflow: visible;
      transition: all 0.4s;
      box-shadow: -4px 0 7px 0 rgba(0, 0, 0, 0.6);
      .el-menu {
        border: 0 none;
      }
      .side-collapse-btn {
        width: 18px;
        height: 32px;
        cursor: pointer;
        background: #fff;
        text-align: center;
        position: absolute;
        top: 10px;
        right: -18px;
        z-index: 0;
        border-radius: 0 4px 4px 0;
        transition: all 0.4s;
        box-shadow: 2px 1px 2px 0 rgba(0, 0, 0, 0.13);
        i {
          color: #000;
          line-height: 32px;
        }
        &:hover {
          box-shadow: 4px 2px 6px 0 rgba(0, 0, 0, 0.13);
        }
      }
    }
    .container-content {
      height: 100%;
      width: calc(100% - 226px);
      padding: 0;

      .el-backtop {
        width: 60px;
        height: 60px;
        background: transparent;
        #backToTop {
          height: 100%;
          width: 100%;
          background-color: rgba(18, 116, 238, 0.3);
          border-radius: 100%;
          text-align: center;
          line-height: 60px;
          color: #dbedff;
          box-shadow: 0 0 20px 9px rgba(0, 0, 0, 0.12);
          cursor: pointer;
          font-size: 2.5rem;
          z-index: 9999;
          overflow: hidden;
          transition: all 0.4s;
          &:hover {
            background-color: rgba(18, 116, 238, 0.8);
            color: #fff;
          }
        }
      }
    }
  }
}
</style>
