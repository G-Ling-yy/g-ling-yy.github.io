<template>
  <div
    id="OrganizationPopup"
    class="add-organization"
    v-show="isShowPopup"
  >
    <div
      class="add-firstLevel addPopupDiv"
      v-if="isShowType == 'first'"
    >
      <p class="title"><span>{{orgOptName}}</span><span
          @click="closePopupClick"
          class="popupclose"
        >×</span></p>
      <div class="add-firstLevel-con">
        <p class="con-prov-name">
          <span>省级单位名称:</span>
          <input
            type="text"
            v-model="provincesUnitValue"
          />
        </p>
        <p class="con-prov">
          <span>所属省:</span>
          <select
            name=""
            v-model="provincesSelected"
            :disabled="orgOptName=='编辑'"
          >
            <option
              v-for="(provinces, index) in provincesList"
              :key="index"
              :value="provinces.regionCode"
            >
              {{provinces.regionName}}
            </option>
          </select>
        </p>
        <p class="con-btns">
          <button @click="closePopupClick">取消</button>
          <button
            class="confirmBtn"
            @click="confirmClick('first')"
          >
            保存</button>
        </p>
      </div>
    </div>
    <div
      class="add-second addPopupDiv"
      v-if="isShowType == 'second'"
    >
      <p class="title"><span>{{orgOptName}}</span><span
          @click="closePopupClick"
          class="popupclose"
        >×</span></p>
      <div class="add-firstLevel-con">
        <p class="con-prov">
          <span>所属省:</span>
          <select
            name=""
            v-model="provincesSelected"
            @change="getProvincesSelected"
            :disabled="orgOptName=='编辑'"
          >
            <option
              v-for="(provinces, index) in provincesList"
              :key="index"
              :value="provinces.regionCode"
            >
              {{provinces.regionName}}
            </option>
          </select>
        </p>
        <p class="con-prov-name">
          <span>所属省级单位:</span>
          <select
            name=""
            v-model="provincesUnitSelected"
            :disabled="orgOptName=='编辑'"
          >
            <option
              v-for="(provincialUnits, index) in provincialUnitsList"
              :key="index"
              :value="provincialUnits.organizationId"
            >
              {{provincialUnits.organizationName}}
            </option>
          </select>
        </p>
        <p class="con-road-name">
          <span>路公司名称:</span>
          <input
            type="text"
            v-model="roadCompanyValue"
          />
        </p>
        <p class="con-btns">
          <button @click="closePopupClick">取消</button>
          <button
            class="confirmBtn"
            @click="confirmClick('second')"
          >保存</button>
        </p>
      </div>
    </div>
    <!-- 三级单位弹窗 -->
    <div
      class="add-third addPopupDiv"
      v-if="isShowType == 'third'"
    >
      <p class="title"><span>{{orgOptName}}</span><span
          @click="closePopupClick"
          class="popupclose"
        >×</span></p>
      <div class="add-firstLevel-con">
        <p class="con-prov">
          <span>所属省级单位:</span>
          <select
            name=""
            v-model="provincesUnitSelected"
            @change="getProvincesUnitSelected"
            :disabled="orgOptName=='编辑'"
          >
            <option
              v-for="(provincialUnits, index) in provincialUnitsList"
              :key="index"
              :value="provincialUnits.organizationId"
            >
              {{provincialUnits.organizationName}}
            </option>
          </select>
        </p>
        <p class="con-road">
          <span>所属路公司:</span>
          <select
            name=""
            v-model="roadCompanySelected"
            :disabled="orgOptName=='编辑'"
          >
            <option
              v-for="(roadCompany, index) in roadCompanyList"
              :key="index"
              :value="roadCompany.organizationId"
            >
              {{roadCompany.organizationName}}
            </option>
          </select>
        </p>
        <p class="con-road-name">
          <span>路段单位名称:</span>
          <input
            type="text"
            v-model="roadNameValue"
          />
        </p>
        <p class="con-btns">
          <button @click="closePopupClick">取消</button>
          <button
            class="confirmBtn"
            @click="confirmClick('third')"
          >保存</button>
        </p>
      </div>
    </div>
    <!-- 删除弹窗 -->
    <div
      class="add-third addPopupDiv"
      v-if="isShowType == 'del'"
    >
      <p class="title"><span>{{orgOptName}}</span><span
          @click="closePopupClick"
          class="popupclose"
        >×</span></p>
      <div class="add-firstLevel-con">
        <p class="con-prov">
          <span>{{delTip}}</span>
        </p>
        <p class="con-btns">
          <button @click="closePopupClick">取消</button>
          <button
            class="confirmBtn"
            @click="delUnit()"
          >确认</button>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { mapState, mapActions, mapMutations } from "vuex";
