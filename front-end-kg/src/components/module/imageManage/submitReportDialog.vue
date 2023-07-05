<template>
  <el-dialog
    title="提示"
    :visible="visible"
    width="25%"
    @close="reportDialogClose"
    custom-class="camera-player-dialog gd-custom-dialog"
    v-dialogDrag="{ fullScreen: false }"
    :append-to-body="true"
    :close-on-click-modal="false"
  >
    <span>确定上报此摄像机异常原因吗？</span>
    <span slot="footer" class="dialog-footer">
        <el-button @click="reportDialogClose()">取 消</el-button>
        <el-button type="primary" @click="submitClick">确 定</el-button>
      </span>
  </el-dialog>
</template>

<script>
export default {
  name: "submitReportDialogVisible",
  components: {},
  data() {
    return {
      submitReportDialog: false,
    };
  },
  props: {
    visible: {
      type: Boolean,
      default() {
        return false;
      },
    },
    cameraInfo: {
      type: Object,
      default() {
        return {};
      },
    },
    cameraId: String,
  },
  computed: {},
  mounted() {
  },
  watch: {
    cameraId: {
      handler(newName, oldName) {},
      immediate: true,
    },
  },
  methods: {
    //   关闭弹窗
    reportDialogClose() {
      this.$emit("update:visible", false);
    },

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    submitClick(cameraId){
      console.log(this.cameraId,"parmas")
      let parmas = {
        cameraId: this.cameraId,
      };
      this.$api.submitReporting(parmas).then((res) => {
        if (res.code === 200) {
          this.$emit("update:visible", false);
          this.$message.success({
            message: "上报成功",
            type: "success",
          });
        } else {
          this.$message.error({
            message: res.message,
            type: "error",
          });
        }
      });
    },
    
  },
};
</script>

<style lang="less" scope>
</style>
