<template>
    <!--千方地图-->
    <div class="qf-map_wrap">

        <!--地图容器-->
        <div class="qf-map-box" id="mapCon"></div>

        <!--视频播放器-->
        <amap-player ref="amapPlayer" :visible.sync="cameraMarkVisable" :isQfMap="true"></amap-player>

        <!--弹出框-->
        <div id="popup" class="ol-popup">
            <div id="popup-content"></div>
        </div>

        <div class="gd-map" id="gdMap"></div>
    </div>
</template>

<script>
    import { wgs84_to_gcj02, gcj02_to_wgs84 } from "../utils/wgs84_to_gcj02.js";
    import amapPlayer from "./AmapPlayerDialog";

    export default {
        components: {
            amapPlayer,
        },
        props: {
            cameraTypeSelect:{},
            cameraStatusChange:{},
        },
        data() {
            return {
                fsssWfsUrl: 'http://gis-t.chinahighway.org.cn:8001',
                geoserverUrl: 'http://gis-t.chinahighway.org.cn:8001',
                geowebcacheUrl: 'http://gis-t.chinahighway.org.cn:8001',
                trafficUrl: 'http://39.96.167.193:8003',
                opacity_color: 0,
                layer: [],                                      // map中的图层数组
                layerName: [],                                  // 图层名称数组
                layerVisibility: [],                            // 图层可见属性数组
                lwzxbkMapLayer: null,
                lwzxrouteMapLayer: null,
                lwzxblueMapLayer: null,
                lwzxzhujiMapLayer: null,
                trffic_layer: null,
                style_line: null,
                projection: ol.proj.get('EPSG:3857'),
                vectorSource: null,
                vectorLayer: null,
                view: null,
                map: null,
                wmsVectorLayer_china: null,                     // 国界面图层
                wmsVectorLayer_71118: null,                     // 71118图层
                wmsVectorLayer_road: null,                     // 高速
                wmsVectorLayer_tollplaza: null,                     // 收费站广场
                wmsVectorLayer_fsss_chukou: null,                     // 出口
                wmsVectorLayer_fsss_rukou: null,                     // 入口
                wmsVectorLayer_fsss_suidao: null,                     // 隧道
                wmsVectorLayer_fsss_gasstation: null,                     // 加油站
                wmsVectorLayer_fsss_keyunzhan: null,                     // 客运站
                wmsVectorLayer_fsss_tingchequ: null,                     // 停车区
                wmsVectorLayer_fsss_qiaoliang: null,                     // 桥梁
                wmsVectorLayer_fsss_video: null,                     // 视频
                wmsVectorLayer_fsss_tollpoint: null,                     // 收费门架
                wmsVectorLayer_fsss_tollunit: null,                     // 收费单元
                wmsVectorLayer_province: null,                     // 省界面
                wmsVectorLayer_ksmatch: null,                     // 里程桩

                cameraSource: null,                                 // 摄像机
                cameraLayer: null,                                 // 摄像机
                cameraImg: require('../assets/images/icon/gljs-xf.png'),

                vectorLayer_point: null,

                //摄像机选中图标
                cameraGifUrl: {
                    '1':require('../assets/images/qf_map/actCam.png'),
                    '2':require('../assets/images/qf_map/actCam.png'),
                    '3':require('../assets/images/qf_map/actCam.png'),
                    '4':require('../assets/images/qf_map/actCam.png'),
                    '5':require('../assets/images/qf_map/actCam.png'),
                    '6':require('../assets/images/qf_map/actCam.png'),
                    '7':require('../assets/images/qf_map/actCam.png')
                },
                //摄像机正常图标
                cameraImgUrl: {
                    '1':require('../assets/images/qf_map/newcamera1.png'),
                    '2':require('../assets/images/qf_map/newcamera1.png'),
                    '3':require('../assets/images/qf_map/newcamera1.png'),
                    '4':require('../assets/images/qf_map/newcamera1.png'),
                    '5':require('../assets/images/qf_map/newcamera1.png'),
                    '6':require('../assets/images/qf_map/newcamera1.png'),
                    '7':require('../assets/images/qf_map/newcamera1.png')
                }, //require('@/assets/images/traffic_map/icon/camera.png'),

                //摄像机离线图标
                cameraOfflineImgUrl: {
                    '1':require('../assets/images/qf_map/newcamera2.png'),
                    '2':require('../assets/images/qf_map/newcamera2.png'),
                    '3':require('../assets/images/qf_map/newcamera2.png'),
                    '5':require('../assets/images/qf_map/newcamera2.png'),
                    '6':require('../assets/images/qf_map/newcamera2.png'),
                    '7':require('../assets/images/qf_map/newcamera2.png')
                }, //require('@/assets/images/traffic_map/icon/camera-offline.png'),
                //摄像机故障图标
                cameraErrorImgUrl: {
                    '1':require('../assets/images/qf_map/newcamera0.png'),
                    '2':require('../assets/images/qf_map/newcamera0.png'),
                    '3':require('../assets/images/qf_map/newcamera0.png'),
                    '5':require('../assets/images/qf_map/newcamera0.png'),
                    '6':require('../assets/images/qf_map/newcamera0.png'),
                    '7':require('../assets/images/qf_map/newcamera0.png')
                }, //require('@/assets/images/traffic_map/icon/camera-error.png'),

                popupOverlay: null,
                camVectorLayer: [],
                cameraMarkVisable: false,
                currentPlayCamera: {},
                converVectorLayer: null,
                actCamvectorLayer: null,
                converLayer: null,

                gdMap: null,                                                        // 高德地图
                districtExplorer: null,                                             // 高德地图区域
                initZoom: 4.5,                                                      // 默认加载层级
                initCenter: ol.proj.fromLonLat([107.408718, 34.922369]), // 默认加载中心点
                getCamPostBody: {},                                                 // 获取摄像机列表请求参数
                actProvinceId: 100000,

                container: document.getElementById("popup"),
                popupContent: document.getElementById("popup-content"),
            }
        },
        methods: {
            /**
             * 地图加载
             */
            mapLoad() {
                var _this = this;

                // 地图图层初始化配置
                this.view = new ol.View({
                    projection : _this.projection,          // 坐标系如果不设置，默认为墨卡托
                    center     : _this.initCenter,          // 设置地图中心点
                    zoom       : _this.initZoom,            // 初始化显示层级
                    minZoom    : 4,                         // 最小显示层级
                    maxZoom    : 16,                        // 最大显示层级
                    // constrainResolution: true,           // 因为存在非整数的缩放级别，所以设置该参数为true来让每次缩放结束后自动缩放到距离最近的一个整数级别，这个必须要设置，当缩放在非整数级别时地图会糊
                });

                this.map = new ol.Map({
                    target : 'mapCon',              // 容器id
                    layers : [
                        // _this.lwzxbkMapLayer,
                        _this.lwzxrouteMapLayer,
                        // _this.lwzxzhujiMapLayer,
                        _this.lwzxblueMapLayer,
                        _this.wmsVectorLayer_china,
                        _this.wmsVectorLayer_71118,
                    ],                              // 默认加载图层
                    view  : _this.view,
                });

                /**
                 * 地图悬浮时触发
                 */
                this.map.on('pointermove', function (e) {
                    clearTimeout( window.pointermoveTimer );

                    window.pointermoveTimer = setTimeout(()=> {
                        var pixel = _this.map.getEventPixel(e.originalEvent);

                        // 摄像机标志（每次点击只能触发一次）
                        var camFlag = true;

                        if( _this.popupOverlay ) {
                            _this.popupOverlay.setPosition( undefined );
                        }

                        _this.map.forEachFeatureAtPixel(pixel, function (feature) {

                            if( !camFlag ) {
                                return;
                            }

                            // 获取摄像机自定义信息
                            var obj = feature.getProperties();

                            //coodinate存放了点击时的坐标信息
                            var coodinate = e.coordinate;

                            // let wgS84 = _this.mercatorTolonlat({ x: coodinate[0], y: coodinate[1] })
                            //
                            // let gcj02 = _this.$gcoord.transform([wgS84.x, wgS84.y], _this.$gcoord.WGS84, _this.$gcoord.GCJ02);

                            // let container = document.getElementById("popup");
                            // let content = document.getElementById("popup-content");
                            // let popupCloser = document.getElementById("popup-closer");

                            _this.popupOverlay = new ol.Overlay({
                                //设置弹出框的容器
                                element: _this.container,
                                positioning: 'top-left',
                                offset: [10,10],
                                //是否自动平移，即假如标记在屏幕边缘，弹出时自动平移地图使弹出框完全可见
                                autoPan: true
                            });

                            camFlag = false;

                            // 未携带名称的图层表示不是摄像机图层，则显示省份信息
                            if( !obj.name ) {

                                _this.getAreaCode( coodinate ).then(( {data} )=> {

                                    if( _this.actProvinceId !== 100000 ) {

                                        var valName = data.data.city?data.data.city.value:data.data.county.value;

                                        if( (_this.actProvinceId+'').slice(2,6) !== '0000' ) {
                                            valName = data.data.county.value;
                                        }

                                        _this.popupContent.innerHTML = `<div>${ valName }</div>`;
                                    }else {
                                        _this.popupContent.innerHTML = `<div>${ data.data.province.value }</div>`;
                                    }

                                    //设置overlay的显示位置
                                    _this.popupOverlay.setPosition(coodinate);
                                    //显示overlay
                                    _this.map.addOverlay(_this.popupOverlay);
                                });

                                // _this.$axios.get( _this.geoserverUrl + `/API/getInverseGeocoding.do?lat=${ gcj02[1] }&lng=${ gcj02[0] }` ).then(( { data } )=> {
                                //     console.log("data===》",data);
                                //     //设置弹出框内容，可以HTML自定义
                                //     if( _this.actProvinceId !== 100000 ) {
                                //         _this.popupContent.innerHTML = `<div>${ data.data.city?data.data.city.value:data.data.county.value }</div>`;
                                //     }else {
                                //         _this.popupContent.innerHTML = `<div>${ data.data.province.value }</div>`;
                                //     }
                                //
                                //     //设置overlay的显示位置
                                //     _this.popupOverlay.setPosition(coodinate);
                                //     //显示overlay
                                //     _this.map.addOverlay(_this.popupOverlay);
                                // })
                                return;
                            }

                            //设置弹出框内容，可以HTML自定义
                            _this.popupContent.innerHTML = `<div>${ obj.khPile }</div>`;
                            //设置overlay的显示位置
                            _this.popupOverlay.setPosition(coodinate);
                            //显示overlay
                            _this.map.addOverlay(_this.popupOverlay);
                        });
                    }, 200);

                });

                /**
                 * 地图添加点击事件
                 */
                this.map.on('singleclick', function(e) {
                    var pixel = _this.map.getEventPixel(e.originalEvent);

                    // 摄像机标志（每次点击只能触发一次）
                    var camFlag = true;

                    clearTimeout( window.singleclickTimer );

                    // 当点击区域超出蒙版范围时，获取省份code加载外部区域
                    window.singleclickTimer = setTimeout(function () {
                        //coodinate存放了点击时的坐标信息
                        var coodinate = e.coordinate;


                        _this.getAreaCode( coodinate ).then(( {data} )=> {

                            if( _this.actProvinceId === 100000 ) {
                                _this.getCamPostBody.provinceCode = 100000;

                                _this.addConverLayer( 100000, _this.getCamPostBody, true );
                            }else {
                                _this.getCamPostBody.provinceCode = data.data.province.admcode*1;

                                _this.addConverLayer( data.data.province.admcode*1, _this.getCamPostBody, data.data.province );
                            }
                        })

                    }, 300);

                    _this.map.forEachFeatureAtPixel(pixel, function (feature) {

                        clearTimeout( window.singleclickTimer );

                        if( !camFlag ) {
                            return;
                        }

                        // 获取摄像机自定义信息
                        var cameraInfo = feature.getProperties();

                        //coodinate存放了点击时的坐标信息
                        var coodinate = e.coordinate;

                        if( !cameraInfo.name ) {

                            if( [110000,120000,310000,500000].indexOf( _this.actProvinceId*1 ) !== -1 ) {
                                return;
                            }

                            _this.getAreaCode( coodinate ).then(( {data} )=> {

                                if( _this.actProvinceId === 100000 ) {
                                    _this.getCamPostBody.provinceCode = data.data.province.admcode*1;

                                    _this.addConverLayer( data.data.province.admcode*1, _this.getCamPostBody, data.data.province );
                                }else if( (_this.actProvinceId+'').slice(2,6) === '0000' ) {
                                    _this.getCamPostBody.provinceCode = data.data.city?data.data.city.admcode*1:data.data.county.admcode*1;

                                    _this.addConverLayer( data.data.city?data.data.city.admcode*1:data.data.county.admcode*1, _this.getCamPostBody, data.data.city?data.data.city:data.data.county );
                                }
                            })

                            return;
                        }

                        if ( cameraInfo.onlineStatus === "1" ){
                            _this.addActCameraIcon( cameraInfo );
                            _this.cameraInfoWindowShow({ data: cameraInfo }, coodinate || null);
                        }else {
                            _this.$message({
                                type: 'warning',
                                message: '离线视频不能播放'
                            })
                        }

                        camFlag = false;
                    });
                });

                /**
                 * 地图被放大或者缩小/移动后触发
                 */
                this.map.on('moveend', function(evt) {

                    if( window.setMapTimeout ) {
                        clearTimeout( window.setMapTimeout );
                    }

                    // 设置0.75秒防抖
                    window.setMapTimeout = setTimeout(()=> {
                        _this.cameraLoad();
                    }, 750)
                });
            },

            /**
             * 地图默认图层样式加载
             */
            mapConfigLoad() {
                var _this = this;

                // // 地图底图加载
                // this.lwzxbkMapLayer = new ol.layer.Tile({
                //     //extent: [2423601.4157865737,-2324350.537143386,19812052.859356128,9945726.086343195],
                //     name: "背景",
                //     source: new ol.source.TileWMS({
                //         url: this.geowebcacheUrl + '/geowebcache/service/wms',
                //         params: {
                //             'VERSION': '1.1.1',
                //             'LAYERS': 'lwzx_bk',
                //             'FORMAT': 'image/png',
                //             'SRS': 'EPSG:3857'
                //         },
                //         tileGrid: new ol.tilegrid.TileGrid({
                //             //resolution和conf.xml中保持一致
                //             resolutions: [78271.517018034036, 39135.758509017018,
                //                 19567.879254508509, 9783.9394949623238,
                //                 4891.9698797730935, 2445.9849398865467,
                //                 1222.992337651342, 611.49616882567102,
                //                 305.74808441283551, 152.87417449834899,
                //                 76.436954957243259, 38.218609770552874,
                //                 19.109304885276437, 9.5546524426382184,
                //                 4.7773262213191092, 2.3886631106595546,
                //                 1.1943315553297773, 0.59716577766488865
                //             ],
                //             tileSize: [256, 256],
                //             origin: [-22041258.62706707, 33265069.154240012]
                //         })
                //
                //     })
                // });

                // 路线标记加载
                this.lwzxrouteMapLayer = new ol.layer.Tile({
                    //extent: [2423601.4157865737,-2324350.537143386,19812052.859356128,9945726.086343195],
                    name: "路线",
                    source: new ol.source.TileWMS({
                        url: this.geowebcacheUrl + '/geowebcache/service/wms',
                        params: {
                            'VERSION': '1.1.1',
                            'LAYERS': 'lwzx_route',
                            'FORMAT': 'image/png',
                            'SRS': 'EPSG:3857'
                        },
                        tileGrid: new ol.tilegrid.TileGrid({
                            //resolution和conf.xml中保持一致
                            resolutions: [78271.517018034036, 39135.758509017018,
                                19567.879254508509, 9783.9394949623238,
                                4891.9698797730935, 2445.9849398865467,
                                1222.992337651342, 611.49616882567102,
                                305.74808441283551, 152.87417449834899,
                                76.436954957243259, 38.218609770552874,
                                19.109304885276437, 9.5546524426382184,
                                4.7773262213191092, 2.3886631106595546,
                                1.1943315553297773, 0.59716577766488865
                            ],
                            tileSize: [256, 256],
                            origin: [-22041258.62706707, 33265069.154240012]
                        })
                    }),
                    zIndex: 10,
                });

                // 蓝背景加载
                this.lwzxblueMapLayer = new ol.layer.Tile({
                    //extent: [2423601.4157865737,-2324350.537143386,19812052.859356128,9945726.086343195],
                    name: "蓝背景",
                    source: new ol.source.TileWMS({
                        url: this.geowebcacheUrl + '/geowebcache/service/wms',
                        params: {
                            'VERSION': '1.1.1',
                            'LAYERS': 'lwzx_blue',
                            'FORMAT': 'image/png',
                            'SRS': 'EPSG:3857'
                        },
                        tileGrid: new ol.tilegrid.TileGrid({
                            //resolution和conf.xml中保持一致
                            resolutions: [78271.517018034036, 39135.758509017018,
                                19567.879254508509, 9783.9394949623238,
                                4891.9698797730935, 2445.9849398865467,
                                1222.992337651342, 611.49616882567102,
                                305.74808441283551, 152.87417449834899,
                                76.436954957243259, 38.218609770552874,
                                19.109304885276437, 9.5546524426382184,
                                4.7773262213191092, 2.3886631106595546,
                                1.1943315553297773, 0.59716577766488865
                            ],
                            tileSize: [256, 256],
                            origin: [-22041258.62706707, 33265069.154240012]
                        })
                    })
                });

                // 高速公路标记加载
                this.lwzxzhujiMapLayer = new ol.layer.Tile({
                    //extent: [2423601.4157865737,-2324350.537143386,19812052.859356128,9945726.086343195],
                    name: "标记",
                    source: new ol.source.TileWMS({
                        url: this.geowebcacheUrl + '/geowebcache/service/wms',
                        params: {
                            'VERSION': '1.1.1',
                            'LAYERS': 'lwzx_zhuji',
                            'FORMAT': 'image/png',
                            'SRS': 'EPSG:3857'
                        },
                        tileGrid: new ol.tilegrid.TileGrid({
                            //resolution和conf.xml中保持一致
                            resolutions: [78271.517018034036, 39135.758509017018,
                                19567.879254508509, 9783.9394949623238,
                                4891.9698797730935, 2445.9849398865467,
                                1222.992337651342, 611.49616882567102,
                                305.74808441283551, 152.87417449834899,
                                76.436954957243259, 38.218609770552874,
                                19.109304885276437, 9.5546524426382184,
                                4.7773262213191092, 2.3886631106595546,
                                1.1943315553297773, 0.59716577766488865
                            ],
                            tileSize: [256, 256],
                            origin: [-22041258.62706707, 33265069.154240012]
                        })
                    })
                });

                this.wmsVectorLayer_china = new ol.layer.Tile({
                    name: "国界面",
                    source: new ol.source.TileWMS({
                        url: this.geoserverUrl +
                            '/geoserver/sf/wms?service=WMS&version=1.1.0&request=GetMap&layers=sf:china_borderline&width=512&height=399&srs=EPSG:3857&format=application/openlayers',
                        //projection: 'EPSG:4326',
                        params: {
                            'LAYERS': 'sf:china_borderline',
                            'VERSION': '1.0.0'
                        },
                        wrapX: false
                    }),
                    zIndex: 10,
                });

                //71118图层
                this.wmsVectorLayer_71118 = new ol.layer.Tile({
                    name: "71118路网",
                    source: new ol.source.TileWMS({
                        url: this.geoserverUrl + '/geoserver/sf/wms',
                        //projection: 'EPSG:4326',
                        params: {
                            'LAYERS': '71118',
                            'VERSION': '1.0.0',
                            'TILED': true
                        },
                        serverType: 'geoserver',
                        wrapX: false
                    }),
                    zIndex: 10,
                });
            },

            /**
             * 摄像机加载
             */
            cameraLoad() {
                var _this = this;

                if( this.camVectorLayer.length ) {
                    for( var i=0,lens=this.camVectorLayer.length; i<lens; i++ ) {
                        this.map.removeLayer( this.camVectorLayer[i] );
                    }

                    this.camVectorLayer = [];
                }

                // 标点渲染
                function show_dian(info) {
                    //实例化Vector要素，通过矢量图层添加到地图容器中
                    let iconFeature = new ol.Feature({
                        //坐标点
                        geometry: new ol.geom.Point(ol.proj.fromLonLat([info.longitude, info.latitude])),
                        //名称属性
                        name: info.cameraName,
                        khPile: info.khPile,
                        cameraId: info.cameraId,
                        cameraNum: info.cameraNum,
                        onlineStatus: info.onlineStatus,
                        lonlat: [info.longitude, info.latitude],
                        //自定义数据，作用:唯一标识符
                        key: info.cameraNum,
                    });
                    iconFeature.setStyle(createLabelStyle( info ));
                    //矢量标注的数据源
                    let vectorSource = new ol.source.Vector({
                        features: [iconFeature]
                    });
                    //矢量标注图层
                    let vectorLayer = new ol.layer.Vector({
                        source: vectorSource,
                        zIndex: 200,
                    });
                    _this.map.addLayer(vectorLayer);
                    _this.camVectorLayer.push( vectorLayer );
                    //实例化Vector要素，通过矢量图层添加到地图容器中 end
                };

                /**
                 * 创建标注样式函数,设置image为图标ol.style.Icon
                 */
                var createLabelStyle = function (feature) {
                    var imgUrl = '';

                    switch ( feature.onlineStatus ) {
                        case '0':
                            imgUrl = _this.cameraOfflineImgUrl[1];
                            break;
                        case '1':
                            imgUrl = _this.cameraImgUrl[1];
                            break;
                        case '2':
                            imgUrl = _this.cameraErrorImgUrl[1];
                            break;
                    }

                    return new ol.style.Style({
                        image: new ol.style.Icon(
                            {
                                anchor: [0, 0],              //锚点
                                anchorOrigin:'top-right',       //锚点源
                                anchorXUnits: 'fraction',       //锚点X值单位
                                anchorYUnits: 'pixels',         //锚点Y值单位
                                offsetOrigin: 'center',      //偏移原点
                                opacity: 1,
                                scale: 0.3,
                                src: imgUrl,
                            }),
                        // text: new ol.style.Text({
                        //     //位置
                        //     textAlign: 'center',
                        //     //基准线
                        //     textBaseline: 'middle',
                        //     //文字样式
                        //     font: 'normal 14px 微软雅黑',
                        //     //文本内容
                        //     text: feature.get('name'),
                        //     //文本填充样式（即文字颜色）
                        //     fill: new ol.style.Fill({ color: '#aa3300' }),
                        //     stroke: new ol.style.Stroke({ color: '#ffcc33', width: 2 })
                        // })
                    });
                }

                var mapSize = this.map.getView().calculateExtent(this.map.getSize());
                     console.log('就是看电视看',mapSize)
                var firstNode = this.mercatorTolonlat({x: mapSize[0], y: mapSize[1]} );
                var firstNodeLonLat = wgs84_to_gcj02( firstNode.x, firstNode.y );

                var secondNode = this.mercatorTolonlat({x: mapSize[2], y: mapSize[3]} );
                var secondNodeLonLat = wgs84_to_gcj02( secondNode.x, secondNode.y );
                // debugger
                // 获取摄像机地图列表
                this.$api.postCameraListForPot({
                    params: {
                        zoomLevel: this.map.getView().getZoom(),
                        northEast: secondNodeLonLat.join(','),
                        southWest: firstNodeLonLat.join(','),
                    },
                    data: this.getCamPostBody,
                }).then(( res )=> {
                    let lonLat = [];

                    // 遍历绚烂设备标点
                    for (let i=0, lens=res.data.length; i<lens; i++) {

                        lonLat = gcj02_to_wgs84( res.data[i].longitude, res.data[i].latitude );
                        // lonLat = _this.lonLat2Mercator({
                        //     lng: lonLat[0],
                        //     lat: lonLat[1]
                        // });

                        res.data[i].longitude = lonLat[0];
                        res.data[i].latitude = lonLat[1];

                        if( _this.filterCamList( res.data[i].classify, res.data[i].onlineStatus ) ) {
                            show_dian( res.data[i] );
                        }
                    }
                })

            },

            /**
             * 筛选摄像机列表
             */
            filterCamList( type, status ) {

                var hasType = this.cameraTypeSelect.indexOf(type);
                var hasStatus = this.cameraStatusChange[parseInt(status)];


                if( hasType!==-1 && hasStatus ) {
                    return true;
                }else {
                    return false;
                }
            },

            /**
             * 添加遮罩
             */
            addConverLayer( provinceId, camInfo ={}, flag = false ) {
                var _this = this;

                if( provinceId === '' ) {
                    this.cameraLoad();
                    return;
                }

                if( flag ) {
                    var level = 'province';

                    if( (provinceId+'').slice(2,6) === '0000' ) {
                        level = 'province';
                    }else if( (provinceId+'').slice(4,6) === '00' ) {
                        level = 'city';
                    }
                    _this.$emit("amapClick", [ provinceId, flag.value, level]);
                }

                this.getCamPostBody = camInfo;

                this.actProvinceId = provinceId;


                // 选中全国 地图初始化
                if( provinceId === 100000 ) {
                    this.restoreMap();

                    //全国蒙版
                    var vectorSourceChina = new ol.source.Vector({
                        format: new ol.format.GeoJSON(),
                        loader: function(extent, resolution, projection) {
                            var proj = projection.getCode();
                            var url = _this.geoserverUrl + '/geoserver/sf/wfs?service=WFS&' +
                                'version=1.0.0&request=GetFeature&typename=sf:china_polygon&' +
                                `outputFormat=application/json&&srsname=` +
                                proj ;
                            //'&' +
                            //'bbox=' +
                            //extent.join(',') ;

                            var xhr = new XMLHttpRequest();
                            xhr.open('GET', url);
                            xhr
                                .setRequestHeader("Content-Type",
                                    "application/json");
                            var onError = function() {
                                vectorSourceChina.removeLoadedExtent(extent);
                            }
                            xhr.onerror = onError;
                            xhr.onload = function() {
                                if (xhr.status == 200) {
                                    //把link更换一下
                                    vectorSourceChina.addFeatures(vectorSourceChina
                                        .getFormat().readFeatures(
                                            xhr.responseText));
                                } else {
                                    onError();
                                }
                            }
                            xhr.send();
                        },
                        strategy: ol.loadingstrategy.bbox
                    });


                    this.converLayer = new ol.layer.Vector({
                        name: 'chinamb',
                        id: 'chinamb',
                        source: vectorSourceChina,
                        style: function(feature) {
                            var style_line = new ol.style.Style({
                                fill: new ol.style.Fill({
                                    color: "rgba(17,100,237, 0.3)",
                                }),
                                stroke: new ol.style.Stroke({
                                    color: '#08142b',
                                    width: 1.5
                                })
                            });
                            return style_line;
                        }
                    });

                    this.map.addLayer( this.converLayer );
                    return;
                }

                // 地图位置图层切换
                this.getDisplayField( provinceId ,function (error, areaNode) {
                    var info = areaNode.getBounds();

                    var x='',
                        y='';

                    // 获取显示中心点
                    x = (info.xc.Q + info.oc.Q)/2;
                    y = (info.xc.R + info.oc.R)/2;

                    // 设置显示中心点/图层层级
                    _this.map.getView().setZoom( areaNode._data.idealZoom );
                    _this.map.getView().setCenter( ol.proj.fromLonLat([ y, x ]) );
                });

                if( this.converLayer ) {
                    this.map.removeLayer( this.converLayer );
                }


                var PropertyName = '';
                var Literal = '';

                if( (provinceId+'').slice(2,6) === '0000' ) {
                    PropertyName = 'adminsheng';
                    Literal = (provinceId+'').slice(0,2);
                }else if( (provinceId+'').slice(4,6) === '00' ) {
                    PropertyName = 'adminshi';
                    Literal = (provinceId+'').slice(0,4);
                }else {
                    PropertyName = 'adminxian';
                    Literal = (provinceId+'');
                }


                //全国蒙版
                var vectorSourceChina = new ol.source.Vector({
                    format: new ol.format.GeoJSON(),
                    loader: function(extent, resolution, projection) {
                        var proj = projection.getCode();
                        var url = _this.geoserverUrl + '/geoserver/sf/wfs?service=WFS&' +
                            'version=1.0.0&request=GetFeature&typename=sf:adm_borderline&' +
                            `outputFormat=application/json&FILTER=<Filter xmlns="http://www.opengis.net/ogc" xmlns:gml="http://www.opengis.net/gml">  <PropertyIsEqualTo><PropertyName>${ PropertyName }</PropertyName><Literal>${ Literal }</Literal></PropertyIsEqualTo> </Filter>&srsname=` +
                            proj ;
                        //'&' +
                        //'bbox=' +
                        //extent.join(',') ;

                        var xhr = new XMLHttpRequest();
                        xhr.open('GET', url);
                        xhr
                            .setRequestHeader("Content-Type",
                                "application/json");
                        var onError = function() {
                            vectorSourceChina.removeLoadedExtent(extent);
                        }
                        xhr.onerror = onError;
                        xhr.onload = function() {
                            if (xhr.status == 200) {
                                //把link更换一下
                                vectorSourceChina.addFeatures(vectorSourceChina
                                    .getFormat().readFeatures(
                                        xhr.responseText));
                            } else {
                                onError();
                            }
                        }
                        xhr.send();
                    },
                    strategy: ol.loadingstrategy.bbox
                });


                this.converLayer = new ol.layer.Vector({
                    name: 'chinamb',
                    id: 'chinamb',
                    source: vectorSourceChina,
                    style: function(feature) {
                        var style_line = new ol.style.Style({
                            fill: new ol.style.Fill({
                                color: "rgba(17,100,237, 0.3)",
                            }),
                            stroke: new ol.style.Stroke({
                                color: '#08142b',
                                width: 1.5
                            })
                        });
                        return style_line;
                    }
                });

                this.map.addLayer( this.converLayer );
            },

            /**
             * 关闭播放器
             */
            cameraInfoWindowClose() {
                let that = this;

                /*console.log("cameraInfoWindowClose");
                      // 关闭信息窗体
                      if(that.cameraInfoWindow) that.cameraInfoWindow.close();
                      that.cameraInfoWindow = null;*/


                // 删除选中摄像机图标
                if( this.actCamvectorLayer ) {
                    this.map.removeLayer( this.actCamvectorLayer );
                    this.actCamvectorLayer = null;
                };

                that.cameraMarkVisable = false;
                that.currentPlayCamera = {};
            },

            /**
             * 打开播放器
             * @param record
             */
            cameraInfoWindowShow( record, pixel ) {
                let that = this;

                if( record.data.cameraName ) {
                    record.data.name = record.data.cameraName;
                }

                if (record && record.data && record.data.name) {
                    //that.currentPlayCamera = record.data;
                    console.info("cameraInfoWindowShow ", record, pixel);

                    /*// 传入经纬度，设置地图中心点
                            let position = new AMap.LngLat(record.data.position[0], record.data.position[1]);  // 标准写法
                            // 简写 var position = [116, 39];
                            this.mapInstance.setCenter(position);

                            //设置显示层级，判断当前点位是否在范围内，否则需要调整层级
                            let currZoom = this.mapInstance.getZoom(),//当前层级
                                newZoom = 18,
                                myZoom = parseInt(record.data.zoomlevel) || 0;
                            //层级大于当前层级，调整到指定层级
                            if(myZoom) {
                                newZoom = myZoom;// 存在特定层级
                                if(myZoom <= currZoom){
                                    newZoom = currZoom;// 当前层级已经显示摄像头，不做调整
                                }
                            }
                            this.mapInstance.setZoom(newZoom);*/

                    //marker.setIcon('//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-red.png')

                    //this.mapInstance.setZoomAndCenter(18, [record.data.position[0], record.data.position[1]]);

                    that.cameraMarkVisable = true;

                    //鼠标位置
                    if (pixel && pixel[0] && pixel[1]) {
                        // that.$refs.amapPlayer.setWindowSite(pixel[0], pixel[1]);
                    }
                    setTimeout(() => {
                        that.$refs.amapPlayer.getVideoUrlToPlay(record.data);
                    }, 1000);
                }
            },

            /**
             * 获取区域code
             * @param  coodinate  区域经纬度 墨卡托坐标
             * @return Object     省份编码与名称
             */
            getAreaCode( coodinate ) {
                let _this = this;
                let wgS84 = _this.mercatorTolonlat({ x: coodinate[0], y: coodinate[1] });
                let gcj02 = _this.$gcoord.transform([wgS84.x, wgS84.y], _this.$gcoord.WGS84, _this.$gcoord.GCJ02);

               return _this.$axios.get( _this.geoserverUrl + `/API/getInverseGeocoding.do?lat=${ gcj02[1] }&lng=${ gcj02[0] }` )
            },

            /**
             * 添加选中
             * @param info 当前选中摄像机信息
             */
            addActCameraIcon( info ) {

                var _this = this;

                if( this.actCamvectorLayer ) {
                    this.map.removeLayer( this.actCamvectorLayer );
                    this.actCamvectorLayer = null;
                }


                //矢量标注的数据源
                var vectorSource = new ol.source.Vector();
                //矢量标注图层
                this.actCamvectorLayer = new ol.layer.Vector({
                    source: vectorSource,
                    zIndex: 999,
                });
                this.map.addLayer( this.actCamvectorLayer );

                //矢量标注样式设置函数，设置image为图标ol.style.Icon
                function createLabelStyle(feature){
                    return new ol.style.Style({
                        image: new ol.style.Icon({
                            anchor: [0, 0],              //锚点
                            anchorOrigin:'top-right',       //锚点源
                            anchorXUnits: 'fraction',       //锚点X值单位
                            anchorYUnits: 'pixels',         //锚点Y值单位
                            offsetOrigin: 'center',      //偏移原点
                            opacity: 1,
                            scale: 0.3,
                            src: _this.cameraGifUrl['1']  //图标的URL
                        }),
                    });
                };

                //新建一个要素ol.Feature
                var newFeature = new ol.Feature({
                    geometry: new ol.geom.Point(ol.proj.fromLonLat( info.lonlat )),  //几何信息
                    name: ''
                });
                newFeature.setStyle(createLabelStyle(newFeature));      //设置要素样式
                vectorSource.addFeature(newFeature);
            },

            /**
             * web墨卡托(3857)转经纬度坐标(4326)
             * @param mercator
             * @returns {{x: number, y: number}}
             */
            mercatorTolonlat( mercator ){
                var lonlat={x:0,y:0};
                var x = mercator.x/20037508.34*180;
                var y = mercator.y/20037508.34*180;
                y= 180/Math.PI*(2*Math.atan(Math.exp(y*Math.PI/180))-Math.PI/2);
                lonlat.x = x;
                lonlat.y = y;
                return lonlat;
            },

            /**
             * 经纬度坐标(4326)转web墨卡托(3857)
             * @param lonlat
             * @returns {{x: number, y: number}}
             */
            lonLat2Mercator( lonlat ) {
                var mercator = {
                    x:0,
                    y:0
                };
                var earthRad = 6378137.0;
                mercator.x = lonlat.lng * Math.PI / 180 * earthRad;
                var a = lonlat.lat * Math.PI / 180;
                mercator.y = earthRad / 2 * Math.log((1.0 + Math.sin(a)) / (1.0 - Math.sin(a)));
                return mercator;
            },

            /**
             * 高德地图加载
             */
            gdMapLoad() {
                var _this = this;

                this.gdMap = new AMap.Map("gdMap", {
                    cursor: "default",
                    resizeEnable: true,
                    animateEnable: true,
                    disableSocket: true,
                    autoSetFitView: false,
                    //viewMode: '3D',
                    // showLabel: false,//不显示地图文字标记
                    pitch: 0,
                    zoom: 5,
                    //mapStyle: 'amap://styles/1ca5820aeb977f88e1b07925d4ff1d4c',
                    mapStyle: "amap://styles/b7f705be4f2be54091ca786949404f82",
                });


                AMapUI.load(["ui/geo/DistrictExplorer", "lib/$"], function (
                    DistrictExplorer) {
                    //创建一个实例
                    let distExp = new DistrictExplorer({
                        // eventSupport: true, //打开事件支持
                        map: _this.gdMap,
                        preload: [100000],
                        zIndex: 200,
                    });

                    _this.districtExplorer = distExp;
                })
            },

            /**
             * 获取地图显示范围
             */
            getDisplayField( adcode, callback ) {
                var _this = this;

                this.districtExplorer.loadAreaNode(adcode, function (error, areaNode) {
                    //console.info('areaNode  ',adcode,areaNode);
                    _this.districtExplorer.clearFeaturePolygons();
                    if (error) {
                        if (callback) {
                            callback(error);
                        }
                        //console.error('loadAreaNode error ', error);
                        return;
                    }

                    if (callback) {
                        callback(null, areaNode);
                    }
                });
            },

            /**
             * 恢复地图初始状态
             */
            restoreMap() {
                if( this.converLayer ) {
                    this.map.removeLayer( this.converLayer );
                }

                // 设置显示中心点/图层层级
                this.map.getView().setZoom( this.initZoom );
                this.map.getView().setCenter( this.initCenter );
            },

            /**
             * 全局事件绑定
             */
            globalEventBind() {
                this.$root.$off('camWinClose');

                /**
                 * 摄像机弹窗关闭
                 */
                this.$root.$on( 'camWinClose', ()=> {
                    this.cameraInfoWindowClose();
                });
            },

        },
        beforeMount() {
            this.globalEventBind();
        },
        mounted() {
            this.mapConfigLoad();
            this.mapLoad();
            this.addConverLayer(100000);
            // this.cameraLoad();
            this.gdMapLoad();

            this.container = document.getElementById("popup");
            this.popupContent = document.getElementById("popup-content");
        }
    }
</script>

<style lang="less">
    .qf-map_wrap {
        height: 100%;
        width: 100%;
        background-image: url("../assets/images/traffic_map/map_bg.png");
        background-repeat: repeat;
        background-size: auto 120%;
        background-position: center;
        position: relative;

        >.qf-map-box {
            height: 100%;
            width: 100%;
        }

        .ol-popup {
            font-size: 14px;
            line-height: 27px;
            color: hsla(0,0%,100%,.8);
            padding: 0 10px;
            background: #2261b1;
            border: 1px solid #3aa8f3;
            box-shadow: inset 0 0 4px 0 #3aa8f3;

            .popup-content{
                background: #fff;
                padding:3px;
            }
            .ol-popup-closer {
                position: absolute;
                top: 2px;
                right: 8px;
            }
            .ol-popup-closer:after {
                content: "x";
                color: #fff;
            }
        }

        .ol-zoom.ol-unselectable.ol-control {
            display: none;
        }
    }
</style>
