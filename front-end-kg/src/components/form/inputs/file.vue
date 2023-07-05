<template>
    <div>
        <div v-if="isTemplate">
            <el-button :disabled="true" type="text">选择文件</el-button>
        </div>
        <template v-if="config.file">
            <el-upload
                v-if="config.file.showType !== 'album' || !(config.readOnly || item.readOnly || readonly)"
                :file-list="fileList"
                :multiple="false"
                :limit="config.file.numberLimit"
                :on-success="handleFileSuccess"
                :on-preview="handlePictureCardPreview"
                :on-exceed="handleFileExceed"
                :on-remove="handleFileRemove"
                :before-remove="handleFileBeforeRemove"
                :before-upload="handleBeforeFileUpload"
                :with-credentials="true"
                :list-type="config.file.showType || 'picture-card'"
                :http-request="uploadFile"
                :class="{
                    'el-upload-readonly': config.readOnly || item.readOnly || readonly,
                    'el-upload-disabled-upload': config.file.numberLimit && fileList.length >= config.file.numberLimit
                }"
                action=""
            >
                <i
                    v-if="!readonly"
                    :disabled="config.file.numberLimit && fileList.length >= config.file.numberLimit"
                    class="el-icon-plus"
                    style="font-size: 34px;"
                ></i>
                <!--                <el-button-->
                <!--                    v-if="!readonly"-->
                <!--                    :disabled="config.file.numberLimit && fileList.length >= config.file.numberLimit"-->
                <!--                    size="small"-->
                <!--                    type="primary"-->
                <!--                    >点击上传-->
                <!--                </el-button>-->
                <div
                    v-if="
                        config.file.sizeLimit &&
                            !(config.file.numberLimit && fileList.length >= config.file.numberLimit)
                    "
                    slot="tip"
                    class="el-upload__tip"
                >
                    {{ prompt }}
                </div>
            </el-upload>
            <el-carousel
                v-if="config.file.showType === 'album'"
                ref="album"
                :height="config.file.album ? config.file.album.height + 'px' : ''"
                :autoplay="!!(config.file.album && config.file.album.autoPlay)"
                :interval="config.file.album && config.file.album.interval"
                :loop="true"
                :arrow="'always'"
                :direction="'horizontal'"
            >
                <el-carousel-item v-for="(item, index) in fileList" :key="index">
                    <el-image
                        :src="item.url"
                        :fit="(config.file.album && config.file.album.fit) || 'contain'"
                        style="width: 100%; height: 100%;"
                        @click.native="handlePictureCardPreview(item)"
                    >
                        <div slot="placeholder" class="image-slot">加载中<span class="dot">...</span></div>
                    </el-image>
                </el-carousel-item>
            </el-carousel>
        </template>

        <el-dialog :visible.sync="dialogVisible" :modal-append-to-body="false" :center="true">
            <div>
                <img v-if="dialogImageUrl" :src="dialogImageUrl" width="100%" alt="" />
                <div v-else class="no-message">暂不支持预览</div>
                <div style="text-align: center; margin-top: 10px">
                    <a :href="dialogImageDownloadUrl">
                        <el-button type="primary" plain>下载</el-button>
                    </a>
                </div>
            </div>
        </el-dialog>

        <template>
            <div style="display: none">
                <img
                    v-for="(item, index) in previewList"
                    :key="index"
                    :src="item.url"
                    :preview-text="item.name"
                    :download-url="item.downloadUrl"
                    :path="item.url"
                    :type="item.type"
                    :preview="item.id"
                    class="img-item"
                />
            </div>
        </template>
        <image-viewer :source="totalFile" :thumbnail-show="false" ref="imageViewer"></image-viewer>
    </div>
</template>

<script>
import { globalService } from '@/services/global';
const { getDownloadUrl, getPreviewUrl, getFileList, uploadFileInterface } = globalService;
import imageViewer from './imageViewer.vue';

