<template>
    <div>
        <div id="camera-info-window-view" v-show="visible">
            <div id="camera-info-window" class="camera-info-window" @mousedown="mousedown($event,'camera-info-window-view')">
                <div class="info-window-control">
                    <i class="el-icon-close"  @click="dialogClose"></i>
                </div>
                <el-tabs type="card"  v-model="tabsActiveName"  class="player-dialog-tabs" @tab-click="tabsActiveClick" >
                    <el-tab-pane label="视频" name="video-tab">
                        <!-- 播放器 -->
                        <div class="info-window-wrapper">
                            <!--<div class="info-window-top-right"></div>-->
                            <div class="info-window-bottom-left"></div>
                            <div class="info-window-body">
                                <div class="camera-image" >
                                    <!--<flv-player ref="flvPlay" video-type="flv"></flv-player>-->
                                    <flv-player ref="flvPlay" v-if="usePlayerType === 'flv' && !isThreePlayer && !isAliPlayer" video-type="flv"></flv-player>
                                    <!--<ck-player ref="ckVideo" v-if="usePlayerType === 'ck'"></ck-player>-->
                                    <three-player ref="threePlay" v-if="usePlayerType === 'flv' && isThreePlayer && !isAliPlayer" video-type="flv"></three-player>
                                </div>
                                <div class="camera-content" v-show="currentCamera">
                                    <div class="camera-title">
                                        <el-tooltip class="item" effect="dark" :content="currentCamera.cameraNameStr" placement="top-start"
                                                    :disabled="currentCamera.cameraNameStr && currentCamera.cameraNameStr.length < 50">
                                            <!--&nbsp;防止页面初始化，内容为空时dom元素不占高度-->
                                            <div><span><i :class="['','online','error'][1]"></i> {{currentCamera.cameraNameStr}}</span></div>
                                        </el-tooltip>
                                    </div>
                                    <div class="camera-controls clearfix">
                                        <span @click="showImageWrapper">截图</span>
                                        <!--<template v-if="!isThreePlayer">
                                            <span @click="resolutionChange('30')" v-if="resolutionValue==='20'">高清</span>
                                            <span @click="resolutionChange('20')" v-else>标清</span>
                                        </template>-->
                                        <span class="camera-custom-button hd-btn" v-if="!isThreePlayer"
                                              :class="resolutionValue==='30' ? 'active' : ''"
                                              @click="resolutionChange(resolutionValue==='20' ? '30' : '20')"></span>
                                        <span class="camera-custom-button full-btn"
                                              v-if="usePlayerType === 'flv' && !isThreePlayer" @click="playerFullScreen"></span>

                                        <span class="camera-custom-button el-icon-caret-top"
                                              v-if="!infoWindowContentCollapse"
                                              @click="infoWindowContentCollapse = true"></span>
                                        <span class="camera-custom-button el-icon-caret-bottom"
                                              v-else
                                              @click="infoWindowContentCollapse = false"></span>
                                    </div>
                                </div>
                            </div>

                            <div class="info-window-content animated fadeIn" v-if="!infoWindowContentCollapse">
                                <el-form ref="cameraInfoForm" class="camera-info-form" :rules="addFormRules"
                                         :model="cameraInfoForm" label-width="90px" size="mini" label-position="left">
                                    <el-form-item label="所在行政区">
                                        <span class="form-item-text">{{ cameraInfoForm.provinceName }}</span>
                                    </el-form-item>
                                    <el-form-item label="管辖单位">
                                        <span class="form-item-text">{{ cameraInfoForm.organizationName }}</span>
                                    </el-form-item>

                                    <div class="divider-horizontal"></div>

                                    <el-form-item label="摄像机名称">
                                        <el-input v-model="cameraInfoForm.cameraName"></el-input>
                                    </el-form-item>
                                    <el-form-item label="路线">
                                        <el-select v-model="cameraInfoForm.roadId" placeholder="请选择路线" popper-class="camera-info-popper"  style="width:170px;">
                                            <el-option v-for="item in roadList" :label="item.roadName" :value="item.roadCode"></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="摄像机桩号">
                                        <!--<el-input v-model="cameraInfoForm.pile"></el-input>-->
                                        <el-input-number v-model="cameraInfoForm.cameraKmpile" :controls="false" :min="0" style="width:60px;"></el-input-number>&nbsp;km&nbsp;
                                        <!--<el-input v-model="addForm.cameraHmpile"></el-input>-->
                                        <el-input-number v-model="cameraInfoForm.cameraHmpile" :controls="false" :min="0" style="width:60px;"></el-input-number>&nbsp;m
                                    </el-form-item>
                                    <el-form-item label="摄像机方向">
                                        <el-radio-group v-model="cameraInfoForm.derection">
                                            <el-radio v-for="(item,key) in derectionList" :key="key" :label="item.codeValue">{{item.codeName}}</el-radio>
                                        </el-radio-group>
                                        <!--<el-select v-model="cameraInfoForm.derection" placeholder="请选择摄像机方向" popper-class="camera-info-popper">
                                            <el-option v-for="item in derectionList" :label="item.codeName" :value="item.codeValue"></el-option>
                                        </el-select>-->
                                    </el-form-item>
                                    <el-form-item label="所属类别">
                                        <el-select v-model="cameraInfoForm.classify" placeholder="请选择所属类别" popper-class="camera-info-popper" style="width:170px;">
                                            <el-option v-for="item in classIfyList" :label="item.codeName" :value="item.codeValue"></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <div class="divider-horizontal"></div>
                                    <el-form-item label="起始图层">
                                        <el-input-number v-model="cameraInfoForm.maplevelStart" controls-position="right" :min="1" :max="18" style="width:75px;"></el-input-number>
                                        <!--<el-input-number v-model="cameraInfoForm.maplevelEnd" controls-position="right" :min="1" :max="18" style="width:75px;position: absolute;right: 0px;top: 1px;}"></el-input-number>-->

                                    </el-form-item>
                                    <el-form-item label="经纬度">
                                        <el-input-number @change="lnglatChange(true)" v-model="cameraInfoForm.longitude" :controls="false" :min="1" :max="181"  style="width:120px;"></el-input-number>
                                        /
                                        <el-input-number @change="lnglatChange(true)" v-model="cameraInfoForm.latitude" :controls="false" :min="1" :max="91" style="width:120px;" ></el-input-number>
                                        <!--复位按钮-->
                                        <span class="camera-custom-button resetlnglat-btn" @click.stop="initializeDialogVisible = true"></span>
                                    </el-form-item>
                                    <el-form-item label="所在位置">
                                        <span class="form-item-text">{{geoCameraPath}}</span>
                                    </el-form-item>


                                    <el-row class="camera-info-buttons" :gutter="20">
                                        <el-col :span="12" :offset="6"  style="text-align: center">
                                            <span class="camera-custom-button submit-btn" @click="onInfoSubmit(true)"></span>
                                            <span class="camera-custom-button resetzoom-btn" @click.stop="resetDialogVisible=true"></span>
                                            <!--<el-button type="primary" @click="onInfoSubmit(true)" size="mini">提交</el-button>-->
                                        </el-col>
                                    </el-row>
                                </el-form>
                            </div>

                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="截图" name="images-tab">
                        <!--截图预览-->
                        <div class="info-window-wrapper camera-images-wrapper">
                            <div class="info-window-body">
                                <images-view ref="cameraImages"></images-view>
                            </div>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>

        <!--摄像头信息编辑 右击弹窗-->
        <div class="camera-info-window camera-alone-info" id="camera-info-edit-window-view" >
            <div class="info-window-wrapper camera-info-edit-wrapper" v-if="cameraInfoAlongEditVisable" >
                <div class="info-window-control">
                    <i class="el-icon-close" @click="cameraInfoAlongEditVisable = false"></i>
                </div>
                <div class="info-window-top-right"></div>
                <div class="info-window-bottom-left"></div>

                <div class="info-window-body">
                    <div class="info-window-title" @mousedown.self.stop="mousedown($event,'camera-info-edit-window-view')">摄像机详情编辑</div>
                    <div class="info-window-content">
                        <!--onValuesChange-->
                        <el-form ref="cameraInfoAlongForm" class="camera-info-form" :rules="addFormRules"
                                 :model="cameraInfoAlongForm" label-width="120px" size="mini" label-position="left">

                            <el-form-item label="所属地">
                                <span class="form-item-text">{{ cameraInfoAlongForm.provinceName }}</span>
                            </el-form-item>
                            <el-form-item label="名称">
                                <el-input v-model="cameraInfoAlongForm.cameraName" clearable></el-input>
                            </el-form-item>
                            <el-form-item label="状态">
                                <span class="form-item-text">{{ ['离线','在线','故障'][cameraInfoAlongForm.status] }}</span>
                            </el-form-item>
                            <el-form-item label="桩号">
                                <!--<el-input v-model="cameraInfoAlongForm.pile"></el-input>-->
                                <el-input-number v-model="cameraInfoAlongForm.cameraKmpile" :controls="false" :min="0" style="width:60px;"></el-input-number>&nbsp;km&nbsp;
                                <!--<el-input v-model="addForm.cameraHmpile"></el-input>-->
                                <el-input-number v-model="cameraInfoAlongForm.cameraHmpile" :controls="false" :min="0" style="width:60px;"></el-input-number>&nbsp;m
                            </el-form-item>
                            <el-form-item label="经度">
                                <el-input-number @change="lnglatChange()" v-model="cameraInfoAlongForm.longitude" :controls="false" :min="1" :max="181"  style="width:100%;"></el-input-number>
                            </el-form-item>
                            <el-form-item label="纬度">
                                <el-input-number @change="lnglatChange()" v-model="cameraInfoAlongForm.latitude" :controls="false" :min="1" :max="91" style="width:100%;" ></el-input-number>
                            </el-form-item>
                            <el-form-item label="图层(起~止)">
                                <el-input-number v-model="cameraInfoAlongForm.maplevelStart" controls-position="right" :min="1" :max="18" style="width:75px;"></el-input-number>
                                <el-input-number v-model="cameraInfoAlongForm.maplevelEnd" controls-position="right" :min="1" :max="18" style="width:75px;position: absolute;right: 0px;top: 1px;}"></el-input-number>
                            </el-form-item>
                            <el-form-item label="所属类别">
                                <el-select v-model="cameraInfoAlongForm.classify" placeholder="请选择所属类别" popper-class="camera-info-popper">
                                    <el-option v-for="item in classIfyList" :label="item.codeName" :value="item.codeValue"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="方向">
                                <el-select v-model="cameraInfoAlongForm.derection" placeholder="请选择摄像机方向" popper-class="camera-info-popper">
                                    <el-option v-for="item in derectionList" :label="item.codeName" :value="item.codeValue"></el-option>
                                </el-select>
                            </el-form-item>
                            <!--<el-form-item :label="'所属视频上云网关'">
                                <el-select v-model="cameraInfoAlongForm.transcodingId" placeholder="请选择所属视频上云网关" popper-class="camera-info-popper">
                                    <el-option v-for="trans in transcoding.transcodingList" :label="trans.transcodingName" :value="trans.transcodingId"></el-option>
                                </el-select>
                            </el-form-item>-->
                            <el-form-item label="管辖单位">
                                <span class="form-item-text">{{ cameraInfoAlongForm.organizationName }}</span>
                            </el-form-item>
                            <el-form-item label="路线">
                                <el-select v-model="cameraInfoAlongForm.roadId" placeholder="请选择路线" popper-class="camera-info-popper">
                                    <el-option v-for="item in roadList" :label="item.roadName" :value="item.roadCode"></el-option>
                                </el-select>
                                <span class="camera-icon-button" style="margin-right: 14px" @click.stop="editMaplevel()">图层初始化</span>
                                <span class="camera-icon-button" @click.stop="resetCameraLonLat()">复位</span>
                            </el-form-item>

                            <!--<el-form-item label="摄像机状态">
                                <el-radio-group v-model="cameraInfoForm.status" size="mini">
                                    <el-radio label="正常" value="" border></el-radio>
                                    <el-radio label="离线" border></el-radio>
                                    <el-radio label="故障" border></el-radio>
                                </el-radio-group>
                            </el-form-item>-->
                            <!--<el-form-item label="摄像机状态">
                                <el-radio-group v-model="cameraInfoForm.resource" size="mini">
                                    <el-radio-button label="正常"></el-radio-button>
                                    <el-radio-button label="离线"></el-radio-button>
                                    <el-radio-button label="故障"></el-radio-button>
                                </el-radio-group>
                            </el-form-item>-->
                            <!--<el-form-item label="起始图层">
                                <el-input v-model="cameraInfoForm.name"></el-input>
                            </el-form-item>-->


                            <el-row class="camera-info-buttons" :gutter="20">
                                <el-col :span="12">
                                    <el-button type="primary" @click="onInfoSubmit()" size="mini">确定</el-button>
                                </el-col>
                                <el-col :span="12">
                                    <el-button size="mini" @click="cameraInfoAlongEditVisable=false" >取消</el-button>
                                </el-col>
                            </el-row>
                        </el-form>
                    </div>
                </div>
            </div>
        </div>

        <el-dialog
            title="复位"
            :visible.sync="initializeDialogVisible"
            custom-class="map-custom-dialog"
            v-dialogDrag
            :append-to-body="true"
            :close-on-click-modal="false"
            width="300px">
            <span>复位后经纬度将恢复成摄像机上报的<br/>初始经纬度，<br/>确定要复位吗？</span>
            <span slot="footer" class="dialog-footer" style="text-align: center">
                <span class="camera-custom-button cancel-btn" @click="initializeDialogVisible = false"></span>
                <span class="camera-custom-button ok-btn" @click="resetCameraLonLat(true);initializeDialogVisible = false"></span>
            </span>
        </el-dialog>

        <el-dialog
            title="图层初始化"
            :visible.sync="resetDialogVisible"
            custom-class="map-custom-dialog"
            v-dialogDrag
            :append-to-body="true"
            :close-on-click-modal="false"
            width="375px">
            <span>初始化后同省/同管辖单位/同路线上的<br/>所有摄像机起始图层将被初始化为第5层，<br/>且经纬度恢复成上报的初始经纬度，<br/>请谨慎操作！</span>
            <div slot="footer" style="text-align: center">
                <span class="camera-custom-button cancel-btn" @click="resetDialogVisible = false"></span>
                <span class="camera-custom-button ok-btn" @click="editMaplevel(true);resetDialogVisible = false"></span>
            </div>
        </el-dialog>

    </div>