export default {
  name: "OrganizationPopup",
  data() {
    return {
      delTip: '',//删除提示
      editData: null,//需要编辑组织数据 
      orgOptName: '新增',//弹窗头部
      provincesUnitValue: '',//一级添加，省级单位名称
      roadCompanyValue: '',//路公司名称
      roadNameValue: '',//路段名称
      provincesSelected: '',//省份选中
      provincesUnitSelected: '',//省级单位选中
      roadCompanySelected: '',//路公司选中
      provincesList: [],//省份列表
      provincialUnitsList: [],//所属省级单位列表
      roadCompanyList: [],//所属路公司列表
      isShowType: "first", //显示一级，二级，三级弹窗
      isShowPopup: false, //显示隐藏添加组织弹窗
    };
  },
  computed: {
    // ...mapState(["organization"])
  },

  mounted() {
  },
  methods: {
    ...mapActions(["addOrganization", "getProvince", "getOrganizationTopList", "updateOrganization", "delOrganization"]),
    initData() {
      let _this = this;
      _this.getProvince().then(function (res) {
        _this.provincesList = res.data;
      });
    },//初始化数据
    getOrganization() {
      let _this = this;
      _this.orgList = _this.$store.state.organization.organizationList.filter(
        function (curValue) {
          return curValue.parentOrganizationId == 0;
        }
      );
      _this.orgList.forEach(function (curValue) {
        curValue[
          "children"
        ] = _this.$store.state.organization.organizationList.filter(function (
          tempValue
        ) {
          return tempValue.parentOrganizationId == curValue.organizationId;
        });
      });
      _this.parent = _this.$store.state.organization.organizationList.filter(
        function (curValue) {
          return (
            curValue.parentOrganizationId >= 9901 &&
            curValue.parentOrganizationId < 9901001
          );
        }
      );
      console.log(_this.parent);
      _this.parent.forEach(function (curValue) {
        curValue[
          "children"
        ] = _this.$store.state.organization.organizationList.filter(function (
          tempValue
        ) {
          return tempValue.parentOrganizationId == curValue.organizationId;
        });
      });
      _this.children = _this.$store.state.organization.organizationList.filter(
        function (curValue) {
          return (
            curValue.parentOrganizationId >= 9901001 &&
            curValue.parentOrganizationId < 9901001003
          );
        }
      );
      _this.children.forEach(function (curValue) {
        curValue[
          "children"
        ] = _this.$store.state.organization.organizationList.filter(function (
          tempValue
        ) {
          return tempValue.parentOrganizationId == curValue.organizationId;
        });
      });
      _this.son = _this.$store.state.organization.organizationList.filter(
        function (curValue) {
          return curValue.parentOrganizationId >= 9901001003;
        }
      );
      _this.son.forEach(function (curValue) {
        curValue[
          "children"
        ] = _this.$store.state.organization.organizationList.filter(function (
          tempValue
        ) {
          return tempValue.parentOrganizationId == curValue.organizationId;
        });
      });
    },
    initOrganizationPopup(type) {
      let _this = this;
      _this.orgOptName = '新增';
      _this.isShowPopup = true;
      _this.isShowType = type;
      _this.provincesUnitValue = '';
      _this.roadCompanyValue = '';
      _this.roadNameValue = '';
      _this.provincesSelected = '';
      _this.provincesUnitSelected = '';
      _this.provincesList = [];
      _this.provincialUnitsList = [];
      _this.roadCompanyList = [];
      _this.initData();
      if (type == 'third') {
        _this.provincialUnitsList = _this.$parent.orgList[0].children;

      }
      _this.$forceUpdate();
    },//初始化新增弹窗
    initEditData(dataObj, type) {
      let _this = this;
      _this.orgOptName = '编辑';
      _this.isShowPopup = true;
      _this.isShowType = type;
      _this.provincesUnitValue = '';
      _this.roadCompanyValue = '';
      _this.roadNameValue = '';
      _this.provincesSelected = '';
      _this.provincesUnitSelected = '';
      _this.roadCompanySelected = '';
      _this.provincesList = [];
      _this.provincialUnitsList = [];
      _this.roadCompanyList = [];
      _this.initData();
      _this.editData = dataObj;
      if (type == 'third') {
        _this.provincesUnitSelected = dataObj.regionCode;
        _this.roadCompanySelected = dataObj.parentOrganizationId;
        _this.roadNameValue = dataObj.organizationName;
        _this.provincialUnitsList = _this.$parent.orgList[0].children;
        _this.roadCompanyList = _this.provincialUnitsList.filter(function (curValue) {
          return curValue.organizationId == _this.provincesUnitSelected;
        })[0].children;
      } else if (type == 'first') {
        _this.provincesSelected = dataObj.regionCode;
        _this.provincesUnitValue = dataObj.organizationName;
        _this.getOrganizationTopList({ 'regionCode': _this.provincesSelected }).then(function (res) {
          _this.provincialUnitsList = res.data;
        })
      } else if (type == 'second') {
        _this.provincesSelected = dataObj.regionCode;
        _this.provincesUnitSelected = dataObj.parentOrganizationId;
        _this.roadCompanyValue = dataObj.organizationName;
        _this.getOrganizationTopList({ 'regionCode': _this.provincesSelected }).then(function (res) {
          _this.provincialUnitsList = res.data;
        })
      }
      _this.$forceUpdate();
    },//初始化编辑弹窗
    initDelData(dataObj, type) {
      let _this = this;
      _this.orgOptName = '提示';
      _this.isShowPopup = true;
      _this.isShowType = 'del';
      _this.provincesUnitValue = '';
      _this.roadCompanyValue = '';
      _this.roadNameValue = '';
      _this.provincesSelected = '';
      _this.provincesUnitSelected = '';
      _this.roadCompanySelected = '';
      _this.provincesList = [];
      _this.provincialUnitsList = [];
      _this.roadCompanyList = [];
      _this.editData = dataObj;
      _this.delTip = `是否删除该组织？`
      _this.$forceUpdate();
    },//初始删除组织数据
    closePopupClick() {
      let _this = this;
      _this.isShowPopup = false;
      _this.isShowType = '';
    },//关闭弹窗点击事件
    getProvincesSelected() {
      let _this = this;
      _this.getOrganizationTopList({ 'regionCode': _this.provincesSelected }).then(function (res) {
        _this.provincialUnitsList = res.data;
      })
    },//省份选中回调
    getProvincesUnitSelected() {
      let _this = this;
      _this.roadCompanyList = _this.provincialUnitsList.filter(function (curValue) {
        return curValue.organizationId == _this.provincesUnitSelected;
      })[0].children;
    },//省级单位选中回调
    confirmClick(type) {
      let _this = this;
      if (_this.orgOptName == '新增') {
        _this.addUnit(type);
      } else if (_this.orgOptName == '编辑') {
        _this.updateUnit(type);
      }
    },//确认点击事件
    addUnit(type) {
      let _this = this;
      let params = {};
      if (type == 'first') {
        params['orgName'] = _this.provincesUnitValue;
        params['parentOrgId'] = _this.provincesSelected;
        params['regionCode'] = _this.provincesSelected;
      } else if (type == 'second') {
        params['orgName'] = _this.roadCompanyValue;
        params['parentOrgId'] = _this.provincesUnitSelected;
        params['regionCode'] = _this.provincesSelected;
      } else if (type == 'third') {
        params['orgName'] = _this.roadNameValue;
        params['parentOrgId'] = _this.roadCompanySelected;
        params['regionCode'] = _this.provincesUnitSelected;
      }
      _this.addOrganization(params).then(function (res) {
        if (res.code == 200) {
          _this.isShowPopup = false;
          _this.$parent.getOrganization();
        }
      });//添加一级单位
    },//确认添加单位
    updateUnit(type) {
      let _this = this;
      let params = {};
      params['orgId'] = _this.editData.organizationId;
      if (type == 'first') {
        params['orgName'] = _this.provincesUnitValue;
      } else if (type == 'second') {
        params['orgName'] = _this.roadCompanyValue;
      } else if (type == 'third') {
        params['orgName'] = _this.roadNameValue;
      }
      _this.updateOrganization(params).then(function (res) {
        if (res.code == 200) {
          _this.isShowPopup = false;
          _this.$parent.getOrganization();
        }
      })
    },//更新组织单位信息
    delUnit() {
      let _this = this;
      _this.delOrganization({ orgId: _this.editData.organizationId }).then(function (res) {
        if (res.code == 200) {
          _this.isShowPopup = false;
          _this.$parent.getOrganization();
        }
      })
    },//删除组织
  }
};
</script>

