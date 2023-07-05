<template>
<div class="upload-file">
    <div 
        v-if="url"
        @click="downLoad"
        >
        <i 
        style="cursor: pointer;"
        class="el-icon-paperclip"
        ></i>
    </div>
     <el-upload
            ref="upload"
            class="upload-demo"
            :action="`${BASECONFIG.API_BASE_URL}/device/transcodings/`"
            multiple
            :auto-upload="false"
            :on-change="changeFile"
            :show-file-list="url ? false: true"
            >
            <div class="upload-opt">
                <el-button v-if="url">
                    重新上传
                </el-button>
                 <span v-else>上传</span>
            </div>
        </el-upload>
</div>    
</template>
<script>
export default {
    props: {
        url: String,
        borrowId: String
    },
    data(){
        return {
        }
    },
    methods: {
        confirmUpload(){
            this.$refs.upload.submit();
        },
        changeFile(file, fileList){
            let suffix = file.name.split('.')[1];
            this.$api.getOssAuthInfo({
                ossId: 2,
                suffix: suffix
            }).then(res => {
                let head = res.data.header,
                    requestType = res.data.method,
                    url = res.data.url;
                let blob = new Blob([file.raw]);
                this.$http
                .put(url, blob, { headers: head })
                .then((res1) => {
                    if (res1 && res1.status == 200) {
                        this.$message({
                            message: "文件上传成功!",
                            type: "success",
                        });
                        if(this.url){
                            this.$api.reUploadBorrowFile({
                                borrowId: this.borrowId,
                                attachmentOssUrl: res.data.attachmentOssUrl
                            }).then(res2 => {
                                if(res2.code !== 200){
                                    this.$message.error(res2.message);
                                }
                            })
                        }else {
                            this.$emit('after-upload-oss', res.data.attachmentOssUrl)
                        }
                    }
                })
                .catch((res) => {
                });   
            })
        },
        downLoad(){
            this.$api.downOssFile({
                borrowId: this.borrowId,
                ossId: 2
            }).then(res => {
                if(res.code !== 200){
                    this.$message.error(res.message);
                    return;
                }
                window.open(res.data);
            })
        }
    }
}
</script>
<style lang="less">
.upload-file {
    display: flex;
    .upload-demo {
        .el-button {
            margin-top: 4px;
            margin-left: 4px;
        }
    }
}

</style>