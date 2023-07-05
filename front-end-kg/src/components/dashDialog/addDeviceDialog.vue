<template>
  <div>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="580px"
      custom-class="gd-custom-dialog"
      v-dialogDrag
      :append-to-body="true"
      :close-on-click-modal="false"
      @close="closeDialog"
    >
      <el-form 
        :model="formData"
        label-position="left" 
        label-width="120px" 
        ref="addForm">
        <el-form-item label="省份：">
          <el-select
            style="width: 394px;"
            filterable
            placeholder="全省"
            v-model="formData.regionCode"
          >
            <el-option
              v-for="item in options"
              :key="item.regionCode"
              :label="item.regionName"
              :value="item.regionCode"
            ></el-option>
          </el-select>
          <span style="color:red">*</span>
        </el-form-item>
        <el-form-item label="管辖单位：">
          <el-cascader
            style="width: 394px;"
            clearable
            ref="cascader"
            :show-all-levels="false"
            :options="options1"
            :props="orgCodeProps"
            v-model="formData.organizationId"
          ></el-cascader>
          <span style="color:red">*</span>
        </el-form-item>
        <el-form-item label="所属流媒体：">
          <el-select
            filterable
            clearable
            placeholder="请选择"
            v-model="formData.smId"
            style="width: 394px;"
          >
            <el-option
              v-for="item in options3"
              :key="item.smId"
              :label="item.smName"
              :value="item.smId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="最大接入量：">
          <!--<el-input style="width: 394px;" type="number"
              v-model="formData.channelNum"
              placeholder="请填写"
          ></el-input>-->
          <el-input-number
            v-model="formData.channelNum"
            controls-position="right"
            :min="1"
            :max="9999"

            style="width: 160px;"
          ></el-input-number>
          <span style=" color:red;  position: absolute;margin-left: 20px;"
            >*</span
          >
        </el-form-item>
        <el-form-item label="设备厂商：">
          <!--:disabled="modification"-->
          <el-select
            style="width: 394px;"
            v-model="formData.vendor"
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="item in options2"
              :key="item.regionCode"
              :label="item.codeName"
              :value="item.codeValue"
            ></el-option>
          </el-select>
          <span style="color:red">*</span>
        </el-form-item>
        <el-form-item label="访问地址：">
          <!--:disabled="modification"-->
          <div style="{display:flex;}">
            <el-select
              style="width: 100px;margin-right: 0px;"
              v-model="formData.urlHeader"
              placeholder="请选择"
            >
              <el-option value="Http://" label="Http://"></el-option>
              <el-option value="Https://" label="Https://"></el-option>
            </el-select>
            <el-input
              style="width: 200px;"
              v-model="formData.urlAddress"
              placeholder="请填写"
            >
            </el-input>
          </div>
        </el-form-item>
        <el-form-item label="设备编号：">
          <el-input
            style="width: 394px;"
            v-model="formData.deviceCode"
            placeholder="请填写"
          ></el-input>
        </el-form-item>
        <el-form-item label="设备user：">
          <el-input
            style="width: 394px;"
            v-model="formData.deviceUser"
            placeholder="请填写"
          ></el-input>
        </el-form-item>
        <el-form-item label="设备token：">
          <el-input
            style="width: 394px;"
            v-model="formData.deviceToken"
            placeholder="请填写"
          ></el-input>
        </el-form-item>
        <el-form-item label="私钥：">
          <el-upload
            style="width: 394px;"
            ref="Secretupload"
            class="upload-demo"
            :action="
              `${BASECONFIG.API_BASE_URL}/device/transcodings/` +
                transcodingId +
                '/privateKey'
            "
            :auto-upload="false"
            multiple
            :limit="1"
            :headers="uploadHeaders"
            :on-success="afterUploadPriva"
            methods="put"
          >
            <span class="uplo">上传</span>
          </el-upload>
        </el-form-item>

        <el-form-item label="联系人：">
          <el-input
            style="width: 394px;"
            v-model="formData.contactPerson"
            placeholder="请填写"
          ></el-input>
        </el-form-item>
        <el-form-item 
        label="联系电话："
        :rules="[{pattern:/^1[3456789]\d{9}$/,message:'请输入正确的手机号', trigger: 'blur'}]"
        >
          <el-input
            style="width: 394px;"
            v-model="formData.contactPhone"
            placeholder="请填写"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="hideFormData">取 消</el-button>
        <el-button type="primary" @click="dataAdd">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import store from '../../store';