<style scoped lang="less">
.add-organization {
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;
  z-index: 111;
  .addPopupDiv {
    width: 364px;
    height: auto;
    position: absolute;
    top: 138px;
    left: 50%;
    margin-left: -182px;
    background: #fff;
    .popupclose {
      cursor: pointer;
    }
    .title {
      width: 100%;
      height: 47px;
      background: #e8eaef;
      padding: 0 30px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
      font-family: Source Han Sans CN;
      font-weight: bold;
      color: rgba(10, 17, 33, 1);
      margin: 0;
    }
    .add-second {
      display: block !important;
    }
    .add-firstLevel-con {
      padding: 30px 30px;
      box-sizing: border-box;
      width: 100%;
    }
    input,
    select {
      width: 200px;
      height: 34px;
      background: transparent;
      border: 2px solid rgba(230, 234, 237, 1);
      font-size: 14px;
      font-family: Source Han Sans CN;
      color: #333;
    }
    p {
      margin-bottom: 10px;
      width: 100%;
      height: 36px;
      font-size: 14px;
      font-family: Source Han Sans CN;
      font-weight: 400;
      color: rgba(0, 0, 0, 1);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .con-btns {
      width: 100%;
      height: 32px;
      margin: 32px 0px 0 0 !important;
      display: flex;
      justify-content: center !important;
      align-items: center;
      button {
        width: 66px;
        height: 32px;
        background: transparent;
        border: 1px solid rgba(190, 193, 197, 1);
        border-radius: 2px;
        color: #000;
        text-align: center;
        line-height: 32px;
        cursor: pointer;
      }
      .confirmBtn {
        margin-left: 10px;
        background: rgba(18, 116, 238, 1);
        border-radius: 2px;
        border: none;
        color: #fff;
      }
    }
  }
}
</style>
