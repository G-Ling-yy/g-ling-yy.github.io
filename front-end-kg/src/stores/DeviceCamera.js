import api from '../api';
import Vue from 'vue';


let v = new Vue();     // 新创建一个vue实例


const state = {
    cameraQueryInfo     : {},                           // 存放摄像机的查询条件
    cameraTotal         : null,                         // 总页数
    cameraPages         : null,                         // 总页码
    cameraList          : [],                           // 摄像机列表
    cameraPageSize      : 10,                           // 每页展示数量

    cameraAddFormVisible  : false,                      // 控制新增摄像机、编辑弹窗可见
    cameraDialogVisible   : false,                      // 控制删除弹窗可见
    addBatchCameraVisible : false,                      // 控制批量导入弹窗可见

    cameraDownErrorTitle  : "错误信息:",                 // 错误信息弹窗标题
    cameraDownErrorList   : [],                         // 错误信息数据
    cameraDownErrorVisible: false,                      // 错误信息弹窗可见
    temporaryCameraTotal  : null,                       // 总页数
    temporaryCameraPages  : null,                       // 总页码
    temporaryCameraList   : [],                         // 摄像机列表
}
var cameraCloud ={
    action:{
        1:'向左',2:'向右', 3:'向上', 4:'向下', 5:'变倍短', 6: '变倍长' ,7:'聚焦近', 8:'聚焦远', 9:'光圈小', 10: '光圈大', 11:'灯光关', 12:'灯光开'
    }
}
const actions = {
    /**
     * 云台控制接口
     * @returns {Promise<any> | * | Q.Promise<T> | Thenable<any> | PromiseLike<T> | Promise<T>}
     */
    cameraYtControlAction(store, obj){
        console.log(obj,"obj")
        let des={}
        for(var key in obj){
            if(cameraCloud[key]){
                des[key]=cameraCloud[key][obj[key]]
            }
        }
        console.log(des,"des")
        let instructions = {
            module: "摄像机管理",
            page: "播放弹窗",
            feature: "云台控制",
            description: `${obj.cameraNum},${des.action},步长${obj.step}`
        };
        console.log('store param: ',obj,instructions)
        return api.cameraYtControl(obj,instructions).then((data)=>{
            if(data.code !== 200){
                v.$message({
                    message: '调用云台控制失败! ['+data.code+']',
                    type: 'error'
                });
                return Promise.reject();
            }
            return data;
        });
    },

    /**
     * 获取摄像机列表
     * @param store
     * @param obj
     * @returns {Promise<*>}
     */
    getCameraList(store,obj){
        store.commit("setCameraQueryInfo",obj);
        return api.getCameraList(obj).then((data)=>{
            if(data.code!=200){
                v.$message({
                    message: '获取摄像机列表失败! ['+data.code+']: '+data.message,
                    type: 'error'
                });
                return Promise.reject();
            }
            store.commit("setCameraTotal",data.total);
            store.commit("setCameraPages",data.pages);
            store.commit("setCameraList",data.data||{});
        });
    },

    /**
     * 获取摄像机列表
     * @param store
     * @param obj
     * @returns {Promise<*>}
     */
    getTemporaryCameraList(store,obj){
        return api.getTemporaryCameraList(obj).then((data)=>{
            if(data.code!=200){
                v.$message({
                    message: '获取摄像机列表失败! ['+data.code+']: '+data.message,
                    type: 'error'
                });
                return Promise.reject();
            }
            store.commit("setTemporaryCameraTotal",data.total);
            store.commit("setTemporaryCameraPages",data.pages);
            store.commit("setTemporaryCameraList",data.data||{});
        })
    },

    /**
     * 摄像机审核失败
     * @param store
     * @param obj
     * @returns {Promise<*>}
     */
    comfirmCamera(store,obj){
        return api.comfirmCamera(obj).then((data)=>{
            if(data.code!=200){
                v.$message({
                    message: '摄像机审核失败! ['+data.code+']: '+data.message,
                    type: 'error'
                });
                return Promise.reject();
            }
            return data
        })
    },

    /**
     * 视频上云网关导出
     * @param store
     * @param obj
     */
    exportCameraList(store,obj){
        api.exportCameraList(obj).then((data)=>{
            var blob = new Blob([data], {type: 'application/vnd.ms-excel'});    // type这里表示xlsx类型
            var downloadElement = document.createElement('a');
            var href = window.URL.createObjectURL(blob);        // 创建下载的链接
            downloadElement.href = href;
            downloadElement.download = '摄像机信息表.xls';       // 下载后文件名
            document.body.appendChild(downloadElement);
            downloadElement.click();                            // 点击下载
            document.body.removeChild(downloadElement);         // 下载完成移除元素
            window.URL.revokeObjectURL(href);                   // 释放掉blob对象
        }).catch((error)=>{
            v.$message({
                message: '摄像机导出失败! ',
                type: 'error'
            });
        })
    },

    /**
     * 视频上云网关批量新增模板
     * @param store
     * @param obj
     */
    downCameraTemplate(store,obj){
        api.downCameraTemplate().then((data)=>{
            var blob = new Blob([data], {type: 'application/vnd.ms-excel'});    // type这里表示xlsx类型
            var downloadElement = document.createElement('a');
            var href = window.URL.createObjectURL(blob);        // 创建下载的链接
            downloadElement.href = href;
            downloadElement.download = '摄像机导入模板.xls';     // 下载后文件名
            document.body.appendChild(downloadElement);
            downloadElement.click();                            // 点击下载
            document.body.removeChild(downloadElement);         // 下载完成移除元素
            window.URL.revokeObjectURL(href);                   // 释放掉blob对象
        }).catch((error)=>{
            v.$message({
                message: '摄像机模板下载失败! ',
                type: 'error'
            });
        })
    },

    /**
     * 摄像机新增接口 单个
     * @param store
     * @param obj
     */
    addCamera(store,obj){
        api.addCamera(obj).then((data)=>{
            if(data.code!=200){
                v.$message({
                    message: '新增摄像机失败! ['+data.code+']: '+data.message,
                    type: 'error'
                });
                return Promise.reject();
            };
            v.$message({
                message: '新增摄像机成功',
                type: 'success'
            });
            store.commit("setCameraAddFormVisible",false);
            store.dispatch("getCameraList",store.state.cameraQueryInfo)
        })
    },

    /**
     * 摄像机编辑接口
     * @param store
     * @param obj
     */
    editCamera(store,obj){
        api.editCamera(obj).then((data)=>{
            if(data.code!=200){
                v.$message({
                    message: '修改摄像机失败! ['+data.code+']: '+data.message,
                    type: 'error'
                });
                return Promise.reject();
            }
            v.$message({
                message: '修改摄像机成功',
                type: 'success'
            });
            store.commit("setCameraAddFormVisible",false);
            store.dispatch("getCameraList",store.state.cameraQueryInfo)
        })
    },

    /**
     * 摄像机编辑接口
     * @param store
     * @param obj
     * @returns {Promise<*>}
     */
    editCameraSingle(store,obj){
        return api.editCamera(obj).then((data)=>{
            if(data.code !== 200){
                v.$message({
                    message: '修改摄像机失败! ['+data.code+']: '+data.message,
                    type: 'error'
                });
                return Promise.reject();
            };
            return data;
        })
    },

    /**
     * 摄像机删除
     * @param store
     * @param obj
     */
    deleteCamera(store,obj){
        api.deleteCamera(obj).then((data)=>{
            if(data.code!=200){
                v.$message({
                    message: '删除摄像机失败！['+data.code+']: '+data.message,
                    type: 'error'
                });
                return Promise.reject();
            }
            v.$message({
                message: '删除摄像机成功',
                type: 'success'
            });
            store.commit("setCameraDialogVisible",false);
            store.dispatch("getCameraList",store.state.cameraQueryInfo)
        })
    },

    /**
     * 停止播放摄像机
     * @param store
     * @param obj
     */
    checkPlayStatus(store,obj){
        api.updateOpStatus(obj).then((data)=>{
            if(data.code!=200){
                v.$message({
                    message: '停止播放摄像机失败! ['+data.code+']: '+data.message,
                    type: 'error'
                });
                return Promise.reject();
            }
            v.$message({
                message: '停止播放摄像机成功',
                type: 'success'
            });
            store.commit("setCameraDialogVisible",false);
            store.dispatch("getCameraList",store.state.cameraQueryInfo)
        })
    },

    /**
     * 更新摄像机状态
     * @param store
     * @param obj
     */
    checkStatus(store,obj){
        let msg      = obj.checkMsg,
            itemList = obj.data;

        api.updateOpStatus(obj.data).then((data)=>{
            if(data.code !== 2000){
                v.$message({
                    message: msg+'摄像机，'+data.message+'! ['+data.code+']: '+data.message,
                    type: 'error'
                });
                return Promise.reject();
            };
            v.$message({
                message: msg+'摄像机，'+data.message,//msg+'播放摄像机成功',
                type: 'success'
            });
            let cameraList = state.cameraList,
                olen = cameraList.length,
                nlen = itemList.length;
            for(let i=0;i<nlen;i++){
                for(let j=0;j<olen;j++){
                    if(parseInt(cameraList[j].cameraId) === parseInt(itemList[i].cameraId)){
                        cameraList[j].openStatus = itemList[i].openStatus;
                        cameraList[j].playStatus = itemList[i].playStatus;
                        break;
                    }
                }
            };

            store.commit("setCameraItemStatus",cameraList);
        });
    },

    /**
     * 更新视频限制状态
     * @param store
     * @param obj
     * @returns {Promise<*>}
     */
    updateStreamStatus(store,obj){
        let msg = obj.checkMsg,
            itemList = obj.data.cameraIds;

        return api.updateStreamStatus(obj.data).then((res)=>{
            if(res.code !== 200){
                v.$message({
                    message: msg+'摄像机'+res.message+'! ['+res.code+']: '+res.message,
                    type: 'error'
                });
                return Promise.reject();
            }
            v.$message({
                message: msg+'摄像机'+res.message,//msg+'播放摄像机成功',
                type: 'success'
            });
            let cameraList = state.cameraList,
                olen = cameraList.length,
                nlen = itemList.length;
            for(let i=0;i<nlen;i++){
                for(let j=0;j<olen;j++){
                    if(parseInt(cameraList[j].cameraId) === parseInt(itemList[i])){
                        cameraList[j].streamStatus = obj.data.status + '';
                        break;
                    }
                }
            };
            store.commit("setCameraItemStatus",cameraList);
        })
    }

}

