/**
 * @description   业务层接口配置
 * @author       刘晖(liuh@microvideo.cn)
 * @date         2021/11/16 9:35
 */

import { createRequest } from '../lib/request';

export default {

    /**
     * 业务配置-获取桩号经纬度数据
     */
    getZHMapLayerList: () => {
        return createRequest().get("/zhdd/map/zh")
    },
    /**
     * 业务配置-获取情报板经纬度数据
     */
    getQBBMapLayerList: () => {
        return createRequest().get("/zhdd/map/qbb")
    },
    /**
     * 业务配置-获取路况经纬度数据
     */
    getLKMapLayerList: () => {
        return createRequest().get("/zhdd/map/lk")
    },
    /**
     * 业务配置-获取路线经纬度数据
     */
    getLXMapLayerList: () => {
        return createRequest().get("/zhdd/map/lx")
    }

}
