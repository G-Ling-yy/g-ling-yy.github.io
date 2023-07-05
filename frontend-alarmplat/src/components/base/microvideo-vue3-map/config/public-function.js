/**
 * @description  地图SDK公共方法
 * @author       刘晖(liuh@microvideo.cn)
 * @date         2021/11/18 17:44
 */

let mapIconConfig = [];

/**
 * 获取海量点标记点地址
 * @param iconConfig
 * @returns {{size: AMap.Size, anchor: AMap.Pixel, url: *}}
 */
const getMassIconUrl = (iconConfig) => {
    let iconStyle = [];
    if (iconConfig.icon && iconConfig.icon.length > 0){
        iconConfig.icon.map((item,index)=>{
            iconStyle.push({
                url: item.url,
                anchor: new AMap.Pixel(0, 0),
                size: new AMap.Size(iconConfig.size ? iconConfig.size[0] : 32, iconConfig.size ? iconConfig.size[1] : 32)
            })
        })

    }
    return iconStyle;
}

/**
 * 地图图标配置赋值
 * @param iconConfig
 */
const setMapIconConfig = (iconConfig) => {
    mapIconConfig = iconConfig;
}

/**
 * 获取marker标记点地址
 * @param iconConfig
 * @returns {{}}
 */
const getMarkerIcon = (iconConfig) => {
    let iconClass;
    if (typeof iconConfig === 'object'){
        iconClass = iconConfig.icon;
    }else {
        iconClass = iconConfig;
    }
    let iconStyle = {}
    mapIconConfig.map((config,index) => {
        if (config.name === iconClass){
            iconStyle = {
                size: new AMap.Size(iconConfig.size ? iconConfig.size[0] : 32, iconConfig.size ? iconConfig.size[1] : 32),
                image: config.url,
                imageOffset: new AMap.Pixel(0, 0),
                imageSize: new AMap.Size(iconConfig.size ? iconConfig.size[0] : 32, iconConfig.size ? iconConfig.size[1] : 32),
            }
        }
    })
    return iconStyle;
}


/**
 * 获取海量点图标地址
 * @param iconConfig
 * @returns {{}}
 */
const getBusinessEventIcon = (type) => {
    let icon;
    if (type === 0){            //事件-交通事故
        icon = 'icon-event-jtsg'
    }else if (type === 1){      //事件-摄像机
        icon = 'dark-icon-gs-sxt'
    }else if (type === 2){      //事件-情报板
        icon = 'dark-icon-gs-qbb'
    }else {                     //事件-清障车
        icon = 'dark-icon-gs-jycl'
    }
    return icon;
}

export {
    getMarkerIcon,
    getMassIconUrl,
    setMapIconConfig,
    getBusinessEventIcon
}
