<template>
    <div class="camera-images-body">
        <!--<template v-if="!cameraImagesLoading">
            <template v-if="deviceStatistics.cameraSnapShotsList.length > 0">

            </template>
            <loading message="暂无截图数据" loadingStatus="empty" v-else></loading>
        </template>
        <loading message="数据加载中..." v-else></loading>-->
        <div class="imgList">
            <div class="arrow-horizontal" @click="cameraCarouselArrowClick('prev')">
            <i class="el-icon-arrow-left"></i>
        </div>
        <div class="arrow-horizontal arrow-right" @click="cameraCarouselArrowClick('next')">
            <i class="el-icon-arrow-right"></i>
        </div>
        <div class="carousel-wrap">
            <div class="carousel-views" >
                <el-carousel ref="cameraCarouselView" height="340" v-if="deviceStatistics.cameraSnapShotsList.length"
                             trigger="click"
                             :loop="false"
                             :autoplay="false"
                             arrow="never"
                             @change="carouselImageChange">
                    <el-carousel-item v-for="(item,sidx) in deviceStatistics.cameraSnapShotsList" :key="sidx"
                                      indicator-position="none">
                        <el-image
                                style="width: 100%;"
                                :src="item.snapshotUrl"
                                fit="cover"  >
                            <div slot="placeholder" class="image-slot">
                                <i class="el-icon-picture-outline"></i>
                            </div>
                        </el-image>
                        <!--['fill', 'contain', 'cover', 'none', 'scale-down'],-->
                    </el-carousel-item>
                </el-carousel>
                <loading message="暂无数据" loading-status="empty" v-else></loading>
            </div>
            <div class="carousel-direction">
                <div class="direction-wrap">
                    <!-- <template v-for="(tm,tidx) in deviceStatistics.directionItemList">
                        <div class="direction-item" :class="directionItemIndex === tidx ? 'active' : ''"
                            :key="tidx" @click="directionItemClick(tm,tidx)">
                            <div class="dire-icon">
                                <i class="el-icon-caret-bottom"></i>
                            </div>
                            <div class="dire-line"></div>
                            <div class="dire-text">
                                {{tm.mtstr}}
                            </div>
                        </div>
                    </template> -->
                    <!--<div class="direction-item" v-for="s in ( 11 - parseInt(directionItemList.length))">
                        <div class="dire-icon">
                            <i class="el-icon-caret-bottom"></i>
                        </div>
                        <div class="dire-line"></div>
                        <div class="dire-text"></div>
                    </div>-->
                </div>
            </div>
            <div class="carousel-thumb">
                <div class="thumb-arrow" @click="thumbScrollClick('left')">
                    <i class="el-icon-arrow-left"></i>
                </div>
                <div class="thumb-arrow arrow-right" @click="thumbScrollClick('right')">
                    <i class="el-icon-arrow-right"></i>
                </div>
                <div id="thumbListWrap" class="thumb-list-wrap" v-if="deviceStatistics.cameraSnapShotsList.length">
                    <vue-scroll ref="thumbScroll" :ops="$root.scrollOpsX">

                        <!--  -->
                        <!--<template v-if="!deviceStatistics.cameraSnapShotsList.length">
                            <el-image  fit="cover" lazy v-for="tidx in 8"  >
                                &lt;!&ndash;<div slot="placeholder" class="image-slot">
                                    <i class="el-icon-picture-outline"></i>
                                </div>&ndash;&gt;
                                <div slot="error" class="image-slot">
                                    <i class="el-icon-picture-outline"></i>
                                </div>
                            </el-image>
                        </template>-->
                        <template v-for="(image,imidx) in deviceStatistics.cameraSnapShotsList" >
                            <el-image  @click="thumbItemClick(imidx)" :class="carouselImageIndex === imidx ? 'active' : ''"
                                       :src="image.snapshotUrl"
                                       :key={imidx}
                                       fit="cover" lazy >

                                <div slot="placeholder" class="image-slot">
                                    <i class="el-icon-picture-outline"></i>
                                </div>
                                <!--<div slot="error" class="image-slot">
                                    <i class="el-icon-picture-outline"></i>
                                </div>-->
                            </el-image>
                            
                        </template>
                        <!--<div class="thumb-cardlist-view" :style="{width:thumbListWidth}">
                        </div>-->
                        <!--scroll-container="$refs['thumbScroll'].scrollPanelElm" <div class="thumb-cardlist-view" :style="{width:thumbListWidth}">
                            <el-card  v-for="(image,imidx) in deviceStatistics.cameraSnapShotsList" :class="carouselImageIndex === imidx ? 'active' : ''"
                                      :body-style="{ padding: '0px',width:'100%', height:'100%' }" shadow="hover">
                                <el-image  @click="thumbItemClick(imidx)"
                                           style="width: 100%; height: 100%"
                                           :src="image"
                                           fit="cover" lazy >
                                    <div slot="error" class="image-slot">
                                        <i class="el-icon-picture-outline"></i>
                                    </div>
                                </el-image>

                            </el-card>
                        </div>-->
                    </vue-scroll>
                </div>
            </div>
        </div>
        </div>
        
    </div>
