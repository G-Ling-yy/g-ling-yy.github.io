<template>
  <div class="my-detaills">
    <div class="search-wrapper">
      <el-form :inline="true" >
        <el-form-item label="省份">
          <el-select v-model="provinceName" placeholder="全国" style="width:100px">
            <el-option
              style="width:100px"
              v-for="(item) in provinceData"
              :value-key="item.regionCode"
              :key="item.regionCode"
              :label="item.regionName"
              :value="item.regionCode"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="管辖单位">
          <el-cascader
            v-model="organizationName"
            clearable
            :show-all-levels="false"
            :options="organizationData"
            :props="orgCodeProps"
            style="width: 150px"
            @change="orgChange"
            @clear="orgChange"
          ></el-cascader>
        </el-form-item>
        <!-- <el-form-item label="桩号范围">
          <div style="display: flex">
            <el-input placeholder="请输入起始公里数" v-model="startPile"></el-input>
            <span style="color: #000">~</span>
            <el-input placeholder="请输入终点公里数" v-model="endPile"></el-input>
          </div>
        </el-form-item>-->
        <el-form-item label="路线">
          <el-select v-model="roadCode" placeholder="请选择" style="width:100px">
            <el-option
              style="width:100px"
              v-for="(item) in roadList"
              :value-key="item.roadCode"
              :key="item.roadCode"
              :label="item.roadName"
              :value="item.roadCode"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属类别">
          <el-select v-model="classifyName" placeholder="请选择" style="width:100px">
            <el-option
              style="width:100px"
              v-for="(item) in classify"
              :value-key="item.codeValue"
              :key="item.codeValue"
              :label="item.codeName"
              :value="item.codeValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="对接方式" style="width:300px;">
          <el-select v-model="connectionWayName" placeholder="请选择">
            <el-option
              v-for="(item) in connectionWay"
              :value-key="item.codeValue"
              :key="item.codeValue"
              :label="item.codeName"
              :value="item.codeValue"
            ></el-option>
          </el-select>
        </el-form-item>-->
        <!-- <el-form-item label="所属上云网关">
          <el-select
            v-model="transcodingName"
            filterable
            placeholder="请选择"
            style="width:164px"
            clearable
            @change="changeTransCode"
          >
            <el-option
              v-for="item in transCodeList"
              :key="item.transcodingId"
              :label="item.transcodingName"
              :value="item.transcodingName"
            ></el-option>
        </el-select>-->
        <!-- <el-input placeholder="请输入关键字" v-model="transcodingName"></el-input> -->
        <!-- </el-form-item> -->
        <el-form-item label="摄像机状态" style="margin-bottom:0;">
          <el-select v-model="playStatusName" placeholder="请选择" style="width:100px">
            <el-option
              style="width:100px"
              v-for="(item) in playStatusData"
              :value-key="item.codeValue"
              :key="item.codeValue"
              :label="item.codeName"
              :value="item.codeValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-bottom:0;" label="摄像机名称">
          <el-input placeholder="请输入摄像机名称" v-model="cameraName" style="width:150px"></el-input>
        </el-form-item>
        <el-form-item style="margin-bottom:0;">
          <el-button type="primary" @click="getTableData">搜索</el-button>
          <el-button type="info" @click="resetData">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- <div class="search-header">
      <div class="search-header-box1">
        <div>
          <span>所属省：</span>
          <el-select v-model="provinceName" placeholder="全国">
            <el-option
              v-for="item in provinceData"
              :key="item.regionCode"
              :label="item.regionName"
              :value="item.regionCode">
            </el-option>
          </el-select>
        </div>
        <div>
          <span>管辖单位：</span>
          <el-select v-model="organizationName" placeholder="请选择">
            <el-option
              v-for="item in organizationData"
              :key="item.organizationId"
              :label="item.organizationName"
              :value="item.organizationId">
            </el-option>
          </el-select>
        </div>
        <div>
          <span>桩号范围：</span>
          <el-input placeholder="请输入起始公里数" v-model="startPile"></el-input>
          <span>~</span>
          <el-input placeholder="请输入终点公里数" v-model="endPile"></el-input>
        </div>
        <div>
          <span>方向：</span>
          <el-select v-model="derectionName" placeholder="请选择">
            <el-option
              v-for="item in derectionData"
              :key="item.codeValue"
              :label="item.codeName"
              :value="item.codeValue">
            </el-option>
          </el-select>
        </div>
        <div>
          <span>摄像机状态：</span>
          <el-select v-model="playStatusName" placeholder="请选择">
            <el-option
              v-for="item in playStatusData"
              :key="item.codeValue"
              :label="item.codeName"
              :value="item.codeValue">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="search-header-box2">
        <div>
          <span>对接方式：</span>
          <el-select v-model="connectionWayName" placeholder="请选择">
            <el-option
              v-for="item in connectionWay"
              :key="item.codeValue"
              :label="item.codeName"
              :value="item.codeValue">
            </el-option>
          </el-select>
        </div>
         <div>
          <span>所属类别：</span>
          <el-select v-model="classifyName" placeholder="请选择">
            <el-option
              v-for="item in classify"
              :key="item.codeValue"
              :label="item.codeName"
              :value="item.codeValue">
            </el-option>
          </el-select>
        </div>
        <div>
          <span>所属上云网关：</span>
          <el-input placeholder="请输入关键字" v-model="transcodingName"></el-input>
        </div>
        <div>
          <el-row>
            <el-button type="primary" @click="searchTableData" style="height:30px;">搜索</el-button>
            <el-button type="info" @click="resetData"  style="height:30px;">重置</el-button>
          </el-row>
        </div>
      </div>
    </div>-->
    <div class="selected-table-h">
      <div class="cameraCount">
        <span class="cameraCount-box1">已选</span>
        <span class="cameraCount-box2">{{ this.checkData.length }}</span>
      </div>
      <div class="table-content-body table-height-s">
        <div class="table-content-inner">
          <el-table
            ref="multipleCameraTable"
            :data="tableData"
            tooltip-effect="dark"
            border
            :header-cell-style="{
              background: '#F5F7FA',
              color: '#606266',
              textAlign: 'left'
            }"
            :row-key="getRowkeys"
            @selection-change="handleSelectionChange"
            @select="hanldeCameraAll"
            @select-all="hanldeCameraAll"
            class="custom-cloud-table"
          >
            <el-table-column type="selection" width="50" :reserve-selection="true"></el-table-column>
            <el-table-column type="index" label="序号" width="80"></el-table-column>
            <el-table-column align="center" label="省份">
              <template slot-scope="scope">
                <div>
                  {{
                  scope.row.regionName
                  }}
                </div>
                <!--          + "/" +
                  scope.row.cityName +
                  "/" +
                scope.row.regionName-->
              </template>
            </el-table-column>
            <el-table-column prop="organizationId" label="管辖单位"></el-table-column>
            <el-table-column prop="cameraName" label="摄像机名称"></el-table-column>
            <el-table-column prop="roadCode" label="路线"></el-table-column>
            <el-table-column prop="kmPile" label="桩号"></el-table-column>
            <!-- <el-table-column align="center" label="经纬度">
              <template slot-scope="scope">
                <div>{{ scope.row.longitude + "," + scope.row.latitude }}</div>
              </template>
            </el-table-column>-->
            <el-table-column prop="classifyCode" label="所属类别">
              <!-- 	
              所属类别,0：默认 1：道路沿线 2：桥梁 3：隧道 4：收费广场 5：收费站 6：服务区 7：ETC门架 8：移动视频源-->
              <template slot-scope="scope">
                <div>
                  {{ scope.row.classifyCode == 1?"道路沿线":scope.row.classifyCode == 2?"桥梁 ":scope.row.classifyCode == 3?"隧道":scope.row.classifyCode == 4?"收费广场 "
                  :scope.row.classifyCode == 5?"收费站":scope.row.classifyCode == 6?"服务区 ":scope.row.classifyCode == 7 ?"ETC门架":scope.row.classifyCode == 8?"移动视频源 ":"默认"}}
                </div>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="derectionName" label="方向"></el-table-column> -->
            <!-- <el-table-column prop="playStatus" label="摄像机状态">
              <template slot-scope="scope">
                <div>
                  <span
                    :style="
                      `display: inline-block;width: 5px;height: 5px;vertical-align: middle;background-color:${
                        stateCol[scope.row.playStatus]
                      }`
                    "
                  ></span>
                  {{ stateList[scope.row.playStatus] }}
                </div>
              </template>
            </el-table-column>-->
            <!-- <el-table-column prop="transcodingName" label="所属上云网关"></el-table-column> -->
            <!-- <el-table-column prop="appName" label="所属平台"></el-table-column> -->
            <el-table-column prop="cameraType" label="摄像机类型">
              <!-- 摄像机类型 1:监控型枪机 2:监控型球机 3:全景型 4:抓拍型 -->
              <template slot-scope="scope">
                <div>{{ scope.row.cameraType == 1?"监控型枪机":scope.row.cameraType == 2?"监控型球机":scope.row.cameraType == 3?"全景型":scope.row.cameraType == 4?"抓拍型": "" }}</div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <!-- <div class="myPage" v-if="this.tableData.data.length>0"> -->
      <div class="table-pagination">
        <p class="total-pagination">共{{total}}条</p>
        <el-pagination
          background
          layout="prev, pager, next, sizes, total, jumper"
          :page-sizes="[pagesize]"
          :total="total"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          @close="selectEquipmentDis"
        ></el-pagination>
      </div>
    </div>
    <div slot="footer" class="dialog-footer" style="padding-top:0">
      <el-button @click="selectEquipmentDis">取 消</el-button>
      <el-button type="primary" @click="selectEquip">确 定</el-button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import $http from "../../filters/http";
