<template>
  <div>
       <el-dialog
        :title="addUserOrg"
        :visible.sync="addUserOrgVisable"
        v-dialogDrag
        :append-to-body="true"
        :close-on-click-modal="false"
        width="28%"
        @close="addColseDialog"
        >
        <el-form 
          v-if="addUserOrgVisable"
          :model="newDialog" label-width="100px"
          ref="addForm"
          >
          <el-form-item
            label="用户名:"
            prop="loginName"
            :rules="[{ required: true, message: '用户名不能为空' }]"
          >
            <el-input
              v-model="newDialog.loginName"
              maxlength="20"
              placeholder="请填写20字以内的用户名"
              v-if="addUserOrg == '新增'"
            ></el-input>
            <el-input
              v-model="newDialog.loginName"
              maxlength="20"
              placeholder="请填写20字以内的用户名"
              v-if="addUserOrg == '修改'"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item
            label="姓名:"
            prop="userName"
            :rules="[{ required: true, message: '姓名不能为空' }]"
          >
            <el-input
              v-model="newDialog.userName"
              maxlength="20"
              placeholder="请输入20字以内的姓名"
            ></el-input>
          </el-form-item>
          <el-form-item label="手机号:" prop="phoneNum" :rules="phoneNumber">
            <el-input
              v-model="newDialog.phoneNum"
              type="phone"
              maxlength="11"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item 
            label="所属单位:" 
            prop="organizationId"
            :rules="[{ required: true, message: '所属单位不能为空' }]"
            >
            <el-cascader
              :options="UserOrgTree1"
              v-model="newDialog.organizationId"
              :props="cascaderProps"
              clearable
              :show-all-levels="false"
             
            ></el-cascader>
          </el-form-item>
          <el-form-item label="是否启用" prop="userStatus">
            <el-radio-group v-model="newDialog.userStatus">
              <el-radio label="1">启用</el-radio>
              <el-radio label="0">停用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="关联角色:" prop="roleCode">
            <el-select
              v-model="newDialog.roleCode"
              placeholder="请选择"
              class="roleSelect"
              multiple
            >
              <el-option
                v-for="item in roleList.roleBaseList"
                :value-key="item.roleCode"
                :key="item.roleCode"
                :label="item.roleName"
                :value="item.roleCode + ''"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addColseDialog">取 消</el-button>
          <el-button type="primary" @click="addUser()">确 定</el-button>
        </div>
      </el-dialog>
  </div>
</template>
<script>
import {mapState} from 'vuex';
export default {
     computed: {
        ...mapState([
            "provinces",
            "roleList"
        ]),
    },
    props: {
        visible: Boolean
    },
    data(){
         var checkMobile = (rule, value, callback) => {
            // 验证手机号的正则表达式
            const reg = /^1[3456789]\d{9}$/;
            !reg.test(value) ? callback(new Error("请输入正确手机号")) : callback();
            };
        return {
            addUserOrg: '新增',
            addUserOrgVisable: this.visible,
            newDialog: {},
            phoneNumber: [
                { required: true, message: "请输入手机号", trigger: "blur" },
                { validator: checkMobile, trigger: "blur" },
            ],
            cascaderProps: {
                value: "organizationId",
                label: "organizationName",
                children: "childList",
                checkStrictly: true,
                multiple: false,
            },
            UserOrgTree1: []
        }
    },
    created(){
        this.queryOrgList();
    },
  methods: {
      queryOrgList(){
        this.$api.getOrgTree().then((data) => {
            if (data.code != 200) {
            this.$message({
                message: "获取行政区域失败! [" + data.code + "]: " + data.message,
                type: "error",
            });
            return Promise.reject();
            }
            let UserOrgTreeChild = data.data[0].childList;
            _.each(UserOrgTreeChild, it => {
                it.disabled = true;
            })
            this.UserOrgTree1 = UserOrgTreeChild;
        });
      },
    addColseDialog() {
      this.addUserOrgVisable = false;
      this.$emit('update:visible', false);
      if (this.addUserOrg == "修改") {
        this.newDialog.loginName = "";
        this.newDialog.userName = "";
        this.newDialog.phoneNum = "";
        this.newDialog.regionName = "";
        this.newDialog.userStatus = "";
        this.newDialog.roleName = [];
        this.newDialog.roleCode = "";
        this.newDialog.organizationId='';
        console.log(this.newDialog);
      }
    },
    addUser() {
      this.$refs.addForm.validate().then((res) => {
        let params = {
            loginName: this.newDialog.loginName,
            organizationId: this.newDialog.organizationId[this.newDialog.organizationId.length - 1],
            phoneNumber: this.newDialog.phoneNum,
            roleCodes: this.newDialog.roleCode, //关联用户id
            status: this.newDialog.userStatus,
            userName: this.newDialog.userName,
          };
          this.$api.addOrgUser(params).then((res) => {
            if (res.code == 200) {
              this.$message.success({
                message: "新增成功",
                type: "success",
              });
              this.addUserOrgVisable = false;
              this.newDialog = {
                loginName: "",
                userName: "",
                phoneNum: "",
                regionName: "",
                userStatus: "",
                roleName: [],
              };
              this.$emit('update:visible', false);
            } else {
              this.$message.error({
                message: res.message,
                type: "error",
              });
            }
          });
      });
    },
  },
};
</script>
<style lang="less"></style>
