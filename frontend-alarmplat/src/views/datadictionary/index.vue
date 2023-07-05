<template>
  <!-- 表格 -->
  <div class="table-wrap">
    <self-table />
  </div>
</template>

<script setup>
import selfTable from './modules/Table'
</script>

<style lang="less" scoped>
/* 表格 */
.table-wrap {
  height: calc(100% - 300px);
}
</style>