</template>


<script type="text/javascript" src="./AmapPlayerDialog.js"></script>

<style lang="less">
    @baseWidth:1920px;

    .pxfixWidth(@w){
        width:(@w/@baseWidth)*100vw;
    }

    @videoWrapWidth: 40vw;     //视图宽度


    #camera-info-window-view{
        position:absolute;
        top:50%;
        left:50%;
        z-index: 1000;
        /*transform: translate(-50%,-50%);*/
        /*width: @videoWrapWidth;*/
        .pxfixWidth(576);
    }
    .video-player {
        width: 100%;
        height: 100%;
        display: block;
        .video-js{
            width: 100%;
            height: 100%;
        }
    }

    .camera-custom-button{
        display: inline-block;
        height: 20px;
        width: 20px;
        line-height: 20px;
        text-align: center;
        float: left;
        color: #00baff;
        text-decoration: none;
        background-repeat: no-repeat;
        /*background-size: 100% 100%;
        background-position: center;*/
        background-size: auto 100%;
        background-position: center left;
        cursor: pointer;
        transition: all .2s;
        &.ok-btn{
            width: 80px;
            height: 48px;
            background-image: url("../../assets/images/traffic_map/newicon/ok.png");
            &:hover{
                background-image: url("../../assets/images/traffic_map/newicon/ok-active.png");
            }
        }
        &.cancel-btn{
            width: 80px;
            height: 48px;
            background-image: url("../../assets/images/traffic_map/newicon/cancel.png");
            &:hover{
                background-image: url("../../assets/images/traffic_map/newicon/cancel-active.png");
            }
        }
        &.submit-btn{
            width: 80px;
            height: 48px;
            background-image: url("../../assets/images/traffic_map/newicon/submit.png");
            &:hover{
                background-image: url("../../assets/images/traffic_map/newicon/submit-active.png");
            }
        }
        &.resetzoom-btn{
            width: 120px;
            height: 48px;
            background-image: url("../../assets/images/traffic_map/newicon/resetzoom.png");
            &:hover{
                background-image: url("../../assets/images/traffic_map/newicon/resetzoom-active.png");
            }
        }
        &.resetlnglat-btn{
            position: absolute;
            width: 32px;
            height: 32px;
            top: -3px;
            background-image: url("../../assets/images/traffic_map/newicon/resetlnglat.png");
            &:hover{
                background-image: url("../../assets/images/traffic_map/newicon/resetlnglat-active.png");
            }
        }
        &.hd-btn{
            width: 24px;
            height: 20px;
            background-size: 110% 126%;
            background-image: url("../../assets/images/traffic_map/newicon/hd.png");
            &:hover,&.active{
                background-image: url("../../assets/images/traffic_map/newicon/hd-active.png");
            }
        }
        &.full-btn{
            width: 20px;
            height: 20px;
            background-image: url("../../assets/images/traffic_map/newicon/fullscreen.png");
        }
    }

    .camera-info-window{
        position:relative;
        /*右上角关闭样式*/
        .info-window-control{
            position:absolute;
            top: 10px;
            right: 0px;
            height: 20px;
            width: 53px;
            font-size: 1.4rem;
            text-align: center;
            /*background: #1b3656;*/
            border-right: 1px solid #05a4e7;
            overflow:hidden;
            z-index: 2;

            i{
                color: #05a4e7;
                position: absolute;
                line-height: 20px;
                font-size: 1.2rem;
                z-index: 11;
                cursor: pointer;

                &:hover{
                    color: #05abf1;
                }

                &+i{ margin-right:5px;}
            }

            &:before{
                content:'';
                display:block;
                position:absolute;
                top:0;
                bottom:0;
                right:0;
                width: 50px;
                border:1px solid #007fc4;
                background: #162f5a;
                border-bottom: 0 none;
                border-right: 0 none;
                transform-origin:0 100%;
                transform:skewX(135deg);
            }
            &:after{
                clear:both;
            }

        }


        .player-dialog-tabs{
            .el-tabs__header{
                margin: 0;
                border-color: #04a3e8;
                .el-tabs__nav{
                    border-color: #04a3e8;
                    background: #0762ae;
                    .el-tabs__item{
                        border-color: #04a3e8;
                        color:#fff;
                        line-height: 28px;
                        height: auto;
                        &.is-active{
                            background: #142b5a;
                            border-bottom-color: #142b5a;
                        }
                    }
                }
            }
        }
        .info-window-wrapper{
            border:1px solid #04a3e8;
            border-top: 0 none;
            /*height:450px;
            width:800px;*/
            padding:10px;
            position:relative;
            /*display: none;*/
            background: #011251;
            box-shadow: inset 0 0 20px 9px rgba(36, 64, 97, 0.7);
            transition: all .6s;

            /*四角样式*/
            /*&::before{
                position:absolute;
                content:'';
                left:-1px;
                top:-1px;
                width:12px;
                height:12px;
                border-left: 1px solid rgb(145, 174, 240);
                border-top: 1px solid rgb(145, 174, 240);
            }
            &::after{
                position:absolute;
                content:'';
                right:-1px;
                bottom:-1px;
                width:12px;
                height:12px;
                border-bottom: 1px solid rgb(145, 174, 240);
                border-right: 1px solid rgb(145, 174, 240);
            }
            .info-window-top-right{
                position:absolute;
                right:-1px;
                top:-1px;
                width:12px;
                height:12px;
                border-top: 1px solid rgb(145, 174, 240);
                border-right: 1px solid rgb(145, 174, 240);
            }
            .info-window-bottom-left{
                position:absolute;
                left:-1px;
                bottom:-1px;
                width:12px;
                height:12px;
                border-bottom: 1px solid rgb(145, 174, 240);
                border-left: 1px solid rgb(145, 174, 240);
            }*/

            /*弹窗主体内容*/
            .info-window-body{
                .camera-image {
                    width: 100%;
                    /*保证宽高比16/9*/
                    height : ~"calc((@{videoWrapWidth} + 70px) / 16 * 9)";
                    img {
                        height:100%;
                        width:100%;
                    }
                }

                .camera-content {
                    overflow: hidden;
                    position:relative;
                    background: #0f4894;
                    padding:0 10px;

                    &::after {
                        content:'';
                        clear:both;
                    }

                    span {
                        cursor: pointer;
                        &:hover {
                            text-decoration: underline;
                        }
                    }

                    .camera-title {
                        /*float:left;*/
                        color:#fff;
                        line-height:30px;
                        margin-right: 120px;
                        display:block;

                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        /*overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;*/
                        span{
                            color: #FFF;
                            i{
                                display:inline-block;
                                width: 8px;
                                height: 8px;
                                background: #7a7a7a;
                                border-radius: 100%;
                                margin-right: 4px;
                                &.online{
                                    background: #1ae57a;
                                }
                                &.error{
                                    background: #ff3607;
                                }
                            }
                        }
                    }
                    .camera-controls {
                        /*float:right;
                        line-height:30px;*/
                        position:absolute;
                        right:10px;
                        top:5px;

                        span {
                            display: inline-block;
                            color: #2dc4ce;
                            &+span {
                                margin-left:10px;
                            }

                            &:last-child:hover{
                                border-radius: 2px;
                                background-color: #01b7fb;
                                color: #334a7b;
                                text-decoration: none;
                            }
                        }

                        .el-select{
                            width:auto;
                            .el-input{
                                width:auto;
                                .el-input__inner{
                                    padding: 0 10px;
                                    height: auto;
                                    background: transparent;
                                    color: #47d1de;
                                    border: 0 none;
                                    width: 60px;
                                    text-align: center;
                                    line-height: 16px;
                                    &:hover{
                                        text-decoration: underline;
                                    }
                                }
                                .el-input__suffix{
                                    display:none;
                                }
                            }
                        }
                    }
                }
            }

            /*弹窗标题*/
            .info-window-title{
                color:#fff;
                line-height:22px;
                margin-bottom:10px;
                position:relative;
                span{
                    display: inline-block;
                    position: absolute;
                    top: -2px;
                    line-height: 20px;
                    color: #fff;
                    padding: 2px 5px;
                    border: 1px solid #057fca;
                    background: #073f90;
                    font-size: .875rem;
                    margin-left: 20px;
                    cursor: pointer;
                    &:hover{
                        border: 1px solid #05a2e9;
                        background: #0e4188;
                    }
                }
            }

            .info-window-content{
                height: calc(100% - 32px);
                margin-top: 20px;
                transition: all .4s;
                .camera-info-form{
                    .el-form-item{
                        margin-bottom:8px;

                        .el-form-item__label{
                            color: #4b7ba0;
                            font-size: .85rem;
                            line-height: 22px;
                            text-align: right;
                        }

                        .el-form-item__content{
                            line-height:22px;
                            color:#7fa4ef;

                            .form-item-text{
                                color:#45ccda;
                                font-size: 12px;
                            }


                            .el-input{
                                .el-input__inner{
                                    border-radius: 0;
                                    background: transparent;
                                    border-color: rgb(13, 99, 155);
                                    color:#45ccda;
                                    height:22px;
                                    padding-left: 5px;
                                }

                                input::-webkit-input-placeholder, textarea::-webkit-input-placeholder {
                                    color: #246d75;
                                }

                                input:-moz-placeholder, textarea:-moz-placeholder {
                                    color: #246d75;
                                }

                                input::-moz-placeholder, textarea::-moz-placeholder {
                                    color: #246d75;
                                }

                                input:-ms-input-placeholder, textarea:-ms-input-placeholder {
                                    color: #246d75;
                                }

                                .el-input__icon{
                                    color: #05eaff;
                                    line-height: 22px;
                                }

                            }
                            .el-select{
                                width:100%;
                            }
                            /*.el-radio__label{
                                color:#45ccda;
                            }*/

                            .el-radio--mini.is-bordered{
                                padding: 4px 6px 0 4px;
                                height: 26px;
                                margin-bottom:4px;
                                margin-right: 4px;
                                border: 1px solid #6789ca;

                                &+.el-radio.is-bordered{
                                    margin-left: 0;
                                }
                                .el-radio__label{
                                    padding-left: 4px;
                                    color: #6789ca;
                                }

                                &.is-checked{
                                    border-color: #45ccda;
                                    .el-radio__label{
                                        color: #45ccda;
                                    }
                                    .el-radio__inner{
                                        border-color: #45ccda;
                                        background: #45ccda;
                                    }
                                }

                                .el-radio__inner{
                                    height: 10px;
                                    width: 10px;
                                }

                            }


                            >.el-input-number.is-controls-right{

                                .el-input-number__decrease, .el-input-number__increase{
                                    width: 20px;
                                    height: 12px;
                                    background-color: #6889ca;
                                    border: 0px solid;
                                    border-radius: 0px;

                                    >i{
                                        color: #FFFFFF;
                                    }

                                }

                                .el-input-number__increase{
                                    border-bottom: 1px solid #5970a7;
                                    height: 13px;
                                }

                                >.el-input{

                                    >.el-input__inner{
                                        padding-right:25px;
                                    }
                                }
                            }

                        }

                        .el-radio{
                            .el-radio__input{
                                .el-radio__inner{
                                    border-color: #0F6DA3;
                                    background: #0F6DA3;
                                    &:after{
                                        width: 8px;
                                        height: 8px;
                                        border-radius: 100%;
                                        background-color: #05EAFF;
                                    }
                                }

                                &.is-checked{
                                    .el-radio__inner{
                                        border-color: #084383;
                                        background: #0F6DA3;
                                    }
                                }
                            }
                            .el-radio__label{
                                color: #45ccda;
                            }
                        }


                    }

                    .camera-icon-button{
                        display: inline-block;
                        /*color: #45ccda;*/
                        color: #ffffff;
                        width: 83px;
                        text-align: center;
                        border: 1px solid #6889ca;
                        box-sizing: border-box;
                        font-size: 12px;
                        line-height: 22px;
                        background-color: #6889ca;
                        cursor: pointer;
                    }

                    .camera-info-buttons{
                        margin: 14px 0;
                    }
                }

                .divider-horizontal{
                    height:0;
                    margin:0 0  10px ;
                    border-bottom: 1px dashed #0d4e6d;
                }
            }

            &.camera-images-wrapper{
                .info-window-content{
                    position:relative;
                }
            }


            &.camera-info-wrapper{
                /*height:460px;*/
                width:300px;
                position:absolute;
                right:0;
                top:0;
                display:none;

                &.hasVisable{
                    display: block;
                    right:-320px;
                    /*top:230px;*/
                }

                .info-window-control{
                    top:5px;
                    width: 46px;
                    right: 5px;
                    border: 0 none;
                    &:before{
                        display:none;
                    }
                    i{
                        float: right;
                        position: static;
                    }
                }

                &+.camera-info-edit-wrapper{
                    top:-260px;
                }
            }

            &.camera-info-edit-wrapper{
                min-height:460px;
                width:300px;
                position:absolute;
                right:-340px;
                top:0;

                .info-window-control{
                    top:5px;
                    width: 24px;
                    border: 0 none;
                    &:before{
                        display:none;
                    }
                    i{
                        float: left;
                        position: static;
                    }
                }

            }

        }
    }

    .camera-alone-info{
        position: fixed;
        top: 90px;
        left: 350px;
    }

    .el-select-dropdown{
        &.resolution-popper{
            min-width:40px!important;
            background-color: rgba(17, 43, 77, 0.64);
            border: 0 none;
            border-radius: 0;
            .popper__arrow{
                transform: translate(-50%);
            }
            .el-select-dropdown__list{
                padding:0;
                li.el-select-dropdown__item{
                    padding: 0 15px;
                    &.hover, &:hover{
                        background-color: rgba(38, 149, 214, 0.6);
                        span{
                            color:rgb(71, 209, 222);
                        }
                    }

                    span{
                        color:rgba(57, 135, 191, 0.60);
                        font-size: .875rem;
                    }

                }
            }

            .popper__arrow{
                border-bottom-color:  rgba(17, 43, 77, 0.64);
                &:after{
                    border-bottom-color:  rgba(17, 43, 77, 0.64);
                }
            }
        }

        &.camera-info-popper{
            background-color: #011251;
            border: 1px solid #04a3e8;
            .el-select-dropdown__list{
                padding:0;
                li.el-select-dropdown__item{
                    padding: 0 15px;
                    &.hover, &:hover{
                        background-color: rgb(28, 60, 107);
                        span{
                            color:rgb(71, 209, 222);
                        }
                    }

                    span{
                        color:rgb(69, 204, 218);
                        font-size: .875rem;
                    }
                }
            }
            .popper__arrow{
                border-bottom-color:  #7698df;
                &:after{
                    border-bottom-color:  transparent;
                }
            }
            .popper__arrow::after{

            }
        }
    }

    .el-dialog__wrapper {
        .el-dialog.map-custom-dialog{
            background: rgba(0, 18, 86, 0.9);
            /*box-shadow: 0px 2px 20px 0px rgba(0, 0, 0, 0.5);*/
            box-shadow: inset 0px 2px 9px 0px rgb(1, 111, 180);
            .el-dialog__header{
                height: 30px;
                border-bottom-color: rgba(2, 14, 58, 0.9);
                .el-dialog__title{
                    color: #fff;
                    font-size: 1rem;
                    line-height: 30px;
                }
            }
            .el-dialog__body{
                text-align: center;
                padding: 20px 20px 0;
                span{
                    line-height: 30px;
                    color:#fff;
                }
            }
            .el-dialog__footer{
                padding: 10px 20px 20px !important;
            }
        }

    }

</style>
