<template>
  <ma-sub-menu :key="item.fullPath">
    <template v-slot:title>
      <span class="anticon">
        <icon :icon="item.meta.icon"></icon>
      </span>
      <span>{{ item.meta.title }}</span>
    </template>
    <slot></slot>
  </ma-sub-menu>
</template>

<script>
  export default {
    name: 'Submenu',
    props: {
      item: {
        type: Object,
        default() {
          return null
        }
      },
      routeChildren: {
        type: Object,
        default() {
          return null
        }
      }
    }
  }
</script>
