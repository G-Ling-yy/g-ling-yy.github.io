<template>
  <div class="layout-tabs">
    <div class="layout-tabs-left-panel">
      <ma-tabs
        @tab-click="handleTabClick"
        @edit="handleTabRemove"
        v-model:activeKey="tabActive"
        hide-add
        type="editable-card"
      >
        <ma-tab-pane
          v-for="item in visitedRoutes"
          :key="item.fullPath"
          :closable="!isAffix(item)"
          :tab="item.meta.title"
        ></ma-tab-pane>
      </ma-tabs>
    </div>
    <div class="layout-tabs-right-panel">
      <ma-dropdown>
        <template v-slot:overlay>
          <ma-menu @click="handleClick">
            <ma-menu-item key="closeOthersTabs">
              <a>关闭其他</a>
            </ma-menu-item>
            <ma-menu-item key="closeLeftTabs">
              <a>关闭左侧</a>
            </ma-menu-item>
            <ma-menu-item key="closeRightTabs">
              <a>关闭右侧</a>
            </ma-menu-item>
            <ma-menu-item key="closeAllTabs">
              <a>关闭全部</a>
            </ma-menu-item>
          </ma-menu>
        </template>
        <ma-button style="margin-left: 8px">
          更多
          <DownOutlined />
        </ma-button>
      </ma-dropdown>
    </div>
  </div>
</template>

<script>
import { DownOutlined } from '@ant-design/icons-vue'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'LayoutTabs',
  components: {
    DownOutlined
  },
  data() {
    return {
      affixTabs: [],
      tabActive: null,
      created: false
    }
  },
  computed: {
    ...mapGetters({
      visitedRoutes: 'tagsBar/visitedRoutes',
      routes: 'routes/routes'
    })
  },
  watch: {
    $route: {
      handler(route) {
        this.addTabs(route)
      }
    }
  },
  created() {
    this.initAffixTabs(this.routes)
    this.addTabs(this.$route)
  },
  methods: {
    ...mapActions({
      addVisitedRoute: 'tagsBar/addVisitedRoute',
      delVisitedRoute: 'tagsBar/delVisitedRoute',
      delOthersVisitedRoutes: 'tagsBar/delOthersVisitedRoutes',
      delLeftVisitedRoutes: 'tagsBar/delLeftVisitedRoutes',
      delRightVisitedRoutes: 'tagsBar/delRightVisitedRoutes',
      delAllVisitedRoutes: 'tagsBar/delAllVisitedRoutes'
    }),
    initAffixTabs(routes) {
      routes.forEach(route => {
        if (route.meta && route.meta.affix) this.addTabs(route)
        if (route.children) this.initAffixTabs(route.children)
      })
    },
    async addTabs(tag) {
      if (tag.name && tag.meta && tag.meta.tagHidden !== true) {
        let matched = [tag.name]
        if (tag.matched) matched = tag.matched.map(item => item.name)
        await this.addVisitedRoute({
          path: tag.path,
          fullPath: tag.fullPath,
          query: tag.query,
          params: tag.params,
          name: tag.name,
          matched: matched,
          meta: { ...tag.meta }
        })
        this.tabActive = tag.fullPath
      }
    },
    isActive(route) {
      return route.path === this.$route.path
    },
    isAffix(tag) {
      return tag.meta && tag.meta.affix
    },
    handleTabClick(tab) {
      const route = this.visitedRoutes.filter(item => item.path === tab)[0]
      if (this.$route.fullPath !== route.fullPath) this.$router.push(route)
    },
    async handleTabRemove(fullPath) {
      const view = this.visitedRoutes.find(item => {
        return fullPath === item.fullPath
      })
      await this.delVisitedRoute(view)
      if (this.isActive(view)) this.toLastTag()
    },
    handleClick({ key }) {
      switch (key) {
        case 'closeOthersTabs':
          this.closeOthersTabs()
          break
        case 'closeLeftTabs':
          this.closeLeftTabs()
          break
        case 'closeRightTabs':
          this.closeRightTabs()
          break
        case 'closeAllTabs':
          this.closeAllTabs()
          break
      }
    },
    async closeSelectedTag(view) {
      await this.delVisitedRoute(view)
      if (this.isActive(view)) {
        this.toLastTag()
      }
    },
    async closeOthersTabs() {
      await this.delOthersVisitedRoutes(this.toThisTag())
    },
    async closeLeftTabs() {
      await this.delLeftVisitedRoutes(this.toThisTag())
    },
    async closeRightTabs() {
      await this.delRightVisitedRoutes(this.toThisTag())
    },
    async closeAllTabs() {
      await this.delAllVisitedRoutes()
      if (this.affixTabs.some(tag => tag.path === this.toThisTag().path)) {
        return
      }
      this.toLastTag()
    },
    toLastTag() {
      const latestView = this.visitedRoutes.slice(-1)[0]
      if (latestView) this.$router.push(latestView)
      else this.$router.push('/')
    },
    toThisTag() {
      const view = this.visitedRoutes.find(item => item.fullPath === this.$route.fullPath)
      if (this.$route.path !== view.path) this.$router.push(view)
      return view
    }
  }
}
</script>
<style lang="less">
.layout-tabs {
  padding: 0 @layout-margin;
  background: #ffffff;
  &-left-panel {
    float: left;
    width: calc(100% - 52px - @layout-margin - @layout-margin);
  }
  &-right-panel {
    float: left;
    width: 52px;
  }
  .ant-tabs {
    &-bar {
      margin: 0 !important;
    }
    &-tab {
      height: 32px !important;
      margin: 0 0 0 10px !important;
      line-height: 32px !important;
      padding: 0 20px;
      background: #eee;
      border-radius: 10px 10px 0 0;
    }
    &-tab-prev,
    &-tab-next {
      display: none;
    }
    &-tab-active {
      border: 1px solid #1890ff !important;
      background: #1890ff;
      color: #fff;
      .ant-tabs-close-x {
        color: #fff !important;
        margin-left: 12px;
      }
    }
  }
}
</style>
