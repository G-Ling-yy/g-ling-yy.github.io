<template>
<div class="upload-pri upload-but">
    <!-- <div upload-pri-btn v-if="isViewMode" @click="downLoadData">
        {{value ? '导出对接参数' : ''}}
    </div> -->
     <el-upload
            ref="upload"
            class="upload-demo"
            :action="`${BASECONFIG.API_BASE_URL}/device/platforms/` +
        config.transcodingId +
        '/privateKey'"
            multiple
            :limit="1"
            accept=".pem, .key, .txt"
            :headers="uploadHeaders"
            :file-list="fileList"
            :show-file-list = "false"
            :on-success="uploadSuccess"
            >
             <div  class="upload-opt upload-but"> 
                上传
            </div>
        </el-upload>
        <span v-show="config.hasPrivateKey === 1">已上传私钥</span>
</div>    
      
</template>
<script>
import store from '../../store';
import axios from 'axios';
export default {
    props: ['config', 'isViewMode', 'value'],
    data(){
        let uploadHeaders = {
            Authorization: store.state.userInfo ? store.state.userInfo.Authorization : ''
        }
        return {
            uploadHeaders,
            fileList: [],
            dialogVisible: false
        }
    },
    methods: {
        confirmUpload(){
            this.$refs.upload.submit();
        },
        uploadSuccess(res){
            if(res.code === 200){
                this.dialogVisible = false;
                this.$message.success('上传成功！')
            }else {
                this.$message({
                    type: 'error',
                    message: res.msg || '上传失败'
                })
            }
        },
        uploadFile(){
        },
        showUploadDialog(){
            this.dialogVisible = true;
        },
        async downLoadData() {
            var instructionsAdd = {
                module: "接入中心",
                page: "上云网关管理",
                feature: "导出对接参数数据",
                description: "上云网关管理的导出对接参数数据",
            };
            axios
                .get(
                "`${BASECONFIG.API_BASE_URL}/device/platforms/download/`" +
                this.config.transcodingId + "/accessorInfo",
                {
                    headers: {
                    'Content-Type': 'application/json',
                    ...this.uploadHeaders
                    },
                    responseType: 'blob'
                }
                )
                .then((res) => {
                    var blob = new Blob([res.data], { type: "application/vnd.ms-excel" }); // type这里表示xlsx类型
                    var downloadElement = document.createElement("a");
                    var href = window.URL.createObjectURL(res.data); // 创建下载的链接
                    downloadElement.href = href;
                    downloadElement.download = "对接信息表.xlsx"; // 下载后文件名

                    document.body.appendChild(downloadElement);
                    downloadElement.click(); // 点击下载
                    // document.body.removeChild(downloadElement); // 下载完成移除元素
                    // window.URL.revokeObjectURL(href); // 释放掉blob对象
                })
                .catch(function (error) {
                    this.$message.error(error);
                });
            
            },
    }
}
</script>
<style lang="less">
.upload-pri {
    .upload-pri-btn {
        color: #7995D2;
        cursor: pointer;
    }
}
.upload-dialog {
    .el-dialog__footer {
        text-align: left;
    }
    .dialog-header {
        display: flex;
        color: #2A3140;
        font-size: 15px;
        font-weight: bold;
    }
    .upload-demo {
        .upload-opt {
            display: flex;
            align-items: center;
            color: #409EFF;
            // span {
            //     color: #8C93A2;
            // }
            img {
                margin-right: 16px;
            }
        } 
    }
}
.upload-but {
    color: #1274ee;
     cursor: pointer;
        span {
            color: #000;
            cursor: default;
        }
}

</style>