export default {
  props: ["visible"],
  data() {
    let Authorization = store.state.userInfo
      ? store.state.userInfo.Authorization
      : "";
    return {
      dialogTitle: "新增",
      dialogVisible: this.visible,
      formData: {
        regionCode: "",
        organizationName: "",
        organizationId: "",
        smId: "",
        vendorCode: "",
        vendorName: "",
        authToken: "",
        ipAddress: "",
        responsiblePerson: "",
        phone: "",
        channelNum: "",
        deviceCode: "",
        deviceUser: "",
        urlHeader: "Http://"
      },
      options: [],
      options1: [],
      options2: [],
      options3: [],
      uploadHeaders: {
        Authorization: Authorization,
      },
      orgCodeProps: {
        //lazy: true,
        expandTrigger: "hover",
        value: "organizationId",
        label: "organizationName",
        children: "childList",
        checkStrictly: true,
        //lazyLoad:this.propsLazyload
      },
      transcodingId: "",
    };
  },
  created() {
    this.downProvince();
    this.downDw();
    this.getStreamingMedia();
    this.downVendor();
  },
  methods: {
      closeDialog(){
          this.$emit('update:visible', false);
      },
    //获取省下拉
    async downProvince() {
      const { data: res } = await this.$http.get(
        "/base/regions/list?regionLevel=1"
      );
      this.options = res.data;
    },
    async downVendor() {
      const { data: res } = await this.$http.get("/base/code-masters/list?codeType=VENDOR");
      this.options2 = res.data;
    },
    // 获取管辖单位
    async downDw() {
      const { data: res } = await this.$http.get("/user/organization/tree");
      let newarr = [];
      this.treecl(res.data);
      let data = res.data[0].childList;
      this.options1 = _.map(data, (it) => {
        return {
          ...it,
          disabled: true,
        };
      });
    },
    treecl(data) {
      for (let i in data) {
        data[i].value = data[i].organizationName + "*" + data[i].organizationId;
        if (data[i].childNode) {
        }
        this.treecl(data[i].childNode);
      }
    },
    // 获取流媒体
    async getStreamingMedia() {
      const { data: res } = await this.$http.get("/device/streamMedias/list", {
        currPage: 0,
        pageSize: 0,
      });
      this.options3 = res.data;
    },
    afterUploadPriva() {
      this.dialogVisible = false;
    },
    async dataAdd() {
      let FloatRegex = /^1[3456789]\d{9}$/
      if (!this.formData.regionCode) {
        return this.$notify.error({
          title: "注意！",
          message: "请选择省份",
          duration: 1500,
        });
      } else if (!this.formData.organizationId && this.addAndmodify === "add") {
        return this.$notify.error({
          title: "注意！",
          message: "请选择管辖单位",
          duration: 1500,
        });
      } else if (!this.formData.vendor) {
        return this.$notify.error({
          title: "注意！",
          message: "请选择设备厂商",
          duration: 1500,
        });
      } else if (!this.formData.channelNum) {
        return this.$notify.error({
          title: "注意！",
          message: "请输入最大接入量",
          duration: 1500,
        });
      } else if (!FloatRegex.test(this.formData.contactPhone)) {
        return this.$notify.error({
          title: "注意！",
          message: "请输入正确的手机号",
          duration: 1500,
        });
      }
        let organizationName = "";
        let checked = this.$refs.cascader.getCheckedNodes();
        let organization = _.find(checked, (it) => {
          return this.formData.organizationId[this.formData.organizationId.length - 1] === it.data.organizationId;
        });
        organizationName = organization
          ? organization.data.organizationName
          : "test";
      let vendorName = _.find(this.options2, {
        codeValue: this.formData.vendor,
      }).codeName;
      var data = {
        ...this.formData,
        vendorName,
        organizationName,
        vendor: parseInt(this.formData.vendor),
        authTokenPeer: this.formData.deviceToken,
        deviceCodePeer: this.formData.deviceCode,
        platformCodePeer: this.formData.deviceUser,
        urlAddress: this.formData.urlHeader + this.formData.urlAddress,
        organizationId: this.formData.organizationId[this.formData.organizationId.length - 1]
      };
      let instructions = {
        module: "资源管理",
        page: "对接管理",
        feature:  "新增",
        description: "新增",
      };

       const { data: res } = await this.$http.post(
          "/device/transcodings",
          data,
          {
            headers: {
              operateNote: Base64.encode(JSON.stringify(instructions)),
            },
          }
        );
        if (res.code === 200) {
          this.dialogVisible = false;
          this.$message.success("成功");
          this.transcodingId = res.data.transcodingId;
          this.transcodingName = res.data.transcodingName;
          this.$refs.Secretupload.submit();
          this.$emit('update:visible', false);
        }
       
    },
    hideFormData() {
      this.dialogVisible = false;
      this.modification = false;
      this.$refs.Secretupload && this.$refs.Secretupload.clearFiles();
      this.$refs.addForm.resetFields();
      this.emptyFormData();
    },
  },
};
</script>
<style lang="less"></style>
