<template>
    <div>
        <el-dialog
        :title="myTitle"
        :visible.sync="dialogVisible"
        width="35%"
        @close="addDialogClose"
        custom-class="gd-custom-dialog"
        v-dialogDrag
        :append-to-body="true"
        :close-on-click-modal="false"
        >
        <el-form
          :model="gatewayInfo"
          ref="ruleAddPlatformForm"
          label-width="100px"
          class="demo-ruleForm"
          label-position="left"
          :rules="addPlatformFormRules"
        >
          <div class="labeletop">
            <i class="basicBgc"></i>
            <span class="basicInfo">基础信息</span>
          </div>
          <!-- <el-form-item class="commonality" label="平台名称:" prop="regionCode">
          <el-select class="inputstyle" v-model="addPlatformForm.regionCode" placeholder="请选择">
            <el-option
              v-for="item in provinceOptions"
              :key="item.regionCode"
              :label="item.regionName"
              :value="item.regionCode + ''"
            ></el-option>
          </el-select>
          </el-form-item>-->
          <el-form-item class="commonality" label="名称:" prop="platformName">
            <el-input class="inputstyle" v-model="gatewayInfo.platformName"></el-input>
          </el-form-item>
          <el-form-item class="commonality" label="所属机构:" prop="organizationId">
            <el-cascader
              v-model="gatewayInfo.organizationId"
              clearable
              :show-all-levels="false"
              :options="UserOrgTreeChild"
              :props="orgCodeProps"
              @change="orgChange"
              @clear="orgChange"
              style="width: 150px"
            ></el-cascader>
          </el-form-item>
          <div class="labeletop">
            <i class="basicBgc"></i>
            <span class="basicInfo">接口信息</span>
          </div>
          <el-form-item class="commonality" label="访问地址:" prop="urlAddress">
            <el-select v-model="gatewayInfo.urlHeaders" style="width:90px;margin-right: 0px;">
              <el-option label="http://" value="http://"></el-option>
              <el-option label="https://" value="https://"></el-option>
            </el-select>
            <el-input class="inputstyle" v-model="gatewayInfo.urlAddress"></el-input>
          </el-form-item>
          <el-form-item class="commonality" label="平台编号:" prop="deviceCode">
            <el-input class="inputstyle" v-model="gatewayInfo.deviceCode"></el-input>
          </el-form-item>
          <el-form-item class="commonality" label="平台User:" prop="deviceUser">
            <el-input class="inputstyle" v-model="gatewayInfo.deviceUser"></el-input>
          </el-form-item>
          <el-form-item class="commonality" label="平台Token:" prop="deviceToken">
            <el-input class="inputstyle" v-model="gatewayInfo.deviceToken"></el-input>
          </el-form-item>

          <el-form-item class="commonality" label="私钥:" style="margin-top: 10px;" prop="file">
            <!-- 上传文件 -->
            <input type="file" id="fileupload" name="upload" ref="tokenFiles" @change="fileChange" />
          </el-form-item>
          <div class="labeletop">
            <i class="basicBgc"></i>
            <span class="basicInfo">联系人信息</span>
          </div>
          <el-form-item class="commonality" label="联系人:" prop="contactPerson">
            <el-input class="inputstyle" v-model="gatewayInfo.contactPerson"></el-input>
          </el-form-item>
          <el-form-item 
            class="commonality" 
            label="联系电话:" 
            prop="contactPhone"
            :rules="[{pattern:/^1[3456789]\d{9}$/,message:'请输入正确的手机号', trigger: 'blur'}]"
            >
            <el-input class="inputstyle" v-model="gatewayInfo.contactPhone"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogClose">取 消</el-button>
          <el-button type="primary" @click="addPlatform">确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>
