<template>
  <div class="check-camera">
    <!-- <el-button type="primary" @click="setDataPermission()" size="mini" icon="el-icon-coin"></el-button>  -->
    <i class="el-icon-coin" @click="setDataPermission()"></i>
    <el-dialog
      title="数据权限"
      :visible.sync="dataVisible"
       v-dialogDrag
      :append-to-body="true"
      :close-on-click-modal="false"
      custom-class="check-camera-dialog"
      width="80%"
      @close="closeChoosedDialog"
    >
      <div class="check-camera-body">
        <div class="check-camera-tree">
            <!-- v-if="uinfo.regionCode == 530000 ? false : true" -->
          <el-tree
            :data="UserOrgTree"
            node-key="organizationId"
            :props="{
              children: 'childList',
              label: 'organizationName',
            }"
            :default-expanded-keys="idArr"
            ref="tree"
            @node-click="handleTreenode"
          >
            <span
              class="custom-tree-node organize-box"
              slot-scope="{ node, data }"
            >
              <span class="space-l">{{ node.label }}</span>
            </span>
          </el-tree>
        <!-- <construction-tree v-if="uinfo.regionCode == 530000 ? true : false" ></construction-tree> -->
        </div>
        <div class="check-camera-right">
          <div class="check-camera-search">
            <search-form
              ref="form"
              :options="searchForm"
              class="check-camera-search-form"
            ></search-form>
            <div class="check-camera-search-btn">
              <el-button type="primary" size="mini" @click="doSearch"
                >搜索</el-button
              >
              <el-button size="mini" @click="doClear">重置</el-button>
            </div>
          </div>
          <div class="check-camera-table">
            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">            
              <el-tab-pane :label="'未开放' + tableOptions.total" name="total">
                
                <camera-table
                  ref="table"
                  :options="tableOptions"
                  @on-change-page="changeCurrentPage"
                  @on-page-size-change="changePageSize"
                ></camera-table>
                <div class="card-checkbox">
                  <el-checkbox
                    v-if="true"
                    v-model="checkAll"
                    @change="handleCheckAllChange(1)"
                    v-preventReClick
                    >列表全部开放</el-checkbox
                  >
                  <!-- <span style="padding-right: 10px">{{checkAll ? '已选择全部' : '已选择' + choosedDataLen + '条'}}</span> -->
                  <el-button
                    size="mini"
                    type="primary"
                    style="margin-right: 4px;"
                    @click="chooseCamera"
                    >仅开放勾选</el-button
                  >
                </div>
              </el-tab-pane>
              <el-tab-pane
                :label="'已开放' + checkedOptions.total"
                name="checked"
              >

                <camera-table
                  ref="table1"
                  :options="checkedOptions"
                  @on-select="cancelSelectedData"
                  @on-select-all="cancelSelectedData"
                  @on-change-page="changeCurrentPage"
                  @on-page-size-change="changePageSize"
                ></camera-table>
                <div class="card-checkbox">
                  <el-checkbox
                    v-if="true"
                    v-model="cancelCheckAll"
                    @change="handleCheckAllChange(2)"
                    v-preventReClick
                    >列表全部取消</el-checkbox
                  >
                  <!-- <span>{{cancelCheckAll ? '已取消选择全部' : '已取消选择' + cancelCheckedDataLen + '条'}}</span> -->
                  <el-button
                    size="mini"
                    type="primary"
                    style="margin-right: 4px;"
                    @click="cancelChecked"
                    >仅取消勾选
                  </el-button>
                </div>
              </el-tab-pane>
              
            </el-tabs>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { log } from 'three';