export default {
    name: 'File',
    components: {
        imageViewer
    },
    props: {
        item: {
            type: Object,
            default: () => {
                return { ctrlType: null };
            }
        },
        readonly: {
            type: Boolean,
            default: false
        },
        isTemplate: {
            type: Boolean,
            default: false
        },
        bizId: {
            type: String
        },
        allFileInfo: Boolean() // true: 单独使用该组件的情况,保存所有上传后返回的值
    },
    data() {
        return {
            img: null,
            dialogVisible: false,
            dialogImageUrl: null,
            dialogImageDownloadUrl: null,
            fileList: [],
            fileIds: [],
            previewList: [],
            relationMap: null,
            config: {},
            totalFile: []
        };
    },
    computed: {
        prompt() {
            const prompt = this.config.prompt ? this.config.prompt + ',' : '';
            return prompt + '只能上传不超过' + this.getFileSizeText(this.config.file.sizeLimit) + '的文件';
        },
        source() {
            return this.totalFile.filter(it => it.mimeType.startsWith('image'));
        }
    },
    watch: {
        'item.config': {
            immediate: true,
            deep: true,
            handler() {
                this.config = this.item.config;
                if (!this.config || !this.config.file) {
                    this.config = {
                        file: {
                            showType: 'picture-card',
                            sizeLimit: (this.item.uploadSize || 1) * 1024 * 1024,
                            numberLimit: this.item.uploadNumber,
                            fileTypeLimit: this.item.uploadType,
                            prompt: this.item.prompt
                        }
                    };
                }
            }
        },
        bizId: {
            immediate: true,
            handler(nv) {
                if ((!this.fileIds || this.fileIds.length <= 0) && nv) {
                    getFileList(this.bizId, this.item.id).then(response => {
                        if (response.code === 200 && response.data.list.length > 0) {
                            response.data.list.forEach(file => {
                                this.fileIds.push(file.id);
                                file.name = file.originalName;
                                file.type = file.mimeType;
                                file.url = getPreviewUrl(file.id);
                                this.fileList.push(file);
                            });
                            this.$emit('file-change', this.item.name, this.fileIds);
                        }
                    });
                }
            }
        },
        fileList: {
            immediate: true,
            deep: true,
            handler(value) {
                const previewList = [];
                let url = null;
                (value || []).forEach(file => {
                    url = getPreviewUrl(file.id);
                    previewList.push({
                        url: url,
                        path: file.id,
                        downloadUrl: getDownloadUrl(file.id),
                        name: file.name,
                        type: file.mimeType
                    });
                });
                this.previewList = previewList;
                this.$previewRefresh();
            }
        }
    },
    methods: {
        handlePictureCardPreview(file) {
            console.log('this.totalFile:', this.totalFile);
            const index = this.totalFile.findIndex(it => it.id === file.response.id);
            if (index !== -1) {
                this.showBig(index);
            }
            // const $img = document.getElementsByClassName('img-item');
            // const e = document.createEvent('MouseEvents');
            // e.initEvent('click', true, true);
            // for (let i = 0; i < $img.length; i++) {
            //     const path = $img[i].getAttribute('path');
            //     if (file.url === path) {
            //         $img[i].dispatchEvent(e);
            //     }
            // }
        },
        handleFileSuccess(response, file, fileList) {
            this.totalFile.push(response);
            this.fileIds.push(response.id);

            if (this.allFileInfo) {
                this.$emit('file-change', this.item.name, this.totalFile);
            } else {
                this.$emit('file-change', this.item.name, this.fileIds);
            }
        },
        handleFileError() {
            this.$message.error('上传文件失败！');
        },
        handleFileBeforeRemove(file, fileList) {
            return new Promise((resolve, reject) => {
                this.$confirm(`确定移除 ${file.name}？`)
                    .then(() => {
                        this.$emit('loading', true);
                        resolve();
                    })
                    .catch(() => {
                        reject();
                    });
            });
        },
        handleFileExceed() {
            this.$message.error('仅支持上传' + this.item.fileNumberLimit + '个文件！');
        },
        handleFileRemove(file) {
            this.totalFile.splice(this.fileIds.indexOf(file.id), 1);
            this.fileIds.splice(this.fileIds.indexOf(file.id), 1);

            if (this.allFileInfo) {
                this.$emit('file-change', this.item.name, this.totalFile);
            } else {
                this.$emit('file-change', this.item.name, this.fileIds);
            }
        },
        getFileSizeText(size) {
            if (size < 1024) {
                return size + 'B';
            } else if (size < 1024 * 1024) {
                return (size / 1024).toFixed(2) + 'KB';
            } else if (size < 1024 * 1024 * 1024) {
                return (size / (1024 * 1024)).toFixed(2) + 'MB';
            } else {
                return (size / (1024 * 1024 * 1024)).toFixed(2) + 'GB';
            }
        },
        handleBeforeFileUpload(file) {
            if (this.config.file.sizeLimit) {
                if (file.size > this.config.file.sizeLimit) {
                    this.$message.error(
                        '文件过大，只允许上传不超过的' +
                            this.fileSizeLimitText +
                            '文件，当前文件达到了' +
                            this.getFileSizeText(file.size) +
                            '！'
                    );
                    return false;
                }
            }
            let enable = true;
            if (
                this.config.file.fileTypeLimit &&
                this.config.file.fileTypeLimit.length &&
                this.config.file.fileTypeLimit.indexOf('all') < 0
            ) {
                if (!file.type) {
                    this.$message.error('未知的文件类型，不允许上传！');
                    return false;
                }
                enable = false;
                if (file.type.indexOf('text/') >= 0) {
                    enable = this.config.file.fileTypeLimit.indexOf('text') >= 0;
                } else if (
                    [
                        'image/gif',
                        'image/png',
                        'image/jpg',
                        'image/jpeg',
                        'image/bmp',
                        'image/tiff',
                        'image/pipeg',
                        'image/ief'
                    ].indexOf(file.type) >= 0
                ) {
                    enable = this.config.file.fileTypeLimit.indexOf('image') >= 0;
                } else if (
                    file.type.indexOf('video/') >= 0 ||
                    ['flv-application/octet-stream'].indexOf(file.type) >= 0
                ) {
                    enable = this.config.file.fileTypeLimit.indexOf('video') >= 0;
                } else if (file.type.indexOf('audio/') >= 0) {
                    enable = this.config.file.fileTypeLimit.indexOf('audio') >= 0;
                } else if (
                    [
                        'application/msword',
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                    ].indexOf(file.type) >= 0
                ) {
                    enable = this.config.file.fileTypeLimit.indexOf('word') >= 0;
                } else if (
                    [
                        'application/x-excel',
                        'application/vnd.ms-excel',
                        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                    ].indexOf(file.type) >= 0
                ) {
                    enable = this.config.file.fileTypeLimit.indexOf('excel') >= 0;
                } else if (
                    [
                        'application/vnd.ms-powerpoint',
                        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                        'application/vnd.openxmlformats-officedocument.presentationml.slideshow'
                    ].indexOf(file.type) >= 0
                ) {
                    enable = this.config.file.fileTypeLimit.indexOf('ppt') >= 0;
                } else if (['application/pdf'].indexOf(file.type) >= 0) {
                    enable = this.config.file.fileTypeLimit.indexOf('pdf') >= 0;
                } else if (
                    [
                        'application/x-gzip',
                        'application/zip',
                        'application/x-compress',
                        'application/x-compressed',
                        'application/x-gtar'
                    ].indexOf(file.type) >= 0
                ) {
                    enable = this.config.file.fileTypeLimit.indexOf('zip') >= 0;
                } else if (['application/rar'].indexOf(file.type) >= 0) {
                    enable = this.config.file.fileTypeLimit.indexOf('rar') >= 0;
                } else {
                    enable = this.config.file.fileTypeLimit.indexOf(file.type) >= 0;
                }
            }
            if (!enable) {
                this.$message.error('不允许的文件格式！' + file.type);
                console.warn('不允许的文件格式！', file, file.type);
            }
            return enable;
        },
        uploadFile(param) {
            const formData = new FormData();
            formData.append('file', param.file);
            formData.append('formula', this.item.format);
            this.$emit('loading', true);
            uploadFileInterface(formData)
                .then(response => {
                    this.$emit('loading', false);
                    if (response.code === 200) {
                        param.onSuccess(response.data);
                    } else {
                        param.onError();
                    }
                })
                .catch(response => {
                    this.$emit('loading', false);
                    console.error('文件上传失败', response);
                    param.onError();
                });
        },
        showBig(index) {
            this.$refs.imageViewer.viewImage(index);
        }
    }
};
</script>

<style lang="scss">
.el-upload-list--picture-card .el-upload-list__item {
    width: 100px !important;
    height: 100px !important;
}

.el-upload--picture-card {
    width: 100px !important;
    height: 100px !important;
    line-height: 100px !important;
}
</style>
