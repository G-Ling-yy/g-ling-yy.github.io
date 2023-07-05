<template>
  <div class="control-nav-box">
    <el-menu
      :unique-opened="true"
      :default-active="navActiveIndex"
      @select="handleSelect"
    >
      <!--<menu-item :menu-list="authorizationList"></menu-item>-->

      <!--v-if=" ['00','10'].indexOf(item.functionType) >= 0 && item.status === '1'"-->
      <template
        v-for="(item, idx) in myRoleMenuList"
        v-if="
          ['00', '10'].indexOf(item.functionType) >= 0 && item.status === '1'
        "
      >
        <el-submenu
          :index="item.id"
          v-if="item.children"
          :key="idx"
        >
          <template slot="title">
            <!--<i class="menuIcon el-icon-arrow-right"></i>-->
            <i class="el-icon-menu"></i>
            <span>{{ item.label }}</span>
          </template>
          <!--<el-menu-item v-for="child in item.children[0].children" :index="child.path" :key="child.path">{{child.name}}</el-menu-item>-->
          <menu-item :menu-list="item.children"></menu-item>
        </el-submenu>
        <el-menu-item :index="item.functionUrl + ''" :key="idx" v-else>
          <i class="el-icon-menu"></i>
          <span>{{ item.label }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

import menuItemComponent from "./common/MenuItem";
export default {
  components: {
    "menu-item": menuItemComponent,
  },
  data() {
    return {
      navActiveIndex: "1",
      myRoleMenuList: [],
      authorizationList: [
        {
          functionUrl: "/tableDemo",
          label: "表格样式",
          iconCls: "",
        },
        {
          functionUrl: "/a",
          label: "设备管理",
          iconCls: "",
          children: [
            {
              functionUrl: "/devicePlatformManage",
              label: "平台管理-管理权限",
              iconCls: "",
            },
            {
              functionUrl: "/devicePlatformOperate",
              label: "平台管理-操作权限",
              iconCls: "",
            },
            {
              functionUrl: "/deviceTranscodingManage",
              label: "视频上云网关管理",
              iconCls: "",
            },
            {
              functionUrl: "/deviceCameraManage",
              label: "摄像机管理",
              iconCls: "",
            },
            {
              functionUrl: "/deviceGroupManage",
              label: "摄像机组管理",
              iconCls: "",
            },
          ],
        },
        {
          functionUrl: "/videoPlayManage",
          label: "播放管理",
          iconCls: "",
        },
        {
          functionUrl: "/",
          label: "审核管理",
          iconCls: "",
          children: [
            {
              functionUrl: "/platformApplyBoard",
              label: "申请看板",
              iconCls: "",
            },
            {
              functionUrl: "/platformExamineBoard",
              label: "审核看板",
              iconCls: "",
            },
          ],
        },
        /*{
          functionUrl: "/d",
          label: "数据中心",
          iconCls: "",
          children: [
            {
              functionUrl: "/cameraRunStatistics",
              label: "摄像机运行情况统计",
              iconCls: ""
            },
            {
              functionUrl: "/cameraAbnormalStatistics",
              label: "摄像机故障情况统计",
              iconCls: ""
            },
            {
              functionUrl: "/cameraVisitStatistics",
              label: "摄像机访问行为统计",
              iconCls: ""
            }
          ]
        },
        {
          functionUrl: "/messageManage",
          label: "消息中心",
          iconCls: "",
          leaf: true //只有一个节点
        },*/
        {
          functionUrl: "/f",
          label: "系统管理",
          iconCls: "",
          children: [
            {
              functionUrl: "",
              label: "权限列表",
              iconCls: "",
            },
            {
              functionUrl: "/systemRoleList",
              label: "角色列表",
              iconCls: "",
            },
            {
              functionUrl: "/systemRoleGroupList",
              label: "角色组列表",
              iconCls: "",
            },
            {
              functionUrl: "/systemUserRoleBind",
              label: "用户角色绑定",
              iconCls: "",
            },
          ],
        },
      ],
    };
  },
  computed: {
    ...mapState([
      "currentPageName", // main.js 中导航守卫代码更新内容
      //"navActiveIndex",
      "login",
    ]),
  },
  beforeUpdate() {
    // console.info('beforeUpdate',this.$route.functionUrl,this.$route);
    //if(this.$route.path === '/messageCenter') this.activeIndex =  null;
  },
  /*updated(){
        console.info('afterUpdate',this.$route);
        this.activeIndex = this.$route.path === '/messageCenter' ? null : this.$route.path;
    },*/
  mounted() {
    
    //查询菜单信息
    /*this.getPowerList().then(()=>{ functionType
          console.info('powerRawList',this.login.myRoleMenuList);
      });*/
    //验证菜单内容，防止恶意修改
    let locals = localStorage.getItem("PM_CK_MU");
    // this.checkMenus(locals).then((mlist) => {
    //   // console.info('checkMenus',mlist);
    //   if (mlist && mlist.length) {
    //     let list = JSON.parse(JSON.stringify(mlist));
    //     this.resetMenuList(list);
    //     this.myRoleMenuList = list;
    //     this.navActiveIndex =
    //     this.$route.path === "/messageCenter" ? null : this.myRoleMenuList[0].id;
    //   }
    // });
    const mlist = JSON.parse(locals)?.data
    if (mlist && mlist.length) {
        let list = JSON.parse(JSON.stringify(mlist));
        this.resetMenuList(list);
        this.myRoleMenuList = list;
        this.navActiveIndex =
        this.$route.path === "/messageCenter" ? null : this.myRoleMenuList[0].id;
      }
  },
  methods: {
    ...mapActions(["checkMenus"]),
    /*...mapMutations([
          "setCurrentPageName",
      ]),*/

    handleSelect(key, keyPath) {
      console.log(key, keyPath);
      this.activeIndex = key;
      this.$router.push(key);
    },
    resetMenuList(list){
      _.each(list, it => {
        let delChildren = ['109321', '109320', '109339', '109340']
        if(it.children && !_.includes(delChildren, it.id)){
          this.resetMenuList(it.children);
        }else {
          // if(it.label === '截图管理'){
          //   it.functionUrl = '/screenshotManagement'
          // }
          // if(it.label === '录像管理'){
          //   it.functionUrl = '/videoManagement'
          // }
          // if(it.label === '图片质量检测'){
          //   it.functionUrl = '/systemReportList'
          // }
          if(it.children){
            delete it.children;
          }
        }
      });
    },
  },

};
</script>

<style lang="less">
.control-nav-box {
  height: 100%;
  width: 100%;
  background-color: @f8;
  box-shadow: 0px 2px 6px 0px rgba(108, 108, 108, 0.05);
  position: relative;
  /*box-sizing: border-box;*/
  .el-menu {
    // z-index: 1;
    .el-menu-item,
    .el-submenu__title {
      height: 50px;
      line-height: 50px;
    }
    .el-menu-item.is-active {
      color: #fff;
      background-color: #1274ee;
      i {
        color: #fff !important;
      }
    }
    .el-menu-item:hover,
    /*.el-submenu__title:hover {
      color: #fff;
      background-color: #1274ee;
      i {
        color: #fff !important;
      }
    }*/
    .el-submenu {
      .el-menu-item {
        padding: 0 20px !important;
        i {
          width: 24px;
          overflow: hidden;
          color: #1274ee;
          font-size: 0.9rem;
          &:before {
            content: "●";
            height: 6px;
            width: 6px;
            border-radius: 10px;
          }
        }
      }
    }
  }

  > .sub-menu-title {
    display: inline-block;
    line-height: 30px;
    position: absolute;
    /*z-index: 999;*/
    left: 20px;
    top: 30px;
    bottom: -1px;
    padding: 0 20px;
    background: #eef2f6;
    color: #8596a5;
    border-radius: 4px 4px 0 0;
    border: 1px solid #dde0ef;
    border-bottom: 0 none;
    box-shadow: 0px 5px 0px 0px #eef2f6;
  }

  .el-menu-demo {
    display: inline-block;
    vertical-align: middle;
    background-color: rgba(0, 0, 0, 0);
    border-bottom: 0 none;

    > li {
      min-width: 130px;
      box-sizing: border-box;
      height: 60px;
      &.is-active {
        border-bottom: 2px solid @orange;
        letter-spacing: 1px;
        color: @orange;

        .el-submenu__title {
          border-bottom: 0px;
          letter-spacing: 1px;
          color: @orange;
          box-sizing: border-box;
        }
      }
    }
  }
}

.el-menu--popup {
  min-width: 130px;
}
</style>