export default {
  props: {
    equipmentInfo: Object,
    type: {
            type: String,
            default:''
        }
  },
  data() {
    return {
      roadCode: "",
      cameraName: "",
      transCodeList: [],
      tableData: [],
      pagesize: 10,
      currpage: 1,
      total: 0,
      stateList: ["离线", "正常", "故障"],
      stateCol: ["#878787", "#26B55F", "#F9552F"],
      provinceData: [], //省
      provinceName: "",
      organizationData: [], //管辖单位
      organizationName: "",
      organizationId:"",
      startPile: "", //开始桩号
      endPile: "", //结束桩号
      roadList: [], //方向
      derectionName: "",
      orgCodeProps: {
        //lazy: true,
        expandTrigger: "hover",
        value: "organizationId",
        label: "organizationName",
        children: "childList",
        checkStrictly: true
        // multiple: false,
        //lazyLoad:this.propsLazyload
      },
      playStatusData: [
        { codeValue: "1", codeName: "正常" },
        { codeValue: "0", codeName: "离线" },
        { codeValue: "2", codeName: "故障" },
      ], //摄像机状态
      playStatusName: "",
      connectionWay: [
        { codeValue: "0", codeName: "路段" },
        { codeValue: "1", codeName: "部省" }
      ], //对接方式
      connectionWayName: "",
      classify: [], //所属类别
      classifyName: "",
      transcodingName: "", //所属上云网关
      checkData: [],
      selectEquipment: false
    };
  },
  methods: {
    /**
     * 单位列表change事件
     * @param val
     */
    orgChange(val) {
      this.organizationId="";
      if (val.length) {
        let orgId = val[val.length - 1];
        this.organizationId = orgId;
      }
    },
    handleCurrentChange(cpage) {
      this.currpage = cpage;
      this.getTableData();
    },
    handleSizeChange(psize) {
      this.pagesize = psize;
      this.getTableData();
    },
    // 获取上云网关list
    queryUpCloud() {
      let _this = this,
        params = {};
      params = {
        currPage: 0,
        pageSize: 0,
        regionId: "",
        organizationCode: ""
      };
      this.$api.getTranscodingList(params).then(msg => {
        _this.transCodeList = msg.data;
      });
    },
    // 选中的上云网关名称
    changeTransCode(val) {
      this.transcodingName = val;
    },
    //获取tableData
    getTableData() {
      console.log('预案摄像机', this.type, this.equipmentInfo)
      if (this.type === 'InspectionDialog') {
        let params = {
          currPage: this.currpage,
          pageSize: this.pagesize,
          planId: this.equipmentInfo.planId
        }
      this.$api.getCameraList(params).then(res => {
        if (res.code == 200) {
          this.tableData = res.data;
          this.total = res.total;
        } else {
          this.$message({
            type: "info",
            message: res.message
          });
        }
      });
    } else {
      let params = {
        currPage: this.currpage,
        pageSize: this.pagesize,
        cameraName: this.cameraName,
        // regionId: this.areaValue,
        regionId: this.provinceName, //
        organizationId: this.organizationId, //
        roadCode: this.roadCode, //
        // derectionCode: this.derectionName, //
        classifyCode: this.classifyName, //
        cameraStatus: this.playStatusName,
        
      };
      if(this.equipmentInfo){
        params.groupId = this.equipmentInfo.groupId;
      }
      // var params = {
      //   roadId: null,
      //   cameraName: "",
      //   derectionCode: null,
      //   // classifyCode: null,
      //   regionId: this.provinceName,
      //   organizationId: this.organizationName,
      //   derectionCode: this.derectionName,
      //   synOnlineStatus: this.playStatusName,
      //   connectionWay: this.connectionWayName,
      //   classifyCode: this.classifyName,
      //   kmPileMin: this.startPile,
      //   kmPileMax: this.endPile,
      //   transcodingName: this.transcodingName,
      //   groupId: this.$parent.$parent.updateGroupId // 摄像机组id,目前无用
      // };
      this.$api.getCameraList(params).then(res => {
        if (res.code == 200) {
          this.tableData = res.data;
          this.total = res.total;
        } else {
          this.$message({
            type: "info",
            message: res.message
          });
        }
      });
    }
  },
    //获取所有省份
    getGrovinceData() {
      this.$api
        .getProvince({
          regionLevel: 1
        })
        .then(res => {
          if (res.code != "200") {
            return Promise.reject;
          }

          this.provinceData = res.data;
          this.provinceData.unshift({
            regionCode: "",
            regionName: "全国",
            alias: "全国",
            parentRegionCode: "0"
          });
        })
        .catch(() => {});
    },

    queryOrgList(regionCode) {
      let _this = this,
        params = {};
      if (regionCode) params.regionCode = regionCode;
      this.$api
        .getOrgTree()
        .then(data => {
          if (data.code !== 200) {
            return Promise.reject();
          }
          let nlist = data.data[0].childList;
          _.each(nlist, it => {
            it.disabled = true;
          })
          _this.organizationData = nlist;
        })
        // .catch(error => {
        //   this.$message({
        //     message:
        //       "获取组织架构树失败! [" + error.code + "]: " + error.message,
        //     type: "error"
        //   });
        // });
    },

    //获取所有管辖单位
    // getOrganizationData() {
    //   $http.get("/basic/org/all").then(res => {
    //     if (res.data.code == 200) {
    //       this.organizationData = res.data.data;
    //     } else {
    //       this.$message({
    //         type: "info",
    //         message: res.data.message
    //       });
    //     }
    //   });
    // },
    //获取所有路线

    getDerectionData() {
      this.$api
        .getRoadsByOrgId()
        .then(data => {
          if (data.code !== 200) {
            return Promise.reject();
          }
          this.roadList = data.data;
        })
        .catch(() => {});
    },
    //获取所有类别
    getClassify() {
      $http.get("/base/code-masters/list?codeType=CLASSIFY").then(res => {
        if (res.data.code == 200) {
          this.classify = res.data.data;
        } else {
          this.$message({
            type: "info",
            message: res.data.message
          });
        }
      });
    },
    //重置数据
    resetData() {
      this.provinceName = "";
      this.organizationName = "";
      this.organizationId="";
      this.startPile = "";
      this.cameraName = "";
      this.derectionName = "";
      this.playStatusName = "";
      this.connectionWayName = "";
      this.classifyName = "";
      this.transcodingName = "";
      this.roadCode="";
      this.getTableData();
    },
    //checkbox
    handleSelectionChange(val) {
      this.checkData = val;
    },
    getRowkeys(row) {
      return row.cameraId;
    },
    // 全选
    hanldeCameraAll(allList, row) {
      this.checkData = [];
      if (allList.length) {
        this.checkData.push(...allList);
      }
    },
    //确定选择
    selectEquip() {
      this.currpage = 1;
      this.getTableData();
      let checkData = this.$parent.$parent.checkData.concat(
        this.checkData
      );
      
      //选中的数据去从
      let ids = _.map(checkData, it => it.cameraId ); 
      ids = new Set(ids);
      ids = Array.from(ids);
      this.$parent.$parent.checkData = _.map(ids, it => {
        let data = _.find(checkData, item => item.cameraId === it);
        return data;
      })
      this.checkData = this.$parent.$parent.checkData; //所选中的摄像机
      this.$refs.multipleCameraTable.clearSelection();
      this.$parent.$parent.selectEquipment = false;
    },
    // 取消
    selectEquipmentDis() {
      this.currpage = 1;
      this.getTableData();
      console.log(this.checkData);
      this.$parent.$parent.selectEquipment = false;
    },
    //根据条件搜索摄像机数据
    searchTableData() {
      var params = {
        regionId: this.provinceName,
        organizationId: this.organizationId,
        derectionCode: this.derectionName,
        synOnlineStatus: this.playStatusName,
        connectionWay: this.connectionWayName,
        classifyCode: this.classifyName,
        kmPileMin: this.startPile,
        kmPileMax: this.endPile,
        transcodingName: this.transcodingName
      };
      //console.info(params)
      $http
        .post(
          "/device/camera/list?currPage=" +
            this.currpage +
            "&pageSize=" +
            this.pagesize,
          params
        )
        .then(res => {
          if (res.data.code == 200) {
            this.tableData = res.data;
          } else {
            this.$message({
              type: "info",
              message: res.data.message
            });
          }
        });
    }
  },
  created() {
    // this.getTableData();
    this.getGrovinceData();
    this.queryOrgList();
    // this.getOrganizationData();
    this.getDerectionData();
    this.getClassify();
    this.queryUpCloud();
  }
};
</script>

<style scoped>
.my-detaills {
  height: 100%;
}
.search-header > div {
  display: flex;
  align-items: center;
}

.search-header > div > div {
  display: flex;
  align-items: center;
}
.el-button {
  height: 30px !important;
  line-height: 5px !important;
}

.dialog-footer {
  margin: 8px 0px;
}
</style>
