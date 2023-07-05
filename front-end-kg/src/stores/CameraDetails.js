import api from '../api';
import Vue from 'vue';

let v = new Vue();

const state = {
    cameraDetailsList   : [],
    cameraDetailsTotal  : null,                     // 总页数
    cameraDetailsPages  : null,                     // 总页码
    cameraDetailsSize   : 10,                       // 每页数量

    roadStatus          : [],                       // 新增路段选项
    typeStatus          : [],                       // 新增所属类别选项
    cameraType          : [],                       // 新增摄像机类别选项
    cityStatus          : [],                       // 新增城市选项
    directionStatus     : [],                       // 新增方向选项
    platformStatus      : [],                       // 新增平台类型选项
    accessModeList      : [],                       // 对接平台类型
    editionStatus       : [],                       // 新增版本型号选项
    equipmentStatus     : [],                       // 新增设备类型选项
    basicData           : [],                       // 基础信息数据
    dockingData         : [],                       // 对接信息数据

};

const actions = {

    /**
     * 获取摄像机列表
     * @param store
     * @param obj
     * @returns {*}
     */
    getVideoCameraData(store,obj){
        return api.getVideoCameraData(obj).then((data)=>{
            if(data.code!==200){
                return Promise.reject();
            }
            store.commit("setcameraDetailsTotal",Number(data.total));
            store.commit("setcameraDetailsPages",data.pages);
            store.commit("setcameraDetailsList",data.data||[]);
        }).catch((error)=>{
            v.$message({
                message: '获取摄像机列表失败',
                type: 'error'
            });
        })
    },

    /**
     * 获取下拉列表基础数据
     * @param store
     * @param obj
     * @returns {*}
     */
    getSelectData(store,obj) {
        let type = {
            CLASSIFY: '所属类别', DERECTION: '方向', CAMERA_TYPE: '摄像机类型',
            PLAT_TYPE: '平台类型', PLAT_VERSION: '平台版本型号',DEVICE_TYPE: '设备类型'
        }
        return api.getSelectData(obj).then((data)=>{
            // console.log('返回数据', data)
            if(data.code!==200){
                return Promise.reject();
            }
            return data
        }).catch((error)=>{
            v.$message({
                message: `获取${type[obj]}失败`,
                type: 'error'
            });
        })
    },

    /**
     * 获取路段单位列表
     * @param store
     * @param obj
     * @returns {*}
     */
    getRoadCompany(store,obj) {
        return api.getRoadCompany(obj).then((data)=>{
            if(data.code!==200){
                return Promise.reject();
            }
            return data
        }).catch((error)=>{
            v.$message({
                message: '获取路段单位失败',
                type: 'error'
            });
        })
    },

    /**
     * 获取城市列表
     * @param store
     * @param obj
     * @returns {*}
     */
    getCities(store,obj) {
        return api.getCities(obj).then((data)=>{
            if(data.code!==200){
                return Promise.reject();
            }
            return data
        }).catch((error)=>{
            v.$message({
                message: '获取城市失败',
                type: 'error'
            });
        })
    },

    /**
     * 新增单条摄像机
     * @param store
     * @param obj
     * @returns {*}
     */
    addConfigCam(store,obj) {
        return api.addConfigCam(obj).then((data)=>{
            if(data.code!==200){
                return Promise.reject();
            }
            return data
        }).catch((error)=>{
            v.$message({
                message: '新增失败',
                type: 'error'
            });
        })
    },

    /**
     * 根据摄像机Id获取摄像机详细信息  （未使用）
     * @param store
     * @param obj
     * @returns {*}
     */
    findById(store,obj) {
        return api.findById(obj).then((data)=>{
            if(data.code!==200){
                return Promise.reject();
            }
            return data
        }).catch((error)=>{
            v.$message({
                message: '获取摄像机信息失败',
                type: 'error'
            });
        })
    },

    /**
     * 删除摄像机接口
     * @param store
     * @param obj
     * @returns {*}
     */
    delCamerta(store,obj) {
        return api.delCamerta(obj).then((data)=>{
            if(data.code!==200){
                return Promise.reject();
            }
            return data
        }).catch((error)=>{
            v.$message({
                message: '删除失败',
                type: 'error'
            });
        })
    },

    /**
     * 下载摄像机批量上传模板
     * @param store
     * @param obj
     * @returns {*}
     */
    batchDownload(store,obj) {
        return api.batchDownload(obj.dataUrl).then((data)=>{
            var blob = new Blob([data], {type: 'application/vnd.ms-excel'}); //type这里表示xlsx类型
            var downloadElement = document.createElement('a');
            var href = window.URL.createObjectURL(blob); //创建下载的链接

            downloadElement.href = href;
            downloadElement.download = obj.fileName; //下载后文件名
            document.body.appendChild(downloadElement);
            downloadElement.click(); //点击下载
            document.body.removeChild(downloadElement); //下载完成移除元素
            window.URL.revokeObjectURL(href); //释放掉blob对象
        }).catch((error)=>{
            v.$message({
                message: '下载失败',
                type: 'error'
            });
        })
    },

    /**
     * 摄像机配置下发
     * @returns {*}
     */
    addVideoSendOut(store,obj){
        return api.addVideoSendOut(obj).then((data)=>{
            if(data.code!==200){
                return Promise.reject();
            };

            v.$message({
                message: '摄像机配置下发成功',
                type: 'success'
            });
            return true;
        }).catch((error)=>{
            v.$message({
                message: '摄像机配置下发失败',
                type: 'error'
            });
        });
    },

    /**
     * 摄像机配置删除接口
     * @returns {*}
     */
    delVideoSend(store,obj){
        return api.delVideoSend(obj).then((data)=>{
            if(data.code!==200){
                return Promise.reject();
            };

            v.$message({
                message: '摄像机删除成功',
                type: 'success'
            });
            return true;
        }).catch((error)=>{
            v.$message({
                message: '摄像机删除失败',
                type: 'error'
            });
        });
    },

    /**
     * 根据单位code获取路段列表
     * @param store
     * @param obj
     * @returns {*}
     */
    getRoadList(store,obj) {
        return api.getRoadCompany(obj).then((data)=>{
            if(data.code!==200){
                return Promise.reject();
            };
            store.commit('setroadStatus',data.data)
        }).catch((error)=>{
            v.$message({
                message: '获取路段单位失败',
                type: 'error'
            });
        })
    },

};

const mutations = {
    setcameraDetailsTotal(state,nv){
        state.cameraDetailsTotal = nv;
    },
    setcameraDetailsPages(state,nv){
        state.cameraDetailsPages = nv;
    },
    setcameraDetailsList(state,nv){
        state.cameraDetailsList = nv;
    },
    setroadStatus(state,nv){
        state.roadStatus = nv;
    },
    settypeStatus(state,nv){
        state.typeStatus = nv;
    },
    setbasicData(state,nv){
        state.basicData = nv;
    },
    setdockingData(state,nv){
        state.dockingData = nv;
    },
    setcameraDetailsSize(state,nv){
        state.cameraDetailsSize = nv;
    },

};


export default {
    state, mutations,actions
};