import searchForm from '../../form';
import cameraTable from '../../tablePlan/table';
// import constructionTree from '../../../components/module/imageManage/constructionTree';
export default {
  components: { searchForm, cameraTable, },
  data() {
    let height =
      document.documentElement.clientHeight * 0.85 -
      50 -
      54 -
      49 -
      40 -
      15 -
      42 -
      20;
    return {
      isIndeterminate: true,
      dataVisible: false,
      idArr: [],
      // 数据
      onlineStatusList: [
        {
          id: 0,
          name: '离线',
        },
        {
          id: 1,
          name: '正常',
        },
        {
          id: 2,
          name: '故障',
        },
      ],
      searchForm: {
        model: {},
        cols: 6,
        size: 'mini',
        formItemList: [
          //   {
          //   label: '',
          //   placeholder: '省份',
          //   type: 'select',
          //   name: 'regionCode',
          //   optionsList: []
          // },

          {
            label: '',
            placeholder: '路线',
            type: 'select',
            name: 'roadId',
            optionsList: [],
          },
          {
            label: '',
            placeholder: '摄像机状态',
            type: 'select',
            name: 'onlineStatus',
            optionsList: [
              {
                id: 0,
                name: '离线',
              },
              {
                id: 1,
                name: '正常',
              },
              {
                id: 2,
                name: '故障',
              },
            ],
          },
          {
            label: '',
            placeholder: '所属类别',
            type: 'select',
            name: 'classify',
            optionsList: [],
          },
          {
            label: '',
            placeholder: '请输入摄像机名称',
            type: 'input',
            name: 'cameraName',
            width: '150px',
          },
        ],
      },
      tableOptions: {
        pageNumber: 1,
        pageSize: 10,
        total: 0,
        selection: true,
        localData: [],
        border: true,
        uniqueId: 'cameraId',
        selectionCache: true,
        maxHeight: '360',
        columns: [
          {
            key: 'sort',
            title: '序号',
          },
          {
            key: 'regionName',
            title: '省份',
          },
          {
            key: 'organizationName',
            title: '管辖单位',
          },
          {
            key: 'cameraName',
            title: '摄像机名称',
          },
          {
            key: 'roadName',
            title: '路线',
          },
          {
            key: 'pile',
            title: '桩号',
          },
          {
            key: 'classify',
            title: '所属类别',
          },
          {
            key: 'onlineStatus',
            title: '状态',
          },
        ],
      },
      checkedOptions: {
        pageNumber: 1,
        pageSize: 10,
        selection: true,
        localData: [],
        border: true,
        maxHeight: '360',
        total: 0,
        columns: [
          {
            key: 'sort',
            title: '序号',
          },
          {
            key: 'regionName',
            title: '省份',
          },
          {
            key: 'organizationName',
            title: '管辖单位',
          },
          {
            key: 'cameraName',
            title: '摄像机名称',
          },
          {
            key: 'roadName',
            title: '路线',
          },
          {
            key: 'pile',
            title: '桩号',
          },
          {
            key: 'classify',
            title: '所属类别',
          },
          {
            key: 'onlineStatus',
            title: '状态',
          },
        ],
      },
      activeName: 'total',
      choosedDataLen: 0,
      choosedData: [],
      classifyList: [],
      checkAll: false,
      areadyChoose: false,
      cancelCheckedData: [],
      cancelCheckAll: false,
      cancelCheckedDataLen: 0,
      editUser: '',
      uinfo: {
        regionCode: JSON.parse(localStorage.getItem('cloudplatform'))
          .regionCode,
      },
    };
  },
  props: {
    UserOrgTree: {
      type: Array,
      default: () => {
        return [];
      },
    },
    dataList: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  created() {
    Promise.all([
      this.loadClassify(),
      this.loadArea(),
      this.queryRoadList(),
    ]).then((res) => {
      _.each(this.searchForm.formItemList, (it) => {
        if (it.name === 'regionCode' && res[1].code === 200) {
          let list = res[1].data;
          list.unshift({
            regionCode: '',
            regionName: '全国',
            alias: '全国',
            parentRegionCode: '0',
          });
          it.optionsList = _.map(list, (item) => {
            return {
              id: item.roadId,
              name: item.regionName,
            };
          });
          console.log(optionsList,'nnn');
        }
        if (it.name === 'roadId' && res[2].code === 200) {
          it.optionsList = _.map(res[2].data, (item) => {
            return {
              id: item.roadId,
              name: item.roadName,
            };
          });
        }
        if (it.name === 'classify' && res[0].code === 200) {
          it.optionsList = _.map(res[0].data, (item) => {
            return {
              id: item.codeValue,
              name: item.codeName,
            };
          });
          this.classifyList = _.map(res[0].data, (item) => {
            return {
              id: item.codeValue,
              name: item.codeName,
            };
          });
        }
      });
    });
  },
  mounted() {
    // this.$refs.tree.setCurrentKey(this.UserOrgTree[0].organizationId);
  },
  methods: {
    changeCurrentPage(pageNumber) {
      if (this.activeName === 'total') {
        this.tableOptions.pageNumber = pageNumber;
        this.queryList();
      } else {
        this.checkedOptions.pageNumber = pageNumber;
        this.queryChoosedData();
      }
    },
    changePageSize(pageSize) {
      if (this.activeName === 'total') {
        this.tableOptions.pageNumber = 1;
        this.tableOptions.pageSize = pageSize;
        this.queryList();
      } else {
        this.tableOptions.pageNumber = 1;
        this.checkedOptions.pageSize = pageSize;
        this.queryChoosedData();
      }
    },
    queryList() {
      let form = {};
      _.each(this.searchForm.model, (it, key) => {
        if (it != undefined && !_.isNumber(it) && it.trim()) {
          form[key] = it;
        } else if (it != undefined && _.isNumber(it)) {
          form[key] = it;
        }
      });
      // console.log('当前行数据', this.searchForm.model, form)
      let params = {
        id: this.dataList.id,
        data: {
          currPage: this.tableOptions.pageNumber,
          pageSize: this.tableOptions.pageSize,
          ...form,
          openAppId: this.dataList.appId,
          organizationId: this.$refs.tree
            ? this.$refs.tree.getCurrentKey()
            : '',
          
        },
      };
      // console.log('参数', params)
      this.$api.getCameraBindList(params).then((res) => {
        this.tableOptions.localData = this.resetTableData(res.data);
        this.tableOptions.total = res.total;
        this.assignment();
      });
    },
    queryChoosedData() {
      let form = {};
      _.each(this.searchForm.model, (it, key) => {
        // 不能等于0
        if (it != undefined && !_.isNumber(it) && it.trim()) {
          form[key] = it;
        } else if (it != undefined && _.isNumber(it)) {
          form[key] = it;
        }
      });
      // console.log('当前行数据', this.editUser)
      let params = {
        id: this.dataList.id,
        data: {
          currPage: this.checkedOptions.pageNumber,
          pageSize: this.checkedOptions.pageSize,
          ...form,
          openAppId: this.dataList.appId,
          organizationId: this.$refs.tree
            ? this.$refs.tree.getCurrentKey()
            : '',

        },
      };
      this.$api.CameraBind(params).then((res) => {
        this.checkedOptions.localData = this.resetTableData(res.data);
        this.checkedOptions.total = res.total;
        this.assignment();
      });
    },
    closeChoosedDialog() {
      this.areadyChoose = this.checkAll || this.choosedDataLen > 0;
      // console.log(1313, this.areadyChoose)
      // this.$emit('close-choose-cameras', this.areadyChoose);
    },
    resetTableData(data) {
      let vm = this;
      data = _.map(data, (it, index) => {
        let onlineStatus = _.find(vm.onlineStatusList, {
          id: it.onlineStatus,
        });
        let classify = _.find(vm.classifyList, {
          id: it.classify + '',
        });
        return {
          sort: index + 1,
          ...it,
          onlineStatus: onlineStatus ? onlineStatus.name : it.onlineStatus,
          classify: classify ? classify.name : it.classify,
        };
      });
      return data;
    },
    handleCheckAllChange(type) {
      console.log(type,"type")
      let table = null;
      if (type === 1) {
        table = this.$refs.table.getOriginTable(this.checkAll);
        console.log( this.$refs.table.getOriginTable(),"全选")
        if(this.checkAll){
          this.$message({
            message: '操作成功',
            type: 'success'
          });
        }
        // table.toggleAllSelection(this.checkAll);
        this.chooseCameras()
      } else {
        table = this.$refs.table1.getOriginTable(this.cancelCheckAll);
         if(this.cancelCheckAll){
            this.$message({
              message: '操作成功',
              type: 'success'
            });
        }
        else{
           this.$message.error('操作失败');
        }
        this.cancelCheckeds()
        // this.$message({
        //   type: 'success',
        //   message: '列表全部取消,请耐心等待！',
        // });
        // table = this.$refs.table1.changTableAllSelect(this.cancelCheckAll);
        // table.toggleAllSelection(this.cancelCheckAll);
      }
      // this.$message({
      //     message: '警告哦，这是一条警告消息',
      //     type: 'warning'
      //   });
    },

    chooseCameras(){
      let cancelData = this.$refs.table.getSelected();
      let notChoiceData = this.$refs.table.getDelSelected();
      // console.log('获取的值', cancelData, notChoiceData, this.dataList)
      let params = {};
      let id = '';
      let instructions = {};
      let form = {};
      _.each(this.searchForm.model, (it, key) => {
        if (it && !_.isNumber(it) && it.trim()) {
          form[key] = it;
        } else if (it && _.isNumber(it)) {
          form[key] = it;
        }
      });
      // 选择所以数据时不用判断传参
      if (this.checkAll) {
        id = this.dataList.id;
        params = {
          // selectStatus: 0,
          choice: 1,
          queryCameraRequest: {
            ...form,
            openAppId: this.dataList.appId,
            organizationId: this.$refs.tree
              ? this.$refs.tree.getCurrentKey()
              : '',
          },
         
          
          // delCameras: notChoiceData
        };
        instructions = {
          module: '资源管理',
          page: '开放管理',
          feature: '添加数据权限',
          description: `添加${this.dataList.appName}的数据权限`,
        };
      } else {
        id = this.dataList.id;
        params = {
          // selectStatus: 0,
          choice: 0,
          // ...form,
          addCameras: cancelData,
          openAppId: this.dataList.appId,
          
          organizationId: this.$refs.tree
            ? this.$refs.tree.getCurrentKey()
            : '',
          
        };
        instructions = {
          module: '资源管理',
          page: '开放管理',
          feature: '添加数据权限',
          description: `添加${this.dataList.appName}的数据权限`,
        };
      }
      // 选择的参数
      // id = this.dataList.id
      // params.addCameras = cancelData
      // instructions = {
      //     module: "资源管理",
      //     page: "开放管理",
      //     feature: "添加数据权限",
      //     description: `添加${this.dataList.appName}的数据权限`
      // }
      // console.log(params, "参数添加", id)
      this.$api.bindCameraData(id, params, instructions).then((res) => {
        if (res.code !== 200) {
          this.$message({
            type: 'error',
            message: res.message || '选择失败',
          });
          
          return;
        }
        // 用于多选表格，清空用户的选择
        this.$refs.table.delSelectedRadioRow();
        this.$nextTick(() => {
          this.handleClick();
        });
        //  this.handleClick()
        // this.queryList();
        this.queryChoosedData();
        this.checkAll = false;
        this.choosedData = [];
        this.choosedDataLen = 0;
      });
    },
    chooseCamera() {
      let cancelData = this.$refs.table.getSelected();
      let notChoiceData = this.$refs.table.getDelSelected();
      // console.log('获取的值', cancelData, notChoiceData, this.dataList)
      if(cancelData.length===0){
          this.$message.error('请勾选要开放的');
      }
      else{
          this.$message({
        type: 'success',
        message: '勾选列表开放,数据正在传输请耐心等待！',
      });
      }
      let params = {};
      let id = '';
      let instructions = {};
      let form = {};
      _.each(this.searchForm.model, (it, key) => {
        if (it && !_.isNumber(it) && it.trim()) {
          form[key] = it;
        } else if (it && _.isNumber(it)) {
          form[key] = it;
        }
      });
      // 选择所以数据时不用判断传参
      if (this.checkAll) {
        id = this.dataList.id;
        params = {
          // selectStatus: 0,
          choice: 1,
          queryCameraRequest: {
            ...form,
            openAppId: this.dataList.appId,
            organizationId: this.$refs.tree
              ? this.$refs.tree.getCurrentKey()
              : '',
          },
         
          
          // delCameras: notChoiceData
        };
        instructions = {
          module: '资源管理',
          page: '开放管理',
          feature: '添加数据权限',
          description: `添加${this.dataList.appName}的数据权限`,
        };
      } else {
        id = this.dataList.id;
        params = {
          // selectStatus: 0,
          choice: 0,
          // ...form,
          addCameras: cancelData,
          openAppId: this.dataList.appId,
          
          organizationId: this.$refs.tree
            ? this.$refs.tree.getCurrentKey()
            : '',
        };
        instructions = {
          module: '资源管理',
          page: '开放管理',
          feature: '添加数据权限',
          description: `添加${this.dataList.appName}的数据权限`,
        };
      }
      // 选择的参数
      // id = this.dataList.id
      // params.addCameras = cancelData
      // instructions = {
      //     module: "资源管理",
      //     page: "开放管理",
      //     feature: "添加数据权限",
      //     description: `添加${this.dataList.appName}的数据权限`
      // }
      // console.log(params, "参数添加", id)
      this.$api.bindCameraData(id, params, instructions).then((res) => {
        if (res.code !== 200) {
          this.$message({
            type: 'error',
            message: res.message || '选择失败',
          });
          return;
        }
          
        // 用于多选表格，清空用户的选择
        this.$refs.table.delSelectedRadioRow();
        this.$nextTick(() => {
          this.handleClick();
        });
        //  this.handleClick()
        // this.queryList();
        this.queryChoosedData();
        this.checkAll = false;
        this.choosedData = [];
        this.choosedDataLen = 0;
      });
      // this.checkedOptions.localData = cameras;
    },


cancelCheckeds(){
   let cancelData = this.$refs.table1.getSelected();
      let notChoiceData = this.$refs.table1.getDelSelected();
      // console.log('获取值', cancelData, notChoiceData)
      this.cancelCheckedData = cancelData;
      let params = {};
      let id = '';
      let instructions = {};
      let form = {};
      _.each(this.searchForm.model, (it, key) => {
        if (it && !_.isNumber(it) && it.trim()) {
          form[key] = it;
        } else if (it && _.isNumber(it)) {
          form[key] = it;
        }
      });
      // 选择所以数据时不用判断传参
      if (this.cancelCheckAll) {
        id = this.dataList.id;
        params = {
          // selectStatus: 1,
          choice: 2,
          queryCameraRequest: {
            ...form,
            openAppId: this.dataList.appId,
            organizationId: this.$refs.tree
              ? this.$refs.tree.getCurrentKey()
              : '',
          },
          
          // delCameras: notChoiceData
        };
        instructions = {
          module: '资源管理',
          page: '开放管理',
          feature: '添加数据权限',
          description: `添加${this.dataList.appName}的数据权限`,
        };
      } else {
        id = this.dataList.id;
        params = {
          // selectStatus: 1,
          choice: 0,
          // ...form,
          delCameras: cancelData,
          openAppId: this.dataList.appId,
          
          organizationId: this.$refs.tree
            ? this.$refs.tree.getCurrentKey()
            : '',
        };
        instructions = {
          module: '资源管理',
          page: '开放管理',
          feature: '添加数据权限',
          description: `添加${this.dataList.appName}的数据权限`,
        };
      }
      //  选择的参数
      // id = this.dataList.id;
      // params = {
      //    delCameras:cancelData
      // }
      // instructions = {
      //     module: "资源管理",
      //     page: "开放管理",
      //     feature: "添加数据权限",
      //     description: `添加${this.dataList.appName}的数据权限`
      // }
      // console.log(params, "参数移除")
      this.$api.bindCameraData(id, params, instructions).then((res) => {
        if (res.code !== 200) {
          // this.$message({
          //   type: 'error',
          //   message: res.message || '取消选择失败',
          // });
          return;
        }
        if (this.cancelCheckAll) {
          this.searchForm.model = {};
        }
        // this.$message({
        //   type: 'success',
        //   message: '未选中数据',
        // });
        // 用于多选表格，清空用户的选择
        this.$refs.table1.delSelectedRadioRow();
        this.$nextTick(() => {
          // this.handleClick();
          this.queryList();
        this.queryChoosedData();
        });
        // this.handleClick()
        // this.queryList();
        // this.queryChoosedData();
        this.cancelCheckAll = false;
        this.cancelCheckedData = [];
        this.cancelCheckedDataLen = 0;
      });
},

    cancelChecked() {
      let cancelData = this.$refs.table1.getSelected();
      let notChoiceData = this.$refs.table1.getDelSelected();
      if(cancelData.length===0){
          this.$message.error('请勾选要开放的');
      }else{
          this.$message({
            type: 'success',
            message: '勾选列表开放,数据正在传输请耐心等待！',
          });
      }
      // console.log('获取值', cancelData, notChoiceData)
      this.cancelCheckedData = cancelData;
      let params = {};
      let id = '';
      let instructions = {};
      let form = {};
      _.each(this.searchForm.model, (it, key) => {
        // trim清除空白或者空格
        if (it && !_.isNumber(it) && it.trim()) {
          form[key] = it;
        } else if (it && _.isNumber(it)) {
          form[key] = it;
        }
      });
      // 选择所以数据时不用判断传参
      if (this.cancelCheckAll) {
        id = this.dataList.id;
        params = {
          // selectStatus: 1,
          choice: 2,
          queryCameraRequest: {
            ...form,
            openAppId: this.dataList.appId,
            organizationId: this.$refs.tree
              ? this.$refs.tree.getCurrentKey()
              : '',
          },
          
          // delCameras: notChoiceData
        };
        instructions = {
          module: '资源管理',
          page: '开放管理',
          feature: '添加数据权限',
          description: `添加${this.dataList.appName}的数据权限`,
        };
      } else {
        id = this.dataList.id;
        params = {
          // selectStatus: 1,
          choice: 0,
          // ...form,
          delCameras: cancelData,
          openAppId: this.dataList.appId,
          
          organizationId: this.$refs.tree
            ? this.$refs.tree.getCurrentKey()
            : '',
        };
        instructions = {
          module: '资源管理',
          page: '开放管理',
          feature: '添加数据权限',
          description: `添加${this.dataList.appName}的数据权限`,
        };
      }
      //  选择的参数
      // id = this.dataList.id;
      // params = {
      //    delCameras:cancelData
      // }
      // instructions = {
      //     module: "资源管理",
      //     page: "开放管理",
      //     feature: "添加数据权限",
      //     description: `添加${this.dataList.appName}的数据权限`
      // }
      // console.log(params, "参数移除")
      this.$api.bindCameraData(id, params, instructions).then((res) => {
        if (res.code !== 200) {
          // this.$message({
          //   type: 'error',
          //   message: res.message || '取消选择失败',
          // });
          return;
        }
        if (this.cancelCheckAll) {
          this.searchForm.model = {};
          // this.$message({
          //   type: 'success',
          //   message: '列表全部取消,数据正在传输请耐心等待！',
          // });
        }
        // this.$message({
        //   type: 'success',
        //   message: '未选中数据',
        // });
        // 用于多选表格，清空用户的选择
        this.$refs.table1.delSelectedRadioRow();
        this.$nextTick(() => {
          // this.handleClick();
          this.queryList();
          this.queryChoosedData();
        });
        // this.handleClick()
        // this.queryList();
        // this.queryChoosedData();
        this.cancelCheckAll = false;
        this.cancelCheckedData = [];
        this.cancelCheckedDataLen = 0;
      });
    },
    assignment() {
      if (this.activeName === 'total') {
        this.$refs.table.assignment(this.tableOptions.localData);
      } else {
        this.$refs.table1.assignment(this.checkedOptions.localData);
      }
    },
    loadClassify() {
      var _this = this;
      return this.$api.getCodemaster({
        codeType: 'CLASSIFY',
      });
    },
    queryRoadList(orgId) {
      let _this = this;
      return this.$api.getRoadsByOrgId('');
    },
    loadArea() {
      return this.$api.getProvince({
        regionLevel: 1,
      });
    },
    setDataPermission() {
      this.editUser = '';
      // 数据
      // this.editUser = {
      //     userId: "9999530000",
      //     loginName: "云南",
      //     userName: "云南",
      //     phoneNum: "15256589880",
      //     userStatus: "1",
      //     organizationId: "9901",
      //     organizationName: "交通运输部",
      //     organizationType: "99",
      //     organizationTypeDesc: "全国组织",
      //     roleCode: null,
      //     roleName: null,
      //     regionName: "全国",
      //     createUser: null,
      //     createDate: "2020-05-21 11:51:36"
      // }
      // console.log('开放管理', this.editUser)
      this.dataVisible = true;
      this.queryChoosedData(true);
      this.queryList();
      this.$nextTick(() => {
        this.queryChoosedData();
      });
      this.doClear();
      //  if(this.activeName === 'total'){
      //      this.queryList()
      //     // this.$refs.table.getOriginTable(this.checkAll);
      // }else {
      //      this.queryChoosedData();
      //     // this.$refs.table1.getOriginTable(this.cancelCheckAll);
      // }
      // this.activeName === 'total'
      this.cancelCheckedDataLen = 0;
      this.choosedDataLen = 0;
      this.checkAll = false;
      this.cancelCheckAll = false;
    },
    handleTreenode() {
      console.log("sssss")
      this.tableOptions.pageNumber = 1;
      this.queryList();
      this.queryChoosedData();
    },
    doSearch() {
      this.tableOptions.pageNumber = 1;
      // console.log(this.activeName,'actname')
      if (this.activeName === 'total') {
        this.queryList();
        setTimeout(() => {
          this.$refs.table.getOriginTable(this.checkAll);
        }, 100);
        // this.$refs.table.getOriginTable(this.checkAll);
      } else {
        this.queryChoosedData();
        setTimeout(() => {
          this.$refs.table1.getOriginTable(this.cancelCheckAll);
        }, 100);
        // this.$refs.table1.getOriginTable(this.cancelCheckAll);
      }
    },
    handleClick() {
      // console.log(this.activeName)
      this.doClear();
      this.$refs.table.initialization();
      this.$refs.table1.initialization();
    },
    doClear() {
      // console.log(this.searchForm.model)
      this.searchForm.model = {};
      this.tableOptions.pageNumber = 1;
      this.tableOptions.pageSize = 10;
      this.checkedOptions.pageNumber = 1;
      this.checkedOptions.pageSize = 10;
      this.checkAll = false;
      this.cancelCheckAll = false;
      this.doSearch();
    },
    // selectedData(data) {
    //   console.log(data,"select change data")
    //   this.$nextTick(() => {
    //     this.choosedDataLen = this.$refs.table.getSelected().length;
    //   });
    // },
    cancelSelectedData(data) {
      this.$nextTick(() => {
        this.cancelCheckedDataLen = this.$refs.table1.getSelected().length;
      });
    },
    getChoosedData() {
      return {
        all: this.checkAll,
        choosedData: this.choosedData,
      };
    },
    doCheckedAll() {},
  },
};
</script>
<style lang="less">
.check-camera-dialog {
  overflow: hidden;
  .el-dialog__body {
    padding: 0px 20px 20px !important;
    height: calc(85vh - 50px - 54px);
  }
  .check-camera-body {
    display: flex;
    height: 100%;
    .check-camera-tree {
      width: 300px;
      border-right: 1px solid #ddd;
      height: 100%;
      overflow-y: auto;
    }
    .check-camera-right {
      width: 75%;
      padding-left: 16px;
      .check-camera-search {
        display: flex;
        .check-camera-search-btn {
          width: 224px;
          padding-left: 20px;
          box-sizing: border-box;
        }
      }
    }
  }
}
.card-checkbox {
  text-align: right;
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
  line-height: 28px;
  .el-checkbox__inner{
    display: none;
  }
  .el-checkbox__label{
    line-height: 30px;
    border: 1px solid #409EFF;
    color: #409EFF;
    text-align: center;
    padding: 0 10px;
    margin-right: 10px;
    border-radius: 4px;
  }
}
</style>
