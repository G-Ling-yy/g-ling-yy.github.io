<template>
  <ma-layout class="layout-layout-wrap">
    <!--屏幕较小时的mask层 -->
    <div
      v-if="device === 'mobile' && !collapse"
      class="layout-mask"
      @click="handleFoldSideBar"
    ></div>
    <!-- 公共Sider -->
    <ma-layout-sider
      collapsible
      class="layout-sider"
      width="240"
      v-model:collapsed="collapse"
      :class="classObj"
      :trigger="null"
    >
      <div class="layout-logo">
        <div class="logo-icon">
          <img src="@/assets/images/logo.png" />
        </div>
        <span class="anticon"></span>
        <!-- 弃字从图 -->
        <!-- <span>{{ title }}</span> -->
        <span class="title">
          <img
            src="@/assets/images/title.png"
            srcset="@/assets/images/title_2x.png 1.5x"
          />
        </span>
      </div>
      <ma-menu
        class="layout-menu"
        theme="dark"
        mode="inline"
        v-model:selectedKeys="selectedKeys"
        v-model:openKeys="openKeys"
      >
        <layout-menu
          v-for="route in routes"
          :key="route.fullPath"
          :item="route"
        />
      </ma-menu>
    </ma-layout-sider>
    <!-- 公共主内容 -->
    <ma-layout
      class="layout-layout"
      :class="
        'mobile' === device ? 'layout-mobile-layout' : ''
      "
    >
      <ma-layout-header class="layout-header">
        <ma-row>
          <ma-col
            :xs="12"
            :sm="12"
            :md="12"
            :lg="12"
            :xl="12"
          >
            <menu-unfold-outlined
              v-if="collapse"
              class="trigger"
              @click="toggleCollapse"
            />
            <menu-fold-outlined
              v-else
              class="trigger"
              @click="toggleCollapse"
            />
          </ma-col>
          <ma-col
            :xs="12"
            :sm="12"
            :md="12"
            :lg="12"
            :xl="12"
          >
            <div class="layout-avatar">
              <ma-dropdown>
                <span class="ant-dropdown-link">
                  <!-- <ma-avatar :src="avatar" /> -->
                  {{ username }}
                  <DownOutlined />
                </span>
                <template v-slot:overlay>
                  <ma-menu>
                    <ma-menu-item @click="logout"
                      >退出登录</ma-menu-item
                    >
                  </ma-menu>
                </template>
              </ma-dropdown>
            </div>
          </ma-col>
        </ma-row>
      </ma-layout-header>
      <!-- <layout-tabs /> -->
      <ma-layout-content class="layout-content">
        <router-view v-slot="{ Component }">
          <!-- <transition mode="out-in" name="fade-transform"> -->
          <component :is="Component" />
          <!-- </transition> -->
        </router-view>
      </ma-layout-content>
    </ma-layout>
  </ma-layout>
