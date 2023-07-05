<template>
  <div class="The-cloud content-wrapper">
    <div class="breadcrumb-wrapper">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/dashboard' }">
          <i class="iconfont icondashboard"></i>
        </el-breadcrumb-item>
        <el-breadcrumb-item>设备管理</el-breadcrumb-item>
        <el-breadcrumb-item>上云网关管理</el-breadcrumb-item>
      </el-breadcrumb>
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
    <div class="camera-search-display camera-manage-search">
      <div
        :class="isAllHeight % 2 != 0 ? 'common-search-all-h' : 'search-wrapper'"
      >
        <el-form :inline="true">
          <el-form-item label="省份：">
            <el-select
              filterable
              placeholder="所属省"
              style="width:120px"
              v-model="province"
              clearable
            >
              <el-option
                v-for="item in options"
                :key="item.regionCode"
                :label="item.regionName"
                :value="item.regionCode"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态：">
            <el-select
              filterable
              placeholder="请选择"
              style="width:120px"
              v-model="isState"
              clearable
            >
              <el-option
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
              change-on-select
              style="width: 150px"
              @change="organizationNameChange"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="设备厂商：">
            <el-select
              filterable
              clearable
              placeholder="请选择"
              style="width: 150px"
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
        <div>
          <div class="btn-padding">
            <el-button type="primary" class="query" @click="query"
              >搜索</el-button
            >
            <el-button type="primary" class="reset" @click="removeQuery"
              >重置</el-button
            >
          </div>
          <!-- <span @click="seachMore" v-if="isAllHeight%2==0" class="have-more-info">更多</span>
          <span @click="seachMore" v-if="isAllHeight%2!=0" class="have-more-info">收起</span>-->
        </div>
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
    <div class="transcoding-list-wrapper">
      <div class="content" v-for="(item, index) in listData" :key="index">
        <div class="content-header">
          <i class="onlineStatusOk" v-if="item.onlineStatus == 1"></i>
          <i v-else class="onlineStatusNo"></i>
          <span>{{ item.platformName }}</span>
          <span class="Modify" @click="modificationQquipment(item)"></span>
          <span class="Del" @click="delData(item.transcodingId)"></span>
          <!-- <span class="tail">202020202020202020202020202020</span> -->
        </div>
        <div class="content-L">
          <p>
            省份:
            <span style="color:#000000;margin-left:6px;">
              {{ item.regionName }}
            </span>
          </p>
          <p>
            所属路公司:
            <span style="color:#000000;margin-left:6px;" class="ssgs">
              {{ item.parentOrganizationName }}
            </span>
          </p>
          <p>
            管辖单位:
            <span style="color:#000000;margin-left:6px;">
              {{ item.organizationName }}
            </span>
          </p>
          <p>
            最大接入量:
            <span style="color:#000000;margin-left:6px;">
              {{ item.channelNum }}
            </span>
          </p>
          <p>
            已接入量:
            <span style="color:#000000;margin-left:6px;">
              {{ item.alreadyChannelNum }} (在线：
              <span>{{ item.onlineChannelNum }}</span>
              离线：
              <span>{{ item.offlineChannelNum }}</span
              >)
            </span>
          </p>
          <p>
            所属流媒体:
            <span style="color:#000000;margin-left:6px;">
              {{ item.smName }}
            </span>
          </p>
          <p>
            设备厂商:
            <span style="color:#000000;margin-left:6px;">
              {{ item.vendorName }}
            </span>
          </p>
          <p>
            联系人:
            <span style="color:#000000;margin-left:6px;">
              {{ item.responsiblePerson }}
            </span>
          </p>
          <p>
            联系电话:
            <span style="color:#000000;margin-left:6px;">{{ item.phone }}</span>
          </p>
        </div>
        <div class="line" style="margin-left:403px"></div>
        <div class="lineA"></div>
        <div class="content-R">
          <p>
            平台设备编号:
            <span style="color:#000000;margin-left:6px;">
              {{ item.platformCode }}
            </span>
          </p>
          <p>
            User:
            <span style="color:#000000;margin-left:6px;">
              {{ item.platformUser }}
            </span>
          </p>
          <div>
            平台Token:
            <el-tooltip
              class="item"
              effect="dark"
              :content="item.platformToken"
              placement="bottom"
            >
              <span
                class="device_token"
                style="color:#000000;margin-left:6px;"
                >{{ item.platformToken }}</span
              >
            </el-tooltip>
            <span class="copy" @click="copyTXT(item.platformToken)">复制</span>
          </div>
          <div style="margin-top:26px">
            访问地址:
            <span style="color:#000000;margin-left:6px;"
              >{{ item.ipAddress }}{{ item.port ? ":" + item.port : "" }}</span
            >
          </div>
          设备编号:
          <span style="color:#000000;margin-left:6px;">
            {{ item.deviceCode }}
          </span>
          <div>
            User:
            <span style="color:#000000;margin-left:6px;">
              {{ item.deviceUser }}
            </span>
          </div>
          <div>
            设备Token:
            <el-tooltip
              class="item"
              effect="dark"
              :content="item.platformToken"
              placement="bottom"
            >
              <span class="device_token" style="color:#000000;margin-left:6px;"
                >{{ item.transcodingToken }}
              </span>
            </el-tooltip>
          </div>
          <div class="keyUpload">
            私钥:
            <div class="keyUpload">
              <span
                style="color:#000000;margin:0 6px;"
                v-if="item.hasPrivateKey == '1'"
                >有私钥</span
              >
              <div class="keyUpload" @click="getagainSecretKey(item)">
                <!-- <span class="copy">重新上传</span> -->
                <!--<el-upload name="keyupload1" ref="keyupload1"
                    :limit="1"
                    :on-change="keyuploadChange(item.transcodingId, 'keyupload1')">
                  <el-button size="small" type="primary">点击上传</el-button>
                  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                </el-upload>-->
                <input
                  type="file"
                  name="keyupload1"
                  ref="keyupload1"
                  @change="keyuploadChange(item.transcodingId, 'keyupload1')"
                />
              </div>
            </div>
            <!-- <div class="keyUpload" v-else>
              <span class="copy">上传</span>
              <input
                type="file"
                name="keyupload2"
                ref="keyupload2"
                @change="keyuploadChange(item.transcodingId, 'keyupload2')"
              />
            </div>-->
          </div>
        </div>
        <div class="con-bTn">
          <div class="normal">
            <span @click="flowA(1, item.transcodingId, $event)">开流</span>
            <span @click="flowA(0, item.transcodingId, $event)">关流</span>
          </div>
          <div class="normal">
            <span @click="flowOpen(1, item.transcodingId, $event)">开放</span>
            <span @click="flowOpen(0, item.transcodingId, $event)">关闭</span>
          </div>
          <div class="normal">
            <span @click="play(1, item.transcodingId, $event)">播放</span>
            <span @click="play(0, item.transcodingId, $event)">停止</span>
          </div>
          <div class="bigBox">
            <span @click="cameraExport(item.transcodingId)">导出对接参数</span>
          </div>
          <div class="bigBox" @click="exportCameraList(item.transcodingId)">
            <span>导出摄像机数据</span>
          </div>
        </div>
        <div class="con-footer">
          <el-collapse
            v-model="activeNames"
            accordion
            @change="handleChange(item.transcodingId)"
          >
            <el-collapse-item title :name="index">
              <template slot="title">
                <p style="margin-left:34px;color:#000000">摄像机信息</p>
              </template>
              <table class="bc-table">
                <thead>
                  <tr>
                    <td>序号</td>
                    <td>所属省</td>
                    <td>管辖单位</td>
                    <td>路线</td>
                    <td>桩号</td>
                    <td>经纬度</td>
                    <td>所属类别</td>
                    <td>方向</td>
                    <td>状态</td>
                    <td>推流状态</td>
                    <td>播放状态</td>
                    <td>开放状态</td>
                    <td>摄像机类型</td>
                    <!-- <td>操作</td> -->
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in cameraList" :key="index">
                    <td>{{ ++index }}</td>
                    <td>{{ item.provinceName }}</td>
                    <td>{{ item.departmentName }}</td>
                    <td>{{ item.organizationName }}</td>
                    <td>{{ item.pile }}</td>
                    <td>{{ item.lonAndlat }}</td>
                    <td>{{ item.classifyName }}</td>
                    <td>{{ item.derectionName }}</td>
                    <td v-if="item.synOnlineStatus == 0">
                      <i class="grayNor"></i>离线
                    </td>
                    <td v-if="item.synOnlineStatus == 1">
                      <i class="nor"></i>正常
                    </td>
                    <td v-if="item.synOnlineStatus == 2">
                      <i class="Nonor"></i>故障
                    </td>
                    <td v-if="item.streamStatus == 1">
                      <span class="bc-flowOk"></span>
                    </td>
                    <td v-else>
                      <span class="bc-flowNo"></span>
                    </td>
                    <td v-if="item.playStatus == 1">
                      <span class="bc-videoOk"></span>
                    </td>
                    <td v-else>
                      <span class="bc-susped"></span>
                    </td>
                    <td v-if="item.openStatus == 1">
                      <span class="bc-flowOk"></span>
                    </td>
                    <td v-else>
                      <span class="bc-flowNo"></span>
                    </td>
                    <td>{{ item.cameraTypeName }}</td>
                    <!-- <td style="padding-top:12px;">
                      <span class="bc_video"></span>
                      <span class="bc-search"></span>
                    </td>-->
                  </tr>
                </tbody>
              </table>
              <!-- 分页 -->
              <div class="table-pagination">
                <p class="total-pagination">共{{cameraListTotal}}条</p>
                <el-pagination
                  background
                  layout=" prev, pager, next, sizes, jumper, total "
                  :total="cameraListTotal"
                  :page-size="cameraListPageSize"
                  :current-page="cameraListCurrentPage"
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                ></el-pagination>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
    </div>

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
      <el-form label-position="left" label-width="100px" ref="addForm">
        <el-form-item label="省份：">
          <el-select
            style="width: 400px;"
            filterable
            placeholder="全省"
            v-model="formData.regionCode"
            :disabled="modification"
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
          <el-input
            style="width: 400px;"
            v-model="formData.organizationName"
            placeholder="请填写"
            v-if="modification"
            :disabled="true"
          ></el-input>
          <el-cascader
            style="width: 400px;"
            clearable
            :show-all-levels="false"
            :options="options1"
            :props="orgCodeProps"
            :disabled="modification"
            @change="organizationNameChange"
            v-model="formData.organizationId"
            v-else
          ></el-cascader>
          <span style="color:red" v-show="!modification">*</span>
        </el-form-item>
        <el-form-item label="所属流媒体：">
          <el-select
            filterable
            clearable
            placeholder="请选择"
            v-model="formData.smId"
            style="width: 400px;"
          >
            <el-option
              v-for="item in options3"
              :key="item.smId"
              :label="item.smName"
              :value="item.smId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="最大接入数：">
          <!--<el-input style="width: 400px;" type="number"
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
            :disabled="dialogTitle == '修改' ? true : false"
            style="width: 400px;"
            v-model="vendorNameview"
            filterable
            placeholder="请选择"
            @change="vendorCodeChange"
          >
            <el-option
              v-for="item in options2"
              :key="item.regionCode"
              :label="item.codeName"
              :value="item.codeName + '*' + item.codeValue"
            ></el-option>
          </el-select>
          <span style="color:red">*</span>
        </el-form-item>
        <el-form-item label="设备编号：">
          <el-input
            style="width: 400px;"
            v-model="formData.deviceCode"
            placeholder="请填写"
          ></el-input>
        </el-form-item>
        <el-form-item label="User：">
          <el-input
            style="width: 400px;"
            v-model="formData.deviceUser"
            placeholder="请填写"
          ></el-input>
        </el-form-item>
        <el-form-item label="私钥：" v-if="dialogTitle != '修改'">
          <el-upload
            style="width: 400px;"
            ref="Secretupload"
            class="upload-demo"
            action="#"
            :auto-upload="false"
            multiple
            :limit="1"
            :http-request="SecretuploadFile"
            :disabled="modification"
          >
            <span class="uplo">上传</span>
          </el-upload>
        </el-form-item>
        <el-form-item label="token：">
          <el-input
            style="width: 400px;"
            v-model="formData.authToken"
            placeholder="请填写"
          ></el-input>
        </el-form-item>
        <el-form-item label="访问地址：">
          <!--:disabled="modification"-->
          <el-input
            style="width: 400px;"
            v-model="formData.ipAddress"
            placeholder="请填写"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系人：">
          <el-input
            style="width: 400px;"
            v-model="formData.responsiblePerson"
            placeholder="请填写"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系电话：">
          <el-input
            style="width: 400px;"
            v-model="formData.phone"
            placeholder="请填写"
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
          style="color:#0062ff;cursor: pointer;    text-decoration: underline;"
          >模板</span
        >
        ,填写好信息后上传
      </div>
      <div style="margin-top:20px;">
        <span class="temp-box">
          <span class="av"></span>
          <el-upload
            ref="upload"
            class="upload-demo"
            action="#"
            :auto-upload="false"
            multiple
            :limit="1"
            :http-request="uploadFile"
            :file-list="fileList"
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
              <span>上云网关名称1</span>
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
              v-for="(key, value, index) in item.errorMsg"
              >{{ key }}</span
            >
          </li>
        </ul>
      </div>
      <el-button
        @click="details = false"
        style="margin-left: 50%;transfrom: translateX(-50%);"
        >取消</el-button
      >
    </el-dialog>
  </div>
