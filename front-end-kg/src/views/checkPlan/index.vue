<template>
  <div class="check-camera">
    <!-- <el-button type="primary" @click="setDataPermission()" size="mini" icon="el-icon-coin"></el-button>  -->
    <!-- <i class="el-icon-coin" @click="setDataPermission()"></i> -->
    <el-dialog title="选择摄像机" :visible.sync="dataVisible" v-dialogDrag :append-to-body="true"
      :close-on-click-modal="false" custom-class="check-camera-dialog" width="80%" @close="closeChoosedDialog">
      <div class="check-camera-body">
        <div class="check-camera-tree">
          <el-tabs v-model="activePlan" @tab-click="handleDeviceGroup" >
          <el-tab-pane label="组织结构" name="organization">
                <el-tree :data="UserOrgTree" node-key="organizationId" :props="{
                        children: 'childList',
                        label: 'organizationName',
                        }" :default-expanded-keys="idArr" ref="tree" @node-click="handleTreenode">
                <span class="custom-tree-node organize-box" slot-scope="{ node, data }">
                  <span class="space-l">{{ node.label }}</span>
                </span>
              </el-tree>
          </el-tab-pane>
          <el-tab-pane label="摄像机组" name="camera">
            <ul class="camera-ul">
              <li v-for="item in deviceGroupList" :key="item.groupId" @click="handleGroupName(item)">
                 <i class="el-icon-document"></i>
                 <span>{{item.groupName}}</span>
              </li>
            </ul>
          </el-tab-pane>
        </el-tabs>
        </div>
        <div class="check-camera-right">
          <div class="check-camera-search">
            <div class="check-camera-xc">
            <search-form ref="form" :options="searchForm" class="check-camera-search-form"></search-form>
          </div>
            <div class="check-camera-search-btn">
              <el-button type="primary" size="mini" @click="doSearch">搜索</el-button>
              <el-button size="mini" @click="doClear">重置</el-button>
            </div>
          </div>
          <div class="check-camera-table">
            <el-tabs v-model="activeName"  v-loading="loading" type="card" @tab-click="handleClick">
              <el-tab-pane label="未选" name="total">
                <div style="text-align:right; margin-bottom: 10px;">
                  <!-- <span style="padding-right: 10px">{{checkAll ? '已选择全部' : '已选择' + choosedDataLen + '条'}}</span> -->
                  <el-button size="mini" type="primary" style="margin-right: 4px;" @click="chooseCamera">选择</el-button>
                </div>
                <el-checkbox v-if="false" v-model="checkAll" @change="handleCheckAllChange(1)">选择所有的数据</el-checkbox>
                <camera-table ref="table" :options="tableOptions" @on-select="selectedData"
                  @on-select-all="selectedData" @on-change-page="changeCurrentPage"
                  @on-page-size-change="changePageSize"></camera-table>
              </el-tab-pane>
              <el-tab-pane :label="'已选' + checkedOptions.total" name="checked">
                 <div style="text-align:right; margin-bottom: 10px;">
                  <!-- <span>{{cancelCheckAll ? '已取消选择全部' : '已取消选择' + cancelCheckedDataLen + '条'}}</span> -->
                  <el-button size="mini" type="primary" style="margin-right: 4px;" @click="cancelChecked">取消选择
                  </el-button>
                </div>
                <el-checkbox v-if="false" v-model="cancelCheckAll" @change="handleCheckAllChange(2)">取消选择所有的数据</el-checkbox>
                <camera-table ref="table1" :options="checkedOptions" @on-select="cancelSelectedData"
                  @on-select-all="cancelSelectedData" @on-change-page="changeCurrentPage"
                  @on-page-size-change="changePageSize"></camera-table>
              </el-tab-pane>
            </el-tabs>

          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import searchForm from '../../components/form';
