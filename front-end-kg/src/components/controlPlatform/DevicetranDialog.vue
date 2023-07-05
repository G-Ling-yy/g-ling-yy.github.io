<template>
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
      <el-form label-position="left" label-width="120px" ref="addForm">
        <el-form-item label="省份：">
          <el-select
            style="width: 394px;"
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
            style="width: 394px;"
            v-model="formData.organizationName"
            placeholder="请填写"
            v-if="modification"
            :disabled="true"
          ></el-input>
          <el-cascader
            style="width: 394px;"
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
          <span style="color:red" v-show="!modification">*</span>
        </el-form-item>
        <el-form-item label="所属流媒体：">
          <el-select
            filterable
            clearable
            placeholder="请选择"
            v-model="formData.smId"
            style="width: 394px;"
          >
            <el-option
              v-for="item in options3"
              :key="item.smId"
              :label="item.smName"
              :value="item.smId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="最大接入量：">
          <!--<el-input style="width: 394px;" type="number"
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
            style="width: 394px;"
            v-model="formData.vendor"
            filterable
            placeholder="请选择"
            @change="vendorCodeChange"
          >
            <el-option
              v-for="item in options2"
              :key="item.regionCode"
              :label="item.codeName"
              :value="item.codeValue"
            ></el-option>
          </el-select>
          <span style="color:red">*</span>
        </el-form-item>
        <el-form-item label="访问地址：">
          <!--:disabled="modification"-->
          <div style="{display:flex;}">
            <el-select
              style="width: 100px;margin-right: 0px;"
              v-model="formData.urlHeader"
              placeholder="请选择"
              >
              <el-option value="Http://" label="Http://"></el-option>
              <el-option value="Https://" label="Https://"></el-option>
            </el-select>
            <el-input
              style="width: 200px;"
              v-model="formData.urlAddress"
              placeholder="请填写"
              >
            </el-input>
          </div>
        </el-form-item>
        <el-form-item label="设备编号：">
          <el-input
            style="width: 394px;"
            v-model="formData.deviceCode"
            placeholder="请填写"
          ></el-input>
        </el-form-item>
        <el-form-item label="设备user：">
          <el-input
            style="width: 394px;"
            v-model="formData.deviceUser"
            placeholder="请填写"
          ></el-input>
        </el-form-item>
        <el-form-item label="设备token：">
          <el-input
            style="width: 394px;"
            v-model="formData.deviceToken"
            placeholder="请填写"
          ></el-input>
        </el-form-item>
        <el-form-item label="私钥：">
          <span v-if="formData.hasPrivateKey == 1">已上传</span>
          <el-upload
            style="width: 394px;"
            ref="Secretupload"
            class="upload-demo"
            :action="
              `${BASECONFIG.API_BASE_URL}/device/transcodings/` +
                transcodingId +
                '/privateKey'
            "
            :auto-upload="false"
            multiple
            :limit="1"
            :headers="uploadHeaders"
            :on-success="afterUploadPriva"
            methods="put"
          >
            <span class="uplo">上传</span>
          </el-upload>
        </el-form-item>

        <el-form-item label="联系人：">
          <el-input
            style="width: 394px;"
            v-model="formData.contactPerson"
            placeholder="请填写"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系电话：">
          <el-input
            style="width: 394px;"
            v-model="formData.contactPhone"
            placeholder="请填写"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="hideFormData">取 消</el-button>
        <el-button type="primary" @click="dataAdd">确 定</el-button>
      </span>
    </el-dialog>
</template>

<script src="../../components/js/DeviceTranscodingManage"></script>