</template>

<script>
    import {mapState, mapActions, mapMutations} from 'vuex';
    import loading from '@/components/common/Loading';
    export default {
        name: "CameraImagesView",
        components:{
            loading
        },
        data(){
            return {
                cameraImagesLoading              : true,
                carouselImageIndex               : 0,
                //directionItemList                : [],
                thumbPage                        : 1,
                directionItemIndex               : 10,
                currentCameraNum                 : '',
                scrollPanelElm                   : null,
                imgList:{},
                cameraId:''
            }
        },
        computed: {
            ...mapState([
                "deviceStatistics",
            ]),
            thumbListWidth(){
                let count = this.deviceStatistics.cameraSnapShotsList.length,
                    width = count*98 + 10*(count-1);
                return count ? width + 'px' : 0;
            }
        },
        mounted(){
            //TODO: 最近10天，加当天，11天截图数据
            let direRs = [];
            for(let i = 5;i>=0;i--){
                let dt = Number(new Date().getTime() - 1000 * 3600 * 24 * i )/1000;
                let dtstr = this.Utils.date('Y-m-d',dt),
                    mtstr = this.Utils.date('m-d',dt);
                direRs.push({
                    dtstr:dtstr,
                    mtstr:mtstr
                });
            }
            //this.directionItemList = direRs;

            this.setDirectionItemList(direRs);

            this.directionItemIndex = 10;



            //console.info('this.directionItemList  ',this.directionItemList);
        },
        methods:{
            ...mapActions([
                "getCameraSnapShotsAction",
            ]),
            ...mapMutations([
                "setDirectionItemList",
                "setCameraSnapShotsList",
            ]),

            getImages(cameraNum,dateStr,cameraId){
                if(!cameraNum){
                    return false;
                }

                let _this = this;
                _this.currentCameraNum = cameraNum;
                //console.info('getImages  ',cameraNum);
                if(!dateStr) dateStr = this.Utils.date('Y-m-d');
                _this.cameraImagesLoading = true;
                _this.directionItemList = [];
                _this.setCameraSnapShotsList([]);

                _this.getCameraSnapShotsAction({
                    cameraNum :'aef89ecc-4cc6-4a6d-80fd-283196105999',//'aef89ecc-4cc6-4a6d-80fd-283196105999',//
                    // date      : dateStr
                    cameraId:cameraId
                }).then((res)=>{
                    //console.info('cameraImagesLoading   ',res,res.data.length);
                    _this.cameraImagesLoading = false;
                    this.imgList= res.data;
                    if(res.data && res.data.length) {
                        _this.$nextTick(()=>{
                            _this.carouselImageIndex = res.data.length - 1;
                            _this.cameraCarouselArrowClick('set',_this.carouselImageIndex);
                            console.info('_this.carouselImageIndex  ',_this.carouselImageIndex);
                            _this.$refs['thumbScroll'].scrollBy(
                                {
                                    dx: 32000
                                },
                                500,
                                'easeInQuad'
                            );
                        })

                    }

                    /*if(res.data && res.data.length){
                        //let list = res.data;//,len = list.length;

                        //console.info('cameraImagesLoading  22 ',res,res.data.length,len);

                        //console.info('_this.directionItemList 1 ',_this.directionItemList);

                        //console.info('_this.directionItemList 2 ',_this.directionItemList);
                        /!*list.forEach((vo)=>{
                            let timeStr = _this.Utils.date('H:i');//_this.Utils.date('H:i',_this.Utils.strtotime(vo.message));
                            _this.directionItemList.push(timeStr);
                        })*!/

                    }
*/

                    /*setTimeout(()=>{
                        _this.scrollPanelElm = _this.$refs['thumbScroll'].scrollPanelElm;
                        console.info('refs   ',_this.$refs['thumbScroll'],_this.scrollPanelElm);
                    },500);*/

                });
            },

            cameraCarouselArrowClick(type,index){
                let _this = this;
                if(type === 'next') _this.$refs['cameraCarouselView'].next();
                if(type === 'prev') _this.$refs['cameraCarouselView'].prev();
                if(type === 'set') _this.$refs['cameraCarouselView'].setActiveItem(index);
            },
            /**
             * 切换轮播
             */
            carouselImageChange(iddx){
                //console.info('carouselImageChange ',iddx);
                this.carouselImageIndex = iddx;
            },
            /**
             * 切换日期线
             */
            directionItemClick(vo,didx){
                if(this.directionItemIndex === didx ) return false;
                this.directionItemIndex = didx;
                this.getImages(this.currentCameraNum,vo.dtstr);
            },
            thumbItemClick(didx){
                this.carouselImageIndex = didx;
                this.cameraCarouselArrowClick('set',didx);
            },
            /**
             * 缩略图，翻页切换
             * @param type
             * @returns {boolean}
             */
            thumbScrollClick(type){
                /*let obj = document.getElementsByClassName('thumb-list-wrap')[0],
                    viewObj = document.getElementsByClassName('thumb-cardlist-view')[0],
                    fullPages = this.Utils.ceil(this.directionItemList.length/5) + 3,
                    thumbMove = 0;
                if(!obj || !viewObj) return false;*/

                let scrollStep = 0;
                if(type === 'left'){
                    scrollStep = -550;
                }
                if(type === 'right'){
                    scrollStep = 550;
                }

                this.$refs['thumbScroll'].scrollBy(
                    {
                        dx: scrollStep
                    },
                    500,
                    'easeInQuad'
                );


                /*let obj = document.getElementsByClassName('thumb-list-wrap')[0],
                    viewObj = document.getElementsByClassName('thumb-cardlist-view')[0],
                    fullPages = this.Utils.ceil(this.directionItemList.length/5) + 3,
                    thumbMove = 0;
                if(!obj || !viewObj) return false;
                //console.info('thumbScrollClick 1 = ',type, fullPages, this.thumbPage);

                //向左切换，页码减小，当前页显示的内容向右移，显示上一页的内容，页码缩小两级后计算偏移量。
                if(type === 'left'){
                    if(this.thumbPage === 1) return false;
                    this.thumbPage--;
                    thumbMove = this.thumbPage > 1 ? 0 - (this.thumbPage-1) * 550 : 0;
                    viewObj.style.transform = 'translateX('+thumbMove+'px) scale(1)';
                }
                //向右切换，页码增大，让当前页所显示的全部隐藏，隐藏后页码记录增加1.
                if(type === 'right'){
                    if(this.thumbPage === fullPages) return false;
                    thumbMove = 0 - this.thumbPage * 550;
                    viewObj.style.transform = 'translateX('+thumbMove+'px) scale(1)';
                    this.thumbPage++;
                }*/
                //console.info('thumbScrollClick 1 = ', fullPages, this.thumbPage);
            },
            destoryImages(){
                this.directionItemIndex = 10;
                this.carouselImageIndex = 0;
                this.cameraCarouselArrowClick('set',0);
                this.setDirectionItemList([]);
                this.setCameraSnapShotsList([]);
            }
        }
    }
