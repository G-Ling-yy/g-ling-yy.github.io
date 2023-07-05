import api from '../api';
import Vue from 'vue';
let v = new Vue();                          //新创建一个vue实例


const state = {
    deviceStatisticsList: [],
    deviceStatisticsListByProvince: [],
    deviceStatisticsListByCity: [],
    deviceStatisticsListByOrg: [],
    deviceStatisticsListByRoad: [],                  // 摄像机统计
    deviceStatisticsByRoadAll: [],                  // 摄像机统计
    deviceStatisticsByRegionAll: [],
    cameraTotal: null,                // 总页数
    cameraPages: null,                // 总页码
    cameraPageSize: 10,
    cameraRunStatisticList: [],
    cameraFaultStatisticList: [],
    cameraVisitStatisticList: [],
    cameraSnapShotsList: [],
    directionItemList: [],
    mileageList: [],
    cameraAbnormalList: [],
    cameraAbnormalTotal: null,                // 总数
};

const actions = {
    getfindCameraAndPlayRecord(store, obj) {//摄像机数和视频播放记录
        return api.findCameraAndPlayRecord(obj).then((data) => {
            if (data.code !== 200) {
                v.$message({
                    message: '获取摄像机数失败! [' + data.code + ']: ' + data.message,
                    type: 'error'
                });
                return Promise.reject();
            }
            return data;
        })
    },
    getWeekVideoPlayRecordCount(store, obj) {//周播放记录
        return api.appWeekVideoPlayRecordCount(obj).then((data) => {
            if (data.code !== 200) {
                v.$message({
                    message: '获取周播放记录失败! [' + data.code + ']: ' + data.message,
                    type: 'error'
                });
                return Promise.reject();
            }
            return data;
        })
    },
    getvideoPlayRecordCount(store, obj) {
        return api.videoPlayRecordCount(obj).then((data) => {
            if (data.code !== 200) {
                v.$message({
                    message: '获取视频播放记录失败! [' + data.code + ']: ' + data.message,
                    type: 'error'
                });
                return Promise.reject();
            }
            return data;
        })
    },
    getAllCameraRunStatisticsAction(store, obj) {
        return api.getAllCameraRunStatistics(obj).then((data) => {
            if (data.code !== 200) {
                v.$message({
                    message: '获取摄像机运行统计信息失败! [' + data.code + ']: ' + data.message,
                    type: 'error'
                });
                return Promise.reject();
            }
            return data;
        })
    },
    // 调取统计
    getCountDaily(store, obj) {
        return api.getCountDaily(obj).then((data) => {
            if (data.code !== 200) {
                v.$message({
                    message: '获取摄像机运行统计信息失败! [' + data.code + ']: ' + data.message,
                    type: 'error'
                });
                return Promise.reject();
            }
            return data;
        })
    },

    // 区域统计
    getRegionStatistics(store, obj) {
        return api.getRegionStatistics(obj).then((data) => {
            if (data.code !== 200) {
                v.$message({
                    message: '获取摄像机运行统计信息失败! [' + data.code + ']: ' + data.message,
                    type: 'error'
                });
                return Promise.reject();
            }
            return data;
        })
    },
    // 调取数据来源
    getSourceStatistics(store, obj) {
        return api.getSourceStatistics(obj).then((data) => {
            if (data.code !== 200) {
                v.$message({
                    message: '获取摄像机运行统计信息失败! [' + data.code + ']: ' + data.message,
                    type: 'error'
                });
                return Promise.reject();
            }
            return data;
        })
    },
    //调取统计摄像机列表
    getPlayRecordList(store, obj) {
        return api.getPlayRecordList(obj).then((data) => {
            if (data.code !== 200) {
                v.$message({
                    message: '获取摄像机信息失败! [' + data.code + ']: ' + data.message,
                    type: 'error'
                });
                return Promise.reject();
            }
            return data;
        })
    },
    getAllCameraAbnormalStatisticsAction(store, obj) {
        return api.getAllCameraAbnormalStatistics(obj).then((data) => {
            if (data.code !== 200) {
                v.$message({
                    message: '获取摄像机故障统计信息失败! [' + data.code + ']: ' + data.message,
                    type: 'error'
                });
                return Promise.reject();
            }
            return data;
        })
    },

    getAllCameraAbnormalListAction(store, obj) {
        return api.getAllCameraAbnormalList(obj).then((data) => {
            if (data.code !== 200) {
                v.$message({
                    message: '获取摄像机故障列表信息失败! [' + data.code + ']: ' + data.message,
                    type: 'error'
                });
                return Promise.reject();
            }


            store.commit('setCameraAbnormalList', data.data);
            store.commit('setCameraAbnormalTotal', data.total);
            /*setCameraAbnormalList(state,nv){
                state.cameraAbnormalList = nv;
            },
            setCameraAbnormalTotal(state,nv){
                state.cameraAbnormalTotal = nv;
            },*/

            return data;
        })
    },


    /**
     * 获取摄像机列表
     * @param store
     * @param obj
     * @returns {Promise<*>}
     */
    getCameraInfoByList(store, obj) {
        return api.getCameraList(obj).then((data) => {
            if (data.code !== 200) {
                v.$message({
                    message: '获取摄像机信息失败! [' + data.code + ']: ' + data.message,
                    type: 'error'
                });
                return Promise.reject();
            }
            return data;
        })
    },
    /**
     * 首页获取摄像机列表
     * @param store
     * @param obj
     * @returns {Promise<*>}
     */
     getCameraDetails(store, obj) {
        return api.getCameraDetails(obj).then((data) => {
            if (data.code !== 200) {
                v.$message({
                    message: '获取摄像机信息失败! [' + data.code + ']: ' + data.message,
                    type: 'error'
                });
                return Promise.reject();
            }
            return data;
        })
    },

    /**
     * 根据角色编码获取缓存中的权限列表
     * @param store
     * @param obj
     */
    getDeviceStatistics(store, obj) {
        return api.getDeviceStatistics(obj).then((data) => {
            //console.log("getDeviceStatistics",data);
            if (data.code !== 200) {
                // v.$message({
                //     message: '获取摄像机统计列表失败! [' + data.code + ']: ' + data.message,
                //     type: 'error'
                // });
                return Promise.reject();
            }

            return data;
        })
    },

    /**
     * 获取摄像机播放地址
     * @param store
     * @param obj
     * @returns {Promise<*>}
     */
    getCameraPlayUrl(store, obj) {
        return api.getCameraPlayUrl(obj).then((data) => {
            if (data.code !== 200) {
                if (data.code == 400) {
                    v.$message({
                        // message: '获取摄像机播放地址失败! [' + data.code + ']: ' + data.message,
                        message: data.message,
                        type: 'error'
                    });
                    return data;
                } else if (data.code == 406) {
                    v.$message({
                        // message: '获取摄像机播放地址失败! [' + data.code + ']: ' + data.message,
                        message: '高清切换失败',
                        type: 'error'
                    });
                }
                v.$message({
                    // message: '获取摄像机播放地址失败! [' + data.code + ']: ' + data.message,
                    message: data.message,
                    type: 'error'
                });
                return data;
            };
            return data;
        })
    },

    /**
     * 获取摄像机截图列表
     * @param store
     * @param obj
     * @returns {Promise<*>}
     */
    getCameraSnapShotsAction(store, obj) {
        return api.getCameraSnapShots(obj).then((data) => {
            if (data.code !== 200) {
                v.$message({
                    message: '获取摄像机截图列表失败! [' + data.code + ']: ' + data.message,
                    type: 'error'
                });
                return [];
            }
            store.commit('setCameraSnapShotsList', data.data);
            return data;
        })
    },

    /**
     * 根据地图等级等信息，查询地图摄像头信息
     * @param store
     * @param obj
     * @returns {Promise<T>}
     */
    getCameraListForPot(store, obj) {
        api.cancelPostCameraListForPot()
        return api.postCameraListForPot(obj).then((data) => {
            if (data.code !== 200) {
                v.$message({
                    message: '获取摄像机地图点位失败! [' + data.code + ']: ' + data.message,
                    type: 'error'
                });
                return Promise.reject();
            };

            return data;
        });
    },

    /**
     * 获取摄像机列表
     * @param store
     * @param obj
     * @returns {Promise<*>}
     */
    getCameraListForStatis(store, obj) {
        return api.getCameraListForStatis(obj).then((data) => {
            if (data.code !== 200) {
                v.$message({
                    message: '获取摄像机列表失败! [' + data.code + ']: ' + data.message,
                    type: 'error'
                });
                return Promise.reject();
            };
            store.commit("setCameraTotal", data.total);
            store.commit("setCameraPages", data.pages);
            store.commit("setCameraStatisticsList", data.data);
            return data;
        })
    },
    /**
     * 获取里程桩号列表
     * @param store
     * @param obj
     * @returns {Promise<*>}
     */
    getMileageList(store, obj) {
        return api.getMileageList(obj).then((data) => {
            if (data.code !== 200) {
                v.$message({
                    message: '获取摄像机列表失败! [' + data.code + ']: ' + data.message,
                    type: 'error'
                });
                return Promise.reject();
            };
            store.commit("setCameraTotal", data.total);
            store.commit("setCameraPages", data.pages);
            store.commit("setMileageList", data.data);
            return data;
        })
    },
    /**
     * 获取摄像机运行情况列表
     * @param store
     * @param obj
     * @returns {Promise<unknown>}
     */
    getCameraRunStatisticList(store, obj) {
        store.commit("setCameraTotal", 0);
        store.commit("setCameraPages", 1);
        return api.getCameraRunStatistic(obj).then((data) => {
            if (data.code !== 200) {
                v.$message({
                    message: '获取摄像机运行情况列表失败! [' + data.code + ']: ' + data.message,
                    type: 'error'
                });
                return Promise.reject();
            };
            store.commit("setCameraTotal", data.total);
            store.commit("setCameraPages", data.pages);
            store.commit("setCameraRunStatisticList", data.data);
            return data;
        })
    },

    /**
     * 摄像机运行情况统计表导出
     * @param store
     * @param obj
     */
    exportCameraRunStatistic(store, obj) {
        api.exportCameraRunStatistic(obj).then((data) => {
            var blob = new Blob([data], { type: 'application/vnd.ms-excel' });    // type这里表示xlsx类型
            var downloadElement = document.createElement('a');
            var href = window.URL.createObjectURL(blob);             // 创建下载的链接
            downloadElement.href = href;
            downloadElement.download = '摄像机运行情况统计表.xls';    // 下载后文件名
            document.body.appendChild(downloadElement);
            downloadElement.click();                                 // 点击下载
            document.body.removeChild(downloadElement);              // 下载完成移除元素
            window.URL.revokeObjectURL(href);                        // 释放掉blob对象
        }).catch((error) => {
            v.$message({
                message: '摄像机运行情况统计表导出失败! ',
                type: 'error'
            });
        })
    },

    /**
     * 获取摄像机故障情况列表
     * @param store
     * @param obj
     * @returns {Promise<unknown>}
     */
    getCameraFaultStatisticList(store, obj) {
        store.commit("setCameraTotal", 0);
        store.commit("setCameraPages", 1);
        return api.getCameraFaultStatistic(obj).then((data) => {
            //console.log("getDeviceStatistics",data);
            if (data.code !== 200) {
                v.$message({
                    message: '获取摄像机故障情况列表失败! [' + data.code + ']: ' + data.message,
                    type: 'error'
                });
                return Promise.reject();
            };
            store.commit("setCameraTotal", data.total);
            store.commit("setCameraPages", data.pages);
            store.commit("setCameraFaultStatisticList", data.data);
            return data;
        })
    },

    /**
     * 摄像机故障情况统计表导出
     * @param store
     * @param obj
     */
    exportCameraFaultStatistic(store, obj) {
        api.exportCameraFaultStatistic(obj).then((data) => {
            var blob = new Blob([data], { type: 'application/vnd.ms-excel' });    // type这里表示xlsx类型
            var downloadElement = document.createElement('a');
            var href = window.URL.createObjectURL(blob);             // 创建下载的链接
            downloadElement.href = href;
            downloadElement.download = '摄像机故障情况统计表.xls';    // 下载后文件名
            document.body.appendChild(downloadElement);
            downloadElement.click();                                 // 点击下载
            document.body.removeChild(downloadElement);              // 下载完成移除元素
            window.URL.revokeObjectURL(href);                        // 释放掉blob对象
        }).catch((error) => {
            v.$message({
                message: '摄像机故障情况统计表导出失败! ',
                type: 'error'
            });
        })
    },

    /**
     * 获取摄像机访问情况列表
     * @param store
     * @param obj
     * @returns {Promise<*>}
     */
    getCameraVisitStatisticList(store, obj) {
        store.commit("setCameraTotal", 0);
        store.commit("setCameraPages", 1);
        return api.getCameraVisitStatistic(obj).then((data) => {
            if (data.code !== 200) {
                v.$message({
                    message: '获取摄像机访问情况列表失败! [' + data.code + ']: ' + data.message,
                    type: 'error'
                });
                return Promise.reject();
            };
            store.commit("setCameraTotal", data.total);
            store.commit("setCameraPages", data.pages);
            store.commit("setCameraVisitStatisticList", data.data);
            return data;
        })
    },

    /**
     * 添加摄像机访问记录
     * @param store
     * @param obj
     * @returns {Promise<*>}
     */
    setCameraVisitRecords(store, obj) {
        return api.setCameraVisitRecords(obj).then((data) => {
            if (data.code !== 200) {
                v.$message({
                    message: '添加摄像机访问记录失败! [' + data.code + ']: ' + data.message,
                    type: 'error'
                });
                return Promise.reject();
            }
            return data;
        })
    },

    /**
     * 摄像机访问情况统计表导出
     * @param store
     * @param obj
     */
    exportCameraVisitStatistic(store, obj) {
        api.exportCameraVisitStatistic(obj).then((data) => {
            var blob = new Blob([data], { type: 'application/vnd.ms-excel' });    // type这里表示xlsx类型
            var downloadElement = document.createElement('a');
            var href = window.URL.createObjectURL(blob);             // 创建下载的链接
            downloadElement.href = href;
            downloadElement.download = '摄像机访问情况统计表.xls';    // 下载后文件名
            document.body.appendChild(downloadElement);
            downloadElement.click();                                // 点击下载
            document.body.removeChild(downloadElement);             // 下载完成移除元素
            window.URL.revokeObjectURL(href);                       // 释放掉blob对象
        }).catch((error) => {
            v.$message({
                message: '摄像机访问情况统计表导出失败! ',
                type: 'error'
            });
        })
    },

}