</template>
<script>
import { recordRoute } from '@/config'
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'
import { useStore, mapActions, mapGetters } from 'vuex'
import LayoutMenu from './layout-menu'
// import LayoutTabs from './LayoutTabs'
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  DownOutlined
} from '@ant-design/icons-vue'
export default {
  setup() {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const logout = async () => {
      await store.dispatch('user/logout')
      if (recordRoute) {
        const fullPath = route.fullPath
        router.push(`/login?redirect=${fullPath}`)
      } else {
        router.push('/login')
      }

      // 清空sessionStorage
      sessionStorage.clear()

      // 清空浏览路由记录
      store.commit('tagsBar/delAllVisitedRoutes')

      // 删除localStorage 开关状态
      localStorage.setItem('switchStatus', '{}')
    }
    return {
      logo: computed(() => store.getters['settings/logo']),
      title: computed(
        () => store.getters['settings/title']
      ),
      avatar: computed(() => store.getters['user/avatar']),
      username: computed(
        () => store.getters['user/username']
      ),
      logout
    }
  },
  components: {
    LayoutMenu,
    // LayoutTabs,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    DownOutlined
  },
  data() {
    return {
      selectedKeys: [],
      openKeys: []
    }
  },
  computed: {
    ...mapGetters({
      collapse: 'settings/collapse',
      routes: 'routes/routes',
      device: 'settings/device'
    }),
    classObj() {
      return {
        'layout-mobile': this.device === 'mobile',
        'layout-collapse': this.collapse
      }
    }
  },
  watch: {
    $route: {
      handler({ path, matched }) {
        matched[0].children.length > 1
          ? (this.selectedKeys = [path])
          : (this.selectedKeys = [
              (matched[1] || matched[0]).path
            ])
        this.openKeys = [matched[0].path]
        if (this.device === 'mobile') {
          this.$store.dispatch('settings/foldSideBar')
        }
      },
      immediate: true
    }
  },
  beforeMount() {
    window.addEventListener('resize', this.handleLayouts)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleLayouts)
  },
  mounted() {
    this.handleLayouts()

    try {
      const collapse = JSON.parse(
        sessionStorage.getItem('vue-admin-collapse')
      )

      collapse && this.toggleCollapse()
    } catch (err) {
      console.log(err)
    }
  },
  methods: {
    ...mapActions({
      toggleDevice: 'settings/toggleDevice',
      handleFoldSideBar: 'settings/foldSideBar',
      toggleCollapse: 'settings/toggleCollapse'
    }),
    handleLayouts() {
      const width =
        document.body.getBoundingClientRect().width
      if (this.width !== width) {
        const isMobile = width - 1 < 992
        this.toggleDevice(isMobile ? 'mobile' : 'desktop')
        this.width = width
      }
    }
  }
}
</script>
<style lang="less">
.layout-logo {
  display: flex;
  align-items: center;
  // justify-content: center;
  padding-left: 19px;
  height: 32px;
  margin: 16px 5px;
  overflow: hidden;
  font-size: 15px;
  color: #fff;
  text-overflow: ellipsis;
  white-space: nowrap;
  .logo-icon {
    img {
      width: 32px;
    }
  }

  .title {
    img {
      filter: brightness(10);
      width: 99px;
    }
  }
}
.layout-avatar {
  .ant-dropdown-link {
    display: block;
    min-height: 64px;
    cursor: pointer;
  }
}
.layout-layout-wrap {
  .layout-sider {
    position: fixed;
    left: 0;
    height: 100vh;
    overflow: auto;

    .layout-logo {
      .anticon + span {
        font-family: cursive, serif;
        font-size: 24px;
      }
    }

    .layout-menu {
      height: calc(100vh - @layout-header-height);
    }
  }
  .layout-layout {
    padding-left: 240px;
    transition: all 0.2s;
  }
  .layout-mobile-layout {
    padding-left: 0;
    transition: all 0.2s;
  }
  .layout-collapse {
    .layout-logo .anticon + span {
      display: inline-block;
      max-width: 0;
      opacity: 0;
      transition: all 0.2s;
    }
    & + .layout-layout {
      padding-left: 80px;
      transition: all 0.2s;
    }
  }
  .layout-mask {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 998;
    width: 100%;
    height: 100vh;
    overflow: hidden;
    background: #000;
    opacity: 0.5;
  }
  .layout-mobile {
    position: fixed !important;
    z-index: 999;
    &.layout-collapse {
      width: 0 !important;
      min-width: 0 !important;
      max-width: 0 !important;
      * {
        display: none !important;
        width: 0 !important;
        min-width: 0 !important;
        max-width: 0 !important;
      }
      .ant-menu-item,
      .ant-menu-submenu {
        display: none !important;
        width: 0 !important;
        min-width: 0 !important;
        max-width: 0 !important;
      }
      & + .layout-layout {
        padding-left: 0px !important;
        transition: all 0.2s;
      }
    }
  }
  .layout-header {
    box-shadow: 2px 2px 10px 2px rgb(104 140 165 / 30%);
    padding: 0;
    position: relative;
    background: #fff;
    z-index: 1;
    .ant-col + .ant-col {
      display: flex;
      justify-content: flex-end;
      padding: 0 @layout-padding;
    }
    .trigger {
      height: @layout-header-height;
      padding: 0 @layout-padding;
      font-size: 18px;
      line-height: @layout-header-height;
      cursor: pointer;
      transition: color 0.3s;
      &:hover {
        color: #1890ff;
      }
    }
  }
}
.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all 0.2s;
}

.fade-transform-enter {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.layout-content {
  padding: @layout-padding;
  margin: @layout-margin;
  background: #fff;
  .error-container {
    height: calc(
      100vh - @layout-header-height - @layout-padding -
        @layout-padding - @layout-padding - @layout-padding -
        @layout-padding - @layout-margin
    ) !important;
  }
}
</style>
