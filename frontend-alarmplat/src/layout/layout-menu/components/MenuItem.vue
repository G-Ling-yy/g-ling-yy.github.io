<template>
  <ma-menu-item
    :key="routeChildren.path"
    @click.capture="handleLink"
  >
    <span class="anticon">
      <icon :icon="routeChildren.meta.icon"></icon>
    </span>
    <span>{{ routeChildren.meta.title }}</span>
  </ma-menu-item>
</template>

<script>
import { isExternal } from '@/utils/validate'
export default {
  name: 'MenuItem',
  props: {
    item: {
      type: Object,
      default() {
        return null
      }
    },
    routeChildren: {
      type: Object,
      default: () => null
    }
  },
  methods: {
    handleLink() {
      const routePath = this.routeChildren.fullPath
      const target = this.routeChildren.meta.target
      if (target === '_blank') {
        if (isExternal(routePath)) window.open(routePath)
        else if (this.$route.path !== routePath)
          window.open(routePath.href)
      } else {
        if (isExternal(routePath))
          window.location.href = routePath
        else if (this.$route.path !== routePath)
          this.$router.push(routePath)
      }
    }
  }
}
</script>
