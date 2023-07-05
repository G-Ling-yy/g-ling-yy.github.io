<template>
  <div class="device-trans content-wrapper">
    <div v-if="!showTranscodeDetail">
      <div class="camera-search-display camera-manage-search">
        <div
          :class="
            isAllHeight % 2 != 0 ? 'common-search-all-h' : 'search-wrapper'
          "
        >
          <el-form :inline="true">
            <el-form-item
              label="省份："
              v-if="uinfo.regionCode == 100000 ? true : false"
            >
              <!-- <el-select
                filterable
                placeholder="所属省"
                style="width:90px"
                v-model="province"
                clearable
              >
                <el-option
                  style="width:100px"
                  v-for="item in options"
                  :key="item.regionCode"
                  :label="item.regionName"
                  :value="item.regionCode"
                ></el-option>
              </el-select> -->
              <el-select
                v-model="province"
                disabled
                placeholder="江苏省"
                style="width: 90px"
              >
              </el-select>
            </el-form-item>
            <el-form-item label="状态：">
              <el-select
                filterable
                placeholder="请选择"
                style="width: 90px"
                v-model="isState"
                clearable
              >
                <el-option
                  style="width: 90px"
                  v-for="item in state"
                  :key="item.regionCode"
                  :label="item.name"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="管辖单位：">
              <el-cascader
                v-model="jurisdictionValue"
                clearable
                :show-all-levels="false"
                :options="options1"
                :props="orgCodeProps"
                style="width: 90px"
                @change="organizationNameChange"
              ></el-cascader>
            </el-form-item>
            <el-form-item label="设备厂商：">
              <el-select
                filterable
                clearable
                placeholder="选择设备厂商"
                style="width: 130px"
                v-model="downvendor"
              >
                <el-option
                  v-for="item in options2"
                  :key="item.value"
                  :label="item.codeName"
                  :value="item.codeValue"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="网关名称：">
              <el-input
                v-model="transcodingName"
                clearable
                placeholder="请输入网关名称"
                style="width: 150px"
              ></el-input>
            </el-form-item>
            <!-- <el-form-item>
          <el-button type="primary" class="query" @click="query"
            >查询</el-button
          >
          <el-button type="primary" class="reset" @click="removeQuery"
            >重置</el-button
          >
          </el-form-item>-->
          </el-form>
        </div>
        <div class="search-btn-right">
          <div class="btn-padding">
            <el-button type="primary" class="query" @click="queryList"
              >搜索</el-button
            >
            <el-button type="primary" class="reset" @click="removeQuery"
              >重置</el-button
            >
            <el-button
              v-if="BASECONFIG.IS_DEPARTMENT"
              style="margin-left: 10px"
              type="primary"
              class="query"
              @click="exportGatewayList"
              >数据导出</el-button
            >
          </div>
          <!-- <span @click="seachMore" v-if="isAllHeight%2==0" class="have-more-info">更多</span>
          <span @click="seachMore" v-if="isAllHeight%2!=0" class="have-more-info">收起</span>-->
          <div class="have-more-info">
            <el-dropdown @command="handleCommand">
              <span class="el-dropdown-link">
                <img src="../../assets/images/traffic_map/dev_add.png" alt />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="1">
                  <i>
                    <img
                      src="../../assets/images/traffic_map/dev-oadd.png"
                      alt
                    /> </i
                  >新增
                </el-dropdown-item>
                <el-dropdown-item :command="2">
                  <i>
                    <img
                      src="../../assets/images/traffic_map/dev-rrad.png"
                      alt
                    /> </i
                  >批量新增
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </div>
      <!-- 列表页详情 -->
      <div class="transcoding-list-tag">
        <div
          class="tag-conten"
          v-for="(item, index) in listData"
          :key="item.transcodingId"
        >
          <div class="tag-conten-header">
            <div style="display: flex">
              <i class="onlineStatusOk" v-if="item.onlineStatus == 1"></i>
              <i class="onlineStatusNo" v-if="item.onlineStatus == 0"></i>
              <el-tooltip
                class="item"
                effect="dark"
                :content="item.transcodingName"
                placement="top"
              >
                <span class="tag-conten-header-title">{{
                  item.transcodingName
                }}</span>
              </el-tooltip>
              <!-- 新增加的，通过判断显示ip 和非固定ip地址 -->
              <div v-if="uinfo.regionCode == 530000 ? true : false">
                <!-- <div> -->
                <span
                  class="el-tag el-tag--small el-tag--darkf"
                  v-if="item.isFixedGateway === 1 ? true : false"
                  >固定IP</span
                >
                <span
                  class="el-tag el-tag--small el-tag--darks"
                  v-if="item.isFixedGateway === 0 ? true : false"
                  >非固定IP</span
                >
              </div>
            </div>
            <div class="tag-conten-header-right">
              <el-dropdown trigger="hover">
                <span class="">
                  操作
                  <i class="el-icon-arrow-down"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <div class="con-bTn">
                    <div class="normal">
                      <span
                        @click="
                          flowA(
                            1,
                            item.transcodingId,
                            $event,
                            item.transcodingName
                          )
                        "
                        >开流</span
                      >
                      <span
                        @click="
                          flowA(
                            0,
                            item.transcodingId,
                            $event,
                            item.transcodingName
                          )
                        "
                        >关流</span
                      >
                    </div>

                    <div class="normal">
                      <span
                        @click="toggleVisible(1, item.transcodingId, $event)"
                        >显示</span
                      >
                      <span
                        @click="toggleVisible(0, item.transcodingId, $event)"
                        >隐藏</span
                      >
                    </div>

                    <div class="normal">
                      <span
                        @click="
                          flowOpen(
                            1,
                            item.transcodingId,
                            $event,
                            item.transcodingName
                          )
                        "
                        >开放</span
                      >
                      <span
                        @click="
                          flowOpen(
                            0,
                            item.transcodingId,
                            $event,
                            item.transcodingName
                          )
                        "
                        >关闭</span
                      >
                    </div>

                    <div class="bigBox" @click="modificationQquipment(item)">
                      <span class="Modify">编辑</span>
                    </div>

                    <div class="bigBox" @click="delData(item.transcodingId)">
                      <span class="Del">删除</span>
                    </div>

                    <!-- <div class="normal">
                    <span @click="play(1, item.transcodingId, $event)">播放</span>
                    <span @click="play(0, item.transcodingId, $event)">停止</span>
                  </div> -->
                    <div
                      class="bigBox"
                      @click="configureData(item.transcodingId)"
                    >
                      <span class="config">配置</span>
                    </div>
                    <!-- 推高清流/停高清流 -->
                    <div class="bigBox">
                      <span class="Modify"  
                      @click="
                          tallFlowA(
                            1,
                            item.transcodingId,
                            $event,
                            item.transcodingName
                          )
                        ">推高清流</span>
                    </div>

                    <div class="bigBox">
                      <span class="Del"
                        @click="
                          tallFlowA(
                            0,
                            item.transcodingId,
                            $event,
                            item.transcodingName
                          )
                        "
                      >停高清流</span>
                    </div>

                    <div class="bigBox">
                      <span @click="cameraExport(item)">导出对接参数</span>
                    </div>

                    <div class="bigBox" @click="exportCameraList(item)">
                      <span>导出摄像机数据</span>
                    </div>

                    <div class="bigBox" @click="dockingLog(item)">
                      <span>对接日志</span>
                    </div>
                  </div>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
          <!-- 列表内容 -->
          <div @click="toggleDetailVisible(item)" class="tag-conten-hover">
            <div class="tag-conten-list">
              <div class="tag-conten-list-left">省份：</div>
              <div class="tag-conten-list-right">
                {{ item.regionName }}
              </div>
            </div>
            <div class="tag-conten-list">
              <div class="tag-conten-list-left">管辖单位：</div>
              <el-tooltip
                class="item"
                effect="dark"
                :content="item.organizationName"
                placement="top"
              >
                <div class="tag-conten-list-right">
                  {{ item.organizationName }}
                </div>
              </el-tooltip>
            </div>
            <div class="tag-conten-list">
              <div class="tag-conten-list-left">最大接入量：</div>
              <div class="tag-conten-list-right">
                {{ item.channelNum }}
              </div>
            </div>

            <div class="tag-conten-list">
              <div class="tag-conten-list-left">已接入量：</div>
              <div class="tag-conten-list-right">
                {{ item.alreadyChannelNum }} (在线:
                <span style="color: #33cc00">{{ item.onlineChannelNum }}</span>
                <span style="padding-left: 10px">离线:</span>
                <span style="color: #ff0000">{{ item.offlineChannelNum }}</span
                >)
              </div>
            </div>
            <div class="tag-conten-list">
              <div class="tag-conten-list-left">所属流媒体：</div>
              <div class="tag-conten-list-right">
                {{ item.smName }}
              </div>
            </div>

            <div class="tag-conten-list">
              <div class="tag-conten-list-left">设备厂商：</div>
              <div class="tag-conten-list-right">
                {{ item.vendor }}
              </div>
            </div>
            <div class="tag-conten-list">
              <div class="tag-conten-list-left">联系人：</div>
              <div class="tag-conten-list-right">
                {{ item.contactPerson }}
              </div>
            </div>
            <div class="tag-conten-list">
              <div class="tag-conten-list-left">联系电话：</div>
              <div class="tag-conten-list-right">
                {{ item.contactPhone }}
              </div>
            </div>
          </div>
          <!-- 新增 -->
          <!-- <div class="checkBox">
            <div class="checkBoxs">
              <el-checkbox @change.native="changes(item.transcodingId, $event)"
                >按需调用</el-checkbox
              >
            </div>
            <div v-if="flags.includes(item.transcodingId)">
              <span>并发</span>
              <el-input-number
                placeholder="20"
                v-model="formData.callConcurrency"
                controls-position="auto"
                :min="1"
                :max="9999"
                style="width: 130px;"
              ></el-input-number>
              <span>路</span>
            </div>
          </div> -->
        </div>
      </div>
      <div class="table-pagination">
        <p class="total-pagination">共{{ transcodingTotal }}条</p>
        <el-pagination
          background
          layout=" prev, pager, next, sizes, jumper "
          :total="transcodingTotal"
          :page-size="transcodingPageSize"
          :page-sizes="[12, 24, 50, 100]"
          :current-page="transcodingCurrentPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
    </div>
    <!-- <el-date-picker
            v-model="dataVal"
            type="daterange"
            range-separator="~"
            start-placeholder="请选择上报日期"
            end-placeholder="请选择上报日期"
            @change="(value, dateString) => this.hanldeData(value, dateString)"
          >
    </el-date-picker>-->
    <transcodingDetail
      v-if="showTranscodeDetail"
      :selectedTran="selectedTran"
      :province="options"
      @on-back="showTranscodeDetail = false"
    ></transcodingDetail>
    <!-- 编辑修改弹窗 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="580px"
      custom-class="gd-custom-dialog"
      v-dialogDrag
      :append-to-body="true"
      :close-on-click-modal="false"
      @close="clearDialogForm"
    >
      <el-form
        label-position="left"
        label-width="120px"
        ref="addForm"
        :rules="rules"
      >
        <el-form-item label="设备厂商：">
          <!--:disabled="modification"-->
          <el-select
            :disabled="dialogTitle == '修改' ? true : false"
            style="width: 394px"
            v-model="formData.vendor"
            filterable
            placeholder="请选择设备厂商"
            @change="vendorCodeChange"
          >
            <el-option
              v-for="item in options2"
              :key="item.regionCode"
              :label="item.codeName"
              :value="item.codeValue"
            ></el-option>
          </el-select>
          <span style="color: red">*</span>
        </el-form-item>
        <el-form-item
          label="省份："
          v-if="uinfo.regionCode == 100000 ? true : false"
        >
          <el-select
            style="width: 394px"
            filterable
            placeholder="请选择地区"
            v-model="formData.regionCode"
            :disabled="modificationProvince"
          >
            <el-option
              v-for="item in options"
              :key="item.regionCode"
              :label="item.regionName"
              :value="item.regionCode"
            ></el-option>
          </el-select>

          <!-- <span style="color:red">*</span> -->
        </el-form-item>
        <el-form-item label="管辖单位：">
          <el-input
            style="width: 394px"
            v-model="formData.organizationName"
            placeholder="请选择管辖单位"
            v-if="modification"
            :disabled="true"
          ></el-input>
          <el-cascader
            style="width: 394px"
            clearable
            ref="cascader"
            :show-all-levels="false"
            :options="options1"
            :props="orgCodeProps"
            :disabled="modification"
            @change="organizationNameChange"
            v-model="formData.organizationId"
            v-else
          ></el-cascader>
          <span style="color: red" v-show="!modification">*</span>
        </el-form-item>
        <el-form-item label="最大接入数：">
          <!--<el-input style="width: 394px;" type="number"
              v-model="formData.channelNum"
              placeholder="请填写"
          ></el-input>-->
          <el-input-number
            :precision="0"
            v-model="formData.channelNum"
            :min="1"
            controls-position="right"
            :max="9999"
          ></el-input-number>
          <span style="color: red; position: absolute; margin-left: 20px"
            >*</span
          >
        </el-form-item>

        <el-form-item label="软件版本：">
          <el-select
            filterable
            clearable
            placeholder="请选择云端流媒体"
            v-model="formData.softVersion"
            style="width: 394px"
          >
            <el-option
              v-for="item in definitionList"
              :key="item.codeValue"
              :label="item.codeName"
              :value="item.codeValue"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="云端流媒体：">
          <el-select
            filterable
            clearable
            placeholder="请选择云端流媒体"
            v-model="formData.smId"
            style="width: 394px"
          >
            <el-option
              v-for="item in options3"
              :key="item.smId"
              :label="item.smName"
              :value="item.smId"
            ></el-option>
          </el-select>
        </el-form-item>
        <div v-if="uinfo.regionCode == 530000 ? true : false">
          <!-- <div> -->
          <!-- 是否转码 -->
          <el-form-item label="是否转码：">
            <el-radio-group v-model="formData.isTranscodingGateway">
              <el-radio :label="1">转码网关</el-radio>
              <el-radio :label="0">不转码网关</el-radio>
            </el-radio-group>
          </el-form-item>
          <!-- 按需调用 -->
          <el-form-item label="按需调用：">
            <el-radio-group v-model="formData.isCallByNeed">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <!-- 调用并发数 -->
          <el-form-item
            v-if="formData.isCallByNeed === 1 ? true : false"
            label="调用并发数："
          >
            <el-input-number
              :precision="0"
              placeholder="20"
              controls-position="right"
              v-model="formData.callConcurrency"
              :min="1"
              :max="9999"
            ></el-input-number>
          </el-form-item>
          <div
            v-show="
              formData.channelNum < formData.callConcurrency ? true : false
            "
            class="textLine"
          >
            <span> 如调用并发数超过最大接入数，以最大接入数为准。 </span>
          </div>
          <!-- 按需调用时长 -->
          <el-form-item
            v-if="formData.isCallByNeed === 1 ? true : false"
            label="按需调用时长"
          >
            <el-select
              style="width: 100px"
              v-model="formData.callDuration"
              placeholder="30"
            >
              <el-option
                v-for="item in timeRange"
                :key="item.value"
                :label="item.label"
                :value="item.label * 60"
              >
              </el-option>
            </el-select>
            <!-- 分钟 -->
            <el-select v-model="values" style="width: 100px">
              <el-option
                v-for="item in third"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <!-- 网关类型 -->
          <el-form-item label="网关类型：">
            <el-radio-group v-model="formData.isFixedGateway">
              <el-radio :label="1">固定IP</el-radio>
              <el-radio :label="0">非固定IP</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>

        <el-form-item label="访问地址：">
          <!--:disabled="modification"-->
          <div
            style="
               {
                display: flex;
              }
            "
          >
            <el-select
              style="width: 100px; margin-right: 0px"
              v-model="getUrlHeader"
              placeholder="请选择"
            >
              <el-option label="Http://" value="Http://"></el-option>
              <el-option label="Https://" value="Https://"></el-option>
            </el-select>
            <el-input
              style="width: 200px"
              v-model="formData.urlAddress"
              placeholder="请填写网关访问地址"
            >
            </el-input>
          </div>
        </el-form-item>
        <el-form-item label="网关编号：">
          <el-input
            style="width: 394px"
            v-model="formData.deviceCode"
            placeholder="请填写网关编号"
          ></el-input>
        </el-form-item>
        <el-form-item label="网关User：">
          <el-input
            style="width: 394px"
            v-model="formData.deviceUser"
            placeholder="请填写网关User"
          ></el-input>
        </el-form-item>
        <el-form-item label="网关Token：">
          <el-input
            style="width: 394px"
            v-model="formData.deviceToken"
            placeholder="请填写网关Token"
          ></el-input>
        </el-form-item>
        <el-form-item label="私钥：">
          <span v-if="formData.hasPrivateKey == 1">已上传</span>
          <el-upload
            style="width: 394px"
            ref="Secretupload"
            class="upload-demo"
            :action="
              `${BASECONFIG.API_BASE_URL}/device/transcodings/` +
                transcodingId +
                '/privateKey'
            "
            accept=".key,.pem,.ms-excel,text/plain"
            :auto-upload="false"
            multiple
            :limit="1"
            :headers="uploadHeaders"
            :on-success="afterUploadPriva"
            methods="put"
          >
            <span class="uplo">上传</span>
            <span style="padding-left: 10px"
              >私钥格式只限：key,pem,text格式</span
            >
          </el-upload>
        </el-form-item>

        <el-form-item label="联系人：">
          <el-input
            style="width: 394px"
            v-model="formData.contactPerson"
            placeholder="请填写联系人"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="联系电话：" prop="contactPhone" required :disabled="true"> -->
        <el-form-item label="联系电话：">
          <el-input
            style="width: 394px"
            v-model="formData.contactPhone"
            placeholder="请填写联系电话"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="hideFormData">取 消</el-button>
        <el-button type="primary" @click="dataAdd">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="temp"
      width="394px"
      custom-class="gd-custom-dialog"
      v-dialogDrag
      :append-to-body="true"
      :close-on-click-modal="false"
      @close="clearDialogForm"
    >
      <div>
        请先下载
        <span
          class="copy"
          @click="download"
          style="color: #0062ff; cursor: pointer; text-decoration: underline"
          >模板</span
        >
        填写好信息后上传
      </div>
      <div style="margin-top: 20px">
        <span class="temp-box">
          <span class="av"></span>
          <el-upload
            ref="upload"
            class="upload-demo"
            :action="`${BASECONFIG.API_BASE_URL}/device/transcodings/import`"
            multiple
            :limit="1"
            :headers="uploadHeaders"
            :file-list="fileList"
            :auto-upload="false"
            :before-upload="beforeUpload"
            :on-success="batchUpload"
            :on-error="errorUpload"
          >
            <div class="uploadBtn">点击上传</div>
          </el-upload>
        </span>
        支持扩展名：.xlsx,.xls
      </div>
      <!-- <div style="margin-top:20px;  position: relative;padding-left:24px;">
        <span class="mysfify"></span><span class="tdUplaod">表格.xlsx</span
        ><span class="mysRemove" title="删除该文件"></span>
      </div>-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="temp = false">取 消</el-button>
        <el-button type="primary" @click="addData">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="信息确认"
      :visible.sync="details"
      width="1065px"
      custom-class="gd-custom-dialog"
      v-dialogDrag
      :append-to-body="true"
      :close-on-click-modal="false"
    >
      <div class="addFromInfo">
        <ul>
          <li v-for="(item, index) in errorDatalist" :key="index">
            <div class="head">
              <span>上云网关名称</span>
            </div>
            <div
              v-for="(key, value, index) in item.errData"
              :key="index"
              class="content_info"
              v-show="Obj[value]"
            >
              <span class="key" style="margin-right: 7px"
                >{{ Obj[value] }}:</span
              >
              <span class="value">{{ key }}</span>
            </div>
            <span
              style="color: rgb(245, 108, 108)"
              v-for="(key, value) in item.errorMsg"
              :key="'err' + value"
              >{{ key }}</span
            >
          </li>
        </ul>
      </div>
      <el-button
        @click="details = false"
        style="margin-left: 50%; transfrom: translateX(-50%)"
        >取消</el-button
      >
    </el-dialog>
    <!-- 对接日志 -->
    <journal-abutment
      ref="journalAbutment"
      :dialogTableVisible="dialogTableVisible"
      @dialog-close="
        (flag) => {
          this.dialogTableVisible = flag;
        }
      "
    >
    </journal-abutment>
    <edit-table
      ref="table"
      :data="batchWrongData"
      :columns="batchWrongColumns"
      @confirm-data="confirmBatchData"
    ></edit-table>
    <!-- 配置弹窗 -->
    <config-modal
      :propsData="{
        transcodingId: checkedTranscodingId,
        streamMediaOpts: options3,
      }"
      :show.sync="isConfigModalShow"
      v-if="isConfigModalShow"
    />
  </div>
