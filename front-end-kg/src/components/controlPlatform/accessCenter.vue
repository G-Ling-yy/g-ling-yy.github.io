<template>
  <div class="access-center">
    <div class="access-center-breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/dashboard' }">
          <i class="el-icon-coin"></i>
        </el-breadcrumb-item>
        <el-breadcrumb-item>资源管理</el-breadcrumb-item>
        <el-breadcrumb-item>接入中心</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="access-center-tab">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="上云网关管理" name="first">
          <DeviceTranscodingManage></DeviceTranscodingManage>
        </el-tab-pane>
        <el-tab-pane
          label="下级平台管理"
          name="down"
          v-if="uinfo.regionCode == 100000 ? true : false"
        >
          <!-- <el-tab-pane label="下级平台管理" name="down"> -->
          <devicePlatformManage></devicePlatformManage>
        </el-tab-pane>
        <el-tab-pane label="上级平台管理" name="up">
          <superiorPlatform></superiorPlatform>
        </el-tab-pane>
      </el-tabs>
      <!-- <DeviceTranscodingManage></DeviceTranscodingManage> -->
    </div>
  </div>
</template>
<script>
import DeviceTranscodingManage from './DeviceTranscodingManage'
import devicePlatformManage from '../../components/module/Platform-manager/index.vue'
import superiorPlatform from './superiorPlatform'
export default {
  components: {
    DeviceTranscodingManage,
    devicePlatformManage,
    superiorPlatform
  },
  data() {
    return {
      uinfo: {
        regionCode: JSON.parse(
          localStorage.getItem('cloudplatform')
        ).regionCode
      },
      activeName: 'first'
    }
  }
}
</script>
<style lang="less">
.access-center-tab {
  margin-top: 13px;
  padding-top: 14px;
  .el-tabs--card > .el-tabs__header {
    border-bottom: 1px solid #e4e7ed;
    background: #fff;
    padding-top: 24px;
    border-radius: 4px;
    padding-left: 16px;
    margin: 0 0 2px;
  }
}
</style>