</script>

<style lang="less" scoped>
    /*截图窗口样式*/
    .camera-images-body{
        .imgList{
            .el-carousel__container{
            height: 200px;
        }
        }
        
        height: 100%;
        .arrow-horizontal{
            width:30px;
            height:200px;
            position:absolute;
            top:0;
            left:0;
            cursor: pointer;
            transition: all .2s;

            &.arrow-right{
                right:0;
                left:unset;
            }

            i{
                position: absolute;
                top:50%;
                left:50%;
                transform: translate(-50%,-50%);
                font-size: 2rem;
                color: #7288a5;
                transition: all .2s;
            }

            &:hover{
                background: rgba(6, 24, 47, 0.3);
                i{
                    color:#fff;
                }
            }
        }

        .carousel-wrap{
            margin:0 30px;
            height:100%;
            .carousel-views{
                .el-carousel{
                    height: 100%;

                    /deep/ ul.el-carousel__indicators{
                        display: none;
                    }

                }

            }

            .carousel-direction{
                .direction-wrap{
                    .direction-item{
                        text-align:center;
                        width:49px;
                        float:left;
                        cursor: pointer;

                        &:last-child{
                            .dire-line{
                                border-right:0 none;
                            }
                        }

                        &.active{
                            .dire-icon {
                                i {
                                    display: block;
                                }
                            }
                            .dire-line{
                                background:#329ff9;
                            }
                            .dire-text{
                                color:#329ff9;
                            }
                        }

                        &:hover{
                            /*.dire-icon {
                                i {
                                    display: block;
                                }
                            }*/
                            .dire-line{
                                background:#329ff9;
                            }
                            .dire-text{
                                color:#329ff9;
                            }
                        }

                        .dire-icon{
                            height:20px;
                            i{
                                font-size:40px;
                                line-height:20px;
                                color:#329ff9;
                                display:none;
                                transition: all .2s;
                            }
                        }
                        .dire-line{
                            height:4px;
                            border-top:1px solid #329ff9;
                            border-right:1px solid #329ff9;
                            transition: all .2s;
                        }
                        .dire-text{
                            font-size:.875rem;
                            line-height:2rem;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            color: #bfc3cc;
                            transition: all .2s;
                        }
                    }

                    &:after{
                        content:'';
                        clear:both;
                    }
                }
            }

            .carousel-thumb{
                position:relative;
                bottom:0px;
                height:56px;width:100%;
                /*.el-carousel--horizontal{
                    height:80px;
                }*/

                .thumb-arrow{
                    display:inline-block;
                    height:56px;
                    width:20px;
                    position:absolute;
                    left:-25px;
                    top:0;
                    background:#137193;
                    text-align: center;
                    cursor: pointer;
                    i{
                        color:#fff;
                        line-height:56px;
                    }

                    &.arrow-right{
                        right:-25px;
                        left:unset;
                    }
                }

                .thumb-list-wrap{
                    width:100%;
                    height: 100%;
                    /*overflow: hidden;
                    overflow-x:auto;*/

                    /deep/ .__vuescroll{
                        /*overflow:visible!important;*/
                        height: calc(100% + 10px)!important;
                        .__panel{
                            overflow:hidden!important;
                            overflow-x:auto!important;
                            height: calc(100% + 20px)!important;
                            .__view{
                                white-space: nowrap;
                                height: 100%;
                                .el-image{
                                    display:inline-block;
                                    width: 98px;
                                    height:56px;
                                    border: 1px solid transparent;
                                    cursor: pointer;
                                    background: transparent;
                                    border-radius: 6px;
                                    box-sizing: border-box;

                                    img{
                                        transition: .4s;
                                    }
                                    &.active{
                                        border: 2px solid #139aad;
                                        width: 98px;
                                    }
                                    &:hover{
                                        img{
                                            transform:  scale(1.4);
                                            /*transform: rotate(8deg) scale(1.2);*/
                                        }
                                    }
                                    &+.el-image{
                                        margin-left:10px;
                                    }

                                    .image-slot {
                                        display: flex;
                                        justify-content: center;
                                        align-items: center;
                                        width: 100%;
                                        height: 100%;
                                        background: #1d1d1d;
                                        color: #ccd0d6;
                                        font-size: 30px;
                                    }
                                }
                            }
                        }

                        .__rail-is-horizontal{
                            /*bottom:-8px!important;*/
                            .__bar-is-horizontal{
                                background: rgb(43, 122, 191)!important;
                            }
                        }
                    }



                    .thumb-cardlist-view{

                        width:auto;
                        white-space: nowrap;
                        -webkit-transition: -webkit-transform .4s ease-in-out;
                        transition: -webkit-transform .4s ease-in-out;
                        transition: transform .4s ease-in-out,-webkit-transform .4s ease-in-out;

                        /deep/ .el-image{
                            display:inline-block;
                            width: 98px;
                            height:56px;
                            border: 1px solid transparent;
                            cursor: pointer;
                            background: transparent;
                            border-radius: 6px;
                            box-sizing: border-box;

                            img{
                                transition: .4s;
                            }
                            &.active{
                                border: 1px solid #139aad;
                            }
                            &:hover{
                                img{
                                    transform:  scale(1.4);
                                    /*transform: rotate(8deg) scale(1.2);*/
                                }
                            }
                            &+.el-image{
                                margin-left:10px;
                            }
                        }

                        /*.el-card{
                            display:inline-block;
                            width: 100px;
                            height:56px;
                            border: 1px solid transparent;
                            cursor: pointer;
                            background: transparent;

                            &.active{
                                border: 1px solid #42c7da;
                            }

                            /deep/ .el-image{
                                width:100%;
                                height:100%;
                                img{
                                    transition: .4s;
                                }
                            }

                            &+.el-card{
                                margin-left:10px;
                            }

                            &.is-hover-shadow:hover{
                                /deep/ .el-image{
                                    img{
                                        transform:  scale(1.4);
                                        !*transform: rotate(8deg) scale(1.2);*!
                                    }
                                }
                            }

                            !*.el-card__body{
                                .el-image{
                                    img{
                                        transition: .2s;
                                    }
                                    &:hover{

                                        img{
                                            transform: rotate(8deg) scale(1.2);
                                        }
                                    }
                                }
                            }*!

                        }*/
                    }


                }


            }

        }
    }
</style>