const mutations = {
    setCameraQueryInfo(state,nv){
        state.cameraQueryInfo = nv;
    },
    setCameraTotal(state,nv){
        state.cameraTotal = nv;
    },
    setCameraPages(state,nv){
        state.cameraPages = nv;
    },
    setCameraList(state,nv){
        state.cameraList = nv;
    },
    setCameraPageSize(state,nv){
        state.cameraPageSize = nv;
    },
    setCameraAddFormVisible(state,nv){
        state.cameraAddFormVisible = nv;
    },
    setCameraDialogVisible(state,nv){
        state.cameraDialogVisible = nv;
    },
    setAddBatchCameraVisible(state,nv){
        state.addBatchCameraVisible = nv;
    },
    setCameraItemStatus(state,nv){
        state.cameraList = nv;
    },
    setCameraDownErrorTitle(state,nv){
        state.cameraDownErrorTitle = nv;
    },
    setCameraDownErrorList(state,nv){
        state.cameraDownErrorList = nv;
    },
    setCameraDownErrorVisible(state,nv){
        state.cameraDownErrorVisible = nv;
    },

    setTemporaryCameraTotal(state,nv){
        state.temporaryCameraTotal = nv;
    },
    setTemporaryCameraPages(state,nv){
        state.temporaryCameraPages = nv;
    },
    setTemporaryCameraList(state,nv){
        state.temporaryCameraList = nv;
    },


}


export default {
    state, mutations,actions
}