const mutations = {
    setCameraStatisticsList(state, nv) {
        state.deviceStatisticsList = nv;
    },
    setCameraStatisticsListByProvince(state, nv) {
        state.deviceStatisticsListByProvince = nv;
    },
    setCameraStatisticsListByCity(state, nv) {
        state.deviceStatisticsListByCity = nv;
    },
    setCameraStatisticsListByRoad(state, nv) {
        state.deviceStatisticsListByRoad = nv;
    },
    setCameraStatisticsListByOrg(state, nv) {
        state.deviceStatisticsListByOrg = nv;
    },

    setCameraStatisticsByRegionAll(state, nv) {
        state.deviceStatisticsByRegionAll = nv;
    },
    setCameraStatisticsByRoadAll(state, nv) {
        state.deviceStatisticsByRoadAll = nv;
    },
    setDirectionItemList(state, nv) {
        state.directionItemList = nv;
    },
    setCameraSnapShotsList(state, nv) {
        state.cameraSnapShotsList = nv;
    },
    setCameraTotal(state, nv) {
        state.cameraTotal = nv;
    },
    setCameraPages(state, nv) {
        state.cameraPages = nv;
    },
    setCameraRunStatisticList(state, nv) {
        state.cameraRunStatisticList = nv;
    },
    setCameraFaultStatisticList(state, nv) {
        state.cameraFaultStatisticList = nv;
    },
    setCameraVisitStatisticList(state, nv) {
        state.cameraVisitStatisticList = nv;
    },
    setCameraAbnormalList(state, nv) {
        state.cameraAbnormalList = nv;
    },
    setCameraAbnormalTotal(state, nv) {
        state.cameraAbnormalTotal = nv;
    },
    setMileageList(state, nv) {
        state.mileageList = nv;
    },


}


export default {
    state, mutations, actions
}