</template>
<script src="../js/DeviceTranscodingManage.js"></script>
<style lang="less" scoped>
.el-dialog__body {
  padding: 20px 20px 10px !important;
}
.el-dialog__footer {
  padding-top: 0 !important;
  padding-bottom: 30px !important;
}
.The-cloud {
  width: 100%;
  height: 100%;
  background-color: #ebeff3;
  position: relative;

  .navigation {
    height: 30px;
  }

  .cloud-serach {
    width: 1657px;
    height: 83.6px;
    background-color: #ffffff;
    line-height: 83px;
    margin-bottom: 12px;

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
    }
  }
  .add-new-platform {
    position: absolute;
    right: -30px;
    top: 3px;
  }
  .content {
    width: 100%;
    background-color: #ffffff;
    margin-bottom: 13px;
    box-shadow: 0px 1px 1px 0px rgba(20, 22, 37, 0.08);
    border-radius: 4px;
    position: relative;
    .content-header {
      font-size: 14px;
      font-weight: 400;
      color: rgba(0, 0, 0, 1);
      line-height: 50px;
      border-bottom: 1px solid rgba(212, 212, 212, 1);
      .onlineStatusOk {
        display: inline-block;
        width: 5px;
        height: 5px;
        background: rgba(38, 181, 95, 1);
        margin-left: 22px;
        margin-right: 4px;
        vertical-align: middle;
      }
      .onlineStatusNo {
        display: inline-block;
        width: 5px;
        height: 5px;
        margin-left: 22px;
        margin-right: 4px;
        vertical-align: middle;
        background: rgba(249, 85, 47, 1);
        vertical-align: middle;
      }

      span {
        font-size: 14px;
        font-weight: 400;
        color: rgba(0, 0, 0, 1);
        line-height: 50px;
        margin-right: 12px;
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
    }
    .line {
      width: 1px;
      height: 268px;
      border: 1px solid rgba(212, 212, 212, 1);
    }
    .lineA {
      position: absolute;
      left: 80%;
      top: 50px;
      width: 1px;
      height: 268px;
      border: 1px solid rgba(212, 212, 212, 1);
    }
    .content-L {
      width: 25%;
      height: 221px;
      font-size: 12px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: rgba(169, 169, 169, 1);
      line-height: 26px;
      position: absolute;
      top: 56px;
      left: 35px;
      p {
        margin: 0;
        padding: 0;
      }
      .ssgs {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
    .content-R {
      width: 50%;
      font-size: 12px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: rgba(169, 169, 169, 1);
      line-height: 26px;
      position: absolute;
      top: 69px;
      left: 463px;
      .copy {
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(18, 116, 238, 1);
        margin-left: 6px;
        margin-right: 6px;
      }
      .copy:hover {
        cursor: pointer;
        text-decoration: underline;
      }
      p {
        width: 100%;
        margin: 0;
        padding: 0;
        height: 26px;
      }
    }
    .el-button > span {
      color: #000 !important;
    }
    .con-bTn {
      position: absolute;
      left: 85%;
      top: 88px;

      .normal {
        cursor: pointer;
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
    }
    .con-footer {
      font-size: 14px;
      font-family: Source Han Sans CN;
      font-weight: 400;
      color: rgba(0, 0, 0, 1);
      line-height: 50px;
      border-top: 1px solid rgba(212, 212, 212, 1);
      /deep/.el-collapse-item__arrow {
        margin-left: 4px !important;
      }
      .bc-table {
        width: 100%;
        text-align: left;
        margin-bottom: 30px;
        // border-color:#35406d;
        th,
        td {
          height: 33px;
          padding-left: 12px;
          line-height: 34px;
          border-left: 1px solid rgba(212, 212, 212, 1);
          border-top: 1px solid rgba(212, 212, 212, 1);
          border-bottom: 1px solid rgba(212, 212, 212, 1);
          .bc_video {
            display: inline-block;
            width: 24px;
            height: 24px;
            visibility: middle;
            cursor: pointer;
            background-image: url("../../assets/images/traffic_map/dev-video.png");
            border-radius: 4px;
          }
          .nor {
            display: inline-block;
            width: 5px;
            height: 5px;
            background: rgba(38, 181, 95, 1);
            vertical-align: middle;
            margin-right: 6px;
            margin-top: -4px;
          }
          .Nonor {
            display: inline-block;
            width: 5px;
            margin-right: 6px;
            height: 5px;
            margin-top: -4px;
            background: rgba(249, 85, 47, 1);
            vertical-align: middle;
          }
          .grayNor {
            display: inline-block;
            width: 5px;
            margin-right: 6px;
            height: 5px;
            margin-top: -4px;
            background: #a39d9d;
            vertical-align: middle;
          }
          .bc-flowNo {
            display: inline-block;
            width: 14px;
            height: 14px;
            border-radius: 50%;
            cursor: pointer;
            background-image: url("../../assets/images/traffic_map/dev-No.png");
          }
          .bc-flowOk {
            display: inline-block;
            width: 14px;
            height: 14px;
            border-radius: 50%;
            cursor: pointer;
            background-image: url("../../assets/images/traffic_map/dev-ok.png");
          }
          .bc-videoOk {
            display: inline-block;
            width: 14px;
            height: 14px;
            border-radius: 50%;
            cursor: pointer;
            background-image: url("../../assets/images/traffic_map/dev-videoOK.png");
          }
          .bc-search {
            display: inline-block;
            width: 24px;
            height: 24px;
            cursor: pointer;
            background-image: url("../../assets/images/traffic_map/dev_search.png");
            border-radius: 4px;
            margin-left: 12px;
          }
          .bc-susped {
            display: inline-block;
            width: 14px;
            height: 14px;
            cursor: pointer;
            background-image: url("../../assets/images/traffic_map/dev-ded.png");
            border-radius: 4px;
          }
        }
        td:first-child {
          border-left: none;
        }
        td a {
          color: #51b2ff;
          text-decoration: none;
        }

        thead tr {
          background: rgba(243, 243, 243, 1);
          text-align: left;
          td {
          }
        }
        tbody tr {
        }
      }
    }
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
      width: 85px;
      padding: 0;
      font-size: 14px;
      font-family: Source Han Sans CN;
      font-weight: 400;
      color: rgba(0, 0, 0, 1);
      text-align: left;
    }
    .el-form-item {
      margin-bottom: 6px;
    }
    .el-input__suffix {
      //   right: 20px;
    }
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
</style>
