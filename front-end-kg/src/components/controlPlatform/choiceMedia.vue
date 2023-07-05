<template>
  <div>
    <el-form :model="media" ref="media">
      <el-form-item
        prop="value"
        :rules="[{ required: true, message: '流媒体不能为空' }]"
      >
        <el-select v-model="media.value" placeholder="请选择流媒体">
          <el-option
            :value-key="item.smId"
            v-for="item in tableData"
            :key="item.smId"
            :label="item.smName"
            :value="item.smId"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <div class="btn-con">
        <button class="cancel" @click="cancel">取消</button>
        <button class="submit" @click="submit('media')">保存</button>
      </div>
    </el-form>
  </div>
</template>

<script>
// Find components upward
function findComponentUpward(context, componentName, componentNames) {
  if (typeof componentName === "string") {
    componentNames = [componentName];
  } else {
    componentNames = componentName;
  }

  let parent = context.$parent;
  let name = parent.$options.name;
  while (parent && (!name || componentNames.indexOf(name) < 0)) {
    parent = parent.$parent;
    if (parent) name = parent.$options.name;
  }
  return parent;
}
import { mapActions, mapState } from "vuex";
import $http from "../../filters/http";
import api from "../../api/index";
export default {
  components: {},
  name: "choiceMedia",
  props: {},
  mounted() {},
  data() {
    return {
      parentPage: "",
      tableData: [],
      postData: {
        currPage: 0,
        pageSize: 0,
        smName: "",
        smType: "",
        vendor: "",
      },
      media: {
        value: "",
      },
    };
  },
  methods: {
    getData() {
      var that = this;
      that.$api.getStreamMediaList(this.postData).then((res) => {
        // var res = res.data;
        if (res.code == 200) {
          that.tableData = res.data;
        } else {
          this.$message.error(res.message);
        }
      });
    },
    cancel() {
      findComponentUpward(this, this.parentPage).choiceMediaFlag = false;
      findComponentUpward(this, this.parentPage).choiceMediaFlag = false;
    },
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //   console.log(this.$parent.reConnect(this.media.value));
          findComponentUpward(this, this.parentPage).reConnect(
            this.media.value
          );
        }
      });
    },
  },
};
</script>

<style scoped>
.btn-con {
  text-align: center;
  margin-top: 15px;
}
.btn-con button {
  width: 80px;
  height: 35px;
  line-height: 35px;
  display: inline-block;
  border-radius: 4px;
  cursor: pointer;
}
.btn-con .cancel {
  margin-right: 15px;
  border: 1px solid #92969b;
  color: #000;
}
.el-select {
  width: 100%;
}
.btn-con .submit {
  background: #1274ee;
  color: #fff;
  border: 1px solid #1274ee;
}
.img-con img {
  vertical-align: middle;
  cursor: pointer;
}
.img-con img:not(:last-child) {
  margin-right: 3px;
}
</style>
