<template>
  <div>
    <el-dialog
      title="newTitle"
      :visible.sync="addProviceVisable"
      width="364px"
      v-dialogDrag
      :append-to-body="true"
      :close-on-click-modal="false"
    >
      <el-form :model="addDeiveGroupFrom">
        <el-form-item label>
          <div style="height:17px"></div>
        </el-form-item>
        <el-form-item label>
          <el-input v-model="addDeiveGroupFrom.groupName" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label>
          <div style="height:18px"></div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDeiveGroupDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDeiveGroup()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "addDialog",
  props: {},
  data() {
    return {};
  },
  created() {},

  methods: {}
};
</script>
<style lang="less">
</style>