<template>
  <div class="content-wrapper" ref="viewbox">
    <!-- 新增弹框 -->
    <el-tree
      :data="roleList.rolePowerTreeList"
      :props="treeProps"
      show-checkbox
      node-key="functionCode"
      ref="treeRef"
      :default-checked-keys="roleList.rolePowerCheckTree"
    ></el-tree>
    <span slot="footer" class="dialog-footer">
      <!-- <el-button @click="cancelDialog">取 消</el-button> -->
      <!-- <el-button type="primary" @click="saveDialog">保 存</el-button> -->
    </span>

    <el-tree
            :data="rootData"
            ref="rootTree"
            show-checkbox
            node-key="id"
            default-expand-all
            @check="getKeys"
            :props="defaultProps"
            :default-checked-keys="checked">
        </el-tree>
  </div>


</template>

<script>
import Vue from "vue";
import { mapState, mapActions, mapMutations } from "vuex";
export default {
  data() {
    return {
      treeProps: {
        label: "functionDesc", //"showText",
        children: "childNode",
        isLeaf: "leaf"
      },
      rootData:[{
        children: "fieldNames",
        label: "resourceName",
        children: [{
              id: 'key',
              label: 'value'
            }]
      }
      ],
      defaultProps: {
        children: 'fieldNames',
        label: 'resourceName'
      }
    };
  },
  computed: {
    ...mapState(["roleList"])
  },
  mounted() {
    // 权限列表tree
    this.getPowerList();
    this.cameraList();
  },
  destroyed() {},
  methods: {
    ...mapActions(["getPowerList"]),
    cameraList() {
       this.$api.cameraList().then(res => {
        if (res.code == 200) {
          this.rootData = res.data;
          console.log("2222", this.rootData);
        } else {
          this.$message.error(res.message);
        }
      });
    },
  }
};
</script>

<style lang="less" scoped>
/*@import "css/systemmana";*/
.table-wrapper {
  min-height: calc(100% - 125px);
}
.table-control {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