</template>
<script src="../js/DeviceTranscodingManage.js"></script>
<style lang="less" scoped>
.textLine {
  color: #666;
  text-align: center;
  height: 30px;
}
.el-button + .el-button {
  margin-left: 0px;
}
.el-tag--darkf {
  background-color: #e9b410;
  border-color: #e9b410;
  color: #fff;
}
.el-tag--darks {
  background-color: #01bfbf;
  border-color: #01bfbf;
  color: #fff;
}
.gd-custom-dialog .el-select {
  padding-right: 0px;
}
.transcoding-list-tag {
  display: flex;
  flex-wrap: wrap;
  .tag-conten {
    padding: 24px 10px;
    width: calc(~"(100% - 36px) / 4");
    background-color: #ffffff;
    margin-bottom: 13px;
    box-shadow: 0px 1px 1px 0px rgba(20, 22, 37, 0.08);
    border-radius: 4px;
    margin: 4px 4px;
    cursor: pointer;
    .tag-conten-header {
      position: relative;
      display: flex;
      justify-content: space-between;
      width: 100%;
      height: 34px;
      line-height: 34px;
      .onlineStatusOk {
        display: inline-block;
        width: 7px;
        height: 7px;
        background: rgba(38, 181, 95, 1);
        // margin-left: 22px;
        margin: 12px 9px 0 0;
        margin-right: 9px;
        vertical-align: middle;
      }
      .onlineStatusNo {
        display: inline-block;
        width: 7px;
        height: 7px;
        // margin-left: 22px;
        margin: 12px 9px 0 0;
        vertical-align: middle;
        background: rgba(249, 85, 47, 1);
        vertical-align: middle;
      }

      .Modify {
        display: inline-block;
        width: 24px;
        height: 24px;
        background-image: url("../../assets/images/traffic_map/dev_b.png");
        border-radius: 4px;
        cursor: pointer;
        position: relative;
        top: 8px;
      }
      .Del {
        display: inline-block;
        width: 24px;
        height: 24px;
        background-image: url("../../assets/images/traffic_map/dev_del.png");
        border-radius: 4px;
        cursor: pointer;
        position: relative;
        top: 8px;
      }
      .tail {
        display: inline-block;
        position: absolute;
        right: 8px;
        height: 14px;
        font-size: 14px;
        font-weight: 400;
        color: rgba(10, 17, 33, 1);
        line-height: 50px;
        opacity: 0.5;
      }
      .tag-conten-header-title {
        display: inline-block;
        width: 110px;
        font-size: 18px;
        font-weight: bold;
        color: #000000;
        vertical-align: middle;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .tag-conten-header-right {
        position: absolute;
        height: 100%;
        top: 0;
        right: 0;
        line-height: 34px;
      }
      .el-dropdown-link {
        display: inline-block;
        width: 29px;
        height: 14px;
        font-size: 14px;
        color: #333333;
      }
    }
    .tag-conten-hover {
      cursor: pointer;
      font-size: 12px;
    }
    .tag-conten-list {
      width: 100%;
      padding: 10px 0;
      border-bottom: 1px solid #e6eaed;
      display: flex;
      .tag-conten-list-left {
        color: #939598;
        width: 35%;
      }
      .tag-conten-list-right {
        display: flex;
        justify-content: center;
        display: inline-block;
        width: 65%;
        font-size: 14px;
        color: #939598;
        vertical-align: middle;
        text-overflow: ellipsis;
      }
    }
  }
}
.el-message-box__wrapper {
  overflow: scroll;
}
// .transcoding-list-wrapper {
//   display: flex;
//   flex-wrap: wrap;
// }
.checkBox {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.checkBoxs {
  margin-right: 10px;
}

.el-dialog__body {
  padding: 20px 20px 10px !important;
}
.el-dialog__footer {
  padding-top: 0 !important;
  padding-bottom: 30px !important;
}
.device-trans {
  width: 100%;
  height: 100%;
  background-color: #ebeff3;
  position: relative;
  .camera-manage-search {
    display: inline-table;
    width: 100%;
  }
  .search-btn-right {
    width: 20%;
    .have-more-info {
      margin-top: 7px;
    }
    .query {
      margin-right: 10px;
    }
  }
  .search-wrapper {
    width: 80%;
    height: 100%;
    overflow: initial;
    float: left;
  }
  .navigation {
    height: 30px;
  }

  .cloud-serach {
    width: 1657px;
    height: 83.6px;
    background-color: #ffffff;
    // line-height: 83px;
    margin-bottom: 12px;
    .have-more-info {
      // margin-top: 7px;
    }

    .el-form--inline .el-form-item__content {
      visibility: middle !important;
      margin-top: 22px;
    }
    .el-select .el-input__inner,
    .el-input .el-input__inner {
      width: 162px;
    }
    .el-input__suffix {
      right: 20px;
    }

    .el-input__icon {
      line-height: 0;
    }
  }
  // .el-dropdown {
  //   vertical-align: -webkit-baseline-middle;
  // }
  .cloud-add {
    z-index: 33333;
    position: absolute;
    // top: 22px
    right: -20px;
    cursor: pointer;
    height: 24px;
    border-radius: 4px;
    .Aadd {
      width: 22px;
      height: 22px;
      display: inline-block;
      background-color: red;
    }
    .el-dropdown {
      line-height: 1;
      vertical-align: -webkit-baseline-middle;
    }
  }
  .add-new-platform {
    position: absolute;
    right: -30px;
    top: 3px;
  }

  .copy {
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(18, 116, 238, 1);
    margin-left: 6px;
  }
  .copy:hover {
    cursor: pointer;
    text-decoration: underline;
  }
  .toAudit {
    .el-dialog__header {
      width: 394px;
      background: rgba(232, 234, 239, 1);
    }
    .el-dialog__title {
      font-size: 14px;
      font-family: Source Han Sans CN;
      font-weight: bold;
      color: rgba(10, 17, 33, 1);
    }
    .el-select .el-input__inner,
    .el-input .el-input__inner {
      width: 236px;
    }
    .el-form-item__label {
      padding: 0 !important;
      font-size: 14px;
      font-family: Source Han Sans CN;
      font-weight: 400;
      color: rgba(0, 0, 0, 1);
      text-align: left;
      line-height: 32px;
    }
    .el-form-item {
      margin-bottom: 6px;
    }
    // .el-input__suffix {
    //   //   right: 20px;
    // }
    .el-input__icon {
      line-height: 0;
    }
    .el-select,
    .el-input {
      margin-right: 0;
    }

    .el-dialog__footer {
      text-align: center;
      .el-button--default {
        background: rgba(146, 150, 155, 1);
        border: 1px solid rgba(190, 193, 197, 1);
        border-radius: 2px;
      }
      .el-button--primary {
        background: rgba(18, 116, 238, 1);
        border: 1px solid rgba(190, 193, 197, 1);
        border-radius: 2px;
      }
    }
  }
  .temp {
    .el-dialog__header {
      width: 394px;
      background: rgba(232, 234, 239, 1);
    }
    .el-dialog__title {
      font-size: 14px;
      font-family: Source Han Sans CN;
      font-weight: bold;
      color: rgba(10, 17, 33, 1);
    }
    .temp-box {
      text-align: center;
      line-height: 32px;
      display: inline-block;
      width: 101px;
      position: relative;
      height: 32px;
      background: #fff;
      border: 1px solid rgba(190, 193, 197, 1);
      border-radius: 16px;
      padding-left: 14px;
      cursor: pointer;
      .av {
        position: absolute;
        top: 8px;
        left: 10px;
        display: inline-block;
        width: 15px;
        visibility: middle;
        height: 15px;
        background-image: url("../../assets/images/traffic_map/dev-upload.png");
      }
    }
    .mysfify {
      position: absolute;
      top: 0px;
      left: 10px;
      display: inline-block;
      width: 15px;
      visibility: middle;
      height: 15px;
      background-image: url("../../assets/images/traffic_map/dev-fangda.png");
    }
    .tdUplaod:hover {
      cursor: pointer;
      text-decoration: underline;
    }
    .tdUplaod {
      margin-left: 4px;
    }
    .mysRemove {
      position: absolute;
      top: 4px;
      left: 90px;
      display: inline-block;
      width: 10px;
      cursor: pointer;
      height: 10px;
      margin-left: 4px;
      border-radius: 2px;
      background-image: url("../../assets/images/traffic_map/dev-wjdel.png");
    }
    .el-dialog__footer {
      text-align: center;
      .el-button--default {
        background: rgba(146, 150, 155, 1);
        border: 1px solid rgba(190, 193, 197, 1);
        border-radius: 2px;
      }
      .el-button--primary {
        background: rgba(18, 116, 238, 1);
        border: 1px solid rgba(190, 193, 197, 1);
        border-radius: 2px;
      }
    }
  }

  .details {
    .el-dialog__header {
      width: 1065px;
      background: rgba(232, 234, 239, 1);
    }
    .el-dialog__title {
      font-size: 14px;
      font-family: Source Han Sans CN;
      font-weight: bold;
      color: rgba(10, 17, 33, 1);
    }
    .el-dialog__footer {
      text-align: center;
      .el-button--default {
        background: rgba(146, 150, 155, 1);
        border: 1px solid rgba(190, 193, 197, 1);
        border-radius: 2px;
      }
      .el-button--primary {
        background: rgba(18, 116, 238, 1);
        border: 1px solid rgba(190, 193, 197, 1);
        border-radius: 2px;
      }
    }
    .oremoer {
      display: inline-block;
      width: 495px;
      border: 1px solid rgba(231, 231, 231, 1);
      border-radius: 4px;
      height: 404px;
      padding: 10px 0 0 20px;
      margin-left: 12px;
      margin-bottom: 10px;
      .oremoer_tit {
        margin-bottom: 4px;
        .oremoer_tit_line {
          width: 3px;
          height: 12px;
          background: rgba(18, 116, 238, 1);
          border-radius: 2px;
          display: inline-block;
          margin-right: 8px;
        }
      }
      .oremoer_con {
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(169, 169, 169, 1);
        line-height: 26px;

        p {
          margin: 0;
          padding: 0;
        }
      }
    }
  }
}
.addFromInfo {
  background: #fff;
  border-radius: 4px;

  ul {
    width: 100%;
    overflow: hidden;
    padding: 10px 20px;

    li {
      width: 47%;
      height: 47%;
      border: 1px solid rgba(231, 231, 231, 1);
      border-radius: 4px;
      margin-bottom: 13px;
      float: left;
      padding: 18px 0 0 18px;
      line-height: 26px;
    }

    li:nth-child(1),
    li:nth-child(3) {
      margin-right: 13px;
    }

    .head {
      height: 14px;
      border-left: 3px solid #1274ee;
      line-height: 14px;
      font-size: 14px;
      margin-bottom: 15px;
      span {
        margin-left: 7px;
      }
    }
    .content_info {
      line-height: 26px;
    }
  }
}
.uplo {
  text-decoration: underline;
  color: rgba(18, 116, 238, 1);
  /*color: ;*/
}
#copy {
  position: fixed;
  top: -9999px;
}
.keyUpload {
  display: inline-block;
}
.keyUpload2 {
  position: relative;
}
.search-wrapper {
  position: relative;
}
.uploadBtn {
  padding: 5px 9px;
  background-color: #409eff;
  border-radius: 20px;
  color: #fff;
  margin-bottom: 10px;
}
.detailsdialog {
  position: fixed;
  right: -500px;
  top: 2%;
}
.key {
  color: #a9a9a9;
}
.value {
  color: #000;
}
.jhupload {
  left: -1000px;
  top: 200px;
}
.device_token {
  display: inline-block;
  width: calc(~"100% - 32px - 235px");
  overflow: hidden;
  vertical-align: middle;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.con-bTn {
  background: #fff !important;
  padding: 12px;
  .normal {
    cursor: pointer;
    text-align: center;
    span {
      display: inline-block;
      color: #000;
      width: 62px;
      height: 32px;
      border: 1px solid rgba(190, 193, 197, 1);
      border-radius: 2px;
      text-align: center;
      line-height: 32px;
      margin-left: 10px;
      margin-bottom: 6px;
      transition: all 0.4s;
      &:hover {
        border-color: #1374ee;
        background: #1374ee;
        color: #fff;
      }
    }
    .bgcax1 {
      background: rgba(18, 116, 238, 1);
    }
  }
}

.bigBox {
  width: 136px;
  height: 32px;
  border: 1px solid rgba(190, 193, 197, 1);
  border-radius: 2px;
  text-align: center;
  line-height: 32px;
  margin-left: 10px;
  cursor: pointer;
  transition: all 0.4s;

  margin-bottom: 6px;
  span {
    display: inline-block;
    color: #000;
    border-radius: 2px;
  }

  &:hover {
    background: #1374ee;
    border-color: #1374ee;
    span {
      color: #fff;
    }
  }
}
.el-dropdown-link {
  cursor: pointer;
}
.container-wrapper .el-select,
.gd-custom-dialog .el-select,
.container-wrapper .el-input,
.gd-custom-dialog .el-input,
.container-wrapper .el-cascader,
.gd-custom-dialog .el-cascader {
  margin-right: 0px;
}
</style>
