/**
 * @description   地图业务SDK
 * @author       刘晖(liuh@microvideo.cn)
 * @date         2021/11/24 9:21
 */


import { createMapFunction } from './map-sdk';
import { getBusinessEventIcon } from './public-function';
import EventApi from '../api/event-api'

class BusinessSdk {

    constructor(map,mapUI,mapIconConfig) {
        this.mapFunction = createMapFunction(map,mapUI,mapIconConfig);
    }

    /**
     * 创建mapSDK
     */
    defineBusinessMapFunction() {
        this.mapFunction = null;
    }


    /**
     * 创建事件图标（前后摄像头、情报板、清障车）
     * @param eventId
     */
    createEventPoint(eventId,callback){
        EventApi.createEventMarker().then(res=>{
            if (res.status === 0 && res.data != null){
                let data = [];
                for(const item of res.data){
                    let icon = getBusinessEventIcon(item.type);
                    data.push({
                        ...item,
                        icon:icon
                    })
                }
                this.mapFunction.createZhddMapMarkLayer(data,(e,data)=>callback(e,data));
                this.mapFunction.setZhddMapFitView();
            }
        })
    }
}

function createBusinessSdk(map,mapUI,mapIconConfig) {
    return new BusinessSdk(map,mapUI,mapIconConfig);
}

export { createBusinessSdk };
