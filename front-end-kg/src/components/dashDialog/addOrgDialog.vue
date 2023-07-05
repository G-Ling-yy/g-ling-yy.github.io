<template>
  <div>
    <el-dialog
      :title="addDialog.newTitle"
      :visible.sync="addDialog.addProviceVisable"
      width="364px"
      v-dialogDrag
      :append-to-body="true"
      :close-on-click-modal="false"
      @close="updateClose"
      >
      <el-form :model="org" label-width="100px" ref="org">
        <el-form-item
          label="所属省"
          prop="regionCode"
          :rules="[{ required: true, message: '所属省不能为空' }]"
          v-if="uinfo.regionCode == 100000 ? true : false"
          >
          <el-select v-model="org.regionCode" placeholder="请选择" multiple>
            <el-option
              v-for="item in provinces"
              :value-key="item.regionCode"
              :key="item.regionCode"
              :label="item.regionName"
              :value="item.regionCode + ''"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item 
          label="上级单位:"
          prop="jurisdictionValue"
          :rules="[{ required: true, message: '单位不能为空' }]"
          >
            <el-cascader
            v-model="org.jurisdictionValue"
            clearable
            :show-all-levels="false"
            :options="orgTreeList"
            :props="orgCodeProps"
            style="width: 150px"
            ></el-cascader>
        </el-form-item>
        <el-form-item
          label="组织名称"
          prop="orgName"
          :rules="[{ required: true, message: '组织名称不能为空' }]"
        >
          <el-input v-model="org.orgName" placeholder="请填写"></el-input>
        </el-form-item>
        <el-form-item
          label="组织类型"
          prop="orgType"
          :rules="[{ required: true, message: '组织类型不能为空' }]"
        >
          <el-select v-model="org.orgType">
            <el-option
              v-for="item in options"
              :value-key="item.value"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系人" prop="responsiblePerson">
          <el-input
            v-model="org.responsiblePerson"
            placeholder="请填写"
          ></el-input>
        </el-form-item>
        <el-form-item 
          label="联系电话" 
          prop="phone"
          :rules="[{pattern:/^1[3456789]\d{9}$/,message:'请输入正确的手机号', trigger: 'blur'}]"
          >
          <el-input v-model="org.phone" placeholder="请填写"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateClose">取 消</el-button>
        <el-button type="primary" @click="UpdataOrg()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapState, mapActions ,mapMutations} from "vuex";
export default {
    computed: {
        ...mapState([
            "provinces",
            "UserOrgTree"
        ]),
    },
    props: {
        visible: Boolean
    },
    watch: {
        visible(){
            this.addDialog.addProviceVisable = this.visible;
        }
    },
    created(){
        this.addDialog.addProviceVisable = this.visible;
        this.queryOrgList();
    },
  data() {
    return {
      uinfo:{
        regionCode: JSON.parse(localStorage.getItem("cloudplatform")).regionCode,
      },
      org: {
        jurisdictionValue: []
      },
      addDialog: {
        newTitle: "新增",
        addProviceVisable: false,
      },
      options: [
        {
          value: 5,
          label: "业主单位",
        },

        {
          value: 10,
          label: "路公司",
        },
        {
          value: 20,
          label: "路段单位",
        },
        {
          value: 30,
          label: "收费站",
        },
        {
          value: 40,
          label: "服务区",
        },
        {
          value: 90,
          label: "其它",
        },
      ],
      orgCodeProps: {
        //lazy: true,
        expandTrigger: "hover",
        value: "organizationId",
        label: "organizationName",
        children: "childList",
        checkStrictly: true
        //lazyLoad:this.propsLazyload
      },
      // jurisdictionValue: [],
      orgTreeList: []
      
    };
  },
  methods: {
      queryOrgList(regionCode) {
        let _this = this,
            params = {};
        if (regionCode) params.regionCode = regionCode;
        this.$api
            .getOrgTree(params)
            .then(data => {
            if (data.code !== 200) {
                return Promise.reject();
            }
            _this.orgTreeList = data.data;
            })
            // .catch(error => {
            // this.$message({
            //     message:
            //     "获取组织架构树失败! [" + error.code + "]: " + error.message,
            //     type: "error"
            // });
            // });
        },
    updateClose() {
      this.addDialog.addProviceVisable = false;
      this.org.orgName = "";
      this.org.orgType = "";
      this.$emit('update:visible', false);
    },
    UpdataOrg() {
      let parmas = {
        organizationName: this.org.orgName,
        organizationType: this.org.orgType,
        parentOrganizationId: this.org.jurisdictionValue[this.org.jurisdictionValue.length - 1],
        // parentId: this.org.parentId,
        phone: this.org.phone,
        responsiblePerson: this.org.responsiblePerson,
        regionCodes: this.org.regionCode,
      };
      this.$refs.org.validate((valid) => {
        if (valid) {
          this.$api.AddOrganizationList(parmas).then((res) => {
            if (res.code == 200) {
              this.$message.success({
                message: "新增成功",
                type: "success",
              });
              this.org.orgName = "";
              this.org.orgType = "";
              // if(parmas.parentId)
              let vm = this;
              this.$emit('update:visible', false);
            } else {
              this.$message.success({
                message: res.message,
                type: "error",
              });
            }
            this.addDialog.addProviceVisable = false;
          });
        }
      });
    },
  },
};
</script>
<style lang="less"></style>