import cameraTable from '../../components/tablePlan/table';
export default {
  components: { searchForm, cameraTable },
  data () {
    let height = document.documentElement.clientHeight * 0.85 - 50 - 54 - 49 - 40 - 15 - 42 - 20;
    return {
      loading: false,
      isIndeterminate: true,
      dataVisible: false,
      idArr: [],
      deviceGroupList: [], // 获取摄像机组列表
      // // 摄像机状态：1-在线、4-离线、3-异常
      onlineStatusList: [{
        id: '0',
        name: "离线"
      },
      {
        id: '1',
        name: "在线"
      },
      {
        id: '2',
        name: "异常"
      }],
      searchForm: {
        model: {},
        cols: 6,
        size: 'mini',
        formItemList: [{
          label: '',
          placeholder: '桩号起始公里数K',
          type: 'input',
          name: 'kmPileMin',
          // optionsList: []
        },

        {
          label: '~',
          placeholder: '桩号终点公里数K',
          type: 'input',
          name: 'kmPileMax',
          // optionsList: []
        }, {
          label: '',
          placeholder: '摄像机所属类型',
          type: 'select',
          name: 'cameraType',
          optionsList: [{
            id: "1",
            name: "监控型枪机"
          },
          {
            id: "2",
            name: "监控型球机"
          },
          {
            id: "3",
            name: "全景型"
          },
          {
            id: "4",
            name: "抓拍型"
          }]
        }, {
          label: '',
          placeholder: '所属路线名称',
          type: 'select',
          name: 'roadCode',
          optionsList: []
        }, {
          label: '',
          placeholder: '管辖单位',
          type: 'cascader',
          name: 'organizationId',
          childrenName: 'childList',
          optionLabelName: 'organizationName',
          value:'organizationId',
          expandTrigger: 'hover',
          checkStrictly: false,
          isShowOrganization: false,
          optionsList: []

        }]
      },
      tableOptions: {
        pageNumber: 1,
        pageSize: 10,
        selection: true,
        localData: [],
        border: true,
        uniqueId: 'cameraId',
        selectionCache: true,
        maxHeight: '360px',
        columns: [{
          key: 'sort',
          title: '序号',
        }, 
        // {
        //   key: 'regionName',
        //   title: '省份'
        // },
         {
          key: 'organizationName',
          title: '管辖单位'
        }, 
        // {
        //   key: 'cameraName',
        //   title: '摄像机名称',
        // },
         {
          key: 'roadName',
          title: '路线'
        }, {
          key: 'kmPile',
          title: '桩号'
        }, 
        {
          key: 'cameraName',
          title: '兴趣点名称'
        },
        {
          key: 'classifyCode',
          title: '所属类别'
        },
         {
           type: 'direction',
           key: 'derectionCode',
          title: '方向',

        },
         {
          key: 'onlineStatus',
          title: '状态',
        }]
      },
      checkedOptions: {
        pageNumber: 1,
        pageSize: 10,
        selection: true,
        localData: [],
        border: true,
        maxHeight: '360px',
        total: 0,
        columns: [{
          key: 'sort',
          title: '序号',
        }, 
        // {
        //   key: 'regionName',
        //   title: '省份'
        // },
         {
          key: 'organizationName',
          title: '管辖单位'
        }, 
        // {
        //   key: 'cameraName',
        //   title: '摄像机名称',
        // },
         {
          key: 'roadName',
          title: '路线'
        }, {
          key: 'kmPile',
          title: '桩号'
        }, 
        {
          key: 'cameraName',
          title: '兴趣点名称'
        },
        {
          key: 'classifyCode',
          title: '所属类别'
        },
         {
           type: 'direction',
           key: 'derectionCode',
          title: '方向',

        },
         {
          key: 'onlineStatus',
          title: '状态',
        }]
      },
      activeName: 'total',
      activePlan: 'organization',
      choosedDataLen: 0,
      choosedData: [],
      classifyList: [],
      checkAll: false,
      areadyChoose: false,
      cancelCheckedData: [],
      cancelCheckAll: false,
      cancelCheckedDataLen: 0,
      editUser: '',
      deviceOrganizationId: '',
      deviceGroupId: '',
      codeType: []
    }
    
  },
  props: {
    UserOrgTree: {
      type: Array,
      default: () => {
        return []
      }
    },
    dataList: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
    watch: {
      'activePlan' (newVue, oldVal) {
           _.map(this.searchForm.formItemList, item => {
            if(item.name === 'organizationId') {
              if (this.activePlan === 'organization') {
                item.isShowOrganization = false
              } else {
                item.isShowOrganization = true
              }
            }
          });
      }
    },
  created () {
    Promise.all([this.loadClassify(), this.loadArea(), this.queryRoadList(), this.queryOrgList()]).then(res => {
      _.each(this.searchForm.formItemList, it => {
        // if (it.name === 'regionCode' && res[1].code === 200) {
        //   let list = res[1].data;
        //   list.unshift({
        //     regionCode: "",
        //     regionName: "全国",
        //     alias: "全国",
        //     parentRegionCode: "0"
        //   });
        //   it.optionsList = _.map(list, item => {
        //     return {
        //       id: item.regionCode,
        //       name: item.regionName
        //     }
        //   });
        // }
        if (it.name === 'roadCode' && res[2].code === 200) {
          it.optionsList = _.map(res[2].data, item => {
            return {
              id: item.roadCode,
              name: item.roadName
            }
          });
        }
        if (it.name === 'organizationId' && res[3].code === 200) {
          //  it.optionsList = _.map(res[3].data, item => {
          //   return {
          //     id: item.organizationId,
          //     name: item.organizationName
          //   }
          // });
          it.optionsList = res[3].data[0].childList
        }
        // if (it.name === 'classify' && res[0].code === 200) {
        //   it.optionsList = _.map(res[0].data, item => {
        //     return {
        //       id: item.codeValue,
        //       name: item.codeName
        //     }
        //   });
        //   this.classifyList = _.map(res[0].data, item => {
        //     return {
        //       id: item.codeValue,
        //       name: item.codeName
        //     }
        //   })
        // }
      })
    });
  },
  mounted () {
    // this.$refs.tree.setCurrentKey(this.UserOrgTree[0].organizationId);
  },
  methods: {
    formatter(row, i) {
      console.log('吉萨的接口',row, i)
      return '12345'
    },
    changeCurrentPage (pageNumber) {
      if (this.activeName === 'total') {
        this.tableOptions.pageNumber = pageNumber;
        this.queryList();
      } else {
        this.checkedOptions.pageNumber = pageNumber;
        this.queryChoosedData();
      }
    },
    changePageSize (pageSize) {
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
    queryList () {
      this.loading = true
      setTimeout(() => {
        this.loading = false
      }, 30000);
      console.log('最终的数据',this.searchForm.model)
      let form = {};
      _.each(this.searchForm.model, (it, key) => {
        if(it instanceof Array) {
          form[key] = it[it.length - 1];
        } else if (it && !_.isNumber(it) && it.trim() ) {
          form[key] = it;
        } else if (it && _.isNumber(it)) {
          form[key] = it;
        }
      })
      console.log('当前行数据', this.dataList, form)
      let params = {
          currPage: this.tableOptions.pageNumber,
          pageSize: this.tableOptions.pageSize,
          ...form,
          planId: this.dataList.planId,
          groupId: this.deviceGroupId
        //   openAppId: this.dataList.appId,
        //   organizationId: this.$refs.tree ? this.$refs.tree.getCurrentKey() : '',
          //  regionCode: this.dataLimit.regionCode, /// 省份
          //  roadId: this.dataLimit.shouldRoad,  //路线
          // organizationId: this.dataLimit.organizationId,
          // classify: this.dataLimit.classify, ////类别
          // cameraStatus: this.dataLimit.cameraStatus,// 摄像机状态
          //  cameraName: this.dataLimit.cameraName//搜索关键词
          // organizationId: this.$refs.tree ? this.$refs.tree.getCurrentKey() : '',
          // organizationId: this.editUser.organizationId,
          // selected: 0,
          // userId: this.editUser.userId,
          // selectCameraIds: this.choosedData,
          // mustOrganizationId: this.editUser.organizationId,
          // type: !_.isEmpty(this.editUser) ? 1 : 0
        }
         if(this.activePlan === 'organization') {
          params.organizationId = this.deviceOrganizationId
        }
      console.log('参数', params)
      this.$api.querySelectedAllCamera (params).then(res => {
        this.tableOptions.localData = this.resetTableData(res.data);
        this.tableOptions.total = res.total;
        this.loading =false
        this.assignment()
      }).catch(error =>{
        this.loading =false
        // this.$message.error('加载失败!')
      })
    },

    queryChoosedData () {
      this.loading =true
      setTimeout(() => {
        this.loading = false
      }, 30000);
      let form = {};
      _.each(this.searchForm.model, (it, key) => {
        if(it instanceof Array) {
          form[key] = it[it.length - 1];
        } else if (it && !_.isNumber(it) && it.trim() ) {
          form[key] = it;
        } else if (it && _.isNumber(it)) {
          form[key] = it;
        }
      })
      console.log('当前行数据', this.editUser)
      let params = {
          currPage: this.checkedOptions.pageNumber,
          pageSize: this.checkedOptions.pageSize,
          ...form,
          planId: this.dataList.planId,
          groupId: this.deviceGroupId
        //   openAppId: this.dataList.appId,
        //   organizationId: this.$refs.tree ? this.$refs.tree.getCurrentKey() : '',
          //  regionCode: this.dataLimit.regionCode, //
          //  roadId: this.dataLimit.shouldRoad, //
          // organizationId: this.dataLimit.organizationId,
          // classify: this.dataLimit.classify, //
          // cameraStatus: this.dataLimit.cameraStatus,
          //  cameraName: this.dataLimit.cameraName
          // organizationId: this.$refs.tree ? this.$refs.tree.getCurrentKey() : '',
          // organizationId: this.editUser.organizationId,
          // selected: 0,
          // userId: this.editUser.userId,
          // selectCameraIds: this.choosedData,
          // mustOrganizationId: this.editUser.organizationId,
          // type: !_.isEmpty(this.editUser) ? 1 : 0
        }
        if(this.activePlan === 'organization') {
          params.organizationId = this.deviceOrganizationId
        }
      this.$api.querySelectedCamera (params).then(res => {
        this.checkedOptions.localData = this.resetTableData(res.data);
        this.checkedOptions.total = res.total;
        this.loading =false
        this.assignment()
      }).catch(error =>{
        this.loading =false
        // this.$message.error('加载失败!')
      })
    },
    // 数据
    //  queryList(){
    //     let form = {};
    //     _.each(this.searchForm.model, (it, key) => {
    //         if(it && !_.isNumber(it) && it.trim()){
    //             form[key] = it;
    //         }else if(it && _.isNumber(it)){
    //             form[key] = it;
    //         }
    //     })
    //     let params = {
    //         currPage: this.tableOptions.pageNumber,
    //         pageSize: this.tableOptions.pageSize,
    //         ...form,
    //         organizationId: this.$refs.tree ? this.$refs.tree.getCurrentKey() : '',
    //         organizationId: this.editUser.organizationId,
    //         selected: 0,
    //         userId: this.editUser.userId,
    //         selectCameraIds: this.choosedData,
    //         mustOrganizationId: this.editUser.organizationId,
    //         type: !_.isEmpty(this.editUser) ? 1 : 0
    //     }
    //     this.$api.queryUserCamera(params).then(res => {
    //         this.tableOptions.localData = this.resetTableData(res.data);
    //         this.tableOptions.total = res.total;
    //         this.assignment()
    //     })
    // },
    // queryChoosedData(){
    //     let form = {};
    //     _.each(this.searchForm.model, (it, key) => {
    //         if(it && !_.isNumber(it) && it.trim()){
    //             form[key] = it;
    //         }else if(it && _.isNumber(it)){
    //             form[key] = it;
    //         }
    //     })
    //     let params = {
    //         currPage: this.checkedOptions.pageNumber,
    //         pageSize: this.checkedOptions.pageSize,
    //         ...form,
    //         organizationId: this.$refs.tree ? this.$refs.tree.getCurrentKey() : '',
    //         selected: 1,
    //         userId: this.editUser.userId,
    //         selectCameraIds: this.choosedData,
    //         mustOrganizationId: this.editUser.organizationId,
    //         type: !_.isEmpty(this.editUser) ? 1 : 0
    //     }
    //     this.$api.queryUserCamera(params).then(res => {
    //         this.checkedOptions.localData = this.resetTableData(res.data);
    //         this.checkedOptions.total = res.total;
    //         this.assignment()
    //     })
    // },
    closeChoosedDialog () {
      this.areadyChoose = this.checkAll || this.choosedDataLen > 0;
      console.log(1313, this.areadyChoose)
      this.$emit('close-choose-cameras', this.areadyChoose);

    },

    resetTableData (data) {
      console.log('shuu jslkjj',data)
      let vm = this;
      data = _.map(data, (it, index) => {
        _.map(vm.onlineStatusList, item => {
          if(it.onlineStatus === item.id) {
            it.onlineStatus = item.name
          }
        })
        let classify = _.find(vm.classifyList, {
          id: it.classify + ''
        });
        _.map(this.codeType, item => {
          if(it.classifyCode === item.codeValue) {
            it.classifyCode = item.codeName
          }
        })
        return {
          sort: index + 1,
          ...it,
          classify: classify ? classify.name : it.classify
        }
      });
      return data;
    },
    handleCheckAllChange (type) {
      let table = null;
      if (type === 1) {
        table = this.$refs.table.getOriginTable(this.checkAll);
        // table.toggleAllSelection(this.checkAll);
      } else {
        table = this.$refs.table1.getOriginTable(this.cancelCheckAll);
        // table.toggleAllSelection(this.cancelCheckAll);
      }
    },
    chooseCamera () {
      let cancelData = this.$refs.table.getSelected();
      let notChoiceData = this.$refs.table.getDelSelected();
      console.log('获取的值', cancelData, notChoiceData, this.dataList)
      let params = {};
      let id = ''
      let instructions = {}
    //   if (this.checkAll) {
    //     let form = {};
    //     _.each(this.searchForm.model, (it, key) => {
    //       if (it && !_.isNumber(it) && it.trim()) {
    //         form[key] = it;
    //       } else if (it && _.isNumber(it)) {
    //         form[key] = it;
    //       }
    //     })
    //     id = this.dataList.id;
    //   } else {
        let form = {};
        _.each(this.searchForm.model, (it, key) => {
          if(it instanceof Array) {
          form[key] = it[it.length - 1];
        } else if (it && !_.isNumber(it) && it.trim() ) {
          form[key] = it;
        } else if (it && _.isNumber(it)) {
          form[key] = it;
        }
        })

        // id = this.dataList.id;
        params.data = {flag: "3"}
        params.params = {
          ...form,
            planId: this.dataList.planId,
            cameraIds: cancelData,
             groupIds: [],
             status: '1',
              groupId: this.deviceGroupId
        }
         if(this.activePlan === 'organization') {
          params.params.organizationId = this.deviceOrganizationId
        }
        // instructions = {
        //   module: "资源管理",
        //   page: "开放管理",
        //   feature: "添加数据权限",
        //   description: `添加${this.dataList.appName}的数据权限`
        // };
    //   }
      console.log(params, "sdadas", id)
      this.$api.modifyPlan (params).then(res => {
        if (res.code !== 200) {
          this.$message({
            type: 'error',
            message: res.message || '选择失败'
          })
          return;
        }
        this.$message({
          type: 'success',
          message: '选择成功'
        })
        // 用于多选表格，清空用户的选择
        this.$refs.table.delSelectedRadioRow()
        this.$nextTick(() => {
          this.handleClick();
        });
        //  this.handleClick()
        // this.queryList();
        this.queryChoosedData();
        this.checkAll = false;
        this.choosedData = [];
        this.choosedDataLen = 0;
      })
      // this.checkedOptions.localData = cameras;
    },
    cancelChecked () {
      let cancelData = this.$refs.table1.getSelected();
      let notChoiceData = this.$refs.table1.getDelSelected();
      console.log('zuizhongzhi', cancelData, notChoiceData)
      this.cancelCheckedData = cancelData;
      let params = {};
      let id = ''
      let instructions = {}
    //   if (this.cancelCheckAll) {
    //     let form = {};
    //     _.each(this.searchForm.model, (it, key) => {
    //       if (it && !_.isNumber(it) && it.trim()) {
    //         form[key] = it;
    //       } else if (it && _.isNumber(it)) {
    //         form[key] = it;
    //       }
    //     })
    //     // params = {
    //     //     userId: this.editUser.userId,
    //     //     userBindCameraReq: {
    //     //         all: 1,
    //     //         userOrgId: this.editUser.organizationId,
    //     //         // ...form
    //     //          cameraIds:notChoiceData
    //     //     }
    //     // }

    //     id = this.dataList.id;
    //     params = {
    //       selectStatus: 1,
    //       all: 1,
    //       ...form,
    //       delCameras: notChoiceData
    //     }
    //     instructions = {
    //       module: "资源管理",
    //       page: "开放管理",
    //       feature: "添加数据权限",
    //       description: `添加${this.dataList.appName}的数据权限`
    //     };
    //   } else {
        let form = {};
        _.each(this.searchForm.model, (it, key) => {
          if(it instanceof Array) {
          form[key] = it[it.length - 1];
        } else if (it && !_.isNumber(it) && it.trim() ) {
          form[key] = it;
        } else if (it && _.isNumber(it)) {
          form[key] = it;
        }
        })
        // params = {
        //     userId: this.editUser.userId,
        //     userBindCameraReq: {
        //         "all": 0,
        //         "cameraIds": cancelData
        //     }
        // }
        // id = this.dataList.id;
        params.data = {flag: "2"}
        params.params = {
          ...form,
          planId: this.dataList.planId,
          cameraIds: cancelData,
          groupIds: [],
            status: '1',
          groupId: this.deviceGroupId
        }
        if(this.activePlan === 'organization') {
          params.params.organizationId = this.deviceOrganizationId
        }
        // instructions = {
        //   module: "资源管理",
        //   page: "开放管理",
        //   feature: "添加数据权限",
        //   description: `添加${this.dataList.appName}的数据权限`
        // };
        // }
        // 选择的参数
        // let id = this.dataList.id;
        // params = {
        //    delCameras:cancelData
        // }
        // let instructions = {
        //     module: "资源管理",
        //     page: "开放管理",
        //     feature: "添加数据权限",
        //     description: `添加${this.dataList.appName}的数据权限`
    //   };
      console.log(params, "sdadas")
      this.$api.modifyPlan (params).then(res => {
        if (res.code !== 200) {
          this.$message({
            type: 'error',
            message: res.message || '取消选择失败'
          })
          return;
        }
        if (this.cancelCheckAll) {
          this.searchForm.model = {};
        }
        this.$message({
          type: 'success',
          message: '取消选择成功'
        })
        // 用于多选表格，清空用户的选择
        this.$refs.table1.delSelectedRadioRow()
        this.$nextTick(() => {
          this.handleClick();
        });
        // this.handleClick()
        // this.queryList();
        // this.queryChoosedData();
        this.cancelCheckAll = false;
        this.cancelCheckedData = [];
        this.cancelCheckedDataLen = 0;
      });
    },
    assignment () {
      if (this.activeName === "total") {
        this.$refs.table.assignment(this.tableOptions.localData)
      } else {
        this.$refs.table1.assignment(this.checkedOptions.localData)
      }
    },
    loadClassify () {
      var _this = this;
      return this.$api
        .getCodemaster({
          codeType: "CLASSIFY"
        }).then(res=>{
          this.codeType = res.data
        })
    },
    queryRoadList (orgId) {
      let _this = this;
      return this.$api.getRoadsByOrgId("")
    },
    loadArea () {
      return this.$api.getProvince({
        regionLevel: 1
        
      })

    },
      // 获取管辖单位
    queryOrgList(regionCode) {
      let _this = this,
        params = {};
      if (regionCode) params.regionCode = regionCode;
     return this.$api.getOrgTree(params);
    },

         /**
     * 获取摄像机组列表
     */
    getDeviceList() {
      this.$api
        .getDeviceGroupList()
        .then(res => {
          console.log('参数组',res.data)
          this.deviceGroupList = res.data;
        });
    },
    handleDeviceGroup () {
      if(this.activePlan === 'camera') {
        this.getDeviceList()
      }
      this.deviceOrganizationId =''
      this.deviceGroupId = ''
      this.doSearch()
    },
    setDataPermission () {
      this.editUser = ''
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
      console.log('预案管理', this.editUser)
      this.dataVisible = true;
      this.queryChoosedData(true);
      this.queryList();
      this.$nextTick(() => {
        this.queryChoosedData();
      });
      this.doClear()
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
    handleTreenode (val, node, isSelf) {
      console.log('状态123',val)
      this.tableOptions.pageNumber = 1;
      this.deviceOrganizationId = val.organizationId
      this.queryList();
      this.queryChoosedData();
      
    },
    handleGroupName (item) {
      console.log('状态123',item)
      this.tableOptions.pageNumber = 1;
      this.deviceGroupId = item.groupId
      this.queryList();
    },
    doSearch () {
      this.tableOptions.pageNumber = 1;
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
    handleClick () {
      console.log(1223, this.activeName)
      this.tableOptions.pageNumber = 1;
      this.tableOptions.pageSize = 10;
      this.checkedOptions.pageNumber = 1;
      this.checkedOptions.pageSize = 10;
      this.checkAll = false;
      this.cancelCheckAll = false;
      this.doSearch();
      this.$refs.table.initialization()
      this.$refs.table1.initialization()
    },
    doClear () {
      console.log(this.searchForm.model)
      this.searchForm.model = {};
      this.deviceOrganizationId =''
      this.deviceGroupId = ''
      this.activePlan = 'organization'
      this.tableOptions.pageNumber = 1;
      this.tableOptions.pageSize = 10;
      this.checkedOptions.pageNumber = 1;
      this.checkedOptions.pageSize = 10;
      this.checkAll = false;
      this.cancelCheckAll = false;
      this.doSearch();
    },
    selectedData (data) {
      this.$nextTick(() => {
        this.choosedDataLen = this.$refs.table.getSelected().length;
      })
    },
    cancelSelectedData (data) {
      this.$nextTick(() => {
        this.cancelCheckedDataLen = this.$refs.table1.getSelected().length;
      })
    },
    getChoosedData () {
      return {
        all: this.checkAll,
        choosedData: this.choosedData
      }
    },
    doCheckedAll () {

    },
  }
}
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
            padding-left: 16px;
            width: 80%;
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
.check-camera-xc {
  .formStyle .el-form-item .el-form-item__label {
    width: 0;
  }
  .el-col-4{
    width: 25%;
  }
}
.camera-ul {
    li {
      height: 40px;
      line-height: 40px;
      cursor: pointer;
        span {
          font-size: 14px;
          font-weight: 700;
          margin-left: 10px;
        }

    }
}
</style>