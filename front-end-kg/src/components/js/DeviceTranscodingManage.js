import api from "@/api";
import Base64 from "../../tools/base64";
import store from '../../store';
import axios from 'axios';
import transcodingDetail from '../../components/controlPlatform/transcodingDetail';
import journalAbutment from '../controlPlatform/journalAbutment.vue';
import editTable from '../editTable.vue';
import configModal from '../controlPlatform/ConfigModal.vue' //配置弹窗
export default {
  components: { transcodingDetail, editTable, journalAbutment ,configModal},
  data() {
    var checkPhone = (rule, value, callback) => {
      const phoneReg = /^1[34578]\d{9}$$/
      if (!value) {
        return callback(new Error('电话号码不能为空'))
      }
      setTimeout(() => {
        // Number.isInteger是es6验证数字是否为整数的方法,实际输入的数字总是识别成字符串
        // 所以在前面加了一个+实现隐式转换
   
        if (!Number.isInteger(+value)) {
          callback(new Error('请输入数字值'))
        } else {
          if (phoneReg.test(value)) {
            callback()
          } else {
            callback(new Error('电话号码格式不正确'))
          }
        }
      }, 100)
    }
    var checkEmail = (rule, value, callback) => {
      const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
      if (!value) {
        return callback(new Error('邮箱不能为空'))
      }
      setTimeout(() => {
        if (mailReg.test(value)) {
          callback()
        } else {
          callback(new Error('请输入正确的邮箱格式'))
        }
      }, 100)
    }
    let Authorization = store.state.userInfo
      ? store.state.userInfo.Authorization : '';
      console.log(Authorization,"AuthorizationAuthorization")
    return {
      rules: {
        contactPhone: [
          { validator: checkPhone, trigger: 'blur' }
        ],
        buyerEmail: [
          { validator: checkEmail, trigger: 'blur' }
        ]
      },
      dialogTableVisible:false, // 对接日志对话框
      // journalDataRow: {}, // 当前列表对接日志详情
      showTranscodeDetail: false,
      selectedTran: {},
      uploadHeaders: {
        Authorization: Authorization
      },
      isAllHeight: 0,
      dataVal: "",
      province: "", //省
      jurisdictionValue: "", //单位
      downvendor: "", //设备厂商
      options: [], //所属省
      options1: [], //单位
      options2: [], //设备厂商
      options3: [], // 流媒体
      definitionList:[],
      activeNames: "",
      listData: [],
      cameraList: [], //摄像机数据
      flow: "",
      isActive: "",
      temp: false,
      dialogVisible: false,
      //新增/修改
      dialogTitle: "",
      details: false,
      orgCodeProps: {
        //lazy: true,
        expandTrigger: "hover",
        value: "organizationId",
        label: "organizationName",
        children: "childList",
        checkStrictly: true,
        //lazyLoad:this.propsLazyload
      },
      isState: "",
      uinfo:{
        regionCode: JSON.parse(localStorage.getItem("cloudplatform")).regionCode,
      },
      formData: {
        contactPhone:"",
        // regionCode: JSON.parse(localStorage.getItem("cloudplatform")).regionCode.toString(),
        regionCode:'',
        organizationName: "",
        organizationId: "",
        smId: "",
        softVersion:'',
        vendorCode: "",
        vendorName: "",
        authToken: "",
        ipAddress: "",
        responsiblePerson: "",
        phone: "",
        channelNum: "",
        deviceCode: "",
        deviceUser: "",
        urlHeader: ""
      },
      getUrlHeader: 'Http://',
      vendorNameview: "",
      state: [
        {
          name: "在线",
          code: "1",
        },
        {
          name: "离线",
          code: "0",
        },
      ],
      fileList: [],
      // 修改时禁用
      modification: false,
      // 禁用省份
      modificationProvince: false,
      // 重新上传的transcodingId
      transcodingId: "",
      transcodingName: "",
      addAndmodify: "add",
      currentItem: {},
      errorDatalist: [],
      Obj: {
        regionName: "省份",
        organizationName: "所属公司",
        channelNum: "最大接入量",
        streamName: "所属流媒体",
        vendorName: "设备厂商",
        ipAddress: "访问地址",
        deviceCode: "设备端号",
        deviceUser: "User",
        authToken: "设备Token",
        responsiblePerson: "联系人",
        phone: "电话",
      },
      organizationId: null,
      cameraListPageSize: 10,
      cameraListCurrentPage: 1,
      // 摄像机详情的总条数
      cameraListTotal: null,
      uploadPrivateKeyAction: '',
      transcodingTotal: 0,
      transcodingPageSize: 12,
      transcodingCurrentPage: 1,
      batchWrongData: [],
      batchWrongColumns: [{
        title: "省份",
        key: 'regionName',
        editType: 'input',
        width: 200
      }, {
        title: "管辖单位",
        key: 'organizationName',
        editType: 'input',
        width: 200
      }, {
        title: "路公司",
        key: 'departmentName',
        editType: 'input',
        width: 200
      }, {
        title: "最大接入量",
        key: 'channelNum',
        editType: 'input',
        width: 100
      }, {
        title: "所属流媒体",
        key: 'smName',
        editType: 'input',
        width: 200,
      }, {
        title: "设备厂商",
        key: 'vendorName',
        editType: 'input',
        width: 100
      }, {
        title: "访问地址",
        key: 'urlAddress',
        editType: 'input',
        width: 100
      }, {
        title: "设备编号",
        key: 'deviceCode',
        editType: 'input',
        width: 100
      }, {
        title: "User",
        key: 'deviceUser',
        editType: 'input',
        width: 100
      }, {
        title: "设备Token",
        key: 'deviceToken',
        editType: 'input',
        width: 100
      }, {
        title: "联系人",
        key: 'contactPerson',
        editType: 'input',
        width: 100
      }, {
        title: "联系电话",
        key: 'contactPhone',
        editType: 'input',
        width: 100
      }],
      tip: {
        success: 0
      },
      urlHeader: 'Http://',
      isConfigModalShow: false // 配置弹窗显隐
    };
  },
  watch: {
    // 关闭弹出框清空form数据
    dialogVisible(res) {
      if (!res) {
        this.emptyFormData();
      }
    },
  },
  methods: {
    //       hanldeData(value) {
    //   let startTime = new Date(value[0]).getTime().toString();
    //   let endTime = (new Date(value[1]).getTime()+24*60*60*1000-1).toString();
    //   let start = startTime.substring(0, 10);
    //   let end = endTime.substring(0, 10);
    // },
    handleSizeChange(newSize) {
      this.cameraListPageSize = newSize;
      this.cameraListCurrentPage = 1;
      this.handleChange();
    },
    handleCurrentChange(newPage) {
      this.cameraListCurrentPage = newPage;
      this.handleChange();
    },
    handleSizeChange(newSize) {
      this.transcodingPageSize = newSize;
      this.transcodingCurrentPage = 1;
      this.query();
    },
    handleCurrentChange(newPage) {
      this.transcodingCurrentPage = newPage;
      this.query();
    },
    // 查看更多
    seachMore() {
      this.isAllHeight++;
    },
    //重置
    removeQuery() {
      this.province = "";
      this.jurisdictionValue = "";
      this.organizationId = "";
      this.isState = "";
      this.downvendor = "";
      this.listData = [];
      this.cameraList = [];
      this.transcodingName = "";
      this.transcodingCurrentPage = 1;
      this.query();
    },
    clearDialogForm() {
      // this.emptyFormData();
      // if (this.$refs.Secretupload) this.$refs.Secretupload.clearFiles();
      // if (this.$refs.upload) this.$refs.upload.clearFiles();
    },
    
    /**
     * 新增按钮点击事件
     * @param {*} command 
     */
    handleCommand(command) {
      this.modification = false;
      this.addAndmodify = "add";
      this.vendorNameview = "";
      this.formData.organizationName = "";
      this.urlHeader = "Http://";
      
      if (command === 1) {
        this.dialogTitle = "新增";
        this.dialogVisible = true;
        this.modificationProvince =  JSON.parse(localStorage.getItem("cloudplatform")).regionCode=== 100000 ? false : true ;
       
      } else if (command === 2) {
        this.temp = true;
      }
    },

    // 批量新增自定义上传
    uploadFile(file) {

      this.formDate.append("file", file.file);
      // let fileObj = file.file
      // const form = new FormData()// FormData 对象
      // form.append('upload', fileObj);// 文件对象  'upload'是后台接收的参数名
    },
    // 上传秘钥自定义上传
    handlePreview(file) {

      this.formDate.append("file", file.file);
    },
    // 私钥长传文件改变
    keyuploadChange(id, bute) {
      let formData = new FormData();
      const file = this.$refs[bute][0].files;
      formData.append("file", file[0]);
      this.$http
        .post(
          "/device/transcoding/uploadPrivateKey/" + JSON.stringify(id),
          formData
        )
        .then((res) => {
          if (res.data.code == "200") {
            this.$message({
              message: "上传成功!",
              type: "success",
            });
            this.query();
          } else {
            this.$message({
              message: res.data.message,
              type: "warning",
            });
          }
        });
    },
    // 点击重新上传私钥
    getagainSecretKey(item) {
      this.transcodingId = item.transcodingId;
    },
    // 批量新增
    addData() {
      console.log('文件',this.$refs.upload.uploadFiles)
      if(this.$refs.upload.uploadFiles.length) {
        this.$refs.upload.submit();
      } else {
        this.$message.warning ('请先上传文件！');
      }
      
    },
    errorUpload (error, file, fileList) {
      this.$message({
        type: 'error',
        message: error.message
      })
    },
    beforeUpload (file) {
      let testmsg = file.name.substring(file.name.lastIndexOf('.')+1)
      let isImage = testmsg == 'xlsx' || testmsg == 'xls'
      if (!isImage) {
        this.$message.warning('上传文件只能是 xls、xlsx格式!');
        return false
      }
    },
    batchUpload(response, file, fileList) {
      if (response.code !== 200) {
        this.$message({
          type: 'error',
          message: response.message
        })
        return;
      }
      this.tip.success = response.data.success;
      if (response.data.error && response.data.error.length) {
        this.batchWrongData = response.data.error;
        // this.batchWrongColumns = response.data.error;
        _.each(this.batchWrongColumns, it => {
          if (it.key === 'regionName') {
            it.optionsList = _.map(this.options, v => {
              return {
                value: v.regionCode,
                label: v.regionName
              }
            });
          }
          if (it.key === 'organizationName') {
            it.optionsList = this.options1;
          }
          if (it.key === 'smName') {
            it.optionsList = _.map(this.options3, v => {
              return {
                value: v.smId,
                label: v.smName
              }
            });
          }
          if (it.key === 'vendorName') {
            it.optionsList = _.map(this.options2, v => {
              return {
                value: v.codeValue,
                label: v.codeName
              }
            });
          }
        })
        console.log(this.refs)
        this.$message({
          type: 'error',
          message: '文件存在问题,请重新上传'
        })
        this.fileList = []
        // this.$nextTick(() => {
        //   this.$refs.table.showConfirmTable(true);
        // })
      } else {
        this.$message({
          type: 'success',
          message: '成功上传' + response.data.success + '条'
        });
        this.temp = false
      }

      // this.$http
      //   .post("/device/transcodings/batch", {
      //   })
      //   .then((res) => {
      //     if (res.data.data.error.length) {
      //       this.details = true;
      //       this.errorDatalist = res.data.data.error;
      //       // for (let x in this.errorDatalist) {
      //       //     for (let y in this.errorDatalist[x].errData) {
      //       //       if(this.errorDatalist[x].errData[y] == null) {
      //       //         this.errorDatalist[x].errData[y] = ''
      //       //       }
      //       //         for (let z in this.errorDatalist[x].errorMsg) {
      //       //             if(y == z) {
      //       //               let string1 = this.errorDatalist[x].errData[y]
      //       //               let string2 = this.errorDatalist[x].errorMsg[z]
      //       //               this.errorDatalist[x].errData[y] = string1 + '*' + string2
      //       //             }
      //       //         }
      //       //     }
      //       // }
      //       return false;
      //     }
      //     if (res.data.status == "200") {
      //       this.$message({
      //         message: res.data.message,
      //         type: "success",
      //       });
      //       this.$refs.upload.clearFiles();
      //     }
      //   });
    },
    copyTXT(obj) {
      if (obj == null) {
        this.$message({
          message: "复制文本为空",
          type: "warning",
        });
        return;
      }
      var textBox = document.createElement("input");
      textBox.value = obj;
      document.body.appendChild(textBox);
      textBox.select();
      if (document.execCommand("copy")) {
        document.execCommand("copy");
        textBox.className = "textBox";
        textBox.style.display = "none";
        this.$message({
          message: "复制成功!",
          type: "success",
          duration: 1000,
        });
      }
    },

    // 点击修改数据img
    modificationQquipment(item) {
      this.currentItem = item;
      let vm = this;
      this.$http.get('/device/transcodings/' + item.transcodingId).then(res => {
        this.transcodingId = item.transcodingId;
        // this.transcodingName = item.transcodingName;
        this.addAndmodify = "modify";
        this.dialogTitle = "修改";
        this.formData = res.data.data;
        this.getUrlHeader = vm.formData.urlAddress.trim() ? vm.formData.urlAddress.split("//")[0] + "//" : "Http://";
        console.log(1111,this.getUrlHeader)
        this.formData.urlAddress = vm.formData.urlAddress.trim() ? vm.formData.urlAddress.split("//")[1] : "";
        this.vendorNameview = res.data.vendorName;
        this.modification = true;
        console.log("this.formData==>",this.formData)
        this.dialogVisible = true;
      })

      // this.formData.regionCode = item.


    },
    emptyFormData() {
      for (let key in this.formData) {
        this.formData[key] = "";
      }
      this.formData.regionCode=JSON.parse(localStorage.getItem("cloudplatform")).regionCode.toString()
    },
    hideFormData() {
      this.dialogVisible = false;
      this.modification = false;
      this.modificationProvince = false
      this.$refs.Secretupload && this.$refs.Secretupload.clearFiles();
      this.$refs.addForm.resetFields();
    },
    fliterData(data, value) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].smName == value) {
          return data[i];
        }
      }
    },
    fliterData2(data, value) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].codeName == value) {
          return data[i];
        }
      }
    },
    fliterData3(data, value) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].regionName == value) {
          return data[i];
        }
      }
    },
    // ------------------------------------------------------------------------
    //   获取全部数据
    async query() {
      // let jurisdictionValue = this.jurisdictionValue
      //   ? this.jurisdictionValue[this.jurisdictionValue.length - 1].split(
      //       "*"
      //     )[1]
      //   : "";
      var data = {
        regionCode: this.province,
        organizationId: this.jurisdictionValue[this.jurisdictionValue.length - 1],
        onlineStatus: this.isState,
        vendor: this.downvendor,
        isVirtual: "0",
        currPage: this.transcodingCurrentPage,
        pageSize: this.transcodingPageSize,
        transcodingName:this.transcodingName,
        // organizationId: this.organizationId,
      };
      const { data: res } = await this.$http.get(
        "/device/transcodings/list",
        {
          params: data
        }
      );
      //this.$message.success(res.message);
      this.transcodingTotal = res.total;
      console.log(this.transcodingTotal, "xddd");

      let vm = this;
      this.listData = _.map(res.data, it => {
        let region = _.find(vm.options, {
          regionCode: it.regionCode
        });
        let vendor = _.find(vm.options2, {
          codeValue: it.vendor
        });
        it.vendorName = vendor ? vendor.codeName : '';
        it.regionName = region ? region.regionName : '';
        return it;
      });
    },
    //摄像头展开
    async handleChange(transcodingId) {
      // 拿到总的条数
      var dta = `currPage=${this.cameraListCurrentPage}&pageSize=${this.cameraListPageSize}`;
      var data = {
        transcodingId: transcodingId,
      };
      const { data: res } = await this.$http.post(
        "/device/camera/list?" + dta,
        data
      );
      if (res.code !== 200) this.$message.error(res.message);
      this.cameraList = res.data;
      this.cameraListTotal = res.total;
    },
    queryList(){
      this.transcodingCurrentPage = 1;
      this.query();
    },
    // 开关流
    flowA(status, transcodingId, e, transcodingName) {
      var data = {
        status: status === 1 ? '0' : '-1'
      };
      let instructionsAdd = {
        module: "接入中心",
        page: "上云网关管理",
        feature: status ? "开流" : "关流",
        description: `${transcodingName}下所有摄像机一键推流`,
      };


      this.$confirm('是否决定开/关流?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        
        const { data: res } = await this.$http.put(
          "/device/transcodings/" + transcodingId + "/openCloseStream", {
          ...data,
        },
          {
            headers: {
              operateNote: Base64.encode(JSON.stringify(instructionsAdd)),
            },
          }
        );
        if (res.code == 200) {
          this.$message.success(e.target.innerText + "成功");
        } else {
          this.$message.error(res.message || e.target.innerText + "失败");
        }
        
        if (!_.isEmpty(res.data.errorList)) {
          let HTMLText = '';
          _.each(res.data.errorList, (v, k) => {
            HTMLText = HTMLText + "<p><span>" + k + ":</span><span>" + v + "</span></p>"
          })
          this.$alert(HTMLText, '警告', {
            dangerouslyUseHTMLString: true,
            type: 'error'
          })
        }
        if (!_.isEmpty(res.data.success)) {
          let len = 0;
          let errorList = res.data.errorList;
          _.each(res.data.success, (v, k) => {
            len++;
          })
          this.$message({
            message: len + "路摄像机操作成功" + errorList, //msg+'播放摄像机成功',
            type: "success"
          });
          let cameraList = this.tableList,
            olen = cameraList.length,
            nlen = itemList.length;
          for (let i = 0; i < nlen; i++) {
            for (let j = 0; j < olen; j++) {
              if (parseInt(cameraList[j].cameraId) === parseInt(itemList[i])) {
                cameraList[j].streamStatus = obj.data.status + "";
                break;
              }
            }
          }
        }
        
      })
      
    }, 
     // 开关流
     tallFlowA(status, transcodingId, e, transcodingName) {
      var data = {
        status: status === 1 ? '2' : '-3'
      };
      let cos = status ? "推高清流" : "停高清流"
      let instructionsAdd = {
        module: "接入中心",
        page: "上云网关管理",
        feature: cos,
        description: `${transcodingName}下所有摄像机一键${cos}`,
      };


      this.$confirm('是否决定推/停高清流?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        
        const { data: res } = await this.$http.put(
          "/device/transcodings/" + transcodingId + "/openCloseStream", {
          ...data,
        },
          {
            headers: {
              operateNote: Base64.encode(JSON.stringify(instructionsAdd)),
            },
          }
        );
        if (res.code == 200) {
          this.$message.success(e.target.innerText + "成功");
        } else {
          this.$message.error(res.message || e.target.innerText + "失败");
        }
        
        // if (!_.isEmpty(res.data.errorList)) {
        //   let HTMLText = '';
        //   _.each(res.data.errorList, (v, k) => {
        //     HTMLText = HTMLText + "<p><span>" + k + ":</span><span>" + v + "</span></p>"
        //   })
        //   this.$alert(HTMLText, '警告', {
        //     dangerouslyUseHTMLString: true,
        //     type: 'error'
        //   })
        // }
        // if (!_.isEmpty(res.data.success)) {
        //   let len = 0;
        //   let errorList = res.data.errorList;
        //   _.each(res.data.success, (v, k) => {
        //     len++;
        //   })
        //   this.$message({
        //     message: len + "路摄像机操作成功" + errorList, //msg+'播放摄像机成功',
        //     type: "success"
        //   });
        //   let cameraList = this.tableList,
        //     olen = cameraList.length,
        //     nlen = itemList.length;
        //   for (let i = 0; i < nlen; i++) {
        //     for (let j = 0; j < olen; j++) {
        //       if (parseInt(cameraList[j].cameraId) === parseInt(itemList[i])) {
        //         cameraList[j].streamStatus = obj.data.status + "";
        //         break;
        //       }
        //     }
        //   }
        // }
        
      })
      
    }, 
    // 开放
    async flowOpen(status, transcodingId, e, transcodingName) {
      const { data: res } = await this.$http.put(
        "/device/transcodings/" + transcodingId + "/openStatus", {
        status: status,
      }, {
        headers: {
          operateNote: Base64.encode(JSON.stringify({
            module: "接入中心",
            page: "上云网关管理",
            feature: status ? "开放" : "关闭",
            description: `${status ? `${transcodingName}下所有摄像机一键推流` : `${transcodingName}下所有摄像机一键停止推流`}`,
          })),
        },
      }
      );
      if (res.code == 200) {
        this.$message.success(e.target.innerText + "成功");
      } else {
        this.$message.error(res.message || e.target.innerText + "失败");
      }
    }, // 播放
    async play(status, transcodingId, e) {
      var data = "playStatus=" + status;
      const { data: res } = await this.$http.post(
        "/device/transcoding/updatePlayStatus/" + transcodingId + "?" + data
      );
      if (res.code == 200) {
        this.$message.success(e.target.innerText + "成功");
      } else {
        this.$message.error(res.message || e.target.innerText + "失败");
      }
    },
    //
    async toggleVisible(status, transcodingId, e) {
      const { data: res } = await this.$http.put(
        "/device/transcodings/" + transcodingId + "/displayStatus", {
        status: status,
        instructionsAdd: {
          module: "接入中心",
          page: "上云网关管理",
          feature: status ? "显示" : "隐藏",
          description: "上云网关管理的显示隐藏",
        }
      },
      );
      if (res.code == 200) {
        this.$message.success(e.target.innerText + "成功");
      } else {
        this.$message.error(res.message || e.target.innerText + "失败");
      }
    },
    /**
     * 摄像机导出
     */
    exportCameraList(item) {
      var params = {
        currPage: 1,
        pageSize: 10,
        transCodingId: item.transcodingId,
      };
      this.$api
        .exportCameraListAll(params)
        .then(data => {
          var downloadElement = document.createElement("a");
          var href = window.URL.createObjectURL(data); // 创建下载的链接
          downloadElement.href = href;
          downloadElement.download = item.transcodingName+".xlsx"; // 下载后文件名

          document.body.appendChild(downloadElement);
          downloadElement.click(); // 点击下载
          document.body.removeChild(downloadElement); // 下载完成移除元素
          window.URL.revokeObjectURL(href); // 释放掉blob对象
        })
        .catch(error => {
          this.$message({
            message: "对接信息导出失败! ",
            type: "error"
          });
        });
    },

    // 导出对接参数数据
    cameraExport(item) {
      var transcodingId = {
        transCodingId: item.transcodingId
      };
      this.$api
        .exportAccessorInfo(transcodingId)
        .then(data => {
          var downloadElement = document.createElement("a");
          var href = window.URL.createObjectURL(data); // 创建下载的链接
          downloadElement.href = href;
          downloadElement.download = item.transcodingName+".xlsx"; // 下载后文件名

          document.body.appendChild(downloadElement);
          downloadElement.click(); // 点击下载
          document.body.removeChild(downloadElement); // 下载完成移除元素
          window.URL.revokeObjectURL(href); // 释放掉blob对象
        })
        .catch(error => {
          this.$message({
            message: "对接信息导出失败! ",
            type: "error"
          });
        });
    },
    afterUploadPriva() {
      this.dialogVisible = false;
    },
    // 新增数据
    async dataAdd() {

      if (!this.formData.regionCode) {
        return this.$notify.error({
          title: "注意！",
          message: "请选择省份",
          duration: 1500,
        });
      }
      else if (!this.formData.organizationId && this.addAndmodify === 'add') {
        return this.$notify.error({
          title: "注意！",
          message: "请选择管辖单位",
          duration: 1500,
        });
      }
      else if (!this.formData.vendor) {
        return this.$notify.error({
          title: "注意！",
          message: "请选择设备厂商",
          duration: 1500,
        });
      } else if (!this.formData.channelNum) {
        return this.$notify.error({
          title: "注意！",
          message: "请输入最大接入量",
          duration: 1500,
        });
      }
      let organizationName = '';
      if (this.formData.organizationName) {
        organizationName = this.formData.organizationName
      } else {
        let checked = this.$refs.cascader.getCheckedNodes();
        let organization = _.find(checked, it => {
          return this.formData.organizationId === it.data.organizationId;
        });
        organizationName = organization ? organization.data.organizationName : 'test'
      }
      let vendorName = _.find(this.options2, {
        codeValue: this.formData.vendor
      }).codeName;

      var data = {
        ...this.formData,
        vendorName,
        organizationName,
        vendor: parseInt(this.formData.vendor),
        authTokenPeer: this.formData.deviceToken,
        deviceCodePeer: this.formData.deviceCode,
        platformCodePeer: this.formData.deviceUser,
        urlAddress: this.getUrlHeader + this.formData.urlAddress
      };

      let instructions = {
        module: "资源管理",
        page: "对接管理",
        feature: `${this.addAndmodify == "add" ? '新增' : '修改'}`,
        description: `${this.addAndmodify == "add" ? `新增` : `修改${this.transcodingName}`}`
      };
      console.log('参数',data)
      if (this.addAndmodify == "add") {
        const { data: res } = await this.$http.post(
          "/device/transcodings",
          data,
          {
            headers: {
              operateNote: Base64.encode(JSON.stringify(instructions)),
            },
          }
        );
        if (res.code === 200) {
          this.dialogVisible = false;
          this.$message.success("成功");
          this.transcodingId = res.data.transcodingId;
          this.transcodingName = res.data.transcodingName
          this.query();
          this.formDate = new FormData();
          setTimeout(() => {
            this.$refs.Secretupload.submit();
          }, 100);
        }
      } else {
        console.log("修改");
        console.log(this.formData);
        let vendorName = _.find(this.options2, {
          codeValue: this.formData.vendor
        }).codeName;
        let newData = {
          ...this.formData,
          vendor: this.formData.vendor,
          authTokenPeer: this.formData.deviceToken,
          deviceCodePeer: this.formData.deviceCode,
          platformCodePeer: this.formData.deviceUser,
          vendorName: vendorName,
          urlAddress: this.getUrlHeader + this.formData.urlAddress
        };

        // if (data.authToken) newData.authToken = data.authToken;

        this.$http
          .put("/device/transcodings/" + this.transcodingId, newData, {
            headers: {
              operateNote: Base64.encode(JSON.stringify(instructions)),
            },
          })
          .then((respon) => {
            let res = respon.data;
            this.dialogVisible = false;
            if (res.code === 200) {
              this.$message.success("修改成功!");
              this.query();
              this.$refs.Secretupload.submit();
              this.$refs.addForm.resetFields();
              this.emptyFormData();
              // this.query();
            } else {
              //this.$message.error(res.message);
              this.$message.error(
                "编辑上云网关失败！[" + res.code + "]:" + res.message
              );
            }
          });
      }

    },
    // 删除数据
    delData(transcodingId) {
      this.$confirm("提示", {
        title: "提示",
        message: "确定删除上云网关信息吗？",
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      }).then(() => {
        // var data = "transcodingId=" + transcodingId;
        this.$http
          .delete("/device/transcodings/" + transcodingId)
          .then((res) => {
            if (res.data.code == 200) {
              this.$message.success("删除成功");
              this.query();
            } else {
              this.$message.error(`${res.data.message}`);
            }
          });
      });
    },
    // 配置弹窗
    configureData(transcodingId) {
      console.log('transcodingId',transcodingId)
      this.checkedTranscodingId = transcodingId
      this.isConfigModalShow = true
    },

    //获取省下拉
    async downProvince() {
      const { data: res } = await this.$http.get("/base/regions/list?regionLevel=1");
      this.options = res.data;
    },
    // 获取管辖单位
    async downDw() {
      const { data: res } = await this.$http.get("/user/organization/tree");
      let newarr = [];
      this.treecl(res.data);
      let data = res.data[0].childList;
      this.options1 = _.map(data, it => {
        return {
          ...it,
          disabled: true
        }
      });
    },
    // 管辖单位改变
    organizationNameChange(val) {
      // this.formData.organizationName = res[res.length - 1].split('*')[0]
      if (val) {
        this.formData.organizationId = val[val.length - 1];
        // this.organizationId = val[val.length - 1];
      }
    },
    closeHandleChange(visible) {
      // if (!visible) {
      //   this.formData.organizationId =this.organizationId;
      //   console.log(this.formData.organizationId)
      // }
    },
    // 获取设备厂商
    async downVendor() {
      const { data: res } = await this.$http.get("/base/code-masters/list?codeType=VENDOR");
      this.options2 = res.data;
    },
    // 设备厂商改变
    vendorCodeChange(res) {
      this.formData.vendorName = res.split("*")[0];
      this.formData.vendorCode = res.split("*")[1];
    },
    // 获取流媒体
    async getStreamingMedia() {
      const { data: res } = await this.$http.get("/device/streamMedias/list", {
        params: {
          currPage: 0,
          pageSize: 0,
          smName:this.smName,
        }
      });
      this.options3 = res.data;
    },
    // 下载模板
    download() {
      this.$http
        .get("/device/transcodings/downloadTemplate", {
          responseType: 'blob'
        })
        .then(function (res) {
          if (!res) return;
          let blob = new Blob([res.data], {
            type: "application/vnd.ms-excel;charset=utf-8",
          });

          let url = window.URL.createObjectURL(blob);
          let aLink = document.createElement("a");
          aLink.style.display = "none";
          aLink.href = url;
          aLink.setAttribute("download", "视频上云网关信息表.xls");
          document.body.appendChild(aLink);
          aLink.click();
          document.body.removeChild(aLink);
          window.URL.revokeObjectURL(url);
        })
        .catch(function (error) {
          //   this.$message.error(error);
        });
    },
    loadCameraType() {
      var _this = this
      this.$api
        .getCodemaster({
          codeType: 'SOFTVERSION'
        })
        .then(data => {
          if (data.code == '200') {
            _this.definitionList = data.data
            console.log(_this.definitionList,'definitionList')
          }
        })
    },
    dockingLog(val){
      console.log('当前',val)
      // this.journalDataRow = val
      this.dialogTableVisible = true;
      this.$refs.journalAbutment.dockingLog(val, 1)
    },
    treecl(data) {
      for (let i in data) {
        data[i].value = data[i].organizationName + "*" + data[i].organizationId;
        if (data[i].childNode) {
        }
        this.treecl(data[i].childNode);
      }
    },
    toggleDetailVisible(item) {
      this.showTranscodeDetail = true;
      this.selectedTran = item;
    },
    confirmBatchData(data) {
      this.$http.post('/device/transcodings/batch', {
        transcodings: data
      }).then(res => {
        let data = res.data;
        if (data.code === 200) {
          if (data.data.error) {
            this.batchWrongData = data.data.error;
          } else {
            this.$refs.table.showConfirmTable(false);
            this.$message({
              message: '成功入库' + data.data.success + '条',
              type: 'success'
            });
          }
        } else {
          this.$message({
            message: data.data.message,
            type: 'error'
          })
        }
      })
    }
  },
  created() {
    this.query();
    this.downProvince();
    this.downDw();
    this.downVendor();
    this.getStreamingMedia();
  },
  mounted(){
    this.loadCameraType()
  }
};