<script>
import {mapState, mapActions} from 'vuex';
export default {
    props: ['visible'],
    data(){
        return {
            dialogVisible: this.visible,
            myTitle: "新增平台",
            gatewayInfo: {
                urlHeaders: 'http://'
            },
            addPlatformForm: {
                regionCode: "", //省份
                platformName: "", //名称
                note: "", //备注
                ipAddress: "", //访问地址
                platformUser: "", //User
                platformCode: "", //省平台编号
                organizationName: "", //业主单位
                organizationId: "",
                responsiblePerson: "", //联系人
                phone: "", //电话
                file: "",
                transcodingToken: "",
                realmName: "",
                pullSsl: null,
                hasPrivateKey: 0
            },
            addPlatformFormRules: {
                regionCode: [
                    { required: true, message: "请选择省份", trigger: "blur" }
                ],
                platformName: [
                    { required: true, message: "请输入平台名称", trigger: "blur" }
                ],
                organizationId: [
                    { required: true, message: "请输入管辖单位", trigger: "blur" }
                ],
                contactPerson: [
                    { required: true, message: "请输入联系人", trigger: "blur" }
                ],
                contactPhone: [
                    { required: true, message: "请输入电话", trigger: "blur" }
                ]
            },
            orgCodeProps: {
                expandTrigger: "hover",
                value: "organizationId",
                label: "organizationName",
                children: "childList",
                checkStrictly: true
            },
        }
    },
    created(){
        this.getUserOrganization();
    },
    computed: {
        ...mapState(["DPList", "UserOrgTreeChild"])
    },
    methods: {
        ...mapActions([
            'getUserOrganization'
        ]),
         addDialogClose() {
            this.dialogVisible = false;
            this.$refs.ruleAddPlatformForm.resetFields();
            this.emptyFormData();
            this.$emit('update:visible', false);
        },
        emptyFormData() {
            for (let key in this.addPlatformForm) {
                this.addPlatformForm[key] = "";
            }
        },
        orgChange(val) {
            if (val && val.length) {
                // let orgId=val.shift()
                let orgIdTwo=val[1];
                let orgIdone = val[val.length - 1];
                this.addPlatformForm.organizationId =orgIdone;
                this.addPlatformForm.regionCode=orgIdTwo
            }
        },
        fileChange(file) {
            var fileObj = file.target.files[0];
            var formData = new FormData();
            formData.append("file", fileObj);
            this.addPlatformForm.file = formData;
        },
         addPlatform() {
            this.$refs.ruleAddPlatformForm.validate(valid => {
                if (!valid) return;
                var params = {
                    params: {
                        platformCodePeer: this.gatewayInfo.deviceCode, //user
                        platformName: this.gatewayInfo.platformName, //平台名称
                        authTokenPeer: this.gatewayInfo.deviceToken, //token
                        deviceCodePeer: this.gatewayInfo.deviceCode, //设备编号
                        organizationId: this.addPlatformForm.organizationId
                            ? this.addPlatformForm.organizationId
                            : this.gatewayInfo.organizationId, //业主单位

                            regionCode:this.addPlatformForm.regionCode,
                        // organizationId: 1,//组织ids
                        responsiblePerson: this.gatewayInfo.contactPerson,
                        phone: this.gatewayInfo.contactPhone,
                        gw1Address: this.gatewayInfo.urlHeaders + this.gatewayInfo.urlAddress
                    },
                    formData: this.addPlatformForm.file
                    ? {
                        file: this.addPlatformForm.file
                        }
                    : null,
                    instructions: {
                        module: "资源管理",
                        page: "对接管理-平台管理",
                        feature: '新增平台',
                        description:
                        "新增平台: " + this.gatewayInfo.platformName
                    }
                };
                this.$api.addDevicePlatform(params).then(msg => {
                    if (msg.code == 200) {
                        this.$message.success("新增平台成功");
                        this.dialogVisible = false;
                        this.getPlatFormdata();
                        this.$refs.ruleAddPlatformForm.resetFields();
                        this.emptyFormData();
                        this.addPlatformForm.file = "";
                    } else {
                        this.$message.error("新增平台失败");
                    }
                    this.$emit('update:visible', false);
                });
            });
        }
    }
}
</script>
<style lang="less">

</style>