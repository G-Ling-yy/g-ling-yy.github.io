<template>
    <!--地图容器-->
    <div class="traffic-map-box" style="height:100%;width:100%;">
        <!--<video-player ref="videoPlayer" :playsinline="true" :options="playerOptions" class="video-player vjs-custom-skin"
                      @ready="playerReadied"></video-player> :current-camera="currentPlayCamera"  @camera-zoom-change="cameraZoomChange"-->
        <div id="mapcontainer" style="height:100%;width:100%;overflow: visible;"></div>
        <amap-player ref="amapPlayer" :visible.sync="cameraMarkVisable"></amap-player>

        <div class="map-zoom-wrap">
            地图层级: <span>{{currentMapZoom}}</span>
        </div>

    </div>
</template>

<script src="./TrafficAmap.js"></script>

<style lang="less">

    /**
     * 定义my-hover-title
     */
    .amap-ui-pointsimplifier-container .overlay-title.my-hover-title {
        font-size: 14px;
        line-height: 200%;
        color: rgba(255, 255, 255, 0.8);
        padding: 0 10px;
        /*background-color: rgba(14, 45, 51, 0.8);
        border:1px solid rgba(34, 135, 151, 0.61);*/

        &.top:before{
            bottom:-10px;
            border-top-color: rgba(14, 45, 51, 0.8)
        }
        &.top:after{
            bottom:-9px;
            left:0;
            right:0;
            border-top-color:rgba(14, 45, 51, 0.8)
        }
    }

    /**
     * marker点定义my-hover-title
     */
    .bottom-center.amap-info-contentContainer{

        >.amap-info-content.amap-info-outer{
            font-size: 14px;
            line-height: 200%;
            color: rgba(255, 255, 255, 0.8);
            padding: 0 10px;
            /*background-color: rgba(14, 45, 51, 0.8);
            border:1px solid rgba(34, 135, 151, 0.61);*/
          background: #2261b1;
          border:1px solid #3aa8f3;
          box-shadow: inset 0 0 4px 0 #3aa8f3;

            >.amap-info-close{
                display: none;
            }
        }

        >.amap-info-sharp{
            border-top: 6px solid #3aa8f3;
            margin-left: -6px;
            border-left: 6px solid transparent;
            border-right: 6px solid transparent;
            bottom: 3px
        }
    }

    #loadingTip {
        position: absolute;
        z-index: 9999;
        top: 0;
        left: 0;
        padding: 3px 10px;
        background: red;
        color: #fff;
        font-size: 14px;
    }
    .tipMarker{
        color:#fff;
        background-color: rgba(20, 126, 161, 0.68);
        border:1px solid rgba(50, 203, 224, 0.61);
        border-radius: 4px;
        padding:4px 20px;
        font-size:14px;
        white-space:nowrap;
        display:inline-block;
        &:before,
        &:after{
            content:'';
            display:block;
            position:absolute;
            margin:auto;
            width:0;
            height:0;
            border:solid transparent;
            border-width:5px 5px;
        }
        &.top{
            transform:translate(-50%,-110%);
            &:before,
            &:after{
                bottom:-10px;
                left:0;
                right:0;
                border-top-color:#32cbe0;
            }
            &:before{
                bottom:-10px;
                border-top-color:#32cbe0;
            }
        }
    }

    .amap-icon{ overflow: visible !important;}

    .traffic-map-box{
        background-image: url("../../assets/images/traffic_map/map_bg.png");
        background-repeat: repeat;
        background-size: auto 120%;
        background-position: center;
        position:relative;
    }

    #mapcontainer{
        overflow: visible;
        .amap-maps {
            overflow: visible;
        }
        .amap-drags {
            overflow: visible;
        }
    }

    .amap-markers{
        z-index: 301 !important;
    }

    .map-zoom-wrap{
        position: absolute;
        bottom: 20px;
        right: 450px;
        color: #FFFFFF;
        font-size: 12px;
        line-height: 28px;
        span{
            font-size: 16px;
            min-width:28px;
            height: 28px;
            display: inline-block;
            padding: 0 5px;
            border-radius: 4px;
            color:#fff;
            background: linear-gradient(#0989b2,#0b345f , #084d96);
            text-align: center;
            border: 1px solid #16a1d7;
        }
    }


</style>
