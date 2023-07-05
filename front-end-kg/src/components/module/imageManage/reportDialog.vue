<template>
  <el-dialog
    title="填写异常原因"
    :visible="visible"
    width="30%"
    @close="reportDialogClose"
    custom-class="camera-report-dialog gd-custom-dialog"
    v-dialogDrag="{ fullScreen: false }"
    :append-to-body="true"
    :close-on-click-modal="false"
  >
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="report-ruleForm"
    >
      <el-form-item label="当前状态" prop="state">
        <el-select v-model="ruleForm.state" placeholder="请选择状态">
          <el-option
            v-for="item of ruleForm.stateList"
            :key="item.state"
            :label="item.handleStatus"
            :value="item.state"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="异常原因" prop="errorReason">
        <el-input
          type="textarea"
          v-model="ruleForm.errorReason"
          placeholder="请输入异常原因"
          maxlength="200"
          resize="none"
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item label="是否上报" prop="isReport">
        <el-select v-model="ruleForm.isReport" placeholder="请选择状态" style="width:160px; float:left">
          <el-option
            v-for="item of ruleForm.isReportList"
            :key="item.state"
            :label="item.reportStatus"
            :value="item.state"
          >
          </el-option>
        </el-select>
        <p v-if="ruleForm.isReport == 0 ? true : false" class="reportTitp">将自动上报故障原因至部级平台</p>
      </el-form-item>
      <el-form-item>
        <div class="footBtn">
          <el-button @click="reportDialogClose()">取消</el-button>
          <el-button type="primary" @click="createReport()">确定</el-button>
        </div>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  name: "reportDialogVisible",
  components: {},
  data() {
    return {
      reportDialogVisible: false,
      ruleForm: {
        stateList: [
          {
            state: "0",
            handleStatus: "未处理",
          },
          {
            state: "1",
            handleStatus: "处理中",
          },
          {
            state: "2",
            handleStatus: "已处理",
          },
          {
            state: "3",
            handleStatus: "延期处理",
          },
        ],
        isReportList: [
          {
            state: "0",
            reportStatus: "立即上报",
          },
          {
            state: "1",
            reportStatus: "未上报",
          },
        ],
        errorReason: "",
        isReport: "0",
        state: "1",
      },
      rules: {
        state: [{ required: true, message: "请选择状态", trigger: "change" }],
        errorReason: [
          { required: true, message: "请输入异常原因", trigger: "blur" },
        ],
        isReport: [{ required: true, message: "是否上报", trigger: "change" }],
      },
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
    event:Object,
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
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    createReport(cameraId) {
      let parmas = {
        cameraId: this.cameraId,
        errorReason: this.ruleForm.errorReason,
        isReport: this.ruleForm.isReport,
        state: this.ruleForm.state,
      };
      console.log(this)
      this.$api.createReporting(parmas).then((res) => {
        if (res.code === 200) {
          this.$emit("update:visible", false);
          this.event()
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
  .report-ruleForm{
    .el-textarea__inner{
      height: 100px;
    }
    .footBtn{
      padding:6% 0 0 22%;
    }
    .el-form-item:last-child{
      margin-bottom: 0;
    }
    .reportTitp{
      line-height: 4px;
      color: #ccc;
    }
  }

</style>
